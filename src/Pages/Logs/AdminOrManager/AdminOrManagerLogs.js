import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { Tooltip } from "react-tooltip";

import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../../templates/Breadcrumbs";
import PageHeader from "../../../templates/PageHeader";
import { settingsIcon1 } from "../../../utils/ImportingImages/ImportingImages";
import LogsTable from "./components/LogsTable";
import ReactTableSkeleton from "../../../templates/ReactTableSkeleton";
import { LogsModal } from "./components/LogsModal";
import { userRole } from "../../../utils/utilities/utilityFunctions";

const breadCrumbs = [
  {
    pageName: "Home",
    pageURL: "/dashboard",
  },
  {
    pageName: "Logs",
    pageURL: "/logs",
  },
];

const columnHeaders = ["Sr no", "Name", "Role", "Edit"];

// constructing headers for CSV Link
const headers = {
  headings: [
    { label: "Name", key: "name" },
    { label: "Role", key: "user_role" },
    { label: "Login Time", key: "login_on" },
  ],
  fileName: "User Logs",
};

const AdminOrManagerLogs = () => {
  const { getAllLogs, getAllMembers, initialState } = useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const [allUserLogsData, setAllUserLogsData] = useState([]);

  useEffect(() => {
    getAllLogs();
    getAllMembers();
  }, []);

  // creating logs dataset [merged all members api & logs api]
  useEffect(() => {
    const getLog = (memberId) =>
      initialState?.allLogs
        ?.filter(({ user_id }) => user_id === memberId)
        .map(({ login_on }) => login_on);

    const data = initialState?.membersList?.reduce((acc, curr) => {
      const bool = acc?.find((user) => user?.id === curr.member_id);
      if (!bool) {
        const userLogs = getLog(curr.member_id);
        const newMember = {
          name: curr.member_name,
          id: curr.member_id,
          role: userRole(curr.member_role),
          userLogs,
        };
        acc.push(newMember);
      }
      return acc;
    }, []);

    setAllUserLogsData(data);
  }, [initialState.membersList, initialState.allLogs]);

  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "sr no.",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Member Name",
      accessor: "name",
    },
    {
      Header: "Role",
      accessor: "role",
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <>
          <Tooltip
            id="check-user-logs-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="check-user-logs-tooltip"
            data-tooltip-content={`Check ${row.original.name} logs`}
            data-tooltip-place="top"
          >
            <LogsModal userLogData={row.original} />
          </div>
        </>
      ),
    },
  ];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => allUserLogsData, [allUserLogsData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      {/* Top header section */}
      <div className="relative-wrapper zIndex-2">
        <PageHeader
          tableInstance={tableInstance}
          icon={settingsIcon1}
          headerTitle={"Member Logs"}
        />
      </div>

      <section className="width-65 m-auto mt-5">
        {/* Logs Table */}
        {initialState?.isLoading ? (
          <ReactTableSkeleton columnHeaders={columnHeaders} />
        ) : allUserLogsData?.length > 0 ? (
          <div className="logs-table">
            <LogsTable
              tableInstance={tableInstance}
              headers={headers}
              logsData={initialState?.allLogs}
            />
          </div>
        ) : (
          <div className="mr-40 ml-30 mt-4 mb-15">
            <h5>No Data found!</h5>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminOrManagerLogs;
