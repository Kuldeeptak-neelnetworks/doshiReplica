import React, { useContext, useEffect, useState, useMemo } from "react";
import { DatePicker } from "antd";
import { Tooltip } from "react-tooltip";
import axios from "axios";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

import {
  EditSVG,
  holidayIcon,
  searchIcon,
} from "../../../utils/ImportingImages/ImportingImages";
import Breadcrumbs from "../../../templates/Breadcrumbs";
import ReactTableSkeleton from "../../../templates/ReactTableSkeleton";
import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import {
  handleAPIError,
  headerOptions,
} from "../../../utils/utilities/utilityFunctions";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import HolidayTable from "./HolidayTable";
import { EditHolidayModal } from "./EditHolidayModal";

const HolidayContent = () => {
  const { mainURL, logout, getAllHolidays, initialState } =
    useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);

  const [holiday, setHoliday] = useState({
    holidayName: "",
    holidayDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Holiday",
      pageURL: "/holidays",
    },
  ];

  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "id",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Holiday Name",
      accessor: "holiday_name",
    },
    {
      Header: "Holiday Date",
      accessor: "holiday_date",
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <div className="table-actions-wrapper d-flex justify-content-center align-items-center">
          <Tooltip
            id="edit-holiday-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            data-tooltip-id="edit-holiday-tooltip"
            data-tooltip-content="Edit Holiday"
            data-tooltip-place="top"
          >
            <EditHolidayModal
              holidayDetails={row.original}
              setIsUpdated={setIsUpdated}
            />
          </div>
        </div>
      ),
    },
  ];

  const columnHeaders = ["Sr no.", "Holiday Name", "Holiday Date", "Edit"];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(
    () => initialState.holidayList,
    [initialState.holidayList]
  );

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
  const headers = [
    { label: "Holiday Name", key: "name" },
    { label: "Holiday Date", key: "date" },
  ];

  useEffect(() => {
    getAllHolidays();
  }, [isUpdated]);

  const onDateChange = (date, dateString) =>
    setHoliday((prev) => ({
      ...prev,
      holidayDate: { date, dateString },
    }));

  const handleClear = () =>
    setHoliday(() => ({
      holidayName: "",
      holidayDate: "",
    }));

  const addNewHoliday = async () => {
    setIsLoading(() => true);
    try {
      const body = {
        current_user: localStorage.getItem("userId") ?? null,
        holiday_name: holiday?.holidayName,
        holiday_date: holiday?.holidayDate?.dateString,
      };

      const url = `${mainURL}add/holiday`;
      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 201) {
        ReactHotToast(result.data.message, "success");
        setIsUpdated((prev) => !prev);
        handleClear();
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
    }
  };

  const handleAddHoliday = (e) => {
    e.preventDefault();
    const bool = holiday.holidayDate && holiday.holidayName;

    if (bool) {
      addNewHoliday();
    } else {
      ReactHotToast("Please input Holiday Name & Date!", "error");
    }
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      <section className="main-content_header add-border-bottom custom-border-bottom">
        <div className="d-flex justify-content-center align-items-center page-heading">
          <img src={holidayIcon} alt="members" />
          <p className="m-0 fs-4">Holiday</p>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <div className="relative-wrapper">
            <img className="search-icon" src={searchIcon} alt="search-icon" />
            <input
              className="input-field"
              type="text"
              placeholder="Search Holiday"
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
          onSubmit={handleAddHoliday}
          className="w-100 mt-5 d-flex justify-content-between align-items-end gap-3"
        >
          <div className="flex-1 form-group">
            <label htmlFor="name">Holiday Name:</label>
            <input
              id="name"
              name="name"
              placeholder="Eg: Diwali"
              type="text"
              required
              value={holiday?.holidayName}
              onChange={(e) =>
                setHoliday((prev) => ({ ...prev, holidayName: e.target.value }))
              }
            />
          </div>
          <div className="flex-1 form-group holiday-date-wrapper">
            <label htmlFor="holidayDate">Holiday Date:</label>
            <DatePicker
              className="form-control datepicker"
              onChange={onDateChange}
              value={holiday?.holidayDate?.date}
              name="holidayDate"
            />
          </div>
          <button type="submit" className="custom-btn">
            {isLoading ? <SpinningLoader /> : "Add Holiday"}
          </button>
        </form>

        <div className="d-flex flex-column gap-3 w-100">
          {/* Job Category Table */}
          {initialState.isLoading ? (
            <ReactTableSkeleton columnHeaders={columnHeaders} />
          ) : (
            <HolidayTable
              tableInstance={tableInstance}
              headers={headers}
              holidayList={initialState.holidayList}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default HolidayContent;
