import React, { useContext, useEffect, useState } from "react";

import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import BillingServicesContent from "./components/BillingServicesContent";

const BillingServices = () => {
  const { getAllBillingServices, initialState } = useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    getAllBillingServices();
  }, [isUpdated]);

  return (
    <BillingServicesContent
      billingServicesList={initialState.billingServicesList}
      isLoading={initialState.isLoading}
      setIsUpdated={setIsUpdated}
    />
  );
};

export default BillingServices;
