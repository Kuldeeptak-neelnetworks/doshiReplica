import React, { useContext, useMemo, useEffect } from "react";
import { Tooltip } from "react-tooltip";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

import { fileIcon } from "../../../../../utils/ImportingImages/ImportingImages";
import PageHeader from "../../../../../templates/PageHeader";
import { ContextSidebarToggler } from "../../../../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../../../../templates/Breadcrumbs";
import JobsTable from "../../../Components/JobsTable";
import { ContextAPI } from "../../../../../Context/ApiContext/ApiContext";
import ReactTableSkeleton from "../../../../../templates/ReactTableSkeleton";
import { DeleteJobModal } from "./DeleteJobModal";
import { EditJobModal } from "./EditJobModal";
import { AddJobsModal } from "./AddJobsModal";

const JobsContent = ({ jobsData, setIsUpdated, isLoading }) => {
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const { getAllJobCategories } = useContext(ContextAPI);

  useEffect(() => {
    getAllJobCategories();
  }, []);

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
      Header: "BPO No",
      accessor: "bpo_no",
    },
    {
      Header: "Job Name",
      accessor: "job_name",
    },
    {
      Header: "Client Name",
      accessor: "client_name",
    },
    {
      Header: "Created By",
      accessor: "job_added_by",
    },
    {
      Header: "Category",
      accessor: "job_category",
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <div className="table-actions-wrapper d-flex justify-content-end align-items-center">
          <Tooltip
            id="edit-job-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="edit-job-tooltip"
            data-tooltip-content="Edit Job Details"
            data-tooltip-place="top"
          >
            <EditJobModal jobData={row.original} setIsUpdated={setIsUpdated} />
          </div>

          <Tooltip
            id="delete-job-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="delete-job-tooltip"
            data-tooltip-content="Delete Job"
            data-tooltip-place="top"
          >
            <DeleteJobModal
              jobData={row.original}
              setIsUpdated={setIsUpdated}
            />
          </div>
        </div>
      ),
    },
  ];

  const columnHeaders = [
    "Sr no.",
    "Job Code",
    "Job Name",
    "Client Name",
    "Created By",
    "Category",
    "Edit",
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
      { label: "Job Code", key: "job_code" },
      { label: "Job Name", key: "job_name" },
      { label: "Client Name", key: "client_name" },
      { label: "Job Category", key: "job_category" },
      { label: "Job added on", key: "job_add_on" },
      { label: "Job added by", key: "job_added_by" },
    ],
    fileName: "Jobs",
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      {/* Top header section */}
      <div className="relative-wrapper zIndex-2">
        <PageHeader
          tableInstance={tableInstance}
          icon={fileIcon}
          headerTitle={"All Jobs"}
        >
          <AddJobsModal setIsUpdated={setIsUpdated} />
        </PageHeader>
      </div>

      {/* Jobs Table */}
      <div className="mt-5">
        {isLoading ? (
          <ReactTableSkeleton columnHeaders={columnHeaders} />
        ) : jobsData?.length > 0 ? (
          <JobsTable
            tableInstance={tableInstance}
            headers={headers}
            projectsData={jobsData}
          />
        ) : (
          <div className="mr-40 ml-30 mb-15">
            <h5>No Projects Found, Please create new Project!</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsContent;
