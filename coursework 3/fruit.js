// Fruit class. Very simple.

function Fruit(x, y) {
    // Position of the fruit according to arguments
    this.pos = createVector(x, y);
    this.eaten = false;		// For deleting purposes

    // A function to update the eaten status
    this.beEaten = function() {
	this.eaten = true;
    }

    // Display the fruit
    this.render = function() {
	fill('red');
	ellipse(this.pos.x, this.pos.y, 10, 10);
    }
}
