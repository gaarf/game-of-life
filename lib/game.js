var Table = require('cli-table')
  , colors = require('colors')
  , Point = require('./point.js')
  , Matrix = require('./matrix.js');


function Game(input) {
  // input = text ala http://www.conwaylife.com/patterns/rpentomino.cells

  var matrix = new Matrix();

  var y = 0;
  input.split("\n").forEach(function(a) {
    if(a.charAt(0)!=='!') {
      for (var x = 0; x <= a.length; x++) {
        if(a.charAt(x).toUpperCase()==='O') {
          matrix.setAlive(new Point(x+1, y+1));
        }
      };
      y++;
    }
  });

  this.matrix = matrix;
  this.generation = 0;

  return this;
}


Game.prototype.evolve = function(){
  var matrix = this.matrix
    , get = matrix.get.bind(matrix)
    , nextMatrix = new Matrix();

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

Game.prototype.toTable = function(){
  var matrix = this.matrix
    , th = [""];

  for (var i = matrix.min.x; i <= matrix.max.x; i++) {
    th.push(i);
  }

  var tds = []
    , table = new Table({head:th});

  matrix.iterate(function(point){
    tds.push(matrix.get(point) ? " O ".yellow.inverse : "");
    if(point.x === matrix.max.x) {
      var tr = {};
      tr[point.y.toString()] = tds;
      table.push(tr);
      tds = [];
    }
  });

  return table;
};

Game.prototype.print = function(opts){
  // clear the screen
  process.stdout.write('\033[2J\033[H');

  var matrix = this.matrix;

  // print some useful information
  console.log(" #"+this.generation
    , matrix.boundingBox().grey
    , matrix.aliveCount.toString().blue
    , "\n\r"
  );

  if(opts && opts.table) {
    console.log(this.toTable().toString());
  }
  else {
    var output = "";
    matrix.iterate(function(point){
     output += matrix.get(point) ? " o".yellow : " .".grey;
     if(point.x === matrix.max.x) {
       console.log(output);
       output = "";
     }
    });
  }

  console.log("\n\r");
  // console.dir(matrix);
};

module.exports = Game;