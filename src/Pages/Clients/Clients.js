import React, { useContext, useState, useEffect } from "react";

import ClientsContent from "./components/ClientsContent";
import { ContextAPI } from "../../Context/ApiContext/ApiContext";

export const Clients = () => {
  const { getAllClients, initialState } = useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    getAllClients();
  }, [isUpdated]);

  return (
    <ClientsContent
      clientsData={initialState?.clientsList}
      setIsUpdated={setIsUpdated}
      isLoading={initialState?.isLoading}
    />
  );
};
