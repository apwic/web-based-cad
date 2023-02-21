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
    this.gl.clearColor(0, 0, 0, 0);
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

  // search index of selected model's point in models
  searchModelPointIndex(point) {
    for (let i = this.models.length - 1; i > -1; i--) {
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

  // search index of selected model in models
  searchModelIndex(point) {
    for (let i = this.models.length - 1; i > -1; i--) {
      if (this.models[i].isContain(point)) {
        return i;
      }
    }
    return -1;
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

class RectangleTool extends Tool {
  // constructor
  constructor(canvas, gl, models, currentColor) {
    super(canvas, gl, models, currentColor);
    this.rectangle = null;
    this.isDrawing = false;
  }

  // handle click event
  handleClick(event) {
    if (!this.isDrawing) {
      let mousePosition = this.getMousePosition(event);
      mousePosition.setColor(this.currentColor);
      this.rectangle = new Rectangle(this.gl, [
        mousePosition,
        new Point(),
        new Point(),
        new Point(),
      ]);
      this.isDrawing = true;
    } else {
      this.models.push(this.rectangle);
      this.reset();
      this.redrawCanvas();
    }
  }

  // handle mousemove event
  handleMouseMove(event) {
    if (this.isDrawing) {
      this.redrawCanvas();
      let mousePosition = this.getMousePosition(event);
      let x1 = this.rectangle.points[0].x;
      let y1 = this.rectangle.points[0].y;
      let x2 = mousePosition.getAbsis();
      let y2 = mousePosition.getOrdinate();
      // set changing points while moving mouse
      this.rectangle.setPointsRectangle(
        new Point(x1, y2),
        new Point(x2, y1),
        new Point(x2, y2)
      );
      // set all points of the same color, might change this part
      this.rectangle.setColorsRectangle(
        this.currentColor,
        this.currentColor,
        this.currentColor
      );
      this.rectangle.draw();
    }
  }

  // reset tool
  reset() {
    this.rectangle = null;
    this.isDrawing = false;
  }
}

class SquareTool extends Tool {
  // constructor
  constructor(canvas, gl, models, currentColor) {
    super(canvas, gl, models, currentColor);
    this.square = null;
    this.isDrawing = false;
  }

  // handle click event
  handleClick(event) {
    if (!this.isDrawing) {
      let mousePosition = this.getMousePosition(event);
      mousePosition.setColor(this.currentColor);
      this.square = new Square(this.gl, [
        mousePosition,
        new Point(),
        new Point(),
        new Point(),
      ]);
      this.isDrawing = true;
    } else {
      this.models.push(this.square);
      this.reset();
      this.redrawCanvas();
    }
  }

  // handle mousemove event
  handleMouseMove(event) {
    if (this.isDrawing) {
      this.redrawCanvas();
      let mousePosition = this.getMousePosition(event);
      let x1 = this.square.points[0].x;
      let y1 = this.square.points[0].y;
      let x2 = mousePosition.getAbsis();
      let y2 = mousePosition.getOrdinate();

      let side = Math.min(Math.abs(y2 - y1), Math.abs(x2 - x1));
      let scaled = (side * this.canvas.clientHeight) / this.canvas.clientWidth;

      // set changing points while moving mouse
      // quadrant 1
      if (x2 > x1 && y2 > y1) {
        this.square.setPointsSquare(
          new Point(x1, y1 + side),
          new Point(x1 + scaled, y1),
          new Point(x1 + scaled, y1 + side)
        );
        // quadrant 2
      } else if (x2 < x1 && y2 > y1) {
        this.square.setPointsSquare(
          new Point(x1, y1 + side),
          new Point(x1 - scaled, y1),
          new Point(x1 - scaled, y1 + side)
        );
        // quadrant 3
      } else if (x2 < x1 && y2 < y1) {
        this.square.setPointsSquare(
          new Point(x1, y1 - side),
          new Point(x1 - scaled, y1),
          new Point(x1 - scaled, y1 - side)
        );
        // quadrant 4
      } else {
        this.square.setPointsSquare(
          new Point(x1, y1 - side),
          new Point(x1 + scaled, y1),
          new Point(x1 + scaled, y1 - side)
        );
      }

      // set all points of the same color, might change this part
      this.square.setColorsSquare(
        this.currentColor,
        this.currentColor,
        this.currentColor
      );

      this.square.draw();
    }
  }

  // reset tool
  reset() {
    this.square = null;
    this.isDrawing = false;
  }
}

class PolygonTool extends Tool {
  // constructor
  constructor(
    canvas,
    gl,
    models,
    currentColor,
    shape = modelsShape.POLYGON_SHAPE
  ) {
    super(canvas, gl, models, currentColor);
    this.shape = shape;
    this.polygon = null;
    this.isDrawing = false;
  }

  // setter shape
  setShape(shape) {
    this.shape = shape;
  }

  // handle click event
  handleClick(event) {
    if (!this.isDrawing) {
      let mousePosition = this.getMousePosition(event);
      mousePosition.setColor(this.currentColor);
      this.polygon = new Polygon(this.gl, this.shape, [
        mousePosition,
        new Point(),
      ]);
      this.isDrawing = true;
    } else {
      this.redrawCanvas();
      let mousePosition = this.getMousePosition(event);
      mousePosition.setColor(this.currentColor);
      this.polygon.points.push(mousePosition);
      this.polygon.draw();
    }
  }

  // handle mousemove event
  handleMouseMove(event) {
    if (this.isDrawing) {
      this.redrawCanvas();
      let mousePosition = this.getMousePosition(event);
      this.polygon.points[this.polygon.points.length - 1].setPoint(
        mousePosition.getAbsis(),
        mousePosition.getOrdinate()
      );
      this.polygon.points[this.polygon.points.length - 1].setColor(
        this.currentColor
      );
      this.polygon.draw();
    }
  }

  // handle right click event
  handleRightClick(event) {
    if (this.isDrawing) {
      event.preventDefault();
      this.models.push(this.polygon);
      this.reset();
      this.redrawCanvas();
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
    this.selectedModel = null;
    this.selectedPointIndex = null;
  }

  // handle mouse down event
  handleMouseDown(event) {
    let mousePosition = this.getMousePosition(event);
    let index = this.searchModelPointIndex(mousePosition);

    if (index != -1) {
      this.isMoving = true;
      this.selectedModel = this.models[index.modelIndex];
      // move line
      if (this.selectedModel instanceof Line) {
        if (index.pointIndex == 0) {
          var refPointIndex = 1;
          var selectedPointIndex = 0;
        } else {
          var refPointIndex = 0;
          var selectedPointIndex = 1;
        }

        mousePosition.setColor(
          this.selectedModel.points[selectedPointIndex].getColor()
        );

        let oldRefPoint = this.selectedModel.points[refPointIndex];

        this.selectedModel = new Line(this.gl, [oldRefPoint, mousePosition]);

        // move rectangle
      } else if (
        this.selectedModel instanceof Rectangle ||
        this.selectedModel instanceof Square
      ) {
        let refPointIndex, selectedPointIndex;
        // search the reference point, same between Rectangle and Square
        // the opposite of the pointIndex
        if (index.pointIndex == 0) {
          refPointIndex = 3;
          selectedPointIndex = 0;
        } else if (index.pointIndex == 1) {
          refPointIndex = 2;
          selectedPointIndex = 1;
        } else if (index.pointIndex == 2) {
          refPointIndex = 1;
          selectedPointIndex = 2;
        } else {
          refPointIndex = 0;
          selectedPointIndex = 3;
        }

        // get the color of selected point
        mousePosition.setColor(
          this.selectedModel.points[selectedPointIndex].getColor()
        );

        // get the point of selected point
        let oldRefPoint = this.selectedModel.points[refPointIndex];

        // set the models
        if ((this, this.selectedModel instanceof Rectangle)) {
          this.selectedModel = new Rectangle(this.gl, [
            oldRefPoint,
            mousePosition,
          ]);
        } else {
          this.selectedModel = new Square(
            this.gl,
            [oldRefPoint, mousePosition],
            this.canvas.clientHeight,
            this.canvas.clientWidth
          );
        }
      }
      // move polygon
      else if (this.selectedModel instanceof Polygon) {
        this.selectedPointIndex = index.pointIndex;

        mousePosition.setColor(
          this.selectedModel.points[selectedPointIndex].getColor()
        );

        var points = [];

        // copy all points except the selected point
        for (let i = 0; i < this.selectedModel.points.length; i++) {
          if (i != this.selectedPointIndex) {
            points.push(this.selectedModel.points[i]);
          } else {
            points.push(mousePosition);
          }
        }

        this.selectedModel = new Polygon(this.gl, points);
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
      // handle move for line
      if (this.selectedModel instanceof Line) {
        this.selectedModel.points[1].setPoint(
          mousePosition.getAbsis(),
          mousePosition.getOrdinate()
        );
        // handle move for rectangle
      } else if (this.selectedModel instanceof Rectangle) {
        let x1 = this.selectedModel.points[0].x;
        let y1 = this.selectedModel.points[0].y;
        let x2 = mousePosition.getAbsis();
        let y2 = mousePosition.getOrdinate();
        // set changing points while moving mouse
        this.selectedModel.setPointsRectangle(
          new Point(x1, y2),
          new Point(x2, y1),
          new Point(x2, y2)
        );
      } else if (this.selectedModel instanceof Square) {
        let x1 = this.selectedModel.points[0].x;
        let y1 = this.selectedModel.points[0].y;
        let x2 = mousePosition.getAbsis();
        let y2 = mousePosition.getOrdinate();

        let side = Math.min(Math.abs(y2 - y1), Math.abs(x2 - x1));
        let scaled =
          (side * this.canvas.clientHeight) / this.canvas.clientWidth;

        // set changing points while moving mouse
        // quadrant 1
        if (x2 > x1 && y2 > y1) {
          this.selectedModel.setPointsSquare(
            new Point(x1, y1 + side),
            new Point(x1 + scaled, y1),
            new Point(x1 + scaled, y1 + side)
          );
          // quadrant 2
        } else if (x2 < x1 && y2 > y1) {
          this.selectedModel.setPointsSquare(
            new Point(x1, y1 + side),
            new Point(x1 - scaled, y1),
            new Point(x1 - scaled, y1 + side)
          );
          // quadrant 3
        } else if (x2 < x1 && y2 < y1) {
          this.selectedModel.setPointsSquare(
            new Point(x1, y1 - side),
            new Point(x1 - scaled, y1),
            new Point(x1 - scaled, y1 - side)
          );
          // quadrant 4
        } else {
          this.selectedModel.setPointsSquare(
            new Point(x1, y1 - side),
            new Point(x1 + scaled, y1),
            new Point(x1 + scaled, y1 - side)
          );
        }
      } else if (this.selectedModel instanceof Polygon) {
        this.selectedModel.points[this.selectedPointIndex].setPoint(
          mousePosition.getAbsis(),
          mousePosition.getOrdinate()
        );
      }
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
    this.selectedModel = null;
    this.selectedPointIndex = null;
  }
}

class TranslateDragTool extends Tool {
  // constructor
  constructor(canvas, gl, models, currentColor) {
    super(canvas, gl, models, currentColor);
    this.selectedModelIndex = -1;
    this.selectedPointIndex = -1;
    this.isMoving = false;
    this.refPosition = null;
  }

  // handle click event
  handleMouseDown(event) {
    let mousePosition = this.getMousePosition(event);
    let index = this.searchModelPointIndex(mousePosition);
    if (index != -1) {
      this.isMoving = true;
      this.selectedModelIndex = index.modelIndex;
      this.selectedPointIndex = index.pointIndex;

      this.refPosition =
        this.models[this.selectedModelIndex].points[this.selectedPointIndex];
    }
  }

  handleMouseUp(event) {
    if (this.isMoving) {
      this.reset();
      this.redrawCanvas();
    }
  }

  handleMouseMove(event) {
    if (this.isMoving) {
      this.redrawCanvas();
      let mousePosition = this.getMousePosition(event);

      let refPosX = this.refPosition.getAbsis();
      let refPosY = this.refPosition.getOrdinate();
      let newPosX = mousePosition.getAbsis();
      let newPosY = mousePosition.getOrdinate();

      this.models[this.selectedModelIndex].translate(
        newPosX - refPosX,
        newPosY - refPosY
      );
      this.models[this.selectedModelIndex].draw();

      this.refPosition =
        this.models[this.selectedModelIndex].points[this.selectedPointIndex];
    }
  }

  // handle input value change
  handleInputValueChange(x, y) {
    if (this.selectedModelIndex != -1) {
      this.models[this.selectedModelIndex].translate(x, y);
      this.redrawCanvas();
    }
  }

  // reset tool
  reset() {
    this.selectedModelIndex = -1;
    this.selectedPointIndex = -1;
    this.isMoving = false;
    this.refPosition = null;
  }
}

class TranslateSliderTool extends Tool {
  // constructor
  constructor(canvas, gl, models, currentColor) {
    super(canvas, gl, models, currentColor);
    this.selectedModelIndex = -1;
  }

  // handle click event
  handleClick(event) {
    let mousePosition = this.getMousePosition(event);
    let index = this.searchModelIndex(mousePosition);
    if (index != -1) {
      this.selectedModelIndex = index;

      // reset input value
      const translateX = document.getElementById("translateX");
      const translateY = document.getElementById("translateY");
      translateX.value = 0;
      translateY.value = 0;
    }
  }

  // handle input value change
  handleInputValueChange(x, y) {
    if (this.selectedModelIndex != -1) {
      this.models[this.selectedModelIndex].translate(x, y);
      this.redrawCanvas();
    }
  }

  // reset tool
  reset() {
    const transformInput = document.getElementById("transform-input");
    transformInput.innerHTML = "";
    this.selectedModelIndex = -1;
  }
}

class ChangeColorTool extends Tool {
  // constructor
  constructor(canvas, gl, models, currentColor) {
    super(canvas, gl, models, currentColor);
  }

  // handle click event
  handleClick(event) {
    let mousePosition = this.getMousePosition(event);
    let index = this.searchModelPointIndex(mousePosition);

    if (index != -1) {
      // change color of one point from model clicked to current color
      this.models[index.modelIndex].points[index.pointIndex].setColor(
        this.currentColor
      );
      this.redrawCanvas();
      // search for model rather than the point
    } else {
      index = this.searchModelIndex(mousePosition);
      if (index != -1) {
        for (let i = 0; i < this.models[index].points.length; i++) {
          this.models[index].points[i].setColor(this.currentColor);
        }
        this.redrawCanvas();
      }
    }
  }
}

class DilateTool extends Tool {
  // constructor
  constructor(canvas, gl, models, currentColor) {
    super(canvas, gl, models, currentColor);
    this.selectedModelIndex = -1;
    this.refModel = null;
  }

  // handle click event
  handleClick(event) {
    let mousePosition = this.getMousePosition(event);
    let index = this.searchModelIndex(mousePosition);
    if (index != -1) {
      this.selectedModelIndex = index;
      this.refModel = this.models[index];

      // reset input value
      const dilate = document.getElementById("dilate");
      dilate.value = 1;
    }
  }

  // handle input value change
  handleInputValueChange(input) {
    if (this.selectedModelIndex != -1) {
      // create new model to dilate from reference model
      console.log(this.models);
      let newModel = this.refModel;
      newModel.dilate(input, newModel.findCenter());

      // remove the models selected
      this.models.splice(this.selectedModelIndex, 1);
      // add dilated model
      this.models.splice(this.selectedModelIndex, 0, newModel);
      this.redrawCanvas();
    }
  }

  // reset tool
  reset() {
    const dilateInput = document.getElementById("dilate-input");
    dilateInput.innerHTML = "";
    this.selectedModelIndex = -1;
    this.refModel = null;
  }
}

class DeleteTool extends Tool {
  // constructor
  constructor(canvas, gl, models, currentColor) {
    super(canvas, gl, models, currentColor);
  }

  // handle click event
  handleClick(event) {
    let mousePosition = this.getMousePosition(event);
    let modelIndex = this.searchModelIndex(mousePosition);

    if (modelIndex != -1) {
      // delete the model from models
      this.models.splice(modelIndex, 1);
      this.redrawCanvas();
    }
  }
}

class AnimateTool extends Tool {
  // constructor
  constructor(canvas, gl, models, currentColor) {
    super(canvas, gl, models, currentColor);
    this.selectedModelIndex = -1;
    this.refModel = null;
    this.reduce = false;
    this.animating = false;
    this.animID = null;
  }

  // handle click event
  handleClick(event) {
    if (this.animating) {
      console.log("click");
      this.reset();
    }
    let mousePosition = this.getMousePosition(event);
    let index = this.searchModelIndex(mousePosition);
    if (index != -1) {
      this.selectedModelIndex = index;
      this.refModel = this.models[index];
    }
    this.animating = true;
    this.animate();
  }

  animate() {
    if (this.refModel.points[0].y >= 0.8) {
      this.reduce = true;
    } else if (this.refModel.points[3].y <= -0.8) {
      this.reduce = false;
    }
    let y = 0.01;
    if (this.reduce) {
      y = -0.01;
    }
    if (this.selectedModelIndex != -1) {
      this.models[this.selectedModelIndex].translate(0, y);
      this.redrawCanvas();
    }
    this.animID = window.requestAnimationFrame(this.animate.bind(this));
  }

  reset() {
    this.animating = false;
    this.selectedModelIndex = -1;
    this.refModel = null;
    window.cancelAnimationFrame(this.animID);
  }
}
