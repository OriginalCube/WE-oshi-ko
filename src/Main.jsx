import React from "react";
import Visualizer from "./components/Visualizer";
import AudioVisualizer from "./components/AudioVisualizer";

const Main = () => {
  const [mode, setMode] = React.useState(0);
  const [playerColor, setPlayerColor] = React.useState("236, 75, 153");
  const [playerOpacity, setPlayerOpacity] = React.useState(0.5);

  return (
    <div className="h-screen w-screen">
      <AudioVisualizer
        playerColor={playerColor}
        playerOpacity={playerOpacity}
      />
      <Visualizer playerColor={playerColor} playerOpacity={playerOpacity} />
    </div>
  );
};

export default Main;
