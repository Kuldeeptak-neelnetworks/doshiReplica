import React, { useContext } from "react";

import { ContextAPI } from "../../Context/ApiContext/ApiContext";
import AdminOrManagerLogs from "./AdminOrManager/AdminOrManagerLogs";
import MemberOrTeamLeaderLogs from "./MemberOrTeamLeader/MemberOrTeamLeaderLogs";

const Logs = () => {
  const { userDetails } = useContext(ContextAPI);

  return (
    <>
      {userDetails?.member_role === "it_member" ||
      userDetails?.member_role === "operation_member" ? (
        <AdminOrManagerLogs />
      ) : (
        <MemberOrTeamLeaderLogs />
      )}
    </>
  );
};

export default Logs;
