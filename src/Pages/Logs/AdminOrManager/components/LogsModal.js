import React, { useState, useEffect, useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";

import {
  PlusIconSVG,
  calendarIcon,
  settingsIcon,
} from "../../../../utils/ImportingImages/ImportingImages";

import styles from "../../Logs.module.css";
import {
  formatDateTime,
  formatDateToYYYYMMDD,
} from "../../../../utils/utilities/utilityFunctions";

const MyVerticallyCenteredModal = ({ show, onHide, userLogData }) => {
  // code for adding date picker from Ant Design
  const { RangePicker } = DatePicker;

  const initialState = useMemo(() => {
    return [...userLogData.userLogs].reverse();
  }, [userLogData.userLogs]);

  const [logsToShow, setLogsToShow] = useState(() => initialState);

  const onRangeChange = (dates) => {
    if (dates) {
      let rangeDates = [];
      dates.map((date) => {
        rangeDates.push(date.$d);
      });

      let startingDate = rangeDates[0];
      let endingDate = rangeDates[1];

      const filteredLogs = initialState.filter((log) => {
        const logDate = formatDateToYYYYMMDD(new Date(log));
        return (
          logDate >= formatDateToYYYYMMDD(new Date(startingDate)) &&
          logDate <= formatDateToYYYYMMDD(new Date(endingDate))
        );
      });
      setLogsToShow(() => [...filteredLogs]);
    } else {
      setLogsToShow(() => [...initialState]);
    }
  };

  useEffect(() => {
    return () => {
      setLogsToShow(() => [...initialState]);
    };
  }, [show, initialState]);

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
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="pt-3 pb-1" closeButton>
        <Modal.Title className="w-100" id="contained-modal-title-vcenter">
          <div className="d-flex justify-content-center align-items-center gap-3">
            <img src={settingsIcon} height={20} width={20} alt="user-icon" />
            <span className="modal-title">{userLogData.name} Logs</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        {/* Filters */}
        <form>
          <div className="form-group w-100">
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
          <>
            <div
              className="mt-3"
              style={{ height: "500px", overflowY: "auto" }}
            >
              <ul className={styles.logsWrapper}>
                {logsToShow.map((log, index) => (
                  <li className={styles.log} key={index}>
                    {formatDateTime(log)}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className={`${styles.noLogs} mt-3`}>No Logs found!</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export const LogsModal = ({ userLogData }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        <PlusIconSVG />
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        userLogData={userLogData}
      />
    </>
  );
};
