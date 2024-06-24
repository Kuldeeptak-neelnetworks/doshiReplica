import React from "react";

import ReactTable from "../../../templates/ReactTable";
import ReactTableFooter from "../../../templates/ReactTableFooter";

const TimeEntriesTable = ({ tableInstance, headers, timeEntriesData }) => {
  return (
    <section className="time-entries-table mt-4 ml-30 mr-40">
      <ReactTable tableInstance={tableInstance} />
      <ReactTableFooter
        headers={headers}
        data={timeEntriesData}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default TimeEntriesTable;
