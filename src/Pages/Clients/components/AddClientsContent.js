import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Tooltip } from "react-tooltip";

import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import {
  addIcon,
  clientsIcon1,
  subtractIcon,
} from "../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import Breadcrumbs from "../../../templates/Breadcrumbs";

import {
  handleAPIError,
  headerOptions,
} from "../../../utils/utilities/utilityFunctions";

const AddClientsContent = () => {
  const { mainURL, logout, getAllJobCategories } = useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);

  const [isLoading, setIsLoading] = useState(false);
  const [clientDetails, setClientDetails] = useState({
    clientName: "",
    companyName: "",
    email: "",
    phone: "",
    businessAddress: "",
    consultant: "",
    comment: "",
    bpoNumber: "",
    billingRate: 0,
    accountingHead: "",
  });

  useEffect(() => {
    getAllJobCategories();
  }, []);

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
      pageName: "Add Client",
      pageURL: "/add-client",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Adding New Client API
  const addNewClient = async () => {
    const body = {
      current_user: localStorage.getItem("userId"),
      client_name: clientDetails.clientName,
      company_name: clientDetails.companyName,
      email: clientDetails.email,
      contact_no: clientDetails.phone,
      billing_address: clientDetails.businessAddress,
      consultant: clientDetails.consultant,
      comment: clientDetails.comment,
      bpo_no: clientDetails.bpoNumber,
      billing_rates: clientDetails.billingRate,
      accounting_head: clientDetails.accountingHead,
    };

    setIsLoading(() => true);

    try {
      const url = `${mainURL}/add-new/client`;
      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 201) {
        ReactHotToast(result?.data?.message, "success");
        setClientDetails({
          clientName: "",
          companyName: "",
          email: "",
          phone: "",
          businessAddress: "",
          consultant: "",
          comment: "",
          bpoNumber: "",
          billingRate: 0,
          accountingHead: "",
        });
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
    }
  };

  const handleNewClient = (e) => {
    e.preventDefault();

    const {
      clientName,
      companyName,
      email,
      phone,
      businessAddress,
      consultant,
      bpoNumber,
      billingRate,
      accountingHead,
    } = clientDetails;

    const bool =
      clientName &&
      companyName &&
      email &&
      phone &&
      businessAddress &&
      consultant &&
      bpoNumber &&
      billingRate &&
      accountingHead;

    if (bool) {
      addNewClient();
    } else {
      const conditions = {
        // [!consultant]: "Please input client consultant!",
        [!billingRate]: "Please input billing rate!",
        // [!accountingHead]: "Please input accounting head",
        [!businessAddress]: "Please input client address!",
        [!phone]: "Please input client contact!",
        [!email]: "Please input client email!",
        [!companyName]: "Please input company name!",
        [!bpoNumber]: "Please input client's BPO number!",
        [!clientName]: "Please input client name!",
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
          <p className="m-0 fs-4">Add Clients</p>
        </div>
      </section>

      <section className="main-content_form-section d-flex justify-content-center align-items-start w-100">
        {/* <div class="row">
  <div class="col-sm-6 mb-3 mb-sm-0">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Special title treatment</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Special title treatment</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
  
</div> */}

        <form onSubmit={handleNewClient} className="w-100">
          <div className=" mt-5">
            <div class="row d-flex justify-content-center">
              <div className="form-group col-sm-4  ">
                <label htmlFor="clientName">Client Name:</label>
                <input
                  id="clientName"
                  name="clientName"
                  placeholder="Eg: Raj Shah"
                  type="text"
                  required
                  value={clientDetails.clientName}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="form-group col-sm-4  ">
                <label htmlFor="bpoNumber">Client BPO No:</label>
                <input
                  id="bpoNumber"
                  name="bpoNumber"
                  placeholder="Eg: DO101..."
                  max={10}
                  type="text"
                  value={clientDetails?.bpoNumber}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
            </div>

            <div class="row d-flex justify-content-center mt-3">
              <div className="form-group  col-sm-4 ">
                <label htmlFor="companyName">Company Name:</label>
                <input
                  id="companyName"
                  name="companyName"
                  placeholder="Eg: Raj Industries"
                  type="text"
                  required
                  value={clientDetails.companyName}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="form-group col-sm-4 ">
                <label htmlFor="email">Primary Email Id:</label>
                <input
                  id="email"
                  name="email"
                  placeholder="Eg: rajshah@gmail.com"
                  type="email"
                  required
                  value={clientDetails.email}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div class="row d-flex justify-content-center mt-3">
              {" "}
              <div className="form-group  col-sm-4 ">
                <label htmlFor="phone">Phone Number:</label>
                <input
                  id="phone"
                  name="phone"
                  placeholder="Eg: 0000 0000"
                  type="number"
                  required
                  value={clientDetails.phone}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="form-group col-sm-4 ">
                <label htmlFor="billingRate">Billing Rate:</label>
                <input
                  id="billingRate"
                  name="billingRate"
                  placeholder="Eg: £ 150"
                  type="number"
                  // min={1}
                  // required
                  value={clientDetails.billingRate}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div class="row d-flex justify-content-center mt-3">
              <div className="form-group col-sm-4 ">
                <label htmlFor="businessAddress">Business Address:</label>
                <input
                  id="businessAddress"
                  name="businessAddress"
                  type="text"
                  required
                  placeholder="Eg. A-204, Bhoomi Utsav, M G Road, Kandivali West, Mumbai, Maharashtra 400067"
                  value={clientDetails.businessAddress}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="form-group col-sm-4">
                <label htmlFor="consultant">Consultant:</label>
                <input
                  id="consultant"
                  name="consultant"
                  placeholder="Eg: XYZ"
                  type="text"
                  required
                  value={clientDetails.consultant}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div class="row d-flex justify-content-center mt-3">
              <div className="form-group col-sm-4">
                <label htmlFor="accountingHead">Accounting Head:</label>
                <input
                  id="accountingHead"
                  name="accountingHead"
                  placeholder="Eg: John Doe"
                  type="text"
                  // required
                  value={clientDetails.accountingHead}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="form-group col-sm-4">
                <label htmlFor="comment">Comment (optional):</label>
                <input
                  id="comment"
                  name="comment"
                  placeholder="Eg: comments..."
                  type="text"
                  value={clientDetails.comment}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="mt-5 custom-btn d-flex justify-content-center m-auto"
          >
            {isLoading ? <SpinningLoader /> : "Save"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddClientsContent;
