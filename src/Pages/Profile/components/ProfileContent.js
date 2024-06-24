import React, { useContext, useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Select from "react-select";

import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../../templates/Breadcrumbs";
import { UpdatePasswordModal } from "./UpdatePasswordModal";

import styles from "./ProfileContent.module.css";

import { userIcon1 } from "../../../utils/ImportingImages/ImportingImages";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import {
  formatDateToYYYYMMDD,
  userRole,
} from "../../../utils/utilities/utilityFunctions";

const ProfileContent = () => {
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const {
    initialState,
    getAllMyTimeEntries,
    getAllTimeEntries,
    getAllJobs,
    getJobsDetailsByMemberId,
    userDetails,
  } = useContext(ContextAPI);

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Profile",
      pageURL: "/profile",
    },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const [timeEntries, setTimeEntries] = useState({
    entries: [],
    date: {
      date: dayjs(new Date()),
      dateString: formatDateToYYYYMMDD(new Date()),
    },
  });
  const [profileDetails, setProfileDetails] = useState({
    name: userDetails?.member_name ?? "",
    email: userDetails?.member_email ?? "",
    role: userRole(userDetails?.member_role),
    registrationDate: userDetails?.registered_on ?? "",
  });

  const [projectDetails, setProjectDetails] = useState([]);

  // Fetching Time Entries based upon user role
  useEffect(() => {
    if (
      userDetails?.member_role === "members" ||
      userDetails?.member_role === "team_leaders,members"
    ) {
      getAllMyTimeEntries();
      getJobsDetailsByMemberId();
    }
  }, [userDetails.member_role]);

  // setting time entries
  const extractTimeEntries = (data) => {
    const entries = data?.filter(
      (entry) => entry.working_date === timeEntries?.date?.dateString
    );

    setTimeEntries((prev) => ({
      ...prev,
      entries: entries ?? [],
    }));
  };

  // fetching all My time entries if user is Member or Team Leader
  useEffect(() => {
    if (
      userDetails?.member_role === "members" ||
      userDetails?.member_role === "team_leaders,members"
    ) {
      extractTimeEntries(initialState?.myAllTimeEntries);
    }
  }, [initialState.myAllTimeEntries, timeEntries.date]);

  // setting Jobs if user role is Member or Team Leader
  useEffect(() => {
    if (
      userDetails?.member_role === "members" ||
      userDetails?.member_role === "team_leaders,members"
    ) {
      setProjectDetails(initialState?.myJobs);
    }
  }, [initialState.myJobs]);

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      <section className="main-content_header add-border-bottom custom-border-bottom">
        <div className="d-flex justify-content-center align-items-center page-heading">
          <img src={userIcon1} alt="members" />
          <p className="m-0 fs-4">Profile</p>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <UpdatePasswordModal />
        </div>
      </section>

      <section className="main-content_form-section gap-5 d-flex justify-content-center align-items-start w-75 m-auto pt-5">
        <form className="w-50 relative-wrapper zIndex-2">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              name="name"
              placeholder="Eg: Raj Shah"
              type="text"
              required
              value={profileDetails?.name}
              //   onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="email">Email Id:</label>
            <input
              id="email"
              name="email"
              placeholder="Eg: rajshah@gmail.com"
              type="email"
              required
              value={profileDetails?.email}
              //   onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="role">Role:</label>
            <input
              id="role"
              name="role"
              placeholder="Eg: Admin"
              type="text"
              required
              value={profileDetails?.role}
              //   onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="registrationDate">Date of Registration:</label>
            <DatePicker
              name="registrationDate"
              className="form-control datepicker"
              // onChange={onChange}
              value={dayjs(profileDetails?.registrationDate.slice(0, 10))}
              disabled
            />
          </div>
          <button type="submit" className="mt-4 custom-btn">
            {isLoading ? <SpinningLoader /> : "Update"}
          </button>
        </form>

        {userDetails?.member_role === "members" ||
        userDetails?.member_role === "team_leaders,members" ? (
          <div className="w-50 d-flex flex-column gap-3 zIndex-2">
            {/* Project Details Section */}
            <div className={`${styles.detailsWrapper}`}>
              <div
                className={`${styles.detailsHeader} d-flex justify-content-between align-items-center`}
              >
                <p className={`${styles.title} mb-2`}>Project Details: </p>
              </div>
              <div className={styles.projectDetailsContentWrapper}>
                {projectDetails?.length > 0 ? (
                  projectDetails?.map((project, index) => (
                    <div key={index} className={styles.projectDetailsContent}>
                      <p className="m-0">{project.job_name}:</p>
                      <p className="m-0">{project.job_description}</p>
                    </div>
                  ))
                ) : (
                  <p className={`${styles.title} m-0`}>
                    No Projects available!
                  </p>
                )}
              </div>
            </div>
            {/* Time Entries Section */}
            <div className={`${styles.detailsWrapper}`}>
              <div
                className={`${styles.detailsHeader} d-flex justify-content-between align-items-center`}
              >
                <p className={styles.title}>Time Entries: </p>
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <p className={styles.title}>Date: </p>
                  <DatePicker
                    className="form-control datepicker time-entries"
                    onChange={(date, dateString) =>
                      setTimeEntries((prev) => ({
                        ...prev,
                        date: { date, dateString },
                      }))
                    }
                    allowClear={true}
                    value={timeEntries?.date?.date}
                    name="date"
                    disabledDate={(current) => new Date() < new Date(current)}
                  />
                </div>
              </div>
              <div className={styles.projectDetailsContentWrapper}>
                {timeEntries?.entries?.length > 0 ? (
                  timeEntries?.entries?.map((entry, index) => {
                    return (
                      <div key={index} className={styles.projectDetailsContent}>
                        <p className="m-0">
                          {entry.member_name} <span>({entry.task_name})</span>
                        </p>
                        <p className="m-0">
                          Description: {entry.work_description}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className={`m-0`}>
                    No Time Entries available for present date!
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </section>
    </div>
  );
};

export default ProfileContent;
