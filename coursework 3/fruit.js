// Fruit class

function Fruit(x, y) {
    this.pos = createVector(x, y);
    this.eaten = false;

    this.beEaten = function() {
	this.eaten = true;
    }

    this.render = function() {
	fill('red');
	ellipse(this.pos.x, this.pos.y, 10, 10);
    }
}
