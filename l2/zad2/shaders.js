const myVertexShader = `
  attribute vec4 a_position;
  uniform vec2 u_resolution;
  uniform float u_depth;
  void main() {
    vec2 zeroToOne = a_position.xy / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), u_depth, 1);
    gl_PointSize = 3.0;
  }
`;

const myFragmentShader = `
  precision mediump float;
  
  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
`;

export { myFragmentShader, myVertexShader };