import React, {useCallback, useMemo} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes as AppRoutes} from "./routes";
import "./App.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./features/auth/login/Login";
import Dashboard from "./features/dashboard/Dashboard";

import CreatePassword from "./features/auth/createPassword/CreatePassword";
import ResetPassword from "./features/auth/resetPassword/ResetPassword";
import {isTokenExpired} from "./helpers/AccessControlUtils";
import {useDispatch, useSelector} from "react-redux";
import 'react-phone-input-2/lib/style.css'

import {setRedirectPath} from "./app/globalSlice";
import {Navigate, Outlet} from "react-router";
import Header from "./components/layout/header/Header";
import Sidebar from "./components/layout/sidebar/Sidebar";
import {Toaster} from "react-hot-toast";
import ForgetPassword from "./features/auth/forgetPassword/ForgetPassword";
import Admin from "./features/admin/Admin";
import AddAdmin from "./features/admin/AddAdmin";
import AdminDetails from "./features/admin/AdminDetails";
import Company from "./features/company/Company";
import AddCompany from "./features/company/AddCompany";
import CompnayDetails from "./features/company/CompnayDetails";
import AddCustomer from "./features/customer/AddCustomer";
import Jobs from "./features/Jobs/Jobs";
import AdminJobs from "./features/Jobs/AdminJobs";
import AdminJobDetails from "./features/Jobs/AdminJobDetails";
import JobDetails from "./features/Jobs/JobDetails";
import Driver from "./features/drivers/Driver";
import AddDriver from "./features/drivers/addDriver";
import DriverDetails from "./features/drivers/DriverDetails";
import CustomerDetails from "./features/customer/CustomerDetails";
import EditCompany from "./features/company/EditCompnay";
import CreateJob from "./features/Jobs/CreateJob";
import RideDeatails from "./features/driverScreens/rideDeatails";
import StartPickup from "./features/driverScreens/StartPickup";
import EndPickup from "./features/driverScreens/endPickup";
import TripStarted from "./features/driverScreens/TripStarted";
import RideStatusScreen from "./features/driverScreens/RideStatusScreen";
import UploadDocument from "./features/driverScreens/UploadDocument";
import CompleteDelivery from "./features/driverScreens/CompleteDelivery";
import Vehicle from "./features/admin/Vehicle/Vehicle";
import AddVehicle from "./features/admin/Vehicle/AddVehicle";
import CompletedJobs from "./features/Jobs/completedJobs";

function App() {
    const error = useSelector((state) => state.global.error);
    const PublicRoutes = React.memo(() => {
        return (
            <>
                <Outlet/>
            </>
        );
    });
    const PrivateRoutes = () => {
        const dispatch = useDispatch();
        const isUserLoggedIn = useMemo(() => localStorage.getItem("authToken"), []);
        const isAuthenticated = useMemo(() => isUserLoggedIn && !isTokenExpired(), [isUserLoggedIn]);
        const renderContent = useCallback(() => {
            if (!isAuthenticated) {
                // Capture the attempted path and redirect to login
                dispatch(setRedirectPath(window.location.pathname + window.location.search + window.location.hash));
                return <Navigate to="/login"/>;
            }
            return (
                <div className="wrapper">
                    <div className="inner_wrapper">
                        <Header/>
                        <Sidebar/>
                        <Outlet/>
                    </div>
                </div>
            );
        }, [dispatch, isAuthenticated]);
        return renderContent();
    };


    return (
        <Router>
            <Toaster position="top-center" reverseOrder={false} />
            {!error &&
                <Routes>
                    {/* Public Routes without Layout */}
                    <Route element={<PublicRoutes/>}>
                        {!(localStorage.getItem("authToken") && !isTokenExpired()) && <Route path={AppRoutes.Default.path} element={<Login/>}/>}
                        <Route path={AppRoutes.Login.path} element={<Login/>}/>
                        <Route path={AppRoutes.CreatePassword.path} element={<CreatePassword/>}/>
                        <Route path={AppRoutes.ResetPassword.path} element={<ResetPassword/>}/>
                        <Route path={AppRoutes.ForgotPassword.path} element={<ForgetPassword/>}/>
                        <Route path={AppRoutes.RideDeatails.path} element={<RideDeatails/>}/>
                        <Route path={AppRoutes.StartPickup.path} element={<StartPickup/>}/>
                        <Route path={AppRoutes.EndPickup.path} element={<EndPickup/>}/>
                        <Route path={AppRoutes.TripStarted.path} element={<TripStarted/>}/>
                        <Route path={AppRoutes.RideStatusScreen.path} element={<RideStatusScreen/>}/>
                        <Route path={AppRoutes.UploadDocument.path} element={<UploadDocument/>}/>
                        <Route path={AppRoutes.CompleteDelivery.path} element={<CompleteDelivery/>}/>
                        
                    </Route>
                    {/* Private Routes with Layout */}
                    <Route element={<PrivateRoutes/>}>
                      <Route path={AppRoutes.Dashboard.path} element={<Dashboard/>}/>
                        {(localStorage.getItem("authToken") && !isTokenExpired()) && <Route path={AppRoutes.Default.path} element={<Dashboard/>}/>}
                        <Route path={AppRoutes.Dashboard.path} element={<Dashboard/>}/>
                        <Route path={AppRoutes.Admin.path} element={<Admin/>}/>
                        <Route path={AppRoutes.AddAdmin.path} element={<AddAdmin/>}/>
                        <Route path={AppRoutes.AdminDetails.path} element={<AdminDetails/>}/>
                        <Route path={AppRoutes.Company.path} element={<Company/>}/>
                        <Route path={AppRoutes.AddCompany.path} element={<AddCompany/>}/>
                        <Route path={AppRoutes.EditCompany.path} element={<EditCompany/>}/>
                        <Route path={AppRoutes.CompnayDetails.path} element={<CompnayDetails/>}/>
                        <Route path={AppRoutes.AddCustomer.path} element={<AddCustomer/>}/>
                        <Route path={AppRoutes.CustomerDetails.path} element={<CustomerDetails/>}/>
                        <Route path={AppRoutes.Jobs.path} element={<Jobs/>}/>
                        <Route path={AppRoutes.AdminJobs.path} element={<AdminJobs/>}/>
                        <Route path={AppRoutes.AdminJobsDetails.path} element={<AdminJobDetails/>}/>
                        <Route path={AppRoutes.JobDetails.path} element={<JobDetails/>}/>
                        <Route path={AppRoutes.Driver.path} element={<Driver/>}/>
                        <Route path={AppRoutes.AddDriver.path} element={<AddDriver/>}/>
                        <Route path={AppRoutes.DriverDetails.path} element={<DriverDetails/>}/>
                        <Route path={AppRoutes.CreateJob.path} element={<CreateJob/>}/>
                        <Route path={AppRoutes.Vehicle.path} element={<Vehicle/>}/>
                        <Route path={AppRoutes.AddVehicle.path} element={<AddVehicle/>}/>
                         <Route path={AppRoutes.CompletedJobs.path} element={<CompletedJobs/>}/>


                    </Route>
                </Routes>
            }

        </Router>

    );
}

export default App;
