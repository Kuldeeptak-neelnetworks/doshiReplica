import React, { useState, useEffect, useContext } from "react";

import TeamsContent from "./components/TeamsContent";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";

const AdminOrManagerTeams = () => {
  const { getAllTeams, initialState } = useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);

  // fetching all teams API
  useEffect(() => {
    getAllTeams();
  }, [isUpdated]);

  return (
    <TeamsContent
      teamsData={initialState.teamsList}
      setIsUpdated={setIsUpdated}
      isLoading={initialState.isLoading}
    />
  );
};

export default AdminOrManagerTeams;
