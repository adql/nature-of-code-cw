// A class to hold the creatures and the fruits with birth and death
// functions

function Zoo() {
    this.creatures = [];		// Array to hold the creatures
    this.fruits = [];

    // Function for creating a creature in the zoo
    this.birth = function(x, y) {
	var creature = new Creature(x, y);
	this.creatures.push(creature);
    }

    // Function for creating a fruit in the zoo
    this.fruit = function(x, y) {
	var fruit = new Fruit(x, y);
	this.fruits.push(fruit);
    }

    // Initiallize the array with 20 creatues and 20 fruits using the
    // above functions
    for (var i = 0; i < 20; i++) {
	this.birth(random(width), random(height)); // a creature
	this.fruit(random(width), random(height)); // a fruit
    }

    // Main function to run the zoo
    this.run = function() {
	// Render fruits
	for (var i = 0; i < this.fruits.length; i++) {
	    this.fruits[i].render();
	}

	// Update behavior and render all creatures
	for (var i = 0; i < this.creatures.length; i++) {
	    this.creatures[i].behave(this.creatures, this.fruits);
	    this.creatures[i].render();
	}

	// Delete dead creatures from the creatures array
	var i = 0;
	while (i < this.creatures.length) {
	    if (this.creatures[i].dead == true) {
		this.creatures.splice(i, 1);
	    }
	    i++;
	}

	// Delete eaten fruits from the fruits array
	var i = 0;
	while (i < this.fruits.length) {
	    if (this.fruits[i].eaten == true) {
		this.fruits.splice(i, 1);
	    }
	    i++;
	}
    }

    // Function for adding several creatures at once
    this.moreCreatures = function(num) {
	for (var i = 0; i < num; i++) this.birth(random(width), random(height));
    }

    // Function for adding several fruits at once
    this.moreFruits = function(num) {
	for (var i = 0; i < num; i++) this.fruit(random(width), random(height));
    }
}
