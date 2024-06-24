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

const MyVerticallyCenteredModal = (props) => {
  const { mainURL, logout, initialState } = useContext(ContextAPI);
  const [isLoading, setIsLoading] = useState(false);

  const [updatedDetails, setUpdatedDetails] = useState({
    jobName: props?.jobData?.job_name,
    jobType: {},
  });

  const options = initialState.jobCategories?.map((category) => ({
    label: category?.job_category_name,
    value: category?.job_category_id,
  }));

  // setting default selected job category option
  useEffect(() => {
    const defaultOption = options.find(
      (option) => option.label === props.jobData.job_category
    );
    setUpdatedDetails((prev) => ({ ...prev, jobType: defaultOption }));
  }, [initialState.jobCategories]);

  // updating member api
  const updateJob = async () => {
    const body = {
      current_user: localStorage.getItem("userId"),
      job_id: props?.jobData.job_id,
      job_type: updatedDetails.jobType.value,
      job_name: updatedDetails.jobName,
    };

    const url = `${mainURL}update/job-data`;

    setIsLoading(() => true);

    try {
      const result = await axios.put(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        ReactHotToast(result.data.message, "success");
        props.setIsUpdated((prev) => !prev);
        props.onHide();
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
    }
  };

  const handleUpdateJob = (e) => {
    e.preventDefault();
    if (updatedDetails.jobName && updatedDetails.jobType.value) {
      updateJob();
    } else {
      if (updatedDetails.jobName === "") {
        ReactHotToast("Please enter Job Name!", "error");
      } else if (updatedDetails.jobType.value === "") {
        ReactHotToast("Please select Job Type!", "error");
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
            <span className="modal-title">Update Job Details</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleUpdateJob}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-3 w-100">
            <label htmlFor="jobType">Job Type:</label>
            <Select
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              isClearable={false}
              isSearchable={true}
              name="jobType"
              value={updatedDetails.jobType}
              onChange={(option) =>
                setUpdatedDetails((prevState) => ({
                  ...prevState,
                  jobType: option,
                }))
              }
              options={options}
            />
          </div>
          <div className="form-group mt-3 w-100">
            <label htmlFor="jobName">Job Name:</label>
            <input
              id="jobName"
              name="jobName"
              placeholder="Eg: Audit Report"
              type="text"
              required
              onChange={(e) =>
                setUpdatedDetails((prev) => ({
                  ...prev,
                  jobName: e.target.value,
                }))
              }
              value={updatedDetails?.jobName}
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

export const EditJobModal = ({ jobData, setIsUpdated }) => {
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
        jobData={jobData}
        setIsUpdated={setIsUpdated}
      />
    </>
  );
};
