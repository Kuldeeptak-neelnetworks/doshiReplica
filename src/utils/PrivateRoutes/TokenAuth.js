import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ReactHotToast } from "../../Components/ReactHotToast/ReactHotToast";

const TokenAuth = () => {
  const token = localStorage.getItem("token");

  if (!token) ReactHotToast("Please login first!", "error");

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default TokenAuth;
