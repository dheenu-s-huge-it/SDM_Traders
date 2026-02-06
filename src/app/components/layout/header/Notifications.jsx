import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
  ListItemButton,
  List,
  ListItemText,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { useRouter } from "next/navigation";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import NotificationsIcon from "@mui/icons-material/Notifications";
// import { axiosGet, axiosPost } from "@/lib/api";
import Cookies from "js-cookie";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const Profile = ({ onLogout, userName }) => {
  const ACCESS_TOKEN = Cookies.get("token");
  const router = useRouter();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [notification, setNotification] = useState([]);
  const [userType, setUserType] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [data, setData] = useState("");

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // useEffect(() => {
  //   fetchNotification();
  // }, [currentPage]);

  const handleOnclick = () => {
    router.push("/change-password");
  };

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const error = theme.palette.error.main;
  const errorlight = theme.palette.error.light;
  const success = theme.palette.success.main;
  const successlight = theme.palette.success.light;

  // const fetchNotification = async () => {
  //   axiosGet
  //     .get(
  //       `notification_get?has_limit=1&access_token=${ACCESS_TOKEN}&page=${currentPage}`
  //     )
  //     .then((response) => {
  //       setNotification(response.data.data);
  //       setUserType(response.data.user_type);
  //       setIsLastPage(response.data.total_pages);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const fetchData = async () => {
    axiosGet
      .get(`unread_notification_count_get?&access_token=${ACCESS_TOKEN}`)
      .then((response) => {
        // Handle the successful response here
        setData(response.data.unread_notification_count);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  // useEffect(() => {
  //   fetchNotification();
  //   fetchData();
  // }, []);

  // const clearAll = () => {
  //   const json = {
  //     access_token: ACCESS_TOKEN,
  //   };
  //   try {
  //     axiosPost
  //       .post(`clear_all_notification`, json)
  //       .then((response) => {})
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };

  return (
    <Box>
      <IconButton
        // size="large"
        aria-label="menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          // ...(typeof anchorEl2 === "object" && {
          //   borderRadius: "1px",
          // }),
          position: "relative",
        }}
        onClick={handleClick2}
      >
        <NotificationsIcon
          alt={"ProfileImg"}
          sx={{
            width: { xs: 25, md: 35 },
            height: { xs: 25, md: 35 },
            color: "white",
          }}
        />

        {data !== 0 && data != "" ? (
          <Box
            sx={{
              position: "absolute",
              top: { xs: 4, md: 6 },
              right: { xs: 8, md: 6 },
              background: "red",
              width: { xs: 14, md: 16 },
              height: { xs: 14, md: 16 },
              borderRadius: "50px",
            }}
          >
            <Typography
              sx={{ lineHeight: { xs: "0.9rem", md: "1rem" } }}
              // variant="caption"
              fontSize={{ xs: "7px", md: "8px" }}
              color="#fff"
              // p={"2px"}
            >
              {data}
            </Typography>
          </Box>
        ) : null}
      </IconButton>

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
            maxHeight: "380px",
            overflow: "auto",
            // p: 2,
            pb: 0,
            pt: 0,
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
            },
          },
        }}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
          boxShadow={"1"}
          position={"sticky"}
          top={0}
          //   px={}
          px={1}
          zIndex={"999999999999"}
          sx={{ background: "#fff" }}
        >
          <Typography variant="h5" color="initial" p={1}>
            Notification
          </Typography>
          {userType === 2 && (
            <div>
              {notification.length >= 1 ? (
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => clearAll()}
                >
                  Clear all
                  {/* <IconClearAll /> */}
                </Button>
              ) : null}
            </div>
          )}
        </Box>
        {notification?.length >= 1 ? (
          <div>
            {notification?.map((item, index) => (
              <Box
                py={0}
                pb={0}
                key={index}
                onClick={() =>
                  router.push(
                    `/certificate?cert=${item.ref_certificate_id}`
                  )
                }
              >
                <MenuItem sx={{ pb: 0 }}>
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      sx={{
                        fontSize: 12,
                        color:
                          item.notification_title === "Certificate Expiring soon"
                            ? "#FFAA33"
                            : item.notification_title === "Certificate Expired"
                            ? "#FF2400"
                            : item.notification_title === "Certificate Expiring very soon"
                            ? "#FFC000"
                            : null,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body1" sx={{ marginTop: "14px" }}>
                      {item.notification_title}
                    </Typography>
                    <Typography
                      // title={`${
                      //   item.certificate_details?.[0]?.certificate_type_value
                      // } of ${capitalize(
                      //   item.factory_details?.[0]?.factory_name
                      // )} is ${item.notification_message}`}
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        width: "220px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {/* {item.certificate_details?.[0]?.certificate_type_value} of{" "}
                      {capitalize(item.factory_details?.[0]?.factory_name)} is{" "}
                      {item.notification_message} */}
                    </Typography>
                  </ListItemText>
                  <Typography variant="body2" color="text.secondary">
                    {item.readable_created_date}
                  </Typography>
                </MenuItem>
              </Box>
            ))}{" "}
          </div>
        ) : (
          <Box pt={0} width={"100%"}>
            <MenuItem
              sx={{ height: 200, display: "flex", justifyContent: "center" }}
              width={"100%"}
            >
              <Typography
                variant="body1"
                sx={{ marginTop: "14px" }}
                textAlign={"center"}
                width={"100%"}
              >
                No Notification
              </Typography>
            </MenuItem>
          </Box>
        )}
        <Box
          display={"flex"}
          justifyContent={"end"}
          alignItems={"center"}
          width={"100%"}
          boxShadow={"1"}
          position={"sticky"}
          bottom={-1}
          px={1}
          zIndex={"999999999999"}
          sx={{ background: "#fff" }}
        >
          <Box width={100} p={1}>
            <IconButton
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              color="primary"
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNextPage}
              disabled={
                isLastPage !== undefined && currentPage + 1 === isLastPage
              }
              color="primary"
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
