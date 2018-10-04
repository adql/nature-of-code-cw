// Ship class

function Ship(dna) {
    this.dna = dna;
    
    // Random position, excluding bottom area of the canvas
    this.pos = createVector(random(width), random(0, height-100));
    // Begin with some random small velocity for natural feeling
    this.vel = createVector(random(-1, 1), random(-1, 1));
    // this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    // Seeds for random fly
    this.seedX = random(10000);
    this.seedY = random(10000);

    this.destroyed = false;

    // Define certain characteristics with DNA
    this.maxSpeed = map(pow(this.dna.genes[0], 2), 0, 1, 2, 15);
    this.maxForce = map(pow(this.dna.genes[1], 2), 0, 1, 0.05, 0.5);
    this.size = map(this.dna.genes[2], 0, 1, 50, 25);
    // How careful the ship is from reaching the bottom
    this.bottomFear = constrain(map(this.dna.genes[3], 0.2, 1, 0, 200), 0, 200);
    this.randomness = this.dna.genes[4];
    this.radarSensitivity = map(this.dna.genes[5], 0, 1, 0, 500);
    this.visibility = map(pow(this.dna.genes[6], 2), 0, 1, 255, 50);
    // Emergency fleeing force is stronger than normal force
    this.fleeForce = constrain(map(pow(this.dna.genes[7], 2), 0.3, 1, 0.1, 4), this.maxForce, 4);

    this.update = function(shots) {
	this.fly();
	this.radar(shots);
	if (height - this.pos.y < this.bottomFear) this.avoidBottom();
	
	this.vel.add(this.acc);
	this.vel.limit(this.maxSpeed);
	this.pos.add(this.vel);
	this.borders();

	// If the ship touches the bottom it explodes
	if (height-this.pos.y < this.size/2) this.explode();

	this.acc.set(0, 0);
    }

    this.render = function() {
	push();
	stroke(255, this.visibility);
	rectMode(CENTER);
	rect(this.pos.x, this.pos.y, this.size, this.size);
	pop();
    }

    // Random fly with perlin noise. Fly has a general direction
    // downwards
    this.fly = function() {
	// The direction in x is scaled to a value in (-1, 1);
	noiseSeed(this.seedX);
	var flyX = noise(frameCount * 0.01) * 2 - 1;
	// The direction in y is scaled to a value in (-0.8, 1.2) for downwards movement
	noiseSeed(this.seedY);
	var flyY = noise(frameCount * 0.01) * 2 - 0.8;
	var fly = createVector(flyX, flyY);
	// The random flying weight is the maximum speed scaled by the
	// "randomness" character of the ship
	fly.mult(this.maxSpeed * this.randomness);
	// Flying is also desired - apply Reynolds
	fly.sub(this.vel);
	fly.limit(this.maxForce);
	this.applyForce(fly);
    }

    // Radar for detecting and avoiding shots
    this.radar = function(shots) {
	// The radar calls the shot avoing function only for the
	// closest shot
	var closest = false;
	var closestDist = 10000; // Arbitrarily big number
	// Check the shots
	for (var i = 0; i < shots.length; i++) {
	    // Calc distance to shot
	    var dist = shots[i].pos.dist(this.pos);
	    // If the distance is within radar and smaller than the
	    // closest shot so far
	    if (dist < this.radarSensitivity && dist < closestDist) {
		closest = shots[i];
		closestDist = dist;
	    }
	}
	// If there is a close shot, avoid it
	if (closest) this.avoidShot(closest);
    }

    // Function for avoiding a shot
    this.avoidShot = function(shot) {
	// The vector pointing from the shot to the ship
	var pointing = p5.Vector.sub(this.pos, shot.pos);
	// The difference between the shot's direction and the angle
	// between it and the ship
	var thetaDiff = pointing.heading() - shot.vel.heading();
	// Check if the shot might hit
	if (abs(sin(thetaDiff) * pointing.mag()) < this.size) {
	    // Fly perpendicular to the shots direction
	    var desired = p5.Vector.fromAngle(shot.vel.heading() + HALF_PI);
	    // At max speed
	    desired.setMag(this.maxSpeed);
	    // Set the direction to the side that needs less movement
	    // to avoid
	    if (thetaDiff < 0) desired.rotate(PI);
	    // Reynolds + limit force + apply
	    desired.sub(this.vel);
	    // If the ship has flee capabilites, use them. Else apply
	    // normal force limit
	    if (this.fleeForce > 0) desired.limit(this.fleeForce);
	    else desired.limit(this.maxForce);
	    this.applyForce(desired);

	    // push();
	    // stroke('red');
	    // text(thetaDiff, this.pos.x-this.size/2, this.pos.y-10);
	    // text(sin(abs(thetaDiff)) * pointing.mag(), this.pos.x-this.size/2, this.pos.y+10);
	    // pop();
	    // noLoop();
	}
    }

    // Keep away from the bottom
    this.avoidBottom = function() {
	// The bottom point directly below the ship
	var bottom = this.pos.copy();
	bottom.y = height;
	var desired = p5.Vector.sub(this.pos, bottom);
	// Scale factor: distance relative to fear
	var scale = (this.bottomFear - bottom.dist(this.pos)) / this.bottomFear;
	desired.setMag(this.maxSpeed * scale);
	// Reynolds
	var steer = p5.Vector.sub(desired, this.vel);
	// Force limit. If scale factor is high (very close to
	// ground), activate fleeing force if the ship has it
	if (scale > 0.8 && this.fleeForce > 0) steer.limit(this.fleeForce);
	else steer.limit(this.maxForce);
	this.applyForce(steer);
    }

    // Wrap around x borders
    this.borders = function() {
	if (this.pos.x > width + this.size/2) this.pos.x = -this.size/2;
	if (this.pos.x < -this.size/2) this.pos.x = width + this.size/2;
    }

    this.applyForce = function(force) {
	this.acc.add(force);
    }

    this.explode = function() {
	this.destroyed = true;
    }

    this.getDNA = function() {
	return this.dna;
    }
}
