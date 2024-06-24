import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ContextAPI } from "../../Context/ApiContext/ApiContext";

const MembersRoutes = () => {
  // const { userDetails } = useContext(ContextAPI);

  // return userDetails?.member_role === "members" ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to="/" />
  // );

  const userRole = localStorage.getItem("userRole");
  return userRole === "members" ? <Outlet /> : <Navigate to="/" />;
};

export default MembersRoutes;
