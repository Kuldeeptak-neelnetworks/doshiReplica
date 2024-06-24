import React, { useEffect } from "react";

import ReactTable from "../../../../templates/ReactTable";
import ReactTableFooter from "../../../../templates/ReactTableFooter";

const BillingServicesTable = ({
  tableInstance,
  headers,
  billingServicesList,
}) => {
  const { setPageSize } = tableInstance;

  useEffect(() => setPageSize(7), []);

  return (
    <section className="">
      <ReactTable tableInstance={tableInstance} />
      <ReactTableFooter
        headers={headers}
        data={billingServicesList}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default BillingServicesTable;
