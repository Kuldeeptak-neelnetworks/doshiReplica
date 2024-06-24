import React, { useContext, useEffect, useState } from "react";

// import ClientWiseContent from "./Components/ClientWiseContent";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import TeamLeaderWiseContent from "./components/TeamLeaderWiseContent";

const TeamLeaderWise = () => {
  const { initialState, getAllClientsReportData } = useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    getAllClientsReportData();
  }, [isUpdated]);

  return (
    <TeamLeaderWiseContent
      clientsReportData={initialState?.allReports}
      setIsUpdated={setIsUpdated}
      isLoading={initialState?.isLoading}
    />
  );
};

export default TeamLeaderWise;
