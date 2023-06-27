import React from "react";

const AudioVisualizer = (props) => {
  const canvasRef = React.useRef(null);
  const [playerColor, setPlayerColor] = React.useState(props.playerColor);
  const [playerOpacity, setPlayerOpacity] = React.useState(0.5);

  React.useEffect(() => {
    setPlayerOpacity(props.playerOpacity);
  }, [props.playerOpacity]);

  React.useEffect(() => {
    if (props.colorPreset === 0) {
      setPlayerColor(props.playerColor);
    } else {
      setPlayerColor(props.colorHex[props.colorPreset - 1]);
    }
  }, [props.colorPreset, props.playerColor]);

  React.useEffect(() => {
    try {
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
        ctx.fillStyle = `rgb(${playerColor})`;
        ctx.globalAlpha = playerOpacity;
        let tempHeight = canvas.height * 0.85;
        // Iterate over the first 64 array elements (0 - 63) for the left channel audio data
        for (let i = 48; i >= 0; --i) {
          var height = tempHeight * Math.min(audioArray[i], 1);
          ctx.fillRect(
            barWidth * i + i * whiteSpace,
            canvas.height - height,
            barWidth,
            height
          );
        }
      }
      window.wallpaperRegisterAudioListener(wallpaperAudioListener);
    } catch (e) {
      console.log("vis error");
    }
  }, [playerColor, playerOpacity]);
  return (
    <canvas
      ref={canvasRef}
      className="absolute"
      style={{
        left: "16.65%",
        top: "25.85%",
        borderBottom: `2px solid rgba(${props.playerColor}, ${
          props.playerOpacity / 2
        })`,
      }}
    />
  );
};

export default AudioVisualizer;
