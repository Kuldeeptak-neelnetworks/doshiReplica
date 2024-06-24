import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import { EyeIconWithCircle, eyeIcon } from "../../../utils/ImportingImages/ImportingImages";

const ContactComponent = ({ contact_no, primary_contact_no }) => {
  const contactNumbers = contact_no.split(",");

  return (
    <div>
      <span className="fw-bold">Contact No. : </span>
      {contactNumbers.map((number, index) => (
        <li
          key={index}
          style={{
            color: number === primary_contact_no ? "#00263d" : "black",
            fontWeight: number === primary_contact_no ? "bold" : "normal",
          }}
        >
          {number} {number === primary_contact_no && "(Primary Contact No.)"}
        </li>
      ))}
    </div>
  );
};

const EmailComponent = ({ primary_email, client_email }) => (
  <div>
    <span className="fw-bold">Email : </span>
    {client_email.split(",").map((address, index) => (
      <li
        key={index}
        style={{
          color: address === primary_email ? "#00263d" : "black",
          fontWeight: address === primary_email ? "bold" : "normal",
        }}
      >
        {address} {address === primary_email && " (Primary Email)"}
      </li>
    ))}
  </div>
);

const BillingAddressComponent = ({
  primary_billing_address,
  billing_address,
}) => (
  <div>
    <span className="fw-bold">Billing Address : </span>
    {billing_address.split("|").map((address, index) => (
      <li
        key={index}
        style={{
          color: address === primary_billing_address ? "#00263d" : "black",
          fontWeight: address === primary_billing_address ? "bold" : "normal",
        }}
      >
        {address} {address === primary_billing_address && " (Primary Address)"}
      </li>
    ))}
  </div>
);

const MyVerticallyCenteredModal = (props) => {
  const {
    company_name,
    consultant,
    bpo_no,
    primary_contact_no,
    contact_no,
    primary_email,
    billing_address,
    additional_comments,
    primary_billing_address,
  } = props?.clientData?.additional_data;
  const { client_email } = props?.clientData;

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
            <span className="modal-title">Client's Additional Data</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="modal-body"
        style={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        <div className="d-flex flex-column justify-content-center gap-3">
          {/* company Name  */}
          <div>
            <span className="fw-bold">Company Name : </span>
            <span>{company_name}</span>
          </div>
          {/* Bpo No.  */}
          <div className="d-flex align-items-center">
            <span className="fw-bold">BPO No. : </span>
            <spann className="mx-2">
              <Stack direction="horizontal">
                <Badge bg="warning" text="dark" style={{ fontSize: "1rem" }}>
                  {bpo_no}
                </Badge>
              </Stack>
            </spann>
          </div>
          {/* Contact number  */}
          <ContactComponent
            primary_contact_no={primary_contact_no}
            contact_no={contact_no}
          />
          {/* Email address  */}
          <EmailComponent
            primary_email={primary_email}
            client_email={client_email}
          />
          {/* Billing Address  */}
          <BillingAddressComponent
            billing_address={billing_address}
            primary_billing_address={primary_billing_address}
          />
          {/* Consultant Name  */}
          <div className="d-flex">
            <span className="fw-bold">Consultant : </span>
            <span>{consultant}</span>
          </div>
          {/* Additional Comments  */}
          <div>
            <span className="fw-bold">Additional Comments : </span>
            <span>{additional_comments}</span>
          </div>
          <hr />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export const ClientAdditionalDataModel = ({ clientData, setIsUpdated }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        className="d-flex"
        onClick={() => {
          setModalShow(true);
        }}
      >
        <EyeIconWithCircle/>
        {/* <img
          className="cursor-pointer"
          src={eyeIcon1}
          alt="eye-icon"
          id="togglePassword"
          style={{ height: "1.6vh" }}
        /> */}
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        clientData={clientData}
        setIsUpdated={setIsUpdated}
      />
    </>
  );
};


