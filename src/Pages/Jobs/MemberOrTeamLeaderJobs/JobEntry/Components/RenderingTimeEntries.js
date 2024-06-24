import React, { useContext, useEffect, useState } from "react";

import styles from "./AddJobEntryContent.module.css";
import { ContextAPI } from "../../../../../Context/ApiContext/ApiContext";
import { EditTimeEntryModal } from "./EditTimeEntryModal";
import {
  formatTime,
  getTime,
  isGreaterThan10,
} from "../../../../../utils/utilities/utilityFunctions";
import { AddJobEntryModal } from "./AddJobEntryModel";
import { timeSlots } from "./AddJobEntryContent";

const RenderingTimeEntries = ({ calendarDate, isUpdated, setIsUpdated }) => {
  const { initialState, getAllMyTimeEntries } = useContext(ContextAPI);
  const [timeEntriesToDisplay, setTimeEntriesToDisplay] = useState([]);

  const formatDateToDDMMYYYY = (inputDate) => {
    const date = new Date(inputDate);
    const dd = isGreaterThan10(date.getDate());
    const mm = isGreaterThan10(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // fetching all My time entries
  useEffect(() => {
    getAllMyTimeEntries();
  }, [isUpdated]);

  // showing time entries only for calendar selected date
  useEffect(() => {
    const filteredTimeEntries = initialState?.myAllTimeEntries?.filter(
      (entry) =>
        formatDateToDDMMYYYY(entry.working_date) ===
        formatDateToDDMMYYYY(calendarDate)
    );

    setTimeEntriesToDisplay(() => filteredTimeEntries ?? []);
  }, [initialState?.myAllTimeEntries, calendarDate]);

  return (
    <div
      className="w-100 mt-5"
      // style={{
      //   background: "#e0fbfc",
      //   padding: "20px",
      //   borderRadius: "10px",
      //   boxShadow: "1px 2px 4px gray",
      // }}
    >
      <table className="table table-bordered">
        <tbody>
          {timeEntriesToDisplay?.length > 0 ? (
            timeEntriesToDisplay?.map((entry, index) => {
              return (
                <React.Fragment key={entry?.entries_id}>
                  <tr>
                    <th style={{ width: 100, color: "#00263d" }}>
                      {getTime(entry?.work_start_time)}
                    </th>
                    <td rowSpan={2} valign="middle" className="">
                      <div className="d-flex justify-content-between align-items-center">
                        <div> {entry?.task_name}</div>
                        <EditTimeEntryModal
                          entryDetails={entry}
                          setIsUpdated={setIsUpdated}
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th style={{ color: "#00263d" }}>
                      {getTime(entry?.work_end_time)}
                    </th>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <>
              <tr>
                <td>
                  <div className={styles.entries}>
                    <p className="m-0">
                      No Time Entries found on
                      <span className="mx-1">
                        {formatDateToDDMMYYYY(calendarDate)}
                      </span>
                    </p>
                  </div>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RenderingTimeEntries;

{
  /* {entry?.time_entries_status === "pending" && (
                          <EditTimeEntryModal
                            entryDetails={entry}
                            setIsUpdated={setIsUpdated}
                          />
                        )} */
}

{
  /* <tbody>
          {timeEntriesToDisplay?.length > 0 ? (
            timeEntriesToDisplay
              .filter((a) => a.work_start_time === item.time)
              .map((entry, index) => {
                return (
                  <React.Fragment key={entry?.entries_id}>
                    <tr>
                      <th style={{ width: 100, color: "#00263d" }}>
                        {getTime(entry?.work_start_time)}
                      </th>
                      <td rowSpan={2} valign="middle" className="">
                        <div className="d-flex justify-content-between align-items-center">
                          <div> {entry?.task_name}</div>
                          <EditTimeEntryModal
                            entryDetails={entry}
                            setIsUpdated={setIsUpdated}
                          />
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <th style={{ color: "#00263d" }}>
                        {getTime(entry?.work_end_time)}
                      </th>
                    </tr>
                  </React.Fragment>
                );
              })
          ) : (
            <>
              <tr>
                <td>
                  <div className={styles.entries}>
                    <p className="m-0">
                      No Time Entries found on
                      <span className="mx-1">
                        {formatDateToDDMMYYYY(calendarDate)}
                      </span>
                    </p>
                  </div>
                </td>
              </tr>
            </>
          )}
        </tbody> */
}
