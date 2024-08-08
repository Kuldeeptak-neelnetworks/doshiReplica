import React, { useState, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";

import {
  EditSVG,
  userIcon,
} from "../../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../../Components/ReactHotToast/ReactHotToast";
import {
  handleAPIError,
  headerOptions,
} from "../../../../utils/utilities/utilityFunctions";

const MyVerticallyCenteredModal = (props) => {
  const { mainURL, logout } = useContext(ContextAPI);
  const [isLoading, setIsLoading] = useState(false);

  const [updatedBillingService, setUpdatedBillingService] = useState({
    billingServiceName: props?.billingServiceData?.services_name ?? null,
    billingServiceStatus: {},
  });

  const defaultValue = (options, value) => {
    return options.find((option) => option.value === value);
  };

  const statusOptions = [
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Suspended",
      value: "inactive",
    },
  ];

  // updating job category api
  const updateBillingService = async () => {
    const body = {
      current_user: +localStorage.getItem("userId"),
      service_id: props?.billingServiceData?.services_id,
      status: updatedBillingService.billingServiceStatus === "active" ? 1 : 2,
      service_name: updatedBillingService.billingServiceName,
    };

    const url = `${mainURL}services/billing`;

    setIsLoading(() => true);

    try {
      const result = await axios.put(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        ReactHotToast(result.data.message, "success");
        props.onHide();
        props.setIsUpdated((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
    }
  };

  const handleUpdateBillingService = (e) => {
    e.preventDefault();
    if (
      updatedBillingService.billingServiceName &&
      updatedBillingService.billingServiceStatus
    ) {
      updateBillingService();
    } else {
      ReactHotToast("Please provide Service name & status!", "error");
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
            <span className="modal-title">Update Billing Service </span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleUpdateBillingService}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-3 w-100">
            <label htmlFor="name">Billing Service Name:</label>
            <input
              id="name"
              name="name"
              placeholder="Eg: ITR Filling"
              type="text"
              required
              value={updatedBillingService.billingServiceName}
              onChange={(e) =>
                setUpdatedBillingService((prev) => ({
                  ...prev,
                  billingServiceName: e.target.value,
                }))
              }
            />
          </div>
          <div className="form-group mt-3 w-100">
            <label htmlFor="billingServiceStatus">Status:</label>
            <Select
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              isClearable={false}
              isSearchable={true}
              name="billingServiceStatus"
              defaultValue={() =>
                defaultValue(
                  statusOptions,
                  props?.billingServiceData?.service_status
                )
              }
              onChange={({ value }) =>
                setUpdatedBillingService((prev) => ({
                  ...prev,
                  billingServiceStatus: value,
                }))
              }
              options={statusOptions}
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

export const EditBillingServicesModal = ({
  billingServiceData,
  setIsUpdated,
}) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
          // console.log("billingServiceData: ", billingServiceData);
        }}
      >
        <EditSVG />
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        billingServiceData={billingServiceData}
        setIsUpdated={setIsUpdated}
      />
    </>
  );
};
