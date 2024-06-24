import React, { useContext, useEffect, useState } from "react";

import { ContextAPI } from "../../../Context/ApiContext/ApiContext";

import MemberList from "./MemberList";
// import BillingServicesContent from "./components/BillingServicesContent";

const GetAllMembers = () => {
  const { getAllMemberWiseReportData, initialState } = useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);
  

  // useEffect(() => {
  //   getAllMemberWiseReportData();
  // }, [isUpdated]);

  return (
    <MemberList
     allMemberReports={initialState.allMemberReports}
      setIsUpdated={setIsUpdated}
      isLoading={initialState?.isLoading}
    />
  );
};

export default GetAllMembers;
