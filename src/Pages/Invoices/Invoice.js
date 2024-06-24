import React, { useContext, useState, useEffect, useMemo } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusIconSVG } from "../../utils/ImportingImages/ImportingImages";
import removeImg from "../../assets/images/remove.png";
import PageHeader from "./Components/PageHeader";
import { ContextSidebarToggler } from "../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../templates/Breadcrumbs";
import styles from "./Invoices.module.css";
import { ContextAPI } from "../../Context/ApiContext/ApiContext";
import { Tooltip } from "react-tooltip";
import {
  handleAPIError,
  headerOptions,
} from "../../utils/utilities/utilityFunctions";
import { EditSVG } from "../../utils/ImportingImages/ImportingImages";

import InvoiceHeader from "./Components/InvoiceHeader";
import InvoiceClientDetails from "./Components/InvoiceClientDetails";
import InvoiceFooter from "./Components/InvoiceFooter";

const animatedComponents = makeAnimated();
const breadCrumbs = [
  {
    pageName: "Home",
    pageURL: "/dashboard",
  },
  {
    pageName: "Invoice",
    pageURL: "/invoice",
  },
];

const taxOptions = [
  {
    label: "VAT 5%",
    value: "5",
  },
  {
    label: "VAT 10%",
    value: "10",
  },
  {
    label: "VAT 15%",
    value: "15",
  },
  {
    label: "VAT 20%",
    value: "20",
  },
];

const paymentOptions = [
  { label: "Unpaid", value: "1" },
  { label: "Partially Paid", value: "2" },
  { label: "Paid", value: "3" },
];

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mainURL, logout } = useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);

  const userId = localStorage.getItem("userId") ?? null;
  const { invoiceMeta, assignId, isInvoicePreview } = location?.state;

  if (!assignId || !invoiceMeta) navigate(-1);

  // States
  const [isPreview, setIsPreview] = useState(isInvoicePreview ?? false);
  const [showError, setShowError] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [editable, setEditable] = useState(false);

  const [invoice, setInvoice] = useState({
    hoursTime: 0,
    minsTime: 0,
    totalPrice: null,
    subTotal: null,
    paymentStatus: "",
    tax: [],
    note: "",
    dueAmount: 0,
    partialPaidAmount: 0,
    client: {},
    date: "",
    jobName: "",
    description: "",
    servicePrice: 0,
    finalTotal: 0,
    invoiceCode: "",
    subTotalAmount: 0,
    isInvoiceGenerated: false,
    isPostDraftInvoice: false,
    isPostDraftInvoiceGenerated: false,
    clientHasPaid: 0,
    additionalJobs: [],
    otherJobs: [
      {
        billingRate: 0,
        totalTime: "",
        description: "",
        label: "",
        hoursTime1: 0,
        minsTime1: 0,
      },
    ],
    newOtherJobs: [],
  });

  const handleAddServices = () => {
    setInvoice({
      ...invoice,

      newOtherJobs: [
        ...invoice.newOtherJobs,
        {
          totalTime: "",
          jobId: "",
          description: "",
          billingRate: 0,
          totalAmmount: 0,
          label: "",
          hoursTime1: 0,
          minsTime1: 0,
        },
      ],
    });
  };

  // helper function for setting minimum cost price
  const getLabourPrice = (servicePrice) => {
    const timeInSecs = invoice?.hoursTime + invoice?.minsTime / 60; // first calculating total time
    const labourPrice = Math.round(timeInSecs * parseInt(servicePrice)); // 2nd multiplying time & base service price
    return +labourPrice;
  };

  const calculateTax = (percent) => {
    const tax = Math.round((invoice?.subTotal * parseFloat(percent)) / 100);
    return +tax;
  };

  // updating the Total Price if Hours Time and Mins Time is changed
  useEffect(() => {
    const totalPrice = getLabourPrice(invoice.servicePrice);
    setInvoice((prev) => ({
      ...prev,
      totalPrice,
    }));
  }, [invoice.hoursTime, invoice.minsTime, invoice.servicePrice]);

  useEffect(() => {
    const calculateFinalTotal = () => {
      let totalJobAmount = 0;

      // Calculate total amount for each jobItem
      invoice.newOtherJobs.forEach((jobItem) => {
        totalJobAmount += +jobItem.totalAmount > 0 ? +jobItem.totalAmount : 0;
      });

      // Calculate total tax amount based on totalPrice and total job amount
      const totalTaxAmount = invoice?.tax.reduce((acc, curr) => {
        const temp = Math.round(invoice?.totalPrice + totalJobAmount);
        acc += Math.round((curr.value * temp) / 100);
        return acc;
      }, 0);

      // Calculate final total by adding total price, total job amount, and total tax amount
      const subTotal = Math.round(invoice?.totalPrice + totalJobAmount);
      const finalTotal = Math.round(
        invoice?.totalPrice + totalJobAmount + totalTaxAmount
      );

      setInvoice((prev) => ({
        ...prev,
        finalTotal,
        subTotal,
      }));
    };

    if (!isInvoicePreview && !invoice.isInvoiceGenerated) {
      calculateFinalTotal();
    }
  }, [invoice.totalPrice, invoice.newOtherJobs, invoice.tax, isInvoicePreview]);

  // preview invoice api
  const previewInvoice = async () => {
   
    const url = invoiceMeta?.invoice_id
      ? `${mainURL}preview/invoice/${userId}/${invoiceMeta.invoice_id}`
      : `${mainURL}preview/invoice/post-draft-changes/${userId}/${invoiceMeta?.post_draft_invoice_id}`;

    try {
      const result = await axios.get(url, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        setIsPreview(result?.data?.invoice_data?.is_invoice_genrated === "Yes");

        const additionalJobs = result.data?.invoice_data?.additioanl_jobs;

        if (additionalJobs) {
          const additionalJobsArray = Object.values(additionalJobs).map(
            (job) => ({
              id: job.job_id,
              task_assign_id: job.task_assign_id,
              jobName: job.job_name,
              totalTime: job.total_time,
              totalAmount: job.total_amount,
              description: job.job_description,
              billingRate: job.billing_rates,
            })
          );

          setInvoice((prevInvoice) => ({
            ...prevInvoice,
            additionalJobs: additionalJobsArray,
          }));
        }

        // setting time in the Hours & Minutes input boxes
        const calculateTime = (time) => {
          // Use regular expressions to extract hours and minutes
          const regex = /(\d+)hr (\d+)min/;
          const match = time?.match(regex);

          if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            setInvoice((prev) => ({
              ...prev,
              hoursTime: hours,
              minsTime: minutes,
              totalTime: minutes,
            }));
          }
        };
        const calculateOtherJobTime = (otherJobs) => {
          if (!otherJobs) return;

          const updatedJobs = Object.values(otherJobs).map((job) => {
            const total_time = job.total_time;
            const regex = /(\d+)hr (\d+)min/;
            const match = total_time?.match(regex);

            if (match) {
              const hours = parseInt(match[1], 10);
              const minutes = parseInt(match[2], 10);

              return {
                ...job,

                hoursTime1: hours,
                minsTime1: minutes,
              };
            }
            return job;
          });

          setInvoice((prev) => ({
            ...prev,
            otherJobs: updatedJobs,
          }));
        };

        calculateTime(result?.data?.invoice_data?.total_time);

        calculateOtherJobTime(result?.data?.invoice_data?.other_jobs);

        const billingRate = +result.data.invoice_data.billing_rates;

        setInvoice((prev) => ({
          ...prev,
          servicePrice: billingRate,
        }));

        const setTax = (taxArray) => {
          if (!Array.isArray(taxArray)) {
            return [];
          }

          return taxArray.reduce((acc, curr) => {
            const keys = Object.keys(curr);
            const values = Object.values(curr);

            const label = `${keys[0]} ${values[0]?.split(" ")[0]}`;
            const value = values[1];

            const newObj = { label, value };
            acc = [...acc, newObj];
            return acc;
          }, []);
        };

        const setPaymentStatus = (status) => {
          const ans = paymentOptions.find((option) => option.value === status);
          return ans;
        };

        const newObject = {
          servicePrice: billingRate,
          date: result.data.invoice_data?.job_assigned_on,
          jobName: result.data.invoice_data?.job_name,
          description: result.data.invoice_data?.job_description,
          subTotalAmount:
            result.data.invoice_data?.is_post_draft_invoice === "1"
              ? result.data.invoice_data?.base_amount
              : result.data.invoice_data?.sub_total_amount,
          invoiceCode: result.data.invoice_data?.invoice_code,
          dueAmount: result.data.invoice_data?.due_amount,
          partialPaidAmount: result.data.invoice_data?.partial_paid_amount,
          isInvoiceGenerated: Boolean(
            result.data.invoice_data?.is_invoice_genrated === "Yes"
          ),
          isPostDraftInvoice: Boolean(
            result.data.invoice_data?.is_post_draft_invoice === "1"
          ),
          isPostDraftInvoiceGenerated: Boolean(
            result.data.invoice_data?.is_post_draft_invoice_generated === "1"
          ),
          tax: setTax(result.data.invoice_data?.taxes),
          paymentStatus: isInvoicePreview
            ? setPaymentStatus(result.data.invoice_data?.payment_status)
            : result.data.invoice_data?.is_invoice_genrated === "Yes"
            ? setPaymentStatus(result.data.invoice_data?.payment_status)
            : "",
          finalTotal:
            isInvoicePreview ||
            result.data.invoice_data?.is_invoice_genrated === "Yes"
              ? result.data.invoice_data?.total_ammount
              : 0,
          note: isInvoicePreview
            ? result.data.invoice_data?.notes
            : "No notes available",
          client: {
            name: result.data.invoice_data?.client_name,
            email: result.data.invoice_data?.client_email,
            allEmails: result.data.invoice_data?.client_all_emails,
            company: result.data.invoice_data?.client_company_name,
            address: result.data.invoice_data?.company_address,
            contact: result.data.invoice_data?.company_contact_details,
          },
        };
        // console.log("newObject: ", newObject);
        setInvoice((prev) => ({ ...prev, ...newObject }));
      }
    } catch (e) {
      console.error("invoice:", e);

      handleAPIError(e, logout);
    }
  };

  useEffect(() => {
    previewInvoice();
  }, [isUpdated]);

  const removeItem = (index) => {
    const updatedItems = [...invoice.newOtherJobs];

    setShowError("");
    updatedItems.splice(index, 1);
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      newOtherJobs: updatedItems,
    }));
  };

  const handleChangeOtherJob = (option, index) => {
    setShowError("");
    const isJobIdExist = invoice.newOtherJobs.some((job) => {
      return job.taskAssignId === option.value;
    });

    if (isJobIdExist) {
      setShowError("Selected job already exists.");
      return;
    }

    const getDetailOtherJobs = invoice.otherJobs.find(
      ({ task_assign_id }) => task_assign_id === option.value
    );

    const allOtherJobs = invoice.newOtherJobs.map((job, idx) =>
      idx === index
        ? {
            jobId: getDetailOtherJobs.job_id,
            taskAssignId: getDetailOtherJobs.task_assign_id,
            description: getDetailOtherJobs.job_description,
            billingRate: getDetailOtherJobs.billing_rates,
            totalAmount: getDetailOtherJobs.total_amount,
            totalTime: getDetailOtherJobs.total_time,
            label: getDetailOtherJobs.job_name,
            hoursTime1: getDetailOtherJobs.hoursTime1,
            minsTime1: getDetailOtherJobs.minsTime1,
          }
        : job
    );

    setInvoice((prev) => ({ ...prev, newOtherJobs: allOtherJobs }));
  };

  const handleInputChange = (e, index, job, type) => {
    const enteredValue = e.target.value;

    const lessThan59 = type === "mins" ? enteredValue <= 59 : true;

    if (!isNaN(enteredValue) && enteredValue >= 0 && lessThan59) {
      setInvoice((prev) => ({
        ...prev,
        newOtherJobs: prev.newOtherJobs.map((jobItem, idx) => {
          if (idx === index) {
            let totalHours = parseInt(jobItem.hoursTime1 || 0, 10);
            let totalMins = parseInt(jobItem.minsTime1 || 0, 10);
            let billingRate = parseInt(jobItem.billingRate || 0, 10);

            if (type === "hours") {
              totalHours = parseInt(enteredValue || 0, 10);
            } else if (type === "mins") {
              totalMins = parseInt(enteredValue || 0, 10);
            } else if (type === "billingRate") {
              billingRate = parseInt(enteredValue || 0, 10);
            }

            const totalTime = `${totalHours}hr ${totalMins}min`;
            const timeInSecs = totalHours + totalMins / 60;
            const totalAmount = Math.round(
              isNaN(timeInSecs) ? 0 : timeInSecs * billingRate
            );

            return {
              ...jobItem,
              hoursTime1: type === "hours" ? enteredValue : jobItem.hoursTime1,
              minsTime1: type === "mins" ? enteredValue : jobItem.minsTime1,
              billingRate:
                type === "billingRate" ? enteredValue : jobItem.billingRate,
              totalTime,
              totalAmount,
            };
          }
          return jobItem;
        }),
      }));
    }
  };

  const otherJobOptions = useMemo(() => {
    const options = Object.values(invoice.otherJobs).map((job) => ({
      value: job.task_assign_id,
      label: job.job_name,
    }));
    const otherJobs = invoice.newOtherJobs
      .map(({ taskAssignId }) => taskAssignId)
      .join(",");

    const otherJobOptions = options.filter(
      ({ value }) => !otherJobs.includes(value)
    );
    return otherJobOptions;
  }, [invoice.otherJobs, invoice.newOtherJobs]);

  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };
  const handleEditBillingRateClick = () => {
    setEditable(!editable);
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      {/* Top header section */}
      <PageHeader
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        invoice={invoice}
        assignId={assignId}
        invoiceMeta={invoiceMeta}
        isInvoicePreview={isInvoicePreview}
        setInvoice={setInvoice}
        setIsUpdated={setIsUpdated}
      />

      {/* Actual Invoice Content */}
      <section className={`mr-40 mt-5 ml-30 mb-15`}>
        <div className="card">
          {/* invoice header */}
          <InvoiceHeader invoice={invoice} />
          {/* invoice body */}
          <div className="card-body">
            <InvoiceClientDetails invoice={invoice} />
            {/* billing details table */}
            <div className={`table-responsive-sm ${styles.invoiceTable}`}>
              <table className={`table table-striped`}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Job Name</th>
                    <th>Description</th>
                    <th style={{ width: "100px" }}>Rate (/hr)</th>
                    <th style={{ width: "250px" }}>Total Time </th>
                    <th style={{ width: "100px" }}>Total</th>
                    <th style={{ width: "100px" }}></th>
                  </tr>
                </thead>
                <tbody
                  style={{ verticalAlign: "middle" }}
                  className="primary-font-color"
                >
                  <tr>
                    <td>1</td>
                    <td>{invoice?.jobName}</td>
                    <td>{invoice?.description ? invoice.description : "NA"}</td>
                    <td>
                      {isEditable && !isPreview ? (
                        <input
                          type="number"
                          value={invoice?.servicePrice}
                          onChange={(e) => {
                            setInvoice((prev) => ({
                              ...prev,
                              servicePrice: e.target.value,
                            }));
                          }}
                        />
                      ) : (
                        <span>£{invoice?.servicePrice}</span>
                      )}
                    </td>

                    {/* <td>£ {invoice?.servicePrice}</td> */}
                    <td>
                      {!isPreview ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <div className="position-relative">
                            <input
                              className={styles.inputBox}
                              type="tel"
                              min="0"
                              placeholder="12"
                              value={invoice.hoursTime}
                              onChange={(e) => {
                                const enteredValue = +e.target.value;
                                if (!isNaN(enteredValue) && enteredValue >= 0) {
                                  setInvoice((prev) => ({
                                    ...prev,
                                    hoursTime: enteredValue,
                                  }));
                                }
                              }}
                            />
                            <span className={styles.infoText}>hrs</span>
                          </div>
                          :
                          <div className="position-relative">
                            <input
                              className={styles.inputBox}
                              type="tel"
                              min={0}
                              max={59}
                              placeholder="00"
                              value={invoice.minsTime}
                              onChange={(e) => {
                                const enteredValue = +e.target.value;
                                // Check if the entered value is within the valid range (0 to 59)
                                if (
                                  !isNaN(enteredValue) &&
                                  enteredValue >= 0 &&
                                  enteredValue <= 59
                                ) {
                                  setInvoice((prev) => ({
                                    ...prev,
                                    minsTime: enteredValue,
                                  }));
                                }
                              }}
                            />
                            <span className={styles.infoText}>mins</span>
                          </div>
                        </div>
                      ) : (
                        `${invoice.hoursTime} hr  ${invoice.minsTime} min`
                      )}
                    </td>
                    <td>£{invoice?.totalPrice}</td>
                    {!isPreview ? (
                      <>
                        <td>
                          <div className="d-flex gap-2">
                            <Tooltip
                              id="add-service"
                              style={{
                                background: "#000",
                                color: "#fff",
                              }}
                              opacity={0.9}
                            />
                            <div
                              onClick={handleAddServices}
                              data-tooltip-id="add-service"
                              data-tooltip-content="Add Service"
                              data-tooltip-place="top"
                            >
                              <PlusIconSVG />
                            </div>

                            <Tooltip
                              id="edit-tooltip"
                              style={{
                                background: "#000",
                                color: "#fff",
                              }}
                              opacity={0.9}
                            />
                            <div
                              onClick={handleEditClick}
                              data-tooltip-id="edit-tooltip"
                              data-tooltip-content="Edit Billings Rate"
                              data-tooltip-place="top"
                            >
                              <EditSVG />
                            </div>
                            {/* <div>
                              <button
                                onClick={handleEditClick}
                                className="edit-Btn"
                                style={{ border: "none" }}
                              >
                                <EditSVG />
                              </button>
                            </div> */}
                          </div>
                        </td>
                      </>
                    ) : (
                      <td style={{ width: "100px" }}></td>
                    )}
                  </tr>
                  {invoice.additionalJobs.map((job, index) => (
                    <tr key={index}>
                      <td>{index + 2}</td>
                      <td>{job.jobName}</td>
                      <td>{job.description || "NA"}</td>
                      <td>£ {job.billingRate}</td>
                      <td> {job.totalTime}</td>
                      <td>£ {job.totalAmount}</td>
                      <td></td>
                    </tr>
                  ))}
                  {!invoice.isInvoiceGenerated ? (
                    <>
                      {invoice?.newOtherJobs?.map((job, index) => (
                        <tr key={index}>
                          <td>{index + 2}</td>
                          <td>
                            {!isPreview ? (
                              <>
                                <Select
                                  name={`otherJobs-${index}`}
                                  className="react-select-custom-styling__container"
                                  classNamePrefix="react-select-custom-styling"
                                  isClearable={false}
                                  onChange={(option) => {
                                    handleChangeOtherJob(option, index);
                                  }}
                                  options={otherJobOptions}
                                  value={{
                                    label: job.label,
                                    value: job.taskAssignId,
                                  }}
                                />
                              </>
                            ) : (
                              job.label
                            )}

                            <span style={{ color: "red" }}>{showError}</span>
                          </td>
                          <td>{job.description}</td>
                          <td>
                            <>
                              {editable && !isPreview ? (
                                <input
                                  type="number"
                                  value={job.billingRate}
                                  onChange={(e) => {
                                    handleInputChange(
                                      e,
                                      index,
                                      job,
                                      "billingRate"
                                    );
                                  }}
                                />
                              ) : null}

                              {!editable || isPreview ? (
                                <span>£ {job.billingRate}</span>
                              ) : null}
                            </>
                          </td>

                          <td>
                            {!isPreview ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <div className="position-relative">
                                  <input
                                    className={styles.inputBox}
                                    type="tel"
                                    min="0"
                                    placeholder="12"
                                    value={job.hoursTime1}
                                    onChange={(e) =>
                                      handleInputChange(e, index, job, "hours")
                                    }
                                  />
                                  <span className={styles.infoText}>hrs</span>
                                </div>
                                <div className="position-relative">
                                  <input
                                    className={styles.inputBox}
                                    type="tel"
                                    min={0}
                                    max={59}
                                    placeholder="00"
                                    value={job.minsTime1}
                                    onChange={(e) =>
                                      handleInputChange(e, index, job, "mins")
                                    }
                                  />
                                  <span className={styles.infoText}>mins</span>
                                </div>
                              </div>
                            ) : (
                              `${job.hoursTime1||0} hr ${job.minsTime1||0} min`
                            )}
                          </td>
                          <td>£{job.totalAmount||0}</td>
                          {!isPreview ? (
                            <td>
                              <div className="d-flex justify-content-around gap-2">
                                <div>
                                  <span onClick={() => removeItem(index)}>
                                    <img
                                      src={removeImg}
                                      style={{
                                        width: "32px",
                                        cursor: "pointer",
                                      }}
                                      alt="Remove"
                                    />
                                  </span>
                                </div>
                                <div
                                  onClick={handleAddServices}
                                  style={{ cursor: "pointer" }}
                                >
                                  <PlusIconSVG />
                                </div>
                                <div onClick={handleEditBillingRateClick}>
                                  <EditSVG />
                                </div>
                              </div>
                            </td>
                          ) : (
                            <td></td>
                          )}
                        </tr>
                      ))}
                    </>
                  ) : (
                    ""
                  )}
                </tbody>
              </table>
            </div>
            <div className="row">
              <div className="col-lg-4 col-sm-5">
                <div className="pt-3 d-flex flex-column gap-3">
                  <div className="form-group">
                    <label className={styles.heading}>Payment Status: </label>
                    {!isPreview ? (
                      <>
                        <Select
                          name="billingService"
                          className="react-select-custom-styling__container"
                          classNamePrefix="react-select-custom-styling"
                          isClearable={false}
                          onChange={(option) => {
                            setInvoice((prev) => ({
                              ...prev,
                              paymentStatus: option,
                            }));
                          }}
                          value={invoice.paymentStatus}
                          options={paymentOptions}
                        />
                      </>
                    ) : (
                      <span
                        className={`text mb-0 ${styles.status} ${
                          invoice.paymentStatus?.value === "3"
                            ? styles.statusGreen
                            : invoice.paymentStatus?.value === "2"
                            ? styles.statusYellow
                            : styles.statusRed
                        }`}
                      >
                        {invoice.paymentStatus?.label ?? "Unpaid"}
                      </span>
                    )}
                  </div>
                  {!isPreview && invoice.paymentStatus?.value === "2" && (
                    <div className="form-group">
                      <label className={styles.heading}>
                        Client has Paid:{" "}
                      </label>
                      <input
                        value={invoice.clientHasPaid}
                        onChange={(e) =>
                          setInvoice((prev) => ({
                            ...prev,
                            clientHasPaid: +e.target.value,
                          }))
                        }
                        max={invoice?.finalTotal}
                        min={0}
                        type="number"
                        placeholder="Enter Amount"
                      />
                    </div>
                  )}

                  {!isPreview && (
                    <div className="form-group">
                      <label className={styles.heading}>Tax: </label>
                      <Select
                        name="billingService"
                        className="react-select-custom-styling__container"
                        classNamePrefix="react-select-custom-styling"
                        isMulti
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={invoice.tax}
                        onChange={(option) => {
                          setInvoice((prev) => ({ ...prev, tax: option }));
                        }}
                        options={taxOptions}
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* Invoice Payment and Final Calculations */}
              <div className="col-lg-4 col-sm-5 ml-auto">
                <table className={`table table-clear ${styles.invoiceTable}`}>
                  <tbody>
                    <tr>
                      <td className={styles.heading}>Subtotal</td>
                      {(isInvoicePreview || isPreview) &&
                      invoice.isInvoiceGenerated ? (
                        <td>£{invoice?.subTotalAmount}</td>
                      ) : (
                        <td>£{invoice?.subTotal}</td>
                      )}
                    </tr>
                    {invoice.tax?.length > 0 &&
                      invoice.tax.map((tax, index) => (
                        <tr key={index}>
                          <td className={styles.heading}>{tax.label}</td>
                          <td>
                            £{" "}
                            {!invoice.isInvoiceGenerated
                              ? `${calculateTax(tax.value)}`
                              : tax.value
                              ? tax.value
                              : ""}
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td className={styles.heading}>Total</td>
                      <td className={styles.heading}>
                        £ {invoice?.finalTotal}
                      </td>
                    </tr>
                    {isPreview && invoice.paymentStatus?.value === "2" ? (
                      <>
                        <tr>
                          <td className={styles.heading}>Already Paid</td>
                          <td className={styles.heading}>
                            £{" "}
                            {invoice.clientHasPaid
                              ? invoice.clientHasPaid
                              : invoice.partialPaidAmount}
                          </td>
                        </tr>
                        <tr>
                          <td className={styles.heading}>Due Amount</td>
                          <td className={styles.heading}>
                            £{" "}
                            {!invoice.isInvoiceGenerated
                              ? invoice?.finalTotal - invoice.clientHasPaid
                              : invoice?.dueAmount}
                          </td>
                        </tr>
                      </>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* invoice footer */}
          <InvoiceFooter
            isPreview={isPreview}
            invoice={invoice}
            setInvoice={setInvoice}
          />
        </div>
      </section>
    </div>
  );
};

export default Invoice;
