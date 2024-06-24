import React from "react";

import ReactTable from "../../../../templates/ReactTable";
import ReactTableFooter from "../../../../templates/ReactTableFooter";

const TeamWiseReport = ({
  tableInstance,
  headers,
  reportsData,
  clientWise,
  columnHeaders,
  teamWise,
}) => {
  return (
    <section className="ml-30 mr-40 team-wise-report-table">
      <ReactTable tableInstance={tableInstance} columnHeaders={columnHeaders} />
      <ReactTableFooter
        headers={headers}
        data={teamWise}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default TeamWiseReport;
