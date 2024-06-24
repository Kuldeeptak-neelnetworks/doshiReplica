import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Header.module.css";

import {
  mainLogo,
  logoutIcon,
  bellIcon1,
  userIcon1,
} from "../../utils/ImportingImages/ImportingImages";
import HeaderPopover from "./HeaderPopover";
import { NotificationModel } from "../Notification/NotificationModel";
import { EditAssignJobModal } from "../../Pages/Jobs/AdminOrManager/AssignJobs/components/EditAssignJobModal";

export const Header = (modalShow) => {
  const [openNotificationModel, setOpenNotificationModel] = useState(false);
  const username = localStorage.getItem("username") ?? "User";
  const navigate = useNavigate();


  return (
    <nav className={styles.navbar}>
      <img
        className={`${styles.mainLogo} cursor-pointer`}
        src={mainLogo}
        alt="main-logo"
        onClick={() => navigate("/dashboard")}
      />
      <div className={styles.subNav}>
      <NotificationModel 
     />
        <div className="d-flex justify-content-center align-items-center gap-4">
          <HeaderPopover userIcon1={userIcon1} logoutIcon={logoutIcon} />
          <p className="m-0 fs-5">{username}</p>
        </div>
      </div>
      
      
    </nav>
  
  );
};
