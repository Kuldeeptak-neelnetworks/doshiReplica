import React, { useContext, useMemo, useEffect, useState } from "react";
import { ContextSidebarToggler } from "../../../../Context/SidebarToggler/SidebarToggler";
import Breadcrumbs from "../../../../templates/Breadcrumbs";
import {
  DownSVG,
  reportsIcon,
  teamsIcon1,
} from "../../../../utils/ImportingImages/ImportingImages";
import styles from "./TeamsContent.module.css";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";


const TeamMemberList = ({
  // teamData,
  setIsUpdated,
  isLoading,
  content,
}) => {
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const { getTeamDetailsByMemberId, initialState } = useContext(ContextAPI);
  const [teamData, setTeamData] = useState(null);

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Teams",
      pageURL: "/teams",
    },
  ];

  useEffect(() => {
    getTeamDetailsByMemberId();
  }, []);

  useEffect(() => {
    setTeamData(initialState.myTeams);
  }, [initialState.myTeams]);

  const parseMembers = (memberNamesString) => {
    const members = memberNamesString.split(",").map((member) => member.trim());
    return members.map((member) => {
      const [name, role] = member.split("(");
      return {
        name: name.trim(),
        role: role ? role.replace(")", "").trim() : "No role",
      };
    });
  };
  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>
      <div></div>

      {/* Top header section */}
      <div className="mb-5">
        <section className="main-content_header">
          <div className="d-flex justify-content-center align-items-center page-heading">
            <img src={teamsIcon1} alt={"Teams"} />
            <p className="m-0 fs-4">Team Member</p>
          </div>
        </section>
      </div>
      {/* filters */}
      <div className="">
        {/* Team Details */}
        {teamData?.team_name ? (
          <div className="mr-40 ml-30 mb-15 my-teams-wrapper d-flex justify-content-start align-items-start gap-5 w-75">
            <div className="w-25">
              <p className={`m-0 ${styles.heading}`}>
                {initialState.myTeams?.team_name}
              </p>
              <p className={`m-0 mt-4 ${styles.title}`}>Members list</p>
              <p className={`m-0 mt-2 ${styles.membersCount}`}>
                {teamData?.member_count} members
              </p>

              <div className={`mt-3 ${styles.teamMembersList}`}>
                {teamData?.member_names?.split(",")?.map((member, index) => (
                  <p key={index} className={`m-0 ${styles.text}`}>
                    {member}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mr-40 ml-30 mb-15">
            <h5>You are not a part of any Team yet!</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberList;
