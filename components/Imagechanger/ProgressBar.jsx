
import React, { useState, useEffect } from "react";

const ProgressBar = ({ progress }) => {
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [progress3, setProgress3] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress1((prevProgress) =>
        prevProgress >= 100 ? 100 : prevProgress + 1
      );

      if (progress1 === 100) {
        setProgress2((prevProgress) =>
          prevProgress >= 100 ? 100 : prevProgress + 1
        );
      }

      if (progress2 === 100 && progress1 === 100) {
        setProgress3((prevProgress) =>
          prevProgress >= 100 ? 100 : prevProgress + 1
        );
      }
      const progress = {
        progress1,
        progress2,
        progress3,
      };
    }, 30);

    return () => clearInterval(interval);
  }, [progress1, progress2, progress3]);

  return (
    <div className=" absolute top-0 left-0 w-full h-5 z-20 flex justify-center gap-2 items-center">
      <div className="progressContainer1 bg-white w-1/5 rounded-lg h-2">
        <div
          className="progressLine rounded-lg bg-slate-600 h-full"
          style={{ width: `${progress1}%` }}
        ></div>
      </div>
      <div className="progressContainer2 bg-white w-1/5 rounded-lg h-2">
        <div
          className="progressLine rounded-lg bg-slate-600 h-full"
          style={{ width: `${progress2}%` }}
        ></div>
      </div>
      <div className="progressContainer3 bg-white w-1/5 rounded-lg h-2">
        <div
          className="progressLine rounded-lg bg-slate-600 h-full"
          style={{ width: `${progress3}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
