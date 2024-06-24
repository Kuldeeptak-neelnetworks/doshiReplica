import React, { useContext, useState, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// import PageHeader from "./Components/PageHeader";
import PageHeader from "../../../Invoices/Components/PageHeader";
import { ContextSidebarToggler } from "../../../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../../../templates/Breadcrumbs";
// import styles from "./Invoices.module.css";
import styles from "../GenerateInvoice/GenerateInvoice.css";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";

import {
  handleAPIError,
  headerOptions,
} from "../../../../utils/utilities/utilityFunctions";

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

const GenerateInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mainURL, logout } = useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);

  const userId = localStorage.getItem("userId") ?? null;
  const { invoice_data, assignId, isInvoicePreview } = location?.state;
  //   if (!assignId || !invoice_data) navigate(-1);

  // States
  const [isPreview, setIsPreview] = useState(isInvoicePreview ?? false);
  const [invoice, setInvoice] = useState({
    hoursTime: 0,
    minsTime: 0,
    totalPrice: null,
    paymentStatus: "",
    tax: [],
    note: "",
    client: {},
    date: "",
    service: "",
    description: "",
    servicePrice: 0,
    finalTotal: 0,
    invoiceCode: "",
  });

  // helper function for setting minimum cost price
  const getLabourPrice = (servicePrice) => {
    const timeInSecs = invoice?.hoursTime + invoice?.minsTime / 60; // first calculating total time
    const labourPrice = (timeInSecs * parseInt(servicePrice)).toFixed(0); // 2nd multiplying time & base service price
    return +labourPrice;
  };

  const calculateTax = (percent) => {
    const tax = ((invoice?.totalPrice * percent) / 100).toFixed(0);
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

  // Calculating Final Total Price
  useEffect(() => {
    const calculateFinalTotal = () => {
      const totalTaxAmount = +invoice?.tax
        .reduce(
          (acc, curr) => (acc += (curr.value * invoice?.totalPrice) / 100),
          0
        )
        .toFixed(0);

      const finalTotal = invoice?.totalPrice + totalTaxAmount;

      setInvoice((prev) => ({
        ...prev,
        finalTotal,
      }));
    };

    if (!isInvoicePreview) {
      calculateFinalTotal();
    }
  }, [invoice.totalPrice, invoice.tax]);

  // preview invoice api
  useEffect(() => {
    const previewInvoice = async () => {
      const url = `${mainURL}preview/invoice/${userId}/${invoice_data?.invoice_id}`;

      try {
        const result = await axios.get(url, {
          headers: headerOptions(),
        });

        if (result.status === 200) {
          // setting time in the Hours & Minutes input boxes
          const calculateTime = (time) => {
            // Use regular expressions to extract hours and minutes
            const regex = /(\d+)hr (\d+)min/;
            const match = time?.match(regex);

            if (match) {
              const hours = parseInt(match[1], 10); // Convert the matched hour to an integer
              const minutes = parseInt(match[2], 10); // Convert the matched minutes to an integer

              setInvoice((prev) => ({
                ...prev,
                hoursTime: hours,
                minsTime: minutes,
              }));
            }
          };
          calculateTime(result?.data?.invoice_data?.total_time);
          const billingRate = +result.data.invoice_data.billing_rates;

          const setTax = (taxArray) =>
            taxArray?.reduce((acc, curr) => {
              const keys = Object.keys(curr);
              const values = Object.values(curr);

              const label = `${keys[0]} ${values[0]?.split(" ")[0]}`;
              const value = values[1];

              const newObj = { label, value };
              acc = [...acc, newObj];
              return acc;
            }, []);

          const setPaymentStatus = (status) =>
            paymentOptions.find((option) => option.value === status);

          setInvoice((prev) => ({
            ...prev,
            servicePrice: billingRate,
            date: result.data.invoice_data?.job_assigned_on,
            service: result.data.invoice_data?.billing_services,
            description: result.data.invoice_data?.job_description,
            invoiceCode: result.data.invoice_data?.invoice_code,
            tax: isInvoicePreview
              ? setTax(result.data.invoice_data?.taxes)
              : [],
            paymentStatus: isInvoicePreview
              ? setPaymentStatus(result.data.invoice_data?.payment_status)
              : "",
            finalTotal: isInvoicePreview
              ? result.data.invoice_data?.total_ammount
              : 0,
            note: isInvoicePreview
              ? result.data.invoice_data?.notes
              : "No notes available",
            client: {
              name: result.data.invoice_data?.client_name,
              email: result.data.invoice_data?.client_email,
              company: result.data.invoice_data?.client_company_name,
              address: result.data.invoice_data?.company_address,
              contact: result.data.invoice_data?.company_contact_details,
            },
          }));
        }
      } catch (e) {
        handleAPIError(e, logout);
      }
    };

    previewInvoice();
  }, []);

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
        invoice_data={invoice_data}
        isInvoicePreview={isInvoicePreview}
      />

      {/* Actual Invoice Content */}
      <section className={`mr-40 mt-5 ml-30 mb-15 w-75 m-auto`}>
        <div className="card">
          {/* invoice header */}
          <div className="card-header p-4">
            <img
              src="https://doshipms.com/static/media/LOGO.f8ced44d6d0298f50f0c.png"
              className={styles.logo}
              alt="logo"
            />

            <div className={`pt-3 float-right`}>
              <h5 className={`mb-0 font-outfit primary-font-color`}>
                Invoice: {invoice?.invoiceCode}
              </h5>
              <p className={`mb-0 font-outfit primary-font-color`}>
                Date: {invoice?.date}
              </p>
            </div>
          </div>
          {/* invoice body */}
          <div className="card-body">
            <div className="row mb-4">
              {/* from */}
              <div className="col-sm-6">
                <h6 className="mb-3 font-outfit primary-font-color">From:</h6>
                <h5 className="mb-1 font-outfit primary-font-color">
                  Doshi & Co.
                </h5>
                <p className="mb-0 font-outfit primary-font-color">
                  6th Floor AMP House
                </p>
                <p className="mb-0 font-outfit primary-font-color">
                  Dingwall Road, Croydon, CR0 2LX
                </p>
                <p className="mb-0 font-outfit primary-font-color">
                  invoice@doshioutsourcing.com
                </p>
                <p className="mb-0 font-outfit primary-font-color">
                  Tel: 0208-239 4999
                </p>
              </div>
              {/* to */}
              <div className="col-sm-6" style={{ float: "left" }}>
                <h6 className="mb-3 font-outfit primary-font-color">To:</h6>
                <h5 className="mb-1 font-outfit primary-font-color">
                  {invoice?.client?.company}
                </h5>
                <div className="mb-0 font-outfit primary-font-color">
                  {invoice?.client?.address}
                </div>
                <div className="mb-0 font-outfit primary-font-color">
                  Email: {invoice?.client?.email}
                </div>
                <div className="mb-0 font-outfit primary-font-color">
                  Phone: {invoice?.client?.contact}
                </div>
              </div>
            </div>
            {/* billing details table */}
            <div className={`table-responsive-sm ${styles.invoiceTable}`}>
              <table className={`table table-striped`}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Service</th>
                    <th>Description</th>
                    <th style={{ width: "100px" }}>Price</th>
                    <th style={{ width: "250px" }}>Time (hrs : mins)</th>
                    <th style={{ width: "100px" }}>Total</th>
                  </tr>
                </thead>
                <tbody
                  style={{ verticalAlign: "middle" }}
                  className="primary-font-color"
                >
                  <tr>
                    <td>1</td>
                    <td>{invoice?.service}</td>
                    <td>{invoice?.description}</td>
                    <td>£ {invoice?.servicePrice}</td>
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
                        `${invoice.hoursTime} hrs & ${invoice.minsTime} mins`
                      )}
                    </td>
                    <td>£ {invoice?.totalPrice}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="row">
              <div className="col-lg-4 col-sm-5">
                <div className="pt-3 d-flex flex-column gap-3">
                  <div className="form-group">
                    <label className={styles.heading}>Payment Status: </label>
                    {!isPreview ? (
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
              <div className="col-lg-4 col-sm-5 ml-auto">
                <table className={`table table-clear ${styles.invoiceTable}`}>
                  <tbody>
                    <tr>
                      <td className={styles.heading}>Subtotal</td>
                      <td>£ {invoice?.totalPrice}</td>
                    </tr>
                    {invoice.tax?.length > 0 &&
                      invoice.tax.map((tax, index) => (
                        <tr key={index}>
                          <td className={styles.heading}>{tax.label}</td>
                          <td>
                            £{" "}
                            {isInvoicePreview
                              ? tax.value
                              : calculateTax(tax.value)}
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td className={styles.heading}>Total</td>
                      <td className={styles.heading}>
                        £ {invoice?.finalTotal}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* invoice footer */}
          <div
            className="card-footer bg-white form-group"
            style={{ padding: "1rem" }}
          >
            <label className={styles.heading}>Note: </label>
            {!isPreview ? (
              <input
                placeholder="Eg: Thank you for working with us!"
                type="text"
                style={{ paddingRight: "20px", textOverflow: "ellipsis" }}
                value={invoice.note}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, note: e.target.value }))
                }
              />
            ) : (
              <p className="m-0 primary-font-color font-outfit">
                {invoice.note !== "" ? invoice.note : "No notes available"}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GenerateInvoice;
