var BEGIN_WITH = 20;		// How many creatures to begin with

// var creatures = [];		// Array to hold creatures
var zoo;			// Zoo object to run the simulation

function setup () {
    createCanvas(1000, 800);
    // Create initial inventory of creatures
    // for (var i = 0; i < BEGIN_WITH; i++) {
    // 	creature = new Creature(random(width), random(height));
    // 	creatures.push(creature);
    // }
    zoo = new Zoo(BEGIN_WITH);
}

function draw() {
    background(120);

    // Update and render each creature
    // for (var i = 0; i < zoo.creatures.length; i++) {
    // 	zoo.creatures[i].behave(zoo.creatures);
    // 	zoo.creatures[i].render();
    // }
    zoo.run();
}

function mousePressed() {
    if (mouseButton === LEFT) zoo.moreCreatures(10);
    if (mouseButton === CENTER) zoo.moreFruits(20);
    return false;
}
