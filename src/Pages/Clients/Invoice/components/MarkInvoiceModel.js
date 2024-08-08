import React, { useState, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

import { userIcon } from "../../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../../Components/ReactHotToast/ReactHotToast";
import { headerOptions } from "../../../../utils/utilities/utilityFunctions";

const MyVerticallyCenteredModal = (props) => {
  const { mainURL, getAllInvoice } = useContext(ContextAPI);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStatus = async (id) => {
    try {
      setIsLoading(() => true);
      const userId = localStorage.getItem("userId");

      const url = `${mainURL}update/invoice/${userId}/${id}/3`;
      const result = await axios.put(url, {}, { headers: headerOptions() });

      if (result.status === 200) {
        ReactHotToast(result.data.message, "success");
        props.setModalShow(false);
        // props.setIsUpdated((prev) => !prev);
        getAllInvoice();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // navigate("/unauthorized");
        ReactHotToast("Unauthorized access.");
      }
    } finally {
      setIsLoading(() => false);
      props.setModalShow(false);
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
            <img src={userIcon} height={20} width={20} alt="user-icon" />
            <span className="modal-title">Mark Invoice</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <div
          // onSubmit={handleDeleteTeam}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-2 w-100">
            <p className="text-center fs-5 w-100 m-auto">
              Would you like to mark this invoice
              <span className="mx-1">{props?.invoiceData?.invoice_code}</span>
              as paid? Please note that once it is marked as paid, it cannot be
              marked as unpaid again.
            </p>
          </div>
          <div className="d-flex gap-4 my-3">
            <button
              className="custom-btn"
              onClick={() => handleUpdateStatus(props?.invoiceData?.id)}
            >
              {isLoading ? <SpinningLoader /> : "Yes"}
            </button>
            <button className="custom-btn" onClick={props.onHide}>
              No
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export const MarkInvoiceModel = ({ invoiceData, setIsUpdated }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        className="custom-btn"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Mark
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        invoiceData={invoiceData}
        setisupdated={setIsUpdated}
        setModalShow={setModalShow}
      />
    </>
  );
};
