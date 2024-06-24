import React, { useContext, useEffect, useState } from "react";

import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import InvoiceList from "./components/InvoiceList";
// import BillingServicesContent from "./components/BillingServicesContent";

const GetAllInvoice = () => {
  const { getAllInvoice, initialState } = useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    getAllInvoice();
  }, [isUpdated]);

  return (
    <InvoiceList
      setIsUpdated={setIsUpdated}
      isLoading={initialState?.isLoading}
    />
  );
};

export default GetAllInvoice;
