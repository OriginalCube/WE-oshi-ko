import React from "react";
import SongData from "../SongData.json";

const Visualizer = () => {
  const [isActive, setIsActive] = React.useState(true);
  const [songId, setSongId] = React.useState(0);

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
  }, []);

  //Static Section
  const VisualizerText = () => (
    <>
      <p
        className="song-title mt-16 ml-5 font-medium text-white"
        style={{ fontSize: `7rem` }}
      >
        {isActive ? SongData["songs"][songId].name : null}
      </p>
      <p
        className="font-extrathin mt-8 ml-5 text-white"
        style={{ fontSize: "2rem" }}
      >
        {isActive ? SongData["songs"][songId].artist : null}
      </p>
    </>
  );

  const VisualizerControls = () => (
    <div className="h-2/3 flex relative opacity-80 visualizer-controls w-3/5 top-1/5">
      <div className=" h-5/6 w-auto">
        <img
          className="w-full h-full"
          src="./assets/icons/playlist.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img className="w-full h-full" src="./assets/icons/replay.png" alt="" />
      </div>

      <div className=" h-5/6 w-auto">
        <img
          className="w-full h-full"
          src="./assets/icons/volumeMinus.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          className="w-full h-full"
          src="./assets/icons/backward.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img className="w-full h-full" src="./assets/icons/play.png" alt="" />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          className="w-full h-full"
          src="./assets/icons/forward.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          className="w-full h-full"
          src="./assets/icons/volumePlus.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          className="w-full h-full"
          src="./assets/icons/shuffle.png"
          alt=""
        />
      </div>
    </div>
  );
  return (
    <div className="h-full w-full visualizer">
      <div
        className="absolute w-2/3 bg-indigo-500"
        style={{ left: "16.65%", height: "3px", top: "44%" }}
      ></div>
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
        className="visualizer-container text-3xl bg-indigo-500 rounded-sm absolute h-1/3 w-2/3 flex"
        style={{ left: "16.65%", top: "46%" }}
      >
        <div className="h-full" style={{ width: "28%" }}>
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
