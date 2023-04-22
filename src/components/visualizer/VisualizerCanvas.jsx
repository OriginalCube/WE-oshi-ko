import React from "react";
import petalImage from "./assets/petal.png";

const VisualizerCanvas = () => {
  const canvasRef = React.useRef();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    function PetalAnim() {
      const TOTAL = 50;
      const petalArray = [];
      const petalImg = new Image();
      petalImg.src = petalImage;

      // Petal class
      class Petal {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height * 2 - canvas.height;
          this.w = 25 + Math.random() * 15;
          this.h = 20 + Math.random() * 10;
          this.opacity = 0.7;
          this.flip = Math.random();

          this.xSpeed = 1.5 + Math.random() * 2;
          this.ySpeed = 1 + Math.random() * 1;
          this.flipSpeed = Math.random() * 0.03;
        }

        draw() {
          if (this.y > canvas.height || this.x > canvas.width) {
            this.x = -petalImg.width;
            this.y = Math.random() * canvas.height * 2 - canvas.height;
            this.xSpeed = 1.5 + Math.random() * 2;
            this.ySpeed = 1 + Math.random() * 1;
            this.flip = Math.random();
          }
          ctx.globalAlpha = this.opacity;
          ctx.drawImage(
            petalImg,
            this.x,
            this.y,
            this.w * (0.6 + Math.abs(Math.cos(this.flip)) / 3),
            this.h * (0.8 + Math.abs(Math.sin(this.flip)) / 5)
          );
        }

        animate() {
          this.x += this.xSpeed + mouseX * 5;
          this.y += this.ySpeed + mouseX * 2;
          this.flip += this.flipSpeed;
          this.draw();
        }
      }

      const petalLoad = () => {
        for (let i = 0; i < TOTAL; i++) {
          petalArray.push(new Petal());
        }
        render();
      };

      function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petalArray.forEach((petal) => petal.animate());
        window.requestAnimationFrame(render);
      }

      let mouseX = 0;
      function touchHandler(e) {
        mouseX = (e.clientX || e.touches[0].clientX) / window.innerWidth;
      }
      petalLoad();
      window.addEventListener("mousemove", touchHandler);
      window.addEventListener("touchmove", touchHandler);
    }

    PetalAnim();
  }, []);
  return <canvas className="absolute" ref={canvasRef} />;
};

export default VisualizerCanvas;
