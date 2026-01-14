export const Routes = {
    Default: {
        path: "/"
    },
    Login: {
        path: "/login"
    },
    Dashboard: {
        path: "/dashboard"
    },
    Admin: {
        path: "/admin"
    },
    AddAdmin: {
        path: "/admin/add-admin"
    },
    AdminDetails: {
        path: "/admin/admin-details/:id"
    },
    Company: {
        path: "/company"
    },
    AddCompany: {
        path: "/company/add-company"
    },
    EditCompany: {
        path: "/company/edit-company"
    },
    CompnayDetails: {
        path: "/company/company-details/:id"
    },
    AddCustomer: {
        path: "/company/company-details/add-customer"
    },
    CustomerDetails: {
        path: "/company/customer-details/:id"
    },
    Jobs: {
        path: "/jobs"
    },
    CompletedJobs: {
        path: "/completed-jobs"
    },
    AdminJobs: {
        path: "/admin-jobs"
    },
    AdminJobsDetails: {
        path: "/admin-jobs/job-details/:id"
    },
    JobDetails: {
        path: "/jobs/job-details/:id"
    },
    Driver: {
        path: "/drivers"
    },
    AddDriver: {
        path: "/drivers/add-driver"
    },
    DriverDetails: {
        path: "/drivers/driver-details/:id"
    },
    CreateJob: {
        path: "/jobs/create-job"
    },
    Vehicle: {
        path: "/setting"
    },
    AddVehicle: {
        path: "/setting/add-vehicle"
    },
    Profile: {
        path: "settings/profile"
    },
    Manager: {
        path: "/manager"
    },
    Supplier: {
        path: "/supplier"
    },
    Unloading: {
        path: "/unloading"
    },
    WashingArea: {
        path: "/washing-area"
    },
    ForgotPassword: {
        path: "/forgot-password"
    },
    RideEntry: {
        path: "/ride-details/jobId/:id/driver/:driverId"
    },
    RideDeatails: {
        path: "/ride-start/jobId/:id/driver/:driverId"
    },
    CreatePassword: {
        path: "/set-password"
    },
    ResetPassword: {
        path: "/reset-password"
    },
    StartPickup: {
        path: "/start-pickup/jobId/:id/driver/:driverId"
    },
    TripStarted: {
        path: "/trip-starts/jobId/:id/driver/:driverId"
    },
    RideStatusScreen: {
        path: "/ride-detail/jobId/:id/driver/:driverId"
    },
    UploadDocument: {
        path: "/upload-documents/jobId/:id/driver/:driverId"
    },
    EndPickup: {
        path: "/end-pickup/jobId/:id/driver/:driverId"
    },
    CompleteDelivery: {
        path: "/delivery-completed/jobId/:id/driver/:driverId"
    },
}