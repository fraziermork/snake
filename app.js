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

var game = {
  over: true,
  fps: 6,
  score: 0,
  directionFlag: false,
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

  resetCanvas: function() {
    context.clearRect(0,0, snakeCanvas.height, snakeCanvas.width);
  },

  stop: function() {
    game.over = true;
  }
}

var snake = {
  sections: [],
  x: null,
  y: null,
  direction: 'left',

  init: function(){
    snake.sections = [];
    console.table(snake.sections);
    console.log((snake.sections).toString());
    snake.y = (snakeCanvas.height/2) +(game.pixelSize/2);
    console.log(snake.y);
    snake.x = (snakeCanvas.width/2) - (game.pixelSize/2);
    console.log(snake.x);
    for (var i = 0; i < 5; i++){
      snake.x += (game.pixelSize);
      console.log('in init snake x');
      console.log(snake.x);
      snake.sections.push([snake.x, snake.y]);
      console.table(snake.sections);
      console.dir(snake.sections);
      console.log(snake.sections);
      console.log(snake.sections.toString());
      console.log(snake.sections.length);
    }
    console.log('Init sections are:');
    console.table(snake.sections);
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
    // console.log(snake.x + ' ' + snake.y);
    snake.checkCollision();
    snake.checkGrowth();
    snake.sections.push([snake.x, snake.y]);
    // console.log('Move snake sections are:' );
    // console.log(snake.sections);
  },

  draw: function(){
    for (var i = 0; i < snake.sections.length; i++){
      // console.log('Draw snake sections are');
      // console.log(snake.sections);
      game.drawBox(snake.sections[i][0], snake.sections[i][1])
    }
  },

  checkCollision: function(){
    // console.log('isInArray ' + isInArray([snake.x, snake.y], snake.sections));
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

var food = {
  xPos: null,
  yPos: null,
  set: function (){
    food.xPos = Math.ceil(Math.random()*(40))*game.pixelSize - game.pixelSize / 2;
    food.yPos = Math.ceil(Math.random()*(40))*game.pixelSize - game.pixelSize / 2;
  },
  draw: function () {
    game.drawBox(food.xPos, food.yPos);
  }
}

var inverseDirection = {
  'up': 'down',
  'left': 'right',
  'right' : 'left',
  'down': 'up'
}

var keys = {
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
  if (game.directionFlag === false){
    game.directionFlag = true;
    var lastKey = keys.getKey(e.keyCode);
    if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0 &&
    lastKey != inverseDirection[snake.direction]) {
      snake.direction = lastKey;
    } else if ( ['start_game'].indexOf(lastKey) >= 0 && game.over) {
      game.start();
    }
  }
}, false );

var requestAnimationFrame = window.requestAnimationFrame;
function loop () {
  if(game.over === false){
    game.directionFlag = false;
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
