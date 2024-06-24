import React from "react";

import loginMan from "../assets/images/loginMan.png";

const FormWrapper = ({ children }) => {
  return (
    <div className="main-screen-wrapper">
      <div className="parent-wrapper">
        <div className="child-wrapper">
          <div className="child child1-wrapper">
            <img className="login-screen-man" src={loginMan} alt="login-user" />
          </div>
          <div className="child child2-wrapper">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default FormWrapper;
