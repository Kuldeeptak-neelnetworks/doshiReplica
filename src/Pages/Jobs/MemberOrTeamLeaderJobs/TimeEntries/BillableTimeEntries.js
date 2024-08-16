import React, { useContext } from "react";

import { ContextAPI } from "../../../../Context/ApiContext/ApiContext"
import BillableTimeEntriesContent from "../../AdminOrManager/TimeEntries/components/BillableTimeEntriesContent";

const BillableTimeEntries = () => {
  const { userDetails } = useContext(ContextAPI);
  const shouldShowContent =
  userDetails?.member_role === "it_member" ||
  userDetails?.member_role === "operation_member";

  return (
    <>
     
     {shouldShowContent && <BillableTimeEntriesContent />}
   
    </>
  );
};

export default BillableTimeEntries;
