import React from "react";
import {
  getTime,
  getTwelveHoursTime,
} from "../../../../../utils/utilities/utilityFunctions";
import { EditTimeEntryModal } from "./EditTimeEntryModal";
import styles from "./AddJobEntryContent.module.css";

const ShowJobEntrySection = ({
  timeEntriesToDisplay,
  setIsUpdated,
  previousTimeEntry,
  setNewUpdate,
}) => {
  // const timeStart = new Date(
  //   `${timeEntriesToDisplay?.working_date} ` + previousTimeEntry
  // ).getHours();

  // const timeEnd = new Date(
  //   `${timeEntriesToDisplay?.working_date} ` +
  //     timeEntriesToDisplay?.work_start_time
  // ).getHours();

  const timeStart = new Date(
    `${timeEntriesToDisplay?.working_date} ` + previousTimeEntry
  );

  const timeEnd = new Date(
    `${timeEntriesToDisplay?.working_date} ` +
      timeEntriesToDisplay?.work_start_time
  );

  const hourDiff = timeEnd - timeStart;

  return (
    <div className="w-100">
      <table className="table table-bordered" style={{ marginBottom: "0px" }}>
        <tbody>
          {hourDiff && hourDiff > 0 ? (
            <>
              <tr>
                <th
                  style={{
                    width: 100,
                    color: "rgb(131 128 128)",
                    background: "rgb(207 207 207)",
                  }}
                >
                  {getTwelveHoursTime(previousTimeEntry)}
                </th>
                <td
                  rowSpan={2}
                  valign="middle"
                  className=""
                  style={{
                    background: "rgb(207 207 207)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div
                      style={{
                        color: "rgb(131 128 128)",
                      }}
                    >
                      {"No Time Entry"}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th
                  style={{
                    color: "rgb(131 128 128)",
                    background: "rgb(207 207 207)",
                  }}
                >
                  {getTwelveHoursTime(timeEntriesToDisplay?.work_start_time)}
                </th>
              </tr>
            </>
          ) : null}

          <>
            <tr>
              <th style={{ width: 100, color: "#00263d" }}>
                {getTwelveHoursTime(timeEntriesToDisplay?.work_start_time)}
              </th>
              <td rowSpan={2} valign="middle" className="">
                <div className="d-flex justify-content-between align-items-center">
                  <div> {timeEntriesToDisplay?.task_name}</div>
                  <EditTimeEntryModal
                    entryDetails={timeEntriesToDisplay}
                    setIsUpdated={setIsUpdated}
                    setNewUpdate={setNewUpdate}
                  />
                </div>
              </td>
            </tr>

            <tr>
              <th style={{ color: "#00263d" }}>
                {getTwelveHoursTime(timeEntriesToDisplay?.work_end_time)}
              </th>
            </tr>
          </>
        </tbody>
      </table>
    </div>
  );
};

export default ShowJobEntrySection;
