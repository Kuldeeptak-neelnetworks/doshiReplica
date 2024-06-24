import React, { useContext } from "react";

import { ContextAPI } from "../../Context/ApiContext/ApiContext";
import AdminOrManagerTeams from "./AdminOrManager/AdminOrManagerTeams";
import MemberOrTeamLeaderTeams from "./MemberOrTeamLeader/MemberOrTeamLeaderTeams";

export const Teams = () => {
  const { userDetails } = useContext(ContextAPI);

  return (
    <>
      {userDetails?.member_role === "it_member" ||
      userDetails?.member_role === "operation_member"  ? (
        <AdminOrManagerTeams />
      ) : (
        
        <MemberOrTeamLeaderTeams />
      )}
    </>
  );
};
