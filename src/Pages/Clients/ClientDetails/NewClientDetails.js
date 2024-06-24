import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import Select from "react-select";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";

import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import {
  addIcon,
  clientsIcon1,
  subtractIcon,
} from "../../../utils/ImportingImages/ImportingImages";
import Breadcrumbs from "../../../templates/Breadcrumbs";

import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import {
  handleAPIError,
  headerOptions,
  isTrue,
} from "../../../utils/utilities/utilityFunctions";

const breadCrumbs = [
  {
    pageName: "Home",
    pageURL: "/clients",
  },
  {
    pageName: "Clients",
    pageURL: "/clients",
  },
  {
    pageName: "Client Details",
    pageURL: "/client-details",
  },
];

const NewClientDetails = () => {
  const { clientId } = useParams();
  const { mainURL, logout, getAllClients, initialState } =
    useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);

  const [isUserValid, setIsUserValid] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const clientInitialDetails = {
    clientName: "",
    companyName: "",
    consultant: "",
    billingRate: "",
    jobs: [],
    selectedJob: null,
    contacts: [{ phone: "" }],
    emailIds: [{ email: "" }],
    businessAddressess: [{ address: "" }],
    comment: "",
    bpoNumber: "",
    primaryEmail: "",
    primaryContact: "",
    primaryAddress: "",
    accountingHead: "",
  };
  const [clientDetails, setClientDetails] = useState(clientInitialDetails);
  const [projectOptions, setProjectOptions] = useState([]);

  // fetching all clients
  useEffect(() => {
    getAllClients();
  }, [isUpdated]);

  // setting initial client details
  useEffect(() => {
    const clientInfo = initialState?.clientsList.find(
      (client) => client.client_id === clientId
    );

    const data = (string, type) =>
      string
        ?.split(type === "address" ? "|" : ",")
        .map((entry) => ({ [type]: entry }));

    const contacts = data(clientInfo?.additional_data?.contact_no, "phone");
    const emailIds = data(clientInfo?.client_email, "email");
    const businessAddressess = data(
      clientInfo?.additional_data?.billing_address,
      "address"
    );

    const clientDetails = {
      clientName: clientInfo?.client_name,
      companyName: clientInfo?.additional_data?.company_name,
      consultant: clientInfo?.additional_data?.consultant,
      billingRate: clientInfo?.additional_data?.billing_rates,
      jobs: clientInfo?.client_all_jobs ?? [],
      selectedJob: null,
      contacts,
      emailIds,
      businessAddressess,
      comment: clientInfo?.additional_data?.additional_comments,
      bpoNumber: clientInfo?.additional_data?.bpo_no ?? "",
      primaryEmail: clientInfo?.additional_data?.primary_email,
      primaryContact: clientInfo?.additional_data?.primary_contact_no,
      primaryAddress: clientInfo?.additional_data?.primary_billing_address,
      accountingHead: clientInfo?.additional_data?.accounting_head,
    };

    setClientDetails(clientDetails);

    // setting job options
    setProjectOptions(() =>
      clientDetails.jobs.map((job) => ({
        label: job.job_name,
        value: job.job_id,
      }))
    );
  }, [initialState.clientsList, clientId]);

  const addFields = (fieldKey, key) => {
    setClientDetails((prev) => ({
      ...prev,
      [fieldKey]: [...prev[fieldKey], { [key]: "" }],
    }));
  };

  const removeFields = (dataset, index, fieldKey) => {
    const updatedData = dataset.toSpliced(index, 1);
    setClientDetails((prev) => ({
      ...prev,
      [fieldKey]: updatedData,
    }));
  };

  const handleFields = (property, key, value, index) => {
    const updatedArray = clientDetails[property].map((item, i) =>
      i === index ? { [key]: value } : item
    );
    setClientDetails((prev) => ({
      ...prev,
      [property]: [...updatedArray],
    }));
  };

  const getJobDetails = () => {
    return clientDetails?.jobs?.find(
      (job) => job?.job_id === clientDetails?.selectedJob?.value
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  // updating client api
  const updateClient = async () => {
    const data = (dataset, type) =>
      dataset.map((entry) => entry[type]).join(type === "address" ? "|" : ",");

    const body = {
      current_user: localStorage.getItem("userId"),
      client_id: clientId,
      client_name: clientDetails?.clientName,
      email: data(clientDetails?.emailIds, "email"),
      contact_no: data(clientDetails?.contacts, "phone"),
      billing_address: data(clientDetails?.businessAddressess, "address"),
      consultant: clientDetails?.consultant,
      accounting_head: clientDetails?.accountingHead,
      company_name: clientDetails?.companyName,
      comment: clientDetails?.comment,
      bpo_no: clientDetails?.bpoNumber,
      primary_email: clientDetails?.primaryEmail,
      primary_contact_no: clientDetails?.primaryContact,
      primary_billing_address: clientDetails?.primaryAddress,
      billing_rates: clientDetails?.billingRate,
    };

    const url = `${mainURL}/update/client`;

    setIsUserValid(() => true);

    try {
      const result = await axios.put(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        ReactHotToast(result.data.message, "success");
        setIsUpdated((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsUserValid(() => false);
    }
  };

  const handleUpdateClient = (e) => {
    e.preventDefault();

    const {
      clientName,
      companyName,
      contacts,
      emailIds,
      businessAddressess,
      // consultant,
      bpoNumber,
      primaryEmail,
      primaryAddress,
      primaryContact,
      billingRate,
    } = clientDetails;

    const bool = [clientName, companyName, bpoNumber].every((input) =>
      isTrue(input)
    );

    const validContacts = contacts.every(({ phone }) => Boolean(phone?.trim()));
    const validEmailIds = emailIds.every(({ email }) => Boolean(email?.trim()));
    const validAddressess = businessAddressess.every(({ address }) =>
      Boolean(address?.trim())
    );

    if (
      bool &&
      validContacts &&
      validEmailIds &&
      validAddressess &&
      billingRate &&
      primaryEmail &&
      primaryAddress &&
      primaryContact
    ) {
      updateClient();
    } else {
      const conditions = {
        // [!isTrue(consultant)]: "Please input Consultant Name!",
        [!validAddressess]:
          businessAddressess.length > 0
            ? "Please input all Business Addressess or else remove the additional one!"
            : "Please input Business Address!",
        [!primaryAddress]: "Please select a Primary Address!",
        [!validContacts]:
          contacts.length > 0
            ? "Please input all Phone Numbers or else remove the additional one!"
            : "Please input Phone Number!",
        [!primaryContact]: "Please select a Primary Phone Number!",
        [!validEmailIds]:
          emailIds.length > 0
            ? "Please input all Email Ids or else remove the additional one!"
            : "Please input Email Id!",
        [!primaryEmail]: "Please select a Primary Email!",
        [!billingRate]: "Please input Billing Rate!",
        [!isTrue(companyName)]: "Please input Company Name!",
        [!isTrue(bpoNumber)]: "Please input client's BPO number!",
        [!isTrue(clientName)]: "Please input Client Name!",
      };
      const errorMessage = conditions[true];
      if (errorMessage) {
        ReactHotToast(errorMessage, "error");
      }
    }
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      <section className="main-content_header">
        <div className="d-flex justify-content-start align-items-center page-heading w-100 custom-border-bottom">
          <img src={clientsIcon1} alt="clients" />
          <p className="m-0 fs-4">Client Details</p>
        </div>
      </section>

      <section className="main-content_form-section gap-5 d-flex align-items-start w-75 m-auto">
        <form onSubmit={handleUpdateClient} className="w-50">
          {/* client name */}
          <div className="form-group mt-5">
            <label htmlFor="clientName">Client Name:</label>
            <input
              id="clientName"
              name="clientName"
              placeholder="Eg: Raj Shah"
              type="text"
              required
              value={clientDetails?.clientName}
              onChange={(e) => handleChange(e)}
            />
          </div>
          {/* BPO no. */}
          <div className="form-group mt-4">
            <label htmlFor="bpoNumber">Client BPO No:</label>
            <input
              id="bpoNumber"
              name="bpoNumber"
              placeholder="Eg: BPO101"
              type="text"
              required
              value={clientDetails?.bpoNumber}
              onChange={(e) => handleChange(e)}
            />
          </div>
          {/* company name */}
          <div className="form-group mt-4">
            <label htmlFor="companyName">Company Name:</label>
            <input
              id="companyName"
              name="companyName"
              placeholder="Eg: Raj Industries"
              type="text"
              required
              value={clientDetails?.companyName}
              onChange={(e) => handleChange(e)}
            />
          </div>
          {/* billing rate */}
          <div className="form-group mt-4">
            <label htmlFor="billingRate">Billing Rate:</label>
            <input
              id="billingRate"
              name="billingRate"
              placeholder="Eg: £100"
              type="text"
              required
              value={clientDetails?.billingRate}
              onChange={(e) => handleChange(e)}
            />
          </div>
          {/* email id's */}
          <div className="form-group mt-4">
            <label htmlFor="email">Email Addresses:</label>
            {clientDetails?.emailIds?.map((email, index) => (
              <div
                key={index}
                name="primaryEmail"
                className="w-100 d-flex justify-content-between align-items-center gap-2"
              >
                <input
                  type="radio"
                  id={`primaryEmail-${index + 1}`}
                  name="primaryEmail"
                  value={email?.email}
                  onChange={(e) => {
                    setClientDetails((prev) => ({
                      ...prev,
                      primaryEmail: e.target.value,
                    }));
                  }}
                  checked={email?.email === clientDetails?.primaryEmail}
                  style={{ width: "max-content", cursor: "pointer" }}
                />
                <input
                  id="email"
                  name="email"
                  placeholder="Eg: rajshah@gmail.com"
                  type="email"
                  required
                  value={email.email}
                  onChange={(e) => {
                    if (email?.email === clientDetails?.primaryEmail) {
                      setClientDetails((prev) => ({
                        ...prev,
                        primaryEmail: e.target.value,
                      }));
                    }
                    handleFields("emailIds", "email", e.target.value, index);
                  }}
                />

                {/* Add New Email */}
                {clientDetails?.emailIds?.length - 1 === index &&
                  clientDetails?.emailIds?.length < 5 && (
                    <div>
                      <Tooltip
                        id="add-email-tooltip"
                        style={{
                          background: "#000",
                          color: "#fff",
                        }}
                        opacity={0.9}
                      />
                      <img
                        src={addIcon}
                        data-tooltip-id="add-email-tooltip"
                        data-tooltip-content="Add Alternate Email"
                        data-tooltip-place="top"
                        alt="add email"
                        className="cursor-pointer"
                        onClick={() => addFields("emailIds", "email")}
                      />
                    </div>
                  )}

                {/* Remove Email Icon */}
                {clientDetails?.emailIds?.length > 1 && (
                  <div>
                    <Tooltip
                      id="remove-email-tooltip"
                      style={{
                        background: "#000",
                        color: "#fff",
                      }}
                      opacity={0.9}
                    />
                    <img
                      src={subtractIcon}
                      data-tooltip-id="remove-email-tooltip"
                      data-tooltip-content="Remove Alternate Email"
                      data-tooltip-place="top"
                      alt="remove email"
                      className="cursor-pointer"
                      onClick={() => {
                        if (email?.email === clientDetails?.primaryEmail) {
                          setClientDetails((prev) => ({
                            ...prev,
                            primaryEmail: "",
                          }));
                        }
                        removeFields(clientDetails.emailIds, index, "emailIds");
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* phone numbers */}
          <div className="form-group mt-4">
            <label htmlFor="contact">Phone Number:</label>
            {clientDetails?.contacts?.map((contact, index) => (
              <div
                key={index}
                className="w-100 d-flex justify-content-between align-items-center gap-2"
              >
                <input
                  type="radio"
                  id={`primaryContact-${index + 1}`}
                  name="primaryContact"
                  value={contact?.phone}
                  onChange={(e) =>
                    setClientDetails((prev) => ({
                      ...prev,
                      primaryContact: e.target.value,
                    }))
                  }
                  checked={contact?.phone === clientDetails?.primaryContact}
                  style={{ width: "max-content", cursor: "pointer" }}
                />
                <input
                  id="contact"
                  name="contact"
                  placeholder="Eg: 0000 0000"
                  type="number"
                  required
                  value={contact.phone}
                  onChange={(e) => {
                    if (contact?.phone === clientDetails?.primaryContact) {
                      setClientDetails((prev) => ({
                        ...prev,
                        primaryContact: e.target.value,
                      }));
                    }
                    handleFields("contacts", "phone", e.target.value, index);
                  }}
                />

                {/* Add New Contact Icon */}
                {clientDetails?.contacts?.length - 1 === index &&
                  clientDetails?.contacts?.length < 5 && (
                    <div>
                      <Tooltip
                        id="add-contact-tooltip"
                        style={{
                          background: "#000",
                          color: "#fff",
                        }}
                        opacity={0.9}
                      />
                      <img
                        src={addIcon}
                        data-tooltip-id="add-contact-tooltip"
                        data-tooltip-content="Add Alternate Contact"
                        data-tooltip-place="top"
                        alt="add contact"
                        className="cursor-pointer"
                        onClick={() => addFields("contacts", "phone")}
                      />
                    </div>
                  )}

                {/* Remove Contact Icon */}
                {clientDetails?.contacts?.length > 1 && (
                  <div>
                    <Tooltip
                      id="remove-contact-tooltip"
                      style={{
                        background: "#000",
                        color: "#fff",
                      }}
                      opacity={0.9}
                    />
                    <img
                      src={subtractIcon}
                      data-tooltip-id="remove-contact-tooltip"
                      data-tooltip-content="Remove Alternate Contact"
                      data-tooltip-place="top"
                      alt="remove contact"
                      className="cursor-pointer"
                      onClick={() => {
                        if (contact?.phone === clientDetails?.primaryContact) {
                          setClientDetails((prev) => ({
                            ...prev,
                            primaryContact: "",
                          }));
                        }
                        removeFields(clientDetails.contacts, index, "contacts");
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* business address */}
          <div className="form-group mt-4">
            <label htmlFor="businessAddress">Business Address:</label>
            {clientDetails?.businessAddressess?.map((address, index) => (
              <div
                key={index}
                className="w-100 d-flex justify-content-between align-items-center gap-2"
              >
                <input
                  type="radio"
                  id={`primaryAddress-${index + 1}`}
                  name="primaryAddress"
                  value={address?.address}
                  onChange={(e) =>
                    setClientDetails((prev) => ({
                      ...prev,
                      primaryAddress: e.target.value,
                    }))
                  }
                  checked={address?.address === clientDetails?.primaryAddress}
                  style={{ width: "max-content", cursor: "pointer" }}
                />
                <input
                  id="businessAddress"
                  name="businessAddress"
                  placeholder="Eg. A-204, Bhoomi Utsav, M G Road, Kandivali West, Mumbai, Maharashtra 400067"
                  type="text"
                  required
                  value={address.address}
                  onChange={(e) => {
                    if (address?.address === clientDetails?.primaryAddress) {
                      setClientDetails((prev) => ({
                        ...prev,
                        primaryAddress: e.target.value,
                      }));
                    }
                    handleFields(
                      "businessAddressess",
                      "address",
                      e.target.value,
                      index
                    );
                  }}
                />

                {/* Add New Address Icon */}
                {clientDetails?.businessAddressess?.length - 1 === index &&
                  clientDetails?.businessAddressess?.length < 5 && (
                    <div>
                      <Tooltip
                        id="add-address-tooltip"
                        style={{
                          background: "#000",
                          color: "#fff",
                        }}
                        opacity={0.9}
                      />
                      <img
                        src={addIcon}
                        data-tooltip-id="add-address-tooltip"
                        data-tooltip-content="Add Alternate Address"
                        data-tooltip-place="top"
                        alt="add address"
                        className="cursor-pointer"
                        onClick={() =>
                          addFields("businessAddressess", "address")
                        }
                      />
                    </div>
                  )}

                {/* Remove Address Icon */}
                {clientDetails?.businessAddressess?.length > 1 && (
                  <div>
                    <Tooltip
                      id="remove-address-tooltip"
                      style={{
                        background: "#000",
                        color: "#fff",
                      }}
                      opacity={0.9}
                    />
                    <img
                      src={subtractIcon}
                      data-tooltip-id="remove-address-tooltip"
                      data-tooltip-content="Remove Alternate Address"
                      data-tooltip-place="top"
                      alt="remove address"
                      className="cursor-pointer"
                      onClick={() => {
                        if (
                          address?.address === clientDetails?.primaryAddress
                        ) {
                          setClientDetails((prev) => ({
                            ...prev,
                            primaryAddress: "",
                          }));
                        }
                        removeFields(
                          clientDetails.businessAddressess,
                          index,
                          "businessAddressess"
                        );
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* accounting head */}
          <div className="form-group mt-4">
            <label htmlFor="accountingHead">Accounting Head:</label>
            <input
              id="accountingHead"
              name="accountingHead"
              placeholder="Eg: Satish Kumar"
              type="text"
              // required
              value={clientDetails?.accountingHead}
              onChange={(e) => handleChange(e)}
            />
          </div>
          {/* consultant name */}
          <div className="form-group mt-4">
            <label htmlFor="consultant">Consultant Name:</label>
            <input
              id="consultant"
              name="consultant"
              placeholder="Eg: XYZ"
              type="text"
              // required
              value={clientDetails?.consultant}
              onChange={(e) => handleChange(e)}
            />
          </div>
          {/* comment */}
          <div className="form-group mt-4">
            <label htmlFor="comment">Comment:</label>
            <input
              id="comment"
              name="comment"
              placeholder="Eg: comments..."
              type="text"
              value={clientDetails?.comment}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <button type="submit" className="mt-4 custom-btn">
            {isUserValid ? <SpinningLoader /> : "Update"}
          </button>
        </form>
        {/* project details */}
        <div className="w-50">
          <div className="form-group mt-5">
            <label htmlFor="clientName">Project Details:</label>
            <Select
              name="teamStatus"
              closeMenuOnSelect={true}
              options={projectOptions}
              onChange={(option) =>
                setClientDetails((prev) => ({
                  ...prev,
                  selectedJob: option,
                }))
              }
              value={clientDetails.selectedJob}
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
            />
          </div>
          {clientDetails.selectedJob && (
            <div className={`projectDetails mt-4`}>
              <div className="d-flex align-items-center gap-3 mt-2">
                <p className={`bigText fs-5 m-0`}>
                  Project Name:{" "}
                  <span className={`smallText fs-6`}>
                    {clientDetails.selectedJob.label}
                  </span>
                </p>
                <Stack direction="horizontal">
                  {getJobDetails()?.job_status === "Completed" ? (
                    <Badge bg="success">Completed</Badge>
                  ) : getJobDetails()?.job_status === "On Hold" ? (
                    <Badge bg="danger">On Hold</Badge>
                  ) : (
                    <Badge bg="warning" text="dark">
                      In Progress
                    </Badge>
                  )}
                </Stack>
              </div>
              <p className="fs-5 m-0 mt-3">Accountant Assigned: </p>
              <p className="fs-6 m-0">{getJobDetails()?.assign_to}</p>
              <p className="fs-5 m-0 mt-3">Status: </p>
              <p className="fs-6 m-0">{getJobDetails()?.job_status}</p>
              {getJobDetails()?.job_status === "Completed" && (
                <>
                  <p className="fs-5 m-0 mt-3">Invoice Generated: </p>
                  <p className="fs-6 m-0">
                    {getJobDetails()?.invoice_genrated}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewClientDetails;
