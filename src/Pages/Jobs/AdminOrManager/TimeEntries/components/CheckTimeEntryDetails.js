import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import {
  PlusIconSVG,
  projectsIcon,
} from "../../../../../utils/ImportingImages/ImportingImages";

import styles from "./CheckTimeEntryDetails.module.css";
import {
  formatDate,
  formatTime,
  getTime,getTwelveHoursTime
} from "../../../../../utils/utilities/utilityFunctions";

const MyVerticallyCenteredModal = ({ show, onHide, timeEntry }) => {
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
            <img src={projectsIcon} height={20} width={20} alt="user-icon" />
            <span className="modal-title">Time Entry Details</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">

        <p className={`${styles.jobName} mb-3`}>Job: {timeEntry.task_name}</p>
        <p className={`${styles.text} mb-3`}>Member: {timeEntry.member_name}</p>
        <p className={`${styles.text} mb-1`}>Description:</p>
        <p className={`${styles.text} mb-3`}>{timeEntry.work_description}</p>
        <p className={`${styles.text} mb-3`}>
          Entry Date: {formatDate(timeEntry.working_date)}
        </p>
        <div className="d-flex gap-4 mb-3">
          <p className={`${styles.text} m-0`}>
            Start Time: {getTwelveHoursTime(timeEntry.work_start_time)}
          </p>
          <p className={`${styles.text} m-0`}>
            End Time: {getTwelveHoursTime(timeEntry.work_end_time)}  
          </p>
        </div>
       
        <p className={`${styles.text} mb-3`}>
          Reviewer: {timeEntry.reviewer_name}
        </p>
        <p className={`${styles.text} mb-3`}>
        Adjustment Hours: {formatTime(timeEntry.adjustment_hours)}
        </p>
        <p className={`${styles.text} mb-1`}> Adjustment Reason:</p>
        <p className={`${styles.text} m-0`}>
          {timeEntry.adjustment_hours_reason}
        </p>
      </Modal.Body>
    </Modal>
  );
};

export const CheckTimeEntryDetails = ({ timeEntry }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
          // console.log("time entry: ", timeEntry);
        }}
      >
        <PlusIconSVG />
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        timeEntry={timeEntry}
      />
    </>
  );
};
