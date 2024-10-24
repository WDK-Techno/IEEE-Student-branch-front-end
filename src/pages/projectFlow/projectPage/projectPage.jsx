import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import projectDefault from "../../../assets/images/projectDefault.png";
import CommonPieChart from "../../../components/common/commonPieChart/commonPieChart";
import CommonStatusCountCard from "../../../components/common/commonStatusCountCard/commonStatusCountCard";
import CommonButton from "../../../components/common/commonButton/commonButton";
import { useNavigate } from "react-router-dom";
import CommonSearch from "../../../components/common/commonSearch/commonSearch";
import CommonDropAndDrag from "../../../components/common/commonDropAndDrag/commonDropAndDrag";
import add from "../../../assets/icons/Add.png";
import send from "../../../assets/icons/Sent.png";
import CommonNoteContainer from "../../../components/common/commonNoteContainer/commonNoteContainer";
import CommonMemberContainer from "../../../components/common/commonMemberContainer/commonMemberContainer";
import { useDispatch, useSelector } from "react-redux";
import CommonLoader from "../../../components/common/commonLoader/commonLoader";
import TaskModel from "../../../components/models/createTaskModel/createTaskModel";
import { getProjectById, updateProject } from "../../../redux/actions/project";
import { PolicyValidate } from "../../../utils/valitations/Valitation";
import { projectPolicy } from "../../../redux/reducers/userSlice";
import CommonPagination from "../../../components/common/commonPagination/commonPagination";
import EditExcomModel from "../../../components/models/editExcomModel/editExcomModel";
import { addComment } from "../../../redux/actions/comment";
import CommonNotesArea from "../../../components/common/commonNoteArea/commonNoteArea";
import CommonEditor from "../../../components/common/CommonEditor/CommonEditor";
import { getTaskCount } from "../../../redux/actions/task";

const ProjectPage = () => {
  const navigate = useNavigate();
  const distpatch = useDispatch();
  function navigateToFinance() {
    navigate("finance");
  }
  function navigateToEvents() {
    navigate("event");
  }
  const userData = useSelector((state) => state.user.userData);
  const { id } = useParams();
  const [pageLoading, setPageLoading] = useState(true);
  const [isFinanceAvailable, setIsFinanceAvailable] = useState(false);
  const [isEventAvailable, setIsEventAvailable] = useState(false);
  const [isAssignAvailable, setIsAssignAvailable] = useState(false);
  const [isTaskAvailable, setIsTaskAvailable] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [project, setProject] = useState([]);
  const [myRoles, setMyroles] = useState([]);
  const [otherRoles, setOtherRoles] = useState([]);
  const [AllRoles, setAllRoles] = useState([]);
  const [refreshTasks, setRefreshTasks] = useState(0);
  const [searchItem, setsearchItem] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotaltPage] = useState(0);
  const [editExcomModelShow, setEditExcomModelShow] = useState(false);
  const [description, setDescription] = useState("");
  const [taskCount, setTaskCount] = useState({
    todo: 0,
    progress: 0,
    complete: 0,
  });

  useEffect(() => {
    setPageLoading(true);
    if (userData) {
      getProjectDetails();
    }
  }, [userData, id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  function saveDescription() {
    const data = {
      project_name: project.projectName,
      description: description,
      start_date: formatDate(project.startDate),
      end_date: formatDate(project.endDate),
      project_logo: project.projectLogo,
      status: project.status,
      ou_id: project.ous.map((ou) => ou.ouID),
    };
    updateProject(id, data, (res) => { });
  }

  function getProjectTaskCount() {
    getTaskCount("PROJECT", id, "", (res) => {
      if (res?.status == 200) {
        let count = res?.data?.data;
        setTaskCount({
          todo: count?.todo,
          progress: count?.progress,
          complete: count?.complete,
        });
      } else {
        console.warn("Error in task count loading");
      }
    });
  }

  function getProjectDetails() {
    getProjectById(id, (res) => {
      if (res?.status == 200) {
        getProjectTaskCount();
        setProject(res?.data?.data?.project);
        setDescription(res?.data?.data?.project?.description);
        distpatch(projectPolicy(res?.data?.data?.my_user_role_details));
        const projectmain = PolicyValidate(userData, "PROJECT");
        setMyroles(res?.data?.data?.my_user_role_details);
        setOtherRoles(res?.data?.data?.other_role_details);
        const allrole = [
          // ...res?.data?.data?.my_user_role_details,
          ...res?.data?.data?.other_role_details,
        ];
        setAllRoles(allrole);
        if (projectmain) {
          setIsFinanceAvailable(true);
          setIsEventAvailable(true);
          setIsAssignAvailable(true);
          setIsTaskAvailable(true);
          setPageLoading(false);
        } else {
          const isProjectFinanceAvailable = PolicyValidate(
            res?.data?.data?.my_user_role_details,
            "PROJECT_FINANCE"
          );
          const isProjectEventAvailable = PolicyValidate(
            res?.data?.data?.my_user_role_details,
            "PROJECT_EVENT"
          );
          const isProjectAssignAvailable = PolicyValidate(
            res?.data?.data?.my_user_role_details,
            "PROJECT_ASSIGN"
          );
          const isProjectTaskAvailable = PolicyValidate(
            res?.data?.data?.my_user_role_details,
            "PROJECT_TASK"
          );
          setIsFinanceAvailable(isProjectFinanceAvailable);
          setIsEventAvailable(isProjectEventAvailable);
          setIsAssignAvailable(isProjectAssignAvailable);
          setIsTaskAvailable(isProjectTaskAvailable);
          setPageLoading(false);
        }
      } else {
        setPageLoading(false);
        navigate("/project");
      }
    });
  }

  const openTaskModal = () => {
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
  };

  const handleSearchChange = (e) => setsearchItem(e);
  const handlePriorityChange = (e) => setPriority(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleMemberChange = (e) => {
    console.warn(e.target.value, "e.target.valuee.target.valuee.target.value");
    setSelectedMemberId(e.target.value);
  };

  return (
    <>
      {pageLoading ? (
        <CommonLoader />
      ) : (
        <div className="p-3">
          <div className="bg-white rounded-3 common-shadow p-3 row align-items-center">
            <div className="col-md-3 d-flex justify-content-center">
              <img
                src={project?.projectLogo || projectDefault}
                width={150}
                className="img-fluid"
              />
            </div>
            <div className="col-md-9 d-flex flex-column">
              <div>
                <h2>{project?.projectName}</h2>
              </div>
              <div>
                <CommonEditor
                  html={description}
                  updateProject={saveDescription}
                  setHtml={setDescription}
                />
              </div>
            </div>
          </div>

          <div className="text-cl-primary mt-4">Tasks</div>
          <div className="d-flex mt-3 justify-content-between align-items-center gap-4 flex-wrap">
            <div>
              <CommonPieChart todo={taskCount.todo} progress={taskCount.progress} complete={taskCount.complete} />
            </div>
            <div className="d-flex justify-content-between flex-wrap flex-grow-1 gap-4">
              <div>
                <CommonStatusCountCard type={"TODO"} count={taskCount.todo} />
              </div>
              <div>
                <CommonStatusCountCard
                  type={"ONGOING"}
                  count={taskCount.progress}
                />
              </div>
              <div>
                <CommonStatusCountCard
                  type={"COMPLETE"}
                  count={taskCount.complete}
                />
              </div>
            </div>
          </div>

          <div className="d-flex mt-5 justify-content-between align-items-center flex-wrap gap-4">
            <div className="text-cl-primary mt-4">Board</div>
            <div className="d-flex justify-content-end gap-4 align-items-center flex-wrap">
              {isTaskAvailable && (
                <div>
                  <CommonButton onClick={openTaskModal} text={"Add Tasks"} />
                </div>
              )}
              {isFinanceAvailable && (
                <div className="">
                  <CommonButton
                    onClick={() => {
                      navigateToFinance();
                    }}
                    text={"Finance"}
                  />
                </div>
              )}
              {isEventAvailable && (
                <div className="">
                  <CommonButton
                    onClick={() => {
                      navigateToEvents();
                    }}
                    text={"Events"}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="d-flex flex-column bg-white common-shadow rounded-3 p-3 mt-4">
            <div className="d-flex justify-content-between align-items-center w-100 flex-wrap gap-4">
              <div>
                <CommonSearch primary={true} onChange={handleSearchChange} />
              </div>
              <div className="">
                <select
                  className="form-select w-100"
                  aria-label="Large select example"
                  value={priority}
                  onChange={handlePriorityChange}
                >
                  <option selected value={""}>
                    {" "}
                    Priority
                  </option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
              <div className="">
                <select
                  className="form-select w-100"
                  aria-label="Large select example"
                  value={status}
                  onChange={handleStatusChange}
                >
                  <option selected value={""}>
                    Status
                  </option>
                  <option value="TODO">TO DO</option>
                  <option value="PROGRESS">PROGRESS</option>
                  <option value="COMPLETE">COMPLETED</option>
                </select>
              </div>
              {
                isTaskAvailable && (
                  <div>
                    <select
                      className="form-select w-100"
                      aria-label="Large select example"
                      value={selectedMemberId}
                      onChange={handleMemberChange}
                    >
                      <option selected value={""}>
                        Assignee
                      </option>
                      {AllRoles.map((member) => (
                        <option
                          key={member?.user?.userID}
                          value={member?.user?.userID}
                        >
                          {`${member?.user?.firstName} ${member?.user?.lastName}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              }

            </div>
            <div
              className="mt-4 d-flex justify-content-between overflow-scroll overflow-y-hidden custom-scrollbar"
              style={{ maxWidth: 1300 }}
            >
              <CommonDropAndDrag
                id={id}
                project={true}
                refresh={refreshTasks}
                search={searchItem}
                status={status}
                user_id={selectedMemberId}
                page={currentPage}
                priority={priority}
                setTotaltPage={setTotaltPage}
                projectMembers={otherRoles}
                referhTaskCount={() => getProjectTaskCount()}
              />
            </div>
            {totalPage > 1 ? (
              <div className="mt-5 d-flex justify-content-end">
                <CommonPagination
                  currentPage={currentPage}
                  pages={totalPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            ) : null}
          </div>

          <div className="row mt-4">
            <div className="col-lg-7 p-3">
              <CommonNotesArea show={true} projectID={id} project={true} />
            </div>
            <div className="col-lg-5 p-3">
              <div className="d-flex bg-white common-shadow flex-column p-3 rounded-3">
                <div>
                  <h6 className="text-third fw-bold">Project Created By</h6>
                </div>
                <CommonMemberContainer userData={project?.createdBy} />
              </div>
              <div className="mt-3 d-flex bg-white common-shadow flex-column p-3 rounded-3">
                <div className="d-flex justify-content-between align-items-center gap-4 flex-wrap">
                  <div>
                    <h6 className="text-third fw-bold">Project Members</h6>
                  </div>
                  {isAssignAvailable && (
                    <div>
                      <button
                        onClick={() => {
                          setEditExcomModelShow(true);
                        }}
                        className="bg-transparent border-0"
                      >
                        <img src={add} width={30} />
                      </button>
                    </div>
                  )}
                </div>

                <div
                  className="mt-4 d-flex justify-content-between align-items-center gap-1 flex-wrap overflow-scroll overflow-x-hidden custom-scrollbar"
                  style={{ maxHeight: 500 }}
                >
                  {AllRoles?.map((item, index) => {
                    return (
                      <CommonMemberContainer
                        key={index}
                        role={item?.role?.userRole}
                        userData={item?.user}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <TaskModel
            changed={() => {
              setRefreshTasks(refreshTasks + 1);
            }}
            projectID={id}
            type={"PROJECT"}
            show={showTaskModal}
            onHide={closeTaskModal}
          />

          <EditExcomModel
            show={editExcomModelShow}
            onHide={() => setEditExcomModelShow(false)}
            id={id}
            changed={() => {
              getProjectDetails();
            }}
            mode={"PROJECT"}
          />
        </div>
      )}
    </>
  );
};

export default ProjectPage;
