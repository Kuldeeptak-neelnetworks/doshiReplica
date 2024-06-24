import React, { useState, useContext, useMemo, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import ReactQuill from "react-quill";
import CreatableSelect from "react-select/creatable";
import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import {
  headerOptions,
  handleAPIError,
} from "../../../utils/utilities/utilityFunctions";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import {
  MailIconSVG,
  MailIconWithCircle,
  invoiceIcon,
} from "../../../utils/ImportingImages/ImportingImages";

import "react-quill/dist/quill.snow.css";
import styles from "../Invoices.module.css";

const MyVerticallyCenteredModal = ({
  invoiceId,
  assignId,
  onHide,
  show,
  row,
  clientPrimaryEmail,
  setIsUpdated,
  clientEmailOptions,
  emailOptions,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mainURL, logout, getAllInvoice } = useContext(ContextAPI);
  const [mailDetails, setMailDetails] = useState({
    to: "",
    subject: "",
  });
  const [emailBody, setEmailBody] = useState("");

  // for React quill editor
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
    ],
  };

  const handleClear = () => {
    setEmailBody("");
    setMailDetails({
      to: "",
      subject: "",
    });
  };

  // Once Invoice is Edited & Previewed, User can Email the same
  const mailInvoice = async () => {
    try {
      setIsLoading(() => true);
      const userId = localStorage.getItem("userId") ?? null;
      const url = `${mainURL}sent-email-invoice`;

      const body = {
        current_user: userId,
        invoice_id: invoiceId,
        assign_job_id: assignId,
        send_to: mailDetails.to.value,
        email_subject: mailDetails.subject,
        email_body: emailBody,
      };

      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });

      // console.log("mail invoice result: ", result);

      if (result.status === 200) {
        ReactHotToast(result.data.message, "success");
        handleClear();
        getAllInvoice();
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
      onHide();
    }
  };

  const handleMailInvoice = (e) => {
    e.preventDefault();

    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/;

    if (mailDetails.to?.value && mailDetails.subject && emailBody) {
      if (emailRegex.test(mailDetails.to.value)) {
        mailInvoice();
      } else {
        ReactHotToast(
          "Invalid email address. Please enter a valid email.",
          "error"
        );
      }
    } else {
      if (!mailDetails.to?.value) {
        ReactHotToast(
          "Please provide an email address to whom you want to send the invoice",
          "error"
        );
      } else if (!emailRegex.test(mailDetails.to.value)) {
        ReactHotToast(
          "Invalid email address. Please enter a valid email.",
          "error"
        );
      } else if (mailDetails.subject.trim() === "") {
        ReactHotToast("Please input the email subject", "error");
      } else if (emailBody.trim() === "") {
        ReactHotToast("Please input the email body", "error");
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="pt-3 pb-1" closeButton>
        <Modal.Title className="w-100" id="contained-modal-title-vcenter">
          <div className="d-flex justify-content-center align-items-center gap-3">
            <img src={invoiceIcon} height={20} width={20} alt="user-icon" />
            <span className="modal-title">Mail Invoice</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleMailInvoice}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-3 w-100">
            <label htmlFor="from">From:</label>

            {Object.keys(row).some((item) => item === "client_email") ? (
              <input
                id="from"
                name="from"
                placeholder="Eg: john@gmail.com"
                type="email"
                value={clientPrimaryEmail}
              />
            ) : (
              <input
                id="from"
                name="from"
                placeholder="Eg: john@gmail.com"
                type="email"
                value="invoice@doshioutsourcing.com"
                disabled
              />
            )}
          </div>

          <div className="form-group mt-3 w-100">
            <label className="" htmlFor="to">
              To:
            </label>

            {Object.keys(row).some((item) => item === "client_email") ? (
              <CreatableSelect
                className="react-select-custom-styling__container"
                classNamePrefix="react-select-custom-styling"
                isClearable={true}
                isSearchable={true}
                name="to"
                value={mailDetails.to}
                onChange={(option) =>
                  setMailDetails((prevState) => ({
                    ...prevState,
                    to: option,
                  }))
                }
                options={clientEmailOptions}
                placeholder="Select or add new email"
              />
            ) : (
              <CreatableSelect
                className="react-select-custom-styling__container"
                classNamePrefix="react-select-custom-styling"
                isClearable={true}
                isSearchable={true}
                name="to"
                value={mailDetails.to}
                onChange={(option) =>
                  setMailDetails((prevState) => ({
                    ...prevState,
                    to: option,
                  }))
                }
                options={emailOptions}
                placeholder="Select or add new email"
              />
            )}
          </div>

          <div className="form-group mt-3 w-100">
            <label htmlFor="subject">Subject:</label>
            <input
              id="subject"
              name="subject"
              placeholder="Eg: Invoice Copy for ITR Filling service"
              type="text"
              value={mailDetails.subject}
              onChange={(e) =>
                setMailDetails((prev) => ({ ...prev, subject: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group mt-3 w-100">
            <label htmlFor="message">Message:</label>
            <ReactQuill
              theme="snow"
              value={emailBody}
              onChange={setEmailBody}
              placeholder="Write a short brief about the invoice..."
              modules={modules}
              className={styles.reactQuillEditor}
            />
          </div>

          <div className="form-group mt-3 w-100">
            <label htmlFor="message">📁 Invoice Attached</label>
          </div>

          <button type="submit" className="custom-btn mt-4">
            {isLoading ? <SpinningLoader /> : "Send"}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const SendInvoiceModal = ({
  setIsUpdated,
  assignId,
  invoice,
  invoiceId,
  mailIcon,
  data,
  listOfEmails = false,
  listOfClientEmail = false,
  clientPrimaryEmail = false,
}) => {
  const [modalShow, setModalShow] = useState(false);

  const clientEmailOptions = Array.isArray(listOfClientEmail)
    ? listOfClientEmail
    : typeof invoice === "string"
    ? invoice.split(",")?.map((email) => ({ label: email, value: email }))
    : [];

  const emailOptions = listOfEmails
    ? listOfEmails
    : invoice?.client?.allEmails
        ?.split(",")
        ?.map((email) => ({ label: email, value: email }));

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        {mailIcon ? (
          <MailIconWithCircle />
        ) : (
          // <MailIconSVG />
          <button className="custom-btn d-flex justify-content-center align-items-center gap-2">
            Mail
          </button>
        )}
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setIsUpdated={setIsUpdated}
        assignId={assignId}
        invoiceId={invoiceId}
        emailOptions={emailOptions}
        clientEmailOptions={clientEmailOptions}
        clientPrimaryEmail={clientPrimaryEmail}
        row={data}
      />
    </>
  );
};
