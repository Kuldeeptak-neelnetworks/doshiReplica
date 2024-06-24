import React, { useContext } from "react";

import { ContextAPI } from "../../Context/ApiContext/ApiContext";
import AllTimeEntriesContent from "./AdminOrManager/TimeEntries/AllTimeEntriesContent";
import MyTeamTimeEntriesContent from "./MemberOrTeamLeaderJobs/TimeEntries/MyTeamTimeEntriesContent";

const TimeEntries = () => {
  const { userDetails } = useContext(ContextAPI);

  return (
    <>
      {userDetails?.member_role === "it_member" ||
      userDetails?.member_role === "operation_member" ? (
        <AllTimeEntriesContent />
      ) : (
        <MyTeamTimeEntriesContent />
      )}
    </>
  );
};

export default TimeEntries;
