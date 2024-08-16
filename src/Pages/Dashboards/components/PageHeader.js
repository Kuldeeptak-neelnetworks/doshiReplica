import React, { useContext, useMemo, useState, useEffect } from "react";
import { userIcon1 } from "../../../utils/ImportingImages/ImportingImages";
import axios from "axios";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import {
  handleAPIError,
  headerOptions,
} from "../../../utils/utilities/utilityFunctions";
const PageHeader = ({ title }) => {
  const { initialState, allMemberReports, mainURL } = useContext(ContextAPI);
  const userId = localStorage.getItem("userId") ?? null;
  const userRole = localStorage.getItem("userRole");
  const [message, setMessage] = useState("");
  const [projectCountList, setProjectCountList] = useState({
    inProgressJobs: 0,
    totalCompletedJobs: 0,
    onHoldJobs: 0,
    totalAssignJobs: 0,
  });
  const { inProgressJobs, totalCompletedJobs, onHoldJobs, totalAssignJobs } =
    projectCountList;
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 0 && hours < 12) {
      setMessage("Good Morning, ");
    } else if (hours >= 12 && hours < 16) {
      setMessage("Good Afternoon, ");
    } else {
      setMessage("Good Evening, ");
    }
  }, []);

  const handleProjectCountList = async () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "members") {
      return;
    }

    const url =
      userRole === "team_leaders,members" || userRole === "members,team_sub_leader"
        ? `${mainURL}dashboard/project-count-for-team-leader/${userId}`
        : `${mainURL}dashboard/project-count/${userId}`;

    try {
      const result = await axios.get(url, { headers: headerOptions() });
      const projectCountData = result?.data?.total_assign_job_count || {};
      setProjectCountList({
        inProgressJobs: projectCountData.in_progress_jobs || 0,
        totalCompletedJobs: projectCountData.total_completed_jobs || 0,
        onHoldJobs: projectCountData.on_hold_jobs || 0,
        totalAssignJobs: projectCountData.total_assign_jobs || 0,
      });
    } catch (error) {
      console.error("Error fetching project Count:", error);
    }
  };

  useEffect(() => {
    handleProjectCountList();
  }, [userId, userRole]);

  return (
    <>
      {userRole === "members" ? (
        ""
      ) : (
        <section className="main-content_header sticky_header">
          <div className="d-flex justify-content-start align-items-center page-heading custom-border-bottom">
            <img src={userIcon1} alt="clients" />
            <p className="m-0 fs-4">{title}</p>
          </div>
          <div className="d-flex flex-1 justify-content-end align-items-center page-heading custom-border-bottom gap-4 ">
            <p className="m-0 fs-4">
              {message} {localStorage.getItem("username")}!
            </p>
            <div className="projects-summary d-flex justify-content-center align-items-center gap-3">
              <div className="summary-box" style={{ background: "#319cd1" }}>
                <p className="m-0 text-center d-flex flex-row justify-content-center align-items-center gap-1 ">
                  <span style={{ color: "#fff", fontSize: "16px" }}>
                    Assigned
                  </span>
                  <span className="job">{totalAssignJobs}</span>
                  {/* <span className="fs-5 mt-2">{totalAssignJobs}</span> */}
                </p>
              </div>
              <div className="summary-box " style={{ background: "#0f5e0f" }}>
                <p className="m-0  text-center d-flex flex-row justify-content-center align-items-center gap-1 ">
                  <span style={{ color: "#fff", fontSize: "16px" }}>
                    Completed
                  </span>
                  <span className="job">{totalCompletedJobs}</span>
                  {/* <span className="fs-5 mt-2">{totalCompletedJobs}</span> */}
                </p>
              </div>
              <div className="summary-box" style={{ background: "#dc8400" }}>
                <p className="m-0  text-center d-flex flex-row justify-content-center align-items-center gap-1 ">
                  <span style={{ color: "#fff", fontSize: "16px" }}>
                    In Progress
                  </span>
                  <span className="job">{inProgressJobs}</span>
                  {/* <span className="fs-5 mt-2">{inProgressJobs}</span> */}
                </p>
              </div>

              <div className="summary-box" style={{ background: "#9f1c20" }}>
                <p className="m-0  text-center d-flex flex-row justify-content-center align-items-center gap-1 ">
                  <span style={{ color: "#fff", fontSize: "16px" }}>
                    On Hold
                  </span>
                  <span className="job">{onHoldJobs}</span>
                  {/* <span className="fs-5 mt-2">{onHoldJobs}</span> */}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default PageHeader;
