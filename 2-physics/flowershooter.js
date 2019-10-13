function FlowerShooter() {
    // A simple flower shooter with constant position at the bottom
    // middle of the canvas
    this.pos = width/2;

    // A function for shooting a flower. Returns a flower object for
    // adding to an external array
    this.shoot = function(){
	// Flower is initially positioned at the location of the shooter	
	flower = new Flower(this.pos, height);
	// Shooting with a random force for variation
	force = createVector(random(5, 9), 0);
	// Random direction around -90° (up)
	dir = -HALF_PI + random(-PI/8, PI/8);
	// Rotate force towards shooting direction
	force.rotate(dir);
	// Apply the force to the flower
	flower.applyForce(force);
	// Return flower object for external use
	return flower;
    }

    // Display the flower shooter
    this.display = function() {
	push();			// Push for easier positioninig
	translate(this.pos, height); // Translate to shooter position
	fill(180);		     // Grey color
	stroke(0);		     // Full stroke
	rectMode(CENTER);	     // Easier to position in this method
	rect(0, 0, 46, 40);
	line(23, -20, 28, -34);
	line(-23, -20, -28, -34);
    }
}
