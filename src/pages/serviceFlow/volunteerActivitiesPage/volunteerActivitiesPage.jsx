import React, { useEffect, useState } from "react";
import CommonButton from "../../../components/common/commonButton/commonButton";
import CommonTable from "../../../components/common/commonTable/commonTable";
import CommonPagination from "../../../components/common/commonPagination/commonPagination";
import CommonStatusCountCard from "../../../components/common/commonStatusCountCard/commonStatusCountCard";
import {
  getAllRolesDetailsByUser,
  getAllTaskCountsByUser,
  getAllTasksDetailsByUser,
} from "../../../redux/actions/service";
import { useParams } from "react-router-dom";
import CommonSearch from "../../../components/common/commonSearch/commonSearch";

export default function VolunteerActivitiesPage() {
  const { id: paramId } = useParams();
  const id = paramId ?? null;
  const [tableDataForExcomRoleTable, setTableDataForExcomRoleTable] =
    useState(null);
  const [tableLoadingForExcomRoleTable, setTableLoadingForExcomRoleTable] =
    useState(false);
  const [totalPageForExcomRoleTable, setTotalPageForExcomRoleTable] =
    useState(1);
  const [currentPageForExcomRoleTable, setCurrentPageForExcomRoleTable] =
    useState(1);
  const [tableDataForProjectRoleTable, setTableDataForProjectRoleTable] =
    useState(null);
  const [tableLoadingForProjectRoleTable, setTableLoadingForProjectRoleTable] =
    useState(false);
  const [totalPageForProjectRoleTable, setTotalPageForProjectRoleTable] =
    useState(1);
  const [currentPageForProjectRoleTable, setCurrentPageForProjectRoleTable] =
    useState(1);
  const [tableDataForActivitiesTable, setTableDataForActivitiesTable] =
    useState(null);
  const [tableLoadingForActivitiesTable, setTableLoadingForActivitiesTable] =
    useState(false);
  const [totalPageForActivitiesTable, setTotalPageForActivitiesTable] =
    useState(1);
  const [currentPageForActivitiesTable, setCurrentPageForActivitiesTable] =
    useState(1);

  const [searchItem, setsearchItem] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [todo, setTodo] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  

  const tableHeadingForExcomRoleTable = [
    {
      label: "Excom Role",
      value: "excomRole",
    },
    {
      label: "Entity",
      value: "entity",
    },
    {
      label: "Start Date",
      value: "start_date",
    },
    {
      label: "End Date",
      value: "end_date",
    },
    {
      label: "Term Year",
      value: "termYear",
    },
  ];

  const tableHeadingForProjectRoleTable = [
    {
      label: "Project",
      value: "project",
    },
    {
      label: "Project Role",
      value: "projectRole",
    },
    {
      label: "Start Date",
      value: "start_date",
    },
    {
      label: "End Date",
      value: "end_date",
    },
  ];
  const tableHeadingForActivitiesTable = [
    {
      label: "Task",
      value: "taskName",
    },
    {
      label: "Type",
      value: "taskType",
    },
    {
      label: "OU / Project",
      value: "taskBelongTo",
    },
    {
      label: "Start Date",
      value: "startDate",
    },
    {
      label: "End Date",
      value: "endDate",
    },
    {
      label: "Priority",
      value: "priority",
    },
    {
      label: "Status",
      value: "status",
    },
  ];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  const handleSearchChange = (e) => setsearchItem(e);
  const handlePriorityChange = (e) => setPriority(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  function handleGetTasksCounts(){
    getAllTaskCountsByUser(id,priority,(res)=>{
      if(res?.status == 200){
          setTodo(res?.data?.data?.todo);
          setProgress(res?.data?.data?.progress);
          setCompleted(res?.data?.data?.complete);
      }
    })
  }
  useEffect(() => {
    setTableLoadingForExcomRoleTable(true);
    getAllRolesDetailsByUser(
      id,
      "EXCOM",
      currentPageForExcomRoleTable - 1,
      (res) => {
        if (res?.status == 200) {
          const data = res?.data?.data?.content?.map((role) => ({
            id: role?.serviceId,
            start_date: formatDate(role?.start_date),
            end_date:
              role?.end_date == null ? "Ongoing" : formatDate(role?.end_date),
            excomRole: role?.role?.userRole,
            entity: role?.ou?.ouName,
            termYear: role?.termyear?.termyear,
            item: role,
          }));
          setTableDataForExcomRoleTable(data);
          setTotalPageForExcomRoleTable(res?.data?.data?.totalPages);
        }
      }
    );
    setTableLoadingForExcomRoleTable(false);
  }, [currentPageForExcomRoleTable, id]);

  useEffect(() => {
    setTableLoadingForProjectRoleTable(true);
    getAllRolesDetailsByUser(
      id,
      "PROJECT",
      currentPageForProjectRoleTable - 1,
      (res) => {
        if (res?.status == 200) {
          const data = res?.data?.data?.content?.map((role) => ({
            id: role?.serviceId,
            start_date: formatDate(role?.start_date),
            end_date: formatDate(role?.project?.endDate),
            projectRole: role?.role?.userRole,
            project: role?.project?.projectName,
            item: role,
          }));
          setTableDataForProjectRoleTable(data);
          setTotalPageForProjectRoleTable(res?.data?.data?.totalPages);
        }
      }
    );
    setTableLoadingForProjectRoleTable(false);
  }, [currentPageForProjectRoleTable, id]);

  useEffect(() => {
    setTableLoadingForActivitiesTable(true);
    getAllTasksDetailsByUser(
      id,
      searchItem,
      priority,
      status,
      currentPageForActivitiesTable - 1,
      (res) => {
        if (res?.status == 200) {
          console.log(res?.data?.data?.content);
          const data = res?.data?.data?.content?.map((task) => ({
            id: task?.serviceId,
            taskName: task?.task_name,
            taskType: task?.type,
            taskBelongTo:
              task?.type == "EXCOM"
                ? task?.ou?.ou_short_name
                : task?.project?.projectName,
            startDate: formatDate(task?.start_date),
            endDate: formatDate(task?.end_date),
            priority: task?.priority,
            status: task?.status,
            item: task,
          }));
          setTableDataForActivitiesTable(data);
          setTotalPageForActivitiesTable(res?.data?.data?.totalPages);
          handleGetTasksCounts();
        }
      }
    );
    setTableLoadingForActivitiesTable(false);
  }, [searchItem, priority, status, currentPageForActivitiesTable, id]);

  return (
    <>
      <div className="container">
        <div className="d-flex flex-column">
          <div className="text-cl-primary">Excom Roles</div>
          <div className="mt-3 d-flex flex-column gap-3 justify-content-center bg-white rounded-2 common-shadow p-3">
            <div className="d-flex justify-content-between align-items-center gap-4 flex-wrap">
              <div
                className="mt-2 table-container w-100"
                style={{ height: 300 }}
              >
                <div className="mt-3 table-container">
                  <CommonTable
                    tableHeading={tableHeadingForExcomRoleTable}
                    primary={true}
                    tableData={tableDataForExcomRoleTable}
                    loading={tableLoadingForExcomRoleTable}
                  />
                </div>
              </div>
              <div className="mt-4 d-flex w-100 justify-content-end">
                <CommonPagination
                  pages={totalPageForExcomRoleTable}
                  currentPage={currentPageForExcomRoleTable}
                  setCurrentPage={setCurrentPageForExcomRoleTable}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column">
          <div className="text-cl-primary mt-5">Project Roles</div>
          <div className="mt-3 d-flex flex-column gap-3 justify-content-center bg-white rounded-2 common-shadow p-3">
            <div className="d-flex justify-content-between align-items-center gap-4 flex-wrap">
              <div
                className="mt-2 table-container w-100"
                style={{ height: 330 }}
              >
                <div className="mt-1 table-container">
                  <CommonTable
                    tableHeading={tableHeadingForProjectRoleTable}
                    primary={true}
                    tableData={tableDataForProjectRoleTable}
                    loading={tableLoadingForProjectRoleTable}
                    deleteAction={(item) => {
                      setShowDeleteModel(true);
                      setSelectedServiceRequest(item);
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 d-flex w-100 justify-content-end">
                <CommonPagination
                  pages={totalPageForProjectRoleTable}
                  currentPage={currentPageForProjectRoleTable}
                  setCurrentPage={setCurrentPageForExcomRoleTable}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column">
          <div className="text-cl-primary mt-5">Activities</div>
          <div className="mt-3 d-flex flex-column gap-3 justify-content-center bg-white rounded-2 common-shadow p-3">
            <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-cl-primary">Total Counts</div>
                  <div className="">
                    <select
                      className="form-select w-100"
                      aria-label="Large select example"
                      value={priority}
                      onChange={handlePriorityChange}
                    >
                      <option value={""} selected>
                        {" "}
                        Priority
                      </option>
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-between gap-4 rounded-4 bg-body-secondary p-3 flex-wrap mt-2 flex-grow-1">
                  <CommonStatusCountCard
                    type={"TODO"}
                    count={todo}
                    withoutImage={true}
                  />
                  <CommonStatusCountCard
                    type={"ONGOING"}
                    count={progress}
                    withoutImage={true}
                  />
                  <CommonStatusCountCard
                    type={"COMPLETE"}
                    count={completed}
                    withoutImage={true}
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <CommonSearch
                    primary={true}
                    value={searchItem}
                    onChange={handleSearchChange}
                  />
                  <div>
                    <select
                      className="form-select w-100"
                      aria-label="Large select example"
                      value={status}
                      onChange={handleStatusChange}
                    >
                      <option selected value={""}>
                        Status
                      </option>
                      <option value="TODO">TODO</option>
                      <option value="PROGRESS">PROGRESS</option>
                      <option value="COMPLETE">COMPLETED</option>
                    </select>
                  </div>
                </div>
              </div>
              <div
                className="mt-2 table-container w-100"
                style={{ height: 330 }}
              >
                <div className="table-container">
                  <CommonTable
                    tableHeading={tableHeadingForActivitiesTable}
                    primary={true}
                    tableData={tableDataForActivitiesTable}
                    loading={tableLoadingForActivitiesTable}
                    deleteAction={(item) => {
                      setShowDeleteModel(true);
                      setSelectedServiceRequest(item);
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 d-flex w-100 justify-content-end">
                <CommonPagination
                  pages={totalPageForActivitiesTable}
                  currentPage={currentPageForActivitiesTable}
                  setCurrentPage={setCurrentPageForActivitiesTable}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
