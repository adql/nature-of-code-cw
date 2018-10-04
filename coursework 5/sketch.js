var MUTATION_RATE = 0.05;
var MULT_THRESHOLD = 0.66;
var SHIP_NUMBER = 20;

var canvas;

var world;
var autoMode;

function setup() {
    canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');

    world = new World(SHIP_NUMBER, MUTATION_RATE, MULT_THRESHOLD);

    autoMode = false;
}

function draw() {
    background(0);

    // Temporary for initial sketching
    noFill();
    stroke(255);

    world.run();
}

function mousePressed() {
    loop();
}

function keyTyped() {
    if (key === 'a' || key === 'A') {
	if (autoMode) autoMode = false;
	else autoMode = true;
    }
}
