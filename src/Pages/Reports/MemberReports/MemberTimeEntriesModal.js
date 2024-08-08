import Modal from "react-bootstrap/Modal";
import { EyeIconWithCircle } from "../../../utils/ImportingImages/ImportingImages";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import {
  isGreaterThan10,
  getTwelveHoursTime,
} from "../../../utils/utilities/utilityFunctions";
import styles from "./MemberTimeEntries.module.css";
import { nnAPIKey } from "../../../Context/ApiContext/ApiContext";
import Calendar from "react-calendar";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";

const MyVerticallyCenteredModal = (props) => {
  const [entryDetails, setEntryDetails] = useState({
    calendarDate: new Date(),
  });
  const formatDateToYYYYMMDD = (inputDate) => {
    const date = new Date(inputDate);
    const dd = isGreaterThan10(date.getDate());
    const mm = isGreaterThan10(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      dialogClassName="modal-fullscreen"

      // size="xl"
      // aria-labelledby="contained-modal-title-vcenter"
      // centered
      // className="modal-xl"
      // style={{ height: "100%" }}
      // size="lg"
      // aria-labelledby="contained-modal-title-vcenter"
      // centered
    >
      <Modal.Header className="pt-3 pb-1" closeButton>
        <Modal.Title className="w-100" id="contained-modal-title-vcenter">
          <div className="d-flex justify-content-center align-items-center gap-3">
            <span className="modal-title">Time Entries</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="modal-body"

        // style={{ width: "100%", overflowY: "auto" }}
      >
        <section className="main-content_form-section d-flex flex-column gap-3">
          <div className="gap-5 d-flex align-items-start m-auto">
            <div className="width-40 mt-5">
              <Calendar
                className={`${styles.reactCalendar} ${styles.customReactCalendar}`}
                maxDate={new Date()}
                onChange={(date) => {
                  const formattedDate = formatDateToYYYYMMDD(date);
                  props.onDateSelect(formattedDate);
                  setEntryDetails((prev) => ({ ...prev, calendarDate: date }));
                }}
              />
            </div>

            <div
              className="mt-5"
              style={{
                background: "#e0fbfc",
                borderRadius: "10px",
                boxShadow: "1px 2px 4px gray",
                width: "100%",
                padding: "20px 20px",
              }}
            >
              <div className="d-flex justify-content-between ">
                <h3 style={{ color: "#00263d" }}>
                  Date:{formatDateToYYYYMMDD(entryDetails?.calendarDate)}
                </h3>

                <p>
                  <span className="fs-5">
                    {" "}
                    Total Working Hours :{" "}
                    {props?.memberTimeEntries.map((e) => {
                      return (
                        <div>
                          <p className="">{e.total_time_for_days}</p>
                        </div>
                      );
                    })}
                    {props?.memberTimeEntries.length === 0 && (
                      <div className="message">0</div>
                    )}
                  </span>
                </p>
              </div>

              <div></div>
              {/* className={styles.memberTimeEntriesList} */}
              <div
                className=" d-flex justify-content-space-between "
                style={{ backgroundColor: "#fff" }}
              >
                <div className="w-100">
                  <table
                    className="table table-bordered"
                    style={{ marginBottom: "0px" }}
                  >
                    <tbody>
                      {props.memberTimeEntries.map((entry, index) => (
                        <React.Fragment key={entry.id}>
                          <tr>
                            <th
                              style={{
                                width: 100,
                                color: "#00263d",
                                background: "#fff",
                              }}
                            >
                              {getTwelveHoursTime(
                                entry.work_start_time
                                  .split(":")
                                  .slice(0, -1)
                                  .join(":")
                              )}
                            </th>
                            <td rowSpan={2} valign="middle" className="">
                              <div
                                className="d-flex justify-content-between align-items-center "
                                style={{ lineHeight: "1.7" }}
                              >
                                <div>
                                  <div>
                                    <span style={{ fontWeight: "bold" }}>
                                      Task Name:
                                    </span>{" "}
                                    {entry.task_name}
                                  </div>
                                  <div>
                                    <span style={{ fontWeight: "bold" }}>
                                      Status:
                                    </span>
                                    <Stack direction="horizontal">
                                      {entry.time_entries_status ===
                                      "pending" ? (
                                        <Badge bg="warning" text="dark">
                                          Pending
                                        </Badge>
                                      ) : entry.time_entries_status ===
                                        "approved" ? (
                                        <Badge bg="danger">Approved</Badge>
                                      ) : null}
                                    </Stack>
                                  </div>
                                  <div>
                                    <span style={{ fontWeight: "bold" }}>
                                      Description:
                                    </span>
                                    {entry.work_description}
                                  </div>
                                  <div>
                                    <span style={{ fontWeight: "bold" }}>
                                      Entries Type:
                                    </span>
                                    {entry.time_entries_type}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th
                              style={{
                                color: "#00263d",
                                background: "#fff",
                              }}
                            >
                              {getTwelveHoursTime(
                                entry.work_end_time
                                  .split(":")
                                  .slice(0, -1)
                                  .join(":")
                              )}
                            </th>
                          </tr>

                          {index < props.memberTimeEntries.length - 1 &&
                            entry.work_end_time !==
                              props.memberTimeEntries[index + 1]
                                .work_start_time && (
                              <tr>
                                <th
                                  className=""
                                  style={{
                                    background: "rgb(207 207 207)",
                                    color: "rgb(131 128 128)",
                                  }}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      {getTwelveHoursTime(
                                        entry.work_end_time
                                          .split(":")
                                          .slice(0, -1)
                                          .join(":")
                                      )}{" "}
                                      {getTwelveHoursTime(
                                        props.memberTimeEntries[
                                          index + 1
                                        ].work_start_time
                                          .split(":")
                                          .slice(0, -1)
                                          .join(":")
                                      )}
                                    </div>
                                  </div>
                                </th>
                                <td
                                  style={{
                                    background: "rgb(207 207 207)",
                                  }}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div
                                      style={{
                                        marginTop: "7px",
                                        color: "rgb(131 128 128)",
                                      }}
                                    >
                                      {"No Time Entry"}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                        </React.Fragment>
                      ))}
                      {props.memberTimeEntries.length === 0 && (
                        <tr>
                          <td colSpan="2">
                            <div className="message">
                              No time entries available
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
};

export const MemberTimeEntriesModal = ({ memberUserId, setIsUpdated }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalShow, setModalShow] = useState(false);
  const [memberTimeEntries, setMemberTimeEntries] = useState([]);
  const { mainURL } = useContext(ContextAPI);

  const token = localStorage.getItem("token");
  const bearer = "Bearer " + token;
  const newBearer = bearer.replace(/['"]+/g, "");

  const formatDateToYYYYMMDD = (inputDate) => {
    const date = new Date(inputDate);
    const dd = isGreaterThan10(date.getDate());
    const mm = isGreaterThan10(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const timeEntries = async () => {
    const userId = localStorage.getItem("userId") ?? null;
    const formattedDate = formatDateToYYYYMMDD(selectedDate);

    const url = `${mainURL}get/members/daily-time-sheet/${userId}/${memberUserId}/${formattedDate}`;

    const authentication = {
      "Content-Type": "application/json",
      Accept: "application/json",
      NN_Api_key: nnAPIKey,
      Authorization: newBearer,
    };

    try {
      const result = await axios.get(url, {
        headers: authentication,
      });

      if (result.status === 200) {
        setMemberTimeEntries(result.data.time_sheet);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        ReactHotToast("Unauthorized access.");
      }
    }
  };

  useEffect(() => {
    timeEntries(selectedDate);
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // setModalShow(false);
  };

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
        className="cursor-pointer"
      >
        <EyeIconWithCircle />
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        memberTimeEntries={memberTimeEntries}
        onHide={() => setModalShow(false)}
        memberUserId={memberUserId}
        setIsUpdated={setIsUpdated}
        calendarDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
    </>
  );
};
