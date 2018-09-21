var MINUMUM_SIZE = 4;		// Smallest creature possible
var MAXIMUM_SIZE = 20;		// Largest creature possible
var NEIGHBORHOOD = 100;		// Size of neighborhood
var OLFACTION = 150;		// How far a vegetarian creature can
				// sense fruits from
var DESIRED_SEPARATION = 25;	// For the separation method

function Creature(x, y) {
    // Begin with position given by argument and a small random velocity
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);
    this.r = floor(random(MINUMUM_SIZE, MAXIMUM_SIZE + 1));
    this.seed = random(10000);	// Seed for noise in walking function

    if (this.r < (MINUMUM_SIZE + MAXIMUM_SIZE) / 3) {
	this.veggie = true;
    } else {
	this.veggie = boolean(int(random(0, 2)));
    }
    this.strength = 10;
    this.strengthCountdown = int(random(200));
    this.potMaxSpeed = random(2, 5);
    this.potMaxForce = random(0.05, 0.2);

    this.applyStrength = function() {
	this.maxSpeed = map(this.strength, 0, 10, 0, this.potMaxSpeed);
	this.maxForce = map(this.strength, 0, 10, 0, this.potMaxForce);
    }
    this.applyStrength();

    // Three "psychology" variables to determine the importance of the
    // various behaviors
    this.sepWeight = random(1, 3); // importance of seperation
    this.chaseWeight = random(6, 10); // importance of chasing
    this.fleeWeight = random(8, 12);  // importance of fleeing
    // Variable to hold creature's death status
    this.dead = false;

    // Main function for behaviour. Takes an array of creatures to
    // calculate steering behavior for relevant members of the array
    this.behave = function(creatures, fruits) {
	var steer = createVector(0, 0); // For summing steerings
	var count = 0;		// count interactions for averaging

	for (var i = 0; i < creatures.length; i++) {
	    // For every creature, check if it's nearby enough for
	    // applying behavior towards it
	    var d = p5.Vector.dist(this.pos, creatures[i].pos);
	    if (d > 0 && d < NEIGHBORHOOD) {
		// if the other creature is relevant, check what type
		// of behavior is desired depending on the difference
		// in the sizes of the two creatures
		var sizeDiff = this.r - creatures[i].r;
		// if current creature is a carnivore and bigger then
		// chase the other
		if (sizeDiff > 5 && this.veggie == false) {
		    var chasing = this.chase(creatures[i]);
		    // The chasing function returns -1 if the chaser
		    // has cought the prey.
		    if (chasing == -1) {
			this.eat(creatures[i]); // If cought, eat it
			// Even out the counting since there is no
			// steering if the pray was cought
			count -= 1;
		    }
		    // If not cought, then steering as usual
		    else steer.add(chasing);
		}
		// if current creature is smaller then flee from the other
		else if (sizeDiff < -5) { steer.add(this.flee(creatures[i], d)) }
		// else apply general separation (creatures of similar
		// size tend to avoid conflict)
		else steer.add(this.separate(creatures[i], d));
		count += 1;	// Add for averaging
	    }
	}

	// If the creature is vegetarian, then look for fruits
	if (this.veggie == true) {
	    var search = this.searchFruit(fruits);
	    // If a fruit is desired, add to steer and count
	    if (search != false) {
		steer.add(search);
		count++;
	    }
	}
	    
	// If there is interaction, apply the steering
	if (count > 0) {
	    steer.div(count);	// Average the sum of steerings
	    steer.setMag(this.maxSpeed); // Maximum speed is desired
	    // Apply Reynold's steering formula
	    steer.sub(this.velocity);
	    // Limit to maximum steering force
	    steer.limit(this.maxForce);
	    // Finally, apply the steering to the acceleration
	    this.applyForce(steer);
	} else {
	    // Without interaction, slow down
	    this.walk()
	}

	// The usual acc to vel, speed limit, vel to pos, wrapping
	// around the canvas and resetting acc.
	this.vel.add(this.acc);
	this.vel.limit(this.maxSpeed);
	this.pos.add(this.vel);
	this.wraparound();
	this.acc.set(0, 0);

	// Count down towards loosing strength
	this.strengthCountdown--;
	// And loose a point when it reaches 0
	if (this.strengthCountdown == 0) {
	    this.strength--;
	    if (this.strength == 0) this.die();
	    this.strengthCountdown = 200;
	    // Update max speed and steering force
	    this.applyStrength();
	}
    }

    // Separating function. Takes creature to avoid and distance which
    // was already calculated in the calling function (for efficiency)
    this.separate = function(creature, d) {
	// Set the direction away from the other creature
	var sep = p5.Vector.sub(this.pos, creature.pos);
	// Separating is relative to the distance
	sep.normalize();
	sep.div(d);
	// Applying the imporance of separating
	sep.mult(this.sepWeight);
	return sep;
    }

    // Fleeing function. Similar to separation except that it's not
    // relative to the distance and it has a different importance
    this.flee = function(creature, d) {
	var flee = p5.Vector.sub(this.pos, creature.pos);
	flee.setMag(this.fleeWeight);
	return flee;
    }

    // Chasing function, takes an argument of chased creature
    this.chase = function(creature) {
	// set the direction of chasing towards the prey
	var chase = p5.Vector.sub(creature.pos, this.pos);
	// Inform the calling function if the prey was caught
	if (chase.mag() < this.r) return -1;
	// Set magnitude according to imporance of this behavior
	chase.setMag(this.chaseWeight);
	return chase;
    }

    // Function for searching for a fruit and eating it. Returns a
    // steering force only for the closes fruit. If there is no fruit
    // around, returns false
    this.searchFruit = function(fruits) {
	var closest = false;
	// Search for the closest fruit
	for (var i = 0; i < fruits.length; i++) {
	    var distCurrent = this.pos.dist(fruits[i].pos);
	    if (distCurrent < OLFACTION) {
		if (closest == false) closest = i;
		else {
		    var distClosest = this.pos.dist(fruits[closest].pos)
		    if (distCurrent < distClosest) closest = i;
		}
	    }
	}

	// If there's a fruit around seek for it
	if (closest != false) {
	    // If the fruit is close enough, eat it
	    if (this.pos.dist(fruits[closest].pos) < this.r) {
		// Tell the fruit object that it's been eaten
		fruits[closest].beEaten();
		// Add strength, limited to maximum possible
		this.strength = min(this.strength + 4, 10);
		// Return false so that no steering is added
		return false;
	    } else {
		// set the direction of seeking towards the fruit
		var seek = p5.Vector.sub(fruits[closest].pos, this.pos);
		// Set magnitude according to imporance of this behavior
		// (same as chasing for carnivors)
		seek.setMag(this.chaseWeight);
		return seek;
	    }
	} else {
	    // If no fruit is around
	    return false;
	}
    }

    // Function for slowing down when there is no interest around
    this.walk = function() {
	// Slowing down to low speed
	var slow = this.vel.copy();
	slow.setMag(this.maxSpeed / 5);
	// Apply Reynold's steering formula
	slow.sub(this.vel);
	// Reduce a bit
	slow.div(100);
	// Apply slowing down
	this.applyForce(slow);

	// Add causual walking with perlin noise
	noiseSeed(this.seed);
	var theta = (noise(frameCount / 50) - 0.5) / 10;
	this.vel.rotate(theta);
    }

    this.eat = function(creature) {
	if (this.strength < 10) {
	    this.strength = min(this.strength + creature.strength, 10);
	}
	creature.die();
    }

    this.applyForce = function(force) {
	// Simple force application without mass
	this.acc.add(force)
    }

    this.render = function() {
	var theta = this.vel.heading()
	var fillValue = map(this.strength, 0, 10, 0, 200);
	if (this.veggie == true) {
	    fill(0, fillValue, 0);
	} else {
	    fill(fillValue, 0, 0);
	}
	// fill(map(this.strength, 0, 10, 0, 200));
	stroke(0);
	strokeWeight(this.r / 8);
	push();
	translate(this.pos.x - this.r, this.pos.y);
	rotate(theta);
	beginShape(TRIANGLES);
	vertex(-this.r, -this.r/2);
	vertex(-this.r, this.r/2);
	vertex(this.r, 0);
	endShape();	
	pop();
    }

    this.die = function() {
	this.dead = true;
    }

    this.wraparound = function() {
	// Function to wrap the world of the canvas around itself
	if (this.pos.x - this.r > width) { this.pos.x = -this.r};
	if (this.pos.x + this.r < 0) { this.pos.x = width + this.r };
	if (this.pos.y - this.r > height) { this.pos.y = -this.r};
	if (this.pos.y + this.r < 0) { this.pos.y = height + this.r};
    }
}
