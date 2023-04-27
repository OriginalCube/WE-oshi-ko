import React from "react";

const AudioVisualizer = (props) => {
  const canvasRef = React.useRef(null);
  const [playerColor, setPlayerColor] = React.useState();
  const [playerOpacity, setPlayerOpacity] = React.useState();

  React.useEffect(() => {
    setPlayerOpacity(props.playerOpacity);
  }, [props.playerOpacity]);

  React.useEffect(() => {
    //rgb(255, 156 ,5);
    const rawData = `rgb(${props.playerColor})`;
    let cleanData = "";
    for (let i = 4; i < rawData.length - 1; i++) {
      cleanData += rawData[i];
    }
    let rgbArray = [];
    rgbArray = cleanData.split(",");

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    setPlayerColor(
      rgbToHex(
        parseInt(rgbArray[0]),
        parseInt(rgbArray[1]),
        parseInt(rgbArray[2])
      )
    );
  }, [props.playerColor]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * (2 / 3);
    canvas.height = window.innerHeight * 0.2;
    let ctx = canvas.getContext("2d");
    function wallpaperAudioListener(audioArray) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Render bars along the full width of the canvas
      const whiteSpace = (canvas.width * 0.1) / 47;
      var barWidth = (canvas.width - whiteSpace * 48) / 48;
      // Begin with the left channel in red
      ctx.fillStyle = `${playerColor}`;
      ctx.globalAlpha = playerOpacity;
      // Iterate over the first 64 array elements (0 - 63) for the left channel audio data
      for (let i = 48; i >= 0; --i) {
        var height = Math.min(canvas.height * 0.8 * Math.min(audioArray[i], 1));
        ctx.fillRect(
          barWidth * i + i * whiteSpace,
          canvas.height - height,
          barWidth,
          height
        );
      }
    }
    try {
      if (props.visualizer) {
        window.wallpaperRegisterAudioListener(wallpaperAudioListener);
      }
    } catch (e) {}
  }, [playerColor, playerOpacity, props.visualizer]);
  return (
    <canvas
      ref={canvasRef}
      className="absolute"
      style={{
        left: "16.65%",
        top: "25.85%",
        borderBottom: `2px solid rgba(${props.playerColor}, ${props.playerOpacity})`,
      }}
    />
  );
};

export default AudioVisualizer;
