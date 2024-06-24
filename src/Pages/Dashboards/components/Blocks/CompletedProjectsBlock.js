import React, { useMemo } from "react";
import DashboardBlock from "./DashboardBlock";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

const CompletedProjectsBlock = () => {
  const completedJobsTableColumns = [
    {
      Header: "Project no.",
      accessor: "project_code",
    },
    {
      Header: "Project Name",
      accessor: "project_name",
    },
  ];

  const completedJobsDataset = [
    { project_code: "NN101", project_name: "NN Website" },
    { project_code: "NN102", project_name: "Pixtasy" },
    { project_code: "NN103", project_name: "URL Shortner" },
    { project_code: "NN104", project_name: "devWorks" },
    { project_code: "NN105", project_name: "Doshi PMS" },
  ];
  const columns = useMemo(() => completedJobsTableColumns, []);
  const data = useMemo(() => completedJobsDataset, []);

  const completedJobsTableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <DashboardBlock
      tableInstance={completedJobsTableInstance}
      title={"Completed Projects"}
      showButton={true}
    />
  );
};

export default CompletedProjectsBlock;
