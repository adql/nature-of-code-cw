// Class for a shot

// The shot speed also determines its length
var SHOT_SPEED = 40;

function Shot(loc, dir) {
    this.vel = createVector(SHOT_SPEED, 0);
    this.vel.rotate(dir)
    // // The back edge of the shot
    // this.back = loc.copy();
    // Actual position is at the front of the shot
    this.pos = loc.copy().add(this.vel);

    // Did the shot hit?
    this.hit = false;

    this.update = function() {
	// this.back.add(this.vel);
	this.pos.add(this.vel);
    }

    this.render = function() {
	push();
	translate(this.pos.x, this.pos.y);
	rotate(this.vel.heading());
	line(0, 0, -SHOT_SPEED, 0);
	pop();
    }

    // Function for checking if a ship was hit and inform the hit ship
    this.checkHit = function(ships) {
	// A vector pointing at the tail of the shot
	var tail = p5.Vector.sub(this.pos, this.vel);
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
		if (d < ship.size/2) {
		    this.hit = true;
		    ship.explode();
		}
	    }
	}
	
	// // Since the shot is rendered from the bottom, the top edge of
	// // it has to be calculated
	// var edge = this.pos.copy();
	// edge.add(SHOT_SPEED, 0);
	// edge.rotate(this.vel.heading());
	// for (var i = 0; i < ships.length; i++) {
	//     var ship = ships[i];
	//     // Check each ship in the array
	//     if (this.pos.dist(ship.pos) < ship.size/2) {
	// 	ship.explode();
	//     }
	// }
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
