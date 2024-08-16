import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
// import { DatePicker } from "antd";

import { projectsIcon } from "../../../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../../../Components/SpinningLoader/SpinningLoader";
import SelectElement from "../../../../../templates/SelectElement";
import { ContextAPI } from "../../../../../Context/ApiContext/ApiContext";
import {
  headerOptions,
  handleAPIError,
} from "../../../../../utils/utilities/utilityFunctions";
import { ReactHotToast } from "../../../../../Components/ReactHotToast/ReactHotToast";

import "react-datepicker/dist/react-datepicker.css";
import { DatePicker, Space, message } from "antd";
import moment from "moment";

const MyVerticallyCenteredModal = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    mainURL,
    logout,
    initialState,
    getAllClients,
    getAllTeams,
    getAllBillingServices,
  } = useContext(ContextAPI);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [jobDetails, setJobDetails] = useState({
    jobName: "",
    jobTypeId: "",
    clientId: "",
    // assignToTeam: false,
    teamId: "",
    description: "",
    billingService: "",
    billingRate: "",
    startDate: "",
    endDate: "",
  });
  const handleClear = () => {
    setJobDetails({
      jobName: "",
      jobTypeId: "",
      clientId: "",
      // assignToTeam: false,
      teamId: "",
      description: "",
      billingService: "",
      billingRate: "",
      startDate: "",
      endDate: "",
    });
  };

  useEffect(() => {
    getAllClients();
    getAllTeams();
    getAllBillingServices();
  }, []);

  const options = initialState?.jobCategories?.map((category) => ({
    label: category?.job_category_name,
    value: category?.job_category_id,
  }));

  const clientOptions = initialState?.clientsList?.map((client) => {
    const { client_name, additional_data, client_id } = client;
    const companyName = additional_data?.company_name || "";
    const bpoNo = additional_data?.bpo_no?.toString() || "";
    const label = `${client_name} (${companyName}${
      bpoNo ? ` - ${bpoNo}` : ""
    })`;
    const billingRates = additional_data?.billing_rates || [];

    return {
      label,
      value: client_id,
      billingRates,
    };
  });
  // const clientOptions = initialState?.clientsList?.map((client) => ({
  //   label: `${client?.client_name} (${client?.additional_data?.company_name}
  //      ${
  //        Boolean(client?.additional_data?.bpo_no?.toString())
  //          ? ` - ${client?.additional_data?.bpo_no}`
  //          : null
  //      })`,
  //   value: client?.client_id,
  // }));
  const handleClientChange = (value) => {
    const selectedClient = clientOptions.find(
      (client) => client.value === value
    );
    if (selectedClient) {
      setJobDetails((prev) => ({
        ...prev,
        clientId: value,
        billingRate: selectedClient.billingRates,
      }));
    } else {
      setJobDetails((prev) => ({
        ...prev,
        clientId: value,
        billingRate: "",
      }));
    }
  };

  const teamOptions = initialState?.teamsList
    ?.filter((team) => team.status === "active")
    .map(({ id, team_name }) => ({
      label: team_name,
      value: id,
    }));

  const billingServicesOptions = initialState?.billingServicesList
    ?.filter(({ service_status }) => service_status === "active")
    .map(({ services_name, services_id }) => ({
      label: services_name,
      value: services_id,
    }));

  // for adding a new job api
  const addNewJob = async () => {
    setIsLoading(() => true);
    try {
      let body = {
        current_user: localStorage.getItem("userId") ?? null,
        job_name: jobDetails.jobName,
        job_type: jobDetails.jobTypeId,
        client_id: jobDetails.clientId,
        team_id: jobDetails.teamId,
        assigned_on: jobDetails.startDate.dateString,
        due_date: jobDetails.endDate.dateString,
        billing_services: jobDetails.billingService,
        billing_rates: jobDetails.billingRate,
        job_description: jobDetails.description,
        assign_to: "Team",
      };

      const url = `${mainURL}add/job`;
      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 201 || result.status === 200) {
        ReactHotToast(result.data.message, "success");
        props.setIsUpdated((prev) => !prev);
        props.onHide();
        handleClear();
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
    }
  };

  const handleAddNewJob = (e) => {
    e.preventDefault();

    const {
      assignToTeam,
      teamId,
      jobName,
      jobTypeId,
      clientId,
      description,
      billingService,
      billingRate,
      startDate,
      endDate,
    } = jobDetails;

    const bool =
      // !assignToTeam ||

      //   teamId !== "" ||
      //   // description !== "" &&
      //   // description !== "" &&
      //   billingService !== "" ||
      //   billingRate !== "" ||
      //   startDate !== "" ||
      //   endDate !== "";

      teamId !== "" &&
      billingService !== "" &&
      billingRate !== "" &&
      startDate !== "" &&
      clientId !== "" &&
      endDate !== "" &&
      jobTypeId !== "" &&
      jobName !== "";

    if (jobName && jobTypeId && clientId && bool) {
      addNewJob();
    } else {
      const conditions = {
        [!jobName]: "Please enter Job Name!",
        [!jobTypeId]: "Please select Job Type!",
        [!clientId]: "Please select Client!",
        [!teamId]: "Please select Team!",
        // [assignToTeam && !description]: "Please add Description!",
        [!billingService]: "Please select Billing Service",
        [!billingRate]: "Please select Billing Rate",
        [!startDate]: "Please select Start Date",
        [!endDate]: "Please select End Date",
      };

      const errorMessage = conditions[true];

      if (errorMessage) {
        ReactHotToast(errorMessage, "error");
      }
    }
  };

  const handleDateInputChange = (e, field) => {
    const { value } = e.target;
    setJobDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const onChangeDate = (element, date, dateString) => {
    setJobDetails((prev) => ({
      ...prev,
      [element]: { date, dateString },
    }));
  };

  const handleChange = (date, dateString, element) => {
    onChangeDate(element, date, dateString);
  };

  const handleBlur = (e, element) => {
    const inputValue = e.target.value;
    const parsedDate = moment(inputValue, "DD-MM-YYYY", true);
    if (parsedDate.isValid()) {
      onChangeDate(element, parsedDate, parsedDate.format("DD-MM-YYYY"));
    } else {
      message.error("Invalid date format. Please use DD-MM-YYYY.");
    }
  };
  // const handleStartDateChange = (date) => {
  //   setSelectedStartDate(date);
  //   setJobDetails((prev) => ({
  //     ...prev,
  //     startDate: date ? format(date, "dd-MM-yyyy") : "",
  //   }));
  // };

  // const handleEndDateChange = (date) => {
  //   setSelectedEndDate(date);
  //   setJobDetails((prev) => ({
  //     ...prev,
  //     endDate: date ? format(date, "dd-MM-yyyy") : "",
  //   }));
  // };

  // const handleManualStartDateChange = (event) => {
  //   const dateString = event.target.value;
  //   setJobDetails((prev) => ({ ...prev, startDate: dateString }));
  //   const parsedDate = parse(dateString, "dd-MM-yyyy", new Date());
  //   if (isValid(parsedDate)) {
  //     setSelectedStartDate(parsedDate);
  //   } else {
  //     setSelectedStartDate(null);
  //   }
  // };

  // const handleManualEndDateChange = (event) => {
  //   const dateString = event.target.value;
  //   setJobDetails((prev) => ({ ...prev, endDate: dateString }));
  //   const parsedDate = parse(dateString, "dd-MM-yyyy", new Date());
  //   if (isValid(parsedDate)) {
  //     setSelectedEndDate(parsedDate);
  //   } else {
  //     setSelectedEndDate(null);
  //   }
  // };

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
            <span className="modal-title">Add New Job</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleAddNewJob}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-3 w-100">
            <label className="jobType" htmlFor="jobTypeId">
              Select Job Category:
            </label>
            <SelectElement
              isLoading={false}
              options={options}
              name="jobTypeId"
              handleChange={(value) =>
                setJobDetails((prev) => ({ ...prev, jobTypeId: value }))
              }
              isClearable={false}
            />
          </div>

          <div className="form-group mt-3 w-100">
            <label htmlFor="jobName">Job Name:</label>
            <input
              id="jobName"
              name="jobName"
              placeholder="Eg: Audit Report"
              type="text"
              required
              onChange={(e) =>
                setJobDetails((prev) => ({ ...prev, jobName: e.target.value }))
              }
              value={jobDetails.name}
            />
          </div>

          <div className="form-group mt-3 w-100">
            <label htmlFor="clientName">Select Client:</label>
            <SelectElement
              isLoading={false}
              options={clientOptions}
              name="clientName"
              handleChange={handleClientChange}
              isClearable={false}
            />
          </div>

          {/* <div className="form-group mt-3 w-100 flex-row align-items-center justify-content-start">
            <label style={{ width: "max-content" }} htmlFor="assignJob">
              Assign to Team (optional):
            </label>
            <input
              id="assignJob"
              name="assignJob"
              placeholder="Eg: Audit Report"
              type="checkbox"
              className="cursor-pointer checkbox-input"
              style={{ marginLeft: "10px" }}
              value={jobDetails.assignToTeam}
              onChange={(e) =>
                setJobDetails((prev) => ({
                  ...prev,
                  assignToTeam: e.target.checked,
                }))
              }
            />
          </div> */}

          {/* {jobDetails.assignToTeam && (
            <> */}
          <div className="form-group mt-4 w-100">
            <label htmlFor="team">Select Team:</label>
            <SelectElement
              isLoading={false}
              options={teamOptions}
              name="team"
              handleChange={(value) =>
                setJobDetails((prev) => ({ ...prev, teamId: value }))
              }
              isClearable={false}
            />
          </div>
          <div className="form-group mt-3 w-100">
            <label htmlFor="billingService">Billing Service:</label>
            <SelectElement
              isLoading={false}
              options={billingServicesOptions}
              name="billingService"
              handleChange={(value) =>
                setJobDetails((prev) => ({
                  ...prev,
                  billingService: value,
                }))
              }
              isClearable={false}
            />
          </div>

          <div className="form-group mt-3 w-100">
            <label htmlFor="billingRate">Billing Rate (per hr):</label>
            <input
              id="billingRate"
              name="billingRate"
              placeholder="Eg: 999"
              type="number"
              required
              onChange={(e) =>
                setJobDetails((prev) => ({
                  ...prev,
                  billingRate: e.target.value,
                }))
              }
              value={jobDetails.billingRate}
            />
          </div>

          <div className="form-group mt-3 w-100">
            <label htmlFor="jobDescription">Job Description:</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              className="w-100"
              rows={3}
              placeholder="Eg. Auditing Report (2022/23 Financial Year) for Doshi Accounting Company"
              value={jobDetails.description}
              onChange={(e) =>
                setJobDetails((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="form-group mt-3 w-100">
            <label htmlFor="startDate">Processing Period Start Date:</label>

            {/* <DatePicker
              id="startDate"
              name="startDate"
                className="form-control datepicker"
              placeholderText="dd-MM-yyyy"
           
              selected={selectedStartDate}
              onChange={handleStartDateChange}
              dateFormat="dd-MM-yyyy"
              customInput={
                <input
                  type="text"
                  value={jobDetails.startDate}
                  onChange={handleManualStartDateChange}
                
                />
              }
            /> */}
              <DatePicker
        className="form-control datepicker"
        popupClassName="pop-up-box"
        onChange={(date, dateString) => handleChange(date, dateString, "startDate")}
        value={jobDetails.startDate.date || null}
        format="DD-MM-YYYY"
        placeholder="Select or enter start date (DD-MM-YYYY)"
        onBlur={(e) => handleBlur(e, "startDate")}
      />
          </div>

          <div className="form-group mt-3 w-100">
            <label htmlFor="endDate">Processing Period End Date:</label>

            {/* <DatePicker
              placeholderText="dd-MM-yyyy"
              id="endDate"
              name="endDate"
              selected={selectedEndDate}
              onChange={handleEndDateChange}
              dateFormat="dd-MM-yyyy"
              customInput={
                <input
                  type="text"
                  value={jobDetails.endDate}
                  onChange={handleManualEndDateChange}
                />
              }
            /> */}

<DatePicker
        className="form-control datepicker"
        popupClassName="pop-up-box"
        onChange={(date, dateString) => handleChange(date, dateString, "endDate")}
        value={jobDetails.endDate.date || null}
        format="DD-MM-YYYY"
        placeholder="Select or enter end date (DD-MM-YYYY)"
        onBlur={(e) => handleBlur(e, "endDate")}
      />
          </div>

          <button type="submit" className="custom-btn mt-4">
            {isLoading ? <SpinningLoader /> : "Add Job"}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const AddJobsModal = ({ setIsUpdated }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        <button className="custom-btn d-flex justify-content-center align-items-center gap-2">
          Add Job <span className="fw-light fs-4">+</span>
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
