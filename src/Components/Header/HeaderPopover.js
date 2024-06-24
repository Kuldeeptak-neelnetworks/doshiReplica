import React, { useState, useRef } from "react";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import { useNavigate } from "react-router-dom";

import { userIcon } from "../../utils/ImportingImages/ImportingImages";

const HeaderPopover = ({ userIcon1, logoutIcon }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/");
  };
  return (
    <div ref={ref} className="header-popover">
      <img
        onClick={handleClick}
        className={`cursor-pointer`}
        src={userIcon1}
        alt="user-icon"
      />

      <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref}
        containerPadding={20}
        rootClose={true}
        rootCloseEvent={"click"}
        onHide={() => setShow(!show)}
        bsPrefix="header-popover"
      >
        <Popover id="popover-contained">
          <Popover.Header as="h3">
            <div
              onClick={() => navigate("/profile")}
              className="d-flex justify-content-start align-items-center gap-3 cursor-pointer"
            >
              <img height={14} width={14} src={userIcon} alt="user-icon" />
              <span className="header-text">Profile</span>
            </div>
          </Popover.Header>
          <Popover.Header as="h3">
            <div
              onClick={handleLogout}
              className="d-flex justify-content-start align-items-center gap-3 cursor-pointer"
            >
              <img height={14} width={14} src={logoutIcon} alt="logout-icon" />
              <span className="header-text">Log out</span>
            </div>
          </Popover.Header>
        </Popover>
      </Overlay>
    </div>
  );
};

export default HeaderPopover;
