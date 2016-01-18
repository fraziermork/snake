var snakeCanvas = document.getElementById('snake');
var context = snakeCanvas.getContext('2d');

function isInArray (value, array){
  for (var i = 0; i < array.length; i++){
    if (value.toString() === array[i].toString()){
      return true;
    }
  }
  return false;
}

game = {
  over: true,
  fps: 6,
  score: 0,
  pixelSize: snakeCanvas.height/40,
  drawBox: function(xPos, yPos){
    context.beginPath();
    context.fillStyle = game.color;
    context.moveTo(xPos - game.pixelSize/2, yPos - game.pixelSize/2);
    context.lineTo(xPos - game.pixelSize/2, yPos + game.pixelSize/2);
    context.lineTo(xPos + game.pixelSize/2, yPos + game.pixelSize/2);
    context.lineTo(xPos + game.pixelSize/2, yPos - game.pixelSize/2);
    context.closePath();
    context.fill();
  },
  start: function(){
    //set initial flag values
    game.resetCanvas();
    food.set();
    snake.direction = 'left';
    snake.init();
    game.over = false;
  },
  resetCanvas() {
    context.clearRect(0,0, snakeCanvas.height, snakeCanvas.width);
  },
  stop: function() {
    game.over = true;
  },
}

snake = {
  sections : [],
  x: null,
  y: null,
  direction: 'left',

  init: function(){
    snake.sections = [];
    snake.y = (snakeCanvas.height/2) +(game.pixelSize/2);
    for (var i = 0; i < 5; i++){
      snake.x = (snakeCanvas.height/2) + (game.pixelSize/2) + (game.pixelSize*i);
      snake.sections.push([snake.x, snake.y]);
    }
    console.log(snake.sections);
  },
  move: function(){
    switch(snake.direction){
      case 'up':
        snake.y -= game.pixelSize;
        break;
      case 'down':
        snake.y += game.pixelSize;
        break;
      case 'left':
        snake.x -= game.pixelSize;
        break;
      case 'right':
        snake.x += game.pixelSize;
        break;
    }
    snake.checkCollision();
    snake.checkGrowth();
    snake.sections.push([snake.x, snake.y])
  },

  draw: function(){
    for (var i = 0; i < snake.sections.length; i++){
      game.drawBox(snake.sections[i][0], snake.sections[i][1])
    }
  },

  checkCollision: function(){
    console.log('isInArray ' + isInArray([snake.x, snake.y], snake.sections));
    if (snake.x > snakeCanvas.width|| snake.y > snakeCanvas.height ||
    snake.x < game.pixelSize || snake.y < game.pixelSize) {
      game.over = true;
    }
  },

  checkGrowth : function () {
    if (snake.x === food.x && snake.y === food.y) {
      game.score++;
      food.set();
    } else {
      snake.sections.shift();
    }
  }

}

food = {
  x: null,
  y: null,
  set: function (){
    food.x = Math.ceil(Math.random()*(40))*game.pixelSize - game.pixelSize / 2;
    food.y = Math.ceil(Math.random()*(40))*game.pixelSize - game.pixelSize / 2;
  },
  draw: function () {
    game.drawBox(food.x, food.y);
  }
}

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
  var lastKey = keys.getKey(e.keyCode);
  if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0 &&
    lastKey != inverseDirection[snake.direction]) {
      snake.direction = lastKey;
    } else if ( ['start_game'].indexOf(lastKey) >= 0 && game.over) {
      game.start();
    }
}, false );

var requestAnimationFrame = window.requestAnimationFrame;
function loop () {
  if(game.over === false){
    game.resetCanvas();
    food.draw();
    snake.move();
    snake.draw();
  }
  setTimeout(function(){
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
}
requestAnimationFrame(loop);
