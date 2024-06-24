import React from "react";

import ReactTable from "../../../../templates/ReactTable";
import ReactTableFooter from "../../../../templates/ReactTableFooter";

const TeamTable = ({
  tableInstance,
  headers,
  teamData,
  currentRow,
  columnHeaders,
  setIsUpdated
}) => {
  return (
    <section className="my-teams-table ml-30 mr-40">
      <ReactTable currentRow={currentRow} tableInstance={tableInstance} columnHeaders={columnHeaders} setIsUpdated={setIsUpdated} />
      <ReactTableFooter
        headers={headers}
        data={teamData}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default TeamTable;
