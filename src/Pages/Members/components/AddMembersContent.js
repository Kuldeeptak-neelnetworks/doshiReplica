import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ContextSidebarToggler } from "../../../Context/SidebarToggler/SidebarToggler";
import { ContextAPI } from "../../../Context/ApiContext/ApiContext";
import { SpinningLoader } from "../../../Components/SpinningLoader/SpinningLoader";
import { ReactHotToast } from "../../../Components/ReactHotToast/ReactHotToast";
import Breadcrumbs from "../../../templates/Breadcrumbs";
import { usersIcon } from "../../../utils/ImportingImages/ImportingImages";
import {
  headerOptions,
  handleAPIError,
} from "../../../utils/utilities/utilityFunctions";

const AddMembersContent = () => {
  const { mainURL, logout } = useContext(ContextAPI);
  const { sidebarClose } = useContext(ContextSidebarToggler);

  const [isUserValid, setIsUserValid] = useState(false);
  const [memberDetails, setMemberDetails] = useState({
    email: "",
    name: "",
    userRole: "",
  });

  const breadCrumbs = [
    {
      pageName: "Home",
      pageURL: "/members",
    },
    {
      pageName: "Members",
      pageURL: "/members",
    },
    {
      pageName: "Add Member",
      pageURL: "/add-member",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Adding New Member API
  const addNewMember = async () => {
    const body = {
      email: memberDetails.email,
      current_user: localStorage.getItem("userId") ?? null,
      name: memberDetails.name,
      password: memberDetails.password,
      acc_team: memberDetails.accountingTeam,
      user_role: memberDetails.userRole,
    };

    setIsUserValid(() => true);

    try {
      const url = `${mainURL}/add-new/member`;
      const result = await axios.post(url, body, {
        headers: headerOptions(),
      });

      if (result.status === 201) {
        ReactHotToast(result?.data?.message, "success");
        setMemberDetails({
          email: "",
          name: "",
          userRole: "",
        });
      }
    } catch (e) {
      handleAPIError(e, logout);
    } finally {
      setIsUserValid(() => false);
    }
  };

  const handleNewMember = (e) => {
    e.preventDefault();
    const bool =
      memberDetails.email && memberDetails.name && memberDetails.userRole;

    if (bool) {
      addNewMember();
    } else {
      if (memberDetails.email === "") {
        ReactHotToast("Please input member email!", "error");
      } else if (memberDetails.name === "") {
        ReactHotToast("Please input member name!", "error");
      } else if (memberDetails.userRole === "") {
        ReactHotToast("Please select member role!", "error");
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
          <img src={usersIcon} alt="members" />
          <p className="m-0 fs-4">Add Members</p>
        </div>
      </section>

      <section className="main-content_form-section">
        <form onSubmit={handleNewMember}>
          <div className="d-flex flex-column justify-content-center align-items-center ">
            <div className="form-group mt-5 width-35">
              <label className="" htmlFor="name">
                Name:
              </label>
              <input
                id="name"
                className=""
                name="name"
                placeholder="Eg: Raj Shah"
                type="text"
                required
                onChange={(e) => handleChange(e)}
                value={memberDetails.name}
              />
            </div>
            <div className="form-group mt-4 width-35">
              <label className="" htmlFor="email">
                Email Id:
              </label>
              <input
                id="email"
                className=""
                name="email"
                placeholder="Eg: rajshah@gmail.com"
                type="email"
                required
                onChange={(e) => handleChange(e)}
                value={memberDetails.email}
              />
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center  ">
            <div className="form-group mt-4 width-35">
              <label htmlFor="userRole">Member Type:</label>
              <div
                name="userRole"
                className="radio-group justify-content-start mt-2"
              >
                <label htmlFor="one">
                  <input
                    type="radio"
                    id="one"
                    value="it_member"
                    name="userRole"
                    checked={memberDetails.userRole === "it_member"}
                    onChange={(e) => handleChange(e)}
                  />
                  <span>IT Member</span>
                </label>
                <label htmlFor="two">
                  <input
                    type="radio"
                    id="two"
                    value="operation_member"
                    name="userRole"
                    checked={memberDetails.userRole === "operation_member"}
                    onChange={(e) => handleChange(e)}
                  />
                  <span>Operation Member</span>
                </label>
                <label htmlFor="three">
                  <input
                    type="radio"
                    id="three"
                    value="members"
                    name="userRole"
                    checked={memberDetails.userRole === "members"}
                    onChange={(e) => handleChange(e)}
                  />
                  <span>Member</span>
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="mt-5  custom-btn d-flex m-auto">
            {isUserValid ? <SpinningLoader /> : "Save"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddMembersContent;
