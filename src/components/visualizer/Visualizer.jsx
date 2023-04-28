import React from "react";
import SongData from "../SongData.json";
import VisualizerCanvas from "./VisualizerCanvas";
import AudioVisualizer from "./AudioVisualizer";
import Playlist from "./Playlist";
import Navigation from "./Navigation";

const Visualizer = () => {
  const [isActive, setIsActive] = React.useState(true);
  const [songId, setSongId] = React.useState(0);
  const [repeat, setRepeat] = React.useState(false);
  const [shuffle, setShuffle] = React.useState(false);
  const [background, setBackground] = React.useState([]);
  const [backgroundColor, setBackgroundColor] = React.useState("");
  const [backgroundId, setBackgroundId] = React.useState(0);
  const [bgOpacity, setBgOpacity] = React.useState(0.5);
  const [playerColor, setPlayerColor] = React.useState("236, 72, 153");
  const [playerOpacity, setPlayerOpacity] = React.useState(0.5);
  const [pbOpacity, setPbOpacity] = React.useState(0.5);
  const [textSize, setTextSize] = React.useState(10);
  const [mainImage, setMainImage] = React.useState("");
  const [songName, setSongName] = React.useState("");
  const [artistName, setArtistName] = React.useState("");
  const [lockBg, setLockBg] = React.useState(false);
  const [playlist, setPlaylist] = React.useState(false);
  const [playerBg, setPlayerBg] = React.useState("236, 72, 153");
  //Settings
  const [player, setPlayer] = React.useState(true);
  const [petalsAnim, setPetalsAnim] = React.useState(true);

  //Wallpaper Engine Properties
  window.wallpaperPropertyListener = {
    userDirectoryFilesAddedOrChanged: function (propertyName, changedFiles) {
      setBackground(changedFiles);
    },

    applyUserProperties: (properties) => {
      if (properties.backgroundcolor) {
        let customColor = properties.backgroundcolor.value.split(" ");
        customColor = customColor.map(function (c) {
          return Math.ceil(c * 255);
        });
        setBackgroundColor(customColor);
      }

      if (properties.playercolor) {
        let customColor = properties.playercolor.value.split(" ");
        customColor = customColor.map(function (c) {
          return Math.ceil(c * 255);
        });
        setPlayerColor(customColor);
      }

      if (properties.playeropacity) {
        console.log(properties.playeropacity);
        setPlayerOpacity(properties.playeropacity.value / 10);
      }

      if (properties.backgroundopacity) {
        setBgOpacity(properties.backgroundopacity.value / 10);
      }

      if (properties.playerbarsopacity) {
        setPbOpacity(properties.playerbarsopacity.value / 10);
      }

      if (properties.textsize) {
        setTextSize(properties.textsize.value);
      }
    },
  };

  React.useEffect(() => {
    const rawData = `rgb(${playerColor})`;
    let cleanData = "";
    for (let i = 4; i < rawData.length - 1; i++) {
      cleanData += rawData[i];
    }
    let rgbArray = [];
    rgbArray = cleanData.split(",");

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    setPlayerBg(
      rgbToHex(
        parseInt(rgbArray[0]),
        parseInt(rgbArray[1]),
        parseInt(rgbArray[2])
      )
    );
  }, [playerColor]);

  try {
    function wallpaperMediaThumbnailListener(event) {
      //media
      //console.log(event);
      if (isPlaying) {
        setMainImage(event.thumbnail);
      }
    }

    // Register the media thumbnail listener provided by Wallpaper Engine. pictures
    window.wallpaperRegisterMediaThumbnailListener(
      wallpaperMediaThumbnailListener
    );

    function wallpaperMediaPropertiesListener(event) {
      // Update title and artist labels
      console.log(event.title, event.artist);
      if (isPlaying) {
        setSongName(event.title);
        setArtistName(event.artist);
      }
    }
    window.wallpaperRegisterMediaPropertiesListener(
      wallpaperMediaPropertiesListener
    );
  } catch (e) {
    //
  }

  React.useEffect(() => {
    setBackgroundId(0);
  }, [background]);

  //DRY
  let keypress = new Audio();
  const [isPlaying, setPlaying] = React.useState(false);
  const [trackProgress, setProgress] = React.useState(0);
  const [volume, setVolume] = React.useState(
    localStorage.getItem("volume") !== null
      ? +localStorage.getItem("volume")
      : 0.2
  );

  const intervalRef = React.useRef();
  const audioRef = React.useRef(new Audio());
  const isReady = React.useRef(true);
  const { duration } = audioRef.current;

  const clickAudio = (e) => {
    keypress.src = `./assets/audios/${e === 0 ? "keypress" : "notes"}.mp3`;
    keypress.volume = 0.5;
    keypress.play();
  };

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        if (repeat) {
          audioRef.current.play();
        } else {
          onSkip();
        }
      } else {
        setProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  const onScrub = (value) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    setPlaying(false);
    startTimer();
  };

  const onPlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
    clickAudio(1);
  };

  const onShuffle = () => {
    if (!shuffle) {
      setRepeat(false);
    }
    setShuffle(!shuffle);
    clickAudio(0);
  };

  const onRepeat = () => {
    if (!repeat) {
      setShuffle(false);
    }
    setRepeat(!repeat);
    clickAudio(0);
  };

  const onSkip = () => {
    if (songId + 1 < SongData["songs"].length) {
      setSongId(songId + 1);
    } else {
      setSongId(0);
    }
    clickAudio(0);
  };

  const onPrev = () => {
    if (songId - 1 >= 0) {
      setSongId(songId - 1);
    } else {
      setSongId(SongData["songs"].length - 1);
    }
    clickAudio(0);
  };

  const lessVolume = () => {
    if (volume - 0.1 > 0) {
      setVolume(Math.round((volume - 0.1) * 10) / 10);
    } else {
      setVolume(0);
    }
    clickAudio(0);
  };

  const addVolume = () => {
    if (volume >= 0 && volume + 0.1 <= 1) {
      setVolume(volume + 0.1);
    }
    clickAudio(0);
  };

  const onPlaylist = () => {
    setPlaylist(!playlist);
    clickAudio(0);
  };

  const onLock = () => {
    setLockBg(!lockBg);
    clickAudio(0);
  };

  const changeSong = (e) => {
    setSongId(e);
    clickAudio(1);
  };

  const onPlayer = () => {
    setPlayer(!player);
    if (isPlaying) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const onPetal = () => {
    setPetalsAnim(!petalsAnim);
  };

  const customBg = () => {
    if (lockBg) {
      if (backgroundId + 1 < background.length) {
        setBackgroundId(backgroundId + 1);
      } else {
        setBackgroundId(0);
      }
    }
  };

  React.useEffect(() => {
    audioRef.current.volume = volume;
    localStorage.setItem("volume", volume);
  }, [volume]);

  React.useEffect(() => {
    if (isPlaying) {
      audioRef.current.pause();
      startTimer();
    } else {
      audioRef.current.play();
      setMainImage(SongData["songs"][songId].image);
      setSongName(SongData["songs"][songId].name);
      setArtistName(SongData["songs"][songId].artist);
    }
  }, [isPlaying]);

  React.useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(`${SongData["songs"][songId].music}`);
    audioRef.current.volume = volume;
    customBg();
    setMainImage(SongData["songs"][songId].image);
    setSongName(SongData["songs"][songId].name);
    setArtistName(SongData["songs"][songId].artist);

    if (isReady.current) {
      audioRef.current.play();
      setPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
    setPlaying(audioRef.isPlaying);
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, [songId]);

  React.useState(() => {
    if (localStorage.getItem("volume")) {
      setVolume(parseInt(localStorage.getItem("volume")));
    }
  }, []);

  //Static Section
  const VisualizerText = () => (
    <>
      <p
        className="song-title font-semibold text-white opacity-80 spotify-regular overflow-visible"
        style={{
          fontSize: `${0.6 * textSize}rem`,
          marginTop: `${0.3 * textSize}rem`,
          marginLeft: `${0.125 * textSize}rem`,
        }}
      >
        {songName.substring(0, 12).toUpperCase()}
      </p>
      <p
        className="font-extrathin text-white opacity-70 spotify-regular"
        style={{
          fontSize: `${0.175 * textSize}rem`,
          marginTop: `${0.2 * textSize}rem`,
          marginLeft: `${0.125 * textSize}rem`,
        }}
      >
        {artistName.substring(0, 15).toUpperCase()}
      </p>
    </>
  );

  const VisualizerControls = () => (
    <div className="h-2/5 flex relative opacity-80 visualizer-controls w-3/5 top-1/4 overflow-visible">
      <div className=" h-5/6 w-auto">
        <img
          onClick={onPlaylist}
          className="w-full h-full"
          src="./assets/icons/playlist.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={onRepeat}
          className="w-full h-full"
          src={`./assets/icons/${repeat ? "replayToggle" : "replay"}.png`}
          alt=""
        />
      </div>

      <div className=" h-5/6 w-auto">
        <img
          onClick={lessVolume}
          className="w-full h-full"
          src="./assets/icons/volumeMinus.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={onPrev}
          className="w-full h-full"
          src="./assets/icons/backward.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={onPlay}
          className="w-full h-full"
          src={`./assets/icons/${isPlaying ? "play" : "pause"}.png`}
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={onSkip}
          className="w-full h-full"
          src="./assets/icons/forward.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={addVolume}
          className="w-full h-full"
          src="./assets/icons/volumePlus.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={onShuffle}
          className="w-full h-full"
          src={`./assets/icons/${shuffle ? "shuffleToggle" : "shuffle"}.png`}
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={onLock}
          className="w-full h-full"
          src={`./assets/icons/padlock.png`}
          alt=""
        />
      </div>
    </div>
  );

  return (
    <div className="h-full w-full visualizer">
      {background.length !== 0 ? (
        <img
          className="w-full h-full absolute"
          alt={""}
          src={"file:///" + background[backgroundId]}
        />
      ) : null}
      <div
        className="absolute h-full w-full"
        style={{
          backgroundColor: `rgb(${backgroundColor})`,
          opacity: bgOpacity,
        }}
      ></div>
      {petalsAnim ? <VisualizerCanvas /> : null}
      <AudioVisualizer playerColor={playerBg} playerOpacity={pbOpacity} />
      <Navigation
        onVisualizer={onPetal}
        onPlayer={onPlayer}
        customBg={customBg}
      />
      {player ? (
        <input
          className="absolute w-2/3"
          style={{ left: "16.65%", top: "45.1%" }}
          type="range"
          step="1"
          min="0"
          value={trackProgress}
          max={duration ? duration : `${duration}`}
          onChange={(e) => onScrub(e.target.value)}
          onMouseUp={onScrubEnd}
          onKeyUp={onScrubEnd}
        />
      ) : null}
      <div
        className="visualizer-container text-3xl rounded-sm absolute w-2/3 flex"
        style={{
          left: "16.65%",
          top: "48%",
          height: "22%",
          backgroundColor: `rgba(${playerColor}, ${playerOpacity})`,
        }}
      >
        <div className="h-full" style={{ width: "22%" }}>
          {playlist ? (
            <Playlist playerColor={playerColor} changeSong={changeSong} />
          ) : (
            <img className="h-full w-full" src={mainImage} alt="" />
          )}
        </div>
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-2/3">
            <VisualizerText />
          </div>
          <div className="w-full h-1/3">
            {player ? <VisualizerControls /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
