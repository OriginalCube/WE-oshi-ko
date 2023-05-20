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

  const [background, setBackground] = React.useState([]);
  const [backgroundId, setBackgroundId] = React.useState(0);
  const [mainImage, setMainImage] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [songName, setSongName] = React.useState("");
  const [artistName, setArtistName] = React.useState("");
  const [mediaArt, setMediaArt] = React.useState("");

  React.useEffect(() => {
    console.log(filter);
  }, [filter]);



  React.useEffect(() => {
    setBackgroundId(0);
  }, [background]);

  React.useEffect(() => {
    setMainImage("file:///" + background[backgroundId]);
  }, [background, backgroundId]);

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

      //Audio Visualizer
    },
  };

  //Wallpaper Engine Media Integration
  // Register the media property listener provided by Wallpaper Engine.
  function wallpaperMediaPropertiesListener(event) {
    // Update title and artist labels
    setSongName(event.title);
    setArtistName(event.artist);
  }

  function wallpaperMediaThumbnailListener(event) {
    // Update album cover art
    setMediaArt(event.thumbnail);
  }

  React.useEffect(() => {
    console.log(songName + " " + artistName + " " + mediaArt);
  }, [songName, artistName, mediaArt]);

  window.wallpaperRegisterMediaPropertiesListener(
    wallpaperMediaPropertiesListener
  );

  // Register the media thumbnail listener provided by Wallpaper Engine.
  window.wallpaperRegisterMediaThumbnailListener(
    wallpaperMediaThumbnailListener
  );

  return (
    <div className="h-screen w-screen">
      {visualizer ? (
        <AudioVisualizer playerColor={"playerColor"} playerOpacity={0.5} />
      ) : null}
      <div
        className="absolute w-full h-full"
        style={{ backgroundColor: `black` }}
      ></div>

      {background ? <img alt="" src={mainImage} /> : null}
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
