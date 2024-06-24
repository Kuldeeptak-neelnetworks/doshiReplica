import React from "react";

import ReactTable from "../../../templates/ReactTable";
import ReactTableFooter from "../../../templates/ReactTableFooter";

const ReportsTable = ({
  tableInstance,
  headers,
  reportsData,
  clientWise,
  columnHeaders,
  teamWiseList,
}) => {
  return (
    <section className="ml-30 mr-40">
      <ReactTable tableInstance={tableInstance} columnHeaders={columnHeaders} />
      <ReactTableFooter
        headers={headers}
        data={reportsData}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default ReportsTable;
