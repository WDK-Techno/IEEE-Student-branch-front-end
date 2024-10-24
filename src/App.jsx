import React from 'react';
import './App.css';
import { Navigate, Outlet, Route, Routes, } from 'react-router-dom';
import DashboardLayout from './components/layouts/dashboardLayout/dashboardLayout';
import ExcomLandingPage from './pages/excomFLow/excomLandingPage/excomLandingPage';
import ExecutiveCommitteePage from './pages/excomFLow/executiveCommitteePage/executiveCommitteePage';
import ExcomDetailPage from './pages/excomFLow/excomDetailPage/excomDetailPage';
import SignIN from './pages/authFlow/signIn/signIn';
import SignUp from './pages/authFlow/signUp/signUp';
import VerifyCode from './pages/authFlow/verifyCode/verifyCode';
import ForgotPassword from './pages/authFlow/forgotPassword/forgotPassword';
import ChangePassword from './pages/authFlow/changePassword/changePassword';
import NotFound from './pages/notFound/notFound';
import FinanceLanding from './pages/financeFlow/financeLanding/financeLanding';
import Proposal from './pages/financeFlow/proposal/proposal';
import ReportPage from './pages/financeFlow/reportPage/reportPage';
import ProjectLandingPage from './pages/projectFlow/projectLandingPage/projectLandingPage';
import TimeLinePage from './pages/projectFlow/timeLinePage/timeLinePage';
import ProjectPage from './pages/projectFlow/projectPage/projectPage';
import ProjectFinanceLanding from './pages/projectFlow/finance/projectFinanceLanding/projectFinanceLanding';
import ServiceLanding from './pages/serviceFlow/serviceLandingPage/serviceLandingPage';
import VolunteerDetailsPage from './pages/serviceFlow/volunteerDetailsPage/volunteerDetails';
import Volunteering from './pages/serviceFlow/VolunteeringPage/VolunteeringPage';
import ProjectPrPlan from './pages/projectFlow/prPlan/projectPrPlan';
import ProfileEditPage from './pages/settingFlow/profileEditPage/profileEditPage';
import OtherLandingPage from './pages/otherFlow/langingPage/landingPage';
import AcademicYearPage from './pages/otherFlow/academicYearPage/academicYearPage'
import TermYearPage from './pages/otherFlow/termYearPage/termYearPage'
import PolicyPage from './pages/otherFlow/policyPage/policyPage'
import UserRolePage from './pages/otherFlow/userRolePage/userRolePage'
import OuPage from './pages/otherFlow/ouPage/ouPage'
import ProjectEventPage from './pages/projectFlow/event/projectEventPage';
import UpcommingEventsPage from './pages/eventFlow/upcommingEventsPage';
import Cookies from "js-cookie";
import VolunteerActivitiesPage from './pages/serviceFlow/volunteerActivitiesPage/volunteerActivitiesPage';


function App() {

  const PrivateRoute = () => {
    const auth = Cookies.get('token', { path: '/' });
    return auth ? <Outlet /> : <Navigate to="/" />;
  }

  const PublicRoute = () => {
    const auth = Cookies.get('token', { path: '/' });
    return auth ? <Navigate to="/dashboard" /> : <Outlet />;
  }
  

  return (
    <>
      <Routes>
        <Route path='' element={<PublicRoute />}>
          <Route path='/' element={<SignIN />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/verify-code/:type' element={<VerifyCode />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/forgot-password/change-password' element={<ChangePassword />} />
        </Route>
        <Route path='' element={<PrivateRoute />}>
          <Route path='/dashboard' element={<DashboardLayout />}>
          <Route path='not-found' element={<NotFound />} />
            <Route index element={<UpcommingEventsPage />} />
            <Route path='executive-committee' >
              <Route path='' element={<ExcomLandingPage />} />
              <Route path=':id' element={<ExecutiveCommitteePage />} />
              <Route path=':id/detail' element={<ExcomDetailPage />} />
            </Route>
            <Route path='project'>
              <Route path='' element={<ProjectLandingPage />} />
              <Route path='time-line' element={<TimeLinePage />} />
              <Route path=':id'  >
                <Route path='' element={<ProjectPage />} />
                <Route path='prPlan' element={<ProjectPrPlan />} />
                <Route path='finance' element={<ProjectFinanceLanding />} />
                <Route path='event' element={<ProjectEventPage />} />
              </Route>
            </Route>
            <Route path='finance'>
              <Route path='' element={<FinanceLanding />} />
              <Route path='proposal' element={<Proposal />} />
              <Route path='report' element={<ReportPage />} />
            </Route>
            <Route path='service'>
              <Route path='' element={<ServiceLanding />} />
              <Route path='volunteer' element={<VolunteerDetailsPage />} />
              <Route path='activities/:id' element={<VolunteerActivitiesPage />} />
              <Route path='activities' element={<VolunteerActivitiesPage />} />
              <Route path='volunteering' element={<Volunteering />} />
            </Route>
            <Route path='setting'>
              <Route path='' element={<ProfileEditPage />} />
            </Route>
            <Route path='other'>
              <Route path='' element={<OtherLandingPage />} />
              <Route path='academic-year' element={<AcademicYearPage />} />
              <Route path='policy' element={<PolicyPage />} />
              <Route path='user-role' element={<UserRolePage />} />
              <Route path='ouPage' element={<OuPage />} />
              <Route path='termYear' element={<TermYearPage />} />
            </Route>
            <Route path='*' element={<NotFound />}>
            </Route>
          </Route>
        </Route>

      </Routes>
    </>

  );
}

export default App;
