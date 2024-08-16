import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GreaterThanWithCircle } from "../../../../utils/ImportingImages/ImportingImages";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import { isGreaterThan10 } from "../../../../utils/utilities/utilityFunctions";

const QuickLinksBlock = () => {
  const { userDetails } = useContext(ContextAPI);
  const navigate = useNavigate();
  const [viewAllLinks, setViewAllLinks] = useState(false);
  const [quickLinks, setQuickLinks] = useState([]);

  const userRole = userDetails?.member_role;

  // team_leaders,members
  // members
  // operation_member
  // it_member

  const validateUserRole = (roles) => {
    if (roles === "all") {
      return true;
    }
    return roles.includes(userRole);
  };

  const quickLinksDataset = [
    {
      link: "Jobs",
      linkUrl: "/jobs",
      allow: validateUserRole(["it_member", "operation_member"]),
    },
    {
      link: "Assign Job",
      linkUrl: "/jobs/assign-job",
      allow: validateUserRole(["it_member", "operation_member"]),
    },
    {
      link: "Teams",
      linkUrl: "/teams",
      allow: "all",
    },
    {
      link: "Members",
      linkUrl: "/members",
      allow: validateUserRole(["it_member", "operation_member","team_leaders,members","members,team_sub_leader"]),
    },
    // {
    //   link: "Holidays",
    //   linkUrl: "/holidays",
    //   allow: validateUserRole(["it_member", "operation_member"]),
    // },
    {
      link: "Profile",
      linkUrl: "/profile",
      allow: "all",
    },
  ];

  const getQuickLinks = () => quickLinksDataset.filter(({ allow }) => allow);

  useEffect(() => {
    setQuickLinks(() =>
      viewAllLinks ? getQuickLinks() : getQuickLinks()?.slice(0, 2)
    );
  }, [viewAllLinks]);

  return (
    <div className="dashboard-block d-flex flex-1 flex-column justify-content-center align-items-center gap-1">
      <div className="block-header d-flex justify-content-between align-items-center w-100">
        <p className="block-title m-0">Quick Links</p>

        {getQuickLinks()?.length > 2 && (
          <p
            className="m-0 font-montserrat fw-medium cursor-pointer"
            onClick={() => setViewAllLinks((prev) => !prev)}
          >
            {viewAllLinks ? "View Less" : "View More"}
          </p>
        )}
      </div>
      <div className="block-content w-100 mt-1">
        {quickLinks?.map((link, index) => (
          <div
            key={index}
            className="content-wrapper d-flex justify-content-between align-items-center w-100 px-4"
          >
            <div className="flex-1 content">{isGreaterThan10(index)}</div>
            <div className="flex-2 justify-self-start content">{link.link}</div>
            <div
              className="flex-1 d-flex justify-content-end content cursor-pointer"
              onClick={() => navigate(link.linkUrl)}
            >
              <GreaterThanWithCircle />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickLinksBlock;
