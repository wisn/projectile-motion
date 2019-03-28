/*!--------------------
 * World building
 */
// Using canvas to makes life easier. Makes sure that your browser support canvas
const canvas = document.createElement('canvas');
canvas.style.border = '1px solid #222';
canvas.style.display = 'block';
canvas.style.margin = '24px auto';
canvas.id = 'canvas';
// Define context, in this case it is two dimensional drawing
const context = canvas.getContext('2d');
canvas.height = 420;
canvas.width = window.innerWidth - 50;
// Define body, applying DRY
const body = document.body;
// Add canvas to the body
body.appendChild(canvas);
// Get the height and the width of the canvas
const height = canvas.height;
const width = canvas.width;

/*!------------------
 * Some important initial variables
 */
// Determine that whether the drawing function is runable
let runable = true;
// Determine the base point
const base = { x: 50, y: 40 };
// Determine the object position
const position = { x: 0.0, y: 0.0 };
// Determine the object's radius
const radius = 3;
// Determine the initial velocity
let initialVelocity = 20.0;
// Determine the gravity
const gravity = -9.81;
// Determine the current consumed time
let time = 0.0;
// Determine the total time motion will consumes
let totalTime = -2.0 * initialVelocity / gravity;
// Determine the timer, for animation
let timer;
// Current angle and theta
let angle = 45.0;
let theta = angle * Math.PI / 180.0;
// Determine the current index
let index = -1;
// Determine the initial velocity of (x, y)
let initialVelocityX = initialVelocity * Math.cos(theta);
let initialVelocityY = initialVelocity * Math.sin(theta);
// Determine the max height
let maxHeight = -initialVelocityY * initialVelocityY / (2.0 * gravity);

/*!------------------
 * A collection of functions
 */
// Vertical grid lines drawer
function drawVerticalGridLine() {
  for (let i = 0; i <= (width / 40) - 2; i++) {
    context.beginPath();
    context.moveTo(base.x + 40 * i, base.y);
    context.lineTo(base.x + 40 * i, base.y + (height - 140));
    context.stroke();
    context.font = '12pt Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const axisValue = 10 * i;
    const axisLabel = axisValue.toFixed(0);
    context.fillText(axisLabel, base.x + 40 * i, base.y + (height - 120));
  }
}
// Horizontal grid lines drawer
function drawHorizontalGridLine() {
  for (let i = 0; i <= (height / 40) - 3; i++) {
    context.beginPath();
    context.moveTo(base.x - 10, base.y + 40 * i);
    context.lineTo(base.x + (width - 100), base.y + 40 * i);
    context.stroke();
    context.font = '12pt Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const axisValue = 10 * (Math.floor((height / 40) - 3) - i);
    const axisLabel = axisValue.toFixed(0);
    context.fillText(axisLabel, base.x - 24, base.y + 40 * i);
  }
}
// X-Axis arrow drawer
function drawXAxisArrow() {
  context.strokeStyle = '#222';
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(base.x - 10, base.y + (height - 140));
  context.lineTo(base.x + (width - 100), base.y + (height - 140));
  context.stroke();
  context.moveTo(base.x + (width - 110), base.y + (height - 146));
  context.lineTo(base.x + (width - 100), base.y + (height - 140));
  context.lineTo(base.x + (width - 110), base.y + (height - 134));
  context.lineJoin = 'miter';
  context.stroke();
  context.font = '10pt Arial';
  context.fillStyle = 'black';
  context.textAlign = 'left';
  context.fillText('x (m)', base.x + (width - 90), base.y + (height - 140));
}
// Y-Axis arrow drawer
function drawYAxisArrow() {
  context.strokeStyle = '#222';
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(base.x, base.y - 20);
  context.lineTo(base.x, base.y + (height - 140));
  context.stroke();
  context.moveTo(base.x - 6, base.y - 10);
  context.lineTo(base.x, base.y - 20);
  context.lineTo(base.x + 6, base.y - 10);
  context.lineJoin = 'miter';
  context.stroke();
  context.font = '10pt Arial';
  context.fillStyle = 'black';
  context.textAlign = 'left';
  context.fillText('y (m)', base.x - 10, base.y - 32);
}
// Current theta drawer
function drawCurrentTheta() {
  const thetaLabel = `θ = ${theta.toFixed(2)}`;
  context.font = '14pt Arial';
  context.textAlign = 'left';
  context.fillText(thetaLabel, base.x, base.y + (height - 75));
}
// Consumed time label drawer
function drawTimeLabel() {
  const timeLabel = `t = ${time.toFixed(2)}s`;
  context.font = '14pt Arial';
  context.textAlign = 'left';
  context.fillText(timeLabel, base.x + 120, base.y + (height - 75));
}
// Total time label drawer
function drawTotalTimeLabel() {
  const timeLabel = `total_time = ${totalTime.toFixed(2)}s`;
  context.font = '14pt Arial';
  context.textAlign ='left';
  context.fillText(timeLabel, base.x + 260, base.y + (height - 75));
}
// Gravity label drawer
function drawGravityLabel() {
  const gravityLabel = `g = ${gravity.toFixed(2)}m/s^2`;
  context.font = '14pt Arial';
  context.textAlign = 'left';
  context.fillText(gravityLabel, base.x + 480, base.y + (height - 75));
}
// Maximum height label drawer
function drawMaxHeightLabel() {
  const maxHeightLabel = `max_height = ${maxHeight.toFixed(2)}m`;
  context.font = '14pt Arial';
  context.textAlign = 'left';
  context.fillText(maxHeightLabel, base.x + 650, base.y + (height - 75));
}
// Position label drawer
function drawPositionLabel() {
  const positionLabel = `position(x, y) = (${position.x.toFixed(2)}m, ${position.y.toFixed(2)}m)`;
  context.font = '14ptArial';
  context.textAlign = 'left';
  context.fillText(positionLabel, base.x + 860, base.y + (height - 75));
}
// Graph motion drawer
function drawGraphLine() {
  context.strokeStyle = '#0000ff';
  context.beginPath();
  context.moveTo(base.x, base.y + (height - 140));
  for (let i = 1; i <= index; i++) {
    context.lineTo(base.x + 4.0 * initialVelocityX * i / 20.0, (base.y + (height - 140)) - 4.0 * initialVelocityY * (i / 20.0) -4.0 * 0.5 * gravity * (i /20.0) * (i / 20.0));
  }
  context.stroke();

  context.beginPath();
  context.arc(base.x + 4.0 * initialVelocityX * index / 20.0, (base.y + (height - 140)) - 4.0 * initialVelocityY * (index / 20.0) - 4.0 * 0.5 * gravity * (index / 20.0) * (index / 20.0), radius, 0, 2 * Math.PI, false);
  context.fillStyle = '#0000ff';
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = '#000';
  context.stroke();
  context.fillStyle = '#000';
}
// Main function for drawing the motion graph
function drawMotionGraph() {
  if (position.y < 0.0 || time == totalTime) {
    runable = false;
  }

  if (runable) {
    context.clearRect(0, 0, width, height);
    index++;

    context.fillStyle = '#efefef';
    context.fillRect(base.x, base.y, width - 110, height - 140);

    context.strokeStyle = '#999';
    context.lineWidth = 2;

    drawVerticalGridLine();
    drawHorizontalGridLine();

    drawXAxisArrow();
    drawYAxisArrow();

    drawGraphLine();

    time = index / 20.0;
    position.y = initialVelocityY * time + 0.5 * gravity * time * time;
    if (position.y < 0.0) {
      time = totalTime;
      position.y = 0.0;
    }

    position.x = initialVelocityX * time;

    drawCurrentTheta();
    drawTimeLabel();
    drawTotalTimeLabel();
    drawGravityLabel();
    drawMaxHeightLabel();
    drawPositionLabel();
  }
}
// Main function for running the motion, which is where the looping happens
function runMotion() {
  drawMotionGraph();

  if (runable) {
    timer = window.setTimeout(runMotion, 1000/30); // 30fps
  }
}

drawMotionGraph();

/*!------------------
 * A collection of player functions
 */
// Play the motion simulation
function playMotion() {
  window.clearTimeout(timer);
  runable = true;
  runMotion();
}
// Pause the motion simulation
function pauseMotion() {
  window.clearTimeout(timer);
  runable = false;
}
// Step the motion simulation forward (works while paused)
function stepForward() {
  window.clearTimeout(timer);
  runable = true;
  drawMotionGraph();
}
// Step the motion simulation backward (works while paused)
function stepBackward() {
  window.clearTimeout(timer);

  index -= 2;
  if (index < -1) index = -1;

  time = index / 20.0;
  position.x = base.x;
  runable = true;

  drawMotionGraph();
}
// Reset the motion simulation
function resetMotion() {
  window.clearTimeout(timer);
  index = -1;
  time = 0.0;
  position.x = base.x;
  runable = true;

  drawMotionGraph();
}
// Set the initial velocity
function setInitialVelocity() {
  const display = document.getElementById('initial-velocity');
  const newValue = document.getElementById('velocity-input').value;
  display.innerHTML = newValue;
  index = 0;
  initialVelocity = newValue;
  initialVelocityX = newValue * Math.cos(theta);
  initialVelocityY = newValue * Math.sin(theta);
  totalTime = -2.0 * initialVelocityY / gravity;
  maxHeight = -initialVelocityY * initialVelocityY / (2.0 * gravity);
  resetMotion();
}
// Set the initial angle
function setInitialAngle() {
  const display = document.getElementById('initial-angle');
  const newValue = document.getElementById('angle-input').value;
  display.innerHTML = newValue;
  index = 0;
  angle = newValue;
  theta = angle * Math.PI / 180.0;
  initialVelocityX = initialVelocity * Math.cos(theta);
  initialVelocityY = initialVelocity * Math.sin(theta);
  totalTime = -2.0 * initialVelocity / gravity;
  maxHeight = -initialVelocityY * initialVelocityY / (2.0 * gravity);
  resetMotion();
}

/*!------------------
 * Adding the initial value manipulator to the world
 */
// Add the manipulator wrapper
const manipulator = document.createElement('div');
manipulator.align = 'center';
// Add the initial value of velocity manipulator
manipulator.append(document.createTextNode('Initial velocity:'));
manipulator.append(document.createElement('br'));
manipulator.append(document.createTextNode('20'));

const velocityInput = document.createElement('input');
velocityInput.type = 'range';
velocityInput.min = 20;
velocityInput.max = 35;
velocityInput.step = 1;
velocityInput.style.width = '200px';
velocityInput.value = 20;
velocityInput.id = 'velocity-input';
velocityInput.oninput = setInitialVelocity;
velocityInput.onchange = setInitialVelocity;

manipulator.append(velocityInput);
manipulator.append(document.createTextNode('35'));
manipulator.append(document.createElement('br'));

const initialVelocityVal = document.createElement('div');
initialVelocityVal.id = 'initial-velocity';
initialVelocityVal.innerHTML = 20;
manipulator.append(initialVelocityVal);
manipulator.append(document.createElement('br'));
// Add the initial angle manipulator
manipulator.append(document.createTextNode('Initial angle:'));
manipulator.append(document.createElement('br'));
manipulator.append(document.createTextNode('0'));

const angleInput = document.createElement('input');
angleInput.type = 'range';
angleInput.min = 0;
angleInput.max = 90;
angleInput.step = 1;
angleInput.style.width = '200px';
angleInput.value = 45;
angleInput.id = 'angle-input';
angleInput.oninput = setInitialAngle;
angleInput.onchange = setInitialAngle;

manipulator.append(angleInput);
manipulator.append(document.createTextNode('90'));
manipulator.append(document.createElement('br'));

const initialAngleVal = document.createElement('div');
initialAngleVal.id = 'initial-angle';
initialAngleVal.innerHTML = 45;
manipulator.append(initialAngleVal);
manipulator.append(document.createElement('br'));

body.append(manipulator);
/*!------------------
 * Adding the media player to the world
 */
// Player media wrapper
const player = document.createElement('div');
player.align = 'center';
// Step backward button
const backwardButton = document.createElement('button');
backwardButton.append(document.createTextNode('<< Backward'));
backwardButton.style.margin = '0px 4px';
backwardButton.onclick = stepBackward;
player.append(backwardButton);
// Play media button
const playButton = document.createElement('button');
playButton.append(document.createTextNode('Play'));
playButton.style.margin = '0px 4px';
playButton.onclick = playMotion;
player.append(playButton);
// Pause media button
const pauseButton = document.createElement('button');
pauseButton.append(document.createTextNode('Pause'));
pauseButton.style.margin = '0px 4px';
pauseButton.onclick = pauseMotion;
player.append(pauseButton);
// Step forward button
const forwardButton = document.createElement('button');
forwardButton.append(document.createTextNode('Forward >>'));
forwardButton.style.margin = '0px 4px';
forwardButton.onclick = stepForward;
player.append(forwardButton);
// Adding space
player.append(document.createElement('div'));
// Reset media button
const resetButton = document.createElement('button');
resetButton.append(document.createTextNode('Reset'));
resetButton.style.margin = '4px 4px';
resetButton.onclick = resetMotion;
player.append(resetButton);
// Adds the whole buttons to the world
body.append(player);

