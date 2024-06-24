import React from "react";

import ReactTable from "../../../../templates/ReactTable";
import ReactTableFooter from "../../../../templates/ReactTableFooter";

const ClientWiseTable = ({
  tableInstance,
  headers,
  reportsData,clientWise,
  columnHeaders,teamWiseList
}) => {
  return (
    <section className="ml-30 mr-40">
      <ReactTable tableInstance={tableInstance} columnHeaders={columnHeaders} />
      <ReactTableFooter
        headers={headers}
        data={clientWise}
        // data={reportsData}
        // data={teamWiseList}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default ClientWiseTable;
