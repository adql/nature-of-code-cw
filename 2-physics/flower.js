const CENTER_COLORS = ['coral', 'gold', 'darkorange']; // Color palette for the leaves of the flowers
const LEAVES_COLORS = ['lightpink', 'lightgreen', 'lemonchiffon']; // Color palette for the center of the flowers

// Alternative (more simple) color palettes
// const CENTER_COLORS = ['red', 'green']; // Color palette for the center of the flowers
// const LEAVES_COLORS = ['yellow', 'orange']; // Color palette for the leaves of the flowers

function Flower(x, y) {
    // Function for creating a flower object. Accepts an initial position for the flower

    this.pos = createVector(x, y); // Apply the position arguments
    this.vel = createVector(0, 0); // Initial zero velocity
    this.acc = createVector(0, 0); // Initial zero acceleration
    this.mass = random(0.5, 1);	   // Random mass
    this.leaves = int(random(4, 7)); // Random number of leaves between 4-6
    // Create a color object for the center and the leaves by choosing
    // randomly from each palette and converting using the color()
    // function
    this.centerColor = color(CENTER_COLORS[int(random(0, CENTER_COLORS.length))]);
    this.leavesColor = color(LEAVES_COLORS[int(random(0, LEAVES_COLORS.length))]);
    this.angle = 0;		// Initial angle for the spinning of
				// the flower as it moves

    // General function for applying force
    this.applyForce = function(force) {
	// Creating the temporary vector and dividing by mass is done
	// in one line by using the class div() function
	var f = p5.Vector.div(force, this.mass);
	this.acc.add(f);	// Add force to acceleration
    }

    // Update function
    this.update = function() {
	this.vel.add(this.acc);	// update velocity
	this.pos.add(this.vel);	// update position
	this.angle += this.vel.x * 0.1; // rotate the flower
					// relatively to its velocity
	this.acc.set(0, 0);		// Reset acceleration for the
					// next round
    }

    // Display function
    this.display = function() {
	stroke(0, 180);	   // Make stroke a bit transparent
	// Push the matrix to allow transformations
	push();
	translate(this.pos.x, this.pos.y); // Translate to current
					   // position of the flower
	rotate(this.angle);		   // Rotate to the spinning
					   // angle of the flower
	// Begin with drawing the leaves
	fill(this.leavesColor);	// Leaves color
	// Iterate through the leaves
	for (let i=0; i<this.leaves; i++) {
	    // Angle of the leaf around the circle is calculated
	    // according to the number of the leaves
	    let angle = i * TWO_PI / this.leaves;
	    // Apply trigonometry to set the location of the leave
	    // relateively to the center
	    let x = cos(angle) * 7;
	    let y = sin(angle) * 7;
	    ellipse(x, y, 10, 10); // Draw the leaf
	}
	// Draw the center of the flower
	fill(this.centerColor);	// Center color
	ellipse(0, 0, 10, 10);	// Draw it
	pop();			// Pop the original matrix for the
				// next round
    }
}
