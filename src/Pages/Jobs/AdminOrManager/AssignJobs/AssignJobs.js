import React, { useState, useEffect, useContext } from "react";

import AssignJobsContent from "./components/AssignJobsContent";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";

const AssignJobs = () => {
  const { getAllAssignJobs, initialState } = useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);

  // fetching all members api
  useEffect(() => {
    getAllAssignJobs();
  }, [isUpdated]);

  return (
    <AssignJobsContent
      setIsUpdated={setIsUpdated}
      isLoading={initialState?.isLoading}
    />
  );
};

export default AssignJobs;
