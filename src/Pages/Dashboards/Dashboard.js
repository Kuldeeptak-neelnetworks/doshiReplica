import React from "react";
import AdminDashboard from "./Admin/AdminDashboard";
import MemberDashboard from "./Member/MemberDashboard";
import ManagerDashboard from "./Manager/ManagerDashboard";
import TeamLeaderDashboard from "./TeamLeader/TeamLeaderDashboard";
import SubTeamLeaderDashboard from "./SubTeamLeader/SubTeamLeader";

const Dashboard = () => {
  const userRole = localStorage.getItem("userRole");
  return userRole === "it_member" ? (
    <AdminDashboard />
  ) : userRole === "operation_member" ? (
    <ManagerDashboard />
  ) : userRole === "team_leaders,members" ? (
    <TeamLeaderDashboard />
  ) : userRole === "members,team_sub_leader" ? (
    <SubTeamLeaderDashboard />
  ) : (
    <MemberDashboard />
  );
};

export default Dashboard;
