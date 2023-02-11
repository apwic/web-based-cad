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

class MovePointTool extends Tool {
  // constructor
  constructor(canvas, gl, models, currentColor) {
    super(canvas, gl, models, currentColor);
    this.isMoving = false;
    this.referencePoint = [];
    this.selectedModel = null;
  }

  // search index of selected model in models
  searchModelIndex(point) {
    for (let i = 0; i < this.models.length; i++) {
      for (let j = 0; j < this.models[i].points.length; j++) {
        if (this.models[i].points[j].isNear(point)) {
          return {
            modelIndex: i,
            pointIndex: j,
          };
        }
      }
    }
    return -1;
  }

  // handle mouse down event
  handleMouseDown(event) {
    let mousePosition = this.getMousePosition(event);
    let index = this.searchModelIndex(mousePosition);
    if (index != -1) {
      this.isMoving = true;
      if (this.models[index.modelIndex] instanceof Line) {
        if (index.pointIndex == 0) {
          var refPointIndex = 1;
          var selectedPointIndex = 0;
        } else {
          var refPointIndex = 0;
          var selectedPointIndex = 1;
        }
        mousePosition.setColor(
          this.models[index.modelIndex].points[selectedPointIndex].getColor()
        );
        let oldRefPoint = this.models[index.modelIndex].points[refPointIndex];
        let referencePoint = new Point();
        referencePoint.setPoint(
          oldRefPoint.getAbsis(),
          oldRefPoint.getOrdinate()
        );
        referencePoint.setColor(oldRefPoint.getColor());
        this.referencePoint.push(referencePoint);
        this.selectedModel = new Line(this.gl, [
          this.referencePoint[0],
          mousePosition,
        ]);
      }
      this.models.splice(index.modelIndex, 1);
      this.redrawCanvas();
      this.selectedModel.draw();
    }
  }

  // handle mouse move event
  handleMouseMove(event) {
    if (this.isMoving) {
      this.redrawCanvas();
      let mousePosition = this.getMousePosition(event);
      this.selectedModel.points[1].setPoint(
        mousePosition.getAbsis(),
        mousePosition.getOrdinate()
      );
      this.selectedModel.draw();
    }
  }

  // handle mouse up event
  handleMouseUp(event) {
    if (this.isMoving) {
      this.models.push(this.selectedModel);
      this.reset();
      this.redrawCanvas();
    }
  }

  // reset tool
  reset() {
    this.isMoving = false;
    this.referencePoint = [];
    this.selectedModel = null;
  }
}
