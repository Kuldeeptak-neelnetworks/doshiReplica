import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import PageHeader from "../../../../templates/PageHeader";
import { ContextSidebarToggler } from "../../../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../../../templates/Breadcrumbs";
import TeamsTable from "../../Components/TeamsTable";
import ReactTableSkeleton from "../../../../templates/ReactTableSkeleton";
import { DeleteTeamModal } from "./DeleteTeamModal";

import {
  EditSVG,
  teamsIcon1,
} from "../../../../utils/ImportingImages/ImportingImages";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

const TeamsContent = ({ teamsData, setIsUpdated, isLoading }) => {
  const navigate = useNavigate();
  const { sidebarClose } = useContext(ContextSidebarToggler);

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Teams",
      pageURL: "/teams",
    },
  ];

  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "sr no.",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Team Code",
      accessor: "team_code",
    },
    {
      Header: "Team Name",
      accessor: "team_name",
    },
    {
      Header: "Team Leader",
      accessor: "leader_name",
      Cell: ({ row }) => {
        const firstLetter = row.original.leader_name
          ? row.original.leader_name.slice(0, 1).toUpperCase()
          : "NA";
        return (
          firstLetter +
          (row.original.leader_name ? row.original.leader_name.slice(1) : "")
        );
      },
    },
    {
      Header: "Members Count",
      accessor: "member_count",
      Cell: ({ row }) => +row.original.member_count,
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => {
        return row.original.status === "active"
          ? "Active"
          : row.original.status === "inactive"
          ? "Suspended"
          : "";
      },
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <div className="table-actions-wrapper d-flex justify-content-end align-items-center">
          <Tooltip
            id="edit-team-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="edit-team-tooltip"
            data-tooltip-content="Edit Team"
            data-tooltip-place="top"
            onClick={() =>
              navigate("/teams/manage-team", {
                state: {
                  teamData: row?.original,
                },
              })
            }
          >
            <EditSVG />
          </div>
          <Tooltip
            id="delete-team-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="delete-team-tooltip"
            data-tooltip-content="Delete Team"
            data-tooltip-place="top"
          >
            <DeleteTeamModal
              teamData={row.original}
              setIsUpdated={setIsUpdated}
            />
          </div>
        </div>
      ),
    },
  ];

  const columnHeaders = [
    "Sr no",
    "Team Code",
    "Team Name",
    "Team Leader",
    "Team Members Names",
    "Team Members Count",
    "Status",
    "Edit",
  ];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => teamsData, [teamsData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // constructing headers for CSV Link
  const headers = {
    headings: [
      { label: "Team Code", key: "team_code" },
      { label: "Team Name", key: "team_name" },
      { label: "Team Leader", key: "team_leader" },
      { label: "Team Members Names", key: "member_names" },
      { label: "Team Members Count", key: "member_count" },
      { label: "Team Status", key: "status" },
    ],
    fileName: "Teams List",
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      {/* Top header section */}
      <div className="mb-5">
        <PageHeader
          tableInstance={tableInstance}
          icon={teamsIcon1}
          headerTitle={"All Teams"}
        >
          <button
            onClick={() => navigate("/teams/add-team")}
            className="custom-btn d-flex justify-content-center align-items-center gap-2"
          >
            Add Team <span className="fw-light fs-4">+</span>
          </button>
        </PageHeader>
      </div>

      {/* Members Table */}
      {isLoading ? (
        <ReactTableSkeleton columnHeaders={columnHeaders} />
      ) : teamsData.length > 0 ? (
        <TeamsTable
          tableInstance={tableInstance}
          headers={headers}
          teamsData={teamsData}
        />
      ) : (
        <div className="mr-40 ml-30 mb-15">
          <h5>No Teams Found, Please create new Team!</h5>
        </div>
      )}
    </div>
  );
};

export default TeamsContent;
