import React, { useState, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";

import {
  EditSVG,
  userIcon,
} from "../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import {
  headerOptions,
  handleAPIError,
} from "../../../utils/utilities/utilityFunctions";

const MyVerticallyCenteredModal = (props) => {
  const { mainURL, logout } = useContext(ContextAPI);
  const [isLoading, setIsLoading] = useState(false);

  const [updatedDetails, setUpdatedDetails] = useState({
    memberStatus: props?.memberdata?.current_status,
    memberRole: props?.memberdata?.member_role,
  });

  const options = [
    {
      label: "IT Member",
      value: "it_member",
    },
    {
      label: "Operation Member",
      value: "operation_member",
    },
    // {
    //   label:"Team Leader, Member",
    //   value: "team_leaders-member",

    // },
    {
      label: "Member",
      value: "members",
    },
  ];

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

  const defaultValue = (options, value) => {
    return options.find((option) => option.value === value);
  };

  // updating member api
  const updateMember = async () => {
    const body = {
      current_user: localStorage.getItem("userId"),
      member_id: props.memberdata.member_id,
      status: updatedDetails.memberStatus,
      role: updatedDetails.memberRole,
    };

    const url = `${mainURL}/update/member`;

    setIsLoading(() => true);

    try {
      const result = await axios.put(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        ReactHotToast(result.data.message, "success");
        props.setisupdated((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
      props.onHide();
    }
  };

  const handleUpdateMember = (e) => {
    e.preventDefault();
    if (updatedDetails.memberRole && updatedDetails.memberStatus) {
      updateMember();
    } else {
      if (updatedDetails.memberRole === "") {
        ReactHotToast("Please select member role", "error");
      } else if (updatedDetails.memberStatus === "") {
        ReactHotToast("Please select member status", "error");
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
            <img src={userIcon} height={20} width={20} alt="user-icon" />
            <span className="modal-title">Update Member Details</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleUpdateMember}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-3 w-100">
            <label htmlFor="memberRole">Role:</label>
            <Select
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              value={defaultValue(options, updatedDetails.memberRole)}
              // value={defaultValue(options, props?.memberdata?.member_role)}
              isClearable={false}
              isSearchable={true}
              name="memberRole"
              onChange={({ value }) =>
                setUpdatedDetails((prevState) => ({
                  ...prevState,
                  memberRole: value,
                }))
              }
              options={options}
            />
          </div>
          <div className="form-group mt-3 w-100">
            <label htmlFor="memberStatus">Status:</label>
            <Select
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              defaultValue={() =>
                defaultValue(statusOptions, props?.memberdata?.current_status)
              }
              isClearable={false}
              isSearchable={true}
              name="memberStatus"
              onChange={({ value }) =>
                setUpdatedDetails((prevState) => ({
                  ...prevState,
                  memberStatus: value,
                }))
              }
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

export const EditMemberModal = ({ memberData, setIsUpdated }) => {
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
        memberdata={memberData}
        setisupdated={setIsUpdated}
      />
    </>
  );
};
