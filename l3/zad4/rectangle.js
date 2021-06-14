class Rectangle {

    constructor(gl) {
        this.gl = gl;
        this.glInfo = {};
        this.rotationMatrix4 = identityMatrix4;
        this.rotationMatrix = glMatrix4FromMatrix(this.rotationMatrix4);
        this.moveVector = [0, 0, 0.5];
        this.piksel = 1;
        this.points = [
            -1, -1, 0,
            -1, 1, 0,
            1, 1, 0,
            1, -1, 0,
        ];
        this.glInfo.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glInfo.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);
    }
}