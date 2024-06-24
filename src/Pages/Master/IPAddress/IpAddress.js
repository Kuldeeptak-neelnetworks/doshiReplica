import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Breadcrumbs from "../../../templates/Breadcrumbs";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import removeImg from "../../../assets/images/remove.png";
import {
  headerOptions,
  handleAPIError,
} from "../../../utils/utilities/utilityFunctions";

import {
  PlusIconSVG,
  settingsIcon1,
} from "../../../utils/ImportingImages/ImportingImages";
const IpAddress = () => {
  const { mainURL, logout } = useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const [ipAddress, setIpAddress] = useState([]);
  const [ipAddressList, setIpAddressList] = useState([]);
  const [hideIpButton, setHideIpButton] = useState(false);
  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Ip Address",
      pageURL: "/ip-address",
    },
  ];

  const addIpAddressData = async () => {
    try {
      const url = `${mainURL}add/allow-ip-address`;
      const body = {
        ip_address: ipAddress.map((item) => item.ipAddress.trim()),
        current_user: localStorage.getItem("userId") || null,
      };
      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 201) {
        ReactHotToast(result?.data?.message, "success");
        setIpAddress([]);
        showIpAddress();
        setHideIpButton(false);
      }
    } catch (e) {
      handleAPIError(e, logout);
    }
  };
  const handleAddIpAddress = (e) => {
    e.preventDefault();
    if (!ipAddress) {
      ReactHotToast("Please enter an IP address!", "error");
      return;
    }
    addIpAddressData();
  };
  const handleInputChange = (index, value) => {
    const updatedIpAddress = [...ipAddress];
    updatedIpAddress[index] = { ipAddress: value };
    setIpAddress(updatedIpAddress);
  };
  const handleRemoveInput = (index) => {
    const updatedIpAddress = [...ipAddress];
    updatedIpAddress.splice(index, 1);
    setIpAddress(updatedIpAddress);
    if (index == "0") {
      setHideIpButton(false);
    }
  };

  const handleAddInput = () => {
    setIpAddress([...ipAddress, ""]);
    setHideIpButton(true);
  };

  const showIpAddress = async () => {
    const userId = localStorage.getItem("userId") ?? null;
    const url = `${mainURL}get/allow-ip-address/${userId}`;

    try {
      const result = await axios.get(url, { headers: headerOptions() });
      const ipAddress = result?.data?.ip_addresses ?? [];
      setIpAddressList(ipAddress);
    } catch (error) {
      handleAPIError(error);
      console.error("Error fetching ip address:", error);
    }
  };
  useEffect(() => {
    showIpAddress();
  }, []);

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>
      <section className="main-content_header">
        <div className="d-flex justify-content-start align-items-center page-heading w-100 custom-border-bottom">
          <img src={settingsIcon1} alt="clients" />
          <p className="m-0 fs-4">IP Address</p>
        </div>
      </section>

      {/* Top header section */}
      <div className="mb-5 relative-wrapper zIndex-2"></div>

      <div class="m-auto mt-3 gap-5 main-content_form-section d-flex w-50">
        <div className="dashboard-block d-flex flex-1 flex-column gap-1 ">
          <div className="block-header d-flex justify-content-between  w-100">
            <p className="block-title m-0">Allowed IP Address</p>
          </div>

          <div className="block-content w-95 mt-1">
            <span
              className="ipAddress-btn d-flex justify-content-center align-items-center gap-2"
              onClick={handleAddInput}
            >
              Add IP Address <span class="fw-light fs-4">+</span>
            </span>
          </div>
          <div className="w-100 ">
            <form className="" onSubmit={handleAddIpAddress}>
              {ipAddress.map((value, index) => (
                <div className="d-flex" key={index}>
                  <div className="form-group w-50">
                    <label>Ip Address:</label>
                    <input
                      id={`ipAddress-${index}`}
                      name={`ipAddress-${index}`}
                      placeholder="Enter IP address"
                      type="text"
                      required
                      value={value.ipAddress}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  </div>
                  <div style={{ marginTop: "21px", padding: "0px 22px" }}>
                    <span onClick={() => handleRemoveInput(index)}>
                      {" "}
                      <img
                        src={removeImg}
                        style={{ width: "32px", cursor: "pointer" }}
                        alt="Remove"
                      />
                    </span>
                  </div>
                  <div style={{ marginTop: "21px" }} onClick={handleAddInput}>
                    <PlusIconSVG />
                  </div>
                </div>
              ))}
              {hideIpButton ? (
                <button type="submit" className="mt-4 custom-btn">
                  Add
                </button>
              ) : (
                ""
              )}
            </form>
          </div>
          <div>
            {ipAddressList.map((value) => (
              <div className="ipAddressList">
                <p>IP Address: {value.allow_ips}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IpAddress;
