import React from "react";

import ReactTable from "../../../../templates/ReactTable";
import ReactTableFooter from "../../../../templates/ReactTableFooter";

const InvoiceListTable = ({ tableInstance, headers, invoice }) => {
  return (
    <section className="invoice-list-table mt-5 ml-30 mr-40">
      <ReactTable tableInstance={tableInstance} />
      <ReactTableFooter
        headers={headers}
        data={invoice}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default InvoiceListTable;
