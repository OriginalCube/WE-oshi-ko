import React from "react";
import Visualizer from "./components/Visualizer";
import AudioVisualizer from "./components/AudioVisualizer";
import CanvasBackground from "./components/CanvasBackground";
import Navigation from "./components/Navigation";

const Main = () => {
  const [visualizer, setVisualizer] = React.useState(true);
  const [player, setPlayer] = React.useState(true);
  const [canvas, setCanvas] = React.useState(true);

  //Setting Handler
  const customBg = () => {
    if (backgroundId < background.length) {
      setBackgroundId(backgroundId + 1);
    } else {
      setBackgroundId(0);
    }
  };

  const onVisualizer = () => {
    setVisualizer(!visualizer);
  };

  const onPlayer = () => {
    console.log("clicked");
    setPlayer(!player);
  };

  const onCanvas = () => {
    setCanvas(!canvas);
  };

  //Wallpaper Engine Stuff
  const [filter, setFilter] = React.useState("236, 75, 153");
  const [playerColor, setPlayerColor] = React.useState("236, 75, 153");
  const [playerOpacity, setPlayerOpacity] = React.useState(0.5);
  const [filterOpacity, setFilterOpacity] = React.useState(0.5);
  const [textSize, setTextSize] = React.useState(10);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [mainImage, setMainImage] = React.useState("");
  const [background, setBackground] = React.useState([]);
  const [backgroundId, setBackgroundId] = React.useState(0);

  React.useEffect(() => {
    setMainImage("file:///" + background[backgroundId]);
  }, [backgroundId, background]);

  React.useEffect(() => {
    setBackgroundId(0);
  }, [background]);

  React.useEffect(() => {
    console.log(visualizer);
  }, [visualizer]);

  try {
    window.wallpaperPropertyListener = {
      applyUserProperties: function (properties) {
        if (properties.playercolor) {
          // Convert the custom color to 0 - 255 range for CSS usage
          let customColor = properties.playercolor.value.split(" ");
          customColor = customColor.map(function (c) {
            return Math.ceil(c * 255);
          });
          setPlayerColor(customColor);
        }

        if (properties.playeropacity) {
          setPlayerOpacity(properties.playeropacity.value / 10);
        }

        if (properties.backgroundopacity) {
          console.log(properties.backgroundopacity.value);
          setFilterOpacity(properties.backgroundopacity.value / 10);
        }

        if (properties.textsize) {
          setTextSize(properties.textsize.value);
        }

        //Audio Visualizer
      },
    };
  } catch (ev) {
    console.log("WE Error");
  }

  return (
    <div className="h-screen w-screen">
      {visualizer ? (
        <AudioVisualizer playerColor={"playerColor"} playerOpacity={0.5} />
      ) : null}
      <div
        className="absolute w-full h-full"
        style={{ backgroundColor: `black` }}
      ></div>
      {background.length !== 0 ? (
        <img alt="" className="absolute w-full h-full" src={mainImage} />
      ) : null}
      {canvas ? <CanvasBackground canvasId={2} /> : null}

      <Navigation
        customBg={customBg}
        onVisualizer={onVisualizer}
        onPlayer={onPlayer}
        onCanvas={onCanvas}
      />
      <Visualizer
        textSize={textSize}
        playerColor={playerColor}
        player={player}
        playerOpacity={playerOpacity}
      />
    </div>
  );
};

export default Main;
