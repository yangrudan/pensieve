

declare const AfterScenePassEvent: EventType<PassNode>;



declare function afterWASMInit(): void;



/**
 * The most outside wrapper of the whole engine, contains the version information and could create
 * a viewer
 * @public
 */
declare class Application {
    static version: string;
    private static instance;
    private viewers;
    constructor();
    /**
     * static function to get the app instance, to reduce duplication.
     */
    static getInstance(): Application;
    /**
     * create a viewer. see {@link Viewer| Viewer }
     * @param {string} name the name of the viewer.
     * @param {HTMLElement} container source data.
     * @param {EngineInitializeConfig} engineInitConfig configuration of the viewer such as if turn the shadow on.
     * engineInitConfig
     */
    createViewer(name: string, container: HTMLElement, engineInitConfig: EngineInitializeConfig): Viewer;
    /**
     * get viewer object by ID.
     */
    getViewer(name: string): Viewer;
    getViewers(): Viewer[];
    rebuildWorld(config?: WorldRebuildConfig): Promise<void>;
    private logVersion;
    private onViewerUninitialise;
}



/**
 * This class is used to draw an arc-curve that is a part of ellipse curve.
 */
declare class ArcCurve2D extends EllipseCurve2D {
    isArcCurve2D: boolean;
    /**
     * @param { number } aX The X center of the ellipse. Default is 0.
     * @param { number } aY The Y center of the ellipse. Default is 0.
     * @param { number } aRadius The radius of this arc-curve. Default is 1.
     * @param { number } aStartAngle The start angle of the curve in radians starting from the positive X axis. Default is 0.
     * @param { number } aEndAngle The end angle of the curve in radians starting from the positive X axis. Default is 2 PI.
     * @param { number } aClockwise Whether the ellipse is drawn clockwise. Default is false.
     */
    constructor(aX?: number, aY?: number, aRadius?: number, aStartAngle?: number, aEndAngle?: number, aClockwise?: boolean);
    className(): string;
    getPoints(divisions?: number): Vector2[];
    clone(): ArcCurve2D;
}



/**
 * Shader block containing shared Blinn-Phong area-light helpers.
 */
declare const AreaBlinnPhong: ShaderBlock;



declare class AvgLuminanceMaterial extends PassQuadMaterialBase {
    tDiffuse: Texture;
    clampedLuminanceThreshold: number;
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
    configBlend(): void;
}



/**
 * An axis object to visualize the 3 axes in a simple way.
 * The X axis is red.
 * The Y axis is green.
 * The Z axis is blue.
 */
declare class AxisHelper extends LineSegments<LineBasicMaterial> {
    /**
     * Initialize this object.
     * @param size (optional) size of the lines representing the axes. Default is 1.
     */
    constructor(size?: number);
}



/**
 * Union of supported viewer background configurations.
 * @deprecated
 */
declare type Background = SolidColorBackground | BasicBackground | SkyBackground | GradientBackground | EnvMapBackground;



declare function beforeAPIRegister(): void;



declare const BeforeScenePassEvent: EventType<PassNode>;



declare class BlurPassMaterial extends PassQuadMaterialBase {
    tDiffuse: Texture;
    weights: number[];
    texelSize: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    direction: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    kernelSize: number;
    private kernelRadius;
    className(): string;
    get blurKernelRadius(): number;
    generateShaderKey(r: ShaderComponentRegistry): string;
    set blurKernelRadius(value: number);
    setTexelSize(width: number, height: number): void;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(p: WGLProgram): void;
}



declare function box(parameters: Partial<BoxShapeParameter>): BufferGeometry;



/**
 * @param { number } width That is the length of the edges parallel to the X axis. Default is 1.
 * @param { number } height That is the length of the edges parallel to the Y axis. Default is 1.
 * @param { number } depth That is the length of the edges parallel to the Z axis. Default is 1.
 * @param { number } widthSegments Number of segmented rectangular faces along the width of the sides. Default is 1.
 * @param { number } heightSegments Number of segmented rectangular faces along the height of the sides. Default is 1.
 * @param { number } depthSegments Number of segmented rectangular faces along the depth of the sides. Default is 1.
 */
declare interface BoxShapeParameter {
    width: number;
    height: number;
    depth: number;
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
}



declare interface BufferGeometryMergeInfo {
    geometry: BufferGeometry;
    worldMatrix: Matrix4;
}



declare const BVHBuilder: BVHBuilderImpl;



declare interface BVHBuilderData {
    boxes: Float32Array;
    strategyType: BVHStrategyType;
    strategySize?: number;
    maxTreeDepth?: number;
    binSize?: number;
}



declare class BVHBuilderImpl {
    isInitd: boolean;
    private _build?;
    private _buildRaw?;
    init(build: (source: BVHBuilderData) => Promise<BVH_2>, buildRaw: (source: BVHBuilderData) => Promise<BVHRaw>): void;
    build(source: BVHBuilderData): Promise<BVH_2>;
    buildRaw(source: BVHBuilderData): Promise<BVHRaw>;
}



declare interface BVHRaw {
    nodes: Float32Array;
    nodeCounts: number;
    indices: Uint32Array;
    indicesCounts: number;
}



declare enum BVHStrategyType {
    Scene = 0,
    Mesh = 1
}



/**
 * Abstract base class for cameras. This class should always be inherited when you build a new camera,
 * such as perspective and orthographic camera.
 * The abstracted function need to respectively implement for different types of cameras.
 */
declare abstract class Camera extends Object3D {
    enableFrustumCulling: boolean;
    enableDetailCulling: boolean;
    /**
     * Check the type whether it belongs to Camera3D.
     * This value should not be changed by user.
     */
    isCamera3D: boolean;
    /**
     * The type of this Object3D.
     */
    type: string;
    /**
     * This is the inverse of matrixWorld. MatrixWorld contains the Matrix which has the world transform of the Camera3D.
     */
    matrixWorldInverse: Matrix4;
    worldRotation: Matrix4;
    worldPosition: Vector3;
    /**
     * This matrix decides the method of projection such as perspective and orthographic.
     */
    projectionMatrix: Matrix4;
    /**
     * The inverse matrix of {@link projectionMatrix| projectionMatrix }.
     */
    projectionMatrixInverse: Matrix4;
    /**
     * This is used to adapt the bounds of camera to canvas.
     */
    bounds: Vector4;
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Make the engine to render the scene again.
     */
    notifyCameraChanged(): void;
    /**
     * Copy the data to this camera instance from source.
     * This method need override in derived classes to copy extended data.
     * @param {Camera3D} source the data source.
     * @param {boolean} recursive if true, descendants of the object are also cloned. Default is true.
     */
    copy(source: Camera, recursive?: boolean): this;
    /**
     * Set the value of camera's faced direction to given vector.
     * @param {Vector3} target this vector representing the world space direction in which the camera is looking.
     */
    getWorldDirection(target: Vector3): Vector3;
    /**
     * Update the camera's {@link Object3D.matrixWorld| matrixWorld } and {@link matrixWorldInverse| matrixWorldInverse }.
     * @param {boolean} updateParents if true, it also updates all the parents.
     * @param {boolean} updateChildren if true, it also updates all the children.
     * @param {boolean} force Whether or not force to updates the matrix.
     */
    updateWorldMatrix(updateParents: boolean, updateChildren: boolean, force?: boolean): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Update the projection matrix base on different type of camera. And a modification also can be applied on the projection.
     */
    abstract updateProjectionMatrix(jitter?: {
        offset: Vector2;
        canvas_size: Vector2;
    }): void;
    private _jitter;
    updateJitter(jitter: ReadonlyVector2): void;
    getJitter(): Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    updatePrev(): void;
    /**
     * how many screen pixels rendered in 1 distance from camera
     */
    abstract getPixelsOfDistOne(): number;
    /**
     * Calculate how many screen pixel match one world unit at given distance.
     * @param {number} distance the distance from camera to object.
     * @param {number} viewHeight the hight of view window.
     */
    abstract pixelsPerUnit(distance: number, viewHeight: number): number;
    /**
     * return a function that compute pixelsPerUnit
     */
    pixelsPerUnitCreator(viewHeight: number): (distance: number) => number;
    /**
     * Calculate a scale value that keep one object's screen unit size match it's world unit size
     * @param {number} distance the distance from camera to object.
     * @param {number} viewHeight the hight of view window.
     */
    getViewIndependentScaleRatio(distance: number, viewHeight: number): number;
    /**
     * Set the origin and direction for ray.
     * @param {Ray} ray the calculate result will be set to this.
     * @param {Vector2} coords the position of window where the ray through out.
     */
    abstract castRay(ray: Ray, coords: Vector2): void;
}



/**
 * WGLCapabilities indicates all capabilities in WebGl/WebGL2 context. It is used to prevent error from data over limitation.
 * It will be set up when the canvas or context is built and its values will never change. Each context only has one instance.
 */
declare class Capabilities {
    /**
     * Whether or not enable WebGL2 backend.
     */
    static IS_WEBGL2: boolean;
    /**
     * Whether or not enable WEBGPU backend.
     */
    static get IS_WEBGPU(): boolean;
    /**
     * Whether or not using advanced graphics backends. such as webgl2, webgpu.
     */
    static get IS_ADVANCED_BACKEND(): boolean;
    /**
     * Shader precision. Can be "highp", "mediump" or "lowp".
     */
    static PRECISION: string;
    /**
     * Get the maximum precision by {@link _IS_SUPPORT_HIGH_FLOAT| high} and {@link _IS_SUPPORT_MEDIUM_FLOAT| medium}.
     */
    static MAX_PRECISION: string;
    /**
     * Maximum of the number of texture supported by browser.
     * @deprecated
     */
    static MAX_COMBINED_TEXTURE_IMAGE_UNITS: number;
    /**
     * Maximum of the number of texture supported by browser.
     * @deprecated
     */
    static MAX_TEXTURES: number;
    /**
     * @deprecated
     */
    static MAX_VERTEX_TEXTURES: number;
    /**
     * The limitation of texture's pixel count.
     * @deprecated
     */
    static MAX_TEXTURE_SIZE: number;
    /**
     * The limitation of cube map's pixel count.
     * @deprecated
     */
    static MAX_CUBEMAP_SIZE: number;
    /**
     * The max number of vertex attributes supported by browser.
     * @deprecated
     */
    static MAX_ATTRIBUTES: number;
    static MAX_VERTEX_UNIFORMS: number;
    /**
     * @deprecated
     */
    static MAX_VARYINGS: number;
    static MAX_FRAGMENT_UNIFORMS: number;
    static IS_SUPPORT_VERTEX_TEXTURES: boolean;
    static IS_SUPPORT_FLOAT_FRAGMENT_TEXTURES: boolean;
    static IS_SUPPORT_FLOAT_VERTEX_TEXTURES: boolean;
    static IS_SUPPORT_VAO: boolean;
    static IS_SUPPORT_INSTANCE: boolean;
    static MAX_SAMPLES: number;
    static MAX_ANISOTROPY: number;
    /**
     * High precision float is or not supported by WebGLContext.
     */
    static _IS_SUPPORT_HIGH_FLOAT: boolean;
    /**
     * Medium precision float is or not supported by WebGLContext.
     */
    static _IS_SUPPORT_MEDIUM_FLOAT: boolean;
    static IS_SUPPORT_DEPTH_TEXTURE: boolean;
    static IS_SUPPORT_SHADER_TEXTURE_LOD: boolean;
    static SUPPORTED_COMPRESS_TEXTURE_TYPES: CompressTextureType[];
    static SUPPORTED_COMPRESS_TEXTURE_FORMATS: Array<WebGLPixelFormat | CompressedPixelFormat>;
    static isCompressTextureFormatSupport(glFormat: WebGLPixelFormat | CompressedPixelFormat): boolean;
    static getMaxPrecision(precision: string): string;
}



/**
 * The Catmull-Rom curve object is used to help drawing curves in 3D space.
 */
declare class CatmullRomCurve3D extends Curve<Vector3> {
    /**
     * The control points used to decide the curve.
     */
    points: Vector3[];
    /**
     * If includes the end point.
     */
    closed: boolean;
    /**
     * Only two types of curves can be chosen, 'centripetal' and 'chordal'.
     */
    curveType: string;
    /**
     * Control the distance between each points.
     */
    tension: number;
    /**
     * Check the type whether it belongs to CatmullRomCurve3D.
     * This value should not be changed by user.
     */
    isCatmullRomCurve3: boolean;
    constructor(points?: Vector3[], closed?: boolean, curveType?: string, tension?: number);
    /**
     * Return the position on the curve at t.
     */
    getPoint(t: number, optionalTarget?: Vector3): Vector3;
    clone(): CatmullRomCurve3D;
    copy(source: CatmullRomCurve3D): this;
    toJSON(): any;
    fromJSON(json: any): this;
}



/**
 * The Circle object is used to help draw graphics.
 */
declare class Circle extends Shape {
    /**
     * The X coordinate of the center of this circle.
     */
    x: number;
    /**
     * The Y coordinate of the center of this circle.
     */
    y: number;
    /**
     * The radius of the circle.
     */
    radius: number;
    /**
     * The type of the object, mainly used to avoid 'instanceof' checks.
     */
    readonly type = "Circle";
    /**
     * The number of segments in the circle.
     */
    divisions?: number;
    /**
     * @param x The X coordinate of the center of this circle.
     * @param y The Y coordinate of the center of this circle.
     * @param radius Radius The radius of the circle.
     * @param divisions The number of segments in the circle.
     */
    constructor(x?: number, y?: number, radius?: number, divisions?: number);
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Creates a clone of this Circle instance.
     */
    clone(): Circle;
    /**
     * Add this circle to drawing.
     */
    draw(): void;
    /**
     * Checks whether the x and y coordinates given are contained within this circle.
     * @param x The X coordinate of the point to test.
     * @param y The Y coordinate of the point to test.
     * @return Whether the x/y coordinates are within this circle.
     */
    contains(x: number, y: number): boolean;
    /**
     * Returns the framing rectangle of the circle as a Rectangle object.
     */
    getBounds(bounds?: Box2): Box2;
}



declare function circle(param: Partial<CircleShapeParameter>): BufferGeometry;



declare interface CircleShapeParameter {
    radius: number;
    segments: number;
    thetaStart: number;
    thetaLength: number;
}



/**
 * Color transfer functions.
 */
declare enum ColorTransfer {
    Linear = 0,// do nothing.
    SrgbToLinear = 1,
    LinearToSrgb = 2
}



/**
 * Environment-map combine operation for IBL shading.
 */
declare enum CombineOperation {
    Multiply = 0,
    Mix = 1,
    Add = 2
}



/**
 * compressed format of pixel data.
 */
declare enum CompressedPixelFormat {
    /**
     * @deprecated DXT1 3 channel format not supported. use `RGBA_S3TC_DXT1_Format` instead
     */
    RGB_S3TC_DXT1_Format = 33776,
    /**
     * @deprecated use RGBA_BC1_UNORM_Format
     */
    RGBA_S3TC_DXT1_Format = 33777,
    /**
     * @deprecated use RGBA_BC2_UNORM_Format
     */
    RGBA_S3TC_DXT3_Format = 33778,
    /**
     * @deprecated use RGBA_BC3_UNORM_Format
     */
    RGBA_S3TC_DXT5_Format = 33779,
    /**
     * @deprecated PVRTC not supported.
     */
    RGB_PVRTC_4BPPV1_Format = 35840,
    /**
     * @deprecated PVRTC not supported.
     */
    RGB_PVRTC_2BPPV1_Format = 35841,
    /**
     * @deprecated PVRTC not supported.
     */
    RGBA_PVRTC_4BPPV1_Format = 35842,
    /**
     * @deprecated PVRTC not supported.
     */
    RGBA_PVRTC_2BPPV1_Format = 35843,
    /**
     * @deprecated ETC1 not supported.
     */
    RGB_ETC1_Format = 36196,
    /**
     * @deprecated use RGBA_ASTC_4x4_UNORM_Format
     */
    RGBA_ASTC_4x4_Format = 37808,
    /**
     * @deprecated use RGBA_ASTC_4x4_UNORM_Format
     */
    RGBA_ASTC_5x4_Format = 37809,
    /**
     * @deprecated use RGBA_ASTC_5x5_UNORM_Format
     */
    RGBA_ASTC_5x5_Format = 37810,
    /**
     * @deprecated use RGBA_ASTC_6x5_UNORM_Format
     */
    RGBA_ASTC_6x5_Format = 37811,
    /**
     * @deprecated use RGBA_ASTC_6x6_UNORM_Format
     */
    RGBA_ASTC_6x6_Format = 37812,
    /**
     * @deprecated use RGBA_ASTC_8x5_UNORM_Format
     */
    RGBA_ASTC_8x5_Format = 37813,
    /**
     * @deprecated use RGBA_ASTC_8x6_UNORM_Format
     */
    RGBA_ASTC_8x6_Format = 37814,
    /**
     * @deprecated use RGBA_ASTC_8x8_UNORM_Format
     */
    RGBA_ASTC_8x8_Format = 37815,
    /**
     * @deprecated use RGBA_ASTC_10x5_UNORM_Format
     */
    RGBA_ASTC_10x5_Format = 37816,
    /**
     * @deprecated use RGBA_ASTC_10x6_UNORM_Format
     */
    RGBA_ASTC_10x6_Format = 37817,
    /**
     * @deprecated use RGBA_ASTC_10x8_UNORM_Format
     */
    RGBA_ASTC_10x8_Format = 37818,
    /**
     * @deprecated use RGBA_ASTC_10x10_UNORM_Format
     */
    RGBA_ASTC_10x10_Format = 37819,
    /**
     * @deprecated use RGBA_ASTC_12x10_UNORM_Format
     */
    RGBA_ASTC_12x10_Format = 37820,
    /**
     * @deprecated use RGBA_ASTC_12x12_UNORM_Format
     */
    RGBA_ASTC_12x12_Format = 37821,
    RGBA_ASTC_4x4_UNORM_Format = 37808,
    RGBA_ASTC_5x4_UNORM_Format = 37809,
    RGBA_ASTC_5x5_UNORM_Format = 37810,
    RGBA_ASTC_6x5_UNORM_Format = 37811,
    RGBA_ASTC_6x6_UNORM_Format = 37812,
    RGBA_ASTC_8x5_UNORM_Format = 37813,
    RGBA_ASTC_8x6_UNORM_Format = 37814,
    RGBA_ASTC_8x8_UNORM_Format = 37815,
    RGBA_ASTC_10x5_UNORM_Format = 37816,
    RGBA_ASTC_10x6_UNORM_Format = 37817,
    RGBA_ASTC_10x8_UNORM_Format = 37818,
    RGBA_ASTC_10x10_UNORM_Format = 37819,
    RGBA_ASTC_12x10_UNORM_Format = 37820,
    RGBA_ASTC_12x12_UNORM_Format = 37821,
    RGBA_ASTC_4x4_SRGB_Format = 37840,
    RGBA_ASTC_5x4_SRGB_Format = 37841,
    RGBA_ASTC_5x5_SRGB_Format = 37842,
    RGBA_ASTC_6x5_SRGB_Format = 37843,
    RGBA_ASTC_6x6_SRGB_Format = 37844,
    RGBA_ASTC_8x5_SRGB_Format = 37845,
    RGBA_ASTC_8x6_SRGB_Format = 37846,
    RGBA_ASTC_8x8_SRGB_Format = 37847,
    RGBA_ASTC_10x5_SRGB_Format = 37848,
    RGBA_ASTC_10x6_SRGB_Format = 37849,
    RGBA_ASTC_10x8_SRGB_Format = 37850,
    RGBA_ASTC_10x10_SRGB_Format = 37851,
    RGBA_ASTC_12x10_SRGB_Format = 37852,
    RGBA_ASTC_12x12_SRGB_Format = 37853,
    RGBA_BC1_UNORM_Format = 33777,
    RGBA_BC2_UNORM_Format = 33778,
    RGBA_BC3_UNORM_Format = 33779,
    RGBA_BC7_UNORM_Format = 36492,
    RGBA_BC7_SRGB_Format = 36493,
    RGB8_ETC2_UNORM_Format = 37492,
    RGBA8_ETC2_UNORM_Format = 37496,
    RGB8_ETC2_SRGB_Format = 37493,
    RGBA8_ETC2_SRGB_Format = 37497
}



/**
 * Upload layer for one compressed 2D texture level.
 */
declare class CompressTexture2DLayer extends Texture2DLayer {
    source: CompressTextureLayerSource;
    format: CompressedPixelFormat;
    constructor(source: CompressTextureLayerSource);
    static create(source: CompressTextureLayerSource): CompressTexture2DLayer;
    setFormat(format: CompressedPixelFormat): this;
}



declare type CompressTextureLayerSource = TypeArray;



/**
 * Computes the camera position for a snapshot direction.
 */
declare function computeCameraPosition(size: Vector3, type: SnapshotAxisDirection): Vector3;



/**
 * Computes the distance between two vertexes, store to new {@link attributes| attributes} lineDistance.
 * The distance is used to determine the length of line, this is necessary for drawing segmented line.
 */
declare function computeLineDistances(geometry: BufferGeometry<LineList | LineStrip>): void;



declare function computeLineDistancesForFatline(geometry: FatLineBufferGeometry): void;



/**
 * Computes face normals normal by averaging vertices position.
 */
declare function computeNormalsByPosition(geometry: BufferGeometry): void;



/**
 * Computes the orthographic projection size for a snapshot direction.
 */
declare function computeProjectionSize(size: Vector3, type: SnapshotAxisDirection): Vector3;



/**
 * Make a cone volume for calculating intersection.
 */
declare class Cone {
    /**
     * The position of peak.
     */
    tip: Vector3;
    /**
     * The angle of cone in vertical field.
     */
    fov: number;
    /**
     * The scale modification for fov.
     */
    aspect: number;
    /**
     * The bottom plane will be vertical to this vector.
     */
    direction: Vector3;
    private _theta;
    private _tanTheta;
    sinTheta: number;
    cosTheta: number;
    constructor(tip?: Vector3, fov?: number, direction?: Vector3, aspect?: number);
    /**
     * Update the cone's corresponding attributes by given parameters.
     */
    update(tip?: Vector3, fov?: number, direction?: Vector3, aspect?: number): this;
    /**
     * Check the intersection of this cone and given sphere.
     */
    isSphereOutsideCone(sphere: Sphere): boolean;
    /**
     * Creates a new clone of the Cone.
     */
    clone(): Cone;
    /**
     * Copy the data to this object from source.
     * This method need override in derived classes to copy extended data.
     * @param {Geometry} source the data source.
     */
    copy(other: Cone): Cone;
}



declare function cone(params: Omit<Partial<CylinderShapeParameter>, 'radiusTop'>): BufferGeometry<TriangleList>;



declare interface ContentAPI {
    maintainTheWorld?(scene?: Scene3D): void;
    setEnablePhysicalShading?(v: boolean): void;
    init_default_texture?(t: Texture2D): void;
    init_ltc?(ltc_1: Texture2D, ltc_2: Texture2D): void;
    beforeFrame?(v: Viewer): void;
    afterFrame?(): void;
    bufferGeometryCreate?(geo: BufferGeometryBase): void;
    bufferGeometryDestroy?(geo: BufferGeometryBase): void;
    bufferGeometryFreeGPU?(geo: BufferGeometryBase): void;
    bufferGeometrySetAttribute?(geo: BufferGeometryBase, key: string, buffer: Nullable<BufferAttribute>): void;
    bufferGeometrySetIndexAttribute?(geo: BufferGeometryBase, buffer: Nullable<BufferAttribute>): void;
    bufferGeometrySetGroup?(geo: BufferGeometryBase, index: number, group: BufferGroup): void;
    bufferGeometryClearGroups?(geo: BufferGeometryBase): void;
    bufferGeometrySetInstanceCount?(geo: InstancedBufferGeometry, count: number): void;
    bufferGeometrySetIsFatline?(geo: InstancedBufferGeometry): void;
    bufferGeometrySetIsSprite?(geo: SpriteBufferGeometry): void;
    popBufferGeometrySetModel?(geo: PopBufferGeometry, model: IPopbufferInfo): void;
    bufferAttributeCreate?(attribute: BufferAttribute): void;
    bufferAttributeDestroy?(attribute: BufferAttribute): void;
    bufferAttributeFreeGPU?(attribute: BufferAttribute): void;
    bufferAttributeSetData?(attribute: BufferAttribute, data: TypeArray, itemSize: number, count: number, normalized: boolean): void;
    bufferAttributeNotifyContentChange?(attribute: BufferAttribute): void;
    textureCreate?(texture: Texture): void;
    textureDestroy?(texture: Texture): void;
    textureFreeGPU?(texture: Texture): void;
    textureSyncSamplerAndMetaInfo?(texture: Texture): void;
    textureSetLayerLevelSource?(texture: Texture, layer: number, level: number, source: any): void;
    sourceTextureSetLevelData?(texture: SourceTexture, source: MipLevelSource, level: number): void;
    sourceTextureSetLevelLayerData?(texture: SourceTexture, source: LayerSource, level: number, layer: number): void;
    targetCreate?(target: RenderTarget): void;
    targetDestroy?(target: RenderTarget): void;
    targetSync?(target: RenderTarget): void;
    targetSetAttachments?(target: RenderTarget, colors: Texture[], depth?: Texture): void;
    targetSetBindInfo?(target: RenderTarget, level: number, drawBuffers?: number[]): void;
    shaderComponentCreateAttachable?(shaderComponent: ShaderComponent): void;
    materialCreate?(material: Material): void;
    materialDestroy?(material: Material): void;
    materialFreeGPU?(material: Material): void;
    materialSetShaderComponent?(material: Material, key: string, prev: Nullable<ShaderComponent>, value: ShaderComponent): void;
    materialAddShaderComponent?(material: Material, component: ShaderComponent, index?: number): void;
    materialDeleteShaderComponent?(material: Material, component: ShaderComponent, index: number): void;
    materialSetProperty?(material: Material | ShaderComponent, key: string, value: any, force?: boolean): void;
    sceneNodeCreate?(node: Object3D): void;
    sceneNodeDestroy?(node: Object3D): void;
    sceneNodeFreeGPU?(node: Object3D): void;
    sceneNodeSyncData?(node: Object3D): void;
    sceneNodeUpdate?(node: Object3D): void;
    sceneNodeSyncMatrix?(node: Object3D): void;
    sceneNodeSyncLayers?(node: Object3D): void;
    sceneNodeAdd?(node: Object3D, child: Object3D): void;
    sceneNodeRemove?(node: Object3D, child: Object3D): void;
    sceneNodeAttachScene?(scene: Scene3D, node: Object3D): void;
    sceneNodeDetachScene?(scene: Scene3D, node: Object3D): void;
    drawableInit?(node: Drawable): void;
    drawableClearMaterial?(node: Drawable): void;
    drawableSetMaterial?(node: Drawable, material: Material, index: number): void;
    drawableSetGeometry?(node: Drawable, geometry: BufferGeometryBase): void;
    drawableSyncData?(node: Drawable, key: string, value: any): void;
    drawableSyncAllData?(node: Drawable): void;
    skinnedMeshSetSkeleton?<M extends Material, T extends Texture2D | SourceTexture>(node: SkinnedMesh<M, T>): void;
    skinnedMeshSyncBoneMatrices?<M extends Material, T extends Texture2D | SourceTexture>(node: SkinnedMesh<M, T>): void;
    lightInit?(light: Light): void;
    lightSetProperty?(light: Light, key: string, target: Light | Shadow<unknown>, value: any): void;
    cameraInit?(camera: Camera): void;
    cameraSyncData?(camera: Camera): void;
    cameraUpdateJitter?(camera: Camera, jitter: ReadonlyVector2): void;
    cameraUpdatePrev?(camera: Camera): void;
    sceneCreate?(scene: Scene3D): void;
    sceneSyncData?(scene: Scene3D): void;
    sceneUpdate?(scene: Scene3D): void;
    sceneDestroy?(scene: Scene3D): void;
}



declare interface ContentManagedAPI extends ContentAPI {
    isContentOwnGeometricData(): boolean;
    bufferAttributeGetRefreshDataView(attribute: BufferAttribute): void;
    bufferAttributeApplyMat3(attribute: BufferAttribute, mat3: Matrix3): void;
    bufferAttributeApplyMat4(attribute: BufferAttribute, mat4: Matrix4): void;
    bufferGeometryGetLocalBBox(geo: BufferGeometryBase): Box3;
    bufferGeometryGetLocalBBall(geo: BufferGeometryBase): Sphere;
    meshGetLocalBBox(mesh: Mesh): Box3;
    raycast(drawable: Drawable, result: Intersection[], raycaster: Raycaster): void;
    raycastFirst(drawable: Drawable, raycaster: Raycaster): Intersection | null;
    raycastScene(scene: Scene3D, result: Intersection[], raycaster: Raycaster): void;
    raycastSceneFirst(scene: Scene3D, raycaster: Raycaster): Intersection | null;
    raycastList(list: Object3D[], recursive: boolean, result: Intersection[], raycaster: Raycaster): void;
    raycastListFirst(list: Object3D[], recursive: boolean, raycaster: Raycaster): Intersection | null;
    sceneTick(scene: Scene3D, timestamp: number): void;
    sceneOptimize(scene: Scene3D): void;
    rebuildWorld(config?: WorldRebuildConfig): Promise<void>;
    dispose(): void;
}



/**
 * Event emitted when the rendering context is lost.
 */
declare const ContextLostEvent: EventType<CtxLostInfo>;



/**
 * Event emitted when context restoration fails after a loss.
 */
declare const ContextLostRestoreFailedEvent: EventType<never>;



declare class CopyColorAndDepthMaterial extends CopyMaterial {
    depth: Texture;
    depthTest: boolean;
    depthWrite: boolean;
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
}



declare class CopyDepthMaterial extends PassQuadMaterialBase {
    depth: Texture;
    depthTest: boolean;
    depthWrite: boolean;
    colorWrite: boolean;
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
}



/**
 * Copies one nullable material property from another instance.
 */
declare function copyItem<T>(source: T, other: T, key: keyof T): void;



declare class CopyMaterial extends PassQuadMaterialBase {
    tDiffuse: Texture;
    opacity: number;
    isRepeat: boolean;
    matrix: Matrix3;
    className(): string;
    extendShaderShape(builder: ShaderBuilder): void;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
    updateShapeUniforms(p: WGLProgram): void;
}



/**
 * Creates a data texture from material schema values.
 */
declare function createDataTexture<M extends Material>(schema: DataTextureSchema<M>, inputs: M[]): Texture2D;



declare function createEdge(g: BufferGeometry | Geometry, thresholdAngle: number): BufferGeometry<LineList>;



/**
 * Return a non-index version of an indexed BufferGeometry.
 */
declare function createNoneIndexed(geometry: BufferGeometry): Nullable<BufferGeometry>;



declare function createWireframe(geometry: GeometryBase): BufferGeometry<LineList>;



declare type CtxLostInfo = ResourceStatistics & {
    manual: boolean;
};



/**
 * The cubic-bezier curve object is used to help drawing curves for {@link Path | path }.
 */
declare class CubicBezierCurve2D extends Curve2D {
    CubicBezierCurve2D: boolean;
    v0: Vector2;
    v1: Vector2;
    v2: Vector2;
    v3: Vector2;
    constructor(v0?: Vector2, v1?: Vector2, v2?: Vector2, v3?: Vector2);
    className(): string;
    getPoint(t: number, optionalTarget?: Vector2): Vector2;
    clone(): CubicBezierCurve2D;
    copy(source: CubicBezierCurve2D): this;
    toJSON(): any;
    fromJSON(json: any): this;
}



/**
 * The cubic-bezier curve object is used to help drawing curves in 3D space.
 */
declare class CubicBezierCurve3D extends Curve<Vector3> {
    isCubicBezierCurve3D: boolean;
    v0: Vector3;
    v1: Vector3;
    v2: Vector3;
    v3: Vector3;
    constructor(v0?: Vector3, v1?: Vector3, v2?: Vector3, v3?: Vector3);
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void;
    className(): string;
    getPoint(t: number, optionalTarget?: Vector3): Vector3;
    clone(): CubicBezierCurve3D;
    copy(source: CubicBezierCurve3D): this;
    toJSON(): any;
    fromJSON(json: any): this;
}



declare function cylinder(param: Partial<CylinderShapeParameter>): BufferGeometry;



/**
 * @param { number } radiusTop Radius of the cylinder at the top. Default is 1.
 * @param { number } radiusBottom Radius of the cylinder at the bottom. Default is 1.
 * @param { number } height Height of the cylinder. Default is 1.
 * @param { number } radialSegments Number of segmented faces around the circumference of the cylinder. Default is 8
 * @param { number } heightSegments Number of rows of faces along the height of the cylinder. Default is 1.
 * @param { number } openEnded A Boolean indicating whether the ends of the cylinder are open or capped. Default is false, meaning capped.
 * @param { number } thetaStart Start angle for first segment, default = 0 (three o'clock position).
 * @param { number } thetaLength The central angle, often called theta, of the circular sector. The default is 2*Pi, which makes for a complete cylinder.
 */
declare interface CylinderShapeParameter {
    radiusTop: number;
    radiusBottom: number;
    height: number;
    radialSegments: number;
    heightSegments: number;
    openEnded: boolean;
    thetaStart: number;
    thetaLength: number;
}



declare interface DataTextureSchema<M extends Material> {
    schema: Array<DataTextureSchemaOne<M>>;
    dataTextureShaderUniformName: string;
    materialIndexShaderAttributeName: string;
}



declare class DataTextureSchemaInstance<M extends Material> {
    info: DataTextureSchema<M>;
    constructor(info: DataTextureSchema<M>);
    updateUniform(dataTexture: TextureV2 | Texture2D, p: WGLProgram): void;
}



declare interface DataTextureSchemaOne<M extends Material> {
    shaderVaryName: string;
    shaderVaryingField?: string;
    materialPropertyGetter: (material: M) => DataTextureStorageAble;
}



declare type DataTextureStorageAble = number | Color | Vector3 | Vector2 | ReadonlyColor;



declare let deepCloneObject3D: typeof deepCloneObject3D_2;



declare function deepCloneObject3D_2(objects: Object3D[]): Promise<Object3D[]>;



declare function defaultLimits(): Limits;



declare class DefaultMaterialDispatcher extends MaterialDispatcher {
    static get DEFAULT(): DefaultMaterialDispatcher;
    className(): string;
    setMaterialState(renderer: Renderer, material: Material, drawable: Drawable): void;
    dispatch(renderer: Renderer, geometry: BufferGeometryBase, material: Material, drawable: Drawable): Nullable<WGLProgram>;
}



declare class DeferredDispatcher extends ShapeExtractableDispatcher {
    forceOpaque: boolean;
    decodeSrgb: boolean;
    className(): string;
    dispatchKey(): string;
    customKey(origin: Material, registry: ShaderComponentRegistry, isInstance: boolean): string;
    preExit(m: Material): boolean;
    updateUniforms(p: WGLProgram, _: ShaderComponentRegistry, origin: DeferredMaterial): void;
    setState(renderer: Renderer, material: Material, drawable: Drawable): void;
    extendShaderShading(b: ShaderBuilder, reg: ShaderComponentRegistry, origin: Material): void;
    dispatch(renderer: Renderer, geometry: BufferGeometryBase, material: Material, drawable: Drawable): Nullable<WGLProgram>;
}



declare class DeferredDrawAmbientLightMaterial extends DeferredLightBase<AmbientLight> {
    className(): string;
    buildLightShadow(): string;
    buildLightComputeImpl(): string;
    extendShaderShading(builder: ShaderBuilder, _: ShaderComponentRegistry): void;
    updateShadingUniforms(program: WGLProgram, _: ShaderComponentRegistry): void;
}



declare class DeferredDrawDirectionalLightMaterial extends DeferredLightBase<DirectionalLight> {
    className(): string;
    generateShaderKey(registry: ShaderComponentRegistry): string;
    buildLightComputeImpl(): string;
    buildLightShadow(): "" | "\n                // Offsetting the position used for querying occlusion along the world normal can be used to reduce shadow acne.\n                vec3 directionalShadowWorldNormal = inverseTransformDirection(geometry.normal, viewMatrix);\n                vec4 directionalShadowWorldPosition;\n                vec4 worldPosition = invViewMatrix * vec4(-vViewPosition, 1.0);\n                directionalShadowWorldPosition = worldPosition + vec4(directionalShadowWorldNormal * directionalLightShadowsInfo.shadowNormalBias, 0);\n                vec4 directionalShadowCoord = directionalLightShadowsInfo.shadowMatrix * directionalShadowWorldPosition;\n            ";
    extendShaderShading(builder: ShaderBuilder, _: ShaderComponentRegistry): void;
    updateShadingUniforms(program: WGLProgram, _: ShaderComponentRegistry): void;
}



declare class DeferredDrawDiskAreaLightMaterial extends DeferredLightBase<DiskAreaLight> {
    className(): string;
    buildLightComputeImpl(): string;
    buildLightShadow(): string;
    extendShaderShading(builder: ShaderBuilder, r: ShaderComponentRegistry): void;
    updateShadingUniforms(program: WGLProgram, _: ShaderComponentRegistry): void;
}



declare class DeferredDrawPointLightMaterial extends DeferredLightBase<PointLight> {
    className(): string;
    generateShaderKey(registry: ShaderComponentRegistry): string;
    buildLightComputeImpl(): string;
    buildLightShadow(): "" | "\n                // Offsetting the position used for querying occlusion along the world normal can be used to reduce shadow acne.\n                vec3 pointShadowWorldNormal = inverseTransformDirection(geometry.normal, viewMatrix);\n                vec4 pointShadowWorldPosition;\n\n                vec4 worldPosition = invViewMatrix * vec4(-vViewPosition, 1.0);\n                pointShadowWorldPosition = worldPosition + vec4(pointShadowWorldNormal * pointLightShadowsInfo.shadowNormalBias, 0);\n                vec4 pointShadowWorldCoord = pointShadowWorldPosition;\n            ";
    extendShaderShading(builder: ShaderBuilder, _: ShaderComponentRegistry): void;
    updateShadingUniforms(program: WGLProgram, _: ShaderComponentRegistry): void;
}



declare class DeferredDrawRectAreaLightMaterial extends DeferredLightBase<RectAreaLight> {
    className(): string;
    buildLightComputeImpl(): string;
    buildLightShadow(): string;
    extendShaderShading(builder: ShaderBuilder, r: ShaderComponentRegistry): void;
    updateShadingUniforms(program: WGLProgram, _: ShaderComponentRegistry): void;
}



declare class DeferredDrawSpotLightMaterial extends DeferredLightBase<SpotLight> {
    className(): string;
    generateShaderKey(registry: ShaderComponentRegistry): string;
    buildLightComputeImpl(): string;
    buildLightShadow(): "" | "\n                // Offsetting the position used for querying occlusion along the world normal can be used to reduce shadow acne.\n                vec3 spotShadowWorldNormal = inverseTransformDirection(geometry.normal, viewMatrix);\n                vec4 spotShadowWorldPosition;\n                vec4 worldPosition = invViewMatrix * vec4(-vViewPosition, 1.0);\n                spotShadowWorldPosition = worldPosition + vec4(spotShadowWorldNormal * spotLightShadowsInfo.shadowNormalBias, 0);\n                vec4 spotShadowCoord = spotLightShadowsInfo.shadowMatrix * spotShadowWorldPosition;\n            ";
    extendShaderShading(builder: ShaderBuilder, _: ShaderComponentRegistry): void;
    updateShadingUniforms(program: WGLProgram, _: ShaderComponentRegistry): void;
}



declare abstract class DeferredLightBase<L> extends PassQuadMaterialBase {
    side: Side;
    result: DeferredResult;
    light: L;
    constructor();
    setResult(): void;
    protected normal: Texture;
    protected color: Texture;
    protected other: Texture;
    protected depth: Texture;
    rotationMatrix: Readonly<Pick<ReadonlyMarked<Matrix4>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "getNumberCount" | "toArray" | "elements" | "applyToBufferAttribute" | "determinant" | "applyToArray" | "decompose" | "extractBasis" | "getPosition" | "getMaxScaleOnAxis" | "decompose2D">>;
    position: Readonly<Pick<ReadonlyMarked<Vector3>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "z" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "angleTo">>;
    projectionInverseMatrix: Readonly<Pick<ReadonlyMarked<Matrix4>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "getNumberCount" | "toArray" | "elements" | "applyToBufferAttribute" | "determinant" | "applyToArray" | "decompose" | "extractBasis" | "getPosition" | "getMaxScaleOnAxis" | "decompose2D">>;
    far: number;
    near: number;
    abstract buildLightComputeImpl(): string;
    abstract buildLightShadow(): string;
    private matrixProjInverse;
    setProjInverse(matrixProjInverse: Matrix4): void;
    buildLightCompute(): string;
    generateShaderKey(registry: ShaderComponentRegistry): string;
    extendShaderShading(builder: ShaderBuilder, r: ShaderComponentRegistry): void;
    updateShadingUniforms(program: WGLProgram, _: ShaderComponentRegistry): void;
    className(): string;
}



declare class DeferredResult {
    normal: Texture;
    color: Texture;
    other: Texture;
    depth: Texture;
    extendShaderShading(builder: ShaderBuilder): void;
    updateUniforms(program: WGLProgram): void;
}



declare class DialuxLuminanceMaterial extends PassPointsMaterialBase {
    private textureResolutionX;
    hdr: Texture;
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
    configBlend(): this;
}



declare class DialuxWhiteBalanceExposureMaterial extends PassQuadMaterialBase {
    hdr: Texture;
    private dialuxWhiteBalanceMatrix;
    _temperature: number;
    get temperature(): number;
    set temperature(v: number);
    constructor();
    private updateMatrix;
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
}



/**
 * Shader block for disk area-light Blinn-Phong evaluation.
 */
declare const DiskAreaBlinnPhong: ShaderBlock;



declare function disposeManagedContentAPI(): void;



declare function dodecahedron(params: RegularPolyhedronShapeParameter): BufferGeometry;



declare let downloadStringAsFile: typeof downloadStringAsFile_2;



declare function downloadStringAsFile_2(str: string, name: string): void;



declare class DownsampleMaterial extends PassQuadMaterialBase {
    texelSize: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    tDiffuse: Texture;
    correctColor: boolean;
    className(): string;
    setTexelSize(width: number, height: number): void;
    setTexelZero(): void;
    generateShaderKey(registry: ShaderComponentRegistry): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(p: WGLProgram): void;
}



declare const DrawcallListClassifyList: {
    default: DrawcallListClassifyType;
    opaque: DrawcallListClassifyType;
    transparent: DrawcallListClassifyType;
    oit: DrawcallListClassifyType;
    overlay: DrawcallListClassifyType;
};



declare class DrivenCullingMaterial extends DrivenMaterial {
    enableFrustumCulling: boolean;
    enableOcclusionCulling: boolean;
    enableDetailCulling: boolean;
    enableLayersCulling: boolean;
    enableTriCulling: boolean;
    occlusionCullingBias: number;
    planarShadowMaxGroundHeight: number;
    planarShadowMatrix: Matrix4;
    depthPyramid: RenderAttachment | null;
    className(): string;
    update(config: DrivenCullingConfig): void;
}



declare class DrivenGenHZBMaterial extends DrivenMaterial {
    depth: RenderAttachment | null;
    depthPyramid: RenderAttachment | null;
    className(): string;
}



declare class DrivenShadingMaterial extends DrivenMaterial {
    className(): string;
    shadingMode: DrivenShadingMode;
    oitEncode: boolean;
    decodeSrgb: boolean;
    planarShadowOcclusion: boolean;
    depthPackMode: DepthPackingStrategies;
    outlineSolidColor: Color;
    toonColor: Color;
    diffuseColor: Color;
    colorGradation: number;
    smoothnessMin: number;
    smoothnessMax: number;
    planarShadowMaxGroundHeight: number;
    planarShadowMaxGroundThickness: number;
    shadowMatrix: Matrix4;
    shadowIntensity: number;
}



declare enum DrivenShadingMode {
    PhongShading = 0,
    OutlineEncode = 1,
    OutlineShading = 2,
    OutlineSolidShading = 3,
    OutlineSolidPhongShading = 4,
    OutlineMaskShading = 5,
    DeferredEncode = 6,
    ToonShading = 7,
    PlanarShadow = 8,
    DepthShading = 9,
    NormalShading = 10
}



declare namespace EGS {
    export {
        Utils,
        ContextLostEvent,
        ContextLostRestoreFailedEvent,
        RendererBackend,
        MemoryInfo,
        EventDispatcher,
        EventType,
        Viewer,
        ViewerResizeEvent,
        ViewerUnInitializeEvent,
        RenderOverEvent,
        RenderStatistics,
        RuntimeFatalErrorEvent,
        HighLightItem,
        HighlightGroup,
        Viewport,
        createViewerContext,
        IViewerContext,
        ResetRendererEvent,
        RenderMode,
        setViewerConfig,
        EngineInitializeConfig,
        setViewerConfig as setValueToConfig,
        Texture2DCompressed,
        CompressTexture2DLayer,
        logger,
        PresetRenderConfig,
        SnapshotResultResultType,
        SnapshotResult,
        SnapshotCameraInfo,
        SnapshotBoxPrecision,
        SnapshotAxisDirection,
        computeCameraPosition,
        computeProjectionSize,
        Application,
        projectName,
        Box2,
        Box3,
        Color,
        ReadonlyColor,
        Cylindrical,
        Euler,
        Frustum,
        Interpolant,
        Line3,
        Matrix3,
        ReadonlyMatrix3,
        Matrix4,
        ReadonlyMatrix4,
        Plane,
        Quaternion,
        Ray,
        Sphere,
        Spherical,
        Triangle,
        Vector2,
        ReadonlyVector2,
        Vector3,
        ReadonlyVector3,
        Vector4,
        ReadonlyVector4,
        Face3,
        Cone,
        Shape,
        Path,
        Object3D,
        Texture,
        TextureMipmapGroup,
        Texture2D,
        Texture2DLayer,
        Texture2DCommonLayer,
        Texture3D,
        Texture3DLayer,
        TextureCube,
        TextureCubeSide,
        SourceTexture,
        MipLevelSource,
        LayerSource,
        TextureDimension,
        TextureViewDimension,
        TextureFormat,
        FatLineMaterial,
        ToneMapping,
        FilterTarget,
        SceneClipMaterial,
        DrawMode as WebGLDrawMode,
        SamplerWrap as WebGLTextureWrap,
        SamplerFilter as WebGLTextureFilter,
        BlendingEquation as WebGLBlendingEquation,
        BlendingFactor as WebGLBlendingDst,
        StencilFunc as WebGLStencilFunc,
        StencilOp as WebGLStencilOp,
        createDataTexture,
        TypeArray,
        TypeAssert,
        Scene3D,
        Layers,
        Picker,
        Line,
        LineSegments,
        Mesh,
        Points,
        PopMesh,
        Sprite,
        SkinnedMesh,
        Splat,
        SplatState,
        SplatRenderingStabilityChangedEvent,
        SplatSortedEvent,
        SplatModifier,
        InstanceMesh,
        FatLineSegments,
        Group,
        Camera,
        ArrayCamera,
        PerspectiveCamera,
        OrthographicCamera,
        ArrowHelper,
        AxisHelper,
        GridHelper,
        CoordinateSystemHelper,
        Light,
        DirectionalLight,
        PointLight,
        SpotLight,
        RectAreaLight,
        DiskAreaLight,
        HemisphereLight,
        AmbientLight,
        InstancedBufferAttribute,
        Geometry,
        GeometryBase,
        IPopbufferInfo,
        PopBufferGeometry,
        FatLineBufferGeometry,
        shapeBuilder,
        geomOperator,
        Clock,
        Capabilities,
        TextureCompression,
        Capabilities as WGLCapabilities,
        Rectangle,
        RoundedRectangle,
        Circle,
        Ellipse,
        Polygon,
        Ticker,
        serializeObject3D,
        parseObjects,
        deepCloneObject3D,
        downloadStringAsFile,
        __INTERNAL__,
        SnapshotRenderConfig,
        SnapshotRenderer_2,
        _Math,
        readonlyMath,
        ArcCurve2D,
        CatmullRomCurve3D,
        CubicBezierCurve2D,
        CubicBezierCurve3D,
        EllipseCurve2D,
        LineCurve2D,
        LineCurve3D,
        QuadraticBezierCurve2D,
        QuadraticBezierCurve3D,
        SplineCurve2D,
        isPointInsidePolygon,
        FontPath,
        Font,
        DrawableRenderMode,
        OutlineRenderMode,
        OutlineShadingMode,
        OutlineMode,
        RenderHook,
        Drawable,
        MeshBasicMaterialParameters,
        MeshBasicMaterial_2,
        MeshPhongMaterialParameters,
        MeshPhongMaterial_2,
        AreaBlinnPhong,
        RectAreaBlinnPhong,
        DiskAreaBlinnPhong,
        MergedMeshPhongMaterialDataTextureSchema,
        MergedMeshPhongMaterial,
        DepthPackingStrategies,
        MeshDepthMaterial,
        SpriteMaterialParameters,
        SpriteMaterial_2,
        RoomBoxMaterialParameter,
        RoomBoxMaterial,
        MeshNormalMaterial,
        ModelParameter,
        GlobalParams,
        PanoSelectionMaterial,
        PanoEnvMapMaterial,
        LineBasicMaterialParameters,
        LineBasicMaterial,
        LineDashedMaterialParameters,
        LineDashedMaterial,
        ColorWithAlphaParam,
        ColorWithAlpha,
        LineDashParam,
        LineDash,
        copyItem,
        MaterialDisposeEvent,
        MaterialPropertyChangeEvent,
        MaterialRecompileShaderEvent,
        PickedBySubType,
        NotPickedBySubType,
        SubTypeMap,
        ConvertMaterialParameters,
        MaterialParameters,
        MaterialState,
        ColorTransfer,
        Material,
        PointsMaterialParameters,
        PointsMaterial,
        PhysicalMaterial,
        getTextureDataTypeSize,
        Side,
        Blending,
        DepthModes,
        TextureDataType,
        CompressedPixelFormat,
        CompressTextureType,
        DrawMode,
        SamplerWrap,
        SamplerFilter,
        BlendingEquation,
        BlendingFactor,
        StencilOp,
        StencilFunc,
        getWebGLPixelFormatChannelSize,
        WebGLShaderDataType,
        WebGLTextureEncoding,
        WebGLTextureType,
        WebGLCullFace,
        WebGLPixelFormat,
        WebGLBlendingSrc,
        Background,
        BackgroundMode,
        SolidColorBackgroundParameter,
        GradientBackgroundParameter,
        SkyBackgroundParameter,
        EnvMapBackgroundParameter,
        BasicBackgroundParameter,
        BackgroundParameter,
        SolidColorBackground,
        BasicBackground,
        GradientBackground,
        SkyBackground,
        EnvMapBackground,
        Ground,
        Intersection,
        Raycaster,
        CombineOperation,
        EnvTextureType,
        EnvMapIBLShaderComponent,
        SpottedType,
        SpottedShaderComponentParameter,
        SpottedShaderComponent,
        PavingMethod,
        PavingShaderComponent,
        ClippingShaderComponent,
        PatternShaderComponentParameter,
        PatternShaderComponent,
        ShaderBlendParameter,
        shaderBlendKeys,
        BufferAttribute,
        GeometryDisposeEvent,
        GeometryAttributeChangedEvent,
        BufferRange,
        BufferGroup,
        IndexBufferAttribute,
        BufferGeometryBase,
        TriangleList,
        LineList,
        LineStrip,
        PointList,
        BufferGeometry
    }
}



/**
 * The Ellipse object is used to help draw graphics.
 */
declare class Ellipse extends Shape {
    /**
     * The X coordinate of the center of this ellipse.
     */
    x: number;
    /**
     * The Y coordinate of the center of this ellipse.
     */
    y: number;
    /**
     * The half width of this ellipse.
     */
    halfWidth: number;
    /**
     * The half height of this ellipse.
     */
    halfHeight: number;
    /**
     * @param divisions The number of segments in the ellipse.
     */
    divisions?: number;
    /**
     * The type of the object, mainly used to avoid 'instanceof' checks.
     */
    readonly type = "Ellipse";
    /**
     * The type of the object, mainly used to avoid 'instanceof' checks.
     * @param x The X coordinate of the center of this ellipse.
     * @param y The Y coordinate of the center of this ellipse.
     * @param halfWidth The half width of this ellipse.
     * @param halfHeight The half height of this ellipse.
     * @param divisions The number of segments in the ellipse.
     */
    constructor(x?: number, y?: number, halfWidth?: number, halfHeight?: number, divisions?: number);
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Creates a clone of this Ellipse instance.
     */
    clone(): Ellipse;
    /**
     * Add this ellipse to drawing.
     */
    draw(): void;
    /**
     * Checks whether the x and y coordinates given are contained within this ellipse.
     * @param x The X coordinate of the point to test.
     * @param y The Y coordinate of the point to test.
     * @return Whether the x/y coords are within this ellipse.
     */
    contains(x: number, y: number): boolean;
    /**
     * Returns the framing rectangle of the ellipse as a Rectangle object.
     */
    getBounds(bounds?: Box2): Box2;
}



declare class EncodeDispatcher<T extends OutlineEncodeMaterial = OutlineEncodeMaterial> extends MaterialShadingWithDynamicShapeDispatcher<T> {
    private encodeId;
    fixMergedPhongEncode: boolean;
    className(): string;
    reset(): void;
    dispatchKey(r: ShaderComponentRegistry): string;
    dispatch(renderer: Renderer, geometry: BufferGeometry, material: Material, drawable: Drawable): Nullable<WGLProgram>;
}



/**
 * EnvMapIBLShaderComponent controls the use of environment map includes cubic texture and 2D texture.
 * This class has a series of local functions for defining different samplers and choosing different blending methods.
 * The function getLightProbeIndirectRadiance can return a GLSL code component for indirect light shader.
 */
declare class EnvMapIBLShaderComponent<T extends TextureCube | Texture2D | TextureV2 = Texture2D | TextureCube> extends ShaderComponent {
    /**
     * The environment map accept Texture and CubeTexture.
     */
    envMap: T;
    /**
     * Let refractionRatio enable.
     */
    useFrac: boolean;
    /**
     * See {@link EnvTextureType| EnvTextureType } for more details.
     */
    envType: EnvTextureType;
    /**
     * See {@link CombineOperation| CombineOperation } for more details.
     */
    combine: CombineOperation;
    /**
     * How much the environment map affects the surface; also see {@link CombineOperation| CombineOperation }. The default value is 1 and the valid range is between 0 (no reflections) and 1 (full reflections).
     */
    reflectivity: number;
    /**
     * The index of refraction (IOR) of air (approximately 1) divided by the index of refraction of the material.
     * The refraction ratio should not exceed 1.
     * This parameter is used to simulate refraction effect for envMapping.
     * @defaultValue 0.98.
     */
    refractionRatio: number;
    envMapIntensity: number;
    constructor();
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Copy the data to this object from other.
     * @param other the data source.
     */
    copy(other: EnvMapIBLShaderComponent<T>): this;
    clone(): EnvMapIBLShaderComponent<T>;
    extendShaderShading(builder: ShaderBuilder): void;
    serialize(ctx: Serializer<any>): void;
    deserialize(ctx: Deserializer): void | Promise<void>;
}



/**
 * Environment texture layout used by IBL shader components.
 */
declare enum EnvTextureType {
    Cube = 0,
    Equirec = 1,
    Sphere = 2
}



declare class ExposedCopyMaterial extends PassQuadMaterialBase {
    tDiffuse: Texture;
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
}



declare class ExposedToneMappingMaterial extends PassQuadMaterialBase {
    tDiffuse: Texture;
    clampedLuminanceThreshold: number;
    luminanceTexture: Texture;
    keyMinuend: number;
    gamma: number;
    multiplier: number;
    burnValue: number;
    contrast: number;
    private _enableAutoExposure;
    set enableAutoExposure(value: boolean);
    get enableAutoExposure(): boolean;
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
}



declare function extrude(shapes: Shape | Shape[], options?: Partial<ExtrudeOptions>): BufferGeometry;



declare class ExtrudeBufferGeometry extends BufferGeometry {
    parameters: {
        shapes: Shape | Shape[];
        options: Partial<ExtrudeOptions>;
    };
    /**
     * @param { number } shapes Shape or an array of shapes.
     * @param { number } options Object that can contain the following parameters. <br />
     * curveSegments — int. Number of points on the curves. Default is 12. <br />
     * steps — int. Number of points used for subdividing segments along the depth of the extruded spline. Default is 1. <br />
     * depth — float. Depth to extrude the shape. Default is 100. <br />
     * bevelEnabled — bool. Apply beveling to the shape. Default is true. <br />
     * bevelThickness — float. How deep into the original shape the bevel goes. Default is 6. <br />
     * bevelSize — float. Distance from the shape outline that the bevel extends. Default is bevelThickness - 2. <br />
     * bevelOffset — float. Distance from the shape outline that the bevel starts. Default is 0. <br />
     * bevelSegments — int. Number of bevel layers. Default is 3. <br />
     * extrudePath — Curve. A 3D spline path along which the shape should be extruded. <br />
     * UVGenerator — Object. object that provides UV generator functions. <br />
     * This object extrudes a 2D shape to a 3D geometry.
     * When creating a Mesh with this geometry, if you'd like to have a separate material used for its face and its extruded sides, you can use an array of materials.
     * The first material will be applied to the face; the second material will be applied to the sides.
     */
    constructor(shapes?: Shape | Shape[], options?: Partial<ExtrudeOptions>);
    private addShape;
}



declare interface ExtrudeOptions {
    steps: number;
    depth: number;
    bevelEnabled: boolean;
    bevelThickness: number;
    bevelSize: number;
    bevelSegments: number;
    curveSegments: number;
    UVGenerator: typeof WorldUVGenerator;
    extrudePath: Curve<Vector3>;
}



declare class FilterMaterial extends PassQuadMaterialBase {
    transparent: boolean;
    tDiffuse: Texture;
    depth: Nullable<Texture>;
    temperature: number;
    tint: number;
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
    colorBalance: Vector3;
    texture: Nullable<Texture>;
    lut: Nullable<Texture>;
    target: FilterTarget;
    className(): string;
    generateShaderKey(r: ShaderComponentRegistry): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
}



/**
 * This class is used to help draw font .
 */
declare class Font implements SerializerableDelegatedAsReference {
    private _uuid;
    getUUID(): string;
    className(): string;
    /**
     * 2D contour triangulation
     * @param contours Contour list
     * @returns positions Vertex coordinate list
     */
    static triangulate: (contours: number[][]) => number[];
    private _isCIDFont;
    set isCIDFont(v: boolean);
    get isCIDFont(): boolean;
    /**
     * The geometry data of all font.
     */
    data: OpentypeFont;
    /**
     * Used to check type of this or extended instance.
     * This value should not be changed by user.
     */
    isFont: boolean;
    private charGeometryCache;
    unitsPerEm: number;
    constructor(data?: OpentypeFont);
    generateShapes(text: string, size?: number, lineHeight?: number, align?: 'left' | 'center' | 'right'): Shape[];
    serialize(ctx: Serializer<any>): void;
    deserialize(ctx: Deserializer): void;
}



/**
 * This class is used to draw a text in the scene.
 */
declare class FontPath implements SerializerableDelegatedAsReference {
    private _uuid;
    getUUID(): string;
    className(): string;
    subPaths: Path[];
    currentPath: Path;
    color: Color;
    constructor();
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    quadraticCurveTo(aCPx: number, aCPy: number, aX: number, aY: number): void;
    bezierCurveTo(aCP1x: number, aCP1y: number, aCP2x: number, aCP2y: number, aX: number, aY: number): void;
    splineThru(pts: Vector2[]): void;
    closePath(): void;
    toShapes(noHoles?: boolean): Shape[];
    serialize(ctx: Serializer<any>): void;
    deserialize(ctx: Deserializer): void;
}



declare function formatMeta(format: TextureFormat): TextureFormatMeta;



declare class ForwardDispatcher extends MaterialDispatcher {
    solidEnabled: boolean;
    solidLightMaterialEnabled: boolean;
    solidMaterial: Material;
    oitEnabled: boolean;
    oitMaterial: OITMaterial;
    toonEnabled: boolean;
    toonMaterial: ToonMaterial;
    planarShadowEnabled: boolean;
    planarShadowMaxGroundHeight: number;
    planarShadowMaxGroundThickness: number;
    enableDynamicLights: boolean;
    constructor(solidMaterial?: MeshBasicMaterial_2, oitMaterial?: OITMaterial, toonMaterial?: ToonMaterial, enableDynamicLights?: boolean);
    className(): string;
    private isPlanarShadowReceiver;
    dispatch(renderer: Renderer, geometry: BufferGeometryBase, material: Material, drawable: Drawable): Nullable<WGLProgram>;
}



/**
 * Event emitted when a buffer geometry attribute is added, removed, or replaced.
 */
declare const GeometryAttributeChangedEvent: EventType<{
    geometry: BufferGeometryBase;
    attributeName: string;
    newValue: Nullable<BufferAttribute>;
    oldValue: Nullable<BufferAttribute>;
    update: boolean;
}>;



/**
 * Event emitted when a buffer geometry is disposed.
 */
declare const GeometryDisposeEvent: EventType<BufferGeometryBase>;



declare const geomOperator: typeof geomOperatorImport;



declare namespace geomOperatorImport {
    export {
        createEdge,
        needRebuild,
        updateEdgesVisibility,
        computeLineDistances,
        computeLineDistancesForFatline,
        mergeBufferGeometries,
        mergeBufferGeometries2,
        mergeTheOtherIntoSelf,
        BufferGeometryMergeInfo,
        updateByGeometry,
        updateByGeometryAsLine,
        createNoneIndexed,
        transform,
        createWireframe,
        WireframeBufferGeometry,
        reNormalize,
        computeNormalsByPosition
    }
}



declare function getBufferSubDataAsync(gl: WebGL2RenderingContext, target: number, buffer: WebGLBuffer, srcByteOffset: number, dstBuffer: TypeArray, dstOffset?: number, length?: number): Promise<void>;



declare function getMaterialProperties(target: Material | ShaderComponent): Set<string>;



declare function getMaterialShaderComponents(target: Material): Set<string>;



/**
 * Returns the byte size of one texture channel.
 */
declare function getTextureDataTypeSize(t: TextureDataType): 1 | 2 | 4;



/**
 * Returns the number of color channels in a WebGL pixel format.
 */
declare function getWebGLPixelFormatChannelSize(t: WebGLPixelFormat): number;



declare const GLOBAL_CONFIG: {
    isDebugEnable: boolean;
    meshBVHEnabled: boolean;
};



/**
 * This class is used to update parameter for {@link PanoEnvMapMaterial | PanoEnvMapMaterial }.
 */
declare class GlobalParams {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
    b: number;
    r: number;
    g: number;
    updateUniforms(program: WGLProgram, prefix: string): void;
}



/**
 * This class is used to draw a square grid which is divided into four area by a cross coordinate system.
 */
declare class GridHelper extends LineSegments<LineBasicMaterial> {
    /**
     * @param size length of side. Default is 10.
     * @param divisions the number of division of one side. Default is 10.
     * @param color1 the color of coordinate system. Default is 0x444444.
     * @param color2 the color of item's side. Default is 0x888888.
     */
    constructor(size?: number, divisions?: number, color1?: Color | number, color2?: Color | number);
}



/**
 * This is almost identical to an {@link Object3D| Object3D }. Its purpose is to make working with groups of objects syntactically clearer.
 * The group node can make its children nodes to do same transformation.
 * It is not a drawable 3D object in scene.
 */
declare class Group extends Object3D {
    /**
     * The type of current {@link Object3D| Object3D }.
     */
    type: string;
    /**
     * Used to assert type of this instance.
     */
    isGroup: boolean;
    /**
     * The name of instance's class.
     */
    className(): string;
}



declare class HighLightBlendPassMaterial extends PassQuadMaterialBase {
    map: Texture;
    texelSize: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    width: number;
    borderColor: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    borderOpacity: number;
    innerColor: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    innerOpacity: number;
    hightQuality: boolean;
    className(): string;
    setTexelSize(width: number, height: number): void;
    extendShaderShading(builder: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
}



declare class HistogramComputeMaterial extends PassPointsMaterialBase {
    tDiffuse: Texture;
    sampleResolution: number;
    clampedLuminanceThreshold: number;
    textureResolutionX: number;
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
    configBlend(): this;
}



declare function icosahedron(params: RegularPolyhedronShapeParameter): BufferGeometry;



declare function injectSerialize(inject: {
    serializeObject3D: typeof serializeObject3D;
    parseObjects: typeof parseObjects;
    deepCloneObject3D: typeof deepCloneObject3D;
    downloadStringAsFile: typeof downloadStringAsFile;
}): void;



declare class Interpolant {
    /**
     * Array of positions.
     */
    parameterPositions: any;
    /**
     * Array of samples.
     */
    sampleValues: any;
    /**
     * Number of samples.
     */
    valueSize: number;
    /**
     * Buffer to store the interpolation results.
     */
    resultBuffer: any;
    private _cacheIndex;
    private settings;
    protected DefaultSettings_: InterpolantSetting;
    private beforeStart_;
    private afterEnd_;
    constructor(parameterPositions: any, sampleValues: any, sampleSize: number, resultBuffer?: any);
    set cacheIndex(index: number);
    get cacheIndex(): number;
    /**
     * Evaluate the interpolant at position `t`.
     */
    evaluate(t: number): any;
    protected getSettings_(): InterpolantSetting;
    protected copySampleValue_(index: number): any;
    protected interpolate_(..._args: any[]): void;
    protected intervalChanged_(..._args: any[]): void;
}



declare interface InterpolantSetting {
    endingStart: number;
    endingEnd: number;
}



/**
 * Tests whether a 2D point lies inside a polygon.
 */
declare function isPointInsidePolygon(inPt: {
    x: number;
    y: number;
}, inPolygon: Array<{
    x: number;
    y: number;
}>): boolean;



declare class IterableWeakMap<K extends object, V> {
    private weakSet;
    private instanceId;
    private finalizationRegistry;
    set(key: K, value: V): void;
    get(key: K): V | undefined;
    delete(key: K): void;
    forEach(visitor: (v: V, k: K) => any): void;
    clear(): void;
}



declare class IterableWeakSet<V extends object> {
    private map;
    add(value: V): void;
    has(value: V): boolean;
    delete(value: V): void;
    forEach(visitor: (v: V) => any): void;
    clear(): void;
}



declare abstract class JsNoImplMaterial extends Material {
    extendShaderShape(_builder: ShaderBuilder, _registry: ShaderComponentRegistry): void;
    extendShaderShading(_builder: ShaderBuilder, _registry: ShaderComponentRegistry): void;
    computeShapeKey(_registry: ShaderComponentRegistry): string;
    updateShapeUniforms(_program: WGLProgram, _registry: ShaderComponentRegistry): void;
    updateShadingUniforms(_program: WGLProgram, _registry: ShaderComponentRegistry): void;
}



declare function lathe(params: Partial<LatheShapeParameter>): BufferGeometry;



declare class LatheBufferGeometry extends BufferGeometry {
    parameters: {
        points: Vector2[];
        segments: number;
        phiStart: number;
        phiLength: number;
    };
    /**
     * @param points Array of Vector2s. The x-coordinate of each point must be greater than zero.
     * @param segments — the number of circumference segments to generate. Default is 12.
     * @param phiStart — the starting angle in radians. Default is 0.
     * @param phiLength — the radian (0 to 2PI) range of the lathed section 2PI is a closed lathe, less than 2PI is a portion. Default is 2PI.
     * This creates a LatheBufferGeometry based on the parameters.
     */
    constructor(points: Vector2[], segments?: number, phiStart?: number, phiLength?: number);
}



declare interface LatheShapeParameter {
    points: Vector2[];
    segments: number;
    phiStart: number;
    phiLength: number;
}



/**
 * Give linear object a specific color.
 */
declare class LineBasicMaterial extends SceneClipMaterial {
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(p?: LineBasicMaterialParameters);
    /**
     * Let color become to gradient from one end to another end.
     */
    enableVertexColor: boolean;
    /**
     * @deprecated
     */
    bias: number;
    /**
     * The basic color of lines.
     * @tips change the color by {@link setValues| setValues()} that is a better way.
     */
    readonly color: ColorWithAlpha;
    /**
     * Generate a key to make engine know user changes attribute {@link enableVertexColor| enableVertexColor}.
     * This method may override in extended class.
     */
    generateShaderKey(r: ShaderComponentRegistry): string;
    /**
     * Change the corresponding attribute according to the values of given {@link LineBasicMaterialParameters| parameters}.
     * @param {LineBasicMaterialParameters} values a object of specified type contains parameters.
     */
    setValues(values?: LineBasicMaterialParameters): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Copy the data to this instance from other instance.
     * @param {LineBasicMaterial} other the source of copied data.
     */
    copy(other: LineBasicMaterial): this;
    /**
     * Return a cloned instance of this class.
     */
    clone(): LineBasicMaterial;
}



/**
 * Build a line from {@link v1 | v1 } to {@link v2 | v2 } in 3D space.
 */
declare class LineCurve3D extends Curve<Vector3> {
    isLineCurve3D: boolean;
    v1: Vector3;
    v2: Vector3;
    constructor(v1?: Vector3, v2?: Vector3);
    getPoint(t: number, optionalTarget?: Vector3): Vector3;
    getPointAt(u: number, optionalTarget?: Vector3): Vector3;
    clone(): LineCurve3D;
    copy(source: LineCurve3D): this;
    toJSON(): any;
    fromJSON(json: any): this;
}



/**
 * Draw the line with some segments. The color attribute extends from {@link LineBasicMaterial| LineBasicMaterial}.
 */
declare class LineDashedMaterial extends LineBasicMaterial {
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(p?: LineDashedMaterialParameters);
    /**
     * Use this instance to set dash's length.
     */
    dash: LineDash;
    /**
     * If this value is set to true, this object's scale do not change with zoom of camera.
     * @defaultValue `false`
     */
    enableViewIndependentDashScale: boolean;
    /**
     * Change the corresponding attribute according to the values of given {@link LineDashedMaterialParameters| parameters}.
     * @param {LineDashedMaterialParameters} values a object of specified type contains parameters.
     */
    setValues(values?: LineDashedMaterialParameters): void;
    /**
     * This method will be used automatically before
     * @param {Renderer} renderer instance of renderer for engine.
     */
    onBeforeRender: (renderer: Renderer) => void;
    /**
     * Copy the data to this instance from other instance.
     * @param {LineDashedMaterial} other the source of copied data.
     */
    copy(other: LineDashedMaterial): this;
    /**
     * Return a cloned instance of this class.
     */
    clone(): LineDashedMaterial;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
}



declare type LineDashedMaterialParameters = LineBasicMaterialParameters & Partial<Pick<LineDashedMaterial, 'enableViewIndependentDashScale'>> & LineDashParam;



/**
 * Event emitted when a material is disposed.
 */
declare const MaterialDisposeEvent: EventType<Material>;



/**
 * Event emitted when a material property changes.
 */
declare const MaterialPropertyChangeEvent: EventType<Material>;



/**
 * Event emitted when a material needs shader recompilation.
 */
declare const MaterialRecompileShaderEvent: EventType<Material>;



declare class MaterialShadingWithDynamicShapeDispatcher<M extends Material> extends ShapeExtractableDispatcher {
    material: M;
    constructor(material: M);
    className(): string;
    dispatchKey(r: ShaderComponentRegistry): string;
    updateUniforms(p: WGLProgram, reg: ShaderComponentRegistry, _origin: Material): void;
    extendShaderShading(b: ShaderBuilder, reg: ShaderComponentRegistry, _origin: Material): void;
    setState(renderer: Renderer, m: Material, drawable: Drawable): void;
}



/**
 * Math utility class containing scalar helpers.
 */
declare class _Math {
    /**
     * Two Pi.
     */
    static PI_2: number;
    /**
     * A coefficient changes degree to radius.
     */
    static DEG2RAD: number;
    /**
     * A coefficient changes radius to degree.
     */
    static RAD2DEG: number;
    /**
     * Return an unique string in whole runtime.
     */
    static generateUUID(): string;
    /**
     * Return the mid number of given three.
     */
    static clamp(value: number, min: number, max: number): number;
    /**
     * compute {@link https://en.wikipedia.org/wiki/Modulo_operation| euclidean modulo} of m % n.
     */
    static euclideanModulo(n: number, m: number): number;
    /**
     * Linear mapping from range <a1, a2> to range <b1, b2>.
     */
    static mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number;
    /**
     * {@link https://en.wikipedia.org/wiki/Linear_interpolation | Linear interpolation}
     */
    static lerp(x: number, y: number, t: number): number;
    /**
     * {@link http://en.wikipedia.org/wiki/Smoothstep | Smoothstep }
     */
    static smoothstep(x: number, min: number, max: number): number;
    /**
     * Use the fifth power of x function to get result between min and max.
     */
    static smootherstep(x: number, min: number, max: number): number;
    /**
     * Random integer from <low, high> interval.
     */
    static randInt(low: number, high: number): number;
    /**
     * Random float from <low, high> interval.
     */
    static randFloat(low: number, high: number): number;
    /**
     * Random float from <-range/2, range/2> interval.
     */
    static randFloatSpread(range: number): number;
    /**
     * Change degree to radius.
     */
    static degToRad(degrees: number): number;
    /**
     * Change radius to degree.
     */
    static radToDeg(radians: number): number;
    /**
     * Return `true` if value is a power of 2.
     */
    static isPowerOfTwo(value: number): boolean;
    /**
     * Returns the smallest power of 2 that is greater than or equal to value.
     */
    static ceilPowerOfTwo(value: number): number;
    /**
     * Returns the largest power of 2 that is less than or equal to value.
     */
    static floorPowerOfTwo(value: number): number;
    /**
     * Returns the smallest or largest power of 2 which is closer to value.
     */
    static nearestPowerOfTwo(value: number): number;
    /**
     * Calculate the value at t of Catmull-Rom spline which through p0, p1, p2 and p3.
     */
    static CatmullRom(t: number, p0: number, p1: number, p2: number, p3: number): number;
    /**
     * Calculate the value at t of Bezier Curve which is controlled by p0, p1 and p2.
     */
    static QuadraticBezier(t: number, p0: number, p1: number, p2: number): number;
    /**
     * Calculate the value at t of Bezier Curve which is controlled by p0, p1, p2 and p3.
     */
    static CubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number;
    /**
     * Compute values of the standard normal distribution, the results will contain (2*kernelRadius + 1) numbers.
     */
    static ComputeGaussianWeights(kernelRadius: number): number[];
    /**
     * Compute values of the normal distribution with given sigma, the results will contain (kernelRadius + 1) numbers.
     */
    static CreateSampleWeights(kernelRadius: number, stdDev?: number): number[];
    /**
     * Compute the summary of array's elements whose index between 'from' and 'to'.
     */
    static SumArraySection(array: number[], from: number, to: number): number;
}



declare const MemoryGrowFailed: EventType<never>;



declare function mergeBufferGeometries(geometries: BufferGeometry[], useGroups: boolean, matrix: Matrix4[]): BufferGeometry;



/**
 * merge given buffer geometries into one
 * @returns merged geometries & each geometry's range in merged geometry(same index as input)
 */
declare function mergeBufferGeometries2(geometries: BufferGeometry[], useGroups: boolean, matrix: Matrix4[]): {
    geometry: BufferGeometry;
    ranges: BufferRange[][];
};



declare const MergedMeshPhongMaterialDataTextureSchema: DataTextureSchemaInstance<MeshPhongMaterial_2<Texture2D>>;



/**
 * Combine all {@link attributes| attributes} of external geometry and this geometry.
 * @param {BufferGeometry} geometry all attributes of this geometry will be moved.
 * @param {number} offset the begin position to store data,
 * only the data in 0-offset*{@link BufferAttribute.itemSize| itemSize } of {@link BufferAttribute.array| array } can be retain.
 */
declare function mergeTheOtherIntoSelf(me: BufferGeometry, geometry: BufferGeometry, offset: number): void;



/**
 * Material that shades meshes by their normals.
 */
declare class MeshNormalMaterial extends SceneMaterial {
    className(): string;
    isUsingWorldSpace: boolean;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(_: WGLProgram): void;
    clone(): MeshNormalMaterial;
    copy(m: MeshNormalMaterial): this;
}



declare class MixColorAndDepthMaterial extends CopyMaterial {
    depth: Texture;
    blending: Blending;
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
}



declare class MixOITMaterial extends PassQuadMaterialBase {
    accumColor: Texture;
    accumAlpha: Texture;
    constructor();
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(p: WGLProgram): void;
}



declare class MixPlanarShadowMaterial extends PassQuadMaterialBase {
    tDiffuse: Texture;
    occlusionMap: Texture;
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(p: WGLProgram): void;
}



/**
 * Per-model color and depth parameters for panoramic environment materials.
 */
declare class ModelParameter {
    static shaderStruct: string;
    static shaderEffect: string;
    color: Vector4;
    depth: number;
    updateUniforms(program: WGLProgram, prefix: string): void;
}



declare function needRebuild(object: Mesh, thresholdAngle: number): boolean;



declare const Object3DChangeEvent: EventType<never>;



declare function octahedron(params: RegularPolyhedronShapeParameter): BufferGeometry;



declare class OITMaterial extends SceneMaterial {
    constructor();
    className(): string;
    extendShaderShading(builder: ShaderBuilder): void;
    updateShadingUniforms(_p: WGLProgram): void;
    copy(other: OITMaterial): this;
    clone(): OITMaterial;
}



declare interface OpentypeFont {
    names: {
        fontFamily: any;
    };
    ascender: number;
    descender: number;
    unitsPerEm: number;
    charToGlyph: (char: string) => OpentypeGlyph;
    isCIDFont?: boolean;
}



declare interface OpentypeGlyph {
    advanceWidth: number;
    path: OpentypePath | (() => OpentypePath);
}



declare interface OpentypePath {
    commands: PathCommand[];
}



declare class OutlineComposeMaterial extends PassQuadMaterialBase {
    tDiffuse: Texture;
    texelSize: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    color: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    highQuality: boolean;
    className(): string;
    setTexelSize(width: number, height: number): void;
    generateShaderKey(): string;
    extendShaderShading(builder: ShaderBuilder): void;
    updateShadingUniforms(p: WGLProgram): void;
}



declare class OutlineComputeMaterial extends PassQuadMaterialBase {
    transparent: boolean;
    indexNormalMap: Texture;
    texelSize: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    depthMap: Nullable<Texture>;
    cameraInverseProjectionMatrix: Matrix4;
    highQuality: boolean;
    enableDepth: boolean;
    edgeThickness: Vector4;
    coefficient: Vector4;
    className(): string;
    setTexelSize(width: number, height: number): void;
    generateShaderKey(r: ShaderComponentRegistry): string;
    extendShaderShading(builder: ShaderBuilder): void;
    updateShadingUniforms(p: WGLProgram): void;
}



declare class OutlineEncodeMaterial extends SceneMaterial {
    encodeId: number;
    mergedCounts: number;
    className(): string;
    copy(other: OutlineEncodeMaterial): this;
    clone(): OutlineEncodeMaterial;
    updateShadingUniforms(program: WGLProgram): void;
    extendShaderShading(builder: ShaderBuilder): void;
}



declare abstract class PanoBackGroundMaterial extends Material {
    extendShaderShape(builder: ShaderBuilder, _: ShaderComponentRegistry): void;
    computeShapeKey(_: ShaderComponentRegistry): string;
    updateShapeUniforms(_1: WGLProgram, _: ShaderComponentRegistry): void;
}



/**
 * Material that renders a panoramic environment map with selectable regions.
 */
declare class PanoEnvMapMaterial<T extends TextureCube | TextureV2 = TextureCube> extends PanoBackGroundMaterial {
    cubeMapBackground: T;
    indexBackground: T;
    selectedColorId: number;
    hoverColor: Readonly<Pick<ReadonlyMarked<Vector3>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "z" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "angleTo">>;
    private _globalParams;
    private _params;
    get globalParams(): GlobalParams;
    set globalParams(value: GlobalParams);
    updateGlobalParams(value: GlobalParams): void;
    get params(): ModelParameter[];
    set params(value: ModelParameter[]);
    updateParams(value: ModelParameter[]): void;
    className(): string;
    private readonly getColorIdShader;
    updateShadingUniforms(program: WGLProgram, _: ShaderComponentRegistry): void;
    traverseTexture(visitor: (tex: Texture) => void): void;
    generateShaderKey(r: ShaderComponentRegistry): string;
    extendShaderShading(b: ShaderBuilder, _: ShaderComponentRegistry): void;
    clone(): PanoEnvMapMaterial<T>;
    copy(other: PanoEnvMapMaterial<T>): this;
}



/**
 * Material that renders selection identifiers from a cube-map background.
 */
declare class PanoSelectionMaterial<T extends TextureCube | TextureV2 = TextureCube> extends PanoBackGroundMaterial {
    indexBackground: T;
    className(): string;
    extendShaderShading(b: ShaderBuilder, _: ShaderComponentRegistry): void;
    traverseTexture(visitor: (tex: Texture) => void): void;
    updateShadingUniforms(program: WGLProgram): void;
    clone(): PanoSelectionMaterial<T>;
    copy(other: PanoSelectionMaterial<T>): this;
}



declare function Parametric(params: Partial<ParametricShapeParameter>): BufferGeometry;



declare class ParametricBufferGeometry extends BufferGeometry {
    parameters: {
        func: (u: number, v: number, w: Vector3) => Vector3;
        slices: number;
        stacks: number;
    };
    /**
     * @param func A function that takes in a u and v value each between 0 and 1 and modifies a third Vector3 argument.
     * @param slices The count of slices to use for the parametric function.
     * @param stacks The count of stacks to use for the parametric function.
     */
    constructor(func: (u: number, v: number, w: Vector3) => Vector3, slices: number, stacks: number);
}



declare interface ParametricShapeParameter {
    func: (u: number, v: number, w: Vector3) => Vector3;
    slices: number;
    stacks: number;
}



declare let parseObjects: typeof parseObjects_2;



declare function parseObjects_2(data: any, geoBuffer: ArrayBuffer[], objectId: string[]): Promise<Object3D[]>;



declare abstract class PassPointsMaterialBase extends Material {
    constructor(params?: MaterialParameters);
    extendShaderShape(_builder: ShaderBuilder): void;
    computeShapeKey(): string;
    updateShapeUniforms(_1: WGLProgram): void;
    copy(_: PassPointsMaterialBase): this;
    clone(): this;
}



declare abstract class PassQuadMaterialBase extends Material {
    constructor(params?: MaterialParameters);
    extendShaderShape(builder: ShaderBuilder): void;
    className(): string;
    computeShapeKey(): string;
    updateShapeUniforms(_1: WGLProgram): void;
    copy(_: PassQuadMaterialBase): this;
    clone(): this;
}



/**
 * The class provides methods for creating paths and contours of 2D shapes similar to the 2D Canvas API.
 */
declare class Path extends Curve2D {
    /**
     * Store all the drawn curves into this.
     */
    curves: Curve2D[];
    /**
     * Automatically closes the path.
     */
    autoClose: boolean;
    /**
     * Cache values if curves and cache array are same length.
     */
    cacheLengths?: number[];
    /**
     * Record the latest point's position.
     */
    currentPoint: Vector2;
    constructor(points?: Vector2[]);
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Add a curve to this path.
     */
    add(curve: Curve2D): void;
    /**
     * Add a line curve if start and end of lines are not connected.
     */
    closePath(): void;
    /**
     * Return the point at specified position index of whole curves.
     * @param t proportion from 0 - 1.
     */
    getPoint(t: number): Vector2;
    /**
     * We cannot use the default {@link getPoint| getPoint} with getLength() because in curve,
     * getLength() depends on getPoint() but in {@link getPoint| getPoint} depends on getLength().
     */
    getLength(): number;
    /**
     * Compute lengths and cache them.
     * We cannot overwrite getLengths() because UtoT mapping uses it.
     */
    updateArcLengths(): void;
    /**
     * Return the length of every curves.
     */
    getCurveLengths(): number[];
    /**
     * Return points array which the numbers equals to 'divisions'.
     * Each pair of points has same space between them.
     * Default return 40 points.
     */
    getSpacedPoints(divisions?: number): Vector2[];
    /**
     * Return all points from all {@link curves| curves}.
     */
    getPoints(divisions?: number): Vector2[];
    /**
     * Use line to connect points one by one.
     */
    setFromPoints(points: Vector2[]): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    quadraticCurveTo(aCPx: number, aCPy: number, aX: number, aY: number): void;
    bezierCurveTo(aCP1x: number, aCP1y: number, aCP2x: number, aCP2y: number, aX: number, aY: number): void;
    splineThru(pts: Vector2[]): void;
    arc(aX: number, aY: number, aRadius?: number, aStartAngle?: number, aEndAngle?: number, aClockwise?: boolean, divisions?: number, isFill?: boolean): void;
    absArc(aX: number, aY: number, aRadius?: number, aStartAngle?: number, aEndAngle?: number, aClockwise?: boolean, divisions?: number, isFill?: boolean): void;
    ellipse(aX: number, aY: number, xRadius: number, yRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean, aRotation: number, isFill?: boolean): void;
    absEllipse(aX?: number, aY?: number, xRadius?: number, yRadius?: number, aStartAngle?: number, aEndAngle?: number, aClockwise?: boolean, aRotation?: number, divisions?: number, isFill?: boolean): void;
    getBounds(bounds?: Box2): Box2;
    clone(): Path;
    copy(source: Path): this;
    toJSON(): any;
    fromJSON(json: any): this;
}



declare type PathCommand = {
    type: 'M';
    x: number;
    y: number;
} | {
    type: 'L';
    x: number;
    y: number;
} | {
    type: 'C';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x: number;
    y: number;
} | {
    type: 'Q';
    x1: number;
    y1: number;
    x: number;
    y: number;
} | {
    type: 'Z';
};



/**
 * SpottedShaderComponent controls the use of spotted effect.
 * This is coming from outside.
 */
declare class PatternShaderComponent<T extends TextureV2 | Texture2D = Texture2D> extends ShaderComponent {
    constructor();
    pattern: T;
    textureSize: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    scale: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    offset: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    screenSpaceEnabled: boolean;
    overrideSrcColor?: Color;
    readonly blendConfig: ShaderBlend<T>;
    className(): string;
    setValues(values: PatternShaderComponentParameter<T>): void;
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void;
    copy(other: PatternShaderComponent<T>): this;
    clone(): PatternShaderComponent<T>;
    extendShaderShading(builder: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
    generateShaderKey(): string;
}



declare type PatternShaderComponentParameter<T extends TextureV2 | Texture2D = Texture2D> = ConvertMaterialParameters<Pick<PatternShaderComponent<T>, 'pattern' | 'scale' | 'offset' | 'textureSize' | 'screenSpaceEnabled' | 'overrideSrcColor'>> & ShaderBlendParameter;



/**
 * Pattern layout methods supported by paving shader components.
 */
declare enum PavingMethod {
    ContinuousStraight = 0,
    IPattern = 1,
    ThreeSixNine = 2,
    Herringbone = 3,
    HexagonPattern = 4,
    Fishbone = 5
}



/**
 * Shader component that applies paving-style texture patterns.
 */
declare class PavingShaderComponent<T extends TextureV2 | Texture2D = Texture2D> extends ShaderComponent {
    constructor();
    tileTexture: Texture;
    tileSize: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    outlineSize: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    tileCount: number;
    private _randomTexture;
    get randomTexture(): T;
    set randomTexture(v: T);
    private randomSize;
    private __hashId;
    private _hashId;
    get hashId(): string;
    set hashId(value: string);
    gapTexture: Nullable<Texture>;
    gapSize: number;
    gapColor: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    isRealGap: number;
    alignPos: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    offset: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    rotateAngle: number;
    pavingMethod: PavingMethod;
    fishboneAngle: number;
    className(): string;
    updateShadingUniforms(program: WGLProgram): void;
    extendShaderShading(builder: ShaderBuilder): void;
    generateShaderKey(): string;
    copy(other: PavingShaderComponent<T>): this;
    clone(): PavingShaderComponent<T>;
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void | Promise<void>;
    private hashCode;
}



/**
 * Material facade for physically based shading.
 * @deprecated
 */
declare class PhysicalMaterial extends JsNoImplMaterial {
    className(): string;
    transparentMask: boolean;
    diffuse: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    specular: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    roughness: number;
    refract: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    emission: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    opacity: number;
    diffuseMap: Nullable<Texture2D | TextureV2>;
    specularMap: Nullable<Texture2D | TextureV2>;
    refractMap: Nullable<Texture2D | TextureV2>;
    glossMap: Nullable<Texture2D | TextureV2>;
    clone(): PhysicalMaterial;
    copy(other: PhysicalMaterial): this;
}



declare interface PipelineAPI {
    materialDispatcherCreate(m: MaterialDispatcher): void;
    materialDispatcherDestroy(m: MaterialDispatcher): void;
    materialDispatcherUpdate(m: MaterialDispatcher): void;
    drawableListCreate(list: DrawableList, capacity?: number): void;
    drawableListCreateFromScene(list: DrawableList, scene: Scene3D, isUseProxy: boolean, renderMode?: DrawableRenderMode): void;
    drawableListCreateFromFilter(list: DrawableList, filter: IPipelineFilter<Drawable>, target: DrawableList): void;
    drawableListAddDrawable(list: DrawableList, drawable: Drawable): void;
    drawableListUpdateSceneAndUse(list: DrawableList, scene: Scene3D): void;
    drawableListDestroy(list: DrawableList): void;
    drawcallListCreate(list: ProjectedDrawcallList, camera: Camera, cameraCulling: boolean, classifyType: DrawcallListClassifyType, enableLights: boolean): void;
    drawcallListCreateFromDynamic(list: ProjectedDrawcallList, scene: Scene3D, camera: Camera): void;
    drawcallListCreateFromStatic(list: ProjectedDrawcallList, scene: Scene3D, camera: Camera): void;
    drawcallListCreateFromDrawableList(list: ProjectedDrawcallList, drawableList: DrawableList, camera: Camera, cameraCulling: boolean, layerCulling: boolean, visibilityCulling: boolean, selections?: Array<{
        groupIndex?: number[];
        instanceIndex?: number;
    }>): void;
    drawcallListDestroy(list: ProjectedDrawcallList): void;
    renderDrawcallList(list: ProjectedDrawcallList, renderer: IRenderer, renderObjectsType: RenderObjectsType, filter?: IPipelineFilter<Drawcall>): void;
    renderDeferLight(renderer: IRenderer, scene: Scene3D, light: Light, shadowMode: ShadowMode, deferMesh: Drawable, deferCamera: Camera): void;
    renderDeferLights(renderer: IRenderer, scene: Scene3D, lights: Light[], shadowMode: ShadowMode, deferMesh: Drawable, deferCamera: Camera): void;
    getRenderListLength(list: ProjectedDrawcallList, renderObjectsType: RenderObjectsType): number | undefined;
    drawcallListGetCameraClosestDistance(list: DrawableList, camera: Camera): number | undefined;
    prepareTempRenderList(list: Object3D[]): void;
    cleanupTempRenderList(list: Object3D[]): void;
}



declare const PipelineFilters: {
    isOutlineEncode: () => IPipelineFilter<Drawcall>;
    isOutlineDisable: () => IPipelineFilter<Drawcall>;
    isDeferPhong: (overrideTransparent: boolean) => IPipelineFilter<Drawcall>;
    isNotDeferPhong: () => IPipelineFilter<Drawcall>;
    isDeferTransparent: (overrideTransparent: boolean) => IPipelineFilter<Drawcall>;
    planarShadowCaster: (maxGroundHeight: number) => IPipelineFilter<Drawcall>;
    planarShadowReceiver: (maxGroundHeight: number, maxGroundThickness: number) => IPipelineFilter<Drawcall>;
    planarShadowExclude: (maxGroundHeight: number, maxGroundThickness: number) => IPipelineFilter<Drawcall>;
    transparentLineNormal: () => IPipelineFilter<Drawcall>;
    transparentLineNotNormal: () => IPipelineFilter<Drawcall>;
    transparentLineAdditional: () => IPipelineFilter<Drawcall>;
    isDrawCallShadowMapCaster: () => IPipelineFilter<Drawcall>;
    isInsideCone: (cone: Cone) => IPipelineFilter<Drawable<Material, BufferGeometryBase>>;
    isDrawableShadowMapCaster: () => IPipelineFilter<Drawable<Material, BufferGeometryBase>>;
    transparentLineNotNormalDrawable: () => IPipelineFilter<Drawable<Material, BufferGeometryBase>>;
};



declare class PlanarShadowDispatcher extends MaterialShadingWithDynamicShapeDispatcher<PlanarShadowMaterial> {
    private shadowPlane;
    private lightDirection;
    constructor(m: PlanarShadowMaterial);
    className(): string;
    createBuilder(): ShaderBuilder;
    updateUniforms(p: WGLProgram, reg: ShaderComponentRegistry, origin: Material): void;
    updateShadowMatrix(): void;
}



declare class PlanarShadowMaterial extends SceneMaterial {
    intensity: number;
    className(): string;
    updateShadingUniforms(program: WGLProgram): void;
    extendShaderShading(b: ShaderBuilder): void;
    copy(other: PlanarShadowMaterial): this;
    clone(): PlanarShadowMaterial;
}



declare function plane(param: Partial<PlaneShapeParameter>): BufferGeometry;



declare interface PlaneShapeParameter {
    width: number;
    height: number;
    widthSegments: number;
    heightSegments: number;
}



declare class Platform {
    private static instance;
    desktop: boolean;
    mobile: boolean;
    ios: boolean;
    android: boolean;
    windows: boolean;
    openHarmony: boolean;
    isSafari: boolean;
    isChromeMac: boolean;
    ua: string;
    constructor();
    static getInstance(): Platform;
}



/**
 * A class to define a shape via user defined co-ordinates.
 */
declare class Polygon extends Shape {
    /**
     * The type of the object, mainly used to avoid 'instanceof' checks.
     */
    type: string;
    /**
     * @param points This can be an array of Points.
     */
    points: number[];
    constructor(points?: number[]);
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Add this polygon to drawing.
     */
    draw(): void;
    /**
     * Creates a clone of this polygon.
     * @return a copy of the polygon
     */
    clone(): Polygon;
    /**
     * Checks whether the x and y coordinates passed to this function are contained within this polygon.
     * @param x The X coordinate of the point to test.
     * @param y The Y coordinate of the point to test.
     * @return Whether the x/y coordinates are within this polygon.
     */
    contains(x: number, y: number): boolean;
}



declare function polyhedron(parameters: Partial<PolyhedronShapeParameter>): BufferGeometry;



/**
 * @param vertices Array of points of the form [1,1,1, -1,-1,-1, ... ].
 * @param indices Array of indices that make up the faces of the form [0,1,2, 2,3,0, ... ].
 * @param radius The radius of the final shape.
 * @param detail How many levels to subdivide the geometry. The more detail, the smoother the shape.
 */
declare interface PolyhedronShapeParameter {
    vertices: number[];
    indices: number[];
    radius: number;
    detail: number;
}



declare class PreSkyMapMaterial extends PassQuadMaterialBase {
    luminance: number;
    turbidity: number;
    rayleigh: number;
    mieCoefficient: number;
    mieDirectionalG: number;
    up: ReadonlyVector3;
    className(): string;
    updateShadingUniforms(p: WGLProgram): void;
    extendShaderShading(builder: ShaderBuilder, _: any): void;
}



declare const projectName = "ExaGraphics Graphics System";



declare class PseudoColorMaterial extends PassQuadMaterialBase {
    hdr: Texture;
    version: number;
    colors: number[];
    gradations: number[];
    className(): string;
    generateShaderKey(r: ShaderComponentRegistry): string;
    updateShadingUniforms(program: WGLProgram): void;
    extendShaderShading(b: ShaderBuilder): void;
}



/**
 * Build a Quadratic-Bezier curve by {@link v0 | v0 }, {@link v1 | v1 } and {@link v2 | v2 } in 3D {@link Path | Path }.
 */
declare class QuadraticBezierCurve2D extends Curve2D {
    isQuadraticBezierCurve3D: boolean;
    v0: Vector2;
    v1: Vector2;
    v2: Vector2;
    constructor(v0?: Vector2, v1?: Vector2, v2?: Vector2);
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void;
    className(): string;
    getPoint(t: number, optionalTarget?: Vector2): Vector2;
    clone(): QuadraticBezierCurve2D;
    copy(source: QuadraticBezierCurve2D): this;
    toJSON(): any;
    fromJSON(json: any): this;
}



/**
 * Build a Quadratic-Bezier curve by {@link v0 | v0 }, {@link v1 | v1 } and {@link v2 | v2 } in 3D {@link Path | Path }.
 */
declare class QuadraticBezierCurve3D extends Curve<Vector3> {
    isQuadraticBezierCurve3D: boolean;
    v0: Vector3;
    v1: Vector3;
    v2: Vector3;
    constructor(v0?: Vector3, v1?: Vector3, v2?: Vector3);
    getPoint(t: number, optionalTarget?: Vector3): Vector3;
    clone(): QuadraticBezierCurve3D;
    copy(source: QuadraticBezierCurve3D): this;
    toJSON(): any;
    fromJSON(json: any): this;
}



/**
 * Factory helpers that create readonly math value wrappers.
 */
declare const readonlyMath: {
    color: (color_or_r?: string | Color | number, g?: number, b?: number) => Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    vec2: (x?: number, y?: number) => Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    vec3: (x?: number, y?: number, z?: number) => Readonly<Pick<ReadonlyMarked<Vector3>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "z" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "angleTo">>;
    vec4: (x?: number, y?: number, z?: number, w?: number) => Readonly<Pick<ReadonlyMarked<Vector4>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "z" | "getNumberCount" | "toArray" | "length" | "w" | "dot" | "lengthSq" | "manhattanLength">>;
    mat3: () => Readonly<Pick<ReadonlyMarked<Matrix3>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "getNumberCount" | "toArray" | "elements" | "applyToBufferAttribute" | "determinant" | "transposeIntoArray" | "applyToArray" | "applyInverse" | "decompose">>;
    mat4: () => Readonly<Pick<ReadonlyMarked<Matrix4>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "getNumberCount" | "toArray" | "elements" | "applyToBufferAttribute" | "determinant" | "applyToArray" | "decompose" | "extractBasis" | "getPosition" | "getMaxScaleOnAxis" | "decompose2D">>;
};



/**
 * Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its width and its height.
 */
declare class Rectangle extends Shape {
    /**
     * The X coordinate of the upper-left corner of the rectangle.
     */
    x: number;
    /**
     * The Y coordinate of the upper-left corner of the rectangle.
     */
    y: number;
    /**
     * Width component.
     */
    width: number;
    /**
     * Height component.
     */
    height: number;
    /**
     * The type of the object, mainly used to avoid 'instanceof' checks.
     */
    readonly type = "Rectangle";
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * @param x The X coordinate of the upper-left corner of the rounded rectangle.
     * @param y The Y coordinate of the upper-left corner of the rounded rectangle.
     * @param width The overall width of this rounded rectangle.
     * @param height The overall height of this rounded rectangle.
     */
    constructor(x?: number, y?: number, width?: number, height?: number);
    /**
     * Creates a clone of this Rectangle.
     * @return a copy of the rectangle.
     */
    clone(): Rectangle;
    /**
     * Checks whether the x and y coordinates given are contained within this Rectangle.
     * @param x The X coordinate of the point to test.
     * @param y The Y coordinate of the point to test.
     * @return Whether the x/y coordinates are within this Rectangle.
     */
    contains(x: number, y: number): boolean;
    /**
     * Add this rectangle to drawing.
     */
    draw(): void;
}



/**
 * Shader block for rectangle area-light Blinn-Phong evaluation.
 */
declare const RectAreaBlinnPhong: ShaderBlock;



declare function registerContentAPI(api: ContentAPI): void;



declare function registerGlobal3DRendererOverride(f: (p: RendererParameters) => IRenderer): void;



declare function registerManagedContentAPI(api: ContentManagedAPI): void;



declare function registerPipelineContentAPI(api: PipelineAPI): void;



declare type RegularPolyhedronShapeParameter = Omit<Partial<PolyhedronShapeParameter>, 'vertices' | 'indices'>;



declare function removeManagedContentAPI(): void;



declare function removePipelineContentAPI(): void;



declare class RenderCtxInfo {
    vendor: string;
    renderer: string;
    constructor(gl?: WebGLRenderingContext | WebGL2RenderingContext, extensions?: WGLExtensions);
    output(): string;
}



declare enum RendererState {
    Initializing = 0,
    Ready = 1,
    ContextLost = 2,
    Destroyed = 3
}



declare interface RendererStatus {
    state: RendererState;
    initialized: Promise<void>;
}



/**
 * Event emitted after a render pass completes.
 */
declare const RenderOverEvent: EventType<never>;



/**
 * Every normal vector in a geometry will have a magnitude of 1. geometry will correct lighting on the geometry surfaces.
 */
declare function reNormalize(geometry: BufferGeometry): void;



declare function resetGlobal3DRendererOverride(): void;



/**
 * Event emitted when the renderer has been reset
 */
declare const ResetRendererEvent: EventType<never>;



declare function ring(params: Partial<RingParameter>): BufferGeometry;



declare class RingBufferGeometry extends BufferGeometry {
    parameters: {
        innerRadius: number;
        outerRadius: number;
        thetaSegments: number;
        phiSegments: number;
        thetaStart: number;
        thetaLength: number;
    };
    /**
     * @param innerRadius The radius of inner round. Default is 0.5.
     * @param outerRadius The radius of outter round. Default is 1.
     * @param thetaSegments Number of segments. A higher number means the ring will be more round. Minimum is 3. Default is 8.
     * @param phiSegments Minimum is 1. Default is 1.
     * @param thetaStart Starting angle. Default is 0.
     * @param thetaLength Central angle. Default is Math.PI * 2.
     */
    constructor(innerRadius?: number, outerRadius?: number, thetaSegments?: number, phiSegments?: number, thetaStart?: number, thetaLength?: number);
}



declare interface RingParameter {
    innerRadius: number;
    outerRadius: number;
    thetaSegments: number;
    phiSegments: number;
    thetaStart: number;
    thetaLength: number;
}



/**
 * Material that renders a textured room-box environment.
 */
declare class RoomBoxMaterial<T extends TextureV2 | Texture2D = Texture2D> extends SceneMaterial {
    texture: T;
    enableToneMap: boolean;
    enableMidground: boolean;
    enableCurtains: boolean;
    midgroundDepth: number;
    className(): string;
    copy(other: RoomBoxMaterial<T>): this;
    clone(): RoomBoxMaterial<T>;
    constructor(p?: RoomBoxMaterialParameter<T>);
    setValues(values?: RoomBoxMaterialParameter<T>): void;
    extendShaderShading(builder: ShaderBuilder, _: ShaderComponentRegistry): void;
    updateShadingUniforms(program: WGLProgram, _: ShaderComponentRegistry): void;
}



declare type RoomBoxMaterialParameter<T extends TextureV2 | Texture2D = Texture2D> = MaterialParameters & {
    texture?: T;
};



/**
 * The Rounded Rectangle object is an area that has nice rounded corners, as indicated by its
 * top-left corner point (x, y) and by its width and its height and its radius.
 */
declare class RoundedRectangle extends Shape {
    /**
     * The X coordinate of the upper-left corner of the rounded rectangle.
     */
    x: number;
    /**
     * The Y coordinate of the upper-left corner of the rounded rectangle.
     */
    y: number;
    /**
     * The overall width of this rounded rectangle.
     */
    width: number;
    /**
     * The overall height of this rounded rectangle.
     */
    height: number;
    /**
     * Controls the radius of the rounded corners.
     */
    radius: number;
    /**
     * The type of the object, mainly used to avoid 'instanceof' checks.
     */
    type: string;
    /**
     * @param x The X coordinate of the upper-left corner of the rounded rectangle
     * @param y The Y coordinate of the upper-left corner of the rounded rectangle
     * @param width The overall width of this rounded rectangle
     * @param height The overall height of this rounded rectangle
     * @param radius Controls the radius of the rounded corners
     */
    constructor(x?: number, y?: number, width?: number, height?: number, radius?: number);
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Creates a clone of this Rounded Rectangle.
     * @return a copy of the rounded rectangle
     */
    clone(): RoundedRectangle;
    /**
     * Add this roundedRectangle to drawing.
     */
    draw(): void;
    /**
     * Checks whether the x and y coordinates given are contained within this Rounded Rectangle.
     * @param x The X coordinate of the point to test.
     * @param y The Y coordinate of the point to test.
     * @return Whether the x/y coordinates are within this Rounded Rectangle.
     */
    contains(x: number, y: number): boolean;
}



/**
 * Event emitted when the viewer encounters a fatal runtime error.
 */
declare const RuntimeFatalErrorEvent: EventType<never>;



declare let serializeObject3D: typeof serializeObject3D_2;



declare function serializeObject3D_2(objects: Object3D[]): {
    data: any;
    geoBuffer: ArrayBuffer[];
    objectId: string[];
};



declare function setSortSplats(fn: typeof sortSplats): void;



declare function setupWebGLCapabilities(gl: WebGLRenderingContext | WebGL2RenderingContext, parameters: RendererParameters, extensions: WGLExtensions): void;



declare function setupWebGLLimits(gl: WebGLRenderingContext | WebGL2RenderingContext, limits: Limits): WebGLLimits;



declare function setupWebGPUCapabilities(d: any, info: TextureCompressionSupportedInfo, parameters: RendererParameters): void;



declare function setupWebGPUCompressedTextureCapabilities(info: TextureCompressionSupportedInfo): void;



declare class ShaderBlend<T extends TextureV2 | Texture2D = Texture2D> {
    private readonly parent;
    constructor(parent: PatternShaderComponent<T>);
    setValues(values: ShaderBlendParameter): void;
    private _shaderBlendSrc;
    private _shaderBlendDst;
    private _shaderBlendEquation;
    private _shaderBlendSrcAlpha;
    private _shaderBlendDstAlpha;
    private _shaderBlendEquationAlpha;
    get shaderBlendSrc(): BlendingFactor;
    set shaderBlendSrc(value: BlendingFactor);
    get shaderBlendDst(): BlendingFactor;
    set shaderBlendDst(value: BlendingFactor);
    get shaderBlendEquation(): BlendingEquation;
    set shaderBlendEquation(value: BlendingEquation);
    get shaderBlendSrcAlpha(): BlendingFactor;
    set shaderBlendSrcAlpha(value: BlendingFactor);
    get shaderBlendDstAlpha(): BlendingFactor;
    set shaderBlendDstAlpha(value: BlendingFactor);
    get shaderBlendEquationAlpha(): BlendingEquation;
    set shaderBlendEquationAlpha(value: BlendingEquation);
    generateShaderKey(): string;
    generateShader(blendSrc: string, blendDst: string, result: string): string;
    copy(other: ShaderBlend<T>): void;
    private static factor;
}



declare const shaderBlendKeys: string[];



declare type ShaderBlendParameter = ConvertMaterialParameters<Pick<ShaderBlend, 'shaderBlendSrc' | 'shaderBlendDst' | 'shaderBlendEquation' | 'shaderBlendSrcAlpha' | 'shaderBlendDstAlpha' | 'shaderBlendEquationAlpha'>>;



declare enum ShadowMode {
    EnableAll = 10,
    DisableCsm = 20,
    DisableAll = 30
}



/**
 * Defines a 2d shape plane which uses paths.
 */
declare class Shape extends Path {
    /**
     * Make a 2d shaped hole on this shaped plane.
     */
    holes: Path[];
    protected _isInvalid: boolean;
    constructor(points?: Vector2[]);
    invalidate(): void;
    className(): string;
    /**
     * Make a 2d shaped hole on this shaped plane.
     */
    getPoints(divisions?: number): Vector2[];
    draw(): void;
    /**
     * Get points of holes (key points based on segments parameter).
     */
    getPointsHoles(divisions?: number): Vector2[][];
    /**
     * Get points of shape and holes (key points based on segments parameter).
     */
    extractPoints(divisions?: number): {
        shape: Vector2[];
        holes: Vector2[][];
    };
    /**
     * Return an object with two arrays store the points and holes.
     */
    extractArray(divisions?: number): {
        points: number[];
        holes: number[][];
    };
    copy(source: Shape): this;
    toJSON(): any;
    fromJSON(json: any): this;
    static area(contour: Vector2[]): number;
    static isClockWise(pts: Vector2[]): boolean;
    /**
     * Triangulate the shape into faces.
     */
    static triangulateShape(contour: Vector2[], holes: Vector2[][], dim?: number): number[][];
}



declare function shape(param: ShapeShapeParameter): BufferGeometry;



declare const shapeBuilder: typeof shapeBuilderImport;



declare namespace shapeBuilderImport {
    export {
        box,
        BoxShapeParameter,
        circle,
        CircleShapeParameter,
        cylinder,
        cone,
        CylinderShapeParameter,
        plane,
        PlaneShapeParameter,
        sphere,
        SphereShapeParameter,
        SphereBufferGeometry,
        shape,
        ShapeShapeParameter,
        torus,
        TorusShapeParameter,
        tetrahedron,
        octahedron,
        icosahedron,
        dodecahedron,
        polyhedron,
        PolyhedronShapeParameter,
        extrude,
        text,
        ExtrudeOptions,
        TextShapeParameter,
        ExtrudeBufferGeometry,
        torusKnot,
        TorusKnotShapeParameter,
        TorusKnotBufferGeometry,
        lathe,
        LatheShapeParameter,
        LatheBufferGeometry,
        ring,
        RingParameter,
        RingBufferGeometry,
        tube,
        TubeShapeParameter,
        TubeBufferGeometry,
        Parametric,
        ParametricShapeParameter,
        ParametricBufferGeometry
    }
}



declare abstract class ShapeExtractableDispatcher extends MaterialDispatcher {
    abstract dispatchKey(r: ShaderComponentRegistry): string;
    abstract updateUniforms(p: WGLProgram, reg: ShaderComponentRegistry, origin: Material): void;
    abstract extendShaderShading(b: ShaderBuilder, reg: ShaderComponentRegistry, origin: Material): void;
    preExit(_: Material): boolean;
    setState(renderer: Renderer, material: Material, drawable: Drawable): void;
    createBuilder(): ShaderBuilder;
    customKey(origin: Material, registry: ShaderComponentRegistry, isInstance: boolean): string;
    createShader(r: ShaderComponentRegistry, m: Material): ShaderBuilder;
    dispatch(renderer: Renderer, geometry: BufferGeometryBase, material: Material, drawable: Drawable): Nullable<WGLProgram>;
}



declare interface ShapeShapeParameter {
    shapes: Shape | Shape[];
    curveSegments?: number;
    flipY?: boolean;
}



declare class SkinningShaderComponent extends ShaderComponent {
    className(): string;
    extendShaderShading(_builder: ShaderBuilder): void;
    extendShaderShape(builder: ShaderBuilder): void;
    computeShapeKey(): string;
    copy(_: SkinningShaderComponent): this;
    clone(): SkinningShaderComponent;
    serialize(_ctx: Serializer<any>): void;
    deserialize(_ctx: Deserializer): void | Promise<void>;
}



declare let sortSplats: (count: number, sorting: Uint16Array | Uint32Array, order: Uint32Array) => Promise<{
    activeCount: number;
    sorting: Uint16Array | Uint32Array;
    ordering: Uint32Array;
}>;



declare interface SourceTextureWebGLUploadResult {
    is_pot: boolean;
    has_uploaded_custom_mipmap: boolean;
    byteSize: number;
}



declare function sphere(param: Partial<SphereShapeParameter>): BufferGeometry;



declare class SphereBufferGeometry extends BufferGeometry {
    parameters: {
        radius: number;
        widthSegments: number;
        heightSegments: number;
        phiStart: number;
        phiLength: number;
        thetaStart: number;
        thetaLength: number;
    };
    /**
     * The geometry is created by sweeping and calculating vertexes around the Y axis (horizontal sweep) and the Z axis (vertical sweep).
     * Thus, incomplete spheres (akin to 'sphere slices') can be created through the use of different values of phiStart, phiLength, thetaStart and thetaLength,
     * in order to define the points in which we start (or end) calculating those vertices.
     * @param radius Sphere radius. Default is 1.
     * @param widthSegments Number of horizontal segments. Minimum value is 3, and the default is 8.
     * @param heightSegments Number of vertical segments. Minimum value is 2, and the default is 6.
     * @param phiStart — specify horizontal starting angle. Default is 0.
     * @param phiLength — specify horizontal sweep angle size. Default is Math.PI * 2.
     * @param thetaStart — specify vertical starting angle. Default is 0.
     * @param thetaLength — specify vertical sweep angle size. Default is Math.PI.
     */
    constructor(radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number);
}



declare interface SphereShapeParameter {
    radius: number;
    widthSegments: number;
    heightSegments: number;
    phiStart: number;
    phiLength: number;
    thetaStart: number;
    thetaLength: number;
}



/**
 * SpottedShaderComponent controls the use of spotted effect.
 * Draw some grid-like points or lines on object.
 * This is coming from outside frontend team.
 */
declare class SpottedShaderComponent extends ShaderComponent {
    constructor();
    /**
     * Draw short lines or spots.
     * @defaultValue `SpottedType.dot`
     */
    markerType: SpottedType;
    /**
     * The color of spots or lines.
     * @defaultValue `Color(0, 0, 0)`
     */
    markerColor: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    /**
     * The gap of each spots or lines
     * The real spacing will add one.
     * @defaultValue `10`
     */
    markerSpacing: number;
    /**
     * The value bigger, short lines longer.
     * @defaultValue `3`
     */
    diagonalProportion: number;
    /**
     * This value influence the width of line or size of spot.
     * @defaultValue `1`
     */
    markerSize: number;
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Change the parameter of this material.
     */
    setValues(values: SpottedShaderComponentParameter): void;
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void;
    /**
     * Copy the data to this object from other.
     * @param other the data source.
     */
    copy(other: SpottedShaderComponent): this;
    clone(): SpottedShaderComponent;
    extendShaderShading(builder: ShaderBuilder): void;
}



declare type SpottedShaderComponentParameter = ConvertMaterialParameters<Pick<SpottedShaderComponent, 'markerType' | 'markerColor' | 'markerSpacing' | 'diagonalProportion' | 'markerSize'>>;



/**
 * Spot pattern styles supported by spotted shader components.
 */
declare enum SpottedType {
    dot = 0,
    diagonal = 1
}



declare class SpriteBufferGeometry extends BufferGeometry {
    isSpriteBufferGeometry: boolean;
    constructor();
    computeBoundingBox(): void;
    computeBoundingSphere(): void;
}



declare class SSAOBlurPassMaterial extends PassQuadMaterialBase {
    map: Texture;
    depthMap: Texture;
    normalMap: Texture;
    axis: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    weights: number[];
    texelSize: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    cameraNear: number;
    cameraFar: number;
    edgeSharpness: number;
    private KERNEL_RADIUS;
    className(): string;
    constructor();
    get radius(): number;
    set radius(v: number);
    setTexelSize(width: number, height: number): void;
    updateShadingUniforms(program: WGLProgram): void;
    extendShaderShading(b: ShaderBuilder): void;
}



declare class SSAOPassMaterial extends PassQuadMaterialBase {
    normalMap: Texture;
    depthMap: Texture;
    bias: number;
    radius: number;
    private intensityDivR6;
    projectionScale: number;
    cameraInverseProjectionMatrix: Readonly<Pick<ReadonlyMarked<Matrix4>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "getNumberCount" | "toArray" | "elements" | "applyToBufferAttribute" | "determinant" | "applyToArray" | "decompose" | "extractBasis" | "getPosition" | "getMaxScaleOnAxis" | "decompose2D">>;
    texelSize: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    className(): string;
    private _intensity;
    set intensity(v: number);
    get intensity(): number;
    setTexelSize(width: number, height: number): void;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
}



declare class TAAMaterial extends PassQuadMaterialBase {
    sampleCount: number;
    current: Texture;
    history: Texture;
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
}



declare function tetrahedron(params: RegularPolyhedronShapeParameter): BufferGeometry;



declare function text(text: string, params: Partial<TextShapeParameter>): BufferGeometry;



declare interface TextShapeParameter {
    font?: Font;
    size?: number;
    height?: number;
    curveSegments?: number;
    bevelEnabled?: boolean;
    bevelThickness?: number;
    bevelSize?: number;
}



declare class Texture2DCompressed extends LegacySourceTexture {
    className(): string;
    constructor(source: TextureMipmapGroup<CompressTexture2DLayer>);
    uploadWebGLImpl(ctx: WebGLTextureUploadCtx, disableCustomMipmap: boolean, needPOT: boolean): SourceTextureWebGLUploadResult;
    canAutoGenerateMipmap(): boolean;
    protected getAutoGeneratedMipmapByteSize(): number;
    source: TextureMipmapGroup<CompressTexture2DLayer>;
}



declare class Texture3D extends LegacySourceTexture {
    readonly is3d = true;
    source: TextureMipmapGroup<Texture3DLayer>;
    constructor(source: TextureMipmapGroup<Texture3DLayer>);
    static createByMainLayer(layer: Texture3DLayer): Texture3D;
    static createByMainLayerSource(source: Texture3DLayerSource, format: WebGLPixelFormat | undefined, type: TextureDataType | undefined, width: number, height: number, depth: number): Texture3D;
    className(): string;
    protected getAutoGeneratedMipmapByteSize(): number;
}



/**
 * Upload layer for 3D texture data.
 */
declare class Texture3DLayer implements WebGLUploadable {
    __brand: 'WebGLUploadable';
    source: Texture3DLayerSource;
    format: WebGLPixelFormat;
    type: TextureDataType;
    width: number;
    height: number;
    depth: number;
    constructor(source: Texture3DLayerSource);
    static create(source: Texture3DLayerSource): Texture3DLayer;
    setFormat(format: WebGLPixelFormat): this;
    setType(type: TextureDataType): this;
    setSize(width: number, height: number, depth: number): this;
}



declare type Texture3DLayerSource = TypeArray;



declare interface TextureCompressionSupportedInfo {
    textureCompressionBCSupported: boolean;
    textureCompressionETC2Supported: boolean;
    textureCompressionASTCSupported: boolean;
}



declare function textureCopyFootprint(width: number, height: number, copyInfo: TextureCopyInfo): {
    bytesPerRow: number;
    rowsPerImage: number;
};



declare interface TextureCopyInfo {
    blockCopySize: number;
    blockDimensions: {
        x: number;
        y: number;
    };
}



declare function textureCopyInfo(format: TextureFormat): TextureCopyInfo;



declare interface TextureFormatMeta {
    copyInfo: TextureCopyInfo;
    sampleType: {
        [key in GPUTextureAspect]: TextureSampleType;
    };
    glFormat: WebGLTextureFormat;
}



declare enum TextureSampleType {
    None = 0,
    Float = 1,
    Uint = 2,
    Sint = 3,
    Depth = 4
}



/**
 * A Ticker class that runs an update loop that other objects listen to.
 * This class is composed around listeners meant for execution on the next requested animation frame.
 * Animation frames are requested only when necessary, e.g. When the ticker is started and the emitter has listeners.
 */
declare class Ticker {
    /**
     * Whether or not this ticker should invoke the method {@link start} automatically when a listener is added.
     */
    autoStart: boolean;
    private requestAnimationFrame;
    private cancelAnimationFrame;
    /**
     * The last time {@link update} was invoked.
     * This value is also reset internally outside of invoking update, but only when a new animation frame is requested.
     * If the platform supports DOMHighResTimeStamp, this value will have a precision of 1 µs.
     */
    private _lastTime;
    /**
     * Whether or not this ticker has been started.
     */
    private _started;
    /**
     * The first listener.
     * All new listeners added are chained on this.
     */
    private _head;
    /**
     * Internal current frame request ID.
     */
    private _requestId;
    /**
     * Internal tick method bound to ticker instance.
     * @param time Time since last tick.
     */
    private _tick;
    constructor();
    /**
     * Conditionally requests a new animation frame.
     */
    private _requestIfNeeded;
    /**
     * Conditionally cancels a pending animation frame.
     */
    private _cancelIfNeeded;
    /**
     * Conditionally requests a new animation frame.
     */
    private _startIfPossible;
    /**
     * Register a handler for tick events. Calls continuously unless it is removed or the ticker is stopped.
     * @param fn The listener function to be added for updates.
     * @param context The listener context.
     * @param priority The priority for emitting.
     * @return This instance of a ticker.
     */
    add<T = any>(fn: TickerCallback<T>, context: T, priority?: number): this;
    /**
     * Add a handler for the tick event which is only execute once.
     * @param fn The listener function to be added for updates.
     * @param context The listener context.
     * @param priority The priority for emitting.
     * @return This instance of a ticker.
     */
    addOnce<T = any>(fn: TickerCallback<T>, context: T, priority?: number): this;
    /**
     * Internally adds the event handler so that it can be sorted by priority.
     * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run before the rendering.
     * @param listener Current listener being added.
     * @return This instance of a ticker.
     */
    private _addListener;
    /**
     * Removes any handlers matching the function and context parameters.
     * If no handlers are left after removing, then it cancels the animation frame.
     * @param fn The listener function to be removed
     * @return This instance of a ticker.
     */
    remove<T = any>(fn: TickerCallback<T>, context: T): this;
    /**
     * Starts the ticker. If the ticker has listeners.
     * Stops the ticker. If the ticker has requested a new animation frame is requested at this point.
     */
    start(): void;
    /**
     * An animation frame it is canceled at this point.
     */
    stop(): void;
    /**
     * Destroy the ticker and don't use after this.
     * Calling this method removes all references to internal events.
     */
    destroy(): void;
    /**
     * Triggers an update. An update entails setting.
     * @param currentTime the current time of execution
     */
    update(currentTime?: number): void;
    private static _default;
    /**
     * The default ticker instance for core timing functionality that shouldn't usually need to be paused.
     * @param currentTime the current time of execution
     */
    static get default(): Ticker;
}



declare type TickerCallback<T> = (this: T, dt: number) => any;



declare const ToggleWebGPUEvent: EventType<ToggleWebWebGpuPayload>;



declare interface ToggleWebWebGpuPayload {
    enabled: boolean;
    offscreen: boolean;
    canvas: HTMLCanvasElement;
}



declare class ToneMappingMaterial extends PassQuadMaterialBase {
    inputTransfer: ColorTransfer;
    outputTransfer: ColorTransfer;
    toneMapping: ToneMapping;
    exposure: number;
    tDiffuse: Texture;
    extendShaderShading(shaderBuilder: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
    constructor(params?: MaterialParameters);
    generateShaderKey(r: ShaderComponentRegistry): string;
    className(): string;
}



declare class ToonMaterial extends SceneMaterial {
    toonColor: Color;
    diffuseColor: Color;
    tooniness: number;
    smoothnessMin: number;
    smoothnessMax: number;
    className(): string;
    generateShaderKey(r: ShaderComponentRegistry): string;
    extendShaderShading(builder: ShaderBuilder): void;
    updateShadingUniforms(p: WGLProgram): void;
    copy(other: ToonMaterial): this;
    clone(): ToonMaterial;
}



declare function torus(parameters: Partial<TorusShapeParameter>): BufferGeometry;



declare function torusKnot(params: Partial<TorusKnotShapeParameter>): BufferGeometry;



declare class TorusKnotBufferGeometry extends BufferGeometry {
    parameters: {
        radius: number;
        tube: number;
        radialSegments: number;
        tubularSegments: number;
        p: number;
        q: number;
    };
    /**
     * @param radius Radius of the torus. Default is 1.
     * @param tube Radius of the tube. Default is 0.4.
     * @param tubularSegments The segments of tubular. Default is 64.
     * @param radialSegments The segments of radius. Default is 8.
     * @param p This value determines, how many times the geometry winds around its axis of rotational symmetry. Default is 2.
     * @param q This value determines, how many times the geometry winds around a circle in the interior of the torus. Default is 3.
     */
    constructor(radius?: number, tube?: number, tubularSegments?: number, radialSegments?: number, p?: number, q?: number);
}



declare interface TorusKnotShapeParameter {
    radius: number;
    tube: number;
    radialSegments: number;
    tubularSegments: number;
    p: number;
    q: number;
}



/**
 * @param radius Radius of the torus, from the center of the torus to the center of the tube. Default is 1.
 * @param tube Radius of the tube. Default is 0.4.
 * @param radialSegments The segments of radius. Default is 8
 * @param tubularSegments The segments of tubular. Default is 6.
 * @param arc — Central angle. Default is Math.PI * 2.
 */
declare interface TorusShapeParameter {
    radius: number;
    tube: number;
    radialSegments: number;
    tubularSegments: number;
    arc: number;
}



/**
 * Let every positional and normal vector multiple with specified matrix.
 * @param {Matrix4} matrix a 4×4 matrix which is applied to.
 * @remarks See {@link Matrix4.applyToBufferAttribute| applyToBufferAttribute} for more details.
 */
declare function transform(geometry: BufferGeometry, matrix: Matrix4): BufferGeometry;



declare function tube(params: Partial<TubeShapeParameter>): BufferGeometry;



declare class TubeBufferGeometry extends BufferGeometry {
    parameters: {
        path: Curve<Vector3>;
        tubularSegments: number;
        radius: number;
        radialSegments: number;
        closed: boolean;
    };
    tangents: Vector3[];
    normals: Vector3[];
    biNormals: Vector3[];
    /**
     * @param path A path that inherits from the Curve base class.
     * @param tubularSegments The number of segments that make up the tube, default is 64.
     * @param radius The radius of the tube, default is 1.
     * @param radialSegments The number of segments that make up the cross-section, default is 8.
     * @param closed Boolean Is the tube open or closed, default is false.
     */
    constructor(path: Curve<Vector3>, tubularSegments?: number, radius?: number, radialSegments?: number, closed?: boolean);
}



declare interface TubeShapeParameter {
    path: Curve<Vector3>;
    tubularSegments: number;
    radius: number;
    radialSegments: number;
    closed: boolean;
}



declare function unregisterContentAPI(api: ContentAPI): void;



declare function updateByGeometry(me: BufferGeometry, geometry: Geometry): BufferGeometry<TriangleList>;



declare function updateByGeometryAsLine<T extends LineStrip | LineList>(me: BufferGeometry<T>, geometry: Geometry): BufferGeometry<T>;



declare function updateEdgesVisibility(object: Mesh): void;



/**
 * General-purpose helper methods.
 */
declare class Utils {
    static wait(time: number): Promise<void>;
    static arrayMin(array: number[]): number;
    static arrayMax(array: number[] | TypeArray): number;
    static decodeUTF8(data: Uint8Array): string;
    static intBitsToFloat(i: number): number;
    static stringToArrayBuffer(text: string): ArrayBuffer;
    static copyProperty(toKey: string, fromKey: string, to: any, from?: any): void;
    static isShaderMayChanged(a: any, b: any): boolean;
    static notifyRecompileByCheckingKey(key: string, material: Material, data: {
        [index: string]: any;
    }): boolean;
    static notifyRecompileByCheckingKeys(keys: string[], material: Material, data: {
        [index: string]: any;
    }): void;
    static copyPropertiesAndCheckRecompile(keys: string[], checkKeys: string[], to: Material, from?: any): void;
    static copyProperties(keys: string[], to: any, from?: any): void;
    static convertArray(array: any, type: any, forceClone?: boolean): any;
    static arraySlice(array: any, from: number, to: number): any;
    static isTypedArray(object: any): boolean;
    static visitTexture(tex: Array<Texture | null>, visitor: Function): void;
    static preComputeHalton(count: number): Vector2[];
}



declare interface ViewerPlugin {
    /**
     * called when register to viewer
     */
    init(viewer: Viewer, viewerContainer: HTMLElement): void;
    /**
     * called when unregister from viewer or destroying viewer.
     */
    destroy(viewer: Viewer, viewerContainer: HTMLElement): void;
    /**
     * called on every rendering request started.
     * @param requestFrameId the frame id will be rendered in current rendering request
     * @param lastRenderedFrameId last actually rendered the frame id
     */
    beforeRendering?(requestFrameId: number, lastRenderedFrameId: number): void;
    /**
     * called on every rendering request finish, but the rendering request maybe not actually executed.
     * use `renderedFrameId` to check whether rendering request has executed.
     * @param renderedFrameId the latest rendered frame id after current rendering request finished.
     */
    afterRendering?(renderedFrameId: number): void;
}



/**
 * Event emitted after a viewer is resized.
 */
declare const ViewerResizeEvent: EventType<{
    target: Viewer;
    width: number;
    height: number;
}>;



/**
 * Event emitted when a viewer is uninitialized.
 */
declare const ViewerUnInitializeEvent: EventType<{
    target: Viewer;
}>;



/**
 * Additional WebGL blending source factors.
 */
declare enum WebGLBlendingSrc {
    SrcAlphaSaturate = 776
}



/**
 * Which type of encoding method supported by compressed texture.
 */
declare enum WebGLTextureEncoding {
    Linear = 3000,
    sRGB = 3001,
    Gamma = 3007,
    RGBE = 3002,
    LogLuv = 3003,
    RGBM7 = 3004,
    RGBM16 = 3005,
    RGBD = 3006
}



declare class WebGLTextureFormat {
    private _internal;
    private _external;
    private _dataType;
    readonly compressed: boolean;
    private _cache;
    constructor(_internal: number, _external: number, _dataType: number, compressed: boolean);
    internal(backend: RendererBackend): number;
    external(backend: RendererBackend): number;
    dataType(backend: RendererBackend): number;
    private specifyInternal;
    private specifyExternal;
    private specifyDataType;
    private backendSpecified;
}



declare class WebGLTextureUploadCtx {
    gl: WebGL2RenderingContext;
    backend: RendererBackend;
    isWebGL1: boolean;
    limits: Limits;
    newCreated: boolean;
    constructor(gl: WebGL2RenderingContext, backend: RendererBackend, isWebGL1: boolean, limits: Limits, newCreated: boolean);
}



declare const WebGPUUnstable: EventType<never>;



declare const WebGPUValidationFailed: EventType<number>;



declare class WGLConstantsConvertor {
    static convertTextureDataType(gl: WebGLRenderingContext | WebGL2RenderingContext, p: TextureDataType, extensions: WGLExtensions): number;
}



/**
 * This can be used as a helper object to view a Geometry object as a wireframe.
 */
declare class WireframeBufferGeometry extends BufferGeometry<LineList> {
    type: string;
    /**
     * @param geometry Any geometry object.
     */
    constructor(geometry: GeometryBase);
}



declare interface WorldRebuildConfig {
    startupMemorySize?: number;
    allocUnitSize?: number;
}



declare const WorldUVGenerator: {
    generateTopUV(_geometry: Geometry, vertices: number[], indexA: number, indexB: number, indexC: number): Vector2[];
    generateSideWallUV(_geometry: Geometry, vertices: number[], indexA: number, indexB: number, indexC: number, indexD: number): Vector2[];
};



declare function downloadTextureData(url: string | string[] | URL | URL[], options?: LoaderOptions): Promise<TextureData>;



declare interface LoadResult {
    format: TextureFormat;
    data: Array<MipLevelSource | LayerSource[]>;
    width: number;
    height: number;
    depthOrArrayLayers: number;
    mipmaps: boolean;
    autoGenerateMipmap: boolean;
}



declare interface TextureData extends LoadResult {
    dimension: TextureDimension;
    viewDimension: TextureViewDimension;
}



declare function createSplatFile(type: SplatFileType, lodLevel?: number): IFile;



declare class EszFile implements IFile {
    private readLowPrecisionLayout;
    private readHighPrecisionLayout;
    private readHighPrecisionSegment;
    read(stream: ReadableStream<Uint8Array>, _contentLength: number, data: IData): Promise<void>;
    write(_stream: WritableStream<Uint8Array>, _data: IData): Promise<void>;
}



declare const NUM_F_REST_TO_SH_DEGREE: Record<number, number>;



declare function prepareSplatFiles(type: SplatFileType, stream: ReadableStream<Uint8Array>, contentLength: number, includeOtherFormats?: boolean, context?: FileContext): Promise<SplatFileInput[]>;



declare function readSplatFiles(files: SplatFileInput[], data: IData, lodLevel?: number): Promise<void>;



declare const SH_MAPS: Record<number, number>;



declare interface SplatFileInput {
    type: SplatFileType;
    stream: ReadableStream<Uint8Array>;
    contentLength: number;
    context?: FileContext;
}



declare function debounce<F extends (...args: any[]) => void>(func: F, debounceMs: number, { signal, edges }?: DebounceOptions): DebouncedFunction<F>;



declare interface DebouncedFunction<F extends (...args: any[]) => void> {
    (...args: Parameters<F>): void;
    schedule: () => void;
    cancel: () => void;
    flush: () => void;
}



declare interface DebounceOptions {
    signal?: AbortSignal;
    edges?: Array<'leading' | 'trailing'>;
}



declare interface Deferred<T = void> {
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    promise: Promise<T>;
}



declare function deferred<T = void>(): Deferred<T>;



/**
 * must be static
 */
declare const ENV: {
    isDebugEnable: boolean;
};



declare class FactoryWorkerPool {
    readonly name: string;
    private workerFactory;
    readonly maxWorkerCount: number;
    readonly permanentWorkers: number;
    readonly cleanupTimeout: number;
    private workers;
    private timeoutHandle;
    private tasks;
    constructor(name: string, workerFactory: () => Worker, maxWorkerCount?: number, permanentWorkers?: number, cleanupTimeout?: number);
    private createWorker;
    private cleanupWorkers;
    flush(): void;
    getWorker(): Promise<WebWorker>;
}



declare class Logger {
    static readonly MAX_EXCEPTION_SIZE = 1024;
    info(...param: any[]): void;
    warn(...param: any[]): void;
    private exceptionCount;
    error(content: string | Error, type?: LogType): void;
    unreachable(content: string): void;
    unsupported(content: string): void;
    invalidInput(content: string): void;
    webglError(content: string): void;
    webGpuError(content: string): void;
}



declare const logger: Logger;



declare enum LogType {
    Unreachable = "Unreachable",
    Unsupported = "Unsupported",
    InvalidInput = "InvalidInput",
    WebglError = "WebglError",
    WebGpuError = "WebGpuError"
}



declare function sleep(timeout: number): Promise<void>;



declare function throttle<F extends (...args: any[]) => void>(func: F, throttleMs: number, { signal, edges }?: ThrottleOptions): ThrottledFunction<F>;



declare interface ThrottledFunction<F extends (...args: any[]) => void> {
    (...args: Parameters<F>): void;
    cancel: () => void;
    flush: () => void;
}



declare interface ThrottleOptions {
    signal?: AbortSignal;
    edges?: Array<'leading' | 'trailing'>;
}



declare type WebWorker = Worker & {
    readonly alive: boolean;
    readonly permanent: boolean;
    release(): void;
};



declare class WorkerPool extends FactoryWorkerPool {
    constructor(name: string, WorkerCtor: new () => Worker, maxWorkerCount?: number, permanentWorkers?: number, cleanupTimeout?: number);
}

declare namespace __INTERNAL__ {
    export {
        injectSerialize,
        logger,
        MaterialShadingWithDynamicShapeDispatcher,
        DefaultMaterialDispatcher,
        MaterialDispatcher,
        ForwardDispatcher,
        PlanarShadowDispatcher,
        BeforeScenePassEvent,
        AfterScenePassEvent,
        ShadowMode,
        PipelineFilters,
        PipelineAPI,
        IPipelineFilter,
        EncodeDispatcher,
        RenderObjectsType,
        DrawableList,
        ProjectedDrawcallList,
        DrawcallListClassifyList,
        DrawcallListClassifyType,
        InstancedBufferGeometry,
        SpriteBufferGeometry,
        ShaderComponent,
        Texture2DCommonLayer,
        Camera as Camera3D,
        Object3DChangeEvent,
        RenderTarget,
        RenderAttachment,
        Nullable,
        TypeArray as TypedArray,
        IRange,
        RendererState,
        RenderCtxInfo,
        MemoryGrowFailed,
        defaultLimits,
        IRenderer,
        RendererStatus,
        RendererParameters,
        Limits,
        registerGlobal3DRendererOverride,
        resetGlobal3DRendererOverride,
        EnvMapMaterial,
        GradientMaterial,
        GroundMaterial,
        AlphaShaderComponent,
        ColorShaderComponent,
        SkinningShaderComponent,
        PreSkyMapMaterial,
        SkyMaterial,
        Shadow,
        DirectionalShadow,
        PointShadow,
        SpotShadow,
        BlurPassMaterial,
        MixColorAndDepthMaterial,
        CopyColorAndDepthMaterial,
        CopyDepthMaterial,
        CopyMaterial,
        MixOITMaterial,
        MixPlanarShadowMaterial,
        HighLightBlendPassMaterial,
        DownsampleMaterial,
        OutlineComputeMaterial,
        OutlineComposeMaterial,
        OutlineEncodeMaterial,
        SSAOBlurPassMaterial,
        SSAOPassMaterial,
        TAAMaterial,
        PseudoColorMaterial,
        RoomBoxMaterial,
        PlanarShadowMaterial,
        FilterMaterial,
        ToonMaterial,
        OITMaterial,
        ExposedCopyMaterial,
        ExposedToneMappingMaterial,
        DialuxLuminanceMaterial,
        DialuxWhiteBalanceExposureMaterial,
        HistogramComputeMaterial,
        AvgLuminanceMaterial,
        ToneMappingMaterial,
        BackgroundLikeMaterial,
        SplattingRenderMode,
        DeferredDrawAmbientLightMaterial,
        DeferredDrawDirectionalLightMaterial,
        DeferredDrawDiskAreaLightMaterial,
        DeferredDrawPointLightMaterial,
        DeferredDrawRectAreaLightMaterial,
        DeferredDrawSpotLightMaterial,
        setSortSplats,
        SplattingOptions,
        SplatKernelOptions,
        registerPipelineContentAPI,
        removePipelineContentAPI,
        registerContentAPI,
        unregisterContentAPI,
        registerManagedContentAPI,
        removeManagedContentAPI,
        disposeManagedContentAPI,
        ContentManagedAPI,
        ContentAPI,
        WorldRebuildConfig,
        LegacySourceTexture,
        textureCopyInfo,
        textureCopyFootprint,
        formatMeta,
        TextureSampleType,
        RenderInfo,
        Renderable,
        WebGLExtEnums,
        WGLConstantsConvertor,
        WGLExtensions,
        getBufferSubDataAsync,
        Platform,
        getMaterialShaderComponents,
        getMaterialProperties,
        ToggleWebGPUEvent,
        WebGPUUnstable,
        WebGPUValidationFailed,
        IterableWeakMap,
        IterableWeakSet,
        DeferredDispatcher,
        setupWebGLCapabilities,
        setupWebGLLimits,
        setupWebGPUCapabilities,
        Capabilities,
        setupWebGPUCompressedTextureCapabilities,
        CompressedSplat,
        SuperCompressedSplat,
        SogSplat,
        SogSplatMeta,
        GLOBAL_CONFIG,
        deferred,
        Deferred,
        BVHStrategyType,
        BVHBuilder,
        BVHBuilderData,
        BVH,
        BVHRaw,
        ViewerPlugin,
        ViewerConfig,
        IViewerConfig,
        serializeObject3D,
        parseObjects,
        deepCloneObject3D,
        downloadStringAsFile,
        afterWASMInit,
        beforeAPIRegister,
        DrivenCullingMaterial,
        DrivenShadingMaterial,
        DrivenGenHZBMaterial
    }
}

declare enum AccessorComponentType {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    UNSIGNED_INT = 5125,
    FLOAT = 5126
}

declare interface ActionCtx {
    propertyMixerMap: Map<string, PropertyMixer>;
    materialSet: Set<MeshPhongMaterial_2>;
}

declare enum ALPHA_MODES {
    OPAQUE = "OPAQUE",
    MASK = "MASK",
    BLEND = "BLEND"
}

declare class AlphaShaderComponent<T extends Texture2D | TextureV2 = Texture2D> extends ShaderComponent {
    opacity: number;
    texture: Nullable<T>;
    constructor();
    className(): string;
    extendShaderShading(builder: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
    copy(other: AlphaShaderComponent<T>): this;
    clone(): AlphaShaderComponent<T>;
    deserialize(ctx: Deserializer): void;
    serialize(ctx: Serializer): void;
}

/**
 * This light's color gets applied to all the objects in the scene globally.
 * The color of this light can influence object's natural color.
 */
export declare class AmbientLight extends Light {
    /**
     * Check the type whether it belongs to PerspectiveCamera.
     * This value should not be changed by user.
     */
    isAmbientLight: boolean;
    /**
     * This attribute calculate the final color by {@link intensity | intensity } and {@link color | color }
     */
    uniformColor: Color;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(color?: number | string, intensity?: number);
    clone(recursive?: boolean): AmbientLight;
}

declare namespace Animation_2 {
    export {
        AnimationPlugin,
        SkeletonUpdatedEvent,
        AnimationMixer,
        AnimationAction,
        AnimationFinishEvent,
        Skeleton,
        AnimationClip,
        KeyframeTrack,
        Blend,
        Loop,
        InterpolationMode
    }
}
export { Animation_2 as Animation }

declare interface Animation_2_2 {
    name: string;
    tracks: AnimationTrack[];
}

/**
 * An instance schedules the playback of an animation stored in {@link AnimationClip}
 */
declare class AnimationAction {
    static createId(root: Object3D, clip: AnimationClip): string;
    /**
     * Action id = `root.uuid@clip.name`
     */
    readonly id: string;
    /**
     * Name from {@link AnimationClip}
     */
    readonly name: string;
    /**
     * If set to `true`, the action is played. It will be automatically set to `false` when animation stops.
     */
    active: boolean;
    /**
     * If set to `true`, the playback of the action is paused.
     */
    paused: boolean;
    /**
     * If set to `true`, the animation will be paused on its last frame.
     * If set to `false`, the animation target will be reset to original state at the end.
     */
    pauseWhenFinished: boolean;
    /**
     * The degree of influence of this action for blending with other actions
     */
    weight: number;
    /**
     * Weight factor for time, which can be set to negative.
     */
    speed: number;
    /**
     * local time for this action
     */
    time: number;
    private duration;
    private blend;
    private interpolants;
    private mixers;
    private animationMixer;
    /**
     * Return max time
     */
    get timeDuration(): number;
    constructor(root: Object3D, clip: AnimationClip, ctx: ActionCtx, mixer: AnimationMixer);
    private loop;
    private loopCounts;
    private repetitions;
    /**
     * Configures the loop settings for this action
     * @param mode {@link Loop} mode
     * @param repetitions number of repetitions
     * @returns
     */
    setLoop(mode: Loop, repetitions: number): this;
    /**
     * Reset action
     * @returns
     */
    reset(): this;
    update(deltaTime: number, accuIndex: number): void;
    private updateTime;
}

declare interface AnimationClip {
    name: string;
    blend?: Blend;
    tracks: KeyframeTrack[];
}

declare const AnimationFinishEvent: EventType<{
    action: AnimationAction;
}>;

/**
 * The class is a player for animations on a particular object called root
 */
declare class AnimationMixer extends EventDispatcher {
    private root;
    private actions;
    private propertyMixerMap;
    private materialSet;
    private accuIndex;
    private useCache;
    /**
     * Constructor
     * @param root animation target.
     * @param useCache optional, default is true. By default, animationAction will be cached with root id and name when clipAction.
     */
    constructor(root: Object3D, useCache?: boolean);
    /**
     * Generating {@link AnimationAction} from {@link AnimationClip}.
     * Calling With the same clip name and root, it will always return the same action instance.
     * @param clip
     * @param root optional, default is the root of {@link AnimationMixer}.
     * It is used for searching animation target.
     * @returns
     */
    clipAction(clip: AnimationClip, root?: Object3D): AnimationAction;
    /**
     * Advance the mixer time and update animation
     * @param deltaTime delta time in seconds
     */
    update(deltaTime: number): void;
    /**
     * Set the mixer to a specific time and update animation
     * @param time time in seconds
     */
    setTime(time: number): void;
    private apply;
}

/**
 * A special viewer plugin responsible for animation and skeleton updating.
 */
declare class AnimationPlugin implements __INTERNAL__.ViewerPlugin {
    readonly clock: Clock;
    private mixerList;
    private skeletonMap;
    private viewer;
    init(): void;
    destroy(): void;
    beforeRendering(): void;
    afterRendering(): void;
    /**
     * Register this animation plugin to the viewer.
     * @param viewer Viewer or IViewerContext
     */
    registerToViewer(viewer: IViewerContext | Viewer): void;
    /**
     * Register {@link AnimationMixer} into the plugin, then the animation will be updated along with rendering
     * @param mixer
     */
    add(mixer: AnimationMixer): void;
    /**
     * Unregister {@link AnimationMixer}
     * @param mixer
     */
    remove(mixer: AnimationMixer): void;
    /**
     * Bind {@link SkinnedMesh} with skeleton and register in animation plugin, then the skeletal animation will be update along with skeleton change.
     * After binding, the {@link SkinnedMesh} can be considered as {@link ISkinnedMesh}
     * @param mesh
     * @param skeleton {@link Skeleton} to be bound
     * @param mixer {@link AnimationMixer} to be bound to listen for events
     */
    bindSkinned(mesh: SkinnedMesh, skeleton: Skeleton, mixer: AnimationMixer): void;
    /**
     * Unbind {@link SkinnedMesh}
     * @param mesh
     */
    unbindSkinned(mesh: SkinnedMesh): void;
}

declare interface AnimationTrack {
    path: string;
    times: TypedArray_3;
    values: TypedArray_3;
    interpolation: number;
}

declare class AOPlugin extends PipelinePlugin {
    readonly PLUGIN_NAME = "AO";
    private depthMaterial;
    private aoPassMaterial;
    private aoBlurXMaterial;
    private aoBlurYMaterial;
    private aoComposeMaterial;
    private depthDispatcher;
    private drivenShadingMaterial;
    private active;
    get enabled(): boolean;
    set enabled(v: boolean);
    constructor(scene: SceneAdaptorDispatcher, renderer: RendererAdaptor);
    destroy(): void;
    updateFrameSize(width: number, height: number): void;
    updateEffect(_scene: SceneAdaptor, isFrameStable: boolean, isCameraStable: boolean, effectConfig: IEffectConfig): void;
    updateGraphHash(_hasher: HashKeyBuilder): void;
    updateRenderGraph(graph: RenderGraph, context: PipelineContext): void;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        aoBias: {
            get: () => number;
            set: (v: number) => void;
        };
        aoRadius: {
            get: () => number;
            set: (v: number) => void;
        };
        blurKernelRadius: {
            get: () => number;
            set: (v: number) => void;
        };
        blurEdgeSharpness: {
            get: () => number;
            set: (v: number) => void;
        };
        aoIntensity: {
            get: () => number;
            set: (v: number) => void;
        };
    };
}

declare class AreaLight extends Light {
    constructor(color: number | string, intensity: number);
    static get ltc_1_texture(): Texture2D;
    static get ltc_2_texture(): Texture2D;
    /**
     * The name of instance's class.
     */
    className(): string;
    static updateLTCUniform(program: WGLProgram): void;
}

/**
 * ArrayCamera can be used in order to efficiently render a scene with a predefined set of cameras. This is an important performance aspect for rendering VR scenes.<br/>
 * An instance of ArrayCamera always has an array of sub cameras. It's mandatory to define for each sub camera the viewport property which determines the part of the viewport that is rendered with this camera.
 * @deprecated use `Viewport` instead.
 */
declare class ArrayCamera extends ElementEventDispatcher {
    /**
     * Check the type whether it belongs to ArrayCamera.
     * This value should not be changed by user.
     */
    isArrayCamera: boolean;
    /**
     * An array of cameras.
     */
    cameras: Camera3D[];
    constructor(arr?: Camera3D[]);
}

declare type ArrayOrSingle<T> = T | T[];

/**
 * Draw a arrow with a head and a line.
 */
declare class ArrowHelper extends CombinedObjectGroup {
    line: Line<LineMaterial>;
    cone: Mesh<MeshBasicMaterial_2>;
    /**
     * @param {Vector3} dir this vector representing the world space direction of arrow. Default is Vector3(0, 0, 1).
     * @param {Vector3} origin the beginning position of arrow's tail. Default is Vector3(0, 0, 0).
     * @param {number} length the length of line. Default is 1.
     * @param {number} color the color of arrow. Default is 0xffff00.
     * @param {number} headLength the height of head. Default is 0.2 * length.
     * @param {number} headWidth the radius of arrow's head. Default is 0.2 * headLength.
     */
    constructor(dir?: Vector3, origin?: Vector3, length?: number, color?: number, headLength?: number, headWidth?: number);
    /**
     * Change the direction of the arrow.
     */
    setDirection(dir: Vector3): void;
    /**
     * Change the length of the arrow includes the line and the head.
     */
    setLength(length: number, headLength?: number, headWidth?: number): void;
    /**
     * Change the color of the arrow includes the line and the head.
     */
    setColor(color: Color): void;
    copy(source: ArrowHelper): this;
    clone(): ArrowHelper;
    destroyCombined(): void;
}

declare type AttachmentDescriptor = number | 'depth';

declare class AttributeState {
    readonly gl: WebGL2RenderingContext | WebGLRenderingContext;
    private newAttributes;
    private enabledAttributes;
    private attributeDivisors;
    private extensions;
    constructor(gl: WebGL2RenderingContext | WebGLRenderingContext, limits: WebGLLimits, extensions: WGLExtensions);
    initAttributes(): void;
    enableAttribute(attributeLocation: number): void;
    enableAttributeAndDivisor(attributeLocation: number, meshPerAttribute: number): void;
    disableUnusedAttributes(): void;
    reset(): void;
}

declare abstract class BackgroundLikeMaterial extends Material {
    up: ReadonlyVector3;
    quat: ReadonlyVector4;
    extendShaderShape(builder: ShaderBuilder, _: ShaderComponentRegistry): void;
    computeShapeKey(_: ShaderComponentRegistry): string;
    updateShapeUniforms(program: WGLProgram, _: ShaderComponentRegistry): void;
}

/**
 * Background modes supported by the viewer.
 */
export declare enum BackgroundMode {
    BasicBackground = "basic",
    /**
     * @deprecated use BackgroundMode.BasicBackground
     */
    SolidColorBackground = "solid",
    SkyBackground = "sky",
    GradientBackground = "gradient",
    EnvMapBackground = "env"
}

/**
 * Background mode and partial parameters applied to a viewer.
 * @deprecated
 */
declare interface BackgroundParameter {
    mode: BackgroundMode;
    parameter?: Partial<BasicBackgroundParameter | SolidColorBackgroundParameter | GradientBackgroundParameter | SkyBackgroundParameter | EnvMapBackgroundParameter>;
}

declare class BackgroundPlugin extends PipelinePlugin {
    readonly PLUGIN_NAME = "background";
    ground: Ground;
    basicBackground: BasicBackground;
    solidBackground: SolidColorBackground;
    skyBackground: SkyBackground;
    envBackground: EnvMapBackground;
    gradientBackground: GradientBackground;
    activeBackground: BackgroundMode;
    private get background();
    private skyMapMaterial;
    private copyMaterial;
    private up;
    private get needRecreateSkyMap();
    protected _enabled: boolean;
    constructor(scene: SceneAdaptorDispatcher, renderer: RendererAdaptor);
    destroy(): void;
    updateFrameSize(): void;
    notifyChanged(): void;
    updateEffect(): void;
    updateGraphHash(hasher: HashKeyBuilder): void;
    updateRenderGraph(graph: RenderGraph): void;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        up: {
            get: () => Vector3;
            set: (v: Vector3) => void;
        };
        ground: {
            enabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            gridSize: {
                get: () => number;
                set: (v: number) => void;
            };
            offsetA: {
                get: () => Vector2;
                set: (v: Vector2) => void;
            };
            gridGapSizeA: {
                get: () => number;
                set: (v: number) => void;
            };
            colorA: {
                get: () => Color;
                set: (v: Color) => void;
            };
            lineWidthA: {
                get: () => number;
                set: (v: number) => void;
            };
            offsetB: {
                get: () => Vector2;
                set: (v: Vector2) => void;
            };
            gridGapSizeB: {
                get: () => number;
                set: (v: number) => void;
            };
            colorB: {
                get: () => Color;
                set: (v: Color) => void;
            };
            lineWidthB: {
                get: () => number;
                set: (v: number) => void;
            };
            isGroundColorEnabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            groundColor: {
                get: () => Color;
                set: (v: Color) => void;
            };
        };
        background: {
            active: {
                get: () => BackgroundMode;
                set: (v: BackgroundMode) => void;
            };
            solid: {
                color: {
                    get: () => Color;
                    set: (v: Color) => void;
                };
                alpha: {
                    get: () => number;
                    set: (v: number) => void;
                };
            };
            envmap: {
                texture: {
                    get: () => Texture;
                    set: (v: Texture) => void;
                };
                luma: {
                    get: () => number;
                    set: (v: number) => void;
                };
                verticalRotation: {
                    get: () => number;
                    set: (v: number) => void;
                };
                horizonRotation: {
                    get: () => number;
                    set: (v: number) => void;
                };
                reverseVertical: {
                    get: () => boolean;
                    set: (v: boolean) => void;
                };
                reverseHorizon: {
                    get: () => boolean;
                    set: (v: boolean) => void;
                };
            };
            gradient: {
                skyColor: {
                    get: () => Color;
                    set: (v: Color) => void;
                };
                groundColor: {
                    get: () => Color;
                    set: (v: Color) => void;
                };
            };
            sky: {
                enablePreSkyMap: {
                    get: () => boolean;
                    set: (v: boolean) => void;
                };
                luminance: {
                    get: () => number;
                    set: (v: number) => void;
                };
                turbidity: {
                    get: () => number;
                    set: (v: number) => void;
                };
                rayleigh: {
                    get: () => number;
                    set: (v: number) => void;
                };
                mieCoefficient: {
                    get: () => number;
                    set: (v: number) => void;
                };
                mieDirectionalG: {
                    get: () => number;
                    set: (v: number) => void;
                };
            };
            basic: {
                color: {
                    get: () => Color;
                    set: (v: Color) => void;
                };
                alpha: {
                    get: () => number;
                    set: (v: number) => void;
                };
                texture: {
                    get: () => Nullable<Texture>;
                    set: (v: Nullable<Texture>) => void;
                };
            };
        };
    };
    private updateMaterial;
}

declare class BaseElement {
    private isFreed;
    private __guid;
    private _businessTag;
    readonly userData: Record<keyof any, any>;
    markBusinessTag(v: string): this;
    set businessTag(v: string);
    get businessTag(): string;
    constructor();
    isDestroyed(): boolean;
    destroy(): void;
    validate(): void;
    destroyAllResourcesOwned(): void;
    freeAllGpuResourceOwned(): void;
}

/**
 * Draw background with a picture.
 */
declare class BasicBackground implements Renderable {
    color: Color;
    alpha: number;
    texture: Nullable<Texture>;
    private quad;
    private copy;
    constructor(color?: Color, alpha?: number);
    config(renderer: IRenderer): boolean;
    render(renderer: IRenderer): void;
    destroy(): void;
}

/**
 * Parameters for the legacy basic background mode.
 * @deprecated
 */
declare interface BasicBackgroundParameter {
    color: Color;
    alpha: number;
    texture: Texture;
}

declare enum Blend {
    Normal = 2500,
    Additive = 2501
}

/**
 * Specified the color blending mode for transparent effect.
 */
export declare enum Blending {
    NoBlending = 0,
    NormalBlending = 1,
    AdditiveBlending = 2,
    SubtractiveBlending = 3,
    MultiplyBlending = 4,
    CustomBlending = 5
}

/**
 * The blendEquation method of the WebGL API is used to set both the RGB blend equation and alpha blend equation to a single equation.
 */
export declare enum BlendingEquation {
    Add = 32774,
    Subtract = 32778,
    ReverseSubtract = 32779,
    Min = 32775,
    Max = 32776
}

/**
 * The following constants can be used for sfactor and dfactor.
 * The formula for the blending color can be described like this: color(RGBA) = (sourceColor * sfactor) + (destinationColor * dfactor).
 * The RBGA values are between 0 and 1.
 */
export declare enum BlendingFactor {
    Zero = 0,
    One = 1,
    SrcColor = 768,
    OneMinusSrcColor = 769,
    SrcAlphaFactor = 770,
    OneMinusSrcAlpha = 771,
    DstAlpha = 772,
    OneMinusDstAlpha = 773,
    DstColor = 774,
    OneMinusDstColor = 775
}

declare class BlendState {
    private currentBlending?;
    private currentBlendEquation?;
    private currentBlendSrc?;
    private currentBlendDst?;
    private currentBlendEquationAlpha?;
    private currentBlendSrcAlpha?;
    private currentBlendDstAlpha?;
    private currentPremultipliedAlpha;
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext);
    setBlending(blending: Blending, blendEquation: BlendingEquation, blendSrc: number, blendDst: number, blendEquationAlpha?: number, blendSrcAlpha?: number, blendDstAlpha?: number, premultipliedAlpha?: boolean): void;
}

/**
 * A 2D box represents by {@link min| min} and {@link max| max}.
 */
declare class Box2 {
    /**
     * {@link Vector2| Vector2} representing the lower (x, y) boundary of the box.<br />
     * @defaultValue is ( + Infinity, + Infinity ).
     */
    min: Vector2;
    /**
     * {@link Vector2| Vector2} representing the upper (x, y) boundary of the box.<br />
     * @defaultValue is ( - Infinity, - Infinity ).
     */
    max: Vector2;
    constructor(min?: Vector2, max?: Vector2);
    /**
     * Sets the lower and upper (x, y) boundaries of this box.<br>
     * Please note that this method only copies the values from the given objects.
     * @param min {@link Vector2| Vector2} representing the lower (x, y) boundary of the box. <br>
     * @param max {@link Vector2| Vector2} representing the upper (x, y) boundary of the box. <br /><br />
     */
    set(min: Vector2, max: Vector2): Box2;
    /**
     * Sets the upper and lower bounds of this box to include all of the points in {@link Array| points}.
     * @param points Array of {@link Vector2| Vector2s} that the resulting box will contain.<br /><br />
     */
    setFromPoints(points: Vector2[]): Box2;
    /**
     * Centers this box on {@link Vector2| center} and sets this box's width and height to the values specified in {@link Vector2| size}.
     * @param center Desired center position of the box ({@link Vector2| Vector2}).<br>
     * @param size Desired x and y dimensions of the box ({@link Vector2| Vector2}).<br /><br />
     */
    setFromCenterAndSize(center: Vector2, size: Vector2): Box2;
    /**
     * Return a new {@link Box2| Box2} with the same {@link .min| min} and {@link .max| max} as this clone
     */
    clone(): Box2;
    /**
     * Copies the {@link min| min} and {@link max| max} from {@link Box2| box} to this box.
     */
    copy(box: Box2): Box2;
    /**
     * Makes this box empty.
     */
    makeEmpty(): Box2;
    /**
     * Return true if this box includes zero points within its bounds.<br>
     * @tips that a box with equal lower and upper bounds still includes one point, the one both bounds share.
     */
    isEmpty(): boolean;
    /**
     * Return the center point of the box as a {@link Vector2| Vector2}.
     * @param target the result will be copied into this Vector2.
     */
    getCenter(target: Vector2): Vector2;
    /**
     * Return the width and height of this box.
     * @param target the result will be copied into this Vector2.
     */
    getSize(target?: Vector2): Vector2;
    /**
     * Expands the boundaries of this box to include {@link Vector2| point}.
     * @param point {@link Vector2| Vector2} that should be included in the box.
     */
    expandByPoint(point: Vector2): Box2;
    /**
     * Expands this box equilaterally by {@link Vector2| vector}. The width of this box will be
     * expanded by the x component of {@link Vector2| vector} in both directions. The height of
     * this box will be expanded by the y component of {@link Vector2| vector} in both directions.
     * @param vector {@link Vector2| Vector2} to expand the box by.
     */
    expandByVector(vector: Vector2): Box2;
    /**
     * Expands each dimension of the box by scalar. If negative, the dimensions of the box will be contracted.
     * @param scalar Distance to expand the box by.
     */
    expandByScalar(scalar: number): Box2;
    /**
     * Return true if the specified {@link Vector2| point} lies within or on the boundaries of this box.
     * @param point {@link Vector2| Vector2} to check for inclusion.
     */
    containsPoint(point: Vector2): boolean;
    /**
     * Return true if this box includes the entirety of {@link Box2| box}.
     * If this and {@link Box2| box} are identical, this function also returns true.
     * @param box {@link Box2| Box2} to test for inclusion.
     */
    containsBox(box: Box2): boolean;
    /**
     * Return a point as a proportion of this box's width and height.
     * @param target the result will be copied into this Vector2.
     */
    getParameter(point: Vector2, target: Vector2): Vector2;
    /**
     * Determines whether or not this box intersects {@link Box2| box}.
     * @param box Box to check for intersection against.
     */
    intersectsBox(box: Box2): boolean;
    /**
     * {@link https://en.wikipedia.org/wiki/Clamping_(graphics)| Clamps} the {@link Vector2| point} within the bounds of this box.<br />
     * @param point {@link Vector2| Vector2} to clamp.
     * @param target the result will be copied into this Vector2.
     */
    clampPoint(point: Vector2, target: Vector2): Vector2;
    /**
     * Return the distance from any edge of this box to the specified point.
     * If the {@link Vector2| point} lies inside of this box, the distance will be 0.
     * @param point {@link Vector2| Vector2} to measure distance to.
     */
    distanceToPoint(point: Vector2): number;
    /**
     * Return the intersection of this and {@link Box2| box}, setting the upper bound of this box to the lesser
     * of the two boxes' upper bounds and the lower bound of this box to the greater of the two boxes' lower bounds.
     * @param box Box to intersect with.
     */
    intersect(box: Box2): Box2;
    /**
     * Unions this box with {@link Box2| box}, setting the upper bound of this box to the greater of the
     * two boxes' upper bounds and the lower bound of this box to the lesser of the two boxes' lower bounds.
     * @param box Box that will be unioned with this box.
     */
    union(box: Box2): Box2;
    /**
     * Adds {@link Vector2| offset} to both the upper and lower bounds of this box, effectively moving this box {@link Vector2| offset} units in 2D space.
     * @param offset Direction and distance of offset.
     */
    translate(offset: Vector2): Box2;
    /**
     * Return true if this box and {@link Box2| box} share the same lower and upper bounds.
     * @param box Box to compare with this one.
     */
    equals(box: Box2): boolean;
    /**
     * Apply the transform matrix on four vertexes.
     */
    applyMatrix3(matrix: Matrix3): Box2;
    /**
     * Apply the four left-top elements of matrix on four vertexes.
     */
    applyMatrix4(matrix: Matrix4): this;
    /**
     * Enlarges box2 that way its corners lie on grid.
     * Get max box based on resolution which is small than this box.
     */
    ceil(resolution?: number, eps?: number): this;
}

/**
 * A 3D box represents by {@link min| min} and {@link max| max}.
 */
export declare class Box3 {
    /**
     * {@link Vector3| Vector3} representing the lower (x, y, z) boundary of the box.
     * @defaultValue ( + Infinity, + Infinity, + Infinity ).
     */
    min: Vector3;
    /**
     * {@link Vector3| Vector3} representing the upper (x, y, z) boundary of the box.
     * @defaultValue ( - Infinity, - Infinity, - Infinity ).
     */
    max: Vector3;
    /**
     * An array of {@link Plane| Planes} represents the six faces of the box.
     */
    planes: Plane[];
    /**
     * The position of eight box's vertexes.
     */
    corners: Vector3[];
    /**
     * Check the type whether it belongs to Box3.
     * This value should not be changed by user.
     */
    isBox3: boolean;
    constructor(min?: Vector3, max?: Vector3);
    /**
     * Sets the lower and upper (x, y, z) boundaries of this box.<br>
     * Please note that this method only copies the values from the given objects.
     * @param min {@link Vector3| Vector3} representing the lower (x, y, z) boundary of the box.
     * @param max {@link Vector3| Vector3} representing the lower upper (x, y, z) boundary of the box.
     */
    set(min: Vector3, max: Vector3): Box3;
    /**
     * Sets the upper and lower bounds of this box to include all of the data in `array`.
     * @param array An array of position data that the resulting box will envelop.
     */
    setFromArray(array: ArrayLike<number>): Box3;
    /**
     * Sets the upper and lower bounds of this box to include all of the data in {@link BufferAttribute| attribute}.
     * @param attribute A buffer attribute of position data that the resulting box will envelop.
     */
    setFromBufferAttribute(attribute: BufferAttribute): Box3;
    /**
     * Sets the upper and lower bounds of this box by a part of attributes.
     * @param attribute A buffer attribute of position data that the resulting box will envelop.
     * @param start The start attributes of range.
     * @param count The count of attributes in range.
     */
    setFromBufferAttributeRange(attribute: BufferAttribute, start: number, count: number): Box3;
    /**
     * Sets the upper and lower bounds of this box by a part of vertexes' index.
     * @param positionAttribute A buffer of vertex data.
     * @param indexAttribute A buffer of vertex' index.
     * @param start The start indexes of range.
     * @param count The count of indexes in range.
     */
    setFromIndexBufferAttributeRange(positionAttribute: BufferAttribute, indexAttribute: BufferAttribute, start: number, count: number): Box3;
    /**
     * Sets the upper and lower bounds of this box to include all of the points in {@link Array| points}.
     * @param points Array of {@link Vector3| Vector3s} that the resulting box will contain.
     */
    setFromPoints(_points: Vector3[]): Box3;
    /**
     * Centers this box on {@link Vector3| center} and sets this box's width, height and depth to the values specified in {@link Vector3| size}.
     * @param center Desired center position of the box.
     * @param size Desired x, y and z dimensions of the box.
     */
    setFromCenterAndSize(_center: Vector3, size: Vector3): Box3;
    /**
     * Computes the world-axis-aligned bounding box of an {@link Object3D| Object3D} (including its children),
     * accounting for the object's, and children's, world transforms.
     * The function may result in a larger box than strictly necessary.
     * @param object {@link Object3D| Object3D} to compute the bounding box of.
     */
    setFromObject(object: Object3D): Box3;
    /**
     * Returns a new {@link Box3| Box3} with the same {@link min| min} and {@link max| max} as this clone.
     */
    clone(): Box3;
    /**
     * Copies the {@link min| min} and {@link max| max} from {@link Box3| box} to this box.
     * @param box {@link Box3| Box3} to copy.
     */
    copy(box: Box3): Box3;
    /**
     * Makes this box empty.
     */
    makeEmpty(): Box3;
    /**
     * Returns true if this box includes zero points within its bounds.
     * Note that a box with equal lower and upper bounds still includes one point, the one both bounds share.
     */
    isEmpty(): boolean;
    /**
     * Returns the center point of the box as a {@link Vector3| Vector3}.
     * @param target the result will be copied into this Vector3.
     */
    getCenter(target: Vector3): Vector3;
    /**
     * Returns the center point of the box as a {@link Vector3| Vector3}.
     * this method returns the center whatever the values of box' {@link min| min} is over than {@link max| max}.
     * @param target the result will be copied into this Vector3.
     */
    getCenterUnsafe(target: Vector3): void;
    /**
     * Returns the width, height and depth of this box.
     * @param target the result will be copied into this Vector3.
     */
    getSize(target?: Vector3): Vector3;
    /**
     * Return the position of eight box's vertexes.
     */
    getCorners(): Vector3[];
    /**
     * Return an array of planes of eight box's surface.
     */
    getPlanes(): Plane[];
    /**
     * Expands the boundaries of this box to include {@link Vector3| point}.
     * @param point {@link Vector3| Vector3} that should be included in the box.
     */
    expandByPoint(point: Vector3): Box3;
    /**
     * Expands this box equilaterally by {@link Vector3| vector}. The width of this box will be
     * expanded by the x component of {@link Vector3| vector} in both directions. The height of
     * this box will be expanded by the y component of {@link Vector3| vector} in both directions.
     * The depth of this box will be expanded by the z component of *vector* in both directions.
     * @param vector {@link Vector3| Vector3} to expand the box by.
     */
    expandByVector(vector: Vector3): Box3;
    /**
     * Expands each dimension of the box by scalar.
     * If negative, the dimensions of the box will be contracted.
     * @param scalar Distance to expand the box by.
     */
    expandByScalar(scalar: number): Box3;
    /**
     * Expands the boundaries of this box to include {@link Object3D| object} and its children,
     * accounting for the object's, and children's, world transforms.
     * The function may result in a larger box than strictly necessary.
     * @param object {@link Object3D| Object3D} to expand the box by.
     */
    expandByObject(object: Object3D): Box3;
    private _satForAxes;
    /**
     * @param triangle {@link Triangle| Triangle} to check for intersection against.
     * Determines whether or not this box intersects {@link Triangle| triangle}.
     */
    intersectsTriangle(triangle: Triangle): boolean;
    /**
     * Return true if the specified {@link Vector3| point} lies within or on the boundaries of this box.
     * @param point {@link Vector3| Vector3} to check for inclusion.
     */
    containsPoint(point: Vector3): boolean;
    /**
     * Return true if this box includes the entirety of {@link Box3| box}. If this and {@link Box3| box} are identical, this function also returns true.
     * @param box {@link Box3| Box3} to test for inclusion.
     */
    containsBox(box: Box3): boolean;
    /**
     * Return a point as a proportion of this box's width and height.
     * @param point {@link Vector3| Vector3}.
     * @param target the result will be copied into this Vector3.
     */
    getParameter(point: Vector3, target: Vector3): Vector3;
    /**
     * {@link Box3| box} Box to check for intersection against.
     * Determines whether or not this box intersects {@link Box3| box}.
     */
    intersectsBox(box: Box3): boolean;
    /**
     * Determines whether or not this box intersects {@link Sphere| sphere}.
     * @param sphere {@link Sphere| Sphere} to check for intersection against.
     */
    intersectsSphere(sphere: Sphere): boolean;
    /**
     * Determines whether or not this box intersects {@link Plane| plane}.
     * @param plane {@link Plane| Plane} to check for intersection against.
     */
    intersectsPlane(plane: Plane): boolean;
    /**
     * {@link https://en.wikipedia.org/wiki/Clamping_(graphics)| Clamps} the {@link Vector3| point} within the bounds of this box.
     * @param point {@link Vector3| Vector3} to clamp.
     * @param target the result will be copied into this Vector3.
     */
    clampPoint(point: Vector3, target: Vector3): Vector3;
    /**
     * If the {@link Vector3| point} lies inside of this box, the distance will be 0.
     * @param point {@link Vector3| Vector3} to measure distance to.
     * @return the distance from any edge of this box to the specified point.
     */
    distanceToPoint(point: Vector3): number;
    /**
     * Gets a {@link Sphere| Sphere} that bounds the box.
     * @param target the result will be copied into this Sphere.
     */
    getBoundingSphere(target: Sphere): Sphere;
    /**
     * Computes the intersection of this and {@link Box3| box}, setting the upper bound of this box to the lesser
     * of the two boxes' upper bounds and the lower bound of this box to the greater of the two boxes'
     * lower bounds. If there's no overlap, makes this box empty.
     * @param Box to intersect with.
     */
    intersect(box: Box3): Box3;
    /**
     * Computes the union of this box and {@link Box3| box}, setting the upper bound of this box to the greater of the
     * two boxes' upper bounds and the lower bound of this box to the lesser of the two boxes' lower bounds.
     * @param box Box that will be unioned with this box.
     */
    union(box: Box3): Box3;
    /**
     * If NaN exists in three values of min and max, return true.
     */
    hasNan(): boolean;
    /**
     * Check the given box is valid and let this box can contain it.
     */
    unionSafe(box: Box3): Box3;
    /**
     * Transforms this Box3 with the supplied matrix.
     * @param matrix The {@link Matrix4| Matrix4} to apply.
     */
    applyMatrix4(matrix: Matrix4): Box3;
    /**
     * Adds {@link Vector3| offset} to both the upper and lower bounds of this box, effectively moving this box {@link Vector3| offset} units in 3D space.
     * @param offset Direction and distance of offset.
     */
    translate(offset: Vector3): Box3;
    /**
     * Return true if this box and {@link Box3| box} share the same lower and upper bounds.
     * @param box Box to compare with this one.
     */
    equals(box: Box3): boolean;
    /**
     * Return the Bounding on plane XY.
     */
    toBox2(box2?: Box2): Box2;
}

/**
 * This class stores data for an attribute (such as vertex positions, face indices, normals,
 * colors, UVs, and any custom attributes ) associated with a {@link BufferGeometry | BufferGeometry },
 * which allows for more efficient passing of data to the GPU. See that page for details and a usage example.<br /><br />
 * Data is stored as vectors of any length (defined by {@link itemSize | itemSize }),
 * and in general in the methods outlined below if passing in an index, this is automatically multiplied by the vector length.
 */
export declare class BufferAttribute<T extends TypeArray = TypeArray> extends ElementEventDispatcher {
    private lastSyncedVersion;
    /**
     * The geometry attribute data store as TypedArray.
     */
    _array: T;
    /**
     * The geometry attribute data store as TypedArray.
     */
    get array(): T;
    set array(v: T);
    notifyContentChange(): void;
    /**
     * If the buffer is storing a 3-component vector (such as a position, normal, or color),
     * then this will count the number of such vectors stored.
     */
    itemSize: number;
    /**
     * If attribute data is normalized.
     */
    normalized: boolean;
    /**
     * Stores the {@link array | array's } length divided by the {@link itemSize | itemSize }.<br /><br />
     * If the buffer is storing a 3-component vector (such as a position, normal, or color),
     * then this will count the number of such vectors stored.
     */
    count: number;
    /**
     * The data of this buffer always need update.
     * @deprecated will not take effect, update `attribute.array` if need to reupload
     */
    dynamic: boolean;
    /**
     * Object containing:<br />
     * offset:Integer - Default is *0*. Position at which to start update.<br />
     * count:Integer - Default is *-1*, which means don't use update ranges. <br /><br />
     * This can be used to only update some components of stored vectors (for example, just the component related to color).
     * @deprecated will not take effect, update `attribute.array` instead
     */
    updateRange: {
        offset: number;
        count: number;
    };
    /**
     * Used to check type of this or extended instance.
     * This value should not be changed by user.
     */
    isBufferAttribute: boolean;
    /**
     * When the data is cleared from memory, this mark will be set true.
     * @deprecated never updated, always `false`.
     */
    isDataDropped: boolean;
    /**
     * Remove the data after it is uploaded to GPU memory.
     * @deprecated will not take effect
     */
    removeDataAfterUpload: boolean;
    /**
     * A version number, incremented every time the {@link needsUpdate | needsUpdate } property is set to true.
     */
    version: number;
    constructor(array: T, itemSize: number);
    /**
     * A callback function for updating. It will be called after {@link needsUpdate | needsUpdate }.
     */
    onUpdateCallback: () => void;
    /**
     * A callback function for uploading. It will be called after the data uploaded to WebGL.
     */
    onUploadCallback: () => void;
    /**
     * When this attribute is set to true, the {@link version | version } will be change.
     */
    set needsUpdate(value: boolean);
    /**
     * Change the data of {@link array | array }.
     */
    setArray(array: T): this;
    /**
     * Change the state of {@link dynamic | dynamic }.
     */
    setDynamic(value: boolean): this;
    /**
     * Copy the data to this object from source.
     * @param { BufferAttribute } source the data source.
     */
    copy(source: BufferAttribute): this;
    /**
     * Copy the data at specified position. The given index is items' index, do not need to multiply with item' size.
     * @param { number } index1 the start position of this array.
     * @param { BufferAttribute } attribute the start position of this array.
     * @param { number } index2 the start position of source array.
     */
    copyAt(index1: number, attribute: BufferAttribute, index2: number): this;
    /**
     * Copy the data from given array to this {@link array | array }.
     * @param { TypedArray } array the start position of this array.
     */
    copyArray(array: TypeArray | number[]): this;
    /**
     * Copy the data from given array to this {@link array | array }.
     * @param { Color[] } colors the start position of this array.
     */
    copyColorArray(colors: Color[]): this;
    /**
     * Copy the data which is type of Vector2 from given array to this {@link array | array }.
     * @param { Vector2[] } vectors the start position of this array.
     */
    copyVector2Array(vectors: Vector2[]): this;
    /**
     * Copy the data which is type of Vector3 from given array to this {@link array | array }.
     * @param { Vector3[] } vectors the start position of this array.
     */
    copyVector3Array(vectors: Vector3[]): this;
    /**
     * Copy the data which is type of Vector4 from given array to this {@link array | array }.
     * @param { Vector4[] } vectors the start position of this array.
     */
    copyVector4Array(vectors: Vector4[]): this;
    /**
     * Copy the data from given Array or typedArray.
     * @param { ArrayLike<number> } value an Array or TypedArray from which to copy values.
     * @param { number } offset (optional) index of the {@link array | array } at which to start copying.
     */
    set(value: ArrayLike<number>, offset?: number): this;
    /**
     * Return the x component of all items.
     */
    getX(index: number): number;
    /**
     * Set the x component of the vector at the given index.
     */
    setX(index: number, x: number): this;
    /**
     * Return the y component of all vectors.
     */
    getY(index: number): number;
    /**
     * Set the y component of the vector at the given index.
     */
    setY(index: number, y: number): this;
    /**
     * Return the z component of all vectors.
     */
    getZ(index: number): number;
    /**
     * Set the z component of the vector at the given index.
     */
    setZ(index: number, z: number): this;
    /**
     * Return the w component of all vectors.
     */
    getW(index: number): number;
    /**
     * Set the w component of the vector at the given index.
     */
    setW(index: number, w: number): this;
    /**
     * Set the x and y component of the vector at the given index.
     */
    setXY(index: number, x: number, y: number): this;
    /**
     * Set the x , y and z component of the vector at the given index.
     */
    setXYZ(index: number, x: number, y: number, z: number): this;
    /**
     * Set all component of the vector at the given index.
     */
    setXYZW(index: number, x: number, y: number, z: number, w: number): this;
    /**
     * Return the vector2 at specific position.
     */
    getVector2(index: number, out?: Vector2): Vector2;
    /**
     * Return a clone of this object.
     */
    clone(): BufferAttribute<T>;
    /**
     * Release the memory which is occupied by this instance from CPU and GPU.
     */
    destroy(): void;
    freeGPU(): void;
}

/**
 * GPU-friendly geometry container backed by buffer attributes.
 */
export declare class BufferGeometry<T extends Topology = TriangleList> extends BufferGeometryBase {
    __topologyMark: T;
    /**
     * Create a clone of this instance.
     */
    clone(): BufferGeometry<T>;
}

/**
 * An efficient representation of mesh, line, or point geometry, which includes vertex positions, face indices, normals, colors, UVs,
 * and custom attributes within buffers, reducing the cost of passing all this data to the GPU.
 * To read and edit data in BufferGeometry attributes, see {@link BufferAttribute| BufferAttribute } documentation.
 * For a less efficient but easier-to-use representation of geometry, see {@link Geometry| Geometry }.<br />
 */
declare abstract class BufferGeometryBase extends GeometryBase {
    /**
     * The name of viewer, which could be empty.
     */
    name: string;
    /**
     * The type of this instance.
     * This will be give in extended class.
     */
    type: string;
    /**
     * Flag to indicate the type of this class.
     * This value should not be changed by user.
     */
    isBufferGeometry: boolean;
    /**
     * This object is used to record all parameters which are set when instance is initialized.
     * But, change the value of this object may not change the geometry directly.
     */
    parameters: {};
    /**
     * Use BVH to accelerate rendering.
     * This value usually dose not need you to change it, it is built by the engine automatically.
     */
    meshBVH?: MeshBVH;
    /**
     * Allows for vertices to be re-used across multiple triangles; this is called using "indexed triangles". <br />
     * and works much the same as it does in Geometry: each triangle is associated with the indices of three vertices. <br />
     * This attribute therefore stores the index of each vertex for each triangular face. <br />
     * If this attribute is not set, the renderer assumes that each three contiguous positions represent a single triangle. <br />
     * This should be set by {@link setIndex| setIndex()} to avoid error.
     * @defaultValue `null`
     */
    _index: Nullable<IndexBufferAttribute>;
    get index(): IndexBufferAttribute;
    set index(v: IndexBufferAttribute);
    /**
     * Core data of Geometry such as vertex positions, normals, UVs and color.
     * @tips It's better to use {@link addAttribute| addAttribute() } or {@link setAttribute| setAttribute() } to change this.
     * @remarks See {@link BufferAttribute| BufferAttribute} for more details.
     */
    attributes: {
        [index: string]: BufferAttribute;
    };
    get position(): BufferAttribute<TypeArray>;
    get uv(): BufferAttribute<TypeArray>;
    /**
     * Split the geometry into groups, they still are rendered in different WebGL drawcalls. <br />
     * This allows an array of materials to be used with the bufferGeometry.
     * Each group is an object of the form: `{ start: Integer, count: Integer, materialIndex: Integer, instances?: Integer }`<br />
     * Start specifies the first element in this draw call – the first vertex for non-indexed geometry, otherwise the first triangle index.<br />
     * Count specifies how many vertices (or indices) are included.<br />
     * MaterialIndex specifies the material array index to use.<br />
     * Instances(optional) specifies the number of instanced object, this value do not manually set.
     */
    protected groups: BufferGroup[];
    /**
     * get group at index
     */
    getGroup(index: number): BufferGroup | undefined;
    /**
     * Split the data into different groups.
     */
    setGroup(group: BufferGroup, index: number): void;
    /**
     * set entire groups
     */
    setGroups(groups: BufferGroup[]): this;
    /**
     * push a group
     */
    pushGroup(group: BufferGroup): this;
    /**
     * Split geometry data to a new group.
     * @remarks See {@link groups| groups} for more details.
     */
    addGroup(start: number, count: number, materialIndex?: number): void;
    /**
     * Clean all objects in the {@link groups| groups}.
     */
    clearGroups(): void;
    /**
     * Determines which part of buffer will be rendered.
     * @deprecated
     * @defaultValue `{ start: 0, count: Infinity }` All data will be uploaded.
     */
    drawRange: BufferRange;
    protected boundingBox: Nullable<Box3>;
    protected boundingSphere: Nullable<Sphere>;
    /**
     * If {@link boundingBox| boundingBox} is null, it will be {@link computeBoundingBox| calculated} a new one.
     */
    getBoundingBox(): Box3;
    /**
     * If {@link boundingSphere| boundingSphere} is null, it will be {@link computeBoundingSphere| calculated} a new one.
     */
    getBoundingSphere(): Sphere;
    /**
     * Clear the bounding box and sphere and recalculate them later.
     */
    notifyShapeChanged(): void;
    /**
     * Generate a hash key according to {@link index| index} and all {@link attributes| attributes}.
     */
    getAttributeLayoutKey(): string;
    constructor();
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Clean old data of engine and load new data in next update.
     */
    attributeChanged(): void;
    /**
     * Return current instance of this class.
     */
    getBufferGeometry(): this;
    /**
     * Return current instance of this class.
     */
    getLineBufferGeometry(): this;
    /**
     * Return the instance of {@link index| index}.
     */
    getIndex(): IndexBufferAttribute;
    /**
     * Call this method to let engine refresh data of {@link meshBVH| meshBVH}.
     */
    onAttributeUpdate(): void;
    /**
     * Use this method to set new {@link index| index} for geometry.
     * @param {IndexBufferAttribute | number[]} index source data of the index.
     */
    setIndex(index: IndexBufferAttribute | number[] | TypeArray): this;
    addAttribute(name: string, attribute: BufferAttribute): this;
    /**
     * Change the given {@link attributes| attributes} for geometry.
     * @param {string} name the name of data such as position, uv and normal.
     * @param {BufferAttribute} attribute source data. see {@link BufferAttribute| BufferAttribute} for more details.
     */
    setAttribute(name: string, attribute: BufferAttribute): this;
    /**
     * Get specified {@link attributes| attributes} from geometry.
     * @param {string} name the name of target attributes.
     */
    addOrSetAttribute(name: string, array: TypeArray, itemSize: number): void;
    getAttribute(name: string): BufferAttribute | undefined;
    /**
     * Remove specified {@link attributes| attributes} from geometry.
     * @param {string} name the name of target attributes.
     */
    removeAttribute(name: string): this;
    removeAndDestroyAttribute(name: string): this;
    /**
     * Find the group which the vertex belong to.
     * @param {number} index Queried vertex index.
     */
    getGroupByVertexIndex(index: number): {
        group: BufferGroup;
        groupIndex: number;
    };
    /**
     * Change the value of {@link drawRange| drawRange}.
     * @deprecated
     */
    setDrawRange(start: number, count: number): void;
    protected checkRefreshBoundingSphereFast(): boolean;
    protected checkRefreshBoundingBoxFast(): boolean;
    /**
     * Computes bounding box according to vertexes, updating boundingBox attribute.
     * Bounding boxes aren't computed by default. They need to be explicitly computed, otherwise they are null.
     */
    computeBoundingBox(): void;
    /**
     * Computes bounding sphere according to vertexes, updating boundingSphere attribute.
     * Bounding spheres aren't computed by default. They need to be explicitly computed, otherwise they are null.
     */
    computeBoundingSphere(): void;
    /**
     * Copy the data to this object from source.
     * This method need override in derived classes to copy extended data.
     * @param {Object3D} source the data source.
     */
    copy(source: BufferGeometryBase): BufferGeometryBase;
    _computeGroups(geometry: Geometry): void;
    /**
     * UUID of this BufferGeometries instance. This gets automatically assigned, so this shouldn't be edited.
     */
    getUUID(): string;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx this parameter has not supported external Serializer yet.
     * It may cause that this method can not be used directly.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx this parameter has not supported external Deserializer yet.
     * It may cause that this method can not be used directly.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Clear the current geometry's data in memory.
     */
    freeGPU(): void;
    destroy(): void;
    destroyAttributes(): void;
    freeAttributesGpuResource(): void;
    destroyAllResourcesOwned(): void;
    freeAllGpuResourceOwned(): void;
    forceCastTopology<R extends Topology>(): BufferGeometry<R>;
}

/**
 * Draw range within a buffer geometry together with its material index.
 */
declare interface BufferGroup extends BufferRange {
    materialIndex: number;
}

declare class BufferManager {
    private webglBufferMap;
    private gl;
    private totalByteSize;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext);
    getWebGLByteSize(): number;
    get(attribute: BufferAttribute): WGLBufferData | undefined;
    delete(attribute: BufferAttribute, bufferGeometry: BufferGeometryBase): void;
    create(attribute: BufferAttribute, bufferType: number, bufferGeometry: BufferGeometryBase): void;
    freeGPU(): void;
}

/**
 * used to describe draw range
 */
declare interface BufferRange {
    /**
     * start offset of index or position
     */
    start: number;
    /**
     * index or position element count
     */
    count: number;
}

declare class BuiltInUniforms {
    currentCamera: Camera3D;
    currentDrawable: Drawable;
    resolution: Vector2;
    cameraPosition: Vector3;
    isDrawableStaticChange: boolean;
    constructor();
    reset(): void;
}

declare enum BuiltInUniformTypes {
    resolution = 0,
    cameraPosition = 1,
    normalMatrix = 2,
    viewMatrix = 3,
    modelMatrix = 4,
    modelViewMatrix = 5,
    projectionMatrix = 6,
    lodInfo = 7,
    boneTexture = 8,
    boneTextureSize = 9
}

/**
 * BVH over source-provided primitive bounds in model space.
 */
export declare class BVH<TPrimitive> {
    private source;
    private maxLeafSize;
    private nodes;
    private sorted;
    private indices;
    constructor(source: BVHSource<TPrimitive>, maxLeafSize?: number);
    build(): void;
    getBBox3(): {
        boxMin: [number, number, number];
        boxMax: [number, number, number];
    };
    search(intersectNode: (node: BVHNode) => IntersectContainment, intersectPrimitive: (primitive: TPrimitive) => boolean): number[];
}

declare interface BVH_2 {
    pick(ox: number, oy: number, oz: number, tx: number, ty: number, tz: number): Uint32Array;
    free(): void;
}

export declare interface BVHNode {
    boxMin: [number, number, number];
    boxMax: [number, number, number];
    left: number;
    right: number;
    parent: number;
    start: number;
    end: number;
    isLeaf: boolean;
}

export declare interface BVHSource<TPrimitive> {
    build(): PrimitiveBuffers;
    createEmpty(): TPrimitive;
    get(localIdx: number, primitive: TPrimitive): void;
}

/**
 * Abstract base class for cameras. This class should always be inherited when you build a new camera,
 * such as perspective and orthographic camera.
 * The abstracted function need to respectively implement for different types of cameras.
 */
export declare abstract class Camera3D extends Object3D {
    enableFrustumCulling: boolean;
    enableDetailCulling: boolean;
    /**
     * Check the type whether it belongs to Camera3D.
     * This value should not be changed by user.
     */
    isCamera3D: boolean;
    /**
     * The type of this Object3D.
     */
    type: string;
    /**
     * This is the inverse of matrixWorld. MatrixWorld contains the Matrix which has the world transform of the Camera3D.
     */
    matrixWorldInverse: Matrix4;
    worldRotation: Matrix4;
    worldPosition: Vector3;
    /**
     * This matrix decides the method of projection such as perspective and orthographic.
     */
    projectionMatrix: Matrix4;
    /**
     * The inverse matrix of {@link projectionMatrix| projectionMatrix }.
     */
    projectionMatrixInverse: Matrix4;
    /**
     * This is used to adapt the bounds of camera to canvas.
     */
    bounds: Vector4;
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Make the engine to render the scene again.
     */
    notifyCameraChanged(): void;
    /**
     * Copy the data to this camera instance from source.
     * This method need override in derived classes to copy extended data.
     * @param {Camera3D} source the data source.
     * @param {boolean} recursive if true, descendants of the object are also cloned. Default is true.
     */
    copy(source: Camera3D, recursive?: boolean): this;
    /**
     * Set the value of camera's faced direction to given vector.
     * @param {Vector3} target this vector representing the world space direction in which the camera is looking.
     */
    getWorldDirection(target: Vector3): Vector3;
    /**
     * Update the camera's {@link Object3D.matrixWorld| matrixWorld } and {@link matrixWorldInverse| matrixWorldInverse }.
     * @param {boolean} updateParents if true, it also updates all the parents.
     * @param {boolean} updateChildren if true, it also updates all the children.
     * @param {boolean} force Whether or not force to updates the matrix.
     */
    updateWorldMatrix(updateParents: boolean, updateChildren: boolean, force?: boolean): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Update the projection matrix base on different type of camera. And a modification also can be applied on the projection.
     */
    abstract updateProjectionMatrix(jitter?: {
        offset: Vector2;
        canvas_size: Vector2;
    }): void;
    private _jitter;
    updateJitter(jitter: ReadonlyVector2): void;
    getJitter(): Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    updatePrev(): void;
    /**
     * how many screen pixels rendered in 1 distance from camera
     */
    abstract getPixelsOfDistOne(): number;
    /**
     * Calculate how many screen pixel match one world unit at given distance.
     * @param {number} distance the distance from camera to object.
     * @param {number} viewHeight the hight of view window.
     */
    abstract pixelsPerUnit(distance: number, viewHeight: number): number;
    /**
     * return a function that compute pixelsPerUnit
     */
    pixelsPerUnitCreator(viewHeight: number): (distance: number) => number;
    /**
     * Calculate a scale value that keep one object's screen unit size match it's world unit size
     * @param {number} distance the distance from camera to object.
     * @param {number} viewHeight the hight of view window.
     */
    getViewIndependentScaleRatio(distance: number, viewHeight: number): number;
    /**
     * Set the origin and direction for ray.
     * @param {Ray} ray the calculate result will be set to this.
     * @param {Vector2} coords the position of window where the ray through out.
     */
    abstract castRay(ray: Ray, coords: Vector2): void;
}

declare interface CameraView {
    fullWidth: number;
    fullHeight: number;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    enabled: boolean;
}

declare interface ClassNamePreserved {
    className(): string;
}

/**
 * Shader component that applies clipping-plane logic to a material.
 */
declare class ClippingShaderComponent extends SharedShaderComponent {
    className(): string;
    constructor(isSceneClipping?: boolean);
    private isSceneClipping;
    private get uniformName();
    private _clippingPlanes;
    get clippingPlanes(): Plane[];
    set clippingPlanes(value: Plane[]);
    updateClipping(): void;
    private transformedPlanes;
    get planeCount(): number;
    copy(other: ClippingShaderComponent): this;
    clone(): ClippingShaderComponent;
    updatePlane(camera: Camera3D): void;
    extendShaderShape(builder: ShaderBuilder): void;
    extendShaderShading(_builder: ShaderBuilder): void;
    updateShapeUniforms(program: WGLProgram): void;
    generateShaderKey(): string;
    computeShapeKey(): string;
    serialize(ctx: Serializer<any>): void;
    deserialize(ctx: Deserializer): void | Promise<void>;
}

/**
 * Object for keeping track of time.
 */
declare class Clock {
    /**
     * If set, starts the clock automatically when the first update is called.
     * @DefaultValue is true.
     */
    autoStart: boolean;
    /**
     * Holds the time at which the clock's start method was last called.
     */
    startTime: number;
    /**
     * Holds the time at which the clock's {@link start| start}, {@link getElapsedTime| getElapsedTime} or {@link getDelta| getDelta} methods were last called.
     */
    oldTime: number;
    /**
     * Keeps track of the total time that the clock has been running.
     */
    elapsedTime: number;
    /**
     * Whether the clock is running or not.
     */
    running: boolean;
    constructor(autoStart?: boolean);
    /**
     * Starts clock.
     * Also sets the {@link startTime| startTime} and {@link oldTime| oldTime} to the current time, sets {@link elapsedTime| elapsedTime} to 0 and running to true.
     */
    start(): void;
    /**
     * Stops clock and sets {@link oldTime| oldTime} to the current time.
     */
    stop(): void;
    /**
     * Get the seconds passed since the clock started and sets {@link oldTime| oldTime} to the current time.
     * If {@link autoStart| autoStart} is true and the clock is not running, also starts the clock.
     */
    getElapsedTime(): number;
    /**
     * Get the seconds passed since the time {@link oldTime| oldTime} was set and sets oldTime to the current time.
     * If {@link autoStart| autoStart} is true and the clock is not running, also starts the clock.
     */
    getDelta(): number;
}

declare interface CollectedBufferDescriptor {
    type: string;
    offset: number;
    length: number;
    index: number;
}

/**
 * Class representing a color.
 */
export declare class Color {
    /**
     * Red channel value between 0 and 1.
     * @defaultValue `1`.
     */
    r: number;
    /**
     * Green channel value between 0 and 1.
     * @defaultValue `1`.
     */
    g: number;
    /**
     * Blue channel value between 0 and 1.
     * @defaultValue `1`.
     */
    b: number;
    /**
     * Check the type whether it belongs to Color.
     * This value should not be changed by user.
     */
    isColor: boolean;
    get x(): number;
    get y(): number;
    get z(): number;
    constructor(color_or_r?: string | Color | number, g?: number, b?: number);
    /**
     * Sets this color from RGB values.
     * @param r Red channel value between 0.0 and 1.0.
     * @param g Green channel value between 0.0 and 1.0.
     * @param b Blue channel value between 0.0 and 1.0.
     */
    setRGB(r: number, g: number, b: number): Color;
    /**
     * Copies the {@link r| r}, {@link g| g} and {@link b| b} parameters from {@link Color| color} in to this color.
     */
    copy(color: Color): Color;
    /**
     * Sets this color from a hexadecimal value.
     * @param hex {@link https://en.wikipedia.org/wiki/Web_colors#Hex_triplet| hexadecimal triplet} format.
     */
    setHex(hex: number): Color;
    private hue2rgb;
    /**
     * Sets color from HSL values.
     * @param h hue value between 0.0 and 1.0.
     * @param s saturation value between 0.0 and 1.0.
     * @param l lightness value between 0.0 and 1.0.
     */
    setHSL(h: number, s: number, l: number): Color;
    /**
     * Translucent colors such as "rgba(255, 0, 0, 0.5)" and "hsla(0, 100%, 50%, 0.5)" are also accepted,
     * but the alpha-channel coordinate will be discarded.
     * @Note that for X11 color names, multiple words such as Dark Orange become the string 'darkorange' (all lowercase).
     * @param style color as a CSS-style string.
     * Sets this color from a CSS-style string. For example,
     * "rgb(250, 0,0)",
     * "rgb(100%, 0%, 0%)",
     * "hsl(0, 100%, 50%)",
     * "#ff0000",
     * "#f00", or
     * "red" ( or any {@link https://en.wikipedia.org/wiki/X11_color_names#Color_name_chart| X11 color name}
     * - all 140 color names are supported ).<br />
     */
    setStyle(style: string): Color;
    /**
     * See the Constructor above for full details of what {@link Color_Hex_or_String| value} can be.
     * Delegates to {@link .copy| .copy}, {@link .setStyle| .setStyle}, or {@link setHex| setHex} depending on input type.
     * @param value Value to set this color to.
     */
    set(value: string | Color | number): Color;
    /**
     * Sets all three color components to the value {@link Float| scalar}.
     * @param scalar a value between 0.0 and 1.0.
     */
    setScalar(scalar: number): Color;
    /**
     * Return a new Color with the same {@link r| r}, {@link g| g} and {@link b| b} values as this clone.
     */
    clone(): Color;
    cloneReadonly(): ReadonlyColor;
    /**
     * Copies the given color into this color, and then converts this color from gamma space to linear space
     * by taking {@link r| r}, {@link g| g} and {@link b| b} to the power of {@link Float| gammaFactor}.
     * @param color Color to copy.
     * @param gammaFactor (optional).
     * @defaultValue `2.0`.
     */
    copyGammaToLinear(color: Color, gammaFactor?: number): Color;
    /**
     * Copies the given color into this color, and then converts this color from linear space to gamma space
     * by taking {@link r| r}, {@link g| g} and {@link b| b} to the power of 1 / {@link Float| gammaFactor}.
     * @param color Color to copy.
     * @param gammaFactor (optional).
     * @defaultValue `2.0`.
     */
    copyLinearToGamma(color: Color, gammaFactor?: number): Color;
    /**
     * Converts this color from gamma space to linear space by taking {@link .r| r}, {@link .g| g} and {@link .b| b} to the power of {@link Float| gammaFactor}.
     * @param gammaFactor (optional).
     * @defaultValue `2.0`.
     */
    convertGammaToLinear(gammaFactor?: number): Color;
    /**
     * Converts this color from linear space to gamma space by taking {@link .r| r}, {@link .g| g} and {@link .b| b} to the power of 1 / {@link Float| gammaFactor}.
     * @param gammaFactor (optional).
     * @defaultValue `2.0`.
     */
    convertLinearToGamma(gammaFactor?: number): Color;
    private SRGBToLinear;
    /**
     * Copies the given color into this color, and then converts this color from sRGB space to linear space.
     * @param color Color to copy.
     */
    copySRGBToLinear(color: Color): Color;
    private LinearToSRGB;
    /**
     * Copies the given color into this color, and then converts this color from linear space to sRGB space.
     * @param color Color to copy.
     */
    copyLinearToSRGB(color: Color): Color;
    /**
     * Converts this color from sRGB space to linear space.
     */
    convertSRGBToLinear(): Color;
    /**
     * Converts this color from linear space to sRGB space.
     */
    convertLinearToSRGB(): Color;
    /**
     * Returns the hexadecimal value of this color.
     */
    getHex(): number;
    /**
     * Returns the hexadecimal value of this color as a string (for example, 'FFFFFF').
     */
    getHexString(): string;
    /**
     * Convert this Color's {@link .r| r}, {@link .g| g} and {@link .b| b} values to {@link https://en.wikipedia.org/wiki/HSL_and_HSV| HSL}
     * format and returns an object of the form:
     * `{ h: 0, s: 0, l: 0 }`
     * @param target the result will be copied into this Object. Adds h, s and l keys to the object (if not already present).
     */
    getHSL(target: HSL): HSL;
    /**
     * Returns the value of this color as a CSS style string. Example: `rgb(255,0,0)`.
     */
    getStyle(): string;
    /**
     * Adds the RGB values of {@link Color| color} to the RGB values of this color.
     */
    add(color: Color): Color;
    /**
     * Sets this color's RGB values to the sum of the RGB values of color1 and color2.
     */
    addColors(color1: Color, color2: Color): Color;
    /**
     * Adds {@link Number| s} to the RGB values of this color.
     */
    addScalar(s: number): Color;
    /**
     * Subtracts the RGB components of the given color from the RGB components of this color.
     * If this results in a negative component, that component is set to zero.
     */
    sub(color: Color): Color;
    /**
     * Multiplies this color's RGB values by the given {@link Color| color}'s RGB values.
     */
    multiply(color: Color): Color;
    /**
     * Multiplies this color's RGB values by s.
     */
    multiplyScalar(s: number): Color;
    /**
     * Linearly interpolates this color's RGB values toward the RGB values of the passed argument.
     * The alpha argument can be thought of as the ratio between the two colors, where 0.0 is this color and 1.0 is the first argument.
     * @param color color to converge on.
     * @param alpha interpolation factor in the closed interval [0, 1].
     */
    lerp(color: Color, alpha: number): Color;
    /**
     * Compares the RGB values of {@link Color| color} with those of this object. Returns true if they are the same, false otherwise.
     */
    equals(c: Color): boolean;
    /**
     * Sets this color's components based on an array formatted like [ r, g, b ].
     * @param array Array of floats in the form [ r, g, b ].
     * @param offset An optional offset into the array.
     */
    fromArray(array: ArrayLike<number>, offset?: number): Color;
    /**
     * r,g,b return 3
     */
    getNumberCount(): number;
    /**
     * Returns an array of the form [ r, g, b ].
     * @param array An optional array to store the color to.
     * @param offset An optional offset into the array.
     */
    toArray(array?: number[], offset?: number): number[];
    /**
     * Adds the given h, s, and l to this color's values.
     * Internally, this converts the color's r, g and b values to HSL,
     * adds h,s,l, and then converts the color back to RGB.
     */
    offsetHSL(h: number, s: number, l: number): Color;
    /**
     * Linearly interpolates this color's HSL values toward the HSL values of the passed argument.
     * It differs from the classic {@link lerp| lerp} by not interpolating straight from one color to the other,
     * but instead going through all the hues in between those two colors.
     * The alpha argument can be thought of as the ratio between the two colors, where 0.0 is this color and 1.0 is the first argument.
     */
    lerpHSL(color: Color, alpha: number): this;
    /**
     * Converts a hexadecimal color number to a string.
     * `Color.hex2string(0xffffff);
     * -hex - Number in hex (e.g., `0xffffff`)
     * -return The string color (e.g., `"#ffffff"`).`
     */
    static hex2string(hex: number): string;
    /**
     * Converts a hexadecimal color number to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
     * `Color.hex2rgb(0xffffff); // returns [1, 1, 1]
     * -hex The hexadecimal number to convert
     * -out If supplied, this array will be used rather than returning a new one
     * -return An array representing the [R, G, B] of the color where all values are floats.`
     */
    static hex2rgb(hex: number, out?: number[] | Float32Array): number[] | Float32Array;
    /**
     * Converts a color as an [R, G, B] array to a hex number
     */
    static rgb2hex(rgb: number[] | Float32Array): number;
    /**
     * Converts a hexadecimal string to a hexadecimal color number.
     * `Color.string2hex("#ffffff"); // returns 0xffffff
     * -string - The string color (e.g., `"#ffffff"`)
     * -return Number in hexadecimal.`
     */
    static string2hex(string: string): number;
}

declare class ColorShaderComponent<T extends Texture2D | TextureV2 = Texture2D> extends ShaderComponent {
    color: ReadonlyColor;
    texture: Nullable<T>;
    constructor();
    className(): string;
    extendShaderShading(builder: ShaderBuilder): void;
    updateShadingUniforms(program: WGLProgram): void;
    copy(other: ColorShaderComponent<T>): this;
    clone(): ColorShaderComponent<T>;
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void;
}

declare class ColorState {
    private color;
    private currentColorMask;
    currentColorClear: Vector4;
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext);
    setMask(red: boolean, green?: boolean, blue?: boolean, alpha?: boolean): void;
    setClear(r: number, g: number, b: number, a: number, premultipliedAlpha?: boolean): void;
    reset(): void;
}

/**
 * This class give a simple shading method for the objects which does not need complicated shading,
 * such as {@link PointsMaterial| PointsMaterial}, {@link FatLineMaterial| FatLineMaterial} and {@link LineBasicMaterial| LineBasicMaterial}.
 */
declare class ColorWithAlpha extends ShaderComponent {
    /**
     * Determine the color's rgb.
     */
    color: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    /**
     * Determine the alpha of color's rgba.
     */
    opacity: number;
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Change the corresponding attribute according to the values of given {@link ColorWithAlphaParam| parameters}.
     * @param {ColorWithAlphaParam} values a object of specified type contains parameters.
     */
    setValues(param: ColorWithAlphaParam): void;
    extendShaderShading(builder: ShaderBuilder): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Copy the data to this instance from other instance.
     * @param {ColorWithAlpha} other the source of copied data.
     */
    copy(other: ColorWithAlpha): this;
    /**
     * Return a cloned instance of this class.
     */
    clone(): ColorWithAlpha;
}

declare type ColorWithAlphaParam = ConvertMaterialParameters<Pick<ColorWithAlpha, 'color' | 'opacity'>>;

declare abstract class CombinedObjectGroup extends Object3D {
    abstract destroyCombined(): void;
}

declare function combineSplatData(source: SplatData[], target?: SplatData): SplatData;

declare class CompositePlugin extends PipelinePlugin {
    readonly PLUGIN_NAME = "composite";
    private staticFrameCacheEnabled;
    private hasStaticCacheFrame;
    private _multiSamplingEnabled;
    private get multiSamplingEnabled();
    private copyMaterial;
    get bound(): Vector4 | undefined;
    set bound(v: Vector4 | undefined);
    private quad?;
    private updateQuad;
    private _shouldMacWorkaround;
    get enabled(): boolean;
    set enabled(v: boolean);
    destroy(): void;
    updateFrameSize(): void;
    updateEffect(_scene: SceneAdaptor, isFrameStable: boolean, isCameraStable: boolean, effectConfig: IEffectConfig): void;
    updateGraphHash(hasher: HashKeyBuilder): void;
    updateRenderGraph(graph: RenderGraph): void;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        macWorkaround: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        multiSamplingEnabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        staticFrameCacheEnabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
    };
    notifyChanged(): void;
}

export declare class CompressedSplat extends Splat {
    readonly PackType = "compressed";
    constructor(counts: number, shDegree: number, splat1Tex: SourceTexture, splat2Tex: SourceTexture, sh1Tex?: SourceTexture, sh2Tex?: SourceTexture, sh3Tex?: SourceTexture, sh4Tex?: SourceTexture);
    createUnpackSplatShader(): string;
    createUnpackSHShader(): string;
    onGpuDataPacked(): void;
}

declare class CompressedSplatData extends SplatData {
    counts: number;
    shDegree: number;
    private splat1Sampler;
    private splat1Float32Buffer;
    private splat1Uint16Buffer;
    private splat2Sampler;
    private splat2Uint16Buffer;
    private splat2Uint32Buffer;
    private sh1Sampler;
    private sh1Uint32Buffer;
    private sh2Sampler;
    private sh2Uint32Buffer;
    private sh3Sampler;
    private sh3Uint32Buffer;
    private sh4Sampler;
    private sh4Uint32Buffer;
    init(counts: number, shDegree: number): void;
    set(i: number, single: ISingleSplat): void;
    setCenter(i: number, x: number, y: number, z: number): void;
    setScale(i: number, sx: number, sy: number, sz: number): void;
    setQuat(i: number, qx: number, qy: number, qz: number, qw: number): void;
    setColor(i: number, r: number, g: number, b: number): void;
    setAlpha(i: number, a: number): void;
    setShN(i: number, shN: number[]): void;
    get(i: number, single: ISingleSplat): void;
    getCenter(i: number, single: ISingleSplat): void;
    getScale(i: number, single: ISingleSplat): void;
    getQuat(i: number, single: ISingleSplat): void;
    getColor(i: number, single: ISingleSplat): void;
    getAlpha(i: number, single: ISingleSplat): void;
    getShN(i: number, shN: number[]): void;
    fillCenters(centers: Float32Array): void;
    serialize(): ISplatData;
    deserialize(data: ISplatData): void;
}

/**
 * Supported texture compressed method.
 * @remarks see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Compressed_texture_formats| Graphics lineStyle} for more details.
 */
declare enum CompressTextureType {
    S3TC = 1,
    /**
     * @deprecated PVRTC not supported
     */
    PVRTC = 2,
    BPTC = 3,
    ETC2 = 4,
    ASTC = 5
}

declare function computeDenseBox(operator: SplatOperator, ratio?: number): {
    boxMin: number[];
    boxMax: number[];
};

declare interface ConfigCell<T> {
    get: () => T;
    set: (value: T) => void;
}

declare interface ConfigCell_2<T> {
    get: () => T;
    set: (value: T) => void;
}

declare type ConfigCellImpl<T> = T extends object ? {
    [P in keyof T]?: T[P] extends ConfigCell<infer V> ? V : ConfigCellImpl<T[P]>;
} : T;

declare interface ConfigCellObject {
    [key: string]: ConfigCell_2<any> | ConfigCellObject;
}

declare type ConfigMethod = (renderer: RendererAdaptor) => boolean;

declare type ConvertMaterialParameters<T> = Partial<SubTypeMap<T, ReadonlyColor, number | string | ReadonlyColor>>;

/**
 * This class is used to draw a fixed coordinate system on screen.
 */
declare class CoordinateSystemHelper implements Renderable {
    /**
     * The switch of this effect.
     * @defaultValue `false`.
     */
    enabled: boolean;
    arrowHelperX: ArrowHelper;
    arrowHelperY: ArrowHelper;
    arrowHelperZ: ArrowHelper;
    total_length: number;
    private location;
    private isCameraNeedsUpdate;
    private axisCamera;
    private alphabetX;
    private alphabetY;
    private alphabetZ;
    private isWithAlphabets;
    destroy(): void;
    constructor(isWithAlphabets?: boolean);
    private createArrowAxis;
    private createAlphabet;
    getLocation(): Vector3;
    setLocation(x?: number, y?: number, size?: number): void;
    setAlphabetParam(scale?: number, colorX?: Color, colorY?: Color, colorZ?: Color): void;
    setAlphabetOffset(offsetX?: Vector3, offsetY?: Vector3, offsetZ?: Vector3): void;
    updateAxisCamera(camera: Camera3D): void;
    private renderArrowHelper;
    private renderAlphabet;
    private renderByOrder;
    config(_: IRenderer): boolean;
    render(renderer: IRenderer): void;
}

declare function createSplat(data: SplatData): Promise<Splat>;

declare function createSplatData(splat: Splat): SplatData;

declare function createSplatModifyData(splat: Splat): ISplatModifyData;

export declare function createViewer(name: string, container: HTMLElement, config: EngineInitializeConfig): Viewer;

/**
 * Creates a viewer context for a viewer and viewport.
 */
export declare function createViewerContext(viewer: Viewer, viewport?: Viewport): IViewerContext;

declare class CubeCamera {
    cameras: PerspectiveCamera[];
    static cubeDirections: Vector3[];
    static cubeUps: Vector3[];
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    update(worldMatrix: Matrix4): void;
    destroy(): void;
}

/**
 * An extensible curve object which contains methods for interpolation.
 */
declare class Curve<T extends Vector> implements SerializerableDelegatedAsReference {
    /**
     * The type of this curve.
     */
    type: string;
    /**
     * Divide this curve into how many parts of segments
     */
    arcLengthDivisions: number;
    cacheArcLengths: number[];
    needsUpdate: boolean;
    private _uuid;
    get uuid(): string;
    set uuid(uuid: string);
    getUUID(): string;
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void;
    className(): string;
    constructor();
    /**
     * Returns a vector for point t of the curve where t is between 0 and 1.
     */
    getPoint(_t: number, _optionalTarget?: T): T;
    /**
     * Returns a vector for point at relative position in curve according to arc length.
     */
    getPointAt(u: number, optionalTarget?: T): T;
    /**
     * Get sequence of points using getPoint(t).
     */
    getPoints(divisions?: number): T[];
    toArray(path?: number[], divisions?: number): number[];
    /**
     * Get sequence of equi-spaced points using getPointAt(u)
     */
    getSpacedPoints(divisions?: number): T[];
    /**
     * Get total curve arc length
     */
    getLength(): number;
    /**
     * Get list of cumulative segment lengths
     */
    getLengths(divisions?: number): number[];
    /**
     * Update the cumulative segment distance cache
     */
    updateArcLengths(): void;
    /**
     * Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equi distance
     */
    getUtoTmapping(u: number, distance?: number): number;
    /**
     * Returns a unit vector tangent at t. If the subclassed curve do not implement its tangent derivation,
     * 2 points a small delta apart will be used to find its gradient which seems to give a reasonable approximation
     */
    getTangent(t: number): T;
    /**
     * Returns tangent at equidistance point u on the curve.
     */
    getTangentAt(u: number): T;
    /**
     * @remarks see {@link http://www.cs.indiana.edu/pub/techreports/TR425.pdf | Frenet Frames}
     */
    computeFrenetFrames(segments: number, closed: boolean): any;
    clone(): Curve<T>;
    copy(source: Curve<T>): this;
    toJSON(): any;
    fromJSON(json: any): Curve<T>;
    static adaptive: boolean;
    static maxLength: number;
    static minSegments: number;
    static maxSegments: number;
    static epsilon: number;
    static segmentsCount(length: number, defaultSegments?: number): number;
}

/**
 * A basic class for curve which can be drawn in {@link Path | path }. 2d space
 */
declare class Curve2D extends Curve<Vector2> {
    getBounds(bounds?: Box2): Box2;
    clone(): Curve2D;
    className(): string;
}

declare interface CustomCamera {
    type: Camera3D;
    size: Size;
}

declare type CustomPassMethod = (node: PassNode, ctx: PassExecuteCtx) => void;

/**
 * A point's {@link https://en.wikipedia.org/wiki/Cylindrical_coordinate_system| cylindrical coordinates}.
 */
declare class Cylindrical {
    /**
     * The radius of bottom cycle.
     */
    radius: number;
    /**
     * counterclockwise angle in the x-z plane measured in radians from the positive z-axis.
     * @defaultValue `0`.
     */
    theta: number;
    /**
     * height above the x-z plane.
     * @defaultValue `0`.
     */
    y: number;
    constructor(radius?: number, theta?: number, y?: number);
    /**
     * Sets values of this cylinder's {@link radius| radius}, {@link theta| theta} and {@link y| y} properties.
     */
    set(radius: number, theta: number, y: number): Cylindrical;
    /**
     * Returns a new cylinder with the same {@link radius| radius}, {@link theta| theta} and {@link y| y} properties as this one.
     */
    clone(): Cylindrical;
    /**
     * Copies the values of the passed cylinder's {@link radius| radius}, {@link theta| theta} and {@link y| y} properties to this cylinder.
     */
    copy(other: Cylindrical): Cylindrical;
    /**
     * Sets values of this cylinder's {@link radius| radius}, {@link theta| theta} and {@link y| y} properties from the {@link Vector3| Vector3}.
     */
    setFromVector3(v: Vector3): Cylindrical;
    /**
     * Sets values of this cylinder's {@link radius| radius}, {@link theta| theta} and {@link y| y} properties from Cartesian coordinates.
     */
    setFromCartesianCoords(x: number, y: number, z: number): Cylindrical;
}

declare abstract class DAGNode {
    readonly name: string;
    private readonly uid;
    protected toNodes: Set<DAGNode>;
    protected fromNodes: Set<DAGNode>;
    constructor(name: string);
    private addFromRef;
    private removeFromRef;
    private addToRef;
    private removeToRef;
    depend(node: DAGNode): this;
    connect(node: DAGNode): this;
    disconnect(node: DAGNode): this;
    disconnectAll(to?: boolean, from?: boolean): this;
    traverseDFS(callback: (node: DAGNode) => void, visited?: Set<DAGNode>, actives?: Set<DAGNode>): void;
    private fulfills;
    getTopologicalSortedList(): DAGNode[];
}

declare enum DebugMode {
    Depth = 0,
    Normal = 1
}

declare class DebugPlugin extends PipelinePlugin {
    readonly PLUGIN_NAME = "debug";
    private debugMode;
    private normalMaterial;
    private depthMaterial;
    private dispatcher;
    private drivenCullingMaterial;
    private drivenShadingMaterial;
    destroy(): void;
    updateFrameSize(_width: number, _height: number): void;
    updateEffect(_scene: SceneAdaptor, _isFrameStable: boolean, _isCameraStable: boolean, _effectConfig: IEffectConfig): void;
    updateGraphHash(_hasher: HashKeyBuilder): void;
    updateRenderGraph(graph: RenderGraph, context: PipelineContext, depthPyramid: RenderTargetNode): void;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        debugMode: {
            get: () => DebugMode;
            set: (v: DebugMode) => void;
        };
        depthPacking: {
            get: () => DepthPackingStrategies;
            set: (v: DepthPackingStrategies) => void;
        };
    };
}

declare interface DeferredMaterial extends Material {
    isSupportDeferred: true;
    extendEncodeDeferred(builder: ShaderBuilder): void;
    updateDeferredUniform(p: WGLProgram): void;
}

declare class DeferredPlugin extends PipelinePlugin {
    readonly PLUGIN_NAME = "deferred";
    private mixOITMaterial;
    isAutoExposedEnabled: boolean;
    private keyMinuend;
    private result;
    private dispatcher;
    private forwardDispatcher;
    private dynamicLightsDispatcher;
    private copier;
    private copyMaterial;
    private enableWhiteBalance;
    private dialuxLuminance;
    private dialuxWhiteBalanceExposure;
    private drivenEnabled;
    private _enablePseudoColor;
    private get enablePseudoColor();
    private set enablePseudoColor(value);
    private _decodeSrgb;
    private get decodeSrgb();
    private set decodeSrgb(value);
    private pseudoColorMaterial;
    private exposedCopier;
    private exposedToneMappingCopier;
    private histogramComputeMaterial;
    private avgLuminanceMaterial;
    private depthCopier;
    private deferredDirectionalLightMaterial;
    private deferredSpotLightMaterial;
    private deferredPointLightMaterial;
    private deferredAmbientLightMaterial;
    private deferredRectAreaLightMaterial;
    private deferredDiskAreaLightMaterial;
    private drivenCullingMaterial;
    private drivenShadingMaterial;
    private deferredQuad;
    constructor(scene: SceneAdaptorDispatcher, renderer: RendererAdaptor);
    get envSupported(): boolean;
    destroy(): void;
    updateFrameSize(): void;
    updateEffect(): void;
    updateGraphHash(hasher: HashKeyBuilder): void;
    private createOitPass;
    updateRenderGraph(graph: RenderGraph, context: PipelineContext, depthPyramid: RenderTargetNode): void;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        enableWhiteBalance: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        enablePseudoColor: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        pseudoColors: {
            get: () => number[];
            set: (v: number[]) => void;
        };
        pseudoGradations: {
            get: () => number[];
            set: (v: number[]) => void;
        };
        temperature: {
            get: () => number;
            set: (v: number) => void;
        };
        autoExposedEnabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        keyMinuend: {
            get: () => number;
            set: (v: number) => void;
        };
        gamma: {
            get: () => number;
            set: (v: number) => void;
        };
        multiplier: {
            get: () => number;
            set: (v: number) => void;
        };
        burnValue: {
            get: () => number;
            set: (v: number) => void;
        };
        contrast: {
            get: () => number;
            set: (v: number) => void;
        };
        decodeSrgb: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
    };
}

/**
 * @deprecated
 */
declare interface DeprecatedPipelineConfig {
    isPreferMultiSampling: ConfigCell_2<boolean>;
    debug: {
        enabled: ConfigCell_2<boolean>;
    };
    renderMode: {
        type: ConfigCell_2<RenderMode>;
    };
    deferred: {
        enabled: ConfigCell_2<boolean>;
        enableWhiteBalance: ConfigCell_2<boolean>;
        enablePseudoColor: ConfigCell_2<boolean>;
        pseudoColorConfig: ConfigCell_2<{
            colors: number[];
            gradations: number[];
        }>;
        temperature: ConfigCell_2<number>;
        autoExposedEnabled: ConfigCell_2<boolean>;
        keyMinuend: ConfigCell_2<number>;
        gamma: ConfigCell_2<number>;
        multiplier: ConfigCell_2<number>;
        burnValue: ConfigCell_2<number>;
        contrast: ConfigCell_2<number>;
    };
    OIT: {
        enabled: ConfigCell_2<boolean>;
    };
    outline: {
        useMrt: ConfigCell_2<boolean>;
        highQuality: ConfigCell_2<boolean>;
        enablePhongSolidMode: ConfigCell_2<boolean>;
        enableDepth: ConfigCell_2<boolean>;
        outlineMaskEnabled: ConfigCell_2<boolean>;
        outlineColor: ConfigCell_2<Color>;
        solidBaseColor: ConfigCell_2<Color>;
        edgeThickness: ConfigCell_2<number>;
        indexEdgeThickness: ConfigCell_2<number>;
        normalEdgeThickness: ConfigCell_2<number>;
        depthEdgeThickness: ConfigCell_2<number>;
        coefficient: ConfigCell_2<number>;
        normalCoefficient: ConfigCell_2<number>;
        indexCoefficient: ConfigCell_2<number>;
        depthCoefficient: ConfigCell_2<number>;
    };
    toon: {
        tooniness: ConfigCell_2<number>;
        toonColor: ConfigCell_2<Color>;
        diffuseColor: ConfigCell_2<Color>;
        smoothnessMin: ConfigCell_2<number>;
        smoothnessMax: ConfigCell_2<number>;
    };
    stylizeFilter: {
        enabled: ConfigCell_2<boolean>;
        /** @deprecated use target instead */
        applyToBackgroundAndGround: ConfigCell_2<boolean>;
        target: ConfigCell_2<FilterTarget>;
        brightness: ConfigCell_2<number>;
        contrast: ConfigCell_2<number>;
        saturation: ConfigCell_2<number>;
        hue: ConfigCell_2<number>;
        colorBalance: ConfigCell_2<Vector3>;
        texture: ConfigCell_2<Texture | null>;
        lut: ConfigCell_2<Texture | null>;
    };
    ao: {
        enabled: ConfigCell_2<boolean>;
        aoBias: ConfigCell_2<number>;
        aoRadius: ConfigCell_2<number>;
        aoIntensity: ConfigCell_2<number>;
        blurKernelRadius: ConfigCell_2<number>;
        blurEdgeSharpness: ConfigCell_2<number>;
    };
    planarShadow: {
        enabled: ConfigCell_2<boolean>;
        downScale: ConfigCell_2<number>;
        intensity: ConfigCell_2<number>;
        blurKernelRadius: ConfigCell_2<number>;
        maxGroundThickness: ConfigCell_2<number>;
        maxGroundHeight: ConfigCell_2<number>;
    };
    shadow: {
        enableTemporal: ConfigCell_2<boolean>;
        targetJitterSize: ConfigCell_2<number>;
    };
    highLight: {
        enabled: ConfigCell_2<boolean>;
        width: ConfigCell_2<number>;
        colorA: ConfigCell_2<Color>;
        colorB: ConfigCell_2<Color>;
        borderOpacity: ConfigCell_2<number>;
        innerOpacity: ConfigCell_2<number>;
    };
    transparentLine: {
        opacity: ConfigCell_2<number>;
        transparentColor: ConfigCell_2<Color>;
        lineColor: ConfigCell_2<Color>;
        edgeThreshold: ConfigCell_2<number>;
        drawWithOriginalMaterial: ConfigCell_2<boolean>;
        drawAdditionalLines: ConfigCell_2<boolean>;
    };
    taa: {
        enabled: ConfigCell_2<boolean>;
        maxSample: ConfigCell_2<number>;
        outputSample: ConfigCell_2<number>;
        waitingTime: ConfigCell_2<number>;
    };
    staticFrameCache: {
        enabled: ConfigCell_2<boolean>;
    };
    composite: {
        enabled: ConfigCell_2<boolean>;
        multiSamplingEnabled: ConfigCell_2<boolean>;
        staticFrameCacheEnabled: ConfigCell_2<boolean>;
    };
    sceneClip: {
        enabled: ConfigCell_2<boolean>;
        clippingEnabled: ConfigCell_2<boolean>;
        clippingPlanes: ConfigCell_2<Plane[]>;
    };
    Splatting: PipelineConfig['Splatting'];
    __INTERNAL__: PipelineConfig;
}

/**
 * The depth test {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc| function}.
 */
export declare enum DepthModes {
    NeverDepth = 0,
    AlwaysDepth = 1,
    LessDepth = 2,
    LessEqualDepth = 3,
    EqualDepth = 4,
    GreaterEqualDepth = 5,
    GreaterDepth = 6,
    NotEqualDepth = 7
}

/**
 * Depth packing modes supported by depth-only materials.
 */
declare enum DepthPackingStrategies {
    BasicDepthPacking = 0,
    RGBADepthPacking = 1,
    NDC_DepthPacking = 2
}

declare class DepthState {
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    private currentDepthMask;
    private currentDepthFunc;
    currentDepthClear: Nullable<number>;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext);
    setMask(depthMask: boolean): void;
    setFunc(depthFunc: DepthModes): void;
    setClear(depth: number): void;
    reset(): void;
}

declare class Deserializer {
    meta: SerializerMetaData;
    promisePool: Array<Promise<void>>;
    private rawData;
    private deSerializedResource;
    private serializedData;
    private deSerializeTarget;
    private buffers;
    private getSliced;
    constructor(json: any, buffers: ArrayBuffer[], meta: SerializerMetaData, isWholeBuffer?: boolean);
    getBuffer(tag: CollectedBufferDescriptor): TypeArray;
    readRaw(key: string): any;
    getData(): any;
    read(key: string, writeKey?: string): void | Promise<void>;
    reads<U>(keys: Array<SerializerablePartKeys<U>>): void | Promise<void>;
    readCustom(key: string): any;
    readRawFromSource(id: string): any;
    deserialize<T extends SerializerableDelegated & Partial<ClassNamePreserved>>(seredData: any, container?: T): T | Promise<T>;
    deserializeObjectsById(rootId: string[]): Object3D[];
    loadResourceAsync(onload: () => void): Promise<void>;
    private getAttributeFromWholeBuffer;
    private getAttributeFromSplitBuffer;
}

declare function detectSplatFileType(filename: string, buffer: Uint8Array): SplatFileType | undefined;

export declare class DirectionalLight extends Light {
    viewMatrix: Matrix4;
    invViewMatrix: Matrix4;
    static get DEFAULT_TARGET(): Object3D;
    /**
     * The target is a point in world space used to calculate the direction of light.
     */
    private _target;
    get target(): Object3D;
    set target(t: Object3D);
    /**
     * Check the type whether it belongs to PerspectiveCamera.
     * This value should not be changed by user.
     */
    isDirectionalLight: boolean;
    private vector3;
    private uniforms;
    /**
     * Use this attribute to set the shadow's config.
     * @remarks See example '3d shadow' for more details.
     */
    shadow: DirectionalShadow;
    isShadowNeedsUpdate: boolean;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(color?: number | string, intensity?: number);
    /**
     * Copy the data to this light instance from source.
     * This method need override in derived classes to copy extended data.
     * @param {Light} source the data source.
     * @param {boolean} recursive if true, descendants of the object are also cloned. Default is true.
     */
    copy(source: DirectionalLight, recursive?: boolean): this;
    clone(recursive?: boolean): DirectionalLight;
    updateUniformForForward(program: WGLProgram, index: number): void;
    updateUniformForDefer(program: WGLProgram): void;
    updateUniformByPrefix(program: WGLProgram, lightPrefix: string, shadowPrefix: string): void;
    destroy(): void;
    static getHeader(isArray: boolean): "uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];" | "uniform DirectionalLight directionalLight;";
}

declare class DirectionalShadow extends SingleProjectShadow<OrthographicCamera> {
    enableAutoBias: boolean;
    shadowCameraNear: number;
    shadowCameraFar: number;
    shadowRenderSize: Vector2;
    className(): string;
    constructor(directional: DirectionalLight);
    copy(other: DirectionalShadow): void;
    updateCameraAndShadowMatrices(light: DirectionalLight): void;
    extendsShader(builder: ShaderBuilder, length: number): void;
    extendsShaderDeferred(builder: ShaderBuilder): void;
    updateUniformsImpl(program: WGLProgram, prefix: string): void;
    deserialize(ctx: Deserializer): void;
    serialize(ctx: Serializer): void;
}

declare interface DirectionCameraCustom {
    type: SnapshotAxisDirection;
    layer?: number;
    worldBox?: Box3;
    boxPrecision?: SnapshotBoxPrecision;
}

declare class DiskAreaLight extends AreaLight {
    isDiskAreaLight: boolean;
    width: number;
    height: number;
    specularStrength: number;
    private uniforms;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(color?: number | string, intensity?: number, width?: number, height?: number, specularStrength?: number);
    copy(source: DiskAreaLight, recursive?: boolean): this;
    clone(recursive?: boolean): DiskAreaLight;
    updateUniformForDefer(program: WGLProgram): void;
    updateUniformByPrefix(program: WGLProgram, prefix: string): void;
    static getHeader(isArray: boolean): "uniform DiskAreaLight diskAreaLights[ NUM_DISK_AREA_LIGHTS ];" | "uniform DiskAreaLight diskAreaLight;";
}

export declare function downloadTexture(url: string | string[] | URL | URL[], options?: LoaderOptions): Promise<SourceTexture>;

declare namespace DracoLoader {
    export {
        ParseConfig,
        parseDracoBuffer
    }
}
export { DracoLoader }

/**
 * This is a base class of Mesh, Line, Point and Sprite.
 * This class has attributes which make the engine know the changed data and apply optimization.
 * Only drawable node of scene can be seen on screen.
 */
declare class Drawable<M extends Material = Material, G extends BufferGeometryBase = BufferGeometryBase> extends Object3D {
    /**
     * This value allows the default rendering order of scene graph objects to be overridden although opaque and transparent objects remain sorted independently.
     * When this property is set for an instance of {@link Group| Group }, all descendants objects will be sorted and rendered together.
     * Sorting is from lowest to highest renderOrder.
     * @defaultValue `0`
     */
    renderOrder: number;
    /**
     * This is a decisive attribute for drawing method.
     * @defaultValue Mesh.
     */
    drawMode: DrawMode;
    private _outlineMode;
    /**
     * Mark this drawable should be rendered in outline style
     * if you set outlinePipelineMode & outlineShadingMode, get this value maybe not as expected.
     * @deprecated use `outlineShadingMode` and `outlineRenderMode` instead
     */
    get outlineMode(): OutlineMode;
    set outlineMode(v: OutlineMode);
    private _outlineShadingMode;
    get outlineShadingMode(): OutlineShadingMode;
    set outlineShadingMode(value: OutlineShadingMode);
    private _outlineRenderMode;
    get outlineRenderMode(): OutlineRenderMode;
    /**
     * OutlineRenderMode.Overlay is deprecated. use renderMode replaced
     */
    set outlineRenderMode(value: OutlineRenderMode);
    private _renderMode;
    get renderMode(): DrawableRenderMode;
    set renderMode(value: DrawableRenderMode);
    overlayLayers: number;
    /**
     * Mark this drawable can cast shadow
     */
    castShadow: boolean;
    /**
     * Mark this drawable can cast shadow
     */
    castPlanarShadow: boolean;
    /**
     * Used to check type of this or extended instance.
     * This value should not be changed by user.
     */
    isDrawable: boolean;
    /**
     * Mark the material reference changed.
     * @defaultValue `true`
     */
    materialChanged: boolean;
    /**
     * Mark the geometry reference changed.
     * @defaultValue `true`
     */
    geometryChanged: boolean;
    /**
     * Specify the winding orientation of mesh as counter-clock-wise, only meaningful on mesh.
     * @defaultValue `false`.
     */
    frontFaceCW: boolean;
    /**
     * Store the Model-View matrix for this object.
     * It is not suggested to change the matrix because it will be update automatically when camera move.
     */
    modelViewMatrix: Matrix4;
    /**
     * This matrix is used to calculate the normal in eye-space.
     */
    normalMatrix: Matrix3;
    /**
     * Mark bounding need to be recalculated.
     * @defaultValue `true`
     */
    worldBoundingDirty: boolean;
    /**
     * Calculate the bounding as box.
     */
    worldBoundingBox: Box3;
    /**
     * Calculate the bounding as sphere.
     */
    worldBoundingSphere: Sphere;
    /**
     * The distance from object to camera in the direction of camera. Use this value to simply estimate the depth in 3D scene.
     */
    z: number;
    /**
     * This method allow user manually process data before the engine drawing object.
     * @remarks See {@link RenderHook| RenderHook} for more details.
     */
    onBeforeRender: Nullable<RenderHook>;
    private _isAlwaysDynamic;
    get isAlwaysDynamic(): boolean;
    set isAlwaysDynamic(v: boolean);
    /**
     * This is used to scale a drawable object by specified number when {@link enableViewIndependentScale| enableViewIndependentScale } is true.
     */
    viewIndependentScale: number;
    private _enableViewIndependentScale;
    /**
     * Let this object can be scale independently.
     */
    get enableViewIndependentScale(): boolean;
    set enableViewIndependentScale(v: boolean);
    categoryId: string;
    sourceType: string;
    protected _geometry: G;
    protected _material: M[];
    protected _renderGeometry: Nullable<BufferGeometryBase>;
    protected _renderMaterial: Nullable<Material[]>;
    constructor(geometry?: G, material?: M | M[]);
    /**
     * This attribute stores {@link Geometry| Geometry } or {@link BufferGeometry| BufferGeometry } (or derived classes),
     * defining the object's shape.
     * @defaultValue {@link BoxBufferGeometry| BoxBufferGeometry }
     */
    get geometry(): G;
    set geometry(newGeo: G);
    /**
     * Get the geometry which is really rendered by gpu.
     */
    get renderGeometry(): BufferGeometryBase;
    getMaterials(): ReadonlyArray<M>;
    getMaterialCount(): number;
    /**
     * Add a new material into this object.
     * If use this method, please make sure that the {@link material| material } has set to Array.
     * @param {Material} material a new material which is set.
     * @param {number} index the target position in the Array.
     */
    setMaterial(material: M, index: number): this;
    setMaterials(materials: M[] | M): this;
    setOnlyMaterial(material: M): this;
    /**
     * Expect this drawable only has one material, and return it.
     */
    expectOnlyMaterial(): M;
    checkIfOnlyMaterial(innerChecker?: (m: Material) => boolean): boolean;
    /**
     * Do something for every {@link material| material } whatever it is an instance or array.
     * @param {function} f a function to operate the material instance.
     */
    forEachMaterial(v: (m: M) => any): void;
    /**
     * Get the material which is really rendered by gpu.
     */
    get renderMaterial(): Material[];
    /**
     * update the data of bounding box and bounding sphere, set dirty mark to false.
     */
    updateBoundings(): void;
    _updateMatrixByViewIndependentScale(camera: Camera3D, viewHeight: number): void;
    /**
     * This method is used to update {@link modelViewMatrix| model-view matrix } and {@link normalMatrix| normal matrix } before drawing this object.
     * In addition, the estimated {@link z| depth } information will be update here.
     */
    updateRenderInfo(camera: Camera3D, viewHeight: number): void;
    /**
     * Update the matrix local transform. Override
     */
    updateMatrix(): void;
    private viewIndependentOverrideScale;
    _clearViewIndependentOverrideScale(): void;
    /**
     * Set all changing mark, such as {@link geometryChanged| geometryChanged }, {@link materialChanged| materialChanged }
     * and {@link Object3D.clearChangeMark| extended mark }.
     */
    clearChangeMark(): void;
    /**
     * This method need override in derived classes to give a special calculation for picking feature.
     * @remarks See {@link Raycaster| Raycaster } for more detail.
     */
    raycast(raycaster: Raycaster, intersects: Intersection[]): void;
    protected raycastJsImpl(_raycaster: Raycaster, _intersects: Intersection[]): void;
    /**
     * Clean render data for optimization.
     */
    resetRenderEntity(): void;
    /**
     * Update render data for optimization.
     * This method is used to assign data from {@link geometry| geometry } and {@link material| material } to
     * {@link renderGeometry| renderGeometry } and {@link renderMaterial| renderMaterial }.
     */
    updateRenderEntity(): void;
    private _removeSceneReference;
    private createSceneReference;
    private addDrawcall;
    /**
     * Reset entity reference.
     * @remarks See {@link Scene3D._refManager| refManager} for more details.
     */
    refreshSceneReference(): void;
    /**
     * If user changes geometry for drawable, use this method to refresh corresponding states.
     */
    setGeometryChanged(): void;
    /**
     * Manually {@link Object3D.notifySceneChange| refresh} and {@link resetRenderEntity| reset} data of this drawable.
     * @tips This method can be replaced by {@link resetRenderEntity| resetRenderEntity()}.
     */
    onReferencedGeometryContentChange(): void;
    /**
     * If user changes {@link material| material } for drawable, use this method to refresh corresponding states.
     */
    setMaterialChanged(): void;
    protected onSelfAttachingScene(scene: Scene3D): void;
    protected onSelfDetachingScene(scene: Scene3D): void;
    shouldUseGeometryGroupsWhenOnlyHasOneMaterial: boolean;
    useGeometryGroupsWhenOnlyHasOneMaterial(): this;
    /**
     * Copy the data to this object from source.
     * This method need override in derived classes to copy extended data.
     * @param {Drawable} source the data source.
     * @param {boolean} recursive if true, descendants of the object are also cloned. Default is true.
     */
    copy(source: Drawable<M, G>, recursive?: boolean): this;
    set __material(v: M[]);
    destroyAllResourcesOwned(): void;
    freeAllGpuResourceOwned(): void;
}

declare class DrawableList {
    private destroyed;
    private _lodEnabled;
    set lodEnabled(v: boolean);
    get lodEnabled(): boolean;
    destroy(): void;
    list: Drawable[];
    push(d: Drawable): void;
    filter(f: () => IPipelineFilter<Drawable>, forceExecJS?: boolean): DrawableList;
    filterMap(f: Mapper<Drawable>): DrawableList;
    project(camera: Camera3D, isCulledByCamera?: boolean, viewHeight?: number, classifyType?: DrawcallListClassifyType, enableLights?: boolean): ProjectedDrawcallList;
    updateRenderInfoInList(camera: Camera3D, viewHeight: number): void;
    updateLODs(camera: Camera3D, viewHeight: number): this;
    forEach(f: (item: Drawable, index: number) => any): void;
    getCameraClosestDistance(camera: PerspectiveCamera): number;
}

/**
 * Render placement mode used by drawable scene objects.
 */
export declare enum DrawableRenderMode {
    Default = 0,
    Overlay = 1
}

declare interface Drawcall {
    object: Drawable;
    range: Nullable<BufferRange>;
    material: Material;
    geometry: BufferGeometryBase;
}

declare interface DrawcallListClassifyResult {
    opaque: Drawcall[];
    transparent: Drawcall[];
    extraDrawcallList: Map<number, Drawcall[]>;
}

declare interface DrawcallListClassifyType {
    $TYPE_NAME: string;
    (opaque: Drawcall[], transparent: Drawcall[]): DrawcallListClassifyResult;
}

/**
 * This is used to decide how the vertex array is drawing.
 */
export declare enum DrawMode {
    Points = 0,
    Lines = 1,
    LineLoop = 2,
    LineStrip = 3,
    Triangles = 4,
    TriangleStrip = 5,
    TriangleFan = 6
}

declare interface DrivenCullingConfig {
    frustumCullingEnabled: boolean;
    occlusionCullingEnabled: boolean;
    detailCullingEnabled: boolean;
    layersCullingEnabled: boolean;
    triCullingEnabled: boolean;
    occlusionCullingBias: number;
}

declare abstract class DrivenMaterial extends Material {
    readonly isDrivenMaterial: boolean;
    extendShaderShape(): void;
    extendShaderShading(): void;
    updateShapeUniforms(): void;
    updateShadingUniforms(): void;
    computeShapeKey(): string;
    clone(): Material;
    copy(_other: Material): void;
}

declare class EffectComposer {
    overrideScreenOutputTarget?: OverrideScreenOutputTarget;
    private renderer;
    private attachmentPool;
    private targets;
    private attachments;
    constructor(renderer: RendererAdaptor);
    _getFrameBuffer(key: string): RenderTarget | undefined;
    private getAttachment;
    private getFrameBuffer;
    render(graph: RenderGraph): void;
    clear(): void;
}

declare abstract class ElementEventDispatcher extends BaseElement implements EventDispatcher {
    _uuid: any;
    uuid: string;
    _listeners: Map<symbol, Listener[]>;
    on<T>(_type: EventType<T>, _listener: Listener<T>): void;
    once<T>(_type: EventType<T>, _listener: Listener<T>): void;
    has<T>(_type: EventType<T>, _listener: Listener<T>): boolean;
    off<T>(_type: EventType<T>, _listener: Listener<T>): void;
    emit(type: EventType<never>): void;
    emit<T>(type: EventType<T>, payload: T): void;
    clearAllListeners(): void;
}

declare interface ElementsWithGPUResource {
    freeGPU(): void;
}

/**
 * Creates a 2d curve in the shape of an ellipse. Setting the xRadius equal to the yRadius will result in a circle.
 */
declare class EllipseCurve2D extends Curve2D {
    aX: number;
    aY: number;
    xRadius: number;
    yRadius: number;
    aStartAngle: number;
    aEndAngle: number;
    aClockwise: boolean;
    aRotation: number;
    isEllipseCurve2D: boolean;
    divisions?: number;
    /**
     * @param { number } aX The X center of the ellipse. Default is 0.
     * @param { number } aY The Y center of the ellipse. Default is 0.
     * @param { number } xRadius The radius of the ellipse in the x direction. Default is 1.
     * @param { number } yRadius The radius of the ellipse in the y direction. Default is 1.
     * @param { number } aStartAngle The start angle of the curve in radians starting from the positive X axis. Default is 0.
     * @param { number } aEndAngle The end angle of the curve in radians starting from the positive X axis. Default is 2 PI.
     * @param { number } aClockwise Whether the ellipse is drawn clockwise. Default is false.
     * @param { number } aRotation The rotation angle of the ellipse in radians, counterclockwise from the positive X axis (optional). Default is 0.
     * @param { number } divisions How many parts will each curve been seperated(Optional).
     */
    constructor(aX?: number, aY?: number, xRadius?: number, yRadius?: number, aStartAngle?: number, aEndAngle?: number, aClockwise?: boolean, aRotation?: number, divisions?: number);
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void;
    className(): string;
    getPoints(divisions?: number): Vector2[];
    getPoint(t: number, optionalTarget?: Vector2): Vector2;
    clone(): EllipseCurve2D;
    copy(source: EllipseCurve2D): this;
}

/**
 * Initialization options used when creating a viewer engine.
 */
declare interface EngineInitializeConfig {
    name?: string;
    antialiasing?: boolean;
    alpha?: boolean;
    preferWebGL1?: boolean;
    /**
     * will pass it to getContext
     * @default true
     * @deprecated not all context support `preserveDrawingBuffer`
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
     */
    preserveDrawingBuffer?: boolean;
}

/**
 * Draw background with a picture.
 */
declare class EnvMapBackground extends MeshBackground<EnvMapMaterial> {
    constructor();
}

/**
 * Parameters for an environment-map background.
 * @deprecated
 */
declare interface EnvMapBackgroundParameter {
    texture: Texture;
    luma: number;
    verticalRotation: number;
    horizonRotation: number;
}

declare class EnvMapMaterial extends BackgroundLikeMaterial {
    verticalRotation: number;
    horizonRotation: number;
    luma: number;
    tEquirect: Texture;
    reverseVertical: boolean;
    reverseHorizon: boolean;
    className(): string;
    constructor();
    updateShadingUniforms(p: WGLProgram): void;
    traverseTexture(visitor: (tex: Texture) => void): void;
    generateShaderKey(r: ShaderComponentRegistry): string;
    extendShaderShading(builder: ShaderBuilder, _: any): void;
    copy(): this;
    clone(): EnvMapMaterial;
}

/**
 * Euler-angle rotation represented by x, y, z radians and an order.
 */
export declare class Euler {
    /**
     * The angle of the x axis in radians.
     */
    _x: number;
    /**
     * The angle of the y axis in radians.
     */
    _y: number;
    /**
     * The angle of the z axis in radians.
     */
    _z: number;
    /**
     * A string representing the order that the rotations are applied.
     */
    _order: string;
    /**
     * Check the type whether it belongs to Euler.
     * This value should not be changed by user.
     */
    isEuler: boolean;
    /**
     * The function will be called when {@link _x| x}, {@link _y| y} {@link _z| z} and {@link _order| order} is changed.
     */
    onChangeCallback: Function;
    /**
     * All possible value for {@link _order| order}.
     */
    static RotationOrders: string[];
    /**
     * The default of {@link _order| order}.
     */
    static DefaultOrder: string;
    /**
     * @param x rotation x
     * @param y rotation y
     * @param z rotation z
     * @param order euler order, values in `RotationOrders`
     */
    constructor(x?: number, y?: number, z?: number, order?: string);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get order(): string;
    set order(value: string);
    /**
     * Sets the angles of this euler transform and optionally the {@link order| order}.
     */
    set(x: number, y: number, z: number, order?: string): Euler;
    /**
     * Returns a new Euler with the same parameters as this one.
     */
    clone(): Euler;
    /**
     * Copies value of {@link Euler| euler} to this euler.
     */
    copy(euler: Euler): Euler;
    /**
     * Sets the angles of this euler transform from a pure rotation matrix based on the orientation specified by order.
     * @param m a {@link Matrix4| Matrix4} of which the upper 3x3 of matrix is a pure
     * {@link https://en.wikipedia.org/wiki/Rotation_matrix| rotation matrix} (i.e. unscaled).
     * @param order (optional) a string representing the order that the rotations are applied.
     */
    setFromRotationMatrix(m: Matrix4, order?: string, update?: boolean): Euler;
    /**
     * Sets the angles of this euler transform from a normalized quaternion based on the orientation specified by {@link order| order}.
     * @param q a normalized quaternion.
     * @param order (optional) a string representing the order that the rotations are applied.
     */
    setFromQuaternion(q: Quaternion, order?: string, update?: boolean): Euler;
    /**
     * Set the {@link x| x}, {@link y| y} and {@link z| z} from vector, and optionally update the {@link order| order}.
     * @param vector {@link Vector3| Vector3}.
     * @param order (optional) a string representing the order that the rotations are applied.
     */
    setFromVector3(v: Vector3, order?: string): Euler;
    /**
     * Resets the euler angle with a new order by creating a quaternion from this euler angle
     * and then setting this euler angle with the quaternion and the new order.
     * @WARNING this discards revolution information.
     */
    reorder(newOrder: string): Euler;
    /**
     * Checks for strict equality of this euler and {@link Euler| euler}.
     */
    equals(euler: Euler): boolean;
    /**
     * Array of length 3 or 4. The optional 4th argument corresponds from the {@link order| order}.
     * Assigns this euler's {@link x| x} angle from array[0].
     * Assigns this euler's {@link y| y} angle from array[1].
     * Assigns this euler's {@link z| z} angle from array[2].
     * Optionally assigns this euler's {@link order| order} from array[3].
     */
    fromArray(array: ArrayLike<number>): Euler;
    /**
     * Returns an array of the form [{@link x| x}, {@link y| y}, {@link z| z}, {@link order| order}].
     * @param array (optional) array to store the euler in.
     * @param offset (optional) offset in the array.
     */
    toArray(array?: number[], offset?: number): number[];
    /**
     * @param optionalResult (optional) If specified, the result will be copied into this Vector, otherwise a new one will be created.
     * Returns the Euler's {@link x| x}, {@link y| y} and {@link z| z} properties as a {@link Vector3| Vector3}.
     */
    toVector3(optionalResult?: Vector3): Vector3;
    /**
     * A method to call {@link onChangeCallback| onChangeCallback}.
     */
    onChange(callback: Function): void;
}

/**
 * JavaScript events for custom objects.
 */
declare class EventDispatcher {
    _uuid: string | null;
    get uuid(): string;
    set uuid(uuid: string);
    _listeners: Map<symbol, Listener[]>;
    /**
     * Adds a listener to an event type.
     * @param type The type of event to listen to.
     * @param listener The function that gets called when the event is fired.
     */
    on<T>(type: EventType<T>, listener: Listener<T>): void;
    /**
     * Only active the listener one times and then off {@link it| it}.
     */
    once<T>(type: EventType<T>, listener: Listener<T>): void;
    /**
     * Checks if listener is added to an event type.
     */
    has<T>(type: EventType<T>, listener: Listener<T>): boolean;
    /**
     * Removes a listener from listening list.
     */
    off<T>(type: EventType<T>, listener: Listener<T>): void;
    /**
     * Active the event and call the registered listener.
     */
    emit(type: EventType<never>): void;
    emit<T>(type: EventType<T>, payload: T): void;
    /**
     * Removes all listeners from listening list.
     */
    clearAllListeners(): void;
}

declare namespace Events {
    export {
        SplatSortedEvent,
        SplatRenderingStabilityChangedEvent
    }
}
export { Events }

/**
 * Typed event key used by EventDispatcher.
 */
declare class EventType<Payload = never> {
    description: string;
    payload?: Payload;
    symbol: symbol;
    constructor(description?: string);
}

declare abstract class ExecuteNode<ExecuteCtx = unknown> extends DAGNode {
    protected readonly executeHooks: EventDispatcher;
    before(callback: (ctx: ExecuteCtx) => void): this;
    after(callback: (ctx: ExecuteCtx) => void): this;
    emit<T>(event: EventType<T>, data: T): void;
    abstract execute(ctx: ExecuteCtx): void;
    abstract check(): boolean;
}

declare interface ExtendedViewerPlugin extends __INTERNAL__.ViewerPlugin, EventDispatcher {
    /**
     * XRSession, but typing was missing in ts 3.8, use any instead.
     * @type XRSession
     */
    readonly session: any;
    registerToViewer(viewer: IViewerContext | Viewer): void;
}

/**
 * Triangular face used in {@link Geometry | Geometry }.
 * These are created automatically for all standard geometry types, however if you are building a custom geometry you will have to create them manually.
 */
declare class Face3 {
    /**
     * Vertex A index.
     */
    a: number;
    /**
     * Vertex B index.
     */
    b: number;
    /**
     * Vertex C index.
     */
    c: number;
    /**
     * (optional) Face normal {@link Vector3 | Vector3 } or array of vertex normals.
     * If a single vector is passed in, this sets {@link normal | normal }, otherwise if an array of three vectors is passed in this sets {@link vertexNormals | vertexNormals }.
     */
    normal: Vector3;
    /**
     * Array of 3 vertex normals.
     */
    vertexNormals: Vector3[];
    /**
     * Face color - for this to be used a material's vertexColors property must be set to FaceColors.
     * @defaultValue `new Color()`.
     */
    color: Color;
    /**
     * Array of 3 vertex colors - for these to be used a material's vertexColors property must be set to {@link VertexColors | VertexColors }.
     * @defaultValue `0`.
     */
    vertexColors: Color[];
    /**
     * Material index (points to an index in the associated array of materials).
     * @defaultValue `0`.
     */
    materialIndex: number;
    constructor(a?: number, b?: number, c?: number, vertexNormals?: Vector3[] | Vector3, vertexColors?: Color[] | Color, materialIndex?: number);
    /**
     * Return a clone of this object.
     */
    clone(): Face3;
    /**
     * Copy the data to this object from source.
     * @param { Face3 } source the data source.
     */
    copy(source: Face3): Face3;
}

/**
 * This is a dedicated geometry for {@link FatLineSegments| FatLineSegments }.
 */
export declare class FatLineBufferGeometry extends InstancedBufferGeometry {
    /**
     * Used to check type of this or extended instance.
     * This value should not be changed by user.
     */
    isLineSegmentsGeometry: boolean;
    private _fallback_geometry;
    get fallback(): BufferGeometry<LineList>;
    get instanceStart(): InstancedBufferAttribute<Float32Array>;
    get instanceEnd(): InstancedBufferAttribute<Float32Array>;
    /**
     * Creates an instance of FatLineBufferGeometry. geometry layout must be LineSegment
     * @param {(BufferGeometry | WireframeBufferGeometry)} geometry
     * @param {boolean} [geometryLayoutIsLineSegment=false]
     * @memberof FatLineBufferGeometry
     */
    constructor(geometry: BufferGeometry<LineList>);
    /**
     * Apply the given matrix to vertexes data.
     * @return this object.
     */
    applyMatrix(matrix: Matrix4): FatLineBufferGeometry;
    /**
     * Build segmented line data by given data and update bounding.
     * @param { Float32Array } lineSegments the segments data store as Float32Array.
     * @return this object.
     */
    setPositions(lineSegments: Float32Array): FatLineBufferGeometry;
    /**
     * Recalculate the bounding box for this geometry.
     */
    computeBoundingBox(): void;
    /**
     * Recalculate the bounding sphere for this geometry.
     */
    computeBoundingSphere(): void;
    /**
     * Clear the current geometry's data in memory.
     */
    freeGPU(): void;
}

/**
 * This material is specifically used to draw line or dash-line which has width more than 1 pixel.
 */
export declare class FatLineMaterial extends SceneClipMaterial {
    fallback: LineMaterial;
    color: ColorWithAlpha;
    enableDash: boolean;
    dash: LineDash;
    fatLineWidth: number;
    enableViewIndependentDashScale: boolean;
    className(): string;
    generateShaderKey(r: ShaderComponentRegistry): string;
    constructor(p?: FatLineMaterialParameter);
    /**
     * This method will be used automatically before
     * @param {Renderer} renderer instance of renderer for engine.
     */
    onBeforeRender: (renderer: Renderer) => void;
    setValues(p?: FatLineMaterialParameter): void;
    updateShapeUniforms(program: WGLProgram, r: ShaderComponentRegistry): void;
    updateShadingUniforms(program: WGLProgram): void;
    extendShaderShading(builder: ShaderBuilder): void;
    computeShapeKey(r: ShaderComponentRegistry): string;
    extendShaderShape(builder: ShaderBuilder, registry: ShaderComponentRegistry): void;
    copy(other: FatLineMaterial): this;
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void;
    clone(): FatLineMaterial;
}

declare type FatLineMaterialParameter = ConvertMaterialParameters<Pick<FatLineMaterial, 'enableDash' | 'fatLineWidth' | 'enableViewIndependentDashScale'>> & LineDashParam & ColorWithAlphaParam & MaterialParameters;

/**
 * This class is used to draw lines which has same width between each vertexes of Geometry on the surfaces. <br />
 */
export declare class FatLineSegments extends Drawable<FatLineMaterial, FatLineBufferGeometry> {
    /**
     * If require engine to draw this as Line instead of Mesh, set this to true.
     */
    static UseFallBack: boolean;
    /**
     * Check the type whether it belongs to FatLineSegments.
     * This value should not be changed by user.
     */
    isFatLineSegments: boolean;
    __isFatLineSegments: boolean;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(geometry: FatLineBufferGeometry, material: FatLineMaterial);
    updateRenderEntity(): void;
    /**
     * Get intersections between a casted {@link Ray| ray} and this Mesh.
     * The method {@link Raycaster.intersectObject| intersectObject()} will call this method, but the results are not ordered.
     * @param {Raycaster} raycaster the instance of Raycaster is used to get the data for calculation.
     * @param {Intersection} intersects the result will be stored here.
     */
    raycastJsImpl(raycaster: Raycaster, intersects: Intersection[]): void;
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void;
}

declare interface FileContext {
    path: string;
    files: Record<string, Uint8Array>;
}

declare class FilteredDrawcallList implements Renderable {
    readonly list: ProjectedDrawcallList;
    filter: IPipelineFilter<Drawcall>;
    constructor(list: ProjectedDrawcallList);
    config(_: IRenderer): boolean;
    render(renderer: IRenderer, renderObjectsType?: RenderObjectsType): void;
}

/**
 * Target region selected by a filter material.
 */
export declare enum FilterTarget {
    All = 0,
    Foreground = 1,
    Background = 2
}

declare interface Flattenable {
    toArray(arrayLike: number[] | TypeArray, offset?: number): void;
    copy(other: any): void;
}

declare class ForwardPlugin extends PipelinePlugin {
    eventDispatcher: EventDispatcher;
    readonly PLUGIN_NAME = "forward";
    protected _enabled: boolean;
    private solidEnabled;
    private solidColor;
    private solidLightMaterialEnabled;
    private solidBasicMaterial;
    private solidPhongMaterial;
    private toonEnabled;
    private toonMaterial;
    private _oitEnabled;
    private get oitEnabled();
    private oitMaterial;
    private mixOITMaterial;
    private _staticFrameCacheEnabled;
    private staticFrameCacheActive;
    private get staticFrameCacheEnabled();
    private sceneId;
    private frameSyncId;
    private get hasStaticCacheFrame();
    private copyMaterial;
    private _planarShadowEnabled;
    private _planarShadowActive;
    private _planarShadowDelay;
    private get planarShadowEnabled();
    private set planarShadowEnabled(value);
    private planarShadowLastActiveTime;
    private planarShadowIntensity;
    private get planarShadowReady();
    private planarShadowOrderIndependent;
    private planarShadowMaxGroundHeight;
    private planarShadowMaxGroundThickness;
    private planarShadowMaterial;
    private planarShadowDispatcher;
    private planarShadowMixMaterial;
    private blurXMaterial;
    private blurYMaterial;
    private planarShadowCopyMaterial;
    private dispatcher;
    private drivenCullingMaterial;
    private drivenShadingMaterial;
    get shouldRender(): boolean;
    constructor(scene: SceneAdaptorDispatcher, renderer: RendererAdaptor);
    destroy(): void;
    updateFrameSize(width: number, height: number): void;
    updateEffect(scene: SceneAdaptor, isFrameStable: boolean, isCameraStable: boolean, effectConfig: IEffectConfig): void;
    updateGraphHash(hasher: HashKeyBuilder): void;
    private createStaticFrameCachePass;
    private createPlanarShadowTarget;
    private createPlanarShadowPass;
    private createPlanarShadowPassV2;
    private createOitPass;
    /**
     * WEBGPU only, enable MSAA in OIT pass.
     */
    private createMultisampledOitPass;
    updateRenderGraph(graph: RenderGraph, context: PipelineContext, depthPyramid: RenderTargetNode): void;
    private updateDrivenShadingMaterial;
    private updateDrivenCullingMaterial;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        oit: {
            enabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
        };
        solid: {
            enabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            lightMaterialEnabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            color: {
                get: () => Color;
                set: (v: Color) => void;
            };
        };
        toon: {
            enabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            tooniness: {
                get: () => number;
                set: (v: number) => void;
            };
            toonColor: {
                get: () => Color;
                set: (v: Color) => void;
            };
            diffuseColor: {
                get: () => Color;
                set: (v: Color) => void;
            };
            smoothnessMin: {
                get: () => number;
                set: (v: number) => void;
            };
            smoothnessMax: {
                get: () => number;
                set: (v: number) => void;
            };
        };
        staticFrameCache: {
            enabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
        };
        planarShadow: {
            enabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            orderIndependentEnabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            intensity: {
                get: () => number;
                set: (v: number) => void;
            };
            blurKernelRadius: {
                get: () => number;
                set: (v: number) => void;
            };
            maxGroundThickness: {
                get: () => number;
                set: (v: number) => void;
            };
            maxGroundHeight: {
                get: () => number;
                set: (v: number) => void;
            };
        };
    };
    notifyChanged(): void;
}

declare interface FragOut {
    name: string;
    type: FragOutType;
}

declare enum FragOutType {
    Float = "float",
    Vec2 = "vec2",
    Vec3 = "vec3",
    Vec4 = "vec4",
    UInt = "uint",
    UVec4 = "uvec4"
}

/**
 * Viewing frustum represented by six clipping planes.
 */
export declare class Frustum {
    /**
     * Array of 6 {@link Plane| planes}.
     */
    planes: Plane[];
    /**
     * The eight vertex's position of frustum
     */
    corners: Vector3[];
    constructor(p0?: Plane, p1?: Plane, p2?: Plane, p3?: Plane, p4?: Plane, p5?: Plane);
    /**
     * Sets the frustum from the passed planes. No plane order is implied.
     * Note that this method only copies the values from the given objects.
     */
    set(p0: Plane, p1: Plane, p2: Plane, p3: Plane, p4: Plane, p5: Plane): Frustum;
    /**
     * Return a new Frustum with the same parameters as this one.
     */
    clone(): Frustum;
    /**
     * Copies the properties of the passed {@link Frustum| frustum} into this one.
     * @param frustum The frustum to copy.
     */
    copy(frustum: Frustum): Frustum;
    /**
     * Return the {@link corners| corners}.
     */
    getCorners(): Vector3[];
    /**
     * Sets the frustum by a transform matrix.
     */
    setFromMatrix(m: Matrix4): Frustum;
    /**
     * Checks whether the {@link Object3D| object}'s {@link BufferGeometry.boundingSphere| bounding} is intersecting the frustum.
     * Note that the object must have a {@link BufferGeometry| geometry} so that the bounding sphere can be calculated.
     */
    intersectsObject(object: Object3D): boolean;
    /**
     * Checks whether the {@link Sprite| sprite} is intersecting the frustum.
     */
    intersectsSprite(sprite: Sprite): boolean;
    /**
     * Return true if {@link Sphere| sphere} intersects with this frustum.
     * @param sphere {@link Sphere| Sphere} to check for intersection.
     */
    intersectsSphere(sphere: Sphere): boolean;
    /**
     * Return true if {@link Box3| box} intersects with this frustum.
     * @param box {@link Box3| Box3} to check for intersection.
     */
    intersectsBox(box: Box3): boolean;
    /**
     * Checks to see if the frustum contains the {@link Vector3| point}.
     * @param point {@link Vector3| Vector3} to test.
     */
    containsPoint(point: Vector3): boolean;
    /**
     * Return a value to represent the closest distance between camera and box, if there are any part of bos inside the frustum.
     */
    getCameraClosestDistanceFromBoxes(camera: PerspectiveCamera, boxes: Box3[]): number;
}

/**
 * Editable face-and-vertex geometry container.
 */
declare class Geometry extends EventDispatcher {
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Unique number of this geometry instance.
     */
    id: number;
    /**
     * Name for this geometry. Default is an empty string.
     */
    name: string;
    /**
     * The type of this instance.
     */
    type: string;
    /**
     * An array of vertices hold every position of points of the model.
     */
    vertices: Vector3[];
    /**
     * An array of vertex colors, matching number and order of vertices.
     * Used in ParticleSystem, Line and Ribbon.
     * Meshes use per-face-use-of-vertex colors embedded directly in faces.
     */
    colors: Color[];
    /**
     * An array of triangles or/and quads.
     * The array of faces describe how each vertex in the model is connected with each other.
     * @remarks See {@link Face3| Face3} for more details.
     */
    faces: Face3[];
    /**
     * An array of face UV layers.
     * Each UV layer is an array of UV matching order and number of vertices in faces.
     */
    faceVertexUvs: Vector2[][][];
    /**
     * The distance is used to determine the length of line, this is necessary for drawing segmented line.
     * The value can be calculated by {@link BufferAttribute.getAttributeLayoutKey| getAttributeLayoutKey()}.
     */
    lineDistances: number[];
    /**
     * Used to check type of this or extended instance.
     * This value should not be changed by user.
     */
    isGeometry: boolean;
    /**
     * Let every positional and normal vector multiple with specified matrix.
     * @param {Matrix4} matrix a 4×4 matrix which is applied to.
     */
    applyMatrix(matrix: Matrix4): Geometry;
    /**
     * Rotate this object around X independently.
     * @param {number} angle a radian value to rotate.
     */
    rotateX(angle: number): Geometry;
    /**
     * Rotate this object around Y independently.
     * @param {number} angle a radian value to rotate.
     */
    rotateY(angle: number): Geometry;
    /**
     * Rotate this object around Z independently.
     * @param {number} angle a radian value to rotate.
     */
    rotateZ(angle: number): Geometry;
    /**
     * Translate the geometry with specified vector.
     * @param {number} x translate vector' x, represent the distance of moving object along X.
     * @param {number} y translate vector' y, represent the distance of moving object along Y.
     * @param {number} z translate vector' z, represent the distance of moving object along Z.
     */
    translate(x: number, y: number, z: number): Geometry;
    /**
     * Make object bigger or smaller.
     * @param {number} x change the size on X direction.
     * @param {number} y change the size on Y direction.
     * @param {number} z change the size on Z direction.
     */
    scale(x: number, y: number, z: number): Geometry;
    /**
     * Rotates the object to face to a point in world space.
     * @param {Vector3} vector A vector representing position of target in world space.
     */
    lookAt(vector: Vector3): void;
    /**
     * Duplicate data from {@link BufferGeometry| BufferGeometry} to this {@link Geometry| Geometry} object.
     * @param {BufferGeometry} geometry the data source.
     */
    fromBufferGeometry(geometry: BufferGeometry): Geometry;
    /**
     * Make all numbers' abs of {@link vertices| vertices} and {@link faces| faces} less than 1.
     */
    normalize(): Geometry;
    /**
     * Computes the distance between two vertexes, store to {@link lineDistances| lineDistances}.
     * the distance is used to determine the length of line, this is necessary for drawing segmented line.
     */
    computeLineDistances(): void;
    /**
     * Compute normals for every faces.
     */
    computeFaceNormals(): void;
    /**
     * Computes vertex normals by averaging face normals. Face normals must be existing / computed beforehand.
     */
    computeVertexNormals(areaWeighted?: boolean): void;
    /**
     * Compute vertex normals, but duplicating face normals.
     */
    computeFlatVertexNormals(): void;
    /**
     * Combine all data of external geometry and this geometry into one array.
     * @param {Geometry} geometry all attributes from this geometry will be merged.
     * @param {Matrix4} matrix a matrix to modify the vertices' data. Usually this is the world matrix of merged object.
     * @param {number} materialIndexOffset an index mark the material data for the merged object.
     */
    merge(geometry: Geometry, matrix?: Matrix4, materialIndexOffset?: number): void;
    /**
     * Checks for duplicate vertices using hashmap.
     * Duplicated vertices are removed and faces' vertices are updated.
     */
    mergeVertices(): number;
    /**
     * Add some new vertices to this geometry.
     * @param {Vector3[]} points every Vector3 represent a vertex on object.
     */
    setFromPoints(points: Vector3[]): this;
    /**
     * Sorts the faces array according to material index. For complex geometries with several materials,
     * this can result in reduced draw calls and improved performance.
     */
    sortFacesByMaterialIndex(): void;
    /**
     * Get UUID of this object instance.
     * This value is automatically assigned, so this shouldn't be edited.
     */
    getUUID(): string;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx this parameter has not supported external Deserializer yet.
     * It may cause that this method can not be used directly.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx this parameter has not supported external Serializer yet.
     * It may cause that this method can not be used directly.
     */
    serialize(ctx: Serializer): void;
    /**
     * Creates a new clone of this Geometry.
     */
    clone(): Geometry;
    /**
     * Copy the data to this object from source.
     * This method need override in derived classes to copy extended data.
     * @param {Geometry} source the data source.
     */
    copy(source: Geometry): Geometry;
    parseGeometryFromJSON(json: any, geometry: Geometry): void;
}

/**
 * This class is a base class of every Geometry and BufferGeometry.
 * All of Geometry and BufferGeometry must implement the abstract function for engine in order to correctly accelerate render.
 */
declare abstract class GeometryBase extends ElementEventDispatcher implements SerializerableDelegatedAsReference, ElementsWithGPUResource {
    id: number;
    protected boundingBox: Nullable<Box3>;
    protected boundingSphere: Nullable<Sphere>;
    getUUID(): string;
    abstract computeBoundingBox(): void;
    abstract computeBoundingSphere(): void;
    abstract className(): string;
    abstract serialize(serialize: Serializer): void;
    abstract deserialize(ctx: Deserializer): void;
    abstract freeGPU(): void;
    abstract clone(): GeometryBase;
    getBoundingBox(): Box3;
    getBoundingSphere(): Sphere;
    notifyShapeChanged(): void;
    notifyGeometryContentChange(): void;
}

declare interface GLTF extends IBase {
    asset: IAsset;
    scene?: number;
    scenes?: IScene[];
    nodes?: INode[];
    meshes?: IMesh[];
    accessors?: IAccessor[];
    bufferViews?: IBufferView[];
    buffers?: IBuffer[];
    materials?: IMaterial[];
    textures?: ITexture[];
    images?: IImage[];
    samplers?: ISampler_2[];
    animations?: IAnimation[];
    skins?: ISkin[];
    cameras?: ICamera[];
    extensionsUsed?: string[];
    extensionsRequired?: string[];
}

declare namespace GLTFLoader {
    export {
        LoaderConfig,
        ParseResult,
        loadGLTF
    }
}
export { GLTFLoader }

declare type GLTFTextureMagFilter = 9728 | 9729;

declare type GLTFTextureMinFilter = 9728 | 9729 | 9984 | 9985 | 9986 | 9987;

declare type GLTFWrapMode = 33071 | 33648 | 10497;

declare interface GpuDrivenConfig {
    enabled: boolean;
    requested: boolean;
    textureCompression: TextureCompression;
}

/**
 * Draw background with a gradient color.
 */
declare class GradientBackground extends MeshBackground<GradientMaterial> {
    constructor();
}

/**
 * Parameters for a vertical gradient background.
 * @deprecated
 */
declare interface GradientBackgroundParameter {
    skyColor: Color;
    groundColor: Color;
}

declare class GradientMaterial extends BackgroundLikeMaterial {
    skyColor: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    groundColor: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    power: number;
    scale: number;
    offset: number;
    className(): string;
    constructor();
    updateShadingUniforms(p: WGLProgram): void;
    extendShaderShading(builder: ShaderBuilder, _: any): void;
    copy(): this;
    clone(): GradientMaterial;
}

/**
 * This class is used to draw a grid-like ground.
 */
declare class Ground implements Renderable {
    /**
     * The material of ground can be used to change style.
     */
    readonly material: GroundMaterial;
    /**
     * Switch of drawing ground.
     */
    enabled: boolean;
    private _size;
    get size(): number;
    set size(v: number);
    private groundMesh;
    private geometry;
    constructor();
    get up(): Vector3;
    set up(up: Vector3);
    config(_: IRenderer): boolean;
    private updateGeometry;
    render(renderer: IRenderer): void;
    destroy(): void;
}

declare class GroundMaterial extends SceneMaterial {
    groundColor: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    quat: Readonly<Pick<ReadonlyMarked<Vector4>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "z" | "getNumberCount" | "toArray" | "length" | "w" | "dot" | "lengthSq" | "manhattanLength">>;
    private _isGroundColorEnabled;
    get isGroundColorEnabled(): boolean;
    set isGroundColorEnabled(v: boolean);
    groundIntensity: number;
    gridGapSizeA: number;
    offsetA: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    colorA: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    private _lineWidthA;
    private lineFactorA;
    get lineWidthA(): number;
    set lineWidthA(v: number);
    gridGapSizeB: number;
    offsetB: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    colorB: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    private _lineWidthB;
    private lineFactorB;
    get lineWidthB(): number;
    set lineWidthB(v: number);
    className(): string;
    constructor();
    copy(): this;
    clone(): GroundMaterial;
    private get scaledDeviceRatio();
    extendShaderShading(builder: ShaderBuilder, _: ShaderComponentRegistry): void;
    updateShadingUniforms(program: WGLProgram): void;
}

declare class HashKeyBuilder {
    private key;
    private static instance;
    getKey(): string;
    reset(): this;
    bool(item: boolean): this;
    hasItem(item: Nullable<any>): this;
    isTexture(t: any): this;
    raw(item: any): this;
    static getInstance(): HashKeyBuilder;
}

/**
 * A light source positioned directly above the scene, with color fading from the sky color to the ground color.
 * This light cannot be used to cast shadows.
 */
declare class HemisphereLight extends Light {
    /**
     * Check the type whether it belongs to HemisphereLight.
     * This value should not be changed by user.
     */
    isHemisphereLight: boolean;
    /**
     * The light's ground color, as passed in the constructor. Default is a new Color set to white (0xffffff).
     */
    groundColor: Color;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(skyColor?: number | string, groundColor?: number | string, intensity?: number);
    copy(source: HemisphereLight): this;
}

/**
 * Visual styling and target list for one highlight group.
 */
declare interface HighlightGroup {
    items: HighLightItem[];
    width?: number;
    borderColor?: Color;
    borderOpacity?: number;
    innerColor?: Color;
    innerOpacity?: number;
}

/**
 * Type of parameters of {@link setHighlightObjects|setHighlightObjects}
 * @highlightGroupIndex If there are more than one material for geometry groups, the index of groups which need be highlight must push into this.
 */
declare interface HighLightItem {
    object: Drawable;
    highlightGroupIndex?: number[];
    instanceIndex?: number;
}

declare class HighlightPlugin extends PipelinePlugin {
    readonly PLUGIN_NAME = "highlight";
    private dispatcher;
    private blendMaterials;
    private width;
    private borderColor;
    private borderOpacity;
    private innerColor;
    private innerOpacity;
    private highlightGroups;
    private texelSize;
    get enabled(): boolean;
    set enabled(v: boolean);
    constructor(scene: SceneAdaptorDispatcher, renderer: RendererAdaptor);
    destroy(): void;
    updateFrameSize(width: number, height: number): void;
    updateEffect(): void;
    notifyChanged(): void;
    updateGraphHash(hasher: HashKeyBuilder): void;
    updateRenderGraph(graph: RenderGraph): void;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        width: {
            get: () => number;
            set: (v: number) => void;
        };
        borderColor: {
            get: () => Color;
            set: (v: Color) => void;
        };
        borderOpacity: {
            get: () => number;
            set: (v: number) => void;
        };
        innerColor: {
            get: () => Color;
            set: (v: Color) => void;
        };
        innerOpacity: {
            get: () => number;
            set: (v: number) => void;
        };
    };
    setHighlightGroups(highlightGroups: HighlightGroup[]): void;
}

declare interface HSL {
    h: number;
    s: number;
    l: number;
}

declare interface IAccessor extends IBase {
    bufferView?: number;
    byteOffset?: number;
    componentType: AccessorComponentType;
    normalized?: boolean;
    count: number;
    type: IAccessorType;
    max?: number[];
    min?: number[];
    sparse?: any;
}

declare type IAccessorType = 'SCALAR' | 'VEC2' | 'VEC3' | 'VEC4' | 'MAT2' | 'MAT3' | 'MAT4';

declare interface IAnimation extends IBase {
    name?: string;
    channels: IAnimationChannel[];
    samplers: IAnimationSampler[];
}

declare interface IAnimationChannel extends IBase {
    sampler: number;
    target: IAnimationChannelTarget;
}

declare interface IAnimationChannelTarget extends IBase {
    node?: number;
    path: 'translation' | 'rotation' | 'scale' | 'weights' | 'pointer';
}

declare interface IAnimationSampler extends IBase {
    input: number;
    output: number;
    interpolation?: 'LINEAR' | 'STEP' | 'CUBICSPLINE';
}

declare interface IAsset extends IBase {
    copyright?: string;
    generator?: string;
    version: string;
    minVersion?: string;
}

declare interface IAttribute<T extends TypedArray_2 = TypedArray_2> {
    array: T;
    itemSize: number;
}

export declare interface IBackgroundPluginConfig {
    /**
     * @default `true`
     */
    enabled?: boolean;
    /**
     * up for background rendering, will effect ground and background
     * @default `Vector3(0.0, 0.0, 1.0)`
     */
    up?: Vector3;
    ground?: {
        /**
         * enable ground grid
         * @default `true`
         */
        enabled?: boolean;
        /**
         * default ground grid size
         * @default `1000000`
         */
        gridSize?: number;
        /**
         * grid A gap
         * @default `500`
         */
        gridGapSizeA?: number;
        /**
         * grid A color
         * @default `Color(1.0, 1.0, 1.0)`
         */
        colorA?: Color;
        /**
         * grid A line width
         * @default `1`
         */
        lineWidthA?: number;
        /**
         * grid B gap
         * @default `5000`
         */
        gridGapSizeB?: number;
        /**
         * grid B color
         * @default `Color(1.0, 1.0, 1.0)`
         */
        colorB?: Color;
        /**
         * grid B line width
         * @default `1`
         */
        lineWidthB?: number;
        /**
         * enable ground color shading, by default will only render noise for ground.
         * @default `false`
         */
        isGroundColorEnabled?: boolean;
        /**
         * ground color
         * @default `Color(0.7, 0.7, 0.7)`
         */
        groundColor?: Color;
    };
    background?: {
        /**
         * @default `BackgroundMode.BasicBackground`
         */
        active?: BackgroundMode;
        /**
         * basic color and texture
         * active by `BackgroundMode.BasicBackground`
         */
        basic?: IBasicBackgroundConfig;
        /**
         * sphere envmap
         * active by `BackgroundMode.EnvMapBackground`
         */
        envmap?: IEnvMapBackgroundConfig;
        /**
         * sphere gradient
         * active by `BackgroundMode.GradientBackground`
         */
        gradient?: IGradientBackgroundConfig;
        /**
         * sky box
         * active by `BackgroundMode.SkyBackground`
         */
        sky?: ISkyBackgroundConfig;
    };
}

declare interface IBase {
    extensions?: Record<string, any>;
    extras?: any;
}

export declare interface IBasicBackgroundConfig {
    color?: Color;
    alpha?: number;
    texture?: Texture | null;
}

declare interface IBox {
    min: [number, number, number];
    max: [number, number, number];
}

declare interface IBuffer extends IBase {
    uri?: string;
    byteLength: number;
}

declare interface IBufferView extends IBase {
    buffer: number;
    byteOffset?: number;
    byteLength: number;
    byteStride?: number;
    target?: IBufferViewTarget;
}

declare enum IBufferViewTarget {
    ARRAY_BUFFER = 34962,
    ELEMENT_ARRAY_BUFFER = 34963
}

declare interface ICamera extends IBase {
    name?: string;
    type: 'perspective' | 'orthographic';
    perspective?: IPerspectiveCamera;
    orthographic?: IOrthographicCamera;
}

export declare interface ICompositePluginConfig {
    enabled?: boolean;
    multiSamplingEnabled?: boolean;
    staticFrameCacheEnabled?: boolean;
}

declare interface IData {
    readonly counts: number;
    readonly shDegree: number;
    initBlock(counts: number, shDegree: number): Promise<number>;
    finishBlock(): void;
    set(i: number, single: ISingleSplat): void;
    setCenter(i: number, x: number, y: number, z: number): void;
    setScale(i: number, sx: number, sy: number, sz: number): void;
    setQuat(i: number, qx: number, qy: number, qz: number, qw: number): void;
    setColor(i: number, r: number, g: number, b: number): void;
    setAlpha(i: number, a: number): void;
    setShN(i: number, shN: number[]): void;
    get(i: number, single: ISingleSplat): void;
    getCenter(i: number, single: ISingleSplat): void;
    getScale(i: number, single: ISingleSplat): void;
    getQuat(i: number, single: ISingleSplat): void;
    getColor(i: number, single: ISingleSplat): void;
    getAlpha(i: number, single: ISingleSplat): void;
    getShN(i: number, out: number[]): void;
}

declare interface IDracoGeometry {
    isPointCloud: boolean;
    index?: IAttribute<Uint32Array>;
    position: IAttribute;
    normal?: IAttribute;
    uv?: IAttribute;
    color?: IAttribute;
    groups: IGroup[];
}

declare interface IEffectConfig {
    isPerformanceSlow: boolean;
    planarShadowEnabled: boolean;
    planarShadowReady: boolean;
    taaEnabled: boolean;
    taaStable: boolean;
}

export declare interface IEnvMapBackgroundConfig {
    texture?: Texture;
    luma?: number;
    verticalRotation?: number;
    horizonRotation?: number;
    reverseVertical?: boolean;
    reverseHorizon?: boolean;
}

declare interface IFile {
    read(stream: ReadableStream<Uint8Array>, contentLength: number, data: IData, context?: FileContext): Promise<void>;
    write(stream: WritableStream<Uint8Array>, data: IData): Promise<void>;
}

export declare interface IGradientBackgroundConfig {
    skyColor?: Color;
    groundColor?: Color;
}

declare interface IGroup {
    start: number;
    count: number;
    materialIndex: number;
    block: {
        name: string;
        index: number;
    };
}

declare interface IImage extends IBase {
    name?: string;
    uri?: string;
    mimeType?: 'image/jpeg' | 'image/png';
    bufferView?: number;
}

declare interface IMaterial extends IBase {
    name?: string;
    pbrMetallicRoughness?: PBRMetallicRoughness;
    normalTexture?: INormalTextureInfo;
    occlusionTexture?: IOcclusionTextureInfo;
    emissiveTexture?: ITextureInfo;
    emissiveFactor?: [number, number, number];
    alphaMode?: ALPHA_MODES;
    alphaCutoff?: number;
    doubleSided?: boolean;
}

declare interface IMesh extends IBase {
    name?: string;
    primitives: IPrimitive[];
    weights?: number[];
}

declare interface IMetaBlock {
    index: number;
    name: string;
    start: number;
    count: number;
    minLevelStart: number;
    levelFaceCounts: number[];
    levelVerticesCounts: number[];
    levelFaceAccumulateCounts: number[];
    levelVerticesAccumulateCounts: number[];
}

/**
 * Buffer attribute type used to store geometry indices.
 */
declare type IndexBufferAttribute = BufferAttribute<Uint16Array | Uint32Array>;

declare function initWebXR(options?: WebXROptions): Promise<ExtendedViewerPlugin>;

declare interface INode extends IBase {
    name?: string;
    children?: number[];
    matrix?: number[];
    translation?: [number, number, number];
    rotation?: [number, number, number, number];
    scale?: [number, number, number];
    mesh?: number;
    skin?: number;
    weights?: number[];
    camera?: number;
}

declare interface INormalTextureInfo extends ITextureInfo {
    scale?: number;
}

/**
 * An instanced version of {@link BufferAttribute | BufferAttribute }.
 */
export declare class InstancedBufferAttribute<T extends TypeArray = TypeArray> extends BufferAttribute<T> {
    /**
     * Defines how often a value of this buffer attribute should be repeated.
     * A value of one means that each value of the instanced attribute is used for a single instance.
     * A value of two means that each value is used for two consecutive instances (and so on).
     * Default is *1*.
     */
    meshPerAttribute: number;
    /**
     * Used to check type of this or extended instance.
     * This value should not be changed by user.
     */
    isInstancedBufferAttribute: boolean;
    constructor(data: T, itemSize: number, meshPerAttribute?: number);
    /**
     * Copy the data to this object from source.
     * @param { InstancedBufferAttribute } source the data source.
     */
    copy(source: InstancedBufferAttribute): this;
}

export declare class InstancedBufferGeometry extends BufferGeometry {
    /**
     * Used to check type of this or extended instance.
     * This value should not be changed by user.
     */
    isInstancedBufferGeometry: boolean;
    /**
     * The type of this instance.
     */
    type: string;
    /**
     * The number of instanced object.
     */
    private _instancedCount;
    get instancedCount(): number;
    set instancedCount(v: number);
    /**
     * Copy the data to this object from source.
     * This method need override in derived classes to copy extended data.
     * @param {InstancedBufferGeometry} source the data source.
     */
    copy(source: InstancedBufferGeometry): this;
    /**
     * Create a clone of this instance.
     */
    clone(): InstancedBufferGeometry;
}

/**
 * A special version of Mesh with instanced rendering supported.
 * Use InstancedMesh if you have to render a large number of objects with the same geometry and material but with different world transformations.
 * The usage of InstancedMesh will help you to reduce the number of draw calls and thus improve the overall rendering performance in your application.
 */
export declare class InstanceMesh extends Mesh<Material, InstancedBufferGeometry> {
    className(): string;
    private bbxMap;
    instanceMatrixBuffer: Float32Array<ArrayBuffer>;
    constructor(meshes: Mesh[]);
    private updateInstanceMatrix;
    /**
     * Update the data which needs be changed according to the camera's state and
     * attributes of {@link Drawable.updateRenderInfo| Drawable} before drawing this object.
     * @param {Camera3D} camera the camera which is used in current frame.
     * @param {number} viewHeight the height of canvas.
     */
    updateRenderInfo(camera: Camera3D, viewHeight: number): void;
    updateSource(meshes: Mesh[]): void;
    private updateTransforms;
    /**
     * Update the rendering date from this instance.
     */
    updateRenderEntity(): void;
    /**
     * Clear the rendering data of engine.
     */
    updateInstance(): void;
    raycastJsImpl(raycaster: Raycaster, intersects: Intersection[]): void;
    destroy(): void;
    clone(recursive?: boolean): InstanceMesh;
}

declare enum InterpolationMode {
    Discrete = 2300,
    Linear = 2301,
    Smooth = 2302
}

export declare enum IntersectContainment {
    Outside = 0,
    Intersect = 1,
    Inside = 2
}

/**
 * The attributes of this Intersection used to record the result of calculation.
 */
export declare interface Intersection {
    object: Object3D;
    point: Vector3;
    distance: number;
    /**
     * primitive of the intersection
     * for indexed geometry, it related to index buffer
     * for non-index geometry, it is related to position buffer
     */
    primitiveIndex: number;
    distanceToRay?: number;
    /**
     * @deprecated use `primitiveIndex` instead
     * only exist when hit points or lines
     * the value maybe confused, not recommended to use
     */
    index?: number;
    face?: Face3;
    uv?: Vector2;
    /**
     * @deprecated use `primitiveIndex` instead
     * only exist when hit mesh
     */
    faceIndex?: number;
    instanceIndex?: number;
}

declare interface INumber3 {
    x: number;
    y: number;
    z: number;
}

declare interface IOcclusionTextureInfo extends ITextureInfo {
    strength?: number;
}

declare interface IOrthographicCamera extends IBase {
    xmag: number;
    ymag: number;
    zfar: number;
    znear: number;
}

declare interface IPerspectiveCamera extends IBase {
    aspectRatio?: number;
    yfov: number;
    zfar?: number;
    znear: number;
}

export declare interface IPipelineConfig {
    /**
     * background and ground
     */
    Background?: IBackgroundPluginConfig;
    /**
     * output Composite, used to optimize multi viewport rendering
     */
    Composite?: ICompositePluginConfig;
    /**
     * gaussian splatting
     */
    Splatting?: ISplattingPluginConfig;
    /**
     * static TAA
     */
    TAA?: ITaaPluginConfig;
}

declare type IPipelineConfig_2 = ConfigCellImpl<Omit<PipelineConfig, 'SceneClip' | 'ShadowMap' | 'Composite' | 'Debug'>> & {
    Stylize?: {
        /**
         * @deprecated use target instead
         */
        applyToBackgroundAndGround?: boolean;
    };
};

declare interface IPipelineFilter<T extends Drawcall | Drawable = any> {
    $PARAM: any;
    $TYPE_NAME: string;
    (o: T): boolean;
}

declare interface IPopbufferAttributes {
    boxMax: INumber3;
    boxMin: INumber3;
    vertexGridSize: number;
    vertexRepresentBit: INumber3;
    textureScale: number;
    normalScale: number;
    groupCount: number;
    blockNames: string[];
    faceCount: number;
    blockFaceCounts: number[];
    vertexCount: number;
}

declare interface IPopbufferInfo {
    version: number;
    attributes: IPopbufferAttributes;
    indices: Uint16Array | Uint32Array;
    vertices: Float32Array;
    normals: Float32Array;
    textures: Float32Array;
    blocks: IMetaBlock[];
    maxPrecision: number;
    levelPrecisions: number[];
    /**
     * @deprecated
     */
    currentVertexCount: number;
    /**
     * @deprecated
     */
    currentBlockFaceCounts: number[];
    /**
     * @deprecated
     */
    verticeDataLengthForEachLevel: any[];
}

declare interface IPrimitive extends IBase {
    attributes: Record<string, number>;
    indices?: number;
    material?: number;
    targets?: Array<{
        [semantic: string]: number;
    }>;
    mode?: PrimitiveMode;
}

declare interface IRange {
    x: number;
    y: number;
    width: number;
    height: number;
}

declare interface IRenderer extends EventDispatcher {
    readonly renderInfo: RenderInfo;
    overrideDispatcher: Nullable<MaterialDispatcher>;
    getGPUInfo(): string;
    beforeFrameRender(requestFrameId: number, lastRenderedFrameId: number): void;
    afterFrameRender(renderedFrameId: number): void;
    updateRenderStatistics(r: RenderStatistics): void;
    getPixelRatio(): number;
    setPixelRatio(value: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    getSize(): {
        width: number;
        height: number;
    };
    getDrawingBufferSize(): {
        width: number;
        height: number;
    };
    setViewport(x: number, y: number, width: number, height: number): void;
    setViewportInRenderPass(x: number, y: number, width: number, height: number): void;
    setClearColor(color: Color | string | number, alpha?: number): void;
    /**
     * Tells the renderer to clear its color, depth or stencil drawing buffer(s).
     * @param color @default true
     * @param depth @default true
     * @param stencil @default true
     */
    clear(color?: boolean, depth?: boolean, stencil?: boolean): void;
    getCanvas(): HTMLCanvasElement;
    destroy(forceLost?: boolean): void;
    tick(timestamp: number): void;
    getCurrentCamera(): Camera3D;
    useCamera(camera: Nullable<Camera3D>): void;
    useRegistry(registry: ShaderComponentRegistry): void;
    renderDrawcall(geometry: BufferGeometryBase, material: Material, object: Drawable, range: Nullable<BufferRange>): void;
    renderRenderable(renderable: Renderable): void;
    prepareSplats?(owner: object, splats: Splat[], camera: Camera3D, size: {
        width: number;
        height: number;
    }, options: SplattingOptions): void;
    renderSplats?(owner: object): void;
    renderSplatKernels?(owner: object, options: SplatKernelOptions): void;
    resetRenderState(): void;
    setMaterialUploadDirty(): void;
    beginPass(store: boolean, resolveContent: boolean, resolveDepth: boolean, generateMipmap: boolean, material?: Material): void;
    endPass(): void;
    flushCommands(): void;
    setRenderTarget(target?: RenderTarget, resolveTarget?: RenderTarget): void;
    setScissorTest(enable: boolean): void;
    setScissor(x: number, y: number, width: number, height: number): void;
    /**
     * @deprecated use readPixelsAsync instead.
     */
    readPixels(target: RenderTarget, range: IRange, result: TypeArray): void;
    readPixelsAsync(target: RenderTarget, range: IRange, result: TypeArray): Promise<void>;
    forceContextLost(manual?: boolean): void;
    getMemoryInfo(whenGrowFailed?: boolean): Readonly<MemoryInfo>;
    releaseUnusedResources(delta: number): void;
    /**
     * queue a task to upload texture to gpu.
     */
    queueFlushTexture(texture: Texture): void;
}

declare interface ISampler {
    width: number;
    height: number;
    depth: number;
    format: ISamplerFormat;
    source: Uint8Array;
}

declare interface ISampler_2 extends IBase {
    name?: string;
    magFilter?: GLTFTextureMagFilter;
    minFilter?: GLTFTextureMinFilter;
    wrapS?: GLTFWrapMode;
    wrapT?: GLTFWrapMode;
}

declare enum ISamplerFormat {
    RG_UINT = 0,
    RGBA_UINT = 1
}

declare interface IScene extends IBase {
    nodes?: number[];
    name?: string;
}

declare interface ISingleSplat {
    x: number;
    y: number;
    z: number;
    sx: number;
    sy: number;
    sz: number;
    qx: number;
    qy: number;
    qz: number;
    qw: number;
    r: number;
    g: number;
    b: number;
    a: number;
}

declare interface ISkeleton {
    bones: Object3D[];
    inverseBindMatrices: Matrix4[];
}

declare interface ISkin extends IBase {
    name?: string;
    inverseBindMatrices?: number;
    skeleton?: number;
    joints: number[];
}

export declare interface ISkyBackgroundConfig {
    enablePreSkyMap?: boolean;
    luminance?: number;
    turbidity?: number;
    rayleigh?: number;
    mieCoefficient?: number;
    mieDirectionalG?: number;
}

declare interface ISplatData {
    counts: number;
    shDegree: number;
    samplers: ISampler[];
    extras?: any[];
}

declare interface ISplatModifyData {
    transform: Matrix4;
    deletedIndices: number[];
    indicesTransforms: Array<{
        indices: number[];
        transform: Matrix4;
    }>;
}

export declare interface ISplattingPluginConfig {
    enabled?: boolean;
    /**
     * gaussian pack
     */
    pack?: {
        highPrecisionEnabled?: boolean;
        precalculateEnabled?: boolean;
        cameraRelativeEnabled?: boolean;
        cameraRelativeUpdateDistanceThreshold?: number;
    };
    /**
     * gaussian raster
     */
    raster?: {
        mode?: __INTERNAL__.SplattingRenderMode;
        preBlurAmount?: number;
        blurAmount?: number;
        focalAdjustment?: number;
        maxStdDev?: number;
        maxPixelRadius?: number;
        detailCullingThreshold?: number;
        normalizedFalloff?: boolean;
        selectedColor?: Vector4;
    };
    /**
     * gaussian sorting
     */
    sort?: {
        highPrecisionEnabled?: boolean;
        minIntervalMs?: number;
        sortSplatDistance?: number;
        sortSplatCoorient?: number;
        sortCameraDistance?: number;
        sortCameraCoorient?: number;
        depthBias?: number;
    };
    /**
     * Offscreen composition and tone mapping before output.
     */
    composite?: {
        /**
         * Enable offscreen composition and tone mapping.
         * @default `false`
         */
        enabled?: boolean;
        /**
         * Use a 16-bit floating-point intermediate color buffer.
         * @default `false`
         */
        highPrecisionEnabled?: boolean;
        /** @default `ToneMapping.Linear` */
        toneMapping?: ToneMapping;
        /** @default `1` */
        exposure?: number;
    };
    /**
     * gaussian center highlight
     */
    highlightKernel?: {
        enabled?: boolean;
        size?: number;
        color?: number;
    };
}

export declare interface ITaaPluginConfig {
    /**
     * enabled static TAA
     * @default `true`
     */
    enabled?: boolean;
}

declare interface ITexture extends IBase {
    name?: string;
    source?: number;
    sampler?: number;
}

declare interface ITextureInfo extends IBase {
    index: number;
    texCoord?: number;
}

declare interface IVector3 {
    set(x: number, y: number, z: number): void;
}

export declare interface IViewerConfig {
    /**
     * pixel ratio used for rendering
     * @default `1.0`
     * @remarks
     * default the renderer will use physical pixel in rendering.
     * if `devicePixelRatio` is large on some device, will cause performance issue, could set it to `1 / devicePixelRatio`
     */
    pixelRatio?: number;
    /**
     * render pipeline config
     */
    pipeline?: IPipelineConfig;
}

/**
 * Context object for viewport
 */
export declare interface IViewerContext {
    config: ViewerConfig;
    snapshotRenderer: SnapshotRenderer_2;
    setHighlightGroups(groups: HighlightGroup[]): void;
    snapshotRenderResult(range?: IRange): Promise<SnapshotResult> | undefined;
}

declare interface KeyframeTrack {
    path: string;
    times: TypedArray;
    values: TypedArray;
    interpolation: InterpolationMode;
}

declare class KsplatFile implements IFile {
    private counts;
    private shDegree;
    private header;
    private sections;
    private load;
    read(stream: ReadableStream<Uint8Array>, contentLength: number, data: IData): Promise<void>;
    write(_stream: WritableStream<Uint8Array>, _data: IData): Promise<void>;
}

/**
 * A Layers object assigns an Object3D to 1 or more of 32 layers numbered 0 to 31 - internally the layers are stored as a bit mask,
 * and by default all Object3Ds are a member of layer 0.
 * This can be used to control visibility - an object must share a layer with a camera to be visible when that camera's view is renderered.
 * All classes that inherit from Object3D have an {@link Object3D.layers| layers } property which is an instance of this class.
 */
export declare class Layers extends EventDispatcher {
    get mask(): number;
    set mask(value: number);
    /**
     * A bit mask storing which of the 32 layers this layers object is currently a member of.
     */
    private _mask;
    /**
     * Set membership to layer, and remove membership all other layers.
     * @param channel an integer from 0 to 31.
     */
    set(channel: number): this;
    /**
     * Add membership of this layer.
     * @param channel an integer from 0 to 31.
     */
    enable(channel: number): this;
    /**
     * Toggle membership of layer.
     * @param channel an integer from 0 to 31.
     */
    toggle(channel: number): this;
    /**
     * Remove membership of this layer.
     * @param channel an integer from 0 to 31.
     */
    disable(channel: number): this;
    /**
     * Returns true if this and the passed layers object are members of the same set of layers.
     * @param layers a Layers object.
     */
    test(layers: Layers): boolean;
    /**
     * Copies the {@link mask| mask} of given layers to this.
     */
    copy(value: Layers): void;
    /**
     * Returns a new Layers with the same {@link mask| mask} as this one.
     */
    clone(): Layers;
}

declare type LayerSource = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | ImageData | ImageBitmap | TypeArray;

declare class Lcc2File implements IFile {
    private readonly lodLevel;
    private splatType;
    private meta;
    constructor(lodLevel?: number);
    private load;
    private collectFiles;
    read(stream: ReadableStream<Uint8Array>, _contentLength: number, data: IData, context?: FileContext): Promise<void>;
    write(_stream: WritableStream<Uint8Array>, _data: IData): Promise<void>;
}

declare class LccFile implements IFile {
    private counts;
    private shDegree;
    private meta;
    read(stream: ReadableStream<Uint8Array>, _contentLength: number, data: IData, context?: FileContext): Promise<void>;
    write(_stream: WritableStream<Uint8Array>, _data: IData): Promise<void>;
}

/**
 * LegacySourceTexture is the base texture class for texture with cpu data(eg. Texture2D, Texture2DCompressed...)
 */
declare abstract class LegacySourceTexture extends Texture {
    protected abstract getAutoGeneratedMipmapByteSize(): number;
}

/**
 * This class is base class of all types of light source.
 * Every lights have two basic attributes which are color and intensity.
 */
declare abstract class Light extends Object3D {
    /**
     * The type of this Object3D.
     */
    type: string;
    /**
     * Check the type whether it belongs to Light.
     * This value should not be changed by user.
     */
    isLight: boolean;
    /**
     * Color of the light. This value can influence the color of model's surface according to the material.
     * Defaults to a new {@link Color | color } set to white, if not passed in the constructor.
     */
    color: Color;
    /**
     * The light's intensity, or strength.
     * In physically correct mode, the product of color * intensity is interpreted as luminous intensity measured in candela.
     * @defaultValue `1`
     */
    intensity: number;
    private _enabled;
    get enabled(): boolean;
    set enabled(v: boolean);
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(color?: number | string, intensity?: number);
    /**
     * Copy the data to this light instance from source.
     * This method need override in derived classes to copy extended data.
     * @param {Light} source the data source.
     */
    copy(source: Light, recursive?: boolean): this;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
}

declare abstract class LightableMaterial extends ScenePopLODMaterial {
    isLightableMaterial: boolean;
    flatShadingNormal: boolean;
    freeGPU(): void;
    extendShaderShading(b: ShaderBuilder, _r: ShaderComponentRegistry): void;
    extendShaderShape(b: ShaderBuilder, r: ShaderComponentRegistry): void;
    getLightSystem(registry: ShaderComponentRegistry): LightShaderComponent;
    updateShadingUniforms(program: WGLProgram, r: ShaderComponentRegistry): void;
    generateShaderKey(r: ShaderComponentRegistry): string;
}

declare interface LightMaterialComponent {
    generateMaterialForLight(): string;
    RE_Direct?(): string;
    RE_IndirectDiffuse?(): string;
    RE_IndirectSpecular?(): string;
    RE_Direct_RectArea?(): string;
    RE_Direct_DiskArea?(): string;
}

declare class LightShaderComponent extends SharedShaderComponent {
    lights: Set<Light>;
    enabled_light: number;
    lightHashKeyPrevious: string;
    onlyDirectLight: boolean;
    activeLayers?: Layers;
    className(): string;
    pointLights: PointLight[];
    pointShadowLength: number;
    get hasPointShadow(): boolean;
    getNthShadowPointLight(n: number): PointLight<Texture2D>;
    spotLights: SpotLight[];
    spotShadowLength: number;
    get hasSpotShadow(): boolean;
    getNthShadowSpotLight(n: number): SpotLight<Texture2D>;
    directionalLights: DirectionalLight[];
    directionalShadowLength: number;
    get hasDirectionalShadow(): boolean;
    getNthShadowDirectionalLight(n: number): DirectionalLight;
    createShadowMetaInfo(): {
        directionalShadowCount: number;
        pointShadowCount: number;
        spotShadowCount: number;
    };
    rectAreaLights: RectAreaLight[];
    diskAreaLights: DiskAreaLight[];
    ambientLight: Nullable<AmbientLight>;
    hemiLights: HemisphereLight[];
    updateImpl(camera: Camera3D): boolean;
    lightAndShadowHashKey(): string;
    shadowHashKey(): string;
    get hasAnyShadow(): boolean;
    clear(): void;
    dispose(): void;
    setupOnlyLightSetForLaterRecollecting(lights: Set<Light>): void;
    collectDynamicForwardLightsByDrawable(drawable: Drawable): void;
    collectLights(lights: Set<Light>): void;
    collectLightImpl(): void;
    updateShadingUniforms(program: WGLProgram): void;
    updateShadowMapUniforms(program: WGLProgram): void;
    extendShaderShading(builder: ShaderBuilder): void;
    RE_Direct(_builder: ShaderBuilder, mat: LightMaterialComponent): string;
    RE_Direct_RectArea(_builder: ShaderBuilder, mat: LightMaterialComponent): string;
    RE_Direct_DiskArea(_builder: ShaderBuilder, mat: LightMaterialComponent): string;
    RE_IndirectDiffuse(builder: ShaderBuilder, mat: LightMaterialComponent): string;
    RE_IndirectSpecular(builder: ShaderBuilder, mat: LightMaterialComponent): string;
    buildLightCollector(builder: ShaderBuilder): string;
    copy(other: LightShaderComponent): LightShaderComponent;
    clone(): LightShaderComponent;
}

declare interface Limits {
    maxTextureDimension1D: number;
    maxTextureDimension2D: number;
    maxTextureDimension3D: number;
    maxTextureArrayLayers: number;
    maxSampledTexturesPerShaderStage: number;
    maxInterStageShaderVariables: number;
    maxColorAttachments: number;
    maxVertexBuffers: number;
    maxVertexAttributes: number;
    minUniformBufferOffsetAlignment: number;
}

/**
 * This class is used to link points as one by one and draw a continuous line between them.
 * It supports any type of geometry, but only line material is supported.
 * The segment and loop line also need to extend this class.
 */
export declare class Line<M extends Material = Material> extends Drawable<M, BufferGeometry<LineStrip>> {
    /**
     * Check the type whether it belongs to Line.
     * This value should not be changed by user.
     */
    isLine: boolean;
    /**
     * Decisive attribute to draw this object as continuous line.
     */
    drawMode: DrawMode;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(geometry?: BufferGeometry<LineStrip>, material?: M | M[]);
    /**
     * Get intersections between a casted {@link Ray| ray} and this Line.
     * The method {@link Raycaster.intersectObject| intersectObject()} will call this method, but the results are not ordered.
     * @param {Raycaster} raycaster the instance of Raycaster is used to get the data for calculation.
     * @param {Intersection} intersects the result will be stored here.
     */
    raycastJsImpl(raycaster: Raycaster, intersects: Intersection[]): void;
    /**
     * Return a clone of this object.
     */
    clone(recursive?: boolean): Line<M>;
}

/**
 * {@link Vector3| Vector3} representing the start point of the line.
 * A geometric line segment represented by a start and end point.
 */
declare class Line3 {
    /**
     * {@link Vector3| Vector3} representing the start point of the line.
     */
    start: Vector3;
    /**
     * {@link Vector3| Vector3} representing the end point of the line.
     */
    end: Vector3;
    constructor(start?: Vector3, end?: Vector3);
    /**
     * Sets the start and end values by copying the provided vectors.
     * @param start set the {@link start | start} of the line.
     * @param end set the {@link end | end} of the line.
     */
    set(start: Vector3, end: Vector3): Line3;
    /**
     * Returns a new {@link Line3 | Line3} with the same {@link start | start} and {@link end | end} vectors as this one.
     */
    clone(): Line3;
    /**
     * Copies the passed line's {@link start | start} and {@link end | end} vectors to this line.
     */
    copy(line: Line3): Line3;
    /**
     * Returns the center of the line segment.
     * @param target the result will be copied into this Vector3.
     */
    getCenter(target: Vector3): Vector3;
    /**
     * Returns the delta vector of the line segment ({@link end | end} vector minus the {@link start | start} vector).
     * @param target the result will be copied into this Vector3.
     */
    delta(target: Vector3): Vector3;
    /**
     * Returns the square of the {@link https://en.wikipedia.org/wiki/Euclidean_distance | Euclidean distance}
     * (straight-line distance) between the line's {@link start | start} and {@link end | end} vectors.
     */
    distanceSq(): number;
    /**
     * Returns the {@link https://en.wikipedia.org/wiki/Euclidean_distance | Euclidean distance}
     * (straight-line distance) between the line's {@link start | start} and {@link end | end} points.
     */
    distance(): number;
    /**
     * Returns a vector at a certain position along the line. When {@link Float| t} = 0, it returns the start vector,
     * and when {@link Float| t} = 1 it returns the end vector.
     * @param t Use values 0-1 to return a position along the line segment.
     * @param target the result will be copied into this Vector3.
     */
    at(t: number, target: Vector3): Vector3;
    /**
     * Returns a point parameter based on the closest point as projected on the line segment.
     * If {@link Boolean| clampToLine} is true, then the returned value will be between 0 and 1.
     * @param point the point for which to return a point parameter.
     * @param clampToLine Whether to clamp the result to the range [0, 1].
     */
    closestPointToPointParameter(point: Vector3, clampToLine?: boolean): number;
    /**
     * Returns the closets point on the line. If {@link Boolean| clampToLine} is true, then the returned value will be clamped to the line segment.
     * @param point return the closest point on the line to this point.
     * @param clampToLine whether to clamp the returned value to the line segment.
     * @param target the result will be copied into this Vector3.
     */
    closestPointToPoint(point: Vector3, clampToLine: boolean, target: Vector3): Vector3;
    /**
     * Applies a matrix transform to the line segment.
     */
    applyMatrix4(matrix: Matrix4): Line3;
    /**
     * Returns true if both line's {@link start| start} and {@link end| end} points are equal.
     * @param line {@link Line3| Line3} to compare with this one.
     */
    equals(line: Line3): boolean;
}

declare type LineBasicMaterialParameters = MaterialParameters & ColorWithAlphaParam;

/**
 * Build a line from {@link v1 | v1 } to {@link v2 | v2 } in 2D space.
 */
declare class LineCurve2D extends Curve2D {
    isLineCurve2D: boolean;
    v1: Vector2;
    v2: Vector2;
    constructor(v1?: Vector2, v2?: Vector2);
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void;
    className(): string;
    getPoint(t: number, optionalTarget?: Vector2): Vector2;
    getPointAt(u: number, optionalTarget?: Vector2): Vector2;
    getPoints(divisions?: number): Vector2[];
    clone(): LineCurve2D;
    copy(source: LineCurve2D): this;
    toJSON(): any;
    fromJSON(json: any): this;
}

/**
 * This class is used to control the length of gaps and segments for dashed line material,
 * which includes {@link FatLineMaterial| FatLineMaterial} and {@link LineDashedMaterial| LineDashedMaterial}.
 */
declare class LineDash extends ShaderComponent {
    /**
     * This parameter influence the length both of gaps and segments.
     */
    scale: number;
    /**
     * This parameter influence the length of gaps.
     */
    gapSize: number;
    /**
     * This parameter influence the length of segments.
     */
    dashSize: number;
    /**
     * secondary gap
     * @defaultValue 0
     */
    gapSize2: number;
    /**
     * secondary dash
     * @defaultValue 0
     */
    dashSize2: number;
    /**
     * This parameter influence the length of one dash with one gap and segment.
     * This parameter commonly do not need user to set it.
     * It is automatically updated when the zoom of camera is changed.
     */
    viewScale: number;
    /**
     * This material can not be used to instanced object.
     */
    useInstance: boolean;
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Change the corresponding attribute according to the values of given {@link LineDashParam | parameters}.
     * @param {LineDashParam} values a object of specified type contains parameters.
     */
    setValues(param: LineDashParam): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    extendShaderShading(builder: ShaderBuilder): void;
    /**
     * Copy the data to this instance from other instance.
     * @param {LineDash} other the source of copied data.
     */
    copy(other: LineDash): LineDash;
    /**
     * Return a cloned instance of this class.
     */
    clone(): LineDash;
}

/**
 * @scale This parameter influence the length both of gaps and segments.
 * @gapSize This parameter influence the length of gaps.
 * @dashSize This parameter influence the length of segments.
 * @viewScale This parameter influence the length of one dash with one gap and segment.
 * This parameter commonly do not need user to set it.
 * It is automatically updated when the zoom of camera is changed.
 */
declare type LineDashParam = ConvertMaterialParameters<Pick<LineDash, 'scale' | 'gapSize' | 'viewScale' | 'dashSize' | 'gapSize2' | 'dashSize2'>>;

/**
 * Topology marker for line-list buffer geometry.
 */
declare class LineList implements Topology {
    __topologyTypeMark: PrimitiveTopology.Line;
    __ll: boolean;
}

/**
 * Give linear object a specific color.
 */
export declare class LineMaterial extends SceneClipMaterial {
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(p?: LineBasicMaterialParameters);
    /**
     * Let color become to gradient from one end to another end.
     */
    enableVertexColor: boolean;
    /**
     * @deprecated
     */
    bias: number;
    /**
     * The basic color of lines.
     * @tips change the color by {@link setValues| setValues()} that is a better way.
     */
    readonly color: ColorWithAlpha;
    /**
     * Generate a key to make engine know user changes attribute {@link enableVertexColor| enableVertexColor}.
     * This method may override in extended class.
     */
    generateShaderKey(r: ShaderComponentRegistry): string;
    /**
     * Change the corresponding attribute according to the values of given {@link LineBasicMaterialParameters| parameters}.
     * @param {LineBasicMaterialParameters} values a object of specified type contains parameters.
     */
    setValues(values?: LineBasicMaterialParameters): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Copy the data to this instance from other instance.
     * @param {LineBasicMaterial} other the source of copied data.
     */
    copy(other: LineMaterial): this;
    /**
     * Return a cloned instance of this class.
     */
    clone(): LineMaterial;
}

/**
 * This class is used to link points as pair and draw a segmented line between them.
 * It supports any type of geometry, but only line material is supported.
 */
export declare class LineSegments<M extends Material = Material> extends Drawable<M, BufferGeometry<LineList>> {
    /**
     * Used to check type of this or extended instance.
     * This value should not be changed by user.
     */
    isLineSegments: boolean;
    /**
     * Decisive attribute to draw this object as separate line.
     */
    drawMode: DrawMode;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(geometry?: BufferGeometry<LineList>, material?: M | M[]);
    /**
     * Get intersections between a casted {@link Ray| ray} and this Line.
     * The method {@link Raycaster.intersectObject| intersectObject()} will call this method, but the results are not ordered.
     * @param {Raycaster} raycaster the instance of Raycaster is used to get the data for calculation.
     * @param {Intersection} intersects the result will be stored here.
     */
    raycastJsImpl(raycaster: Raycaster, intersects: Intersection[]): void;
    /**
     * Return a clone of this object.
     */
    clone(): LineSegments<M>;
}

/**
 * Topology marker for line-strip buffer geometry.
 */
declare class LineStrip implements Topology {
    __topologyTypeMark: PrimitiveTopology.LineStrip;
    __ls: boolean;
}

declare interface Listener<Payload = never> {
    (payload: Payload): void;
}

declare interface LoaderConfig {
    textureLoader: (url: string) => Promise<Texture>;
}

export declare interface LoaderOptions {
    containerType?: TextureContainerType;
    /**
     * some compressed texture needs viewer. E.G. KTX2 Basis transcode
     */
    context?: Viewer | IViewerContext;
    /**
     * manual specify supported compressed texture types.
     */
    supportedTypes?: CompressTextureType[];
    /**
     * same as HTMLImageElement.crossOrigin
     */
    crossOrigin?: string;
    /**
     * set false to force disable mipmaps.
     * @default `true`
     */
    mipmaps?: boolean;
}

declare function loadGLTF(data: ArrayBuffer | string, config: LoaderConfig): Promise<ParseResult>;

declare type LoadResourceFn = (url: string, signal?: AbortSignal) => Promise<SplatData>;

declare interface LodConfig {
    minLevel: number;
    /** Finest level admitted while the camera is moving. Zero is the finest level. */
    movingMinLevel: number;
    maxBudget: number;
    /** Stop refinement at one weighted render pixel per point. */
    pixelLimitEnabled: boolean;
    /** Stability duration in nominal 60 Hz ticks, independent of the caller's tick frequency. */
    hysteresisTicks: number;
    schedulerParallelCounts: number;
    schedulerExistingTaskLimit: number;
    schedulerMinDuration: number;
    mergeNodeEnabled: boolean;
    frustumCullingEnabled: boolean;
    debuggerEnabled: boolean;
}

declare interface LodMeta {
    magicCode: 2500660;
    type: 'lod-splat';
    version: string;
    counts: number;
    shDegree: number;
    levels: number;
    files: string[];
    /** Optional voxel file URLs, loaded by the external parser. */
    voxels?: string[];
    forwardBox: IBox;
    permanentFiles: number[];
    tree: Array<{
        bound: IBox;
        lods: Array<{
            file: number;
            offset: number;
            count: number;
        }>;
    }>;
}

declare class LodSplat {
    private minLevel;
    private movingMinLevel;
    private maxLevel;
    private maxBudget;
    private pixelLimitEnabled;
    private hysteresisTicks;
    private schedulerParallelCounts;
    private schedulerExistingTaskLimit;
    private schedulerMinDuration;
    private mergeNodeEnabled;
    private frustumCullingEnabled;
    private debuggerEnabled;
    private viewerCtx?;
    private gpuSorting;
    private resourceManager;
    private voxels?;
    private voxelLoading?;
    private nodes;
    private proxies;
    private effectiveBudget;
    private orderedNodes;
    private viewMatrix;
    private projectionMatrix;
    private viewProjection;
    private projectedCorners;
    private viewportPixels;
    private hasCamera;
    private viewDirty;
    private workDirty;
    private mergeDirty;
    private moving;
    private lastMotionTime;
    private lastScheduleTime;
    private nextCommitTime;
    private nextWorkTime;
    private pendingWork;
    private lastError?;
    private replacement?;
    readonly container: Object3D;
    constructor(meta: LodMeta, config?: Partial<LodConfig>, viewerCtx?: IViewerContext, loadResource?: LoadResourceFn, parseVoxel?: ParseLodVoxelFn);
    private loadVoxels;
    setConfig(config: Partial<LodConfig>): void;
    private modifiers;
    setModifiers(modifiers: SplatModifier[]): void;
    private updateModifiers;
    private applyModifiers;
    private get stabilityDuration();
    private get realUsedBudget();
    private get movingFinestLevel();
    private coverageLevel;
    private desiredLevel;
    /** Publish the view; viewport uses nonnegative render pixels and defaults to the viewer's drawing buffer. */
    tick(camera: Camera3D, viewport?: {
        width: number;
        height: number;
    }): void;
    private updateVisibility;
    private updateOcclusion;
    private importance;
    private schedule;
    private upgrade;
    private canMerge;
    private collectMerges;
    private merge;
    private onContextLost;
    private onRendererReset;
    private commit;
    private validReplacement;
    private disposeProxy;
    private finishReplacement;
    private cancelReplacement;
    private running?;
    onFinishSchedule(): Promise<void>;
    /** Advance pending work once. Use this directly when the application owns the frame loop. */
    flush(): void;
    private rafId?;
    /** Optional automatic pump; tick(camera) still supplies the view. */
    start(): void;
    /** Stop the automatic pump without discarding displayed or already prepared resources. */
    stop(): void;
    private isDestroy;
    destroy(): void;
}

/** Original voxel metadata and a zero-copy view of the binary, in LOD-local coordinates. */
declare interface LodVoxelData {
    gridBounds: {
        min: [number, number, number];
        max: [number, number, number];
    };
    voxelResolution: number;
    leafSize: number;
    treeDepth: number;
    nodeCount: number;
    leafDataCount: number;
    /** Node words followed by leaf bitmap words; no decoded tree or per-voxel objects. */
    buffer: Uint32Array;
}

declare enum Loop {
    Once = 2200,
    Repeat = 2201,
    PingPong = 2202
}

declare type Mapper<T> = (drawcall: T) => T | null;

/**
 * A base class for all materials with some abstract functions.
 * Materials describe the appearance of the objects.
 * They are defined in a (mostly) renderer-independent way, so you don't have to rewrite materials if you decide to use a different renderer.
 * The following properties and methods are inherited by all other material types (although they may have different defaults).
 */
declare abstract class Material extends ElementEventDispatcher implements SerializerableDelegatedAsReference, MaterialState, ElementsWithGPUResource {
    private components;
    private componentNameList;
    getComponents(): ReadonlyArray<ShaderComponent>;
    deleteComponent(index: number): void;
    addComponent(c: ShaderComponent, index?: number): void;
    /**
     * Mark this shape of this material is largely affect by shader.
     * Hint the engine that pick, culling is disabled
     * @deprecated
     */
    isDynamicShape: boolean;
    /**
     * Mark this material uses volume like rendering technology.
     * Hint the engine that some effect is disabled
     * @deprecated
     */
    isVolumeRendering: boolean;
    /**
     * max texture count, just in case some platform will take use of some channels by default,
     * so set to 6 instead of 8
     */
    static readonly MAX_TEXTURES = 6;
    /**
     * Optional name of the object (doesn't need to be unique). Default is an empty string.
     */
    name: string;
    /**
     * Unique number for this material instance.
     */
    id: number;
    /**
     * If use transparent effect, this value must be set to true to enable blending.
     * @defaultValue `false`
     */
    transparent: boolean;
    /**
     * Defines whether this material is visible.
     * @defaultValue `true`
     */
    visible: boolean;
    /**
     * The id of shader program which this material shader belongs to.
     */
    programId: number;
    refreshInstanceInBuilding(enable: boolean): void;
    /**
     * Set which side of the object will be seen on screen.
     */
    side: Side;
    /**
     * Which blending to use when displaying objects with this material.
     * This must be set to CustomBlending to use custom
     * {@link blendSrc| blendSrc }, {@link blendDst| blendDst } or {@link blendEquation| blendEquation }.
     * See the blending mode constants for all possible values. Default is NormalBlending.
     * @defaultValue {@link Blending.NormalBlending| NormalBlending }
     */
    blending: Blending;
    /**
     * Blending source. Default is SrcAlphaFactor. See the source factors constants for all possible values.
     * @defaultValue {@link BlendingFactor.SrcAlphaFactor| SrcAlphaFactor }
     */
    blendSrc: BlendingFactor;
    /**
     * Blending destination. Default is OneMinusSrcAlphaFactor. See the destination factors constants for all possible values.
     * @defaultValue {@link BlendingFactor.OneMinusSrcAlpha| OneMinusSrcAlpha }
     */
    blendDst: BlendingFactor;
    /**
     * Blending equation to use when applying blending. Default is AddEquation. See the blending equation constants for all possible values.
     * @defaultValue {@link BlendingEquation.Add| Add }
     */
    blendEquation: BlendingEquation;
    /**
     * The transparency of the {@link blendSrc| blendSrc }.
     */
    blendSrcAlpha: Nullable<BlendingFactor>;
    /**
     * The transparency of the {@link blendDst| blendDst }.
     */
    blendDstAlpha: Nullable<BlendingFactor>;
    /**
     * The transparency of the {@link blendEquation| blendEquation }.
     */
    blendEquationAlpha: Nullable<BlendingEquation>;
    /**
     * Whether rendering this material has any effect on the stencil buffer.
     * @defaultValue `false`
     */
    stencilWrite: boolean;
    /**
     * The bit mask to use when writing to the stencil buffer.
     * @defaultValue `0xFF`
     */
    stencilWriteMask: number;
    /**
     * The bit mask to use when comparing against the stencil buffer.
     * @defaultValue `0xFF`
     */
    stencilFuncMask: number;
    /**
     * The stencil comparison function to use.
     * @defaultValue {@link StencilFunc.AlwaysStencilFunc| AlwaysStencilFunc }
     */
    stencilFunc: StencilFunc;
    /**
     * The value to use when performing stencil comparisons or stencil operations.
     * @defaultValue `0`
     */
    stencilRef: number;
    /**
     * Which stencil operation to perform when the comparison function returns false.
     * @defaultValue {@link StencilOp.KeepStencilOp| KeepStencilOp }
     */
    stencilFail: StencilOp;
    /**
     * Which stencil operation to perform when the comparison function returns true but the depth test fails.
     * @defaultValue {@link StencilOp.KeepStencilOp| KeepStencilOp }
     */
    stencilZFail: StencilOp;
    /**
     * Which stencil operation to perform when the comparison function returns true and the depth test passes.
     * @defaultValue {@link StencilOp.KeepStencilOp| KeepStencilOp }
     */
    stencilZPass: StencilOp;
    /**
     * Which depth function to use.
     * @defaultValue {@link DepthModes.LessEqualDepth| LessEqualDepth }
     */
    depthFunc: DepthModes;
    /**
     * Whether to have depth test enabled when rendering this material.
     * If this is set to false, this object's occluding relationship will depend on {@link Object3D.renderOrder| renderOrder }.
     * @defaultValue `true`
     */
    depthTest: boolean;
    /**
     * Whether rendering this material has any effect on the depth buffer.
     * @defaultValue `true`
     */
    depthWrite: boolean;
    /**
     * Whether to render the material's color.
     * This can be used in conjunction with a {@link Object3D.renderOrder| renderOrder } property to create invisible objects that occlude other objects.
     * @defaultValue `true`
     */
    colorWrite: boolean;
    colorWriteMasks: [boolean, boolean, boolean, boolean];
    setColorWriteMasks(r: boolean, g: boolean, b: boolean, a: boolean): void;
    /**
     * Whether to use polygon offset.
     * @defaultValue `false`
     */
    polygonOffset: boolean;
    /**
     * Sets the polygon offset factor.
     * @defaultValue `0`
     */
    polygonOffsetFactor: number;
    /**
     * Sets the polygon offset units.
     * @defaultValue `0`
     */
    polygonOffsetUnits: number;
    /**
     * Whether to premultiply the alpha (transparency) value.
     * @defaultValue `false`
     */
    premultipliedAlpha: boolean;
    private _shaderKey?;
    private _shapeKey?;
    /**
     * An optionally overriding method for extents to get data from renderer before update uniforms.
     * @param {Renderer} renderer instance of renderer for engine.
     */
    onBeforeRender?: (renderer: Renderer) => void;
    /**
     * When user change the material property manually, this method need to use to refresh data.
     */
    notifyMaterialPropertyChanged(): void;
    /**
     * User can give any parameter to create new instance with corresponding properties.
     */
    constructor(params?: MaterialParameters);
    colorWriteMask: [boolean, boolean, boolean, boolean];
    /**
     * UUID of this material instance. This gets automatically assigned, so this shouldn't be edited.
     */
    getUUID(): string;
    /**
     * The name of instance's class.
     */
    abstract className(): string;
    /**
     * abstract function to clone each instance of the class
     */
    abstract clone(): Material;
    /**
     * abstract function to copy a same type material instance
     */
    abstract copy(other: Material): void;
    /**
     * Sets the properties with the given values.
     * In extents class, this method need to override in extended material for corresponding parameters.
     */
    setValues(values?: MaterialParameters): void;
    /**
     * Reset the key of shader and force engine to compile shader again.
     */
    notifyRecompileShader(): void;
    /**
     * Copy basic properties from other material.
     * @param {Material} other the source of copied data
     */
    copyBase(other: Material): void;
    /**
     * Make engine clear the current material's data in Ubo.
     */
    freeGPU(): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx this parameter has not supported external Serializer yet.
     * It may cause that this method can not be used directly.
     */
    serialize(ctx: Serializer): any;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx this parameter has not supported external Deserializer yet.
     * It may cause that this method can not be used directly.
     */
    deserialize(ctx: Deserializer): void;
    destroyAllResourcesOwned(): void;
    freeAllGpuResourceOwned(): void;
}

declare abstract class MaterialDispatcher extends BaseElement {
    constructor(skip?: boolean);
    destroy(): void;
    update(): void;
    abstract className(): string;
    abstract dispatch(renderer: Renderer, geometry: BufferGeometryBase, material: Material, object: Drawable): Nullable<WGLProgram>;
}

/**
 * Common parameter bag accepted by material constructors and setters.
 */
declare type MaterialParameters = ConvertMaterialParameters<Pick<Material, 'transparent' | 'visible' | 'side' | 'blending' | 'blendSrc' | 'blendDst' | 'blendEquation' | 'blendSrcAlpha' | 'blendDstAlpha' | 'blendEquationAlpha' | 'depthFunc' | 'depthTest' | 'depthWrite' | 'colorWrite' | 'polygonOffset' | 'polygonOffsetFactor' | 'polygonOffsetUnits' | 'stencilWriteMask' | 'stencilFunc' | 'stencilRef' | 'stencilFuncMask' | 'stencilFail' | 'stencilZFail' | 'stencilZPass' | 'stencilWrite'>>;

/**
 * Render-state values shared by all materials.
 */
declare interface MaterialState {
    transparent: boolean;
    visible: boolean;
    side: Side;
    blending: Blending;
    blendSrc: BlendingFactor;
    blendDst: BlendingFactor;
    blendEquation: BlendingEquation;
    blendSrcAlpha: Nullable<BlendingFactor>;
    blendDstAlpha: Nullable<BlendingFactor>;
    blendEquationAlpha: Nullable<BlendingEquation>;
    stencilWriteMask: number;
    stencilFunc: StencilFunc;
    stencilRef: number;
    stencilFuncMask: number;
    stencilFail: StencilOp;
    stencilZFail: StencilOp;
    stencilZPass: StencilOp;
    stencilWrite: boolean;
    depthFunc: DepthModes;
    depthTest: boolean;
    depthWrite: boolean;
    colorWrite: boolean;
    colorWriteMasks: [boolean, boolean, boolean, boolean];
    polygonOffset: boolean;
    polygonOffsetFactor: number;
    polygonOffsetUnits: number;
    premultipliedAlpha: boolean;
}

/**
 * A class representing a 3x3 {@link https://en.wikipedia.org/wiki/Matrix_(mathematics)| matrix}.
 */
export declare class Matrix3 {
    /**
     * Check the type whether it belongs to Matrix3.
     * This value should not be changed by user.
     */
    isMatrix3: boolean;
    /**
     * If this value is true, then fast matrix operations can be used.
     * If not, then we presume the matrix to the points needs to do some
     * 'fake' 3d projection transforms.
     * @remarks see {@link multiplyMatrixFast | multiplyMatrixFast } for more detail
     */
    is2x3: boolean;
    private static defaultElements;
    /**
     * A {@link https://en.wikipedia.org/wiki/Row-_and_column-major_order#Column-major_order| column-major } list of matrix values.
     */
    get elements(): Float32Array;
    /**
     * @deprecated use `fromArray` instead;
     */
    set elements(v: Float32Array);
    constructor();
    /**
     * Sets the 3x3 matrix values to the given {@link https://en.wikipedia.org/wiki/Row-_and_column-major_order | row-major } sequence of values.
     * @param n11 value to put in row 1, col 1.
     * @param n12 value to put in row 1, col 2.
     * @param n32 value to put in row 3, col 2.
     * @param n33 value to put in row 3, col 3.
     */
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): Matrix3;
    /**
     * Resets this matrix to the 3x3 identity matrix:
     * <pre><code>
     * 1, 0, 0
     * 0, 1, 0
     * 0, 0, 1
     * </code>
     * <pre/>
     */
    identity(): Matrix3;
    /**
     * Creates a new Matrix3 and with identical elements to this one.
     */
    clone(): Matrix3;
    cloneReadonly(): ReadonlyMatrix3;
    /**
     * Copies the elements of matrix {@link Matrix3| m} into this matrix.
     */
    copy(m: Matrix3): Matrix3;
    /**
     * Set this matrix to the upper 3x3 matrix of the Matrix4 {@link Matrix4| m}.
     */
    setFromMatrix4(m: Matrix4): Matrix3;
    /**
     * Apply this matrix to given {@link BufferAttribute| attribute buffer}.
     */
    applyToBufferAttribute(attribute: BufferAttribute, __forceJSImpl?: boolean): BufferAttribute;
    /**
     * Post-multiplies this matrix by {@link Matrix3| m}.
     */
    multiply(m: Matrix3): Matrix3;
    /**
     * Pre-multiplies this matrix by {@link Matrix3| m}.
     */
    premultiply(m: Matrix3): Matrix3;
    /**
     * Sets this matrix to {@link Matrix3| a} x {@link Matrix3| b}.
     */
    multiplyMatrices(a: Matrix3, b: Matrix3): Matrix3;
    addMatrices(a: Matrix3, b: Matrix3): Matrix3;
    /**
     * Multiplies every component of the matrix by the scalar value `s`.
     */
    multiplyScalar(s: number): Matrix3;
    /**
     * Computes and returns the {@link https://en.wikipedia.org/wiki/Determinant| determinant} of this matrix.
     */
    determinant(): number;
    /**
     * Return the inverse matrix of given matrix.
     */
    getInverse(matrix: Matrix3, throwOnDegenerate?: boolean): Matrix3;
    /**
     * Return the transpose matrix of this.
     */
    transpose(): Matrix3;
    /**
     * Sets this matrix as the upper left 3x3 of the {@link https://en.wikipedia.org/wiki/Normal_matrix| normal matrix} of the passed {@link Matrix4| matrix4}.
     * The normal matrix is the {@link https://en.wikipedia.org/wiki/Invertible_matrix| inverse } {@link https://en.wikipedia.org/wiki/Transpose | transpose } of the matrix {@link Matrix4| m}.
     * @param m {@link Matrix4| Matrix4}
     */
    getNormalMatrix(matrix4: Matrix4): Matrix3;
    /**
     * Transpose this matrix into the supplied array, and returns itself unchanged.
     * @param array array to store the resulting vector in.
     */
    transposeIntoArray(r: Matrix3): Matrix3;
    /**
     * Build transform matrix.
     * @param tx A translate add to u.
     * @param tx A translate add to v.
     * @param sx Scale multiply to u.
     * @param sy Scale multiply to v.
     * @param rotation A rotation apply to u and v.
     * @param cx Translate u influenced by same rotation.
     * @param cy Translate v influenced by same rotation.
     */
    setUVTransform(tx: number, ty: number, sx: number, sy: number, rotation: number, cx: number, cy: number): void;
    /**
     * Apply a scale on this matrix.
     * @param sx scale the value of first row.
     * @param sy scale the value of second row.
     */
    scale(sx: number, sy: number): Matrix3;
    /**
     * Apply a rotation on this matrix.
     * @param theta a value in radius.
     */
    rotate(theta: number): Matrix3;
    /**
     * Apply a translation to this matrix.
     * @param tx translate first row by tx.
     * @param ty translate second row by ty.
     */
    translate(tx: number, ty: number): Matrix3;
    /**
     * Return true if this matrix and {@link Matrix3| m} are equal.
     */
    equals(matrix: Matrix3): boolean;
    /**
     * Apply this matrix on vector pos, and store the result in newPos (if it is given) or as return.
     */
    apply(pos: Vector2, newPos?: Vector2): Vector2;
    /**
     * Apply this matrix on given array.
     * Each vector item of array should hold three elements.
     */
    applyToArray(array: Float32Array): Float32Array;
    /**
     * Apply this matrix's inverse on vector pos, and store the result in newPos (if it is given) or as return.
     */
    applyInverse(pos: Vector2, newPos?: Vector2): Vector2;
    /**
     * Sets the elements of this matrix based on an array in column-major format.
     * @param array the array to read the elements from.
     * @param offset (optional) index of first element in the array.
     * @defaultValue `0`.
     */
    fromArray(array: ArrayLike<number>, offset?: number): Matrix3;
    /**
     * There are 9 elements in this matrix.
     */
    getNumberCount(): number;
    /**
     * Writes the elements of this matrix to an array in column-major format.
     * @param array (optional) array to store the resulting vector in. If not given a new array will be created.
     * @param offset (optional) offset in the array at which to put the result.
     */
    toArray(array?: number[], offset?: number): number[];
    toStd140Array(array?: number[], offset?: number): number[];
    /**
     * Sets the matrix based on all the available properties.
     * @param x Position on the x axis.
     * @param y Position on the y axis.
     * @param pivotX Pivot on the x axis.
     * @param pivotY Pivot on the y axis.
     * @param scaleX Scale on the x axis.
     * @param scaleY Scale on the y axis.
     * @param rotation Rotation in radians.
     * @param skewX Skew on the x axis.
     * @param skewY Skew on the y axis.
     * @return This matrix. Good for chaining method calls.
     */
    compose(x: number, y: number, pivotX: number, pivotY: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number): this;
    /**
     * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
     * @return The transform with the newly applied properties.
     */
    decompose(): {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        skewX: number;
        skewY: number;
    };
    /**
     * Return an orthogonal projection matrix which is set by parameter.
     * @remarks See {@link OrthographicCamera | OrthographicCamera } for more details.
     */
    makeOrthographic(left: number, right: number, top: number, bottom: number): Matrix3;
    /**
     * This multiplication is specifically used for 2x3 matrixes calculation.
     */
    static multiplyMatrixFast(a: Matrix3, b: Matrix3, result: Matrix3): Matrix3;
}

/**
 * 4x4 matrix used for 3D transformations and projections.
 */
export declare class Matrix4 {
    /**
     * Check the type whether it belongs to Matrix4.
     * This value should not be changed by user.
     */
    isMatrix4: boolean;
    private static defaultElements;
    /**
     * A {@link https://en.wikipedia.org/wiki/Row-_and_column-major_order#Column-major_order| column-major } list of matrix values.
     */
    get elements(): Float32Array;
    /**
     * @deprecated use `fromArray` instead;
     */
    set elements(v: Float32Array);
    constructor();
    /**
     * Set the {@link elements| elements} of this matrix to the supplied row-major values n11, n12, ... n44.
     */
    set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): Matrix4;
    /**
     * Resets this matrix to the {@link https://en.wikipedia.org/wiki/Identity_matrix | identity matrix}.
     */
    identity(): Matrix4;
    /**
     * Creates a new Matrix4 with identical {@link elements | elements } to this one.
     */
    clone(): Matrix4;
    cloneReadonly(): ReadonlyMatrix4;
    /**
     * Copies the {@link elements| elements} of matrix {@link Matrix4| m} into this matrix.
     */
    copy(m: Matrix4): Matrix4;
    /**
     * Copies the translation component of the supplied matrix {@link Matrix4| m} into this matrix's translation component.
     */
    copyPosition(m: Matrix4): Matrix4;
    /**
     * Extracts the {@link https://en.wikipedia.org/wiki/Basis_(linear_algebra)| basis} of this matrix into the three axis vectors provided. If this matrix is:
     * <pre>
     * a, b, c, d,
     * e, f, g, h,
     * i, j, k, l,
     * m, n, o, p
     * </pre>
     * then the {@link Vector3| xAxis}, {@link Vector3| yAxis}, {@link Vector3| zAxis} will be set to:
     * <pre>
     * xAxis = (a, e, i)
     * yAxis = (b, f, j)
     * zAxis = (c, g, k)
     * </pre>
     */
    extractBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): Matrix4;
    /**
     * Set this to the basis matrix consisting of the three provided basis vectors:
     * <pre>
     * xAxis.x, yAxis.x, zAxis.x, 0,
     * xAxis.y, yAxis.y, zAxis.y, 0,
     * xAxis.z, yAxis.z, zAxis.z, 0,
     * 0,       0,       0,       1
     * </pre>
     */
    makeBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): Matrix4;
    /**
     * Extracts the rotation component of the supplied matrix {@link Matrix4| m} into this matrix's rotation component.
     */
    extractRotation(m: Matrix4): Matrix4;
    /**
     * Sets the rotation component (the upper left 3x3 matrix) of this matrix to the rotation specified by the given {@link Euler| euler}.
     * The rest of the matrix is set to the identity. Depending on the {@link Euler.order| order} of the {@link Euler| euler}, there are six possible outcomes.
     * @remarks See {@link https://en.wikipedia.org/wiki/Euler_angles#Rotation_matrix| this page} for a complete list.
     */
    makeRotationFromEuler(euler: Euler): Matrix4;
    /**
     * Sets the rotation component of this matrix to the rotation specified by {@link Quaternion| q},
     * as outlined {@link https://en.wikipedia.org/wiki/Rotation_matrix#Quaternion| here}.
     * The rest of the matrix is set to the identity. So, given {@link Quaternion| q} = w + xi + yj + zk, the resulting matrix will be:
     * <pre>
     * 1-2y²-2z²    2xy-2zw    2xz+2yw    0
     * 2xy+2zw      1-2x²-2z²  2yz-2xw    0
     * 2xz-2yw      2yz+2xw    1-2x²-2y²  0
     * 0            0          0          1
     * </pre>
     */
    makeRotationFromQuaternion(q: Quaternion): Matrix4;
    /**
     * Constructs a rotation matrix, looking from {@link Vector3| eye} towards {@link Vector3| center} oriented by the {@link Vector3| up} vector.
     */
    lookAt(eye: Vector3, target: Vector3, up: Vector3): Matrix4;
    /**
     * Post-multiplies this matrix by {@link Matrix4| m}.
     */
    multiply(m: Matrix4): Matrix4;
    /**
     * Pre-multiplies this matrix by {@link Matrix4| m}.
     */
    premultiply(m: Matrix4): Matrix4;
    /**
     * Sets this matrix to {@link Matrix4| a} x {@link Matrix4| b}.
     */
    multiplyMatrices(a: Matrix4, b: Matrix4): Matrix4;
    /**
     * Multiplies every component of the matrix by a scalar value s.
     */
    multiplyScalar(s: number): Matrix4;
    /**
     * Apply this matrix to given {@link BufferAttribute| attribute buffer}.
     */
    applyToBufferAttribute(attribute: BufferAttribute, __forceJSImpl?: boolean): BufferAttribute;
    /**
     * Apply this matrix on given array.
     * Each vector item of array should hold three elements.
     */
    applyToArray(array: Float32Array): Float32Array;
    /**
     * Computes and returns the {@link https://en.wikipedia.org/wiki/Determinant| determinant } of this matrix.
     * Based on the method outlined {@link http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm| here }.
     */
    determinant(): number;
    /**
     * {@link https://en.wikipedia.org/wiki/Transpose| Transposes } this matrix.
     */
    transpose(): Matrix4;
    /**
     * Sets the position component for this matrix from vector {@link Vector3| v}, without affecting the rest of the matrix - i.e. if the matrix is currently:
     * <pre>
     * a, b, c, d,
     * e, f, g, h,
     * i, j, k, l,
     * m, n, o, p
     * </pre>
     * This becomes:
     * <pre>
     * a, b, c, v.x,
     * e, f, g, v.y,
     * i, j, k, v.z,
     * m, n, o, p
     * </pre>
     */
    setPosition(v: Vector3): Matrix4;
    /**
     * Return the first three elements of last column.
     */
    getPosition(v: Vector3): Vector3;
    /**
     * Change this matrix to inverse.
     */
    getInverse(m: Matrix4, throwOnDegenerate?: boolean): Matrix4;
    /**
     * Multiplies the columns of this matrix by vector {@link Vector3| v}.
     */
    scale(v: Vector3): Matrix4;
    /**
     * Return the scales of three dimension.
     */
    getScale(v: Vector3): Vector3;
    /**
     * Apply a translation to this matrix.
     * @param tx translate first row by tx.
     * @param ty translate second row by ty.
     * @param ty translate third row by ty.
     */
    translate(tx: number, ty: number, tz: number): Matrix4;
    /**
     * Gets the maximum scale value of the 3 axes.
     */
    getMaxScaleOnAxis(): number;
    /**
     * Sets this matrix as a translation transform:
     * <pre>
     * 1, 0, 0, x,
     * 0, 1, 0, y,
     * 0, 0, 1, z,
     * 0, 0, 0, 1
     * </pre>
     * @param x the amount to translate in the X axis.
     * @param y the amount to translate in the Y axis.
     * @param z the amount to translate in the Z axis.
     */
    makeTranslation(x: number, y: number, z: number): Matrix4;
    /**
     * Sets this matrix as a rotational transformation around the X axis by {@link Float| theta} (&theta;) radians.
     * The resulting matrix will be:
     * <pre>
     * 1      0             0        0
     * 0 cos(&theta;) -sin(&theta;)  0
     * 0 sin(&theta;) cos(&theta;)   0
     * 0      0             0        1
     * </pre>
     * @param theta Rotation angle in radians.
     */
    makeRotationX(theta: number): Matrix4;
    /**
     * Sets this matrix as a rotational transformation around the Y axis by {@link Float| theta} (&theta;) radians.
     * The resulting matrix will be:
     * <pre>
     * cos(&theta;)  0 sin(&theta;) 0
     *      0        1      0       0
     * -sin(&theta;) 0 cos(&theta;) 0
     *      0        0      0       1
     * </pre>
     * @param theta Rotation angle in radians.
     */
    makeRotationY(theta: number): Matrix4;
    /**
     * Sets this matrix as a rotational transformation around the Z axis by {@link Float| theta} (&theta;) radians.
     * The resulting matrix will be:
     * <pre>
     * cos(&theta;) -sin(&theta;) 0 0
     * sin(&theta;) cos(&theta;)  0 0
     *       0            0       1 0
     *       0            0       0 1
     * </pre>
     * @param theta Rotation angle in radians.
     */
    makeRotationZ(theta: number): Matrix4;
    /**
     * Sets this matrix as rotation transform around {@link Vector3| axis} by {@link Float| theta} radians.<br />
     * This is a somewhat controversial but mathematically sound alternative to rotating via {@link Quaternions| Quaternions}.
     * @remarks See the discussion {@link https://www.gamedev.net/articles/programming/math-and-physics/do-we-really-need-quaternions-r1199| here}.
     * @param axis Rotation axis, should be normalized.
     * @param theta Rotation angle in radians.
     */
    makeRotationAxis(axis: Vector3, angle: number): Matrix4;
    /**
     * @param x the amount to scale in the X axis.
     * @param y the amount to scale in the Y axis.
     * @param z the amount to scale in the Z axis.
     * Sets this matrix as scale transform:
     * <pre>
     * x, 0, 0, 0,
     * 0, y, 0, 0,
     * 0, 0, z, 0,
     * 0, 0, 0, 1
     * </pre>
     */
    makeScale(x: number, y: number, z: number): Matrix4;
    /**
     * @param x the amount to shear in the X axis.
     * @param y the amount to shear in the Y axis.
     * @param z the amount to shear in the Z axis.
     * Sets this matrix as a shear transform:
     * <pre>
     * 1, y, z, 0,
     * x, 1, z, 0,
     * x, y, 1, 0,
     * 0, 0, 0, 1
     * </pre>
     */
    makeShear(x: number, y: number, z: number): Matrix4;
    /**
     * Sets this matrix to the transformation composed of {@link Vector3| position}, {@link Quaternion| quaternion} and {@link Vector3| scale}.
     */
    compose(position: Vector3, quaternion: Quaternion, scale: Vector3): Matrix4;
    /**
     * Decomposes this matrix into it's {@link Vector3| position}, {@link Quaternion| quaternion} and {@link Vector3| scale} components.
     * @Note Not all matrices are decomposable in this way.
     * For example, if an object has a non-uniformly scaled parent, then the object's world matrix may not be decomposable, and this method may not be appropriate.
     */
    decompose(position: Vector3, quaternion: Quaternion, scale: Vector3): Matrix4;
    /**
     * Sets the matrix based on all the available properties.
     * @param x Position on the x axis.
     * @param y Position on the y axis.
     * @param pivotX Pivot on the x axis.
     * @param pivotY Pivot on the y axis.
     * @param scaleX Scale on the x axis.
     * @param scaleY Scale on the y axis.
     * @param rotation Rotation in radians.
     * @param skewX Skew on the x axis.
     * @param skewY Skew on the y axis.
     * @return This matrix. Good for chaining method calls.
     */
    compose2D(x: number, y: number, pivotX: number, pivotY: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number): this;
    /**
     * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
     * @returns The transform with the newly applied properties.
     */
    decompose2D(): {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        skewX: number;
        skewY: number;
    };
    /**
     * Creates a {@link https://en.wikipedia.org/wiki/3D_projection#Perspective_projection| perspective projection} matrix.
     * This is used internally by {@link PerspectiveCamera.updateProjectionMatrix| PerspectiveCamera.updateProjectionMatrix}()
     */
    makePerspective(left: number, right: number, top: number, bottom: number, near: number, far: number): Matrix4;
    /**
     * Creates an {@link https://en.wikipedia.org/wiki/Orthographic_projection| orthographic projection} matrix.
     * This is used internally by {@link OrthographicCamera.updateProjectionMatrix| OrthographicCamera.updateProjectionMatrix}().
     */
    makeOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number): Matrix4;
    /**
     * Apply this matrix to a 2D vector, z and w will set to 1 and 0.
     */
    transformVector2(vIn: {
        x: number;
        y: number;
    }, vOut?: Vector2): Vector2;
    /**
     * Return true if this matrix and {@link Matrix4| matrix} are equal.
     */
    equals(matrix: Matrix4): boolean;
    /**
     * Sets the elements of this matrix based on an array in column-major format.
     * @param array the array to read the elements from.
     * @param offset ( optional ) offset into the array.
     * @defaultValue `0`.
     */
    fromArray(array: ArrayLike<number>, offset?: number): Matrix4;
    /**
     * There are 16 elements in this matrix.
     */
    getNumberCount(): number;
    /**
     * Writes the elements of this matrix to an array in column-major format.
     * @param array (optional) array to store the resulting vector in.
     * @param offset (optional) offset in the array at which to put the result.
     */
    toArray(array?: number[], offset?: number): number[];
}

/**
 * Renderer memory usage reported by the engine backend.
 */
declare interface MemoryInfo {
    wasm_total_size: number;
    all_real: number;
    attributes_manager_real: number;
    geometries_manager_real: number;
    materials_manager_real: number;
    scene_nodes_manager_real: number;
    scenes_real: number;
    textures_manager_real: number;
    ubo_real: number;
    all_allocated: number;
    attributes_manager_allocated: number;
    geometries_manager_allocated: number;
    materials_manager_allocated: number;
    scene_nodes_manager_allocated: number;
    scenes_allocated: number;
    textures_manager_allocated: number;
    ubo_allocated: number;
}

declare interface MergedMeshData {
    geometry: PopBufferGeometry;
    material: MergedMeshPhongMaterial[];
}

/**
 * This is the material specifically for the mesh which contains different groups of sub-meshes and combine them into one single drawcall
 * The shader inside this material will have may if cases for different textures or colors
 */
declare class MergedMeshPhongMaterial<T extends Texture2D | TextureV2 = Texture2D> extends MeshPhongMaterial_2<T> {
    readonly isMergedMeshPhongMaterial = true;
    className(): string;
    generateShaderKey(r: ShaderComponentRegistry): string;
    dataTexture: T;
    textures: T[];
    traverseTexture(visitor: (tex: Texture) => void): void;
    setTextureUnit(texture: T, unit: number): void;
    private updateShadingUniformsSelf;
    updateShadingUniforms(program: WGLProgram, r: ShaderComponentRegistry): void;
    updateDeferredUniform(program: WGLProgram): void;
    private extendShadingSelf;
    extendShaderShading(b: ShaderBuilder, r: ShaderComponentRegistry): void;
    extendEncodeDeferred(b: ShaderBuilder): void;
}

/**
 * This class is used to connect every three points into a triangle and draws every meshes as corresponding material in the scene.
 */
export declare class Mesh<M extends Material = Material, G extends BufferGeometry<TriangleList> = BufferGeometry<TriangleList>> extends Drawable<M, G> {
    /**
     * Check the type whether it belongs to Mesh.
     * This value should not be changed by user.
     */
    isMesh: boolean;
    /**
     * Mark this mesh use origin material in transparent mode
     */
    useOriginMaterialInTransparentMode: boolean;
    /**
     * The type of this Object3D.
     */
    type: string;
    /**
     * Bind edges to a mesh.
     * Since the material is same, so all the groups will be combined together here.
     */
    edges: Nullable<LineSegments>;
    _syncedEdgeThreshold: number;
    private _instanceKey;
    /**
     * This key is used to identify the different instances with same data.
     * @remarks See {@link InstanceMesh| InstanceMesh} for more details
     */
    set instanceKey(value: Nullable<string>);
    get instanceKey(): Nullable<string>;
    private _mergeKey;
    /**
     * This key is used to merge different meshes which have same key into one WebGL Draw Call.
     */
    set mergeKey(value: Nullable<string>);
    get mergeKey(): Nullable<string>;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(geometry?: G, material?: M | M[]);
    /**
     * Update the data which need be changed according to the camera's state and
     * attributes of {@link Drawable.updateRenderInfo| Drawable} before drawing this object.
     * @param {Camera3D} camera the camera which is used in current frame.
     * @param {number} viewHeight the height of canvas.
     */
    updateRenderInfo(camera: Camera3D, viewHeight: number): void;
    /**
     * If user change the data of geometry, use this method to refresh the data.
     */
    setGeometryChanged(): void;
    /**
     * If user change the data of geometry, use this method to refresh referring data.
     * @remarks See {@link Drawable.onReferencedGeometryContentChange| onReferencedGeometryContentChange()} for more details.
     */
    onReferencedGeometryContentChange(): void;
    /**
     * Copy the data to this object from source.
     * This method need override in derived classes to copy extended data.
     * @param {Mesh} source the data source.
     */
    copy(source: Mesh<M, G>, recursive?: boolean): this;
    /**
     * Return a clone of this object.
     */
    clone(recursive?: boolean): Mesh<M, G>;
    destroy(): void;
    /**
     * Get intersections between a casted {@link Ray| ray} and this Mesh.
     * The method {@link Raycaster.intersectObject| intersectObject()} will call this method, but the results are not ordered.
     * @param {Raycaster} raycaster the instance of Raycaster is used to get the data for calculation.
     * @param {Intersection} intersects the result will be stored here.
     */
    raycastJsImpl(raycaster: Raycaster, intersects: Intersection[]): void;
}

declare class MeshBackground<T extends BackgroundLikeMaterial> implements Renderable {
    protected box: Mesh;
    protected geometry: BufferGeometry<TriangleList>;
    protected rotation: Quaternion;
    readonly material: T;
    constructor(material: T);
    get up(): Vector3;
    set up(up: Vector3);
    config(renderer: IRenderer): boolean;
    render(renderer: IRenderer): void;
    destroy(): void;
}

export declare const MeshBasicMaterial: typeof MeshBasicMaterial_2<SourceTexture>;

/**
 * A material for drawing geometries in a simple shaded way.
 * This material is not affected by lights.
 */
declare class MeshBasicMaterial_2<T extends Texture2D | TextureV2 = Texture2D> extends SceneClipMaterial {
    isMeshBasicMaterial: boolean;
    /**
     * The basic color of object. User can set texture by this.
     * @tips change the color by {@link setValues| setValues()} that is a better way.
     */
    readonly color: ColorShaderComponent<T>;
    /**
     * The Transparency of object.
     * @tips change the alpha by {@link setValues| setValues()} that is a better way.
     */
    readonly alpha: AlphaShaderComponent<T>;
    /**
     * Change the uv data by this matrix.
     */
    uvTransform: Readonly<Pick<ReadonlyMarked<Matrix3>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "getNumberCount" | "toArray" | "elements" | "applyToBufferAttribute" | "determinant" | "transposeIntoArray" | "applyToArray" | "applyInverse" | "decompose">>;
    enableVertexColor: boolean;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(p?: MeshBasicMaterialParameters<T>);
    /**
     * Change the corresponding attribute according to the values of given {@link MeshBasicMaterialParameters| parameters}.
     * @param {MeshBasicMaterialParameters} values a object of specified type contains parameters.
     */
    setValues(values?: MeshBasicMaterialParameters<T>): void;
    traverseTexture(visitor: (tex: Texture) => void): void;
    /**
     * Copy the data to this instance from other instance.
     * @param {MeshBasicMaterial} other the source of copied data
     */
    copy(other: MeshBasicMaterial_2<T>): this;
    /**
     * Return a cloned instance of this class.
     */
    clone(): MeshBasicMaterial_2<T>;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
}

declare type MeshBasicMaterialParameters<T extends Texture2D | TextureV2 = Texture2D> = MaterialParameters & {
    color?: number | string | Color;
    opacity?: number;
    texture?: Nullable<T>;
    uvTransform?: ReadonlyMatrix3;
    enableVertexColor?: boolean;
};

declare class MeshBVH {
    private bvh;
    private triangleIndexMap;
    constructor(bvh: BVH_2, triangleIndexMap: Uint32Array);
    pick(source: Mesh, raycaster: Raycaster, ray: Ray, intersects: Intersection[]): void;
    destroy(): void;
}

/**
 * Material that renders scene depth values.
 */
declare class MeshDepthMaterial extends SceneMaterial {
    depthPacking: DepthPackingStrategies;
    className(): string;
    extendShaderShading(b: ShaderBuilder): void;
    generateShaderKey(r: ShaderComponentRegistry): string;
    updateShadingUniforms(_: WGLProgram): void;
    clone(): MeshDepthMaterial;
    copy(other: MeshDepthMaterial): this;
}

export declare const MeshPhongMaterial: typeof MeshPhongMaterial_2<SourceTexture>;

/**
 * This material can apply illumination on model surface, which makes model looks shiny and specular.
 * Performance will generally be greater when using this material over the {@link PBRMaterial| PBRMaterial}, at the cost of some graphical accuracy.
 */
declare class MeshPhongMaterial_2<T extends Texture2D | TextureV2 = Texture2D> extends LightableMaterial implements DeferredMaterial {
    readonly isSupportDeferred: true;
    static constructMaterialFromGBufferForLight(): string;
    static extendDeferredLight(builder: ShaderBuilder): void;
    extendEncodeDeferred(builder: ShaderBuilder): void;
    updateDeferredUniform(p: WGLProgram): void;
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Check the type whether it belongs to MeshPhongMaterial.
     * This value should not be changed by user.
     */
    isMeshPhongMaterial: boolean;
    constructor(p?: MeshPhongMaterialParameters<T>);
    private UBO;
    /**
     * The basic color of object.
     * The final color on screen is also influenced by color and intensity of light and other parameters.
     */
    protected _color: ReadonlyColor;
    get color(): ReadonlyColor;
    set color(v: ReadonlyColor);
    /**
     * Use texture cover object, if it is given.
     */
    texture: Nullable<T>;
    /**
     * Apply opacity texture to change the transparency on object's some part.
     * The opacity is decided by the value of texture's red channel.
     */
    opacityTex: Nullable<T>;
    /**
     * The color of specular. This value and color of light influence the color of the edge part of specular area together.
     */
    protected _specular: ReadonlyColor;
    get specular(): ReadonlyColor;
    set specular(v: ReadonlyColor);
    /**
     * Opacity decide the transparency of whole surface of object.
     */
    protected _opacity: number;
    get opacity(): number;
    set opacity(v: number);
    /**
     * This value determines the area of specular reflect and the ratio of white part.
     */
    protected _shininess: number;
    get shininess(): number;
    set shininess(v: number);
    /**
     * This value determines the area of specular reflection. This influence is similar with {@link Light.intensity| intensity} of light.
     */
    protected _specularStrength: number;
    get specularStrength(): number;
    set specularStrength(v: number);
    /**
     * Change the corresponding attribute according to the values of given {@link MeshPhongMaterialParameters| parameters}.
     * @param {MeshPhongMaterialParameters} values a object of specified type contains parameters.
     */
    setValues(values?: MeshPhongMaterialParameters<T>): void;
    traverseTexture(visitor: (tex: Texture) => void): void;
    /**
     * Execute the given method for every ubo.
     * @param {function} _visitor a method to process ubo.
     */
    traverseUBO(visitor: (ubo: UniformBlockObject) => void): void;
    /**
     * Copy the data to this instance from other instance.
     * @param {MeshPhongMaterial} other the source of copied data
     */
    copy(other: MeshPhongMaterial_2<T>): this;
    /**
     * Return a cloned instance of this class.
     */
    clone(): MeshPhongMaterial_2<T>;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Change the uv data by this matrix.
     */
    _uvTransform: Readonly<Pick<ReadonlyMarked<Matrix3>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "getNumberCount" | "toArray" | "elements" | "applyToBufferAttribute" | "determinant" | "transposeIntoArray" | "applyToArray" | "applyInverse" | "decompose">>;
    get uvTransform(): ReadonlyMatrix3;
    set uvTransform(v: ReadonlyMatrix3);
}

declare type MeshPhongMaterialParameters<T extends Texture2D | TextureV2 = Texture2D> = MaterialParameters & ConvertMaterialParameters<Pick<MeshPhongMaterial_2<T>, 'color' | 'specular' | 'opacity' | 'opacityTex' | 'shininess' | 'specularStrength' | 'uvTransform'>> & {
    texture?: T | null;
};

declare interface Metadata {
    boxMin: Readonly<Vector3>;
    boxSizeMagnitude: number;
    vertexGridSize: number;
    vertexConstant: Readonly<Vector3>;
}

declare type MipLevelSource = TypeArray;

declare interface MutableSerializerableRaw {
    getSerializeData(): any;
    setSerializeData(value: any): void;
}

declare type NotPickedBySubType<T, U> = Omit<T, keyof PickedBySubType<T, U>>;

declare type Nullable<T> = T | null;

/**
 * This class is a base class of every objects which can be added into scene tree for the 3d rendering.
 * As a basic class, it has implemented event listening and serialization for every objects of scene.
 * Each object has position, rotation and scale attribute to represent the spatial transform in a 3D coordinate.
 */
export declare class Object3D extends ElementEventDispatcher implements SerializerableDelegatedAsReference {
    /**
     * Every objects in 3D space must have a default up direction.
     * @defaultValue `Vector3(0, 1, 0)`
     */
    static DefaultUp: Vector3;
    /**
     * Unique number for each object3D instance.
     */
    id: number;
    /**
     * Reserved attribute
     */
    categoryId: string;
    /**
     * Record the object rendered as instance or other type.
     */
    sourceType: string;
    /**
     * The scene which this object belong to.
     */
    scene: Nullable<Scene3D>;
    /**
     * The number is the frame id which this object is changed or participates change of scene graph.
     * If this value equals to frame id - 1,
     * @defaultValue `-1` means no change happen
     */
    updateDirtyId: number;
    /**
     * The name of this object, it is empty if useless.
     */
    name: string;
    /**
     * Used to check type of this or extended instance.
     * This value should not be changed by user.
     */
    isObject3D: boolean;
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * Object's parent node in the scene graph. An object can have at most one parent.
     */
    parent: Nullable<Object3D>;
    /**
     * Array with object's children.
     * @remarks See {@link Group| Group } for information on manually grouping objects.
     */
    children: Object3D[];
    /**
     * This is used by the lookAt method, for example, to determine the orientation of the result.
     * Default is {@link Object3D.DefaultUp| DefaultUp }.
     */
    up: Vector3;
    /**
     * Record when this object's world matrix last updated.
     */
    worldMatrixUpdateTimestamp: number;
    /**
     * Record whether the object's any {@link attribute| attribute } is updated.
     */
    transformChanged: boolean;
    visibleChanged: boolean;
    /**
     * The global transform of the object. If the Object3D has no parent, then it's identical to the local transform matrix.
     */
    matrixWorld: Matrix4;
    /**
     * When this is set, it calculates the matrixWorld in that frame and resets this property to false.
     * @defaultValue `false`
     */
    matrixWorldNeedsUpdate: boolean;
    private _netLayer;
    private _netInteractionLayer;
    /**
     * The layer membership of the object. The object is only visible if it has at least one layer in common with the Camera in use.
     */
    private _layer;
    get layers(): Layers;
    set layers(v: Layers);
    private onLayerChange;
    private _interactionLayers?;
    get interactionLayers(): Layers | undefined;
    set interactionLayers(v: Layers | undefined);
    private onInteractionLayerChange;
    private _netGroupLayer?;
    private _groupLayer?;
    get groupLayer(): Layers | undefined;
    set groupLayer(v: Layers | undefined);
    private groupLayersListener;
    private updateGroupLayer;
    /**
     * Record if the object is really visible in rendering process. If the Object3D has no parent, it would be set by {@link visible| visible };
     */
    netVisibility: boolean;
    /**
     * When this is set, it calculates the model matrix in that frame and resets this property to false.
     * @defaultValue `false`
     */
    localMatrixNeedUpdate: boolean;
    private worldMatrixUpdateId;
    private _visible;
    private _position;
    private _rotation;
    private _scale;
    private _quaternion;
    protected _matrix: Matrix4;
    constructor();
    destroy(): void;
    freeGPU(): void;
    syncData(): void;
    /**
     * A {@link Vector3| vector } representing the object's local position.
     */
    set position(_position: Vector3);
    get position(): Vector3;
    /**
     * Object's local rotation, in radians.
     */
    set rotation(rotation: Euler);
    get rotation(): Euler;
    /**
     * Object's local rotation as a Quaternion.
     * @remarks See {@link Quaternion| Quaternion} for more details.
     */
    set quaternion(_quaternion: Quaternion);
    get quaternion(): Quaternion;
    /**
     * The object's local scale.
     * @defaultValue `Vector3( 1, 1, 1 )`
     */
    set scale(_scale: Vector3);
    get scale(): Vector3;
    /**
     * The local transform {@link Matrix4| matrix}.
     */
    get matrix(): Matrix4;
    set matrix(value: Matrix4);
    /**
     * Object gets rendered if true.
     * @defaultValue `true`
     */
    get visible(): boolean;
    set visible(value: boolean);
    /**
     * Scene will check the object's visibility in each render and make change {@link netVisibility| netVisibility }
     * based on its and parent's {@link visible| visible }.
     */
    updateVisibility(): boolean;
    /**
     * Set marks of change to false include {@link attributeChanged| attribute }, {@link transformChanged| transform } and {@link visibleChanged| visible }.
     */
    clearChangeMark(): void;
    /**
     * If the local matrix is changed, use this method to manually refresh data in scene graph.
     * @tips It's better to use {@link notifySceneChange| notifySceneChange() } as an alternative.
     */
    setMatrixUpdated(): void;
    /**
     * Use this method to manually refresh data in scene graph and draw again.
     * The engine may not notify every change of the scene.
     * If any effect is not changed with the parameters, use this may solve.
     */
    notifySceneChange(): void;
    /**
     * If the local matrix or world matrix is changed, use this method to make engine refresh data in scene graph automatically.
     * This method will set {@link matrixWorldNeedsUpdate| matrixWorldNeedsUpdate } and {@link localMatrixNeedUpdate| localMatrixNeedUpdate } to true.
     */
    setMatrixDirty(): void;
    /**
     * Change {@link matrixWorldNeedsUpdate| matrixWorldNeedsUpdate } and {@link worldMatrixUpdateTimestamp| worldMatrixUpdateTimestamp } state.
     * This method will refresh data of world matrix by {@link updateMatrixWorld| updateMatrixWorld }
     * @param {number} updateID This number is used to identify the render.
     */
    updateWorldRenderData(updateID: number): boolean;
    /**
     * If there are zero or two negative numbers in xyz, return false, otherwise return true.
     */
    isFlipped(): boolean;
    /**
     * Converts the vector from local space to world space.
     * @param {Vector3} vector A vector represents a position in local (object) coordinate.
     */
    localToWorld(vector: Vector3): Vector3;
    /**
     * Updates the vector from world space to local space.
     * @param {Vector3} vector A vector in world coordinate.
     */
    worldToLocal(vector: Vector3): Vector3;
    /**
     * Applies the matrix transform to the object and updates the object's position, rotation and scale.
     * @param {Matrix4} matrix A matrix represents the information of transform.
     */
    applyMatrix(matrix: Matrix4): void;
    /**
     * Applies the rotation represented by the quaternion to the object.
     * @param {Quaternion} q A Quaternion represents the information of rotation.
     */
    applyQuaternion(q: Quaternion): this;
    /**
     * Calls {@link Quaternion.setFromAxisAngle| setFromAxisAngle }( axis, angle ) on the Quaternion.
     * @param {Vector3} axis A normalized vector in object space.
     * @param {number} angle Angle in radians.
     */
    setRotationFromAxisAngle(axis: Vector3, angle: number): void;
    /**
     * Calls {@link Quaternion.setRotationFromEuler| setRotationFromEuler }(euler, true) on the Quaternion.
     * @param {Euler} euler Euler angle specifying rotation amount.
     */
    setRotationFromEuler(euler: Euler): void;
    /**
     * Calls {@link Quaternion.setFromRotationMatrix| setFromRotationMatrix }(m) on the Quaternion.
     * @param {Matrix4} m Euler angle specifying rotation amount.
     */
    setRotationFromMatrix(m: Matrix4): void;
    /**
     * Copy the given quaternion to object's {@link Object3D.quaternion | quaternion }.
     * @param {Quaternion} q Euler angle specifying rotation amount.
     */
    setRotationFromQuaternion(q: Quaternion): void;
    /**
     * Rotate an object along an axis in object space. The axis is assumed to be normalized.
     * @param {Vector3} axis A normalized vector in object space.
     * @param {number} angle Angle in radians.
     */
    rotateOnAxis(axis: Vector3, angle: number): this;
    /**
     * Rotate an object along an axis in world space. The axis is assumed to be normalized. Method Assumes no rotated parent.
     * @param {Vector3} axis A normalized vector in object space.
     * @param {number} angle Angle in radians.
     */
    rotateOnWorldAxis(axis: Vector3, angle: number): this;
    /**
     * Rotates the object around x axis in local space.
     * @param {number} angle The angle to rotate in radians.
     */
    rotateX(angle: number): this;
    /**
     * Rotates the object around x axis in local space.
     * @param {number} angle The angle to rotate in radians.
     */
    rotateY(angle: number): this;
    /**
     * Rotates the object around x axis in local space.
     * @param {number} angle The angle to rotate in radians.
     */
    rotateZ(angle: number): this;
    /**
     * Translate an object by distance along an axis in object space. The axis is assumed to be normalized.
     * @param {Vector3} axis A normalized vector in object space.
     * @param {number} distance The distance to translate.
     */
    translateOnAxis(axis: Vector3, distance: number): this;
    /**
     * Translates object along x axis in object space by distance units.
     * @param {number} distance The distance to translate.
     */
    translateX(distance: number): this;
    /**
     * Translates object along y axis in object space by distance units.
     * @param {number} distance The distance to translate.
     */
    translateY(distance: number): this;
    /**
     * Translates object along z axis in object space by distance units.
     * @param {number} distance The distance to translate.
     */
    translateZ(distance: number): this;
    /**
     * Rotates the object to face to a point in world space.
     * This method does not support objects having non-uniformly-scaled parent(s)
     * @param {Vector3} _x A vector representing position of target in world space.
     */
    lookAt(_x: Vector3): void;
    /**
     * Rotates the object to face a point in local space.
     * @param {Vector3} _x A vector representing position of target in local space.
     */
    lookAtLocalPoint(_x: Vector3): void;
    /**
     * Adds object as child of this object.
     * An arbitrary number of objects may be added. Any current parent on an object passed in here will be removed, since an object can have at most one parent.
     * The scene graph change will be immediately notify by engine after adding nodes.
     * @param {Object3D | Object3D[]} o Parameter can be one object or objects array, all of them is added to this object.
     */
    add(o: Object3D | Object3D[]): this;
    /**
     * Remove the specified object form children.
     * @param {Object3D} object The object which needs to be removed.
     */
    remove(object: Object3D): this;
    removeFromParent(): void;
    /**
     * Remove all children of this object.
     */
    removeAllChildren(): Object3D[];
    /**
     * Remove all children in specified objects from this objects.
     * Migrate from tools common
     * @param {Object3D[]} objects An array of objects which need to be removed.
     */
    removeObjects(objects: Object3D[]): this;
    /**
     * Searches through an object and its children, starting with the object itself, and returns the first with a matching id.
     * Note that ids are assigned in chronological order: 1, 2, 3, ..., incrementing by one for each new object.
     * @param {number} id Unique number of the object instance.
     */
    getObjectById(id: number): Object3D;
    /**
     * Searches through an object and its children, starting with the object itself, and returns the first with a matching name.
     * Note that for most objects the name is an empty string by default. You will have to set it manually to make use of this method.
     * @param {string} name String to match to the children's Object3D.name property.
     */
    getObjectByName(name: string): Object3D;
    /**
     * Searches through an object and its children, starting with the object itself, and returns the first with a property that matches the value given.
     * @param {string} name The property name to search for.
     * @param {any} value Value of the given property.
     */
    getObjectByProperty(name: string, value: any): Object3D;
    /**
     * Return a vector representing the position of the object in world space.
     * @param {string} target the result will be copied into this Vector3.
     */
    getWorldPosition(target: Vector3): Vector3;
    /**
     * Return a quaternion representing the rotation of the object in world space.
     * @param {string} target the result will be copied into this Quaternion.
     */
    getWorldQuaternion(target: Quaternion): Quaternion;
    /**
     * Return a vector of the scaling factors applied to the object for each axis in world space.
     * @param {string} target the result will be copied into this Vector3.
     */
    getWorldScale(target: Vector3): Vector3;
    /**
     * Return a vector representing the direction of object's positive z-axis in world space.
     * @param {string} target the result will be copied into this Vector3.
     */
    getWorldDirection(target: Vector3): Vector3;
    /**
     * Execute the callback on this object and all descendants.
     * @param {function} callback A function with as first argument an object3D object.
     */
    traverse(callback: (object: Object3D) => any | false): void;
    /**
     * Execute the callback when return is false, stop traverse the object's descendants.
     * @param {function} callback A function with as first argument an object3D object, return boolean.
     */
    traverseWithChildrenSkip(callback: (object: Object3D) => boolean): void;
    /**
     * Execute the callback on this object and all descendants which is visible.
     * @param {function} callback A function with as first argument an object3D object.
     */
    traverseVisible(callback: (object: Object3D) => any): void;
    /**
     * Execute the callback on this object and all ancestors.
     * @param {function} callback A function with as first argument an object3D object.
     */
    traverseAncestors(callback: (object: Object3D) => any): void;
    /**
     * Update the matrix local transform.
     */
    updateMatrix(): void;
    /**
     * Update the object's and its descendants' matrix of global transform with.
     * If the parameter or {@link Object3D.matrixWorldNeedsUpdate| matrixWorldNeedsUpdate } is true, matrix will not skip updates.
     * @param {boolean} force Whether or not force to updates the matrix.
     */
    updateMatrixWorld(force?: boolean): void;
    /**
     * Update the object's and its descendants' matrix of global transform with. will update parent or children according to the parameters
     * @param updateParents update parents.
     * @param updateChildren update children.
     * @param force Whether or not force to updates the matrix.
     */
    updateWorldMatrix(updateParents: boolean, updateChildren: boolean, force?: boolean): void;
    /**
     * Get the whole bounding box of current object cover all children's.
     * @param {Box3} localBox If this is not undefined, result will be stored to it.
     */
    getLocalBounds(localBox?: Box3): Box3;
    /**
     * Get UUID of this object instance.
     * This value is automatically assigned, so this shouldn't be edited.
     */
    getUUID(): string;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx this parameter has not supported external Serializer yet.
     * It may cause that this method can not be used directly.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx this parameter has not supported external Deserializer yet.
     * It may cause that this method can not be used directly.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Return a cloned instance of this class and optionally all descendants.
     * @param {boolean} recursive if true, descendants of the object are also cloned. Default is true.
     */
    clone(recursive?: boolean): Object3D;
    /**
     * Copy the data to this object from source.
     * This method need override in derived classes to copy extended data.
     * @param {Object3D} source the data source.
     * @param {boolean} recursive if true, descendants of the object are also cloned. Default is true.
     */
    copy(source: Object3D, recursive?: boolean): this;
    protected onSelfAttachingScene(scene: Scene3D): void;
    protected onSelfDetachingScene(scene: Scene3D): void;
}

declare class ObjectStatsInfo {
    geometries: number;
    textures: number;
    calls: number;
    vertices: number;
    faces: number;
    programs: number;
    callsByObjectCategoryId: Map<string, number>;
    callsBySourceType: Map<string, number>;
    enableDrawcallClassify: boolean;
    addDrawcall(object: Object3D): void;
    reset(): void;
}

declare const OnXRViewChanged: EventType<Viewport[]>;

/**
 * The orthographic camera class, which has no "bigger when it's closer, small when it's far" effect.
 * Size will not be affected by the distance.
 */
export declare class OrthographicCamera extends Camera3D {
    /**
     * Check the type whether it belongs to OrthographicCamera.
     * This value should not be changed by user.
     */
    isOrthographicCamera: boolean;
    /**
     * The name of instance's class.
     */
    className(): string;
    private _zoom;
    /**
     * Scale width and height of view frustum.
     */
    get zoom(): number;
    set zoom(v: number);
    protected _left: number;
    /**
     * Distance from projective plane center to left side.
     */
    get left(): number;
    set left(v: number);
    protected _right: number;
    /**
     * Distance from projective plane center to right side.
     */
    get right(): number;
    set right(v: number);
    /**
     * Distance from projective plane center to top side.
     */
    protected _top: number;
    get top(): number;
    set top(v: number);
    /**
     * Distance from projective plane center to bottom side.
     */
    protected _bottom: number;
    get bottom(): number;
    set bottom(v: number);
    /**
     * Distance from camera position to near plane of view frustum.
     */
    private _near;
    get near(): number;
    set near(v: number);
    /**
     * Distance from camera position to far plane of view frustum.
     */
    private _far;
    get far(): number;
    set far(v: number);
    /**
     * Frustum window specification or null.
     * This is set using the {@link setViewOffset| setViewOffset } method and cleared using {@link clearViewOffset| clearViewOffset }.
     */
    view: Nullable<CameraView>;
    constructor(left?: number, right?: number, top?: number, bottom?: number, near?: number, far?: number);
    /**
     * Copy the data to this camera instance from source.
     * This method need override in derived classes to copy extended data.
     * @param {OrthographicCamera} source the data source.
     * @param {boolean} recursive if true, descendants of the object are also cloned. Default is true.
     */
    copy(source: OrthographicCamera, recursive?: boolean): this;
    /**
     * @remarks See {@link PerspectiveCamera.setViewOffset | PerspectiveCamera } for more details.
     */
    setViewOffset(fullWidth: number, fullHeight: number, x: number, y: number, width: number, height: number): void;
    /**
     * Removes any offset set by the {@link setViewOffset | setViewOffset } method.
     */
    clearViewOffset(): void;
    /**
     * Updates the camera's {@link projectionMatrix | projectionMatrix } and {@link projectionMatrixInverse | projectionMatrixInverse }.
     * When user change the attribute such as far, top ...,
     * this method will have to be called for the changes to take effect.
     * @param { Object } jitter if jitters need to be applied on this camera, this parameter need to be given.
     */
    updateProjectionMatrix(jitter?: {
        offset: Vector2;
        canvas_size: Vector2;
    }): void;
    /**
     * The tangent value of camera frustum's vertical angle.
     */
    getPixelsOfDistOne(): number;
    /**
     * Calculate how many screen pixel match one world unit at given distance.
     * @param {number} distance the distance from camera to object.
     * @param {number} viewHeight the hight of view window.
     */
    pixelsPerUnit(_: number, viewHeight: number): number;
    /**
     * Set the origin and direction for ray.
     * @param {Ray} ray the calculate result will be set to this.
     * @param {Vector2} coords the position of window where the ray through out.
     */
    castRay(ray: Ray, coords: Vector2): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Return a cloned instance of this instance.
     */
    clone(recursive?: boolean): OrthographicCamera;
}

/**
 * Visual outline mode applied to a drawable.
 * @deprecated use `OutlineRenderMode` and `OutlineRenderMode` pair instead
 */
declare enum OutlineMode {
    Disabled = 0,// render origin style in outline
    Outlined = 1,// render outline style in outline
    Solid = 2,// render in solid background color in outline with solid background mode
    Exclude = 3
}

declare class OutlinePlugin extends PipelinePlugin {
    readonly PLUGIN_NAME = "outline";
    private OUTLINE_DEPTH_ENABLE;
    private highQuality;
    private enableDepth;
    private outlineMaskEnabled;
    private encoder;
    private computeMaterial;
    private outlineMaskDispatcher;
    private composeMaterial;
    constructor(scene: SceneAdaptorDispatcher, renderer: RendererAdaptor);
    destroy(): void;
    private width;
    private height;
    updateFrameSize(width: number, height: number): void;
    updateEffect(): void;
    updateGraphHash(hasher: HashKeyBuilder): void;
    notifyChanged(): void;
    private drivenCullingMaterial;
    private drivenShadingMaterial;
    updateRenderGraph(graph: RenderGraph, context: PipelineContext, depthPyramid: RenderTargetNode): void;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        useMrt: {
            get: () => boolean;
            set: (_: boolean) => void;
        };
        fixMergedPhongEncode: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        highQuality: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        enableDepth: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        outlineMaskEnabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        outlineColor: {
            get: () => Color;
            set: (v: Color) => void;
        };
        edgeThickness: {
            get: () => number;
            set: (v: number) => void;
        };
        indexEdgeThickness: {
            get: () => number;
            set: (v: number) => void;
        };
        normalEdgeThickness: {
            get: () => number;
            set: (v: number) => void;
        };
        depthEdgeThickness: {
            get: () => number;
            set: (v: number) => void;
        };
        coefficient: {
            get: () => number;
            set: (v: number) => void;
        };
        indexCoefficient: {
            get: () => number;
            set: (v: number) => void;
        };
        normalCoefficient: {
            get: () => number;
            set: (v: number) => void;
        };
        depthCoefficient: {
            get: () => number;
            set: (v: number) => void;
        };
    };
}

/**
 * Controls whether a drawable participates in outline rendering.
 */
declare enum OutlineRenderMode {
    Default = 0,// in outline render, and create outline
    DisableOutline = 1,// in outline render, and not create outline
    Overlay = 2
}

/**
 * Controls how a drawable is shaded during outline rendering.
 */
declare enum OutlineShadingMode {
    Default = 0,// shading in pipeline type
    Normal = 1
}

declare class OverlayScenePlugin extends PipelinePlugin {
    readonly PLUGIN_NAME = "overlay_scene";
    private dispatcher;
    protected _enabled: boolean;
    destroy(): void;
    updateFrameSize(): void;
    updateEffect(): void;
    updateGraphHash(_hasher: HashKeyBuilder): void;
    updateRenderGraph(graph: RenderGraph): void;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
    };
}

declare interface OverrideScreenOutputTarget {
    target: RenderTarget;
    resolveTarget?: RenderTarget;
}

declare interface ParseConfig {
    enableParseMesh: boolean;
    enableParsePointCloud: boolean;
}

declare function parseDracoBuffer(buffer: ArrayBuffer, config?: Partial<ParseConfig>): Promise<IDracoGeometry>;

declare interface ParseExtras {
    maxShDegree: number;
    maxTextureSize: number;
    lodLevel: number;
    includeOtherFormats: boolean;
}

/** Return valid raw octree data whose bounds, depth and offsets match its buffer. */
declare type ParseLodVoxelFn = (url: string, signal: AbortSignal) => LodVoxelData | Promise<LodVoxelData>;

declare interface ParseResult {
    source: GLTF;
    scene: Object3D;
    scenes: Object3D[];
    animations: Animation_2_2[];
    skeletons: Map<ISkeleton, SkinnedMesh[]>;
    componentMap: Map<Object3D, Object3D>;
}

declare function parseSplatData(type: SplatFileType, input: Uint8Array | string | File | {
    stream: ReadableStream<Uint8Array>;
    contentLength: number;
}, packType?: SplatPackType, extras?: Partial<ParseExtras>): Promise<SplatData>;

declare interface PassExecuteCtx {
    renderer: RendererAdaptor;
    target?: RenderTarget;
    resolveTarget?: RenderTarget;
    overrideScreenOutputTarget?: OverrideScreenOutputTarget;
}

/**
 * render processing class, as a render pass, can customize uniform、target and renderMethod
 * normal pass: beforeHook -> bindTarget -> configRenderPass -> renderer.beginPass(composer) -> execute -> renderer.endPass(composer) -> afterHook
 * custom pass(when customPassMethod configured): beforeHook -> execute -> afterHook
 */
declare class PassNode extends ExecuteNode<PassExecuteCtx> {
    target: RenderTargetNode;
    resolveTarget?: RenderTargetNode;
    dependResources: Set<ResourceNode>;
    private writeTargetLevel;
    writeLevel(level: number): this;
    private writeTargetBuffers?;
    writeBuffers(buffers?: number[]): this;
    private dispatcher;
    useDispatcher(d: MaterialDispatcher | undefined): this;
    private clearColor;
    setClearColor(c: Vector4): this;
    private isColorClearEnabled;
    private isDepthClearEnabled;
    enableClear(color?: boolean, depth?: boolean): this;
    disableClear(): this;
    private clearConfig;
    setClearConfig(isClear: () => boolean): this;
    private _needResolveContent;
    private _needResolveDepth;
    private _needGenerateMipmap;
    resolveTo(resolveTarget?: RenderTargetNode, resolveDepth?: boolean, generateMipmap?: boolean): this;
    resolveToScreen(resolveDepth?: boolean, generateMipmap?: boolean): void;
    get needResolveContent(): boolean;
    get needResolveDepth(): boolean;
    get needGenerateMipmap(): boolean;
    drivenMaterial?: DrivenMaterial;
    useDriven(material?: DrivenMaterial): this;
    private _needStoreOutput;
    /**
     * whether discard attachments.
     * for webgpu set storeOp to 'discard' in begin render pass
     * for webgl will call invalidateFramebuffer.
     */
    discardOutput(): this;
    get needStoreOutput(): boolean;
    private renderMethods;
    private configMethods;
    private inputs;
    private resources;
    private customPassMethod;
    get isCustomPass(): boolean;
    input(key: string, dependNode: RenderTargetNode, attachment?: AttachmentDescriptor): this;
    modify(fn: (node: PassNode) => void): this;
    updateResource(getResource: (node: ResourceNode) => Texture): void;
    clear(): this;
    use(source: RenderSource | RenderMethod): this;
    customPass(source: CustomPassMethod): this;
    render(source: RenderMethod): this;
    config(source: ConfigMethod): this;
    useIf(shouldRender: () => boolean, source: RenderSource | RenderMethod): this;
    useIfAndDisableClear(shouldRender: () => boolean, source: RenderSource | RenderMethod): this;
    draw(renderable: () => Renderable): this;
    bindTarget(ctx: PassExecuteCtx): void;
    /**
     * setup clear or other render pass configs.
     * @returns whether current pass can be merged into previous pass.
     */
    configRenderPass(ctx: PassExecuteCtx): boolean;
    execute(ctx: PassExecuteCtx): void;
    check(): boolean;
}

declare interface PBRMetallicRoughness extends IBase {
    baseColorFactor?: [number, number, number, number];
    baseColorTexture?: ITextureInfo;
    metallicFactor?: number;
    roughnessFactor?: number;
    metallicRoughnessTexture?: ITextureInfo;
}

/**
 * Camera that uses perspective projection.
 * This projection mode is designed to mimic the way the human eye sees.
 * It is the most common projection mode used for rendering a 3D scene.
 */
export declare class PerspectiveCamera extends Camera3D {
    /**
     * Check the type whether it belongs to PerspectiveCamera.
     * This value should not be changed by user.
     */
    readonly isPerspectiveCamera = true;
    private _isTwoPointPerspectiveViewEnabled;
    /**
     * This effect can elongate models when camera looks up or down.
     */
    get isTwoPointPerspectiveViewEnabled(): boolean;
    set isTwoPointPerspectiveViewEnabled(v: boolean);
    /**
     * Update the camera's {@link Object3D.matrixWorld| matrixWorld } and {@link matrixWorldInverse| matrixWorldInverse }.
     * @param {boolean} force Whether or not force to updates the matrix.
     */
    updateMatrixWorld(force?: boolean): void;
    private _fov;
    /**
     * Camera frustum vertical field of view, from bottom to top of view, in degrees.
     */
    get fov(): number;
    set fov(v: number);
    private _zoom;
    /**
     * Scale width and height of view frustum.
     */
    get zoom(): number;
    set zoom(v: number);
    private _near;
    /**
     * Distance from camera position to small plane of view frustum.
     */
    get near(): number;
    set near(v: number);
    private _far;
    /**
     * Distance from camera position to big plane of view frustum.
     */
    get far(): number;
    set far(v: number);
    private _focus;
    /**
     * Object distance used for stereoscopy and depth-of-field effects.
     * @defaultValue `10`.
     */
    get focus(): number;
    set focus(v: number);
    private _aspect;
    /**
     * Full screen width divided by its height in case of more view, this value equals to fov when there was only one viewer.
     */
    get aspect(): number;
    set aspect(v: number);
    /**
     * Frustum window specification or null.
     * This is set using the {@link setViewOffset| setViewOffset } method and cleared using {@link clearViewOffset| clearViewOffset }.
     */
    view: Nullable<CameraView>;
    /**
     * Film size used for the larger axis. Default is 35 (millimeters).
     * This parameter does not influence the projection matrix unless {@link filmOffset| filmOffset } is set to a nonzero value.
     */
    filmGauge: number;
    /**
     * Horizontal off-center offset in the same unit as {@link filmGauge| filmGauge }.
     * @defaultValue `0`.
     */
    filmOffset: number;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    /**
     * Copy the data to this camera instance from source.
     * This method need override in derived classes to copy extended data.
     * @param {PerspectiveCamera} source the data source.
     * @param {boolean} recursive if true, descendants of the object are also cloned. Default is true.
     */
    copy(source: PerspectiveCamera, recursive?: boolean): this;
    /**
     * The tangent value of camera frustum's vertical angle.
     */
    getPixelsOfDistOne(): number;
    /**
     * As name says
     */
    getDistanceWhenEachWorldUnitMatchScreenUnit(viewHeight: number): number;
    /**
     * Calculate how many screen pixel match one world unit at given distance.
     * @param {number} distance the distance from camera to object.
     * @param {number} viewHeight the hight of view window.
     */
    pixelsPerUnit(distance: number, viewHeight: number): number;
    /**
     * Set the origin and direction for ray.
     * @param {Ray} ray the calculate result will be set to this.
     * @param {Vector2} coords the position of window where the ray through out.
     */
    castRay(ray: Ray, coords: Vector2): void;
    /**
     * Sets the FOV by focal length in respect to the current {@link filmGauge | filmGauge }.
     * Values for focal length and film gauge must have the same unit.
     * @defaultValue The default film gauge is 35, so that the focal length can be specified for a 35mm (full frame) camera.
     */
    setFocalLength(focalLength: number): void;
    /**
     * Calculates the focal length from the current {@link fov | fov } and {@link filmGauge | filmGauge }.
     */
    getFocalLength(): number;
    /**
     * Returns the current vertical field of view angle in degrees considering {@link zoom | zoom }.
     */
    getEffectiveFOV(): number;
    /**
     * Returns the width of the image on the film. If .aspect is greater than or equal to one (landscape format), the result equals {@link filmGauge | filmGauge }.
     */
    getFilmWidth(): number;
    /**
     * Returns the height of the image on the film. If .aspect is less than or equal to one (portrait format), the result equals {@link filmGauge | filmGauge }.
     */
    getFilmHeight(): number;
    /**
     * Sets an offset in a larger frustum. This is useful for multi-window or multi-monitor/multi-machine setups.
     * For example, if you have 3x2 monitors and each monitor is 1920x1080 and the monitors are in grid like this: <br />
     * +---+---+---+ <br />
     * | A | B | C | <br />
     * +---+---+---+ <br />
     * | D | E | F | <br />
     * +---+---+---+ <br />
     * then for each monitor you would call it like this:
     * `
     * let w = 1920;
     * let h = 1080;
     * let fullWidth = w * 3;
     * let fullHeight = h * 2;
     *  // A
     * camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
     *  // B
     * camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
     *  // C
     * camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
     *  // D
     * camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
     *  // E
     * camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
     *  // F
     * camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
     * `
     * @tips there is no reason monitors have to be the same size or in a grid.
     * @param {number} fullWidth full width of multi-view setup.
     * @param {number} fullHeight full height of multi-view setup.
     * @param {number} x horizontal offset of sub-camera.
     * @param {number} y vertical offset of sub-camera.
     * @param {number} width width of sub-camera.
     * @param {number} height height of sub-camera.
     */
    setViewOffset(fullWidth: number, fullHeight: number, x: number, y: number, width: number, height: number): void;
    /**
     * Removes any offset set by the {@link setViewOffset | setViewOffset } method.
     */
    clearViewOffset(): void;
    /**
     * Updates the camera's {@link projectionMatrix | projectionMatrix } and {@link projectionMatrixInverse | projectionMatrixInverse }.
     * When user change the attribute such as far, top ...,
     * this method will have to be called for the changes to take effect.
     * @param { Object } jitter if jitters need to be applied on this camera, this parameter need to be given.
     */
    updateProjectionMatrix(jitter?: {
        offset: Vector2;
        canvas_size: Vector2;
    }): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Return a cloned instance of this instance.
     */
    clone(recursive?: boolean): PerspectiveCamera;
}

declare type PickedBySubType<T, U> = Pick<T, PickSubTypeProperty<T, U>>;

declare class Picker {
    readonly raycaster: Raycaster;
    private viewer;
    constructor(viewer: Viewer);
    private intersectObject;
    pick(coordinates: Vector2, camera: Camera3D, pickFirst?: boolean, objects?: Drawable[]): Intersection[];
    pickFirst(camera: Camera3D, objects?: Drawable[]): Intersection[];
}

declare type PickReadonly<T extends ReadOnlyMarkedCreatable<T>, K extends keyof T> = Readonly<Pick<ReadonlyMarked<T>, K | '_readonly_mark' | 'cloneReadonly' | 'clone'>>;

declare type PickSubTypeProperty<T, U> = {
    [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

declare interface PipelineConfig {
    MSAA: {
        enabled: ConfigCell_2<boolean>;
    };
    SceneClip: ReturnType<SceneClipPlugin['createConfig']>;
    AO: ReturnType<AOPlugin['createConfig']>;
    Background: ReturnType<BackgroundPlugin['createConfig']>;
    Splatting: ReturnType<SplattingPlugin['createConfig']>;
    Deferred: ReturnType<DeferredPlugin['createConfig']>;
    Forward: ReturnType<ForwardPlugin['createConfig']>;
    TransparentLine: ReturnType<TransparentLinePlugin['createConfig']>;
    Outline: ReturnType<OutlinePlugin['createConfig']>;
    Highlight: ReturnType<HighlightPlugin['createConfig']>;
    ShadowMap: ReturnType<ShadowMapPlugin['createConfig']>;
    Stylize: ReturnType<StylizePlugin['createConfig']>;
    TAA: ReturnType<TAAPlugin['createConfig']>;
    Composite: ReturnType<CompositePlugin['createConfig']>;
    Debug: ReturnType<DebugPlugin['createConfig']>;
}

declare interface PipelineContext {
    renderingConfig: RenderingConfig;
    drivenCullingConfig: DrivenCullingConfig;
}

declare abstract class PipelinePlugin {
    protected readonly scene: SceneAdaptorDispatcher;
    protected readonly renderer: RendererAdaptor;
    protected readonly IS_SUPPORT_DEPTH_TEXTURE: boolean;
    protected get IS_WEBGL2(): boolean;
    protected get IS_WEBGPU(): boolean;
    protected get IS_ADVANCED_BACKEND(): boolean;
    abstract readonly PLUGIN_NAME: string;
    get envSupported(): boolean;
    protected _enabled: boolean;
    get enabled(): boolean;
    set enabled(v: boolean);
    get shouldRender(): boolean;
    constructor(scene: SceneAdaptorDispatcher, renderer: RendererAdaptor);
    abstract destroy(): void;
    abstract updateFrameSize(width: number, height: number): void;
    abstract updateEffect(scene: SceneAdaptor, isFrameStable: boolean, isCameraStable: boolean, effectConfig: IEffectConfig): void;
    abstract updateGraphHash(hasher: HashKeyBuilder): void;
    abstract updateRenderGraph(graph: RenderGraph, context: PipelineContext, depthPyramid: RenderTargetNode): void;
    abstract createConfig(): ConfigCellObject;
}

/**
 * A two dimensional surface that extends infinitely in 3d space,
 * represented in {@link http://mathworld.wolfram.com/HessianNormalForm.html| Hessian normal form} by a unit length normal vector and a constant.
 */
export declare class Plane {
    /**
     * (optional) a unit length vector3 defining the normal of the plane.
     * @defaultValue `(1, 0, 0)`.
     */
    normal: Vector3;
    /**
     * (optional) the signed distance from the origin to the plane.
     * @defaultValue `0`.
     */
    constant: number;
    constructor(normal?: Vector3, constant?: number);
    /**
     * Sets this plane's {@link normal| normal} and {@link constant| constant} properties by copying the values from the given normal.
     * @param normal a unit length {@link Vector3| Vector3} defining the normal of the plane.
     * @param constant the signed distance from the origin to the plane.
     * @defaultValue `0`.
     */
    set(normal: Vector3, constant: number): Plane;
    /**
     * Set the individual components that define the plane.
     * @param x x value of the unit length normal vector.
     * @param y y value of the unit length normal vector.
     * @param z z value of the unit length normal vector.
     * @param w the value of the plane's {@link constant| constant} property.
     */
    setComponents(x: number, y: number, z: number, w: number): Plane;
    /**
     * Sets the plane's properties as defined by a {@link Vector3| normal} and an arbitrary coplanar {@link Vector3| point}.
     * @param normal a unit length {@link Vector3| Vector3} defining the normal of the plane.
     * @param point {@link Vector3| Vector3}.
     */
    setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane;
    /**
     * Defines the plane based on the 3 provided points.
     * The winding order is assumed to be counter-clockwise, and determines the direction of the {@link normal| normal}.
     * @param a first point on the plane.
     * @param b second point on the plane.
     * @param c third point on the plane.
     */
    setFromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): Plane;
    /**
     * Returns a new plane with the same {@link normal| normal} and {@link constant| constant} as this one.
     */
    clone(): Plane;
    /**
     * Copies the values of the passed plane's {@link normal| normal} and {@link constant| constant} properties to this plane.
     */
    copy(plane: Plane): Plane;
    /**
     * Normalizes the {@link normal| normal} vector, and adjusts the {@link constant| constant} value accordingly.
     */
    normalize(): Plane;
    /**
     * Negates both the normal vector and the constant.
     */
    negate(): Plane;
    /**
     * Returns the signed distance from the {@link Vector3| point} to the plane.
     */
    distanceToPoint(point: Vector3): number;
    /**
     * Returns the signed distance from the {@link Sphere| sphere} to the plane.
     */
    distanceToSphere(sphere: Sphere): number;
    /**
     * Projects a {@link Vector3| point} onto the plane.
     * @param point the {@link Vector3| Vector3} to project onto the plane.
     * @param target the result will be copied into this Vector3.
     */
    projectPoint(point: Vector3, target: Vector3): Vector3;
    /**
     * Returns the intersection point of the passed line and the plane. Returns null
     * if the line does not intersect. Returns the line's starting point if the line is coplanar with the plane.
     * @param line the {@link Line3| Line3} to check for intersection.
     * @param target the result will be copied into this Vector3.
     */
    intersectLine(line: Line3, target: Vector3): Nullable<Vector3>;
    /**
     * Tests whether a line segment intersects with (passes through) the plane.
     * @param line the {@link Line3| Line3} to check for intersection.
     */
    intersectsLine(line: Line3): boolean;
    /**
     * Determines whether or not this plane intersects {@link Box3| box}.
     * @param box the {@link Box3| Box3} to check for intersection.
     */
    intersectsBox(box: Box3): boolean;
    /**
     * Determines whether or not this plane intersects {@link Sphere| sphere}.
     * @param sphere the {@link Sphere| Sphere} to check for intersection.
     */
    intersectsSphere(sphere: Sphere): boolean;
    /**
     * By calculating the projection of the normal vector at the origin onto the plane.
     * @return a {@link Vector3| Vector3} coplanar to the plane,
     * @param target the result will be copied into this Vector3.
     */
    coplanarPoint(target: Vector3): Vector3;
    /**
     * Apply a Matrix4 to the plane. The matrix must be an affine, homogeneous transform.
     * If supplying an {@link Matrix3| optionalNormalMatrix}, it can be created like so:
     * <code>
     * const optionalNormalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );
     * </code>
     * @param matrix the Matrix4 to apply.
     * @param optionalNormalMatrix (optional) pre-computed normal [Page:Matrix3] of the Matrix4 being applied.
     */
    applyMatrix4(matrix: Matrix4, optionalNormalMatrix?: Matrix3): Plane;
    /**
     * Translates the plane by the distance defined by the {@link Vector3| offset} vector.
     * @param offset the amount to move the plane by.
     * @tips that this only affects the plane constant and will not affect the normal vector.
     */
    translate(offset: Vector3): Plane;
    /**
     * Checks to see if two planes are equal (their {@link normal| normal} and {@link .constant| constant} properties match).
     */
    equals(plane: Plane): boolean;
}

declare class PlyFile implements IFile {
    private littleEndian;
    private comments;
    private elements;
    private isSuperSplatCompressed;
    private counts;
    private shDegree;
    private initHeader;
    read(stream: ReadableStream<Uint8Array>, _contentLength: number, data: IData): Promise<void>;
    write(stream: WritableStream<Uint8Array>, data: IData): Promise<void>;
}

/**
 * A light that gets emitted from a single point in all directions.
 * A common use case for this is to replicate the light emitted from a bare lightbulb.
 */
export declare class PointLight<T extends TextureV2 | Texture2D = Texture2D> extends Light {
    viewMatrix: Matrix4;
    invViewMatrix: Matrix4;
    /**
     * When distance is zero, light does not attenuate.
     * When distance is non-zero, light will attenuate linearly from maximum intensity at the light's position down to zero at this distance from the light.
     */
    distance: number;
    isIESEnabled: boolean;
    /**
     * The amount the light dims along the distance of the light
     * In physically correct mode, decay = 2 leads to physically realistic light falloff.
     * @defaultValue `1` representing the intensity do not decay with distance increasing.
     */
    decay: number;
    /**
     * Check the type whether it belongs to PerspectiveCamera.
     * This value should not be changed by user.
     */
    isPointLight: boolean;
    private uniforms;
    /**
     * Use this attribute to set the shadow's config.
     * @remarks See example '3d shadow' for more details.
     */
    shadow: PointShadow<T>;
    isShadowNeedsUpdate: boolean;
    private _textureIES_inner;
    protected _textureIES: T;
    get textureIES(): Nullable<T>;
    set textureIES(value: Nullable<T>);
    /**
     * The intensity scale of IES file.
     * @defaultValue `1`
     */
    iesIntensityScale: number;
    /**
     * Resolution of ies texture.
     * @defaultValue `Vector2(182, 1)`
     */
    iesTextureResolution: Vector2;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(color?: number | string, intensity?: number, distance?: number, decay?: number, isIESEnabled?: boolean, textureIES?: T, iesIntensityScale?: number, iesTextureResolution?: Vector2);
    /**
     * The light's power.
     * In physically correct mode, the luminous power of the light measured in lumens.
     * This is directly related to the {@link intensity | intensity } in the ratio
     */
    get power(): number;
    set power(power: number);
    getIntensity(): number;
    /**
     * Copy the data to this light instance from source.
     * This method need override in derived classes to copy extended data.
     * @param {PointLight} source the data source.
     * @param {boolean} recursive if true, descendants of the object are also cloned. Default is true.
     */
    copy(source: PointLight<T>, recursive?: boolean): this;
    clone(recursive?: boolean): PointLight<T>;
    updateUniformForDefer(program: WGLProgram): void;
    updateUniformByPrefix(program: WGLProgram, lightPrefix: string, shadowPrefix: string): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    static getHeader(isArray: boolean): "\n                uniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n                uniform sampler2D pointIES[ NUM_POINT_LIGHTS ];\n            " | "\n                uniform PointLight pointLight;\n                uniform sampler2D pointLightIES;\n            ";
    destroy(): void;
    getIESMapOrDefault(): Texture2D | T;
}

/**
 * Topology marker for point-list buffer geometry.
 */
declare class PointList implements Topology {
    __topologyTypeMark: PrimitiveTopology.Point;
    __pl: boolean;
}

/**
 * This class is used to draw all vertexes of geometry as a series of independent points.
 * It supports any type of geometry, but only PointsMaterial is supported.
 */
export declare class Points<M extends Material = Material> extends Drawable<M, BufferGeometry<PointList>> {
    className(): string;
    type: string;
    /**
     * Check the type whether it belongs to Points.
     */
    isPoints: boolean;
    /**
     * Decisive attribute to draw this object as continuous line.
     */
    drawMode: DrawMode;
    constructor(geometry?: BufferGeometry<PointList>, material?: M | M[]);
    /**
     * Get intersections between a casted {@link Ray| ray} and this point,
     * all points whose distance from ray less than {@link Raycaster.pointThreshold| threshold} will be push into intersects.<br />
     * The method {@link Raycaster.intersectObject| intersectObject()} will call this method.
     * @param {Raycaster} raycaster the instance of Raycaster is used to get the data for calculation.
     * @param {Intersection} intersects the result will be stored here.
     */
    raycastJsImpl(raycaster: Raycaster, intersects: Intersection[]): void;
    /**
     * Return a clone of this object.
     */
    clone(recursive?: boolean): Points<M>;
}

declare class PointShadow<T extends TextureV2 | Texture2D = Texture2D> extends Shadow<RenderAttachment> {
    enableAutoBias: boolean;
    private captureScale;
    updateMapUniform(program: WGLProgram, mapName: string): void;
    updateUniformsImpl(program: WGLProgram, prefix: string): void;
    getMapOrDefault(): RenderAttachment;
    camera: CubeCamera;
    customNear: number;
    customFar: number;
    constructor(light: PointLight<T>);
    className(): string;
    copy(other: PointShadow<T>): void;
    extendsShader(builder: ShaderBuilder, length: number): void;
    extendsShaderDeferred(builder: ShaderBuilder): void;
    updateCamera(light: Light): void;
    deserialize(ctx: Deserializer): void;
    serialize(ctx: Serializer): void;
}

/**
 * This material is specified used to change performance of {@link Points | Points }
 */
export declare class PointsMaterial extends Material {
    constructor(p?: PointsMaterialParameters);
    setValues(values?: PointsMaterialParameters): void;
    /**
     * @deprecated will not work.
     */
    size: number;
    color: ColorWithAlpha;
    enableSizeAttenuation: boolean;
    enableVertexColor: boolean;
    className(): string;
    extendShaderShape(builder: ShaderBuilder, _: ShaderComponentRegistry): void;
    computeShapeKey(_: ShaderComponentRegistry): string;
    updateShapeUniforms(p: WGLProgram, _: ShaderComponentRegistry): void;
    extendShaderShading(b: ShaderBuilder, _: ShaderComponentRegistry): void;
    generateShaderKey(r: ShaderComponentRegistry): string;
    updateShadingUniforms(p: WGLProgram, _: ShaderComponentRegistry): void;
    copy(other: PointsMaterial): this;
    clone(): PointsMaterial;
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void;
}

declare type PointsMaterialParameters = MaterialParameters & ColorWithAlphaParam & ConvertMaterialParameters<Pick<PointsMaterial, 'size' | 'enableSizeAttenuation'>>;

/**
 * This is a dedicated geometry for {@link PopMesh| PopMesh }.
 */
declare class PopBufferGeometry extends BufferGeometry {
    /**
     * Used to check type of this or extended instance.
     * This value should not be changed by user.
     */
    isPopBufferGeometry: boolean;
    /**
     * The attributes data which are stored into an object.
     * It is better to change this by {@link setModel| setModel }.
     */
    model: IPopbufferInfo;
    /**
     * An item of vertex array.
     */
    metadata: Metadata;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(model?: IPopbufferInfo);
    /**
     * Return the name of specific group.
     * @param groupIndex the index of model.blocks.
     */
    getGroupNameByGroupIndex(groupIndex: number): string | undefined;
    /**
     * Return the name of the group which the specific vertex belongs to.
     * @param index the index of checked vertex.
     */
    getGroupNameByVertexIndex(index: number): string | undefined;
    /**
     * Change the attribute data and {@link model| model }.
     * @param model the given model data.
     */
    setModel(model?: IPopbufferInfo): void;
    /**
     * As the name shown.
     */
    updateBufferAttributeFromModelData(): void;
    private computeMetadata;
    /**
     * Copy the data to this object from source.
     * @param { PopBufferGeometry } source the data source.
     */
    copy(source: this): PopBufferGeometry;
    /**
     * Return a clone of this object.
     */
    clone(): PopBufferGeometry;
}

/**
 * This is a spacial mesh to draw content in one WebGL Drawcall.
 */
declare class PopMesh extends Mesh<MeshPhongMaterial_2, PopBufferGeometry> {
    /**
     * Check the type whether it belongs to PopMesh.
     */
    readonly isPopMesh = true;
    /**
     * The type of this instance.
     */
    readonly type = "PopMesh";
    /**
     * Record the LOD level of last update.
     */
    oldLevelFactor: number;
    /**
     * Record the frame id of last updating LOD level.
     */
    LODUpdateId: number;
    /**
     * a unique key of the Mesh. When this Mesh is merged, this key will be update.
     */
    popMergeCacheKey: Nullable<string>;
    /**
     * Switch of LOD.
     */
    isLODEnabled: boolean;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(geometry: PopBufferGeometry, material: MeshPhongMaterial_2[]);
    /**
     * This is an override method to update render data for optimization.
     * This method is used to assign data from {@link geometry| geometry } and {@link material| material } to
     * {@link renderGeometry| renderGeometry } and {@link renderMaterial| renderMaterial }.
     */
    updateRenderEntity(): void;
    /**
     * Create a clone of this instance.
     */
    clone(): PopMesh;
}

declare class PopShaderComponent extends ShaderComponent {
    className(): string;
    extendShaderShading(_builder: ShaderBuilder): void;
    extendShaderShape(builder: ShaderBuilder): void;
    computeShapeKey(): string;
    copy(_: PopShaderComponent): this;
    clone(): PopShaderComponent;
    serialize(_ctx: Serializer<any>): void;
    deserialize(_ctx: Deserializer): void | Promise<void>;
}

declare class PostPipeline {
    private depthPyramid;
    private effectComposer;
    _getEffectComposer(): EffectComposer;
    sceneClipPlugin: SceneClipPlugin;
    shadowMapPlugin: ShadowMapPlugin;
    backgroundPlugin: BackgroundPlugin;
    splattingPlugin: SplattingPlugin;
    deferredPlugin: DeferredPlugin;
    transparentLinePlugin: TransparentLinePlugin;
    forwardPlugin: ForwardPlugin;
    stylizePlugin: StylizePlugin;
    aoPlugin: AOPlugin;
    outlinePlugin: OutlinePlugin;
    overlayScene: OverlayScenePlugin;
    highlightPlugin: HighlightPlugin;
    taaPlugin: TAAPlugin;
    compositePlugin: CompositePlugin;
    debugPlugin: DebugPlugin;
    private _cachedPlugins?;
    private get plugins();
    constructor(rendererAdaptor: RendererAdaptor);
    mapPlugins(callback: (plugin: PipelinePlugin) => void): void;
    updateRenderer(renderer: IRenderer): void;
    resetContentCache(): void;
    setFrameSize(width: number, height: number): void;
    updateEffect(scene: SceneAdaptor, isFrameStable: boolean, isCameraStable: boolean, renderingConfig: RenderingConfig, drivenCullingConfig: DrivenCullingConfig): void;
    private shouldRenderCurrentFrameByHZB;
    private shouldRenderNextFrameByHZB;
    shouldRenderFrame(): boolean;
    shouldRenderNextFrame(): boolean;
    render(sceneAdaptor: SceneAdaptor, renderingConfig: RenderingConfig, drivenCullingConfig: DrivenCullingConfig): void;
    renderSnapshot(scene: SceneAdaptor, target: OverrideScreenOutputTarget, renderingConfig: RenderingConfig, drivenCullingConfig: DrivenCullingConfig): void;
    private graphCaches;
    private volatileGraphCaches;
    private genHZBMaterial;
    private createRenderGraph;
    destroy(): void;
}

/**
 * Preset snapshot renderer configurations.
 */
declare enum PresetRenderConfig {
    Default = "default",
    Tool_2D = "tool_2d",// only use in bim or yunDesign tool 2d view
    Tool_2D_Depth = "tool_2d_depth"
}

declare type primitive = boolean | number | undefined | null | string;

declare interface PrimitiveBuffers {
    count: number;
    indices: Uint32Array;
    centers: Float32Array;
    boxMins: Float32Array;
    boxMaxs: Float32Array;
}

declare enum PrimitiveMode {
    POINTS = 0,
    LINES = 1,
    LINE_LOOP = 2,
    LINE_STRIP = 3,
    TRIANGLES = 4,
    TRIANGLE_STRIP = 5,
    TRIANGLE_FAN = 6
}

declare enum PrimitiveTopology {
    Point = 0,
    Line = 1,
    LineStrip = 2,
    Triangle = 3,
    TriangleStrip = 4
}

declare class ProgramManager {
    private info;
    static PROGRAM_DELETE_TIMEOUT: number;
    uboManager: UBOManager;
    private renderState;
    private programs;
    private cacheMap;
    private deletingMap;
    private currentTimeStamp;
    get activeShaderComponentRegistry(): ShaderComponentRegistry;
    constructor(renderState: RenderState, info: RenderInfo);
    tick(timestamp: number): void;
    get(material: Material): WGLProgram;
    delete: (material: Material) => void;
    freeGPU(): void;
}

declare class ProjectedDrawcallList implements Renderable {
    readonly list: DrawableList;
    opaque: Drawcall[];
    transparent: Drawcall[];
    private camera;
    extraDrawcallList: Map<number, Drawcall[]>;
    constructor(list: DrawableList, opaque: Drawcall[], transparent: Drawcall[], camera: Camera3D);
    useOnce: boolean;
    private destroyed;
    destroy(): void;
    private renderObjects;
    config(_: IRenderer): boolean;
    getRenderListLength(type: RenderObjectsType): number;
    render(renderer: IRenderer, renderObjectsType?: RenderObjectsType, filter?: IPipelineFilter<Drawcall>): void;
    filterBy(f: () => IPipelineFilter<Drawcall>): FilteredDrawcallList;
}

declare class PropertyMixer {
    readonly buffer: number[];
    private stride;
    private cumulativeWeight;
    private cumulativeWeightAdditive;
    private mixer;
    constructor(target: Object3D | Material, property: TrackPath['propertyName'], stride: number);
    update(blend: Blend, weight: number, accuIndex: number): void;
    apply(accuIndex: number): void;
}

/**
 * Implementation of a {@link http://en.wikipedia.org/wiki/Quaternion| quaternion}.
 * Quaternions are used to represent {@link https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation| rotations}.
 */
export declare class Quaternion {
    private _x;
    private _y;
    private _z;
    private _w;
    /**
     * Check the type whether it belongs to Matrix3.
     * This value should not be changed by user.
     */
    isQuaternion: boolean;
    constructor(x?: number, y?: number, z?: number, w?: number);
    /**
     * The function will be called when {@link _x| x}, {@link _y| y} {@link _z| z} and {@link _w| w} is changed.
     */
    onChangeCallback(): void;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get w(): number;
    set w(value: number);
    /**
     * Handles the spherical linear interpolation between quaternions.
     * t represents the amount of rotation between this quaternion (where t is 0) and qb (where t is 1).
     * This quaternion is set to the result. Also see the static version of the `slerp` below.
     * <pre>
     * // rotate a mesh towards a target quaternion
     * mesh.quaternion.slerp( endQuaternion, 0.01 );
     * </pre>
     * @param qb The other quaternion rotation.
     * @param t interpolation factor in the closed interval [0, 1].
     */
    static slerp(qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number): Quaternion;
    /**
     * Like the static {@link slerp| slerp} method above, but operates directly on flat arrays of numbers.
     * @param dst The output array.
     * @param dstOffset An offset into the output array.
     * @param src0 The source array of the starting quaternion.
     * @param srcOffset0 An offset into the array `src0`.
     * @param src1 The source array of the target quaternions.
     * @param srcOffset1 An offset into the array `src1`.
     * @param t Normalized interpolation factor (between 0 and 1).
     */
    static slerpFlat(dst: number[], dstOffset: number, src0: number[], srcOffset0: number, src1: number[], srcOffset1: number, t: number): void;
    /**
     * Sets {@link x| x}, {@link y| y}, {@link z| z}, {@link w| w} properties of this quaternion.
     */
    set(x: number, y: number, z: number, w: number): Quaternion;
    /**
     * Creates a new Quaternion with identical {@link x| x}, {@link y| y},{@link z| z} and {@link w| w} properties to this one.
     */
    clone(): Quaternion;
    /**
     * Copies the {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} properties of {@link Quaternion| q} into this quaternion.
     */
    copy(quaternion: Quaternion): Quaternion;
    /**
     * Sets this quaternion from the rotation specified by {@link Euler| Euler} angle.
     */
    setFromEuler(euler: Euler, update?: boolean): Quaternion;
    /**
     * Sets this quaternion from rotation specified by {@link Vector3| axis} and {@link Float| angle}.
     * Adapted from the method {@link http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm| here}.
     * @param Axis is assumed to be normalized.
     * @param angle is in radians.
     */
    setFromAxisAngle(axis: Vector3, angle: number): Quaternion;
    /**
     * Sets this quaternion from rotation component of {@link Matrix4| m}.
     * Adapted from the method {@link http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm| here}.
     * @param m a {@link Matrix4| Matrix4} of which the upper 3x3 of matrix is a pure {@link https://en.wikipedia.org/wiki/Rotation_matrix| rotation matrix}.
     */
    setFromRotationMatrix(m: Matrix4): Quaternion;
    /**
     * Sets this quaternion to the rotation required to rotate direction vector {@link Vector3| vFrom} to direction vector {@link Vector3| vTo}.
     * Adapted from the method {@link http://lolengine.net/blog/2013/09/18/beautiful-maths-quaternion-from-vectors| here}.
     * {@link Vector3| vFrom} and {@link Vector3| vTo} are assumed to be normalized.
     */
    setFromUnitVectors(vFrom: Vector3, vTo: Vector3): Quaternion;
    /**
     * Returns the rotational conjugate of this quaternion. The conjugate of a quaternion
     * represents the same rotation in the opposite direction about the rotational axis.
     */
    conjugate(): Quaternion;
    /**
     * Calculates the {@link https://en.wikipedia.org/wiki/Dot_product| dot product} of quaternions {@link Quaternion| v} and this one.
     */
    dot(v: Quaternion): number;
    /**
     * Computes the squared {@link https://en.wikipedia.org/wiki/Euclidean_distance| Euclidean length}
     * (straight-line length) of this quaternion, considered as a 4 dimensional vector.
     * This can be useful if you are comparing the lengths of two quaternions,
     * as this is a slightly more efficient calculation than {@link length| length}().
     */
    lengthSq(): number;
    /**
     * Computes the Euclidean length (straight-line length) of this quaternion, considered as a 4 dimensional vector.
     */
    length(): number;
    /**
     * Normalizes this quaternion - that is, calculated the quaternion that performs the same rotation as this one,
     * but has {@link length| length} equal to `1`.
     */
    normalize(): Quaternion;
    /**
     * Multiplies this quaternion by {@link Quaternion| q}.
     */
    multiply(q: Quaternion): Quaternion;
    /**
     * Pre-multiplies this quaternion by {@link Quaternion| q}.
     */
    premultiply(q: Quaternion): Quaternion;
    /**
     * Sets this quaternion to {@link Quaternion| a} x {@link Quaternion| b}.
     * Adapted from the method outlined {@link http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm| here}.
     */
    multiplyQuaternions(a: Quaternion, b: Quaternion): Quaternion;
    /**
     * Handles the spherical linear interpolation between quaternions. t represents the
     * amount of rotation between this quaternion (where t is 0) and {@link Quaternion| qb} (where t is 1).
     * This quaternion is set to the result.
     * Also see the static version of the method {@link slerp| slerp}.
     * <pre>
     * // rotate a mesh towards a target quaternion
     * mesh.quaternion.slerp( endQuaternion, 0.01 );
     * </pre>
     * @param qb The other quaternion rotation.
     * @param t interpolation factor in the closed interval [0, 1].
     */
    slerp(qb: Quaternion, t: number): Quaternion;
    /**
     * Compares the {@link x| x}, {@link y| y},{@link z| z} and {@link w| w} properties of
     * {@link Quaternion| v} to the equivalent properties of this quaternion to determine if they represent the same rotation.
     * @param v Quaternion that this quaternion will be compared to.
     */
    equals(quaternion: Quaternion): boolean;
    /**
     * Sets this quaternion's {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} properties from an array.
     * @param array array of format (x, y, z, w) used to construct the quaternion.
     * @param offset (optional) an offset into the array.
     */
    fromArray(array: ArrayLike<number>, offset?: number): Quaternion;
    /**
     * Returns the numerical elements of this quaternion in an array of format [x, y, z, w].
     * @param array An optional array to store the quaternion. If not specified, a new array will be created.
     * @param offset (optional) if specified, the result will be copied into this array.
     */
    toArray(array?: number[], offset?: number): number[];
    /**
     * A method to call {@link onChangeCallback| onChangeCallback}.
     */
    onChange(callback: Function): Quaternion;
}

declare class RawSplatData extends SplatData {
    counts: number;
    shDegree: number;
    private shCounts;
    private table;
    init(counts: number, shDegree: number): void;
    set(i: number, single: ISingleSplat): void;
    setCenter(i: number, x: number, y: number, z: number): void;
    setScale(i: number, sx: number, sy: number, sz: number): void;
    setQuat(i: number, qx: number, qy: number, qz: number, qw: number): void;
    setColor(i: number, r: number, g: number, b: number): void;
    setAlpha(i: number, a: number): void;
    setShN(i: number, shN: number[]): void;
    get(i: number, single: ISingleSplat): void;
    getCenter(i: number, single: ISingleSplat): void;
    getScale(i: number, single: ISingleSplat): void;
    getQuat(i: number, single: ISingleSplat): void;
    getColor(i: number, single: ISingleSplat): void;
    getAlpha(i: number, single: ISingleSplat): void;
    getShN(i: number, shN: number[]): void;
    fillCenters(centers: Float32Array): void;
    serialize(): ISplatData;
    deserialize(data: ISplatData): void;
}

/**
 * A ray that emits from an origin in a certain direction. This is used by the
 * {@link Raycaster| Raycaster} to assist with {@link https://en.wikipedia.org/wiki/Ray_casting| ray casting}.
 * Raycaster is used for mouse picking (working out what objects in the 3D space the mouse is over) amongst other things.
 */
export declare class Ray {
    /**
     * The origin of the {@link Ray| Ray}.
     * @defaultValue is a {@link Vector3| Vector3} at `(0, 0, 0)`.
     */
    origin: Vector3;
    /**
     * The direction of the {@link Ray| Ray}.
     * This must be normalized (with {@link Vector3.normalize| Vector3.normalize}) for the methods to operate properly.
     * @defaultValue is a {@link Vector3| Vector3} at `(0, 0, -1)`.
     */
    direction: Vector3;
    constructor(origin?: Vector3, direction?: Vector3);
    /**
     * This must be normalized (with {@link Vector3.normalize| Vector3.normalize}) for the methods to operate properly.
     * Sets this ray's {@link .origin| origin} and {@link .direction| direction} properties by copying the values from the given objects.
     * @param origin the {@link origin| origin} of the {@link Ray| Ray}.
     * @param origin the {@link direction| direction} of the {@link Ray| Ray}.
     */
    set(origin: Vector3, direction: Vector3): Ray;
    /**
     * Creates a new Ray with identical {@link origin| origin} and {@link direction| direction} to this one.
     */
    clone(): Ray;
    /**
     * Copies the {@link origin| origin} and {@link direction| direction} properties of {@link Ray| ray} into this ray.
     */
    copy(ray: Ray): Ray;
    /**
     * Get a {@link Vector3| Vector3} that is a given distance along this {@link Ray| Ray}.
     * @param t the distance along the {@link Ray| Ray} to retrieve a position for.
     * @param target the result will be copied into this Vector3.
     */
    at(t: number, target: Vector3): Vector3;
    /**
     * Adjusts the direction of the ray to point at the vector in world coordinates.
     * @param v The {@link Vector3| Vector3} to look at.
     */
    lookAt(v: Vector3): Ray;
    /**
     * Shift the origin of this {@link Ray| Ray} along its direction by the distance given.
     * @param t The distance along the {@link Ray| Ray} to interpolate.
     */
    recast(t: number): Ray;
    /**
     * Get the point along this {@link Ray| Ray} that is closest to the {@link Vector3| Vector3} provided.
     * @param point the point to get the closest approach to.
     * @param target the result will be copied into this Vector3.
     */
    closestPointToPoint(point: Vector3, target: Vector3): Vector3;
    /**
     * Get the distance of the closest approach between the {@link Ray| Ray} and the {@link Vector3| point}.
     * @param point {@link Vector3| Vector3} The {@link Vector3| Vector3} to compute a distance to.
     */
    distanceToPoint(point: Vector3): number;
    /**
     * Get the squared distance of the closest approach between the {@link Ray| Ray} and the {@link Vector3| Vector3}.
     * @param point the {@link Vector3| Vector3} to compute a distance to.
     */
    distanceSqToPoint(point: Vector3): number;
    /**
     * Get the squared distance between this {@link Ray| Ray} and a line segment.
     * @param v0 the start of the line segment.
     * @param v1 the end of the line segment.
     * @param optionalPointOnRay (optional) if this is provided, it receives the point on this {@link Ray| Ray} that is closest to the segment.
     * @param optionalPointOnSegment - (optional) if this is provided, it receives the point on the line segment that is closest to this {@link Ray| Ray}.
     */
    distanceSqToSegment(v0: Vector3, v1: Vector3, optionalPointOnRay?: Vector3, optionalPointOnSegment?: Vector3): number;
    /**
     * Intersect this {@link Ray| Ray} with a {@link Sphere| Sphere}, returning the intersection point or `null` if there is no intersection.
     * @param sphere the {@link Sphere| Sphere} to intersect with.
     * @param target the result will be copied into this Vector3.
     */
    intersectSphere(sphere: Sphere, target: Vector3): Nullable<Vector3>;
    /**
     * Calculate the maximum distance between origin and one or two intersections if this ray through the sphere.
     */
    intersectSphereMaxDistance(sphere: Sphere): number;
    /**
     * Calculate the length, which is the distance projected on the ray from given point to origin.
     */
    directionDistance(point: Vector3): number;
    /**
     * Return true if this {@link Ray| Ray} intersects with the {@link Sphere| Sphere}.
     * @param sphere the {@link Sphere| Sphere} to intersect with
     */
    intersectsSphere(sphere: Sphere): boolean;
    /**
     * Get the distance from {@link origin| origin} to the {@link Plane| Plane}, or *null* if the {@link Ray| Ray} doesn't intersect the {@link Plane| Plane}.
     * @param plane the {@link Plane| Plane} to get the distance to.
     */
    distanceToPlane(plane: Plane): Nullable<number>;
    /**
     * Intersect this {@link Ray| Ray} with a {@link Plane| Plane}, returning the intersection point or `null` if there is no intersection.
     * @param plane the {@link Plane| Plane} to intersect with.
     * @param target the result will be copied into this Vector3.
     */
    intersectPlane(plane: Plane, target: Vector3): Nullable<Vector3>;
    /**
     * Return true if this {@link Ray| Ray} intersects with the {@link Plane| Plane}.
     * @param plane the {@link Plane| Plane} to intersect with.
     */
    intersectsPlane(plane: Plane): boolean;
    /**
     * Intersect this {@link Ray| Ray} with a {@link Box3| Box3}, returning the intersection point or `null` if there is no intersection.
     * @param box the {@link Box3| Box3} to intersect with.
     * @param target the result will be copied into this Vector3.
     */
    intersectBox(box: Box3, target?: Vector3): Nullable<Vector3>;
    /**
     * Return true if this {@link Ray| Ray} intersects with the {@link Box3| Box3}.
     * @param box the {@link Box3| Box3} to intersect with.
     */
    intersectsBox(box: Box3): boolean;
    /**
     * Transform this {@link Ray| Ray} by the {@link Matrix4| Matrix4}.
     * @param matrix4 the {@link Matrix4| Matrix4} to apply to this {@link Ray| Ray}.
     */
    applyMatrix4(matrix4: Matrix4): Ray;
    /**
     * Returns true if this and the other {@link Ray| ray} have equal {@link origin| origin} and {@link direction| direction}.
     * @param ray the {@link Ray| Ray} to compare to.
     */
    equals(ray: Ray): boolean;
    /**
     * Intersect this {@link Ray| Ray} with a triangle, returning the intersection point or `null` if there is no intersection.
     * @param abc The {@link Vector3| Vector3} points making up the triangle.
     * @param backfaceCulling whether to use backface culling
     * @param target the result will be copied into this Vector3.
     */
    intersectTriangle(a: Vector3, b: Vector3, c: Vector3, backfaceCulling: boolean, target: Vector3): Nullable<Vector3>;
}

/**
 * This class is designed to assist with raycasting.
 * Raycasting is used for mouse picking (working out what objects in the 3d space the mouse is over) amongst other things.
 */
export declare class Raycaster {
    /**
     * The Ray used for the raycasting.
     */
    ray: Ray;
    /**
     * The near factor of the raycaster.
     * This value indicates which objects can be discarded based on the distance.
     * This value shouldn't be negative and should be smaller than the far property.
     */
    near: number;
    /**
     * The far factor of the raycaster.
     * This value indicates which objects can be discarded based on the distance.
     * This value shouldn't be negative and should be larger than the near property.
     */
    far: number;
    /**
     * The precision factor of the raycaster when intersecting Line objects.
     */
    linePrecision: number;
    /**
     * The distance threshold to check a point's intersection.
     */
    pointThreshold: number;
    layers: Layers;
    /**
     * Accept some difference when picked point do not locate on the line or points
     */
    enableScreenSpaceTolerance: boolean;
    _camera: Nullable<Camera3D>;
    _viewHeight: number;
    constructor(origin?: Vector3, direction?: Vector3, near?: number, far?: number);
    /**
     * Set {@link ray| ray}, {@link near| near} and {@link far| far} by given origin and direction.
     * @param origin The origin vector where the ray casts from.
     * @param direction The normalized direction vector that gives direction to the ray.
     */
    set(origin: Vector3, direction: Vector3): void;
    /**
     * Set {@link ray| ray} by given camera's {@link Camera3D.castRay| castRay}.
     * @param coords the position of window where the ray through out.
     * @param camera used to decide a way of casting the ray.
     * @param {number} viewHeight the hight of view window.
     */
    setFromCamera(coords: Vector2, camera: Camera3D, viewHeight?: number): void;
    /**
     * Calculating intersection for given object, return this object if the ray intersect with it.
     * @param recursive put children of given object into calculation together.
     * @param intersects if given, the result will be store here.
     */
    intersectObject(object: Object3D, recursive: boolean, intersects?: Intersection[]): Intersection[];
    /**
     * Calculating intersection for array of objects, return the objects which the ray intersect with.
     * @param recursive put children of objects into calculation together.
     * @param intersects if given, the result will be store here.
     */
    intersectObjects(objects: Object3D[], recursive: boolean, intersects?: Intersection[]): Intersection[];
    raycastScene(scene: Scene3D, intersects: Intersection[]): Intersection[];
}

/**
 * Readonly view of the public Color API.
 */
export declare type ReadonlyColor = PickReadonly<Color, 'g' | 'r' | 'b' | 'isColor' | 'equals' | 'getHex'>;

declare type ReadonlyMarked<T> = {
    _readonly_mark: unknown;
} & T;

declare interface ReadOnlyMarkedCreatable<T> {
    clone(): T;
    cloneReadonly(): any;
}

/**
 * Readonly view of the public Matrix3 API.
 */
export declare type ReadonlyMatrix3 = PickReadonly<Matrix3, 'elements' | 'equals' | 'applyToBufferAttribute' | 'determinant' | 'transposeIntoArray' | 'applyToArray' | 'applyInverse' | 'getNumberCount' | 'toArray' | 'decompose'>;

/**
 * Readonly view of the public Matrix4 API.
 */
export declare type ReadonlyMatrix4 = PickReadonly<Matrix4, 'elements' | 'equals' | 'applyToBufferAttribute' | 'determinant' | 'extractBasis' | 'applyToArray' | 'getPosition' | 'getMaxScaleOnAxis' | 'decompose' | 'decompose2D' | 'getNumberCount' | 'toArray'>;

declare interface ReadonlySerializerableRaw extends ReadOnlyMarkedCreatable<any>, ReadonlyMarked<any> {
    getSerializeData(): any;
    clone(): MutableSerializerableRaw;
}

/**
 * Readonly view of the public Vector2 API.
 */
export declare type ReadonlyVector2 = PickReadonly<Vector2, 'x' | 'y' | 'width' | 'height' | 'isVector2' | 'dot' | 'cross' | 'lengthSq' | 'length' | 'angle' | 'manhattanLength' | 'distanceTo' | 'distanceToSquared' | 'manhattanDistanceTo' | 'getNumberCount' | 'equals' | 'toArray' | 'intoSize'>;

/**
 * Readonly view of the public Vector3 API.
 */
export declare type ReadonlyVector3 = PickReadonly<Vector3, 'x' | 'y' | 'z' | 'dot' | 'angleTo' | 'lengthSq' | 'length' | 'distanceTo' | 'manhattanLength' | 'distanceToSquared' | 'manhattanDistanceTo' | 'getNumberCount' | 'equals' | 'toArray'>;

/**
 * Readonly view of the public Vector4 API.
 */
export declare type ReadonlyVector4 = PickReadonly<Vector4, 'x' | 'y' | 'z' | 'w' | 'dot' | 'lengthSq' | 'length' | 'manhattanLength' | 'getNumberCount' | 'equals' | 'toArray'>;

/**
 * RectAreaLight emits light uniformly across the face a rectangular plane.
 * This light type can be used to simulate light sources such as bright windows or strip lighting.
 */
declare class RectAreaLight extends AreaLight {
    isRectAreaLight: boolean;
    width: number;
    height: number;
    specularStrength: number;
    private uniforms;
    /**
     * The name of instance's class.
     */
    className(): string;
    /**
     * @param color (optional) hexadecimal color of the light. Default is 0xffffff (white).<br/>
     * @param intensity (optional) the light's intensity, or brightness. Default is 1.<br/>
     * @param width (optional) width of the light. Default is 10.<br/>
     * @param height (optional) height of the light. Default is 10.<br/>
     */
    constructor(color?: number | string, intensity?: number, width?: number, height?: number, specularStrength?: number);
    copy(source: RectAreaLight, recursive?: boolean): this;
    clone(recursive?: boolean): RectAreaLight;
    updateUniformByPrefix(program: WGLProgram, prefix: string): void;
    static getHeader(isArray: boolean): "uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];" | "uniform RectAreaLight rectAreaLight;";
}

declare interface Renderable {
    /**
     * used to update render pass, such as clear.
     * @returns batchable
     */
    config(renderer: IRenderer): boolean;
    /**
     * do render
     */
    render(renderer: IRenderer): void;
}

/**
 * color or depth attachment for render target.
 * Anything affect texture size should be specified at creation, and will be immutable after creation.
 */
declare class RenderAttachment extends TextureV2 {
    constructor(dimension: TextureDimension, viewDimension: TextureViewDimension, format: TextureFormat, width: number, height: number, depthOrArrayLayers: number, mipmaps: boolean, sampleCount: number, forceRenderBuffer: boolean, sampler: SamplerDescriptor);
}

declare abstract class RenderAttachmentNode extends ResourceNode {
    private _width;
    get width(): number;
    private _height;
    get height(): number;
    depthOrArrayLayers: number;
    dimension: TextureViewDimension;
    multiSample: boolean;
    resizeFn: ResizeFN;
    abstract get formatKey(): string;
    updateSize(size: Size_2): void;
}

declare type RenderBufferAttachment = WebGLRenderbuffer[];

declare class RenderColorAttachmentNode extends RenderAttachmentNode {
    format: TextureFormat;
    enableMipmap: boolean;
    sampler: SamplerDescriptor;
    get formatKey(): string;
    constructor(name?: string);
    modify(fn: (node: RenderColorAttachmentNode) => void): this;
    setFilter(linearFilter: boolean, mipmap?: boolean): this;
}

declare interface RenderConfig {
    mode: RenderMode;
    deferred: boolean;
    ao: boolean;
    antialias: 'ssaa' | 'msaa' | 'taa' | 'disable';
    outline: 'default';
    resolutionRatio: number;
    physicalSizeRatio: number;
    background: [number, number];
    light: 'default' | 'scene' | Light[];
    overrideMaterial: Material | undefined;
    ignoreVisible: boolean;
    maxRenderSize: number;
    calcRenderSizeType: 'default' | 'pixel';
    autoPOT: boolean;
    combineDepthAlpha: boolean;
    overrideOutputSize: Size | undefined;
    pipelineConfig: IPipelineConfig_2;
}

declare class RenderDepthAttachmentNode extends RenderAttachmentNode {
    enableTexture: boolean;
    enableStencil: boolean;
    sampler: SamplerDescriptor;
    get formatKey(): string;
    constructor(name?: string);
    modify(fn: (node: RenderDepthAttachmentNode) => void): this;
}

declare class RenderEngine extends EventDispatcher {
    private _enablePhysicalShading;
    get enablePhysicalShading(): boolean;
    set enablePhysicalShading(v: boolean);
    renderer: IRenderer;
    config: EngineInitializeConfig;
    forceFrameIsUnstable: boolean;
    snapshotRenderer: SnapshotRenderer_2;
    deprecatedSnapshotRenderer: SnapshotRenderer;
    lastRenderedFrameId: number;
    private isRefreshRenderables;
    private _renderPixelRatio;
    private lastRestoreTimeStamp;
    private _countOfFailed;
    private _sumOfTime;
    private _restoreFailed;
    private canvasContainer;
    private canvas;
    private requestedSize?;
    constructor(canvasContainer: HTMLElement, config: EngineInitializeConfig);
    get renderParameter(): RendererParameters;
    get width(): number;
    get height(): number;
    get canvasElement(): HTMLCanvasElement;
    set renderPixelRatio(value: number);
    get renderPixelRatio(): number;
    refreshRenderables(): void;
    private toggleWebgpu;
    destroy(): void;
    resize(size?: Size): void;
    render(scene: Scene3D, camera: Camera3D, pipeline: PostPipeline, isCameraChange: boolean, isCameraStable: boolean, renderingConfig: RenderingConfig, drivenCullingConfig: DrivenCullingConfig, viewport?: Vector4, // x, y, width, height
    frameId?: number, forceRender?: boolean): boolean;
    afterRender(): void;
    resetRenderer(canvas?: HTMLCanvasElement, context?: WebGLRenderingContext | WebGL2RenderingContext): void;
    private onCtxLost;
    private onWebGPUUnstable;
    private onWebGPUValidationFailed;
    private checkRestoreCtx;
}

declare class Renderer extends EventDispatcher implements IRenderer {
    parameters: RendererParameters;
    domElement: HTMLCanvasElement;
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    readonly renderInfo: RenderInfo;
    wglState: WGLState;
    renderState: RenderState;
    resourceManager: ResourceManager;
    extensions: WGLExtensions;
    currentWGLProgram: Nullable<WGLProgram>;
    private bufferRenderer;
    private indexedBufferRenderer;
    private _currentScissor;
    private _scissor;
    private _pixelRatio;
    private _currentViewport;
    _viewport: Vector4;
    private _cachedFBO;
    _isContextLost: boolean;
    private ctx_info;
    private _width;
    private _height;
    private _canvas;
    private _scissorTest;
    private _currentGeometryProgram;
    private _destroyed;
    private renderPass;
    private drawFrameBuffer;
    private readFrameBuffer;
    lastUsedMaterial: Nullable<Material>;
    constructor(parameters: RendererParameters);
    getRenderTarget(): void;
    getContext(): WebGLRenderingContext | WebGL2RenderingContext;
    beforeFrameRender(): void;
    afterFrameRender(): void;
    getGPUInfo(): string;
    tick(timestamp: number): void;
    updateRenderStatistics(re: RenderStatistics): void;
    getPixelRatio(): number;
    setPixelRatio(value: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    getSize(): {
        width: number;
        height: number;
    };
    getDrawingBufferSize(): {
        width: number;
        height: number;
    };
    setViewport(x: number, y: number, width: number, height: number): void;
    setViewportInRenderPass(x: number, y: number, width: number, height: number): void;
    setClearColor(color: Color | string | number, alpha?: number): void;
    clear(color?: boolean, depth?: boolean, stencil?: boolean): void;
    getCanvas(): HTMLCanvasElement;
    destroy(forceLost?: boolean): void;
    private manualContextLost;
    forceContextLost(manual?: boolean): void;
    private onContextLost;
    getCurrentCamera(): Camera3D;
    getCurrentDrawable(): Drawable;
    useCamera(camera: Nullable<Camera3D>): void;
    useRegistry(registry: ShaderComponentRegistry): void;
    overrideDispatcher: Nullable<MaterialDispatcher>;
    private useGeometry;
    renderDrawcall(geometry: BufferGeometryBase, material: Material, object: Drawable, range: Nullable<BufferRange>): void;
    renderRenderable(renderable: Renderable): void;
    resetRenderState(): void;
    setMaterialUploadDirty(): void;
    private bindTarget;
    /**
     * do all gl bind stuffs
     * bind Target -> set viewport -> set scissor -> clear
     */
    beginPass(store: boolean, resolveContent: boolean, resolveDepth: boolean, generateMipmap: boolean): void;
    endPass(): void;
    flushCommands(): void;
    setRenderTarget(target?: RenderTarget, resolveTarget?: RenderTarget): void;
    setScissorTest(enable: boolean): void;
    setScissor(x: number, y: number, width: number, height: number): void;
    private checkAndBindTargetForReading;
    readPixels(target: RenderTarget, range: IRange, result: TypeArray): void;
    readPixelsAsync(target: RenderTarget, range: IRange, result: TypeArray): Promise<void>;
    getMemoryInfo(): MemoryInfo;
    releaseUnusedResources(): void;
    queueFlushTexture(texture: Texture): void;
}

declare class RendererAdaptor {
    renderer: IRenderer;
    width: number;
    height: number;
    activeResources: Map<string, Texture>;
    constructor(renderer: IRenderer);
    setSize(width: number, height: number): void;
    setClearColor(color: Vector4): void;
    render(renderable: Renderable): void;
    clear(color: boolean, depth: boolean, stencil?: boolean): void;
    setRenderTarget(target: RenderTarget, resolveTarget?: RenderTarget): void;
    setRenderToScreen(): void;
}

/**
 * Renderer backends.
 */
declare enum RendererBackend {
    WEBGL_JS = "WEBGL_JS",
    WEBGL_WASM = "WEBGL_WASM",
    WEBGL2_JS = "WEBGL2_JS",
    WEBGL2_WASM = "WEBGL2_WASM",
    WEBGPU_WASM = "WEBGPU_WASM"
}

declare type RendererParameters = Required<Pick<WebGLContextAttributes, 'alpha' | 'antialias' | 'depth' | 'powerPreference' | 'premultipliedAlpha' | 'preserveDrawingBuffer' | 'stencil'>> & {
    version: string;
    name: string;
    canvas: HTMLCanvasElement;
    container: HTMLElement;
    context?: WebGLRenderingContext | WebGL2RenderingContext;
    preferWebGL1?: boolean;
    precision?: string;
    logarithmicDepthBuffer?: boolean;
};

declare class RenderGraph {
    private initialized;
    private _isValid;
    get isValid(): boolean;
    private root;
    private nodes;
    private _depthTarget?;
    get depthTarget(): RenderTargetNode | undefined;
    set depthTarget(v: RenderTargetNode | undefined);
    sceneCullingPass?: PassNode;
    dropResources: Array<Set<ResourceNode>>;
    private cachedPassNodes?;
    get passNodes(): PassNode[];
    constructor(root: RenderTargetNode);
    reset(): this;
    private passList;
    addPass(node: PassNode | Array<PassNode | undefined>): void;
    removePass(name: string): PassNode | undefined;
    removeAllPasses(): PassNode[];
    lastValidPass(): PassNode | undefined;
    build(): this;
}

declare type RenderHook = (renderer: Renderer, geometry: GeometryBase, material: Material, object: Drawable, group: Nullable<BufferRange>) => void;

declare class RenderInfo {
    objectInfo: ObjectStatsInfo;
    refreshProgramCount: number;
    refreshMaterialCount: number;
    refreshLightsCount: number;
    resetFrameStart(): void;
}

/**
 * some global rendering config.
 */
declare interface RenderingConfig {
    tlsFlags: number;
    gpuDriven: GpuDrivenConfig;
    MSAA: boolean;
}

declare type RenderMethod = (renderer: RendererAdaptor, target?: RenderTarget, i?: number) => void;

/**
 * Rendering modes supported by the viewer engine.
 */
declare enum RenderMode {
    SHADING = "SHADING",
    OUTLINE_ONLY = "OUTLINE_ONLY",
    OUTLINE_WITH_SHADING = "OUTLINE_WITH_SHADING",
    TRANSPARENT_LINE = "TRANSPARENT_LINE",
    TOON_SHADING = "TOON_SHADING",
    OUTLINE_WITH_TOON = "OUTLINE_WITH_TOON",
    DEPTH = "DEPTH",
    NORMAL = "NORMAL"
}

declare enum RenderObjectsType {
    Default = 0,
    Opaque = 1,
    Transparent = 2,
    OIT = 3,
    AfterOIT = 4
}

declare class RenderProxyManager {
    private scene;
    staticFrameDirtyId: number;
    isProxyChanged: boolean;
    private freeDynamicAnalyser;
    private allRenderables;
    private allFreeRenderables;
    private instancePool;
    private meshMergePool;
    constructor(scene: Scene3D);
    tick(): void;
    private popMerger;
    private _enablePopMeshMerge;
    get enablePopMeshMerge(): boolean;
    set enablePopMeshMerge(value: boolean);
    mergePopMesh(popMesh: PopMesh): Nullable<MergedMeshData>;
    private _enableMeshMerge;
    get enableMeshMerge(): boolean;
    set enableMeshMerge(value: boolean);
    private _enableInstance;
    get enableInstance(): boolean;
    set enableInstance(value: boolean);
    private _enableAutoInstanceKey;
    get enableAutoInstanceKey(): boolean;
    set enableAutoInstanceKey(value: boolean);
    private _enableGpuDriven;
    private _gpuDriveCompressTextureCompression;
    get enableGpuDriven(): boolean;
    set enableGpuDriven(value: boolean);
    onObjectChange(obj: Drawable): void;
    onObjectAdd(obj: Drawable): void;
    onObjectDelete(obj: Drawable): void;
    maintain(): void;
    proxyFree(): void;
    private isCachedDrawableListDirty;
    cleanDrawableListCache(): void;
    private isLastBatchUseProxy;
    private drawableListAllCache?;
    generateDrawableList(isUseProxy: boolean): DrawableList;
    private overlayDrawableListCache?;
    generateOverlayDrawableList(): DrawableList;
    generateDynamicList(camera: Camera3D): ProjectedDrawcallList;
    generateStaticList(camera: Camera3D): ProjectedDrawcallList;
    destroy(): void;
}

declare interface RenderSource {
    /**
     * used to update render pass, such as clear
     */
    config?: ConfigMethod;
    /**
     * do render
     */
    render: RenderMethod;
}

declare class RenderState {
    builtUniforms: BuiltInUniforms;
    activeShaderComponentRegistry: ShaderComponentRegistry;
    resourceManager: ResourceManager;
    state: WGLState;
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    isCameraPositionDirty: boolean;
    isCameraProjectionDirty: boolean;
    isCameraViewProjectionDirty: boolean;
    isViewMatrixDirty: boolean;
    isModelMatrixDirty: boolean;
    isNormalMatrixDirty: boolean;
    isModelViewMatrixDirty: boolean;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, state: WGLState);
    setTexture(texture: Texture, namedSlot?: number): number;
    setupVBOs(bufferGeometry: BufferGeometryBase, program: WGLProgram, needUpdateAttribute?: string[], updateIndex?: boolean): void;
    setupVertexAttributes(bufferGeometry: BufferGeometryBase, program: WGLProgram): void;
    updateGlobalUniforms(program: WGLProgram): void;
    updateDrawable(drawable: Drawable): void;
    updateCamera(camera: Camera3D): void;
    markAllDirty(): void;
    updateResolution(width: number, height: number): void;
    resetFrame(): void;
}

/**
 * Runtime statistics collected from viewer rendering.
 */
declare class RenderStatistics {
    backend: RendererBackend;
    /**
     * The number of WebGL drawcall.
     */
    calls: number;
    /**
     * The number of driven mesh counts.
     */
    drivenDrawcalls: number;
    /**
     * used by frontend custom statistics.
     */
    callsByObjectCategoryId: Map<string, number>;
    /**
     * used by frontend custom statistics.
     */
    callsBySourceType: Map<string, number>;
    /**
     * The number of geometry vertices.
     */
    vertices: number;
    /**
     * The number of driven geometry vertices.
     */
    drivenVertices: number;
    /**
     * The number of geometry faces.
     */
    faces: number;
    /**
     * The number of texture.
     */
    textures: number;
    /**
     * The number of BufferGeometry.
     */
    geometries: number;
    /**
     * The number of shader program.
     */
    programs: number;
    /**
     * The number of frame.
     */
    frames: number;
    /**
     * Record some information of refresh.
     */
    counters: Map<string, number>;
    /**
     * One frame time (CPU + GPU time).
     */
    totalTime: number;
    /**
     * CPU frame time.
     */
    CPUTime: number;
    /**
     * CPU time details.
     */
    timeDetails: Map<string, number>;
    /**
     * The byte length of geometry attributes
     */
    geometryBufferByteSize: number;
    /**
     * The byte length of texture
     */
    textureByteSize: number;
    /**
     * The byte length of UBO
     */
    uboByteSize: number;
    /**
     * The byte length of FBO
     */
    fboByteSize: number;
    /**
     * The byte length of storageBuffer
     */
    storageByteSize: number;
    /**
     * the byte length of storageBuffer used
     */
    storageByteSizeUsed: number;
}

declare class RenderTarget {
    width: number;
    height: number;
    depthOrArrayLayers: number;
    multiSample: boolean;
    colors: RenderAttachment[];
    depth?: RenderAttachment;
    layer: number;
    level: number;
    drawBuffers?: number[];
    constructor(width: number, height: number, depthOrArrayLayers: number, multiSample?: boolean);
    setSize(width: number, height: number, depthOrArrayLayers: number): void;
    setAttachments(colors: RenderAttachment[], depth?: RenderAttachment): void;
    setBindInfo(level: number, buffers?: number[]): void;
    destroy(): void;
}

declare class RenderTargetNode extends DAGNode {
    readonly isScreenNode: boolean;
    width: number;
    height: number;
    depthOrArrayLayers: number;
    multiSample: boolean;
    dimension: TextureViewDimension;
    resizeFn: ResizeFN;
    colorAttachments: RenderColorAttachmentNode[];
    depthAttachment?: RenderDepthAttachmentNode;
    constructor(name: string, isScreenNode?: boolean);
    modify(fn: (node: RenderTargetNode) => void): this;
    keepContent(): this;
    resize(fn: ResizeFN): this;
    enableMultiSample(): this;
    disableStencil(): this;
    setFilter(linearFilter: boolean, mipmap?: boolean, range?: number[]): this;
    attach(node: RenderAttachmentNode, attachIndex?: number): this;
    from(node: PassNode | Array<PassNode | undefined>): this;
    private checkAttachmentNode;
    check(): boolean;
    updateSize(size: Size_2): void;
}

declare type RequestRenderHandler = () => void;

declare type ResizeFN = (size: Size_2) => Size_2;

declare class ResourceManager {
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    private info;
    readonly bufferManager: BufferManager;
    readonly textureManager: TextureManager;
    readonly programManager: ProgramManager;
    readonly instanceProgramManager: ProgramManager;
    readonly dynamicPrograms: Map<string, WGLProgram>;
    readonly uboManager?: UBOManager;
    readonly vaoManager?: VAOManager;
    private geometries;
    constructor(renderer: Renderer);
    outputResourceStatistics(): ResourceStatistics;
    setupGeometry(bufferGeometry: BufferGeometryBase): void;
    setupVAO(bufferGeometry: BufferGeometryBase, attributeKey: string): boolean;
    private onGeometryAttributeChanged;
    private onGeometryDispose;
    getWebGLBufferData(attribute: BufferAttribute): WGLBufferData;
    setupWGLProgram(material: Material, useInstance: boolean): WGLProgram;
    setupWGLUBOBuffer(provider: UniformBlockObject): WebGLBuffer;
    freeGPU(): void;
}

declare abstract class ResourceNode extends DAGNode {
    isKeepContent: boolean;
    keepContent(): this;
}

declare interface ResourceStatistics {
    geometryBufferByteSize: number;
    textureByteSize: number;
    fboByteSize: number;
    uboByteSize: number;
}

declare class SamplerDescriptor {
    static CreateAttachmentSampler(): SamplerDescriptor;
    static CreateDepthAttachmentSampler(): SamplerDescriptor;
    copy(other: SamplerDescriptor): void;
    /**
     * This defines how the texture is wrapped horizontally and corresponds to U in UV mapping.
     * The default is {@link SamplerWrap.ClampToEdgeWrapping | ClampToEdgeWrapping}, where the edge is clamped to the outer edge texel.
     */
    wrapS: SamplerWrap;
    /**
     * This defines how the texture is wrapped vertically and corresponds to V in UV mapping.
     * The same choices are available as for {@link wrapS | wrapT}.
     */
    wrapT: SamplerWrap;
    /**
     * For use with a texture's magFilter property,
     * these define the texture magnification function to be used when the pixel being textured maps to an area less than or equal to one texture element (texel).
     */
    magFilter: SamplerFilter;
    /**
     * For use with a texture's minFilter property,
     * these define the texture minifying function that is used whenever the pixel being textured maps to an area greater than one texture element (texel).
     */
    minFilter: SamplerFilter;
    serialize(ctx: Serializer<any>): void;
    deserialize(ctx: Deserializer): void;
    min_filter_fallback(): SamplerFilter;
    needMipmap(): boolean;
}

/**
 * With MirroredRepeatWrapping the texture will repeats to infinity, mirroring on each repeat.
 */
export declare enum SamplerFilter {
    Nearest = 9728,
    Linear = 9729,
    NearestMipmapNearest = 9984,
    LinearMipmapNearest = 9985,
    NearestMipmapLinear = 9986,
    LinearMipmapLinear = 9987
}

/**
 * These define the texture's wrapS and wrapT properties, which define horizontal and vertical texture wrapping.
 */
export declare enum SamplerWrap {
    /**
     * With RepeatWrapping the texture will simply repeat to infinity.
     */
    Repeat = 10497,
    /**
     * ClampToEdgeWrapping is the default. The last pixel of the texture stretches to the edge of the mesh.
     */
    ClampToEdge = 33071,
    /**
     * With MirroredRepeatWrapping the texture will repeats to infinity, mirroring on each repeat.
     */
    MirroredRepeat = 33648
}

/**
 * Scene3D is a root node of 3d scene graph, other kinds of 3D object need to be add as children into it.
 * This class provides operating functions to control nodes in scene tree and record which nodes are changed in current frame.
 * The effect and renderable content also can be managed here.
 */
export declare class Scene3D extends Object3D {
    /**
     * Mark this scene with a unique number.
     */
    readonly sceneId: number;
    readonly scene: Scene3D;
    readonly attachedNodes: Map<number, Object3D>;
    /**
     * Store all {@link Light| lights } source which need to apply on the models of scene.
     */
    lights: Set<Light>;
    /**
     * Clipping planes setting for scene. When setting changed, should call notifyClippingChanged to update
     */
    clippingPlanes: Plane[];
    /**
     * If enable the scene level clipping
     */
    enableSceneClipping: boolean;
    notifyClippingChanged(): void;
    /**
     * The type of current {@link Object3D| Object3D }.
     * @deprecated
     */
    type: string;
    /**
     * The {@link CoordinateSystemHelper| coordSysHelper } of this scene, if it needs to be rendered.
     */
    coordSysHelper: Nullable<CoordinateSystemHelper>;
    /**
     * The instance of RenderProxyManager that is used to process some optimization.
     */
    renderProxyManager: RenderProxyManager;
    /**
     * If any nodes of scene is added, deleted or changed, this would be set to true.
     * @defaultValue `false`
     */
    anyDrawableChanged: boolean;
    shadowMapNeedsUpdate: boolean;
    private newAddedSceneNodes;
    private newDeletedSceneNodes;
    private newChangedSceneNodes;
    private allNodes;
    private updateId;
    private _layerLightEnabled;
    private _onlyDirectLight;
    private _bvhEnabled;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor();
    /**
     * Clears this scene related data.
     */
    destroy(): void;
    /**
     * Get {@link Scene3D.anythingChanged| anythingChanged } to know if any change of node happen in scene graph.
     * When there is any change happening on the sets which store the all nodes of this scene,
     * the value will be set to true, it does not allow user to arrange.
     */
    get isAnythingChanged(): boolean;
    get isShadowMapNeedsUpdate(): boolean;
    /**
     * When any node is added to scene, this method will record which nodes are added or just changed.
     * @param {Object3D} o added node.
     */
    onNodeAdd(o: Object3D): void;
    /**
     * When any changes occur at the node, this method will be used to record which nodes are changed.
     * @param {Object3D} o changed node.
     */
    onNodeChanged(o: Object3D): void;
    /**
     * When any node is deleted, this method will be used to record which nodes are deleted.
     * @param {Object3D} o deleted node.
     */
    onNodeDelete(o: Object3D): void;
    /**
     * change {@link Object3D.updateDirtyId| updateDirtyId } of all node's parent to current update id
     * in order to avoid loop checking.
     */
    popParentChanges(): void;
    /**
     * Synchronize the changes of scene nodes to {@link renderProxyManager| renderProxyManager } and clear these cache.
     */
    refreshChangeSets(): void;
    /**
     * When {@link isAnythingChanged| isAnythingChanged } is true, all nodes of this scene will be checked if there is any change and increase update id.
     * The update id is used to compare with nodes' dirty mark and decide it needs to update in current frame.
     * @param {Renderer} renderer give renderer the {@link shaderComponentRegistry| shaderComponentRegistry } of this scene.
     * @param {Camera} camera this is used to update corresponding data.
     */
    update(forceRefreshChanges?: boolean): void;
    afterRender(): void;
    /**
     * Update data and render the effect of shader components whose corresponding config is active.
     * @param {IRenderer} renderer give renderer the {@link shaderComponentRegistry| shaderComponentRegistry } of this scene.
     * @param {Camera} camera this is used to update corresponding data.
     */
    updateRegistryAndActive(renderer: IRenderer, camera: Camera3D): void;
    /**
     * Ues {@link Object3D.copy| copy() } of Object3D to copy {@link Object3D.matrixAutoUpdate| matrixAutoUpdate },
     * {@link Object3D.overrideMaterial| overrideMaterial } and data from source.
     * @param {Scene3D} source the data source.
     * @param {boolean} recursive if true, all nodes of this scene are also cloned. Default is true.
     */
    copy(source: Scene3D, recursive?: boolean): this;
}

declare class SceneAdaptor {
    scene: Scene3D;
    camera: Camera3D;
    constructor(scene: Scene3D, camera: Camera3D);
    get origin(): DrawableList;
    get proxied(): DrawableList;
    private cachedDefault;
    get default(): ProjectedDrawcallList;
    private cachedOIT;
    get OIT(): ProjectedDrawcallList;
    private cachedStatic;
    get static(): ProjectedDrawcallList;
    private cachedDynamic;
    get dynamic(): ProjectedDrawcallList;
    private cachedOverlay;
    get overlay(): ProjectedDrawcallList;
    getDirectionalShadowMapCaster: (light: DirectionalLight, useProxy: boolean) => ProjectedDrawcallList;
    getDirectionalShadowMapCasterUnfiltered: (light: DirectionalLight) => ProjectedDrawcallList;
    getSpotShadowMapCaster: (light: SpotLight, useProxy: boolean) => ProjectedDrawcallList;
    getSpotShadowMapCasterUnfiltered: (light: SpotLight) => ProjectedDrawcallList;
    destroy(): void;
}

declare class SceneAdaptorDispatcher {
    adaptor: SceneAdaptor;
    setAdaptor(a: SceneAdaptor): void;
    get scene(): Scene3D;
    get camera(): Camera3D;
    get origin(): DrawableList;
    get default(): () => ProjectedDrawcallList;
    get OIT(): () => ProjectedDrawcallList;
    get static(): () => ProjectedDrawcallList;
    get dynamic(): () => ProjectedDrawcallList;
    get overlay(): () => ProjectedDrawcallList;
    syncDirectionalShadowLayers(i: number): () => void;
    isDirectionalShadowRequireUpdate(i: number): () => boolean;
    getDirectionalShadowMapSize(i: number): ResizeFN;
    renderDirectionalShadow(i: number, useProxy: boolean): (renderer: RendererAdaptor) => void;
    returnDirectionalShadowResult(i: number): (r: PassExecuteCtx) => void;
    syncSpotShadowLayers(i: number): () => void;
    isSpotShadowRequireUpdate(i: number): () => boolean;
    getSpotShadowMapSize(i: number): ResizeFN;
    renderSpotShadow(i: number, useProxy: boolean): (renderer: RendererAdaptor) => void;
    returnSpotShadowResult(i: number): (r: PassExecuteCtx) => void;
    syncPointShadowLayers(i: number): () => void;
    isPointShadowRequireUpdate(i: number): () => boolean;
    getPointShadowMapSize(i: number): ResizeFN;
    getPointShadowPassContent(useProxy: boolean): () => DrawableList;
    getPointShadowPassContentUnfiltered(): () => DrawableList;
    getAndUpdatePointCamera(i: number): () => CubeCamera;
    returnPointShadowResult(i: number): (r: PassExecuteCtx) => void;
}

/**
 * Base material class for objects that support scene clipping.
 */
declare abstract class SceneClipMaterial extends SceneMaterial {
    enableSceneClipping: boolean;
    extendShaderShape(builder: ShaderBuilder, r: ShaderComponentRegistry): void;
    generateShaderKey(r: ShaderComponentRegistry): string;
    computeShapeKey(r: ShaderComponentRegistry): string;
    updateShapeUniforms(p: WGLProgram, r: ShaderComponentRegistry): void;
    freeGPU(): void;
}

declare class SceneClipPlugin extends PipelinePlugin {
    PLUGIN_NAME: string;
    private clippingEnabled;
    private clippingPlanes;
    private clippingEnabledCached;
    private clippingPlanesCached;
    destroy(): void;
    updateEffect(): void;
    updateFrameSize(): void;
    updateGraphHash(): void;
    updateRenderGraph(): void;
    setSceneClip(scene: Scene3D): void;
    restoreSceneClip(scene: Scene3D): void;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        clippingEnabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        clippingPlanes: {
            get: () => Plane[];
            set: (v: Plane[]) => void;
        };
    };
}

declare abstract class SceneMaterial extends Material {
    extendShaderShape(builder: ShaderBuilder, _: ShaderComponentRegistry): void;
    computeShapeKey(_: ShaderComponentRegistry): string;
    updateShapeUniforms(_1: WGLProgram, _: ShaderComponentRegistry): void;
}

declare abstract class ScenePopLODMaterial extends SceneClipMaterial {
    pop: Nullable<PopShaderComponent>;
    extendShaderShape(builder: ShaderBuilder, r: ShaderComponentRegistry): void;
    computeShapeKey(r: ShaderComponentRegistry): string;
    generateShaderKey(r: ShaderComponentRegistry): string;
    copyBase(other: ScenePopLODMaterial): this;
}

declare class Serializer<T extends Serializerable = any> {
    serializedResource: {
        [index: string]: any;
    };
    buffer: ArrayBuffer[];
    byteLengthAll: number;
    private serializeSource;
    private serializeTarget;
    private serializeTargetUuid;
    collectBuffer(data: TypeArray): CollectedBufferDescriptor;
    deepClone(value: any): any;
    putRaw(key: string, value: any): void;
    put(key: string, readKey?: string): this | undefined;
    puts<U>(keys: Array<SerializerablePartKeys<U>>): void;
    serialize(s: any): SerializeResult;
}

declare type Serializerable = SerializerableRaw | SerializerableDelegated | primitive;

declare interface SerializerableDelegated {
    serialize(serialize: Serializer): void;
    deserialize(ctx: Deserializer): void | Promise<any>;
}

declare interface SerializerableDelegatedAsReference extends SerializerableDelegated, ClassNamePreserved {
    getUUID(): string;
}

declare type SerializerableMath = ReadonlyVector2 | ReadonlyColor | ReadonlyMatrix3;

declare type SerializerablePartKeys<T> = PickSubTypeProperty<T, ArrayOrSingle<Serializerable>>;

declare type SerializerableRaw = MutableSerializerableRaw | ReadonlySerializerableRaw | SerializerableMath;

declare type SerializeResult = {
    typeName?: string;
    data: any;
} | any;

declare class SerializerMetaData {
    ctors: Map<string, () => any>;
    registerCtor<T extends SerializerableDelegated>(key: string, builder: () => T): void;
}

export declare function setViewerConfig(ctx: Viewer | Viewport, config: IViewerConfig): void;

declare enum ShaderAttributeTypes {
    position = 0,
    normal = 1,
    uv = 2,
    lineDistance = 3,
    color = 4,
    joints = 5,
    weights = 6
}

declare class ShaderBlock {
    source: string;
    constructor(str: string);
}

declare class ShaderBuilder {
    lightComponent: Nullable<LightMaterialComponent>;
    private extensions;
    private isInstanceMeshEnabled;
    private fragDefines;
    private postShaderStrProc;
    private components;
    private componentsMap;
    private attributes;
    private attributesCustom;
    private instanceAttributes;
    private vertexes;
    private vertexesCustom;
    private globalUniforms;
    private uniforms;
    private uniformArrays;
    private varyings;
    private varyingsCustom;
    private varyingsCustomArray;
    private fragOut;
    private fragments;
    private fragmentsCustom;
    private injections;
    private uniformBlocks;
    addDefaultFragColor: boolean;
    flatShadingNormal: boolean;
    static spawn(): ShaderBuilder;
    constructor();
    setFragOutputChannel(fragOut: FragOut[]): this;
    addNewFragOutputChannel(name: string, type?: FragOutType): this;
    addUBO(ubo: UniformBlockObject): this;
    addExtension(re: ShaderExtensionTypes): this;
    addLight(l: LightMaterialComponent): this;
    hasComponent(name: string): boolean;
    getComponent(name: string): ShaderComponent | undefined;
    extend(sc: ShaderComponent | null): this;
    addInstanceAttribute(name: string, type: WebGLShaderDataType): this;
    addCustomAttribute(name: string, type: WebGLShaderDataType): this;
    addDefaultAttribute(att: ShaderAttributeTypes): this;
    generateAttributes(): ShaderInputDescriptor[];
    private getVertexesString;
    addVertex(lib: ShaderBlock): this;
    addVertexCustom(lib: string): this;
    private getFragmentsString;
    addFragmentCustom(s: string): this;
    addFragment(lib: ShaderBlock): this;
    addUniform(name: string, type: WebGLShaderDataType): this;
    addUniformArray(name: string, type: WebGLShaderDataType, length: number): this;
    addUniformStruct(_name: string, _value: any): this;
    addUniformStructArray(_name: string, _value: any, _length: number): this;
    addGlobalUniform(g: BuiltInUniformTypes): this;
    private generateGlobalUniforms;
    addVaryingCustomArray(name: string, type: WebGLShaderDataType, length: number): this;
    addVaryingCustom(name: string, type: WebGLShaderDataType): this;
    addVarying(v: ShaderVaryingTypes): this;
    private expandVaryingSupport;
    private generateVaryings;
    addFragDefine(de: string): this;
    private getInjectionString;
    when(prediction: boolean, c: (builder: ShaderBuilder) => ShaderBuilder): ShaderBuilder;
    inject(point: ShaderInjectionTypes, shader: string): this;
    useCamera(useInstance?: boolean): this;
    useComponent(sc: ShaderComponent): void;
    addShaderStrProcess(f: (input: string) => string): this;
    private processPostShaderString;
    private getFragOutShaderHeader;
    build(): ShaderInfo;
}

declare abstract class ShaderComponent implements SerializerableDelegated {
    abstract extendShaderShading(builder: ShaderBuilder): void;
    extendShaderShape(_builder: ShaderBuilder): void;
    updateShapeUniforms?(program: WGLProgram): void;
    updateShadingUniforms?(program: WGLProgram): void;
    generateShaderKey?(): string;
    computeShapeKey?(): string;
    abstract className(): string;
    abstract deserialize(ctx: Deserializer): void | Promise<any>;
    abstract serialize(serialize: Serializer): void;
    abstract copy(other: ShaderComponent): any;
    abstract clone(): any;
    constructor();
}

declare class ShaderComponentRegistry {
    static global: Map<Scene3D, ShaderComponentRegistry>;
    light: LightShaderComponent;
    dynamicForwardLight: LightShaderComponent;
    isDeferMode: boolean;
    clipping: ClippingShaderComponent;
    tooManyLightsForForward(): boolean;
    destroy(): void;
}

declare enum ShaderExtensionTypes {
    derivatives = 0,
    GL_EXT_shader_texture_lod = 1,
    GL_EXT_frag_depth = 2
}

declare interface ShaderInfo {
    uniforms: ShaderInputDescriptor[];
    uniformArrays: UniformArrayDescriptor[];
    uniformsBlocks: UniformBlockDescriptor[];
    globalUniforms: BuiltInUniformTypes[];
    attributes: ShaderInputDescriptor[];
    varyings: ShaderInputDescriptor[];
    vertex: string;
    frag: string;
}

declare enum ShaderInjectionTypes {
    position = 0,
    gl_Position = 1,
    gl_PointSize = 2,
    vary_any = 3,
    vary_normal = 4,
    vary_viewPosition = 5,
    vary_worldPosition = 6,
    vary_uv = 7,
    frag_normal = 8,
    discard = 9,
    channel_color = 10,
    channel_alpha = 11,
    channel_ao = 12,
    channel_lightMap = 13,
    channel_specular = 14,
    channel_metalness = 15,
    channel_roughness = 16,
    channel_specularStrength = 17,
    channel_shininess = 18,
    gl_FragColor = 19,
    gl_FragColorModify = 20,
    gl_FragDepthEXT = 21,
    frag_any = 22
}

declare interface ShaderInputDescriptor {
    name: string;
    type: WebGLShaderDataType;
}

declare enum ShaderVaryingTypes {
    fragUV = 0,
    fragNormal = 1,
    viewPosition = 2,
    worldPosition = 3,
    vertexColor = 4
}

declare abstract class Shadow<M> {
    readonly light: Object3D;
    protected constructor(light: Object3D);
    abstract className(): string;
    destroy(): void;
    static _IN_TEMPORAL: boolean;
    static ENABLE_TEMPORAL_EFFECT: boolean;
    static JITTER_SIZE: number;
    readonly isShadow = true;
    private _enabled;
    get enabled(): boolean;
    set enabled(v: boolean);
    intensity: number;
    bias: number;
    normalBias: number;
    radius: number;
    mapSize: Readonly<Pick<ReadonlyMarked<Vector2>, "_readonly_mark" | "cloneReadonly" | "clone" | "equals" | "x" | "y" | "getNumberCount" | "toArray" | "length" | "dot" | "lengthSq" | "manhattanLength" | "width" | "height" | "isVector2" | "cross" | "angle" | "distanceTo" | "distanceToSquared" | "manhattanDistanceTo" | "intoSize">>;
    map: Nullable<M>;
    abstract updateMapUniform(program: WGLProgram, mapName: string): void;
    abstract getMapOrDefault(): M;
    copy(other: Shadow<M>): void;
    updateUniforms(program: WGLProgram, prefix: string): void;
    updateUniformsImpl(program: WGLProgram, prefix: string): void;
    includeShadowMapCommon(builder: ShaderBuilder): void;
    deserialize(ctx: Deserializer): void;
    serialize(ctx: Serializer): void;
}

declare class ShadowMapPlugin extends PipelinePlugin {
    readonly PLUGIN_NAME = "shadowMap";
    private depthDispatcher;
    /**
     * whether use render proxy to render shadow map
     * be careful. current some render proxy(eg. auto instance, multi merge) does not fully support cast shadow flag.
     * @default false
     */
    private useProxy;
    protected _enabled: boolean;
    get enabled(): boolean;
    set enabled(v: boolean);
    private drivenCullingMaterial;
    private drivenShadingMaterial;
    constructor(scene: SceneAdaptorDispatcher, renderer: RendererAdaptor);
    destroy(): void;
    updateFrameSize(): void;
    updateEffect(): void;
    updateGraphHash(hasher: HashKeyBuilder): void;
    /**
     * notes:
     * You should not directly reference a specific scene object(like light, shadow, light system)
     * into rendergraph hooks(like render, before, after), or it will cause mem leak
     * Instead, any scene object access, should provider by scene adaptor, every graph
     * actually reference the one scene adaptor dispatcher which pipeline provides,
     * and scene adaptor is provided by scene adaptor dispatcher. That's how we avoid mem leak.
     *
     * In shadowmap updating/generation case, you can't name specific shadow/light when
     * updating, because the graph instance has no relationship with what exactly light/shadow
     * in the scene. In fact, in current implementation only the number of light decide
     * the graph structure. So for each i in scene, we do check and update i th light,
     * and the scene dispatcher must responsible for updating/access same light when given same i;
     */
    updateRenderGraph(graph: RenderGraph, context: PipelineContext): void;
    private shadowPass;
    private updateCullingConfig;
    /**
     * in gpu driven, shadow drawable list will be unfiltered, will use drawcall filter instead of drawable filter.
     * additional the projected drawcall list will disable light manually to prevent issue.
     */
    private gpuDrivenShadowPass;
    createConfig(): {
        useProxy: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        enableTemporal: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        targetJitterSize: {
            get: () => number;
            set: (v: number) => void;
        };
    };
}

declare abstract class SharedShaderComponent extends ShaderComponent {
    serialize(_: Serializer<any>): void;
    deserialize(_: Deserializer): void | Promise<void>;
    referenceSet: Set<Material>;
    className(): string;
    clearAllRef(): void;
    attachMaterial(m: Material): void;
    detachMaterial(m: Material): void;
    broadcastToRecompile(): void;
    broadcastToPropertyChanged(): void;
    abstract extendShaderShading(builder: ShaderBuilder): void;
    updateImpl(_camera: Camera3D): boolean;
    dirtyKey: number;
    update(camera: Camera3D): void;
}

/**
 * Specified the showing side of objects, which the fround side is normal vector's direction.
 */
export declare enum Side {
    FrontSide = 0,
    BackSide = 1,
    DoubleSide = 2
}

declare abstract class SingleProjectShadow<C extends Camera3D> extends Shadow<RenderAttachment> {
    constructor(light: Object3D);
    camera: C;
    destroy(): void;
    protected matrix: Matrix4;
    updateCameraAndShadowMatrices(light: TargetLight): void;
    updateCamera(light: TargetLight): void;
    updateShadowMatrix(): void;
    updateUniformsImpl(program: WGLProgram, prefix: string): void;
    updateMapUniform(program: WGLProgram, mapName: string): void;
    getMapOrDefault(): RenderAttachment;
}

declare interface Size {
    width: number;
    height: number;
    depth?: number;
}

declare interface Size_2 {
    width: number;
    height: number;
    depthOrArrayLayers?: number;
}

/**
 * A special class used by {@link SkinnedMesh} containing an array of bones.
 */
declare class Skeleton {
    private bones;
    private boneInverses;
    private boneMatrices;
    private boneTexture;
    private needUpdate;
    get texture(): Texture2D;
    get rootBone(): Object3D;
    constructor(bones: Object3D[], boneInverses: Matrix4[]);
    private onBoneUpdate;
    /**
     * Update animation and sync bone matrix texture
     */
    update(isWASM?: boolean): boolean;
}

declare const SkeletonUpdatedEvent: EventType<never>;

/**
 * This is a spacial mesh for skeletal mesh.
 */
declare class SkinnedMesh<M extends Material = Material, T extends SourceTexture | Texture2D = Texture2D> extends Mesh {
    readonly isSkinnedMesh: boolean;
    boneMatricesTexture: Nullable<T>;
    boneMatricesBuffer: Nullable<Float32Array>;
    private boundingBox;
    private boneBoundingBoxes;
    constructor(geometry?: BufferGeometry<TriangleList>, material?: M | M[]);
    /**
     * Special raycast for skinned mesh
     */
    raycastJsImpl(raycaster: Raycaster, intersects: Intersection[]): void;
    /**
     * Copy skinned mesh with shared skeleton.
     */
    copy(source: SkinnedMesh<M, T>, recursive?: boolean): this;
    /**
     * Clone skinned mesh with shared skeleton.
     */
    clone(recursive?: boolean): SkinnedMesh<M, T>;
    /**
     * Compute bone bounding boxes in local space for raycast
     */
    private computeBoneBoundingBoxes;
    updateBoundings(): void;
    /**
     * Compute animated position
     */
    applyBoneTransform(index: number, vector: Vector3): void;
    /**
     * Update bone matrices and local bounding
     */
    update(): void;
    /**
     * get local bbox which is not only related to geometry
     */
    getBoundingBox(): Box3;
    private getBoneMatrixAt;
}

/**
 * Draw background with a gray ground and blue sky.
 */
declare class SkyBackground extends MeshBackground<SkyMaterial> {
    constructor();
}

/**
 * Parameters for a procedural sky background.
 * @deprecated
 */
declare interface SkyBackgroundParameter {
    enableSkyMap: boolean;
    luminance: number;
    turbidity: number;
    rayleigh: number;
    mieCoefficient: number;
    mieDirectionalG: number;
}

declare class SkyMaterial extends BackgroundLikeMaterial {
    private _luminance;
    private _turbidity;
    private _rayleigh;
    private _mieCoefficient;
    private _mieDirectionalG;
    get luminance(): number;
    set luminance(v: number);
    get turbidity(): number;
    set turbidity(v: number);
    get rayleigh(): number;
    set rayleigh(v: number);
    get mieCoefficient(): number;
    set mieCoefficient(v: number);
    get mieDirectionalG(): number;
    set mieDirectionalG(v: number);
    tEquirect: Nullable<Texture>;
    className(): string;
    constructor();
    updateShadingUniforms(p: WGLProgram): void;
    extendShaderShading(b: ShaderBuilder, _: any): void;
    generateShaderKey(r: ShaderComponentRegistry): string;
    copy(): this;
    clone(): SkyMaterial;
    traverseTexture(visitor: (tex: Texture) => void): void;
}

declare class SnapShotAdaptor extends SceneAdaptor {
    objectToSnapShot: DrawableList;
    objectToSnapShotProjected: Nullable<ProjectedDrawcallList>;
    constructor(camera: Camera3D, objectToSnapShot: DrawableList, scene: Scene3D);
    get origin(): DrawableList;
    get default(): ProjectedDrawcallList;
    destroy(): void;
}

/**
 * Camera direction used for axis-aligned snapshots.
 */
declare enum SnapshotAxisDirection {
    Top = "top",
    Bottom = "bottom",
    Left = "left",
    Right = "right",
    Front = "front",
    Back = "back"
}

/**
 * Bounding strategy used to frame snapshot targets.
 */
declare enum SnapshotBoxPrecision {
    BoundingBox = "BoundingBox",
    Vertex = "Vertex"
}

/**
 * Camera matrices captured with a snapshot result.
 */
declare interface SnapshotCameraInfo {
    projectionMatrix: Matrix4;
    worldMatrix: Matrix4;
}

declare interface SnapshotCtx {
    drawableList: DrawableList;
    scene: Scene3D;
    camera: Camera3D;
    size: Size;
    freeables: RenderTarget[];
}

declare interface SnapshotRenderConfig {
    worldBox?: Box3;
    boxPrecision?: SnapshotBoxPrecision;
}

/**
 * This class provide function to get
 */
declare class SnapshotRenderer {
    private renderer;
    defaultScene: Scene3D;
    constructor(renderer: IRenderer);
    destroy(): void;
    private postPipeline;
    private pipelineConfig;
    backgroundColor: Color;
    backgroundAlpha: number;
    defaultAdjustMaxSideSize: number;
    extraPaddingForEffect: number;
    skipSceneVisible: boolean;
    private camera;
    getCamera(): Readonly<OrthographicCamera>;
    private effectConfig;
    private drivenCullingConfig;
    private renderingConfig;
    /**
     * Set RenderMode and AO effect for snapshot rendering.
     */
    setEffectConfig(mode: RenderMode, isAOEnabled?: boolean, isDeferredEnabled?: boolean, isHighQuality?: boolean, taaSampleCount?: number): void;
    private updatePipelineParam;
    setCameraLayer(layers: Layers): void;
    /**
     * A function to define the width and height of snapshot.
     */
    resolutionAdjustor: (size: Size) => {
        width: number;
        height: number;
    };
    /**
     * Render the objects in specified scene except other objects.
     * @param object
     * @param direction set the camera facing direction.
     * @param generate
     * @param extraPadding
     * @param config
     */
    private renderImpl;
    private renderInner;
    private renderWithOverrideMaterialImpl;
    /**
     * @deprecated use `renderWithOverrideMaterialAsync` instead, sync function will unavailable in webgpu version
     */
    renderWithOverrideMaterial(object: Object3D, direction: SnapshotAxisDirection, material: Material, config?: SnapshotRenderConfig): SnapshotResult;
    renderWithOverrideMaterialAsync(object: Object3D, direction: SnapshotAxisDirection, material: Material, config?: SnapshotRenderConfig): Promise<SnapshotResult>;
    /**
     * @deprecated use `renderAsync` instead, sync function will unavailable in webgpu version
     */
    render(object: Object3D, direction: SnapshotAxisDirection, scene?: Scene3D, config?: SnapshotRenderConfig): SnapshotResult;
    renderAsync(object: Object3D, direction: SnapshotAxisDirection, scene?: Scene3D, config?: SnapshotRenderConfig): Promise<SnapshotResult>;
    private renderCustomViewImpl;
    /**
     * @deprecated use `renderCustomViewAsync` instead, sync function will unavailable in webgpu version
     */
    renderCustomView(object: Object3D | Object3D[], camera: Camera3D, resolution: Size): SnapshotResult;
    renderCustomViewAsync(object: Object3D | Object3D[], camera: Camera3D, resolution: Size): Promise<SnapshotResult>;
    private readPixels;
    private readPixelsAsync;
}

declare class SnapshotRenderer_2 {
    private DEFAULT_PIPELINE_CONFIG;
    private renderer;
    private pipeline;
    private pipelineConfig;
    private defaultScene;
    private defaultCamera;
    private defaultLights;
    private renderConfig;
    private isDestroy;
    private isAdvancedBackend;
    private quadDrawer;
    private downsample;
    private downsampleDepth;
    private mixColorDepth;
    private depthMaterial;
    private drivenCullingConfig;
    private renderingConfig;
    constructor(renderer: IRenderer);
    get config(): Readonly<RenderConfig>;
    private get realRatio();
    destroy(): void;
    private updateRenderConfig;
    private getAxisCamera;
    private baseShading;
    generateDepthTexture(width: number, height: number, multiSample: boolean, adaptor: SnapShotAdaptor, ctx: SnapshotCtx): RenderAttachment;
    private downsampleShading;
    private mixDepthShading;
    private inner_render;
    private prerender;
    render(object: Object3D | Object3D[], camera: SnapshotAxisDirection | DirectionCameraCustom | CustomCamera, config?: PresetRenderConfig | Partial<RenderConfig & {
        extends: PresetRenderConfig;
    }>): Promise<SnapshotResult>;
}

/**
 * Result object returned from snapshot rendering.
 */
declare class SnapshotResult {
    data: Uint8Array;
    size: Size;
    cameraInfo: SnapshotCameraInfo;
    worldBox?: Box3 | undefined;
    type: SnapshotResultResultType;
    reason?: any;
    constructor(data: Uint8Array, size: Size, cameraInfo: SnapshotCameraInfo, worldBox?: Box3 | undefined);
    static exception(type: SnapshotResultResultType, reason?: any): SnapshotResult;
    flipY(): this;
    createDataURL(): string;
    downloadImage(name?: string): void;
}

/**
 * Result states returned by snapshot rendering.
 */
declare enum SnapshotResultResultType {
    Success = 0,
    Empty = 1,
    Error = 2
}

declare class SogFile implements IFile {
    counts: number;
    shDegree: number;
    version: number;
    meta: SogMetadata;
    texturePaths: string[];
    private cached;
    load(stream: ReadableStream<Uint8Array>): Promise<void>;
    private parse_v1;
    private parse_v2;
    private loadTexture;
    read(stream: ReadableStream<Uint8Array>, _contentLength: number, data: IData, context?: FileContext): Promise<void>;
    write(_stream: WritableStream<Uint8Array>, _data: IData): Promise<void>;
}

declare type SogMetadata = SogMetadataV1 | SogMetadataV2;

declare type SogMetadata_2 = {
    counts: number;
    shDegree: number;
    means: {
        mins: [number, number, number];
        maxs: [number, number, number];
    };
} & ({
    version: 1;
    scales: {
        mins: [number, number, number];
        maxs: [number, number, number];
    };
    sh0: {
        mins: [number, number, number, number];
        maxs: [number, number, number, number];
    };
    shN?: {
        mins: number;
        maxs: number;
    };
} | {
    version: 2;
    scales: {
        codebook: number[];
    };
    sh0: {
        codebook: number[];
    };
    shN?: {
        codebook: number[];
    };
});

declare interface SogMetadataV1 {
    version: undefined;
    means: {
        shape: number[];
        dtype: string;
        mins: number[];
        maxs: number[];
        files: string[];
    };
    scales: {
        shape: number[];
        dtype: string;
        mins: number[];
        maxs: number[];
        files: string[];
    };
    quats: {
        shape: number[];
        dtype: string;
        encoding?: string;
        files: string[];
    };
    sh0: {
        shape: number[];
        dtype: string;
        mins: number[];
        maxs: number[];
        files: string[];
    };
    shN?: {
        shape: number[];
        dtype: string;
        mins: number;
        maxs: number;
        quantization: number;
        files: string[];
    };
}

declare interface SogMetadataV2 {
    version: number;
    count: number;
    means: {
        mins: number[];
        maxs: number[];
        files: string[];
    };
    scales: {
        codebook: number[];
        files: string[];
    };
    quats: {
        files: string[];
    };
    sh0: {
        codebook: number[];
        files: string[];
    };
    shN?: {
        count: number;
        bands: number;
        codebook: number[];
        files: string[];
    };
}

export declare class SogSplat extends Splat {
    readonly PackType: string;
    constructor(meta: SogSplatMeta, meansL: SourceTexture, meansU: SourceTexture, quats: SourceTexture, scales: SourceTexture, colors: SourceTexture, _shNLabels?: SourceTexture, _shNCentroids?: SourceTexture);
    createUnpackSplatShader(): string;
    createUnpackSHShader(): string;
    onGpuDataPacked(): void;
}

declare class SogSplatData extends SplatData {
    counts: number;
    shDegree: number;
    private meta;
    private meansL;
    private meansU;
    private quats;
    private scales;
    private colors;
    private shNLabels?;
    private shNCentroids?;
    init(_counts: number, _shDegree: number): void;
    load(meta: SogMetadata_2, meansL: Uint8Array, meansU: Uint8Array, quats: Uint8Array, scales: Uint8Array, colors: Uint8Array, shNLabels?: Uint8Array, shNCentroids?: Uint8Array): void;
    set(_i: number, _single: ISingleSplat): void;
    setCenter(_i: number, _x: number, _y: number, _z: number): void;
    setScale(_i: number, _sx: number, _sy: number, _sz: number): void;
    setQuat(_i: number, _qx: number, _qy: number, _qz: number, _qw: number): void;
    setColor(_i: number, _r: number, _g: number, _b: number): void;
    setAlpha(_i: number, _a: number): void;
    setShN(_i: number, _shN: number[]): void;
    get(_i: number, _single: ISingleSplat): void;
    getCenter(_i: number, _single: ISingleSplat): void;
    getScale(_i: number, _single: ISingleSplat): void;
    getQuat(_i: number, _single: ISingleSplat): void;
    getColor(_i: number, _single: ISingleSplat): void;
    getAlpha(_i: number, _single: ISingleSplat): void;
    getShN(_i: number, _shN: number[]): void;
    fillCenters(_centers: Float32Array): void;
    serialize(): ISplatData;
    deserialize(data: ISplatData): void;
}

declare type SogSplatMeta = {
    counts: number;
    shDegree: number;
    means: {
        mins: [number, number, number];
        maxs: [number, number, number];
    };
} & ({
    version: 1;
    scales: {
        mins: [number, number, number];
        maxs: [number, number, number];
    };
    sh0: {
        mins: [number, number, number, number];
        maxs: [number, number, number, number];
    };
    shN?: {
        mins: number;
        maxs: number;
    };
} | {
    version: 2;
    scales: {
        codebook: number[];
    };
    sh0: {
        codebook: number[];
    };
    shN?: {
        codebook: number[];
    };
});

/**
 * Draw background with a solid color.
 */
declare class SolidColorBackground implements Renderable {
    color: Color;
    alpha: number;
    constructor(color?: Color, alpha?: number);
    config(renderer: IRenderer): boolean;
    render(_: IRenderer): void;
}

/**
 * Parameters for a solid-color background.
 * @deprecated
 */
declare interface SolidColorBackgroundParameter {
    color: Color;
    alpha: number;
}

/**
 * SourceTexture is texture which contains cpu data.
 */
export declare class SourceTexture extends TextureV2 {
    readonly autoGenerateMipmap: boolean;
    private samplerNeedSync;
    private modifiedLevels;
    private modifiedLayers;
    private source;
    constructor(dimension: TextureDimension, viewDimension: TextureViewDimension, format: TextureFormat, width: number, height: number, depthOrArrayLayers: number, mipmaps: boolean, autoGenerateMipmap: boolean);
    getLevelLayerSource(level: number, layer?: number): OffscreenCanvas | ImageBitmap | Float32Array | Float64Array | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageData | undefined;
    configSampler(visitor: (s: SamplerDescriptor) => any): this;
    setLevelData(data: MipLevelSource, level: number): this;
    setLevelLayerData(data: LayerSource, level: number, layer: number): this;
}

/**
 * A two dimensional surface that extends infinitely in 3d space,
 * represented in {@link http://mathworld.wolfram.com/HessianNormalForm.html| Hessian normal form} by a unit length normal vector and a constant.
 */
export declare class Sphere {
    /**
     * A {@link Vector3| Vector3} defining the center of the sphere.
     * @defaultValue `(0, 0, 0)`.
     */
    center: Vector3;
    /**
     * The radius of the sphere.
     * @defaultValue `0`.
     */
    radius: number;
    constructor(center?: Vector3, radius?: number);
    /**
     * Sets the {@link center| center} and {@link radius| radius} properties of this sphere.<br />
     * Please note that this method only copies the values from the given center.
     * @param center center of the sphere.
     * @param radius radius of the sphere.
     */
    set(center: Vector3, radius: number): Sphere;
    /**
     * Computes the minimum bounding sphere for an array of {@link Array| points}.
     * If {@link Vector3| optionalCenter} is given, it is used as the sphere's center.
     * Otherwise, the center of the axis-aligned bounding box encompassing {@link Array| points} is calculated.
     * @param points an array of {@link Vector3| Vector3} positions.
     * @param optionalCenter Optional {@link Vector3| Vector3} position for the sphere's center.
     */
    setFromPoints(points: Vector3[], optionalCenter?: Vector3): Sphere;
    /**
     * Returns a new sphere with the same {@link center| center} and {@link radius| radius} as this one.
     */
    clone(): Sphere;
    /**
     * Copies the values of the passed sphere's {@link center| center} and {@link radius| radius} properties to this sphere.
     */
    copy(sphere: Sphere): Sphere;
    /**
     * If the radius smaller than zero, this will return false, otherwise return true.
     */
    empty(): boolean;
    /**
     * Checks to see if the sphere contains the provided {@link Vector3| point} inclusive of the surface of the sphere.
     * @param point the {@link Vector3| Vector3} to be checked.
     */
    containsPoint(point: Vector3): boolean;
    /**
     * Returns the closest distance from the boundary of the sphere to the {@link Vector3| point}.
     * If the sphere contains the point, the distance will be negative.
     */
    distanceToPoint(point: Vector3): number;
    /**
     * Checks to see if two spheres intersect.
     * @param sphere Sphere to check for intersection against.
     */
    intersectsSphere(sphere: Sphere): boolean;
    /**
     * Determines whether or not this sphere intersects a given {@link Box3| box}.
     * @param box {@link Box3| Box3} to check for intersection against.
     */
    intersectsBox(box: Box3): boolean;
    /**
     * Determines whether or not this sphere intersects a given {@link Plane| plane}.
     * @param plane Plane to check for intersection against.
     */
    intersectsPlane(plane: Plane): boolean;
    /**
     * Clamps a point within the sphere. If the point is outside the sphere, it will clamp it to the closest point on the edge of the sphere.
     * Points already inside the sphere will not be affected.
     * @param point {@link Vector3| Vector3} The point to clamp.
     * @param target the result will be copied into this Vector3.
     */
    clampPoint(point: Vector3, target: Vector3): Vector3;
    /**
     * Returns a {@link https://en.wikipedia.org/wiki/Minimum_bounding_box| Minimum Bounding Box} for the sphere.
     * @param target the result will be copied into this Box3.
     */
    getBoundingBox(target: Box3): Box3;
    /**
     * Transforms this sphere with the provided {@link Matrix4| Matrix4}.
     * @param matrix the {@link Matrix4| Matrix4} to apply
     */
    applyMatrix4(matrix: Matrix4): Sphere;
    /**
     * Translate the sphere's center by the provided offset {@link Vector3| Vector3}.
     */
    translate(offset: Vector3): Sphere;
    /**
     * Checks to see if the two spheres' centers and radii are equal.
     */
    equals(sphere: Sphere): boolean;
}

/**
 * A point's {@link https://en.wikipedia.org/wiki/Spherical_coordinate_system| spherical coordinates}.
 */
declare class Spherical {
    /**
     * the radius, or the {@link https://en.wikipedia.org/wiki/Euclidean_distance| Euclidean distance}.
     */
    radius: number;
    /**
     * polar angle in radians from the y (up) axis.
     * @defaultValue `0`.
     */
    phi: number;
    /**
     * equator angle in radians around the y (up) axis.
     * @defaultValue `0`.
     */
    theta: number;
    constructor(radius?: number, phi?: number, theta?: number);
    /**
     * Sets values of this spherical's {@link radius| radius}, {@link phi| phi} and {@link theta| theta} properties.
     */
    set(radius: number, phi: number, theta: number): Spherical;
    /**
     * Returns a new spherical with the same {@link radius| radius}, {@link phi| phi} and {@link theta| theta} properties as this one.
     */
    clone(): Spherical;
    /**
     * Copies the values of the passed Spherical's {@link radius| radius}, {@link phi| phi} and {@link theta| theta} properties to this spherical.
     */
    copy(other: Spherical): Spherical;
    /**
     * Restricts the polar angle {@link phi| phi} to be between 0.000001 and pi - 0.000001.
     */
    makeSafe(): Spherical;
    /**
     * Sets values of this spherical's {@link radius| radius}, {@link phi| phi} and {@link theta| theta} properties from the {@link Vector3| Vector3}.
     */
    setFromVector3(v: Vector3): Spherical;
    /**
     * Sets values of this spherical's {@link radius| radius}, {@link phi| phi} and {@link theta| theta} properties from Cartesian coordinates.
     */
    setFromCartesianCoords(x: number, y: number, z: number): Spherical;
}

/**
 * Base scene object for Gaussian splat renderables.
 */
export declare abstract class Splat extends Object3D {
    abstract readonly PackType: string;
    abstract createUnpackSplatShader(): string;
    abstract createUnpackSHShader(): string;
    readonly isSplat: boolean;
    offset: number;
    counts: number;
    shDegree: number;
    autoFreeResourceOnGpuPacked: boolean;
    maxShDegree: number;
    constructor(counts: number, shDegree: number);
    private isRenderingStability;
    updateVersion: () => void;
    setModifiers(modifiers: SplatModifier[]): void;
    freeGPU(): void;
}

declare interface SplatCenterPrimitive {
    x: number;
    y: number;
    z: number;
}

declare class SplatCenterPrimitiveSource implements BVHSource<SplatCenterPrimitive> {
    private operator;
    private centers;
    constructor(operator: SplatOperator);
    build(): {
        count: number;
        indices: Uint32Array<ArrayBuffer>;
        centers: Float32Array<ArrayBuffer>;
        boxMins: Float32Array<ArrayBuffer>;
        boxMaxs: Float32Array<ArrayBuffer>;
    };
    createEmpty(): SplatCenterPrimitive;
    get(localIdx: number, primitive: SplatCenterPrimitive): void;
}

declare abstract class SplatData implements IData {
    readonly counts: number;
    readonly shDegree: number;
    readonly maxShDegree: number;
    readonly maxTextureSize: number;
    private blockCounts;
    constructor(maxShDegree?: number, maxTextureSize?: number, blockCounts?: number);
    private totalBlockCounts;
    private totalBlockShDegree;
    private blockOffsets;
    private blockExecs;
    private currentBlockIndex;
    initBlock(counts: number, shDegree: number): Promise<number>;
    finishBlock(): void;
    abstract init(counts: number, shDegree: number): void;
    abstract set(i: number, single: ISingleSplat): void;
    abstract setCenter(i: number, x: number, y: number, z: number): void;
    abstract setScale(i: number, sx: number, sy: number, sz: number): void;
    abstract setQuat(i: number, qx: number, qy: number, qz: number, qw: number): void;
    abstract setColor(i: number, r: number, g: number, b: number): void;
    abstract setAlpha(i: number, a: number): void;
    abstract setShN(i: number, shN: number[]): void;
    abstract get(i: number, single: ISingleSplat): void;
    abstract getCenter(i: number, single: ISingleSplat): void;
    abstract getScale(i: number, single: ISingleSplat): void;
    abstract getQuat(i: number, single: ISingleSplat): void;
    abstract getColor(i: number, single: ISingleSplat): void;
    abstract getAlpha(i: number, single: ISingleSplat): void;
    abstract getShN(i: number, shN: number[]): void;
    abstract fillCenters(centers: Float32Array): void;
    abstract serialize(): ISplatData;
    abstract deserialize(data: ISplatData): void;
}

declare type SplatEllipsoidPrimitive = ISingleSplat;

declare class SplatEllipsoidPrimitiveSource implements BVHSource<SplatEllipsoidPrimitive> {
    private operator;
    private radiusScale;
    private indices;
    constructor(operator: SplatOperator, radiusScale?: number);
    build(): {
        count: number;
        indices: Uint32Array<ArrayBuffer>;
        centers: Float32Array<ArrayBuffer>;
        boxMins: Float32Array<ArrayBuffer>;
        boxMaxs: Float32Array<ArrayBuffer>;
    };
    createEmpty(): SplatEllipsoidPrimitive;
    get(localIdx: number, primitive: SplatEllipsoidPrimitive): void;
}

declare class SplatFile implements IFile {
    read(stream: ReadableStream<Uint8Array>, contentLength: number, data: IData): Promise<void>;
    write(stream: WritableStream<Uint8Array>, data: IData): Promise<void>;
}

declare enum SplatFileType {
    PLY = 0,
    SPZ = 1,
    SPLAT = 2,
    KSPLAT = 3,
    SOG = 4,
    LCC = 5,
    LCC2 = 6,
    ESZ = 7
}

declare class SplatKernelHighlightMaterial extends Material {
    depthTest: boolean;
    size: number;
    color: Color;
    selectedColor: Vector4;
    origin: Vector3;
    centerTex: TextureV2;
    orderTex: TextureV2;
    className(): string;
    computeShapeKey(): string;
    extendShaderShape(_builder: ShaderBuilder, _: ShaderComponentRegistry): void;
    updateShapeUniforms(_p: WGLProgram, _: ShaderComponentRegistry): void;
    extendShaderShading(builder: ShaderBuilder, _: ShaderComponentRegistry): void;
    updateShadingUniforms(program: WGLProgram, _registry: ShaderComponentRegistry): void;
    copy(_other: SplatKernelHighlightMaterial): void;
    clone(): this;
}

declare type SplatKernelOptions = Pick<SplatKernelHighlightMaterial, 'size' | 'color' | 'selectedColor'>;

declare namespace SplatLoader {
    export {
        KsplatFile,
        LccFile,
        Lcc2File,
        PlyFile,
        SogFile,
        SplatFile,
        SpzFile,
        IFile,
        SplatData,
        RawSplatData,
        CompressedSplatData,
        SuperCompressedSplatData,
        SogSplatData,
        ISamplerFormat,
        ISampler,
        SplatFileType,
        SplatPackType,
        parseSplatData,
        ISingleSplat,
        detectSplatFileType
    }
}
export { SplatLoader }

export declare class SplatModifier<T extends UniformValues = UniformValues> extends EventDispatcher {
    readonly name: string;
    constructor(name: string, uniformValues: T, createShaderBlock: SplatModifierShaderBlockFactory<T>);
    update(uniforms: Partial<T>): void;
    copy(uniforms?: Partial<T>): SplatModifier<T>;
}

declare interface SplatModifierShaderBlock {
    header?: string;
    content: string;
}

declare type SplatModifierShaderBlockFactory<T extends UniformValues> = (input: Readonly<{
    idx: string;
    splat: string;
}>, uniform: Readonly<{
    [K in keyof T]: string;
}>, language: 'wgsl' | 'glsl') => SplatModifierShaderBlock;

declare class SplatOperator {
    splat: Splat;
    private counts;
    private centers;
    constructor(splat: Splat, data: SplatData);
    getActiveCounts(): number;
    readSplatCenter<T extends IVector3>(index: number, result: T): T;
    foreachSplatCenter(callback: (i: number, x: number, y: number, z: number) => void): void;
    readSplat(index: number, single?: ISingleSplat): ISingleSplat;
    foreachSplat(callback: (i: number, single: ISingleSplat) => void, single?: ISingleSplat): void;
    private initState;
    setState(indices: number[], state: SplatState, invert?: boolean): void;
    clearState(): void;
}

declare enum SplatPackType {
    Raw = 0,
    Compressed = 1,
    SuperCompressed = 2,
    Sog = 3
}

/**
 * Event emitted when splat rendering stability changes.
 */
declare const SplatRenderingStabilityChangedEvent: EventType<boolean>;

/**
 * Event emitted after splat ordering has been updated.
 */
declare const SplatSortedEvent: EventType<never>;

/**
 * Bit flags that control splat visibility and appearance.
 */
export declare enum SplatState {
    Deleted = 1,
    Selected = 2,
    DisableSH = 4
}

/** Parameters shared by the Splatting plugin and native GPU renderer. */
declare interface SplattingOptions {
    preBlurAmount: number;
    blurAmount: number;
    focalAdjustment: number;
    maxStdDev: number;
    maxPixelRadius: number;
    detailCullingThreshold: number;
    normalizedFalloff: boolean;
    renderMode: number;
    selectedColor: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    ringSize: number;
    highlightKernelEnabled: boolean;
    highPrecisionEnabled: boolean;
    precalculateEnabled: boolean;
    cameraRelativeEnabled: boolean;
}

declare class SplattingPlugin extends PipelinePlugin {
    PLUGIN_NAME: string;
    private isDestroyed;
    private forceUpdate;
    private shouldRenderNextFrame;
    private packQueue;
    private packMaterial;
    private packQuad;
    private packForceUnstableEnabled;
    private packHighPrecisionEnabled;
    private packCameraRelativeEnabled;
    private packCameraRelativeUpdateDistanceThreshold;
    private packCameraRelativeOrigin;
    private packAttachSize;
    private precalculateEnabled;
    private precalculateQueue;
    private precalculateMaterial;
    private precalculateQuad;
    private isSortDirty;
    private isSorting;
    private sortMinIntervalMs;
    private sortHighPrecisionEnabled;
    private sortSplatDistance;
    private sortSplatCoorient;
    private sortCameraDistance;
    private sortCameraCoorient;
    private sortLastTime;
    private sortPingPongTarget;
    private sortMaterial;
    private sortQuad;
    private reorderMaterial;
    private reorderQuad;
    private reorderIsDirty;
    private splattingMesh;
    private splattingGeometry;
    private splattingMaterial;
    private compositeEnabled;
    private compositeHighPrecisionEnabled;
    private toneMappingMaterial;
    private highlightKernelEnabled;
    private highlightKernelMesh;
    private highlightKernelGeometry;
    private highlightKernelMaterial;
    get envSupported(): boolean;
    get enabled(): boolean;
    set enabled(v: boolean);
    get shouldRender(): boolean;
    constructor(scene: SceneAdaptorDispatcher, renderer: RendererAdaptor);
    private sortCurrentVersion;
    private sortLastVersion;
    private sortingBuffer?;
    private sortTaskRunning;
    private pendingSortTask?;
    private orderBuffer?;
    private orderLayout;
    private flushSortTask;
    private addSortTask;
    destroy(): void;
    private prevSceneVersion;
    private prevSplatCache;
    private prevSortCameraMatrix?;
    private prevSortCameraLayer;
    updateEffect(sceneAdaptor: SceneAdaptor): void;
    private updateEffectWebGPU;
    updateFrameSize(): void;
    updateGraphHash(hasher: HashKeyBuilder): void;
    updateRenderGraph(graph: RenderGraph): void;
    private updateRenderGraphWebGPU;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        pack: {
            forceUnstableEnabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            highPrecisionEnabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            precalculateEnabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            cameraRelativeEnabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            cameraRelativeUpdateDistanceThreshold: {
                get: () => number;
                set: (v: number) => void;
            };
        };
        raster: {
            mode: {
                get: () => SplattingRenderMode;
                set: (v: SplattingRenderMode) => void;
            };
            preBlurAmount: {
                get: () => number;
                set: (v: number) => void;
            };
            blurAmount: {
                get: () => number;
                set: (v: number) => void;
            };
            focalAdjustment: {
                get: () => number;
                set: (v: number) => void;
            };
            maxStdDev: {
                get: () => number;
                set: (v: number) => void;
            };
            maxPixelRadius: {
                get: () => number;
                set: (v: number) => void;
            };
            detailCullingThreshold: {
                get: () => number;
                set: (v: number) => void;
            };
            normalizedFalloff: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            selectedColor: {
                get: () => Vector4;
                set: (v: Vector4) => void;
            };
            ringSize: {
                get: () => number;
                set: (v: number) => void;
            };
        };
        sort: {
            highPrecisionEnabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            minIntervalMs: {
                get: () => number;
                set: (v: number) => void;
            };
            sortSplatDistance: {
                get: () => number;
                set: (v: number) => void;
            };
            sortSplatCoorient: {
                get: () => number;
                set: (v: number) => void;
            };
            sortCameraDistance: {
                get: () => number;
                set: (v: number) => void;
            };
            sortCameraCoorient: {
                get: () => number;
                set: (v: number) => void;
            };
            depthBias: {
                get: () => number;
                set: (v: number) => void;
            };
        };
        composite: {
            enabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            highPrecisionEnabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            toneMapping: {
                get: () => ToneMapping;
                set: (v: ToneMapping) => void;
            };
            exposure: {
                get: () => number;
                set: (v: number) => void;
            };
        };
        highlightKernel: {
            enabled: {
                get: () => boolean;
                set: (v: boolean) => void;
            };
            size: {
                get: () => number;
                set: (v: number) => void;
            };
            color: {
                get: () => number;
                set: (v: number) => void;
            };
            selectedColor: {
                get: () => Vector4;
                set: (v: Vector4) => void;
            };
        };
    };
    notifyChanged(): void;
}

declare enum SplattingRenderMode {
    Default = 0,
    Ring = 1,
    PickingId = 2
}

declare namespace SplatUtils {
    export {
        SplatOperator,
        SplatCenterPrimitiveSource,
        SplatEllipsoidPrimitiveSource,
        SplatCenterPrimitive,
        SplatEllipsoidPrimitive,
        combineSplatData,
        computeDenseBox,
        createSplat,
        createSplatData,
        createSplatModifyData,
        transformSplatFile,
        LodMeta,
        LodConfig,
        LodSplat
    }
}
export { SplatUtils }

/**
 * Build spline curve by an array of controlling points.
 */
declare class SplineCurve2D extends Curve2D {
    points: Vector2[];
    isSplineCurve2D: boolean;
    constructor(points?: Vector2[]);
    serialize(ctx: Serializer): void;
    deserialize(ctx: Deserializer): void;
    className(): string;
    getPointAt(t: number, optionalTarget?: Vector2): Vector2;
    copy(source: SplineCurve2D): this;
    clone(): SplineCurve2D;
    toJSON(): any;
    fromJSON(json: any): this;
}

/**
 * This light gets emitted from a single point in one direction,
 * along a cone that increases in size the further from the light it gets.
 */
export declare class SpotLight<T extends TextureV2 | Texture2D = Texture2D> extends Light {
    viewMatrix: Matrix4;
    invViewMatrix: Matrix4;
    static get DEFAULT_TARGET(): Object3D;
    /**
     * The target is a point in world space used to calculate the direction of light.
     */
    private _target;
    get target(): Object3D;
    set target(t: Object3D);
    private _distance;
    /**
     * Maximum extent of the spotlight, in radians, from its direction. Should be no more than Math.PI/2.
     * @defaultValue `Math.PI/3`
     */
    angle: number;
    /**
     * Percent of the spotlight cone that is attenuated due to penumbra. Takes values between zero and 1.
     * @defaultValue `0`
     */
    penumbra: number;
    /**
     * The intensity scale of IES file.
     * @defaultValue `1`
     */
    iesIntensityScale: number;
    /**
     * Resolution of ies texture.
     * @defaultValue `Vector2(182, 1)`
     */
    iesTextureResolution: Vector2;
    /**
     * The amount the light dims along the distance of the light
     * In physically correct mode, decay = 2 leads to physically realistic light falloff.
     * @defaultValue `1` representing the intensity do not decay with distance increasing.
     */
    decay: number;
    isIESEnabled: boolean;
    /**
     * To support IES, spotLight set isRotationModeOn as true to calculate intensity according to rotation of light.
     * @defaultValue `false` calculate intensity according to target of light.
     */
    isRotationModeOn: boolean;
    /**
     * Check the type whether it belongs to PerspectiveCamera.
     * This value should not be changed by user.
     */
    isSpotLight: boolean;
    defaultDirection: Vector3;
    direction: Vector3;
    private uniforms;
    shadow: SpotShadow<T>;
    private _textureIES_inner;
    protected _textureIES: T;
    get textureIES(): Nullable<T>;
    set textureIES(value: Nullable<T>);
    isShadowNeedsUpdate: boolean;
    private _up;
    destroy(): void;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(color?: number | string, intensity?: number, distance?: number, angle?: number, penumbra?: number, decay?: number, isIESEnabled?: boolean, textureIES?: T, iesIntensityScale?: number, iesTextureResolution?: Vector2);
    /**
     * The light's power.
     * In physically correct mode, the luminous power of the light measured in lumens.
     * This is directly related to the {@link intensity | intensity } in the ratio
     */
    get power(): number;
    set power(power: number);
    getIntensity(): number;
    /**
     * When distance is zero, light does not attenuate.
     * When distance is non-zero, light will attenuate linearly from maximum intensity at the light's position down to zero at this distance from the light.
     */
    get distance(): number;
    set distance(dis: number);
    /**
     * Copy the data to this light instance from source.
     * This method need override in derived classes to copy extended data.
     * @param {SpotLight} source the data source.
     * @param {boolean} recursive if true, descendants of the object are also cloned. Default is true.
     */
    copy(source: SpotLight<T>, recursive?: boolean): this;
    clone(recursive?: boolean): SpotLight<T>;
    getDirection(): Vector3;
    updateUniformForForward(program: WGLProgram, index: number): void;
    updateUniformForDefer(program: WGLProgram): void;
    updateUniformByPrefix(program: WGLProgram, lightPrefix: string, shadowPrefix: string): void;
    static getHeader(isArray: boolean): "\n                uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n                uniform sampler2D spotIES[ NUM_SPOT_LIGHTS ];\n            " | "\n                uniform SpotLight spotLight;\n                uniform sampler2D spotLightIES;\n            ";
    getIESMapOrDefault(): Texture2D | T;
    updateCone(): void;
    isDrawableOutsideLightVolume(drawable: Drawable): boolean;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
}

declare class SpotShadow<T extends TextureV2 | Texture2D = Texture2D> extends SingleProjectShadow<PerspectiveCamera> {
    customNear: number;
    customFar: number;
    isAutoComputeNearFar: boolean;
    shadowCameraNear: number;
    shadowCameraFar: number;
    enableAutoBias: boolean;
    captureScale: Vector2;
    constructor(light: SpotLight<T>);
    className(): string;
    copy(other: SpotShadow<T>): void;
    extendsShader(builder: ShaderBuilder, length: number): void;
    extendsShaderDeferred(builder: ShaderBuilder): void;
    updateSpotNearFar(fullList: DrawableList, light: SpotLight): void;
    updateCameraAndShadowMatrices(light: SpotLight): void;
    updateUniformsImpl(program: WGLProgram, prefix: string): void;
    deserialize(ctx: Deserializer): void;
    serialize(ctx: Serializer): void;
}

/**
 * A sprite is a plane that always faces towards the camera, generally with a partially transparent texture applied.
 */
export declare class Sprite<T extends Texture2D | TextureV2 = Texture2D> extends Drawable<SpriteMaterial_2<T>, BufferGeometry> {
    /**
     * The sprite's anchor point, and the point around which the sprite rotates.
     * A value of (0.5, 0.5) corresponds to the midpoint of the sprite.
     * A value of (0, 0) corresponds to the lower left corner of the sprite. The default is (0.5, 0.5).
     */
    center: Vector2;
    /**
     * The type of this Object3D.
     */
    type: 'Sprite';
    /**
     * Check the type whether it belongs to Sprite.
     * This value should not be changed by user.
     */
    isSprite: true;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(material: SpriteMaterial_2<T>);
    /**
     * Get intersections between a casted {@link Ray| ray} and this Sprite.
     * The method {@link Raycaster.intersectObject| intersectObject()} will call this method, but the results are not ordered.
     * @param {Raycaster} raycaster the instance of Raycaster is used to get the data for calculation.
     * @param {Intersection} intersects the result will be stored here.
     */
    raycastJsImpl(raycaster: Raycaster, intersects: Intersection[]): void;
    /**
     * Return a cloned instance of this class.
     */
    clone(): Sprite<T>;
    /**
     * Copy the data to this instance from other instance.
     * @param {Sprite} other the source of copied data
     */
    copy(source: Sprite<T>): this;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
}

export declare const SpriteMaterial: typeof SpriteMaterial_2<SourceTexture>;

/**
 * A dedicated material of {@link Sprite| Sprite}.
 */
declare class SpriteMaterial_2<T extends Texture2D | TextureV2 = Texture2D> extends Material {
    /**
     * Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.)
     * @defaultValue `false`
     */
    sizeAttenuation: boolean;
    /**
     * The rotation of the sprite in radians.
     * @defaultValue `0`
     */
    rotation: number;
    /**
     * Color of the material, by default set to white (0xffffff).
     * The value of color multiply with the color of {@link texture| texture}.
     */
    color: Readonly<Pick<ReadonlyMarked<Color>, "_readonly_mark" | "cloneReadonly" | "clone" | "g" | "r" | "b" | "isColor" | "equals" | "getHex">>;
    /**
     * A picture for sprite.
     * @defaultValue `null`
     */
    texture: Nullable<T>;
    /**
     * The Transparency of object.
     * @defaultValue `null`
     */
    opacity: number;
    /**
     * The name of instance's class.
     */
    className(): string;
    constructor(p?: SpriteMaterialParameters<T>);
    /**
     * Change the corresponding attribute according to the values of given {@link SpriteMaterialParameters| parameters}.
     * @param {SpriteMaterialParameters} p a object of specified type contains parameters.
     */
    setValues(p: SpriteMaterialParameters<T>): void;
    traverseTexture(visitor: (tex: Texture) => void): void;
    /**
     * Store the attributes of this class into string as serializing format.
     * @param {Serializer} ctx an instance used to store the data of scene objects.
     */
    serialize(ctx: Serializer): void;
    /**
     * Parse the data for this class from string according to serializing format.
     * @param {Deserializer} ctx an instance give the method to take the data for attribute.
     */
    deserialize(ctx: Deserializer): void;
    /**
     * Copy the data to this instance from other instance.
     * @param {MeshBasicMaterial} other the source of copied data
     */
    copy(other: SpriteMaterial_2<T>): this;
    /**
     * Return a cloned instance of this class.
     */
    clone(): SpriteMaterial_2<T>;
}

declare type SpriteMaterialParameters<T extends Texture2D | TextureV2 = Texture2D> = MaterialParameters & ConvertMaterialParameters<Pick<SpriteMaterial_2<T>, 'sizeAttenuation' | 'rotation' | 'opacity' | 'color'>> & {
    texture?: T | null;
};

declare class SpzFile implements IFile {
    private readStream;
    private readLegacyStream;
    read(stream: ReadableStream<Uint8Array>, _contentLength: number, data: IData): Promise<void>;
    write(writeStream: WritableStream<Uint8Array>, data: IData): Promise<void>;
}

/**
 * The stencilFunc method of the WebGL API sets the front and back function and reference value for stencil testing.
 * Stenciling enables and disables drawing on a per-pixel basis. It is typically used in multipass rendering to achieve special effects.
 */
export declare enum StencilFunc {
    NeverStencilFunc = 512,
    LessStencilFunc = 513,
    EqualStencilFunc = 514,
    LessEqualStencilFunc = 515,
    GreaterStencilFunc = 516,
    NotEqualStencilFunc = 517,
    GreaterEqualStencilFunc = 518,
    AlwaysStencilFunc = 519
}

/**
 * The stencilOp method of the WebGL API sets both the front and back-facing stencil test actions.
 */
export declare enum StencilOp {
    ZeroStencilOp = 0,
    KeepStencilOp = 7680,
    ReplaceStencilOp = 7681,
    IncrementStencilOp = 7682,
    DecrementStencilOp = 7683,
    IncrementWrapStencilOp = 34055,
    DecrementWrapStencilOp = 34056,
    InvertStencilOp = 5386
}

declare class StencilState {
    private currentStencilMask;
    private currentStencilFunc;
    private currentStencilRef;
    private currentStencilFuncMask;
    private currentStencilFail;
    private currentStencilZFail;
    private currentStencilZPass;
    currentStencilClear: Nullable<number>;
    private gl;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext);
    setMask(stencilMask: number): void;
    setFunc(stencilFunc: StencilFunc, stencilRef: number, stencilMask: number): void;
    setOp(stencilFail: StencilOp, stencilZFail: number, stencilZPass: number): void;
    setClear(stencil: number): void;
    reset(): void;
}

declare class StylizePlugin extends PipelinePlugin {
    readonly PLUGIN_NAME = "stylize";
    private filterMaterial;
    private get useDepth();
    constructor(scene: SceneAdaptorDispatcher, renderer: RendererAdaptor);
    destroy(): void;
    updateFrameSize(): void;
    updateEffect(): void;
    updateGraphHash(hasher: HashKeyBuilder): void;
    updateRenderGraph(graph: RenderGraph): void;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        temperature: {
            get: () => number;
            set: (v: number) => void;
        };
        tint: {
            get: () => number;
            set: (v: number) => void;
        };
        brightness: {
            get: () => number;
            set: (v: number) => void;
        };
        contrast: {
            get: () => number;
            set: (v: number) => void;
        };
        saturation: {
            get: () => number;
            set: (v: number) => void;
        };
        colorBalance: {
            get: () => Vector3;
            set: (v: Vector3) => void;
        };
        hue: {
            get: () => number;
            set: (v: number) => void;
        };
        lut: {
            get: () => Nullable<Texture>;
            set: (v: Texture | null) => void;
        };
        texture: {
            get: () => Nullable<Texture>;
            set: (v: Texture | null) => void;
        };
        target: {
            get: () => FilterTarget;
            set: (v: FilterTarget) => void;
        };
    };
}

declare type SubTypeMap<T, U, V> = Record<keyof PickedBySubType<T, U>, V> & NotPickedBySubType<T, U>;

export declare class SuperCompressedSplat extends Splat {
    readonly PackType = "super_compressed";
    constructor(counts: number, shDegree: number, splatTex: SourceTexture, sh1Tex?: SourceTexture, sh2Tex?: SourceTexture);
    createUnpackSplatShader(): string;
    createUnpackSHShader(): string;
    onGpuDataPacked(): void;
}

declare class SuperCompressedSplatData extends SplatData {
    counts: number;
    shDegree: number;
    private splatSampler;
    private splatUint8Buffer;
    private splatUint16Buffer;
    private sh1Sampler;
    private sh1Uint8Buffer;
    private sh1Uint32Buffer;
    private sh2Sampler;
    private sh2Uint8Buffer;
    init(counts: number, shDegree: number): void;
    set(i: number, single: ISingleSplat): void;
    setCenter(i: number, x: number, y: number, z: number): void;
    setScale(i: number, sx: number, sy: number, sz: number): void;
    setQuat(i: number, qx: number, qy: number, qz: number, qw: number): void;
    setColor(i: number, r: number, g: number, b: number): void;
    setAlpha(i: number, a: number): void;
    setShN(i: number, shN: number[]): void;
    get(i: number, single: ISingleSplat): void;
    getCenter(i: number, single: ISingleSplat): void;
    getScale(i: number, single: ISingleSplat): void;
    getQuat(i: number, single: ISingleSplat): void;
    getColor(i: number, single: ISingleSplat): void;
    getAlpha(i: number, single: ISingleSplat): void;
    getShN(i: number, shN: number[]): void;
    fillCenters(centers: Float32Array): void;
    serialize(): ISplatData;
    deserialize(data: ISplatData): void;
}

declare const SupportedObjectNames: readonly ["materials"];

declare const SupportedPropertyNames: readonly ["translation", "rotation", "scale", "uvRotation", "uvOffset", "uvScale"];

declare const SupportedScopeNames: readonly ["Materials"];

declare class TAAPlugin extends PipelinePlugin {
    readonly PLUGIN_NAME = "taa";
    private taaMaterial;
    private copyMaterial;
    private taaPingPong;
    private outSampleCount;
    private samples;
    private active;
    get enabled(): boolean;
    set enabled(v: boolean);
    private _maxSampleCount;
    get maxSampleCount(): number;
    set maxSampleCount(v: number);
    private waitingTime;
    private lastResetTimestamp;
    private get isTAAReady();
    get shouldRender(): boolean;
    resetSample(): void;
    destroy(): void;
    updateFrameSize(): void;
    updateEffect(_scene: SceneAdaptor, isFrameStable: boolean, isCameraStable: boolean, effectConfig: IEffectConfig): void;
    updateGraphHash(hasher: HashKeyBuilder): void;
    updateRenderGraph(graph: RenderGraph): void;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        maxSample: {
            get: () => number;
            set: (v: number) => void;
        };
        outputSample: {
            get: () => number;
            set: (v: number) => void;
        };
        waitingTime: {
            get: () => number;
            set: (v: number) => void;
        };
    };
    private get outputScreen();
    tick(): void;
    jitterCamera(camera: Camera3D, width: number, height: number): void;
    jitterClear(camera: Camera3D): void;
}

declare interface TargetLight extends Object3D {
    target: Object3D;
}

/**
 * Base class for texture like data. Each texture match one WebGLTexture
 */
declare abstract class Texture extends ElementEventDispatcher implements ElementsWithGPUResource {
    name: string;
    readonly samplerDescriptor: SamplerDescriptor;
    readonly storageDescriptor: TextureStorageDescriptor;
    isMipmapDisabled: boolean;
    constructor();
    destroy(): void;
    syncBase(): void;
    getUUID(): string;
    disableAutoMipmap(): this;
    copyBaseInfo(other: Texture): this;
    configAsDataTexture(): this;
    configSampler(visitor: (s: SamplerDescriptor) => any): this;
    configSamplerRepeat(): this;
    configTrilinear(): this;
    configDoubleLinear(): this;
    configStorage(visitor: (t: TextureStorageDescriptor) => any): this;
    freeGPU(): void;
    serialize(ctx: Serializer<Texture>): void;
    deserialize(ctx: Deserializer): void;
}

declare class Texture2D extends LegacySourceTexture {
    static get default(): Texture2D;
    className(): string;
    source: TextureMipmapGroup<Texture2DCommonLayer>;
    get main(): Texture2DCommonLayer;
    get width(): number;
    get height(): number;
    constructor(source: TextureMipmapGroup<Texture2DCommonLayer>);
    static createByMainLayer(layer: Texture2DCommonLayer): Texture2D;
    static createByMainLayerSource(source: Texture2DLayerSource, format?: WebGLPixelFormat, type?: TextureDataType, width?: number, height?: number, isHTMLSource?: boolean): Texture2D;
    protected getAutoGeneratedMipmapByteSize(): number;
    serialize(ctx: Serializer<any>): void;
    deserialize(ctx: Deserializer): Promise<void>;
}

/**
 * Concrete 2D texture layer backed by an image-like source or typed array.
 */
declare class Texture2DCommonLayer extends Texture2DLayer {
    source: Texture2DLayerSource;
    format: WebGLPixelFormat;
    type: TextureDataType;
    constructor(source: Texture2DLayerSource, width?: number, height?: number, isHTMLSource?: boolean);
    setSource(source: Texture2DLayerSource, width?: number, height?: number, isHTMLSource?: boolean): void;
    ser(): any;
    static create(source: Texture2DLayerSource, width?: number, height?: number, isHTMLSource?: boolean): Texture2DCommonLayer;
    static createAsync(source: HTMLImageElement): Promise<Texture2DCommonLayer>;
    setFormat(format: WebGLPixelFormat): this;
    setType(type: TextureDataType): this;
}

/**
 * Base upload layer for 2D textures.
 */
declare abstract class Texture2DLayer implements WebGLUploadable {
    __brand: 'WebGLUploadable';
    width: number;
    height: number;
    setWidth(width: number): this;
    setHeight(height: number): this;
    setSize(width: number, height: number): this;
}

declare type Texture2DLayerSource = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | ImageData | ImageBitmap | TypeArray;

/**
 * Texture compression supported by render time compression
 */
declare enum TextureCompression {
    None = 0,
    BC3 = 1,
    BC3HighQuality = 2,
    BC7 = 3
}

declare enum TextureContainerType {
    Image = 0,
    DDS = 1,
    KTX2 = 2
}

declare class TextureCube extends LegacySourceTexture {
    px: TextureCubeSide;
    nx: TextureCubeSide;
    py: TextureCubeSide;
    ny: TextureCubeSide;
    pz: TextureCubeSide;
    nz: TextureCubeSide;
    static get default(): TextureCube;
    className(): string;
    static fromImageArray(arr: HTMLImageElement[]): TextureCube;
    static fromImageArrayAsync(arr: HTMLImageElement[]): Promise<TextureCube>;
    static fromFirstLayerArray(arr: Texture2DCommonLayer[]): TextureCube;
    static fromArray(arr: Array<TextureMipmapGroup<Texture2DCommonLayer>>): TextureCube;
    static defaultEnvMap: TextureCube;
    static getDefaultEnvMap(): Promise<TextureCube>;
    constructor(px: TextureCubeSide, nx: TextureCubeSide, py: TextureCubeSide, ny: TextureCubeSide, pz: TextureCubeSide, nz: TextureCubeSide);
    syncData(): void;
    protected getAutoGeneratedMipmapByteSize(): number;
    serialize(ctx: Serializer<any>): void;
    deserialize(ctx: Deserializer): Promise<void>;
}

/**
 * Mipmapped texture data for one cube-map side.
 */
declare type TextureCubeSide = TextureMipmapGroup<Texture2DCommonLayer>;

/**
 * Specify the data type of texture.
 */
declare enum TextureDataType {
    UnsignedByteType = 5121,
    ByteType = 5120,
    ShortType = 5122,
    UnsignedShortType = 5123,
    IntType = 5124,
    UnsignedIntType = 5125,
    FloatType = 5126,
    HalfFloatType = 5131,
    UnsignedShort4444Type = 32819,
    UnsignedShort5551Type = 32820,
    UnsignedShort565Type = 33635,
    UnsignedInt248Type = 34042,
    UnsignedInt2101010Type = 33640
}

/**
 * Dimensionality of texture storage.
 */
export declare enum TextureDimension {
    D2 = 0,
    D3 = 1
}

/**
 * Texture formats
 * values same as GPUTextureFormat
 * sorted by channels, channel type, [unorm, snorm, uint, sint, float]
 */
export declare enum TextureFormat {
    R8Unorm = "r8unorm",
    R8Snorm = "r8snorm",
    R8Uint = "r8uint",
    R8Sint = "r8sint",
    R16Unorm = "r16unorm",
    R16Snorm = "r16snorm",
    R16Uint = "r16uint",
    R16Sint = "r16sint",
    R16Float = "r16float",
    R32Uint = "r32uint",
    R32Sint = "r32sint",
    R32Float = "r32float",
    Rg8Unorm = "rg8unorm",
    Rg8Snorm = "rg8snorm",
    Rg8Uint = "rg8uint",
    Rg8Sint = "rg8sint",
    Rg16Unorm = "rg16unorm",
    Rg16Snorm = "rg16snorm",
    Rg16Uint = "rg16uint",
    Rg16Sint = "rg16sint",
    Rg16Float = "rg16float",
    Rg32Uint = "rg32uint",
    Rg32Sint = "rg32sint",
    Rg32Float = "rg32float",
    Rgba8Unorm = "rgba8unorm",
    Rgba8Snorm = "rgba8snorm",
    Rgba8Uint = "rgba8uint",
    Rgba8Sint = "rgba8sint",
    Rgba8UnormSrgb = "rgba8unorm-srgb",
    Rgb10a2Unorm = "rgb10a2unorm",
    Rgba16Unorm = "rgba16unorm",
    Rgba16Snorm = "rgba16snorm",
    Rgba16Uint = "rgba16uint",
    Rgba16Sint = "rgba16sint",
    Rgba16Float = "rgba16float",
    Rgba32Uint = "rgba32uint",
    Rgba32Sint = "rgba32sint",
    Rgba32Float = "rgba32float",
    Bgra8Unorm = "bgra8unorm",
    Bgra8UnormSrgb = "bgra8unorm-srgb",
    Depth16Unorm = "depth16unorm",
    Depth24Plus = "depth24plus",
    Depth24PlusStencil8 = "depth24plus-stencil8",
    Astc4x4Unorm = "astc-4x4-unorm",
    Astc4x4UnormSrgb = "astc-4x4-unorm-srgb",
    Astc5x4Unorm = "astc-5x4-unorm",
    Astc5x4UnormSrgb = "astc-5x4-unorm-srgb",
    Astc5x5Unorm = "astc-5x5-unorm",
    Astc5x5UnormSrgb = "astc-5x5-unorm-srgb",
    Astc6x5Unorm = "astc-6x5-unorm",
    Astc6x5UnormSrgb = "astc-6x5-unorm-srgb",
    Astc6x6Unorm = "astc-6x6-unorm",
    Astc6x6UnormSrgb = "astc-6x6-unorm-srgb",
    Astc8x5Unorm = "astc-8x5-unorm",
    Astc8x5UnormSrgb = "astc-8x5-unorm-srgb",
    Astc8x6Unorm = "astc-8x6-unorm",
    Astc8x6UnormSrgb = "astc-8x6-unorm-srgb",
    Astc8x8Unorm = "astc-8x8-unorm",
    Astc8x8UnormSrgb = "astc-8x8-unorm-srgb",
    Astc10x5Unorm = "astc-10x5-unorm",
    Astc10x5UnormSrgb = "astc-10x5-unorm-srgb",
    Astc10x6Unorm = "astc-10x6-unorm",
    Astc10x6UnormSrgb = "astc-10x6-unorm-srgb",
    Astc10x8Unorm = "astc-10x8-unorm",
    Astc10x8UnormSrgb = "astc-10x8-unorm-srgb",
    Astc10x10Unorm = "astc-10x10-unorm",
    Astc10x10UnormSrgb = "astc-10x10-unorm-srgb",
    Astc12x10Unorm = "astc-12x10-unorm",
    Astc12x10UnormSrgb = "astc-12x10-unorm-srgb",
    Astc12x12Unorm = "astc-12x12-unorm",
    Astc12x12UnormSrgb = "astc-12x12-unorm-srgb",
    Bc1RgbaUnorm = "bc1-rgba-unorm",
    Bc2RgbaUnorm = "bc2-rgba-unorm",
    Bc3RgbaUnorm = "bc3-rgba-unorm",
    Bc7RgbaUnorm = "bc7-rgba-unorm",
    Bc7RgbaUnormSrgb = "bc7-rgba-unorm-srgb",
    Etc2Rgb8Unorm = "etc2-rgb8unorm",
    Etc2Rgb8UnormSrgb = "etc2-rgb8unorm-srgb",
    Etc2Rgba8Unorm = "etc2-rgba8unorm",
    Etc2Rgba8UnormSrgb = "etc2-rgba8unorm-srgb"
}

declare class TextureManager {
    private renderer;
    private isWebGL1;
    private webglTextureMap;
    private bufferAttachmentMap;
    private totalUserByteSize;
    private totalInternalByteSize;
    constructor(renderer: Renderer);
    getWebGLByteSize(): number;
    getInternalWebGLByteSize(): number;
    get(texture: Texture, glState: WGLState): WGLTextureData;
    getAttachment(attachment: RenderAttachment, glState: WGLState): WGLRenderAttachment;
    private createRenderBuffer;
    private onTextureDispose;
    private onAttachmentDispose;
    freeGPU(): void;
}

/**
 * Container for texture data and their mipmap
 */
declare class TextureMipmapGroup<T extends WebGLUploadable> {
    texture?: Texture;
    /**
     * Main layer
     */
    get main(): T;
    set main(v: T);
    mipmaps: T[];
    constructor(main: T[]);
    syncData(texture?: Texture, layer?: number): void;
    static create<T extends WebGLUploadable>(main: T): TextureMipmapGroup<T>;
    static fromArray<T extends WebGLUploadable>(arr: T[]): TextureMipmapGroup<T>;
    modifyMain(visitor: (T: T) => any): this;
    modifyMipmap(layer: number, visitor: (T: T) => any): this;
    setMipmap(mipmap: T, level: number): this;
    pushMipmap(mipmap: T): this;
}

declare class TextureState {
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    private currentTextureSlot;
    private currentBindTextures;
    private slot;
    private textureSlotMap;
    private limits;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, limits: WebGLLimits);
    activeTexture(slot: number): void;
    bindTextureAndActiveForUploading(webglType: WebGLTextureType, webglTexture: WebGLTexture): void;
    bindTextureAt(webglType: WebGLTextureType, webglTexture: WebGLTexture, slot: number): void;
    resetSlotIndex(): void;
    getFreeSlot(): number;
}

declare class TextureStorageDescriptor {
    /**
     * If set to true, the texture is flipped along the vertical axis when uploaded to the GPU.
     * @defaultValue `true`
     */
    flipY: boolean;
    /**
     * If set to true, the alpha channel, if present, is multiplied into the color channels when the texture is uploaded to the GPU.
     * @defaultValue `false`
     */
    premultipliedAlpha: boolean;
    /**
     * valid values: 1, 2, 4, 8 (see <a href="http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml">glPixelStorei</a> for more details)
     */
    /**
     * @deprecated unsupported, always be 4
     */
    unpackAlignment: 1 | 2 | 4 | 8;
    copy(other: TextureStorageDescriptor): void;
    serialize(ctx: Serializer<any>): void;
    deserialize(ctx: Deserializer): void;
}

/**
 * A new texture base with immutable size after creation.
 * TextureV2 will represent any texture type(2D/2DArray/3D/Cube and etc..).
 */
declare abstract class TextureV2 extends Texture {
    readonly format: TextureFormat;
    readonly width: number;
    readonly height: number;
    readonly depthOrArrayLayers: number;
    readonly sampleCount: number;
    readonly levels: number;
    readonly mipmaps: boolean;
    readonly byteSize: number;
    constructor(dimension: TextureDimension, viewDimension: TextureViewDimension, format: TextureFormat, width: number, height: number, depthOrArrayLayers: number, sampleCount: number, mipmaps: boolean, isInternal: boolean);
}

/**
 * View shape used when sampling a texture.
 */
export declare enum TextureViewDimension {
    D2 = 0,
    D2Array = 1,
    Cube = 2,
    D3 = 3
}

/**
 * Tone mapping functions
 */
export declare enum ToneMapping {
    Linear = 0,
    Reinhard = 1,
    ACES = 2,
    ACESFilmic = 3,
    Neutral = 4
}

declare interface Topology {
    __topologyTypeMark: PrimitiveTopology;
}

declare interface TrackPath {
    scope?: (typeof SupportedScopeNames)[number];
    nodeName?: string;
    objectName?: (typeof SupportedObjectNames)[number];
    objectIndex?: string;
    propertyName: (typeof SupportedPropertyNames)[number];
    propertyIndex?: string;
}

declare function transformSplatFile(source: SplatData, outType: SplatFileType): ReadableStream<Uint8Array>;

declare class TransparentLinePlugin extends PipelinePlugin {
    readonly PLUGIN_NAME = "transparent_line";
    private edgeThreshold;
    private enabledOriginShading;
    private enableDrawAdditional;
    private lineMat;
    private lineD;
    private basicMat;
    private basicD;
    private hideMat;
    constructor(scene: SceneAdaptorDispatcher, renderer: RendererAdaptor);
    destroy(): void;
    updateFrameSize(): void;
    updateEffect(): void;
    updateGraphHash(hasher: HashKeyBuilder): void;
    updateRenderGraph(graph: RenderGraph): void;
    private transform;
    createConfig(): {
        enabled: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        opacity: {
            get: () => number;
            set: (v: number) => void;
        };
        transparentColor: {
            get: () => Color;
            set: (v: Color) => void;
        };
        lineColor: {
            get: () => Color;
            set: (v: Color) => void;
        };
        edgeThreshold: {
            get: () => number;
            set: (v: number) => void;
        };
        drawWithOriginalMaterial: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
        drawAdditionalLines: {
            get: () => boolean;
            set: (v: boolean) => void;
        };
    };
}

/**
 * A geometric triangle as defined by three {@link Vector3| Vector3} representing its three corners.
 */
declare class Triangle {
    /**
     * The first corner of the triangle.
     * @defaultValue is (0, 0, 0).
     */
    a: Vector3;
    /**
     * The second corner of the triangle.
     * @defaultValue is (0, 0, 0).
     */
    b: Vector3;
    /**
     * The final corner of the triangle.
     * @defaultValue is (0, 0, 0).
     */
    c: Vector3;
    constructor(a?: Vector3, b?: Vector3, c?: Vector3);
    /**
     * Calculate the {@link https://en.wikipedia.org/wiki/Normal_(geometry)| normal vector} of the triangle.
     */
    static getNormal(a: Vector3, b: Vector3, c: Vector3, target: Vector3): Vector3;
    /**
     * Return a {@link https://en.wikipedia.org/wiki/Barycentric_coordinate_system| barycentric coordinate} from the given vector.
     */
    static getBarycoord(point: Vector3, a: Vector3, b: Vector3, c: Vector3, target: Vector3): Vector3;
    /**
     * Returns true if the passed point, when projected onto the plane of the triangle, lies within the triangle.
     */
    static containsPoint(point: Vector3, a: Vector3, b: Vector3, c: Vector3): boolean;
    /**
     * Calculate the uv value of given point by a,b,c and their uv.
     * @param target the result will be stored here.
     */
    static getUV(point: Vector3, a: Vector3, b: Vector3, c: Vector3, uv1: Vector2, uv2: Vector2, uv3: Vector2, target: Vector2): Vector2;
    /**
     * Sets the triangle's {@link a| a}, {@link b| b} and {@link c| c} properties to the passed {@link Vector3| vector3}.<br>
     * Please note that this method only copies the values from the given objects.
     */
    set(a: Vector3, b: Vector3, c: Vector3): Triangle;
    /**
     * Sets the triangle's vectors to the vectors in the array.
     * @param points array of {@link Vector3| Vector3}.
     * @param i0 {@link Integer| Integer} index.
     * @param i1 {@link Integer| Integer} index.
     * @param i2 {@link Integer| Integer} index.
     */
    setFromPointsAndIndices(points: Vector3[], i0: number, i1: number, i2: number): Triangle;
    /**
     * Returns a new triangle with the same {@link a| a}, {@link b| b} and  {@link c| c} properties as this one.
     */
    clone(): Triangle;
    /**
     * Copies the values of the passed triangle's {@link a| a}, {@link b| b} and {@link c| c} properties to this triangle.
     */
    copy(triangle: Triangle): Triangle;
    /**
     * Return the area of the triangle.
     */
    getArea(): number;
    /**
     * Calculate the midpoint of the triangle.
     * @param target the result will be copied into this Vector3.
     */
    getMidpoint(target: Vector3): Vector3;
    /**
     * Calculate the {@link https://en.wikipedia.org/wiki/Normal_(geometry)| normal vector } of the triangle.
     * @param target the result will be copied into this Vector3.
     */
    getNormal(target: Vector3): Vector3;
    /**
     * Use this triangle to calculate {@link Triangle.getBarycoord| barycentric coordinate}.
     */
    getBarycoord(point: Vector3, target: Vector3): Vector3;
    /**
     * Returns true if the passed point, when projected onto the plane of the triangle, lies within the triangle.
     * @param point {@link Vector3| Vector3} to check.
     */
    containsPoint(point: Vector3): boolean;
    /**
     * Use this triangle to calculate {@link Triangle.getUV| UV }.
     */
    getUV(point: Vector3, uv1: Vector2, uv2: Vector2, uv3: Vector2, result: Vector2): Vector2;
    /**
     * Determines whether or not this triangle intersects {@link Box3| box}.
     * @param box Box to check for intersection against.
     */
    intersectsBox(box: Box3): boolean;
    /**
     * Returns true if the two triangles have identical {@link a| a}, {@link b| b} and {@link c| c} properties.
     */
    equals(triangle: Triangle): boolean;
    /**
     * Returns the closest point on the triangle to {@link Vector3| point}.
     */
    closestPointToPoint(p: Vector3, target: Vector3): Vector3;
}

/**
 * Topology marker for triangle-list buffer geometry.
 */
declare class TriangleList implements Topology {
    __topologyTypeMark: PrimitiveTopology.Triangle;
    __tl: boolean;
}

/**
 * Union of typed-array.
 */
declare type TypeArray = Float32Array | Float64Array | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array;

/**
 * All functions in this class is static and is used to recognize if an object belongs to certain class.
 * Every value as return is boolean variable.
 */
export declare class TypeAssert {
    static isObject3D(o: any): o is Object3D;
    static isDrawable(o: any): o is Drawable;
    static isMaterial(m: any): m is Material;
    static isShaderComponent(c: any): c is ShaderComponent;
    static isArrayCamera(camera: any): camera is ArrayCamera;
    static isDeferredMaterial(m: Material): m is DeferredMaterial;
    static isPopBufferGeometry(geometry: any): geometry is PopBufferGeometry;
    static isBufferGeometry(geometry: any): geometry is BufferGeometry;
    static isInstancedBufferGeometry(geometry: any): geometry is InstancedBufferGeometry;
    static isFatlineBufferGeometry(geometry: any): geometry is FatLineBufferGeometry;
    static isGeometry(geometry: any): geometry is Geometry;
    static isMesh(obj: any): obj is Mesh;
    static isPopMesh(obj: any): obj is PopMesh;
    static isSkinnedMesh(obj: any): obj is SkinnedMesh;
    static isLineLike(obj: any): obj is Line | LineSegments | FatLineSegments;
    static isFatLineSegmentsDecideByUser(object: any): object is FatLineSegments;
    static isFatLineSegments(object: any): object is FatLineSegments;
    static isLineSegments(object: any): object is LineSegments;
    static isLine(object: any): object is Line;
    static isPoints(object: any): object is Points;
    static isSplat(object: any): object is Splat;
    static isLight(obj: any): obj is Light;
    static isShadow(obj: any): obj is Shadow<any>;
    static isSprite(obj: any): obj is Sprite;
    static isInstanceMesh(obj: any): obj is InstanceMesh;
    static isCamera3D(camera: any): camera is Camera3D;
    static isPerspectiveCamera(camera: Camera3D): camera is PerspectiveCamera;
    static isOrthographicCamera(camera: Camera3D): camera is OrthographicCamera;
    static isEllipseCurve2D(curve: Curve2D): curve is EllipseCurve2D;
    static isSplineCurve2D(curve: Curve2D): curve is SplineCurve2D;
    static isLineCurve2D(curve: Curve2D): curve is LineCurve2D;
    static isBufferAttribute(item: any): item is BufferAttribute;
    static isInstancedBufferAttribute(item: any): item is InstancedBufferAttribute;
    static isAmbientLight(value: any): value is AmbientLight;
    static isDirectionalLight(value: any): value is DirectionalLight;
    static isSpotLight(value: any): value is SpotLight;
    static isPointLight(value: any): value is PointLight;
    static isRectAreaLight(value: any): value is RectAreaLight;
    static isDiskAreaLight(value: any): value is DiskAreaLight;
    static isHemisphereLight(value: any): value is HemisphereLight;
    static isLightableMaterial(value: any): value is LightableMaterial;
    static isSpriteMaterial(value: any): value is SpriteMaterial_2;
    static isMeshBasicMaterial(value: any): value is MeshBasicMaterial_2;
    static isMeshPhongMaterial(value: any): value is MeshPhongMaterial_2;
    static isMergedMeshPhongMaterial(value: any): value is MergedMeshPhongMaterial;
    static isMeshDepthMaterial(value: any): value is MeshDepthMaterial;
}

declare type TypedArray = Float32Array | Float64Array | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array;

declare type TypedArray_2 = Float32Array | Uint32Array | Uint16Array | Uint8Array | Int32Array | Int16Array | Int8Array;

declare type TypedArray_3 = Float32Array | Float64Array | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array;

declare interface UBOItem {
    value: Flattenable | number;
    offset: number;
    isDirty: boolean;
}

declare class UBOManager {
    private gl;
    private bindingPoints;
    private UBOMap;
    private totalByteSize;
    constructor(gl: WebGL2RenderingContext);
    getWebGLByteSize(): number;
    bindUBO(ubo: WebGLBuffer, bindPoint: number): void;
    private _create;
    create(provider: UniformBlockObject): WebGLBuffer;
    delete(provider: UniformBlockObject): void;
    freeGPU(): void;
}

declare interface UniformArrayDescriptor {
    length: number;
    des: ShaderInputDescriptor;
}

declare interface UniformBlockDescriptor {
    name: string;
    uniforms: ShaderInputDescriptor[];
}

declare class UniformBlockObject {
    uniforms: ShaderInputDescriptor[];
    uniformArrays: UniformArrayDescriptor[];
    buffer: Nullable<Float32Array>;
    isDirty: boolean;
    version: number;
    data: Map<string, UBOItem>;
    arrayData: Map<string, UBOItem>;
    readonly name: string;
    constructor(name: string);
    static spawn(name: string): UniformBlockObject;
    createItem(name: string, type: WebGLShaderDataType, defaultValue: any): this;
    createItemArray(name: string, type: WebGLShaderDataType, length: number, defaultValue: any): this;
    getDescriptor(): UniformBlockDescriptor;
    setItem(name: string, value: any): void;
    getItem(name: string): any;
    getUBOBuffer(): Float32Array;
    private setupLayout;
    updateWebGL(program: WGLProgram): void;
    createShaderHeader(supportUBO: boolean): string;
}

declare type UniformGeneralTypes = UniformUploadTypes | Color | Matrix3 | Matrix4 | Vector2 | Vector3 | Vector4 | ReadonlyMatrix4 | ReadonlyMatrix3 | ReadonlyColor | ReadonlyVector2 | ReadonlyVector3 | ReadonlyVector4;

declare type UniformUploadTypes = boolean | number | Float32Array | Int32Array | number[];

declare type UniformValue = boolean | number | Vector3 | Vector4 | SourceTexture;

declare type UniformValues = Record<string, UniformValue>;

declare class VAOManager {
    private gl;
    private webglVAOMap;
    private VAOExtension;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, extensions: WGLExtensions);
    create(bufferGeometry: BufferGeometryBase, attributeKey: string): boolean;
    delete(bufferGeometry: BufferGeometryBase): void;
    freeGPU(): void;
}

declare interface Vector {
    setComponent(index: number, value: number): void;
    getComponent(index: number): number;
    copy(v: this): Vector;
    add(v: Vector): Vector;
    addVectors(a: Vector, b: Vector): Vector;
    sub(v: Vector): Vector;
    subVectors(a: Vector, b: Vector): Vector;
    multiplyScalar(s: number): Vector;
    divideScalar(s: number): Vector;
    negate(): Vector;
    dot(v: Vector): number;
    lengthSq(): number;
    length(): number;
    normalize(): Vector;
    distanceTo?(v: Vector): number;
    distanceToSquared?(v: Vector): number;
    setLength(l: number): Vector;
    lerp(v: Vector, alpha: number): Vector;
    equals(v: Vector): boolean;
    clone(): Vector;
    toArray(arr?: number[]): number[];
}

/**
 * Class representing a 2D {@link https://en.wikipedia.org/wiki/Vector_space| vector}.
 * A 2D vector is an ordered pair of numbers (labeled x and y).
 */
export declare class Vector2 implements Vector {
    /**
     * the x value of this vector.
     * @defaultValue `0`.
     */
    x: number;
    /**
     * the y value of this vector.
     * @defaultValue `0`.
     */
    y: number;
    /**
     * Check the type whether it belongs to Vector2.
     * This value should not be changed by user.
     */
    isVector2: boolean;
    constructor(_x?: number, _y?: number);
    /**
     * Same to x.
     */
    get width(): number;
    set width(w: number);
    /**
     * Same to y.
     */
    get height(): number;
    set height(h: number);
    /**
     * Sets the {@link x| x} and {@link y| y} components of this vector.
     */
    set(x: number, y: number): Vector2;
    /**
     * Sets the {@link x| x} and {@link y| y} values of this vector both equal to scalar.
     */
    setScalar(scalar: number): Vector2;
    /**
     * Replaces this vector's {@link x| x} value with {@link Float| x}.
     */
    setX(x: number): Vector2;
    /**
     * Replaces this vector's {@link y| y} value with {@link Float| y}.
     */
    setY(y: number): Vector2;
    /**
     * If index equals 0 set {@link x| x} to {@link Float| value}.
     * If index equals 1 set {@link y| y} to {@link Float| value}.
     */
    setComponent(index: number, value: number): Vector2;
    /**
     * If index equals 0 returns the {@link x| x} value.
     * If index equals 1 returns the {@link y| y} value.
     * @param index 0 or 1.
     */
    getComponent(index: number): number;
    /**
     * Returns a new Vector2 with the same {@link x| x} and {@link y| y} values as this one.
     */
    clone(): Vector2;
    cloneReadonly(): ReadonlyVector2;
    /**
     * Copies the values of the passed Vector2's {@link x| x} and {@link y| y} properties to this Vector2.
     */
    copy(v: Vector2): Vector2;
    /**
     * Adds {@link Vector2| v} to this vector.
     */
    add(v: Vector2): Vector2;
    /**
     * Adds the scalar value s to this vector's {@link x| x} and {@link y| y} values.
     */
    addScalar(s: number): Vector2;
    /**
     * Sets this vector to {@link Vector2| a} + {@link Vector2| b}.
     */
    addVectors(a: Vector2, b: Vector2): Vector2;
    /**
     * Adds the multiple of {@link Vector2| v} and s to this vector.
     */
    addScaledVector(v: Vector2, s: number): Vector2;
    /**
     * Subtracts {@link Vector2| v} from this vector.
     */
    sub(v: Vector2): Vector2;
    /**
     * Subtracts s from this vector's {@link x| x} and {@link y| y} components.
     */
    subScalar(s: number): Vector2;
    /**
     * Sets this vector to {@link Vector2| a} - {@link Vector2| b}.
     */
    subVectors(a: Vector2, b: Vector2): Vector2;
    /**
     * Multiplies this vector by {@link Vector2| v}.
     */
    multiply(v: Vector2): Vector2;
    /**
     * Multiplies this vector by scalar s.
     */
    multiplyScalar(scalar: number): Vector2;
    /**
     * Divides this vector by {@link Vector2| v}.
     */
    divide(v: Vector2): Vector2;
    /**
     * Divides this vector by scalar s.<br />
     * Sets vector to `( 0, 0 )` if s = 0.
     */
    divideScalar(scalar: number): Vector2;
    /**
     * Multiplies this vector (with an implicit 1 as the 3rd component) by m.
     */
    applyMatrix3(m: Matrix3): Vector2;
    /**
     * Multiplies this vector (with an implicit 1 as the 4rd component) by m.
     */
    applyMatrix4(m: Matrix4): Vector2;
    /**
     * If this vector's x or y value is greater than the max vector's x or y value, it is replaced by the corresponding value.
     * If this vector's x or y value is less than the min vector's x or y value, it is replaced by the corresponding value.
     * @param min the minimum x and y values.
     * @param max the maximum x and y values in the desired range.
     */
    min(v: Vector2): Vector2;
    /**
     * If this vector's x or y value is greater than the max vector's x or y value, it is replaced by the corresponding value.
     * If this vector's x or y value is less than the min vector's x or y value, it is replaced by the corresponding value.
     * @param min the minimum x and y values.
     * @param max the maximum x and y values in the desired range.
     */
    max(v: Vector2): Vector2;
    /**
     * If this vector's x or y value is greater than the max vector's x or y value, it is replaced by the corresponding value. <br /><br />
     * If this vector's x or y value is less than the min vector's x or y value, it is replaced by the corresponding value.
     * @param min the minimum x and y values.
     * @param max the maximum x and y values in the desired range.
     */
    clamp(min: Vector2, max: Vector2): Vector2;
    /**
     * If this vector's x or y values are greater than the max value, they are replaced by the max value. <br /><br />
     * If this vector's x or y values are less than the min value, they are replaced by the min value.
     * @param min the minimum value the components will be clamped to.
     * @param max the maximum value the components will be clamped to.
     */
    clampScalar(minVal: number, maxVal: number): Vector2;
    /**
     * If this vector's length is greater than the max value, it is replaced by the max value. <br /><br />
     * If this vector's length is less than the min value, it is replaced by the min value.
     * @param min the minimum value the length will be clamped to.
     * @param max the maximum value the length will be clamped to.
     */
    clampLength(min: number, max: number): Vector2;
    /**
     * The components of this vector are rounded down to the nearest integer value.
     */
    floor(): Vector2;
    /**
     * The {@link x| x} and {@link y| y} components of this vector are rounded up to the nearest integer value.
     */
    ceil(): Vector2;
    /**
     * The components of this vector are rounded to the nearest integer value.
     */
    round(): Vector2;
    /**
     * The components of this vector are rounded towards zero (up if negative, down if positive) to an integer value.
     */
    roundToZero(): Vector2;
    /**
     * Inverts this vector - i.e. sets x = -x and y = -y.
     */
    negate(): Vector2;
    /**
     * Calculates the {@link https://en.wikipedia.org/wiki/Dot_product| dot product} of this vector and {@link Vector2| v}.
     */
    dot(v: Vector2): number;
    /**
     * Calculates the cross product of this vector and {@link Vector2| v}.
     * @tips that a 'cross-product' in 2D is not well-defined. This function computes a geometric cross-product often used in 2D graphics
     */
    cross(v: Vector2): number;
    /**
     * Computes the square of the {@link https://en.wikipedia.org/wiki/Euclidean_distance| Euclidean length } (straight-line length) from (0, 0) to (x, y).
     * If you are comparing the lengths of vectors, you should compare the length squared instead as it is slightly more efficient to calculate.
     */
    lengthSq(): number;
    /**
     * Computes the Euclidean length (straight-line length) from (0, 0) to (x, y).
     */
    length(): number;
    /**
     * Computes the {@link http://en.wikipedia.org/wiki/Taxicab_geometry| Manhattan length } of this vector.
     */
    manhattanLength(): number;
    /**
     * Converts this vector to a {@link https://en.wikipedia.org/wiki/Unit_vector| unit vector }.
     * that is, sets it equal to a vector with the same direction as this one, but {@link length| length} 1.
     */
    normalize(): Vector2;
    /**
     * Computes the angle in radians of this vector with respect to the positive x-axis.
     */
    angle(): number;
    /**
     * Computes the distance from this vector to {@link Vector2| v}.
     */
    distanceTo(v: Vector2): number;
    /**
     * Computes the squared distance from this vector to {@link Vector2| v}.
     * If you are just comparing the distance with another distance,
     * you should compare the distance squared instead as it is slightly more efficient to calculate.
     */
    distanceToSquared(v: Vector2): number;
    /**
     * Computes the {@link https://en.wikipedia.org/wiki/Taxicab_geometry| Manhattan distance} from this vector to {@link Vector2| v}.
     */
    manhattanDistanceTo(v: Vector2): number;
    /**
     * Sets this vector to a vector with given length the same direction as this one.
     */
    setLength(length: number): Vector2;
    /**
     * Linearly interpolates between this vector and {@link Vector2| v},
     * where alpha is the percent distance along the line - alpha = 0 will be this vector, and alpha = 1 will be {@link Vector2| v}.
     * @param v {@link Vector2| Vector2} to interpolate towards.
     * @param alpha interpolation factor, typically in the closed interval [0, 1].
     */
    lerp(v: Vector2, alpha: number): Vector2;
    /**
     * Sets this vector to be the vector linearly interpolated between {@link Vector2| v1} and
     * {@link Vector2| v2} where alpha is the percent distance along the line connecting the two vectors -
     * alpha = 0 will be {@link Vector2| v1}, and alpha = 1 will be {@link Vector2| v2}.
     * @param v1 the starting {@link Vector2| Vector2}.
     * @param v2 {@link Vector2| Vector2} to interpolate towards.
     * @param alpha interpolation factor, typically in the closed interval [0, 1].
     */
    lerpVectors(v1: Vector2, v2: Vector2, alpha: number): Vector2;
    /**
     * Checks for strict equality of this vector and {@link Vector2| v}.
     */
    equals(v: Vector2): boolean;
    /**
     * Sets this vector's {@link x| x} value to be array[ offset ] and {@link y| y} value to be array[ offset + 1 ].
     * @param array the source array.
     * @param offset (optional) offset into the array.
     * @defaultValue is 0.
     */
    fromArray(array: ArrayLike<number>, offset?: number): Vector2;
    /**
     * There are 2 elements in this vector.
     */
    getNumberCount(): number;
    /**
     * Returns an array [x, y], or copies x and y into the provided array.
     * @param array (optional) array to store this vector to. If this is not provided, a new array will be created.
     * @param offset (optional) optional offset into the array.
     */
    toArray(array?: number[], offset?: number): number[];
    /**
     * @deprecated please use BufferAttribute.getVector2
     * Sets this vector's {@link .x| x} and {@link .y| y} values from the {@link BufferAttribute| attribute}.
     * @param attribute the source attribute.
     * @param index index in the attribute.
     */
    fromBufferAttribute(attribute: {
        getX: (number: number) => number;
        getY: (number: number) => number;
    }, index: number, offset?: number): Vector2;
    /**
     * Rotates this vector around {@link Vector2| center} by {@link Float| angle} radians.
     * @param center the point around which to rotate.
     * @param angle the angle to rotate, in radians.
     */
    rotateAround(center: Vector2, angle: number): Vector2;
    intoSize(): Size;
}

/**
 * Class representing a 3D {@link https://en.wikipedia.org/wiki/Vector_space| vector}.
 * A 3D vector is an ordered triplet of numbers (labeled x, y, and z).
 */
export declare class Vector3 implements Vector {
    /**
     * the x value of this vector.
     * @defaultValue `0`.
     */
    x: number;
    /**
     * the y value of this vector.
     * @defaultValue `0`.
     */
    y: number;
    /**
     * the z value of this vector.
     * @defaultValue `0`.
     */
    z: number;
    /**
     * Check the type whether it belongs to Vector3.
     * This value should not be changed by user.
     */
    isVector3: boolean;
    constructor(_x?: number, _y?: number, _z?: number);
    /**
     * If NaN exists in three elements, return true.
     */
    hasNan(): boolean;
    /**
     * Set the {@link x| x}, {@link y| y} and {@link z| z} components of this vector.
     */
    set(x: number, y: number, z: number): Vector3;
    /**
     * Set the {@link x| x}, {@link y| y} and {@link z| z} values of this vector both equal to scalar.
     */
    setScalar(scalar: number): Vector3;
    /**
     * Replace this vector's {@link x| x} value with x.
     */
    setX(x: number): Vector3;
    /**
     * Replace this vector's {@link y| y} value with y.
     */
    setY(y: number): Vector3;
    /**
     * Replace this vector's {@link z| z} value with z.
     */
    setZ(z: number): Vector3;
    /**
     * If index equals 0 set {@link x| x} to {@link Float| value}.
     * If index equals 1 set {@link y| y} to {@link Float| value}.
     * If index equals 2 set {@link z| z} to {@link Float| value}.
     */
    setComponent(index: number, value: number): Vector3;
    /**
     * If index equals 0 returns the {@link x| x} value.
     * If index equals 1 returns the {@link y| y} value.
     * If index equals 2 returns the {@link z| z} value.
     * @param index 0, 1 or 2.
     */
    getComponent(index: number): number;
    /**
     * Returns a new vector3 with the same {@link x| x}, {@link y| y} and {@link z| z} values as this one.
     */
    clone(): Vector3;
    cloneReadonly(): ReadonlyVector3;
    /**
     * Copies the values of the passed vector3's {@link x| x}, {@link y| y} and {@link z| z} properties to this vector3.
     */
    copy(v: Vector3): Vector3;
    /**
     * Adds {@link Vector3| v} to this vector.
     */
    add(v: Vector3): Vector3;
    /**
     * Adds the scalar value s to this vector's {@link x| x}, {@link y| y} and {@link z| z} values.
     */
    addScalar(s: number): Vector3;
    /**
     * Sets this vector to {@link Vector3| a} + {@link Vector3| b}.
     */
    addVectors(a: Vector3, b: Vector3): Vector3;
    /**
     * Adds the multiple of {@link Vector3| v} and s to this vector.
     */
    addScaledVector(v: Vector3, s: number): Vector3;
    /**
     * Subtracts {@link Vector3| v} from this vector.
     */
    sub(v: Vector3): Vector3;
    /**
     * Subtracts s from this vector's {@link x| x}, {@link y| y} and {@link z| z} components.
     */
    subScalar(s: number): Vector3;
    /**
     * Sets this vector to {@link Vector3| a} - {@link Vector3| b}.
     */
    subVectors(a: Vector3, b: Vector3): Vector3;
    /**
     * Multiplies this vector by {@link Vector3| v}.
     */
    multiply(v: Vector3): Vector3;
    /**
     * Multiplies this vector by scalar s.
     */
    multiplyScalar(scalar: number): Vector3;
    /**
     * Sets this vector equal to {@link Vector3| a} * {@link Vector3| b}, component-wise.
     */
    multiplyVectors(a: Vector3, b: Vector3): Vector3;
    /**
     * Multiplies this vector by {@link Matrix3| m}
     */
    applyMatrix3(m: Matrix3): Vector3;
    /**
     * Multiplies this vector (with an implicit 1 in the 4th dimension) and m, and divides by perspective.
     */
    applyMatrix4(m: Matrix4): Vector3;
    /**
     * Applies a {@link Quaternion| Quaternion} transform to this vector.
     */
    applyQuaternion(q: Quaternion): Vector3;
    /**
     * Projects this vector from world space into the camera's normalized device coordinate (NDC) space.
     * @param camera camera to use in the projection.
     */
    project(camera: Camera3D): Vector3;
    /**
     * Projects this vector from the camera's normalized device coordinate (NDC) space into world space.
     * @param camera camera to use in the projection.
     */
    unproject(camera: Camera3D): Vector3;
    /**
     * Transforms the direction of this vector by a matrix (the upper left 3 x 3 subset of a {@link Matrix4| m}) and then {@link normalize| normalizes} the result.
     */
    transformDirection(m: Matrix4): Vector3;
    /**
     * Divides this vector by {@link Vector3| v}.
     */
    divide(v: Vector3): Vector3;
    /**
     * Divides this vector by scalar s.
     * Sets vector to `( 0, 0, 0 )` if `s = 0`.
     */
    divideScalar(scalar: number): Vector3;
    /**
     * If this vector's x, y or z value is greater than the max vector's x, y or z value, it is replaced by the corresponding value. <br /><br />
     * If this vector's x, y or z value is less than the min vector's x, y or z value, it is replaced by the corresponding value.
     * @param min the minimum {@link x| x}, {@link y| y} and {@link z| z} values.
     * @param max the maximum {@link x| x}, {@link y| y} and {@link z| z} values in the desired range.
     */
    min(v: Vector3): Vector3;
    /**
     * If this vector's x, y or z value is greater than the max vector's x, y or z value, it is replaced by the corresponding value. <br /><br />
     * If this vector's x, y or z value is less than the min vector's x, y or z value, it is replaced by the corresponding value.
     * @param min the minimum {@link x| x}, {@link y| y} and {@link z| z} values.
     * @param max the maximum {@link x| x}, {@link y| y} and {@link z| z} values in the desired range.
     */
    max(v: Vector3): Vector3;
    /**
     * If this vector's x, y or z value is greater than the max vector's x, y or z value, it is replaced by the corresponding value. <br /><br />
     * If this vector's x, y or z value is less than the min vector's x, y or z value, it is replaced by the corresponding value.
     * @param min the minimum {@link x| x}, {@link y| y} and {@link z| z} values.
     * @param max the maximum {@link x| x}, {@link y| y} and {@link z| z} values in the desired range.
     */
    clamp(min: Vector3, max: Vector3): Vector3;
    /**
     * If this vector's x, y or z values are greater than the max value, they are replaced by the max value. <br /><br />
     * If this vector's x, y or z values are less than the min value, they are replaced by the min value.
     * @param min the minimum value the components will be clamped to.
     * @param max the maximum value the components will be clamped to.
     */
    clampScalar(minVal: number, maxVal: number): Vector3;
    /**
     * If this vector's length is greater than the max value, the vector will be scaled down so its length is the max value. <br /><br />
     * If this vector's length is less than the min value, the vector will be scaled up so its length is the min value.
     * @param min the minimum value the length will be clamped to.
     * @param max the maximum value the length will be clamped to.
     */
    clampLength(min: number, max: number): Vector3;
    /**
     * The components of this vector are rounded down to the nearest integer value.
     */
    floor(): Vector3;
    /**
     * The {@link x| x}, {@link y| y} and {@link z| z} components of this vector are rounded up to the nearest integer value.
     */
    ceil(): Vector3;
    /**
     * The components of this vector are rounded to the nearest integer value.
     */
    round(): Vector3;
    /**
     * The components of this vector are rounded towards zero (up if negative, down if positive) to an integer value.
     */
    roundToZero(): Vector3;
    /**
     * Inverts this vector - i.e. sets x = -x, y = -y and z = -z.
     */
    negate(): Vector3;
    /**
     * Calculate the {@link https://en.wikipedia.org/wiki/Dot_product| dot product} of this vector and {@link Vector3| v}.
     */
    dot(v: Vector3): number;
    /**
     * Computes the square of the {@link https://en.wikipedia.org/wiki/Euclidean_distance| Euclidean length}
     * (straight-line length) from (0, 0, 0) to (x, y, z). If you are 	comparing the lengths of
     * vectors, you should compare the length squared instead as it is slightly more efficient to calculate.
     */
    lengthSq(): number;
    /**
     * Computes the Euclidean length (straight-line length) from (0, 0, 0) to (x, y, z).
     */
    length(): number;
    /**
     * Computes the {@link http://en.wikipedia.org/wiki/Taxicab_geometry| Manhattan length} of this vector.
     */
    manhattanLength(): number;
    /**
     * Convert this vector to a {@link https://en.wikipedia.org/wiki/Unit_vector| unit vector}
     * - that is, sets it equal to a vector with the same direction as this one, but {@link length| length} 1.
     */
    normalize(): Vector3;
    /**
     * Sets this vector to a vector with given length the same direction as this one.
     */
    setLength(length: number): Vector3;
    /**
     * Linearly interpolate between this vector and {@link Vector3| v}, where alpha is the
     * percent distance along the line - alpha = 0 will be this vector, and alpha = 1 will be {@link Vector3| v}.
     * @param v {@link Vector3| Vector3} to interpolate towards.
     * @param alpha interpolation factor, typically in the closed interval [0, 1].
     */
    lerp(v: Vector3, alpha: number): Vector3;
    /**
     * Sets this vector to be the vector linearly interpolated between {@link Vector3| v1} and
     * {@link Vector3| v2} where alpha is the percent distance along the line connecting the two vectors -
     * alpha = 0 will be {@link Vector3| v1}, and alpha = 1 will be {@link Vector3| v2}.
     * @param v1 the starting {@link Vector3| Vector3}.
     * @param v2 {@link Vector3| Vector3} to interpolate towards.
     * @param alpha interpolation factor, typically in the closed interval [0, 1].
     */
    lerpVectors(v1: Vector3, v2: Vector3, alpha: number): Vector3;
    /**
     * Sets this vector to {@link https://en.wikipedia.org/wiki/Cross_product| cross product} of itself and {@link Vector3| v}.
     */
    cross(v: Vector3): Vector3;
    /**
     * Sets this vector to cross product of {@link Vector3| a} and {@link Vector3| b}.
     */
    crossVectors(a: Vector3, b: Vector3): Vector3;
    /**
     * {@link https://en.wikipedia.org/wiki/Vector_projection| Projects} this vector onto {@link Vector3| vector}.
     */
    projectOnVector(vector: Vector3): Vector3;
    /**
     * {@link https://en.wikipedia.org/wiki/Vector_projection| Projects} this vector onto a plane by subtracting this vector projected onto the plane's normal from this vector.
     * @param planeNormal A vector representing a plane normal.
     */
    projectOnPlane(planeNormal: Vector3): Vector3;
    /**
     * Reflect this vector off of plane orthogonal to {@link Vector3| normal}.
     * Normal is assumed to have unit length.
     * @param normal the normal to the reflecting plane.
     */
    reflect(normal: Vector3): Vector3;
    /**
     * Returns the angle between this vector and vector {@link Vector3| v} in radians.
     */
    angleTo(v: Vector3): number;
    /**
     * Computes the distance from this vector to {@link Vector3| v}.
     */
    distanceTo(v: Vector3): number;
    /**
     * Computes the squared distance from this vector to {@link Vector3| v}.
     * If you are just comparing the distance with another distance,
     * you should compare the distance squared instead as it is slightly more efficient to calculate.
     */
    distanceToSquared(v: Vector3): number;
    /**
     * Computes the {@link https://en.wikipedia.org/wiki/Taxicab_geometry| Manhattan distance} from this vector to {@link Vector3| v}.
     */
    manhattanDistanceTo(v: Vector3): number;
    /**
     * Sets this vector from the spherical coordinates {@link Spherical| s}.
     */
    setFromSpherical(s: Spherical): Vector3;
    /**
     * Sets this vector from the spherical coordinates {@link Spherical| radius}, {@link Spherical| phi} and {@link Spherical| theta}.
     */
    setFromSphericalCoords(radius: number, phi: number, theta: number): Vector3;
    /**
     * Sets this vector from the cylindrical coordinates {@link Cylindrical| c}.
     */
    setFromCylindrical(c: Cylindrical): Vector3;
    /**
     * Sets this vector from the cylindrical coordinates {@link Cylindrical| radius}, {@link Cylindrical| theta} and {@link Cylindrical| y}.
     */
    setFromCylindricalCoords(radius: number, theta: number, y: number): Vector3;
    /**
     * Sets this vector to the position elements of the {@link https://en.wikipedia.org/wiki/Transformation_matrix| transformation matrix} {@link Matrix4| m}.
     */
    setFromMatrixPosition(m: Matrix4): Vector3;
    /**
     * Sets this vector's {@link x| x}, {@link y| y} and {@link z| z} components from {@link Integer| index} column of {@link Matrix4| matrix}.
     */
    setFromMatrixColumn(matrix: Matrix4, index: number): Vector3;
    /**
     * Sets this vector to the scale elements of the {@link https://en.wikipedia.org/wiki/Transformation_matrix| transformation matrix} {@link Matrix4| m}.
     */
    setFromMatrixScale(m: Matrix4): Vector3;
    /**
     * Checks for strict equality of this vector and {@link Vector3| v}.
     */
    equals(v: Vector3): boolean;
    /**
     * Sets this vector's {@link x| x} value to be array[ offset + 0 ], {@link y| y} value to be array[ offset + 1 ] and {@link z| z} value to be array[ offset + 2 ].
     * @param array the source array.
     * @param offset ( optional) offset into the array.
     * @defaultValue `0`.
     */
    fromArray(array: ArrayLike<number>, offset?: number): Vector3;
    /**
     * There are 3 elements in this vector.
     */
    getNumberCount(): number;
    /**
     * Returns an array [x, y, z], or copies x, y and z into the provided array.
     * @param array (optional) array to store this vector to.
     * If this is not provided a new array will be created.
     * @param offset (optional) optional offset into the array.
     */
    toArray(array?: number[], offset?: number): number[];
    /**
     * Sets this vector's {@link x| x}, {@link y| y} and {@link z| z} values from the {@link BufferAttribute| attribute}.
     * @param attribute the source attribute.
     * @param index index in the attribute.
     */
    fromBufferAttribute(attribute: BufferAttribute, index: number): Vector3;
}

/**
 * Class representing a 4D {@link https://en.wikipedia.org/wiki/Vector_space| vector}.
 * A 4D vector is an ordered quadruplet of numbers (labeled x, y, z, and w).
 */
export declare class Vector4 {
    /**
     * the x value of this vector.
     * @defaultValue `0`.
     */
    x: number;
    /**
     * the y value of this vector.
     * @defaultValue `0`.
     */
    y: number;
    /**
     * the z value of this vector.
     * @defaultValue `0`.
     */
    z: number;
    /**
     * the w value of this vector.
     * @defaultValue `0`.
     */
    w: number;
    /**
     * Check the type whether it belongs to Vector4.
     * This value should not be changed by user.
     */
    isVector4: boolean;
    constructor(_x?: number, _y?: number, _z?: number, _w?: number);
    /**
     * Sets the {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} components of this vector.
     */
    set(x: number, y: number, z: number, w: number): Vector4;
    /**
     * Sets the {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values of this vector both equal to scalar.
     */
    setScalar(scalar: number): Vector4;
    /**
     * Replaces this vector's {@link x| x} value with x.
     */
    setX(x: number): Vector4;
    /**
     * Replaces this vector's {@link y| y} value with y.
     */
    setY(y: number): Vector4;
    /**
     * Replaces this vector's {@link z| z} value with z.
     */
    setZ(z: number): Vector4;
    /**
     * Replaces this vector's {@link w| w} value with w.
     */
    setW(w: number): Vector4;
    /**
     * If index equals 0 set {@link x| x} to value.
     * If index equals 1 set {@link y| y} to value.
     * If index equals 2 set {@link z| z} to value.
     * If index equals 3 set {@link w| w} to value.
     * @param index 0, 1 or 2.
     */
    setComponent(index: number, value: number): Vector4;
    /**
     * If index equals 0 returns the {@link x| x} value.
     * If index equals 1 returns the {@link y| y} value.
     * If index equals 2 returns the {@link z| z} value.
     * If index equals 3 returns the {@link w| w} value.
     * @param index 0, 1, 2 or 3.
     */
    getComponent(index: number): number;
    /**
     * Returns a new Vector4 with the same {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values as this one.
     */
    clone(): Vector4;
    cloneReadonly(): ReadonlyVector4;
    /**
     * Copies the values of the passed Vector4's {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} properties to this Vector4.
     */
    copy(v: Vector4): Vector4;
    /**
     * Adds {@link Vector4| v} to this vector.
     */
    add(v: Vector4): Vector4;
    /**
     * Adds the scalar value s to this vector's {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values.
     */
    addScalar(s: number): Vector4;
    /**
     * Sets this vector to {@link Vector4| a} + {@link Vector4| b}.
     */
    addVectors(a: Vector4, b: Vector4): Vector4;
    /**
     * Adds the multiple of {@link Vector4| v} and s to this vector.
     */
    addScaledVector(v: Vector4, s: number): Vector4;
    /**
     * Subtracts {@link Vector4| v} from this vector.
     */
    sub(v: Vector4): Vector4;
    /**
     * Subtracts s from this vector's {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} components.
     */
    subScalar(s: number): Vector4;
    /**
     * Sets this vector to {@link Vector4| a} - {@link Vector4| b}.
     */
    subVectors(a: Vector4, b: Vector4): Vector4;
    /**
     * Multiplies this vector by scalar s.
     */
    multiplyScalar(scalar: number): Vector4;
    /**
     * Multiplies this vector by 4 x 4 {@link Matrix4| m}.
     */
    applyMatrix4(m: Matrix4): Vector4;
    /**
     * Divides this vector by scalar s.
     * Sets vector to `( 0, 0, 0, 0 )` if `s = 0`.
     */
    divideScalar(scalar: number): Vector4;
    /**
     * If this vector's x, y, z or w value is greater than the max vector's x, y, z or w value, it is replaced by the corresponding value. <br /><br />
     * If this vector's x, y, z or w value is less than the min vector's x, y, z or w value, it is replaced by the corresponding value.
     * @param min the minimum {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values.
     * @param max the maximum {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values in the desired range.
     */
    min(v: Vector4): Vector4;
    /**
     * If this vector's x, y, z or w value is greater than the max vector's x, y, z or w value, it is replaced by the corresponding value. <br /><br />
     * If this vector's x, y, z or w value is less than the min vector's x, y, z or w value, it is replaced by the corresponding value.
     * @param min the minimum {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values.
     * @param max the maximum {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values in the desired range.
     */
    max(v: Vector4): Vector4;
    /**
     * If this vector's x, y, z or w value is greater than the max vector's x, y, z or w value, it is replaced by the corresponding value. <br /><br />
     * If this vector's x, y, z or w value is less than the min vector's x, y, z or w value, it is replaced by the corresponding value.
     * @param min the minimum {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values.
     * @param max the maximum {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values in the desired range.
     */
    clamp(min: Vector4, max: Vector4): Vector4;
    /**
     * If this vector's x, y, z or w values are greater than the max value, they are replaced by the max value. <br /><br />
     * If this vector's x, y, z or w values are less than the min value, they are replaced by the min value.
     * @param min the minimum {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values.
     * @param max the maximum {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values in the desired range.
     */
    clampScalar(minVal: number, maxVal: number): Vector4;
    /**
     * If this vector's length is greater than the max value, it is replaced by the max value. <br /><br />
     * If this vector's length is less than the min value, it is replaced by the min value.
     * @param min the minimum {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values.
     * @param max the maximum {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values in the desired range.
     */
    clampLength(min: number, max: number): Vector4;
    /**
     * The components of this vector are rounded down to the nearest integer value.
     */
    floor(): Vector4;
    /**
     * The {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} components of this vector are rounded up to the nearest integer value.
     */
    ceil(): Vector4;
    /**
     * The components of this vector are rounded to the nearest integer value.
     */
    round(): Vector4;
    /**
     * The components of this vector are rounded towards zero (up if negative, down if positive) to an integer value.
     */
    roundToZero(): Vector4;
    /**
     * Inverts this vector - i.e. sets x = -x, y = -y, z = -z and w = -w.
     */
    negate(): Vector4;
    /**
     * Calculates the {@link https://en.wikipedia.org/wiki/Dot_product| dot product} of this vector and {@link Vector4| v}.
     */
    dot(v: Vector4): number;
    /**
     * Computes the square of the {@link https://en.wikipedia.org/wiki/Euclidean_distance| Euclidean length }
     * (straight-line length) from (0, 0, 0, 0) to (x, y, z, w).
     * If you are comparing the lengths of vectors, you should compare the length squared instead as it is slightly more efficient to calculate.
     */
    lengthSq(): number;
    /**
     * Computes the Euclidean length (straight-line length) from (0, 0, 0, 0) to (x, y, z, w).
     */
    length(): number;
    /**
     * Computes the {@link http://en.wikipedia.org/wiki/Taxicab_geometry| Manhattan length } of this vector.
     */
    manhattanLength(): number;
    /**
     * Converts this vector to a {@link https://en.wikipedia.org/wiki/Unit_vector| unit vector }
     * - that is, sets it equal to a vector with the same direction as this one, but {@link length| length} 1.
     */
    normalize(): Vector4;
    /**
     * Sets this vector to a vector with given length the same direction as this one.
     */
    setLength(length: number): Vector4;
    /**
     * Linearly interpolates between this vector and {@link Vector4| v},
     * where alpha is the percent distance along the line - alpha = 0 will be this vector, and alpha = 1 will be {@link Vector4| v}.
     * @param v {@link Vector4| Vector4} to interpolate towards.
     * @param alpha interpolation factor, typically in the closed interval [0, 1].
     */
    lerp(v: Vector4, alpha: number): Vector4;
    /**
     * Sets this vector to be the vector linearly interpolated between {@link Vector4| v1} and
     * {@link Vector4| v2} where alpha is the percent distance along the line connecting the two vectors
     * - alpha = 0 will be {@link Vector4| v1}, and alpha = 1 will be {@link Vector4| v2}.
     * @param v1 the starting {@link Vector4| Vector4}.
     * @param v2 {@link Vector4| Vector4} to interpolate towards.
     * @param alpha interpolation factor, typically in the closed interval [0, 1].
     */
    lerpVectors(v1: Vector4, v2: Vector4, alpha: number): Vector4;
    /**
     * Checks for strict equality of this vector and {@link Vector4| v}.
     */
    equals(v: Vector4): boolean;
    /**
     * Sets the {@link x| x}, {@link y| y} and {@link z| z} components of this vector to the quaternion's axis and {@link w| w} to the angle.
     * @param q a normalized {@link Quaterion| Quaterion}
     */
    setAxisAngleFromQuaternion(q: Quaternion): Vector4;
    /**
     * {@link Matrix4| m} a {@link Matrix4| Matrix4} of which the upper left 3x3 matrix is a pure rotation matrix.
     * Sets the {@link x| x}, {@link y| y} and {@link z| z} to the axis of rotation and {@link w| w} to the angle.
     */
    setAxisAngleFromRotationMatrix(m: Matrix4): Vector4;
    /**
     * Sets this vector's {@link x| x} value to be array[ offset + 0 ], {@link y| y} value to be array[ offset + 1 ]
     * {@link z| z} value to be array[ offset + 2 ] and {@link w| w} value to be array[ offset + 3 ].
     * @param array the source array.
     * @param offset (optional) offset into the array.
     * @defaultValue `0`.
     */
    fromArray(array: ArrayLike<number>, offset?: number): Vector4;
    /**
     * There are 4 elements in this vector.
     */
    getNumberCount(): number;
    /**
     * Returns an array [x, y, z, w], or copies x, y, z and w into the provided array.
     * @param array (optional) array to store this vector to. If this is not provided, a new array will be created.
     * @param offset (optional) optional offset into the array.
     */
    toArray(array?: number[], offset?: number): number[];
    /**
     * Sets this vector's {@link x| x}, {@link y| y}, {@link z| z} and {@link w| w} values from the {@link BufferAttribute| attribute}.
     * @param attribute the source attribute.
     * @param index index in the attribute.
     */
    fromBufferAttribute(attribute: BufferAttribute, index: number): Vector4;
}

/**
 * This class is used to set up the configuration and canvas for RenderEngine.
 * It also contains instance of grid-like ground, background and Coordinate System.
 */
declare class Viewer extends EventDispatcher {
    static instances: Set<Viewer>;
    /**
     * The name of viewer, which could be empty.
     */
    name: string;
    /**
     * HTMLElements, which is set in the constructor function.
     */
    private _canvasContainer;
    get canvasContainer(): HTMLElement;
    private engine;
    private statistics;
    private scene;
    /**
     * Get the instance of 3D scene in current viewer.
     */
    getScene(): Scene3D;
    /**
     * If some users hopes to replace or update the 3d scene, they need to use the function,
     * which has been invoked in constructor to initialize the root.
     * @param scene A Scene3D object of current scene.
     * @tips If change the scene, ground, coordinate system and background will be reset.
     */
    setScene(scene: Scene3D): void;
    private _isDestroyed;
    get isDestroyed(): boolean;
    /**
     * Enabled instance rendering can make engine accelerate render for a large number of same objects in the scene.
     * It is effective for both 2D and 3D scene.
     * @defaultValue `false`
     */
    private _enableInstance;
    get enableInstance(): boolean;
    set enableInstance(v: boolean);
    /**
     * Enabled auto instance key can automatically generate instance key on meshes without this key originally.
     * @defaultValue `false`
     */
    private _enableAutoInstanceKey;
    get enableAutoInstanceKey(): boolean;
    set enableAutoInstanceKey(v: boolean);
    /**
     * Enabled this attribute can accelerate render for all mesh by merge some small objects into one big buffer.
     * It is effective for both 2D and 3D scene.
     * @defaultValue `true`
     */
    private _enableMultiMeshMerge;
    get enableMultiMeshMerge(): boolean;
    set enableMultiMeshMerge(v: boolean);
    /**
     * Enabled this attribute can accelerate render each mesh by merge some small objects into one big buffer.
     * It is only effective for 3D scene.
     * @defaultValue `true`
     */
    private _enableMeshMerge;
    get enableMeshMerge(): boolean;
    set enableMeshMerge(v: boolean);
    get rendererBackend(): RendererBackend;
    private plugins;
    /**
     * This method provides some information of the engine for users.
     * The instance of RenderInfo can get the number of refreshed times in the Shader program, materials and lights.
     * The frameInfo includes Fps, usage of CPU and so on.
     * The objectInfo includes the number of geometries, textures, drawcall, vertices, faces and so on.
     */
    get renderInfo(): RenderInfo;
    get snapshotRendererV2(): SnapshotRenderer_2;
    /**
     * An customizable arrow function will be called when use requestRender();
     */
    private _requestRenderHandler?;
    get requestRenderHandler(): RequestRenderHandler | undefined;
    set requestRenderHandler(v: RequestRenderHandler | undefined);
    /**
     * Request to invoke RenderHandler function if it is not null;
     */
    requestRender: () => void;
    private onlyDefaultViewport;
    private viewportList;
    /**
     * Creates an instance of Viewer.
     * @param {HTMLElement} canvasContainer
     * A dom of canvas where is used to render.
     * @param {EngineInitializeConfig} engineInitializeConfig
     * User's defined object of EngineInitializeConfig includes antialiasing and alpha, both are boolean types.
     * Default value is usually true for antialiasing and false for alpha
     * @return
     */
    constructor(canvasContainer: HTMLElement, engineInitializeConfig: EngineInitializeConfig);
    createViewport(name: string, bound?: Vector4): Viewport;
    removeViewport(viewport: Viewport): void;
    clearViewport(): void;
    private lastRenderEmitTime;
    private noRenderChecker?;
    private notifyRendered;
    /**
     * Give an asynchronous function to user to block program until passed a period from last render.
     * @param {number} time wait for setting milliseconds. Default is 1000.
     */
    waitForRenderOver: (v?: number) => Promise<void>;
    /**
     * Get real size of drawing area from engine's width and height.
     * The size normally is same as canvas.
     */
    getSize(): Size;
    /**
     * Change the size of rendering area, if the size is not given then it will automatically adapt to the canvas.
     * @param {Size} size Optional parameter.
     */
    resize(size?: Size): void;
    /**
     * keep instance but do nothing in CPU;
     */
    private isPaused;
    pause(): void;
    resume(): void;
    private isPerformanceSlow;
    /**
     * Render one frame with the configuration and objects in the scene.
     * All setting of config, scene or camera need to be finished before this.
     * @tip If user draw a 2D scene, the attribute render2D should be set to true in advance.
     */
    render(): void;
    /**
     * Get render result to a TypedArray from the Framebuffer.
     * The result is a rectangular area from left-bottom beginning to right-top ending pixel.
     * @param {Uint8Array} resultData All color will be store in this array, which color' format is RGBA within 0-255,
     * @param {number} x Beginning pixel position's x.
     * @param {number} y Beginning pixel position's y.
     * @param {number} width Rectangular area's width.
     * @param {number} height Rectangular area's height.
     * @deprecated use `readRenderResultAsync` instead
     */
    readRenderResult(resultData: Uint8Array, range: IRange): void;
    /**
     * Get render result to a TypedArray from the Framebuffer.
     * The result is a rectangular area from left-bottom beginning to right-top ending pixel.
     * @param {Uint8Array} resultData All color will be store in this array, which color' format is RGBA within 0-255,
     * @param {number} x Beginning pixel position's x.
     * @param {number} y Beginning pixel position's y.
     * @param {number} width Rectangular area's width.
     * @param {number} height Rectangular area's height.
     */
    readRenderResultAsync(resultData: Uint8Array, range: IRange): Promise<void> | undefined;
    /**
     * Get render result to a Data Url from the canvas api.
     * @deprecated unstable read back, depend on browser's implement, use `readRenderResultAsync` instead.
     * @param {string} type A DOMString indicating the image format. The default type is image/png;
     */
    readRenderResultDataUrl(type?: string, ...args: any[]): string;
    /**
     * stop the listening events,
     * reset scene graph and camera,
     * release the resource of engine
     * and remove bounded canvas.
     */
    destroy(): void;
    /**
     * Statistics data not only include the content of RenderInfo,
     * also provide the size of geometryBuffer, textureByte and Framebuffer and so on.
     * @remarks See {@link renderInfo | renderInfo } for more details.
     */
    getRenderStatistics(): Readonly<RenderStatistics>;
    getMemoryInfo(whenGrowFailed?: boolean): Readonly<MemoryInfo>;
    /**
     * Download a file which store the data of current scene from browser.
     * @param {string} name The name of downloaded file. Default name is debug.
     */
    downloadSceneData(name?: string): void;
    /**
     * If user needs picking feature, this method will offer a Picker's instance with two APIS: pick and pickFirst.
     */
    createPicker(): Picker;
    /**
     * free gpu memory by context lost, restore gpu memory when next draw
     */
    freeGPU(): void;
    /**
     * An instance of SnapshotRenderer used to take snapshot of selected object.
     * @deprecated use snapshotRendererV2
     * @initialize It is initialized in the constructor of the RenderEngine.
     * @remarks See {@link SnapshotRenderer| SnapshotRenderer} for more details.
     */
    get snapshotRenderer(): SnapshotRenderer;
    /**
     * An instance of EngineConfig used to manipulate configuration of the engine.
     * @initialize The instance is initialized in constructor function of Viewer.
     * @remarks See {@link EngineConfig| EngineConfig} for more details.
     */
    get config(): ViewerConfig;
    /**
     * The background mode which is shown in current canvas.
     * @defaultValue `BackgroundMode.SkyBackground`
     * @deprecated
     * currentBackground is move to postPipeline
     */
    get currentBackground(): BackgroundMode;
    set currentBackground(v: BackgroundMode);
    get ground(): Ground;
    set ground(v: Ground);
    /**
     * An instance of CoordinateSystemHelper which could be turned on by the config.
     */
    coordSysHelper: CoordinateSystemHelper;
    /**
     * The mode of render which is applied in current scene.
     * @defaultValue `RenderMode.SHADING`
     * @deprecated
     */
    get currentRenderMode(): RenderMode;
    /**
     * An instance of BasicBackground, which only works when the render mode of background is set to BasicBackground.
     * @deprecated use `config.background.basic` instead
     * basicBackground is move to postPipeline
     */
    get basicBackground(): BasicBackground;
    /**
     * @deprecated  set is not allow to use, use `config.background.basic` to update parameters instead.
     * basicBackground is move to postPipeline
     */
    set basicBackground(background: BasicBackground);
    /**
     * An instance of SolidColorBackground, which only works when the render mode of background is set to SolidColorBackground.
     * @deprecated use `config.background.solid` instead
     * solidBackground is move to postPipeline
     */
    get solidBackground(): SolidColorBackground;
    /**
     * @deprecated set is not allow to use, use `config.background.solid` to update parameters instead.
     * solidBackground is move to postPipeline
     */
    set solidBackground(background: SolidColorBackground);
    /**
     * An instance of SkyBackground, which only works when the render mode of background is set to SkyBackground.
     * @deprecated use `config.background.sky` instead
     * skyBackground is move to postPipeline
     */
    get skyBackground(): SkyBackground;
    /**
     * @deprecated set is not allow to use, use `config.background.sky` to update parameters instead.
     * skyBackground is move to postPipeline
     */
    set skyBackground(background: SkyBackground);
    /**
     * An instance of EnvMapBackground, which only works when the render mode of background is set to EnvMapBackground.
     * @deprecated use `config.background.envmap` instead
     * envBackground is move to postPipeline
     */
    get envBackground(): EnvMapBackground;
    /**
     * @deprecated set is not allow to use, use `config.background.envmap` to update parameters instead.
     * envBackground is move to postPipeline
     */
    set envBackground(background: EnvMapBackground);
    /**
     * An instance of GradientBackground, which only works when the render mode of background is set to GradientBackground.
     * @deprecated use `config.background.gradient` instead
     * gradientBackground is move to postPipeline
     */
    get gradientBackground(): GradientBackground;
    /**
     * @deprecated set is not allow to use, use `config.background.gradient` to update parameters instead.
     * gradientBackground is move to postPipeline
     */
    set gradientBackground(background: GradientBackground);
    /**
     * @deprecated use `canvasContainer`
     * Get instance of HTMLElement that will attach canvas which is set in the constructor function.
     */
    getContainerElement(): Readonly<HTMLElement>;
    /**
     * Change the parameters of background such as mode and corresponding parameters.
     * @param {BackgroundParameter} parameter An object of BackgroundParameter.
     * @deprecated use `config.background` instead.
     */
    updateBackGroundParameter(parameter: BackgroundParameter): void;
    /**
     * Change the mode of background, and the parameters of the background will be set to default values;
     * @param {BackgroundMode} type A constant of BackgroundMode.
     * @deprecated use `config.background.active` instead.
     */
    setBackGroundMode(type: BackgroundMode): void;
    /**
     * Apply user's camera to renderer.
     * This only works for 3D scene.
     * `ArrayCamera` is not supported in this function, use Viewport instead.
     * @param {Camera3D | ArrayCamera} camera An instance belongs or extents form Camera.
     * @tips If the user changes the camera's parameter or uses a new camera, the better way is through this function to avoid errors;
     */
    setCamera(camera: Camera3D | ArrayCamera): void;
    /**
     * Get the camera instance of current viewer.
     * This only works for 3D scene.
     */
    getCamera(): Camera3D;
    /**
     * This method will add highlight effect to all objects in the array.
     * @param {HighLightItem[]} objects HighLightItem is an interface which requires a Drawable object and an optional group index of geometry.
     */
    setHighlightObjects(objects: HighLightItem[]): void;
    setHighlightGroups(groups: HighlightGroup[]): void;
}

declare interface ViewerConfig {
    forceFrameIsUnstable: ConfigCell<boolean>;
    canvas: {
        renderPixelRatio: ConfigCell<number>;
    };
    autoInstance: {
        enabled: ConfigCell<boolean>;
        autoInstanceKeyEnabled: ConfigCell<boolean>;
    };
    multiMeshMerge: {
        enabled: ConfigCell<boolean>;
    };
    popMeshMerge: {
        enabled: ConfigCell<boolean>;
    };
    gpuDriven: {
        enabled: ConfigCell<boolean>;
        textureCompression: ConfigCell<TextureCompression>;
        frustumCullingEnabled: ConfigCell<boolean>;
        occlusionCullingEnabled: ConfigCell<boolean>;
        detailCullingEnabled: ConfigCell<boolean>;
        layersCullingEnabled: ConfigCell<boolean>;
        triCullingEnabled: ConfigCell<boolean>;
        occlusionCullingBias: ConfigCell<number>;
    };
    shadingMode: {
        physical: ConfigCell<boolean>;
    };
    statistics: {
        enableDrawcallClassify: ConfigCell<boolean>;
    };
    global: {
        meshBVHEnabled: ConfigCell<boolean>;
    };
    scene: {
        onlyDirectLight: ConfigCell<boolean>;
        layerLightEnabled: ConfigCell<boolean>;
        sceneBVHEnabled: ConfigCell<boolean>;
    };
    /**
     * TODO: deprecated pipeline config. we need disable use and remove it.
     */
    renderMode: {
        type: ConfigCell<RenderMode>;
    };
    staticFrameCache: {
        enabled: ConfigCell<boolean>;
    };
    isExtraCopyBeforeScreenEnabled: ConfigCell<boolean>;
    ground: {
        enabled: ConfigCell<boolean>;
        offsetA: ConfigCell<Vector2>;
        gridGapSizeA: ConfigCell<number>;
        colorA: ConfigCell<Color>;
        offsetB: ConfigCell<Vector2>;
        gridGapSizeB: ConfigCell<number>;
        colorB: ConfigCell<Color>;
        isGroundColorEnabled: ConfigCell<boolean>;
        groundColor: ConfigCell<Color>;
    };
    background: {
        active: ConfigCell<BackgroundMode>;
        basic: {
            color: ConfigCell<Color>;
            alpha: ConfigCell<number>;
            texture: ConfigCell<Nullable<Texture>>;
        };
        solid: {
            color: ConfigCell<Color>;
            alpha: ConfigCell<number>;
        };
        envmap: {
            texture: ConfigCell<Texture>;
            luma: ConfigCell<number>;
            verticalRotation: ConfigCell<number>;
            horizonRotation: ConfigCell<number>;
            reverseHorizon: ConfigCell<boolean>;
        };
        gradient: {
            skyColor: ConfigCell<Color>;
            groundColor: ConfigCell<Color>;
        };
        sky: {
            enablePreSkyMap: ConfigCell<boolean>;
            luminance: ConfigCell<number>;
            turbidity: ConfigCell<number>;
            rayleigh: ConfigCell<number>;
            mieCoefficient: ConfigCell<number>;
            mieDirectionalG: ConfigCell<number>;
        };
    };
    coordinateSystem: {
        enabled: ConfigCell<boolean>;
        x: ConfigCell<number>;
        y: ConfigCell<number>;
        size: ConfigCell<number>;
    };
    effects: DeprecatedPipelineConfig;
}

/**
 * Named rendering viewport managed by a viewer.
 */
declare class Viewport {
    readonly name: string;
    private isDestroyed;
    private viewer;
    private engine;
    private _config;
    get config(): ViewerConfig;
    private isCameraChange;
    private isCameraStable;
    private cameraObserver;
    private _camera;
    get camera(): Camera3D;
    set camera(camera: Camera3D);
    private requestRender;
    layer: number;
    private _bound;
    get bound(): Vector4;
    set bound(v: Vector4);
    constructor(name: string, viewer: Viewer, engine: RenderEngine, scene: Scene3D, viewIndex: number, bound?: Vector4);
    private size;
    private viewBound;
    private updateTlsFlag;
    setHighlightGroups(groups: HighlightGroup[]): void;
    snapshotRenderResult(range?: IRange): Promise<SnapshotResult> | undefined;
    destroy(): void;
}

/**
 * The cullFace method of the WebGL API specifies whether or not front- and/or back-facing polygons can be culled.
 */
declare enum WebGLCullFace {
    None = 1000000,// it's not a gl const, let make a hole
    Back = 1028,
    Front = 1029,
    FrontBack = 1032
}

declare enum WebGLExtEnums {
    WEBGL_lose_context = "WEBGL_lose_context",
    WEBGL_debug_renderer_info = "WEBGL_debug_renderer_info",
    ANGLE_instanced_arrays = "ANGLE_instanced_arrays",
    OES_texture_float = "OES_texture_float",
    OES_texture_half_float = "OES_texture_half_float",
    OES_texture_float_linear = "OES_texture_float_linear",
    OES_texture_half_float_linear = "OES_texture_half_float_linear",
    OES_standard_derivatives = "OES_standard_derivatives",
    OES_vertex_array_object = "OES_vertex_array_object",
    OES_element_index_uint = "OES_element_index_uint",
    WEBGL_depth_texture = "WEBGL_depth_texture",
    WEBGL_color_buffer_float = "WEBGL_color_buffer_float",
    WEBGL_draw_buffers = "WEBGL_draw_buffers",
    EXT_texture_filter_anisotropic = "EXT_texture_filter_anisotropic",
    EXT_shader_texture_lod = "EXT_shader_texture_lod",
    EXT_color_buffer_half_float = "EXT_color_buffer_half_float",
    EXT_color_buffer_float = "EXT_color_buffer_float",
    EXT_frag_depth = "EXT_frag_depth",
    EXT_sRGB = "EXT_sRGB",
    EXT_blend_minmax = "EXT_blend_minmax",
    WEBGL_compressed_texture_s3tc = "WEBGL_compressed_texture_s3tc",
    WEBGL_compressed_texture_astc = "WEBGL_compressed_texture_astc",
    WEBGL_compressed_texture_etc1 = "WEBGL_compressed_texture_etc1",
    WEBGL_compressed_texture_etc = "WEBGL_compressed_texture_etc",
    WEBGL_compressed_texture_pvrtc = "WEBGL_compressed_texture_pvrtc",
    EXT_texture_compression_bptc = "EXT_texture_compression_bptc"
}

declare interface WebGLLimits extends Limits {
    maxTextureSlots: number;
}

/**
 * Decide the color format in each pixel.
 */
declare enum WebGLPixelFormat {
    Red = 6403,
    RG = 33319,
    /**
     * @deprecated 3 channel texture support dropped.
     */
    RGB = 6407,
    RGBA = 6408,
    RedInteger = 36244,
    RGInteger = 33320,
    RGBInteger = 36248,
    RGBAInteger = 36249,
    Alpha = 6406,
    Luminance = 6409,
    LuminanceAlpha = 6410,
    Depth = 6402,
    DepthStencil = 34041
}

/**
 * All supported type of data in shader.
 */
declare enum WebGLShaderDataType {
    Bool = 35670,
    BoolVec2 = 35671,
    BoolVec3 = 35672,
    BoolVec4 = 35673,
    Int = 5124,
    IntVec2 = 35667,
    IntVec3 = 35668,
    IntVec4 = 35669,
    UInt = 5125,
    UIntVec2 = 36294,
    UIntVec3 = 36295,
    UIntVec4 = 36296,
    Float = 5126,
    Vec2 = 35664,
    Vec3 = 35665,
    Vec4 = 35666,
    Mat2 = 35674,
    Mat3 = 35675,
    Mat4 = 35676,
    Sampler2D = 35678,
    Sampler2DArray = 36289,
    Sampler3D = 35679,
    SamplerCube = 35680,
    USampler2D = 36306,
    USampler2DArray = 36311,
    USampler3D = 36307,
    FloatV = 9999999,
    IntV = 9999998,
    UintV = 9999997,
    IVec4V = 9999996,
    ArraySampler2D = 9999995,
    ArraySamplerCube = 9999994
}

/**
 * Supported type of texture by webGL.
 */
declare enum WebGLTextureType {
    Texture2D = 3553,
    TextureCubeMap = 34067
}

declare interface WebGLUploadable {
    __brand: 'WebGLUploadable';
}

declare interface WebXROptions extends XRPluginOptions {
    session: WebXRSession;
    referenceSpace?: 'local' | 'local-floor' | 'unbounded' | 'bounded-floor' | 'viewer';
    optionalFeatures?: string[];
    requiredFeatures?: string[];
}

declare type WebXRSession = 'immersive-vr' | 'immersive-ar';

declare interface WGLBufferData {
    buffer: WebGLBuffer;
    type: number;
    bytesPerElement: number;
    version: number;
    referencesBy: Set<BufferGeometryBase>;
    byteSize: number;
}

declare class WGLExtensions {
    _extensions: {
        [index: string]: any;
    };
    get(name: WebGLExtEnums): any;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext);
}

declare class WGLProgram {
    readonly id: number;
    readonly version: number;
    readonly key: string;
    readonly shaderInfo: ShaderInfo;
    readonly globalUniforms: BuiltInUniforms;
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    readonly renderState: RenderState;
    _disposed: boolean;
    uniformSkipTag: Map<string, number>;
    readonly attributeKey = "";
    readonly program: WebGLProgram;
    private attributes;
    private uniforms;
    private uniformBlocks;
    private referenceSet;
    constructor(renderState: RenderState, info: ShaderInfo, material: Nullable<Material>, key: string);
    getAttributesInfo(): {
        [index: string]: number;
    };
    private createWebGLProgram;
    private createUniformBlocks;
    private fetchUniformsInfo;
    private fetchAttributesInfo;
    setUniform(name: string, data: UniformGeneralTypes, silent?: boolean): void;
    setUniformBlock(name: string, data: UniformBlockObject): void;
    queryUBOLayout(name: string): {
        all: number;
        offsets: number[];
    } | undefined;
    setTexture(name: string, texture: Texture, silent?: boolean): void;
    setTextures(name: string, textures: Texture[], silent?: boolean): void;
    setTexture2D(name: string, texture: Texture, silent?: boolean): void;
    setArrayTexture2D(name: string, textures: Texture[]): void;
    setTexture3D(name: string, texture: Texture): void;
    setArrayTextureCube(name: string, textures: TextureCube[]): void;
    setTextureCube(name: string, texture: TextureCube): void;
    attach(material: Material): void;
    detach(material: Material): boolean;
    destroy(): void;
}

declare type WGLRenderAttachment = WebGLTexture | RenderBufferAttachment;

declare class WGLState {
    readonly colorState: ColorState;
    readonly depthState: DepthState;
    readonly blendState: BlendState;
    readonly stencilState: StencilState;
    readonly textureState: TextureState;
    readonly attributeState: AttributeState;
    private enabledStates;
    private currentProgram;
    private currentFlipSided;
    private currentCullFace;
    private currentPolygonOffsetFactor;
    private currentPolygonOffsetUnits;
    private currentScissor;
    private currentViewport;
    private clearValues;
    readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
    readonly isWebGL2: boolean;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, extensions: WGLExtensions, backend: RendererBackend, limits: WebGLLimits);
    private enable;
    private disable;
    setDepthTest(depthTest: boolean): void;
    setStencilTest(stencilTest: boolean): void;
    setStencilClear(stencil: number): void;
    setDepthMask(depthMask: boolean): void;
    setColorClear(r: number, g: number, b: number, a: number, premultipliedAlpha?: boolean): void;
    bindTextureAndActiveForUploading(webglType: WebGLTextureType, webglTexture: WebGLTexture): void;
    bindTextureAt(webglType: WebGLTextureType, webglTexture: WebGLTexture, slot: number): void;
    resetTextureSlotIndex(): void;
    getFreeTextureSlot(namedSlot?: number): number;
    useProgram(program: WGLProgram): boolean;
    setFlipSided(flipSided: boolean): void;
    setCullFace(cullFace: WebGLCullFace): void;
    setPolygonOffset(polygonOffset: boolean, factor: number, units: number): void;
    setMaterial(material: MaterialState, frontFaceCW: boolean): void;
    setStencil(stencilWrite: boolean, stencilWriteMask: number, stencilFunc: StencilFunc, stencilRef: number, stencilFuncMask: number, stencilFail: StencilOp, stencilZFail: number, stencilZPass: number): void;
    setBlending(blending: Blending.NoBlending): void;
    setBlending(blending: Blending, blendEquation: BlendingEquation, blendSrc: number, blendDst: number, blendEquationAlpha?: number, blendSrcAlpha?: number, blendDstAlpha?: number, premultipliedAlpha?: boolean): void;
    setScissorTest(scissorTest: boolean): void;
    setScissor(scissor: Vector4): void;
    setViewport(viewport: Vector4): void;
    clear(color?: boolean, depth?: boolean, stencil?: boolean, renderTarget?: RenderTarget, drawBuffers?: number[]): void;
    reset(): void;
}

declare interface WGLTextureData {
    webglTexture: WebGLTexture;
    byteSize: number;
}

export declare namespace XR {
    export {
        initWebXR,
        OnXRViewChanged,
        WebXROptions,
        WebXRSession
    }
}

declare interface XRPluginOptions {
    /**
     * @default 1
     * @remarks
     * use as following parameter:
     *  - https://developer.mozilla.org/en-US/docs/Web/API/XRWebGLLayer/XRWebGLLayer#framebufferscalefactor
     *  - https://developer.mozilla.org/en-US/docs/Web/API/XRWebGLBinding/createProjectionLayer#scalefactor
     */
    framebufferScaleFactor?: number;
    /**
     * pixel ratio of the viewer,
     * @default 1
     * @remarks
     * viewer.renderPixelRatio = 1 / window.devicePixelRatio * pixelRatio
     */
    pixelRatio?: number;
    /**
     * the scale for XRRenderState.depthFar
     * @default 1
     * @remarks
     * camera.far = XRRenderState.depthFar * depthScale
     */
    depthScale?: number;
    /**
     * compute camera transform matrix from XRView
     * @param transform XRView.transform.matrix
     * @param viewIndex index of the camera associated view
     * @default transform => new Matrix4().fromArray(transform)
     */
    computeCameraMatrix?(transform: Float32Array, viewIndex: number): Matrix4;
}

export { }

export type {
    Viewer,
    Viewport,
    Material,
    Light
}
