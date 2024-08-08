import React, { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  handleAPIError,
  headerOptions,
} from "../../utils/utilities/utilityFunctions";

export const ContextAPI = createContext();
// export const nnAPIKey = `fcbf2fee98cee0be1da58b8a2066b7d3826f335def2261d693208e16275dde5b`;
export const nnAPIKey = process.env.REACT_APP_NN_API;

export const ApiContext = ({ children }) => {
  const navigate = useNavigate();

  // states
  const [initialState, setInitialState] = useState({
    jobCategories: [],
    billingServicesList: [],
    clientsList: [],
    membersList: [],
    teamsList: [],
    myTeams: {},
    jobs: [],
    allTimeEntries: [],
    myAllTimeEntries: [],
    myteamTimeEntries: [],
    assignJobsList: [],
    myJobs: [],
    postDraftChangesJobs: [],
    holidayList: [],
    allLogs: [],
    myLogs: [],
    getAllInvoice: [],
    allReports: [],
    myAllTimeEntriesBasedOnDate: [],
    isLoading: false,
  });
  const [userDetails, setUserDetails] = useState({});
  const [userId, setUserId] = useState(localStorage.getItem("userId") ?? null);

  // main api url
  // const mainURL = "https://www.doshipms.com/api/"; // for live server & vercel both
  const mainURL = "https://doshipms-replica.neelnetworks.in/";
  // let  mainURL;
  //   if (process.env.NODE_ENV === 'development') {
  //     mainURL = "https://www.doshipms.com/api/";
  // } else {
  //     mainURL = "https://doshipms-replica.neelnetworks.in/";
  // }

  // logout function
  const logout = () => {
    if (localStorage.getItem("token")) {
      alert("Your token is Expired, Please login again!");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      navigate("/");
    }
  };

  // --------------------- FOR Single Member ---------------------------------------------------
  // getting logged in user details API
  const getUserDetails = async () => {
    try {
      const url = `${mainURL}single/member/${userId}`;
      const result = await axios.get(url, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        setUserDetails(result?.data?.member_details[0]);
      }
    } catch (e) {
      handleAPIError(e, logout);
    }
  };

  // -----------common structure for GET method api calling-----------------
  const getData = async (url, successCallback) => {
    try {
      setInitialState((prev) => ({ ...prev, isLoading: true }));
      const result = await axios.get(url, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        successCallback(result);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setInitialState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // --------------------- FOR JOB CATEGORY ---------------------------------------------------
  // getting all job categories API
  const getAllJobCategories = () => {
    const url = `${mainURL}get/all-job-type/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        jobCategories: result?.data?.job_category_list ?? [],
      }));
    });
  };

  // --------------------- FOR BILLING SERVICES ---------------------------------------------------
  // getting all billing services API
  const getAllBillingServices = () => {
    const url = `${mainURL}services/billing/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        billingServicesList: result?.data?.services_list ?? [],
      }));
    });
  };
  // getting all invoice services API
  const getAllInvoice = () => {
    const url = `${mainURL}all/invoice/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        getAllInvoice: result?.data?.invoice_list ?? [],
      }));
    });
  };

  // --------------------- FOR ALL JOBS ---------------------------------------------------
  // getting all jobs API (For Admin and Manager User Roles)
  const getAllJobs = () => {
    const url = `${mainURL}get/all-job/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        jobs: result?.data?.job_list ?? [],
      }));
    });
  };
  // getting all jobs API (For Member and Team Leader User Roles)
  const getJobsDetailsByMemberId = () => {
    const url = `${mainURL}my-jobs/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        myJobs: result?.data?.job_data ?? [],
      }));
    });
  };

  // --------------------- FOR POST DRAFT CHANGES ---------------------------------------------------
  // getting all jobs whose invoice is created API
  const getJobsForPostDraftChanges = () => {
    const url = `${mainURL}generated_invoices/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        postDraftChangesJobs: result?.data?.invoices ?? [],
      }));
    });
  };

  // --------------------- FOR ALL ASSIGN JOBS ---------------------------------------------------
  // getting all assign jobs API (For Admin and Manager User Roles)
  const getAllAssignJobs = () => {
    const url = `${mainURL}assign-jobs/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        assignJobsList: result?.data?.assign_list ?? [],
      }));
    });
  };

  // --------------------- FOR CLIENTS ---------------------------------------------------------
  // fetch all clients API
  const getAllClients = () => {
    const url = `${mainURL}/list/all-client/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        clientsList: result?.data?.client_list ?? [],
      }));
    });
  };

  // --------------------- FOR MEMBERS ---------------------------------------------------------
  // getting all members API
  const getAllMembers = () => {
    const url = `${mainURL}list/all-member/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        membersList: result?.data?.members_list ?? [],
      }));
    });
  };

  // --------------------- FOR TEAMS ---------------------------------------------------------
  // getting all teams API (For Admin and Manager User Roles)
  const getAllTeams = () => {
    const url = `${mainURL}get/team/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        teamsList: result?.data?.team_list ?? [],
      }));
    });
  };

  // getting all teams API (For Member and Team Leader User Roles)
  const getTeamDetailsByMemberId = () => {
    const url = `${mainURL}my-teams/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        myTeams: result?.data?.team_data ? result?.data?.team_data[0] : {},
      }));
    });
  };

  // --------------------- FOR ALL HOLIDAYS ---------------------------------------------------------
  // getting all holidays
  const getAllHolidays = () => {
    const url = `${mainURL}all/holiday`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        holidayList: result?.data?.holiday_list ?? [],
      }));
    });
  };

  // --------------------- FOR ALL TIME ENTRIES ---------------------------------------------------------
  // getting all time entries API for (Admin and Manager)
  const getAllTimeEntries = () => {
    const url = `${mainURL}get/all-time-entries/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        allTimeEntries: result?.data?.time_entries_data ?? [],
      }));
    });
  };

  // getting all time entries API for (Member and Team Leaders)
  const getAllMyTimeEntries = () => {
    const url = `${mainURL}get/my-time-entries/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        myAllTimeEntries: result?.data?.time_entries_data ?? [],
      }));
    });
  };

  // getting all time entries API for (Member and Team Leaders)
  const getAllMyTimeEntriesBasedOnDate = (date) => {
    const url = `${mainURL}get/my-time-entries/${userId}/${date}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        myAllTimeEntriesBasedOnDate: result?.data?.time_entries_data ?? [],
      }));
    });
  };

  // getting all time entries API for (Team Leaders)
  const getAllMyTeamTimeEntries = (teamId) => {
    if (teamId) {
      const url = `${mainURL}get/team-time-entries/${userId}/${teamId}`;
      getData(url, (result) => {
        setInitialState((prev) => ({
          ...prev,
          myteamTimeEntries: result?.data?.time_entries_data ?? [],
        }));
      });
    }
  };

  // --------------------- FOR USER LOGS ---------------------------------------------------------
  // getting all user logs API for (Admin and Manager)
  const getAllLogs = () => {
    const url = `${mainURL}login-logs/${userId}`;
    getData(url, (result) => {
      // console.log("all logs: ", result);
      setInitialState((prev) => ({
        ...prev,
        allLogs: result?.data?.logs_list ?? [],
      }));
    });
  };

  // getting my logs API for (Member and Team Leaders)
  const getMyLogs = () => {
    const url = `${mainURL}my-login-logs/${userId}`;
    getData(url, (result) => {
      // console.log("my logs: ", result);
      setInitialState((prev) => ({
        ...prev,
        myLogs: result?.data?.logs_list ?? [],
      }));
    });
  };

  // ------------------ FOR REPORT SECTION --------------------------------
  // getting all clients Report Data (Admin and Manager)
  const getAllClientsReportData = () => {
    const url = `${mainURL}reports/client-wise/${userId}`;
    getData(url, (result) => {
      setInitialState((prev) => ({
        ...prev,
        allReports: result?.data?.client_wise_reports ?? [],
      }));
    });
  };

  return (
    <ContextAPI.Provider
      value={{
        mainURL,
        nnAPIKey,
        logout,
        getUserDetails,
        getAllJobCategories,
        getAllBillingServices,
        getAllMembers,
        getAllClients,
        getAllTeams,
        getTeamDetailsByMemberId,
        initialState,
        userDetails,
        getAllJobs,
        getJobsForPostDraftChanges,
        getJobsDetailsByMemberId,
        getAllAssignJobs,
        getAllHolidays,
        getAllMyTimeEntries,
        getAllTimeEntries,
        getAllMyTeamTimeEntries,
        getAllLogs,
        getMyLogs,
        setUserId,
        getAllInvoice,
        getAllClientsReportData,
        getAllMyTimeEntriesBasedOnDate,
      }}
    >
      {children}
    </ContextAPI.Provider>
  );
};
