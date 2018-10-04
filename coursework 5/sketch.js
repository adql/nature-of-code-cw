// Amir Dekel
// Nature of Code | Kadenze
// Coursework 5: Genetic Algorithms
//
// A small game of shooting ships. The ships become through evolution smarter and harder to hit. They also learn to avoid crashing to the earth. At some point the player is granted automatic shooting since the game becomes harder.
// ARROWS to move; SPACE to shoot; hold SHIFT to rotate cannon

// Some key constants for easy manipulation
var MUTATION_RATE = 0.05;
var MULT_THRESHOLD = 0.66;
var SHIP_NUMBER = 20;

var canvas;

// Globals
var world;			// Holds the game
var round;			// For counting reproduction round
				// (for enabling autoshoot

function setup() {
    canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');

    round = 0;
    world = new World(SHIP_NUMBER, MUTATION_RATE, MULT_THRESHOLD);
}

function draw() {
    background(0);

    // Very basic graphics for experimental feeling
    noFill();
    stroke(255);

    // Run everything
    world.run();
}
