import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";

import {
  searchIcon,
  calendarIcon,
  projectsIcon,
  InvoiceIcon,
  employeeIcon,
  usersIcon,
} from "../../../../utils/ImportingImages/ImportingImages";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import Breadcrumbs from "../../../../templates/Breadcrumbs";
import { ContextSidebarToggler } from "../../../../Context/SidebarToggler/SidebarToggler";
import PageHeader from "../../../../templates/PageHeader";
import ReportsTable from "../../components/ReportsTable";
import ReactTableSkeleton from "../../../../templates/ReactTableSkeleton";
import { reportsIcon } from "../../../../utils/ImportingImages/ImportingImages";
import { TeamWiseReportModal } from "./TeamWiseReportModel";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import { SpinningLoader } from "../../../../Components/SpinningLoader/SpinningLoader";
import axios from "axios";
import {
  handleAPIError,
  headerOptions,
} from "../../../../utils/utilities/utilityFunctions";
import TeamWiseReport from "./TeamWiseReport";

// Bread Crumbs
const breadCrumbs = [
  {
    pageName: "Home",
    pageURL: "/dashboard",
  },
  {
    pageName: "Team Wise",
    pageURL: "/team-wise",
  },
];

// constructing Headers for React Skelton
const columnHeaders = [
  "Sr no.",
  "Team Code",
  "Team Leader",
  "Team Name",
  "Edit",
];

// constructing headers for CSV Link
const headers = {
  headings: [
    { label: "Team Code", key: "team_code" },
    { label: "Team Name", key: "team_name" },
    { label: "Team Leader", key: "leader_name" },
  ],
  fileName: "Team Wise List",
};

const TeamWiseContent = ({
  teamWiseReportData,
  setIsUpdated,
  isLoading,
  showMore = true,
}) => {
  const userRole = localStorage.getItem("userRole");
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
      Header: "Team Code",
      accessor: "team_code",
    },
    {
      Header: "Team Name",
      accessor: "team_name",
    },
    {
      Header: "Team Leader",
      accessor: "leader_name",
      Cell: ({ row }) => {
        const firstLetter = row.original.leader_name
          ? row.original.leader_name.slice(0, 1).toUpperCase()
          : "N.A";
        return (
          firstLetter +
          (row.original.leader_name ? row.original.leader_name.slice(1) : "N.A")
        );
        // const firstLetter = row.original.leader_name.slice(0, 1).toUpperCase();
        // return firstLetter + row.original.leader_name.slice(1);
      },
    },
    {
      Header: "Members Count",
      accessor: "member_count",
      Cell: ({ row }) => +row.original.member_count,
    },

    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className="table-actions-wrapper d-flex justify-content-center align-items-center">
          <Tooltip
            id="delete-client-tooltip"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            style={{
              // marginRight: "47px",
              cursor: "pointer",
            }}
            data-tooltip-id="delete-client-tooltip"
            data-tooltip-content="Show more"
            data-tooltip-place="top"
          >
            <TeamWiseReportModal
              teamWiseData={row.original}
              setIsUpdated={setIsUpdated}
            />
          </div>
        </div>
      ),
    },
  ];

  const { RangePicker } = DatePicker;

  const [teamWiseList, setTeamWiseList] = useState([]);
  const { initialState, allMemberReports, mainURL } = useContext(ContextAPI);

  const userId = localStorage.getItem("userId") ?? null;
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const formattedStartDate = dayjs(selectedStartDate).format("YYYY-MM-DD");
  const formattedEndDate = dayjs(selectedEndDate).format("YYYY-MM-DD");

  const [dates, setDates] = useState({
    rangeStartDate: null,
    rangeEndDate: null,
  });

  const handleRangeChange = (selectedDates) => {
    if (selectedDates && selectedDates.length > 0) {
      setSelectedStartDate(selectedDates[0]);
      setSelectedEndDate(selectedDates[1]);
      setDates({
        rangeStartDate: selectedDates[0],
        rangeEndDate: selectedDates[1],
      });
    } else {
      setDates({
        rangeStartDate: null,
        rangeEndDate: null,
      });
    }
  };

  useEffect(() => {
    if (dates.rangeStartDate === null && dates.rangeEndDate === null) {

      const currentDate = dayjs();
      const formattedStartDate = currentDate.format("YYYY-MM-DD");
      const formattedEndDate = currentDate.format("YYYY-MM-DD");
      const url = `${mainURL}reports/team-wise/${userId}/${formattedStartDate}/${formattedEndDate}`;

      const fetchData = async () => {
        try {
          const result = await axios.get(url, { headers: headerOptions() });
          const teamWiseReports = result?.data?.Team_wise_reports ?? [];
          setTeamWiseList(teamWiseReports);
        } catch (error) {
          console.error("Error fetching team-wise reports:", error);
      
        }
      };

      fetchData(); 
    }
  }, [dates]);

  const disabledFutureDates = (current) => {
    return current && current > dayjs().endOf("day");
  };
  const handleShowTeamWiseList = async () => {
    setLoading(true);
    const url = `${mainURL}reports/team-wise/${userId}/${formattedStartDate}/${formattedEndDate}`;

    try {
      const result = await axios.get(url, { headers: headerOptions() });
      const teamWiseReports = result?.data?.Team_wise_reports ?? [];
      setTeamWiseList(teamWiseReports);
    } catch (error) {
      console.error("Error fetching Team-wise reports:", error);
 
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleShowTeamWiseList();
  }, []);

  // const columns = useMemo(() => tableColumns, []);

  // const data = useMemo(() => teamWiseReportData, [teamWiseReportData]);
  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => teamWiseList, [teamWiseList]);

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
          icon={usersIcon}
          // icon={reportsIcon}
          headerTitle={
            userRole.includes("team_leaders") ? "Member List " : "Team Wise"
          }
        ></PageHeader>
      </div>
      <div className="mr-40 ml-30 mt-5 mb-15 d-flex  gap-4">
        <div className="relative-wrapper ">
          <img className="search-icon" src={calendarIcon} alt="search-icon" />
          <Space direction="vertical">
            <RangePicker
              disabledDate={disabledFutureDates}
              onChange={handleRangeChange}
              className="react-select-custom-styling__control"
            />
          </Space>
        </div>
        <div>
          <button className="custom-btn" onClick={handleShowTeamWiseList}>
            {loading ? <SpinningLoader /> : " Show List"}
          </button>
        </div>
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
      {/* {isLoading ? (
        <ReactTableSkeleton columnHeaders={columnHeaders} />
      ) : teamWiseReportData.length > 0 ? (
        <ReportsTable
          tableInstance={tableInstance}
          headers={headers}
          reportsData={teamWiseReportData}
        />
      ) : ( */}
      {/* Team Wise Table  */}
      {isLoading ? (
        <ReactTableSkeleton columnHeaders={columnHeaders} />
      ) : teamWiseList?.length > 0 ? (
        <TeamWiseReport
          tableInstance={tableInstance}
          headers={headers}
          teamWise={teamWiseList}
        />
      ) : (
        <div className="mr-40 ml-30 mb-15">
          <h5>No Team Wise Report Data Found !</h5>
        </div>
      )}
    </div>
  );
};

export default TeamWiseContent;
