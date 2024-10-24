import React, { useEffect, useState } from "react";
import "./dashboardLayout.css";
import CommonNavBar from "../../common/navBar/navBar";
import SideBar from "../../common/sideBar/sideBar";
import { Outlet } from "react-router-dom";
import { getCurrentUser, logout } from "../../../redux/actions/user";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userData } from "../../../redux/reducers/userSlice";
import defaultUser from "../../../assets/images/default-user.png";

const DashboardLayout = () => {
  const distpatch = useDispatch();
  const userdetails = useSelector((state) => state.user.userData);
  const [userImg, setUserImg] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  
  useEffect(() => {
    if (userdetails == null) {
      getCurrentUser((res) => {
        console.warn("status", res?.status);
        if (res?.status == 200) {

          let user = res?.data?.data?.[0]?.user;
          setFirstName(user?.firstName);
          setLastName(user?.lastName);
          setEmail(user?.email);
          setUserImg(user?.profilePic);

          distpatch(userData(res?.data?.data));
        } else {
          logout();
          window.location.reload();
        }
      });
    }
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-2 navbar navbar-expand-sm sticky-top ps-2 pe-2 sidebar">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-start w-75"
            id="navbarSupportedContent"
          >
            <div className="offcanvas-header bg-third">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body bg-third">
              <SideBar />
            </div>
          </div>
        </div>

        <div className="col-sm-10 body-bag-primary container-fluid m-0 p-0">
          <CommonNavBar>
            <div className="d-flex w-100 justify-content-end align-items-center">
              <div className="d-flex">
                <div className="me-3 fw-bold justify-content-end align-align-items-center" style={{fontSize: 12}}>
                    <div className="text-end">{firstName} {lastName}</div>
                    <div className="fw-lighter">{email}</div>
                    </div>
                <div
                  style={{ width: 29, height: 29, marginRight: -5 }}
                  className="bg-white rounded-circle d-flex justify-content-center align-items-center"
                >
                  <img
                    src={userImg || defaultUser}
                    width={40}
                    height={40}
                    className="rounded-circle"
                  />
                </div>
              </div>
            </div>
          </CommonNavBar>
          <div className="mt-4 p-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
