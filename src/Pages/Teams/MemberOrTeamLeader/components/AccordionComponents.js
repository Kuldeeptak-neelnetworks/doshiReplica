import React, { useState } from "react";
import { UpdateTimeEntryModal } from "./UpdateTimeEntryModel";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";

const AccordionComponent = ({ content, setIsUpdated }) => {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedEntryIds, setSelectedEntryIds] = useState([]);

  // const handleCheckboxChange = (entryId) => {
  //   if (entryId === "all") {
  //     const newSelectAllChecked = !selectAllChecked;
  //     setSelectAllChecked(newSelectAllChecked);
  //     const allEntryIds = content.map((entry) => entry.time_entries_id);
  //     setSelectedEntryIds(newSelectAllChecked ? allEntryIds : []);
  //   } else {
  //     setSelectedEntryIds((prevSelectedEntryIds) => {
  //       if (prevSelectedEntryIds.includes(entryId)) {
  //         const updatedSelectedIds = prevSelectedEntryIds.filter(
  //           (id) => id !== entryId
  //         );
  //         setSelectAllChecked(false);
  //         return updatedSelectedIds;
  //       } else {
  //         const updatedSelectedIds = [...prevSelectedEntryIds, entryId];
  //         setSelectAllChecked(updatedSelectedIds.length === content.length);
  //         return updatedSelectedIds;
         
  //       }
  //     });
  //   }
  // };
  const handleCheckboxChange = (entryId) => {
    if (entryId === "all") {
      const newSelectAllChecked = !selectAllChecked;
      setSelectAllChecked(newSelectAllChecked);
      const allEntryIds = content
        .filter(entry => entry.time_entries_status === "pending")
        .map(entry => entry.time_entries_id);
      setSelectedEntryIds(newSelectAllChecked ? allEntryIds : []);
    } else {
      setSelectedEntryIds(prevSelectedEntryIds => {
        if (prevSelectedEntryIds.includes(entryId)) {
          const updatedSelectedIds = prevSelectedEntryIds.filter(id => id !== entryId);
          setSelectAllChecked(false);
          return updatedSelectedIds;
        } else {
          const updatedSelectedIds = [...prevSelectedEntryIds, entryId];
          setSelectAllChecked(
            updatedSelectedIds.length ===
              content.filter(entry => entry.time_entries_status === "pending").length
          );
          return updatedSelectedIds;
        }
      });
    }
  };
  return (
    <>
      <div className="accordion-content">
        {Array.isArray(content) ? (
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>
                  {content.some(
                    (entry) => entry.time_entries_status === "pending"
                  ) && (
                    <label>
                      <input
                        id="markAll"
                        type="checkbox"
                        checked={selectAllChecked}
                        onChange={() => handleCheckboxChange("all")}
                      />
                    </label>
                  )}
                </th>
                <th>Member Name</th>
                <th>Working Time</th>
                <th>Billing Rates</th>
                <th>Time Entry Description</th>
                <th>Adjustment Hours</th>
                <th>Time Entries Type</th>
                <th>Entry Status</th>
              </tr>
            </thead>
            <tbody>
              {content.map((entry, index) => (
                <tr className="" key={index}>
                  <td>
                    {entry.time_entries_status === "pending" && (
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedEntryIds.includes(
                            entry.time_entries_id
                          )}
                          onChange={() =>
                            handleCheckboxChange(entry.time_entries_id)
                          }
                          className="cursor-pointer checkbox-input checkbox-color"
                        />
                      </label>
                    )}
                  </td>
                  <td>{entry.entered_by || "N/A"}</td>
                  <td>{entry.working_time || "N/A"}</td>
                  <td>{entry.billing_rates || "N/A"}</td>
                  <td>{entry.job_description  || "N/A"}</td>
                  <td>{entry.adjustment_hours || "N/A"}</td>
                  <td>{entry.time_entries_type || "N/A"}</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center">
                      {" "}
                      <Stack direction="horizontal">
                        {entry.time_entries_status === "approved" ? (
                          <Badge bg="success">Approved</Badge>
                        ) : entry.time_entries_status === "pending" ? (
                          <Badge bg="warning" text="dark">
                            Pending
                          </Badge>
                        ) : (
                          <Badge></Badge>
                        )}
                      </Stack>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="accordion">No time entries made for this job</div>
        )}

        {selectedEntryIds.length > 0 && (
          <div className="mr-40 ml-30 mb-2 mt-n2">
            <UpdateTimeEntryModal
              content={content}
              setIsUpdated={setIsUpdated}
              selectAllChecked={selectAllChecked}
              selectedIds={selectedEntryIds}
              setSelectedIds={setSelectedEntryIds}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AccordionComponent;
