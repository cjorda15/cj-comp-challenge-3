/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var World = __webpack_require__(1);
	var canvas = document.getElementById('game');
	var ctx = canvas.getContext('2d');
	var world = new World(canvas.width, canvas.height);
	var playBtn = document.getElementById('play-btn');

	document.body.onkeyup = function (e) {
	  console.log(e.keyCode);
	};

	document.body.onkeyup = function (e) {
	  if (e.keyCode == 32) {
	    ballStart();
	  }
	};

	playBtn.addEventListener('click', function () {
	  ballStart();
	});

	function ballStart() {
	  if (world.lives === 0) {
	    world.score = 0;
	    world.lives = 3;
	    world.level = 0;

	    for (let i = 0; i < 24; i++) {
	      world.brick[i].hit = false;
	    }
	  }
	  if (world.ball.xx === 0) {
	    world.ball.xx = 3;
	    world.ball.yy = -3;
	  }
	}

	canvas.addEventListener('mousemove', function (e) {
	  var mouseX = e.offsetX;
	  world.paddle.draw(ctx, mouseX);
	});

	requestAnimationFrame(function gameLoop() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  world.paddle.draw(ctx);
	  world.ball.draw(ctx);
	  world.bounceLeft();
	  world.bounceRight();
	  world.bounceMiddle();
	  world.brickHitLeft();
	  world.brickHitRight();
	  world.brickHitMid();

	  for (var i = 0; i < world.brick.length; i++) {
	    if (world.brick[i].hit === false) {
	      world.brick[i].draw(ctx);
	      world.loseLife();
	      var score = document.getElementById('score').innerHTML = world.score;
	      var lives = document.getElementById('lives').innerHTML = world.lives;
	      world.gameOver();
	    }
	  }
	  world.loseLife();
	  world.gameOver();
	  world.levelUp();
	  world.prepareLaunch();
	  requestAnimationFrame(gameLoop);
	});
	//if world.ball x and y are the same as world. paddle x and y then bounce

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Paddle = __webpack_require__(2);
	var Ball = __webpack_require__(3);
	var Brick = __webpack_require__(4);

	function World(width, height) {
	  this.lives = 3;
	  this.level = 0;
	  this.score = 0;
	  this.width = width;
	  this.height = height;
	  this.paddle = new Paddle({ x: 212, y: 450, width: 75, height: 10 });
	  this.ball = new Ball({ x: this.paddle.x + 25, y: 445, radius: 7, startCircle: 0, endCircle: 2 * Math.PI, color: 'red' });
	  this.brick = brickArray();
	}

	function brickArray() {
	  var bricks = [];
	  for (var i = 0; i < 24; i++) {
	    var x = 10 + i % 8 * 60;
	    var y = 40 + i % 3 * 30;
	    bricks.push(new Brick({ x: x, y: y, width: 50, height: 26, hit: false }));
	  }
	  return bricks;
	}

	World.prototype.brickHitMid = function () {
	  for (let i = 0; i < this.brick.length; i++) {
	    if (this.ball.x >= this.brick[i].x - 1 && this.ball.x <= this.brick[i].x + 50 && this.ball.y >= this.brick[i].y - 1 && this.ball.y <= this.brick[i].y + 26 && this.brick[i].hit === false) {

	      if (this.brick[i].hit === false) {
	        console.log("ball x velocity = " + this.ball.xx);
	        console.log("ball y velocity = " + this.ball.yy);
	        this.score += 10;
	        this.increaseSpeed();
	      }
	      this.ball.yy = this.ball.yy * -1;
	      this.brick[i].hit = true;
	    }
	  }
	};

	World.prototype.brickHitLeft = function () {
	  for (let i = 0; i < this.brick.length; i++) {
	    if (this.ball.x >= this.brick[i].x - 1 && this.ball.x <= this.brick[i].x + 5 && this.ball.y >= this.brick[i].y - 1 && this.ball.y <= this.brick[i].y + 26 && this.brick[i].hit === false) {
	      this.collideLeft();
	      if (this.brick[i].hit === false) {
	        console.log("ball x velocity = " + this.ball.xx);
	        console.log("ball y velocity = " + this.ball.yy);
	        this.score += 10;
	        this.increaseSpeed();
	      }
	      this.brick[i].hit = true;
	    }
	  }
	};

	World.prototype.brickHitRight = function () {
	  for (let i = 0; i < this.brick.length; i++) {
	    if (this.ball.x >= this.brick[i].x + 45 && this.ball.x <= this.brick[i].x + 51 && this.ball.y >= this.brick[i].y - 1 && this.ball.y <= this.brick[i].y + 26 && this.brick[i].hit === false) {
	      this.collideRight();
	      if (this.brick[i].hit === false) {
	        console.log("ball x velocity = " + this.ball.xx);
	        console.log("ball y velocity = " + this.ball.yy);
	        this.score += 10;
	        this.increaseSpeed();
	      }
	      this.brick[i].hit = true;
	    }
	  }
	};

	World.prototype.increaseSpeed = function () {
	  if (this.score % 20 == 0) {
	    this.ball.xx = this.ball.xx * 1.08;
	    this.ball.yy = this.ball.yy * 1.08;
	  }
	};

	World.prototype.loseLife = function () {
	  if (this.ball.y > 500) {
	    this.lives--;
	    this.ball.x = this.paddle.x + 10;
	    this.ball.y = this.paddle.y - 5;
	    this.ball.yy = 0;
	    this.ball.xx = 0;
	    // if(this.ball.yy >= 4.4){
	    //   this.ball.yy = 3.779136;
	    //   this.ball.yy = (this.ball.yy)*-1
	    //   this.ball.xx = 3.779136;
	    // } else if (this.ball.yy <= -4.4) {
	    //   this.ball.yy = -3.779136;
	    //   this.ball.yy = (this.ball.yy)*-1
	    //   this.ball.xx = 3.779136;
	    //}
	  }
	};

	World.prototype.prepareLaunch = function () {
	  if (this.ball.yy === 0 & this.ball.xx === 0) {
	    this.ball.x = this.paddle.x + 45;
	    this.ball.y = this.paddle.y - 5;
	  }
	};

	World.prototype.gameOver = function () {
	  if (this.lives === 0) {
	    this.ball.x = 250;
	    this.ball.y = 250;
	    this.ball.yy = 0;
	    this.ball.xx = 0;
	    this.level = 0;
	    for (let i = 0; i < 24; i++) {
	      this.brick[i].colorLevel = this.level;
	      this.brick[i].color = this.brick[i].colors[this.brick[i].colorLevel];
	    }
	  }
	};

	World.prototype.levelUp = function () {
	  let total = 0;
	  this.brick.forEach(function (i) {
	    if (i.hit === true) {
	      return total++;
	    }
	  });
	  if (total === 24) {
	    this.ball.x = 250;
	    this.ball.y = 250;
	    this.ball.xx = 0;
	    this.ball.yy = 0;
	    this.level++;
	    for (let i = 0; i < total; i++) {
	      this.brick[i].hit = false;
	      this.brick[i].colorLevel = this.level;
	      this.brick[i].color = this.brick[i].colors[this.brick[i].colorLevel];
	    }
	  }
	};

	World.prototype.original = function () {
	  if (this.ball.x >= this.paddle.x - 2 && this.ball.x <= this.paddle.x + 77 && this.ball.y >= this.paddle.y - 2 && this.ball.y <= this.paddle.y + 10) {
	    this.ball.yy = this.ball.yy * -1;
	  }
	};

	World.prototype.bounceLeft = function () {
	  if (this.canCollideLeft()) {
	    this.collideLeft();
	  }
	};

	World.prototype.bounceMiddle = function () {
	  if (this.canCollideMiddle()) {
	    this.collideMiddle();
	  }
	};

	World.prototype.bounceRight = function () {
	  if (this.canCollideRight()) {
	    this.collideRight();
	  }
	};

	World.prototype.collideMiddle = function () {
	  this.ball.yy = this.ball.yy * -1;
	};

	World.prototype.collideLeft = function () {
	  if (this.ball.xx < 0) {
	    this.ball.yy = this.ball.yy * -1;
	    this.ball.xx = this.ball.xx;
	  } else if (this.ball.xx > 0) {
	    this.ball.yy = this.ball.yy * -1;
	    this.ball.xx = this.ball.xx * -1;
	  }
	};

	World.prototype.collideRight = function () {
	  if (this.ball.xx < 0) {
	    this.ball.yy = this.ball.yy * -1;
	    this.ball.xx = this.ball.xx * -1;
	  } else if (this.ball.xx > 0) {
	    this.ball.yy = this.ball.yy * -1;
	    this.ball.xx = this.ball.xx;
	  }
	};

	World.prototype.canCollideLeft = function () {
	  if (this.ball.x >= this.paddle.x - 2 && this.ball.x <= this.paddle.x + 15 && this.ball.y >= this.paddle.y - 2 && this.ball.y <= this.paddle.y + 10) {
	    return true;
	  }
	};
	World.prototype.canCollideMiddle = function () {
	  if (this.ball.x >= this.paddle.x + 16 && this.ball.x <= this.paddle.x + 59 && this.ball.y >= this.paddle.y - 2 && this.ball.y <= this.paddle.y + 10) {
	    return true;
	  }
	};
	World.prototype.canCollideRight = function () {
	  if (this.ball.x >= this.paddle.x + 60 && this.ball.x <= this.paddle.x + 77 && this.ball.y >= this.paddle.y - 2 && this.ball.y <= this.paddle.y + 10) {
	    return true;
	  }
	};

	module.exports = World;

/***/ },
/* 2 */
/***/ function(module, exports) {

	function Paddle(options) {
	  this.x = options.x;
	  this.y = options.y;
	  this.width = options.width;
	  this.height = options.height;
	  this.color = "#991122";
	  this.target = "#e07808";
	}

	Paddle.prototype.draw = function (ctx, mouseX) {
	  var locationX = mouseX || this.x;
	  ctx.fillStyle = this.color;
	  ctx.fillRect(locationX, this.y, this.width, this.height);
	  ctx.fillStyle = this.target;
	  ctx.fillRect(locationX + 17, this.y, 43, this.height);
	  this.move(locationX);
	  return this;
	};

	Paddle.prototype.move = function (location) {
	  this.x = location;
	  if (this.x + 75 >= 500) {
	    this.x = 425;
	  } else if (this.x <= 448) {
	    return this.x;
	  }
	};

	module.exports = Paddle;

/***/ },
/* 3 */
/***/ function(module, exports) {

	function Ball(options) {

	  this.x = options.x;
	  this.y = options.y;
	  this.radius = options.radius;
	  this.startCircle = options.firstAngle;
	  this.endCircle = options.endCircle;
	  this.color = options.color;
	  this.yy = 0;
	  this.xx = 0;
	}
	Ball.prototype.draw = function (ctx, canvas) {
	  ctx.fillStyle = "red";
	  ctx.beginPath();
	  ctx.arc(this.x, this.y, 6.5, 0, 2 * Math.PI);
	  // ctx.arc(this.x, this.y, this.radius, this.startCircle, this.endCircle)
	  ctx.stroke();
	  ctx.fill();
	  this.move();
	};

	Ball.prototype.move = function () {
	  if (this.x + this.xx > 500 || this.x + this.xx < 0) {
	    this.xx = this.xx * -1;
	  }
	  if (this.y + this.yy < 0) {
	    this.yy = this.yy * -1;
	  } else if (this.y > 500) {
	    this.y = 510;
	    this.yy = 0;
	    this.xx = 0;
	  }
	  this.x += this.xx;
	  this.y += this.yy;
	  return this;
	};

	module.exports = Ball;

/***/ },
/* 4 */
/***/ function(module, exports) {

	function Brick(options) {
	  this.x = options.x;
	  this.y = options.y;
	  this.width = options.width;
	  this.height = options.height;
	  this.hit = options.hit;

	  this.colors = ["cyan", "ruby", "yellowgreen", "black", "orange"];
	  this.colorLevel = 0;
	  this.color = this.colors[this.colorLevel];
	}
	Brick.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.fillRect(this.x, this.y, this.width, this.height);
	  return this;
	};

	module.exports = Brick;

/***/ }
/******/ ]);