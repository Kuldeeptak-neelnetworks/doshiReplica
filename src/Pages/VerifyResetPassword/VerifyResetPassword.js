import React, { useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom/dist";

import { ContextAPI } from "../../Context/ApiContext/ApiContext";
import { SpinningLoader } from "../../Components/SpinningLoader/SpinningLoader";
import { ReactHotToast } from "../../Components/ReactHotToast/ReactHotToast";

export const VerifyResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mainURL, nnAPIKey } = useContext(ContextAPI);
  const { resetPasswordToken } = useParams();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/members");
    }
  }, []);

  // Verify Reset Password Link API
  const verifyResetPassword = async () => {
    try {
      const url = `${mainURL}/verify-reset-password-link/${resetPasswordToken}`;
      const result = await axios.get(url, {
        headers: {
          NN_Api_key: nnAPIKey,
        },
      });

      if (!result.data.error) {
        navigate("/reset-password", {
          state: { email: result?.data?.email, prevPath: location.pathname },
        });
      }
    } catch (e) {
      ReactHotToast(e?.response?.data?.message, "error");
      setTimeout(() => navigate("/"), 500);
    }
  };

  useEffect(() => {
    verifyResetPassword();
  }, []);

  return (
    <div
      style={{ height: "80vh" }}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <h2>Please wait redirecting...</h2>
      <SpinningLoader />
    </div>
  );
};
