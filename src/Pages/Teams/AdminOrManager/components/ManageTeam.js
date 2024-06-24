
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";

import { teamsIcon1 } from "../../../../utils/ImportingImages/ImportingImages";
import { SpinningLoader } from "../../../../Components/SpinningLoader/SpinningLoader";
import { ContextSidebarToggler } from "../../../../Context/SidebarToggler/SidebarToggler";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import Breadcrumbs from "../../../../templates/Breadcrumbs";
import { ReactHotToast } from "../../../../Components/ReactHotToast/ReactHotToast";

import {
  formatDate,
  handleAPIError,
  headerOptions,
} from "../../../../utils/utilities/utilityFunctions";

const animatedComponents = makeAnimated();

const ManageTeam = () => {
  const location = useLocation();
  const { sidebarClose } = useContext(ContextSidebarToggler);
  const { getAllMembers, logout, mainURL, initialState } =
    useContext(ContextAPI);
  const { teamData } = location.state ?? "";

  const navigate = useNavigate();
console.log(teamData,"getAllMembers")
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/dashboard",
    },
    {
      pageName: "Teams",
      pageURL: "/teams",
    },
    {
      pageName: "Manage Team",
      pageURL: "/teams/manage-team",
    },
  ];
console.log(teamData,"teamDatateamData")
  const [isLoading, setIsLoading] = useState(false);
  const [updatedTeamData, setUpdatedTeamData] = useState({
    teamName: teamData?.team_name,
    teamCode: teamData?.team_code,
    teamLeader: "",
    teamSubLeader: "",
    teamSubLeader2:teamData?.team_sub_leader,
    teamLeaderEmail:teamData?.leader_email,
    teamMembersCount: teamData?.member_count,
    teamMembersName: [],
    teamStatus: teamData?.status,
    jobs:
      teamData?.assigned_jobs_list?.length > 0
        ? teamData?.assigned_jobs_list
        : [],
    selectedJob: null,
  });
  const [projectOptions, setProjectOptions] = useState([]);
  const [membersOptions, setMembersOptions] = useState([]); // only responsible for maintaining track of members dropdown options
  const [teamLeaderOptions, setTeamLeaderOptions] = useState([]); // only responsible for maintaining track of team leader dropdown options
  const [teamSubLeaderOptions, setTeamSubLeaderOptions] = useState([]); // only responsible for maintaining track of team leader dropdown options


  useEffect(() => {
    setProjectOptions(() =>
      updatedTeamData.jobs.map((job) => ({
        label: job.task_name,
        value: job.task_id,
      }))
    );
  }, [updatedTeamData.jobs]);

  // fetching all members list
  useEffect(() => {
    getAllMembers();
  }, []);
 
  const getJobDetails = () => {
    return updatedTeamData?.jobs?.find(
      (job) => job?.task_id === updatedTeamData?.selectedJob?.value
    );
  };


console.log(updatedTeamData,"gjhfjghdjfhgjdfhkgjhfdjg")

  // If user role is "member" OR "Team Leader but only from this same team then OK"
  const condition1 = (user) =>
    user.member_role === "members" ||
    (user.member_role === "team_leaders,members" &&
      teamData.team_leader === user.member_id);

  // "If member is not in any team" AND "member is not a part of this Team"
  const condition2 = (user) =>
    user.is_added_in_team !== "1" &&
    !teamData.team_member.split(",").includes(user.member_id);

  // "If member is assigned a Team" AND "member is a part of this Team"
  const condition3 = (user) =>
    user.is_added_in_team === "1" &&
    (teamData.team_member.split(",").includes(user.member_id) ||
      teamData.team_leader === user.member_id);


  // helper function for creating Members Dropdown options
  // step 1: taking the complete list of members from initialState
  // step 2: filtering that dataset with 3 conditions
  // step 3: checking that each one of them is active user
  // step 4: lastly mapping over them all and return only specfic object details using map
  const generateOptions = (dataset) => {
    return dataset
      ?.filter((member) => {
        return condition1(member) && (condition2(member) || condition3(member));
      })
      .filter((member) => member.current_status === "active")
      .map((member) => ({
        label: member.member_name,
        value: member.member_id,
      }));
  };


  // setting initial default members, in the members options dropdown
  // (not checking if the default member is selected team leader that we are checking in below useEffect)
  useEffect(() => {
    const defaultMembers = generateOptions(initialState?.membersList).filter(
      (member) => {
        const membersArray = teamData?.team_member.split(",");
        for (let memberId of membersArray) {
          if (memberId === member.value) return true;
        }
      }
    );

    const defaultTeamLeader = generateOptions(initialState?.membersList)?.find(
      (member) => member.value === teamData?.team_leader
    );
   

    const defaultTeamSubLeader = generateOptions(
      initialState?.membersList
    )?.find((member) => {
      console.log("teamData?.team_sub_leader;", teamData?.team_sub_leader);
      return member.value === teamData?.team_sub_leader;
    });


    setUpdatedTeamData((prev) => ({
      ...prev,
      teamMembersName: defaultMembers,
      teamLeader: defaultTeamLeader,
      teamSubLeader: defaultTeamSubLeader,
      
    })); // adding default members that are already in the team
  }, [initialState.membersList]);


  
  // helper function for removing only the selected team leader from the dropdown list
  const generateMemberOptions = () => {
    return generateOptions(initialState?.membersList).filter(
      (member) => +member.value !== +updatedTeamData.teamLeader?.value
    );
  };

  // setting members options
  useEffect(() => {
    setMembersOptions(() => generateMemberOptions()); // for listing all the members options in the dropdowns

    const removeTeamLeader = (dataset) =>
      dataset.filter(
        (member) => member.value !== updatedTeamData.teamLeader?.value
      );

    const teamLeader =
      initialState?.membersList.find(
        (member) => member.member_id === updatedTeamData.teamLeader?.value
      )?.member_email ?? "";
      
    // removing team leader from members option is selected
    setUpdatedTeamData((prev) => {
      return {
        ...prev,
        teamMembersName: removeTeamLeader(prev.teamMembersName),
        teamLeaderEmail: teamLeader,
      };
    });
  }, [updatedTeamData?.teamLeader, initialState?.membersList]);

  // setting team leaders options
  useEffect(() => {
    setTeamLeaderOptions(() => generateOptions(initialState?.membersList)); // for listing all the options in the team leader dropdown
  }, [updatedTeamData?.teamMembersName, initialState?.membersList]);


  // setting team Sub-leader options
  useEffect(() => {
    setTeamSubLeaderOptions(() => generateOptions(initialState?.membersList));
  }, [updatedTeamData?.teamMembersName, initialState?.membersList]);

console.log(teamSubLeaderOptions,"uuuuuuuuuuuuuuuu")

  // for updating a team api
  const updateTeam = async () => {
    setIsLoading(() => true);
    try {
      const body = {
        current_user: +localStorage.getItem("userId") ?? null,
        team_name: updatedTeamData.teamName,
        team_leader: +updatedTeamData.teamLeader?.value,
        team_sub_leader: +updatedTeamData.teamSubLeader?.value,
        team_member: updatedTeamData.teamMembersName
          .map(({ value }) => value)
          .join(","),
        team_id: +teamData.id,
        status: updatedTeamData.teamStatus,
      };

      const url = `${mainURL}update/team`;
      const result = await axios.put(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 200) {
        ReactHotToast(result.data.message, "success");
        navigate("/teams");
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsLoading(() => false);
    }
  };

  const handleUpdateTeam = (e) => {
    e.preventDefault();
    if (
      updatedTeamData.teamName &&
      updatedTeamData.teamLeader &&
      updatedTeamData.teamLeaderEmail &&
      updatedTeamData.teamMembersName &&
      updatedTeamData.teamStatus
    ) {
      updateTeam();
    } else {
      if (updatedTeamData.teamName === "") {
        ReactHotToast("Please input team name!", "error");
      } else if (updatedTeamData.teamLeader === "") {
        ReactHotToast("Please select team leader!", "error");
      } else if (updatedTeamData.teamLeaderEmail === "") {
        ReactHotToast("Please input team leader email!", "error");
      } else if (updatedTeamData.teamMembersName.length <= 0) {
        ReactHotToast("Please select team members!", "error");
      } else if (updatedTeamData.teamStatus === "") {
        ReactHotToast("Please select team status!", "error");
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
          <img src={teamsIcon1} alt="Manage Team" />
          <p className="m-0 fs-4">Manage Team</p>
        </div>
      </section>
      <section className="main-content_form-section d-flex justify-content-center align-items-start w-75 m-auto">
        <form
          onSubmit={handleUpdateTeam}
          className="w-100 d-flex flex-column justify-content-center align-items-center"
        >
          <div className="d-flex justify-content-center align-items-start gap-5 w-100">
            <div className="w-50">
              <div className="form-group mt-5">
                <label htmlFor="teamCode">Team Code:</label>
                <input
                  id="teamCode"
                  name="teamCode"
                  placeholder="Eg: 00101"
                  type="text"
                  value={updatedTeamData?.teamCode}
                  required
                  disabled
                />
              </div>
              <div className="form-group mt-4">
                <label htmlFor="teamName">Team Name:</label>
                <input
                  id="teamName"
                  name="teamName"
                  placeholder="Eg: Team Titans"
                  type="text"
                  value={updatedTeamData?.teamName}
                  onChange={(e) =>
                    setUpdatedTeamData((prev) => ({
                      ...prev,
                      teamName: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="form-group mt-4">
                <label htmlFor="teamLeader">Team Leader:</label>
                <Select
                  name="teamLeader"
                  closeMenuOnSelect={true}
                  options={teamLeaderOptions}
                  onChange={(value) => {
                    setUpdatedTeamData((prev) => ({
                      ...prev,
                      teamLeader: value,
                    }));
                  }}
                  value={updatedTeamData.teamLeader}
                  className="react-select-custom-styling__container"
                  classNamePrefix="react-select-custom-styling"
                />
              </div>
           
              <div className="form-group mt-4">
                <label htmlFor="teamLeader">Team Sub-Leader:</label>
                <Select
                  name="teamSubLeader"
                  closeMenuOnSelect={true}
                  options={teamSubLeaderOptions.filter(
                    (subleader) =>
                      subleader.value !== updatedTeamData.teamLeader.value
                  )}
                  onChange={(value) => {
                    setUpdatedTeamData((prev) => ({
                      ...prev,
                      teamSubLeader: value,
                    }));
                  }}
                  value={updatedTeamData.teamSubLeader}
                  className="react-select-custom-styling__container"
                  classNamePrefix="react-select-custom-styling"
                />
              </div>
              <div className="form-group mt-4">
                <label htmlFor="teamSubLeader2">Current Sub Leader Name:</label>
                <input
                  id="teamSubLeader2"
                  name="teamSubLeader2"
              
                  value={updatedTeamData?.teamSubLeader2}
                  disabled
                />
              </div>

            
              <div className="form-group mt-4">
                <label htmlFor="teamLeaderEmail">Team Leader Email:</label>
                <input
                  id="teamLeaderEmail"
                  name="teamLeaderEmail"
                  placeholder="Eg: mailto:rajshah@gmail.com"
                  type="email"
                  value={updatedTeamData?.teamLeaderEmail}
                  disabled
                />
              </div>
     





             
              <div className="form-group mt-4">
                <label htmlFor="teamMemberCount">Team Member Count:</label>
                <input
                  id="teamMemberCount"
                  name="teamMemberCount"
                  placeholder="Eg: 12"
                  type="number"
                  value={updatedTeamData?.teamMembersCount}
                  disabled
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-25 custom-btn d-flex justify-content-center align-items-center"
              >
                {isLoading ? <SpinningLoader /> : "Update"}
              </button>
            </div>
            <div className="w-50">
              <div className="form-group mt-5">
                <label htmlFor="teamMembers">Team Members:</label>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={membersOptions}
                  onChange={(member) => {
                    setUpdatedTeamData((prev) => ({
                      ...prev,
                      teamMembersName: member,
                    }));
                  }}
                  name="teamMembers"
                  value={updatedTeamData.teamMembersName}
                  className="react-select-custom-styling__container"
                  classNamePrefix="react-select-custom-styling"
                />
              </div>
              <div className="form-group mt-4">
                <label htmlFor="teamStatus">Team Status:</label>
                <Select
                  name="teamStatus"
                  closeMenuOnSelect={true}
                  options={statusOptions}
                  onChange={({ value }) =>
                    setUpdatedTeamData((prev) => ({
                      ...prev,
                      teamStatus: value,
                    }))
                  }
                  value={
                    updatedTeamData.teamStatus === "active"
                      ? { label: "Active", value: "active" }
                      : { label: "Inactive", value: "inactive" }
                  }
                  className="react-select-custom-styling__container"
                  classNamePrefix="react-select-custom-styling"
                />
              </div>

              <div className="form-group mt-4">
                <label htmlFor="clientName">Project Details:</label>
                <Select
                  name="teamStatus"
                  closeMenuOnSelect={true}
                  options={projectOptions}
                  onChange={(option) =>
                    setUpdatedTeamData((prev) => ({
                      ...prev,
                      selectedJob: option,
                    }))
                  }
                  value={updatedTeamData.selectedJob}
                  className="react-select-custom-styling__container"
                  classNamePrefix="react-select-custom-styling"
                />
              </div>
              {updatedTeamData.selectedJob && (
                <div className={`projectDetails mt-4`}>
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <p className={`bigText fs-5 m-0`}>
                      Project Name:{" "}
                      <span className={`smallText fs-6`}>
                        {updatedTeamData.selectedJob.label}
                      </span>
                    </p>
                    <Stack direction="horizontal">
                      {getJobDetails()?.job_status === "Completed" ? (
                        <Badge bg="success">Completed</Badge>
                      ) : getJobDetails()?.job_status === "On Hold" ? (
                        <Badge bg="danger">On Hold</Badge>
                      ) : (
                        <Badge bg="warning" text="dark">
                          In Progress
                        </Badge>
                      )}
                    </Stack>
                  </div>
                  <p className="fs-6 m-0 mt-3">
                    {getJobDetails()?.job_description}
                  </p>
                  <p className="fs-5 m-0 mt-3">Estimated Timeline: </p>
                  <p className="fs-6 m-0">
                    {formatDate(getJobDetails()?.assigned_on)} to{" "}
                    {formatDate(getJobDetails()?.due_on)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
export default ManageTeam;
