// Isinya fungsi yang digunakan untuk config shader

function setupWebGL(canvas) {
  const gl = canvas.getContext("webgl");

  if (!gl) {
    alert("WebGL isn't available");
    return;
  }

  return gl;
}

function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  alert("Failed to create shader. Reason: ", gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  alert("Failed to create program. Reason: ", gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);
  const colorBuffer = initColorBuffer(gl);
  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

// function initColorBuffer(gl) {
//   const colors = [
//     1.0,
//     1.0,
//     1.0,
//     1.0, // white
//     1.0,
//     0.0,
//     0.0,
//     1.0, // red
//     0.0,
//     1.0,
//     0.0,
//     1.0, // green
//     0.0,
//     0.0,
//     1.0,
//     1.0, // blue
//   ];

//   const colorBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

//   return colorBuffer;
// }

// function initPositionBuffer(gl) {
//   // Create a buffer for the square's positions.
//   const positionBuffer = gl.createBuffer();

//   // Select the positionBuffer as the one to apply buffer
//   // operations to from here out.
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//   // Now create an array of positions for the square.
//   const positions = [0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5];

//   // Now pass the list of positions into WebGL to build the
//   // shape. We do this by creating a Float32Array from the
//   // JavaScript array, then use it to fill the current buffer.
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//   return positionBuffer;
// }

function drawScene(gl, programInfo, buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 0.5); // Clear to black, fully opaque
  //   gl.clearDepth(1.0); // Clear everything
  //   gl.enable(gl.DEPTH_TEST); // Enable depth testing
  //   gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers, programInfo);
  setColorAttribute(gl, buffers, programInfo);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // {
  //   const offset = 0;
  //   const vertexCount = 4;
  //   gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  // }
}

function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 2; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}
