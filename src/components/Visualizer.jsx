import React from "react";

const Visualizer = () => {
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
      />
      <div
        className="visualizer-container text-3xl bg-indigo-500 rounded-sm absolute h-1/3 w-2/3 flex"
        style={{ left: "16.65%", top: "46%" }}
      >
        <div className="h-full" style={{ width: "25%" }}>
          <img
            className="h-full w-full"
            src="./assets/images/Idol.png"
            alt=""
          />
        </div>
        <div className="border-2 border-red-500">
          <p className="font-medium" style={{ fontSize: `8rem` }}>
            Title
          </p>
          <p className="" style={{ fontSize: "2rem" }}>
            Artist
          </p>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
