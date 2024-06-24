import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactHotToast } from "../../Components/ReactHotToast/ReactHotToast";
import axios from "axios";

import { SpinningLoader } from "../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../Context/ApiContext/ApiContext";

import {
  loginLogo,
  emailIcon,
  passwordIcon,
  eyeIcon,
  eyeDisabledIcon,
} from "../../utils/ImportingImages/ImportingImages";
import FormWrapper from "../../templates/FormWrapper";

export const Login = () => {
  const navigate = useNavigate();
  const { mainURL, nnAPIKey, setUserId } = useContext(ContextAPI);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Login API
  const loginUser = async () => {
    const headerOptions = {
      "Content-Type": "application/json",
      Accept: "application/json",
      NN_Api_key: nnAPIKey,
    };

    const body = {
      email: user.email,
      password: user.password,
    };

    setIsUserValid(() => true);

    try {
      const url = `${mainURL}/login`;
      const result = await axios.post(url, body, {
        headers: headerOptions,
      });

      if (result.status === 201) {
        ReactHotToast("Login Successful", "success");
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("userId", result.data.user_id);
        localStorage.setItem("userRole", result.data.user_roles);
        localStorage.setItem("username", result.data.username);
        setUserId(() => result.data.user_id);
        navigate("/dashboard");
      } else {
        throw new Error("Something went wrong, Please try again later!");
      }
    } catch (e) {
      Array.isArray(e?.response?.data?.message)
        ? e?.response?.data?.message
            ?.map((e) => Object.values(e))
            .flatMap((e) => {
              if (Array.isArray(e)) {
                e.map((error) => ReactHotToast(error, "error"));
              } else {
                ReactHotToast(e, "error");
              }
            })
        : ReactHotToast(e?.response?.data?.message, "error");
    } finally {
      setIsUserValid(() => false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (user.email && user.password) {
      loginUser();
      setUser({
        email: "",
        password: "",
      });
    } else {
      ReactHotToast("Please enter Email & Password!", "error");
    }
  };

  return (
    <FormWrapper>
      <form className="main-form-wrapper w-75" onSubmit={handleLogin}>
        <img className="login-screen-logo" src={loginLogo} alt="logo" />
        <div className="form-wrapper">
          <p className="pb-2 page-title">Login</p>
          <div className="mb-3">
            <div className="email-input-box-wrapper">
              <img className="emailIcon" src={emailIcon} alt="email-icon" />
              <input
                type="email"
                className="form-control email-input-field"
                id="email"
                name="email"
                placeholder="Email Id"
                value={user.email}
                onChange={(e) => handleChange(e)}
              />
            </div>
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
              id="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => handleChange(e)}
            />
            {showPassword ? (
              <img
                src={eyeDisabledIcon}
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-icon"
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
          <div className="mb-3 mt-1 d-flex gap-5 justify-content-center align-items-center">
            <Link className="forgot-password-link" to="/forgot-password">
              Forgot Password?
            </Link>
          </div>
          <button type="submit" className="login-btn">
            {isUserValid ? <SpinningLoader /> : "Login Now"}
          </button>
        </div>
      </form>
    </FormWrapper>
  );
};
