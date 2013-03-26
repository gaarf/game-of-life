var Point = require('./point.js');

function Matrix(min, max) {
  this.cells = {};
  this.aliveCount = 0;
  this.min = min || new Point(0,0);
  this.max = max || new Point(0,0);
  return this;
}

Matrix.prototype.setAlive = function(point) {
  var xs = point.x.toString()
    , ys = point.y.toString();
  this.cells[xs] = this.cells[xs] || {};
  this.cells[xs][ys] = true;
  this.aliveCount++;

  this.min.x = Math.min(point.x-1, this.min.x);
  this.min.y = Math.min(point.y-1, this.min.y);

  this.max.x = Math.max(point.x+1, this.max.x);
  this.max.y = Math.max(point.y+1, this.max.y);

  return this.dimensions();
}

Matrix.prototype.isAlive = function(point) {
  var col = this.cells[point.x.toString()];
  return col && col[point.y.toString()];
}

Matrix.prototype.iterate = function(cb) {
  for (var y = this.max.y; y >= this.min.y; y--) {
    for (var x = this.min.x; x <= this.max.x; x++) {
      cb(new Point(x,y));
    };
  };
}

Matrix.prototype.dimensions = function(){
  return [ 
      1 + Math.abs(this.min.x) + Math.abs(this.max.x) // width
    , 1 + Math.abs(this.min.y) + Math.abs(this.max.y) // height
  ].join("x");
}

module.exports = Matrix;
