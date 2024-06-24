import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { ContextAPI } from "../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../ReactHotToast/ReactHotToast";
import { useNavigate } from "react-router-dom";
import { taskImg } from "../../utils/ImportingImages/ImportingImages";
import { bellIcon1 } from "../../utils/ImportingImages/ImportingImages";
import { nnAPIKey } from "../../Context/ApiContext/ApiContext";
import { formatDateTime } from "../../utils/utilities/utilityFunctions";

const MyVerticallyCenteredModal = (props) => {
  const navigate = useNavigate();
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="pt-3 pb-1" closeButton>
        <Modal.Title className="w-100" id="contained-modal-title-vcenter">
          <div className="d-flex justify-content-center align-items-center gap-3">
            Notifications List
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <div>
          {props?.notification
            .filter((a) => a.is_view === "no")
            .slice(0, 4)
            .map((e) => {
              const stripHTML = (html) => {
                return html.replace(/<[^>]*>/g, "");
              };

              const message = stripHTML(e.notification_message);
              // const title = stripHTML(e.notification_for);

              return (
                <div
                  className="notfications-list__li block-section-model d-flex "
                  key={e.id}
                >
                  {/* <div className="d-flex">
                          <img
                            src={taskImg}
                            alt="All Notifications"
                            className="task-img"
                          />
                        </div> */}
                  <div>
                    <ul className="">
                      <li className="notification-title">
                        {e.notification_for}
                      </li>

                      <li className="notifications-message">{message}</li>
                      <li className="notification-date">
                        {formatDateTime(e.notification_send_on)}
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
            <div className="text-center"> 
            {props.notification.filter((a) => a.is_view === "no").length ===
            0 && <p className="">No new notifications</p>}</div>
         
        </div>
       <hr/>

        <p
          className="all-notifications-link "
          onClick={() => {
            navigate("/notifications");
            props.setModalShow(false);
          }}
        >
          View All Notifications
        </p>
      </Modal.Body>
    </Modal>
  );
};

export const NotificationModel = ({}) => {
  const [notification, setNotification] = useState([]);
  const { mainURL } = useContext(ContextAPI);
  const [modalShow, setModalShow] = useState(false);
  const token = localStorage.getItem("token");
  const bearer = "Bearer " + token;
  const newBearer = bearer.replace(/['"]+/g, "");
  const notifications = async () => {
    const userId = localStorage.getItem("userId") ?? null;

    const url =`${mainURL}get/my-notification/${userId}`

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
        ReactHotToast("Unauthorized access.");
      }
    }
  };
  useEffect(() => {
    notifications();
  }, []);
  
  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
        className="" style={{position:"relative"}}
      >
        
       <div><img className={`cursor-pointer`} src={bellIcon1} alt="bell-icon"  /></div>
        <span className="notifications-count" style={{ cursor: "pointer" }}>
          {notification.map((a) => a.is_view === "no").slice(0, 4).length}
          
        </span>
      </div>

      <MyVerticallyCenteredModal
        notification={notification}
        show={modalShow}
        onHide={() => setModalShow(false)}
        setModalShow={setModalShow}
      />
    </>
  );
};
