var MINUMUM_SIZE = 2;		// Smallest creature possible
var MAXIMUM_SIZE = 20;		// Largest creature possible
var NEIGHBORHOOD = 100;		// Size of neighborhood
var DESIRED_SEPARATION = 25;	// For the separation method

function Creature(x, y) {
    // Begin with position given by argument and a small random velocity
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);
    this.r = floor(random(MINUMUM_SIZE, MAXIMUM_SIZE + 1));
    this.maxSpeed = random(2, 5);
    this.maxForce = random(0.05, 0.2);

    // Three "psychology" variables to determine the importance of the
    // various behaviors
    this.sepWeight = random(1, 3);
    this.chaseWeight = random(6, 10);
    this.fleeWeight = random(8, 12);
    this.dead = false;

    // Main function for behaviour. Takes an array of creatures to
    // calculate steering behavior for relevant members of the array
    this.behave = function(creatures) {
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
		// if current creature is bigger then chase the other
		if (sizeDiff > 5) {
		    chasing = this.chase(creatures[i]);
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
	
	// If there is interaction, apply the steering
	if (count > 0) {
	    steer.div(count);	// Average the sum of steerings
	    steer.setMag(this.maxSpeed); // Maximum speed is desired
	    // Apply Reynold's steering formula
	    steer.sub(this.velocity);
	    // Limit to maximum steering force
	    steer.limit(this.maxForce);
	}

	// Finally, apply the steering to the acceleration
	this.applyForce(steer);

	// The usual acc to vel, speed limit, vel to pos, wrapping
	// around the canvas and resetting acc.
	this.vel.add(this.acc);
	this.vel.limit(this.maxSpeed);
	this.pos.add(this.vel);
	this.wraparound();
	this.acc.set(0, 0);
    }

    this.chase = function(creature) {
	var chase = p5.Vector.sub(creature.pos, this.pos);
	if (chase.mag() < this.r) return -1;
	chase.normalize();
	chase.mult(this.chaseWeight);
	return chase;
    }

    this.flee = function(creature, d) {
	var flee = p5.Vector.sub(this.pos, creature.pos);
	flee.normalize();
	flee.div(d);
	flee.mult(this.fleeWeight);
	return flee;
    }

    this.separate = function(creature, d) {
	var sep = p5.Vector.sub(this.pos, creature.pos);
	sep.normalize();
	sep.div(d);
	sep.mult(this.sepWeight);
	return sep;
    }

    this.eat = function(creature) {
	console.log("eaten");
	creature.die();
    }

    this.applyForce = function(force) {
	// Simple force application without mass
	this.acc.add(force)
    }

    this.render = function() {
	var theta = this.vel.heading()
	fill(160);
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
