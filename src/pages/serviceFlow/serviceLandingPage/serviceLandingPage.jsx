import React, { useEffect, useState } from "react";

import CommonButton from "../../../components/common/commonButton/commonButton";
import CommonTable from "../../../components/common/commonTable/commonTable";
import CommonSearch from "../../../components/common/commonSearch/commonSearch";
import CommonPagination from "../../../components/common/commonPagination/commonPagination";
import { useNavigate } from "react-router-dom";
import VolunteerStatusChangeModel from "../../../components/models/volunteerStatusChangeModel/volunteerStatusChangeModel";
import { useSelector } from "react-redux";
import CommonLoader from "../../../components/common/commonLoader/commonLoader";
import { PolicyValidate } from "../../../utils/valitations/Valitation";
import CreateServiceRequestModel from "../../../components/models/addServiceRequestModel/createServiceRequestModel";
import {
  deleteServiceLetterRequest,
  getAllServiceRequests,
  getMyServiceRequests,
} from "../../../redux/actions/service";
import CommonDeleteModel from "../../../components/models/commonDeleteModel/commonDeleteModel";

const serviceLandingPage = () => {
  const [currentPageForAllTable, setCurrentPageForAllTable] = useState(1);
  const [totalPageForAllTable, setTotalPageForAllTable] = useState(1);
  const [currentPageForMyTable, setCurrentPageForAMyable] = useState(1);
  const [totalPageForMyTable, setTotalPageForMyTable] = useState(1);
  const [statusChangeModelShow, setStatusChangeModel] = useState(false);
  const userData = useSelector((state) => state.user.userData);

  const [pageLoading, setPageLoading] = useState(true);
  const [service, setService] = useState(false);
  const [serviceVolunteer, setServiceVolunteer] = useState(false);
  const [showAddSereviceReqModel, setShowAddSereviceReqModel] = useState(false);
  const [showViewSereviceReqModel, setShowViewSereviceReqModel] =
    useState(false);
  const navigate = useNavigate();
  const [myReqests, setMyRequests] = useState(null);
  const [myReqestsTableLoading, setMyReqestsTableLoading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(1);
  const [allReqests, setAllRequests] = useState(null);
  const [allReqestsTableLoading, setAllReqestsTableLoading] = useState(false);
  const [slectedServiceRequest, setSelectedServiceRequest] = useState(null);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setdeleteError] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  useEffect(() => {
    setMyReqestsTableLoading(true);
    getMyServiceRequests(currentPageForMyTable - 1, (res) => {
      if (res.status === 200) {
        const data = res?.data?.data?.content?.map((request) => ({
          id: request?.serviceId,
          requestDate: formatDate(request?.request_date),
          dueDate: formatDate(request?.due_date),
          status: request?.status,
          email: request?.email,
          item: request,
        }));
        setMyRequests(data);
        setTotalPageForMyTable(res?.data?.data?.totalPages);
      }
      setMyReqestsTableLoading(false);
    });
  }, [refreshTable, currentPageForMyTable]);

  useEffect(() => {
    if (service) {
      getAllServiceRequests(
        searchItem,
        selectedStatus,
        currentPageForAllTable - 1,
        (res) => {
          setAllReqestsTableLoading(true);
          if (res.status === 200) {
            const data = res?.data?.data?.content?.map((request) => ({
              id: request?.serviceId,
              requestDate: formatDate(request?.request_date),
              dueDate: formatDate(request?.due_date),
              status: request?.status,
              email: request?.email,
              volunteerName:
                request?.user?.firstName + " " + request?.user?.lastName,
              academicYear: request?.user?.academicYear?.academicYear,
              contactNo: request?.user?.contactNo,
              item: request,
            }));
            setAllRequests(data);
            setTotalPageForAllTable(res?.data?.data?.totalPages);
          }
          setAllReqestsTableLoading(false);
        }
      );
    }
  }, [
    refreshTable,
    service,
    currentPageForAllTable,
    searchItem,
    selectedStatus,
  ]);

  useEffect(() => {
    setPageLoading(true);
    if (userData) {
      const isServiceAvailable = PolicyValidate(userData, "SERVICE");

      const isServiceVolunteerAvailable = PolicyValidate(
        userData,
        "SERVICE_VOLUNTEER"
      );

      if (isServiceAvailable) {
        setService(true);
        setPageLoading(false);
      }

      if (isServiceVolunteerAvailable) {
        // setServiceVolunteer(true);
        setPageLoading(false);
      }

      if (!isServiceAvailable || !isServiceVolunteerAvailable) {
        setPageLoading(false);
      }
    }
  }, [userData]);

  function navigateToVolunteerDetailsPage() {
    navigate("volunteer");
  }
  function navigateToMyActivitiesPage() {
    navigate("activities");
  }
  function navigateToUserActivitiesPage(userId) {
    navigate(`activities/${userId}`);
  }
  const handleShowStatusChangeModel = (requestData) => {
    setSelectedServiceRequest(requestData);
    setStatusChangeModel(true);
  };
  const handleCloseStatusChangeModel = () => {
    setSelectedServiceRequest(null);
    setStatusChangeModel(false);
  };
  const openAddServiceReqModel = () => {
    setShowAddSereviceReqModel(true);
  };
  const handleCloseCreateServiceModel = () => {
    setShowAddSereviceReqModel(false);
  };
  const openViewServiceReqModel = (requestData) => {
    setSelectedServiceRequest(requestData);
    setShowViewSereviceReqModel(true);
  };
  const handleCloseViewServiceModel = () => {
    setSelectedServiceRequest(null);
    setShowViewSereviceReqModel(false);
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };
  const handleSearchChange = (e) => {
    setSearchItem(e);
    setCurrentPageForAllTable(1);
  };

  const handleDeleteProject = () => {
    setdeleteError(false);
    setDeleteLoading(true);
    deleteServiceLetterRequest(
      slectedServiceRequest?.item?.serviceId,
      (res) => {
        if (res?.status == 200) {
          setRefreshTable(refreshTable + 1);
          setShowDeleteModel(false);
          setSelectedServiceRequest(null);
          setdeleteError(false);
        } else {
          setDeleteLoading(false);
          setdeleteError(true);
        }
      }
    );
  };
  const handleCloseDeleteModel = () => {
    setShowDeleteModel(false);
    setSelectedServiceRequest(null);
    setdeleteError(false);
  };

  const allReqTableHeading = [
    {
      label: "Volunteer Name",
      value: "volunteerName",
    },
    {
      label: "Academic Year",
      value: "academicYear",
    },
    {
      label: "Contact No",
      value: "contactNo",
    },

    {
      label: "Requested Date",
      value: "requestDate",
    },
    {
      label: "Due Date",
      value: "dueDate",
    },
    {
      label: "Status",
      value: "status",
    },
    {
      label: "",
      value: "ACTION",
      type: ["VIEW", "EDIT", "MORE"],
    },
  ];

  const myReqTableHeading = [
    {
      label: "Requested Date",
      value: "requestDate",
    },
    {
      label: "Email",
      value: "email",
    },

    {
      label: "Due Date",
      value: "dueDate",
    },
    {
      label: "Status",
      value: "status",
    },
    {
      label: "",
      value: "ACTION",
      type: ["DELETE"],
    },
  ];

  return (
    <>
      <div className="container">
        <div className="d-flex w-100">
          <div className="ms-auto me-0 d-flex justify-content-end">
            <CommonButton
              text={"My Activities"}
              onClick={navigateToMyActivitiesPage}
            />
          </div>
        </div>
        <div className="text-cl-primary">My service letter requests</div>
        <div className="mt-4 mb-5 d-flex flex-column gap-3 justify-content-center bg-white rounded-2 common-shadow p-3">
          <div className="d-flex justify-content-between align-items-center gap-4 flex-wrap">
            <div className="mt-2 table-container w-100" style={{ height: 330 }}>
              <div className="mt-0 d-flex flex-wrap justify-content-end align-items-center">
                <div>
                  <CommonButton
                    text={"Send Request"}
                    onClick={() => {
                      openAddServiceReqModel();
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 table-container">
                <CommonTable
                  tableHeading={myReqTableHeading}
                  primary={true}
                  tableData={myReqests}
                  loading={myReqestsTableLoading}
                  serviceMyRequest={true}
                  deleteAction={(item) => {
                    setShowDeleteModel(true);
                    setSelectedServiceRequest(item);
                  }}
                />
              </div>
            </div>
            <div className="mt-4 d-flex justify-content-end">
              <CommonPagination
                pages={totalPageForMyTable}
                currentPage={currentPageForMyTable}
                setCurrentPage={setCurrentPageForAMyable}
              />
            </div>
          </div>
        </div>

        {pageLoading ? <CommonLoader /> : null}
        {serviceVolunteer ? (
          
            <div className="d-flex gap-3 flex-row justify-content-end mt-5 w-100 ">
              <div>
                <CommonButton
                  text={"Volunteer"}
                  onClick={() => {
                    navigateToVolunteerDetailsPage();
                  }}
                />
              </div>
            </div>
  
        ) : null}

        {service ? (
          <div className="d-flex flex-column mt-3">
            <div className="text-cl-primary">Service letter requests</div>
            <div className="mt-4 d-flex flex-column gap-3 justify-content-center bg-white rounded-2 common-shadow p-3">
              <div className="mt-4 table-container">
                <div className="mt-2 d-flex flex-wrap justify-content-between align-items-center">
                  <CommonSearch
                    primary={true}
                    value={searchItem}
                    onChange={handleSearchChange}
                  />
                  <div className="">
                    <select
                      className="form-select w-100"
                      aria-label="Large select example"
                      value={selectedStatus}
                      onChange={handleStatusChange}
                    >
                      <option value="" selected>
                        Select Status
                      </option>
                      <option value="TODO">ToDo</option>
                      <option value="REVIEWED">Reviewed</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 table-container">
                  <CommonTable
                    tableHeading={allReqTableHeading}
                    primary={true}
                    tableData={allReqests}
                    loading={allReqestsTableLoading}
                    editAction={(item) => {
                      handleShowStatusChangeModel(item);
                    }}
                    viewAction={(item) => {
                      openViewServiceReqModel(item);
                    }}
                    moreAction={(item) => {
                      navigateToUserActivitiesPage(item?.item?.user?.userID);
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 d-flex justify-content-end">
                <CommonPagination
                  pages={totalPageForAllTable}
                  currentPage={currentPageForAllTable}
                  setCurrentPage={setCurrentPageForAllTable}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <CreateServiceRequestModel
        show={showAddSereviceReqModel}
        onHide={handleCloseCreateServiceModel}
        edit={true}
        refresh={() => setRefreshTable(refreshTable + 1)}
      />
      <CreateServiceRequestModel
        show={showViewSereviceReqModel}
        onHide={handleCloseViewServiceModel}
        view={true}
        requestData={slectedServiceRequest}
      />

      <VolunteerStatusChangeModel
        show={statusChangeModelShow}
        onHide={handleCloseStatusChangeModel}
        requestData={slectedServiceRequest}
        refresh={() => setRefreshTable(refreshTable + 1)}
      />

      <CommonDeleteModel
        onclick={handleDeleteProject}
        loading={deleteLoading}
        error={deleteError}
        mode={"Service Letter Request"}
        onHide={handleCloseDeleteModel}
        show={showDeleteModel}
        text={"request"}
      />
    </>
  );
};

export default serviceLandingPage;
