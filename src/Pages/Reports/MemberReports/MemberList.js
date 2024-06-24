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

import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";

import { DatePicker, Space } from "antd";
import dayjs from "dayjs";

import {
  searchIcon,
  calendarIcon,
  reportsIcon,
  projectsIcon,
  InvoiceIcon,
  employeeIcon,
  usersIcon,
} from "../../../utils/ImportingImages/ImportingImages";
import PageHeader from "../../../templates/PageHeader";
import Breadcrumbs from "../../../templates/Breadcrumbs";
import ReactTableSkeleton from "../../../templates/ReactTableSkeleton";
import { formatDate } from "../../../utils/utilities/utilityFunctions";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import MemberListTable from "./MemberListTable";
import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import {
  handleAPIError,
  headerOptions,
} from "../../../utils/utilities/utilityFunctions";
import axios from "axios";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import { MemberTimeEntriesModal } from "./MemberTimeEntriesModal";

const MemberList = ({ isLoading }) => {
  const navigate = useNavigate();
  const [memberList, setMemberList] = useState([]);
  const { initialState, allMemberReports, mainURL } = useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const userId = localStorage.getItem("userId") ?? null;
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const formattedStartDate = dayjs(selectedStartDate).format("YYYY-MM-DD");
  const formattedEndDate = dayjs(selectedEndDate).format("YYYY-MM-DD");
  const userRole = localStorage.getItem("userRole");

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
      pageName: "Member List",
      //   pageURL: "/assign-job",
    },
  ];

  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "sr no.",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "User role",
      accessor: "user_role",
    },
    {
      Header: "Team Names",
      accessor: "team_names",
    },
    {
      Header: "Billable Hours",
      accessor: "total_billable_hours",
      Cell :({row})=> row.original?.total_billable_hours || "N.A"
    },
    {
      Header: "Side Work Hours",
      accessor: "total_side_works_hours",
      Cell :({row})=> row.original?.total_side_works_hours || "N.A"
      
    },
   
    {
      id: "action",
      Header: userRole !== "it_member" && userRole !== "operation_member" ? "Action" : "", 
      Cell: ({ row }) => (
        <>
          {userRole !== "it_member" && userRole !== "operation_member" && (
            <div className="table-actions-wrapper d-flex justify-content-center align-items-center">
              <Tooltip
                id="time-entries-tooltip"
                style={{
                  background: "#000",
                  color: "#fff",
                }}
                opacity={0.9}
              />
              <div
                data-tooltip-id="time-entries-tooltip"
                data-tooltip-content="Check Time Entries"
                data-tooltip-place="top"
              >
                <MemberTimeEntriesModal 
                  memberUserId={row.original.user_id}
                />
              </div>
            </div>
          )}
        </>
      ),
    }
    
    
  ];

  const columnHeaders = [
    "Sr no",
    "Name",
    "Email",
    "Team Names",
    "Total Time",
    "Edit",
  ];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => memberList, [memberList]);

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
      { label: "Name", key: "name" },
      { label: "Email", key: "email" },
    ],
    fileName: "Member List",
  };
  const { RangePicker } = DatePicker;
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

      const url = `${mainURL}reports/member-wise/${userId}/${formattedStartDate}/${formattedEndDate}`;
      const fetchData = async () => {
        try {
          const result = await axios.get(url, { headers: headerOptions() });
          const memberWiseReports = result?.data?.member_wise_reports ?? [];
          setMemberList(memberWiseReports);
        } catch (error) {
          console.error("Error fetching member-wise reports:", error);
        }
      };

      fetchData();
    }
  }, [dates]);

  const disabledFutureDates = (current) => {
    return current && current > dayjs().endOf("day");
  };
  const handleShowList = async () => {
    setLoading(true);
    const url = `${mainURL}reports/member-wise/${userId}/${formattedStartDate}/${formattedEndDate}`;

    try {
      const result = await axios.get(url, { headers: headerOptions() });
      const memberWiseReports = result?.data?.member_wise_reports ?? [];
      setMemberList(memberWiseReports);
      // if (result.status === 200) {
      //   ReactHotToast(result.data.message, "success");
      //  }
    } catch (error) {
      handleAPIError(error);
      console.error("Error fetching member-wise reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleShowList();
  }, []);

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      {/* Top header section */}
      <PageHeader
        tableInstance={tableInstance}
        icon={usersIcon}
        headerTitle={"Member List"}
      ></PageHeader>
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
          <button className="custom-btn" onClick={handleShowList}>
            {loading ? <SpinningLoader /> : " Show List"}
          </button>
        </div>
      </div>

      
      {isLoading ? (
        <ReactTableSkeleton columnHeaders={columnHeaders} />
      ) : memberList?.length > 0 ? (
        <MemberListTable
          tableInstance={tableInstance}
          headers={headers}
          memberList={memberList}
        />
      ) : (
        <div className="mt-4 mr-40 ml-30 mb-15">
          <h5>No data found!</h5>
        </div>
      )}
    </div>
  );
};

export default MemberList;
