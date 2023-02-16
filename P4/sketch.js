function keyPressed() {
	keyArray[keyCode] = 1;
	if (player.onGround == false && !gameOver) {
		// make sure the player can't jump while in the air or hold down other keys to jump twice
		keyArray[32] = 0;
		keyArray[38] = 0;
		keyArray[87] = 0;
	}
	showTitle = false; // remove title screen when any key is pressed
}
function keyReleased() {
	keyArray[keyCode] = 0;
}
function setup() {
	createCanvas(400, 400);
	background(0, 0, 0, 0); // transparent background
	drawPlat(); // draw the platform texture
	drawBar(); // draw the barrel texture
	drawPlayer(); // draw the player texture
	p = [];
	b = [];
	gameOverDots = []; // array of dots for the game Win screen
	for (let i = 0; i < 30; i++) gameOverDots.push(new particle(random(0.2, 2.6)));
	for (let i = 0; i < tilemap.length; i++) {
		for (let j = 0; j < tilemap[i].length; j++) {
			if (tilemap[i][j] == "p") p.push(new Platform(j * 20, i * 20, p.length)); // create a platform at the position of the "p" in the tilemap
			else if (tilemap[i][j] == "c") player = new Player(j * 20, i * 20); // create the player at the position of the "c" in the tilemap
		}
	}
	showTitle = true;
	gameOver = false;
	gameWin = false;
	lava = color(255, random(100, 255), random(0, 90)); // randomize the color of the lava each time the game is started
}
function titleScreen() {
	push();
	textSize(35);
	stroke(0);
	fill(255);
	strokeWeight(1);
	textAlign(CENTER);
	text("Hippity Hoppity", width / 2, -30 + height / 2); // title text
	textSize(15);
	text("You must get to the toppity", width / 2, 10 + height / 2);
	text("Press any key to start", width / 2, 30 + height / 2);

	text("Controls:", width / 2, 70 + height / 2); // show keyboard controls here
	text("SD or Arrow Keys to move", width / 2, 90 + height / 2);
	text("Space/W/Up arrow to jump", width / 2, 110 + height / 2);
	pop();
}
function gameOverScreen() {
	push();
	textSize(35);
	stroke(0);
	fill(255);
	strokeWeight(1);
	textAlign(CENTER);
	text("Game Over", width / 2, -30 + height / 2);
	textSize(15);
	text("Press any key to restart", width / 2, 10 + height / 2);
	pop();
}
function gameWinScreen() {
	push();
	textSize(35);
	stroke(0);
	fill(255);
	strokeWeight(1);
	textAlign(CENTER);
	text("You Win!", width / 2, -30 + height / 2);
	textSize(15);
	text("Press any key to restart", width / 2, 10 + height / 2);
	pop();
	for (i in gameOverDots) gameOverDots[i].tick(); // draw the dots for the game win screen here
}
function drawPlayer() {
	let x = 50;
	let y = 30;
	stroke(0);
	rectMode(CENTER);
	translate(x, y);
	fill(200, 100, 20);
	rect(-4, 10, 3, 9);
	rect(4, 10, 3, 9);
	rect(0, 0, 15, 20, 3);
	fill(255);
	noStroke();
	ellipse(-4, -3, 3, 5);
	ellipse(4, -3, 3, 5);
	fill(0);
	arc(0, 2, 9, 9, 0, PI);
	ellipse(-3, -3, 2, 4);
	ellipse(4.5, -3, 2, 4.2);
	playertex = get(41, 19, 18, 27); // get the player texture from the canvas and store it in the texture
}
function drawPlat() {
	push();
	translate(200, 200);
	rectMode(CENTER);
	let h = 5;
	let w = 65;
	fill(170, 10, 10);
	noStroke();
	rect(0, 0, w, h);
	translate(-15, h);
	push();
	rotate(radians(45));
	rect(0, 0, 15, 2);
	rotate(radians(-90));
	rect(0, 0, 15, 2);
	pop();

	translate(15, 0);
	push();
	rotate(radians(45));
	rect(0, 0, 15, 2);
	rotate(radians(-90));
	rect(0, 0, 15, 2);
	pop();
	translate(15, 0);
	push();
	rotate(radians(45));
	rect(0, 0, 15, 2);
	rotate(radians(-90));
	rect(0, 0, 15, 2);
	pop();
	translate(-15, h);
	rect(0, 0, w, h / 1.1);
	pop();
	plattex = get(200 - w / 2, 198, w, h * 3);
}
function drawBar() {
	let colorF = [100, 60, 10];
	push();
	rectMode(CENTER);
	fill(colorF);
	stroke(230, 100, 30);
	strokeWeight(4);
	circle(20, 20, 20);
	noStroke();
	fill(20, 20, 200);
	rect(20, 20, 14, 3);
	pop();
	bartex = get(6, 6, 28, 28);
}
function draw() {
	background(0);
	if ((gameOver || gameWin) && keyArray[32]) return setup(); // restart the game if space is pressed while the game is over
	if (showTitle) return titleScreen(); // show the title screen if the game hasn't started yet
	if (gameOver) return gameOverScreen(); // show the game over screen if the game is over
	if (gameWin) return gameWinScreen(); // show the game win screen if the game is won

	for (i in p) p[i].tick(); // draw the platforms
	for (i in b) b[i].tick(); // draw the barrels
	player.tick(); // draw the player

	for (i in b) {
		// check if the player is touching a barrel and end the game if they are
		if (dist(b[i].x, b[i].y, player.x, player.y) < 22) return (gameOver = true);
	}

	// end the game if the player falls off the screen or goes off
	if (player.y >= height || player.x < 0 || player.x > width) gameOver = true;
	// end the game if the player touches the top platform (the win platform)
	if (rectIntersect(player, p[0])) gameWin = true;
	// add a new barrel every 2 seconds
	if (frameCount % 120 == 0) b.push(new Barrel(25, -10));

	fill(lava); // draw the lava
	rectMode(CORNER);
	rect(0, height - 20, width, 20);
	if (frameCount % 10 == 0) lava = color(200, random(100, 200), random(0, 50), 200); // randomize the color of the lava every 10 frames
}
var lava;
var keyArray = [];
var p = [];
var b = [];
var gameOverDots = [];
var player;
var plattex;
var playertex;
var bartex;
var showTitle = true;
var gameOver = false;
var gameWin = false;
var tilemap = [
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "p", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "p", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "p", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "p", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "p", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "p", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "p", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "p", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "c", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "p", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
]; // the tilemap for the platforms
class Platform {
	constructor(x, y, i) {
		this.x = x;
		this.y = y;
		this.dir = i % 2 == 1 ? 0.3 : -0.3; // the direction the platform is moving
		this.startX = x; // the starting x position of the platform
		this.limit = 10; // the distance the platform can move
		this.w = 50;
		this.h = 15;
	}
	tick() {
		this.move(); // move the platform
		this.show(); // draw the platform
	}
	show() {
		push();
		translate(this.x, this.y);
		image(plattex, -this.w / 2, 0, this.w, this.h);
		pop();
	}
	move() {
		this.x += this.dir;
		if (Math.abs(this.x - this.startX) >= this.limit) {
			this.dir *= -1; // reverse the direction of the platform if it has reached its limit
		}
	}
}
class Barrel {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 23;
		this.h = 23;
		this.r = 15; // the radius of the barrel

		this.v = 2; // the velocity of the barrel (how fast it falls)
		this.g = 0.4; // the gravity of the barrel (how fast it accelerates)
		this.xVel = 1.8; // the horizontal velocity of the barrel
		this.wind = 0.005; // the wind speed
		this.angle = 0; // the angle of the barrel (used for rotation)
	}
	tick() {
		this.move();
		this.show();
	}
	show() {
		if (this.x > width + 100) return; // don't draw the barrel if it is off screen
		push();
		fill(255);
		translate(this.x + this.w / 4, this.y + this.h / 4);
		rotate(this.angle); // rotate the barrel by the angle
		image(bartex, -this.w / 2, -this.h / 2, this.w, this.h); // draw the barrel
		pop();
	}
	move() {
		this.xVel += this.wind; // add the wind to the horizontal velocity
		this.x += this.xVel; // add the horizontal velocity to the x position
		this.v += this.g; // add the gravity to the vertical velocity
		this.y += this.v; // add the vertical velocity to the y position
		this.angle += 0.1; // increase the angle of the barrel
		for (i in p) {
			if (rectIntersect(this, p[i])) {
				// if the barrel intersects with a platform
				this.v *= -0.6; // reverse the vertical velocity
			}
			while (rectIntersect(this, p[i])) {
				// while the barrel is intersecting with a platform
				this.y -= 0.01; // move the barrel up by 0.01 pixels (this is to prevent the barrel from getting stuck in the platform)
			}
		}
	}
}
class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 15;
		this.h = 20;
		this.v = createVector(0, 0); // the velocity of the player
		this.gravity = createVector(0, 0.8); // the gravity of the player
		this.onGround = false; // check when the player is touching the platform
		this.accel = 0; // the acceleration of the player
		this.angle = 0; // the angle of the player (used for jump animation)
	}
	tick() {
		this.move();
		this.show();
	}
	show() {
		push();
		translate(this.x, this.y);
		rectMode(CENTER);
		rotate(this.angle);
		if (!this.onGround) this.angle += 0.25; // rotate the player if they are in the air
		else this.angle = 0; // reset the angle if the player is on the ground
		image(playertex, -this.w / 2, -this.h / 2, this.w, this.h);
		pop();
	}
	move() {
		this.v.y = constrain(this.v.y + this.gravity.y, -8, 8); // add the gravity to the vertical velocity and constrain it to -8 and 8
		for (let i = 0; i < p.length; i++) {
			if (rectIntersect(this, p[i])) {
				// if the player is touching the platform stop the player from falling through the platform
				this.onGround = true;
				this.jump();
				this.v.x = p[i].dir;
				this.y = p[i].y - this.h / 2;
			}
		}
		// if the right arrow or d key is pressed move right
		if (keyArray[39] || keyArray[68]) this.v.x += 1;

		// if the left arrow or a key is pressed move left
		if (keyArray[37] || keyArray[65]) this.v.x -= 1;

		this.v.x = constrain(this.v.x, -2, 2); // constrain the horizontal velocity to -2 and 2
		this.v.y = constrain(this.v.y + this.accel, -9999, 8);
		this.x += this.v.x;
		this.y += this.v.y;
		this.accel = 0; // reset the acceleration to 0
	}
	jump() {
		this.v.y = 0;
		// if the space bar or up arrow or w key is pressed jump up
		if (keyArray[32] || keyArray[38] || keyArray[87]) {
			this.accel = -35; // add a negative acceleration to the player
			this.onGround = false; // set the onGround variable to false
			keyArray[32] = 0;
			keyArray[38] = 0; // reset the space bar and up arrow keys to 0 so the player can't jump again until they release the key
			keyArray[87] = 0;
		}
	}
}
function rectIntersect(a, b) {
	// check if two rectangles are intersecting
	if (a.x >= b.x + b.w / 2 || b.x - b.w / 2 >= a.x + a.w / 2) return false;
	if (a.y >= b.y + b.h / 2 || b.y - b.h / 2 >= a.y + a.h / 2) return false;
	return true;
}

class particle {
	// particle class taken from my proj 0
	constructor(g) {
		this.x = random(width);
		this.y = random(height);
		this.r = g * 3;
		this.g = g;
		this.color = [random(255), random(255), random(255), random(80, 160)];
	}
	tick() {
		this.update();
		this.show();
	}
	show() {
		//this function will draw the particle on the screen with its color
		fill(this.color);
		ellipse(this.x, this.y, this.r, this.r);
	}
	update() {
		//this function will update the particles position and reset the color
		// and the y position when it reaches the bottom.
		// the new x and y are always random to avoid having the same
		// effect over and over. this will make the content more dynamic
		this.y = this.y + this.g;
		if (this.y > height) {
			this.y = random(-3);
			this.x = random(width);
		}
	}
}
function circleRect(x, y, w, h, cx, cy, r) {
	// circle rect collision detection
	let testX = cx;
	let testY = cy;

	if (cx < x) testX = x;
	else if (cx > x + w) testX = x + w;
	if (cy < y) testY = y;
	else if (cy > y + h) testY = y + h;

	let distX = cx - testX;
	let distY = cy - testY;
	let distance = Math.sqrt(distX * distX + distY * distY);
	return distance <= r;
}
