import React, { useState, useContext } from "react";
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
  handleAPIError,
  headerOptions,
} from "../../../../../utils/utilities/utilityFunctions";

const MyVerticallyCenteredModal = (props) => {
  const { mainURL, logout } = useContext(ContextAPI);
  const [isUserValid, setIsUserValid] = useState(false);

  const [updatedJobCategoryName, setUpdatedJobCategoryName] = useState({
    jobCategoryName: props?.jobCategoryData?.job_category_name ?? null,
    jobCategoryStatus: props?.jobCategoryData?.status,
  });

  const defaultValue = (options, value) => {
    return options.find((option) => option.value === value);
  };

  const statusOptions = [
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Suspended",
      value: "inactive",
    },
  ];

  // updating job category api
  const updateJobCategoryName = async () => {
    let body = {
      current_user: +localStorage.getItem("userId"),
      job_id: props?.jobCategoryData?.job_category_id,
      status: updatedJobCategoryName.jobCategoryStatus,
    };

    if (
      updatedJobCategoryName.jobCategoryName !==
      props.jobCategoryData.job_category_name
    ) {
      body.job_type = updatedJobCategoryName.jobCategoryName;
    }

    const url = `${mainURL}update/job-type`;

    setIsUserValid(() => true);

    try {
      const result = await axios.put(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        ReactHotToast(result.data.message, "success");
        props.onHide();
        props.setIsupdated((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsUserValid(() => false);
    }
  };

  const handleUpdateJobCategory = (e) => {
    e.preventDefault();
    if (
      updatedJobCategoryName.jobCategoryName &&
      updatedJobCategoryName.jobCategoryStatus
    ) {
      updateJobCategoryName();
    } else {
      ReactHotToast("Please provide Job category name & status!", "error");
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
            <span className="modal-title">Update Job Category</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleUpdateJobCategory}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-3 w-100">
            <label htmlFor="name">Category Name:</label>
            <input
              id="name"
              name="name"
              placeholder="Eg: ITR Filling"
              type="text"
              required
              value={updatedJobCategoryName.jobCategoryName}
              onChange={(e) =>
                setUpdatedJobCategoryName((prev) => ({
                  ...prev,
                  jobCategoryName: e.target.value,
                }))
              }
            />
          </div>
          <div className="form-group mt-3 w-100">
            <label htmlFor="categoryStatus">Status:</label>
            <Select
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              defaultValue={() =>
                defaultValue(statusOptions, props?.jobCategoryData?.status)
              }
              isClearable={false}
              isSearchable={true}
              name="categoryStatus"
              onChange={({ value }) =>
                setUpdatedJobCategoryName((prev) => ({
                  ...prev,
                  jobCategoryStatus: value,
                }))
              }
              options={statusOptions}
            />
          </div>

          <button type="submit" className="custom-btn mt-4">
            {isUserValid ? <SpinningLoader /> : "Update"}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const EditJobCategoryModal = ({ jobCategoryData, setIsUpdated }) => {
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
        jobCategoryData={jobCategoryData}
        setIsupdated={setIsUpdated}
      />
    </>
  );
};
