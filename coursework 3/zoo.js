// A class to hold the creatures with birth and death functions

function Zoo(size) {
    this.creatures = [];		// Array to hold the creatures

    // Function for creating a creature in the zoo
    this.birth = function(x, y) {
	creature = new Creature(x, y);
	this.creatures.push(creature);
    }

    // Initiallize the array with creatues using the above function
    for (var i = 0; i < size; i++) {
	// creature = new Creature(random(width), random(height));
	// this.creatures.push(creature);
	this.birth(random(width), random(height));
    }

    this.run = function() {
	// Update behavior and render all creatures
	for (var i = 0; i < this.creatures.length; i++) {
	    this.creatures[i].behave(this.creatures);
	    this.creatures[i].render();
	}

	// Delete dead creatures from the array
	var i = 0;
	while (i < this.creatures.length) {
	    if (this.creatures[i].dead == true) {
		this.creatures.splice(i, 1);
	    }
	    i++;
	}
    }

    // Used temporary for debugging
    // this.display = function() {
    // 	for (var i = 0; i < this.creatures.length; i++) {
    // 	    console.log(i, ": ", this.creatures[i].dead);
    // 	}
    // }
}
