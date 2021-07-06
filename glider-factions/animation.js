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
  factions: [
    {
      name: 'Red',
      color: 'rgba(255,0,0,0.75)',
      points: 0
    },
    {
      name: 'Green',
      color: 'rgba(0,255,0,0.75)',
      points: 0
    },
    {
      name: 'Blue',
      color: 'rgba(0,0,255,0.75)',
      points: 0
    },
    {
      name: 'yellow',
      color: 'rgba(255,255,0,0.75)',
      points: 0
    }
  ],
  gliders: []
}

function check() {
  //add gliders if not enough
  while (game.gliders.length < game.set.gliders) {
    const angle = Math.floor(Math.random() * 360);
    const faction = Math.floor(Math.random() * 4);
    game.gliders.push({
      pos: {
        x: Math.floor(Math.random() * game.size.width),
        y: Math.floor(Math.random() * game.size.height),
        angle: angle
      },
      targetAngle: angle,
      faction: faction
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

  function gliderWallCheck(glider) {
    const lastFaction = glider.faction + 0;
    let angle = Math.random() * 90;
    if ((glider.pos.x < 0 && glider.pos.y < game.size.height / 2)
      || (glider.pos.y < 0 && glider.pos.x < game.size.width / 2)) {
      glider.pos.x = 0;
      glider.pos.y = 0;
      glider.faction = 0;
    } else if (glider.pos.y < 0
      || (glider.pos.x > game.size.width && glider.pos.y < game.size.height / 2)) {
      glider.pos.x = game.size.width;
      glider.pos.y = 0;
      glider.faction = 1;
      angle += 90;
    } else if (glider.pos.x > game.size.width
    || (glider.pos.y > game.size.height && glider.pos.x > game.size.width / 2)) {
      glider.pos.x = game.size.width;
      glider.pos.y = game.size.height;
      glider.faction = 2;
      angle += 180
    } else if (glider.pos.x < 0
    || glider.pos.y > game.size.height) {
      glider.pos.x = 0;
      glider.pos.y = game.size.height;
      glider.faction = 3;
      angle += 270
    } else {
      return;
    }
    //only executed if something succeeded
    glider.pos.angle = angle;
    glider.targetAngle = angle;
    if (lastFaction !== glider.faction) game.factions[glider.faction].points++
  }

  game.gliders.forEach((glider, index) => {
    //move glider
    const centralAngle = glider.pos.angle * (2 * Math.PI) / 360;
    glider.pos.x = game.speed.move * Math.cos(centralAngle) + glider.pos.x;
    glider.pos.y = game.speed.move * Math.sin(centralAngle) + glider.pos.y;
    gliderWallCheck(glider);

    //turn glider
    glider.pos.angle = correctAngle(glider.pos.angle);
    glider.targetAngle = correctAngle(glider.targetAngle);

    if (Math.abs(glider.pos.angle - glider.targetAngle) <= game.speed.turn) {
      glider.pos.angle = glider.targetAngle;
    } else {
      glider.pos.angle +=
        (correctAngle(glider.targetAngle - glider.pos.angle) <= 180) ? 1 : -1
          * game.speed.turn;
    }

    //draw glider
    game.context.beginPath();
    lineTo(10, glider.pos.x, glider.pos.y, glider.pos.angle);
    lineTo(5, glider.pos.x, glider.pos.y, glider.pos.angle + 150);
    lineTo(5, glider.pos.x, glider.pos.y, glider.pos.angle - 150);
    game.context.fillStyle = game.factions[glider.faction].color;
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
      glider.targetAngle = correctAngle(
        glider.targetAngle * (1 - game.set.effect)
        + correctAngle(allAngle / inRange) * game.set.effect);
    }
  });
}


//start development environment
//window.addEventListener('load', () => devtoolsInit());

//start
window.addEventListener('load', () => {
  init(100, 50, 100, 2, 25, 20, 1, .05)
});