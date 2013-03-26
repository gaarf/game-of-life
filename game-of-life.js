
function Point(x,y) {
	this.x = x;
	this.y = y;
	return this;
}

Point.prototype.neighbors = function() {
	var output = [];
	for (var i = this.x-1; i <= this.x+1; i++) {
		for (var j = this.y-1; j <= this.y+1; j++) {
			if(i!==this.x || j!==this.y) {
				output.push(new Point(i,j));
			}
		};
	};
	return output;
}



function Matrix(max) {
	this.rows = {};
	this.aliveCount = 0;
	this.max = max || new Point(0,0);
	return this;
}

Matrix.prototype.setAlive = function(point) {
	var x = point.x.toString()
	  , y = point.y.toString();
	this.rows[x] = this.rows[x] || {};
	this.rows[x][y] = true;
	this.aliveCount++;
	this.max.x = Math.max(point.x+1, this.max.x);
	this.max.y = Math.max(point.y+1, this.max.y);
}

Matrix.prototype.get = function(point) {
	var row = this.rows[point.x.toString()];
	return row && row[point.y.toString()];
}

Matrix.prototype.iterate = function(cb) {
	for (var i = 0; i <= this.max.x; i++) {
		for (var j = 0; j <= this.max.y; j++) {
			cb(new Point(i,j));
		};
	};
}




function World(input) { // [[x,y],[x,y]]
	var matrix = new Matrix();

	input.forEach(function(a) {
		matrix.setAlive(new Point(a[0], a[1]));
	});

	this.matrix = matrix;
	this.generation = 0;

	return this;
}


World.prototype.evolve = function(){
	var matrix = this.matrix
	  , get = matrix.get.bind(matrix)
	  , nextMatrix = new Matrix(matrix.max);

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

World.prototype.print = function(){
	var matrix = this.matrix
	  , output = "\n\r";

	process.stdout.write('\033[2J\033[H'); 
	console.log(" #"+this.generation
	  , matrix.max.x+'x'+matrix.max.y
	  , "("+matrix.aliveCount+")"
	);

	matrix.iterate(function(point){
		output += matrix.get(point) ? " o" : " .";
		if(point.y === matrix.max.y) {
			console.log(output);
			output = "";
		}
	});

	console.log("\n\r");
};


var world = new World(require('./input.json'));

if(!module.parent) {
	function cycle() {
		world.print();
		if(world.matrix.aliveCount) {
			world.evolve();
			setTimeout(cycle, 200);
		}
		else process.exit();
	}
	cycle();
}
else {
	module.exports = world;
}
