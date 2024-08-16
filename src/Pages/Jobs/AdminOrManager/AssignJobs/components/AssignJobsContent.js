import React, { useContext, useMemo, useState, useEffect } from "react";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

import { ContextSidebarToggler } from "../../../../../Context/SidebarToggler/SidebarToggler";
import {
  InvoiceIcon,
  fileIcon,
  reportsIcon,
  searchIcon,
} from "../../../../../utils/ImportingImages/ImportingImages";
import PageHeader from "../../../../../templates/PageHeader";
import AssignJobListTable from "./AssignJobListTable";
import Breadcrumbs from "../../../../../templates/Breadcrumbs";
import ReactTableSkeleton from "../../../../../templates/ReactTableSkeleton";
import { AssignJobModal } from "./AssignJobModal";
import { GenerateInvoiceModal } from "../GenerateInvoice/GenerateInvoiceModal";
import { EditAssignJobModal } from "./EditAssignJobModal";
import { formatDate } from "../../../../../utils/utilities/utilityFunctions";
import { ContextAPI } from "../../../../../Context/ApiContext/ApiContext";
import { DeleteAssignJobModal } from "./DeleteAssignJobModal";
import { format, parse,parseISO, isValid } from 'date-fns';

const AssignJobsContent = ({ setIsUpdated, isLoading }) => {
  const navigate = useNavigate();
  const { initialState } = useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [filters, setFilters] = useState({
    status: null,
    assignedTo: null,
  });

  const statusOptions = [
    { label: "In Progress", value: "In Progress" },
    { label: "On Hold", value: "On Hold" },
    { label: "Completed", value: "Completed" },
  ];
  const assignedToOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Team", value: "Team" },
  ];

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
      pageName: "Assign Job",
      pageURL: "/assign-job",
    },
  ];



  // const formattedDate = (dateString) => {
  //   const options = { day: '2-digit', month: 'long', year: 'numeric' };
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-GB', options); // 'en-GB' ensures "day month year" format
  // };
  // const formattedDate = (dateString) => {
  //   const date = new Date(dateString);
    
  //   // Extract day, month (as number), and year
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based in JavaScript
  //   const year = date.getFullYear();
    
  //   return `${day}/${month}/${year}`;
  // };
  // const formatDate = (date) => {
  //   if (!date) return "N.A";
    
  //   const dateObj = new Date(date);
  //   const day = dateObj.getDate();
  //   const month = dateObj.toLocaleString('default', { month: 'short' });
  //   const year = dateObj.getFullYear();
    
  //   const suffix = (day) => {
  //     if (day >= 11 && day <= 13) return 'th';
  //     switch (day % 10) {
  //       case 1: return 'st';
  //       case 2: return 'nd';
  //       case 3: return 'rd';
  //       default: return 'th';
  //     }
  //   };
  
  //   return `${day}${suffix(day)} ${month} ${year}`;
  // };


  const detectAndParseDate = (dateStr) => {
    // Check if the date string is in 'yyyy-MM-dd' format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return parseISO(dateStr);
    }
    // Check if the date string is in 'dd-MM-yyyy' format
    else if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      return parse(dateStr, 'dd-MM-yyyy', new Date());
    }
    // Invalid date format
    return null;
  };
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "N.A";
  
    const dateObj = detectAndParseDate(dateStr);
  
    if (!dateObj || !isValid(dateObj)) return "N.A";
  
    const day = format(dateObj, 'd'); // Day without leading zero
    const month = format(dateObj, 'MMM'); // Month abbreviation
    const year = format(dateObj, 'yyyy'); // Year
  
    const suffix = (day) => {
      if (day >= 11 && day <= 13) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    return `${day}${suffix(day)} ${month} ${year}`;
  };
  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "sr no.",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Job Name",
      accessor: (row) => {
        const { job_name } = row;
        const [jobName, date] = job_name.split(" - ");
        return (
          <div>
            <p className="m-0">{jobName}</p>
            <p className="m-0">{date}</p>
          </div>
        );
      },
    },
    {
      Header: "Client Name",
      accessor: "client_name",
    },
    {
      Header: "Assigned to",
      accessor: "assign_to",
      Cell: ({ row }) => {
        return row.original?.assign_to === "Team"
          ? row.original?.team_details[0]?.team_name
            ? `Team - ${row.original?.team_details[0]?.team_name}`
            : "---"
          : row.original?.member_name[0] ?? "---";
      },
    },
    {
      Header: "Duration",
      accessor: "due_on",
      Cell: ({ row }) => {
        const startDate = formatDate(row.original.assigned_on);
        const endDate = formatDate(row.original.due_on);
        return (
          <div className="gap-1">
            <p className="m-0">From: {startDate}</p>
            <p className="m-0">To: {endDate}</p>
          </div>
        );
      },
    },
    // {
    //   Header: "Status",
    //   accessor: "job_status",
    //   Cell: ({ row }) => {
    //     return (
    //       <div className="d-flex justify-content-center align-items-center">
    //         <Stack direction="horizontal">
    //           {row.original.job_status === "Completed" ? (
    //             <Badge bg="success">Completed</Badge>
    //           ) : row.original.job_status === "On Hold" ? (
    //             <Badge bg="danger">On Hold</Badge>
    //           ) : row.original.job_status === "Pending" ? (
    //             <Badge bg="danger">Pending</Badge>
    //           ) : row.original.job_status === "In Progress" (
    //             <Badge bg="warning"> In Progress</Badge>
              
    //           )}
    //         </Stack>
    //       </div>
    //     );
    //   },
    // },
    {
      Header: "Status",
      accessor: "job_status",
      Cell: ({ row }) => {
        return (
          <div className="d-flex justify-content-center align-items-center">
            <Stack direction="horizontal">
              {row.original.job_status === "Completed" ? (
                <Badge bg="success">Completed</Badge>
              ) : row.original.job_status === "On Hold" ? (
                <Badge bg="danger">On Hold</Badge>
              ) : row.original.job_status === "Pending" ? (
                <Badge bg="danger">Pending</Badge>
              ) : row.original.job_status === "In Progress" ? (
                <Badge bg="warning"  text="dark">In Progress</Badge>
              ) : null 
              }
            </Stack>
          </div>
        );
      },
    },
    
    {
      Header: "Approved Time",
      accessor: "approved_time",
      Cell: ({ row }) => {
        return (
          <div className="d-flex justify-content-center align-items-center">
            <Stack direction="horizontal">
              {row.original.approved_time === "yes" ? (
                <Badge bg="success">Yes</Badge>
              ) : (
                <Badge bg="danger">No</Badge>
              )}
            </Stack>
          </div>
        );
      },
    },
    

    {
      Header: "Description",
      accessor: "job_description",
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <div className="table-actions-wrapper d-flex justify-content-center align-items-center">
          {row.original.is_post_draft === "yes" &&
          row.original.is_post_draft_invoice_generated === "1" ? (
            <>
              <Tooltip
                id="preview-post-draft-changes-invoice-tooltip"
                style={{
                  background: "#000",
                  color: "#fff",
                }}
                opacity={0.9}
              />
              <div
                data-tooltip-id="preview-post-draft-changes-invoice-tooltip"
                data-tooltip-content="Preview Post Draft Changes Invoice"
                data-tooltip-place="top"
              >
                <div
                  onClick={() => {
                    navigate("/invoice", {
                      state: {
                        invoiceMeta: {
                          post_draft_invoice_id:
                            row.original?.post_draft_invoice_id,
                        },
                        assignId: row.original?.assign_id,
                        isInvoicePreview: true,
                      },
                    });
                  }}
                >
                  <InvoiceIcon />
                </div>
              </div>
            </>
          ) : row.original.is_post_draft === "yes" ? (
            <>
              <Tooltip
                id="generate-post-draft-changes-invoice-tooltip"
                style={{
                  background: "#000",
                  color: "#fff==",
                }}
                opacity={0.9}
              />
              <div
                data-tooltip-id="generate-post-draft-changes-invoice-tooltip"
                data-tooltip-content="Generate Post Draft Changes Invoice"
                data-tooltip-place="top"
              >
                <GenerateInvoiceModal
                  jobData={row.original}
                  setIsUpdated={setIsUpdated}
                />
              </div>
            </>
          ) : null}

          {row.original.invoice_genrated === "Yes" &&
          row.original.job_status === "Completed" ? (
            <>
              <Tooltip
                id="preview-invoice-tooltip"
                style={{
                  background: "#000",
                  color: "#fff",
                }}
                opacity={0.9}
              />
              <div
                data-tooltip-id="preview-invoice-tooltip"
                data-tooltip-content="Preview Invoice"
                data-tooltip-place="top"
              >
                <div
                  onClick={() => {
                    navigate("/invoice", {
                      state: {
                        invoiceMeta: {
                          invoice_id: row.original?.invoice_id,
                        },
                        assignId: row.original?.assign_id,
                        isInvoicePreview: true,
                      },
                    });
                  }}
                >
                  <InvoiceIcon />
                </div>
              </div>
            </>
          ) : row.original.job_status === "Completed" ? (
            <>
              <Tooltip
                id="generate-invoice-tooltip"
                style={{
                  background: "#000",
                  color: "#fff==",
                }}
                opacity={0.9}
              />
              <div
                data-tooltip-id="generate-invoice-tooltip"
                data-tooltip-content="Generate Invoice"
                data-tooltip-place="top"
              >
                <GenerateInvoiceModal
                  type="invoice"
                  jobData={row.original}
                  setIsUpdated={setIsUpdated}
                />
              </div>
            </>
          ) : (
            ""
          )}

          <Tooltip
            id="edit-assign-job-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="edit-assign-job-tooltip"
            data-tooltip-content="Edit Assigned Job"
            data-tooltip-place="top"
          >
            <EditAssignJobModal
              assignJobData={row.original}
              setIsUpdated={setIsUpdated}
            />
          </div>

          <Tooltip
            id="delete-assign-job-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="delete-assign-job-tooltip"
            data-tooltip-content="Delete Assigned Job"
            data-tooltip-place="top"
          >
            <DeleteAssignJobModal
              assignJobData={row.original}
              setIsUpdated={setIsUpdated}
            />
          </div>
        </div>
      ),
    },
  ];

  const columnHeaders = [
    "Sr no",
    "Job Name",
    "Assigned to",
    "Client Name",
    "Assigned on",
    "Due date",
    "Status",
    "Description",
    "Edit",
  ];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => assignedJobs, [assignedJobs]);

  useEffect(() => {
    const filterByStatus = initialState?.assignJobsList?.filter((job) => {
      return filters.status ? job.job_status === filters.status.value : job;
    });

    const filterByAssignTo = filterByStatus?.filter((job) => {
      return filters.assignedTo
        ? job.assign_to === filters.assignedTo.value
        : job;
    });

    setAssignedJobs(() => filterByAssignTo);
  }, [filters, initialState?.assignJobsList]);

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
      { label: "Job Status", key: "job_status" },
      { label: "Client Name", key: "client_name" },
      { label: "Job assigned to", key: "assign_to" },
      { label: "Job assigned on", key: "assigned_on" },
      { label: "Job due date", key: "due_on" },
      { label: "Job Description", key: "job_description" },
    ],
    fileName: "Assigned Jobs",
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      {/* Top header section */}
      <PageHeader
        tableInstance={tableInstance}
        icon={fileIcon}
        headerTitle={"Assign Job"}
      >
        <AssignJobModal setIsUpdated={setIsUpdated} />
      </PageHeader>

      {/* filters */}
      <div className="mr-40 ml-30 mt-5 mb-15 w-75 d-flex justify-content-start align-items-center gap-4">
        <div className="relative-wrapper w-25">
          <img className="search-icon" src={searchIcon} alt="search-icon" />
          <Select
            closeMenuOnSelect={true}
            isClearable={true}
            options={assignedToOptions}
            onChange={(option) => {
              setFilters((prev) => ({
                ...prev,
                assignedTo: option,
              }));
            }}
            value={filters.assignedTo}
            placeholder="Select assigned to"
            className="react-select-custom-styling__container"
            classNamePrefix="react-select-custom-styling"
          />
        </div>

        <div className="relative-wrapper w-25">
          <img className="search-icon" src={reportsIcon} alt="search-icon" />
          <Select
            closeMenuOnSelect={true}
            isClearable={true}
            options={statusOptions}
            onChange={(option) => {
              setFilters((prev) => ({
                ...prev,
                status: option,
              }));
            }}
            value={filters.status}
            placeholder="Select status"
            className="react-select-custom-styling__container"
            classNamePrefix="react-select-custom-styling"
          />
        </div>
      </div>

      {/* Assign Jobs list Table */}
      {isLoading ? (
        <ReactTableSkeleton columnHeaders={columnHeaders} />
      ) : assignedJobs?.length > 0 ? (
        <AssignJobListTable
          tableInstance={tableInstance}
          headers={headers}
          assignedJobs={assignedJobs}

          // setIsUpdated={setIsUpdated}
        />
      ) : (
        <div className="mt-4 mr-40 ml-30 mb-15">
          <h5>No data found!</h5>
        </div>
      )}
    </div>
  );
};

export default AssignJobsContent;
