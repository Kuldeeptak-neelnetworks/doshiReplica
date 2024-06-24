import React, { useContext, useEffect, useState } from "react";
import { bellIcon1 } from "../../utils/ImportingImages/ImportingImages";
import { taskImg } from "../../utils/ImportingImages/ImportingImages";
import axios from "axios";
import { ContextAPI } from "../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../ReactHotToast/ReactHotToast";
import { nnAPIKey } from "../../Context/ApiContext/ApiContext";
import {
  formatDateTime,
  headerOptions,
} from "../../utils/utilities/utilityFunctions";
import { useNavigate } from "react-router-dom";

export const GetAllNotifications = ({}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(10);
  const { mainURL } = useContext(ContextAPI);
  const token = localStorage.getItem("token");
  const bearer = "Bearer " + token;
  const newBearer = bearer.replace(/['"]+/g, "");
  const [markAllChecked, setMarkAllChecked] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  const [updateNotification, setUpdateNotification] = useState({
    operationType: "",
    notificationsIds: "",
  });

  const notifications = async (page) => {
    console.log(page, "pagepagepage");
    const userId = localStorage.getItem("userId") ?? null;
    const url = `${mainURL}get/my-notification/${userId}?page=${page}`;

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
        setNotification(result.data.notifications_data.notifications);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/unauthorized");
        ReactHotToast("Unauthorized access.");
      }
    }
  };

  useEffect(() => {
    notifications();
  }, []);

  useEffect(() => {
    notifications(currentPage);
  }, [currentPage]);

  const pageNumbers = Math.ceil(notification.length / notificationsPerPage);
  

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pageNumbers) {
      setCurrentPage(pageNumber);
    } else if (pageNumber < 1) {
      setCurrentPage(1);
    } else {
      setCurrentPage(pageNumbers);
    }
  };
  const updateNotifications = async () => {
    setIsLoading(true);
    try {
      const notificationIds = notification
        .filter((item) => item.isChecked)
        .map((item) => item.id)
        .join(",");
      const body = {
        current_user: localStorage.getItem("userId") ?? null,
        operation_type: updateNotification.operationType,
        notifications_ids: notificationIds,
      };
      const url = `${mainURL}update/my-notification`;
      const result = await axios.put(url, body, { headers: headerOptions() });
      if (result.status === 200) {
        notifications(currentPage);
        ReactHotToast(result.data.message, "success");
      }
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNotification = (e) => {
    e.preventDefault();
    updateNotifications();
  };

  useEffect(() => {
    setNotification(
      notification.map((item) => ({ ...item, isChecked: false }))
    );
  }, []);

  const toggleMarkAll = (event) => {
    const isChecked = event.target.checked;
    setMarkAllChecked(isChecked);
    setShowUpdateButton(isChecked);
    setNotification(notification.map((item) => ({ ...item, isChecked })));

    const operationType = isChecked
      ? "all"
      : notification.some((item) => item.isChecked)
      ? "single"
      : "none";
    setUpdateNotification((prevState) => ({
      ...prevState,
      operationType,
    }));
  };

  const toggleIndividualCheckbox = (index) => {
    if (index >= 0 && index < notification.length) {
      const updatedNotifications = [...notification];
      updatedNotifications[index].isChecked =
        !updatedNotifications[index].isChecked;
      setNotification(updatedNotifications);
      const allChecked = updatedNotifications.every((item) => item.isChecked);
      setMarkAllChecked(allChecked);

      const operationType = allChecked
        ? "all"
        : updatedNotifications.some((item) => item.isChecked)
        ? "single"
        : "none";
      const notificationsIds = updatedNotifications
        .filter((item) => item.isChecked)
        .map((item) => item.id)
        .join(",");
      setUpdateNotification({ operationType, notificationsIds });

      setShowUpdateButton(updatedNotifications.some((item) => item.isChecked));
    }
  };

  return (
    <>
      <div>
        <div class="main-content">
          <section className="main-content_header">
            <div className="d-flex justify-content-start align-items-center page-heading w-100 ">
              <img src={bellIcon1} alt="All Notifications" />
              <p className="m-0 fs-4">All Notifications</p>
            </div>
          </section>
        {console.log(notification.length)}
          <div>
            {console.log(notification, "notification")}
            <div className="main-header mt-5 ">
            {notification.filter((a) => a.is_view === "no").length === 0 ? (
                ""
              ) : (
                <div
                  className="d-flex justify-content-start"
                  style={{ gap: "10px" }}
                >
                  <div className="mb-5">
                    <input
                  id="markAll"
                      type="checkbox"
                      onChange={toggleMarkAll}
                      checked={markAllChecked}
                      className="cursor-pointer checkbox-input"
                    />
                    <span className="pr-4"> Mark All</span>
                  </div>

                  <div>
                    {showUpdateButton && (
                      <button
                        onClick={handleUpdateNotification}
                        className="custom-btn"
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>
              )}

              {notification
                .filter((a) => a.is_view === "no")
                .map((e, index) => {
                  const stripHTML = (html) => {
                    return html.replace(/<[^>]*>/g, "");
                  };

                  const message = stripHTML(e.notification_message);
                  const title = stripHTML(e.notification_for);

                  return (
                    <>
                      <div
                        className="notfications-list__li block-section d-flex "
                        key={e.id}
                      >
                        <div>
                          <input
                              id="markAll"
                            type="checkbox"
                            onChange={() => toggleIndividualCheckbox(index)}
                            checked={e.isChecked}
                            className="cursor-pointer checkbox-input"
                          />
                        </div>
                        {/* <div className="d-flex">
                          <img
                            src={taskImg}
                            alt="All Notifications"
                            className="task-img"
                          />
                        </div> */}
                        <div>
                          <ul className="">
                            <li className="notification-title">{title}</li>

                            <li className="notifications-message">{message}</li>
                            <li className="notification-date">
                              {formatDateTime(e.notification_send_on)}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </>
                  );
                })}
              {notification.filter((a) => a.is_view === "no").length === 0 && (
                <p className="d-flex justify-content-center">No new notifications</p>
              )}
            </div>
           {notification.length > 0 && ( 
       
              <div className="d-flex justify-content-center">
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <a
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                      >
                        Previous
                      </a>
                    </li>
                    {Array.from(
                      { length: pageNumbers },
                      (_, index) => index + 1
                    ).map((number) => (
                      <li
                        key={number}
                        className={`page-item ${
                          currentPage === number ? "active" : ""
                        }`}
                      >
                        <a
                          className="page-link"
                          onClick={() => paginate(number)}
                        >
                          {number}
                        </a>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === pageNumbers ? "disabled" : ""
                      }`}
                    >
                      <a
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                      >
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
           )}
          </div>
        </div>
      </div>
    </>
  );
};
