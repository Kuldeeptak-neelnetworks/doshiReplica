import React from "react";
import { CSVLink } from "react-csv";
import { DownloadSVG } from "../utils/ImportingImages/ImportingImages";
import PageSizePopover from "../Components/PageSizePopover/PageSizePopover";

const ReactTableFooter = ({ data, headers, tableInstance }) => {
  const { state, pageOptions, previousPage, nextPage, gotoPage } =
    tableInstance;
  const { pageSize, pageIndex } = state;

  return (
    <div
      className={`react-table_tfoot d-flex align-items-center ${
        pageOptions.length > 1
          ? " justify-content-between"
          : " justify-content-end"
      }`}
    >
      {pageOptions.length > 1 ? (
        <>
          <div className="d-flex justfy-content-center align-items-center">
            <span className="cursor-pointer" onClick={() => previousPage()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z"
                />
              </svg>
            </span>
            <input
              className="gotoPage-input-field"
              type="number"
              value={pageIndex + 1}
              onChange={(e) => {
                const pageNumber = e.target.value
                  ? Number(e.target.value) - 1
                  : 0;
                gotoPage(pageNumber);
              }}
            />
            <span className="px-2">/</span>
            <span className="px-2">{pageOptions.length}</span>
            <span className="cursor-pointer" onClick={() => nextPage()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z"
                />
              </svg>
            </span>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <span className="px-1">Rows /page</span>
            <div className="d-flex justify-content-center align-items-center">
              <span className="px-2">{pageSize}</span>
              <span>
                <PageSizePopover tableInstance={tableInstance} />
              </span>
            </div>
          </div>
        </>
      ) : null}

      <div className="d-flex justify-content-center align-items-center gap-2">
        <span>Download List</span>
        <span>
          {data ? (
            <CSVLink
              data={data}
              headers={headers?.headings}
              filename={`${headers.fileName}.csv`}
            >
              <DownloadSVG />
            </CSVLink>
          ) : null}
        </span>
      </div>
    </div>
  );
};

export default ReactTableFooter;
