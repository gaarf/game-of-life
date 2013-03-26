function Point(x,y) {
  this.x = x;
  this.y = y;
  return this;
}

Point.prototype.neighbors = function() {
  var output = [];
  for (var x = this.x-1; x <= this.x+1; x++) {
    for (var y = this.y-1; y <= this.y+1; y++) {
      if(x!==this.x || y!==this.y) {
        output.push(new Point(x,y));
      }
    };
  };
  return output;
}

module.exports = Point;