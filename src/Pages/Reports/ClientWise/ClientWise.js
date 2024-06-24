import React, { useContext, useEffect, useState } from "react";

import ClientWiseContent from "./Components/ClientWiseContent";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";

const ClientWise = () => {
  const { initialState, getAllClientsReportData } = useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    getAllClientsReportData();
  }, [isUpdated]);

  return (
    <ClientWiseContent
      clientsReportData={initialState?.allReports}
      setIsUpdated={setIsUpdated}
      isLoading={initialState?.isLoading}
    />
  );
};

export default ClientWise;
