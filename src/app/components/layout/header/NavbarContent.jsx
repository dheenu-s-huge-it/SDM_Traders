// Next Imports
'use client'
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState,useEffect } from "react";
// Third-party Imports
import classnames from "classnames";
import { alpha } from '@mui/material/styles'
// Component Imports
import NavToggle from "./NavToggle";
import ModeDropdown from "../../layout/shared/ModeDropdown";
import NotificationsDropdown from "../../layout/shared/NotificationsDropdown";
// import UserDropdown from '../../../(components)/layout/shared/UserDropdown'

// Hook Imports
import useHorizontalNav from "../../../../@menu/hooks/useHorizontalNav";

// Util Imports
import { horizontalLayoutClasses } from "../../../../@layouts/utils/layoutClasses";

import Logo from "../../shared/Logo";
import Profile from "./Profile";
import { axiosGet } from "../../../../lib/api";
// Vars
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Alert, InputLabel, Snackbar } from "@mui/material";
import { MobileSliderMenu } from "./VerticalMenu";
const shortcuts = [
  {
    url: "/apps/calendar",
    icon: "tabler-calendar",
    title: "Calendar",
    subtitle: "Appointments",
  },
  {
    url: "/apps/invoice/list",
    icon: "tabler-file-dollar",
    title: "Invoice App",
    subtitle: "Manage Accounts",
  },
  {
    url: "/apps/user/list",
    icon: "tabler-user",
    title: "Users",
    subtitle: "Manage Users",
  },
  {
    url: "/apps/roles",
    icon: "tabler-users-group",
    title: "Role Management",
    subtitle: "Permissions",
  },
  {
    url: "/",
    icon: "tabler-device-desktop-analytics",
    title: "Dashboard",
    subtitle: "User Dashboard",
  },
  {
    url: "/pages/account-settings",
    icon: "tabler-settings",
    title: "Settings",
    subtitle: "Account Settings",
  },
];

const notifications = [
  {
    avatarImage: "/images/avatars/8.png",
    title: "Congratulations Flora 🎉",
    subtitle: "Won the monthly bestseller gold badge",
    time: "1h ago",
    read: false,
  },
  {
    title: "Cecilia Becker",
    avatarColor: "secondary",
    subtitle: "Accepted your connection",
    time: "12h ago",
    read: false,
  },
  {
    avatarImage: "/images/avatars/3.png",
    title: "Bernard Woods",
    subtitle: "You have new message from Bernard Woods",
    time: "May 18, 8:26 AM",
    read: true,
  },
  {
    avatarIcon: "tabler-chart-bar",
    title: "Monthly report generated",
    subtitle: "July month financial report is generated",
    avatarColor: "info",
    time: "Apr 24, 10:30 AM",
    read: true,
  },
  {
    avatarText: "MG",
    title: "Application has been approved 🚀",
    subtitle: "Your Meta Gadgets project application has been approved.",
    avatarColor: "success",
    time: "Feb 17, 12:17 PM",
    read: true,
  },
  {
    avatarIcon: "tabler-mail",
    title: "New message from Harry",
    subtitle: "You have new message from Harry",
    avatarColor: "error",
    time: "Jan 6, 1:48 PM",
    read: true,
  },
];

const NavbarContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav();
  const ACCESS_TOKEN = Cookies.get("token");
  const userId = Cookies.get("user_id")
  const router = useRouter();
  const [error, setError] = useState({ status: "", message: "" });
  const [notifications,setNotifications] = useState([])
  
  const logout = async () => {
    axiosGet
      .get(`user_logout?access_token=${ACCESS_TOKEN}`)
      .then((response) => {
        if (response.data.action === "success") {
          router.push("/login");
          Cookies.remove("token");
          Cookies.remove("user_id");
          localStorage.removeItem("userID");
          localStorage.removeItem("userId");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userData");
          Cookies.remove("vuexy-mui-next-demo-1");
          setError({ status: "success", message: response.data.message });
        } else {
          setError({ status: "error", message: response.data.message });
        }
      })
      .catch((error) => {
        router.push("/login");
        Cookies.remove("token");
        console.error("Error:", error);
      });
  };
const userData = Cookies.get("user_data");
  const obj = JSON.parse(userData)

  
  const fetchData = async () => {
    axiosGet
      .get(
        `notification_get?access_token=${ACCESS_TOKEN}&items_per_page=10000`
      )
      .then((response) => {
        if (response.data && response.data.data) {
          const data = response.data.data;
  
          // Initialize toggle states based on API values
          setNotifications(data)
        } else {
          console.warn("No data found.");
          setNotifications([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
    useEffect(() => {
      fetchData();
      
      }, []);

 

  
  return (
    <div
      className={classnames(
        horizontalLayoutClasses.navbarContent,
        "flex items-center justify-between gap-4 w-full"
      )}
    >
      <div className="flex items-center gap-4">
        <NavToggle />
        {/* Hide Logo on Smaller screens */}
        <div className="hidden md:block">
    <Logo />
  </div>
  {/* Show Vertical Menu Toggle Button on small screens */}
  <div className="block md:hidden">
    <MobileSliderMenu />
  </div>
      </div>

     <div className="flex items-center gap-1">
        <InputLabel
          sx={(theme) => ({
            fontWeight: "bold",
            backgroundColor: alpha(theme.palette.background.paper, 0.7), // you can add opacity value here
            p: 2,
            borderRadius: 1,
            border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.divider : "#eee"}`,
            fontSize:'12px'
          })}
        >{obj.user_name}</InputLabel>
        <ModeDropdown />
        <NotificationsDropdown notifications={notifications || []} setNotifications={setNotifications || []} />
        {/* <UserDropdown /> */}
        <Profile userName={"use"} onLogout={logout} userData={userData} />
        {/* Language Dropdown, Notification Dropdown, quick access menu dropdown, user dropdown will be placed here */}
      </div>
      <Snackbar
        open={error.message !== ""}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        message={error.message}
        onClose={() => setError({ status: "", message: "" })}
        autoHideDuration={2500}
      >
        <Alert severity={error.status}>{error.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default NavbarContent;
