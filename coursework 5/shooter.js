// A class for the player's shooter

function Shooter(xloc) {
    // Location of the shooter
    this.pos = createVector(xloc, height);
    // Direction of cannon
    this.theta = -HALF_PI

    // Counter for intervals between shots
    this.shootCount = 0;
    // Variable to hold autoshoot mode
    this.autoShoot = false;

    // Main function
    this.run = function() {
	// Listen to user input
	var shot = this.listen();
	this.render();

	// Return shot (or false) to the world object
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
	    // Limit cannon's movement
	    this.theta = constrain(this.theta, -HALF_PI-QUARTER_PI, -QUARTER_PI);
	} else {
	    // Otherwise, arrow keys move the shooter left or right
	    if (keyIsDown(LEFT_ARROW)) this.pos.x -= 5;
	    if (keyIsDown(RIGHT_ARROW)) this.pos.x += 5;
	}

	// Listen to shooting and return a shot if there is one
	if (keyIsDown(32)) {
	    return this.shoot();
	} else {
	    // Keep counter on 0 so that next shot is immediate
	    this.shootCount = 0;
	    return false;
	}
    }

    // Shooting function. Returns a shot object
    this.shoot = function() {
	if (this.shootCount == 0) {
	    // If it's time to shoot
	    // Begin new count (for autoshoot mode)
	    this.shootCount = 10;
	    // Create a shot object and return it
	    var pos = this.pos.copy();
	    // Adjust position to the cannon
	    pos.y -= 15;
	    var shot = new Shot(pos, this.theta);
	    return shot;
	} else if (this.autoShoot) {
	    // Otherwise continue countdown if autoShoot mode is
	    // enabled
	    this.shootCount--;
	    return false;
	} else return false;	// Otherwise no autoshoot
    }

    // Display the shooter
    this.render = function() {
	push();
	translate(this.pos.x, this.pos.y);
	// Body
	rectMode(RADIUS);
	rect(0, 0, 20, 16);
	// Cannon
	translate(0, -15);
	rotate(this.theta);
	rectMode(CORNER);
	rect(0, -5, 30, 10);
	pop();
    }
}
