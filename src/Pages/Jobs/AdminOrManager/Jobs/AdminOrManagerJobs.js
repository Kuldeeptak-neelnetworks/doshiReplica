import React, { useState, useEffect, useContext } from "react";

import JobsContent from "./components/JobsContent";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";

const AdminOrManagerJobs = () => {
  const { getAllJobs, initialState } = useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    getAllJobs();
  }, [isUpdated]);

  return (
    <JobsContent
      jobsData={initialState?.jobs}
      setIsUpdated={setIsUpdated}
      isLoading={initialState.isLoading}
    />
  );
};

export default AdminOrManagerJobs;
