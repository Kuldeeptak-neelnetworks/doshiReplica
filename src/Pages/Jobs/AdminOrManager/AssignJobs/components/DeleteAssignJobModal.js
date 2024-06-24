import React, { useState, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

import {
  TrashSVG,
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
  const { mainURL, logout } = useContext(ContextAPI);
  const [isLoading, setIsLoading] = useState(false);

  // delete assigned job api
  const deleteAssignedJob = async () => {
    const body = {
      current_user: localStorage.getItem("userId"),
      assign_job_id: props?.assignJobData?.assign_id,
    };

    setIsLoading(() => true);

    const url = `${mainURL}deallocate/job`;

    try {
      const result = await axios.delete(url, {
        headers: headerOptions(),
        data: body,
      });

      if (result.status === 200) {
        ReactHotToast(result?.data?.message, "success");
        props.setIsUpdated((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
      props.onHide();
    }
  };

  const handleDeleteJob = (e) => {
    e.preventDefault();
    deleteAssignedJob();
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
            <span className="modal-title">Delete Assigned Job</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleDeleteJob}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-2 w-100">
            <p className="text-center fs-5 w-100 m-auto">
              are you sure you want to delete {props?.assignJobData?.job_name}?
            </p>
          </div>
          <button type="submit" className="custom-btn mt-4">
            {isLoading ? <SpinningLoader /> : "Delete"}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const DeleteAssignJobModal = ({ assignJobData, setIsUpdated }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
          console.log("assignJobData: ", assignJobData);
        }}
      >
        <TrashSVG />
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
