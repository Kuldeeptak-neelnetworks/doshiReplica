import React from "react";
import styles from "../Invoices.module.css";

const InvoiceHeader = ({ invoice }) => {
  // const getTodayDate = () => {
  //   const date = new Date();
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };
  // const displayDate = invoice?.date === '1 Jan 1970' ? getTodayDate() : invoice?.date;
  const getTodayDate = () => {
    const date = new Date();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const displayDate = invoice?.date === '1 Jan 1970' ? getTodayDate() : invoice?.date;
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
{/*         
           Date: {displayDate} */}
        </p>
      </div>
    </div>
  );
};

export default InvoiceHeader;
