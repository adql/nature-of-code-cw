// A class that holds and runs everything

function World(shipNumber, mutationRate, multiplyThreshold) {
    this.shooter = new Shooter(width/2);
    this.shots = [];		// Array to hold shots
    this.shipPopulation = new ShipPopulation(shipNumber, mutationRate, multiplyThreshold);

    this.messageCounter = 40;

    this.run = function() {
	// Run the ship population (takes the shot array for ships'
	// radar function)
	this.shipPopulation.run(this.shots);
	
	// Run the shooter and take returned object
	var shot = this.shooter.run();
	// If a shot was returned, add it to the shots array
	if (shot) this.shots.push(shot);

	for (var i = this.shots.length-1; i >= 0; i--) {
	    var shot = this.shots[i];
	    shot.update();
	    shot.checkHit(this.shipPopulation.ships);
	    shot.render();

	    if (shot.isOut() || shot.didHit()) {
		this.shots.splice(i, 1);
	    }
	}

	// After certain rounds tell the shooter to switch to
	// autoshoot and informs the user (in q quite quirky hack)
	if (round == 20 && this.messageCounter > 0) {
	    this.shooter.autoShoot = true;
	    this.declareAutoShoot();
	}
    }

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
