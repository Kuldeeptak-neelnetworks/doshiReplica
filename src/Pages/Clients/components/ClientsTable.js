import React from "react";

import ReactTable from "../../../templates/ReactTable";
import ReactTableFooter from "../../../templates/ReactTableFooter";

const ClientsTable = ({ tableInstance, headers, clientsData }) => {
  return (
    <section className="ml-30 mr-40">
      <ReactTable tableInstance={tableInstance} />
      <ReactTableFooter
        headers={headers}
        data={clientsData}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default ClientsTable;
