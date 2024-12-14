"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (360 / 12) * (hours % 12); // 360 degrees / 12 hours
  const minuteDeg = (360 / 60) * minutes; // 360 degrees / 60 minutes
  const secondDeg = (360 / 60) * seconds; // 360 degrees / 60 seconds

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black">
      <main className="text-center">
        <h1 className="text-2xl font-bold text-gray-100 mb-8">Enhanced Circle Clock</h1>
        <div className="relative w-72 h-72 rounded-full border-[10px] border-white shadow-lg shadow-gray-800 bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
          {/* Tick Marks */}
          {[...Array(60)].map((_, i) => {
            const isHourTick = i % 5 === 0;
            const tickLength = isHourTick ? "h-4" : "h-2";
            const tickColor = isHourTick ? "bg-white" : "bg-gray-400";
            const angle = i * 6;
            return (
              <div
                key={i}
                className={`absolute w-[2px] ${tickLength} ${tickColor}`}
                style={{
                  transform: `rotate(${angle}deg) translate(0, -140px)`,
                }}
              ></div>
            );
          })}

          {/* Clock Numbers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i + 1) * 30; // Each number is 30 degrees apart
            const x = 50 + 40 * Math.cos((angle - 90) * (Math.PI / 180)); // X position
            const y = 50 + 40 * Math.sin((angle - 90) * (Math.PI / 180)); // Y position
            return (
              <div
                key={i}
                className="absolute text-lg font-bold text-white"
                style={{
                  top: `${y}%`,
                  left: `${x}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {i + 1}
              </div>
            );
          })}

          {/* Hour Hand */}
          <div
            className="absolute w-[4px] h-16 bg-red-500 rounded-full shadow-md shadow-red-500/50 origin-bottom"
            style={{ transform: `rotate(${hourDeg}deg)` }}
          ></div>

          {/* Minute Hand */}
          <div
            className="absolute w-[3px] h-20 bg-yellow-400 rounded-full shadow-md shadow-yellow-400/50 origin-bottom"
            style={{ transform: `rotate(${minuteDeg}deg)` }}
          ></div>

          {/* Second Hand */}
          <div
            className="absolute w-[2px] h-24 bg-green-500 rounded-full shadow-md shadow-green-500/50 origin-bottom"
            style={{ transform: `rotate(${secondDeg}deg)` }}
          ></div>

          {/* Center Circle with Time */}
          <div className="absolute w-20 h-20 bg-gray-800 rounded-full flex flex-col items-center justify-center text-white shadow-lg border-2 border-gray-600">
            <div className="text-xl font-bold">{String(hours).padStart(2, "0")}</div>
            <div className="text-sm font-medium">
              {String(minutes).padStart(2, "0")} : {String(seconds).padStart(2, "0")}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
