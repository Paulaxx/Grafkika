import { myFragmentShader, myVertexShader, myTextureFragmentShader } from "./shaders.js";
import { Player } from "./objects.js"

export class WebGL {

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.gl = canvas.getContext("webgl");
        this.program = this.getProgram();
        this.programTextures = this.getTexturedProgram();
        this.locations = {
            attributes: {
                position: this.gl.getAttribLocation(this.program, "a_position")
            },
            uniforms: {
                resolution: this.gl.getUniformLocation(this.program, "u_resolution"),
                color: this.gl.getUniformLocation(this.program, "u_color"),
                depth: this.gl.getUniformLocation(this.program, "u_depth")
            }
        };
        this.locationsTextured = {
            attributes: {
                position: this.gl.getAttribLocation(this.programTextures, "a_position"),
                textcord: this.gl.getAttribLocation(this.programTextures, "a_texcoord")
            },
            uniforms: {
                resolution: this.gl.getUniformLocation(this.programTextures, "u_resolution"),
                depth: this.gl.getUniformLocation(this.programTextures, "u_depth"),
                texture: this.gl.getUniformLocation(this.programTextures, "u_texture")
            }
        };
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    createShader(gl, sourceCode, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, sourceCode);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            var info = gl.getShaderInfoLog(shader);
            throw 'Could not compile WebGL program. \n\n' + info;
        }
        return shader;
    }

    getProgram() {
        const vertexShader = this.createShader(this.gl, myVertexShader, this.gl.VERTEX_SHADER);
        const fragmentShader = this.createShader(this.gl, myFragmentShader, this.gl.FRAGMENT_SHADER);

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            var info = gl.getprogramInfoLog(program);
            throw 'Could not compile WebGL program. \n\n' + info;
        }

        return program;
    }

    getTexturedProgram() {
        const vertexShader = this.createShader(this.gl, myVertexShader, this.gl.VERTEX_SHADER);
        const fragmentShader = this.createShader(this.gl, myTextureFragmentShader, this.gl.FRAGMENT_SHADER);

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            var info = gl.getprogramInfoLog(program);
            throw 'Could not compile WebGL program. \n\n' + info;
        }

        return program;
    }

    draw(turtles) {


        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);

        turtles.forEach(element => {

            var positions = []
            element.points.forEach(point => {
                positions.push(point.x);
                positions.push(point.y);
            })
            const positionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

            if (!element.textured) {
                this.gl.useProgram(this.program);
                this.gl.enableVertexAttribArray(this.locations.attributes.position);

                this.gl.vertexAttribPointer(this.locations.attributes.position, 2, this.gl.FLOAT, false, 0, 0);
                this.gl.uniform2f(this.locations.uniforms.resolution, this.gl.canvas.width, this.gl.canvas.height);
                this.gl.uniform4f(this.locations.uniforms.color, ...element.info.color);
                this.gl.uniform1f(this.locations.uniforms.depth, element.info.z);

                this.gl.drawArrays(this.gl[element.info.type], 0, positions.length / 2);
                this.gl.disableVertexAttribArray(this.locations.attributes.position);
            }
            else {
                //texturki
                this.gl.useProgram(this.programTextures);
                this.gl.enableVertexAttribArray(this.locationsTextured.attributes.position);
                this.gl.enableVertexAttribArray(this.locationsTextured.attributes.textcord);
                this.gl.vertexAttribPointer(this.locationsTextured.attributes.position, 2, this.gl.FLOAT, false, 0, 0);

                const textureBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(element.texcoords), this.gl.STATIC_DRAW);
                this.gl.vertexAttribPointer(this.locationsTextured.attributes.textcord, 2, this.gl.FLOAT, false, 0, 0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, element.texture);

                this.gl.uniform2f(this.locationsTextured.uniforms.resolution, this.gl.canvas.width, this.gl.canvas.height);
                this.gl.uniform1f(this.locationsTextured.uniforms.depth, element.info.z);
                this.gl.uniform1i(this.locationsTextured.uniforms.texture, 0);

                this.gl.drawArrays(this.gl[element.info.type], 0, positions.length / 2);
                this.gl.disableVertexAttribArray(this.locationsTextured.attributes.textcord);
                this.gl.disableVertexAttribArray(this.locationsTextured.attributes.position);
            }

        });
    }

    print_active_attr_unif() {
        const numAttribs = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttribs; ++i) {
            const info = this.gl.getActiveAttrib(this.program, i);
            console.log("name:", info.name, "type:", info.type, "size:", info.size);
        }

        const numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniforms; ++i) {
            const info = this.gl.getActiveUniform(this.program, i);
            console.log('name:', info.name, 'type:', info.type, 'size:', info.size);
        }

        console.log("a_position location: ", this.gl.getAttribLocation(this.program, "a_position"));

    }

    bindTextureToObject(object, textureSrc) {
        object.textured = true;
        object.texcoords = [0, 0, 1, 0, 0.5, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0,];
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            1,
            1,
            0,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            new Uint8Array([0, 255, 0, 255])
        );

        const image = new Image();
        image.src = textureSrc;
        image.addEventListener("load", () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                image
            );
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        });

        object.texture = texture;
    }

}