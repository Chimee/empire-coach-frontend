import { DashboardIcon, CompanySvg, JobsSvg, CompletedJobsSvg, AdminSvg, DriverSvg } from "./Sidebarsvg";
import { jwtDecode } from "../../../helpers/AccessControlUtils"


const token = localStorage.getItem('authToken')
const tokenDecode = jwtDecode(token)
console.log(tokenDecode, "tokenDecode");

export const MenuItems = tokenDecode?.role.toLowerCase() === "customer" ? [
  {
    title: "Dashboard",
    path: "/dashboard",
    roles: ["admin", "superadmin", "customer"],
    icon: <DashboardIcon />,
    subMenu: [],
  },
  {
    title: "Empire Users",
    path: "/admin",
    roles: ["superadmin",],
    icon: <AdminSvg />,
    subMenu: [],
  },
  {
    title: "Customer Companies",
    path: "/company",
    roles: ["admin", "superadmin"],
    icon: <CompanySvg />,
    subMenu: [],
  },

  {
    title: "Jobs",
    path: "/jobs",
    roles: ['customer'],
    icon: <JobsSvg />,
    subMenu: [],
  },
  {
    title: "Jobs",
    path: "/admin-jobs",
    roles: ["admin", "superadmin",],
    icon: <JobsSvg />,
    subMenu: [],
  },
  {
    title: "Drivers",
    path: "/drivers",
    roles: ["admin", "superadmin",],
    icon: <DriverSvg />,
    subMenu: [],
  },
  {
    title: "Completed Jobs",
    path: "/completed-jobs",
    roles: ["customer"],
    icon: <CompletedJobsSvg />,
    subMenu: [],
  },
  {
    title: "Settings",
    path: "/setting",
    roles: ["admin", "superadmin", "customer"],
    icon: <DriverSvg />,
    subMenu: [],
  },


] : [
  {
    title: "Dashboard",
    path: "/dashboard",
    roles: ["admin", "superadmin", "customer"],
    icon: <DashboardIcon />,
    subMenu: [],
  },
  {
    title: "Jobs",
    path: "/admin-jobs",
    roles: ["admin", "superadmin",],
    icon: <JobsSvg />,
    subMenu: [],
  },
  {
    title: "Customer Companies",
    path: "/company",
    roles: ["admin", "superadmin"],
    icon: <CompanySvg />,
    subMenu: [],
  },
  {
    title: "Empire Users",
    path: "/admin",
    roles: ["superadmin",],
    icon: <AdminSvg />,
    subMenu: [],
  },
  {
    title: "Jobs",
    path: "/jobs",
    roles: ['customer'],
    icon: <JobsSvg />,
    subMenu: [],
  },
  {
    title: "Drivers",
    path: "/drivers",
    roles: ["admin", "superadmin",],
    icon: <DriverSvg />,
    subMenu: [],
  },
  {
    title: "Settings",
    path: "/setting",
    roles: ["admin", "superadmin", "customer"],
    icon: <DriverSvg />,
    subMenu: [],
  },
  {
    title: "Completed Jobs",
    path: "/completed-jobs",
    roles: ["customer"],
    icon: <CompletedJobsSvg />,
    subMenu: [],
  },


];