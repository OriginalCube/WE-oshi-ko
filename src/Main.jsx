import React from "react";
import Visualizer from "./components/Visualizer";
import AudioVisualizer from "./components/AudioVisualizer";
import CanvasBackground from "./components/CanvasBackground";
import Navigation from "./components/Navigation";

const Main = () => {
  const [mode, setMode] = React.useState(0);
  const [visualizer, setVisualizer] = React.useState(true);
  const [player, setPlayer] = React.useState(true);
  const [canvas, setCanvas] = React.useState(true);

  //Setting Handler
  const customBg = () => {};

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
  const [filter, setFilter] = React.useState("0,0,0");
  const [playerColor, setPlayerColor] = React.useState("236, 75, 153");
  const [playerOpacity, setPlayerOpacity] = React.useState(0.5);
  const [filterOpacity, setFilterOpacity] = React.useState(0.5);

  React.useEffect(() => {
    console.log(filter);
  }, [filter]);

  window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
      if (properties.backgroundcolor) {
        // Convert the custom color to 0 - 255 range for CSS usage
        let customColor = properties.backgroundcolor.value.split(" ");
        customColor = customColor.map(function (c) {
          return Math.ceil(c * 255);
        });
        setFilter(customColor);
      }

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
        setFilterOpacity(properties.backgroundopacity.value / 10);
      }

      //Start of Rework
    },
  };

  return (
    <div className="h-screen w-screen">
      {visualizer ? (
        <AudioVisualizer
          playerColor={playerColor}
          playerOpacity={playerOpacity}
        />
      ) : null}
      <div
        className="absolute w-full h-full"
        style={{ backgroundColor: `rgb(${filter})`, opacity: filterOpacity }}
      ></div>
      <img alt="" src="" />
      {canvas ? <CanvasBackground canvasId={2} /> : null}

      <Navigation
        customBg={customBg}
        onVisualizer={onVisualizer}
        onPlayer={onPlayer}
        onCanvas={onCanvas}
      />
      <Visualizer
        playerColor={playerColor}
        player={player}
        playerOpacity={playerOpacity}
      />
    </div>
  );
};

export default Main;
