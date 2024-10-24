import React, { useEffect, useState } from "react";
import CommonSearch from "../../../components/common/commonSearch/commonSearch";
import CommonTable from "../../../components/common/commonTable/commonTable";
import CommonPagination from "../../../components/common/commonPagination/commonPagination";
import MemberDetailsModal from "../../../components/models/viewMemberDetailsModel/viewMemberDetailsModel";
import OuCard from "../../../components/common/oucard/ouCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllTermYear } from "../../../redux/actions/termYear";
import CommonLoader from "../../../components/common/commonLoader/commonLoader";
import { getAllExcomMember, getAllOU } from "../../../redux/actions/ou";
import { PolicyValidate } from "../../../utils/valitations/Valitation";

const ExcomLandingPage = () => {
  const currentYear = new Date().getFullYear();
  const [searchItem, setsearchItem] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [termFilter, setTermFilter] = useState("");
  const [availableTermYears, setAvailableTermYears] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [memberDetailModalShow, setMemberDetailModalShow] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const [pageLoading, setPageLoading] = useState(true);
  const [entityCards, setentityCard] = useState([]);
  const [refreshTable, setRefreshTable] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [entities, setEntities] = useState([""]);
  const [excomData, SetExcomData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [ouloader, setouloader] = useState(false);
  const [IsExcomAllAvailable, setIsExcomAllAvailable] = useState(false);

  useEffect(() => {
    setouloader(true);
    getAllOU((res) => {
      if (res.status == 200) {
        let data = res?.data?.data?.map(
          ({ ouID, ouName, ou_logo, ou_short_name }) => ({
            id: ouID,
            name: ouName,
            logo: ou_logo,
            shortName: ou_short_name,
          })
        );
        // console.warn(data);
        setentityCard(data);
        setouloader(false);
      } else {
        setentityCard([]);
        setouloader(false);
      }
    });
  }, []);

  useEffect(() => {
    setLoader(true);
    console.log("termFilter", termFilter);
    getAllExcomMember(
      currentPage - 1,
      searchItem,
      entityFilter,
      termFilter,
      (res) => {
        if (res.status == 200) {
          // Log raw response to inspect
          console.log("Raw Data Response: ", res?.data);

          // Ensure data exists in the expected path before mapping
          const content = res?.data?.data?.content;
          if (content && content.length > 0) {
            let data = content.map((user) => ({
              id: user?.userRoleDetailsId,
              fname: user?.user?.firstName,
              lname: user?.user?.lastName,
              email: user?.user?.email,
              profileImg : user?.user?.profilePic,
              contactNo: user?.user?.contactNo,
              entity: user?.ou?.ou_short_name,
              position: user?.role?.userRole,
              academicYear: user?.user?.academicYear?.academicYear || "N/A",
              termYear: user?.termyear?.termyear || "N/A",
            }));
            console.log("Mapped Data: ", data);
            SetExcomData(data);
            setTotalPage(res?.data?.data?.totalPages);
            console.warn("Total Pages: ", res?.data?.data?.totalPages);
          } else {
            console.warn("No content found in response");
            SetExcomData([]); // Set to empty array if no content
          }
          setLoader(false);
        } else {
          console.error("Failed to load data: ", res);
          setLoader(false);
        }
      }
    );
  }, [searchItem, currentPage, refreshTable, entityFilter, termFilter]);

  // useEffect(() => {
  //       if (!entityFilter) {
  //           console.warn("No valid entityFilter (ouid) selected, skipping API call.");
  //           return;
  //       }

  //       if (!termFilter) {
  //           console.warn("No valid termFilter (termyearId) selected, skipping API call.");
  //           return;
  //       }

  //       setLoader(true);
  //       getAllExcomMember(currentPage - 1, searchItem, entityFilter, termFilter, (res) => {
  //           if (res.status === 200) {
  //               const content = res?.data?.data?.content;
  //               if (content && content.length > 0) {
  //                   let data = content.map((user) => ({
  //                       id: user?.userRoleDetailsId,
  //                       fname: user?.user?.firstName,
  //                       lname: user?.user?.lastName,
  //                       email: user?.user?.email,
  //                       contactNo: user?.user?.contactNo,
  //                       entity: user?.ou?.ou_short_name,
  //                       position: user?.role?.userRole,
  //                       academicYear: user?.user?.academicYear?.academicYear || "N/A",
  //                       termYear: user?.termyear?.termyear || "N/A",
  //                   }));
  //                   SetExcomData(data);
  //                   setTotalPage(res?.data?.data?.totalPages);
  //               } else {
  //                   SetExcomData([]);
  //               }
  //               setLoader(false);
  //           } else {
  //               console.error("Failed to load data: ", res);
  //               setLoader(false);
  //           }
  //       });
  //   }, [searchItem, currentPage, refreshTable, entityFilter, termFilter]);

  useEffect(() => {
    setPageLoading(true);
    if (userData) {
      const isExcomAvailable = PolicyValidate(userData, "EXCOM");
      const isExcomAllAvailable = PolicyValidate(userData, "EXCOM_ALL");
      setIsExcomAllAvailable(isExcomAllAvailable);
      if (!isExcomAvailable) {
        navigate("/dashboard");
      } else {
        setPageLoading(false);
      }
    }
  }, [userData, navigate]);

  const handleCloseMemberDetailModal = () => setMemberDetailModalShow(false);

  const handleShowMemberDetailModal = (member) => {
    if (member) {
      console.log("Selected Member: ", member); // Log the selected member to verify
      setSelectedMember(member); // Set the selected member directly
      setMemberDetailModalShow(true); // Show the modal
    } else {
      console.error("No member data available");
    }
  };

  //   function search(item) {
  //     setsearchItem(item?.target?.value || "");
  //     console.warn(item?.target?.value);
  //   }
  const handleSearchChange = (e) => setsearchItem(e);
  const handleEntityChange = (e) => setEntityFilter(e.target.value);
  const handleTermChange = (e) => setTermFilter(e.target.value);

  const tableHeading = [
    { label: "First Name", value: "fname" },
    { label: "Last Name", value: "lname" },
    { label: "Email", value: "email" },
    { label: "Contact Number", value: "contactNo" },
    { label: "Entity", value: "entity" },
    { label: "Position", value: "position" },
    { label: "Academic Year", value: "academicYear" },
    { label: "Term Year", value: "termYear" },
    { label: "Action", value: "ACTION", type: ["VIEW"] },
  ];

  function navigateToExcomPage(ouid) {
    navigate(`/dashboard/executive-committee/${ouid}`);
  }

  //   const entities = [
  //     { id: 0, name: "SB", type: "Student Branch", logo: sbLogo },
  //     { id: 1, name: "WIE", type: "Affinity Group", logo: wieLogo },
  //     { id: 2, name: "RAS", type: "Technical Chapter", logo: rasLogo },
  //     { id: 3, name: "IAS", type: "Technical Chapter", logo: iasLogo },
  //     { id: 4, name: "CS", type: "Technical Chapter", logo: iasLogo }
  //   ];

  useEffect(() => {
    getAllTermYear((res) => {
      if (res.status == 200) {
        let termYears = res?.data?.data;
        setAvailableTermYears(termYears);
      }
    });
  }, []);

  return (
    <>
      {pageLoading ? (
        <CommonLoader />
      ) : (
        <>
          <div className="container">
            <div className="text-cl-primary">Entities</div>
            <div className="row mt-3">
              {ouloader
                ? [0, 0, 0].map((ou) => (
                  <div
                    key={ou.id}
                    className="col-10 col-sm-6 col-md-5 col-lg-3 me-0 mb-4"
                  >
                    <OuCard loading={true} />
                  </div>
                ))
                : entityCards.map((ou) => (
                  <div
                    key={ou.id}
                    className="col-10 col-sm-6 col-md-5 col-lg-3 me-0 mb-4"
                  >
                    <OuCard
                      id={ou.id}
                      name={ou.shortName}
                      logo={ou.logo}
                      type={ou.name}
                      onclick={(id) => navigateToExcomPage(id)}
                    />
                  </div>
                ))}
            </div>

            <div className="text-cl-primary mt-4">Members details</div>
            <div className="mt-3 pt-4 p-3 rounded-4 bg-white common-shadow">
              <div className="d-flex justify-content-between flex-wrap align-items-center p-3">
                <div>
                  <CommonSearch primary={true} onChange={handleSearchChange} />
                </div>
                <div>
                  <select
                    className="form-select"
                    aria-label="Select Entity"
                    value={entityFilter}
                    onChange={handleEntityChange}
                  >
                    <option value={""}>Select Entity</option>
                    {entityCards.map((ou) => (
                      <option key={ou.id} value={ou.id}>
                        {ou.shortName}
                      </option>
                    ))}
                  </select>
                </div>
                {IsExcomAllAvailable && (
                  <div>
                    <select
                      className="form-select ms-2 me-1"
                      value={termFilter}
                      onChange={handleTermChange}
                    >
                      <option value={currentYear}>Select Term</option>
                      {availableTermYears.map((year) => (
                        <option key={year.termyearId} value={year.termyearId}>
                          {year.termyear}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              </div>

              <div className="mt-3 p-3 rounded-4 bg-white d-flex flex-column justify-content-between table-container">
                <CommonTable
                  tableHeading={tableHeading}
                  tableData={excomData}
                  primary={true}
                  loading={loader}
                  viewAction={(member) => {
                    // Instead of finding by ID, just use the member directly
                    console.log("Member received: ", member);
                    handleShowMemberDetailModal(member); // Pass the member object directly
                  }}
                />

                <div className="mt-4 d-flex justify-content-end">
                  <CommonPagination
                    pages={totalPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>
          <MemberDetailsModal
            show={memberDetailModalShow}
            onHide={handleCloseMemberDetailModal}
            memberData={selectedMember}
          />
        </>
      )}
    </>
  );
};

export default ExcomLandingPage;
