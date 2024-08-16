import React from "react";

import ReactTable from "../../../templates/ReactTable";
import ReactTableFooter from "../../../templates/ReactTableFooter";

const BillableEntriesTable = ({ tableInstance, headers, billableTimeEntriesData}) => {
    console.log("billableTimeEntriesData",billableTimeEntriesData)
  return (
    <section className="time-entries-table mt-4 ml-30 mr-40">
      <ReactTable tableInstance={tableInstance} />
      <ReactTableFooter
        headers={headers}
        data={billableTimeEntriesData}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default BillableEntriesTable;
