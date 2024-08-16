import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { DatePicker } from "antd";
import dayjs from "dayjs";

import { projectsIcon } from "../../../../../utils/ImportingImages/ImportingImages";

import { SpinningLoader } from "../../../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../../../Context/ApiContext/ApiContext";
import {
  headerOptions,
  handleAPIError,
} from "../../../../../utils/utilities/utilityFunctions";
import { formatDateToYYYYMMDD } from "../../../../../utils/utilities/utilityFunctions";
import { ReactHotToast } from "../../../../../Components/ReactHotToast/ReactHotToast";
import TimePickerSection from "./TimePickerSection";

const MyVerticallyCenteredModal = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showBillableForm, setShowBillableForm] = useState(false);
  const [showsideWorkForm, setShowsideWorkForm] = useState(false);
  const [showPostDraftChangesForm, setShowPostDraftChangesForm] =
    useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  // Data Getting From Contex API
  const {
    mainURL,
    logout,
    getJobsDetailsByMemberId,
    getTeamDetailsByMemberId,
    initialState,
    getJobsForPostDraftChanges,
  } = useContext(ContextAPI);

  // declared States here :-
  const [entryDetails, setEntryDetails] = useState({
    startTime: "",
    endTime: "",
    entryDescription: "",
    job: null, // Changed to null to handle Select default value better
    bpoNo: null,
    bpoNoOptions:[],
    entryAs: "",
    teamId: "",
    jobOptions: [],
 
    calendarDate: new Date(),
  });

  // fetching my jobs API && fetching all teams API
  useEffect(() => {
    getTeamDetailsByMemberId();
    getJobsDetailsByMemberId();
    getJobsForPostDraftChanges();
  }, []);

  // setting Team Id
  useEffect(() => {
    setEntryDetails((prev) => ({ ...prev, teamId: initialState?.myTeams?.id }));
  }, [initialState.myTeams]);



  useEffect(() => {
    const settingBPOOptions = (data) => {
        if (Array.isArray(data)) {
            return data
                .filter((job) => job.bpo_no)
                .map((job) => ({
                    label: job.bpo_no,
                    value: job.bpo_no,
                }));
        } else {
            return [];
        }
    };

    const bpoOptions =
        entryDetails.entryAs === "Team"
            ? settingBPOOptions(initialState?.myTeams?.assigned_jobs) ?? []
            : entryDetails.entryAs === "Member"
            ? settingBPOOptions(initialState?.myJobs) ?? []
            : [];

    setEntryDetails((prev) => ({ ...prev, bpoNoOptions: bpoOptions }));
}, [initialState?.myJobs, initialState?.myTeams?.assigned_jobs, entryDetails.entryAs]);

// setting Job Options
useEffect(() => {
    const settingJobsOptions = (data, selectedBPO) => {
        if (Array.isArray(data)) {
            return data
                .filter((job) => job.bpo_no === selectedBPO && job.job_status === "In Progress")
                .map((job) => ({
                    label: `${entryDetails.entryAs === "Team" ? job.task_name : job.job_name} (Period start date: ${job.assigned_on}, Period end date: ${job.due_on})`,
                    value: entryDetails.entryAs === "Team" ? job.task_id : job.assign_id,
                }));
        } else {
            return [];
        }
    };

    const jobOptions =
        entryDetails.entryAs === "Team"
            ? settingJobsOptions(initialState?.myTeams?.assigned_jobs, entryDetails.bpoNo) ?? []
            : entryDetails.entryAs === "Member"
            ? settingJobsOptions(initialState?.myJobs, entryDetails.bpoNo) ?? []
            : [];

    setEntryDetails((prev) => ({ ...prev, jobOptions }));

   
      const filterJobs = (data, type) => {
        if (Array.isArray(data)) {
          return data
            .filter(job => job.assign_as === type)
            .map(job => ({
              label: `${job.job_name} (Period start date: ${job.assigned_on}, Period end date: ${job.due_on})`,
              value: job.assign_id,
            }));
        }
        return [];
      };
      
    
       
      const postDraftJobOptions =
        entryDetails.entryAs === "Team"
          ? filterJobs(initialState?.postDraftChangesJobs, "Team")
          : entryDetails.entryAs === "Member"
          ? filterJobs(initialState?.postDraftChangesJobs, "Individual")
          : [];

      setEntryDetails(prev => ({ ...prev, jobOptions: postDraftJobOptions }));

      if (showPostDraftChangesForm) {
        setEntryDetails((prev) => ({ ...prev, jobOptions: postDraftJobOptions }));
        console.log("postDraftJobOptions",postDraftJobOptions)
      } else {
        setEntryDetails((prev) => ({ ...prev, jobOptions}));
      }
    

  }, [initialState?.myJobs, initialState?.myTeams?.assigned_jobs, entryDetails.entryAs, entryDetails.bpoNo, initialState?.postDraftChangesJobs, showPostDraftChangesForm]);

console.log("initialState?.postDraftChangesJobs",initialState?.postDraftChangesJobs)
  // setting Job Options
  // useEffect(() => {
  //   const settingJobsOptions = (data) => {
  //     if (Array.isArray(data)) {
  //       return data
  //         .filter((job) => job.job_status === "In Progress")
  //         .map((job) => ({
  //           label: `${entryDetails.entryAs === "Team" ? job.task_name : job.job_name} (Period start date: ${job.assigned_on}, Period end date: ${job.due_on})`,
  //           value: entryDetails.entryAs === "Team" ? job.task_id : job.assign_id,
  //         }));
  //     } else {
  //       return [];
  //     }
  //   };

  //   const settingJobsCodeOptions = (data) => {
  //     if (Array.isArray(data)) {
  //       return data
  //         .filter((job) => job.job_status === "In Progress")
  //         .map((job) => ({
  //           label: `${entryDetails.entryAs === "Team" ? job.bpo_no : job.bpo_no}`,
  //           value: entryDetails.entryAs === "Team" ? job.task_id : job.assign_id,
  //         }));
  //     } else {
  //       return [];
  //     }
  //   };
  //    const filterJobs = (data, type) => {
  //         if (Array.isArray(data)) {
  //           console.log("job.assign_as",data)
  //           return data
    
            
  //             ?.filter((job) => job.assign_as === type)
            
  //             // ?.map((job) => ({ label: job.job_name, value: job.assign_id }));
              
  //             .map((job) => ({
  //               label: `${job.job_name} (Period start date: ${job.assigned_on}, Period end date: ${job.due_on})`,
  //               value: job.assign_id,
                
  //             }));
    
              
  //         } else {
  //           return [];
  //         }
  //       };

  //   const options =
  //     entryDetails.entryAs === "Team"
  //       ? settingJobsOptions(initialState?.myTeams?.assigned_jobs) ?? []
  //       : entryDetails.entryAs === "Member"
  //       ? settingJobsOptions(initialState?.myJobs) ?? []
  //       : [];

  //   const jobCodeOption =
  //     entryDetails.entryAs === "Team"
  //       ? settingJobsCodeOptions(initialState?.myTeams?.assigned_jobs) ?? []
  //       : entryDetails.entryAs === "Member"
  //       ? settingJobsCodeOptions(initialState?.myJobs) ?? []
  //       : [];

  //   if (showPostDraftChangesForm) {
  //     const postDraftJobOptions =
  //       entryDetails.entryAs === "Team"
  //         ? filterJobs(entryDetails.jobCode?.value)
  //         : entryDetails.entryAs === "Member"
  //         ? filterJobs(entryDetails.jobCode?.value)
  //         : [];
  //     setEntryDetails((prev) => ({ ...prev, jobOptions: postDraftJobOptions }));
  //   } else {
  //     setEntryDetails((prev) => ({ ...prev, jobOptions: options, bpoNoOptions: jobCodeOption }));
  //   }
  // }, [
  //   initialState?.myJobs,
  //   entryDetails?.entryAs,
  //   initialState?.myTeams?.assigned_jobs,
  //   initialState.postDraftChangesJobs,
  //   entryDetails?.jobCode,
  //   showPostDraftChangesForm,
  // ]);

  console.log(JSON.stringify(initialState?.myTeams?.assigned_jobs),"initialState?.myTeams?.assigned_jobs")
  // useEffect(() => {
  //   const settingJobsOptions = (data) => {
  //     if (Array.isArray(data)) {
  //       return data
  //         ?.filter((job) => job.job_status === "In Progress")
  //         ?.map((job) => ({
  //           // label:
  //           //   entryDetails.entryAs === "Team" ? job.task_name : job.job_name,
  //           label: `${entryDetails.entryAs === "Team" ? job.task_name : job.job_name} (Period start date: ${job.assigned_on}, Period end date: ${job.due_on})`,
  //            value:
  //             entryDetails.entryAs === "Team" ? job.task_id : job.assign_id,
  //         }));
  //     } else {
  //       return [];
  //     }
  //   };

  //   const filterJobs = (data, type) => {
  //     if (Array.isArray(data)) {
  //       console.log("job.assign_as",data)
  //       return data

        
  //         ?.filter((job) => job.assign_as === type)
        
  //         // ?.map((job) => ({ label: job.job_name, value: job.assign_id }));
          
  //         .map((job) => ({
  //           label: `${job.job_name} (Period start date: ${job.assigned_on}, Period end date: ${job.due_on})`,
  //           value: job.assign_id,
            
  //         }));

          
  //     } else {
  //       return [];
  //     }
  //   };



  //   console.log(initialState?.postDraftChangesJobs,"initialState?.postDraftChangesJobs")
  //   // const filterJobs = (data, type) => {
  //   //   if (Array.isArray(data)) {
  //   //     return data
  //   //       .filter((job) => {
  //   //         console.log("Job Object:", job);
  //   //         console.log("Job Assign As:", job.assign_as);
  //   //         return job.assign_as === type;
  //   //       })
  //   //       .map((job) => ({
  //   //         label: `${entryDetails.entryAs === "Team" ? job.job_name : ""} ( Period start date: ${job.assigned_on}, Period end date: ${job.due_on})`,
  //   //         value: job.assign_id,
  //   //       }));
  //   //   } else {
  //   //     return [];
  //   //   }
  //   // };

  //   const options =
  //     entryDetails.entryAs === "Team"
  //       ? settingJobsOptions(initialState?.myTeams?.assigned_jobs) ?? []
  //       : entryDetails.entryAs === "Member"
  //       ? settingJobsOptions(initialState?.myJobs) ?? []
  //       : [];

  //   const postDraftJobOptions =
  //     entryDetails.entryAs === "Team"
  //       ? filterJobs(initialState?.postDraftChangesJobs, "Team")
  //       : entryDetails.entryAs === "Member"
  //       ? filterJobs(initialState?.postDraftChangesJobs, "Individual")
  //       : [];

  //   if (showPostDraftChangesForm) {
  //     setEntryDetails((prev) => ({ ...prev, jobOptions: postDraftJobOptions }));
  //     console.log("postDraftJobOptions",postDraftJobOptions)
  //   } else {
  //     setEntryDetails((prev) => ({ ...prev, jobOptions: options }));
  //   }
  // }, [
  //   initialState?.myJobs,
  //   entryDetails?.entryAs,
  //   initialState?.myTeams?.assigned_jobs,
  //   initialState.postDraftChangesJobs,
  //   showPostDraftChangesForm,
  // ]);
// console.log("initialState?.myTeams",initialState.myTeams)
  // helper function for selecting the Entry as radio group - Entry as an Individual or Entry as a Team
  const handleEntryAs = (e) => {
    setEntryDetails((prev) => ({ ...prev, entryAs: e.target.value, job: "" }));
  };

  // Resetting the whole state
  const handleClear = () => {
    setEntryDetails((prev) => ({
      ...prev,
      entryDescription: "",
      job: "",
      entryAs: "",
      startTime: "",
      endTime: "",
    }));
  };

  // for adding a new entry api
  const addNewEntry = async () => {
    try {
      setIsLoading(true);
      let body = {
        current_user: localStorage.getItem("userId") ?? null,
        entries_as: entryDetails?.entryAs,
        work_start_time: entryDetails?.startTime?.value,
        work_end_time: entryDetails?.endTime?.value,
        working_date: formatDateToYYYYMMDD(props?.entryDetails?.calendarDate),
        work_description: entryDetails?.entryDescription,
      };

      if (showBillableForm || showPostDraftChangesForm) {
        body.task_id = +entryDetails?.job?.value;
      }
      if (showPostDraftChangesForm) {
        body.post_draft = "yes";
      }
      if (entryDetails?.entryAs === "Team") {
        body.team_id = entryDetails.teamId;
      }

      const url =
        showBillableForm || showPostDraftChangesForm
          ? `${mainURL}add/billable_hours/time-entries`
          : `${mainURL}add/side_works/time-entries`;

      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 201) {
        ReactHotToast(result.data.message, "success");
        window.location.reload(true);
        handleClear();
        setIsUpdated((prev) => !prev);
        props.onHide();
        props.setNewUpdate(true);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
      setIsUpdated((prev) => !prev);
    }
  };

  const handleAddEntry = (e) => {
    e.preventDefault();

    const { entryDescription, job, entryAs, startTime, endTime } = entryDetails;

    const bool =
      entryDescription && entryAs && startTime?.value && endTime?.value;

    const validateJob =
      showBillableForm && Boolean(job?.value)
        ? true
        : !showBillableForm
        ? true
        : false;

    if (bool && validateJob) {
      addNewEntry();
    } else {
      const conditions = {
        [!entryDescription]: "Please input time entry description!",
        [!endTime.value]: "Please select Entry End Time!",
        [!startTime.value]: "Please select Entry Start Time!",
        [showBillableForm && !job.value]: "Please select a job!",
        [!entryAs]: "Please select entry as either team or individual!",
      };

      const errorMessage = conditions[true];

      if (errorMessage) {
        ReactHotToast(errorMessage, "error");
      }
    }
  };

  const handleClickForm = (formType) => {
    setShowsideWorkForm(formType === "sidework");
    setShowBillableForm(formType === "billable");
    setShowPostDraftChangesForm(formType === "postDraftChanges");
    handleClear();
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="pt-3 pb-1" closeButton>
        <Modal.Title className="w-100" id="contained-modal-title-vcenter">
          <div className="d-flex justify-content-center align-items-center gap-3">
            <img src={projectsIcon} height={20} width={20} alt="user-icon" />
            <span className="modal-title">Add Job Entry</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <div className="form-group w-100 mt-1">
          <label htmlFor="">Entry Type:</label>
          <div
            name="assignee-radio-group"
            className="radio-group mt-2 d-flex justify-content-start"
          >
            <label htmlFor="billable">
              <input
                type="radio"
                id="billable"
                value="billable"
                name="entryType"
                className="radio-btn"
                onClick={() => handleClickForm("billable")}
              />
              <span>billable hours</span>
            </label>
            <label htmlFor="sideWork">
              <input
                type="radio"
                id="sideWork"
                value="sideWork"
                name="entryType"
                className="radio-btn"
                onClick={() => handleClickForm("sidework")}
              />
              <span>Side work</span>
            </label>
            <label htmlFor="postDraftChanges">
              <input
                type="radio"
                id="postDraftChanges"
                value="postDraftChanges"
                name="entryType"
                className="radio-btn"
                onClick={() => handleClickForm("postDraftChanges")}
              />
              <span>Post Draft Changes</span>
            </label>
          </div>
        </div>
        {/* Billable form  */}
        {showBillableForm && (
          <form
            className="d-flex flex-column"
            //   className="width-60 add-time-entry-form mt-3 d-flex flex-column justify-content-start align-items-start"
            onSubmit={handleAddEntry}
          >
            <div className="d-flex flex-column justify-content-center align-items-start w-100">
              {/* Radio Button section for select Entry ( Individual or Team ) */}
              <div className="form-group mt-4 w-100">
                <label htmlFor="assignee-radio-group">Assigned task as:</label>
                <div
                  name="assignee-radio-group"
                  className="radio-group mt-2 d-flex justify-content-start"
                >
                  <label htmlFor="Individual">
                    <input
                      type="radio"
                      id="Individual"
                      value="Member"
                      name="assignee"
                      className="radio-btn"
                      checked={entryDetails?.entryAs === "Member"}
                      onChange={(e) => handleEntryAs(e)}
                    />
                    <span>Individual</span>
                  </label>
                  <label htmlFor="Team">
                    <input
                      type="radio"
                      id="Team"
                      value="Team"
                      name="assignee"
                      className="radio-btn"
                      checked={entryDetails?.entryAs === "Team"}
                      onChange={(e) => handleEntryAs(e)}
                    />
                    <span>Team</span>
                  </label>
                </div>
              </div>
              {/* Job selection DropDown  */}
              {/* <div className="form-group mt-4 w-100">
            <label htmlFor="bpoNo">BPO No:</label>
            <Select
                className="react-select-custom-styling__container"
                classNamePrefix="react-select-custom-styling"
                isClearable={false}
                isSearchable={true}
                name="bpoNo"
                onChange={(selectedOption) => {
                    setEntryDetails((prevState) => ({
                        ...prevState,
                        bpoNo: selectedOption ? selectedOption.value : "",
                    }));
                }}
                value={entryDetails.bpoNo ? { value: entryDetails.bpoNo, label: entryDetails.bpoNo } : null}
                options={entryDetails.bpoNoOptions}
            />
        </div>
        <div className="form-group mt-4 w-100">
            <label htmlFor="jobName">Job Name:</label>
            <Select
                className="react-select-custom-styling__container"
                classNamePrefix="react-select-custom-styling"
                isClearable={false}
                isSearchable={true}
                name="jobName"
                onChange={(selectedOption) => {
                    setEntryDetails((prevState) => ({
                        ...prevState,
                        job: selectedOption ? selectedOption.value : "",
                    }));
                }}
                value={entryDetails.job ? { value: entryDetails.job, label: entryDetails.job } : null}
                options={entryDetails.jobOptions}
            />
        </div> */}
         {/* <div className="form-group mt-4 w-100">
        <label htmlFor="bpoNo">BPO No:</label>
        <Select
          className="react-select-custom-styling__container"
          classNamePrefix="react-select-custom-styling"
          isClearable={false}
          isSearchable={true}
          name="bpoNo"
          onChange={(selectedOption) => {
            setEntryDetails((prevState) => ({
              ...prevState,
              bpoNo: selectedOption ? selectedOption.value : null,
              job: null, // Reset job selection when BPO No changes
            }));
          }}
          value={entryDetails.bpoNo ? { value: entryDetails.bpoNo, label: entryDetails.bpoNo } : null}
          options={entryDetails.bpoNoOptions}
        />
      </div> */}
      <div className="form-group mt-4 w-100">
        <label htmlFor="bpoNo">BPO No:</label>
        <Select
          className="react-select-custom-styling__container"
          classNamePrefix="react-select-custom-styling"
          isClearable={false}
          isSearchable={true}
          name="bpoNo"
          onChange={(selectedOption) => {
            setEntryDetails((prevState) => ({
              ...prevState,
              bpoNo: selectedOption ? selectedOption.value : "",
            }));
          }}
          value={entryDetails.bpoNo ? { value: entryDetails.bpoNo, label: entryDetails.bpoNo } : null}
          options={entryDetails.bpoNoOptions}
        />
      </div>
      <div className="form-group mt-4 w-100">
        <label htmlFor="jobName">Job Name:</label>
        <Select
          className="react-select-custom-styling__container"
          classNamePrefix="react-select-custom-styling"
          isClearable={false}
          isSearchable={true}
          name="jobName"
          onChange={(value) => {
            setEntryDetails((prevState) => ({
              ...prevState,
              job: value,
            }));
          }}
          value={entryDetails?.job}
          options={entryDetails?.jobOptions}
        />
          
     
      </div>
              {/* Date Picker for Job date  */}
              <div className="form-group mt-4 w-100">
                <label htmlFor="jobDate">Job Date:</label>
                <DatePicker
                  className="form-control datepicker"
                  value={() => dayjs(props?.entryDetails?.calendarDate)}
                  disabled
                  name="jobDate"
                />
              </div>
              {/* Time Section  */}
              <div className="d-flex align-items-center flex-column w-100">
                {/* Start Time Picker for Enter time mannually  */}
                <div className="form-group mt-4 w-100">
                  <label htmlFor="startTime">Start Time (hh:mm):</label>
                  <TimePickerSection
                    onChange={(time) => {
                      setEntryDetails((prevState) => ({
                        ...prevState,
                        startTime: {
                          value: `${time}`,
                        },
                      }));
                    }}
                  />

                  {/* <Select
                  className="react-select-custom-styling__container time-entry"
                  classNamePrefix="react-select-custom-styling"
                  isClearable={false}
                  isSearchable={true}
                  name="startTime"
                  onChange={(value) => {
                    setEntryDetails((prevState) => ({
                      ...prevState,
                      startTime: value,
                    }));
                  }}
                  placeholder="Type in hh:mm format"
                  value={entryDetails?.startTime}
                  options={timeOptions}
                /> */}
                </div>

                {/* End Time Picker for Enter time mannually  */}
                <div className="form-group mt-4 w-100">
                  <label htmlFor="endTime">End Time (hh:mm):</label>
                  <TimePickerSection
                    onChange={(time) => {
                      setEntryDetails((prevState) => ({
                        ...prevState,
                        endTime: {
                          value: `${time}`,
                        },
                      }));
                    }}
                  />
                  {/* <Select
                  className="react-select-custom-styling__container time-entry"
                  classNamePrefix="react-select-custom-styling"
                  isClearable={false}
                  isSearchable={true}
                  name="endTime"
                  onChange={(value) => {
                    setEntryDetails((prevState) => ({
                      ...prevState,
                      endTime: value,
                    }));
                  }}
                  placeholder="Type in hh:mm format"
                  value={entryDetails?.endTime}
                  options={timeOptions}
                /> */}
                </div>
              </div>
              {/* Job Description Section  */}
              <div className="form-group mt-4 w-100">
                <label htmlFor="jobDescription">Job Description:</label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  className="w-100"
                  rows={3}
                  placeholder="Eg. Auditing Report (2022/23 Financial Year) for Doshi Accounting Company"
                  value={entryDetails?.entryDescription}
                  onChange={(e) =>
                    setEntryDetails((prev) => ({
                      ...prev,
                      entryDescription: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            {/* Submit Button  */}
            <button type="submit" className="mt-4 custom-btn m-auto">
              {isLoading ? <SpinningLoader /> : "Add Job Entry"}
            </button>
          </form>
        )}

        {/* Side work form */}
        {showsideWorkForm && (
          <form
            className="d-flex flex-column"
            //   className="width-60 add-time-entry-form mt-3 d-flex flex-column justify-content-start align-items-start"
            onSubmit={handleAddEntry}
          >
            <div className="d-flex flex-column justify-content-center align-items-start w-100">
              {/* Radio Button section for select Entry ( Individual or Team ) */}
              <div className="form-group mt-4 w-100">
                <label htmlFor="assignee-radio-group">Assigned task as:</label>
                <div
                  name="assignee-radio-group"
                  className="radio-group mt-2 d-flex justify-content-start"
                >
                  <label htmlFor="Individual">
                    <input
                      type="radio"
                      id="Individual"
                      value="Member"
                      name="assignee"
                      className="radio-btn"
                      checked={entryDetails?.entryAs === "Member"}
                      onChange={(e) => handleEntryAs(e)}
                    />
                    <span>Individual</span>
                  </label>
                  <label htmlFor="Team">
                    <input
                      type="radio"
                      id="Team"
                      value="Team"
                      name="assignee"
                      className="radio-btn"
                      checked={entryDetails?.entryAs === "Team"}
                      onChange={(e) => handleEntryAs(e)}
                    />
                    <span>Team</span>
                  </label>
                </div>
              </div>

              {/* Date Picker for Job date  */}
              <div className="form-group mt-4 w-100">
                <label htmlFor="jobDate">Job Date:</label>
                <DatePicker
                  className="form-control datepicker"
                  value={() => dayjs(props?.entryDetails?.calendarDate)}
                  disabled
                  name="jobDate"
                />
              </div>
              {/* Time Section  */}
              <div className="d-flex align-items-center flex-column w-100">
                {/* Start Time Picker for Enter time mannually  */}
                <div className="form-group mt-4 w-100">
                  <label htmlFor="startTime">Start Time (hh:mm):</label>
                  <TimePickerSection
                    onChange={(time) => {
                      setEntryDetails((prevState) => ({
                        ...prevState,
                        startTime: {
                          value: `${time}`,
                        },
                      }));
                    }}
                  />

                  {/* <Select
                  className="react-select-custom-styling__container time-entry"
                  classNamePrefix="react-select-custom-styling"
                  isClearable={false}
                  isSearchable={true}
                  name="startTime"
                  onChange={(value) => {
                    setEntryDetails((prevState) => ({
                      ...prevState,
                      startTime: value,
                    }));
                  }}
                  placeholder="Type in hh:mm format"
                  value={entryDetails?.startTime}
                  options={timeOptions}
                /> */}
                </div>

                {/* End Time Picker for Enter time mannually  */}
                <div className="form-group mt-4 w-100">
                  <label htmlFor="endTime">End Time (hh:mm):</label>
                  <TimePickerSection
                    onChange={(time) => {
                      setEntryDetails((prevState) => ({
                        ...prevState,
                        endTime: {
                          value: `${time}`,
                        },
                      }));
                    }}
                  />
                  {/* <Select
                  className="react-select-custom-styling__container time-entry"
                  classNamePrefix="react-select-custom-styling"
                  isClearable={false}
                  isSearchable={true}
                  name="endTime"
                  onChange={(value) => {
                    setEntryDetails((prevState) => ({
                      ...prevState,
                      endTime: value,
                    }));
                  }}
                  placeholder="Type in hh:mm format"
                  value={entryDetails?.endTime}
                  options={timeOptions}
                /> */}
                </div>
              </div>
              {/* Job Description Section  */}
              <div className="form-group mt-4 w-100">
                <label htmlFor="jobDescription">Job Description:</label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  className="w-100"
                  rows={3}
                  placeholder="Eg. Auditing Report (2022/23 Financial Year) for Doshi Accounting Company"
                  value={entryDetails?.entryDescription}
                  onChange={(e) =>
                    setEntryDetails((prev) => ({
                      ...prev,
                      entryDescription: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            {/* Submit Button  */}
            <button type="submit" className="mt-4 custom-btn m-auto">
              {isLoading ? <SpinningLoader /> : "Add Job Entry"}
            </button>
          </form>
        )}

        {/* Post Draft Changes */}
        {showPostDraftChangesForm && (
          <form
            className="d-flex flex-column"
            //   className="width-60 add-time-entry-form mt-3 d-flex flex-column justify-content-start align-items-start"
            onSubmit={handleAddEntry}
          >
            <div className="d-flex flex-column justify-content-center align-items-start w-100">
              {/* Radio Button section for select Entry ( Individual or Team ) */}
              <div className="form-group mt-4 w-100">
                <label htmlFor="assignee-radio-group">Assigned task as:</label>
                <div
                  name="assignee-radio-group"
                  className="radio-group mt-2 d-flex justify-content-start"
                >
                  <label htmlFor="Individual">
                    <input
                      type="radio"
                      id="Individual"
                      value="Member"
                      name="assignee"
                      className="radio-btn"
                      checked={entryDetails?.entryAs === "Member"}
                      onChange={(e) => handleEntryAs(e)}
                    />
                    <span>Individual</span>
                  </label>
                  <label htmlFor="Team">
                    <input
                      type="radio"
                      id="Team"
                      value="Team"
                      name="assignee"
                      className="radio-btn"
                      checked={entryDetails?.entryAs === "Team"}
                      onChange={(e) => handleEntryAs(e)}
                    />
                    <span>Team</span>
                  </label>
                </div>
              </div>
         
              {/* Job selection DropDown  */}
              <div className="form-group mt-4 w-100">
            <label htmlFor="bpoNo">BPO No:</label>
            <Select
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              isClearable={false}
              isSearchable={true}
              name="bpoNo"
              onChange={(selectedOption) => {
                setEntryDetails(prevState => ({
                  ...prevState,
                  bpoNo: selectedOption ? selectedOption.value : null,
                  job: null, // Reset job selection when BPO No changes
                }));
              }}
              value={entryDetails.bpoNo ? { value: entryDetails.bpoNo, label: entryDetails.bpoNo } : null}
              options={entryDetails.bpoNoOptions}
            />
          </div>
          {/* Job Name Selection */}
          <div className="form-group mt-4 w-100">
            <label htmlFor="jobName">Job Name:</label>
            <Select
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              isClearable={false}
              isSearchable={true}
              name="jobName"
              onChange={(value) => {
                setEntryDetails((prevState) => ({
                  ...prevState,
                  job: value,
                }));
              }}
              value={entryDetails?.job}
              options={entryDetails?.jobOptions}
            />
          </div>
              {/* <div className="form-group mt-4 w-100">
                <label htmlFor="jobName">Job Name:</label>
                <Select
                  className="react-select-custom-styling__container"
                  classNamePrefix="react-select-custom-styling"
                  isClearable={false}
                  isSearchable={true}
                  name="jobName"
                  onChange={(value) => {
                    setEntryDetails((prevState) => ({
                      ...prevState,
                      job: value,
                    }));
                  }}
                  value={entryDetails?.job}
                  options={entryDetails?.jobOptions}
                />
              </div> */}
              {/* Date Picker for Job date  */}
              <div className="form-group mt-4 w-100">
                <label htmlFor="jobDate">Job Date:</label>
                <DatePicker
                  className="form-control datepicker"
                  value={() => dayjs(props?.entryDetails?.calendarDate)}
                  disabled
                  name="jobDate"
                />
              </div>
              {/* Time Section  */}
              <div className="d-flex align-items-center flex-column w-100">
                {/* Start Time Picker for Enter time mannually  */}
                <div className="form-group mt-4 w-100">
                  <label htmlFor="startTime">Start Time (hh:mm):</label>
                  <TimePickerSection
                    onChange={(time) => {
                      setEntryDetails((prevState) => ({
                        ...prevState,
                        startTime: {
                          value: `${time}`,
                        },
                      }));
                    }}
                  />
                </div>

                {/* End Time Picker for Enter time mannually  */}
                <div className="form-group mt-4 w-100">
                  <label htmlFor="endTime">End Time (hh:mm):</label>
                  <TimePickerSection
                    onChange={(time) => {
                      setEntryDetails((prevState) => ({
                        ...prevState,
                        endTime: {
                          value: `${time}`,
                        },
                      }));
                    }}
                  />
                </div>
              </div>
              {/* Job Description Section  */}
              <div className="form-group mt-4 w-100">
                <label htmlFor="jobDescription">Job Description:</label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  className="w-100"
                  rows={3}
                  placeholder="Eg. Auditing Report (2022/23 Financial Year) for Doshi Accounting Company"
                  value={entryDetails?.entryDescription}
                  onChange={(e) =>
                    setEntryDetails((prev) => ({
                      ...prev,
                      entryDescription: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            {/* Submit Button  */}
            <button type="submit" className="mt-4 custom-btn m-auto">
              {isLoading ? <SpinningLoader /> : "Add Job Entry"}
            </button>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export const AddJobEntryModal = ({
  entryDetails,
  setIsUpdated,
  setNewUpdate,
}) => {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <div
        style={{ cursor: "pointer", height: "30px" }}
        onClick={() => {
          setModalShow(true);
        }}
      >
        <button className="custom-btn ">Add Job Entry</button>
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setIsUpdated={setIsUpdated}
        entryDetails={entryDetails}
        setNewUpdate={setNewUpdate}
      />
    </>
  );
};

