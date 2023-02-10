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
}

class Model {
  // constructor
  constructor(gl, gl_shape, points) {
    this.gl = gl;
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
}

class Line extends Model {
  // constructor
  constructor(gl, points) {
    super(gl, gl.LINE_STRIP, points);
  }
}
