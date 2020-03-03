const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let counter = document.getElementById('txt');
const button1 = document.getElementById('btn1');
const button2 = document.getElementById('btn2');
let timer = document.getElementById('timer')


const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// Shape Constructor

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;

}

// Ball Constructor

function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;

}
// EvilCircle Constructor

function EvilCircle(x, y, velX, velY, exists) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = 'white';
  this.size = 10;
}

//gets Ball() to inherit the methods defined on the Shape()'s prototype
Ball.prototype = Object.create(Shape.prototype);

Object.defineProperty(Ball.prototype, 'constructor', {
  value: Ball,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

//gets EvilCircle to inherit the methods defined on the Shape Prototype
EvilCircle.prototype = Object.create(Shape.prototype);

Object.defineProperty(EvilCircle.prototype, 'constructor', {
  value: EvilCircle,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

// Evil Circle Methods 

EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}

EvilCircle.prototype.checkBounds = function () {
  if ((this.x + this.size) >= width) {
    this.x = 0 + this.size + 1;
  }

  if ((this.x - this.size) <= 0) {
    this.x = width - this.size - 1
  }

  if ((this.y + this.size) >= height) {
    this.y = 0 + this.size + 1;
  }

  if ((this.y - this.size) <= 0) {
    this.y = height - this.size - 1
  }
}

EvilCircle.prototype.setControls = function () {
  let _this = this;
  window.onkeydown = function (e) {
    if (e.key === 'a') {
      _this.x -= _this.velX;
    } else if (e.key === 'd') {
      _this.x += _this.velX;
    } else if (e.key === 'w') {
      _this.y -= _this.velY;
    } else if (e.key === 's') {
      _this.y += _this.velY;
    }
  }
}

EvilCircle.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (balls[j].exists == true) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.size + balls[j].size) {
        //changes color when balls collide
        //   balls[j].color = this.color = 'rgb(' + random(50, 255) + ',' + random(50, 255) + ',' + random(50,100) +')';
        //changes ball size when balls collide
        balls[j].exists = false
      }
    }
  }
}

//Ball methods

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Ball.prototype.update = function () {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

Ball.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        //changes color when balls collide
        //   balls[j].color = this.color = 'rgb(' + random(50, 255) + ',' + random(50, 255) + ',' + random(50,100) +')';
        //changes ball size when balls collide
        balls[j].size = random(10, 40)
      }
    }
  }
}

let balls = [];

while (balls.length < 10) {
  let size = random(20, 40);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    exists = true,
    'rgb(' + random(50, 255) + ',' + random(50, 255) + ',' + random(50, 255) + ')',
    size
  );

  balls.push(ball);
}

let Evil = new EvilCircle(width / 2, height / 2, 30, 30, true, 'white', 10);

ctx.fillStyle = 'rgba(0, 0, 0, .25)';
ctx.fillRect(0, 0, width, height);

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, .25)';
  ctx.fillRect(0, 0, width, height);

  Evil.draw();
  Evil.checkBounds();
  Evil.setControls();
  Evil.collisionDetect();
  let con = balls.length


  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists == true) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
    if (balls[i].exists == false) {
      con -= 1;
    }
  }

  if (con === 0) {
    clearInterval(finale)
  }  

  counter.innerHTML = `Ball count: ${con}`;
  requestAnimationFrame(loop);
}



let sec = 0;
let minutes = 0;

function time() {
  sec = sec + 1
  minutes = minutes + Math.floor(sec / 60)
  if (sec > 59) {
    sec = sec - minutes * 60;
  }
  timer.innerHTML = "Timer: " + ("0" + minutes).slice(-2) + ":" + ("0" + sec).slice(-2)
}

let finale;

function start() {
  finale = setInterval(time, 1000);
  loop();
}


button1.onclick = start;

