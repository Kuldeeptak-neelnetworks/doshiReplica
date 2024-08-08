import React, { useContext, useEffect, useState } from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";

import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../../templates/Breadcrumbs";
import {
  calendarIcon,
  settingsIcon1,
} from "../../../utils/ImportingImages/ImportingImages";

import styles from "../Logs.module.css";
import {
  formatDateTime,
  formatDateToYYYYMMDD,
} from "../../../utils/utilities/utilityFunctions";

const breadCrumbs = [
  {
    pageName: "Home",
    pageURL: "/dashboard",
  },
  {
    pageName: "Logs",
    pageURL: "/logs",
  },
];

const MemberOrTeamLeaderLogs = () => {
  const { getMyLogs, initialState } = useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const { RangePicker } = DatePicker;

  const [logsToShow, setLogsToShow] = useState([]);
  

  useEffect(() => {
    getMyLogs();
  }, []);

  useEffect(() => {
    const logs = initialState.myLogs.map(({ login_on }) => login_on).reverse();
    setLogsToShow(() => logs);
  }, [initialState.myLogs]);

  const onRangeChange = (dates) => {
    if (dates) {
      let rangeDates = [];
      dates.map((date) => {
        rangeDates.push(date.$d);
      });

      let startingDate = rangeDates[0];
      let endingDate = rangeDates[1];

      const filteredLogs = initialState?.myLogs?.filter(({ login_on }) => {
        const logDate = formatDateToYYYYMMDD(new Date(login_on));
        return (
          logDate >= formatDateToYYYYMMDD(new Date(startingDate)) &&
          logDate <= formatDateToYYYYMMDD(new Date(endingDate))
        );
      });

      const myLogs = filteredLogs?.map(({ login_on }) => login_on).reverse();
      setLogsToShow(() => [...myLogs]);
    } else {
      const myLogs = initialState?.myLogs
        .map(({ login_on }) => login_on)
        .reverse();

      setLogsToShow(() => [...myLogs]);
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
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      {/* Top header section */}
      <div className="relative-wrapper zIndex-2">
        <section className={`main-content_header`}>
          <div className="d-flex justify-content-center align-items-center page-heading">
            <img src={settingsIcon1} alt={"Logs"} />
            <p className="m-0 fs-4">Logs</p>
          </div>
        </section>
      </div>

      <section className="ml-30 mt-5">
        {/* Filters */}
        <form>
          <div className="form-group w-100 position-relative zIndex-2">
            <label htmlFor="dateFilter">Filter by Date</label>
            <div className="relative-wrapper">
              <img
                className="search-icon"
                src={calendarIcon}
                alt="search-icon"
              />
              <Space direction="vertical">
                <RangePicker
                  presets={rangePresets}
                  onChange={onRangeChange}
                  onRemove={onRangeChange}
                  className="react-select-custom-styling__control"
                  popupClassName="pop-up-box"
                />
              </Space>
            </div>
          </div>
        </form>

        {/* content */}
        {logsToShow.length > 0 ? (
          <div className="mt-3" style={{overflowY:"auto",maxHeight:"540px"}}>
            <ul className={styles.logsWrapper}>
              {logsToShow.map((log, index) => (
                <li className={styles.log} key={index}>
                  {formatDateTime(log)}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mr-40 mb-15 mt-3">
            <h5>No logs Found!</h5>
          </div>
        )}
        
      </section>
    </div>
  );
};

export default MemberOrTeamLeaderLogs;
