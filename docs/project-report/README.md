# 《记忆之处》项目报告

正文源文件是仓库根目录的 `PROJECT_REPORT.md`。阅读版、PDF与配图在 `dist/report/`，服务启动后访问 http://localhost:4174/report/ 。报告基于 `v0.6.0-daylight-detail` 的功能和实际实验记录。

生成阅读版需要 Python Markdown、Playwright 及 Chromium：

```sh
.venv/bin/python docs/project-report/render_report.py
```

需要重新拍摄正式章节时，先启动本地服务，再运行：

```sh
.venv/bin/python docs/project-report/capture_figures.py
```

截图脚本使用系统默认地点、空记忆库，以及第三章的隔离演示记录；拦截全部写请求，不读出私人照片，不修改真实标签，不提交生成。第三章截图在正文中明确标注演示数据，不能作为“实验会进入个人记忆池”的证明。

其他配图来自仓库中的非私人实验、项目作者提供的实验截图和本地生成样品检查。原生Mesh、生成概念图、实际AHOLO结果分别注明来源。`facts.json` 只记录报告基线与非私人World实验的公开字段，不包含密钥和供应商签名链接。

报告的图像、表格与文字应共同维护；重新生成后检查PDF分页、图注、链接与中文字体。


## Word、Markdown与字体兼容版

`dist/report/` 另提供同名 `.docx`、`.md` 及 `-兼容版.pdf`。Word保留可编辑正文、表格、链接与12张嵌入图片，并指定简体中文语言和字体；Markdown使用UTF-8，图片路径相对同目录的`assets/`。

```sh
.venv/bin/python docs/project-report/export_editable.py
.venv/bin/python docs/project-report/export_compatible_pdf.py
```

Word导出另需python-docx、BeautifulSoup与Pillow；兼容PDF导出另需fontTools与本机Noto CJK SC字体。旧PDF使用Type 3中文字体；兼容版从已安装的简体中文Noto字体制作临时、重命名的TrueType子集，保留版权及许可信息后嵌入PDF。原来的简体中文字形设计不变，兼容版实际字体类型为CID TrueType。未修改系统字体，也未覆盖原PDF。

本机LibreOffice没有安装Writer组件，无法用于Word版的页面预览；Word压缩包、XML、正文、表格和嵌入图片已用python-docx重新读取验证。兼容PDF由浏览器直接导出，并单独检查字体类型、文本与分页。
