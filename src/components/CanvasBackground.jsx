import React from "react";
import petalImage from "./assets/petal.png";

const CanvasBackground = (props) => {
  const canvasRef = React.useRef();
  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    function animateRain() {
      ctx.globalAlpha = 0.65;
      ctx.strokeStyle = "white";
      ctx.lineWidth = 0.5;
      ctx.lineCap = "round";

      let w = window.innerWidth;
      let h = window.innerHeight;
      var init = [];
      var maxParts = 500;
      for (var a = 0; a < maxParts; a++) {
        init.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          l: 1 + Math.random() * 2,
          xs: -4 + Math.random() * 4,
          ys: Math.random() * 10 + 10,
        });
      }

      var particles = [];
      for (var b = 0; b < maxParts; b++) {
        particles[b] = init[b];
      }

      function draw() {
        ctx.clearRect(0, 0, w, h);
        for (var c = 0; c < particles.length; c++) {
          var p = particles[c];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
          ctx.stroke();
        }
        move();
      }

      function move() {
        for (var b = 0; b < particles.length; b++) {
          var p = particles[b];
          p.x += p.xs;
          p.y += p.ys;
          if (p.x > w || p.y > h) {
            p.x = Math.random() * w;
            p.y = -20;
          }
        }
      }

      setInterval(draw, 30);
    }
    if (props.canvasId === 1) {
      animateRain();
    } else if (props.canvasId === 2) {
    }
  }, [props.canvasId]);

  return <canvas ref={canvasRef} style={{ position: "absolute" }} />;
};

export default CanvasBackground;
