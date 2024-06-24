import React, { useContext, useMemo, useState, useEffect } from "react";
import axios from "axios";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import {
  handleAPIError,
  headerOptions,
} from "../../../../utils/utilities/utilityFunctions";
import { Tooltip } from "react-tooltip";
import { json, useNavigate } from "react-router-dom";
import { SendInvoiceModal } from "../../../Invoices/Components/SendInvoiceModal";
import DashboardBlock from "./DashboardBlock";

const ClientInvoicingBlock = () => {
  const navigate = useNavigate();
  const { mainURL } = useContext(ContextAPI);
  const [clientInvoiceList, setClientInvoiceList] = useState([]);

  const userId = localStorage.getItem("userId") ?? null;

  const clientInvoicingTableColumns = [
    {
      Header: "Invoice No.",
      accessor: "invoice_code",
    },
    {
      Header: "Client Name",
      accessor: "name",
    },

    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className="table-actions-wrapper d-flex justify-content-center align-items-center">
          <>
            <Tooltip
              id="mail-invoice-tooltip"
              style={{
                background: "#000",
                color: "#fff",
              }}
              opacity={0.9}
            />
            <div
              style={{ cursor: "pointer" }}
              data-tooltip-id="mail-invoice-tooltip"
              data-tooltip-content="Mail Invoice"
              data-tooltip-place="top"
            >
              <SendInvoiceModal
                setIsUpdated={true}
                clientInvoiceList={clientInvoiceList}
                mailIcon={true}
                data={row.original}
                invoiceId={row.original?.invoice_id}
                clientPrimaryEmail={row.original?.client_primary_email}
                listOfClientEmail={row.original?.client_email
                  .split(",")
                  .map((email) => ({
                    label: email.trim(),
                    value: email.trim(),
                  }))}
                assignId={row.original?.assign_job_id}
              />
            </div>
          </>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => clientInvoicingTableColumns, []);


  const data = useMemo(() => clientInvoiceList, [clientInvoiceList]);

  const clientInvoicingTableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const handleClientInvoiceList = async () => {
    const url = `${mainURL}dashboard/client-invoice/${userId}`;

    try {
      const result = await axios.get(url, { headers: headerOptions() });
      const clientInvoiceList = result?.data?.invoice_data ?? [];
      setClientInvoiceList(clientInvoiceList);
    } catch (error) {
      console.error("Error fetching client invoices:", error);
    }
  };

  useEffect(() => {
    handleClientInvoiceList();
  }, []);
  return (
    <>
      <DashboardBlock
        tableInstance={clientInvoicingTableInstance}
        title={"Client Invoicing"}
        showButton={false}
      />
    </>
  );
};

export default ClientInvoicingBlock;
