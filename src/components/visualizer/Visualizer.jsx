import React from "react";
import SongData from "../SongData.json";
import VisualizerCanvas from "./VisualizerCanvas";
import AudioVisualizer from "./AudioVisualizer";

const Visualizer = () => {
  const [isActive, setIsActive] = React.useState(true);
  const [songId, setSongId] = React.useState(0);
  const [repeat, setRepeat] = React.useState(false);
  const [shuffle, setShuffle] = React.useState(false);

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
        onSkip();
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
  };

  const onPrev = () => {
    if (songId - 1 >= 0) {
      setSongId(songId - 1);
    } else {
      setSongId(SongData["songs"].length - 1);
    }
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
    }
  }, [isPlaying]);

  React.useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(`${SongData["songs"][songId].music}`);
    console.log(SongData["songs"][songId].music);
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
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, [songId]);

  //Static Section
  const VisualizerText = () => (
    <>
      <p
        className="song-title mt-14 ml-5 font-medium text-white"
        style={{ fontSize: `7rem` }}
      >
        {isActive ? SongData["songs"][songId].name : null}
      </p>
      <p
        className="font-extrathin mt-10 ml-5 text-white"
        style={{ fontSize: "2rem" }}
      >
        {isActive ? SongData["songs"][songId].artist : null}
      </p>
    </>
  );

  const VisualizerControls = () => (
    <div className="h-2/5 flex relative opacity-80 visualizer-controls w-3/5 top-1/4">
      <div className=" h-5/6 w-auto">
        <img
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
    </div>
  );
  return (
    <div className="h-full w-full visualizer">
      <VisualizerCanvas />
      <AudioVisualizer />
      <input
        className="absolute w-2/3"
        style={{ left: "16.65%", top: "43.2%" }}
        type="range"
        step="1"
        min="0"
        value={trackProgress}
        max={duration ? duration : `${duration}`}
        onChange={(e) => onScrub(e.target.value)}
        onMouseUp={onScrubEnd}
        onKeyUp={onScrubEnd}
      />
      <div
        className="visualizer-container text-3xl bg-indigo-500 rounded-sm absolute h-1/4 w-2/3 flex"
        style={{ left: "16.65%", top: "46%" }}
      >
        <div className="h-full" style={{ width: "23%" }}>
          <img
            className="h-full w-full"
            src="./assets/images/Idol.png"
            alt=""
          />
        </div>
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-2/3">
            <VisualizerText />
          </div>
          <div className="w-full h-1/3">
            <VisualizerControls />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
