var Point = require('./point.js');

function d(o,u) {
  return ((typeof o === "undefined") ? u : o);
}

function Matrix(min, max) {
  this.cells = {};
  this.aliveCount = 0;
  this.min = new Point();
  this.max = new Point();
  return this;
}

Matrix.prototype.setAlive = function(point) {
  var xs = point.x.toString()
    , ys = point.y.toString();
  this.cells[xs] = this.cells[xs] || {};
  this.cells[xs][ys] = true;

  this.min.x = Math.min(point.x-1, d(this.min.x,point.x));
  this.min.y = Math.min(point.y-1, d(this.min.y,point.y));

  this.max.x = Math.max(point.x+1, d(this.max.x,point.x));
  this.max.y = Math.max(point.y+1, d(this.max.y,point.y));

  this.aliveCount++;
}

Matrix.prototype.get = function(point) {
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

Matrix.prototype.boundingBox = function(){
  return [ 
      Math.abs(this.min.x) + Math.abs(this.max.x) - 2 // width
    , Math.abs(this.min.y) + Math.abs(this.max.y) - 2 // height
  ].join("x");
}

module.exports = Matrix;
