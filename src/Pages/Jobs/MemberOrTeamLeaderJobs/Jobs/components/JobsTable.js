import React from "react";

import ReactTableFooter from "../../../../../templates/ReactTableFooter";
import ReactTable from "../../../../../templates/ReactTable";

const JobsTable = ({ tableInstance, headers, jobsData, columnHeaders }) => {
  return (
    <section className="ml-30 mr-40">
      <ReactTable tableInstance={tableInstance} columnHeaders={columnHeaders} />
      <ReactTableFooter
        headers={headers}
        data={jobsData}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default JobsTable;
