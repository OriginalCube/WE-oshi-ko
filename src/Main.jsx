import React from "react";
import Visualizer from "./components/Visualizer";
import AudioVisualizer from "./components/AudioVisualizer";
import CanvasBackground from "./components/CanvasBackground";
import Navigation from "./components/Navigation";

const Main = () => {
  const [visualizer, setVisualizer] = React.useState(true);
  const [player, setPlayer] = React.useState(true);
  const [canvas, setCanvas] = React.useState(true);
  const [canvasId, setCanvasId] = React.useState(0);

  //Setting Handler
  const customBg = () => {
    if (Array.isArray(bgData) && bgData.length !== 0) {
      if (bgId < bgData.length - 1) {
        setBgId(bgId + 1);
      } else {
        setBgId(0);
      }
    } else {
      //If No image data
    }
  };

  const onVisualizer = () => {
    changeLocalData(1, { visualizer: !visualizer });
    setVisualizer(!visualizer);
  };

  const onPlayer = () => {
    changeLocalData(0, { player: !player });
    setPlayer(!player);
  };

  const onCanvas = () => {
    let temp = 0;
    if (canvasId < 2) {
      setCanvas(true);
      temp = canvasId + 1;
      setCanvasId(temp);
    } else {
      setCanvasId(0);
      setCanvas(temp);
    }
    changeLocalData(2, { canvasId: temp });
  };

  //Wallpaper Engine Stuff
  const [filter, setFilter] = React.useState("0,0,0");
  const [playerColor, setPlayerColor] = React.useState("236, 75, 153");
  const [playerOpacity, setPlayerOpacity] = React.useState(0.5);
  const [filterOpacity, setFilterOpacity] = React.useState(0.5);
  const [textSize, setTextSize] = React.useState(10);
  const [uiVolume, setUiVolume] = React.useState(0.3);
  const [pbOpacity, setPbOpacity] = React.useState(0.5);
  //On Demand Variables
  const [bgData, setBgData] = React.useState([]);
  const [bgId, setBgId] = React.useState(0);
  const [imageDisplay, setImageDisplay] = React.useState("");

  React.useEffect(() => {
    setImageDisplay("file:///" + bgData[bgId]);
  }, [bgId, bgData]);

  React.useEffect(() => {
    setBgId(0);
  }, [bgData]);

  try {
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

        if (properties.textsize) {
          setTextSize(properties.textsize.value);
        }

        if (properties.uivolume) {
          setUiVolume(properties.uivolume.value / 10);
        }

        if (properties.playerbaropacity) {
          setPbOpacity(properties.playerbaropacity.value / 10);
        }

        //Audio Visualizer
      },
      //WE On Demand
      userDirectoryFilesAddedOrChanged: function (propertyName, changedFiles) {
        setBgData(changedFiles);
      },
    };
  } catch (e) {
    console.log(e);
  }

  //Local Storage
  try {
    React.useEffect(() => {
      if (localStorage.getItem("oshi-04")) {
        const localData = JSON.parse(localStorage.getItem("oshi-04"));
        setPlayer(localData[0].player);
        setVisualizer(localData[1].visualizer);
        setCanvasId(localData[2].canvasId);
      } else {
        setPlayer(true);
        setVisualizer(true);
        setCanvasId(2);
        localStorage.setItem(
          "oshi-04",
          JSON.stringify([
            { player: true },
            { visualizer: true },
            { canvasId: 2 },
          ])
        );
      }
    }, []);
  } catch (e) {
    setPlayer(true);
    setVisualizer(true);
    setCanvasId(2);
    localStorage.setItem(
      "oshi-04",
      JSON.stringify([{ player: true }, { visualizer: true }, { canvasId: 2 }])
    );
  }

  const changeLocalData = (x, y) => {
    const localData = JSON.parse(localStorage.getItem("oshi-04"));
    localData[x] = y;
    localStorage.setItem("oshi-04", JSON.stringify(localData));
  };

  return (
    <div className="h-screen w-screen">
      {Array.isArray(bgData) && bgData.length ? (
        <img alt="" src={imageDisplay} className="absolute h-full w-full" />
      ) : null}
      <div
        className="absolute w-full h-full"
        style={{ backgroundColor: `rgb(${filter})`, opacity: filterOpacity }}
      ></div>
      {visualizer ? (
        <AudioVisualizer playerColor={playerColor} playerOpacity={pbOpacity} />
      ) : null}
      {canvas && canvasId !== 0 ? (
        <CanvasBackground canvasId={canvasId} />
      ) : null}

      <Navigation
        customBg={customBg}
        onVisualizer={onVisualizer}
        onPlayer={onPlayer}
        onCanvas={onCanvas}
        canvasId={canvasId}
        uiVolume={uiVolume}
      />
      <Visualizer
        textSize={textSize}
        playerColor={playerColor}
        player={player}
        playerOpacity={playerOpacity}
        uiVolume={uiVolume}
        customBg={customBg}
      />
    </div>
  );
};

export default Main;
