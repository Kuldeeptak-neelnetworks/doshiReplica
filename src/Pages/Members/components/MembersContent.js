import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

import { usersIcon } from "../../../utils/ImportingImages/ImportingImages";

import PageHeader from "../../../templates/PageHeader";
import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import MembersTable from "./MembersTable";
import { EditMemberModal } from "./EditMemberModal";
import Breadcrumbs from "../../../templates/Breadcrumbs";
import { DeleteMemberModal } from "./DeleteMemberModal";
import ReactTableSkeleton from "../../../templates/ReactTableSkeleton";
import { isGreaterThan10 } from "../../../utils/utilities/utilityFunctions";

const MembersContent = ({ membersData, setIsUpdated, isLoading }) => {
  const navigate = useNavigate();
  const { sidebarClose } = useContext(ContextSidebarToggler);

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Members",
      pageURL: "/members",
    },
  ];

  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "sr no.",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Member Code",
      accessor: "member_code",
      Cell: ({ row }) => row.original?.member_code || "N.A",
    },
    {
      Header: "Name",
      accessor: "member_name",
      Cell: ({ row }) => row.original?.member_name || "N.A",
    },
    {
      Header: "Email ID",
      accessor: "member_email",
    },
    {
      Header: "Postion",
      accessor: "member_role",
      Cell: ({ row }) => {
        return row.original.member_role === "it_member"
          ? "IT Member"
          : row.original.member_role === "operation_member"
          ? "Operation Member"
          : row.original.member_role === "team_leaders"
          ? "Team Leader"
          : row.original.member_role === "members"
          ? "Member"
          : row.original.member_role === "team_leaders,members"
          ? "Team Leader, Member"
          : row.original.member_role === "members,team_sub_leader"
          ? "Member,Sub Leader"
          : "";
      },
    },
    {
      Header: "Status",
      accessor: "current_status",
      Cell: ({ row }) => {
        return row.original.current_status === "active"
          ? "Active"
          : row.original.current_status === "inactive"
          ? "Suspended"
          : "";
      },
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <div className="table-actions-wrapper d-flex justify-content-end align-items-center">
          <Tooltip
            id="edit-member-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="edit-member-tooltip"
            data-tooltip-content="Edit Member Details"
            data-tooltip-place="top"
          >
            <EditMemberModal
              memberData={row.original}
              setIsUpdated={setIsUpdated}
            />
          </div>

          <Tooltip
            id="delete-member-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="delete-member-tooltip"
            data-tooltip-content="Delete Member"
            data-tooltip-place="top"
          >
            <DeleteMemberModal
              memberData={row.original}
              setIsUpdated={setIsUpdated}
            />
          </div>
        </div>
      ),
    },
  ];

  const columnHeaders = [
    "Sr no",
    "Member Code",
    "Name",
    "Email ID",
    "Postion",
    "Status",
    "Edit",
  ];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => membersData, [membersData]);

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
      { label: "Member Name", key: "member_name" },
      { label: "Email ID", key: "member_email" },
      { label: "Position", key: "member_role" },
      { label: "Registered on", key: "registered_on" },
      { label: "Status", key: "current_status" },
    ],
    fileName: "Members List",
  };

  const membersCount = useMemo(() => {
    return membersData.reduce(
      (acc, curr) =>
        curr.member_role === "it_member"
          ? (acc = { ...acc, it_members: acc.it_members + 1 })
          : curr.member_role === "operation_member"
          ? (acc = { ...acc, operation_member: acc.operation_member + 1 })
          : curr.member_role === "team_leaders,members"
          ? (acc = { ...acc, team_leaders: acc.team_leaders + 1 })
          : curr.member_role === "members,team_sub_leader"
          ? (acc = { ...acc, team_sub_leaders: acc.team_sub_leaders + 1 })
          : curr.member_role === "members"
          ? (acc = { ...acc, members: acc.members + 1 })
          : acc,
      {
        it_members: 0,
        operation_member: 0,
        team_leaders: 0,
        members: 0,
        team_sub_leaders: 0,
      }
    );
  }, [membersData]);

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      {/* Top header section */}
      <div className="relative-wrapper zIndex-2">
        <PageHeader
          tableInstance={tableInstance}
          icon={usersIcon}
          headerTitle={"Members"}
        >
          <button
            onClick={() => navigate("/members/add-member")}
            className="custom-btn d-flex justify-content-center align-items-center gap-2"
          >
            Add Member <span className="fw-light fs-4">+</span>
          </button>
        </PageHeader>
      </div>

      {/* All Members Count */}
      <section className="mt-5 parent-count-wrapper">
        <div className="count-wrapper">
          <p className="count">{isGreaterThan10(membersCount?.it_members)}</p>
          <p className="role">IT members</p>
        </div>
        <div className="count-wrapper">
          <p className="count">
            {isGreaterThan10(membersCount?.operation_member)}
          </p>
          <p className="role">Operation members</p>
        </div>
        <div className="count-wrapper">
          <p className="count">{isGreaterThan10(membersCount?.team_leaders)}</p>
          <p className="role">Team Leaders</p>
        </div>
        <div className="count-wrapper">
          <p className="count">
            {isGreaterThan10(membersCount?.team_sub_leaders)}
          </p>
          <p className="role">Team Sub-Leaders</p>
        </div>
        <div className="count-wrapper">
          <p className="count">{isGreaterThan10(membersCount?.members)}</p>
          <p className="role">Members</p>
        </div>
      </section>

      {/* Members Table */}
      {isLoading ? (
        <ReactTableSkeleton columnHeaders={columnHeaders} />
      ) : membersData.length > 0 ? (
        <MembersTable
          tableInstance={tableInstance}
          headers={headers}
          membersData={membersData}
        />
      ) : (
        <div className="mt-4 mr-40 ml-30 mb-15">
          <h5>No Members Found, Please add new Member!</h5>
        </div>
      )}
    </div>
  );
};

export default MembersContent;
