
var html = null;
var gl = null;

var filters = [];
var filters_names = [];

var vertexShader = null;
var fragmentShader = null;
var shaderProgram = null;

var position = null;

var projection = null;
var view = null;
var skybox = null;

var plot = null;

var xPlusFloat32Array = new Float32Array([
    +1, +1, +1,
    +1, -1, +1,
    +1, -1, -1,
    +1, +1, -1,
]);
var xMinusFloat32Array = new Float32Array([
    -1, +1, -1,
    -1, -1, -1,
    -1, -1, +1,
    -1, +1, +1,
]);

var yPlusFloat32Array = new Float32Array([
    -1, 1, -1,
    -1, 1, +1,
    +1, 1, +1,
    +1, 1, -1,
]);
var yMinusFloat32Array = new Float32Array([
    -1, -1, +1,
    -1, -1, -1,
    +1, -1, -1,
    +1, -1, +1,
]);

var zPlusFloat32Array = new Float32Array([
    -1, +1, 1,
    -1, -1, 1,
    +1, -1, 1,
    +1, +1, 1,
]);
var zMinusFloat32Array = new Float32Array([
    +1, +1, -1,
    +1, -1, -1,
    -1, -1, -1,
    -1, +1, -1,
]);

var texCoordsFloat32Array = new Float32Array([
    0, 0,
    0, 1,
    1, 1,
    1, 0,
]);


var arrayBuffer = null;

var POINTS = false;
var TRIANGLES = true;

var vertexShaderSource = "" +
    "attribute vec3 aPosition;\n" +
    "uniform mat4 projection;\n" +
    "uniform mat4 rotation;\n" +
    "uniform vec3 move;\n" +
    "attribute vec3 aNormal;\n" +
    "varying vec3 Normal;\n" +
    "varying float v_fogDepth;\n" +
    "void main()\n" +
    "{\n" +
    "    vec4 pos = rotation * vec4(aPosition, 1.0) + vec4(move, 0.0);\n" +
    "    gl_Position =  projection * pos;\n" +
    "    gl_PointSize = 2.0;\n" +
    "    Normal = aNormal;\n" +
    "    v_fogDepth = (rotation * vec4(aPosition, 1.0) + vec4(move, 0.0)).z;" +
    "}\n";

var fragmentShaderSource = "" +
    "precision mediump float;\n" +
    "uniform float ambientStrength;\n" +
    "uniform vec3 lightColor;\n" +
    "uniform vec3 u_fogColor;\n" +
    "uniform float u_fogNear;\n" +
    "uniform float u_fogFar;\n" +
    "uniform vec3 lightDir;\n" +
    "varying vec3 Normal;\n" +
    "varying float v_fogDepth;\n" +
    "void main()\n" +
    "{\n" +
    "    vec3 ambient = ambientStrength * lightColor;\n" +
    "    vec3 norm = normalize(Normal);\n" +
    "    float diff = max(dot(norm, lightDir), 0.0);\n" +
    "    vec3 diffuse = diff * lightColor;\n" +
    "    vec3 result = (ambient + diffuse) * vec3(1.0, 0.7, 0.5);\n" +
    "    float fogAmount = smoothstep(u_fogNear, u_fogFar, v_fogDepth);\n" +
    "    gl_FragColor = mix(vec4(result, 1.0), vec4(u_fogColor, 1.0), fogAmount);\n" +
    "}\n";

var makeShaderProgram = function (gl) {

    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertexShader));
        return null;
    }

    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(fragmentShader));
        return null;
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Could not initialise shaders");
        return null;
    }

    gl.useProgram(shaderProgram);

    aPositionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
    aNormalLocation = gl.getAttribLocation(shaderProgram, "aNormal");

    projectionLocation = gl.getUniformLocation(shaderProgram, "projection");
    rotationLocation = gl.getUniformLocation(shaderProgram, "rotation");
    moveLocation = gl.getUniformLocation(shaderProgram, "move");
    ambientStrengthLocation = gl.getUniformLocation(shaderProgram, "ambientStrength");
    lightColorLocation = gl.getUniformLocation(shaderProgram, "lightColor");
    lightDirLocation = gl.getUniformLocation(shaderProgram, "lightDir");
    fogNearLocation = gl.getUniformLocation(shaderProgram, "u_fogNear");
    fogFarLocation = gl.getUniformLocation(shaderProgram, "u_fogFar");
    fogColorLocation = gl.getUniformLocation(shaderProgram, "u_fogColor");

    zMinusArrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, zMinusArrayBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, zMinusFloat32Array, gl.STATIC_DRAW);

    zPlusArrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, zPlusArrayBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, zPlusFloat32Array, gl.STATIC_DRAW);

    xMinusArrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, xMinusArrayBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, xMinusFloat32Array, gl.STATIC_DRAW);

    xPlusArrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, xPlusArrayBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, xPlusFloat32Array, gl.STATIC_DRAW);

    yMinusArrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, yMinusArrayBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, yMinusFloat32Array, gl.STATIC_DRAW);

    yPlusArrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, yPlusArrayBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, yPlusFloat32Array, gl.STATIC_DRAW);

    texCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoordsFloat32Array, gl.STATIC_DRAW);


    return shaderProgram;
};

var createTexture2D = function (gl) {
    var textureId = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureId);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return textureId;
}


var cubeFace;
var skyboxXYZ;

const PROJECTION_Z_NEAR = 0.25;
const PROJECTION_Z_FAR = 300;
const PROJECTION_ZOOM_Y = 4.0;


const identityMatrix4 = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
];


var rotationMatrix4 = identityMatrix4;

var moveVector = [0, 0, 10];



var createProjectionMatrix4 = function (gl, zNear, zFar, zoomY) {
    var xx = zoomY * gl.viewportHeight / gl.viewportWidth;
    var yy = zoomY;
    var zz = (zFar + zNear) / (zFar - zNear);
    var zw = 1;
    var wz = -2 * zFar * zNear / (zFar - zNear);
    return [
        [xx, 0, 0, 0],
        [0, yy, 0, 0],
        [0, 0, zz, wz],
        [0, 0, zw, 0]
    ];
}




var glVector3 = function (x, y, z) {
    return new Float32Array(x, y, z);
};


var glMatrix4 = function (xx, yx, zx, wx,
    xy, yy, zy, wy,
    xz, yz, zz, wz,
    xw, yw, zw, ww) {
    return new Float32Array([xx, xy, xz, xw,
        yx, yy, yz, yw,
        zx, zy, zz, zw,
        wx, wy, wz, ww]);
};

var glMatrix4FromMatrix = function (m) {
    return glMatrix4(
        m[0][0], m[0][1], m[0][2], m[0][3],
        m[1][0], m[1][1], m[1][2], m[1][3],
        m[2][0], m[2][1], m[2][2], m[2][3],
        m[3][0], m[3][1], m[3][2], m[3][3]
    );
};


var scalarProduct4 = function (v, w) {
    return v[0] * w[0] + v[1] * w[1] + v[2] * w[2] + v[3] * w[3];
};

var matrix4Column = function (m, c) {
    return [m[0][c], m[1][c], m[2][c], m[3][c]];
};

var matrix4Product = function (m1, m2) {
    var sp = scalarProduct4;
    var col = matrix4Column;
    return [
        [sp(m1[0], col(m2, 0)), sp(m1[0], col(m2, 1)), sp(m1[0], col(m2, 2)), sp(m1[0], col(m2, 3))],
        [sp(m1[1], col(m2, 0)), sp(m1[1], col(m2, 1)), sp(m1[1], col(m2, 2)), sp(m1[1], col(m2, 3))],
        [sp(m1[2], col(m2, 0)), sp(m1[2], col(m2, 1)), sp(m1[2], col(m2, 2)), sp(m1[1], col(m2, 3))],
        [sp(m1[3], col(m2, 0)), sp(m1[3], col(m2, 1)), sp(m1[3], col(m2, 2)), sp(m1[3], col(m2, 3))]
    ];
};

var matrix4RotatedXZ = function (matrix, alpha) {
    var c = Math.cos(alpha);
    var s = Math.sin(alpha);
    var rot = [[c, 0, -s, 0],
    [0, 1, 0, 0],
    [s, 0, c, 0],
    [0, 0, 0, 1]
    ];

    return matrix4Product(rot, matrix);
};

var matrix4RotatedYZ = function (matrix, alpha) {
    var c = Math.cos(alpha);
    var s = Math.sin(alpha);
    var rot = [[1, 0, 0, 0],
    [0, c, -s, 0],
    [0, s, c, 0],
    [0, 0, 0, 1]
    ];

    return matrix4Product(rot, matrix);
};

var currentFilter = 0;

var boxFaceTextures = [];

function normalize(v) {
    let length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (length > 0.00001) {
        return [v[0] / length, v[1] / length, v[2] / length];
    } else {
        return [0, 0, 0];
    }
}

var redraw = function () {
    var projectionMatrix = glMatrix4FromMatrix(createProjectionMatrix4(gl,
        PROJECTION_Z_NEAR,
        PROJECTION_Z_FAR,
        PROJECTION_ZOOM_Y)
    );
    var rotationMatrix = glMatrix4FromMatrix(rotationMatrix4); //tmp

    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(1, 1, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.depthFunc(gl.LESS);

    gl.useProgram(shaderProgram);

    gl.uniformMatrix4fv(rotationLocation, false, rotationMatrix);
    gl.uniform3fv(moveLocation, moveVector);
    gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);
    gl.uniform1f(ambientStrengthLocation, 0.5)
    gl.uniform3f(lightColorLocation, 1, 0.6, 0)
    gl.uniform3f(lightDirLocation, ...normalize([0.8, 0.3, 0.5]))
    gl.uniform3f(fogColorLocation, 1, 1, 1)
    gl.uniform1f(fogNearLocation, 80)
    gl.uniform1f(fogFarLocation, 150)

    gl.enableVertexAttribArray(aPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, plot.glInfo.positionBuffer);
    gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);

    if (POINTS)
        gl.drawArrays(gl.POINTS, 0, plot.points.length / 3);
    else {
        gl.enableVertexAttribArray(aNormalLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, plot.glInfo.normalBuffer);
        gl.vertexAttribPointer(aNormalLocation, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, plot.points.length / 3);
    }
}

onWindowResize = function () {
    var wth = parseInt(window.innerWidth) - 10;
    var hth = parseInt(window.innerHeight) - 10;
    canvasGL.setAttribute("width", '' + wth);
    canvasGL.setAttribute("height", '' + hth);
    gl.viewportWidth = wth;
    gl.viewportHeight = hth;
    gl.viewport(0, 0, wth, hth);
};




function onKeyDown(e) {
    var code = e.which || e.keyCode;
    var alpha = Math.PI / 32;
    switch (code) {
        case 38: // up
        case 73: // I
            rotationMatrix4 = matrix4RotatedYZ(rotationMatrix4, alpha);
            break;
        case 40: // down
        case 75: // K
            rotationMatrix4 = matrix4RotatedYZ(rotationMatrix4, -alpha);
            break;
        case 37: // left
        case 74:// J
            rotationMatrix4 = matrix4RotatedXZ(rotationMatrix4, -alpha);
            break;
        case 39:// right
        case 76: // L
            rotationMatrix4 = matrix4RotatedXZ(rotationMatrix4, alpha);
            break;
        case 70: // F
            moveVector[2]++;
            break;
        case 66: // B
        case 86: // V
            moveVector[2]--;
            break;
        case 32: // space
            rotationMatrix4 = identityMatrix4;
            break;
        case 81:
            currentFilter--;
            break;
        case 69:
            currentFilter++;
            break;
    }
    redraw();
}

window.onload = function () {
    html = {};
    html.canvasGL = document.querySelector('#canvasGL');
    html.canvasTex = document.querySelector('#canvasTex');
    gl = canvasGL.getContext("webgl");

    const points = document.getElementById("points");
    const triangles = document.getElementById("triangles");
    const function_formula = document.getElementById('func');

    points.addEventListener('click', () => {
        POINTS = true;
        TRIANGLES = false;
        with (Math) {
            try {
                func_form = eval(`(x, y) => ${function_formula.value}`);
                plot = new Plot(gl, func_form, POINTS);
                redraw()
            } catch (e) {
                alert('Błędny wzór funkcji');
            }
        }
    })

    triangles.addEventListener('click', () => {
        POINTS = false;
        TRIANGLES = true;
        with (Math) {
            try {
                func_form = eval(`(x, y) => ${function_formula.value}`);
                plot = new Plot(gl, func_form, POINTS);
                redraw()
            } catch (e) {
                alert('Błędny wzór funkcji');
            }
        }
    })


    filters = [
        gl.NEAREST,
        gl.LINEAR,
        gl.NEAREST_MIPMAP_NEAREST,
        gl.NEAREST_MIPMAP_LINEAR,
        gl.LINEAR_MIPMAP_NEAREST,
        gl.LINEAR_MIPMAP_LINEAR
    ];

    filters_names = [
        'NEAREST',
        'LINEAR',
        'NEAREST_MIPMAP_NEAREST',
        'NEAREST_MIPMAP_LINEAR',
        'LINEAR_MIPMAP_NEAREST',
        'LINEAR_MIPMAP_LINEAR'
    ];

    cubeFace = [
        gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ];

    skyboxXYZ = [
        sbx_xyzXPlus, sbx_xyzXMinus,
        sbx_xyzYPlus, sbx_xyzYMinus,
        sbx_xyzZPlus, sbx_xyzZMinus
    ];


    boxFaceTextures = [];

    makeShaderProgram(gl);
    sbx_makeShaderProgram(gl);

    onWindowResize();
    window.onresize = onWindowResize;
    window.onkeydown = onKeyDown;
}

