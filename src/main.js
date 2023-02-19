// Isinya manggil fungsi yang digunakan
// <---------- Initiating Stuffs ---------->
const vertexSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;
  varying lowp vec4 vColor;
  void main(){
    gl_Position = aVertexPosition;
    vColor = aVertexColor;
    gl_PointSize = 5.0;
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
gl.clearColor(0, 0, 0, 0);
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

// initiate position buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);

// initiate color buffer
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);

const buffers = {
  position: positionBuffer,
  color: colorBuffer,
};

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

var models = [];
var colorHex = document.getElementById("color").value;
var color = new Color();
color.setFromHex(colorHex);

const eventListeners = {
  list: [],
  add(element) {
    this.list.push(element);
  },
  clear() {
    while (this.list.length > 0) {
      this.list.pop();
    }
  },
  addToCanvas() {
    for (let element of this.list) {
      canvas.addEventListener(element[0], element[1]);
    }
  },
  removeFromCanvas() {
    for (let element of this.list) {
      canvas.removeEventListener(element[0], element[1]);
    }
  },
};

// initiate all tools
var lineTool = new LineTool(canvas, gl, models, color);
var rectangleTool = new RectangleTool(canvas, gl, models, color);
var squareTool = new SquareTool(canvas, gl, models, color);
var polygonTool = new PolygonTool(canvas, gl, models, color);
var movePointTool = new MovePointTool(canvas, gl, models, color);
var translateDragTool = new TranslateDragTool(canvas, gl, models, color);
var translateSliderTool = new TranslateSliderTool(canvas, gl, models, color);
var changeColorTool = new ChangeColorTool(canvas, gl, models, color);
var deleteTool = new DeleteTool(canvas, gl, models, color);

// set line tool as default, bisa diganti nanti
var currentTool = lineTool;

eventListeners.add(["click", lineTool.handleClick.bind(lineTool)]);
eventListeners.add(["mousemove", lineTool.handleMouseMove.bind(lineTool)]);
eventListeners.addToCanvas();

function setColor() {
  colorHex = document.getElementById("color").value;
  color.setFromHex(colorHex);
}

function useLineTool() {
  if (!(currentTool instanceof LineTool)) {
    currentTool.reset();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.add(["click", lineTool.handleClick.bind(lineTool)]);
    eventListeners.add(["mousemove", lineTool.handleMouseMove.bind(lineTool)]);
    eventListeners.addToCanvas();
    currentTool = lineTool;
    currentTool.redrawCanvas();
  }
}

function useRectangleTool() {
  if (!(currentTool instanceof RectangleTool)) {
    currentTool.reset();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.add([
      "click",
      rectangleTool.handleClick.bind(rectangleTool),
    ]);
    eventListeners.add([
      "mousemove",
      rectangleTool.handleMouseMove.bind(rectangleTool),
    ]);
    eventListeners.addToCanvas();
    currentTool = rectangleTool;
    currentTool.redrawCanvas();
  }
}

function useSquareTool() {
  if (!(currentTool instanceof SquareTool)) {
    currentTool.reset();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.add(["click", squareTool.handleClick.bind(squareTool)]);
    eventListeners.add([
      "mousemove",
      squareTool.handleMouseMove.bind(squareTool),
    ]);
    eventListeners.addToCanvas();
    currentTool = squareTool;
    currentTool.redrawCanvas();
  }
}

function usePolygonTool() {
  if (!(currentTool instanceof PolygonTool)) {
    currentTool.reset();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.add(["click", polygonTool.handleClick.bind(polygonTool)]);
    eventListeners.add([
      "mousemove",
      polygonTool.handleMouseMove.bind(polygonTool),
    ]);
    eventListeners.add([
      "contextmenu",
      polygonTool.handleRightClick.bind(polygonTool),
    ]);
    eventListeners.addToCanvas();
    currentTool = polygonTool;
    currentTool.redrawCanvas();
  }
}

function useMovePointTool() {
  if (!(currentTool instanceof MovePointTool)) {
    currentTool.reset();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.add([
      "mousedown",
      movePointTool.handleMouseDown.bind(movePointTool),
    ]);
    eventListeners.add([
      "mousemove",
      movePointTool.handleMouseMove.bind(movePointTool),
    ]);
    eventListeners.add([
      "mouseup",
      movePointTool.handleMouseUp.bind(movePointTool),
    ]);
    eventListeners.addToCanvas();
    currentTool = movePointTool;
    currentTool.redrawCanvas();
  }
}

function useTranslateDragTool() {
  if (!(currentTool instanceof TranslateDragTool)) {
    currentTool.reset();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.add([
      "mousedown",
      translateDragTool.handleMouseDown.bind(translateDragTool),
    ]);
    eventListeners.add([
      "mouseup",
      translateDragTool.handleMouseUp.bind(translateDragTool),
    ]);
    eventListeners.add([
      "mousemove",
      translateDragTool.handleMouseMove.bind(translateDragTool),
    ]);

    eventListeners.addToCanvas();

    currentTool = translateDragTool;
    currentTool.redrawCanvas();
  }
}

function useTranslateSliderTool() {
  if (!(currentTool instanceof TranslateSliderTool)) {
    currentTool.reset();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.add([
      "click",
      translateSliderTool.handleClick.bind(translateSliderTool),
    ]);
    eventListeners.addToCanvas();

    const transformInput = document.getElementById("transform-input");
    // add translate X slider
    const labelX = document.createElement("label");
    labelX.innerHTML = "Translate X";
    transformInput.appendChild(labelX);
    const sliderX = document.createElement("input");
    sliderX.setAttribute("id", "translateX");
    sliderX.setAttribute("type", "range");
    sliderX.setAttribute("min", -1);
    sliderX.setAttribute("max", 1);
    sliderX.setAttribute("step", 0.001);
    sliderX.setAttribute("value", 0);
    transformInput.appendChild(sliderX);
    // add translate Y slider
    const labelY = document.createElement("label");
    labelY.innerHTML = "Translate Y";
    transformInput.appendChild(labelY);
    const sliderY = document.createElement("input");
    sliderY.setAttribute("id", "translateY");
    sliderY.setAttribute("type", "range");
    sliderY.setAttribute("min", -1);
    sliderY.setAttribute("max", 1);
    sliderY.setAttribute("step", 0.001);
    sliderY.setAttribute("value", 0);
    transformInput.appendChild(sliderY);

    var currXValue = 0;
    var currYValue = 0;
    sliderX.oninput = function () {
      var newXValue = parseFloat(this.value);
      currentTool.handleInputValueChange(newXValue - currXValue, 0);
      currXValue = newXValue;
    };
    sliderY.oninput = function () {
      var newYValue = parseFloat(this.value);
      currentTool.handleInputValueChange(0, newYValue - currYValue);
      currYValue = newYValue;
    };
    currentTool = translateSliderTool;
    currentTool.redrawCanvas();
  }
}

function useChangeColorTool() {
  if (!(currentTool instanceof ChangeColorTool)) {
    currentTool.reset();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.add([
      "click",
      changeColorTool.handleClick.bind(changeColorTool),
    ]);
    eventListeners.addToCanvas();
    currentTool = changeColorTool;
    currentTool.redrawCanvas();
  }
}

function useDeleteTool() {
  if (!(currentTool instanceof DeleteTool)) {
    currentTool.reset();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.add(["click", deleteTool.handleClick.bind(deleteTool)]);
    eventListeners.addToCanvas();
    currentTool = deleteTool;
    currentTool.redrawCanvas();
  }
}
