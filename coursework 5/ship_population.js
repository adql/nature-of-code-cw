// Class that runs the ship population

function ShipPopulation(num, m, mThres) {
    this.ships = [];		// Array to hold the ship objects
    this.mutationRate = m;
    this.shipNumber = num;
    this.threshold = mThres;

    // Instantiate with random ships
    for (var i = 0; i < this.shipNumber; i++) {
	this.ships.push(new Ship(new DNA()));
    }

    this.run = function(shots) {
	for (var i = this.ships.length-1; i >= 0; i--) {
	// for (var i = 0; i < this.ships.length; i++) {
	    var ship = this.ships[i];
	    ship.update(shots);
	    ship.render();

	    if (ship.destroyed) this.ships.splice(i, 1);
	}

	// If half of the ships have been destroyed, reproduce
	if (this.ships.length < this.shipNumber * this.threshold) {
	    this.reproduction();
	    round++;
	}
    }

    // Reproduction function based on surviving ships
    this.reproduction = function() {
	// Mark the older generation
	var oldships = this.ships.length;
	var i = oldships;
	// Add until reaching standard ship number
	while (i < this.shipNumber) {
	    // Randomly select parents (only from ships of previoius
	    // generation)
	    var m = floor(random(oldships));
	    // Make sure dad is not mom
	    do {
		var d = floor(random(oldships));
	    } while (d == m);
	    // Get genes
	    var momgenes = this.ships[m].getDNA();
	    var dadgenes = this.ships[d].getDNA();
	    // Mate
	    var child = momgenes.crossover(dadgenes);
	    // Mutate
	    child.mutate(this.mutationRate);
	    this.ships.push(new Ship(child));
	    i++;
	}
    }
}
