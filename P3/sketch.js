p5.disableFriendlyErrors = true; // disables FES to increase performance
function keyPressed() {
	keyArray[keyCode] = 1;
	if (key === " " && !title && !gameOver && !gameWin) {
		//if spacebar is pressed and the game is not over, shoot a bullet
		bul = new bulletclass(player.x + 10, player.y + 10, radians(playerAngle));
	}
}
function keyReleased() {
	keyArray[keyCode] = 0;
}
function setup() {
	createCanvas(400, 400);
	stroke(0);
	strokeWeight(1);
	background(0, 0, 0, 0);
	rocks = [];
	prizes = [];
	enemies = [];
	trail = [];
	translateX = 0;
	translateY = 0;
	playerAngle = 0;
	for (let i = 0; i < 42; i++) {
		for (let j = 0; j < 42; j++) {
			if (map2[j][i] === " ") grass.push(new gclass(i * 20, j * 20)); //if the tile is empty, add a grass tile
			else if (map2[j][i] === "c") player = new cclass(i * 20, j * 20); //player
			else if (map2[j][i] === "r") rocks.push(new rclass(i * 20, j * 20)); //rock
			else if (map2[j][i] === "p") prizes.push(new pclass(i * 20, j * 20)); //prize
			else if (map2[j][i] === "e") enemies.push(new eclass(i * 20, j * 20)); //enemy
		}
	}
	initPlayer(); //initialize the player texture
	translate(3, 25);
	initRock(); //initialize the rock texture
	initBullet(); //initialize the bullet texture
	translate(0, 25);
	initEnemy(); //initialize the enemy texture
}
function initPlayer() {
	push();
	background(100, 140, 0, 0); //draw background color (green)
	fill(103, 140, 199);
	rect(0, 0, 20, 20); // main hull
	noStroke();
	for (let i = 0; i < 7; i++) {
		i % 2 == 0 ? fill(0) : fill(81, 81, 81);
		rect(0, i * 3, 4, 4); // left and right side of wheels
		rect(20 - 4, i * 3, 4, 4);
	}
	stroke(0);
	fill(50, 100, 200);
	rect(20 * 0.45, -20 / 2, 20 / 10, 15, 3); // gun
	rect(20 / 3, 5, 20 / 3, 10, 2); // top hull
	pop();
	playertex = get(0, 0, 20, 20);
}
function initRock() {
	push();
	stroke(0);
	fill(80);
	strokeWeight(2);
	let w = 16;
	arc(w / 2, 7, w, 20 / 1.5, PI, 0);
	line(0, 7, 0, 20);
	line(w, 7, w, 20);
	line(0, 20, w, 20);
	noStroke();
	rect(1, 6, w - 2, 14);
	fill(60);
	rect(2, 12, w - 4, 2);
	rect(2, 16, w - 4, 2);
	rocktex = get(2, 23, 20, 25);
	pop();
}
function initBullet() {
	push();
	let w = 15; //the width of the bullet
	let h = 10; //the height of the bullet
	translate(10, 80);
	rotate(this.dir);
	fill(75);
	beginShape();
	vertex(0, h / 4);
	vertex(w / 2, h / 4);
	vertex(w, 0);
	vertex(w / 2, -h / 4);
	vertex(0, -h / 4);
	vertex(w / 6, 0);
	endShape(CLOSE);
	bullettex = get(11, 101, 18, 8);
	pop();
}
function initEnemy() {
	push();
	stroke(0);
	fill(200, 40, 40);
	circle(10, 10, 20);
	fill(200, 200, 200);
	noStroke();
	let eyex = 14;
	ellipse(eyex, 6, 5, 6);
	ellipse(eyex, 14, 5, 6);
	fill(0);
	ellipse(eyex, 6, 4, 3);
	ellipse(eyex, 14, 4, 3);
	pop();
	enemytex = get(2, 49, 22, 22); // get the texture for the enemy when full health
	push();
	translate(20, 20);
	stroke(0);
	fill(150, 40, 40);
	circle(10, 10, 12);
	fill(200, 200, 200);
	noStroke();
	ellipse(eyex, 6, 5, 6);
	ellipse(eyex, 14, 5, 6);
	fill(0);
	ellipse(eyex, 6, 4, 3);
	ellipse(eyex, 14, 4, 3);
	pop();
	enemytex2 = get(20, 70, 20, 20); // get the texture for the enemy when half health
}
function gameOverScreen() {
	text("Game Over", 100, 200); //display game over text at the center of the screen
	if (keyArray[32] === 1) {
		//if spacebar is pressed restart the game
		gameOver = false;
		setup();
	}
}
function gameWinScreen() {
	winRotate -= 0.05; //rotate the win text
	push();
	textAlign(CENTER);
	textSize(32);
	translate(width / 2, height / 2); //move to the center of the screen, so the text is centered and rotate the text around the center
	rotate(winRotate);
	text("You Win!", 0, 0); //display the win text

	if (keyArray[32] === 1) {
		//if spacebar is pressed restart the game
		gameWin = false;
		setup();
	}
	pop();
}
function showTitle() {
	push();
	background(0);
	textSize(32);
	fill(255);
	textAlign(CENTER);
	text("Shooty Shooty", width / 2, height / 2 - 80); //display the title
	text("Bang Bang", width / 2, height / 2 - 40); //display the title 2
	textSize(16);
	text("Press Space to Start", width / 2, height / 2);
	textSize(12);
	text("Controls:", width / 2, height / 2 + 50); // show the controls
	text("WASD or Arrow Keys to move", width / 2, height / 2 + 70);
	text("Space to shoot", width / 2, height / 2 + 90);
	if (keyArray[32] === 1) title = false; //if spacebar is pressed, start the game
	pop();
}
function handletrails() {
	// create a trail of lines behind the player that fades out over time
	for (let i = 0; i < trail.length; i++) {
		push();
		translate(translateX + trail[i].x, translateY + trail[i].y);
		rotate(radians(trail[i].angle));
		stroke(0, 0, 0, i * 5);
		line(0, 0, trail[i].x - trail[i].x2, trail[i].y - trail[i].y2);
		pop();
	}
	// add the current position of the player to the trail
	trail.push({
		x: player.x + player.w / 2,
		y: player.y + player.h / 2,
		x2: player.x,
		y2: player.y + player.h / 2,
		angle: playerAngle,
	});
	if (trail.length > 30) trail.shift(); // remove the oldest line in the trail if there are more than 50 lines
}
function showWall() {
	push(); //draw the walls of the map
	translate(translateX + 20, translateY + 20);
	line(0, 0, 760, 0); //top wall
	line(0, 0, 0, 800); //left wall
	line(760, 0, 760, 800); //right wall
	line(0, 800, 760, 800); //bottom wall
	pop();
}
function showPrizeleft() {
	noStroke();
	textSize(20);
	fill(0);
	text("Prizes Left: " + prizes.length, 10, 20); //display the number of prizes left on the screen
}
function draw() {
	background(100, 140, 0);
	if (title) return showTitle(); //if the title screen is active, show the title screen
	if (gameOver) return gameOverScreen(); //if the game is over, show the game over screen
	if (gameWin) return gameWinScreen(); //if the game is won, show the game win screen

	for (let i = 0; i < grass.length; i++) grass[i].show(); // draw all the grass tiles (ONLY ENABLE THIS IF YOUR COMPUTER IS FAST ENOUGH, OTHERWISE IT WILL BE SLOW)
	playermove(); //move the player
	for (let i = 0; i < enemies.length; i++) {
		//move all the enemies
		enemies[i].move();
		enemies[i].show();
		if (rectIntersect(player, enemies[i])) gameOver = true;
	}
	for (var pri of prizes) pri.show();
	for (var roc of rocks) roc.show();
	stroke(0);
	showWall(); //draw the walls of the map
	player.show(); //draw the player
	if (ex) ex.show(); //draw the explosion if it exists
	if (bul) bul.show(); //draw the bullet if it exists
	showPrizeleft();
}
var title = true; //if the title screen is active
var winRotate = 0; //the rotation of the win text
var playerAngle = 0; //the angle of the player
var keyArray = [];
var translateX = 0; //the x position of the camera
var translateY = 0; //the y position of the camera
var enemies = [];
var rocks = [];
var prizes = [];
var grass = [];
var trail = [];
var player;
var playertex; //the texture of the player
var enemytex; //the texture of the enemy
var enemytex2; //the texture of the enemy when it has half health
var bullettex; //the texture of the bullet
var rocktex; //the texture of the rock
var gameOver = false; //if the game is over
var gameWin = false; //if the game is won
var ex; //the explosion
var bul; //the bullet
const enemyspeed = 1.6;
const playerspeed = 2;
const map2 = [
	"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
	"wp           r     r                   w",
	"w                            r         w",
	"w   r     r        e              p    w",
	"w                  rr            r     w",
	"w         a                            w",
	"w     r   p                            w",
	"w                                      w",
	"w                               p      w",
	"w        r        r                    w",
	"w         c       r       r      r     w",
	"w    r            r                    w",
	"w                       p           r  w",
	"w          r             r             w",
	"w                    a            e    w",
	"w       p                      r   p   w",
	"w   e                                  w",
	"w            r    r       p            w",
	"w                                 r    w",
	"w        p                             w",
	"w                r                     w",
	"w                        r     p       w",
	"w  p              r r                  w",
	"w          r      r p e                w",
	"w                                  r   w",
	"w             r             r          w",
	"w     r p                              w",
	"w                r                     w",
	"w                       r              w",
	"w           r           p         r    w",
	"w     p                           r    w",
	"w               a     r                w",
	"w                                      w",
	"w                                      w",
	"w      rr   p    r          r          w",
	"w                             p        w",
	"w                                   r  w",
	"w       r       r r  p                 w",
	"w   e   p                   e          w",
	"w            r         r      p     r  w",
	"w                                      w",
	"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
];
function distSquared(x1, y1, x2, y2) {
	let dx = x2 - x1;
	let dy = y2 - y1;
	return dx * dx + dy * dy; //calculate the distance between two points without sqrt (faster)
}
function playermove() {
	let forward;
	if (keyArray[87] === 1 || keyArray[UP_ARROW] === 1) forward = 1; //if W or up arrow is pressed, move forward
	else if (keyArray[83] === 1 || keyArray[DOWN_ARROW] === 1) forward = -1; //if S or down arrow is pressed, move backward
	keyArray[65] === 1 || keyArray[LEFT_ARROW] ? (playerAngle -= 3) : playerAngle;
	keyArray[68] === 1 || keyArray[RIGHT_ARROW] ? (playerAngle += 3) : playerAngle;
	if (forward) {
		movePlayer(cos(radians(playerAngle)) * playerspeed * forward, 0); //move the player horizontally
		movePlayer(0, sin(radians(playerAngle)) * playerspeed * forward); //move the player vertically
	}
	handletrails(); //draw the trail
}
function rectIntersect(r1, r2) {
	//check if two rectangles intersect (used to check collisions)
	if (r1.x >= r2.x + r2.w || r2.x >= r1.x + r1.w) return false; // no horizontal overlap
	if (r1.y >= r2.y + r2.h || r2.y >= r1.y + r1.h) return false; // no vertical overlap
	return true; // if the above statements are not true, there is an overlap
}
function movePlayer(x, y) {
	const newPos = { x: player.x + x, y: player.y + y, w: 20, h: 20 }; //get the location of the intended move
	for (let i = 0; i < rocks.length; i++) {
		if (rectIntersect(newPos, rocks[i])) {
			player.x -= 2 * x; // make the player bounce back if they hit a rock
			player.y -= 2 * y;
			return;
		}
	}
	for (let i = 0; i < prizes.length; i++) {
		//check if the player collides with a prize
		if (rectIntersect(newPos, prizes[i])) {
			prizes.splice(i, 1); //remove the prize from the array
			i--;
			gameWin = prizes.length === 0; //check if the player has won the game (if there are no prizes left)
		}
	}
	player.x = constrain(newPos.x, 20, 760); //constrain the player's position to the map
	player.y = constrain(newPos.y, 20, 800);

	const cameraMargin = 150;
	if (player.x + translateX < cameraMargin) translateX++; //move the camera if the player is close to the edge of the screen
	else if (player.x + translateX > width - cameraMargin) translateX--;
	if (player.y + translateY < cameraMargin) translateY++;
	else if (player.y + translateY > height - cameraMargin) translateY--;
}
class pclass {
	// prize class
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 20;
		this.h = 20;
		this.color = [random(30, 110), random(60, 190), random(80, 255)]; //randomize the color of the prize
		this.img;
	}
	show() {
		//draw the prize
		push();
		fill(this.color);
		stroke(0);
		strokeWeight(1);
		translate(translateX + this.x + 10, translateY + this.y + 10);
		circle(0, 0, 10);
		pop();
	}
}
class cclass {
	// character class
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 20;
		this.h = 20;
	}
	show() {
		push();
		translate(translateX + this.x + this.w / 2, translateY + this.y + this.h / 2); //move the camera
		rotate(radians(playerAngle + 90)); //rotate the player to face the direction they are moving
		image(playertex, -this.w / 2, -this.h / 2);
		pop();
	}
}
class eclass {
	// enemy class
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 20;
		this.h = 20;
		this.wanderFrames = 3 * frameRate; //how many frames the enemy should wander for in seconds
		this.direction = p5.Vector.fromAngle(0); //the direction the enemy should wander in or chase the player in
		this.range = 100;
		this.health = 2;
		this.avoid = false; //whether the enemy should avoid the bullet
	}
	show() {
		push();
		translate(translateX + this.x + this.w / 2, translateY + this.y + this.h / 2); //move the camera
		rotate(this.direction.heading()); //rotate the enemy to face the direction they are moving
		translate(-this.w / 2, -this.h / 2);
		if (this.health === 2) image(enemytex, 0, 0); //draw the enemy based on their health
		else image(enemytex2, 0, 0);
		pop();
	}
	move() {
		if (this.avoidBullet()) return; //if the enemy should avoid the bullet, do so and exit the function
		if (distSquared(this.x, this.y, player.x, player.y) > this.range ** 2) return this.wander(); // wander if the player is far away, and exit the function
		this.chasePlayer(); // chase the player if they are close enough
	}
	wander() {
		if (this.wanderFrames > 0) {
			//if the enemy should still be wandering
			this.wanderFrames--;
			for (let i = 0; i < rocks.length; i++) {
				if (rectIntersect(this, rocks[i])) {
					//check if the enemy collides with a rock
					this.x -= 4 * this.direction.x;
					this.y -= 4 * this.direction.y;
					this.wanderFrames = random(60, 120);
					this.direction = p5.Vector.random2D().mult(0.2 * enemyspeed);
					return;
				}
			}
			this.x = constrain(this.x + this.direction.x, 20, 760);
			this.y = constrain(this.y + this.direction.y, 20, 800);
		} else {
			this.wanderFrames = random(60, 120); //randomize the amount of frames the enemy should wander for
			this.direction = p5.Vector.random2D().mult(0.2 * enemyspeed);
		}
	}
	avoidBullet() {
		if (bul && bul.showB) {
			//if the bullet is active
			let a = bul.start;
			let b = bul.end;
			let p = createVector(this.x, this.y);
			let op = eclass.orthogonalProjection(a, b, p); //get the orthogonal projection of the bullet on the enemy
			let d = p5.Vector.dist(p, op);
			let avoiddir = createVector(this.x - op.x, this.y - op.y)
				.normalize()
				.mult(enemyspeed); //get the direction the enemy should move to avoid the bullet
			if (d < 100 && dist(bul.x, bul.y, this.x, this.y) < 100) {
				this.avoid = true;
				this.x = constrain(this.x + avoiddir.x, 20, 760);
				this.y = constrain(this.y + avoiddir.y, 20, 800);
				for (let i = 0; i < rocks.length; i++) {
					if (rectIntersect(this, rocks[i])) {
						this.x -= 4 * avoiddir.x;
						this.y -= 4 * avoiddir.y;
						return;
					}
				}
				this.direction = avoiddir;
				return true;
			} else this.avoid = false; //if the bullet is not close enough to the enemy, stop avoiding it
		} else this.avoid = false;
		return false; //return whether the enemy is avoiding the bullet
	}
	chasePlayer() {
		let xdist = Math.abs(this.x - player.x);
		let ydist = Math.abs(this.y - player.y);
		this.direction = p5.Vector.fromAngle(atan2(player.y - this.y, player.x - this.x)).mult(enemyspeed);
		if (xdist > ydist) this.x += this.direction.x;
		else this.y += this.direction.y;
		for (let i = 0; i < rocks.length; i++) {
			//check if the enemy collides with a rock
			if (rectIntersect(this, rocks[i])) {
				this.x -= 4 * this.direction.x;
				this.y -= 4 * this.direction.y;
				return;
			}
		}
	}
	static orthogonalProjection(a, b, p) {
		//get the orthogonal projection of a point on a line
		// find nearest point along a LINE
		let d1 = p5.Vector.sub(b, a).normalize();
		let d2 = p5.Vector.sub(p, a);
		d1.mult(d2.dot(d1));
		return p5.Vector.add(a, d1);
	}
}
class rclass {
	// rock class
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 20;
		this.h = 20;
	}
	show() {
		push();
		translate(translateX, translateY);
		image(rocktex, this.x, this.y, 20, 20); //draw the rock
		pop();
	}
}
class explosionclass {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.colorS = [255, 30, 30, 255];
		this.colorF = [255, 255, 0, 255];
	}
	show() {
		if (this.colorS[3] < 1) return; //if the explosion is invisible, stop drawing it
		push();
		stroke(this.colorS);
		fill(this.colorF);
		translate(translateX + this.x, translateY + this.y);
		beginShape();
		for (let i = 0; i < 50; i++) {
			//draw the explosion as a bunch of random points
			let v;
			if (i % 2 == 0) v = createVector(random(-10, 10), random(-10, 10));
			else v = createVector(random(-15, 15), random(-15, 15));
			vertex(v.x, v.y);
		}
		endShape(CLOSE);
		pop();
		this.colorS[3] -= 10; //make the explosion fade out over time
		this.colorS[0] -= 1; // make the explosion's stroke color fade out over time
		this.colorF[0] -= 10;
		this.colorF[1] -= 10;
		this.colorF[3] -= 10;
	}
}
class bulletclass {
	constructor(x, y, dir) {
		this.dir = dir;
		this.x = x;
		this.y = y;
		this.direction = p5.Vector.fromAngle(this.dir).mult(5); //the direction the bullet should move in
		this.start = createVector(this.x, this.y); //the position the bullet was created at
		this.end = createVector(this.x + 260 * this.direction.x, this.y + 260 * this.direction.y); //the position the bullet should stop at
		this.w = 15; //the width of the bullet
		this.h = 10; //the height of the bullet
		this.showB = true; //whether or not the bullet should be shown
	}
	show() {
		if (!this.showB) return; //if the bullet should not be shown, stop drawing it
		push();
		translate(translateX + this.x, translateY + this.y);
		rotate(this.dir);
		image(bullettex, 0, 0, 18, 9);
		this.x += this.direction.x; //move the bullet
		this.y += this.direction.y;
		pop();
		for (let i = 0; i < rocks.length; i++) {
			if (rectIntersect(this, rocks[i])) {
				//check if the bullet collides with a rock
				rocks.splice(i, 1); //remove the rock
				ex = new explosionclass(this.x, this.y); //create an explosion
				this.showB = false;
				return;
			}
		}
		for (let i = 0; i < enemies.length; i++) {
			if (rectIntersect(this, enemies[i])) {
				//check if the bullet collides with an enemy
				enemies[i].health--; //decrease the enemy's health
				if (enemies[i].health <= 0) enemies.splice(i, 1); //if the enemy's health is 0 or less, remove it
				ex = new explosionclass(this.x, this.y); //create an explosion
				this.showB = false;
				return;
			}
		}
	}
}
class gclass {
	// background grass class (for the background)
	constructor(x, y) {
		this.x = x;
		this.y = y;
		//the color of the grass (the alpha value is randomized so that the grass looks more natural)
		this.color = [random(80, 120), random(120, 160), random(0), random(0, 80)];
	}
	show() {
		push();
		translate(translateX, translateY);
		fill(this.color);
		rect(this.x, this.y, 20, 20);
		pop();
	}
}