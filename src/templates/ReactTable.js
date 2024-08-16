import React, { useContext, useMemo, useEffect, useState } from "react";
import {
  DoubleArrowsSVG,
  DownArrow,
  UpArrow,
} from "../utils/ImportingImages/ImportingImages";
import AccordionComponent from "../Pages/Teams/MemberOrTeamLeader/components/AccordionComponents";

// import AccordionComponent from "./AccordionComponent";
const ReactTable = ({ tableInstance, currentRow, setIsUpdated }) => {
  const userRole = localStorage.getItem("userRole");
  const [selectedIds, setSelectedIds] = useState([]);
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    tableInstance;

  const noSorting = ["Edit", "Delete", "Action"];

  // const nonBillableRows = page.filter(row => row.original.time_entries_type !== "billable_hours");
  // const sideWorkRows = page.filter(row => row.original.time_entries_type === "side_work");
  // const combinedRows = [...nonBillableRows, ...sideWorkRows];
  return (
    <table {...getTableProps()} className="table mt-4 text-center react-table">
      <thead className="react-table_thead">
        {headerGroups.map((headerGroup) => (
          <tr
            className={``}
            {...headerGroup.getHeaderGroupProps()}
            key={headerGroup.getFooterGroupProps}
          >
            {headerGroup.headers.map((column) => {
              return (
                <th
                  className=""
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                >
                  <span>
                    <span>{column.render("Header")} </span>
                    <span>
                      {noSorting.includes(column.Header) ||
                      column.id === "selection_id" ? null : column.isSorted ? (
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
        {page.map((row, index) => {
          prepareRow(row);
          return (
            <>
              <tr className={``} {...row.getRowProps()} key={index}>
                {row.cells.map((cell) => {
                  return (
                    <>
                      <td
                        {...cell.getCellProps()}
                        key={cell?.row?.id}
                        className=""
                      >
                        {cell.render("Cell")}
                      </td>
                    </>
                  );
                })}
              </tr>
        
              {row.original.task_id && row.original.task_id === currentRow ? (
                <tr>
                  {userRole === "team_leaders,members" || userRole === "members,team_sub_leader" ? (
                    <td colSpan={9}>
                      <AccordionComponent
                        setIsUpdated={setIsUpdated}
                        content={row.original.time_entries_for_task}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                        
                      />
                 
                    </td>
                  ) : null}
                </tr>
              ) : null}
           
            </>
          );
        })}
      </tbody>
    </table>
  );
};

export default ReactTable;


// import React from "react";
// import {
//   DoubleArrowsSVG,
//   DownArrow,
//   UpArrow,
// } from "../utils/ImportingImages/ImportingImages";

// const ReactTable = ({ tableInstance }) => {
//   const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
//     tableInstance;

//   const noSorting = ["Edit", "Delete", "Action"];

//   return (
//     <table {...getTableProps()} className="table mt-4 text-center react-table">
//       <thead className="react-table_thead">
//         {headerGroups.map((headerGroup) => (
//           <tr
//             className={``}
//             {...headerGroup.getHeaderGroupProps()}
//             key={headerGroup.getFooterGroupProps}
//           >
//             {headerGroup.headers.map((column) => {
//               return (
//                 <th
//                   className=""
//                   {...column.getHeaderProps(column.getSortByToggleProps())}
//                   key={column.id}
//                 >
//                   <span>
//                     <span>{column.render("Header")} </span>
//                     <span>
//                       {noSorting.includes(column.Header) ||
//                       column.id === "selection_id" ? null : column.isSorted ? (
//                         column.isSortedDesc ? (
//                           <span className="sorting_arrow-size">
//                             <DownArrow />
//                           </span>
//                         ) : (
//                           <span className="sorting_arrow-size">
//                             <UpArrow />
//                           </span>
//                         )
//                       ) : (
//                         <span className="sorting_arrow-size">
//                           <DoubleArrowsSVG />
//                         </span>
//                       )}
//                     </span>
//                   </span>
//                 </th>
//               );
//             })}
//           </tr>
//         ))}
//       </thead>
//       <tbody className="react-table_tbody" {...getTableBodyProps()}>
//         {page.map((row, index) => {
//           prepareRow(row);
//           return (
//             <tr className={``} {...row.getRowProps()} key={index}>
//               {row.cells.map((cell) => {
//                 return (
//                   <>
//                     <td
//                       {...cell.getCellProps()}
//                       key={cell?.row?.id}
//                       className=""
//                     >
//                       {cell.render("Cell")}
//                     </td>
//                   </>
//                 );
//               })}
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// };

// export default ReactTable;
