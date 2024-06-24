import React, { useContext, useState, useEffect } from "react";
import Calendar from "react-calendar";

import { ContextAPI } from "../../../../../Context/ApiContext/ApiContext";
import { ContextSidebarToggler } from "../../../../../Context/SidebarToggler/SidebarToggler";

import { fileIcon } from "../../../../../utils/ImportingImages/ImportingImages";
import { isGreaterThan10 } from "../../../../../utils/utilities/utilityFunctions";

import Breadcrumbs from "../../../../../templates/Breadcrumbs";
import { SpinningLoader } from "../../../../../Components/SpinningLoader/SpinningLoader";

import styles from "./AddJobEntryContent.module.css";
import ShowJobEntrySection from "./ShowJobEntrySection";
import { AddJobEntryModal } from "./AddJobEntryModel";

const breadCrumbs = [
  {
    pageName: "Home",
    pageURL: "/dashboard",
  },
  {
    pageName: "Jobs",
    pageURL: "/jobs",
  },
  {
    pageName: "Job Entry",
    pageURL: "/job-entry",
  },
];

export const timeSlots = [
  {
    id: "1",
    time: "10:00:00",
  },
  {
    id: "2",
    time: "11:00:00",
  },
  {
    id: "3",
    time: "12:00:00",
  },
  {
    id: "4",
    time: "13:00:00",
  },
  {
    id: "5",
    time: "14:00:00",
  },
  {
    id: "6",
    time: "15:00:00",
  },
  {
    id: "7",
    time: "16:00:00",
  },
  {
    id: "8",
    time: "17:00:00",
  },
  {
    id: "9",
    time: "18:00:00",
  },
  {
    id: "10",
    time: "19:00:00",
  },
  {
    id: "11",
    time: "20:00:00",
  },
];

const AddJobEntryContent = () => {
  const { sidebarClose } = useContext(ContextSidebarToggler);

  const {
    getJobsDetailsByMemberId,
    getTeamDetailsByMemberId,
    initialState,
    getAllMyTimeEntriesBasedOnDate,
  } = useContext(ContextAPI);

  const [isUpdated, setIsUpdated] = useState(false);
  const [newUpdate, setNewUpdate] = useState(false);

  const [entryDetails, setEntryDetails] = useState({
    startTime: "",
    endTime: "",
    entryDescription: "",
    job: "",
    entryAs: "",
    teamId: "",
    jobOptions: [],
    calendarDate: new Date(),
  });
  const [timeEntriesToDisplay, setTimeEntriesToDisplay] = useState([]);

  // Date Formare for DDMMYYY
  const formatDateToDDMMYYYY = (inputDate) => {
    const date = new Date(inputDate);
    const dd = isGreaterThan10(date.getDate());
    const mm = isGreaterThan10(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // showing time entries only for calendar selected date
  useEffect(() => {
    const filteredTimeEntries =
      initialState?.myAllTimeEntriesBasedOnDate?.filter(
        (entry) =>
          formatDateToDDMMYYYY(entry.working_date) ===
          formatDateToDDMMYYYY(entryDetails?.calendarDate)
      );

    setTimeEntriesToDisplay(() => filteredTimeEntries ?? []);
  }, [initialState?.myAllTimeEntriesBasedOnDate, entryDetails?.calendarDate]);

  const formatDateToYYYYMMDD = (inputDate) => {
    const date = new Date(inputDate);
    const dd = isGreaterThan10(date.getDate());
    const mm = isGreaterThan10(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  // fetching all My time entries
  useEffect(() => {
    getAllMyTimeEntriesBasedOnDate(
      formatDateToYYYYMMDD(entryDetails?.calendarDate)
    );
  }, [isUpdated, entryDetails?.calendarDate, newUpdate]);

  // fetching my jobs API && fetching all teams API
  useEffect(() => {
    getTeamDetailsByMemberId();
    getJobsDetailsByMemberId();
  }, []);

  // setting Team Id
  useEffect(() => {
    setEntryDetails((prev) => ({ ...prev, teamId: initialState?.myTeams?.id }));
  }, [initialState.myTeams]);

  // setting Job Options
  useEffect(() => {
    const settingJobsOptions = (data) => {
      if (Array.isArray(data)) {
        return data
          ?.filter((job) => job.job_status === "In Progress")
          ?.map((job) => ({
            label:
              entryDetails.entryAs === "Team" ? job.task_name : job.job_name,
            value:
              entryDetails.entryAs === "Team" ? job.task_id : job.assign_id,
          }));
      } else {
        return [];
      }
    };

    const options =
      entryDetails.entryAs === "Team"
        ? settingJobsOptions(initialState?.myTeams?.assigned_jobs) ?? []
        : entryDetails.entryAs === "Member"
        ? settingJobsOptions(initialState?.myJobs) ?? []
        : [];

    setEntryDetails((prev) => ({ ...prev, jobOptions: options }));
  }, [
    initialState?.myJobs,
    entryDetails?.entryAs,
    initialState?.myTeams?.assigned_jobs,
  ]);

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      <section className="main-content_header">
        <div className="d-flex justify-content-start align-items-center page-heading w-100 custom-border-bottom">
          <img src={fileIcon} alt="add job entry" />
          <p className="m-0 fs-4">Add Job Entry</p>
        </div>
      </section>

      <section className="main-content_form-section d-flex flex-column gap-3">
        <div className="gap-5 d-flex align-items-start m-auto">
          <div className="width-40 mt-5">
            <Calendar
              className={`${styles.reactCalendar} ${styles.customReactCalendar}`}
              maxDate={new Date()}
              value={entryDetails.calendarDate}
              onChange={(date) => {
                setEntryDetails((prev) => ({ ...prev, calendarDate: date }));
              }}
            />
          </div>

          <div
            className="mt-5"
            style={{
              background: "#e0fbfc",
              borderRadius: "10px",
              boxShadow: "1px 2px 4px gray",
              width: "100%",
              padding: "20px 20px",
            }}
          >
            <div className="d-flex justify-content-between my-3">
              <h3 style={{ color: "#00263d" }}>
                {formatDateToDDMMYYYY(entryDetails?.calendarDate)}
              </h3>

              <p>
                <span className="fs-5"> Total Working Hours : </span>
                <span className="fw-bold fs-5">
                  {timeEntriesToDisplay[0]?.total_time_for_days
                    ? timeEntriesToDisplay[0]?.total_time_for_days
                    : "0"}
                </span>
              </p>
              <AddJobEntryModal
                setNewUpdate={setNewUpdate}
                entryDetails={entryDetails}
                setIsUpdated={setIsUpdated}
              />
            </div>

            <div
              style={{
                overflowY: "auto",
                maxHeight: "60vh",
              }}
            >
              {!initialState?.isLoading ? (
                timeEntriesToDisplay.length > 0 ? (
                  timeEntriesToDisplay.map((entry, i) => {
                    return (
                      <React.Fragment key={entry.entries_id}>
                        <ShowJobEntrySection
                          timeEntriesToDisplay={entry}
                          previousTimeEntry={
                            timeEntriesToDisplay[i - 1]?.work_end_time
                          }
                          setIsUpdated={setIsUpdated}
                          setNewUpdate={setNewUpdate}
                        />
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td>
                      <div className={styles.entries}>
                        <p className="m-0">
                          No Time Entries found on
                          <span className="mx-1">
                            {formatDateToDDMMYYYY(entryDetails?.calendarDate)}
                          </span>
                        </p>
                      </div>
                    </td>
                  </tr>
                )
              ) : (
                <div
                  style={{
                    background: "#00263d",
                    width: "fit-content",
                    padding: "5px",
                  }}
                >
                  <SpinningLoader />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddJobEntryContent;
