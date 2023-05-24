import React from "react";

const Navigation = (props) => {
  const [setting, setSetting] = React.useState(false);
  const [uiVolume, setUiVolume] = React.useState(0.5);

  React.useEffect(() => {
    setUiVolume(props.uiVolume);
  }, [props.uiVolume]);

  let audioPlayer = new Audio();

  const canvasData = ["water", "broom"];

  const onSound = (e) => {
    if (e === 1) {
      audioPlayer.src = "./assets/audios/keypress.mp3";
    } else {
      audioPlayer.src = "./assets/audios/notes.mp3";
    }
    audioPlayer.volume = uiVolume;
    audioPlayer.play();
  };

  const onVisualizer = () => {
    props.onVisualizer();
    onSound(1);
  };

  const onPlayer = () => {
    props.onPlayer();
    onSound(1);
  };

  const customBg = () => {
    props.customBg();
    onSound(1);
  };

  const onRemoveVis = () => {
    props.onCanvas();
    onSound(1);
  };

  const onSetting = () => {
    setSetting(!setting);
    onSound(0);
  };

  return (
    <>
      <img
        onClick={onSetting}
        src="./assets/icons/setting.png"
        alt=""
        className="navigation-icon"
      />
      {setting ? (
        <div className="navigation-icon-container flex flex-col">
          <div className="h-full w-4/5 m-auto overflow-visible">
            <img
              onClick={onPlayer}
              src="./assets/icons/headphones.png"
              alt=""
            />
          </div>
          <div className="h-full w-full">
            <img onClick={onVisualizer} src="./assets/icons/sound.png" alt="" />
          </div>
          <div className="h-full w-full">
            <img
              onClick={customBg}
              src="./assets/icons/background.png"
              alt=""
            />
          </div>
          <div className="h-full w-full">
            <img
              onClick={onRemoveVis}
              src={`./assets/icons/${canvasData[props.canvasId]}.png`}
              alt=""
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Navigation;
