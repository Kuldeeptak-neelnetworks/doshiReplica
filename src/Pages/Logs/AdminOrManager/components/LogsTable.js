import React from "react";

import ReactTable from "../../../../templates/ReactTable";
import ReactTableFooter from "../../../../templates/ReactTableFooter";

const LogsTable = ({ tableInstance, headers, logsData, columnHeaders }) => {
  return (
    <section className="ml-30 mr-40">
      <ReactTable tableInstance={tableInstance} columnHeaders={columnHeaders} />
      <ReactTableFooter
        headers={headers}
        data={logsData}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default LogsTable;
