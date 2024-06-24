import { useMemo } from "react";
import Select from "react-select";

import {
  searchIcon,
  reportsIcon,
  userIcon,
} from "../../../utils/ImportingImages/ImportingImages";

const entryAsOptions = [
  { label: "Member", value: "member" },
  { label: "Team", value: "team" },
];
const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
];

const TimeEntriesFilter = ({
  filters,
  setFilters,
  forTeamLeader,
  timeEntries,
  filterDiscountedData,
}) => {
  const reviewerOptions = useMemo(() => {
    if (filters.showDiscountedHoursEntries) {
      const options = filterDiscountedData(timeEntries)?.reduce((acc, curr) => {
        if (!Boolean(acc.find(({ value }) => value === curr.reviewer_name))) {
          acc.push({ label: curr.reviewer_name, value: curr.reviewer_name });
        }
        return acc;
      }, []);

      return options;
    } else {
      return [];
    }
  }, [filters.showDiscountedHoursEntries, timeEntries, filterDiscountedData]);

  return (
    <div className="mr-40 ml-30 mt-5">
      <div className="d-flex justify-content-between align-items-center gap-4">
        <div className="flex-1 d-flex gap-4">
          {/* entry as filter only for admin / manager */}
          {!forTeamLeader && (
            <div className="relative-wrapper w-25">
              <img className="search-icon" src={searchIcon} alt="search-icon" />
              <Select
                closeMenuOnSelect={true}
                isClearable={true}
                options={entryAsOptions}
                onChange={(option) => {
                  setFilters((prev) => ({
                    ...prev,
                    entryAs: option,
                  }));
                }}
                value={filters.entryAs}
                placeholder="Select Entry as"
                className="react-select-custom-styling__container"
                classNamePrefix="react-select-custom-styling"
              />
            </div>
          )}

          {/* select reviewer filter only for admin / manager && Discounted Hours checkbox should be true */}
          {!forTeamLeader && filters.showDiscountedHoursEntries ? (
            <div className="relative-wrapper w-25">
              <img className="search-icon" src={userIcon} alt="user-icon" />
              <Select
                closeMenuOnSelect={true}
                isClearable={true}
                options={reviewerOptions}
                onChange={(option) => {
                  setFilters((prev) => ({
                    ...prev,
                    reviewer: option,
                  }));
                }}
                value={filters.reviewer}
                placeholder="Select Reviewer"
                className="react-select-custom-styling__container"
                classNamePrefix="react-select-custom-styling"
              />
            </div>
          ) : (
            <div className="relative-wrapper w-25">
              <img
                className="search-icon"
                src={reportsIcon}
                alt="reports-icon"
              />
              <Select
                closeMenuOnSelect={true}
                isClearable={true}
                options={statusOptions}
                onChange={(option) => {
                  setFilters((prev) => ({
                    ...prev,
                    status: option,
                  }));
                }}
                value={filters.status}
                placeholder="Select Status"
                className="react-select-custom-styling__container"
                classNamePrefix="react-select-custom-styling"
              />
            </div>
          )}
        </div>
        {/* check discounted hours checkbox */}
        {!forTeamLeader && (
          <div className="form-group flex-row align-items-center justify-content-start">
            <label
              style={{ width: "max-content" }}
              htmlFor="discountedHoursEntries"
            >
              Adjusted Hours:
            </label>
            <input
              id="discountedHoursEntries"
              name="discountedHoursEntries"
              type="checkbox"
              style={{ marginLeft: "10px" }}
              className="cursor-pointer checkbox-input"
              value={filters.showDiscountedHoursEntries}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  showDiscountedHoursEntries: e.target.checked,
                }))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeEntriesFilter;
