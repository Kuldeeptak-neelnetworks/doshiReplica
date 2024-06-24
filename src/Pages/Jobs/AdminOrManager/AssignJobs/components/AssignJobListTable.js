import React from "react";

import ReactTable from "../../../../../templates/ReactTable";
import ReactTableFooter from "../../../../../templates/ReactTableFooter";

const AssignJobListTable = ({ tableInstance, headers, assignedJobs }) => {
  return (
    <section className="assign-jobs-list-table mt-5 ml-30 mr-40">
      <ReactTable tableInstance={tableInstance} />
      <ReactTableFooter
        headers={headers}
        data={assignedJobs}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default AssignJobListTable;
