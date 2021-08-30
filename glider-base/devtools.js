function devtoolsInit() {
  console.log("Devtools init")
  const dataElem = document.getElementById('gamedata');
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

