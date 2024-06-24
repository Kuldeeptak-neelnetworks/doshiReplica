import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { ReactHotToast } from "../../Components/ReactHotToast/ReactHotToast";
import { SpinningLoader } from "../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../Context/ApiContext/ApiContext";
import FormWrapper from "../../templates/FormWrapper";

import {
  loginLogo,
  emailIcon,
} from "../../utils/ImportingImages/ImportingImages";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { mainURL, nnAPIKey } = useContext(ContextAPI);
  const [email, setEmail] = useState("");
  const [isUserValid, setIsUserValid] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/members");
    }
  }, []);

  const forgotPassword = async () => {
    const headerOptions = {
      "Content-Type": "application/json",
      Accept: "application/json",
      NN_Api_key: nnAPIKey,
    };

    const body = {
      email,
    };

    setIsUserValid(() => true);

    try {
      const url = `${mainURL}/forgot-password`;
      const result = await axios.post(url, body, {
        headers: headerOptions,
      });

      ReactHotToast("Reset Password Link shared on Mail", "success");
    } catch (e) {
      Array.isArray(e?.response?.data?.message)
        ? e?.response?.data?.message
            ?.map((e) => Object.values(e))
            .flatMap((e) => ReactHotToast(e, "error"))
        : ReactHotToast(e?.response?.data?.message, "error");
    } finally {
      setIsUserValid(() => false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (email) {
      forgotPassword();
      setEmail("");
    } else {
      ReactHotToast("Please enter Email!", "error");
    }
  };

  return (
    <FormWrapper>
      <form className="main-form-wrapper w-75" onSubmit={handleForgotPassword}>
        <img className="login-screen-logo" src={loginLogo} alt="logo" />
        <div className="form-wrapper">
          <p className="pb-2 m-0 page-title">Forgot Password</p>
          <p className="m-0 pb-4 forgot-password-description">
            Enter your email and we will send you a link to reset your password.
          </p>
          <div className="mb-3">
            <div className="email-input-box-wrapper">
              <img className="emailIcon" src={emailIcon} alt="email-icon" />
              <input
                type="email"
                className="form-control email-input-field"
                id="email"
                name="email"
                placeholder="Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="login-btn">
            {isUserValid ? <SpinningLoader /> : "Submit"}
          </button>
          <div className="mt-5">
            <Link className="back-to-login-link" to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                style={{ margin: "-3px 2px 0px 0px" }}
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M17.5 17.5L9.25 12l8.25-5.5l-1-1.5L6 12l10.5 7z"
                />
              </svg>
              Back To Login Page
            </Link>
          </div>
        </div>
      </form>
    </FormWrapper>
  );
};
