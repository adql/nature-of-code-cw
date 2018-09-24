var circles = [];			// Array to hold the circles

function setup() {
    createCanvas(600, 600);
    // circle = new Circle(width, height);

    // Begin the array of circle with one circle constrained to the
    // canvas itself
    circles.push(new Circle(width, height));
    // Now create the rest of the array recursively
    do {
	var previous = circles[circles.length-1];
    	var circle = new Circle(previous.r*2, previous.r*2);
	circles.push(circle);
    } while (circles[circles.length-1].r > 5);
}

function draw() {
    background(0, 50);

    for (var i = 0; i < circles.length; i++) {
	circles[i].update();

	push();
	translate(width/2, height/2);
	if (i > 0) translate(circles[i-1].pos.x, circles[i-1].pos.y);
	circles[i].render();
	pop();
    }
}
