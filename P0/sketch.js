/* 
 * ECE4525 - Video Game Design
 * Author: Saksham Goyal
 * Project 0 - Logo Animation
 * Date: 08/25/2022
 * Description:
 * This is a sketch that uses the p5.js library to animate my initials
 * floating around my screen in a sin wave pattern
 *
 * The design process first started with my initials static on the screen
 * to add creativity, I added background particles to add flair which would 
 * fall with gravity. I then added colors to the particles and randomized
 * them to ensure its not repetitive. 
 * Then I made the initials bounce across the canvas, but because it wasnt 
 * creative enough, I thought I would emulate a game and have the initials
 * fly across the screen in an animated loop.
 */
// this class is for creating my initials on the screen and 
// handling its movement
class initial {
  constructor() {
    //this function will create the default values for the initials 
    // as the starting position
    this.x = 120;
    this.y = 200;
  }
  update() {
    //this function is used so that the animation can know what y position
    // to put the initials at so that it oscillates in the sin wave
    this.y = 200 + posit(frameCount / 60);
  }
  show() {
    //the rotate function is so that the letter get a small tilt in the
    // dircetion of movement to make it look more fluid and realistic
    rotate(cos(frameCount / 60)/30);
    
    // draw the letter "S"
    arc(this.x, this.y - 10, 20, 20, PI / 2, -0.5);
    arc(this.x, this.y + 10, 20, 20, PI + PI / 2, PI - 0.5);
    
    // draw the letter "G"
    arc(this.x + 35, this.y, 30, 40, PI / 5, 1.6 * PI);
    line(this.x + 40, this.y + 5, this.x + 55, this.y + 5);
    line(this.x + 48, this.y + 6, this.x + 48, this.y + 20);
    
    //put the rotation back to normal since it affects globally
    rotate(-cos(frameCount / 60)/30);
  }
}
//this class is for the background particle effect to create an ambiance
// instead of a plain background to make it more interesting and creative
class particle {
  constructor(g) {
    // the constructor will take in a value that it will use for 
    // the gravitational effect that the particle will receive. 
    // the radius is dynamically chosen based on the gravity to give
    // an effect where there are multiple layers of particles
    // and it looks like some are close and some are far away
    // the color is also chosen at random to make the canvas more colorful
    
    // the x and y positions are chsen at random to give the 
    // initial positions so it doesnt all start in the same place
    this.x = random(width);
    this.y = random(height);
    this.r = g * 3;
    this.g = g;
    this.color = [random(255), random(255), random(255), random(80, 160)];
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
//this class is for the pipes that the initials will be flying through. 
class pipe {
  constructor() {
    //this will set the default position and colors for the pipes.
    //it will also use the same function as the initials to generate
    // the y position of the gap, but since the pipes are scrolling
    // statically, the sine function is used several pixels in the 
    // "future", so that it lines up with the initials when they come
    // close to each other
    this.x = 350;
    this.y = 200 + posit(frameCount / 60 - 350);
    this.color = [random(100, 200), random(100, 200), random(100, 200)];
  }
  show() {
    //draw the pipes with the random color
    fill(this.color);
    rect(this.x, 0, 50, this.y - 50);
    rect(this.x, this.y + 50, 50, height);
  }
  update() {
    //move the pipes to the left and reset their position when
    // they leave the screen with a new color and new gap position
    //corresponding to the time when it lines up
    this.x -= 3;
    if (this.x < -50) {
      this.x = width + 50;
      this.y = 200 + posit(frameCount / 60 - 350);
      this.color = [random(100, 200), random(100, 200), random(100, 200)];
    }
  }
}
//create the array to store the particles in,
//create the object for the initials on the screen
//create the array for the pipes
var dots = [];
var myInitial;
var pipes = [];
function setup() {
  createCanvas(400, 400);
  myInitial = new initial();
  for (let i = 0; i < 30; i++) {
    dots.push(new particle(random(0.2, 2.6)));
  }
  pipes.push(new pipe());
  pipes.push(new pipe());
  pipes[1].x = 600;
  pipes[1].y = 200 + posit(frameCount / 60 - PI * PI);
}
function draw() {
  background(220);
  noStroke();
  
  for (let i = 0; i < dots.length; i++) {
    dots[i].show();
    dots[i].update();
  }
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
    pipes[i].update();
  }
  noFill();
  stroke(0);
  strokeWeight(2);
  myInitial.update();
  myInitial.show();
  noStroke();
  textSize(18);
  fill(10);
  text("Saksham Goyal", 270, 390);
}
function posit(x) {
  return 100 * sin(x);
}