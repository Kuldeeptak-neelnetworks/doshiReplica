import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import Select from "react-select";
import { formatDate } from "../../../../utils/utilities/utilityFunctions";
import { Table } from "react-bootstrap";
import { EyeIconWithCircle } from "../../../../utils/ImportingImages/ImportingImages";

const MyVerticallyCenteredModal = (props) => {
  const {
    member_count,
    leader_email,
    member_names,
    total_time,
    assigned_jobs_list,
    in_progress_jobs,
    completed_jobs,
  } = props.teamWiseData;

  const [updatedTeamData, setUpdatedTeamData] = useState({
    taskData: assigned_jobs_list?.length > 0 ? assigned_jobs_list : [],
    selectedTaskData: null,
  });
  const [projectOptions, setProjectOptions] = useState([]);

  useEffect(() => {
    setProjectOptions(() =>
      updatedTeamData?.taskData?.map((task) => ({
        label: task?.task_name,
        value: task?.task_name,
        taskId: task?.task_id,
      }))
    );
  }, [updatedTeamData.taskData]);

  useEffect(() => {
    return () => {
      setUpdatedTeamData((prev) => ({ ...prev, selectedTaskData: null }));
    };
  }, [props.show]);

  const getJobDetails = () => {
    return updatedTeamData?.taskData?.find(
      (job) => job?.task_id === updatedTeamData?.selectedTaskData?.taskId
    );
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-xl"
      style={{ height: "100%" }}
    >
      <Modal.Header className="pt-3 pb-1" closeButton>
        <Modal.Title className="w-100" id="contained-modal-title-vcenter">
          <div className="d-flex justify-content-center align-items-center gap-3">
            <span className="modal-title">Team Wise Report Data</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <div
          className="d-flex flex-column justify-content-center"
          style={{ padding: "10px" }}
        >
          <div className="flex">
            <Table striped bordered hover className="text-center">
              <thead>
                <tr>
                  <th>Total Team Members</th>
                  <th>Team Member's Name</th>
                  <th>Team Leader Email</th>
                  <th>Total Time</th>
                  <th>Total Completed Jobs</th>
                  <th>Total Pending Jobs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{member_count}</td>
                  <td>
                    <ul>
                      {member_names.split(", ").map((name) => (
                        <li
                          key={name}
                          style={{ listStyle: "none", textAlign: "left" }}
                        >
                          {name.replace(/\(Leader\)$/, "")}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{leader_email}</td>
                  <td>{total_time}</td>
                  <td>{completed_jobs}</td>
                  <td>{in_progress_jobs}</td>
                </tr>
              </tbody>
            </Table>

            <div className="form-group mt-4">
              <label htmlFor="clientName">Assigned Jobs:</label>
              <Select
                name="teamStatus"
                closeMenuOnSelect={true}
                options={projectOptions}
                onChange={(option) =>
                  setUpdatedTeamData((prev) => ({
                    ...prev,
                    selectedTaskData: option,
                  }))
                }
                value={updatedTeamData.selectedTaskData}
                className="react-select-custom-styling__container"
                classNamePrefix="react-select-custom-styling"
              />
            </div>
            {updatedTeamData.selectedTaskData && (
              <>
                <Table bordered hover className="mt-2">
                  <tbody>
                    <tr>
                      <td colSpan={2} className="text-center">
                        <span className="fw-bold fs-4">Task Name : </span>
                        <span>{updatedTeamData.selectedTaskData.label}</span>
                      </td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>
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
                      </td>
                    </tr>
                    {getJobDetails()?.job_description ? (
                      <tr>
                        <th>Job Description</th>
                        <td>{getJobDetails()?.job_description}</td>
                      </tr>
                    ) : (
                      ""
                    )}
                    <tr>
                      <th>Assigned On</th>
                      <td>{formatDate(getJobDetails()?.assigned_on)}</td>
                    </tr>
                    <tr>
                      <th>Due On</th>
                      <td>{formatDate(getJobDetails()?.due_on)}</td>
                    </tr>
                  </tbody>
                  <tbody></tbody>
                </Table>
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export const TeamWiseReportModal = ({ teamWiseData, setIsUpdated }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        className="d-flex"
        onClick={() => {
          setModalShow(true);
        }}
      >
        <div className="">
          <EyeIconWithCircle />
        </div>
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        teamWiseData={teamWiseData}
        setIsUpdated={setIsUpdated}
      />
    </>
  );
};
