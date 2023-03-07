function setup() {
	createCanvas(700, 400);
	let yoff = 200;
	for (let x = 0; x <= width; x += numGroundPoints) {
	  y.push([x, yoff + noise(x * noiseScale, noiseScale) * 150]);
	} // create the randomized terrain as a set of x and y coordinates
	y.splice(0, 0, [-y[0][0], y[0][1]]); // insert the first item again
	y.push([y[y.length - 1][0] + numGroundPoints, y[y.length - 1][1]]);
	// duplicate the last elements
	y.push([y[y.length - 1][0] + numGroundPoints, y[y.length - 1][1]]);
	player = new tank(300, 0); // initialize the player
	enemies.push(new tank(600, enemies.length + 1)); // add 1st enemy + id
	enemies.push(new tank(300, enemies.length + 1)); // add 2nd enemy + id
  }
  function preload() {
	redhull = loadImage("assets/redHull.png");
	redrail = loadImage("assets/redRail2.png");
	bluehull = loadImage("assets/blueHull.png");
	bluerail = loadImage("assets/blueRail2.png");
	keyPrompts = {
	  a0: loadImage("assets/a0.png"), // import all of the images / assets
	  a1: loadImage("assets/a1.png"),
	  d0: loadImage("assets/d0.png"),
	  d1: loadImage("assets/d1.png"),
	  left0: loadImage("assets/left0.png"),
	  left1: loadImage("assets/left1.png"),
	  right0: loadImage("assets/right0.png"),
	  right1: loadImage("assets/right1.png"),
	  mouse0: loadImage("assets/mouse0.png"),
	  mouse1: loadImage("assets/mouse1.png"),
	  mouse2: loadImage("assets/mouse2.png"),
	  wheel: loadImage("assets/wheel.png"),
	};
  }
  let redhull, bluehull;
  let redrail, bluerail;
  let y = []; // list of all the coordinates for the terrain
  let noiseScale = 0.02; // change how the terrain is generated
  let keyArray = [];
  let numGroundPoints = 20; // distance between each point on the terrain
  let start = true,
	sInst = false,
	sGO = false,
	sGW = false;
  let player;
  let keyPrompts = {}; // for all of the instructions screen images
  let instructionsInvertColor = 1;
  let enemies = [],
	bullets = [];
  let titleSize = 0,
	turn = 0;
  let fireShot = false;
  function drawLevel() {
	push();
	fill(0, 235, 0); // use green ground color
	beginShape();
	for (let i = 0; i < y.length; i++) {
	  curveVertex(y[i][0], y[i][1]);
	  // use curves to create smooth perlin noise based terrain
	  ellipse(y[i][0], y[i][1], 2, 2); // for debugging
	}
	vertex(width, height); // make sure ends of screen work properly
	vertex(0, height);
	vertex(0, y[0][1]);
	endShape();
	fill(50);
	pop();
  }
  function draw() {
	background(20);
	showBorder(); // show bounce ball borders
	drawLevel(); // draw the ground
	player.show(); // show the player on the screen
	if (start) showtitleScreen();
	if (sInst && start) showInstructions();
	if(sGO) showGameOver();
	if (keyArray[68] === 1) player.x++; // move the player based on keyboard
	if (keyArray[65] === 1) player.x--;
	if (start) player.x++;
	// automatically move player on the start to create an animation
	if (player.x >= width + 20) player.x = 20;
	// reset the player position when it leaves screen
	if (player.x < 20) player.x = width + 19;
	if (!start) {
	  // if the game has begun, show an enemy at the other side of the map
	  for (var e of enemies) e.show();
	}
	for (let i = 0; i < bullets.length; i++) {
	  bullets[i].tick();
	  if (bullets[i].pos.y > bullets[i].pY) {
		// check collision with tanks
		if (dist(bullets[i].pos.x, bullets[i].pos.y, player.pX, player.pY) < 15) 
		  player.health -= 20;
		bullets.splice(i, 1);
	  } // remove bullets that are off screen
	}
	bullets = bullets.filter((bul) => bul.pos.y < height); // remove offscreen edge cases
	if (player.health <= 0){
	  sGO = true;
	}
  }
  function keyPressed() {
	keyArray[keyCode] = 1;
  }
  function keyReleased() {
	keyArray[keyCode] = 0;
  }
  
  class tank {
	constructor(x, turnNum) {
	  this.x = x;
	  this.w = 0;
	  this.h = 0;
	  this.difficulty = 0; // sets the enemy difficulty
	  this.fuel = 0; // fuel to set max movement distance per turn
	  this.health = 90;
	  this.turnN = turnNum; // id of tank
	  this.fire = false;
	}
	show() {
	  let FP = int(this.x / numGroundPoints); // closest point on the left
	  let step = (this.x % numGroundPoints) / numGroundPoints; // position between left/right points
	  // get the exact point on curve where the player is
	  this.pX = curvePoint(
		y[FP - 1][0],
		y[FP][0],
		y[FP + 1][0],
		y[FP + 2][0],
		step
	  );
	  this.pY = curvePoint(
		y[FP - 1][1],
		y[FP][1],
		y[FP + 1][1],
		y[FP + 2][1],
		step
	  );
	  let pX2 = curvePoint(
		y[FP - 1][0],
		y[FP][0], // get slightly ahead of player to get slope of terrain at player position
		y[FP + 1][0],
		y[FP + 2][0],
		step + 0.1
	  );
	  let pY2 = curvePoint(
		y[FP - 1][1],
		y[FP][1],
		y[FP + 1][1],
		y[FP + 2][1],
		step + 0.1
	  );
	  this.slope = atan((pY2 - this.pY) / (pX2 - this.pX)); // get slope for tank rotation
	  this.slope2 = atan2(mouseY - this.pY, mouseX - this.pX) - this.slope; // get slope for tank gun rotation
	  let hullColor = this.turnN ? redhull : bluehull; // tank alligiance
	  let railColor = this.turnN ? redrail : bluerail;
	  push();
	  translate(this.pX, this.pY);
	  strokeWeight(1);
	  fill(200, 0, 0); // show player health bar
	  rect(-15, -25, 30, 5);
	  fill(0, 200, 0);
	  rect(-15, -25, this.health / 3.333, 5);
	  rotate(this.slope); // draw the tank at correct location
	  image(hullColor, -17, -14, 35, 18);
	  translate(0, -8);
	  rotate(this.slope2 - PI / 4); // draw the gun pointing to mouse
	  image(railColor, 0, 0, 15, 15);
	  rotate(PI / 4);
	  if (start == false && this.turnN == turn) {
		let tra = 255;
		noStroke();
		let d = dist(this.pX, this.pY, mouseX, mouseY) - 10;
		for (let i = 25; i < d; i += 10) {
		  fill(255, 255, 255, tra); // show aim trajectory fade
		  circle(i, 0, 5);
		  tra -= 20;
		}
	  }
	  pop();
	}
	shoot() {
	  let d = constrain((dist(this.pX, this.pY, mouseX, mouseY) - 10) / 20, 0, 7);
	  bullets.push(new bullet(this.pX, this.pY - 9, d, this));
	  // create bullet
	}
  }
  class bullet {
	constructor(x, y, p, owner) {
	  let ang = p5.Vector.fromAngle(-owner.slope2 - owner.slope);
	  this.pos = createVector(x, y);
	  this.vel = createVector(p * ang.x, -p * ang.y);
	  this.own = owner; // set where the bullet came from
	  this.g = 0.1; // set gravity
	}
	tick() {
	  this.vel.y += this.g;
	  this.pos.add(this.vel); // update projectile motion
	  push();
	  fill(255);
	  circle(this.pos.x, this.pos.y, 10); // show
	  let t = this.test(); // lower ground when collide
	  // if(t) {} // create explosion animation
	  pop();
	}
	test() {
	  this.FP = int(this.pos.x / numGroundPoints);
	  // closest point on the right
	  if (this.FP < 1 || this.FP > 33) {
		this.vel.x *= -1; // bounce in side walls
		this.pos.add(this.vel);
		this.FP = int(this.pos.x / numGroundPoints);
	  }
	  let step = (this.pos.x % numGroundPoints) / numGroundPoints;
	  // position between 2 points
	  // console.log(this.FP);
	  try {
		this.pX = curvePoint(
		  y[this.FP - 1][0], // get the point on the terrain curve where the player is currently
		  y[this.FP][0],
		  y[this.FP + 1][0],
		  y[this.FP + 2][0],
		  step
		);
		this.pY = curvePoint(
		  y[this.FP][1],
		  y[this.FP + 1][1],
		  y[this.FP + 2][1],
		  y[this.FP + 3][1],
		  step
		);
	  } catch (e) {}
  
	  if (this.pos.y > this.pY) {
		try {
		  // try lowering the wall catch on wall edge case
		  y[this.FP - 1][1] = min(y[this.FP - 1][1] + 10, height - 20);
		  y[this.FP][1] = min(y[this.FP][1] + 15, height - 20);
		  y[this.FP + 1][1] = min(y[this.FP + 1][1] + 15, height - 20);
		  y[this.FP + 2][1] = min(y[this.FP + 2][1] + 10, height - 20);
		  return true;
		} catch (error) {}
	  }
	}
  }
  function showBorder() {
	push();
	fill(255, 0, 255);
	noStroke();
	// if bullet is close to side wall, show bounce pad
	if (bullets.filter((b) => b.pos.x < 100 && b.vel.x < 0).length > 0)
	  rect(0, 0, 5, height);
	if (bullets.filter((b) => b.pos.x > width - 100 && b.vel.x > 0).length > 0)
	  rect(width - 5, 0, 5, height);
	pop();
  }
  function showtitleScreen() {
	push();
	translate(width / 2, -90 + height / 2);
	fill(255);
	textAlign(CENTER);
	textSize(50);
	// display the name of the game
	textSize(titleSize);
	if (!sInst && titleSize > 5) {
	  text("Tank", -117, 0);
	  text("Destroyer", 60, 0); // create enlarging text animation for the title screen
	}
	titleSize = constrain(titleSize + 1, 0, 50);
	textSize(20);
  
	fill(255);
	rect(-100, 25, 200, 40); // have a rectangle that shows the instructions when the mouse is clicks on it
	fill(0);
	text("Start", 0, 50);
	fill(255);
	rect(-100, 70, 200, 40); // have a rectangle that starts the game when the mouse is clicks on it
	text("By: Saksham Goyal", -255, -90);
	fill(0);
	text("Instructions", 0, 95);
	pop();
  }
  function showInstructions() {
	push();
	translate(width / 2, height / 2);
	rectMode(CENTER);
	fill(0, 0, 0, 220);
	rect(0, 0, 400, 300, 10);
	textAlign(CENTER);
	fill(255);
	textSize(40);
	text("Instructions", 0, -90);
	textSize(10);
	// text("Use A and D or arrow keys to move your tank", 0, -50);
	// text("You must wait for your turn after you shoot", 0, 70);
	// text("Use the mouse to aim and shoot", 0, 90);
	// text("Destroy all the tanks to win", 0, 110);
	// text("You are the blue tank", 0, 130);
	// text("The red tanks are the enemy", 0, 150);
	// text("Use the scroll wheel to change your weapon", 0, 170);
  
	// display the key prompts images on the screen in the correct positions and sizes based on the keyPrompts object
	instructionsInvertColor = frameCount % 60 < 30 ? 1 : 0;
	fill(100);
	translate(-180, -70);
	rect(40, 50, 100, 100, 10); // 0, 0
	rect(40, 160, 100, 100, 10); // 0, 1
	rect(320, 50, 100, 100, 10); // 1, 0
	rect(320, 160, 100, 100, 10); // 1, 1
	image(
	  keyPrompts.mouse0,
	  20 + 15 * sin(frameCount / 30),
	  140 + 15 * cos(frameCount / 30),
	  40,
	  40
	);
	fill(255);
	text(" or ", 40, 50);
	if (instructionsInvertColor === 1) {
	  image(keyPrompts.a0, 0, 0, 40, 40);
	  image(keyPrompts.d1, 40, 0, 40, 40);
	  image(keyPrompts.left0, 0, 50, 40, 40);
	  image(keyPrompts.right1, 40, 50, 40, 40);
	  image(keyPrompts.mouse0, 300, 140, 40, 40);
	} else {
	  image(keyPrompts.a1, 0, 0, 40, 40);
	  image(keyPrompts.d0, 40, 0, 40, 40);
	  image(keyPrompts.left1, 0, 50, 40, 40);
	  image(keyPrompts.right0, 40, 50, 40, 40);
	  image(keyPrompts.mouse1, 300, 140, 40, 40);
	}
	pop();
  }
  function showGameOver() {
	push();
	translate(width / 2, height / 2);
	rectMode(CENTER);
	fill(0, 0, 0, 220);
	rect(0, 0, 400, 300, 10);
	textAlign(CENTER);
	fill(255);
	textSize(40);
	text("Game Over", 0, -90);
	textSize(10);
	pop();

  }
 function showGameWin() {}
  function mouseClicked() {
	if (!start) {
	  // when the game has begun
	  if (turn == 0) player.shoot();
	  // shot based on whoever's turn it is
	  else enemies[turn - 1].shoot();
	  turn++; // change the turn
	  if (turn == enemies.length + 1) turn = 0; //loop through player turns
	  return;
	}
	if (mouseX > 200 && mouseX < 400 && mouseY > 125 && mouseY < 165) {
	  start = false; // start the game
	  player.x = 100;
	}
	if (sInst) sInst = false;
	else if (mouseX > 200 && mouseX < 400 && mouseY > 170 && mouseY < 210)
	  sInst = true;
  }
  function getRange(v, ang, iH) {
	let x1 = v ** 2 * (sin(ang) * sin(ang)) + 2 * 0.1 * iH;
	let sq = Math.sqrt(x1);
	sq += v * sin(ang);
	sq *= v * cos(ang);
	sq /= 0.1;
	return sq;
  }
  function getAngle(v, dist, iH) {
	if (getRange(1, radians(45), iH) < dist) return; // if its not possible to hit
  }
  