// Amir Dekel
// Nature of Code | Kadenze
// Coursework 2: Physics
//
// Flowers are shot out and fly with the wind. Press SPACEBAR to shoot
// the flowers. Hold the mouse button to add wind.

var flowers = [];		// array to hold flowers
var shooter;			// the shooter object
var wind;			// the actual wind
var windMedian;			// the basis for the wind (before adding noise)
var xoff;			// variable for the noise function

function setup() {
    // Create canvas and the flower shooter (the only persistent object)
    createCanvas(800, 500).parent('canvas-container');
    shooter = new FlowerShooter();
}

function mousePressed() {
    // Pressing the mouse activates the wind with a new median
    // value. The actual wind force varies during rendering to make it
    // more natural
    windMedian = random(-0.25, 0.25);
    xoff = 0.0;			// resetting the noise variable
}

function draw() {
    background('lightblue');

    // Holding SPACEBAR shoots flowers
    if (keyIsDown(32)) {
	flowers.push(shooter.shoot()); // Add a flower to the array
    }

    // As long as the mouse is pressed wind is generated around a
    // median value determined at the moment of pressing the mouse
    // with the function above
    if (mouseIsPressed) {
	// Actual wind for this round of draw() is based on its median
	// value with added noise
	wind = createVector(windMedian + (noise(xoff)-0.5) / 8, 0);
	xoff += 0.005;		// advance the noise value for the
				// next round
    }

    // Iterate the flowers array to update the location of each flower
    // and display it
    for (let i=0; i<flowers.length; i++) {
	// Calculate gravity and apply to the flower
	var gravity = createVector(0, 0.1 * flowers[i].mass);
	flowers[i].applyForce(gravity);

	// Apply the wind only if the mouse is pressed
	if (mouseIsPressed) {
	    flowers[i].applyForce(wind);
	}

	// Update and display the flower
	flowers[i].update();
	flowers[i].display();

	// Remove flowers from the array if they have fallen beneath
	// the bottom of the canvas
	if (flowers[i].pos.y > height + 10) {
	    flowers.splice(i, 1);
	}
    }

    // Finally, draw the flower shooter
    shooter.display();
}
