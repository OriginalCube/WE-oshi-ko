import React from "react";
import Visualizer from "./components/visualizer/Visualizer";

const Main = () => {
  const [mode, setMode] = React.useState(0);

  return (
    <div className="h-screen w-screen">
      {mode === 0 ? <Visualizer /> : null}
    </div>
  );
};

export default Main;
