import React, { useState } from "react";

const TimePickerEditSection = ({ onChange, existingTime }) => {
  // States for hours, minutes,period ans seconds
  const [selectedHour, setSelectedHour] = useState(() => {
    if (existingTime) {
      const [hour24, minute, period] = existingTime.split(":");
      const hour12 = hour24 % 12 || 12;
      return `${hour12}`.padStart(2, "0");
    } else {
      return "01";
    }
  });
  const [selectedMinute, setSelectedMinute] = useState(
    existingTime ? existingTime.split(":")[1] : "00"
  );
  const [selectedPeriod, setSelectedPeriod] = useState(
    existingTime && parseInt(existingTime.split(":")[0]) >= 12 ? "PM" : "AM"
  );
  const selectedSeconds = "00";

  // Handing function for hours
  const handleHourChange = (e) => {
    const newHour = e.target.value;
    setSelectedHour(newHour);
    onChange(convertTo24HourFormat(newHour, selectedMinute, selectedPeriod));
  };
  // Handing function for Minutes
  const handleMinuteChange = (e) => {
    const newMinute = e.target.value;
    setSelectedMinute(newMinute);
    onChange(convertTo24HourFormat(selectedHour, newMinute, selectedPeriod));
  };
  // Function to convert 12-hour time to 24-hour format
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
      convertedHour < 10 ? `0${convertedHour}` : convertedHour;
    const formattedMinute = minute < 10 ? `${minute}` : minute;

    return `${formattedHour}:${formattedMinute}:${selectedSeconds}`;
  };

  return (
    <div className="d-flex gap-1">
      {/* hour selection section  */}
      <label>
        <select
          value={selectedHour}
          onChange={handleHourChange}
          style={{ width: "fit-content" }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
            <option key={hour} value={hour < 10 ? `0${hour}` : `${hour}`}>
              {hour < 10 ? `${hour}` : hour}
            </option>
          ))}
        </select>
      </label>
      {/* Minutes selection section  */}
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
      {/* Period selection section  */}
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
      {/* <label>
        Time:
        {convertTo24HourFormat(selectedHour, selectedMinute, selectedPeriod)}
        <br />
        {selectedHour}: {selectedMinute} : {selectedSeconds}
      </label> */}
    </div>
  );
};

export default TimePickerEditSection;
