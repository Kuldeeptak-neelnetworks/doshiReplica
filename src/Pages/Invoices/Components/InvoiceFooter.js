import React from "react";
import styles from "../Invoices.module.css";

const InvoiceFooter = ({ isPreview, invoice, setInvoice }) => {
  return (
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
  );
};

export default InvoiceFooter;
