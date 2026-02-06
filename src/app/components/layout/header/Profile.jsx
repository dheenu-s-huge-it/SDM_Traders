import React, { useEffect, useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ChangePassword from "../../common-components/ChangePassword";
import { axiosPost } from "../../../../lib/api";
import Cookies from "js-cookie";

const Profile = ({ onLogout, userName }) => {
  const router = useRouter();

  const [anchorEl2, setAnchorEl2] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleOnclick = () => {
    setOpen(true);
  };

  const handleRoutePrivacy = () => {
    router.push("/privacy-policy");
  };

  const handleOnClose = () => {
    setOpen(false);
  };
  const [errorMessage, setErrorMessage] = useState({ status: "", message: "" });

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const error = theme.palette.error.main;
  const errorlight = theme.palette.error.light;
  const success = theme.palette.success.main;
  const successlight = theme.palette.success.light;
  const ACCESS_TOKEN = Cookies.get("token");
  const userData = Cookies.get("user_data")
    ? JSON.parse(Cookies.get("user_data"))
    : {};


  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [errorsMessage, seterrorsMessage] = useState([]);
  const handleSignIn = (e) => {
    e.preventDefault();
    const jsonStructure = {
      access_token: ACCESS_TOKEN,
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    try {
      axiosPost
        .post("password_change", jsonStructure)
        .then((response) => {
          if (response.data.action === "success") {
            handleClose2();
            handleOnClose();
            setConfirmPassword("");
            setCurrentPassword("");
            setNewPassword("");
            router.push("/login");
            Cookies.remove("token");
            Cookies.remove("user_id");
            localStorage.removeItem("userID");
            localStorage.removeItem("userId");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userData");
            // router.push("/login");
            setErrorMessage({
              status: "success",
              message: response.data.message,
            });
          } else if (response.data.action === "error_group") {
            seterrorsMessage(response.data.message);
            setConfirmPassword("");
            setCurrentPassword("");
            setNewPassword("");
          } else {
            setErrorMessage({
              status: "error",
              message: response.data.message,
            });
          }
        })
        .catch((errorMessage) => {
          console.error("POST Error:", errorMessage);
        });
    } catch (errorMessage) {
      console.error("An error occurred:", errorMessage);
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            borderRadius: "9px",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          sx={{
            textTransform: "uppercase",
            fontSize: "11px",
            fontWeight: "600",
          }}
        >
          {userName.substring(0, 2)}{" "}
        </Avatar>

        {/*   <Avatar
          // src={"/images/users/user2.jpg"}
          alt={"ProfileImg"}
          sx={{
            width: 35,
            height: 35,
          }}
        /> */}
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
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
            width: "260px",
            p: 2,
            pb: 2,
            pt: 0,
          },
        }}
      >
        <Box p={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            {userData?.first_name}
          </Typography>
          <Typography variant="body2">{userData?.email}</Typography>
        </Box>

        <Divider />
        <Box pt={0}>
          <List>
            <ListItemButton onClick={handleOnclick}>
              <ListItemText primary="Change Password" />
            </ListItemButton>
            {/* <Divider />
            <ListItemButton onClick={handleRoutePrivacy}>
              <ListItemText primary="Privacy Policy" />
            </ListItemButton> */}
          </List>
        </Box>
        <Divider />
        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={onLogout}
          >
            Logout
          </Button>
        </Box>
      </Menu>
      <ChangePassword
        open={open}
        onClose={handleOnClose}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        handleSignIn={handleSignIn}
        seterrorsMessage={seterrorsMessage}
        errorsMessage={errorsMessage}
      />
      <Snackbar
        open={errorMessage.message !== ""}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        message={errorMessage.message}
        onClose={() => setErrorMessage({ status: "", message: "" })}
        autoHideDuration={2500}
      >
        <Alert severity={errorMessage.status}>{errorMessage.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
