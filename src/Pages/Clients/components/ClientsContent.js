import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import PageHeader from "../../../templates/PageHeader";
import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import ClientsTable from "./ClientsTable";
import Breadcrumbs from "../../../templates/Breadcrumbs";
import { DeleteClientModal } from "./DeleteClientModal";
import ReactTableSkeleton from "../../../templates/ReactTableSkeleton";

import { EditSVG } from "../../../utils/ImportingImages/ImportingImages";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

import { clientsIcon1 } from "../../../utils/ImportingImages/ImportingImages";

import "../../../stylesheet/CommonCSS.css";
import { ClientAdditionalDataModel } from "./ClientAdditionalDataModal";

const breadCrumbs = [
  {
    pageName: "Home",
    pageURL: "/dashboard",
  },
  {
    pageName: "Clients",
    pageURL: "/clients",
  },
];
const columnHeaders = ["Sr no.", "Client Code", "Name", "Email ID", "Edit"];
// constructing headers for CSV Link
const headers = {
  headings: [
    { label: "Client Code", key: "client_code" },
    { label: "Email ID", key: "client_email" },
    { label: "Name", key: "client_name" },
  ],
  fileName: "Clients List",
};

const ClientsContent = ({ clientsData, setIsUpdated, isLoading }) => {
  const navigate = useNavigate();
  const { sidebarClose } = useContext(ContextSidebarToggler);

  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "sr no.",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Client BPO No",
      // accessor: "client_code",
      Cell: ({ row }) => row.original?.additional_data?.bpo_no,
    },
    {
      Header: "Name",
      accessor: "client_name",
    },
    {
      Header: "Company Name",
      accessor: "company_name",
      Cell: ({ row }) => row.original?.additional_data?.company_name,
    },
    {
      Header: "Email ID",
      accessor: "client_email",
      Cell: ({ row }) => row.original?.additional_data?.primary_email,
    },
    {
      Header: "Edit",
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
            data-tooltip-id="delete-client-tooltip"
            data-tooltip-content="Client Additional Data"
            data-tooltip-place="top"
            style={{ cursor: "pointer" }}
          >
            <ClientAdditionalDataModel
              clientData={row.original}
              setIsUpdated={setIsUpdated}
            />
          </div>

          <Tooltip
            id="edit-client-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="edit-client-tooltip"
            data-tooltip-content="Edit Client Details"
            data-tooltip-place="top"
            onClick={() => navigate(`/clients/${row.original.client_id}`)}
          >
            <EditSVG />
          </div>

          <Tooltip
            id="delete-client-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="delete-client-tooltip"
            data-tooltip-content="Delete Client"
            data-tooltip-place="top"
          >
            <DeleteClientModal
              clientData={row.original}
              setIsUpdated={setIsUpdated}
            />
          </div>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => clientsData, [clientsData]);

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
          icon={clientsIcon1}
          headerTitle={"Clients"}
        >
          <button
            onClick={() => navigate("/clients/add-client")}
            className="custom-btn d-flex justify-content-center align-items-center gap-2"
          >
            Add Client <span className="fw-light fs-4">+</span>
          </button>
        </PageHeader>
      </div>

      {/* Clients Table */}
      {isLoading ? (
        <ReactTableSkeleton columnHeaders={columnHeaders} />
      ) : clientsData.length > 0 ? (
        <ClientsTable
          tableInstance={tableInstance}
          headers={headers}
          clientsData={clientsData}
        />
      ) : (
        <div className="mr-40 ml-30 mb-15">
          <h5>No Clients Found, Please add new Client!</h5>
        </div>
      )}
    </div>
  );
};

export default ClientsContent;
