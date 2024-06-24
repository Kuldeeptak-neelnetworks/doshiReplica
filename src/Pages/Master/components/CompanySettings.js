import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import axios from "axios";
import Breadcrumbs from "../../../templates/Breadcrumbs";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import removeImg from "../../../assets/images/remove.png";
import {
  headerOptions,
  handleAPIError,
} from "../../../utils/utilities/utilityFunctions";
import PageHeader from "../../../templates/PageHeader";
import { reportsIcon, settingsIcon1 } from "../../../utils/ImportingImages/ImportingImages";
import {
  addIcon,
  clientsIcon1,
  subtractIcon,
} from "../../../utils/ImportingImages/ImportingImages";

const CompanySettings = () => {
  const { mainURL, logout } = useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const [isLoading, setIsLoading] = useState("");
  const [loading, setLoading] = useState("");
  
  const [companyDetails, setCompanyDetails] = useState({
    email: "",
    companyName: "",
    companyEmail: "",
    companyContactNo: "",
    companyAddress: "",
  });
  const [smtpDetails, setSmtpDetails] = useState({
    smtpUsername: "",
    smtpPassword: "",
    smtpPort: "",
    encType: "SSL",
  });

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Company Settings",
      pageURL: "/company-settings",
    },
  ];
  // Start invoice company detail
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Adding New Company details API
  const addNewCompanyData = async () => {
    const companyName = companyDetails.companyName.trim();
    const companyEmail = companyDetails.companyEmail.trim();
    const companyContactNo = companyDetails.companyContactNo.trim();
    const companyAddress = companyDetails.companyAddress.trim();
  
    const body = {
      company_name:companyName,
      current_user: localStorage.getItem("userId") ?? null,
      company_email: companyEmail,
      company_contact_no: companyContactNo,
      company_address:companyAddress,
    };
  
    setIsLoading(() => true);
  
    try {
      const url = `${mainURL}/add/company-details`;
      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });
  
      if (result.status === 201) {
        ReactHotToast(result?.data?.message, "success");
        setCompanyDetails({
          companyName: "",
          companyEmail: "",
          companyContactNo: "",
          companyAddress: "",
        });
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
    }
  };
  

  // const addNewCompanyData = async () => {
  //   const body = {
  //     company_name: companyDetails.companyName,
  //     current_user: localStorage.getItem("userId") ?? null,
  //     company_email: companyDetails.companyEmail,
  //     company_contact_no: companyDetails.companyContactNo,
  //     company_address: companyDetails.companyAddress,
  //   };

  //   setIsLoading(() => true);

  //   try {
  //     const url = `${mainURL}/add/company-details`;
  //     const result = await axios.post(url, body, {
  //       headers: headerOptions(),
  //     });

  //     if (result.status === 201) {
  //       ReactHotToast(result?.data?.message, "success");
  //       setCompanyDetails({
  //         companyName: "",
  //         companyEmail: "",
  //         companyContactNo: "",
  //         companyAddress: "",
  //       });
  //     }
  //   } catch (e) {
  //     handleAPIError(e, logout);
  //   } finally {
  //     setIsLoading(() => false);
  //   }
  // };

  const handleAddCompanyDetail = (e) => {
    e.preventDefault();
  
    const { companyName, companyEmail, companyContactNo, companyAddress } = companyDetails;
  
    const isCompanyDataValid = companyName.trim() && companyEmail.trim() && companyContactNo.trim() && companyAddress.trim();
    const isEmailValid = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(companyEmail);
  
    if (isCompanyDataValid) {
      if (!isEmailValid) {
        ReactHotToast("Please enter a valid email address!", "error");
        return;
      }
      addNewCompanyData();
    } else {
      if (!companyEmail) ReactHotToast("Please input email!", "error");
      else if (!companyName) ReactHotToast("Please input Name!", "error");
      else if (!companyContactNo) ReactHotToast("Please input contact no!", "error");
      else if (!companyAddress) ReactHotToast("Please input address!", "error");
    }
  };
  

  // end invoice company detail
 // SMTP Form start here 
  // const handleChangeSmtp = (e) => {
  //   const { name, value } = e.target;
  //   setSmtpDetails((prev) => ({ ...prev, [name]: value }));
  // };
  // const handleEncryptionTypeChange = (e) => {
  //   const { value } = e.target;
  //   setSmtpDetails((prev) => ({ ...prev, encType: value }));
  // };

 

  // const addNewSmtpData = async () => {
  //   const body = {
  //     current_user: localStorage.getItem("userId") ?? null,
  //     smtp_username: smtpDetails.smtpUsername,
  //     smtp_password: smtpDetails.smtpPassword,
  //     smtp_port: smtpDetails.smtpPort,
  //     enc_type: smtpDetails.encType,
  //   };

  //   setLoading(() => true);

  //   try {
  //     const url = `${mainURL}/add/smtp-details`;
  //     const result = await axios.post(url, body, {
  //       headers: headerOptions(),
  //     });

  //     if (result.status === 201) {
  //       ReactHotToast(result?.data?.message, "success");
  //       setSmtpDetails({
  //         smtpUsername: "",
  //         smtpPassword: "",
  //         smtpPort: "",
  //         encType: "",
  //       });
  //     }
  //   } catch (e) {
  //     handleAPIError(e, logout);
  //   } finally {
  //     setLoading(() => false);
  //   }
  // };

  // const handleAddSmtpDetail = (e) => {
  //   e.preventDefault();
  //   const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/;
   
  //   const smtpData =
  //     smtpDetails.smtpUsername &&
  //     smtpDetails.smtpPassword &&
  //     smtpDetails.smtpPort &&
  //     smtpDetails.encType;
  //   if (smtpData) {
  //     // Check if the email matches the regex pattern
  //     if (!emailPattern.test(smtpDetails.smtpUsername)) {
  //       ReactHotToast("Please enter a valid email address!", "error");
  //       return; // Stop further execution
  //     }

  //     addNewSmtpData();
  //   } else {
  //     if (smtpDetails.smtpUsername === "") {
  //       ReactHotToast("Please input user email!", "error");
  //     } else if (smtpDetails.smtpPassword === "") {
  //       ReactHotToast("Please input password!", "error");
  //     } else if (smtpDetails.smtpPort === "") {
  //       ReactHotToast("Please select port!", "error");
  //     } else if (smtpDetails.encType === "") {
  //       ReactHotToast("Please select encyp type!", "error");
  //     }
  //   }
  // };

  // const tableInstance = useTable(
  //     {
  //       columns,
  //       data,
  //     },
  //     useGlobalFilter,
  //     useSortBy,
  //     usePagination
  //   );

  // Ip Address



  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>
      <section className="main-content_header">
        <div className="d-flex justify-content-start align-items-center page-heading w-100 custom-border-bottom">
          <img src={settingsIcon1} alt="clients" />
          <p className="m-0 fs-4">Company Settings</p>
        </div>
      </section>

      {/* Top header section */}
      <div className="mb-5 relative-wrapper zIndex-2">
        {/* <PageHeader
        // tableInstance={tableInstance}
        icon={reportsIcon}
        headerTitle={"Company Settings"}
      ></PageHeader> */}
      </div>
      {/* SMTP Form  */}
      <div class="m-auto mt-3 gap-5 main-content_form-section d-flex w-50">
        {/* <div className="dashboard-block d-flex flex-1 flex-column justify-content-center align-items-center gap-1 ">
          <div className="block-header d-flex justify-content-between align-items-center w-100">
            <p className="block-title m-0">SMTP Settings</p>
          </div>

          <div className="block-content w-100 mt-1">
            <section className="main-content_form-section gap-5 d-flex align-items-start  m-auto">
              <form className="w-100" onSubmit={handleAddSmtpDetail}>
              
                <div className="form-group mt-4">
                  <label htmlFor="smtpName">SMTP User Email:</label>
                  <input
                    id="smtpUsername"
                    name="smtpUsername"
                    placeholder="Smtp Name"
                    type="text"
                    required
                    value={smtpDetails?.smtpUsername}
                    onChange={(e) => handleChangeSmtp(e)}
                  />
                </div>
                <div className="form-group mt-4">
                  <label htmlFor="smtpPassword">SMTP Password:</label>
                  <input
                    id="smtpPassword"
                    name="smtpPassword"
                    placeholder="Smtp Password"
                    type="text"
                    required
                    value={smtpDetails?.smtpPassword}
                    onChange={(e) => handleChangeSmtp(e)}
                  />
                </div>

                <div className="form-group mt-4">
                  <label htmlFor="smptPort">SMTP Port:</label>
                  <input
                    id="smtpPort"
                    name="smtpPort"
                    placeholder="Smtp Port"
                    type="text"
                    value={smtpDetails?.smtpPort}
                    onChange={(e) => handleChangeSmtp(e)}
                  />
                </div>
                <div className="form-group mt-4">
                  <label htmlFor="encType">Type Of Encryption:</label>
                  <select
                    className="form-control"
                    id="encType"
                    name="encType"
                    value={smtpDetails?.encType}
                    onChange={handleEncryptionTypeChange}
                  >
                    <option value="SSL">SSL</option>
                    <option value="TLS">TLS</option>
                  </select>
                </div>

               

                <button type="submit" className="mt-4 custom-btn">
                  {loading ? <SpinningLoader /> : " Add "}
                </button>
              </form>
            </section>
          </div>
        </div> */}
        {/* Invoice settings Form  */}
        <div className="dashboard-block d-flex flex-1 flex-column  align-items-center gap-1 ">
          <div className="block-header d-flex justify-content-between align-items-center w-100">
            <p className="block-title m-0">Invoice Settings</p>
          </div>

          <div className="block-content w-100 mt-1">
            <section className="main-content_form-section gap-5 d-flex align-items-start  m-auto">
              <form className="w-100" onSubmit={handleAddCompanyDetail}>
                <div className="form-group mt-4">
                  <label htmlFor="companyName">Company Name:</label>
                  <input
                    id="companyName"
                    name="companyName"
                    placeholder="Name"
                    type="text"
                    required
                    value={companyDetails?.companyName}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div className="form-group mt-4">
                  <label htmlFor="companyName">Company Email:</label>
                  <input
                    id="companyEmail"
                    name="companyEmail"
                    placeholder="Email"
                    type="text"
                    required
                    value={companyDetails?.companyEmail}
                    onChange={(e) => handleChange(e)}
                  />
                </div>

                <div className="form-group mt-4">
                  <label htmlFor="companyAddress">Company Address:</label>
                  <input
                    id="companyAddress"
                    name="companyAddress"
                    placeholder="Address"
                    type="text"
                    required
                    value={companyDetails?.companyAddress}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div className="form-group mt-4">
                  <label htmlFor="comment">Compnay Contact No:</label>
                  <input
                    id="companyContactNo"
                    name="companyContactNo"
                    placeholder="Contact No"
                    type="tel"
                    value={companyDetails?.companyContactNo}
                    onChange={(e) => {
                      const input = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      handleChange({
                        target: { name: "companyContactNo", value: input },
                      });
                    }}
                  />
                </div>

                {/* <div className="form-group mt-4">
                  <label htmlFor="comment">Compnay Contact Number:</label>
                  <input
                    id="companyContactNo"
                    name="companyContactNo"
                    placeholder="company contact No"
                    type="tel"
                      value={companyDetails?.companyContactNo}
                      onChange={(e) => handleChange(e)}
                  />
                </div> */}
                {/* <div className="form-group mt-4">
                  <label htmlFor="comment">Invoice Send From:</label>
                  <input
                    id="comment"
                    name="comment"
                    placeholder="Eg: comments..."
                    type="text"
                    //   value={clientDetails?.comment}
                    //   onChange={(e) => handleChange(e)}
                  />
                </div> */}

                <button type="submit" className="mt-4 custom-btn">
                
                  {isLoading ? <SpinningLoader /> : "  Add"}
                </button>
              </form>
            </section>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default CompanySettings;
