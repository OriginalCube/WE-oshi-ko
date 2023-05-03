import React from "react";

const VisualizerControl = (props) => {
  return (
    <div className="h-2/5 flex relative opacity-80 visualizer-controls w-3/5 top-1/4 overflow-visible">
      <div className=" h-5/6 w-auto">
        <img
          onClick={props.onPlaylist}
          className="w-full h-full"
          src="./assets/icons/playlist.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={props.onRepeat}
          className="w-full h-full"
          src={`./assets/icons/${props.repeat ? "replayToggle" : "replay"}.png`}
          alt=""
        />
      </div>

      <div className=" h-5/6 w-auto">
        <img
          onClick={props.lessVolume}
          className="w-full h-full"
          src="./assets/icons/volumeMinus.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={props.onPrev}
          className="w-full h-full"
          src="./assets/icons/backward.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={props.onPlay}
          className="w-full h-full"
          src={`./assets/icons/${props.isPlaying ? "play" : "pause"}.png`}
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={props.onSkip}
          className="w-full h-full"
          src="./assets/icons/forward.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={props.addVolume}
          className="w-full h-full"
          src="./assets/icons/volumePlus.png"
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={props.onShuffle}
          className="w-full h-full"
          src={`./assets/icons/${
            props.shuffle ? "shuffleToggle" : "shuffle"
          }.png`}
          alt=""
        />
      </div>
      <div className=" h-5/6 w-auto">
        <img
          onClick={props.onLock}
          className="w-full h-full"
          src={`./assets/icons/padlock.png`}
          alt=""
        />
      </div>
    </div>
  );
};

export default VisualizerControl;
