const modelsShape = {
  LINE_SHAPE: "LINE",
  RECTANGLE_SHAPE: "RECTANGLE",
  SQUARE_SHAPE: "SQUARE",
  POLYGON_SHAPE: "POLYGON",
};

class Point {
  // constructor
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = new Color();
  }

  //setter
  setPoint(x, y) {
    this.x = x;
    this.y = y;
  }

  setColor(color) {
    this.color.fromColor(color);
  }

  // getter
  getAbsis() {
    return this.x;
  }
  getOrdinate() {
    return this.y;
  }

  getColor() {
    return this.color;
  }

  // check if point is near to another point
  isNear(point, threshold = 0.1) {
    return (
      Math.abs(this.x - point.x) <= threshold &&
      Math.abs(this.y - point.y) <= threshold
    );
  }
}

class Model {
  // constructor
  constructor(gl, shape, gl_shape, points) {
    this.gl = gl;
    this.shape = shape;
    this.gl_shape = gl_shape;
    this.points = points;
  }

  // draw model
  draw() {
    let positions = [];
    let colors = [];

    for (let point of this.points) {
      positions.push(point.x, point.y);
      colors.push(point.color.red, point.color.green, point.color.blue, 1);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    this.gl.drawArrays(this.gl.POINTS, 0, this.points.length);
    this.gl.drawArrays(this.gl_shape, 0, this.points.length);
  }

  // check if point is inside a model
  isContain(point) {
    let xmin = this.points[0].x;
    let xmax = this.points[0].x;
    let ymin = this.points[0].y;
    let ymax = this.points[0].y;
    for (let p of this.points) {
      if (p.x < xmin) {
        xmin = p.x;
      }
      if (p.x > xmax) {
        xmax = p.x;
      }
      if (p.y < ymin) {
        ymin = p.y;
      }
      if (p.y > ymax) {
        ymax = p.y;
      }
    }
    return (
      point.x >= xmin && point.x <= xmax && point.y >= ymin && point.y <= ymax
    );
  }

  // translate model
  translate(x, y) {
    for (let point of this.points) {
      point.x += x;
      point.y += y;
    }
  }

  //dilate model
  dilate(scale, center) {
    for (let point of this.points) {
      point.x = scale * (point.x - center.x) + center.x;
      point.y = scale * (point.y - center.y) + center.y;
    }
  }
}

class Line extends Model {
  // constructor
  constructor(gl, points) {
    super(gl, modelsShape.LINE_SHAPE, gl.LINE_STRIP, points);
  }

  findCenter() {
    let centerPoint = new Point(
      (this.points[0].x + this.points[1].x) / 2,
      (this.points[0].y + this.points[1].y) / 2
    );
    return centerPoint;
  }
}

class Rectangle extends Model {
  // constructor
  constructor(gl, points) {
    super(gl, modelsShape.RECTANGLE_SHAPE, gl.TRIANGLE_STRIP, points);
    let x1 = points[0].x;
    let y1 = points[0].y;
    let x2 = points[1].x;
    let y2 = points[1].y;
    let rectanglePoints = [
      points[0],
      new Point(x1, y2),
      new Point(x2, y1),
      new Point(x2, y2),
    ];
    this.points = rectanglePoints;
    this.setColorsRectangle(points[0].color, points[0].color, points[0].color);
  }

  // setter
  setPointsRectangle(a, b, c) {
    this.points[1].setPoint(a.x, a.y);
    this.points[2].setPoint(b.x, b.y);
    this.points[3].setPoint(c.x, c.y);
  }

  setColorsRectangle(a, b, c) {
    this.points[1].setColor(a);
    this.points[2].setColor(b);
    this.points[3].setColor(c);
  }

  findCenter() {
    let centerPoint = new Point(
      (this.points[0].x + this.points[3].x) / 2,
      (this.points[0].y + this.points[3].y) / 2
    );
    return centerPoint;
  }
}

class Square extends Model {
  // constructor
  constructor(gl, points, scaleHeight, scaleWidth) {
    super(gl, modelsShape.SQUARE_SHAPE, gl.TRIANGLE_STRIP, points);
    let x1 = points[0].x;
    let y1 = points[0].y;
    let x2 = points[1].x;
    let y2 = points[1].y;

    let side = Math.min(Math.abs(y2 - y1), Math.abs(x2 - x1));
    let scaled = (side * scaleHeight) / scaleWidth;

    let squarePoints;
    // set changing points while moving mouse
    // quadrant 1
    if (x2 > x1 && y2 > y1) {
      squarePoints = [
        points[0],
        new Point(x1, y1 + side),
        new Point(x1 + scaled, y1),
        new Point(x1 + scaled, y1 + side),
      ];
      // quadrant 2
    } else if (x2 < x1 && y2 > y1) {
      squarePoints = [
        points[0],
        new Point(x1, y1 + side),
        new Point(x1 - scaled, y1),
        new Point(x1 - scaled, y1 + side),
      ];
      // quadrant 3
    } else if (x2 < x1 && y2 < y1) {
      squarePoints = [
        points[0],
        new Point(x1, y1 - side),
        new Point(x1 - scaled, y1),
        new Point(x1 - scaled, y1 - side),
      ];
      // quadrant 4
    } else {
      squarePoints = [
        points[0],
        new Point(x1, y1 - side),
        new Point(x1 + scaled, y1),
        new Point(x1 + scaled, y1 - side),
      ];
    }
    this.points = squarePoints;
    this.setColorsSquare(points[0].color, points[0].color, points[0].color);
  }

  // setter
  setPointsSquare(a, b, c) {
    this.points[1].setPoint(a.x, a.y);
    this.points[2].setPoint(b.x, b.y);
    this.points[3].setPoint(c.x, c.y);
  }

  setColorsSquare(a, b, c) {
    this.points[1].setColor(a);
    this.points[2].setColor(b);
    this.points[3].setColor(c);
  }

  findCenter() {
    let centerPoint = new Point(
      (this.points[0].x + this.points[3].x) / 2,
      (this.points[0].y + this.points[3].y) / 2
    );
    return centerPoint;
  }
}

class Polygon extends Model {
  // constructor
  constructor(gl, points) {
    super(gl, modelsShape.POLYGON_SHAPE, gl.TRIANGLE_FAN, points);
  }

  // findCenter for polygon
  findCenter() {
    let x = 0;
    let y = 0;
    for (let point of this.points) {
      x += point.x;
      y += point.y;
    }
    let centerPoint = new Point(x / this.points.length, y / this.points.length);
    return centerPoint;
  }
}
