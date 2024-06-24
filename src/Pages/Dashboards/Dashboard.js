import React from "react";
import AdminDashboard from "./Admin/AdminDashboard";
import MemberDashboard from "./Member/MemberDashboard";
import ManagerDashboard from "./Manager/ManagerDashboard";
import TeamLeaderDashboard from "./TeamLeader/TeamLeaderDashboard";

const Dashboard = () => {
  const userRole = localStorage.getItem("userRole");
  return userRole === "it_member" ? (
    <AdminDashboard />
  ) : userRole === "operation_member" ? (
    <ManagerDashboard />
  ) : userRole === "team_leaders,members" ? (
    <TeamLeaderDashboard />
  ) : (
    <MemberDashboard />
  );
};

export default Dashboard;
