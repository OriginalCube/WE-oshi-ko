import React from "react";
import Visualizer from "./components/Visualizer";
import AudioVisualizer from "./components/AudioVisualizer";
import CanvasBackground from "./components/CanvasBackground";
import Navigation from "./components/Navigation";

const Main = () => {
  const [mode, setMode] = React.useState(0);
  const [playerColor, setPlayerColor] = React.useState("236, 75, 153");
  const [playerOpacity, setPlayerOpacity] = React.useState(0.5);
  const [visualizer, setVisualizer] = React.useState(true);
  const [player, setPlayer] = React.useState(true);

  //Setting Handler
  const customBg = () => {};

  const onVisualizer = () => {
    setVisualizer(!visualizer);
  };

  const onPlayer = () => {
    setPlayer(!player);
  };

  return (
    <div className="h-screen w-screen">
      <AudioVisualizer
        playerColor={playerColor}
        playerOpacity={playerOpacity}
      />
      <CanvasBackground canvasId={2} />
      <Navigation
        customBg={customBg}
        onVisualizer={onVisualizer}
        onPlayer={onPlayer}
      />
      {visualizer ? (
        <Visualizer
          playerColor={playerColor}
          player={player}
          playerOpacity={playerOpacity}
        />
      ) : null}
    </div>
  );
};

export default Main;
