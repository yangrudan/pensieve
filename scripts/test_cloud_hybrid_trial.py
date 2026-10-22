"""Offline safety checks: no credentials, uploads, or cloud sessions."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch

spec = importlib.util.spec_from_file_location('trial', Path(__file__).with_name('cloud_hybrid_trial.py'))
trial = importlib.util.module_from_spec(spec)
spec.loader.exec_module(trial)


class TrialChecks(unittest.TestCase):
    def test_provider_envelopes(self):
        self.assertEqual(trial.unwrap({'c': '0', 'd': {'success': True, 'data': 123}}), 123)
        self.assertEqual(trial.unwrap({'success': True, 'data': {'taskId': 456}}), {'taskId': 456})
        with self.assertRaises(RuntimeError):
            trial.unwrap({'c': '-1', 'm': 'system error', 'd': None})

    def test_uncertain_submission_stops_before_upload(self):
        client, asset = Mock(), Mock()
        with self.assertRaisesRegex(RuntimeError, 'explicit approval'):
            trial.prepare_assets(client, asset, {'assets': {'mesh': {'submitting': True}}})
        asset.upload_file.assert_not_called()
        client.gateway_request.assert_not_called()

    def test_unexpected_receipt_is_saved_without_retry(self):
        client = Mock(api_key='fake-key')
        client.gateway_request.return_value = {'unexpected': 'receipt'}
        asset = Mock()
        asset.upload_file.return_value = SimpleNamespace(url='https://example.invalid/asset')
        state = {'assets': {}}
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            with patch.object(trial, 'FOLDER', root), patch.object(trial, 'STATE_FILE', root/'state.json'):
                with self.assertRaisesRegex(RuntimeError, 'no usable task ID'):
                    trial.prepare_assets(client, asset, state)
                self.assertIn('unexpected', (root/'state.json').read_text())
        self.assertTrue(state['assets']['mesh']['submitting'])
        self.assertEqual(client.gateway_request.call_count, 1)

    def test_second_stream_is_blocked(self):
        client = Mock()
        with self.assertRaisesRegex(RuntimeError, 'no automatic second session'):
            trial.run_stream(client, {'assets_ready': True, 'session_create_attempts': 1})
        client.gateway_request.assert_not_called()

    def test_status_query_never_creates_assets(self):
        client = Mock(api_key='fake-key')
        client.gateway_request.return_value = {'c': '0', 'd': {'status': 1, 'taskId': 123}}
        state = {'assets': {'mesh': {'mesh_id': 'mesh123'}, 'gs': {'task_id': 123}}}
        with patch.object(trial, 'save'):
            self.assertFalse(trial.query_existing_assets(client, state))
        self.assertEqual(client.gateway_request.call_count, 1)
        self.assertEqual(client.gateway_request.call_args.kwargs['method'], 'GET')
        self.assertFalse(state['assets_ready'])

    def test_coordinate_conversion_and_payloads(self):
        camera = [1,0,0,0, 0,1,0,0, 0,0,1,0, 2,3,4,1]
        self.assertEqual(trial.camera_rows(camera)[3], [2000,-4000,3000,1])
        state = {'assets': {'mesh': {'mesh_id': 'mesh123'}, 'gs': {'mesh_id': 'gs1234'}}}
        scene = trial.scene_text(state, {'camera': camera})
        self.assertIn('@manycore:/mesh/mesh123@</mesh>', scene)
        self.assertIn('@manycore:/mesh/gs1234@</GaussianSplatData>', scene)
        self.assertIn('float fStop = 0', scene)
        with self.assertRaises(ValueError):
            trial.matrix([[float('nan')]*4]*4)

    def test_redaction(self):
        value = trial.redact({'token': 'hidden', 'detail': 'fake-key https://example.invalid/signed'}, 'fake-key')
        self.assertNotIn('token', value)
        self.assertEqual(value['detail'], '[REDACTED] [URL]')

    def test_frame_error_closes_socket_before_releasing_session(self):
        events = []
        state = {'assets_ready': True, 'assets': {'mesh': {'mesh_id': 'mesh123'}, 'gs': {'mesh_id': 'gs1234'}}}
        client, ws = Mock(api_key='fake-key'), Mock()
        ws.close.side_effect = lambda: events.append('socket-close')
        def gateway(**request):
            if request['method'] == 'DELETE':
                events.append('session-delete')
                return {'sessionId': 'session123', 'closed': True}
            if 'requestId' in request['body']:
                return {'operationId': 'session123', 'done': False}
            return {'result': {'status': 'ACTIVE', 'host': 'example.invalid', 'nodeId': 'node', 'streamId': 'stream', 'token': 'fake-token'}}
        client.gateway_request.side_effect = gateway
        camera = [1,0,0,0, 0,1,0,0, 0,0,1,0, 2,3,4,1]
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root/'geometry.json').write_text(json.dumps({'views': [{'name': 'overview', 'camera': camera}]}))
            with patch.object(trial, 'FOLDER', root), patch.object(trial, 'STATE_FILE', root/'state.json'), patch.object(trial.threading, 'Timer'), patch('websockets.sync.client.connect', return_value=ws), patch.object(trial, 'capture', side_effect=RuntimeError('bad frame')):
                with self.assertRaisesRegex(RuntimeError, 'bad frame'):
                    trial.run_stream(client, state)
            self.assertNotIn('fake-token', (root/'state.json').read_text())
        self.assertEqual(events, ['socket-close', 'session-delete'])
        self.assertTrue(state['cleanup']['confirmed'])


if __name__ == '__main__':
    unittest.main()
