var Table = require('cli-table')
	, fs = require('fs');


var Game = require('./lib/game.js')
	, life = new Game(fs.readFileSync('./input.text'));

if(!module.parent) {
	function cycle() {
		life.print();
		if(life.matrix.aliveCount) {
			life.evolve();
			setTimeout(cycle, 3000);
		}
		else process.exit();
	}
	cycle();
}
else {
	module.exports = life;
}
