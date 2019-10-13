// Amir Dekel
// Nature of Code | Kadenze
// Coursework 4: Fractal Design
//
// A drawing of a matrix of squares. Some of the squares are recursive
// drawings of the same pattern. User can change the size of the
// matrix anc choose one of four color palettes

// Color palettes
var PALETTE_1 = ['#22181c', '#fe5e41', '#0cca4a'];
var PALETTE_2 = ['#f2dfd7', '#a4b8c4', '#d4c1ec'];
var PALETTE_3 = ['#ebbab9', '#324b56', '#5e503f'];
var PALETTE_4 = ['#2d5', '#ed2', '#26a'];
// Include all palettes in one array for easy selection
var COLORS = [PALETTE_1, PALETTE_2, PALETTE_3, PALETTE_4];

var RECURSIVE_CHANCE = 0.4;	// How often a square will be recursive
var MIN_SIZE = 2;		// Minimum size of the matrix
var MAX_SIZE = 6;		// Maximum size of the matrix

// Global variabls for DOM elements
var canvas;
var sizeSlider;
var paletteRadio;

// global variables
var square = [];		// Holds the colors of the squares
var squareSize;			// Holds the size of each square
				// (scaled in recursive calls)
var colors;			// Holds the active color palette

function setup() {
    canvas = createCanvas(600, 600);
    canvas.parent('canvas-container');

    // Define the slider for setting the size; add the minimum and
    // maximum value through DOM manipulation
    var sizeSliderContainer = select('#size-slider');
    sizeSliderContainer.child(createSpan(MIN_SIZE));
    sizeSlider = createSlider(MIN_SIZE, MAX_SIZE, 3, 1).parent(sizeSliderContainer);
    sizeSliderContainer.child(createSpan(MAX_SIZE));
    sizeSlider.changed(draw);	// Redraw after it's been modified

    // Define the radio buttons for selecting color palette
    var paletteRadioContainer = select('#palette-radio');
    paletteRadio = createRadio().parent(paletteRadioContainer);
    paletteRadio.option(1);
    paletteRadio.option(2);
    paletteRadio.option(3);
    paletteRadio.option(4);
}

function draw() {
    // No repeated drawing. The function is called when something
    // changes.
    noLoop();

    // Set the size according to user input or default value
    size = sizeSlider.value();

    // Set the color palette. If non is yet selected, select the first.
    if (! paletteRadio.value()) paletteRadio.value('1');
    colors = COLORS[paletteRadio.value()-1];

    // Begin with an empty array to hold the square colors
    squares = [];
    // Set the size of each square
    squareSize = width / size;

    // Loop to create the array. Each item refers to a cell in a
    // matrix-like fashion.
    for (var i = 0; i < size*size; i++) {
	// Randomly decide if this square should be a recursive
	// square
	if (random(1) < RECURSIVE_CHANCE) {
	    // -1 marks a recursive square
	    squares.push(-1);
	} else {
	    // A normal square
	    // Choose a random color from the palette
	    var c = color(colors[floor(random(0, colors.length))]);
	    squares.push(c);
	}
    }

    // Run the recursive function that draws everything
    makeSquares(0);
}

// The recursive function where everything happens.
function makeSquares(level) {
    stroke(200, 100);
    // First loop for rows
    for (var i = 0; i < size; i++) {
	// Second loop for columns
	for (var j = 0; j < size; j++) {
	    // Location in the array
	    var square = squares[i*size + j];
	    // Set x and y position on the canvas
	    var x = j * squareSize;
	    var y = i * squareSize;
	    // If the square is recursive, initiate recursion
	    if (square == -1) {
		// Only continue recursion if the square size is big
		// enough. This needs to be calculated based on the
		// level since the size variable itself doesn't change
		if (squareSize / pow(size, level) > 3) {
		    push();
		    // Translate to the location of the square
		    translate(x, y);
		    // Scale down to the size of the square
		    scale(1 / size);
		    // Recursive call to next level
		    makeSquares(level+1);
		    pop();
		} else {
		    // If recursion ends here, fill with a random
		    // color
		    fill(colors[floor(random(0, colors.length))]);
		    // Draw the square
		    rect(x, y, squareSize, squareSize);		    
		}
	    } else {
		// In the case of a normal square
		// Set the fill color
		fill(square);
		// Draw the square
		rect(x, y, squareSize, squareSize);
	    }
	}
    }
}

// Redraw when user clicks the mouse (this is triggered also when
// choosing a radio button
function mouseClicked() {
    draw();
}
