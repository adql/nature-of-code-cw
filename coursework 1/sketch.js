// Amir Dekel
// Nature of Code | Kadenze
// Coursework 1: Random Walker
//
// A clumsy creature (the walker) chasing an imaginary creature.

const NOISE_STEP = 0.01;	// offset for the noise function
const CHASED_VISIBLE = false;	// change to 'true' to see the chased imaginary creature
const ACC = 0.1;		// magnitude of the acceleration of the clumsy creature
const SPEED_LIMIT = 2;		// and the maximum magnitude of its velocity

var w;				// the creature

function setup() {
    // The usual initialization with canvas size and walker object
    createCanvas(800, 800);
    w = new Walker();
}

function draw() {
    // background color
    background('firebrick');
    // update location and display walker
    w.update();
    w.display();
}

function Walker() {
    // First declare the variables for the imaginary chased creature
    this.offset = 0;	// offset for the noise function
    // The creature's location is based on two noise functions (each
    // for each axis. A unique seed for each one is needed in order to
    // make them different from each other. The seeds are chosen
    // randomly.
    this.seedX = random(10000);
    this.seedY = random(10000);
    // Now creating the vector for the imaginary chased creature and
    // setting its x and y position with noise function, each axis
    // with its own seed
    this.chased = createVector(0, 0);
    noiseSeed(this.seedX);
    this.chased.x = noise(this.offset) * width;
    noiseSeed(this.seedY);
    this.chased.y = noise(this.offset) * height;

    // Now to the walker itself. In addition to its position and
    // velocity, an angle between it and the imaginary creature is
    // used to determine its direction for graphical purposes
    this.pos = createVector(width/2, height/2);
    this.vel = createVector(0, 0);
    this.angle = this.pos.angleBetween(this.chased);
    
    this.update = function () {
	// first updating the location of the imaginary creature by
	// stepping forward the parameter for the noise
	// function. Again, the two seeds are used for separating the
	// axis to two different noises.
	this.offset += NOISE_STEP;
	noiseSeed(this.seedX);
	this.chased.x = noise(this.offset) * width;
	noiseSeed(this.seedY);
	this.chased.y = noise(this.offset) * height;

	// next, update the walker itself:
	// acceleration towards the imaginary creature, with magnitude
	// set to the predefined constant
	this.acc = p5.Vector.sub(this.chased, this.pos).setMag(ACC);
	// adding acceleration to velocity
	this.vel.add(this.acc).limit(SPEED_LIMIT);
	// updating position
	this.pos.add(this.vel);
0	// updating angle according to the direction of acceleration
	this.angle = this.acc.heading();
    }

    this.display = function () {
	// Just to make it possible to see the imaginary creature
	if (CHASED_VISIBLE) {
	    fill('black');
	    ellipse(this.chased.x, this.chased.y, 3, 3);
	}

	// push() and pop() are used for the rotation of the walker
	// towards its imagination
	push();
	// translate in order to make rotation possible
	translate(this.pos.x, this.pos.y);
	rotate(this.angle);
	// draw the walker
	fill('black');
	// body
	ellipse(0, 0, 30, 20);
	// legs
	ellipse(-8, -5, 2, 16);
	ellipse(-3, -5, 2, 16);
	ellipse( 2, -5, 2, 16);
	ellipse( 7, -5, 2, 16);
	ellipse(-8,  5, 2, 16);
	ellipse(-3,  5, 2, 16);
	ellipse( 2,  5, 2, 16);
	ellipse( 7,  5, 2, 16);
	// head
	ellipse(15, 0, 14, 12);
	// eyes
	fill('white');
	ellipse(20, -3, 2, 2);
	ellipse(20,  3, 2, 2);
	// pop back to original translation and rotation matrix
	pop();
    }
}
