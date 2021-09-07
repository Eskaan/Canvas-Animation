/**
 * Starts a new Animation in `#animationCanvas`
 * @param ms interval the frames are rendered - milliseconds
 * @param npp (Nodes Per Pixel) a value of nodes created per pixel in the canvas. <br/>**< 0.0001 recommended!**
 * @param speed speed in px the nodes move per frame
 * @param range the range in with the struts are drawn
 * @param opacity the opacity added per frame (how fast the struts are disappearing)
 * @param color callback taking a value from 0 to 360 as the color of the strut
 * @returns id of renderer thread - use *clearInterval(<id>)* to stop
 */
function startAnimation(
    ms = 100,
    npp = .00004,
    speed = 5,
    range = 200,
    opacity = .1,
    color = (node, nodeN) => { //just an example
      return Math.abs(Math.floor(Math.tanh(node.x - nodeN.x / node.y - nodeN.y) * 360)) + 50;
    }
) {
  const canvas = document.getElementById("animationCanvas");
  const ctx = canvas.getContext("2d");
  const height = window.innerHeight;
  const width = window.innerWidth;
  const nodes = [];

  canvas.addEventListener("click", () => canvas.requestFullscreen());

  function newNode() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      angle: Math.random() * 360,
      color: Math.random() * 360
    };
  }

  const nodesNumber = Math.floor(height * width * npp);
  for (let i = 0; i < nodesNumber; i++) {
    nodes.push(newNode());
  }

  ctx.fillStyle = "rgb(0,9,9)";
  ctx.fillRect(0, 0, width, height);
  canvas.setAttribute("width", width.toString(10));
  canvas.setAttribute("height", height.toString(10));

  let intervals = [];
  intervals.push(setInterval(() => {
    ctx.fillStyle = `rgba(0,0,0,${opacity})`;
    ctx.fillRect(0, 0, width, height);
  }, ms));
  nodes.forEach((node, index) => {
    intervals.push(setInterval((node, index) => {
      //by filtering reducing drawing functions by 50% (performance)
      nodes.filter((nodeN, indexN) => index > indexN)
          .forEach((nodeN) => {

            const dx = node.x - nodeN.x;
            const dy = node.y - nodeN.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= range) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(nodeN.x, nodeN.y);
              //ctx.strokeStyle = correctColor(Math.abs(Math.floor(Math.tanh(dx / dy) * colorBandWidth)) + colorSet);
              ctx.strokeStyle = `hsla(${color(node, nodeN)}, 100%, 50%, ${Math.abs(distance / range - 1)})`;
              ctx.stroke();
            }
          });
    }, ms, node, index));
    //separate function for parallel lines
    intervals.push(setInterval(node => {
      if (node.x < 0 || node.y < 0
          || node.x > width || node.y > height) {
        //node.angle = correctAngle(node.angle + 90);
        node.x = Math.random() * width;
        node.y = Math.random() * height;
        node.angle = Math.random() * 360;
      }
      node.x += Math.cos(node.angle * (2 * Math.PI) / 360) * speed;
      node.y += Math.sin(node.angle * (2 * Math.PI) / 360) * speed;
    }, ms, node));
  });
  return intervals;
}
