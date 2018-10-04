var MUTATION_RATE = 0.05;
var MULT_THRESHOLD = 0.66;
var SHIP_NUMBER = 20;

var canvas;

var world;
var round;

function setup() {
    canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');

    round = 0;
    world = new World(SHIP_NUMBER, MUTATION_RATE, MULT_THRESHOLD);
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
