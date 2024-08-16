import React, { useState, useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { ContextSidebarToggler } from "../../Context/SidebarToggler/SidebarToggler";
import { ContextAPI } from "../../Context/ApiContext/ApiContext";

import {
  homeIcon,
  reportsIcon,
  projectsIcon,
  usersIcon1,
  clientsIcon,
  settingsIcon,
  teamsIcon,
} from "../../utils/ImportingImages/ImportingImages";

import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const { sidebarClose, setSidebarClose } = useContext(ContextSidebarToggler);
  const { userDetails } = useContext(ContextAPI);

  const [showMenu, setShowMenu] = useState(false);
  const [addActiveClass, setAddActiveClass] = useState({
    dashboard: false,
    reports: false,
    jobs: false,
    members: false,
    clients: false,
    settings: false,
    teams: false,
  });

  useEffect(() => {
    const pathname = window.location.pathname;

    // for dashboard
    const dashboard = pathname.includes("/dashboard");

    // for reports
    const reports = pathname.includes("/reports");

    // for members
    const members = pathname.includes("/members");

    // for clients
    const clients = pathname.includes("/clients");

    // for teams
    const teams = pathname.includes("/teams");

    // for projects / jobs
    const jobs = pathname.includes("/jobs");

    // for setting
    const settings = pathname.includes("/logs");

    const defaultState = {
      dashboard: false,
      reports: false,
      jobs: false,
      members: false,
      clients: false,
      settings: false,
      teams: false,
    };

    if (dashboard) {
      setAddActiveClass(() => ({ ...defaultState, dashboard: true }));
    } else if (reports) {
      setAddActiveClass(() => ({ ...defaultState, reports: true }));
    } else if (members) {
      setAddActiveClass(() => ({ ...defaultState, members: true }));
    } else if (clients) {
      setAddActiveClass(() => ({ ...defaultState, clients: true }));
    } else if (jobs) {
      setAddActiveClass(() => ({ ...defaultState, jobs: true }));
    } else if (teams) {
      setAddActiveClass(() => ({ ...defaultState, teams: true }));
    } else if (settings) {
      setAddActiveClass(() => ({ ...defaultState, settings: true }));
    } else {
      setAddActiveClass(() => ({ ...defaultState }));
    }
  }, [location]);

  const navLinkStyling = ({ isActive }) => {
    if (isActive) {
      return {
        fontWeight: "700",
        // backgroundColor: "#E0FBFC",
      };
    }
  };

  const handleArrowClick = (e) => {
    const arrowParent = e.target.parentElement.parentElement; // selecting the main parent of arrow
    arrowParent.classList.toggle("showMenu");
    setShowMenu(!showMenu); // Toggle the state in React
  };

  // Main Caret for Sidebar to Open & Close sidebar
  const sidebarTogglerCaret = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 14 21"
      fill="none"
      className={`toggle-sidebar-btn`}
      onClick={(e) => setSidebarClose((prev) => !prev)}
    >
      <path
        opacity="0.95"
        d="M11.6399 2.23877L3.00952 10.8693L11.6399 19.4997"
        stroke="#339989"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );

  // Sub Menu Caret Icons to Open & Close sub-menus
  const subMenuTogglerCaret = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 14 21"
        fill="none"
        className={`subMenu-toggler-btn arrow`}
      >
        <path
          opacity="0.95"
          d="M11.6399 2.23877L3.00952 10.8693L11.6399 19.4997"
          stroke="#339989"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const checkPathIsIncluded = (path) => window.location.pathname.includes(path);
  const checkPathIsSame = (path) => window.location.pathname === path;

  return (
    <div className={`sidebar ${sidebarClose ? "close" : ""}`}>
      <ul className="nav-links">
        {/* Dashboard */}
        <li className={`navLink ${addActiveClass.dashboard ? "active" : ""}`}>
          <NavLink to="/dashboard">
            <span className="sidebar-img-wrapper">
              <img alt="dashboard" src={homeIcon} />
            </span>
            <span
              className={`link_name ${
                checkPathIsIncluded("/dashboard") ? "active" : ""
              }`}
            >
              Dashboard
            </span>
          </NavLink>
          {sidebarTogglerCaret()}
        </li>

        {/* Reports */}
        {userDetails?.member_role === "it_member" ||
        userDetails?.member_role === "operation_member" || userDetails?.member_role==="members,team_sub_leader"||
        userDetails?.member_role === `team_leaders,members` ? (
          <li className={`navLink ${addActiveClass.reports ? "active" : ""}`}>
            <div className="icon-link">
              <NavLink>
                <span className="sidebar-img-wrapper">
                  <img alt="reports" src={reportsIcon} />
                </span>
                <span
                  className={`link_name ${
                    checkPathIsIncluded("/reports") ? "active" : ""
                  }`}
                  // to="/reports"
                >
                  Reports
                </span>
                {/* <span className={`link_name`}>  Reports</span> */}
              </NavLink>
              <div className="subMenu-caret-wrapper" onClick={handleArrowClick}>
                {subMenuTogglerCaret()}
              </div>
            </div>
            <ul className="sub-menu">
              {(userDetails?.member_role === "it_member" ||
                userDetails?.member_role === "operation_member") && (
                <li>
                  <NavLink
                    className={`link_name ${
                      checkPathIsSame("/reports/memberList") ? "active" : ""
                    }`}
                    to="/reports/memberList"
                  >
                    Member List
                  </NavLink>
                </li>
              )}
              {(userDetails?.member_role === `team_leaders,members`||userDetails?.member_role === `members,team_sub_leader`) && (
                <li>
                  <NavLink
                    className={`link_name ${
                      checkPathIsSame("/reports/memberList") ? "active" : ""
                    }`}
                    to="/reports/memberList"
                  >
                    Member List
                  </NavLink>
                </li>
              )}
              {(userDetails?.member_role === "it_member" ||
                userDetails?.member_role === "operation_member") && (
                <li>
                  <NavLink
                    className={`link_name ${
                      checkPathIsSame("/reports/client-wise") ? "active" : ""
                    }`}
                    to="/reports/client-wise"
                  >
                    Client Wise
                  </NavLink>
                </li>
              )}
            </ul>
            <ul className="sub-menu">
              {(userDetails?.member_role === "it_member" ||
                userDetails?.member_role === "operation_member") && (
                <li>
                  <NavLink
                    className={`link_name ${
                      checkPathIsSame("/reports/get-all-invoice")
                        ? "active"
                        : ""
                    }`}
                    to="/reports/get-all-invoice"
                  >
                    Invoice
                  </NavLink>
                </li>
              )}
              {/* {(userDetails?.member_role === "it_member" ||
                userDetails?.member_role === "operation_member") && (
                <li>
                  <NavLink
                    className={`link_name ${
                      checkPathIsSame("/reports/team-leader-wise")
                        ? "active"
                        : ""
                    }`}
                    to="/reports/team-leader-wise"
                  >
                    Team Leader Wise
                  </NavLink>
                </li>
              )} */}
              {(userDetails?.member_role === "it_member" ||
                userDetails?.member_role === "operation_member") && (
                <li>
                  <NavLink
                    className={`link_name ${
                      checkPathIsSame("/reports/team-wise") ? "active" : ""
                    }`}
                    to="/reports/team-wise"
                  >
                    Team Wise
                  </NavLink>
                </li>
              )}
            </ul>
          </li>
        ) : (
          ""
        )}

        {/* Jobs */}
        <li className={`navLink ${addActiveClass.jobs ? "active" : ""}`}>
          <div className="icon-link">
            <NavLink className="link_name" to="/jobs">
              <span className="sidebar-img-wrapper">
                <img alt="jobs" src={projectsIcon} />
              </span>
              <span
                className={`link_name ${
                  checkPathIsIncluded("/jobs") ? "active" : ""
                }`}
              >
                Jobs
              </span>
            </NavLink>
            <div className="subMenu-caret-wrapper" onClick={handleArrowClick}>
              {subMenuTogglerCaret()}
            </div>
          </div>
          <ul className="sub-menu">
            {(userDetails?.member_role === "it_member" ||
              userDetails?.member_role === "operation_member") && (
              <li>
                <NavLink
                  className={`link_name ${
                    checkPathIsSame("/jobs/assign-job") ? "active" : ""
                  }`}
                  to="/jobs/assign-job"
                >
                  Assign Job
                </NavLink>
              </li>
            )}

            {(userDetails?.member_role === "members" ||
              userDetails?.member_role === "members,team_sub_leader" ||
              userDetails?.member_role === "team_leaders,members") && (
              <li>
                <NavLink
                  className={`link_name ${
                    checkPathIsSame("/jobs/job-entry") ? "active" : ""
                  }`}
                  to="/jobs/job-entry"
                >
                  Job Entry
                </NavLink>
              </li>
            )}

            {(userDetails?.member_role === "it_member" ||
              userDetails?.member_role === "operation_member" ||
              userDetails?.member_role === "members,team_sub_leader" ||
              userDetails?.member_role === "team_leaders,members") && (
              <li>
                <NavLink
                  className={`link_name ${
                    checkPathIsSame("/jobs/time-entries") ? "active" : ""
                  }`}
                  to="/jobs/time-entries"
                >
                  Time Entries
                </NavLink>
              </li>
            )}

            {(userDetails?.member_role === "it_member" ||
              userDetails?.member_role === "operation_member") && (
              <li>
                <NavLink
                  className={`link_name ${
                    checkPathIsSame("/jobs/billable-jobs") ? "active" : ""
                  }`}
                  to="/jobs/billable-jobs"
                >
               Billable Jobs
                </NavLink>
              </li>
            )}
            {(userDetails?.member_role === "it_member" ||
              userDetails?.member_role === "operation_member") && (
              <li>
                <NavLink
                  className={`link_name ${
                    checkPathIsSame("/jobs/category") ? "active" : ""
                  }`}
                  to="/jobs/category"
                >
                  Job Category
                </NavLink>
              </li>
            )}
          </ul>
        </li>
        {/* Members */}
        {userDetails?.member_role === "it_member" && (
          <li className={`navLink ${addActiveClass.members ? "active" : ""}`}>
            <NavLink to="/members">
              <span className="sidebar-img-wrapper">
                <img alt="members" src={usersIcon1} />
              </span>
              <span
                className={`link_name ${
                  checkPathIsIncluded("/members") ? "active" : ""
                }`}
              >
                Members
              </span>
            </NavLink>
          </li>
        )}
        {/* Teams */}
        {/* <li className={`navLink ${addActiveClass.teams ? "active" : ""}`}>
          <NavLink to="/teams">
            <span className="sidebar-img-wrapper">
              <img alt="teams" src={teamsIcon} />
            </span>
            <span
              className={`link_name ${
                checkPathIsIncluded("/teams") ? "active" : ""
              }`}
            >
              Teams
            </span>
          </NavLink>
        </li> */}

        <li className={`navLink ${addActiveClass.jobs ? "active" : ""}`}>
          <div className="icon-link">
            <NavLink className="link_name" to="/teams">
              <span className="sidebar-img-wrapper">
                <img alt="jobs" src={teamsIcon} />
              </span>
              <span
                className={`link_name ${
                  checkPathIsIncluded("/teams") ? "active" : ""
                }`}
              >
                Teams
              </span>
            </NavLink>
            {userDetails?.member_role !== "it_member" && (
              <div className="subMenu-caret-wrapper" onClick={handleArrowClick}>
                {subMenuTogglerCaret()}
              </div>
            )}
          </div>

          <ul className="sub-menu">
            {(userDetails?.member_role === "members" ||
              userDetails?.member_role === "members,team_sub_leader" ||
              userDetails?.member_role === "team_leaders,members") && (
              <li>
                <NavLink
                  className={`link_name ${
                    checkPathIsSame("/teams/team-member") ? "active" : ""
                  }`}
                  to="/teams/team-member"
                >
                  Team Member
                </NavLink>
              </li>
              

              
            )}
          </ul>
        </li>

        {/* Clients */}
        {(userDetails?.member_role === "it_member" ||
          userDetails?.member_role === "operation_member") && (
          <li className={`navLink ${addActiveClass.clients ? "active" : ""}`}>
            <div className="icon-link">
              <NavLink to="/clients">
                <span className="sidebar-img-wrapper">
                  <img alt="clients" src={clientsIcon} />
                </span>
                <span
                  className={`link_name ${
                    checkPathIsIncluded("/clients") ? "active" : ""
                  }`}
                >
                  Clients
                </span>
              </NavLink>
              <div className="subMenu-caret-wrapper" onClick={handleArrowClick}>
                {subMenuTogglerCaret()}
              </div>
            </div>
            <ul className="sub-menu">
              {(userDetails?.member_role === "it_member" ||
                userDetails?.member_role === "operation_member") && (
                <li>
                  <NavLink
                    className={`link_name ${
                      checkPathIsSame("/clients/billing-services")
                        ? "active"
                        : ""
                    }`}
                    to="/clients/billing-services"
                  >
                    Billing Services
                  </NavLink>
                </li>
              )}
            </ul>
          </li>
        )}
        {/* Settings */}
        {userDetails?.member_role === "members" ? (
          ""
        ) : (
          <li className={`navLink ${addActiveClass.settings ? "active" : ""}`}>
            <div className="icon-link">
              <NavLink>
                <span className="sidebar-img-wrapper">
                  <img alt="settings" src={settingsIcon} />
                </span>
                <span className={`link_name`}>Masters</span>
              </NavLink>
              <div className="subMenu-caret-wrapper" onClick={handleArrowClick}>
                {subMenuTogglerCaret()}
              </div>
            </div>

            <ul className="sub-menu">
              <li>
                <NavLink
                  className={`link_name ${
                    checkPathIsSame("/logs") ? "active" : ""
                  }`}
                  to="/logs"
                >
                  Logs
                </NavLink>
              </li>
              {/* {userDetails?.member_role === "it_member" ||
              userDetails?.member_role === "operation_member" ? (
                <li>
                  <NavLink
                    className={`link_name ${
                      checkPathIsSame("/company-settings") ? "active" : ""
                    }`}
                    to="/company-settings"
                  >
                    Website Settings
                  </NavLink>
                </li>
              ) : null} */}

              {userDetails?.member_role === "it_member" ||
              userDetails?.member_role === "operation_member" ? (
                <li>
                  <NavLink
                    className={`link_name ${
                      checkPathIsSame("/ip-address") ? "active" : ""
                    }`}
                    to="/ip-address"
                  >
                    Ip Address
                  </NavLink>
                </li>
              ) : null}
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
