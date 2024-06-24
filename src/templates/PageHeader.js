import React from "react";

import { searchIcon } from "../utils/ImportingImages/ImportingImages";

const PageHeader = ({
  tableInstance,
  icon,
  headerTitle,
  children,
  bottomBorder,
}) => {
  const { state, setGlobalFilter } = tableInstance;
  const { globalFilter } = state;

  return (
    <section
      className={`main-content_header ${
        bottomBorder ? "add-border-bottom custom-border-bottom" : ""
      }`}
    >
      <div className="d-flex justify-content-center align-items-center page-heading">
        <img src={icon} alt={headerTitle} />
        <p className="m-0 fs-4">{headerTitle}</p>
      </div>
      <div className="d-flex justify-content-center align-items-center gap-3">
        <div className="relative-wrapper">
          <img className="search-icon" src={searchIcon} alt="search-icon" />
          <input
            className="input-field"
            type="text"
            placeholder="Search"
            value={globalFilter || ""}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
            }}
          />
        </div>
        {children}
      </div>
    </section>
  );
};

export default PageHeader;
