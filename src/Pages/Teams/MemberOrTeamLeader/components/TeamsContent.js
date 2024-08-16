import React, { useContext, useMemo, useEffect, useState } from "react";
import Select from "react-select";
import { ContextSidebarToggler } from "../../../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../../../templates/Breadcrumbs";
import {
  DownSVG,
  reportsIcon,  fileIcon,
  teamsIcon1,
} from "../../../../utils/ImportingImages/ImportingImages";
import PageHeader from "../../../../templates/PageHeader";

import styles from "./TeamsContent.module.css";
// import { formatDate } from "../../../../utils/utilities/utilityFunctions";
import { EditTeamJobModal } from "./EditTeamJobModal";
import TeamTable from "./TeamTable";
import ReactTableSkeleton from "../../../../templates/ReactTableSkeleton";
import { Tooltip } from "react-tooltip";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";

import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

const TeamsContent = ({
  teamData,
  setIsUpdated,
  isLoading,
  content,
}) => {
  const { sidebarClose ,initialState} = useContext(ContextSidebarToggler);
  const [teamJobs, setTeamJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const userRole = localStorage.getItem("userRole");
  const [currentRow, setCurrentRow] = useState("");


  // helper function for converting the member names array
  const getMembersNames = (dataset) => {
    const names = dataset
      ?.split(", ")
      ?.map((name) => name.trim())
      ?.map((name) => `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`);

    let newNamesArray = [];
    for (let i = 0; i < names?.length; i++) {
      if (names[i].includes("Leader")) {
        newNamesArray[0] = `${names[i].slice(0, -8)} (Team Leader)`;
        const filterNames = names.filter((_, index) => index !== i);
        newNamesArray = [...newNamesArray, ...filterNames];
      }
    }
    return newNamesArray;

  };

  const formatDate = (date) => {
    if (!date) return "N.A";
    
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear();
    
    const suffix = (day) => {
      if (day >= 11 && day <= 13) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    return `${day}${suffix(day)} ${month} ${year}`;
  };
  // const getMembersNames = (dataset) => {
  //   const names = dataset
  //     ?.split(", ")
  //     ?.map((name) => name.trim())
  //     ?.map((name) => `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`);
  
  //   let newNamesArray = [];
  //   for (let i = 0; i < names?.length; i++) {
  //     if (names[i].includes("Leader")) {
  //       newNamesArray[0] = `${names[i].slice(0, -8)} (Team Leader)`;
  //       const filterNames = names.filter((_, index) => index !== i);
  //       newNamesArray = [...newNamesArray, ...filterNames];
  //     }
  //   }
  //   // Remove duplicates using Set
  //   const uniqueNamesArray = [...new Set(newNamesArray)];
  //   return uniqueNamesArray;
  // };
  
  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Teams",
      pageURL: "/teams",
    },
  ];


  useEffect(() => {
    if (
      teamData?.assigned_jobs?.length > 0 &&
      Array.isArray(teamData?.assigned_jobs)
    ) {
      const filterJobsByStatus = teamData?.assigned_jobs?.filter((job) =>
        statusFilter?.value ? job.job_status === statusFilter.value : job
      );
      setTeamJobs(filterJobsByStatus);
    }
  }, [statusFilter, teamData]);
  


  // Table code
  const tableColumns = [
    
    {
      Header: "Sr no.",
      accessor: "sr no.",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Job Code",
      accessor: "job_code ",
      Cell: ({ row }) => row.original?.job_code || "N.A",
    },
    {
      Header: "Task Name",
      accessor: "task_name",
      Cell: ({ row }) => row.original?.task_name || "N.A",
  
    },
    {
      Header: "BPO No",
      accessor: "bpo_no",
      Cell: ({ row }) => row.original.bpo_no || "N.A",
    },
  
    {
      Header: "Assigned on",
      accessor: "assigned_on",
      Cell: ({ row }) => formatDate(row.original.assigned_on) || "N.A",
    },
    {
      Header: "Due Date",
      accessor: "due_on",
      Cell: ({ row }) => formatDate(row.original.due_on) || "N.A",
    },
    {
      Header: "Job Description",
      accessor: "job_description",
      Cell: ({ row }) => row.original.job_description || "N.A",
    },
   
    {
      Header: "Billable Hours",
      accessor: "total_billable_hours",
      Cell: ({ row }) => row.original?.total_billable_hours || "N.A",
    },
    {
      Header: "Approved Hours",
      accessor: "total_approved_hours",
      Cell: ({ row }) => row.original?.total_approved_hours || "N.A",
    },
    {
      Header: "Status",
      accessor: "job_status",
      Cell: ({ row }) => (
        <div className="d-flex justify-content-center align-items-center">
          <Stack direction="horizontal">
            {row.original.job_status === "Completed" ? (
              <Badge bg="success">Completed</Badge>
            ) : row.original.job_status === "On Hold" ? (
              <Badge bg="danger">On Hold</Badge>
            ) : (
              <Badge bg="warning" text="dark">
                In Progress
              </Badge>
            )}
          </Stack>
        </div>
      ),
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className="table-actions-wrapper d-flex justify-content-center align-items-center">
          <Tooltip
            id="update"
            style={{
              background: "#000",
              color: "#fff",
            }}
            opacity={0.9}
          />
          <div
            style={{ cursor: "pointer" }}
            data-tooltip-id="update"
            data-tooltip-content="Update"
            data-tooltip-place="top"
          >
            {userRole === "team_leaders,members" || userRole==="members,team_sub_leader" ? (
              <EditTeamJobModal
                teamJobData={row.original}
                teamId={teamData?.id}
                setIsUpdated={setIsUpdated}
              />
            ) : null}
          </div>
          {/* {userRole === "members" ? ( */}
          {row.original.time_entries_for_task !== "No time entries made for this job" && (
          <div
            style={{ cursor: "pointer" }}
            data-tooltip-id="show more"
            data-tooltip-content="Show More"
            data-tooltip-place="top"
          >
            {userRole !== "members" && (
            <div
              onClick={() => {
                setCurrentRow((prev) => {
                  if (prev === row.original.task_id) {
                    return "";
                  } else {
                    return row.original.task_id;
                  }
                });
              }}
            >
              <DownSVG />
            </div>)}
         
          </div>
          ) } 
        </div>
      ),
    },



  ];

  const columnHeaders = [
    "Sr no",
    "Job Code",
    "Task Name",
    "Assigned on",
    "Due Date",
    "Job Description",
    "Status",
    "Entered By"
  ];

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => teamJobs, [teamJobs]);
  const tableInstance = useTable(
    {
      
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const headers = {
    headings: [
      { label: "Job Code", key: "job_code" },
      { label: "Task Name", key: "task_name" },
      { label: "Assigned on", key: "assigned_on" },
      { label: "Due Date", key: "due_on" },
      { label: "Job Description", key: "job_description" },
      { label: "Status", key: "job_status" },
      { label: "Entered By", key: "entered_by" },
    ],
    fileName: "Team Data",
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>


      {/* Top header section */}
      {/* <div className="mb-5">
        <section className="main-content_header">
          <div className="d-flex justify-content-center align-items-center page-heading">
            <img src={teamsIcon1} alt={"Teams"} />
            <p className="m-0 fs-4">Teams</p>
          </div>
        </section>
      </div> */}

      <PageHeader
          tableInstance={tableInstance}
          icon={fileIcon}
          headerTitle={"Teams"}
        >
       
        </PageHeader>

      {/* filters */}
      <div className="mt-5">
      {(userRole === "team_leaders,members" || userRole === "members,team_sub_leader") && (
          <div className="mr-40 ml-30 mb-4 d-flex justify-content-start align-items-center gap-4">
            
            <div className="relative-wrapper w-25">
              <img
                className="search-icon"
                src={reportsIcon}
                alt="search-icon"
              />
              <Select
                closeMenuOnSelect={true}
                isClearable={true}
                options={[
                  { label: "In Progress", value: "In Progress" },
                  { label: "On Hold", value: "Hold" },
                  { label: "Completed", value: "Completed" },
                ]}
                onChange={(option) => setStatusFilter(option)}
                value={statusFilter}
                placeholder="Select Job Status"
                className="react-select-custom-styling__container"
                classNamePrefix="react-select-custom-styling"
              />
            </div>
          </div>
        )}

        {/* Team Details */}
        {/* {teamData.team_name ? (
          <div className="mr-40 ml-30 mb-15 my-teams-wrapper d-flex justify-content-start align-items-start gap-5 w-75">
            <div className="w-25">
              <p className={`m-0 ${styles.heading}`}>{teamData?.team_name}</p>
              <p className={`m-0 mt-4 ${styles.title}`}>Members list</p>
              <p className={`m-0 mt-2 ${styles.membersCount}`}>
                {teamData?.member_count} members
              </p>
              <div className={`mt-3 ${styles.teamMembersList}`}>
                {teamData?.member_names?.split(",")?.map((member, index) => (
                  <p key={index} className={`m-0 ${styles.text}`}>
                    {member}

                    {console.log("member",member)}
                  </p>
                ))}

           
              </div>
          
            </div>
          </div>
        ) : (
          <div className="mr-40 ml-30 mb-15">
            <h5>You are not a part of any Team yet!</h5>
          </div>
        )} */}
      </div>

      {userRole === "team_leaders,members" || userRole === "members" ||userRole === "members,team_sub_leader" ? (
        <>
      
        
          {isLoading ? (
            <ReactTableSkeleton columnHeaders={columnHeaders} />
          ) : teamJobs?.length > 0 ? (
            <TeamTable
              currentRow={currentRow}
              tableInstance={tableInstance}
              headers={headers}
              teamData={teamJobs}
              setIsUpdated={setIsUpdated}
           
            />
          ) : (
            <div className="mt-4 mr-40 ml-30 mb-15">
              <h5>No data found!</h5>
            </div>
          )}{" "}
        </>
      ) : null}
    </div>
  );
};

export default TeamsContent;
