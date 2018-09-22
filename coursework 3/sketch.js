var canvas;

var zoo;			// Zoo object to run the simulation

function setup () {
    canvas = createCanvas(1000, 700);
    canvas.parent('canvasContainer');
    // Everything runs in a Zoo object
    zoo = new Zoo();
}

function draw() {
    background('burlywood');

    // Run the zoo
    zoo.run();
}

function mousePressed() {
    // Press left mouse button to add creatures
    if (mouseButton === LEFT) zoo.moreCreatures(10);
    // Press middle mouse button to add fruits
    if (mouseButton === CENTER) zoo.moreFruits(20);
    return false;
}
