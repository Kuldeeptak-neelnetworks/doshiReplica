import React from "react";

import ReactTable from "../../../templates/ReactTable";
import ReactTableFooter from "../../../templates/ReactTableFooter";

const TeamsTable = ({ tableInstance, headers, teamsData }) => {
  return (
    <section className="ml-30 mr-40">
      <ReactTable tableInstance={tableInstance} />
      <ReactTableFooter
        headers={headers}
        data={teamsData}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default TeamsTable;
