var input = require('fs').readFileSync('./input.text').toString()
	, Game = require('./lib/game.js')
	, life = new Game(input);

if(!module.parent) {
	function cycle() {
		life.print({table:false});
		if(life.matrix.aliveCount) {
			life.evolve();
			setTimeout(cycle, 300);
		}
		else process.exit();
	}
	cycle();
}
else {
	module.exports = life;
}
