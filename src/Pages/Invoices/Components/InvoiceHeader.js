import React from "react";
import styles from "../Invoices.module.css";

const InvoiceHeader = ({ invoice }) => {
  return (
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
  );
};

export default InvoiceHeader;
