"use client";

// React Imports
import { useRef, useState, useEffect, useMemo } from "react";

// MUI Imports
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import "react-perfect-scrollbar/dist/css/styles.css";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// Third Party Components
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";

// Component Imports
import CustomAvatar from "../../../../@core/components/mui/Avatar";
// import CustomAvatar from '@core/components/mui/Avatar'

// Config Imports
import themeConfig from "../../../../configs/themeConfig";
// import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from "../../../../@core/hooks/useSettings";
import Cookies from "js-cookie";
import { axiosGet, axiosPost } from "../../../../lib/api";
// Util Imports
import { getInitials } from "../../../../utils/getInitials";
import {
  BarChartRounded,
  Close,
  Drafts,
  Mail,
  MailLock,
  MarkAsUnread,
  Notifications,
  NotificationsOutlined,
  X,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { useMediaQuery, useTheme } from "@mui/material";
import { read } from "xlsx";
const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <div className="overflow-x-hidden w-full h-96 z-50">{children}</div>;
  } else {
    return (
      <PerfectScrollbar
        className="w-full h-96 z-50"
        options={{ wheelPropagation: false, suppressScrollX: true }}
      >
        {children}
      </PerfectScrollbar>
    );
  }
};

// ScrollWrapper.propTypes = {
//   children: PropTypes.node.isRequired,
//   hidden: PropTypes.bool,
// };

// ScrollWrapper.defaultProps = {
//   hidden: false,
// };

const getAvatar = (params) => {
  const {
    avatarImage,
    avatarIcon,
    avatarText,
    title,
    avatarColor,
    avatarSkin,
    avatarUser
  } = params;

  if (avatarImage) {
    return <Avatar src={avatarImage} />;
  } else if (avatarIcon) {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || "light-static"}>
        <i className={avatarIcon} />
      </CustomAvatar>
    );
  } else {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || "light-static"}>
        {avatarText || getInitials(title)}
      </CustomAvatar>
    );
  }
};

const NotificationDropdown = ({ notifications, setNotifications }) => {

  const [error, setError] = useState({ status: "", message: "" });
  const [open, setOpen] = useState(false);
  const ACCESS_TOKEN = Cookies.get("token");

  const notificationsState = useMemo(() => {
    return notifications.map((notification) => {
      let avatarImage = null;
      let avatarIcon = null;
      let avatarText = null;
      let title = notification.created_user || "User"; // Use created_user as title

      console.log(notification, "notification");

      // Logic to determine avatarImage, avatarIcon, and avatarText
      if (notification.user_profile_image) { // Check if API provides image
        avatarImage = notification.user_profile_image;
      } else if (notification.user_type === "admin") { // Example: Default icon for admin
        avatarIcon = "tabler-shield"; // Or your admin icon class
      } else if (notification.user_type === "user") { // Example: Default icon for user
        avatarIcon = "tabler-user"; // Or your user icon class
      } else {
        avatarText = title.substring(0, 1).toUpperCase(); // Use initials if no image or icon
      }

      return {
        id: notification.data_uniq_id,
        title: title, // Now correctly set
        subtitle: notification.notification_head || "New Notification",
        time: notification.formatted_created_date || notification.created_f_date || "Just now",
        message: notification.notification,
        avatarImage,
        avatarIcon,
        avatarText,
        avatarColor: "primary",
        avatarSkin: "light-static",
        read: notification.is_saw,
      };
    });
  }, [notifications]);


  const notificationCount = notificationsState.filter((notification) => !notification.read).length;
  const readAll = notificationsState.every((notification) => notification.read);

  const anchorRef = useRef(null);
  const ref = useRef(null);

  const theme = useTheme();
  const hidden = (theme) => theme?.breakpoints.down("lg");
  const isSmallScreen = (theme) => theme?.breakpoints.down("sm");


  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleReadNotification = async (e, isRead, index) => {
    e.stopPropagation();
    const jsonStructure = {
      access_token: ACCESS_TOKEN,
      data_ids: [notificationsState[index]?.id],
      is_saw: "1",
    };
    try {
      axiosPost
        .post("notification_status_change", jsonStructure)
        .then((response) => {
          if (response.data.action === "success") {
            setNotifications((prevNotifications) =>
              prevNotifications.map((notification, i) =>
                i === index ? { ...notification, is_saw: 1 } : notification
              )
            );
            setError({ status: "success", message: response.data.message });

          } else if (response.data.action === "error_group") {
            seterrorsMessage(response.data.message);

          } else {
            setError({ status: "error", message: response.data.message });

          }



        })
        .catch((error) => {

          console.error("POST Error:", error);

        });
    }
    catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  const [viewedMessage, setViewedMessage] = useState(null);

  const handleViewMessage = (e, index) => {
    e.stopPropagation();
    setViewedMessage(index); // Set the currently viewed message index

    // Delay status update to allow message display first
    setTimeout(() => {
      handleReadNotification(e, true, index);
    }, 500); // Adjust delay as needed
  };
  const handleRemoveNotification = (event, index) => {
    event.stopPropagation();
    setNotifications((prevNotifications) => prevNotifications.filter((_, i) => i !== index));
  };

  const readAllNotifications = () => {
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      is_saw: readAll ? 0 : 1,
    }));
    setNotifications(updatedNotifications);
  };

  useEffect(() => {
    const adjustPopoverHeight = () => {
      if (ref.current) {
        const availableHeight = window.innerHeight - 100;
        ref.current.style.height = `${Math.min(availableHeight, 500)}px`;
      }
    };

    window.addEventListener("resize", adjustPopoverHeight);
    return () => window.removeEventListener("resize", adjustPopoverHeight); // Cleanup
  }, []);

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className="text-textPrimary">
        <Badge color="error" className="cursor-pointer" variant="dot" overlap="circular" invisible={notificationCount === 0}
          sx={{ "& .MuiBadge-dot": { top: 6, right: 5, boxShadow: "var(--mui-palette-background-paper) 0px 0px 0px 2px" } }}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <i className='tabler-bell' />
        </Badge>
      </IconButton>
      <Popper open={open} transition disablePortal placement="bottom-end" ref={ref} anchorEl={anchorRef.current}
        {...(isSmallScreen ? {
          className: "w-full !mb-3 max-w-[550px] w-[550px] z-50 bg-white",
          modifiers: [{ name: "preventOverflow", options: { padding: 8 } }], // Use themeConfig.layoutPadding if defined
        } : { className: "w-96 !mb-3 max-w-[550px] w-[550px] z-50 bg-white" })}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === "bottom-end" ? "right top" : "left top" }}>
            <Paper className={classnames("w-full h-full shadow-lg")}>
              <ClickAwayListener onClickAway={handleClose}>
                <div className="bs-full flex flex-col">
                  <div className="flex items-center justify-between  p-3.5 px-4 is-full gap-2">
                    <Typography variant="h6" className="flex-auto">
                      Notifications
                    </Typography>
                    {notificationCount > 0 && (
                      <Chip
                        size="small"
                        variant="tonal"
                        color="primary"
                        label={`${notificationCount} New`}
                      />
                    )}
                    <Tooltip
                      title={
                        readAll ? "Mark all as unread" : "Mark all as read"
                      }
                      placement={placement === "bottom-end" ? "left" : "right"}
                      slotProps={{
                        popper: {
                          sx: {
                            "& .MuiTooltip-tooltip": {
                              transformOrigin:
                                placement === "bottom-end"
                                  ? "right center !important"
                                  : "right center !important",
                            },
                          },
                        },
                      }}
                    >
                      {notificationsState.length > 0 ? (
                        <IconButton
                          size="small"
                          onClick={() => readAllNotifications()}
                          className="text-textPrimary"
                        >
                          {readAll ? <MarkAsUnread /> : <Drafts />}
                        </IconButton>
                      ) : (
                        <></>
                      )}
                    </Tooltip>
                  </div>
                  <ScrollWrapper hidden={hidden}  className="max-h-[100px] overflow-y-auto hide-scrollbar" >
                    {notificationsState.map((notification, index) => (
                      <div key={`${notification.id}-${index}`}  // Use a unique key (id from API)
                        className={classnames(
                          "flex py-3 px-4 gap-3 cursor-pointer hover:bg-actionHover group",
                          { "border-be": index !== notificationsState.length - 1 }
                        )}
                        // onClick={(e) => handleReadNotification(e, !notification.is_saw, index)}
                      >
                        {console.log(notification, 'dheen')}
                        {getAvatar({
                          avatarImage: notification.avatarImage,
                          avatarIcon: notification.avatarIcon,
                          avatarText: notification.avatarText,
                          title: notification.title,
                          avatarColor: notification.avatarColor,
                          avatarSkin: notification.avatarSkin,
                          avatarUser: notification.created_user,
                        })}
                        <div className="flex flex-col flex-auto">
                          <div className="flex flex-col">
                            <Typography variant="body2" className="font-medium mbe-1" color="text.primary" onClick={(e) => handleViewMessage(e, index)}>
                              {notification.subtitle}
                            </Typography>

                            {viewedMessage === index && (
                              <div>
                                <Typography variant="caption" color="text.primary">
                                  {notification.message}
                                </Typography>
                              </div>
                            )}</div>
                          {/* ... other Typography elements with notification.time etc. */}
                          <Typography variant="caption" color="text.disabled">
                            {notification.time}
                          </Typography>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant="dot"
                            color={notification.read === 0 ? "primary" : "secondary"}
                            onClick={(e) => handleReadNotification(e, !notification.read, index)}
                            className={classnames("mbs-1 mie-1", {
                              "invisible group-hover:visible": notification.read === 0,
                            })}
                          />

                        </div>
                      </div>
                    ))}
                  </ScrollWrapper>
                  {/* ... (rest of the JSX) */}
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
      {/* <Snackbar
              open={error.message !== ""}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              message={error.message}
              onClose={() => setError({ status: "", message: "" })}
              autoHideDuration={2500}
            >
              <Alert onClose={handleClose} severity={error.status}>
                {error.message}
              </Alert>
            </Snackbar> */}
    </>
  );
};

export default NotificationDropdown;
