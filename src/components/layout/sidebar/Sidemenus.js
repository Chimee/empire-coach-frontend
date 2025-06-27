import {DashboardIcon,CompanySvg,JobsSvg,CompletedJobsSvg,AdminSvg,DriverSvg} from "./Sidebarsvg";

export const MenuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      roles: ["admin", "superadmin",],
      icon: <DashboardIcon />,
      subMenu: [],
    },
     {
      title: "Admin",
      path: "/admin",
      roles: ["superadmin",],
      icon: <AdminSvg />,
      subMenu: [],
    },
    {
      title: "Company",
      path: "/company",
      roles: ["admin", "superadmin", ],
      icon: <CompanySvg />,
      subMenu: [],
    },
   
    {
      title: "Jobs",
      path: "/jobs",
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
    // {
    //   title: "Completed Jobs",
    //   path: "/completed-jobs",
    //   roles: ["admin", "user", "manager"],
    //   icon: <CompletedJobsSvg />,
    //   subMenu: [],
    // },
   
   
  ];