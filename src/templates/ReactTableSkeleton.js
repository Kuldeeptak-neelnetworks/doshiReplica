import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const ReactTableSkeleton = ({ columnHeaders }) => {
  const rowsCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <section className="ml-30 mr-40">
      <table className="table mt-4 text-center react-table">
        <thead className="react-table_thead">
          <tr className={``}>
            {columnHeaders.map((header, index) => (
              <th className="" key={index}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="react-table_tbody">
          {rowsCount.map((_, idx) => (
            <tr className={``} key={idx}>
              {columnHeaders.map((_, index) => (
                <th className="" key={index}>
                  <Skeleton />
                </th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ReactTableSkeleton;
