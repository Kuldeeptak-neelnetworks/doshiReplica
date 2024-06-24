import React, { useContext, useState, useMemo } from "react";
import { Tooltip } from "react-tooltip";
import axios from "axios";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

import { ContextSidebarToggler } from "../../../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../../../templates/Breadcrumbs";
import {
  clientsIcon1,
  searchIcon,
  TrashSVG,
  EditSVG,
} from "../../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../../Components/SpinningLoader/SpinningLoader";
import BillingServicesTable from "./BillingServicesTable";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../../Components/ReactHotToast/ReactHotToast";
import {
  handleAPIError,
  headerOptions,
} from "../../../../utils/utilities/utilityFunctions";
import ReactTableSkeleton from "../../../../templates/ReactTableSkeleton";
import { EditBillingServicesModal } from "./EditBillingServicesModal";

const BillingServicesContent = ({
  billingServicesList,
  isLoading,
  setIsUpdated,
}) => {
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const { mainURL, logout } = useContext(ContextAPI);

  const [isUserValid, setIsUserValid] = useState(false);
  const [billingServiceName, setBillingServiceName] = useState("");

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Billing Services",
      pageURL: "/clients/billing-services",
    },
  ];

  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "services_id",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Service",
      accessor: "services_name",
    },
    {
      Header: "Status",
      accessor: "service_status",
      Cell: ({ row }) =>
        row.original.service_status === "active" ? "Active" : "Suspended",
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <div className="table-actions-wrapper d-flex justify-content-end align-items-center">
          <Tooltip
            id="edit-billing-service-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div style={{marginRight:"12%"}}
            data-tooltip-id="edit-billing-service-tooltip"
            data-tooltip-content="Edit Service"
            data-tooltip-place="top"
          >
            <EditBillingServicesModal
              setIsUpdated={setIsUpdated}
              billingServiceData={row.original}
            />
          </div>

          <Tooltip
            id="delete-billing-service-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          {/* <div
            data-tooltip-id="delete-billing-service-tooltip"
            data-tooltip-content="Delete Service"
            data-tooltip-place="top"
          >
            <TrashSVG />
          </div> */}
        </div>
      ),
    },
  ];

  const columnHeaders = ["Sr no.", "Service", "Status", "Edit"];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => billingServicesList, [billingServicesList]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { state, setGlobalFilter } = tableInstance;
  const { globalFilter } = state;

  // constructing headers for CSV Link
  const headers = {
    headings: [
      { label: "Service", key: "services_name" },
      { label: "Status", key: "service_status" },
    ],
    fileName: "Billing Services",
  };

  // Adding new billing service API
  const addNewBillingService = async () => {
    const body = {
      billing_services: billingServiceName,
      current_user: localStorage.getItem("userId") ?? null,
    };

    setIsUserValid(() => true);

    try {
      const url = `${mainURL}services/billing`;
      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 201) {
        ReactHotToast(result?.data?.message, "success");
        setBillingServiceName(() => "");
        setIsUpdated((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsUserValid(() => false);
    }
  };

  const handleAddBillingService = (e) => {
    e.preventDefault();
    if (billingServiceName) {
      addNewBillingService();
    } else {
      ReactHotToast("Please add billing service name!", "error");
    }
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      <section className="main-content_header add-border-bottom custom-border-bottom">
        <div className="d-flex justify-content-center align-items-center page-heading">
          <img src={clientsIcon1} alt="members" />
          <p className="m-0 fs-4">Billing Service</p>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <div className="relative-wrapper">
            <img className="search-icon" src={searchIcon} alt="search-icon" />
            <input
              className="input-field"
              type="text"
              placeholder="Search Billing Service"
              value={globalFilter || ""}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
              }}
            />
          </div>
        </div>
      </section>

      <section className="main-content_form-section gap-3 d-flex flex-column justify-content-start align-items-center width-65 m-auto">
        <form
          onSubmit={handleAddBillingService}
          className="w-100 mt-5 d-flex justify-content-between align-items-end gap-3"
        >
          <div className="flex-1 form-group">
            <label htmlFor="name">Service Name:</label>
            <input
              id="name"
              name="name"
              placeholder="Eg: ITR Filling"
              type="text"
              required
              value={billingServiceName}
              onChange={(e) => setBillingServiceName(() => e.target.value)}
            />
          </div>
          <button type="submit" className=" custom-btn">
            {isUserValid ? <SpinningLoader /> : "Add Service"}
          </button>
        </form>

        <div className="d-flex flex-column gap-3 w-100">
          {/* Job Category Table */}
          {isLoading ? (
            <ReactTableSkeleton columnHeaders={columnHeaders} />
          ) : billingServicesList.length > 0 ? (
            <BillingServicesTable
              tableInstance={tableInstance}
              headers={headers}
              billingServicesList={billingServicesList}
            />
          ) : (
            <div className="mr-40 mt-3 mb-15">
              <h5>No Data Found, Please add new Billing Service!</h5>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BillingServicesContent;
