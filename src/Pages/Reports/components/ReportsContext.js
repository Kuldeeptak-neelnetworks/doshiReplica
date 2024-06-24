import React, { useContext, useMemo, useState } from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

import ReportsFilter from "./ReportsFilter";
import PageHeader from "../../../templates/PageHeader";
import Breadcrumbs from "../../../templates/Breadcrumbs";
import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import ReportsTable from "./ReportsTable";
import ReactTableSkeleton from "../../../templates/ReactTableSkeleton";
import { reportsIcon1 } from "../../../utils/ImportingImages/ImportingImages";

const ReportsContext = () => {
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Reports",
      pageURL: "/reports",
    },
  ];
  const [isLoading, setIsLoading] = useState(false);

  const reportsData = [
    {
      id: 1,
      employee_name: "John",
      worked_on: "Tax Consultation",
      working_hrs: "3 hours",
      date: "03/12/2023",
      description: "Worked on creating a tax consulting report for XYZ company",
    },
    {
      id: 2,
      employee_name: "Alice",
      worked_on: "Financial Analysis",
      working_hrs: "5 hours",
      date: "03/13/2023",
      description: "Conducted financial analysis for ABC Corporation",
    },
    {
      id: 3,
      employee_name: "Bob",
      worked_on: "Budget Planning",
      working_hrs: "4 hours",
      date: "03/14/2023",
      description: "Developed budget plans for QRS Enterprises",
    },
    {
      id: 4,
      employee_name: "Eva",
      worked_on: "Investment Strategy",
      working_hrs: "6 hours",
      date: "03/15/2023",
      description: "Formulated investment strategies for LMN Investments",
    },
    {
      id: 5,
      employee_name: "Greg",
      worked_on: "Financial Reporting",
      working_hrs: "3.5 hours",
      date: "03/16/2023",
      description: "Generated financial reports for DEF Ltd.",
    },
    {
      id: 6,
      employee_name: "Hannah",
      worked_on: "Auditing",
      working_hrs: "4.5 hours",
      date: "03/17/2023",
      description: "Conducted auditing procedures for GHI Corporation",
    },
    {
      id: 7,
      employee_name: "Ivan",
      worked_on: "Risk Assessment",
      working_hrs: "3 hours",
      date: "03/18/2023",
      description: "Assessed financial risks for JKL Ventures",
    },
    {
      id: 8,
      employee_name: "Janet",
      worked_on: "Expense Tracking",
      working_hrs: "2.5 hours",
      date: "03/19/2023",
      description: "Tracked expenses for MNO Limited",
    },
    {
      id: 9,
      employee_name: "Kevin",
      worked_on: "Loan Approval",
      working_hrs: "5 hours",
      date: "03/20/2023",
      description: "Approved loans for PQR Bank clients",
    },
    {
      id: 10,
      employee_name: "Linda",
      worked_on: "Profit Margin Analysis",
      working_hrs: "4 hours",
      date: "03/21/2023",
      description: "Analyzed profit margins for STU Enterprises",
    },
    {
      id: 11,
      employee_name: "Mike",
      worked_on: "Tax Compliance",
      working_hrs: "3.5 hours",
      date: "03/22/2023",
      description: "Ensured tax compliance for VWX Corporation",
    },
    {
      id: 12,
      employee_name: "Nancy",
      worked_on: "Financial Forecasting",
      working_hrs: "6 hours",
      date: "03/23/2023",
      description: "Performed financial forecasting for YZA Inc.",
    },
    {
      id: 13,
      employee_name: "Oscar",
      worked_on: "Credit Analysis",
      working_hrs: "4 hours",
      date: "03/24/2023",
      description: "Conducted credit analysis for BCD Bank clients",
    },
    {
      id: 14,
      employee_name: "Pamela",
      worked_on: "Investment Portfolio Review",
      working_hrs: "5 hours",
      date: "03/25/2023",
      description: "Reviewed investment portfolios for EFG Investors",
    },
    {
      id: 15,
      employee_name: "Quincy",
      worked_on: "Financial Compliance",
      working_hrs: "3 hours",
      date: "03/26/2023",
      description: "Ensured financial compliance for HIJ Corporation",
    },
  ];

  const tableColumns = [
    {
      Header: "Sr no.",
      accessor: "sr no.",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Member Name",
      accessor: "employee_name",
    },
    {
      Header: "Worked on",
      accessor: "worked_on",
    },
    {
      Header: "Working hours",
      accessor: "working_hrs",
    },
    {
      Header: "Date",
      accessor: "date",
    },
    {
      Header: "Description",
      accessor: "description",
    },
  ];

  // Dummy Headings For React Skeleton
  const columnHeaders = [
    "Sr no",
    "Member Code",
    "Name",
    "Email ID",
    "Postion",
    "Status",
    "Edit",
  ];

  // Memoization of fetched Values
  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => reportsData, []);

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
      { label: "Member Name", key: "member_name" },
      { label: "Email ID", key: "member_email" },
      { label: "Position", key: "member_role" },
      { label: "Status", key: "current_status" },
    ],
    fileName: "Reports",
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      {/* Top header section */}
      <div className="relative-wrapper zIndex-2">
        <PageHeader
          tableInstance={tableInstance}
          icon={reportsIcon1}
          headerTitle={"Reports"}
        />
      </div>

      {/* Reports Filters section */}
      <div className="relative-wrapper zIndex-2">
        <ReportsFilter />
      </div>

      {/* Reports Table */}
      {isLoading ? (
        <ReactTableSkeleton columnHeaders={columnHeaders} />
      ) : reportsData.length > 0 ? (
        <div className="reports-table">
          <ReportsTable
            tableInstance={tableInstance}
            headers={headers}
            reportsData={reportsData}
          />
        </div>
      ) : (
        <div className="mr-40 ml-30 mt-4 mb-15">
          <h5>No Data found!</h5>
        </div>
      )}
    </div>
  );
};

export default ReportsContext;
