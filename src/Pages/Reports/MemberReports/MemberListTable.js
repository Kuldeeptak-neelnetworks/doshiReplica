import React from "react";

import ReactTable from "../../../templates/ReactTable";
import ReactTableFooter from "../../../templates/ReactTableFooter";

const MemberListTable = ({ tableInstance, headers, invoice, memberList }) => {
  return (
    <section className="assign-jobs-list-table mt-5 ml-30 mr-40 member-list-table">
      <ReactTable tableInstance={tableInstance} />
      <ReactTableFooter
        headers={headers}
        data={memberList}
        tableInstance={tableInstance}
      />
    </section>
  );
};

export default MemberListTable;
