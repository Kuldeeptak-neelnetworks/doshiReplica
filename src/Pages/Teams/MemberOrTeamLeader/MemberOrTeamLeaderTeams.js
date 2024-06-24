import React, { useContext, useEffect, useState } from "react";

import TeamsContent from "./components/TeamsContent";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";

const MemberOrTeamLeaderTeams = () => {
  const { getTeamDetailsByMemberId, initialState } = useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);
  const userRole = localStorage.getItem("userRole");


  useEffect(() => {
    getTeamDetailsByMemberId();
  }, [isUpdated]);

  return (
    <>
     {/* {userRole === "team_leaders,members" ? ( */}
      <TeamsContent
        teamData={initialState?.myTeams}
        setIsUpdated={setIsUpdated}
      />
      {/* ):null } */}
    </>
   
  );
};

export default MemberOrTeamLeaderTeams;
