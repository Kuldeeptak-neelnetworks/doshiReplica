import React, { useContext, useMemo, useState, useEffect } from "react";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import { json, useNavigate } from "react-router-dom";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import { ContextSidebarToggler } from "../../../../Context/SidebarToggler/SidebarToggler";
import { ReactHotToast } from "../../../../Components/ReactHotToast/ReactHotToast";
import {
  InvoiceIcon,
  MailIconSVG,
  fileIcon,
  reportsIcon,
  searchIcon,
} from "../../../../utils/ImportingImages/ImportingImages";
import PageHeader from "../../../../templates/PageHeader";
import { SendInvoiceModal } from "../../../Invoices/Components/SendInvoiceModal";

import Breadcrumbs from "../../../../templates/Breadcrumbs";

import ReactTableSkeleton from "../../../../templates/ReactTableSkeleton";

import { formatDate } from "../../../../utils/utilities/utilityFunctions";

import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import InvoiceListTable from "./InvoiceListTable";
import axios from "axios";
// import styles from "./Invoices.module.css";
import styles from "../../../../Pages/Invoices/Invoices.module.css";
import {
  handleAPIError,
  headerOptions,
} from "../../../../utils/utilities/utilityFunctions";
import { MarkInvoiceModel } from "./MarkInvoiceModel";

const InvoiceList = ({ setIsUpdated, isLoading }) => {
  const navigate = useNavigate();

  const { initialState, getAllInvoice, emailOptions, invoiceMeta } =
    useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const [invoice, setInvoice] = useState([]);
  const [filters, setFilters] = useState({
    status: null,
    assignedTo: null,
  });

  const statusOptions = [
    { label: "Unpaid", value: "1" },
    { label: "Partially Paid", value: "2" },
    { label: "Paid", value: "3" },
  ];
  const assignedToOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Team", value: "Team" },
  ];

  useEffect(() => {
    setInvoice(initialState.getAllInvoice || []);
  }, [initialState.getAllInvoice]);

  useEffect(() => {
    const filterByStatus = initialState?.getAllInvoice?.filter((invoice) => {
      return filters.status
        ? JSON.parse(invoice.invoice_containt).payment_status ===
            filters.status.value
        : true;
    });
    setInvoice(filterByStatus || []);
  }, [filters, initialState?.getAllInvoice]);
  const { mainURL } = useContext(ContextAPI);

  // const [showUpdateButton, setShowUpdateButton] = useState(false);

  // const handleUpdateStatus = async (id) => {
  //   try {
  //     const userId = localStorage.getItem("userId");

  //     const url = `${mainURL}update/invoice/${userId}/${id}/3`;
  //     const result = await axios.put(url, {}, { headers: headerOptions() });

  //     if (result.status === 200) {
  //       ReactHotToast(result.data.message, "success");
  //       setIsUpdated((prev) => !prev);
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 401) {
  //       // navigate("/unauthorized");
  //       ReactHotToast("Unauthorized access.");
  //     }
  //   }
  // };

  // const handleUpdateStatus = (e) => {

  //   updatePaymentStatus();
  // };
  // const toggleIndividualCheckbox = (index) => {
  //   const updatedInvoices = [...invoice];
  //   updatedInvoices[index].isChecked = !updatedInvoices[index].isChecked;
  //   setInvoice(updatedInvoices);
  // };

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Client",
      pageURL: "/clients",
    },
    {
      pageName: "Invoice",
      //   pageURL: "/assign-job",
    },
  ];

  const tableColumns = [
    // {
    //   Header: "Mark",
    //   accessor: "invoice_containt",
    //   Cell: ({ row }) => {
    //     const paymentStatus = JSON.parse(row.original.invoice_containt).payment_status;
    //     const isChecked = row.original.isChecked ?? false;

    //     if (paymentStatus === "1") {
    //       return (
    //         <div>
    //           <input
    //             id={`checkbox-${row.id}`}
    //             type="checkbox"
    //             onChange={() => toggleIndividualCheckbox(row.index)}
    //             checked={isChecked}
    //           />
    //         </div>
    //       );
    //     } else {
    //       return null;
    //     }
    //   },
    // },
    {
      Header: "Sr no.",
      accessor: "sr no.",
      enableHiding: false,
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Invoice code",
      accessor: "invoice_code",
    },
    {
      Header: "Status",
      accessor: "payment_status",
      Cell: ({ row }) => {
        const paymentStatus = JSON.parse(
          row.original.invoice_containt
        ).payment_status;

        return (
          <div className="d-flex justify-content-center">
            <Stack direction="horizontal" style={{ alignItems: "center" }}>
              {paymentStatus === "1" ? (
                <Badge bg="danger">Unpaid</Badge>
              ) : paymentStatus === "2" ? (
                <Badge bg="warning">Partially Paid</Badge>
              ) : paymentStatus === "3" ? (
                <Badge bg="success">Paid</Badge>
              ) : null}
            </Stack>
          </div>
        );
      },
    },

    {
      Header: "Generated by",
      accessor: "generated_by",
    },
    {
      Header: "Issued on",
      accessor: "issued_on",
      Cell: ({ row }) => {
        const startDate = formatDate(row.original.issued_on);

        return (
          <div className="">
            <p className="m-0">{startDate}</p>
          </div>
        );
      },
    },
    {
      Header: "Invoice sendcount",
      accessor: "invoice_send_count",
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <div className="table-actions-wrapper d-flex justify-content-center align-items-center">
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
                        invoice_id: row.original?.id,
                      },

                      assignId:
                        (row.original?.invoice_containt &&
                          JSON.parse(row.original.invoice_containt)
                            ?.assign_id) ??
                        null,

                      isInvoicePreview: true,
                    },
                  });
                }}
              >
                <InvoiceIcon />
              </div>
            </div>

            <Tooltip
              id="send-invoice-tooltip"
              style={{
                background: "#000",
                color: "#fff",
              }}
              opacity={0.9}
            />
            <div
              style={{ cursor: "pointer" }}
              data-tooltip-id="send-invoice-tooltip"
              data-tooltip-content="Mail Invoice"
              data-tooltip-place="top"
            >
              <SendInvoiceModal
                setIsUpdated={setIsUpdated}
                invoice={invoice}
                mailIcon={true}
                invoiceId={row.original?.id}
                listOfEmails={row.original?.email
                  ?.split(",")
                  ?.map((email) => ({ label: email, value: email }))}
                assignId={JSON.parse(row.original.invoice_containt)?.assign_id}
                data={row.original}
              />
            </div>
          </>
        </div>
      ),
    },

    {
      Header: "Action",
      accessor: "invoice_containt",
      Cell: ({ row }) => {
        const paymentStatus = JSON.parse(
          row.original.invoice_containt
        ).payment_status;

        if (paymentStatus === "1") {
          return (
            <div className="d-flex justify-content-center cursor-pointer">
              {/* <button
                className="custom-btn"
                onClick={() => handleUpdateStatus(row.original.id)}
              >
              Mark
              </button> */}
              <MarkInvoiceModel
                invoiceData={row.original}
                setIsUpdated={setIsUpdated}
              />
            </div>
          );
        } else {
          return null;
        }
      },
    },
  ];

  const columnHeaders = [
    "Sr no",
    "Invoice Code",
    "Status",
    "Generated by",
    "Issued on",
    "Edit",
    "Action",
  ];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => invoice, [invoice]);

  const tableInstance = useTable(
    {
      initialState: {
        hiddenColumns: ["Action"],
      },
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
      { label: "Invoice Code", key: "invoice_code" },
      { label: "Generated by", key: "generated_by" },
      { label: "Status", key: "payment_status" },
      { label: "Issued on", key: "issued_on" },
    ],
    fileName: "Invoices",
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      {/* Top header section */}
      <PageHeader
        invoice={invoice}
        tableInstance={tableInstance}
        icon={fileIcon}
        headerTitle={"Invoice"}
      ></PageHeader>

      {/* filters */}
      <div className="mr-40 ml-30 mt-5 mb-15 w-75 d-flex justify-content-start align-items-center gap-4">
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
      {/* <div className="d-flex justify-content-start align-items-center">
        {showUpdateButton && (
        <button onClick={handleUpdateStatus} className="custom-btn">
          Update
        </button>
    )} 
      </div> */}

      {/* Assign Jobs list Table */}
      {isLoading ? (
        <ReactTableSkeleton columnHeaders={columnHeaders} />
      ) : invoice?.length > 0 ? (
        <InvoiceListTable
          tableInstance={tableInstance}
          headers={headers}
          invoice={invoice}
        />
      ) : (
        <div className="mt-4 mr-40 ml-30 mb-15">
          <h5>No data found!</h5>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
