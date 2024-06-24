import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import {
  TrashSVG,
  userIcon,
} from "../../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../../Components/ReactHotToast/ReactHotToast";
import {
  handleAPIError,
  headerOptions,
} from "../../../../utils/utilities/utilityFunctions";

const MyVerticallyCenteredModal = (props) => {
  const { mainURL, logout } = useContext(ContextAPI);
  const [isUserValid, setIsUserValid] = useState(false);

  // delete member api
  const deleteTeam = async () => {
    const body = {
      current_user: +localStorage.getItem("userId"),
      team_id: +props?.teamData?.id,
    };

    setIsUserValid(() => true);

    const url = `${mainURL}/delete/team`;
    try {
      const result = await axios.delete(url, {
        headers: headerOptions(),
        data: body,
      });

      if (result.status === 200) {
        ReactHotToast(result?.data?.message, "success");
        props.setisupdated((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsUserValid(() => false);
      props.onHide();
    }
  };

  const handleDeleteTeam = (e) => {
    e.preventDefault();
    deleteTeam();
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
            <img src={userIcon} height={20} width={20} alt="user-icon" />
            <span className="modal-title">Delete Team</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleDeleteTeam}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-2 w-100">
            <p className="text-center fs-5 w-100 m-auto">
              are you sure you want to delete {props?.teamData?.team_name}?
            </p>
          </div>
          <button type="submit" className="custom-btn mt-4">
            {isUserValid ? <SpinningLoader /> : "Delete"}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const DeleteTeamModal = ({ teamData, setIsUpdated }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        <TrashSVG />
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        teamData={teamData}
        setisupdated={setIsUpdated}
      />
    </>
  );
};
