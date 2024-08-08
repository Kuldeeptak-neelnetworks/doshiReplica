import React, { useContext, useMemo, useState, useEffect } from "react";
import DashboardBlock from "./DashboardBlock";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import axios from "axios";

import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import {
  handleAPIError,
  headerOptions,
} from "../../../../utils/utilities/utilityFunctions";
import { Tooltip } from "react-tooltip";
import { json, useNavigate } from "react-router-dom";
import { SendInvoiceModal } from "../../../Invoices/Components/SendInvoiceModal";

const TeamLeaderComplatedJob = () => {
  const { mainURL } = useContext(ContextAPI);
  const userId = localStorage.getItem("userId") ?? null;
  const [teamLeaderjobList, setTeamLeaderjobList] = useState([]);

  const jobsTableColumns = [
    {
      Header: "Job Code",
      accessor: (row) => {
        return row.job_code === null ? "N.A": row.job_code;
     
      },
    },
    {
      Header: "Job Name",
      accessor: (row) => {
        return row.job_name === null? "N.A" : row.job_name
      },
    },
  ];

  const columns = useMemo(() => jobsTableColumns, []);
  const data = useMemo(() => teamLeaderjobList, [teamLeaderjobList]);
  const handleClientInvoiceList = async () => {
    const url = `${mainURL}dashboard/team-leader/completed-jobs/latest-five/${userId}`;

    try {
      const result = await axios.get(url, { headers: headerOptions() });
      const teamLeaderjobList = result?.data?.jobs_data ?? [];
      setTeamLeaderjobList(teamLeaderjobList);
    } catch (error) {
      console.error("Error fetching team leader job:", error);
    }
  };

  useEffect(() => {
    handleClientInvoiceList();
  }, []);
 
  const jobsTableInstance = useTable(
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
      tableInstance={jobsTableInstance}
      title={"Completed Job"}
      showButton={true}
    />
  );
};

export default TeamLeaderComplatedJob;
