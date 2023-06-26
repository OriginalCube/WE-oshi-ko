import React from "react";
import Visualizer from "./components/Visualizer";
import AudioVisualizer from "./components/AudioVisualizer";
import CanvasBackground from "./components/CanvasBackground";
import Navigation from "./components/Navigation";
import SongData from "./components/SongData.json";

const Main = () => {
  const [visualizer, setVisualizer] = React.useState(true);
  const [player, setPlayer] = React.useState(true);
  const [canvas, setCanvas] = React.useState(true);
  const [canvasId, setCanvasId] = React.useState(0);
  const [colorPreset, setColorPreset] = React.useState(0);
  const colorPresets = SongData.colorPreset;
  const colorHex = SongData.colorHex;
  const imagePresets = SongData.imagePresets;

  //Setting Handler
  const customBg = () => {
    let temp = 0;
    if (
      bgId > imagePresets.length - 1 &&
      Array.isArray(bgData) &&
      bgData.length !== 0
    ) {
      if (bgId < bgData.length - 1) {
        temp = imagePresets.length - 1 + 1;
      } else {
        temp = 0;
      }
    } else {
      if (
        bgId < imagePresets.length - 1 &&
        !(Array.isArray(bgData) && bgData.length !== 0)
      ) {
        temp = bgId + 1;
      } else {
        temp = 0;
      }
    }
    setBgId(temp);
    changeLocalData("bgId", temp);
  };

  const onVisualizer = () => {
    changeLocalData("visualizer", !visualizer);
    setVisualizer(!visualizer);
  };

  const onPlayer = () => {
    changeLocalData("player", !player);
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
    changeLocalData("canvasId", temp);
  };

  const onColorPreset = () => {
    let temp = 0;
    if (colorPreset + 1 < colorPresets.length) {
      temp = colorPreset + 1;
    } else {
      temp = 0;
    }
    setColorPreset(temp);
    changeLocalData("colorId", temp);
  };

  //Wallpaper Engine Stuff
  const [filter, setFilter] = React.useState("0,0,0");
  const [playerColor, setPlayerColor] = React.useState("236, 75, 153");
  const [playerOpacity, setPlayerOpacity] = React.useState(0.5);
  const [filterOpacity, setFilterOpacity] = React.useState(0.5);
  const [textSize, setTextSize] = React.useState(10);
  const [uiVolume, setUiVolume] = React.useState(0.3);
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

  const changeLocalData = (x, y) => {
    let localData = JSON.parse(localStorage.getItem("oshi-04"));
    localData[x] = y;
    localStorage.setItem("oshi-04", JSON.stringify(localData));
  };

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
        setPlayer(localData.player);
        setVisualizer(localData.visualizer);
        setCanvasId(localData.canvasId);
        setBgId(localData.bgId);
        setColorPreset(localData.colorId);
      } else {
        setPlayer(true);
        setVisualizer(true);
        setCanvasId(2);
        setBgId(0);
        setColorPreset(0);
        localStorage.setItem(
          "oshi-04",
          JSON.stringify({
            player: true,
            visualizer: true,
            canvasId: 2,
            bgId: 0,
            colorId: 0,
          })
        );
      }
    }, []);
  } catch (e) {
    setPlayer(true);
    setVisualizer(true);
    setCanvasId(2);
    localStorage.setItem(
      "oshi-04",
      JSON.stringify({
        player: true,
        visualizer: true,
        canvasId: 2,
        bgId: 0,
        colorId: 0,
      })
    );
  }

  return (
    <div className="h-screen w-screen">
      <img
        src={`./assets/background/${imagePresets[bgId]}.png`}
        className="absolute h-full w-full object-fill"
        alt=""
      />
      {Array.isArray(bgData) && bgData.length ? (
        <img alt="" src={imageDisplay} className="absolute h-full w-full" />
      ) : null}
      <div
        className="absolute w-full h-full"
        style={{ backgroundColor: `rgb(${filter})`, opacity: filterOpacity }}
      ></div>
      {visualizer ? (
        <AudioVisualizer
          playerColor={playerColor}
          playerOpacity={playerOpacity}
          colorPreset={colorPreset}
          colorHex={colorHex}
        />
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
        onColorPreset={onColorPreset}
        colorPresets={colorPresets[colorPreset]}
      />
      <Visualizer
        textSize={textSize}
        playerColor={playerColor}
        colorPreset={colorPreset}
        colorHex={colorHex}
        player={player}
        playerOpacity={playerOpacity}
        uiVolume={uiVolume}
        customBg={customBg}
      />
    </div>
  );
};

export default Main;
