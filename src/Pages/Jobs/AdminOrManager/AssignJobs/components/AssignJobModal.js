import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { DatePicker } from "antd";
import Select from "react-select";

import { projectsIcon } from "../../../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../../../Context/ApiContext/ApiContext";
import {
  handleAPIError,
  headerOptions,
  presentDate,
} from "../../../../../utils/utilities/utilityFunctions";
import { ReactHotToast } from "../../../../../Components/ReactHotToast/ReactHotToast";
import moment from "moment";

const MyVerticallyCenteredModal = (props) => {
  const {
    getAllJobs,
    getAllMembers,
    getAllTeams,
    getAllBillingServices,
    initialState,
    mainURL,
    logout,
  } = useContext(ContextAPI);

  const [isLoading, setIsLoading] = useState(false);
  const [assignJobDetails, setAssignJobDetails] = useState({
    jobSelected: "",
    onGoingJob: "",
    schedulerJobName: "",
    ongoingJobFrequency: "",
    billingServiceSelected: "",
    billingRate: {
      additional_data: {
        billing_rates: "",
      },
    },

    jobAssignedTo: "",
    assignJobTo: "",
    jobDescription: "",
    jobStartDate: "",
    schedulerEndsOn: "",
    jobEndDate: "",
  });

  const [options, setOptions] = useState({
    jobOptions: [],
    membersOptions: [],
    teamOptions: [],
    billingServicesOptions: [],
    onGoingJobOptions: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    onGoingJobFrequencyOptions: [
      { label: "1 day", value: "1" },
      { label: "7 days", value: "7" },
      { label: "15 days", value: "15" },
      { label: "1 month", value: "30" },
    ],
  });

  useEffect(() => {
    getAllJobs();
    getAllMembers();
    getAllTeams();
    getAllBillingServices();
  }, []);

  // setting Dropdown Options for Jobs, Members List & Teams List
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      jobOptions: initialState.jobs
        .filter(
          (job) =>
            job.job_status !== "Completed" && job.job_status !== "On Hold"
        )
        .map(({ job_name, job_id, bpo_no, additional_data }) => {
          const billingRates = JSON.parse(additional_data).billing_rates;
          return {
            label: `(${bpo_no}) ${job_name}  `,
            value: `${job_id} - Billing Rate: ${billingRates}`,
          };
        }),

      // setOptions((prev) => ({
      //   ...prev,
      //   jobOptions: initialState.jobs.map(({ job_name, job_id, bpo_no }) => ({
      //     label: `${job_name} (${bpo_no})`,
      //     value: job_id,
      //   })),
      membersOptions: initialState.membersList
        .filter(
          (member) =>
            (member.member_role === "members" ||
              member.member_role === "team_leaders,members") &&
            member.current_status === "active"
        )
        .map(({ member_id, member_name }) => ({
          label: member_name,
          value: member_id,
        })),
      teamOptions: initialState.teamsList
        .filter((team) => team.status === "active")
        .map(({ id, team_name }) => ({
          label: team_name,
          value: id,
        })),
      billingServicesOptions: initialState.billingServicesList
        .filter(({ service_status }) => service_status === "active")
        .map(({ services_name, services_id }) => ({
          label: services_name,
          value: services_id,
        })),
    }));
  }, [
    initialState.jobs,
    initialState.membersList,
    initialState.teamsList,
    initialState.billingServicesList,
  ]);

  // const handleDropDown = (dropDown, option) => {
  //   setAssignJobDetails((prev) => ({
  //     ...prev,
  //     [dropDown]: option,
  //   }));
  // };
  const handleDropDown = (dropDown, option) => {
    setAssignJobDetails((prev) => ({
      ...prev,
      [dropDown]: option,
    }));

    // Add a conditional check for job name
    if (dropDown === "jobSelected") {
      const selectedJobName = option.value;
      const billingRateMatch = selectedJobName.match(/Billing Rate: (\d+)/);

      if (billingRateMatch) {
        // Set the billing rate as per your requirement
        const billingRate = billingRateMatch[1];
        setAssignJobDetails((prev) => ({
          ...prev,
          billingRate: billingRate,
        }));
      } else {
        // Reset the billing rate to an empty string or any default value
        setAssignJobDetails((prev) => ({
          ...prev,
          billingRate: "",
        }));
      }
    }
  };

  const handleAssignTo = (item) => {
    setAssignJobDetails((prev) => ({ ...prev, jobAssignedTo: item }));
  };
  const handleAssignee = (e) => {
    setAssignJobDetails((prev) => ({
      ...prev,
      assignJobTo: e.target.value,
      jobAssignedTo: "",
    }));
  };

  const onChangeDate = (element, date, dateString) => {
    setAssignJobDetails((prev) => ({
      ...prev,
      [element]: { date, dateString },
    }));
  };
  const schedulerEndsOnonChangeDate = (element, date, dateString) => {
    setAssignJobDetails((prev) => ({
      ...prev,
      [element]: { date, dateString },
    }));
  };

  const handleClear = () => {
    setAssignJobDetails(() => ({
      jobSelected: "",
      billingServiceSelected: "",
      billingRate: "",
      jobAssignedTo: "",
      assignJobTo: "",
      jobDescription: "",
      schedulerEndsOn: {
        date: "",
        dateString: "",
      },
      jobStartDate: {
        date: "",
        dateString: "",
      },
      jobEndDate: {
        date: "",
        dateString: "",
      },
    }));
  };

  const isJobOngoing = assignJobDetails.onGoingJob?.value;

  const jobAssigneeCondition =
    (isJobOngoing === "no" && assignJobDetails.assignJobTo !== "") ||
    isJobOngoing === "yes";

  // for assigning a job api
  const assignJob = async () => {
    setIsLoading(() => true);
    try {
      let body = {
        current_user: localStorage.getItem("userId") ?? null,
        job_id: assignJobDetails.jobSelected.value,
        job_description: assignJobDetails.jobDescription,
        billing_services: assignJobDetails.billingServiceSelected.value,
        billing_rates: assignJobDetails.billingRate,
      };

      if (isJobOngoing === "yes") {
        body.team_id = assignJobDetails.jobAssignedTo?.value;
        body.scheduler_name = assignJobDetails.schedulerJobName;
        body.recurrence_days = assignJobDetails.ongoingJobFrequency?.value;
        body.scheduler_ends_on = assignJobDetails.schedulerEndsOn.dateString;
      } else {
        body.assigned_on = assignJobDetails.jobStartDate.dateString;
        body.due_date = assignJobDetails.jobEndDate.dateString;
        body.assign_to = assignJobDetails.assignJobTo;

        if (assignJobDetails.assignJobTo === "Team") {
          body.team_id = assignJobDetails.jobAssignedTo.value;
        } else {
          body.recipient_id = assignJobDetails.jobAssignedTo.value;
        }
      }

      const url =
        isJobOngoing === "yes"
          ? `${mainURL}assign/recurrence-job`
          : `${mainURL}assign/job`;

      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 200 || result.status === 201) {
        ReactHotToast(result.data.message, "success");
        handleClear();
        props.setIsUpdated((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
      props.onHide();
    }
  };

  const handleAssignJob = (e) => {
    e.preventDefault();

    const {
      jobSelected,
      onGoingJob,
      jobAssignedTo,
      assignJobTo,
      jobDescription,
      jobStartDate,
      schedulerEndsOn,
      jobEndDate,
      billingServiceSelected,
      billingRate,
      ongoingJobFrequency,
    } = assignJobDetails;

    let bool = [
      jobSelected,
      jobAssignedTo,
      jobDescription,
      billingRate,
      billingServiceSelected?.value,
    ];

    if (isJobOngoing === "yes") {
      bool = [...bool, onGoingJob];
    } else {
      bool = [...bool, jobStartDate, jobEndDate, assignJobTo];
    }

    const checkConditions = () => {
      return bool.every(Boolean);
    };

    if (checkConditions()) {
      assignJob();
    } else {
      const conditions = {
        [isJobOngoing === "no" && !jobEndDate]: "Please provide Job due date!",
        [isJobOngoing === "no" && !jobStartDate]:
          "Please provide Job start date!",
        [!jobDescription]: "Please provide Job description!",
        [!billingRate]: "Please provide billing rate!",
        [!billingServiceSelected.value]: "Please select a billing service!",
        [!jobAssignedTo]: "Please select a assignee!",
        [isJobOngoing === "yes" && !ongoingJobFrequency]:
          "Please select ongoing job frequency!",
        [!onGoingJob.value]: "Please select ongoing bookkeeping job type!",
        [!jobSelected]: "Please select a Job!",
      };

      const errorMessage = conditions[true];

      if (errorMessage) {
        ReactHotToast(errorMessage, "error");
      }
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="pt-3 pb-1" closeButton>
        <Modal.Title className="w-100" id="contained-modal-title-vcenter">
          <div className="d-flex justify-content-center align-items-center gap-3">
            <img src={projectsIcon} height={20} width={20} alt="user-icon" />
            <span className="modal-title">Assign Job</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleAssignJob}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          {/* Job Name */}
          <div className="form-group mt-3 w-100">
            <label htmlFor="jobType">Select Job:</label>
            <Select
              name="jobType"
              closeMenuOnSelect={true}
              options={options.jobOptions}
              onChange={(option) => handleDropDown("jobSelected", option)}
              value={assignJobDetails.jobSelected}
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
            />
          </div>

          {/* Ongoing Bookkeeping Job Type */}
          <div className="form-group mt-3 w-100">
            <label htmlFor="onGoingJob">Ongoing Bookkeeping Job Type:</label>
            <Select
              name="onGoingJob"
              closeMenuOnSelect={true}
              options={options.onGoingJobOptions}
              onChange={(option) => handleDropDown("onGoingJob", option)}
              value={assignJobDetails.onGoingJob}
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
            />
          </div>

          {isJobOngoing && (
            <>
              {/* Scheduler Name & Ongoing Job Frequency */}
              {isJobOngoing === "yes" && (
                <>
                  <div className="form-group mt-3 w-100">
                    <label htmlFor="startDate">Scheduler Ends On</label>
                    <DatePicker
                      className="form-control datepicker"
                      popupClassName="pop-up-box"
                      onChange={(date, dateString) =>
                        schedulerEndsOnonChangeDate(
                          "schedulerEndsOn",
                          date,
                          dateString
                        )
                      }
                      value={assignJobDetails.schedulerEndsOn.date}
                      name="startDate"
                      placeholder="Select / Enter date in YYYY-MM-DD format"
                      disabledDate={(current) => current && current < moment().startOf("day")}
                    />
                  </div>
                  <div className="form-group mt-3 w-100">
                    <label className="schedulerJobName" htmlFor="name">
                      Scheduler Job Name:
                    </label>
                    <input
                      id="schedulerJobName"
                      name="schedulerJobName"
                      placeholder="Eg: Neel Networks ITR Filing - Ongoing Job"
                      type="text"
                      required
                      onChange={(e) =>
                        setAssignJobDetails((prev) => ({
                          ...prev,
                          schedulerJobName: e.target.value,
                        }))
                      }
                      value={assignJobDetails.schedulerJobName}
                    />
                  </div>

                  <div className="form-group mt-3 w-100">
                    <label htmlFor="ongoingJobFrequency">
                      Ongoing Bookkeeping Job Frequency:
                    </label>
                    <Select
                      name="ongoingJobFrequency"
                      closeMenuOnSelect={true}
                      options={options.onGoingJobFrequencyOptions}
                      onChange={(option) =>
                        handleDropDown("ongoingJobFrequency", option)
                      }
                      value={assignJobDetails.ongoingJobFrequency}
                      className="react-select-custom-styling__container"
                      classNamePrefix="react-select-custom-styling"
                    />
                  </div>
                </>
              )}

              {/* Assignee */}
              <div className="d-flex mt-3 justify-content-between align-items-center w-100 gap-3">
                {isJobOngoing === "no" && (
                  <div className="form-group flex-1">
                    <label htmlFor="assignee-radio-group">Assignee:</label>
                    <div
                      name="assignee-radio-group"
                      className="radio-group mt-2 d-flex justify-content-start"
                    >
                      <label htmlFor="Individual">
                        <input
                          type="radio"
                          id="Individual"
                          value="Individual"
                          name="assignee"
                          className="radio-btn"
                          checked={
                            assignJobDetails.assignJobTo === "Individual"
                          }
                          onChange={(e) => handleAssignee(e)}
                        />
                        <span>Member</span>
                      </label>
                      <label htmlFor="Team">
                        <input
                          type="radio"
                          id="Team"
                          value="Team"
                          name="assignee"
                          className="radio-btn"
                          checked={assignJobDetails.assignJobTo === "Team"}
                          onChange={(e) => handleAssignee(e)}
                        />
                        <span>Team</span>
                      </label>
                    </div>
                  </div>
                )}

                {jobAssigneeCondition && (
                  <div
                    className={`form-group flex-2 ${
                      isJobOngoing === "no" && "mt-2"
                    }`}
                  >
                    <label htmlFor="assignType">
                      Select{" "}
                      {assignJobDetails.assignJobTo === "Team" ||
                      isJobOngoing === "yes"
                        ? "Team"
                        : "Member"}
                      :
                    </label>
                    <Select
                      name="assignType"
                      closeMenuOnSelect={true}
                      options={
                        assignJobDetails.assignJobTo === "Team" ||
                        isJobOngoing === "yes"
                          ? options.teamOptions
                          : options.membersOptions
                      }
                      onChange={(item) => handleAssignTo(item)}
                      value={assignJobDetails.jobAssignedTo}
                      className="react-select-custom-styling__container"
                      classNamePrefix="react-select-custom-styling"
                    />
                  </div>
                )}
              </div>

              {/* Billing Service */}
              <div className="form-group mt-3 w-100">
                <label htmlFor="billingService">Billing Service:</label>
                <Select
                  name="billingService"
                  closeMenuOnSelect={true}
                  options={options.billingServicesOptions}
                  onChange={(option) =>
                    handleDropDown("billingServiceSelected", option)
                  }
                  value={assignJobDetails.billingServiceSelected}
                  className="react-select-custom-styling__container"
                  classNamePrefix="react-select-custom-styling"
                />
              </div>

              {/* Billing Rate */}
              {/* Billing Rate */}
              <div className="form-group mt-3 w-100">
                <label htmlFor="billingRate">Billing Rate (per hr):</label>
                <input
                  id="billingRate"
                  name="billingRate"
                  placeholder="Eg: 999"
                  type="number"
                  required
                  onChange={(e) =>
                    setAssignJobDetails((prev) => ({
                      ...prev,
                      billingRate: e.target.value,
                    }))
                  }
                  value={assignJobDetails.billingRate}
                />
              </div>

              {/* <div className="form-group mt-3 w-100">
                <label htmlFor="billingRate">Billing Rate (per hr):</label>
                <input
                  id="billingRate"
                  name="billingRate"
                  placeholder="Eg: 999"
                  type="number"
                  required
                  onChange={(e) =>
                    setAssignJobDetails((prev) => ({
                      ...prev,
                      billingRate: e.target.value,
                    }))
                  }
                  value={assignJobDetails.billingRate}
                />
              </div> */}

              {/* Job Description */}
              <div className="form-group mt-3 w-100">
                <label htmlFor="jobDescription">Job Description:</label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  className="w-100"
                  rows={3}
                  placeholder="Eg. Auditing Report (2022/23 Financial Year) for Doshi Accounting Company"
                  value={assignJobDetails.jobDescription}
                  onChange={(e) =>
                    setAssignJobDetails((prev) => ({
                      ...prev,
                      jobDescription: e.target.value,
                    }))
                  }
                />
              </div>

              {isJobOngoing === "no" && (
                <>
                  {/* Start Date */}
                  <div className="form-group mt-3 w-100">
                    <label htmlFor="startDate">
                      Processing Period Start Date:
                    </label>
                    <DatePicker
                      className="form-control datepicker"
                      popupClassName="pop-up-box"
                      onChange={(date, dateString) =>
                        onChangeDate("jobStartDate", date, dateString)
                      }
                      value={assignJobDetails.jobStartDate.date}
                      name="startDate"
                      placeholder="Select / Enter date in YYYY-MM-DD format"
                      disabledDate={(current) => current && current < moment().startOf("day")}
                    />
                    
                  </div>

                  {/* End Date */}
                  <div className="form-group mt-3 w-100">
                    <label htmlFor="startDate">
                      Processing Period End Date:
                    </label>
                    <DatePicker
                      className="form-control datepicker"
                      popupClassName="pop-up-box"
                      onChange={(date, dateString) =>
                        onChangeDate("jobEndDate", date, dateString)
                      }
                      value={assignJobDetails.jobEndDate.date}
                      name="startDate"
                      placeholder="Select / Enter date in YYYY-MM-DD format"
                      disabledDate={(current) => current && current < moment().startOf("day")}
                    />
                  </div>
                </>
              )}
            </>
          )}

          <button type="submit" className="custom-btn mt-3">
            {isLoading ? <SpinningLoader /> : "Assign Job"}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const AssignJobModal = ({ setIsUpdated }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        <button className="custom-btn d-flex justify-content-center align-items-center gap-2">
          Assign Job <span className="fw-light fs-4">+</span>
        </button>
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setIsUpdated={setIsUpdated}
      />
    </>
  );
};
