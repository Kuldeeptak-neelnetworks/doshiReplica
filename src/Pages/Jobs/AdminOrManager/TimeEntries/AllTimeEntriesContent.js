import React, { useContext, useMemo, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

import { fileIcon } from "../../../../utils/ImportingImages/ImportingImages";
import PageHeader from "../../../../templates/PageHeader";
import { ContextSidebarToggler } from "../../../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../../../templates/Breadcrumbs";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import ReactTableSkeleton from "../../../../templates/ReactTableSkeleton";
import TimeEntriesTable from "../../Components/TimeEntriesTable";
import { UpdateTimeEntryModal } from "./components/UpdateTimeEntryModal";
import TimeEntriesFilter from "../../Components/TimeEntriesFilter";
import { AddTimeEntryModal } from "./components/AddTimeEntryModal";
import {
  formatDate,
  formatTime,
} from "../../../../utils/utilities/utilityFunctions";
import { CheckTimeEntryDetails } from "./components/CheckTimeEntryDetails";

const breadCrumbs = [
  {
    pageName: "Home",
    pageURL: "/dashboard",
  },
  {
    pageName: "Jobs",
    pageURL: "/jobs",
  },
  {
    pageName: "Time Entries",
    pageURL: "/jobs/time-entries",
  },
];

// constructing headers for CSV Link
const headers = {
  headings: [
    { label: "Job", key: "task_name" },
    { label: "Member", key: "member_name" },
    { label: "Team", key: "team_name" },
    { label: "Reviewer", key: "reviewer_name" },
    { label: "Description", key: "work_description" },
    { label: "Status", key: "time_entries_status" },
    { label: "Date", key: "working_date" },
    { label: "Time", key: "working_time" },
  ],
  fileName: "Time Entries",
};

const AllTimeEntriesContent = () => {
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const { getAllJobCategories, getAllTimeEntries, initialState } =
    useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);
  const [timeEntriesData, setTimeEntriesData] = useState([]);
  const [filters, setFilters] = useState({
    status: null,
    entryAs: null,
    showDiscountedHoursEntries: false,
    reviewer: "",
  });

  useEffect(() => {
    getAllJobCategories();
    getAllTimeEntries();
  }, [isUpdated]);

  const filterDiscountedData = (dataset) => {
    return dataset?.filter((entry) =>
      Boolean(entry?.adjustment_hours_reason?.trim())
    );
  };

  useEffect(() => {
    // filter by status
    const filterByStatus = initialState?.allTimeEntries?.filter((entry) =>
      filters.status
        ? entry.time_entries_status === filters.status.value
        : entry
    );

    // filter by entry as
    const filterByEntryAs = filterByStatus?.filter((entry) =>
      filters.entryAs ? entry.entries_as === filters.entryAs.value : entry
    );

    // filter by reviewer name
    const filterByReviewer = filterByEntryAs?.filter((entry) =>
      filters?.reviewer?.value
        ? entry.reviewer_name === filters?.reviewer?.value
        : entry
    );

    let discountedHoursTimeEntries = [...filterByReviewer];

    // filter discounted hours
    if (filters.showDiscountedHoursEntries) {
      discountedHoursTimeEntries = filterDiscountedData(
        discountedHoursTimeEntries
      );
    }

    const entriesData = discountedHoursTimeEntries?.toSorted(
      (a, b) => new Date(b.working_date) - new Date(a.working_date)
    );
    setTimeEntriesData(() => entriesData);
  }, [filters, initialState?.allTimeEntries]);

  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "entries_id",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Member",
      accessor: "member_name",
    },
    {
      Header: "Job",
      accessor: "task_name",
    },
    {
      Header: "Team",
      accessor: "team_name",
      Cell: ({ row }) => row.original.team_name ?? "---",
    },
    {
      Header: "Reviewer",
      accessor: "reviewer_name",
      Cell: ({ row }) => row.original.reviewer_name ?? "---",
    },
    {
      Header: "Status",
      accessor: "time_entries_status",
      Cell: ({ row }) => (
        <div className="d-flex justify-content-center align-items-center">
          <Stack direction="horizontal">
            {row.original.time_entries_status === "approved" ? (
              <Badge bg="success">Approved</Badge>
            ) : (
              <Badge bg="danger">Pending</Badge>
            )}
          </Stack>
        </div>
      ),
    },
    {
      Header: "Timestamp",
      accessor: "working_date",
      Cell: ({ row }) => {
        const date = formatDate(row.original.working_date);
        const time = formatTime(row.original.working_time);
        return (
          <div className="d-flex flex-column justify-content-center align-items-center gap-1">
            <p className="m-0">{date}</p>
            <p className="m-0">{time}</p>
          </div>
        );
      },
    },
    {
      Header: "Description",
      accessor: "work_description",
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <>
          {row.original.time_entries_status === "pending" && (
            <div className="table-actions-wrapper d-flex justify-content-center align-items-center">
              <Tooltip
                id="edit-time-entry-tooltip"
                style={{
                  background: "#000",
                  color: "#fff",
                }}
                opacity={0.9}
              />
              <div
                data-tooltip-id="edit-time-entry-tooltip"
                data-tooltip-content="Update Time Entry"
                data-tooltip-place="top"
              >
                <UpdateTimeEntryModal
                  setIsUpdated={setIsUpdated}
                  timeEntryData={row.original}
                />
              </div>
            </div>
          )}

          {row.original.time_entries_status === "approved" &&
          Boolean(row.original.adjustment_hours_reason?.trim()) ? (
            <>
              <Tooltip
                id="check-entry-details-tooltip"
                style={{
                  background: "#000",
                  color: "#fff",
                }}
                opacity={0.9}
              />
              <div
                data-tooltip-id="check-entry-details-tooltip"
                data-tooltip-content="Check Entry Details"
                data-tooltip-place="top"
              >
                <CheckTimeEntryDetails timeEntry={row.original} />
              </div>
            </>
          ) : null}
        </>
      ),
    },
  ];

  const columnHeaders = [
    "Sr no.",
    "Member",
    "Job",
    "Team",
    "Reviewer",
    "Status",
    "Description",
    "Timestamp",
    "Edit",
  ];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => timeEntriesData, [timeEntriesData]);

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
      <PageHeader
        tableInstance={tableInstance}
        icon={fileIcon}
        headerTitle={"Time Entries"}
      >
        <AddTimeEntryModal setIsUpdated={setIsUpdated} />
      </PageHeader>

      <TimeEntriesFilter
        filters={filters}
        setFilters={setFilters}
        forTeamLeader={false}
        timeEntries={initialState?.allTimeEntries}
        filterDiscountedData={filterDiscountedData}
      />

      {/* Time Entries Table */}
      {initialState.isLoading ? (
        <ReactTableSkeleton columnHeaders={columnHeaders} />
      ) : timeEntriesData?.length > 0 ? (
        <TimeEntriesTable
          tableInstance={tableInstance}
          headers={headers}
          timeEntriesData={timeEntriesData}
        />
      ) : (
        <div className="mr-40 ml-30 mt-4 mb-15">
          <h5>No Entries found!</h5>
        </div>
      )}
    </div>
  );
};

export default AllTimeEntriesContent;
