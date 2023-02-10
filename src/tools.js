class Tool {
  // constructor
  constructor(canvas, gl, models, currentColor) {
    this.canvas = canvas;
    this.gl = gl;
    this.models = models;
    this.currentColor = currentColor;
  }

  // set current color
  setColor(color) {
    this.currentColor = color;
  }

  // redraw canvas
  redrawCanvas() {
    // Clear the canvas
    this.gl.clearColor(0, 0, 0, 0.5);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    // draw all models
    for (let model of this.models) {
      model.draw();
    }
  }

  // get mouse position
  getMousePosition(event) {
    let x = (event.offsetX / this.canvas.clientWidth) * 2 - 1;
    let y = (1 - event.offsetY / this.canvas.clientHeight) * 2 - 1;
    return new Point(x, y);
  }

  // reset tool
  reset() {}
}

class LineTool extends Tool {
  // constructor
  constructor(canvas, gl, models, currentColor) {
    super(canvas, gl, models, currentColor);
    this.line = null;
    this.isDrawing = false;
  }

  // handle click event
  handleClick(event) {
    if (!this.isDrawing) {
      let mousePosition = this.getMousePosition(event);
      mousePosition.setColor(this.currentColor);
      this.line = new Line(this.gl, [mousePosition, new Point()]);
      this.isDrawing = true;
    } else {
      this.models.push(this.line);
      this.reset();
      this.redrawCanvas();
    }
  }

  // handle mousemove event
  handleMouseMove(event) {
    if (this.isDrawing) {
      this.redrawCanvas();
      let mousePosition = this.getMousePosition(event);
      this.line.points[1].setPoint(
        mousePosition.getAbsis(),
        mousePosition.getOrdinate()
      );
      this.line.points[1].setColor(this.currentColor);
      this.line.draw();
    }
  }

  // reset tool
  reset() {
    this.line = null;
    this.isDrawing = false;
  }
}
