// Class for a shot

// The shot's speed is also its length
var SHOT_SPEED = 40;

function Shot(loc, dir) {
    this.vel = createVector(SHOT_SPEED, 0);
    this.vel.rotate(dir)
    // The position is at the front of the shot
    this.pos = loc.copy().add(this.vel);

    // Did the shot hit?
    this.hit = false;

    // Update location. Not very interesting
    this.update = function() {
	this.pos.add(this.vel);
    }

    // Display the missile as a simple line
    this.render = function() {
	push();
	translate(this.pos.x, this.pos.y);
	rotate(this.vel.heading());
	line(0, 0, -SHOT_SPEED, 0);
	pop();
    }

    // Function for checking if a ship was hit and informing the hit
    // ship
    this.checkHit = function(ships) {
	// Location of the tail of the shot (for more intuitive
	// trigonometry)
	var tail = p5.Vector.sub(this.pos, this.vel);
	// Check each ship
	for (var i = 0; i < ships.length; i++) {
	    var ship = ships[i];
	    // First check if the shot is close enough to "cover" the
	    // ship
	    var diff = p5.Vector.sub(ship.pos, tail);
	    if (diff.mag() < SHOT_SPEED + ship.size/2) {
		// Then check if the shot is actually covering the
		// ship
		var theta = abs(this.vel.heading() - diff.heading());
		var d = sin(theta) * diff.mag();
		// If it's a hit:
		if (d < ship.size/2) {
		    // Change the status of the shot (for its removal)
		    this.hit = true;
		    // Inform the ship
		    ship.explode();
		    // No need to check further ships
		    break;
		}
	    }
	}
    }

    // Function for telling if a shot has left the canvas (vertically)
    this.isOut = function() {
	if (this.pos.y < -20) {
	    return true;
	} else return false;
    }

    // Function for telling if the shot hit
    this.didHit = function() {
	return this.hit;
    }
}
