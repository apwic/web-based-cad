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
}

class Line extends Model {
  // constructor
  constructor(gl, points) {
    super(gl, "LINE", gl.LINE_STRIP, points);
  }
}

class Rectangle extends Model {
  // constructor
  constructor(gl, points) {
    super(gl, "RECTANGLE", gl.TRIANGLE_STRIP, points);
  }

  // setter
  setPointsRectangle(a, b, c) {
    this.points[1] = a;
    this.points[2] = b;
    this.points[3] = c;
  }

  setColorsRectangle(a, b, c) {
    this.points[1].setColor(a);
    this.points[2].setColor(b);
    this.points[3].setColor(c);
  }
}

class Square extends Model {
  // constructor
  constructor(gl, points) {
    super(gl, "SQUARE", gl.TRIANGLE_STRIP, points);
  }

  // setter
  setPointsSquare(a, b, c) {
    this.points[1] = a;
    this.points[2] = b;
    this.points[3] = c;
  }

  setColorsSquare(a, b, c) {
    this.points[1].setColor(a);
    this.points[2].setColor(b);
    this.points[3].setColor(c);
  }
}
