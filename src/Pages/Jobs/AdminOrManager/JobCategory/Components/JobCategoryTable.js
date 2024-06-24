import React, { useEffect } from "react";

import ReactTable from "../../../../../templates/ReactTable";
import ReactTableFooter from "../../../../../templates/ReactTableFooter";

const JobCategoryTable = ({ tableInstance, headers, jobCategories }) => {
  const { setPageSize } = tableInstance;

  useEffect(() => setPageSize(7), []);

  return (
    <section className="">
      <ReactTable tableInstance={tableInstance} />
      <ReactTableFooter
        headers={headers}
        data={jobCategories}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default JobCategoryTable;
