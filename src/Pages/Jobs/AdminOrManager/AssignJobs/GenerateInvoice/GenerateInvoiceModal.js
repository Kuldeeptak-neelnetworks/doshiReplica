import React, { useState, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";

import {
  PlusIconSVG,
  invoiceIcon,
} from "../../../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../../../Components/ReactHotToast/ReactHotToast";
import {
  headerOptions,
  handleAPIError,
} from "../../../../../utils/utilities/utilityFunctions";

const MyVerticallyCenteredModal = (props) => {
  const { mainURL, logout } = useContext(ContextAPI);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // generate invoice api
  const generateInvoice = async () => {
    setIsLoading(() => true);

    const userId = localStorage.getItem("userId") ?? null;
    const url =
      props.type === "invoice"
        ? `${mainURL}generate/invoice/${+userId}/${+props.jobData.assign_id}`
        : `${mainURL}invoices/generate/post-draft/${+userId}/${+props.jobData
            .assign_id}`;

    try {
      const result = await axios.get(url, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        ReactHotToast(result?.data?.message, "success");
        props.setisupdated((prev) => !prev);
        navigate("/invoice", {
          state: {
            invoiceMeta: result.data.invoice_meta,
            assignId: +props.jobData.assign_id,
          },
        });
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
      props.onHide();
    }
  };

  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    generateInvoice();
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
            <img src={invoiceIcon} height={20} width={20} alt="user-icon" />
            <span className="modal-title">Generate Invoice</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleGenerateInvoice}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-2 w-100">
            <p className="text-center fs-5 w-100 m-auto">
              Generate{" "}
              {props.type === "invoice"
                ? "Invoice"
                : "Post Draft Changes Invoice"}{" "}
              for {props?.jobData?.job_name}?
            </p>
          </div>
          <button type="submit" className="custom-btn mt-4">
            {isLoading ? <SpinningLoader /> : "Generate"}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const GenerateInvoiceModal = ({ jobData, setIsUpdated, type }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        <PlusIconSVG />
      </div>

      <MyVerticallyCenteredModal
        type={type}
        show={modalShow}
        onHide={() => setModalShow(false)}
        jobData={jobData}
        setisupdated={setIsUpdated}
      />
    </>
  );
};
