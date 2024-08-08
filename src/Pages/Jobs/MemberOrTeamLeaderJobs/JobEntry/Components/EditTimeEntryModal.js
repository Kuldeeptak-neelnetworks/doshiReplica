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
  timeOptions,
  getTwelveHoursTime,
} from "../../../../../utils/utilities/utilityFunctions";
import { ReactHotToast } from "../../../../../Components/ReactHotToast/ReactHotToast";
import TimePickerEditSection from "./TimePickerEditSection";

const getTime = (entryTime) => {
  return { label: getTwelveHoursTime(entryTime), value: entryTime };
};

const MyVerticallyCenteredModal = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mainURL, logout, initialState } = useContext(ContextAPI);

  const [updatedTimeEntryDetails, setUpdatedTimeEntryDetails] = useState({
   
    job: {
      label: props.entryDetails.task_name,
      value: props.entryDetails.task_id,
    },
    jobOptions: [],
    timeEntryType:props.entryDetails.time_entries_type,
    entryDescription: props.entryDetails.work_description,
    entryAs: props.entryDetails.entries_as,
    entryTime: {
      time: dayjs(props.entryDetails.working_time, "HH:mm:ss"),
      timeString: props.entryDetails.working_time,
    },
    isPOstDraft:props.entryDetails.is_post_draft,
  
    entryDate: props.entryDetails.working_date,
    startTime: getTime(props.entryDetails.work_start_time),
    endTime: getTime(props.entryDetails.work_end_time),
  });
  useEffect(() => {
    props.setNewUpdate(true);
  }, [props, updatedTimeEntryDetails]);

  // setting Job Options
  useEffect(() => {
    const settingJobsOptions = (data) => {
      if (Array.isArray(data)) {
        return data
          ?.filter((job) => job.job_status === "In Progress")
          ?.map((job) => ({
            label:
              updatedTimeEntryDetails.entryAs === "team"
                ? job.task_name
                : job.job_name,
            value:
              updatedTimeEntryDetails.entryAs === "team"
                ? job.task_id
                : job.assign_id,
          }));
      } else {
        return [];
      }
    };

    const filterJobs = (data, type) => {
      if (Array.isArray(data)) {
        return data
          ?.filter((job) => job.assign_as === type)
          ?.map((job) => ({ label: job.job_name, value: job.assign_id }));
      } else {
        return [];
      }
    };

    const options =
      updatedTimeEntryDetails?.entryAs === "team"
        ? settingJobsOptions(initialState?.myTeams?.assigned_jobs) ?? []
        : updatedTimeEntryDetails?.entryAs === "member"
        ? settingJobsOptions(initialState?.myJobs) ?? []
        : [];

    const postDraftJobOptions =
      updatedTimeEntryDetails.entryAs === "team"
        ? filterJobs(initialState?.postDraftChangesJobs, "Team")
        : updatedTimeEntryDetails.entryAs === "member"
        ? filterJobs(initialState?.postDraftChangesJobs, "Individual")
        : [];

    setUpdatedTimeEntryDetails((prev) => ({
      ...prev,
      jobOptions:
        props.entryDetails.is_post_draft === "1"
          ? postDraftJobOptions
          : options,
    }));
  }, [
    updatedTimeEntryDetails?.entryAs,
    initialState?.myTeams,
    initialState?.myJobs,
    props.entryDetails,
    initialState?.postDraftChangesJobs,
  ]);

  // helper function for selecting the Entry as radio group - Entry as an Individual or Entry as a Team
  const handleEntryAs = (e) => {
    setUpdatedTimeEntryDetails((prev) => ({
      ...prev,
      entryAs: e.target.value,
      job: "",
    }));
  };

  // helper function for Time Changing while adding an entry
  const onDurationChange = (time, timeString) => {
    setUpdatedTimeEntryDetails((prev) => ({
      ...prev,
      entryTime: { time, timeString },
    }));
  };

  const handleEntryDate = (date, dateString) => {
    setUpdatedTimeEntryDetails((prev) => ({ ...prev, entryDate: dateString }));
  };

  // for updating a time entry api
  const updateTimeEntry = async () => {
    try {
      setIsLoading(() => true);
      let body = {
        current_user: localStorage.getItem("userId") ?? null,
        task_id: updatedTimeEntryDetails?.job?.value,
        entries_as:
          updatedTimeEntryDetails?.entryAs === "team" ? "Team" : "Member",
        entry_id: props?.entryDetails?.entries_id,
        // work_time: updatedTimeEntryDetails?.entryTime?.timeString,
        work_start_time: updatedTimeEntryDetails?.startTime?.value,
        work_end_time: updatedTimeEntryDetails?.endTime?.value,
        working_date: updatedTimeEntryDetails?.entryDate,
        work_description: updatedTimeEntryDetails?.entryDescription,
        // time_entries_type:updatedTimeEntryDetails?.timeEntryType
        time_entries_type: updatedTimeEntryDetails?.isPOstDraft === "1" ? "post_draft" : updatedTimeEntryDetails?.timeEntryType ?? "billable_hours"

      };

      if (updatedTimeEntryDetails?.entryAs === "team") {
        body.team_id = initialState?.myTeams?.id;
      }

      // const url = `${mainURL}edit/time-entries`;
      // "time_entries_type": "side_works",


      const url =
      updatedTimeEntryDetails?.timeEntryType === "side_works"
        ? `${mainURL}edit/side-works-time-entries`
        : `${mainURL}edit/time-entries`;
      const result = await axios.put(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 200) {

        // props.setEntryDetails("")
        ReactHotToast(result.data.message, "success");
        props.setIsUpdated((prev) => !prev);
        props.onHide();
      }
    } catch (e) {
   
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
    }
  };

  const handleUpdateTimeEntry = (e) => {
    e.preventDefault();

    const { entryAs, job, entryDescription, entryDate, startTime, endTime,timeEntryType } =
      updatedTimeEntryDetails;

    const bool =
 
      entryAs &&
      // job?.value &&
      entryDate &&
      entryDescription &&
      startTime?.value &&
      endTime?.value;

    if (bool) {
      updateTimeEntry();
    } else {
      const conditions = {
        [!entryDescription]: "Please input time entry description!",
        [!endTime.value]: "Please select Entry End Time!",
        [!startTime.value]: "Please select Entry Start Time!",
        [!entryDate]: "Please select Entry Date!",
        // [!job.value]: "Please select a job!",
        [!entryAs]: "Please select entry as either team or individual!",
      };

      const errorMessage = conditions[true];

      if (errorMessage) {
        ReactHotToast(errorMessage, "error");
      }
    }
  };
  useEffect(() => {
    if (props.entryDetails) {
      setUpdatedTimeEntryDetails({
        job: {
          label: props.entryDetails.task_name,
          value: props.entryDetails.task_id,
        },
        jobOptions: [],
        timeEntryType: props.entryDetails.time_entries_type,
        entryDescription: props.entryDetails.work_description,
        entryAs: props.entryDetails.entries_as,
        entryTime: {
          time: dayjs(props.entryDetails.working_time, "HH:mm:ss"),
          timeString: props.entryDetails.working_time,
        },
        isPOstDraft: props.entryDetails.is_post_draft,
        entryDate: props.entryDetails.working_date,
        startTime: getTime(props.entryDetails.work_start_time),
        endTime: getTime(props.entryDetails.work_end_time),
      });
    }
  }, [props.entryDetails]);

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
            <span className="modal-title">Edit Time Entry</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleUpdateTimeEntry}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-3 w-100">
            <label htmlFor="assignee-radio-group">Assigned task as:</label>
            <div
              name="assignee-radio-group"
              className="radio-group mt-2 d-flex justify-content-start"
            >
              <label htmlFor="individual">
                <input
                  type="radio"
                  id="individual"
                  value="member"
                  name="assignee"
                  className="radio-btn"
                  checked={updatedTimeEntryDetails?.entryAs === "member"}
                  onChange={(e) => handleEntryAs(e)}
                />
                <span>Individual</span>
              </label>
              <label htmlFor="team">
                <input
                  type="radio"
                  id="team"
                  value="team"
                  name="assignee"
                  className="radio-btn"
                  checked={updatedTimeEntryDetails?.entryAs === "team"}
                  onChange={(e) => handleEntryAs(e)}
                />
                <span>Team</span>
              </label>
            </div>
          </div>
          {updatedTimeEntryDetails?.timeEntryType === "side_works"?"":

          <div className="form-group mt-3 w-100">
            <label htmlFor="jobName">Job Name:</label>
            <Select
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              isClearable={false}
              isSearchable={true}
              name="jobName"
              onChange={(value) => {
                setUpdatedTimeEntryDetails((prevState) => ({
                  ...prevState,
                  job: value,
                }));
              }}
              value={updatedTimeEntryDetails?.job}
              options={updatedTimeEntryDetails?.jobOptions}
            />
          </div>
}

          <div className="form-group mt-3 w-100">
            <label htmlFor="jobDate">Job Date:</label>
            <DatePicker
              className="form-control datepicker"
              popupClassName="pop-up-box"
              value={dayjs(updatedTimeEntryDetails?.entryDate)}
              onChange={handleEntryDate}
              name="jobDate"
              allowClear={false}
              disabledDate={(current) => new Date() < new Date(current)}
            />
          </div>
          <div className="d-flex align-items-center flex-column w-100">
            <div className="form-group mt-4 w-100">
              <label htmlFor="startTime">Start Time (hh:mm):</label>
              <TimePickerEditSection
                onChange={(time) => {
                  setUpdatedTimeEntryDetails((prevState) => ({
                    ...prevState,
                    startTime: {
                      value: `${time}`,
                      label: `${time}`,
                    },
                  }));
                }}
                existingTime={updatedTimeEntryDetails.startTime.value}
              />
            </div>
            <div className="form-group mt-4 w-100">
              <label htmlFor="endTime">End Time (hh:mm):</label>
              <TimePickerEditSection
                key={props.entryDetails?.work_end_time}
                onChange={(time) => {
                  setUpdatedTimeEntryDetails({
                    ...updatedTimeEntryDetails,
                    endTime: {
                      value: `${time}`,
                      label: `${time}`,
                    },
                  });
                }}
                existingTime={
                  props.entryDetails?.work_end_time.value ||
                  updatedTimeEntryDetails?.endTime?.value
                }
              />
            </div>
          </div>

          <div className="form-group mt-3 w-100">
            <label htmlFor="jobDescription">Work Description:</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              className="w-100"
              rows={3}
              placeholder="Eg. Auditing Report (2022/23 Financial Year) for Doshi Accounting Company"
              value={updatedTimeEntryDetails?.entryDescription}
              onChange={(e) =>
                setUpdatedTimeEntryDetails((prev) => ({
                  ...prev,
                  entryDescription: e.target.value,
                }))
              }
            />
          </div>

          <button type="submit" className="custom-btn mt-4">
            {isLoading ? <SpinningLoader /> : "Update"}
          </button>
        </form>

        
      </Modal.Body>
    </Modal>
  );
};

export const EditTimeEntryModal = ({
  entryDetails,
  setIsUpdated,
  setNewUpdate,
}) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        {entryDetails?.time_entries_status === "pending" && (
          <button className="custom-btn d-flex justify-content-center align-items-center gap-2 float-right">
            Edit
          </button>
        )}
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
