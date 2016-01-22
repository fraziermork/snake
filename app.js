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
    console.log('game.start function begun');
    //set initial flag values
    game.resetCanvas();
    food.set();
    snake.direction = 'left';
    snake.init();
    game.over = false;
    console.log('game.start function done');
  },

  resetCanvas: function() {
    console.log('game.resetCanvas');
    context.clearRect(0,0, snakeCanvas.height, snakeCanvas.width);
  },

  stop: function() {
    console.log('game.stop');
    game.over = true;
  }
}

var snake = {
  sections: [],
  x: null,
  y: null,
  direction: 'left',

  init: function(){
    snake.direction = 'left';
    console.log('snake.init begun');
    snake.sections = [];
    console.table(snake.sections);
    console.log((snake.sections).toString());
    snake.y = (snakeCanvas.height/2) +(game.pixelSize/2);
    console.log(snake.y);
    snake.x = (snakeCanvas.width/2) + (game.pixelSize/2) + 5*(game.pixelSize);
    console.log(snake.x);
    //this for loop is drawing the snake the wrong direction I think
    for (var i = 0; i < 5; i++){
      snake.x -= (game.pixelSize);
      console.log('in init snake x');
      console.log(snake.x);
      snake.sections.push([snake.x, snake.y]); //was push
      console.table(snake.sections);
      console.dir(snake.sections);
      console.log(snake.sections);
      console.log(snake.sections.toString());
      console.log(snake.sections.length);
    }
    console.log('Init sections are:');
    console.table(snake.sections);
    console.log(snake.sections);
    console.log('snake.init finished');
  },

  move: function(){
    console.log('snake.move begun');
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
    console.log('in snake.move, snake x and snake y are');
    console.log(snake.x + ' ' + snake.y);
    snake.checkCollision();
    snake.checkGrowth();
    snake.sections.push([snake.x, snake.y]);
    console.log('snake.move snake sections are:' );
    console.table(snake.sections);
    console.log('snake.move finished');
  },

  draw: function(){
    console.log('snake.draw begun');
    for (var i = 0; i < snake.sections.length; i++){
      game.drawBox(snake.sections[i][0], snake.sections[i][1])
    }
    console.log('snake.draw finished');
  },

  checkCollision: function(){
    console.log('snake.checkCollision begun');
    console.log('isInArray ' + isInArray([snake.x, snake.y], snake.sections));
    if (snake.x > snakeCanvas.width|| snake.y > snakeCanvas.height ||
    snake.x < game.pixelSize || snake.y < game.pixelSize || isInArray([snake.x, snake.y], snake.sections)) {
      game.over = true;
    }
    console.log('snake.checkCollision finished');
  },

  checkGrowth : function () {
    console.log('snake.checkGrowth begun');
    if (snake.x === food.xPos && snake.y === food.yPos) {
      game.score++;
      food.set();
    } else {
      snake.sections.shift();
    }
    console.log('snake.checkGrowth finished');
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


//snake is turning around in the first game two animation frames, need to redraw the snake going the opposite direction?
