import React from "react";
import SongData from "../SongData.json";

const Playlist = (props) => {
  const SongTitle = (e) => (
    <div className="h-full">
      <p
        className="m-auto text-white opacity-70 border-b-2 border-white"
        onClick={() => props.changeSong(e.index - 1)}
      >
        {e.index}. {e.name}
      </p>{" "}
    </div>
  );
  return (
    <div
      className="relative flex flex-col w-4/5 m-auto overflow-hidden"
      style={{ backgroundColor: props.playerColor }}
    >
      {SongData["songs"].map((e, index) => (
        <SongTitle name={e.name} index={index + 1} key={index} />
      ))}
    </div>
  );
};

export default Playlist;
