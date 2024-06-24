import React, { useState, useEffect } from "react";

const TimePickerSection = ({ onChange }) => {
  const getCurrentTime = () => {
    const now = new Date();
    let hour = now.getHours();
    const minute = now.getMinutes();
    const period = hour >= 12 ? "PM" : "AM";

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    return [
      hour < 10 ? `0${hour}` : `${hour}`,
      minute < 10 ? `0${minute}` : `${minute}`,
      period,
    ];
  };

  const [initialHour, initialMinute, initialPeriod] = getCurrentTime();

  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);
  const selectedSeconds = "00";

  useEffect(() => {
    onChange(convertTo24HourFormat(initialHour, initialMinute, initialPeriod));
  }, []);

  // Handling function for hours
  const handleHourChange = (e) => {
    const newHour = e.target.value;
    setSelectedHour(newHour);
    onChange(convertTo24HourFormat(newHour, selectedMinute, selectedPeriod));
  };

  // Handling function for minutes
  const handleMinuteChange = (e) => {
    const newMinute = e.target.value;
    setSelectedMinute(newMinute);
    onChange(convertTo24HourFormat(selectedHour, newMinute, selectedPeriod));
  };

  // Handling function for period
  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    setSelectedPeriod(newPeriod);
    onChange(convertTo24HourFormat(selectedHour, selectedMinute, newPeriod));
  };

  // Function to convert 12-hour time to 24-hour format
  const convertTo24HourFormat = (hour, minute, period) => {
    let convertedHour = parseInt(hour, 10);
    if (period === "PM" && convertedHour !== 12) {
      convertedHour += 12;
    } else if (period === "AM" && convertedHour === 12) {
      convertedHour = 0;
    }

    const formattedHour =
      convertedHour < 10 ? `0${convertedHour}` : `${convertedHour}`;
    const formattedMinute = minute;

    return `${formattedHour}:${formattedMinute}:${selectedSeconds}`;
  };

  return (
    <div className="d-flex gap-1">
      <label>
        <select
          value={selectedHour}
          onChange={handleHourChange}
          style={{ width: "fit-content" }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
            <option key={hour} value={hour < 10 ? `0${hour}` : `${hour}`}>
              {hour}
            </option>
          ))}
        </select>
      </label>

      <label>
        <select
          style={{ width: "fit-content" }}
          value={selectedMinute}
          onChange={handleMinuteChange}
        >
          {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
            <option
              key={minute}
              value={minute < 10 ? `0${minute}` : `${minute}`}
            >
              {minute < 10 ? `0${minute}` : minute}
            </option>
          ))}
        </select>
      </label>

      <label>
        <select
          style={{ width: "fit-content" }}
          value={selectedPeriod}
          onChange={handlePeriodChange}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </label>
    </div>
  );
};

export default TimePickerSection;
