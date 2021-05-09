const myVertexShader = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;

  uniform vec2 u_resolution;
  uniform float u_depth;

  varying vec2 v_texcoord;

  void main() {
    vec2 zeroToOne = a_position.xy / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), u_depth, 1);
    gl_PointSize = 3.0;

    // Pass the texcoord to the fragment shader.
    v_texcoord = a_texcoord;  
  }
`;

const myFragmentShader = `
  precision mediump float;
  
  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
`;

const myTextureFragmentShader = `
  precision mediump float;
  
  // The texture.
  uniform sampler2D u_texture;

  varying vec2 v_texcoord;

  void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`;

export { myFragmentShader, myVertexShader, myTextureFragmentShader };