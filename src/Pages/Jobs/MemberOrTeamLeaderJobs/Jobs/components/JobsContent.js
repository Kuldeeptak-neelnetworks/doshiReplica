import React, { useContext, useMemo } from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import { fileIcon } from "../../../../../utils/ImportingImages/ImportingImages";
import { ContextSidebarToggler } from "../../../../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../../../../templates/Breadcrumbs";
import ReactTableSkeleton from "../../../../../templates/ReactTableSkeleton";
import JobsTable from "./JobsTable";
import PageHeader from "../../../../../templates/PageHeader";
import { formatDate } from "../../../../../utils/utilities/utilityFunctions";


const JobsContent = ({ jobsData, setIsUpdated, isLoading }) => {
  const { sidebarClose } = useContext(ContextSidebarToggler);

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Jobs",
      pageURL: "/jobs",
    },
  ];

  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "sr no.",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Job Name",
      accessor: "job_name",
    },
    {
      Header: "Assigned on",
      accessor: "assigned_on",
      Cell: ({ row }) => formatDate(row.original.assigned_on),
    },
    {
      Header: "Due Date",
      accessor: "due_on",
      Cell: ({ row }) => formatDate(row.original.due_on),
    },
    // {
    //   Header: "Status",
    //   accessor: "job_status",
    // },
    {
      Header: "Status",
      accessor: "job_status",
      Cell: ({ row }) => (
        <div className="d-flex justify-content-center align-items-center">
        <Stack direction="horizontal">
          {row.original.job_status === "Completed" ? (
            <Badge bg="success">Completed</Badge>
          ) : row.original.job_status === "On Hold" ? (
            <Badge bg="danger">On Hold</Badge>
          ) : (
            <Badge bg="warning" text="dark">
              In Progress
            </Badge>
          )}
        </Stack>
      </div>
      ),
    },
    {
      Header: "Description",
      accessor: "job_description",
    },
  ];

  const columnHeaders = [
    "Sr no",
    "Job Name",
    "Assigned on",
    "Due Date",
    "Status",
    "Description",
  ];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => jobsData, [jobsData]);

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
      { label: "Job Name", key: "job_name" },
      { label: "Assigned on", key: "assigned_on" },
      { label: "Due Date", key: "due_on" },
      { label: "Status", key: "job_status" },
      { label: "Description", key: "job_description" },
    ],
    fileName: "Jobs",
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      {/* Top header section */}
      <div className="mb-5 relative-wrapper zIndex-2">
        <PageHeader
          tableInstance={tableInstance}
          icon={fileIcon}
          headerTitle={"Jobs"}
        />
      </div>

      {/* My Jobs Table */}
      {isLoading ? (
        <ReactTableSkeleton columnHeaders={columnHeaders} />
      ) : jobsData?.length > 0 ? (
        <div className="jobs-table">
          <JobsTable
            tableInstance={tableInstance}
            headers={headers}
            jobsData={jobsData}
          />
        </div>
      ) : (
        <div className="mr-40 ml-30 mt-4 mb-15">
          <h5>No Data found!</h5>
        </div>
      )}
    </div>
  );
};

export default JobsContent;
