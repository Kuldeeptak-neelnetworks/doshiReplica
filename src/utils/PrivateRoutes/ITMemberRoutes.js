import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { ContextAPI } from "../../Context/ApiContext/ApiContext";

const ITMemberRoutes = () => {
  // const { userDetails } = useContext(ContextAPI);

  // return userDetails?.member_role === "it_member" ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to="/" />
  // );

  const userRole = localStorage.getItem("userRole");
  return userRole === "it_member" ? <Outlet /> : <Navigate to="/" />;
};

export default ITMemberRoutes;
