import React, { useState } from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import {
  searchIcon,
  calendarIcon,
  reportsIcon,
  projectsIcon,
} from "../../../utils/ImportingImages/ImportingImages";

const animatedComponents = makeAnimated();

const ReportsFilter = () => {
  const members = [
    { label: "John", value: 1 },
    { label: "Alice", value: 2 },
    { label: "Bob", value: 3 },
    { label: "Eva", value: 4 },
    { label: "Greg", value: 5 },
    { label: "Hannah", value: 6 },
  ];

  const teams = [
    { label: "Team Satish", value: 1 },
    { label: "GST Team", value: 2 },
    { label: "ITR Team", value: 3 },
    { label: "Tax Consulting Team", value: 4 },
  ];

  const jobs = [
    { label: "Tax Filling for XYZ", value: 1 },
    { label: "GST Reports for NN", value: 2 },
    { label: "Ptech Law Suit", value: 3 },
    { label: "Neon Home Loan Report", value: 4 },
    { label: "NN Tax Consultation Report", value: 5 },
  ];

  const status = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const [options, setOptions] = useState({
    members,
    jobs,
    status,
    teams,
  });

  const [dates, setDates] = useState({
    rangeStartDate: null,
    rangeEndDate: null,
  });

  // code for adding date picker from Ant Design
  const { RangePicker } = DatePicker;

  const onRangeChange = (dates) => {
    if (dates) {
      let rangeDates = [];
      dates.map((date) => {
        rangeDates.push(date.$d);
      });
      let startingDate = rangeDates[0];
      let endingDate = rangeDates[1];

      setDates((prev) => ({
        ...prev,
        rangeStartDate: startingDate,
        rangeEndDate: endingDate,
      }));
    } else {
      setDates((prev) => ({
        ...prev,
        rangeStartDate: new Date(),
        rangeEndDate: new Date(),
      }));
    }
  };

  // this code is used to define the date range in Datepicker of Ant design
  const rangePresets = [
    {
      label: "Last 7 Days",
      value: [dayjs().add(-7, "d"), dayjs()],
    },
    {
      label: "Last 14 Days",
      value: [dayjs().add(-14, "d"), dayjs()],
    },
    {
      label: "Last 30 Days",
      value: [dayjs().add(-30, "d"), dayjs()],
    },
    {
      label: "Last 90 Days",
      value: [dayjs().add(-90, "d"), dayjs()],
    },
    {
      label: "Last 1 Year",
      value: [dayjs().add(-365, "d"), dayjs()],
    },
  ];

  return (
    <div className="mr-40 ml-30 mt-5 mb-15 d-flex justify-content-between align-items-center gap-4">
      <div className="relative-wrapper flex-1">
        <img className="search-icon" src={searchIcon} alt="search-icon" />
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={options.members}
          //   onChange={(member) => {
          //     setUpdatedTeamData((prev) => ({
          //       ...prev,
          //       teamMembersName: member,
          //     }));
          //   }}
          //   value={updatedTeamData.teamMembersName}
          placeholder="Select Employee"
          className="react-select-custom-styling__container"
          classNamePrefix="react-select-custom-styling"
        />
      </div>
      <div className="relative-wrapper flex-1">
        <img className="search-icon" src={calendarIcon} alt="search-icon" />
        <Space direction="vertical">
          <RangePicker
            presets={rangePresets}
            onChange={onRangeChange}
            onRemove={onRangeChange}
            className="react-select-custom-styling__control"
          />
        </Space>
      </div>
 
      <div className="relative-wrapper flex-1">
        <img className="search-icon" src={projectsIcon} alt="search-icon" />
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={options.jobs}
          //   onChange={(member) => {
          //     setUpdatedTeamData((prev) => ({
          //       ...prev,
          //       teamMembersName: member,
          //     }));
          //   }}
          //   value={updatedTeamData.teamMembersName}
          placeholder="Select Job"
          className="react-select-custom-styling__container"
          classNamePrefix="react-select-custom-styling"
        />
      </div>
      <div className="relative-wrapper flex-1">
        <img className="search-icon" src={searchIcon} alt="search-icon" />
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={options.teams}
          //   onChange={(member) => {
          //     setUpdatedTeamData((prev) => ({
          //       ...prev,
          //       teamMembersName: member,
          //     }));
          //   }}
          //   value={updatedTeamData.teamMembersName}
          placeholder="Select Team"
          className="react-select-custom-styling__container"
          classNamePrefix="react-select-custom-styling"
        />
      </div>
      <div className="relative-wrapper flex-1">
        <img className="search-icon" src={reportsIcon} alt="search-icon" />
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={options.status}
          //   onChange={(member) => {
          //     setUpdatedTeamData((prev) => ({
          //       ...prev,
          //       teamMembersName: member,
          //     }));
          //   }}
          //   value={updatedTeamData.teamMembersName}
          placeholder="Select Status"
          className="react-select-custom-styling__container"
          classNamePrefix="react-select-custom-styling"
        />
      </div>
      <button className="custom-btn d-flex justify-content-center align-items-center gap-2">
        Generate Report
      </button>
    </div>
  );
};

export default ReportsFilter;
