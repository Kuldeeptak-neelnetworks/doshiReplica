import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {unauthorized} from "../../utils/ImportingImages/ImportingImages"

// import "./NoPage.css";
import { ContextSidebarToggler } from "../../Context/SidebarToggler/SidebarToggler";

export const Unauthorized = () => {
  const token = localStorage.getItem("token");
  const { sidebarClose } = useContext(ContextSidebarToggler);
  return (
    <div
      className={`${token ? "main-content" : ""} ${
        token && sidebarClose ? "sidebarClose" : ""
      } `}
    >
        
      <section className="page_404 text-center">
        <div className="four_zero_four_b">
          {/* <img src={unauthorized} /> */}
          <h1 className="text-center ">401</h1>
        </div>

        <div className="contant_box_404 mt-3">
          <h1>Unauthorized</h1>
      

          <Link to="/" className="link_404 text-decoration-none">
            Go to Home
          </Link>
        </div>
      </section>
    </div>
  );
};
