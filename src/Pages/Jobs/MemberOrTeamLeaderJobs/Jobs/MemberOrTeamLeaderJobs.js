import React, { useState, useEffect, useContext } from "react";

import JobsContent from "./components/JobsContent";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";

const MemberOrTeamLeaderJobs = () => {
  const { getJobsDetailsByMemberId, initialState } = useContext(ContextAPI);

  useEffect(() => {
    getJobsDetailsByMemberId();
  }, []);

  return (
    <JobsContent
      jobsData={initialState?.myJobs}
      isLoading={initialState.isLoading}
    />
  );
};

export default MemberOrTeamLeaderJobs;
