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
import { ReactHotToast } from "../../../../../Components/ReactHotToast/ReactHotToast";
import {
  headerOptions,
  handleAPIError,
} from "../../../../../utils/utilities/utilityFunctions";

const statusOptions = [
  {
    label: "In Progress",
    value: 1,
  },
  {
    label: "Completed",
    value: 2,
  },
  {
    label: "On Hold",
    value: 3,
  },
];

const MyVerticallyCenteredModal = (props) => {
  const { mainURL, logout } = useContext(ContextAPI);
  const [isLoading, setIsLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState("");

  useEffect(() => {
    const status = statusOptions.find(
      ({ label }) => label === props?.assignJobData?.job_status
    );
    setJobStatus(() => status);
  }, [props?.assignJobData?.job_status]);

  // updating assigned job api
  const updateAssignJob = async () => {
    const body = {
      current_user: localStorage.getItem("userId"),
      assign_job_id: props.assignJobData?.assign_id,
      status: jobStatus?.value,
    };

    if (props.assignJobData.assign_to === "Team") {
      body.team_id = props.assignJobData?.team_details?.id;
    }

    const url = `${mainURL}update/assign-job-status`;

    setIsLoading(() => true);

    try {
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

  const handleUpdateAssignJob = (e) => {
    e.preventDefault();

    if (jobStatus?.value) {
      updateAssignJob();
    } else {
      if (!jobStatus?.value) {
        ReactHotToast("Please select status", "error");
      }
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
            <span className="modal-title">Update Assigned Job</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleUpdateAssignJob}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-3 w-100">
            <label htmlFor="assignJobName">Job Name:</label>
            <input
              id="assignJobName"
              name="assignJobName"
              placeholder="Eg: Audit Report"
              type="text"
              value={props.assignJobData?.job_name}
              disabled
              readOnly
            />
          </div>
          <div className="form-group mt-3 w-100">
            <label htmlFor="assignJobStatus">Status:</label>
            <Select
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              isClearable={false}
              isSearchable={true}
              name="assignJobStatus"
              value={jobStatus}
              onChange={(option) => setJobStatus(option)}
              options={statusOptions}
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

export const EditAssignJobModal = ({ assignJobData, setIsUpdated }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div onClick={() => setModalShow(true)}>
        <EditSVG />
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        assignJobData={assignJobData}
        setIsUpdated={setIsUpdated}
      />
    </>
  );
};
