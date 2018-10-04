// DNA class

function DNA(newgenes) {
    var len = 20;
    if (newgenes) {
	this.genes = newgenes;
    } else {
	this.genes = [];
	for (var i = 0; i < len; i++) {
	    this.genes.push(random(0, 1));
	}
    }

    // Crossover function
    this.crossover = function(partner) {
	var child = [];
	var len = this.genes.length;
	var cross = floor(random(len));
	// An improved random crossover calculation to take an actual
	// half of each dna
	for (var i = 0; i < this.genes.length; i++) {
	    if ((i >= cross && i < cross + len/2) ||
		i < abs(cross - len/2)) child[i] = this.genes[i];
	    else child[i] = partner.genes[i];
	}
	var newgenes = new DNA(child);
	return newgenes;
    }

    // Mutation function
    this.mutate = function(m) {
	for (var i = 0; i < this.genes.length; i++) {
	    if (random(1) < m) {
		this.genes[i] = random(0, 1);
	    }
	}
    }
}
