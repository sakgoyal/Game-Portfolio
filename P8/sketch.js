function setup() {
	createCanvas(400, 400);
	let numSchools = 3;
	for (let i = 0; i < numSchools; i++) schools.push([]);

	let posX = 300;
	let posY = random(100, 300);
	let numfish = random(8, 12);
	for (let i = 0; i < numSchools; i++) {
		for (let j = 0; j < numfish; j++) {
			let vec = p5.Vector.random2D();
			schools[i].push(new Fish(posX + 50 * vec.x, posY + 50 * vec.y));
		}
		posX += 500;
		posY = random(100, 300);
	}
	let numRandomFish = int(random(10, 15));
	for (let i = 0; i < numRandomFish; i++) swarm.push(new Fish(random(20, 1500 - 20), random(20, height - 20)));
	for (let i = 100; i < 1500; i += 300) weeds.push(new SeaWeed(i, 260));

	groundPoints.push(createVector(0, 300));
	for (let i = 0; i < 1500; i += 150) groundPoints.push(createVector(i, 300 + random(-10, 10)));

	for (let i = 0; i < 20; i++) {
		rocks.push(new Rock(random(0, 1500), 330 + random(-30, 30)));
	}
	for (let i = 0; i < tail2.length; i++) {
		tail2[i].x -= 100;
		tail2[i].y -= 120;
	}
}

let cameraX = 0;
let keyArray = [];
let swarm = [];
let schools = [];
let weeds = [];
let rocks = [];
let bubbles = [];
let groundPoints = [];

function draw() {
	drawBack();
	moveCamera();
	showGround();
	showGroupedFish();
	swarm.forEach((element) => element.wander());
	rocks.forEach((element) => element.show());
	weeds.forEach((element) => element.show());
	showBubbles();
}

function keyPressed() {
	keyArray[keyCode] = true;
}

function keyReleased() {
	keyArray[keyCode] = false;
}
class Fish {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 0.1 + random(-0.05, 0.03);
		this.type = [0, 0, random(tails)];
		this.color = [random(fishColors), random(fishColors)];
		while (this.color[0] == this.color[1]) this.color[0] = random(fishColors);
		this.tailPos = Math.asin(cos(frameCount / 12)) / 2;
		this.target = createVector(random(0, 1500), random(0, height));
		this.dir = 1;
	}
	show() {
		push();
		translate(this.x, this.y);
		fill(this.color[1]);
		stroke([70, 100, 200, 255]);
		strokeWeight(5);
		scale(this.size);
		this.tailPos = 1.1 + Math.asin(cos(frameCount / 12)) / 6;
		beginShape();
		vertex(this.type[2][0].x, this.type[2][0].y);
		for (let i = 1; i < this.type[2].length; i++) {
			curveVertex(this.type[2][i].x * this.tailPos * this.dir, this.type[2][i].y);
		}
		endShape();
		beginShape();
		fill(this.color[0]);
		for (let i = 1; i < body.length; i++) {
			curveVertex(body[i][0] * this.dir, body[i][1] - 50);
		}
		endShape();
		fill(5, 5, 10);
		circle(-200 * this.dir, 0, 30);
		pop();
	}
	update() {
		this.x += this.speed;
	}
	wander() {
		while (dist(this.x, this.y, this.target.x, this.target.y) < 300) {
			this.target = createVector(random(0, 1500), random(0, height));
		}
		// flip direction when needed
		if (this.target.x > this.x) this.dir = -1;
		else this.dir = 1;

		this.x = lerp(this.x, this.target.x, 0.001);
		this.y = lerp(this.y, this.target.y, 0.001);
		this.show();
	}
}
class Weed {
	constructor(x, y, index) {
		this.x = x;
		this.y = y;
		this.h = this.y + 100;
		this.start = 0;
		this.xoff = 0;
		this.wadeOff = index;
		this.shade = random(-20, 20);
		noiseDetail(0.7);
	}
	show() {
		push();
		this.inc = 0.03;
		this.xoff = this.start;
		this.pX = [];
		this.pY = [this.h];
		translate(this.x, 0);
		for (let j = 0; j < 4; j++) {
			this.pX.push(noise(this.xoff + this.wadeOff + this.x) * 100 - this.wadeOff);
			this.xoff += 10 * this.inc;
			this.pY.push(this.pY[this.pY.length - 1] / 1.1);
		}
		this.start += this.inc;
		beginShape();
		stroke(0, 100, 10);
		strokeWeight(2);
		fill(10, 140 + this.shade, 10);
		vertex(0, this.h);
		bezierVertex(this.pX[1], this.pY[1], this.pX[2], this.pY[2], this.pX[3], this.pY[3]);
		bezierVertex(this.pX[2] + 15, this.pY[2], this.pX[1] + 15, this.pY[1], 5, this.h);
		vertex(0, this.h);
		endShape();
		pop();
	}
}
class SeaWeed {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.weeds = [];

		for (let i = 0; i < 7; i++) {
			this.weeds.push(new Weed(this.x + map(-i, 0, 5, -7, 7), this.y, -10 + 10 * i));
		}
		this.weeds.push(new Weed(this.x + 150 + random(-60, 70), this.y + random(-40, 40), 4));
		this.weeds.push(new Weed(this.x + 100 + random(-60, 70), this.y + random(-40, 40), 4));
	}
	show() {
		for (let i = 0; i < this.weeds.length; i++) {
			this.weeds[i].show();
		}
	}
}
class Rock {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.scaleW = 7;
		this.scaleH = 10;
		this.w = width / this.scaleW;
		this.h = height / this.scaleH;
		this.color = [random(80, 150), 255];
		this.r = this.w / this.scaleW / random(1, 2);
		this.p = {
			x1: random(this.w / 2 - this.w / 8, this.w / 2 + this.w / 8),
			y1: random(this.h / 10, this.h / 5),
			x2: random(this.w - this.w / 10, this.w - this.w / 5),
			y2: random(this.h / 2 - this.h / 8, this.h / 2 + this.h / 8),
			x3: random(this.w / 2 - this.w / 8, this.w / 2 + this.w / 8),
			y3: random(this.h - this.h / 10, this.h - this.h / 5),
			x4: random(this.w / 10, this.w / 5),
			y4: random(this.h / 2 - this.h / 8, this.h / 2 + this.h / 8),
		};
		this.pW = this.p.x2 - this.p.x4;
		this.pH = this.p.y3 - this.p.y1;
		this.p.x1 = random(this.p.x1 - this.pW / 2, this.p.x1 + this.pW / 5);
		this.p.x3 = random(this.p.x3 - this.pW / 5, this.p.x3 + this.pW / 5);
		this.p.y2 = random(this.p.y2 - this.pH / 5, this.p.y2 + this.pH / 5);
		this.p.y4 = random(this.p.y4 - this.pH / 5, this.p.y4 + this.pH / 5);
		this.a = {
			x1: this.p.x1 + this.r,
			y1: this.p.y1,
			x2: this.p.x2,
			y2: this.p.y2 - this.r,
			x3: this.p.x2,
			y3: this.p.y2 + this.r,
			x4: this.p.x3 + this.r,
			y4: this.p.y3,
			x5: this.p.x3 - this.r,
			y5: this.p.y3,
			x6: this.p.x4,
			y6: this.p.y4 + this.r,
			x7: this.p.x4,
			y7: this.p.y4 - this.r,
			x8: this.p.x1 - this.r,
			y8: this.p.y1,
		};
	}
	show() {
		push();
		translate(this.x, this.y);
		fill(this.color);
		let col = [this.color[0] - 10, this.color[0] - 10, this.color[0] - 10];
		stroke(col, 255);
		strokeWeight(2);
		beginShape();
		vertex(this.p.x1, this.p.y1);
		bezierVertex(this.a.x1, this.a.y1, this.a.x2, this.a.y2, this.p.x2, this.p.y2);
		bezierVertex(this.a.x3, this.a.y3, this.a.x4, this.a.y4, this.p.x3, this.p.y3);
		bezierVertex(this.a.x5, this.a.y5, this.a.x6, this.a.y6, this.p.x4, this.p.y4);
		bezierVertex(this.a.x7, this.a.y7, this.a.x8, this.a.y8, this.p.x1, this.p.y1);
		endShape();
		pop();
	}
}
class BubbleAnimation {
	constructor(x = 50, y = height - 50) {
		this.x = x;
		this.y = y;
		this.bubbles = [];
		// add between 10 and 20 bubbles
		for (let i = 0; i < int(random(6, 10)); i++) {
			let vec = {
				x: random(-3, 3),
				y: random(-3, 3),
			};
			this.bubbles.push({
				x: vec.x,
				y: vec.y,
				r: 5,
				a: 180,
			});
		}
	}
	show() {
		if (this.bubbles.length == 0) return;
		push();
		translate(this.x, this.y);
		this.bubbles = this.bubbles.filter((b) => b.y + this.y > 0);
		for (let i = 0; i < this.bubbles.length; i++) {
			push();
			stroke(220, 250);
			fill(200, 200, 255, this.bubbles[i].a);
			circle(this.bubbles[i].x, this.bubbles[i].y, this.bubbles[i].r);
			this.bubbles[i].x += this.bubbles[i].x / 130;
			this.bubbles[i].y += 200 / (this.bubbles[i].y - 6);
			this.bubbles[i].r += 0.04;
			this.bubbles[i].a -= 1;
			pop();
		}
		pop();
	}
}

function drawBack() {
	noStroke();
	let c1 = color(100, 160, 220);
	let c2 = color(6, 57, 112);

	for (let y = 0; y < height; y++) {
		n = map(y, 0, height, 0, 1);
		let newc = lerpColor(c1, c2, n);
		stroke(newc);
		line(0, y, width, y);
	}
}

function moveCamera() {
	if (keyArray[LEFT_ARROW]) cameraX -= 5;
	if (keyArray[RIGHT_ARROW]) cameraX += 5;
	cameraX = constrain(cameraX, 0, 1100);
	translate(-cameraX, 0);
}

function showGroupedFish() {
	for (let i = 0; i < schools.length; i++) {
		for (let j = 0; j < schools[i].length; j++) {
			schools[i][j].show();
		}
	}
}

function showBubbles() {
	for (let i = 0; i < bubbles.length; i++) {
		bubbles[i].show();
	}
	bubbles = bubbles.filter((b) => b.bubbles.length > 0);
	if (frameCount % 150 == 0) bubbles.push(new BubbleAnimation((x = random(cameraX + 50, cameraX + width - 50))));
}

function showGround() {
	push();
	fill(231, 196, 150, 200);
	noStroke();
	beginShape();
	vertex(0, height - 80);
	for (let i = 0; i < groundPoints.length; i++) {
		curveVertex(groundPoints[i].x, groundPoints[i].y);
	}
	vertex(1500, height - 80);
	vertex(1500, height - 80);
	vertex(1500, height);
	vertex(0, height);
	endShape(CLOSE);
	pop();
}
let tail1 = [
	{
		x: 0,
		y: -1,
	},
	{
		x: -10,
		y: 5,
	},
	{
		x: 51,
		y: -35,
	},
	{
		x: 84,
		y: -40,
	},
	{
		x: 102,
		y: -25,
	},
	{
		x: 110,
		y: 10,
	},
	{
		x: 110,
		y: 68,
	},
	{
		x: 102,
		y: 100,
	},
	{
		x: 88,
		y: 115,
	},
	{
		x: 55,
		y: 110,
	},
	{
		x: 5,
		y: 82,
	},
	{
		x: -25,
		y: 55,
	},
	{
		x: -24,
		y: 40,
	},
];
let tail2 = [
	{
		x: 73.75,
		y: 136,
	},
	{
		x: 63.25,
		y: 142,
	},
	{
		x: 56.5,
		y: 153.5,
	},
	{
		x: 53.5,
		y: 170.5,
	},
	{
		x: 59,
		y: 183.25,
	},
	{
		x: 73,
		y: 191.75,
	},
	{
		x: 117.25,
		y: 222,
	},
	{
		x: 191.75,
		y: 274,
	},
	{
		x: 234.25,
		y: 293.25,
	},
	{
		x: 244.75,
		y: 279.75,
	},
	{
		x: 242.5,
		y: 266,
	},
	{
		x: 227.5,
		y: 252,
	},
	{
		x: 226.25,
		y: 237.5,
	},
	{
		x: 238.75,
		y: 222.5,
	},
	{
		x: 236.75,
		y: 206.75,
	},
	{
		x: 220.25,
		y: 190.25,
	},
	{
		x: 220.25,
		y: 173.75,
	},
	{
		x: 236.75,
		y: 157.25,
	},
	{
		x: 236.75,
		y: 141.25,
	},
	{
		x: 220.25,
		y: 125.75,
	},
	{
		x: 220,
		y: 111.75,
	},
	{
		x: 236,
		y: 99.25,
	},
	{
		x: 235,
		y: 86.75,
	},
	{
		x: 217,
		y: 74.25,
	},
	{
		x: 216,
		y: 62.25,
	},
	{
		x: 232,
		y: 50.75,
	},
	{
		x: 230,
		y: 38.75,
	},
	{
		x: 210,
		y: 26.25,
	},
	{
		x: 169.75,
		y: 48.25,
	},
	{
		x: 139.5,
		y: 76.5,
	},
];
let body = [
	[-31.25, 60],
	[-50.75, 40],
	[-83.5, 20],
	[-129.5, 5],
	[-173.75, 2],
	[-216.25, 9],
	[-246.0, 25],
	[-263.0, 55],
	[-271.25, 74],
	[-270.75, 87],
	[-263.5, 140],
	[-249.5, 160],
	[-225.25, 173.5],
	[-190.75, 180.5],
	[-148.5, 177.5],
	[-98.5, 164.5],
	[-58.75, 151.5],
	[-29.25, 138.5],
	[-10.0, 128.25],
	[-1.0, 120.75],
	[0.0, 106.75],
	[-7.0, 80],
	[-13.25, 75],
	[-16.0, 74],
];
let tails = [tail1, tail2];
let fishColors = [
	[226, 135, 67, 255],
	[207, 184, 10, 255],
	[60, 150, 190, 255],
];