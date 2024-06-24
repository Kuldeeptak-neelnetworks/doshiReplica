import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom/dist";
import axios from "axios";

import passwordIcon from "../../assets/images/lock-svg.svg";
import { SpinningLoader } from "../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../Components/ReactHotToast/ReactHotToast";
import FormWrapper from "../../templates/FormWrapper";

import {
  eyeIcon,
  eyeDisabledIcon,
  loginLogo,
} from "../../utils/ImportingImages/ImportingImages";

export const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mainURL, nnAPIKey } = useContext(ContextAPI);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/members");
    }
  }, []);

  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
  });

  const [isUserValid, setIsUserValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const searchParams = new URLSearchParams(window.location.href.split("?")[1]);
  const userEmail = searchParams.get("email");

  // Reset Password API
  const resetPassword = async () => {
    const headerOptions = {
      "Content-Type": "application/json",
      Accept: "application/json",
      NN_Api_key: nnAPIKey,
    };

    const body = {
      email: userEmail ?? location?.state?.email,
      password: user.password,
      cnf_pass: user.confirmPassword,
    };

    setIsUserValid(() => true);

    try {
      const url = `${mainURL}/update-password`;
      const result = await axios.put(url, body, {
        headers: headerOptions,
      });

      if (!result.data.error) {
        ReactHotToast(result.data.message, "success");
        navigate("/");
        setUser({
          password: "",
          confirmPassword: "",
        });
      }
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

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (user.password && user.confirmPassword) {
      resetPassword();
    } else if (user.password === "" || user.confirmPassword === "") {
      ReactHotToast("Please Enter Password & Confirm Password", "error");
    }
  };

  return (
    <FormWrapper>
      <form className="main-form-wrapper w-75" onSubmit={handleResetPassword}>
        <img className="login-screen-logo" src={loginLogo} alt="logo" />
        <div className="form-wrapper">
          <p className="pb-4 m-0 page-title">Reset Password</p>
          <div className="mb-3 password-input-box-wrapper">
            <img
              className="passwordIcon"
              src={passwordIcon}
              alt="password-icon"
            />
            <input
              type={showPassword ? "text" : "password"}
              className="form-control password-input-field"
              id="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => handleChange(e)}
            />
            {showPassword ? (
              <img
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-icon"
                src={eyeDisabledIcon}
                alt="eye-icon"
                id="togglePassword"
              />
            ) : (
              <img
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-icon"
                src={eyeIcon}
                alt="eye-icon"
                id="togglePassword"
              />
            )}
          </div>
          <div className="mb-3 password-input-box-wrapper">
            <img
              className="passwordIcon"
              src={passwordIcon}
              alt="password-icon"
            />
            <input
              type={showPassword ? "text" : "password"}
              className="form-control password-input-field"
              id="confirm-password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChange={(e) => handleChange(e)}
            />
            {showPassword ? (
              <img
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-icon"
                src={eyeDisabledIcon}
                alt="eye-icon"
                id="togglePassword"
              />
            ) : (
              <img
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-icon"
                src={eyeIcon}
                alt="eye-icon"
                id="togglePassword"
              />
            )}
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
