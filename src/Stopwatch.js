import React, { useState, useEffect } from "react";

const Stopwatch = ({ stopStoper }) => {
  const [time, setTime] = useState({
    milliseconds: 0,
    seconds: 0,
    minutes: 0,
  });

  const [timeStorage, setTimeStorage] = useState({
    milliseconds: 0,
    seconds: 0,
    minutes: 0,
  });

  //Converting real-time and local storage time to milliseconds
  const convertTimeToMilliseconds = () => {
    const convertStorageTime =
      timeStorage.milliseconds +
      timeStorage.seconds * 100 +
      timeStorage.minutes * 6000;

    const convertRealTime =
      time.milliseconds + time.seconds * 100 + time.minutes * 6000;

    //If real-time is less than local storage time or local storage time is equal to zero, set a new time
    if (convertRealTime < convertStorageTime || convertStorageTime === 0) {
      localStorage.setItem("time", JSON.stringify(time));
      setTimeStorage(JSON.parse(localStorage.getItem("time")));
    }
  };

  useEffect(() => {
    let timeId;

    if (localStorage.length === 0)
      localStorage.setItem("time", JSON.stringify(timeStorage));
    setTimeStorage(JSON.parse(localStorage.getItem("time")));
    //stopStoper is the equivalent of ending the game(tenzin in App). If it ends, setInterval should stop, and if there's a new game, setInterval should start again.
    if (!stopStoper) {
      //Resetting the stopwatcher with each new game
      setTime({
        milliseconds: 0,
        seconds: 0,
        minutes: 0,
      });

      //Adding 1 every 10 milliseconds
      timeId = setInterval(() => {
        setTime((prevState) => ({
          ...prevState,
          milliseconds: prevState.milliseconds + 1,
        }));
      }, 10);
    } else {
      clearInterval(timeId);
      convertTimeToMilliseconds();
    }

    return () => clearInterval(timeId);
  }, [stopStoper]);

  //Using a second useEffect to convert milliseconds to seconds and minutes.
  useEffect(() => {
    if (time.milliseconds === 100) {
      setTime((prevState) => ({
        ...prevState,
        seconds: prevState.seconds + 1,
        milliseconds: 0,
      }));
    }

    if (time.seconds === 60) {
      setTime((prevState) => ({
        ...prevState,
        minutes: prevState.minutes + 1,
        seconds: 0,
      }));
    }
  }, [time]);

  // Function to format time for display
  const formatTime = (format) => {
    const minutes = format.minutes < 10 ? `0${format.minutes}` : format.minutes;
    const seconds = format.seconds < 10 ? `0${format.seconds}` : format.seconds;
    const milliseconds =
      format.milliseconds < 10
        ? `0${format.milliseconds}`
        : format.milliseconds;

    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <div className="stopwatch">
      <h2 className="real-time">Time: {formatTime(time)}</h2>
      <h2>Your record: {formatTime(timeStorage)}</h2>
    </div>
  );
};

export default Stopwatch;
