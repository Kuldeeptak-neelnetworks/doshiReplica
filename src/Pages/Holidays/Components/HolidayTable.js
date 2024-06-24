import React, { useEffect } from "react";

import ReactTable from "../../../templates/ReactTable";
import ReactTableFooter from "../../../templates/ReactTableFooter";

const HolidayTable = ({ tableInstance, headers, holidayList }) => {
  const { setPageSize } = tableInstance;

  //   useEffect(() => setPageSize(7), []);

  return (
    <section className="holiday-table">
      <ReactTable tableInstance={tableInstance} />
      <ReactTableFooter
        headers={headers}
        data={holidayList}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default HolidayTable;
