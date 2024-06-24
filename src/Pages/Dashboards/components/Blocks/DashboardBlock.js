import React from "react";
import ProjectsTable from "../ProjectsTable";

const DashboardBlock = ({ tableInstance, title }) => {
  return (
    <div className="dashboard-block d-flex w-100 flex-column justify-content-center align-items-center gap-1">
      <div className="block-header d-flex justify-content-between align-items-center w-100">
        <p className="block-title m-0">{title}</p>
      </div>
      <div className="block-content w-100">
        <ProjectsTable tableInstance={tableInstance} />
      </div>
    </div>
  );
};

export default DashboardBlock;
