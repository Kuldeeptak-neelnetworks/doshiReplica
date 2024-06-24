import React, { useContext, useEffect, useState } from "react";

// import ClientWiseContent from "./Components/ClientWiseContent";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import TeamWiseContent from "./components/TeamWiseContent";

const TeamWise = () => {
  const { initialState, getTeamWiseReportData } = useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);



  // useEffect(() => {
  //   getTeamWiseReportData();
  // }, [isUpdated]);

  return (
    <TeamWiseContent
    allTeamWiseReports={initialState.allTeamWiseReports}
      setIsUpdated={setIsUpdated}
      isLoading={initialState?.isLoading}
     
    />
  );
};

export default TeamWise;
