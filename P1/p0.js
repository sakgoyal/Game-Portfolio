class initial {
	constructor() {
		this.x = 120;
		this.y = 200;
	}
	update() {
		this.y = 200 + startScreen.posit(frameCount / 60);
	}
	show() {
		rotate(cos(frameCount / 60) / 30);
		arc(this.x, this.y - 10, 20, 20, PI / 2, -0.5);
		arc(this.x, this.y + 10, 20, 20, PI + PI / 2, PI - 0.5);
		arc(this.x + 35, this.y, 30, 40, PI / 5, 1.6 * PI);
		line(this.x + 40, this.y + 5, this.x + 55, this.y + 5);
		line(this.x + 48, this.y + 6, this.x + 48, this.y + 20);
		rotate(-cos(frameCount / 60) / 30);
	}
}
class particle {
	constructor(g) {
		this.x = random(width);
		this.y = random(height);
		this.r = g * 3;
		this.g = g;
		this.color = [random(255), random(255), random(255), random(80, 160)];
	}
	show() {
		fill(this.color);
		ellipse(this.x, this.y, this.r, this.r);
	}
	update() {
		this.y = this.y + this.g;
		if (this.y > height) {
			this.y = random(-3);
			this.x = random(width);
		}
	}
}
class pipe {
	constructor() {
		this.x = 350;
		this.y = 200 + startScreen.posit(frameCount / 60 - 350);
		this.color = [random(100, 200), random(100, 200), random(100, 200)];
	}
	show() {
		fill(this.color);
		rect(this.x, 0, 50, this.y - 50);
		rect(this.x, this.y + 50, 50, height);
	}
	update() {
		this.x -= 3;
		if (this.x < -50) {
			this.x = width + 50;
			this.y = 200 + startScreen.posit(frameCount / 60 - 350);
			this.color = [random(100, 200), random(100, 200), random(100, 200)];
		}
	}
}
class startScreen {
	constructor() {
		this.dots = [];
		this.myInitial;
		this.pipes = [];
		this.wait = true;
	}
	setup() {
		createCanvas(400, 400);
		this.myInitial = new initial();
		for (let i = 0; i < 30; i++) {
			this.dots.push(new particle(random(0.2, 2.6)));
		}
		this.pipes.push(new pipe());
		this.pipes.push(new pipe());
		this.pipes[1].x = 600;
		this.pipes[1].y = 200 + startScreen.posit(frameCount / 60 - PI * PI);
	}

	draw() {
		background(220);
		noStroke();

		for (let i = 0; i < this.dots.length; i++) {
			this.dots[i].show();
			this.dots[i].update();
		}
		for (let i = 0; i < this.pipes.length; i++) {
			this.pipes[i].show();
			this.pipes[i].update();
		}
		noFill();
		stroke(0);
		strokeWeight(2);
		this.myInitial.update();
		this.myInitial.show();
		noStroke();
		textSize(18);
		fill(10);
		text("Press any key to start", 220, 390);
	}
	static posit(x) {
		return 100 * sin(x);
	}
}
