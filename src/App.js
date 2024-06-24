// packages
import React, { useContext, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { ContextAPI } from "./Context/ApiContext/ApiContext";

// components / pages
import { Login } from "./Pages/Login/Login";
import { ForgotPassword } from "./Pages/ForgotPassword/ForgotPassword";
import { VerifyResetPassword } from "./Pages/VerifyResetPassword/VerifyResetPassword";
import { ResetPassword } from "./Pages/ResetPassword/ResetPassword";
import { NoPage } from "./Pages/NoPage/NoPage";
import Profile from "./Pages/Profile/Profile";

// Dashboard routes
import Dashboard from "./Pages/Dashboards/Dashboard";

// Members related Routes
import { Members } from "./Pages/Members/Members";
import AddMember from "./Pages/Members/AddMember";

// Team related Routes
import { Teams } from "./Pages/Teams/Teams";
import AddTeam from "./Pages/Teams/AdminOrManager/components/AddTeam";
import ManageTeam from "./Pages/Teams/AdminOrManager/components/ManageTeam";

// Clients related Routes
import { Clients } from "./Pages/Clients/Clients";
import AddClient from "./Pages/Clients/AddClient";
import ClientDetails from "./Pages/Clients/ClientDetails/ClientDetails";
import NewClientDetails from "./Pages/Clients/ClientDetails/NewClientDetails";
import BillingServices from "./Pages/Clients/BillingServices/BillingServices";

// Jobs related Routes
import Jobs from "./Pages/Jobs/Jobs";
import AssignJobs from "./Pages/Jobs/AdminOrManager/AssignJobs/AssignJobs";
import AddJobEntry from "./Pages/Jobs/MemberOrTeamLeaderJobs/JobEntry/AddJobEntry";
import JobCategory from "./Pages/Jobs/AdminOrManager/JobCategory/JobCategory";
import TimeEntries from "./Pages/Jobs/TimeEntries";

// Holiday related routes
// import Holiday from "./Pages/Holidays/Holiday";

// User Logs related routes
import Logs from "./Pages/Logs/Logs";

// Reports Routes
import { Reports } from "./Pages/Reports/Reports";

// Private Routes
import TokenAuth from "./utils/PrivateRoutes/TokenAuth";
import ITMemberRoutes from "./utils/PrivateRoutes/ITMemberRoutes";
import ITMemberAndOperationMemberRoutes from "./utils/PrivateRoutes/ITMemberAndOperationMemberRoutes";

// components
import { Header } from "./Components/Header/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import Invoice from "./Pages/Invoices/Invoice";

// css files
import "react-tooltip/dist/react-tooltip.css";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-loading-skeleton/dist/skeleton.css";

import "./App.css";
import "../src/stylesheet/Screens/LoginScreen.css";
import "./stylesheet/customClasses.css";
import "./stylesheet/CommonCSS.css";
import GetAllInvoice from "./Pages/Clients/Invoice/GetAllInvoice";
import GenerateInvoice from "./Pages/Clients/Invoice/GenerateInvoice/GenerateInvoice";
import MemberList from "./Pages/Reports/MemberReports/MemberList";
import ClientWise from "./Pages/Reports/ClientWise/ClientWise";
import GetAllMembers from "./Pages/Reports/MemberReports/GetAllMembers";
import TeamLeaderWise from "./Pages/Reports/TeamLeaderWise/TeamLeaderWise";
import TeamWise from "./Pages/Reports/TeamWise/TeamWise";
import CompanySettings from "./Pages/Master/components/CompanySettings";
import { GetAllNotifications } from "./Components/Notification/AllNotification";
import IpAddress from "./Pages/Master/IPAddress/IpAddress";
import { Unauthorized } from "./Components/Unauthorized/Unauthorized";

function App() {
  const { getUserDetails, userDetails } = useContext(ContextAPI);
  const location = useLocation();

  // for fetching the logged in user details everytime pages changes
  useEffect(() => {
    // console.log("userDetails: ", userDetails);
    if (localStorage.getItem("token")) {
      getUserDetails();
    }
  }, [location]);

  return (
    <div className="App">
      {localStorage.getItem("token") && (
        <>
          <Header />
          <Sidebar />
        </>
      )}

      {/* Routes */}
      <Routes>
        <Route index path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/verify-reset-password/:resetPasswordToken"
          element={<VerifyResetPassword />}
        />
        <Route path="*" element={<NoPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<TokenAuth />}>
          <Route element={<ITMemberRoutes />}>
            <Route path="/members" element={<Members />} />
            <Route path="/members/add-member" element={<AddMember />} />
          </Route>

          <Route element={<ITMemberAndOperationMemberRoutes />}>
            <Route path="/teams/add-team" element={<AddTeam />} />
            <Route path="/teams/manage-team" element={<ManageTeam />} />

            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/add-client" element={<AddClient />} />
            <Route path="/clients/client-details" element={<ClientDetails />} />
            <Route path="/clients/:clientId" element={<NewClientDetails />} />
            <Route
              path="/clients/billing-services"
              element={<BillingServices />}
            />
            <Route
              path="/reports/get-all-invoice"
              element={<GetAllInvoice />}
            />

            <Route path="/jobs/assign-job" element={<AssignJobs />} />
            <Route path="/jobs/category" element={<JobCategory />} />

            <Route path="/reports" element={<Reports />} />

            <Route path="/reports/client-wise" element={<ClientWise />} />
            {/* <Route
              path="/reports/team-leader-wise"
              element={<TeamLeaderWise />}
            /> */}
            <Route path="/reports/team-wise" element={<TeamWise />} />

            {/* <Route path="/holidays" element={<Holiday />} /> */}

            <Route path="/invoice" element={<Invoice />} />

            <Route path="/generateInvoice" element={<GenerateInvoice />} />
          </Route>
          <Route path="/reports/memberList" element={<GetAllMembers />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/teams" element={<Teams />} />

          <Route path="/jobs" element={<Jobs />} />

          <Route path="/jobs/job-entry" element={<AddJobEntry />} />

          <Route path="/jobs/time-entries" element={<TimeEntries />} />

          <Route path="/logs" element={<Logs />} />
          <Route path="/company-settings" element={<CompanySettings />} />
          <Route path="ip-address" element={<IpAddress />} />
          <Route path="/notifications" element={<GetAllNotifications />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
