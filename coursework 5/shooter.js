// A class for the player's shooter

function Shooter(xloc) {
    // Location of the shooter
    this.pos = createVector(xloc, height);
    // Direction of cannon
    this.theta = -HALF_PI

    // Counter for intervals between shots
    this.shootCount = 0;

    this.seedX = random(10000);	// Seed for automode movement
    this.seedCannon = random(10000); // Seed for automode shooting

    this.run = function() {
	if (autoMode) var shot = this.auto();
	else var shot = this.listen();
	this.display();

	return shot;
    }

    // Listen to user input. Return a shot object if there is one,
    // otherwise return false
    this.listen = function() {
	// Listen to movements
	if (keyIsDown(SHIFT)) {
	    // If shift is pressed, arrow keys rotate cannon
	    if (keyIsDown(LEFT_ARROW)) this.theta -= 0.1;
	    if (keyIsDown(RIGHT_ARROW)) this.theta += 0.1;
	    this.theta = constrain(this.theta, -HALF_PI-QUARTER_PI, -QUARTER_PI);
	} else {
	    // Otherwise, arrow keys move the shooter left or right
	    if (keyIsDown(LEFT_ARROW)) this.pos.x -= 5;
	    if (keyIsDown(RIGHT_ARROW)) this.pos.x += 5;
	}

	// Listen to shooting and return a shot if there is one
	if (keyIsDown(32)) {
	    return this.shoot();
	} else return false;
    }

    this.auto = function() {
	noiseSeed(this.seedX);
	this.pos.x = noise(frameCount / 100) * (width+100) - 50;
	noiseSeed(this.seedCannon);
	this.theta = noise(frameCount / 100) * QUARTER_PI*3 - QUARTER_PI*3;

	return this.shoot();
    }

    // Shooting function. Returns a shot object
    this.shoot = function() {
	if (this.shootCount == 0) {
	    // If it's time to shoot
	    // Reset counter
	    this.shootCount = 10;
	    // Create a shot object and return it
	    var pos = this.pos.copy();
	    // Adjust position to the cannon
	    pos.y -= 15;
	    var shot = new Shot(pos, this.theta);
	    return shot;
	} else {
	    // Otherwise continue countdown and return false
	    this.shootCount--;
	    return false;
	}
    }

    this.display = function() {
	push();
	translate(this.pos.x, this.pos.y);
	rectMode(RADIUS);
	rect(0, 0, 20, 16);
	translate(0, -15);
	rotate(this.theta);
	rectMode(CORNER);
	rect(0, -5, 30, 10);
	pop();
    }
}
