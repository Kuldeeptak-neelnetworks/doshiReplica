import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { ContextAPI } from "../../Context/ApiContext/ApiContext";

const ITMemberAndOperationMemberRoutes = () => {
  // const { userDetails } = useContext(ContextAPI);

  // return userDetails?.member_role === "it_member" ||
  //   userDetails?.member_role === "operation_member" ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to="/" />
  // );

  const userRole = localStorage.getItem("userRole");
  return userRole === "it_member" || userRole === "operation_member" || userRole === `team_leaders,members`   ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default ITMemberAndOperationMemberRoutes;
