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

// // <---------- Rendering Stuffs ---------->
// // Tell WebGL how to convert from clip space to pixels
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

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
    eventListeners.add(["click", rectangleTool.handleClick.bind(rectangleTool)]);
    eventListeners.add(["mousemove", rectangleTool.handleMouseMove.bind(rectangleTool)]);
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
    eventListeners.add(["mousemove", squareTool.handleMouseMove.bind(squareTool)]);
    eventListeners.addToCanvas();
    currentTool = squareTool;
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
    eventListeners.add(["click", changeColorTool.handleClick.bind(changeColorTool)]);
    eventListeners.addToCanvas();
    currentTool = changeColorTool;
    currentTool.redrawCanvas();
  }
}

function useDeleteTool() {
  if (!(currentTool instanceof DeleteTool)){
    currentTool.reset();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.add(["click", deleteTool.handleClick.bind(deleteTool)]);
    eventListeners.addToCanvas();
    currentTool = deleteTool;
    currentTool.redrawCanvas();
  }
}