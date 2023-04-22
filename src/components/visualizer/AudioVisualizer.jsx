import React from "react";

const AudioVisualizer = () => {
  const canvasRef = React.useRef(null);
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
      ctx.fillStyle = `#d946ef`;
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
      window.wallpaperRegisterAudioListener(wallpaperAudioListener);
    } catch (e) {}
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="border-b-2 border-pink-500 absolute"
      style={{ left: "16.65%", top: "23.85%" }}
    />
  );
};

export default AudioVisualizer;
