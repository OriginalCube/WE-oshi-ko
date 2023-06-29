import React from "react";
import SongData from "./SongData.json";

const Playlist = (props) => {
  const SongTitle = (e) => (
    <div className="h-14 flex items-center justify-center">
      <p
        className={`m-auto text-white opacity-70 h-full w-full ${
          e.index === 4 || e.index === 7 || e.index === 10
            ? "border-b-2 border-white"
            : ""
        }
        ${e.index === 1 ? "border-t-2 border-white" : ""}
        `}
        onClick={() => props.changeSong(e.index - 1)}
        style={{ fontSize: `${0.1 * (e.textSize * e.baseSize)}rem` }}
      >
        {e.index}. {e.name}
      </p>{" "}
    </div>
  );
  return (
    <div className="flex flex-col w-4/5 m-auto h-auto">
      {SongData["songs"].map((e, index) => (
        <SongTitle
          name={e.name}
          index={index + 1}
          textSize={props.textSize}
          baseSize={props.baseSize}
          key={index}
        />
      ))}
    </div>
  );
};

export default Playlist;
