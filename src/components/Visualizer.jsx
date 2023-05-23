import React from "react";
import Playlist from "./visualizer/Playlist";
import VisualizerControls from "./VisualizerControl";
import SongData from "./SongData.json";

const Visualizer = (props) => {
  const [playlist, setplaylist] = React.useState(false);
  const [textSize, setTextSize] = React.useState(10);
  const [songName, setSongName] = React.useState("");
  const [artistName, setArtistName] = React.useState("");
  const [mainImage, setMainImage] = React.useState("");
  const [bgLock, setBgLock] = React.useState(false);

  React.useEffect(() => {
    setTextSize(props.textSize);
  }, [props.textSize]);

  //MUSIC SETTINGS
  const [songId, setSongId] = React.useState(
    Math.floor(SongData["songs"].length * Math.random())
  );
  const [isPlaying, setPlaying] = React.useState(true);
  const [trackProgress, setProgress] = React.useState(0);

  //Music SUB
  const [repeat, setRepeat] = React.useState(false);
  const [shuffle, setShuffle] = React.useState(false);

  const [volume, setVolume] = React.useState(
    localStorage.getItem("volume") !== null
      ? +localStorage.getItem("volume")
      : 0.2
  );
  const intervalRef = React.useRef();
  const audioRef = React.useRef(new Audio());
  const isReady = React.useRef(true);
  const { duration } = audioRef.current;

  const [uiVolume, setUiVolume] = React.useState(0.5);

  React.useEffect(() => {
    setUiVolume(props.uiVolume);
  }, [props.uiVolume]);

  let keypress = new Audio();
  const clickAudio = (e) => {
    keypress.src = `./assets/audios/${e === 0 ? "keypress" : "notes"}.mp3`;
    keypress.volume = uiVolume;
    keypress.play();
  };

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        if (repeat === true) {
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

  const onPrev = () => {
    if (songId - 1 >= 0) {
      setSongId(songId - 1);
    } else {
      setSongId(SongData["songs"].length - 1);
    }
    clickAudio(0);
  };

  const onSkip = () => {
    if (shuffle) {
      setSongId(Math.floor((SongData["songs"].length - 1) * Math.random()));
    } else {
      if (songId + 1 < SongData["songs"].length) {
        setSongId(songId + 1);
      } else {
        setSongId(0);
      }
    }
    if (!bgLock) {
      props.customBg();
    }
    clickAudio(0);
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

  const onRepeat = () => {
    if (!repeat) {
      setShuffle(false);
    }
    setRepeat(!repeat);
    clickAudio(0);
  };

  const onShuffle = () => {
    if (!shuffle) {
      setRepeat(false);
    }
    setShuffle(!shuffle);
    clickAudio(0);
  };

  const onPlaylist = () => {
    setplaylist(!playlist);
    clickAudio(0);
  };

  const onLock = () => {
    setBgLock(!bgLock);
    clickAudio(0);
  };

  const changeSong = (ev) => {
    setSongId(ev);
    clickAudio(1);
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
      setArtistName(SongData["songs"][songId].artist);
      setSongName(SongData["songs"][songId].name);
      setMainImage(SongData["songs"][songId].image);
    }
  }, [isPlaying]);

  React.useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(`${SongData["songs"][songId].music}`);
    setArtistName(SongData["songs"][songId].artist);
    setSongName(SongData["songs"][songId].name);
    setMainImage(SongData["songs"][songId].image);
    audioRef.current.volume = volume;
    if (isReady.current) {
      audioRef.current.play();
      setPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
    setPlaying(audioRef.isPlaying);
  }, [songId]);

  React.useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (props.player) {
      audioRef.current.play();
      setPlaying(false);
    } else {
      audioRef.current.pause();
      setPlaying(true);
    }
  }, [props.player]);

  //static section
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
        {artistName.substring(0, 12).toUpperCase()}
      </p>
    </>
  );

  //WE Album inputs
  function wallpaperMediaPropertiesListener(event) {
    // Update title and artist labels
    if (isPlaying) {
      setSongName(event.title);
      setArtistName(event.artist);
    }
  }

  function wallpaperMediaThumbnailListener(event) {
    // Update album cover art
    if (isPlaying) {
      setMainImage(event.thumbnail);
    }
  }

  try {
    // Register the media property listener provided by Wallpaper Engine.
    window.wallpaperRegisterMediaPropertiesListener(
      wallpaperMediaPropertiesListener
    );

    // Register the media thumbnail listener provided by Wallpaper Engine.
    window.wallpaperRegisterMediaThumbnailListener(
      wallpaperMediaThumbnailListener
    );
  } catch (e) {}

  return (
    <>
      <div
        className="absolute w-2/3"
        style={{
          left: "16.65%",
          top: "45.85%",
          borderBottom: `2px solid rgba(${props.playerColor}, ${props.playerOpacity})`,
        }}
      ></div>
      {props.player ? (
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
          backgroundColor: `rgba(${props.playerColor}, ${props.playerOpacity})`,
        }}
      >
        <div className="h-full" style={{ width: "22%" }}>
          {playlist ? (
            <Playlist textSize={textSize} changeSong={changeSong} />
          ) : (
            <img className="h-full w-full" src={mainImage} alt="" />
          )}
        </div>
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-2/3">
            <VisualizerText />
          </div>
          <div className="w-full h-1/3">
            {props.player ? (
              <VisualizerControls
                onPlay={onPlay}
                isPlaying={isPlaying}
                onSkip={onSkip}
                onPrev={onPrev}
                lessVolume={lessVolume}
                addVolume={addVolume}
                onShuffle={onShuffle}
                shuffle={shuffle}
                onRepeat={onRepeat}
                repeat={repeat}
                onPlaylist={onPlaylist}
                onLock={onLock}
              />
            ) : null}
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default Visualizer;
