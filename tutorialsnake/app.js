var snakeCanvas = document.getElementById('snake');
var snakeCtx = snakeCanvas.getContext('2d');


game = {
  score: 0,
  fps: 8,
  over: true,
  message: null,

  start: function(){
    game.over = false;
    game.message = null;
    game.score = 0;
    game.fps = 8;
    snake.init();
    food.set();

  },

  stop: function(){
    game.over = true;
    game.message = 'GAME OVER - Press Spacebar'
  },

  drawBox: function(x, y, size, color){
    snakeCtx.fillstyle = color;
    snakeCtx.beginPath();
    snakeCtx.moveTo(x - size/2, y - size/2);
    snakeCtx.lineTo(x + size/2, y - size/2);
    snakeCtx.lineTo(x + size/2, y + size/2);
    snakeCtx.lineTo(x - size/2, y + size/2);
    snakeCtx.closePath();
    snakeCtx.fill();
  },

  drawScore: function(){
    snakeCtx.fillStyle = '#999';
    snakeCtx.font = (snakeCanvas.height) + 'px Impact, sans-serif';
    snakeCtx.textAlign = 'center';
    snakeCtx.fillText(game.score, snakeCanvas.width/2, snakeCanvas.height * 0.9);
  },

  drawMessage: function(){
    if (game.message !== null){
      snakeCtx.fillStyle = '#00F';
      snakeCtx.strokeStyle = '#FFF';
      snakeCtx.font = (snakeCanvas.height/10) + 'px Impact';
      snakeCtx.textAlign = 'center';
      snakeCtx.fillText(game.message, snakeCanvas.width/2, snakeCanvas.height/2);
      snakeCtx.strokeText(game.message, snakeCanvas.width/2, snakeCanvas.height/2);
    }
  },

  resetCanvas: function(){
    snakeCtx.clearRect(0,0, snakeCanvas.height, snakeCanvas.width);
  }
}

snake = {
  size: snakeCanvas.width / 40,
  x: null,
  y: null,
  color: '#0F0',
  direction: 'left',
  sections: [],

  init: function(){
    snake.sections = [];
    snake.direction = 'left';
    snake.x = snakeCanvas.width/2 + snake.size/2;
    snake.y = snakeCanvas.height/2 + snake.size/2;
    for (var i = snake.x + (5*snake.size); i >=snake.x; i-=snake.size){
      snake.sections.push(i + ',' + snake.y);
    }
  },

  move: function(){
    switch(snake.direction){
      case 'up':
        snake.y -= snake.size;
        break;
      case 'down':
        snake.y += snake.size;
        break;
      case 'left':
        snake.x -= snake.size;
        break;
      case 'right':
        snake.x += snake.size;
        break;
    }
    snake.checkCollision();
    snake.checkGrowth();
    snake.sections.push(snake.x + ',' + snake.y)
  },

  draw: function() {
    for(i = 0; i < snake.sections.length; i++){
      snake.drawSection(snake.sections[i].split(','));
    }
  },

  drawSection: function(section){
    game.drawBox(parseInt(section[0]), parseInt(section[1]), snake.size, snake.color);
  },

  checkCollision: function () {
    if (snake.isCollision(snake.x, snake.y) === true){
      game.stop();
    }
  },

  isCollision: function (x, y){
    if (x < snake.size/2 ||
      x > snakeCanvas.width ||
      y < snake.size/2 ||
      y > snakeCanvas.height ||
      snake.sections.indexOf(x+','+y) >= 0){
        return true;
      }
  },

  checkGrowth: function() {
    if (snake.x == food.x && snake.y == food.y){
      game.score++;
      food.set();
    } else {
      snake.sections.shift();
    }
  }
};

food = {
  size: null,
  x: null,
  y: null,
  color: '#0FF',

  set: function() {
    food.size = snake.size;
    food.x = (Math.ceil(Math.random()*10) * snake.size * 4) - snake.size / 2;
    food.y = (Math.ceil(Math.random()*10) * snake.size * 3) - snake.size / 2;
  },

  draw: function() {
    game.drawBox(food.x, food.y, food.size, food.color);
  }
};

inverseDirection = {
  'up': 'down',
  'left': 'right',
  'right' : 'left',
  'down': 'up'
}

keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 65, 72],
  right: [39, 68, 76],
  start_game: [13, 32],
  getKey: function(value){
    for (var key in this) {
      if (this[key] instanceof Array && this[key].indexOf(value) >= 0){
        return key;
      }
    }
    return null;
  }
}

addEventListener('keydown', function (e){
  lastKey = keys.getKey(e.keyCode);
  if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0 &&
    lastKey != inverseDirection[snake.direction]) {
      snake.direction = lastKey;
    } else if ( ['start_game'].indexOf(lastKey) >= 0 && game.over) {
      game.start();
    }
}, false );

var requestAnimationFrame = window.requestAnimationFrame;

function loop() {
  if (game.over == false){
    game.resetCanvas();
    game.drawScore();
    snake.move();
    food.draw();
    snake.draw();
    game.drawMessage();
  }
  setTimeout(function(){
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
};

requestAnimationFrame(loop);
