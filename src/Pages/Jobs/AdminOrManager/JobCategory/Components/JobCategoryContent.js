import React, { useContext, useState, useMemo, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import axios from "axios";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

import { ContextSidebarToggler } from "../../../../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../../../../templates/Breadcrumbs";
import {
  fileIcon,
  searchIcon,
} from "../../../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../../../Components/SpinningLoader/SpinningLoader";
import JobCategoryTable from "./JobCategoryTable";
import { ContextAPI } from "../../../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../../../Components/ReactHotToast/ReactHotToast";
import { DeleteJobCategoryModal } from "./DeleteJobCategoryModal";
import { EditJobCategoryModal } from "./EditJobCategoryModal";
import {
  handleAPIError,
  headerOptions,
} from "../../../../../utils/utilities/utilityFunctions";
import ReactTableSkeleton from "../../../../../templates/ReactTableSkeleton";

const JobCategoryContent = ({
  jobCategories,
  getAllJobCategories,
  isLoading,
}) => {
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const { mainURL, logout } = useContext(ContextAPI);

  const [isUserValid, setIsUserValid] = useState(false);
  const [jobCategoryName, setJobCategoryName] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Job Category",
      pageURL: "/jobs/category",
    },
  ];

  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "job_category_id",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Category",
      accessor: "job_category_name",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) =>
        row.original.status === "active" ? "Active" : "Suspended",
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <div className="table-actions-wrapper d-flex justify-content-end align-items-center">
          <Tooltip
            id="edit-job-category-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="edit-job-category-tooltip"
            data-tooltip-content="Edit Job Category"
            data-tooltip-place="top"
          >
            <EditJobCategoryModal
              jobCategoryData={row.original}
              setIsUpdated={setIsUpdated}
            />
          </div>

          <Tooltip
            id="delete-job-category-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="delete-job-category-tooltip"
            data-tooltip-content="Delete Job Category"
            data-tooltip-place="top"
          >
            <DeleteJobCategoryModal
              jobCategoryData={row.original ?? null}
              setIsUpdated={setIsUpdated}
            />
          </div>
        </div>
      ),
    },
  ];

  const columnHeaders = ["Sr no.", "Category", "Status", "Edit"];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => jobCategories, [jobCategories]);

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
    headings: [{ label: "Category", key: "category" }],
    fileName: "Job Categories",
  };

  useEffect(() => {
    getAllJobCategories();
  }, [isUpdated]);

  // Adding new job category API
  const addNewJobCategory = async () => {
    const body = {
      job_type: jobCategoryName ?? "",
      current_user: localStorage.getItem("userId") ?? null,
    };

    setIsUserValid(() => true);

    try {
      const url = `${mainURL}add/job-type`;
      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 201) {
        ReactHotToast(result?.data?.message, "success");
        setJobCategoryName(() => "");
        setIsUpdated((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsUserValid(() => false);
    }
  };

  const handleAddJobCategory = (e) => {
    e.preventDefault();
    if (jobCategoryName) {
      addNewJobCategory();
    } else {
      ReactHotToast("Please add job category name!", "error");
    }
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      <section className="main-content_header add-border-bottom custom-border-bottom">
        <div className="d-flex justify-content-center align-items-center page-heading">
          <img src={fileIcon} alt="members" />
          <p className="m-0 fs-4">Job Category</p>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <div className="relative-wrapper">
            <img className="search-icon" src={searchIcon} alt="search-icon" />
            <input
              className="input-field"
              type="text"
              placeholder="Search Job Category"
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
          onSubmit={handleAddJobCategory}
          className="w-100 mt-5 d-flex justify-content-between align-items-end gap-3"
        >
          <div className="flex-1 form-group">
            <label htmlFor="name">Category Name:</label>
            <input
              id="name"
              name="name"
              placeholder="Eg: ITR Filling"
              type="text"
              required
              value={jobCategoryName}
              onChange={(e) => setJobCategoryName(() => e.target.value)}
            />
          </div>
          <button type="submit" className=" custom-btn">
            {isUserValid ? <SpinningLoader /> : "Add Category"}
          </button>
        </form>

        <div className="w-100">
          {/* Job Category Table */}
          {isLoading ? (
            <ReactTableSkeleton columnHeaders={columnHeaders} />
          ) : jobCategories?.length > 0 ? (
            <JobCategoryTable
              tableInstance={tableInstance}
              headers={headers}
              jobCategories={jobCategories}
            />
          ) : (
            <div className="mt-3">
              <h5>No Job Categories found, Please create one!</h5>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default JobCategoryContent;
