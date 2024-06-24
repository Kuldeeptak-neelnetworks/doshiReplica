import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";

import { EyeIconWithCircle } from "../../../../utils/ImportingImages/ImportingImages";

const MyVerticallyCenteredModal = (props) => {
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
            <span className="modal-title">Client's Jobs</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="modal-body"
        style={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        <div className="d-flex flex-column justify-content-center ">
          {Array.isArray(props.clientData.jobs) ? (
            props.clientData.jobs.map((item) => (
              <div
                className="d-flex flex-column justiy-column-start gap-2"
                stye
                key={item?.jobs_id}
              >
                <div>
                  <span className="fw-bold">Job Name : </span>
                  <span>{item.job_name}</span>
                </div>
                <div>
                  <span className="fw-bold">Assign To : </span>
                  <span>{item.assign_to}</span>
                </div>
                <div>
                  <span className="fw-bold">Assign On : </span>
                  <span>{item?.assigned_on}</span>
                </div>
                <div>
                  <span className="fw-bold">BPO No. : </span>
                  <span>
                    {props?.clientData?.additional_data
                      ? JSON.parse(props?.clientData?.additional_data).bpo_no
                      : ""}
                  </span>
                </div>
                <div>
                  <span className="fw-bold">Job Code : </span>
                  <span>{item.job_code}</span>
                </div>
                <div className="d-flex">
                  <span className="fw-bold">Job Status : </span>
                  <spann className="mx-2">
                    <Stack direction="horizontal">
                      {item.job_status === "Completed" ? (
                        <Badge bg="success">Completed</Badge>
                      ) : item.job_status === "On Hold" ? (
                        <Badge bg="danger">On Hold</Badge>
                      ) : (
                        <Badge bg="warning" text="dark">
                          In Progress
                        </Badge>
                      )}
                    </Stack>
                  </spann>
                </div>
                <div>
                  <span className="fw-bold">Due On : </span>
                  <span>{item.due_on}</span>
                </div>
                <hr />
              </div>
            ))
          ) : (
            <li>{props.clientData.jobs}</li>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export const ClientWiseReportModal = ({ clientData, setIsUpdated }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        <div className="">
          <EyeIconWithCircle />
          {/* <EyeIconSVG /> */}
        </div>
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
