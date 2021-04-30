import { myFragmentShader, myVertexShader } from "./shaders.js";

export class WebGL {

  constructor(canvas) {
    this.gl = canvas.getContext("webgl");
    this.program = this.getProgram();
    this.locations = {
      attributes: {
        position: this.gl.getAttribLocation(this.program, "a_position")
      },
      uniforms: {
        resolution: this.gl.getUniformLocation(this.program, "u_resolution"),
        color: this.gl.getUniformLocation(this.program, "u_color")
      }
    };
  }

  createShader(gl, sourceCode, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
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
    this.gl.bindAttribLocation(program, 3, "a_position");
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        var info = gl.getprogramInfoLog(program);
        throw 'Could not compile WebGL program. \n\n' + info;
    }

    return program;
  }

  draw(positions, primitiveType) {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.useProgram(this.program);
    this.gl.enableVertexAttribArray(3);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    this.gl.vertexAttribPointer(this.locations.attributes.position, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform2f(this.locations.uniforms.resolution, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.uniform4f(this.locations.uniforms.color, 0.7, 0.7, 1, 1);

    this.gl.drawArrays(this.gl[primitiveType], 0, positions.length/2);
  }

  print_active_attr_unif(){
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

}