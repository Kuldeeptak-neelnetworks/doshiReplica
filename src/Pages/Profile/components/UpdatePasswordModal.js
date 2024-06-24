import React, { useState, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

import {
  PaswordSVG,
  userIcon,
  eyeDisabledIcon,
  eyeIcon,
  DisabledEyeIconSVG,
  EyeIconSVG,
} from "../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import {
  handleAPIError,
  headerOptions,
} from "../../../utils/utilities/utilityFunctions";

import styles from "./ProfileContent.module.css";

const MyVerticallyCenteredModal = (props) => {
  const { mainURL, logout } = useContext(ContextAPI);
  const [isUserValid, setIsUserValid] = useState(false);

  const hidePasswordStyling = {
    right: "10px",
    height: "20px",
    width: "20px",
    cursor: "pointer",
  };

  const initialState = {
    showCurrentPassword: false,
    currentPassword: "",
    showNewPassword: false,
    newPassword: "",
    showRetypePassword: false,
    retypePassword: "",
  };
  const [passwordDetails, setPasswordDetails] = useState(initialState);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setPasswordDetails((prev) => ({ ...prev, [name]: value }));
  };

  // update password api
  const updatePassword = async () => {
    const body = {
      current_user: localStorage.getItem("userId"),
      current_password: passwordDetails.currentPassword,
      new_password: passwordDetails.newPassword,
      retype_password: passwordDetails.retypePassword,
    };

    setIsUserValid(() => true);

    const url = `${mainURL}change-password`;
    try {
      const result = await axios.put(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        ReactHotToast(result?.data?.message, "success");
        props.onHide();
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsUserValid(() => false);
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const bool =
      passwordDetails.currentPassword &&
      passwordDetails.newPassword &&
      passwordDetails.retypePassword;
    if (bool) {
      updatePassword();
    } else {
      ReactHotToast("Please input all fields", "error");
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
            <span className="modal-title">Change Password</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleUpdatePassword}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-3 w-75">
            <label className="" htmlFor="currentPassword">
              Current Password:
            </label>
            <div className="d-flex align-items-center justify-content-between position-relative w-100">
              <input
                id="currentPassword"
                className=""
                name="currentPassword"
                placeholder="Eg: Raj@Shah007"
                type={passwordDetails.showCurrentPassword ? `text` : `password`}
                required
                onChange={(e) => handleChange(e)}
                value={passwordDetails.currentPassword}
                style={{ paddingRight: "35px", textOverflow: "ellipsis" }}
              />
              {passwordDetails.showCurrentPassword ? (
                <div
                  className={`position-absolute ${styles.hidePasswordStyling}`}
                  onClick={() =>
                    setPasswordDetails((prev) => ({
                      ...prev,
                      showCurrentPassword: !prev.showCurrentPassword,
                    }))
                  }
                >
                  <DisabledEyeIconSVG className={styles.eyeIconsSize} />
                </div>
              ) : (
                <div
                  className={`position-absolute ${styles.hidePasswordStyling}`}
                  onClick={() =>
                    setPasswordDetails((prev) => ({
                      ...prev,
                      showCurrentPassword: !prev.showCurrentPassword,
                    }))
                  }
                >
                  <EyeIconSVG className={styles.eyeIconsSize} />
                </div>
              )}
            </div>
          </div>
          <div className="form-group mt-3 w-75">
            <label className="" htmlFor="newPassword">
              New Password:
            </label>
            <div className="d-flex align-items-center justify-content-between position-relative w-100">
              <input
                id="newPassword"
                className=""
                name="newPassword"
                placeholder="Eg: Raj@Shah007"
                type={passwordDetails.showNewPassword ? "text" : "password"}
                required
                onChange={(e) => handleChange(e)}
                value={passwordDetails.newPassword}
                style={{ paddingRight: "35px", textOverflow: "ellipsis" }}
              />
              {passwordDetails.showNewPassword ? (
                <div
                  className={`position-absolute ${styles.hidePasswordStyling}`}
                  onClick={() =>
                    setPasswordDetails((prev) => ({
                      ...prev,
                      showNewPassword: !prev.showNewPassword,
                    }))
                  }
                >
                  <DisabledEyeIconSVG className={styles.eyeIconsSize} />
                </div>
              ) : (
                <div
                  className={`position-absolute ${styles.hidePasswordStyling}`}
                  onClick={() =>
                    setPasswordDetails((prev) => ({
                      ...prev,
                      showNewPassword: !prev.showNewPassword,
                    }))
                  }
                >
                  <EyeIconSVG className={styles.eyeIconsSize} />
                </div>
              )}
            </div>
          </div>
          <div className="form-group mt-3 w-75">
            <label className="" htmlFor="retypePassword">
              Re-Type Password:
            </label>
            <div className="d-flex align-items-center justify-content-between position-relative w-100">
              <input
                id="retypePassword"
                className=""
                name="retypePassword"
                placeholder="Eg: Raj@Shah007"
                type={passwordDetails.showRetypePassword ? "text" : "password"}
                required
                onChange={(e) => handleChange(e)}
                value={passwordDetails.retypePassword}
                style={{ paddingRight: "35px", textOverflow: "ellipsis" }}
              />
              {passwordDetails.showRetypePassword ? (
                <div
                  className={`position-absolute ${styles.hidePasswordStyling}`}
                  onClick={() =>
                    setPasswordDetails((prev) => ({
                      ...prev,
                      showRetypePassword: !prev.showRetypePassword,
                    }))
                  }
                >
                  <DisabledEyeIconSVG className={styles.eyeIconsSize} />
                </div>
              ) : (
                <div
                  className={`position-absolute ${styles.hidePasswordStyling}`}
                  onClick={() =>
                    setPasswordDetails((prev) => ({
                      ...prev,
                      showRetypePassword: !prev.showRetypePassword,
                    }))
                  }
                >
                  <EyeIconSVG className={styles.eyeIconsSize} />
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="custom-btn mt-4">
            {isUserValid ? <SpinningLoader /> : "Update"}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const UpdatePasswordModal = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        <button className="custom-btn d-flex justify-content-center align-items-center gap-2">
          Change Password{" "}
          <span className={styles.passwordSVG}>
            <PaswordSVG />
          </span>
        </button>
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};
