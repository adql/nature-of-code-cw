var NOISE_RATE = 0.01;		// Size of noise step (applied to
				// frameRate)
var RATIO = 0.85;		// Ratio of the circle to its limiting
				// field (relating to x axis)

function Circle(xField, yField) {
    // Creates a circle limited to a field size of xField*yField

    // Calculate the size of the circle determined by the RATIO
    // parameter
    this.r = xField * RATIO / 2
    // Calculate the actual field of movement
    this.xField = xField - 2*this.r;
    this.yField = yField - 2*this.r;

    // Seeds for noise movement in x and y axes
    this.xSeed = random(10000);
    this.ySeed = random(10000);

    // Initial position is not really imporant (will be updated soon)
    this.pos = createVector(0, 0);

    this.update = function() {
	// Calculate pos.x with noise
	noiseSeed(this.xSeed);
	var x = (noise(frameCount * NOISE_RATE) - 0.5) * this.yField;
	// Calculate pos.y with noise
	noiseSeed(this.ySeed);
	var y = (noise(frameCount * NOISE_RATE) - 0.5) * this.yField;

	// Set the position vector
	this.pos.set(x, y);
    }
    this.update();		// Update at instantiation

    this.render = function() {
	ellipseMode(RADIUS);
	noFill();
	stroke(255);
	ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }
}
