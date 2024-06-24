import React from "react";

const InvoiceClientDetails = ({ invoice }) => {
  return (
    <div className="row mb-4">
      {/* from */}
      <div className="col-sm-6">
        <h6 className="mb-3 font-outfit primary-font-color">From:</h6>
        <h5 className="mb-1 font-outfit primary-font-color">Doshi & Co.</h5>
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
  );
};

export default InvoiceClientDetails;
