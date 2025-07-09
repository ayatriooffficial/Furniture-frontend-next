"use client";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "../Features/Slices/formSlice";
const Datetime = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  const dispatch = useDispatch();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const handleDateChange = (date) => {
    setSelectedDay(date);
  };

  const tileDisabled = ({ date, view }) => {
    const today = new Date();
    return date < today;
  };

  const cancelSelection = () => {
    alert("Selection canceled");
  };

  const submitSelection = () => {
    if (selectedDay) {
      const selectedDate = selectedDay.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const selectedSchedule = selectedTime || currentTime;
      dispatch(
        updateFormData({ selectedDate, selectedTime: selectedSchedule })
      );
      alert(`Date: ${selectedDate}\nTime: ${selectedTime || currentTime}`);
    } else {
      alert("Please select a day.");
    }
  };

  return (
    <div
      className="flex flex-row w-160 justify-center"
      style={{ display: "flex" }}
    >
      <div className="flex flex-col w-80 border border-gray-300 rounded overflow-hidden">
        <Calendar
          onChange={handleDateChange}
          value={selectedDay}
          className="custom-calendar"
          tileDisabled={tileDisabled}
        />
      </div>
      <div
        className="flex w-80  flex-col items-center justify-center border border-solid border-black"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "320px",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <div
          className="flex flex-col items-center mt-auto mb-8"
          style={{ display: "flex", flexDirection: "column", gap: "30px" }}
        >
          <label htmlFor="time" className="mb-2">
            Select a time:
          </label>
          <input
            type="time"
            id="time"
            value={selectedTime || currentTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-between mt-auto self-end">
          <button
            className="p-2 bg-gray-300 hover:bg-gray-400 rounded"
            onClick={cancelSelection}
          >
            Cancel
          </button>
          <button
            className="p-2 ml-2 bg-green-500 text-white hover:bg-green-600 rounded"
            onClick={submitSelection}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Datetime;
