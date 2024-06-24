import React, { useContext } from "react";

import JobCategoryContent from "./Components/JobCategoryContent";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";

const JobCategory = () => {
  const { getAllJobCategories, initialState } = useContext(ContextAPI);

  return (
    <JobCategoryContent
      getAllJobCategories={getAllJobCategories}
      jobCategories={initialState.jobCategories}
      isLoading={initialState.isLoading}
    />
  );
};

export default JobCategory;
