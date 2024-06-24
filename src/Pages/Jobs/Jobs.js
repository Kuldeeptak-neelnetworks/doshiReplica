import React, { useContext } from "react";

import { ContextAPI } from "../../Context/ApiContext/ApiContext";
import AdminOrManagerJobs from "./AdminOrManager/Jobs/AdminOrManagerJobs";
import MemberOrTeamLeaderJobs from "./MemberOrTeamLeaderJobs/Jobs/MemberOrTeamLeaderJobs";

const Jobs = () => {
  const { userDetails } = useContext(ContextAPI);

  return (
    <>
      {userDetails?.member_role === "it_member" ||
      userDetails?.member_role === "operation_member" ? (
        <AdminOrManagerJobs />
      ) : (
        <MemberOrTeamLeaderJobs />
      )}
    </>
  );
};

export default Jobs;
