class Plot {

    constructor(gl, func, points) {
        this.fidelity = 500
        this.graphSize = 20
        this.gl = gl;
        this.glInfo = {};
        this.fn = func;
        this.rotationMatrix4 = identityMatrix4;
        this.rotationMatrix = glMatrix4FromMatrix(this.rotationMatrix4);
        this.moveVector = [0, 0, 50];
        this.piksel = 0;
        this.piksel_buffer = 0;
        if (points)
            this.drawArea([-5, 5], [-5, 5], false)
        else
            this.drawArea([-5, 5], [-5, 5], true)
    }

    triangleNormal(triangle, swap = false) {
        let U = [triangle[3] - triangle[0], triangle[4] - triangle[1], triangle[5] - triangle[2]];
        let V = [triangle[6] - triangle[0], triangle[7] - triangle[1], triangle[8] - triangle[2]];

        if (swap) [U, V] = [V, U];

        return [
            U[1] * V[2] - U[2] * V[1],
            U[2] * V[0] - U[0] * V[2],
            U[0] * V[1] - U[1] * V[0]
        ];
    }

    move(x = 0, y = 0, z = 0) {
        this.moveVector[0] += x;
        this.moveVector[1] += y;
        this.moveVector[2] += z;
    }

    setPiksel(piksel) {
        this.piksel = piksel;
    }

    rotation(YZ = 0, XZ = 0) {
        this.rotationMatrix4 = matrix4RotatedYZ(this.rotationMatrix4, YZ);
        this.rotationMatrix4 = matrix4RotatedXZ(this.rotationMatrix4, XZ);

        this.rotationMatrix = glMatrix4FromMatrix(this.rotationMatrix4);
    }

    drawArea(xBounds, yBounds, triangles) {
        this.triangles = triangles;
        this.points = [];
        this.normals = [];

        const scaleFactor = this.graphSize / Math.abs(xBounds[1] - xBounds[0]);

        for (let x = 0; x < this.fidelity; x++) {
            for (let y = 0; y < this.fidelity; y++) {
                const val = this.fn(
                    xBounds[0] + x * (xBounds[1] - xBounds[0]) / this.fidelity,
                    yBounds[0] + y * (yBounds[1] - yBounds[0]) / this.fidelity
                ) * scaleFactor;

                if (triangles) {
                    let nextY = null, nextX = null, nextYX = null;
                    if (y !== this.fidelity - 1) {
                        nextY = this.fn(
                            xBounds[0] + x * (xBounds[1] - xBounds[0]) / this.fidelity,
                            yBounds[0] + (y + 1) * (yBounds[1] - yBounds[0]) / this.fidelity
                        ) * scaleFactor;
                    }
                    if (x !== this.fidelity - 1) {
                        nextX = this.fn(
                            xBounds[0] + (x + 1) * (xBounds[1] - xBounds[0]) / this.fidelity,
                            yBounds[0] + y * (yBounds[1] - yBounds[0]) / this.fidelity
                        ) * scaleFactor;
                    }
                    if (x !== this.fidelity - 1 && y !== this.fidelity - 1) {
                        nextYX = this.fn(
                            xBounds[0] + (x + 1) * (xBounds[1] - xBounds[0]) / this.fidelity,
                            yBounds[0] + (y + 1) * (yBounds[1] - yBounds[0]) / this.fidelity
                        ) * scaleFactor;
                    }

                    if (nextX !== null && nextY !== null && nextYX !== null) {
                        const firstTriangle = [
                            x * this.graphSize / this.fidelity - this.graphSize / 2,
                            y * this.graphSize / this.fidelity - this.graphSize / 2,
                            val,
                            (x + 1) * this.graphSize / this.fidelity - this.graphSize / 2,
                            y * this.graphSize / this.fidelity - this.graphSize / 2,
                            nextX,
                            x * this.graphSize / this.fidelity - this.graphSize / 2,
                            (y + 1) * this.graphSize / this.fidelity - this.graphSize / 2,
                            nextY
                        ];

                        const secondTriangle = [
                            (x + 1) * this.graphSize / this.fidelity - this.graphSize / 2,
                            (y + 1) * this.graphSize / this.fidelity - this.graphSize / 2,
                            nextYX,
                            (x + 1) * this.graphSize / this.fidelity - this.graphSize / 2,
                            y * this.graphSize / this.fidelity - this.graphSize / 2,
                            nextX,
                            x * this.graphSize / this.fidelity - this.graphSize / 2,
                            (y + 1) * this.graphSize / this.fidelity - this.graphSize / 2,
                            nextY
                        ];

                        this.points.push(...firstTriangle, ...secondTriangle);
                        this.normals.push(
                            ...this.triangleNormal(firstTriangle),
                            ...this.triangleNormal(firstTriangle),
                            ...this.triangleNormal(firstTriangle),
                            ...this.triangleNormal(secondTriangle, true),
                            ...this.triangleNormal(secondTriangle, true),
                            ...this.triangleNormal(secondTriangle, true)
                        );
                    }
                } else {
                    this.points.push(
                        x * this.graphSize / this.fidelity - this.graphSize / 2,
                        y * this.graphSize / this.fidelity - this.graphSize / 2,
                        val
                    );
                }
            }
        }

        this.glInfo.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glInfo.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);

        if (this.triangles) {
            this.glInfo.normalBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glInfo.normalBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);
        }
    }
}