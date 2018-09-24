// var circles = [];			// Array to hold the circles
var circle;			// Temporarily doing one circle for
				// experimentation

function setup() {
    createCanvas(600, 600);
    circle = new Circle(width, height);
}

function draw() {
    background(0);
    push();
    translate(width/2, height/2);
    circle.update();
    circle.render();
    pop();
}
