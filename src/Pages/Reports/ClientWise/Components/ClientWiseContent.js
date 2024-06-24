import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import Breadcrumbs from "../../../../templates/Breadcrumbs";
import { ContextSidebarToggler } from "../../../../Context/SidebarToggler/SidebarToggler";
import PageHeader from "../../../../templates/PageHeader";
import ReportsTable from "../../components/ReportsTable";
import ClientWiseTable from "./ClientWiseTable";
import ReactTableSkeleton from "../../../../templates/ReactTableSkeleton";
import {
  reportsIcon,
  userIcon1,
} from "../../../../utils/ImportingImages/ImportingImages";
import { ClientWiseReportModal } from "./ClientWiseReportModel";

// Bread Crumbs
const breadCrumbs = [
  {
    pageName: "Home",
    pageURL: "/dashboard",
  },
  // {
  //   pageName: "Reports",
  //   pageURL: "/reports",
  // },
  {
    pageName: "Client Wise",
    pageURL: "/client-wise",
  },
];

// constructing Headers for React Skelton
const columnHeaders = ["Sr no.", "Client Code", "Name", "Email ID", "Edit"];

// constructing headers for CSV Link
const headers = {
  headings: [
    { label: "Client Code", key: "client_code" },
    { label: "Email ID", key: "email" },
    { label: "Name", key: "name" },
  ],
  fileName: "Clients List",
};

const ClientWiseContent = ({ clientsReportData, setIsUpdated, isLoading }) => {
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const [filters, setFilters] = useState({
    status: null,
    assignedTo: null,
  });

  const statusOptions = [
    { label: "In Progress", value: "In Progress" },
    { label: "On Hold", value: "On Hold" },
    { label: "Completed", value: "Completed" },
  ];

  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "sr no.",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Client Code",
      accessor: "client_code",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email ID",
      accessor: "email",
      Cell: ({ row }) =>
        JSON.parse(row.original?.additional_data)?.primary_email,
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className="table-actions-wrapper d-flex justify-content-end align-items-center">
          <Tooltip
            id="delete-client-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            style={{ marginRight: "19%", cursor: "pointer" }}
            data-tooltip-id="delete-client-tooltip"
            data-tooltip-content="Show more"
            data-tooltip-place="top"
          >
            <ClientWiseReportModal
              clientData={row.original}
              setIsUpdated={setIsUpdated}
            />
          </div>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => tableColumns, []);

  const data = useMemo(() => clientsReportData, [clientsReportData]);

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
      <div className="mb-5 relative-wrapper zIndex-2">
        <PageHeader
          tableInstance={tableInstance}
          icon={userIcon1}
          // icon={reportsIcon}
          headerTitle={"Client Wise"}
        ></PageHeader>
      </div>
      {/* <div className="ml-30 mr-40 relative-wrapper w-75">
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
          className="react-select-custom-styling__container w-25"
          classNamePrefix="react-select-custom-styling"
        />
      </div> */}

      {/* Clients Table  */}
      {isLoading ? (
        <ReactTableSkeleton columnHeaders={columnHeaders} />
      ) : clientsReportData.length > 0 ? (
        <ClientWiseTable
          tableInstance={tableInstance}
          headers={headers}
          clientWise={clientsReportData}
        />
      ) : (
        <div className="mr-40 ml-30 mb-15">
          <h5>No Clients Report Data Found !</h5>
        </div>
      )}
    </div>
  );
};

export default ClientWiseContent;
