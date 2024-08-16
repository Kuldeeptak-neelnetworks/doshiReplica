import React, { useContext } from "react";

import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import CompletedProjectsBlock from "./Blocks/CompletedProjectsBlock";
import ClientInvoicingBlock from "./Blocks/ClientInvoicingBlock";
import QuickLinksBlock from "./Blocks/QuickLinksBlock";
import TeamLeaderComplatedJob from "./Blocks/TeamLeaderComplatedJob";
import PageHeader from "./PageHeader";
import TodoBlock from "./TodoManagement/TodoBlock";
import BarChart from "./Charts/BarChart";
import DoughnutChart from "./Charts/DoughnutChart";
import TeamLeaderInProgressjob from "./Blocks/TeamLeaderInProgressJob";
import logo from "../../../assets/logo/d-w-border-01.svg";
import TeamLeaderBarChart from "./Charts/TeamLeaderBarChart";

const DashboardContent = ({ title }) => {
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const userRole = localStorage.getItem("userRole");

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      {/* Page Header */}
      <PageHeader title={title} />

      {/* Main Content */}
      {userRole === "members" ? (
        <div
          className="d-flex justify-content-center g-10 w-60"
          style={{ padding: "76px" }}
        >
          <div className="">
            <div className="d-flex justify-content-center">
              <img src={logo} style={{ width: "38%", height: "20%" }} />
            </div>
            <span
              className=""
              style={{
                fontSize: "77px",
                fontWeight: "600",
                fontFamily: "Montserrat",
                color: "#2f87b5",
              }}
            >
              WELCOME TO DOSHI PMS
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
      {userRole === "members" ? (
        ""
      ) : (
        <section className="m-auto mt-3 gap-5 main-content_form-section d-flex flex-column justify-content-start align-items-center " style={{width:"94%"}}>
          <div className="d-flex w-100 justify-content-between align-items-start gap-4">
            {userRole === "team_leaders,members"|| userRole ==="members,team_sub_leader" ? (
              <TeamLeaderComplatedJob />
            ) : (
              ""
            )}
            {userRole === "team_leaders,members"  || userRole ==="members,team_sub_leader"? (
              <TeamLeaderInProgressjob />
            ) : (
              <ClientInvoicingBlock />
            )}
          </div>
          <div className="d-flex w-100 justify-content-between align-items-start gap-4">
            {/* <CompletedProjectsBlock /> */}
            <div className="d-flex w-100  gap-4">
              <TodoBlock />
              <QuickLinksBlock />
            </div>
          </div>
          <div className="dashboard-block w-100">
            <div className="block-header justify-content-start align-items-start w-100">
              <p className="m-0 fs-5 fw-bolder">Statistics</p>
            </div>
            <div className="d-flex gap-3 mt-3">
              {userRole === "it_member" || userRole === "operation_member" ? (
                <BarChart />
              ) : (
                <TeamLeaderBarChart />
              )}
              {/* <DoughnutChart /> */}
              
             
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardContent;
