import React from "react";
import SongData from "../SongData.json";

const Playlist = (props) => {
  const SongTitle = (e) => (
    <div className="h-full">
      <p
        className="m-auto text-white opacity-70 border-b-2 border-white"
        onClick={() => props.changeSong(e.index - 1)}
        style={{ fontSize: `${props.textSize * 0.1}rem` }}
      >
        {e.index}. {e.name}
      </p>{" "}
    </div>
  );
  return (
    <div className="flex flex-col w-4/5 m-auto overflow-hidden">
      {SongData["songs"].map((e, index) => (
        <SongTitle name={e.name} index={index + 1} key={index} />
      ))}
    </div>
  );
};

export default Playlist;
