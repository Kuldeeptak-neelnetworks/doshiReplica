import React, { useState, useContext } from "react";
import axios from "axios";

import { SendInvoiceModal } from "./SendInvoiceModal";
import { invoiceIcon1 } from "../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import {
  handleAPIError,
  headerOptions,
} from "../../../utils/utilities/utilityFunctions";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";

const PageHeader = ({
  isPreview,
  setIsPreview,
  invoice,
  assignId,
  invoiceMeta,
  isInvoicePreview,
  setInvoice,
  setIsUpdated,
}) => {
  const { mainURL, logout } = useContext(ContextAPI);
  const userId = localStorage.getItem("userId") ?? null;

  const [isLoading, setIsLoading] = useState(false);

  // Once Invoice is Edited & Previewed, User can Save the same
  const handleSaveInvoice = async () => {
    try {
      setIsLoading(() => true);

      const isAnyOtherJobEmpty = invoice?.newOtherJobs.some(
        (job) =>
          !job.jobId ||
          !job.taskAssignId ||
          !job.description ||
          !job.totalTime ||
          !job.totalAmount ||
          !job.billingRate
      );

      if (isAnyOtherJobEmpty) {
        ReactHotToast(
          "Please avoid adding empty job details before saving the invoice.",
          "error"
        );
        return;
      }

      const paymentStatus =
        invoice?.paymentStatus?.value === "3"
          ? "3"
          : invoice?.paymentStatus?.value === "2"
          ? "2"
          : "1";

      // Calculating the Tax and Passing it in desired array to backend
      const calculateTax = invoice?.tax?.reduce((acc, curr) => {
        const values = Object.values(curr);
        const key = values[0].split(" ")[0];
        const value = values[0].split(" ")[1];

        const newObj = {
          [key]: value,
          tax_ammount: +((+values[1] * invoice.subTotal) / 100).toFixed(0),
        };
        acc = [...acc, newObj];

        return acc;
      }, []);

      const otherJobsArray = invoice?.newOtherJobs.map((job) => ({
        job_id: job.jobId,
        task_assign_id: job.taskAssignId,
        job_description: job.description,
        total_time: job.totalTime,
        total_amount: job.totalAmount,
        billing_rates: job.billingRate,
      }));

      const body = {
        billing_rates: +invoice?.servicePrice,
        partial_amount: +invoice?.clientHasPaid,
        current_user: +userId,
        job_assignment_id: +assignId,
        invoice_id: +invoiceMeta?.invoice_id,
        total_hours: +invoice?.hoursTime,
        total_minutes: +invoice?.minsTime,
        sub_total_amount: +invoice?.subTotal,
        base_amount: +invoice?.totalPrice,
        total_ammount: +invoice?.finalTotal,
        other_jobs: otherJobsArray,
        tax_array: calculateTax,
        payment_status: +paymentStatus,
        note: invoice?.note,
      };

      const url = `${mainURL}save/invoice`;
      const result = await axios.put(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        ReactHotToast(result.data.message, "success");
        setIsPreview(true);
        setInvoice((prev) => ({ ...prev, isInvoiceGenerated: true }));
        setIsUpdated((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
      console.log(e, "erorrrr");
    } finally {
      setIsLoading(() => false);
    }
  };

  // if the invoice is generated already then hide save and edit and show only Mail button
  // if the invoice is not generated then showcasing Edit and Save and preview button along with Mail button

  if (isPreview) {
    // show mail
    // hide edit, preview and save buttons
  }

  if (!isPreview || !isInvoicePreview) {
    // showcase all edit preview save and mail buttons
  }

  return (
    <section
      className={`main-content_header add-border-bottom custom-border-bottom`}
    >
      <div className="d-flex justify-content-center align-items-center page-heading">
        <img src={invoiceIcon1} alt={"Invoice"} />
        <p className="m-0 fs-4">Invoice</p>
      </div>
      <div className="d-flex justify-content-center align-items-center gap-3">
        {invoice.isInvoiceGenerated
          ? null
          : !isInvoicePreview && (
              <button
                type="submit"
                className="custom-btn"
                onClick={() => {
                  setIsPreview((prev) => !prev);
                }}
              >
                {isPreview ? "Edit" : "Preview"}
              </button>
            )}

        {isPreview ? (
          <>
            {invoice.isInvoiceGenerated
              ? null
              : !isInvoicePreview && (
                  <button
                    type="submit"
                    onClick={handleSaveInvoice}
                    className="custom-btn"
                  >
                    {isLoading ? <SpinningLoader /> : "Save"}
                  </button>
                )}

            {invoice.isInvoiceGenerated ? (
              <SendInvoiceModal
                assignId={assignId}
                invoiceId={invoiceMeta?.invoice_id}
                invoice={invoice}
                data={invoice}
              />
            ) : (
              ""
            )}
          </>
        ) : null}
      </div>
    </section>
  );
};

export default PageHeader;
