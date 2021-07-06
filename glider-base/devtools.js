function devtoolsInit() {
  console.log("Devtools init")
  dataElem = document.getElementById('gamedata');
  document.getElementById('dev').innerHTML =
    getSlider("game.speed.render", 10000) +
    getSlider("game.speed.calc", 10000) +
    getSlider("game.speed.move", 10000) +
    getSlider("game.speed.turn", 10000) +
    getSlider("game.set.gliders", 10000) +
    getSlider("game.set.effect", 10000) +
    getSlider("game.set.range", 10000);
  setInterval(() => {
    dataElem.innerHTML = syntaxHighlight(game);
  }, 100);

  dataElem.style.top = "500px";
  dataElem.style.left = "0px";

  dataElem.onmousedown = event => {
    devtoolsMouseDown.isDown = true;
    devtoolsMouseDown.x = event.x - parseInt(dataElem.style.left);
    devtoolsMouseDown.y = event.y - parseInt(dataElem.style.top);
  }
  dataElem.onmousemove = event => {
    if (devtoolsMouseDown.isDown) {
      dataElem.style.left = (event.x - devtoolsMouseDown.x) + "px";
      dataElem.style.top = (event.y - devtoolsMouseDown.y) + "px";
    }
  }
  dataElem.onmouseup = event => devtoolsMouseDown.isDown = false;
}

devtoolsMouseDown = {
  isDown: false,
  x: 10,
  y: 10
};

function getSlider(varName, max = 100) {
  return (`
    <div>
        <input type="number" min="0" max="${max}" value="${varName}" onchange="${varName} = this.valueAsNumber;">
        <span>${varName}</span>
    </div>
`);
}

//Thanks Stackoverflow ^u^
function syntaxHighlight(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

