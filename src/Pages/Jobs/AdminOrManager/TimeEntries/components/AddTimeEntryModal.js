import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { DatePicker, TimePicker } from "antd";
import Select from "react-select";

import { projectsIcon } from "../../../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../../../Context/ApiContext/ApiContext";
import {
  handleAPIError,
  headerOptions,
  presentDate,
  timeOptions,
} from "../../../../../utils/utilities/utilityFunctions";
import { ReactHotToast } from "../../../../../Components/ReactHotToast/ReactHotToast";
// import TimePickerSection from "./TimePickerSection";
import TimePickerSection from "../../../MemberOrTeamLeaderJobs/JobEntry/Components/TimePickerSection";

const MyVerticallyCenteredModal = (props) => {
  const {
    getAllJobs,
    getAllMembers,
    getAllTeams,
    getAllAssignJobs,
    initialState,
    mainURL,
    logout,
  } = useContext(ContextAPI);

  const [isLoading, setIsLoading] = useState(false);

  const [entryDetails, setEntryDetails] = useState({
    entryDuration: "",
    entryDescription: "",
    job: "",
    employee: "",
    entryAs: "",
    teamId: "",
    jobOptions: [],
    employeeOptions: [],
    entryDate: "",
    startTime: "",
    endTime: "",
  });

  // fetching members, teams, jobs & assigned jobs data
  useEffect(() => {
    getAllMembers();
    getAllTeams();
    getAllJobs();
    getAllAssignJobs();
  }, []);

  // setting employee options
  useEffect(() => {
    const options = initialState.membersList
      .filter(
        ({ member_role, current_status }) =>
          member_role.includes("members") && current_status === "active"
      )
      .map(({ member_name, member_id }) => ({
        label: member_name,
        value: member_id,
      }));

    setEntryDetails((prev) => ({ ...prev, employeeOptions: options }));
  }, [initialState.membersList]);

  const handleEntryAs = (e) => {
    setEntryDetails((prev) => ({
      ...prev,
      entryAs: e.target.value,
      job: "",
    }));

    if (entryDetails?.employee) {
      filterJobOptions(entryDetails.employee.value, e.target.value);
    }
  };

  const formatIntoOptions = (data, type) => {
    return data
      ?.filter(({ job_status }) => job_status === "In Progress")
      ?.map((job) => ({
        label: type === "team" ? job.task_name : job.job_name,
        value: type === "team" ? job.task_id : job.assign_id,
      }));
  };

  const filterJobOptions = (selectedEmployee, seletedEntryAs) => {
    const employeeIndividualJobs = initialState.assignJobsList.filter(
      ({ member_id }) => +member_id === +selectedEmployee
    );

    const employeeTeamAssignedJobs = initialState.teamsList.find(
      ({ team_member, team_leader }) =>
        team_member.includes(selectedEmployee) ||
        team_leader === selectedEmployee
    );

    const individualJobs = formatIntoOptions(
      employeeIndividualJobs,
      "individual"
    );

    const teamJobs = formatIntoOptions(
      employeeTeamAssignedJobs?.assigned_jobs_list,
      "team"
    );
    const jobOptions = seletedEntryAs === "Team" ? teamJobs : individualJobs;

    setEntryDetails((prev) => ({
      ...prev,
      jobOptions,
      teamId: seletedEntryAs === "Team" ? employeeTeamAssignedJobs?.id : "",
    }));
  };

  const handleClear = () => {
    setEntryDetails({
      entryDuration: "",
      entryDescription: "",
      job: "",
      employee: "",
      entryAs: "",
      teamId: "",
      jobOptions: [],
      employeeOptions: [],
      entryDate: new Date(),
    });
  };

  // for adding a new entry via Admin / Manager api
  const addTimeEntry = async () => {
    setIsLoading(() => true);
    try {
      let body = {
        current_user: localStorage.getItem("userId") ?? null,
        entry_for_user: entryDetails.employee.value,
        task_id: entryDetails.job.value,
        entries_as: entryDetails.entryAs,
        working_date: entryDetails.entryDate.dateString,
        work_description: entryDetails.entryDescription,
        work_start_time: entryDetails?.startTime?.value,
        work_end_time: entryDetails?.endTime?.value,
      };

      if (entryDetails?.entryAs === "Team") {
        body.team_id = entryDetails.teamId;
      }

      const url = `${mainURL}add/time-entries-as-admin`;
      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 201) {
        ReactHotToast(result.data.message, "success");
        props.setIsUpdated((prev) => !prev);
        handleClear();
        props.onHide();
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
    }
  };

  const handleAddTimeEntry = (e) => {
    e.preventDefault();

    const {
      entryDescription,
      job,
      employee,
      entryAs,
      startTime,
      endTime,
      entryDate,
    } = entryDetails;

    const bool =
      entryDescription &&
      job?.value &&
      employee?.value &&
      entryAs &&
      startTime?.value &&
      endTime?.value &&
      entryDate?.dateString;

    if (bool) {
      addTimeEntry();
    } else {
      const conditions = {
        [!entryDescription]: "Please input time entry description!",
        [!endTime.value]: "Please select Entry End Time!",
        [!startTime.value]: "Please select Entry Start Time!",
        [!entryDate.dateString]: "Please Select Entry Date!",
        [!job.value]: "Please select a Job!",
        [!entryAs]: "Please select entry as either team or individual!",
        [!employee.value]: "Please Select Employee!!",
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
            <span className="modal-title">Add Time Entry</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleAddTimeEntry}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          {/* Select Employee */}
          <div className="form-group mt-3 w-100">
            <label htmlFor="jobType">Select Employee:</label>
            <Select
              name="jobType"
              closeMenuOnSelect={true}
              onChange={(value) => {
                setEntryDetails((prevState) => ({
                  ...prevState,
                  employee: value,
                }));

                if (entryDetails?.entryAs)
                  filterJobOptions(value.value, entryDetails?.entryAs);
              }}
              value={entryDetails?.employee}
              options={entryDetails?.employeeOptions}
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
            />
          </div>

          {/* Entry as */}
          <div className="form-group mt-3 w-100">
            <label htmlFor="assignee-radio-group">Entry as:</label>
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

          {/* Job Name */}
          <div className="form-group mt-3 w-100">
            <label htmlFor="jobType">Select Job:</label>
            <Select
              name="jobType"
              closeMenuOnSelect={true}
              onChange={(value) => {
                setEntryDetails((prevState) => ({
                  ...prevState,
                  job: value,
                }));
              }}
              value={entryDetails?.job}
              options={entryDetails?.jobOptions}
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
            />
          </div>

          {/* Entry Date */}
          <div className="form-group mt-3 w-100">
            <label htmlFor="billingRates">Entry Date:</label>
            <DatePicker
              className="form-control datepicker"
              popupClassName="pop-up-box"
              onChange={(date, dateString) =>
                setEntryDetails((prev) => ({
                  ...prev,
                  entryDate: { date, dateString },
                }))
              }
              placeholder="Select / Enter date in YYYY-MM-DD format"
              value={entryDetails.entryDate.date}
              name="billingRates"
              disabledDate={(current) => presentDate() < new Date(current)}
            />
          </div>

          {/* Entry Duration */}
          <div className=" gap-4 align-items-center w-100">
            <div className="form-group mt-4 w-100">
              <label htmlFor="startTime">Start Time (hh:mm):</label>
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
                value={entryDetails?.startTime?.time}
                options={timeOptions}
              /> */}
              <TimePickerSection
                value={entryDetails?.startTime?.time}
                name="startTime"
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
            <div className="form-group mt-4 w-100">
              <label htmlFor="endTime">End Time (hh:mm):</label>
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
                value={entryDetails?.endTime?.time}
                options={timeOptions}
              /> */}
              <TimePickerSection
                onChange={(time) => {
                  setEntryDetails((prevState) => ({
                    ...prevState,
                    endTime: {
                      value: `${time}`,
                    },
                  }));
                }}
                name="endTime"
                value={entryDetails?.endTime?.time}
              />
            </div>
          </div>

          {/* Entry Description */}
          <div className="form-group mt-4 w-100">
            <label htmlFor="jobDescription">Entry Description:</label>
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

          <button type="submit" className="custom-btn mt-3">
            {isLoading ? <SpinningLoader /> : "Add Time Entry"}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const AddTimeEntryModal = ({ setIsUpdated }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        <button className="custom-btn d-flex justify-content-center align-items-center gap-2">
          Add Time Entry <span className="fw-light fs-4">+</span>
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
