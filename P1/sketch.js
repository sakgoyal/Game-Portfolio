/*
 * ECE4525 - Video Game Design
 * Author: Saksham Goyal
 * Project 1 - Invader Pong
 * Date       : 9/9/2022
 * Description: 
 * This is a sketch that uses the p5.js library to create a game called Invader Pong.
 * The game is a combination of the classic game Pong and the classic game Space Invaders.
 * The player controls a paddle at the bottom of the screen and must bounce a ball off of it.
 * The player must also avoid the bombs that the invaders drop.
 * The player can also shoot the invaders to destroy them.
 * The game ends when the player kills all of the invaders or when the ball hits the bottom of the screen
 * or when the player is hit by a bomb.
 * The game is won when the player kills all of the invaders.
 */

class ball {
	constructor() {
		this.x      = random(100, 300);                                             // random position in a range
		this.y      = random(200, 300);
		this.color  = [random(180), random(180), random(180)];                      // random color
		this.dir    = p5.Vector.fromAngle(random(PI / 6, (5 * PI) / 6)).mult(1.6);  // random direction but only upwards
		this.dir.y *= -1;                                                           // make sure it goes upwards
		this.d      = 3;                                                            // diameter
		this.r      = this.d / 2;                                                   // radius
	}
	update() {
		if (this.y + this.r > height) {
			// if it hits the bottom of the screen then game over
			gameOver = true;
			reason   = "ball touch the bottom";
		}
		if (this.x + this.d * 2 > width || this.x - this.d * 2 < 0) {
			// if it hits the side of the screen then bounce
			this.dir.x *= -1;
		}
		if (this.y - this.d * 2 < 0) {
			// if it hits the top of the screen then bounce
			this.dir.y *= -1;
		}
		// move the ball
		this.x += this.dir.x;
		this.y += this.dir.y;
		push();
		stroke(this.color);
		strokeWeight(10);
		noFill();
		// draw the ball
		circle(this.x, this.y, this.d);
		pop();
	}
	bulletCollide(bullet) {
		if (!bullet.fire) return; // if the bullet is not fired then return
		let DeltaX = this.x - max(bullet.x, min(this.x, bullet.x + bullet.w));         // get the x distance between the bullet and the ball
		let DeltaY = this.y - max(bullet.y, min(this.y, bullet.y + bullet.h));         // get the y distance between the bullet and the ball
		let result = DeltaX * DeltaX + DeltaY * DeltaY < (this.d / 2) * (this.d / 2);  // check if the distance is less than the radius of the ball
		if (result) console.log("ball collide with bullet, spawning new");
		return result; // return the result
	}
	paddleCollide(paddle) {
		if (this.y + this.d < height - paddle.h) {
			// if the ball is too high, then ignore
			return;
		}
		if (this.x + this.d > paddle.x && this.x - this.d < paddle.x + paddle.w) {
			// if the ball is in the paddle's x range then bounce
			// we know that the ball is in the paddle's y range because of the previous if statement
			this.dir.y = -abs(this.dir.y);
		}
	}
	bombCollide(bomb) {
		if (dist(this.x, this.y, bomb.x, bomb.y) < this.d / 2 + bomb.d / 2) {
			// if the distance between the ball and the bomb is less than the sum of the radius of the ball and the bomb then collide
			bomb.dropped = 0;
			console.log("ball collide with bomb");
		}
	}
	invaderCollide(invader) {
		// check if the ball collides with the invader
		let x      = invader.x + invader.w / 2;
		let y      = invader.y + invader.h / 2;
		let DeltaX = this.x - max(invader.x, min(this.x, invader.x + invader.w));      // get the x distance between the invader and the ball
		let DeltaY = this.y - max(invader.y, min(this.y, invader.y + invader.h));      // get the y distance between the invader and the ball
		let result = DeltaX * DeltaX + DeltaY * DeltaY < (this.d / 2) * (this.d / 2);  // check if the distance is less than the radius of the ball
		if (!result) return; // if it doesn't collide then return
		// check which side of the invader the ball collided with
		// only do 1 bounce so there is no need to check all 4 sides
		if (this.y < y) {
			// if the ball is above the invader then bounce
			this.dir.y = -abs(this.dir.y);
		} else if (this.y > y) {
			// if the ball is below the invader then game over
			this.dir.y = abs(this.dir.y);
		} else if (this.x < x) {
			// if the ball is to the left of the invader then bounce
			this.dir.x = -abs(this.dir.x);
		} else if (this.x > x) {
			// if the ball is to the right of the invader then bounce
			this.dir.x = abs(this.dir.x);
		}
	}
}
class invaderObj {
	constructor(x, y) {
		this.x      = x;
		this.y      = y;
		this.dead   = 0;                    // 0 = alive, 1 = dead
		this.bomb   = 0;                    // 0 = no bomb, 1 = bomb
		this.h      = 14;                   // height
		this.w      = 14;                   // width
		this.imgpos = int(random(4)) * 70;  // random image from the spritesheet
	}
	draw() {
		image(spritesheet, this.x, this.y, this.w, this.h, 0, this.imgpos, spritesheet.width, 47); // draw the invader from the spritesheet using the random image
		// draw the invader hitbox
		// push();
		// noFill();
		// stroke(255);
		// strokeWeight(1);
		// rect(this.x, this.y, this.w, this.h);
		// pop();
	}
	move() {
		// move the invader left and right with the global speed
		this.x += globalInvDir;
		if (this.x < 6 || this.x > 394) {
			globalInvDir *= -1;            // if the invader hits the side of the screen then change the direction
			this.x       += globalInvDir;  // restore its position
			// now bring all invaders down a bit
			lowerAllInvaders();
			if (this.y > 340) {
				// if the invader is too low then game over
				gameOver = true;
				reason   = "invaders touch the bottom";
			}
		}
	}
}
class gunObj {
	constructor(x) {
		this.x     = x;
		this.y     = 390;
		this.w     = 20;
		this.h     = 20;
		this.clamp = (num, min, max) => Math.min(Math.max(num, min), max);  // clamp function to keep the gun in the screen
	}
	draw() {
		fill(255, 0, 0);
		rect(this.x - 10, this.y, this.w, this.h);
		rect(this.x - 2, 380, 4, 20);
	}
	move() {
		this.x += (keyArray[RIGHT_ARROW] === 1 || keyArray[68] === 1) - (keyArray[LEFT_ARROW] === 1 || keyArray[65] === 1);  // move the gun left and right with the arrow keys or a and d keys
		this.x  = this.clamp(this.x, 10, 390);                                                                               // clamp the gun in the screen
	}
}
class bulletObj {
	constructor() {
		this.x    = 0;
		this.y    = 0;
		this.w    = 2;
		this.h    = 6;
		this.fire = 0;  // 0 = not fired, 1 = fired
	}
	draw() {
		fill(255, 0, 0);
		ellipse(this.x, this.y, this.w, this.h);
		this.y -= 5;  // move the bullet up
		if (this.y < 0) {
			// if the bullet is too high then reset it
			this.fire = 0;
		}
		for (var i = 0; i < invaders.length; i++) {
			// check if the bullet collides with an invader
			// if it does then kill the invader and reset the bullet
			if (invaders[i].dead === 0 && dist(this.x, this.y, invaders[i].x, invaders[i].y) < 10) {
				invaders[i].dead = 1;
				deadCount++;
				this.fire = 0;
			}
		}
	}
}
class bombObj {
	constructor() {
		this.x       = 0;
		this.y       = 0;
		this.d       = 3;
		this.dropped = 0;  // 0 = not dropped, 1 = dropped
	}
	draw() {
		fill(43, 21, 21);
		circle(this.x, this.y, this.d);
		this.y++; // move the bomb down
		if (this.y > 400) {
			// if the bomb is too low then reset it
			this.dropped = 0;
		}
		if (this.y > 390) {
			// check if the bomb collides with the gun
			if (this.x > gun.x - 10 && this.x < gun.x + 10) {
				// if it does then game over
				gameOver = true;
				reason   = "invaders touch the bottom";
			}
		}
	}
}
var gameOver = false;
var gameWin  = false;
var gun;
var bullets;
var invaders       = [];
var keyArray       = [];
var bombs          = [];
var reason         = "";
var deadCount      = 0;
var globalInvDir   = 1;
var currFrameCount = 0;
var bulletIndex    = 0;
var spritesheet;
var ballin;

function lowerAllInvaders() {
	// bring all invaders down a bit when they hit the side of the screen
	for (var i = 0; i < invaders.length; i++) {
		invaders[i].y += 5;
	}
}
function keyPressed() {
	// add the key to the key array when it is pressed
	keyArray[keyCode] = 1;
}
function keyReleased() {
	// remove the key from the key array when it is released
	keyArray[keyCode] = 0;
}
function checkFire() {
	if (keyArray[32] === 1) {
		// if the space bar is pressed
		if (currFrameCount < frameCount - 10) {
			// if the frame count is greater than 10 frames ago
			                        currFrameCount    = frameCount;  // set the current frame count to the current frame count
			                bullets[bulletIndex].fire = 1;           // fire the bullet
			                bullets[bulletIndex].x    = gun.x;       // set the bullet x position to the gun x position
			                bullets[bulletIndex].y    = 380;         // set the bullet y position to the gun y position
			bulletIndex++; // increment the bullet index
			if (bulletIndex > 4) {
				bulletIndex = 0;  // if the bullet index is greater than 4 then reset it
			}
		}
	}
}
function setup() {
	createCanvas(400, 400);
	ballin  = new ball();                                                                             // create the ball
	gun     = new gunObj(200);                                                                        // create the gun
	bullets = [new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj()];  // create the bullets
	// initialize space invaders
	var a = 100;
	var b = 20;
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 10; j++) {
			invaders.push(new invaderObj(a, b));
			bombs.push(new bombObj());
			a += 20;
		}
		a  = 100;
		b += 20;
	}
}
function preload() {
	spritesheet = loadImage("sheet.png");  // load the spritesheet
}
function draw() {
	// if the initial screen is not displayed then draw the game
	background(0, 255, 217);
	if (gameOver) {
		// if the game is over then display the game over screen

		background(0);
		fill(255, 0, 0);
		textSize(40);
		text("Game Over", 100, 200);
		// text(reason, 100, 300);
		return;
	}
	if (gameWin) {
		// if the game is won then display the game won screen

		background(0, 255, 0);
		fill(255, 0, 0);
		textSize(40);
		text("You Win!", 100, 200);
		return;
	}
	gameWin = deadCount == invaders.length; // if all invaders are dead then the game is won
	ballin.update(); // update the ball position and direction
	for (var i = 0; i < invaders.length; i++) {
		if (invaders[i].dead === 0) {
			// if the invader is alive
			invaders[i].draw(); // draw the invader
			invaders[i].move(); // move the invader
			if (bombs[i].dropped === 1) {
				// if the bomb is dropped
				bombs[i].draw(); // draw the bomb
				ballin.bombCollide(bombs[i]); // check if the ball collides with the bomb
			} else {
				// if the bomb is not dropped
				if (random(0, 10000) < 2) {
					// 0.02% chance of dropping the bomb per frame
					bombs[i].dropped = 1; // drop the bomb
					bombs[i].x = invaders[i].x; // set the bomb x position to the invader x position
					bombs[i].y = invaders[i].y + 5; // set the bomb y position to the invader y position
				}
			}
			ballin.invaderCollide(invaders[i]); // check if the ball collides with the invader
		}
	}
	gun.draw(); // draw the gun
	gun.move(); // move the gun
	ballin.paddleCollide(gun); // check if the ball collides with the gun
	checkFire(); // check if the space bar is pressed to fire a bullet
	for (i = 0; i < 5; i++) {
		// draw the bullets
		if (bullets[i].fire === 1) {
			// if the bullet is fired
			bullets[i].draw(); // draw the bullet
		}
	}
	for (let i = 0; i < bullets.length; i++) {
		// check if the bullets collide with the invader
		if (ballin.bulletCollide(bullets[i])) {
			// if the bullet collides with the invader
			ballin = new ball(); // create a new ball
		}
	}
}
