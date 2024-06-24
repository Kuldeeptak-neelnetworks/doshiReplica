import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "./NoPage.css";
import { ContextSidebarToggler } from "../../Context/SidebarToggler/SidebarToggler";

export const NoPage = () => {
  const token = localStorage.getItem("token");
  const { sidebarClose } = useContext(ContextSidebarToggler);
  return (
    <div
      className={`${token ? "main-content" : ""} ${
        token && sidebarClose ? "sidebarClose" : ""
      } `}
    >
      <section className="page_404 text-center">
        <div className="four_zero_four_bg">
          <h1 className="text-center ">404</h1>
        </div>

        <div className="contant_box_404">
          <h3 className="h2">Look like you're lost</h3>

          <p>the page you are looking for is not avaible!</p>

          <Link to="/" className="link_404 text-decoration-none">
            Go to Home
          </Link>
        </div>
      </section>
    </div>
  );
};
