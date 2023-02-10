class Color {
  // constructor
  constructor(r = 0, g = 0, b = 0) {
    this.red = this.convertToFloat(r);
    this.green = this.convertToFloat(g);
    this.blue = this.convertToFloat(b);
  }

  // copy
  fromColor(color) {
    this.red = color.red;
    this.green = color.green;
    this.blue = color.blue;
  }

  // setter
  setColor(r, g, b) {
    this.red = this.convertToFloat(r);
    this.green = this.convertToFloat(g);
    this.blue = this.convertToFloat(b);
  }

  setFromHex(hex) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    this.setColor(r, g, b);
  }

  // convert rgb to float values
  convertToFloat(value) {
    return value / 255;
  }
}
