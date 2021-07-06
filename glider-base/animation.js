const game = {
  speed: {
    render: 0, //render every x ms
    calc: 0, //recalculation every x ms
    move: 1,
    turn: 1,
    frame: 0
  },
  canvas: document.getElementById('game'),
  context: document.getElementById('game').getContext('2d'),
  size: {
    width: parseInt(document.getElementById('game').getAttribute('width')),
    height: parseInt(document.getElementById('game').getAttribute('height'))
  },
  threads: {
    renderer: null,
    calc: null,
    check: setInterval(check, 100)
  },
  set: {
    gliders: 0,
    render: 0,
    calc: 0,
    range: 0,
    random: 0,
    effect: 0
  },
  gliders: []
}

function check() {
  //add gliders if not enough
  while (game.gliders.length < game.set.gliders) {
    const angle = Math.floor(Math.random() * 360)
    game.gliders.push({
      pos: {
        x: Math.floor(Math.random() * game.size.width),
        y: Math.floor(Math.random() * game.size.height),
        angle: angle
      },
      targetAngle: angle
    });
  }
  if (game.gliders.length > game.set.gliders) {
    game.gliders.splice(game.set.gliders)
  }

  if (game.speed.render !== game.set.render) {
    clearInterval(game.threads.renderer);
    if (game.speed.render !== 0) {
      game.threads.renderer = setInterval(renderFrame, game.speed.render);
    }
    game.set.render = game.speed.render;
  }

  if (game.speed.calc !== game.set.calc) {
    clearInterval(game.threads.calc);
    if (game.speed.calc !== 0) {
      game.threads.calc = setInterval(calculateGliders, game.speed.calc);
    }
    game.set.calc = game.speed.calc;
  }
}

function init(
  gliders = 10,
  render = 100,
  calc = 500,
  move = 1,
  turn = 2,
  range = 50,
  random = 5,
  effect = .5
) {
  game.set.gliders = gliders;
  game.set.range = range;
  game.set.random = random;
  game.set.effect = effect;
  game.speed.render = render;
  game.speed.calc = calc;
  game.speed.move = move;
  game.speed.turn = turn;
  check();
}

function renderFrame() {
  game.speed.frame++;
  game.context.clearRect(0, 0, game.size.width, game.size.height);

  function lineTo(length, x, y, angle) {
    const centralAngle = angle * (2 * Math.PI) / 360;
    const xPos = (length * Math.cos(centralAngle) + x);
    const yPos = (length * Math.sin(centralAngle) + y);
    game.context.lineTo(xPos, yPos)
  }

  game.gliders.forEach(glider => {
    //move glider
    const centralAngle = glider.pos.angle * (2 * Math.PI) / 360;
    glider.pos.x = game.speed.move * Math.cos(centralAngle) + glider.pos.x;
    glider.pos.y = game.speed.move * Math.sin(centralAngle) + glider.pos.y;
    if (glider.pos.x < 0) glider.pos.x = game.size.width - 1;
    if (glider.pos.x > game.size.width) glider.pos.x = 1;
    if (glider.pos.y < 0) glider.pos.y = game.size.height - 1;
    if (glider.pos.y > game.size.height) glider.pos.y = 1;

    //turn glider
    glider.pos.angle = correctAngle(glider.pos.angle);
    glider.targetAngle = correctAngle(glider.targetAngle);

    if (Math.abs(glider.pos.angle - glider.targetAngle) <= game.speed.turn) {
      glider.pos.angle = glider.targetAngle;
    } else {
      glider.pos.angle +=
        correctAngle(glider.targetAngle - glider.pos.angle) <= 180 ? 1 : -1
          * game.speed.turn;
    }

    //draw glider
    game.context.beginPath();
    lineTo(10, glider.pos.x, glider.pos.y, glider.pos.angle);
    lineTo(5, glider.pos.x, glider.pos.y, glider.pos.angle + 150);
    lineTo(5, glider.pos.x, glider.pos.y, glider.pos.angle - 150);
    game.context.fill();
  });
}

function correctAngle(r) {
  while (r < 0) r += 360;
  while (r > 360) r -= 360;
  return r;
}

function calculateGliders() {
  game.gliders.forEach((glider, index) => {
    //random movement
    glider.targetAngle += Math.random() * game.set.random * 2 - game.set.random;

    //move like others in range
    let inRange = 0;
    let allAngle = 0;
    game.gliders.filter((forGlider, i) => i !== index).forEach((forGlider) => {
      if (Math.abs(glider.pos.x - forGlider.pos.x) <= game.set.range
        && Math.abs(glider.pos.y - forGlider.pos.y) <= game.set.range) {
        inRange++;
        allAngle += forGlider.pos.angle;
      }
    });
    if (inRange > 0) {
      glider.targetAngle =
        glider.targetAngle * (1 - game.set.effect)
        + correctAngle(allAngle / inRange) * game.set.effect;
    }
  });
}



//start development environment
window.addEventListener('load', devtoolsInit);

//start
window.addEventListener('load', () => {
  init(100, 100, 100, 4, 2, 10, 5, .1)
});