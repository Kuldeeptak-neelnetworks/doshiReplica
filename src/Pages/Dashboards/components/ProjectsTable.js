import React from "react";

import {
  DoubleArrowsSVG,
  DownArrow,
  UpArrow,
} from "../../../utils/ImportingImages/ImportingImages";
import { useNavigate } from "react-router-dom";

const ProjectsTable = ({ tableInstance, projectsData }) => {
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    pageOptions,
    canNextPage,
    prepareRow,
    setPageSize,
    state,
    setGlobalFilter,
    gotoPage,
  } = tableInstance;

  const { pageSize, pageIndex } = state;

  return (
    <section className="d-flex flex-1 flex-column justify-content-center align-items-center dashboard-summary-block">
      <table
        {...getTableProps()}
        className="table mt-4 text-center react-table"
      >
        <thead className="react-table_thead">
          {headerGroups?.map((headerGroup) => (
            <tr className={``} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers?.map((column) => {
                return (
                  <th
                    className=""
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <span>
                      <span>{column.render("Header")} </span>
                      <span>
                        {column.Header === "Edit" ||
                        column.Header === "Delete" ? (
                          ""
                        ) : column.isSorted ? (
                          column.isSortedDesc ? (
                            <span className="sorting_arrow-size">
                              <DownArrow />
                            </span>
                          ) : (
                            <span className="sorting_arrow-size">
                              <UpArrow />
                            </span>
                          )
                        ) : (
                          <span className="sorting_arrow-size">
                            <DoubleArrowsSVG />
                          </span>
                        )}
                      </span>
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="react-table_tbody" {...getTableBodyProps()}>
          {page?.map((row, index) => {
            prepareRow(row);
            return (
              <tr className={``} {...row.getRowProps()} key={index}>
                {row.cells?.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="">
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        {userRole === "team_leaders,members" ? (
          ""
        ) : (
          <p
            style={{ cursor: "pointer", fontSize: "14", fontWeight: "500" }}
            onClick={() => navigate("/reports/get-all-invoice")}
          >
            Show More
          </p>
        )}
      </div>
      {/* <div className="react-table_tfoot p-0 d-flex justify-content-between align-items-center">
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
      </div> */}
    </section>
  );
};

export default ProjectsTable;
