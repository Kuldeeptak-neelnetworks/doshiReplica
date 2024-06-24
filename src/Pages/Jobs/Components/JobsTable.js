import React from "react";

import ReactTable from "../../../templates/ReactTable";
import ReactTableFooter from "../../../templates/ReactTableFooter";

const JobsTable = ({ tableInstance, headers, projectsData }) => {
  return (
    <section className="ml-30 mr-40">
      <ReactTable tableInstance={tableInstance} />
      <ReactTableFooter
        headers={headers}
        data={projectsData}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default JobsTable;
