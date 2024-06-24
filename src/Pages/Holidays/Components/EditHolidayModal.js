import React, { useState, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

import {
  EditSVG,
  holidayIcon1,
} from "../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import {
  handleAPIError,
  headerOptions,
} from "../../../utils/utilities/utilityFunctions";

import styles from "./EditHolidayModal.module.css";

const MyVerticallyCenteredModal = (props) => {
  const { mainURL, logout } = useContext(ContextAPI);
  const [isLoading, setIsLoading] = useState(false);

  const [holiday, setHoliday] = useState({
    holidayName: props.holidayDetails.holiday_name ?? null,
    holidayDate: props.holidayDetails.holiday_date ?? null,
    isWorking: props.holidayDetails.marked_as_working === "yes" ? true : false,
  });

  const updateHoliday = async () => {
    setIsLoading(() => true);

    try {
      const body = {
        current_user: localStorage.getItem("userId") ?? null,
        holiday_enabling_date: holiday.holidayDate,
      };

      const url = `${mainURL}holiday/mark-as-working`;
      const result = await axios.put(url, body, {
        headers: headerOptions(),
      });
      if (result.status === 200) {
        ReactHotToast(result.data.message, "success");
        props.setIsUpdated((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
      props.onHide();
    }
  };

  const handleUpdateHoliday = (e) => {
    e.preventDefault();
    updateHoliday();
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="pt-3 pb-1" closeButton>
        <Modal.Title className="w-100" id="contained-modal-title-vcenter">
          <div className="d-flex justify-content-center align-items-center gap-3">
            <img src={holidayIcon1} height={20} width={20} alt="user-icon" />
            <span className="modal-title">Update Holiday</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleUpdateHoliday}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-3 w-100">
            <label htmlFor="name">Holiday Name:</label>
            <input
              id="name"
              name="name"
              placeholder="Eg: ITR Filling"
              type="text"
              required
              value={holiday.holidayName}
              disabled
              //   onChange={(e) =>
              //     setUpdatedJobCategoryName((prev) => ({
              //       ...prev,
              //       jobCategoryName: e.target.value,
              //     }))
              //   }
            />
          </div>
          <div className="form-group mt-3 w-100 d-flex flex-row align-items-center justify-content-start gap-2">
            <label
              htmlFor="workingHoliday"
              className={`${styles.workingHolidayLabel}`}
            >
              Set as Working:
            </label>
            <input
              type="checkbox"
              id="workingHoliday"
              className={`${styles.workingHolidayCheckBox}`}
              checked={holiday.isWorking}
              onChange={(e) =>
                setHoliday((prev) => ({ ...prev, isWorking: e.target.checked }))
              }
            />
          </div>

          <button type="submit" className="custom-btn mt-4">
            {isLoading ? <SpinningLoader /> : "Update"}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const EditHolidayModal = ({ holidayDetails, setIsUpdated }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        <EditSVG />
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        holidayDetails={holidayDetails}
        setIsUpdated={setIsUpdated}
      />
    </>
  );
};
