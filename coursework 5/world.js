// A class that holds and runs everything

function World(shipNumber, mutationRate, multiplyThreshold) {
    this.shooter = new Shooter(width/2); // The player
    this.shots = [];		// Array to hold missiles
    this.shipPopulation = new ShipPopulation(shipNumber, mutationRate, multiplyThreshold);

    // For displaying the "automatic mode" message
    this.messageCounter = 40;

    // Main function
    this.run = function() {
	// Run the ship population (takes the shot array for ships'
	// radar function)
	this.shipPopulation.run(this.shots);
	
	// Run the shooter and take returned object (a shot or false)
	var shot = this.shooter.run();
	// If a shot was returned, add it to the shots array
	if (shot) this.shots.push(shot);

	// Run over the shots and update
	for (var i = this.shots.length-1; i >= 0; i--) {
	    var shot = this.shots[i];
	    shot.update();
	    // Check if the shot hit anything
	    shot.checkHit(this.shipPopulation.ships);
	    shot.render();

	    if (shot.isOut() || shot.didHit()) {
		// If the shot is off the screen or if it has hit,
		// remove it from the array
		this.shots.splice(i, 1);
	    }
	}

	// After certain rounds tell the shooter to switch to
	// autoshoot and inform the user (in quite a quirky hack)
	if (round == 20 && this.messageCounter > 0) {
	    this.shooter.autoShoot = true;
	    this.declareAutoShoot();
	}
    }

    // A function for writing the "autoshoot enabled" message to the
    // canvas
    this.declareAutoShoot = function() {
	push();
	textSize(40);
	stroke(255, 100);
	fill(255, 100);
	textAlign(CENTER);
	text("AUTOSHOOT\nENABLED!", width/2, height/2);
	pop()
	this.messageCounter--;
    }
}
