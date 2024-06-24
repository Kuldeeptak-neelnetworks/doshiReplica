import React, { useContext, useEffect, useState } from "react";

import MembersContent from "./components/MembersContent";
import { ContextAPI } from "../../Context/ApiContext/ApiContext";

export const Members = () => {
  const { getAllMembers, initialState } = useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);

  // fetching all members api
  useEffect(() => {
    getAllMembers();
  }, [isUpdated]);

  return (
    <MembersContent
      membersData={initialState.membersList}
      setIsUpdated={setIsUpdated}
      isLoading={initialState.isLoading}
    />
  );
};
