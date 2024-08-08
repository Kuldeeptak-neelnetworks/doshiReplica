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
import { UpdateTimeEntryModal } from "../../AdminOrManager/TimeEntries/components/UpdateTimeEntryModal";
import TimeEntriesFilter from "../../Components/TimeEntriesFilter";
import {
  formatDate,
  formatTime,
} from "../../../../utils/utilities/utilityFunctions";
import { SelectedMultipleEntriesModal } from "../../Components/SelectedMultipleEntriesModal";

const userRole = localStorage.getItem("userRole");

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

const MyTeamTimeEntriesContent = () => {
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const { getAllMyTeamTimeEntries, getTeamDetailsByMemberId, initialState } =
    useContext(ContextAPI);
  const [isUpdated, setIsUpdated] = useState(false);
  const [timeEntriesData, setTimeEntriesData] = useState([]);
  const [filters, setFilters] = useState({
    status: null,
    entryAs: null,
  });

  useEffect(() => {
    getTeamDetailsByMemberId();
  }, []);

  useEffect(() => {
    if (initialState.myTeams) {
      getAllMyTeamTimeEntries(initialState?.myTeams?.id);
    }
  }, [initialState.myTeams, isUpdated]);

  useEffect(() => {
    const filterByStatus = initialState?.myteamTimeEntries?.filter((entry) =>
      filters.status
        ? entry.time_entries_status === filters.status.value
        : entry
    );
    const filterByEntryAs = filterByStatus?.filter((entry) =>
      filters.entryAs ? entry.entries_as === filters.entryAs.value : entry
    );

    sortByDesc(filterByEntryAs);
  }, [filters, initialState?.myteamTimeEntries]);

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;

    // checking all time entries
    if (name === "allTimeEntries") {
      const checkingAllPendingTimeEntries = timeEntriesData.map((entry) =>
        entry.time_entries_status === "pending"
          ? {
              ...entry,
              isChecked: checked,
            }
          : entry
      );
      sortByDesc(checkingAllPendingTimeEntries);
    } else {
      const checkSelectedEntry = timeEntriesData.map((entry) =>
        entry.entries_id === name ? { ...entry, isChecked: checked } : entry
      );
      sortByDesc(checkSelectedEntry);
    }
  };

  // checking if all entries are approved or not
  const allEntriesApproved = useMemo(
    () =>
      timeEntriesData.every(
        (entry) => entry.time_entries_status === "approved"
      ),
    [timeEntriesData]
  );

  // checking "all time entries" checkbox if all pending entries are selected / main checkbox is selected
  const checkAllPendingTimeEntriesCheckbox = useMemo(() => {
    const temp = timeEntriesData
      .filter((entry) => entry.time_entries_status === "pending")
      .every((entry) => entry?.isChecked);

    return temp;
  }, [timeEntriesData]);

  // const tableColumns = [
  //   {
  //     Header: "Sr no.",
  //     accessor: "entries_id",
  //     Cell: ({ row }) => row.index + 1,
  //   },
  //   {
  //     Header: "Member",
  //     accessor: "member_name",
  //   },
  //   {
  //     Header: "Job",
  //     accessor: "task_name",
  //   },
  //   {
  //     Header: "Team",
  //     accessor: "team_name",
  //     Cell: ({ row }) => row.original.team_name ?? "---",
  //   },
  //   {
  //     Header: "Reviewer",
  //     accessor: "reviewer_name",
  //     Cell: ({ row }) => row.original.reviewer_name ?? "---",
  //   },
  //   {
  //     Header: "Status",
  //     accessor: "time_entries_status",
  //     Cell: ({ row }) => (
  //       <div className="d-flex justify-content-center align-items-center">
  //         <Stack direction="horizontal">
  //           {row.original.time_entries_status === "approved" ? (
  //             <Badge bg="success">Approved</Badge>
  //           ) : (
  //             <Badge bg="danger">Pending</Badge>
  //           )}
  //         </Stack>
  //       </div>
  //     ),
  //   },
  //   {
  //     Header: "Timestamp",
  //     accessor: "working_date",
  //     Cell: ({ row }) => {
  //       const date = formatDate(row.original.working_date);
  //       const time = formatTime(row.original.working_time);
  //       return (
  //         <div className="d-flex flex-column justify-content-center align-items-center gap-1">
  //           <p className="m-0">{date}</p>
  //           <p className="m-0">{time}</p>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     Header: "Description",
  //     accessor: "work_description",
  //   },

  //   {
  //     Header: "Edit",
  //     Cell: ({ row }) => (
  //       <>
  //         {row.original.time_entries_status === "pending" && (
  //           <div className="table-actions-wrapper d-flex justify-content-center align-items-center">
  //             <Tooltip
  //               id="edit-time-entry-tooltip"
  //               style={{
  //                 background: "#000",
  //                 color: "#fff",
  //               }}
  //               opacity={0.9}
  //             />
  //             <div
  //               data-tooltip-id="edit-time-entry-tooltip"
  //               data-tooltip-content="Update Time Entry"
  //               data-tooltip-place="top"
  //             >
  //               <UpdateTimeEntryModal
  //                 setIsUpdated={setIsUpdated}
  //                 timeEntryData={row.original}
  //               />
  //             </div>
  //           </div>
  //         )}
  //       </>
  //     ),
  //   },
  // ];

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
  ];

  // Conditionally add Edit column based on userRole
  if (userRole !== "members,team_sub_leader") {
    tableColumns.push({
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
        </>
      ),
    });
  }

  const columns = useMemo(() => {
    if (!allEntriesApproved) {
      const checkboxColumn = {
        Header: () => (
          <input
            type="checkbox"
            checked={checkAllPendingTimeEntriesCheckbox}
            name="allTimeEntries"
            onChange={(e) => handleCheckbox(e)}
            className="cursor-pointer checkbox-input"
          />
        ),
        id: "selection_id",
        Cell: ({ row }) =>
          row.original.time_entries_status === "pending" && (
            <input
              type="checkbox"
              onChange={(e) => handleCheckbox(e)}
              name={row.original.entries_id}
              checked={row.original?.isChecked || false}
              className="cursor-pointer checkbox-input"
            />
          ),
      };
      return [checkboxColumn, ...tableColumns];
    } else {
      return tableColumns;
    }
  }, [timeEntriesData, allEntriesApproved]);

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

  const sortByDesc = (data) => {
    if (data.length > 0) {
      const sortedData = data.toSorted(
        (a, b) => new Date(b.working_date) - new Date(a.working_date)
      );
      setTimeEntriesData(() => sortedData);
    } else {
      setTimeEntriesData(() => []);
    }
  };

  const selectedTimeEntries = useMemo(() => {
    const isTrue = timeEntriesData.some((entry) => entry?.isChecked);
    return isTrue;
  }, [timeEntriesData]);

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
      />

      <TimeEntriesFilter
        filters={filters}
        setFilters={setFilters}
        forTeamLeader={true}
      />

      {/* Approving Multiple Time Entries */}
      {selectedTimeEntries && (
        <div className="mr-40 ml-30 mt-2">
          <SelectedMultipleEntriesModal
            timeEntriesData={timeEntriesData}
            setIsUpdated={setIsUpdated}
          />
        </div>
      )}

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
        <div className="mt-5 mr-40 ml-30 mb-15">
          <h5>No Entries found by your team!</h5>
        </div>
      )}
    </div>
  );
};

export default MyTeamTimeEntriesContent;
