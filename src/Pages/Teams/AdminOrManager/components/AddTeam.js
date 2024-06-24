import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { ContextSidebarToggler } from "../../../../Context/SidebarToggler/SidebarToggler";
import { teamsIcon1 } from "../../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../../Components/SpinningLoader/SpinningLoader";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import { ReactHotToast } from "../../../../Components/ReactHotToast/ReactHotToast";
import Breadcrumbs from "../../../../templates/Breadcrumbs";
import {
  handleAPIError,
  headerOptions,
  onlyActiveMembersNotInATeam,
} from "../../../../utils/utilities/utilityFunctions";

const animatedComponents = makeAnimated();

const AddTeam = () => {
  const { initialState, getAllMembers, logout, mainURL } =
    useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/teams",
    },
    {
      pageName: "Teams",
      pageURL: "/teams",
    },
    {
      pageName: "Add Team",
      pageURL: "/teams/add-team",
    },
  ];

  const [options, setOptions] = useState({
    teamLeaderOptions: [],
    teamMembersOptions: [],
  });

  const [teamDetails, setTeamDetails] = useState({
    teamName: "",
    teamLeader: "",
    teamMembers: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toggle, setToggle] = useState(false);

  // fetching all members list
  useEffect(() => {
    getAllMembers();
    
  }, [toggle]);

  // Only users with members role with status Active & not in any team
  const membersList = onlyActiveMembersNotInATeam(initialState.membersList);

  // if team leader is selected then removing that user, and passing the rest active members in Members Options
  const getMembersOptions = () =>
    teamDetails.teamLeader !== ""
      ? membersList.filter(
          (member) => member.value !== teamDetails.teamLeader.value
        )
      : [];

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      teamLeaderOptions: membersList,
      teamMembersOptions: getMembersOptions(),
    }));
  }, [initialState.membersList, teamDetails]);

  const handleTeamLeader = (member) => {
    setTeamDetails((prev) => ({
      ...prev,
      teamLeader: member,
    }));
  };

  const handleTeamMembers = (member) =>
    setTeamDetails((prev) => ({ ...prev, teamMembers: member }));

  const selectedTeamMembers = () =>
    teamDetails.teamMembers.map(({ value }) => value).join(",");

  // for adding a new team api
  const addNewTeam = async () => {
    setIsLoading(() => true);
    try {
      const body = {
        current_user: +localStorage.getItem("userId") ?? null,
        team_name: teamDetails.teamName,
        team_leader: +teamDetails.teamLeader?.value,
        team_member: selectedTeamMembers(),
      };

      const url = `${mainURL}add/team`;
      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 201) {
        ReactHotToast(result.data.message, "success");
        setTeamDetails(() => ({
          teamName: "",
          teamLeader: "",
          teamMembers: [],
        }));
        setToggle((prev) => !prev);
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
    }
  };

  const handleAddNewTeam = (e) => {
    e.preventDefault();
    const bool =
      teamDetails.teamName !== "" &&
      teamDetails.teamLeader !== "" &&
      teamDetails.teamMembers.length > 0;

    if (bool) {
      addNewTeam();
    } else {
      if (teamDetails.teamName === "") {
        ReactHotToast("Please provide team name!", "error");
      } else if (teamDetails.teamLeader === "") {
        ReactHotToast("Please select team leader!", "error");
      } else if (teamDetails.teamMembers.length <= 0) {
        ReactHotToast("Please select team members!", "error");
      }
    }
  };

  return (
    <div className={`main-content ${sidebarClose ? "sidebarClose" : ""}`}>
      <div className="mr-40 ml-30 mb-15">
        <Breadcrumbs crumbs={breadCrumbs} />
      </div>

      <section className="main-content_header">
        <div className="d-flex justify-content-start align-items-center page-heading w-100 custom-border-bottom">
          <img src={teamsIcon1} alt="teams" />
          <p className="m-0 fs-4">Add Team</p>
        </div>
      </section>

      <section className="main-content_form-section">
        <form
          onSubmit={handleAddNewTeam}
          className="d-flex flex-column justify-content-center align-items-start width-35 m-auto"
        >
          <div className="form-group mt-5 w-100">
            <label htmlFor="teamName">Team Name:</label>
            <input
              id="teamName"
              name="teamName"
              placeholder="Eg: Team Zathura"
              type="text"
              required
              value={teamDetails.teamName}
              onChange={(e) =>
                setTeamDetails((prev) => ({
                  ...prev,
                  teamName: e.target.value,
                }))
              }
            />
          </div>
          <div className="form-group mt-4 w-100">
            <label htmlFor="teamLeader">Team Leader:</label>
            <Select
              closeMenuOnSelect={true}
              options={options.teamLeaderOptions}
              onChange={(member) => handleTeamLeader(member)}
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              value={teamDetails.teamLeader}
              name="teamLeader"
            />
          </div>
          <div className="form-group mt-4 w-100">
            <label htmlFor="teamMembers">Team Members:</label>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={options.teamMembersOptions}
              onChange={(member) => handleTeamMembers(member)}
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              value={teamDetails.teamMembers}
              name="teamMembers"
            />
          </div>
          <button type="submit" className="mt-5 custom-btn d-flex m-auto">
            {isLoading ? <SpinningLoader /> : "Add Team"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddTeam;
