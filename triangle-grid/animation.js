/**
 * Starts a new Animation in #
 * @param ms interval the frames are rendered - milliseconds
 * @param npp (Nodes Per Pixel) a value of nodes created per pixel in the canvas. <br/>**< 0.0001 recommended!**
 * @param speed speed in px the nodes move per frame
 * @param range the range in with the struts are drawn
 * @param opacity the opacity added per frame (how fast the struts are disappearing)
 * @param colorSet number from 0 to 360 to choose colorBand position
 * @param colorBandWidth width of the colorSet - 360 is rainbow
 * @returns id of renderer thread - use *clearInterval(<id>)* to stop
 */
function startAnimation(ms = 100, npp = .000025, speed = 4, range = 200, opacity = .05, colorSet = 0, colorBandWidth = 355) {
  const canvas = document.getElementById('animationCanvas');
  const ctx = canvas.getContext('2d');
  const height = window.innerHeight;
  const width = window.innerWidth;
  const nodes = [];

  function newNode() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      angle: Math.random() * 360,
    };
  }

  function correctColor(c) {
    while (c < 0) c += 360;
    while (c > 360) c -= 360;
    return c;
  }

  const nodesNumber = Math.floor(height * width * npp);
  for (let i = 0; i < nodesNumber; i++) {
    nodes.push(newNode());
  }

  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillRect(0, 0, width, height);
  canvas.setAttribute('width', width.toString(10));
  canvas.setAttribute('height', height.toString(10));

  return setInterval(() => {
    ctx.fillStyle = `rgba(0,0,0,${opacity})`;
    ctx.fillRect(0, 0, width, height);
    nodes.forEach(node => {
      nodes.filter(nodeN => nodeN !== node).forEach(nodeN => {
        const dx = node.x - nodeN.x;
        const dy = node.y - nodeN.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= range) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(nodeN.x, nodeN.y);
          const color = correctColor(Math.abs(Math.floor(Math.tanh(dx / dy) * colorBandWidth)) + colorSet);
          ctx.strokeStyle = `hsla(${color}, 100%, 50%, ${Math.abs(distance / range - 1)})`;
          ctx.stroke();
        }
      });
    });
    //separate function for parallel lines
    nodes.forEach(node => {
      if (node.x < 0 || node.y < 0
        || node.x > width || node.y > height) {
        //node.angle = correctAngle(node.angle + 90);
        node.x = Math.random() * width;
        node.y = Math.random() * height;
        node.angle = Math.random() * 360;
      }
      node.x += Math.cos(node.angle * (2 * Math.PI) / 360) * speed;
      node.y += Math.sin(node.angle * (2 * Math.PI) / 360) * speed;
    });
  }, ms);
}
