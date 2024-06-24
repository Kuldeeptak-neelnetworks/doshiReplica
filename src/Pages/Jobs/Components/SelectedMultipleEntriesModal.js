import React, { useState, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";

import { projectsIcon } from "../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import {
  headerOptions,
  handleAPIError,
} from "../../../utils/utilities/utilityFunctions";

const options = [
  {
    label: "Approve",
    value: "yes",
  },
  { label: "Reject", value: "no" },
];

const MyVerticallyCenteredModal = (props) => {
  const { mainURL, logout } = useContext(ContextAPI);
  const [isLoading, setIsLoading] = useState(false);
  const [timeEntry, setTimeEntry] = useState({
    approval: "",
    rejectionNote: "",
  });

  const handleOption = (approval) => {
    setTimeEntry((prev) => ({ ...prev, approval }));
  };

  const handleClear = () => {
    setTimeEntry(() => ({
      approval: "",
      rejectionNote: "",
    }));
  };

  // for updating time entry of a user api
  const updateSelectedTimeEntries = async () => {
    setIsLoading(() => true);
    try {
      const getUniqueValues = (key) => {
        const dataset = props?.timeEntriesData.filter(
          (entry) => entry.isChecked
        );
        const uniqueValues = new Set(dataset.map((entry) => entry[key]));

        // Convert Set to an array and join the values with a comma
        return [...uniqueValues].join(",");
      };

      let body = {
        current_user: localStorage.getItem("userId") ?? null,
        task_id: getUniqueValues("task_id"),
        entry_id: getUniqueValues("entries_id"),
        entries_updated_as: "Team",
        is_approve: timeEntry.approval.value,
        team_id: props?.timeEntriesData[0]?.team_id,
      };

      if (timeEntry.approval.value === "no") {
        body.disapproval_note = timeEntry.rejectionNote;
      }

      const url = `${mainURL}update/time-entries`;
      const result = await axios.put(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        ReactHotToast(result.data.message, "success");
        handleClear();
        props.setIsUpdated((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
      props.onHide();
    }
  };

  const handleUpdateTimeEntries = (e) => {
    e.preventDefault();

    const { approval, rejectionNote } = timeEntry;

    if (!approval) {
      ReactHotToast("Please Select an Option!", "error");
      return;
    }

    const isApproved = approval?.value === "yes";
    const isRejected = approval?.value === "no" && rejectionNote !== "";

    if (isApproved) {
      updateSelectedTimeEntries();
    } else if (isRejected) {
      updateSelectedTimeEntries();
    } else {
      ReactHotToast("Please provide valid Rejection Note!", "error");
    }
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
            <img src={projectsIcon} height={20} width={20} alt="user-icon" />
            <span className="modal-title">Update Selected Entries</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleUpdateTimeEntries}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-3 w-100">
            <label htmlFor="optionType">Select Option:</label>
            <Select
              name="optionType"
              closeMenuOnSelect={true}
              options={options}
              onChange={(option) => handleOption(option)}
              value={timeEntry.approval}
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
            />
          </div>

          {timeEntry?.approval?.value === "no" && (
            <div className="form-group mt-3 w-100">
              <label htmlFor="rejectionNote">Rejection Note:</label>
              <textarea
                id="rejectionNote"
                name="rejectionNote"
                className="w-100"
                rows={3}
                placeholder="Eg. The below Points are incorrect, kindly please rework on the same."
                value={timeEntry.rejectionNote}
                onChange={(e) =>
                  setTimeEntry((prev) => ({
                    ...prev,
                    rejectionNote: e.target.value,
                  }))
                }
              />
            </div>
          )}

          <button type="submit" className="custom-btn mt-4">
            {isLoading ? <SpinningLoader /> : "Update"}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const SelectedMultipleEntriesModal = ({
  timeEntriesData,
  setIsUpdated,
}) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setModalShow(true);
        }}
        className="custom-btn mt-4"
      >
        Approve / Reject Selected
      </button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        timeEntriesData={timeEntriesData}
        setIsUpdated={setIsUpdated}
      />
    </>
  );
};
