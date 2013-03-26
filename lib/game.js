var Point = require('./point.js')
  , Matrix = require('./matrix.js');


function Game(input) {
  // input = text ala http://www.conwaylife.com/patterns/rpentomino.cells

  var matrix = new Matrix();

  input.forEach(function(a) {
    matrix.setAlive(new Point(a[0], a[1]));
  });

  this.matrix = matrix;
  this.generation = 0;

  return this;
}


Game.prototype.evolve = function(){
  var matrix = this.matrix
    , get = matrix.isAlive.bind(matrix)
    , nextMatrix = new Matrix(matrix.min, matrix.max);

  matrix.iterate(function(point){
    var n = point.neighbors().filter(get).length; // number of alive neighbors

    if(get(point)) { // point is alive
      if(n===2 || n===3) {
        nextMatrix.setAlive(point); // it lives on
      }
    }
    else { // point is dead
      if(n===3) {
        nextMatrix.setAlive(point); // it is reborn
      }
    }
  });

  this.generation++;
  this.matrix = nextMatrix;
};

Game.prototype.print = function(){
  var matrix = this.matrix
    , output = "\n\r";

  function grey(t) {
    return ["\x1B[90m",t,"\x1B[39m"].join("");
  }
  process.stdout.write('\033[2J\033[H'); 
  console.log(" #"+this.generation
    , grey(matrix.dimensions())
    , matrix.aliveCount
  );

  // matrix.iterate(function(point){
  //  output += matrix.isAlive(point) ? " o" : grey(" .");
  //  if(point.y === matrix.max.y) {
  //    console.log(output);
  //    output = "";
  //  }
  // });


  var th = [""];
  for (var i = matrix.min.x; i <= matrix.max.x; i++) {
    th.push(i);
  }
  var tds = []
    , table = new Table({head:th});

  matrix.iterate(function(point){
    tds.push(matrix.isAlive(point) ? "O" : "");
    if(point.x === matrix.max.x) {
      var tr = {};
      tr[point.y.toString()] = tds;
      table.push(tr);
      tds = [];
    }
  });
  console.log(table.toString());


  console.log("\n\r");
  console.dir(matrix);
};

module.exports = Game;