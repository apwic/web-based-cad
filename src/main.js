// Isinya manggil fungsi yang digunakan
// <---------- Initiating Stuffs ---------->
const vertexSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;
  varying lowp vec4 vColor;
  void main(){
    gl_Position = aVertexPosition;
    vColor = aVertexColor;
  }
// `;

const fragmentSource = `
  precision mediump float;
  varying lowp vec4 vColor;
  void main(){
    gl_FragColor = vColor;
  }
`;
// const vertexSource = `
// // an attribute will receive data from a buffer
// attribute vec4 a_position;

// // all shaders have a main function
// void main() {

//   // gl_Position is a special variable a vertex shader
//   // is responsible for setting
//   gl_Position = a_position;
// }
// `;

// const fragmentSource = `
// // fragment shaders don't have a default precision so we need
//   // to pick one. mediump is a good default
//   precision mediump float;

//   void main() {
//     // gl_FragColor is a special variable a fragment shader
//     // is responsible for setting
//     gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
//   }
// `;

// Get WebGL context
const canvas = document.getElementById("gl-canvas");
const size = 500; // Size of the canvas in CSS pixels.Change until no blur.
const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
canvas.width = Math.floor(size * scale);
canvas.height = Math.floor(size * scale);
let gl = setupWebGL(canvas);

// Clear the canvas
gl.clearColor(0, 0, 0, 0.5);
gl.clear(gl.COLOR_BUFFER_BIT);

// Link two shaders into a program
const program = createProgram(gl, vertexSource, fragmentSource);

const programInfo = {
  program: program,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
    vertexColor: gl.getAttribLocation(program, "aVertexColor"),
  },
};

const buffers = initBuffers(gl);

drawScene(gl, programInfo, buffers);

// // look up where the vertex data needs to go.
// const positionAttributeLocation = gl.getAttribLocation(
//   program,
//   "aVertexPosition"
// );

// // create a buffer and put three 2d clip space points in it
// const positionBuffer = gl.createBuffer();
// const colorBuffer = gl.createBuffer();

// // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// const defaultVertices = [0, 0, 0, 0.5, 0.7, 0];
// const defaultColor = [1, 0, 0.5, 1, 1, 0, 0.5, 1, 1, 0, 0.5, 1];

// gl.bufferData(
//   gl.ARRAY_BUFFER,
//   new Float32Array(defaultVertices),
//   gl.STATIC_DRAW
// );

// // <---------- Rendering Stuffs ---------->
// // Tell WebGL how to convert from clip space to pixels
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// // Turn on the attribute
// gl.enableVertexAttribArray(positionAttributeLocation);

// // Bind the position buffer.
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// // // Create, turn on, and bind the color buffer attribute
// // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(defaultColor), gl.STATIC_DRAW);
// // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// // const colorAttributeLocation = gl.getAttribLocation(program, "aVertexColor");
// // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// // gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
// // gl.enableVertexAttribArray(colorAttributeLocation);

// // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
// let size = 2; // 2 components per iteration
// let type = gl.FLOAT; // the data is 32bit floats
// let normalize = false; // don't normalize the data
// let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
// let offset = 0; // start at the beginning of the buffer
// gl.vertexAttribPointer(
//   positionAttributeLocation,
//   size,
//   type,
//   normalize,
//   stride,
//   offset
// );

// // draw
// let primitiveType = gl.TRIANGLES;
// let offsetDraw = 0;
// let count = 3;
// gl.drawArrays(primitiveType, offsetDraw, count);

// // Tell it to use our program (pair of shaders)
// gl.useProgram(program);
