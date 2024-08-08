import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";

import {
  EditSVG,
  projectsIcon,
} from "../../../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../../../Context/ApiContext/ApiContext";
import {
  handleAPIError,
  headerOptions,
} from "../../../../../utils/utilities/utilityFunctions";
import { ReactHotToast } from "../../../../../Components/ReactHotToast/ReactHotToast";

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
    addAdjustmentHours: false,
    adjustmentType: "",
    adjustmentHoursNote: "",
    adjustmentHours: {
      hours: "",
      mins: "",
    },
  });

  useEffect(() => {
    return () => {
      setTimeEntry((prev) => ({
        approval: "",
        rejectionNote: "",
        addAdjustmentHours: false,
        adjustmentHoursNote: "",
        adjustmentHours: {
          hours: "",
          mins: "",
        },
      }));
    };
  }, [props.show]);

  const handleOption = (approval) => {
    setTimeEntry((prev) => ({ ...prev, approval }));
  };

  const handleClear = () => {
    setTimeEntry(() => ({
      approval: "",
      rejectionNote: "",
      addAdjustmentHours: false,
      adjustmentHoursNote: "",
      adjustmentHours: {
        hours: "",
        mins: "",
      },
    }));
  };

  // for updating time entry of a user api
  const updateTimeEntry = async () => {
    setIsLoading(() => true);
    try {
      let body = {
        current_user: localStorage.getItem("userId") ?? null,
        task_id: props?.timeEntryData?.task_id || props?.taskId,
        entry_id: props?.timeEntryData?.entries_id || props?.timeEntryId,
        entries_updated_as:
        props?.timeEntryData?.entries_as === "team" ? "Team" :
        props?.timeEntryData?.entries_as === "member" ? "Member" : "Team",
          is_approve: timeEntry?.approval?.value,
      }
      
      if (timeEntry.approval.value === "no") {
        body.disapproval_note = timeEntry.rejectionNote;
      }
      body.team_id =
        props?.timeEntryData?.entries_as === "team"
          ? props?.timeEntryData?.team_id
          :props?.teamId;

      //  entries_updated_as:
      //     props?.timeEntryData?.entries_as === "team" ? "Team" : "Member",
      //   is_approve: timeEntry.approval.value,
      // };
      // }

      // if (props?.timeEntryData?.entries_as === "team") {
      //   body.team_id = props?.timeEntryData?.team_id;
      // }
      if (timeEntry.addAdjustmentHours) {
        body.adjustment_hours = `${timeEntry.adjustmentType}${timeEntry.adjustmentHours.hours}:${timeEntry.adjustmentHours.mins}:00`;
        body.adjustment_hours_reason = timeEntry.adjustmentHoursNote;
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

  const handleUpdateTimeEntry = (e) => {
    e.preventDefault();

    const {
      approval,
      rejectionNote,
      addAdjustmentHours,
      adjustmentHours,
      adjustmentHoursNote,
    } = timeEntry;

    if (!approval) {
      ReactHotToast("Please Select an Option!", "error");
      return;
    }

    const isApproved = approval?.value === "yes";
    const isRejected = approval?.value === "no" && rejectionNote !== "";

    if (isApproved) {
      if (addAdjustmentHours) {
        if (
          adjustmentHours.hours &&
          adjustmentHours.mins &&
          adjustmentHoursNote?.trim() !== ""
        ) {
          updateTimeEntry();
        } else {
          ReactHotToast(
            "Please provide valid discount hours, mins, and reason!",
            "error"
          );
        }
      } else {
        updateTimeEntry();
      }
    } else if (isRejected) {
      updateTimeEntry();
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
            <span className="modal-title">Update Time Entry</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleUpdateTimeEntry}
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

          {timeEntry?.approval?.value === "yes" && (
            <div className="form-group mt-3 w-100 flex-row align-items-center justify-content-start">
              <label style={{ width: "max-content" }} htmlFor="discountedHours">
                Adjust Time Entry Hours (optional):
              </label>
              <input
                id="discountedHours"
                name="discountedHours"
                type="checkbox"
                style={{ marginLeft: "10px" }}
                className="cursor-pointer checkbox-input"
                value={timeEntry.addAdjustmentHours}
                onChange={(e) =>
                  setTimeEntry((prev) => ({
                    ...prev,
                    addAdjustmentHours: e.target.checked,
                  }))
                }
              />
            </div>
          )}

          {timeEntry?.approval?.value === "yes" &&
            timeEntry.addAdjustmentHours && (
              <>
                <div className="form-group mt-3 w-100">
                  <label htmlFor="adjustmentType">Adjustment Type:</label>
                  <div
                    name="adjustmentType"
                    className="radio-group justify-content-start mt-2"
                  >
                    <label htmlFor="increase">
                      <input
                        type="radio"
                        id="increase"
                        value={timeEntry.adjustmentType}
                        // value="+"
                        name="adjustmentType"
                        // checked={timeEntry.adjustmentType === "+"}
                        // checked={timeEntry.adjustmentType}
                        onChange={(e) =>
                          setTimeEntry((prev) => ({
                            ...prev,
                            adjustmentType: e.target.value,
                          }))
                        }
                      />
                      <span>Increase Time</span>
                    </label>
                    <label htmlFor="decrease">
                      <input
                        type="radio"
                        id="decrease"
                        // value={timeEntry.adjustmentType}
                        value="-"
                        name="adjustmentType"
                        checked={timeEntry.adjustmentType === "-"}
                        // checked={timeEntry.adjustmentType}
                        onChange={(e) =>
                          setTimeEntry((prev) => ({
                            ...prev,
                            adjustmentType: e.target.value,
                          }))
                        }
                      />
                      <span>Decrease Time</span>
                    </label>
                  </div>
                </div>
                <div className="form-group mt-3 w-100">
                  <label htmlFor="rejectionNote">
                    Adjustment Hours (hrs:mins):
                  </label>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      placeholder="hours"
                      value={timeEntry.adjustmentHours.hours}
                      onChange={(e) =>
                        setTimeEntry((prev) => ({
                          ...prev,
                          adjustmentHours: {
                            ...prev.adjustmentHours,
                            hours: e.target.value,
                          },
                        }))
                      }
                      min={0}
                    />
                    <input
                      type="number"
                      placeholder="mins"
                      min={0}
                      max={59}
                      value={timeEntry.adjustmentHours.mins}
                      onChange={(e) =>
                        setTimeEntry((prev) => ({
                          ...prev,
                          adjustmentHours: {
                            ...prev.adjustmentHours,
                            mins: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="form-group mt-3 w-100">
                  <label htmlFor="adjustmentHoursNote">
                    Adjustment Hours Reason:
                  </label>
                  <textarea
                    id="adjustmentHoursNote"
                    name="adjustmentHoursNote"
                    className="w-100"
                    rows={3}
                    placeholder="Eg. The below Points are incorrect, kindly please rework on the same."
                    value={timeEntry.adjustmentHoursNote}
                    onChange={(e) =>
                      setTimeEntry((prev) => ({
                        ...prev,
                        adjustmentHoursNote: e.target.value,
                      }))
                    }
                  />
                </div>
              </>
            )}

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

export const UpdateTimeEntryModal = ({
  setIsUpdated,
  timeEntryData,
  timeEntryId,
  teamId,
  taskId,
}) => {
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
        setIsUpdated={setIsUpdated}
        timeEntryData={timeEntryData}
        timeEntryId={timeEntryId}
        teamId={teamId}
        taskId={taskId}
      />
    </>
  );
};
