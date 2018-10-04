// Class that runs the ship population

function ShipPopulation(num, m, mThres) {
    this.ships = [];
    this.mutationRate = m;
    this.shipNumber = num;
    this.threshold = mThres;	// When reproduction should be
				// initiated

    // Instantiate with random ships
    for (var i = 0; i < this.shipNumber; i++) {
	this.ships.push(new Ship(new DNA()));
    }

    // Main function
    this.run = function(shots) {
	// Run over the ships
	for (var i = this.ships.length-1; i >= 0; i--) {
	    var ship = this.ships[i];
	    // Update and render
	    ship.update(shots);
	    ship.render();

	    // Remove the ship from the array if it has exploded
	    if (ship.destroyed) this.ships.splice(i, 1);
	}

	// If reproduction threshold has been reached, reproduce
	if (this.ships.length < this.shipNumber * this.threshold) {
	    this.reproduction();
	    round++;		// For autoshooting activation
	}
    }

    // Reproduction function based on surviving ships
    this.reproduction = function() {
	// Mark the older generation (to avoid parent-child
	// reproduction)
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
	    var childgenes = momgenes.crossover(dadgenes);
	    // Mutate
	    childgenes.mutate(this.mutationRate);
	    // Create the ship with the new gene set
	    this.ships.push(new Ship(childgenes));
	    i++;
	}
    }
}
