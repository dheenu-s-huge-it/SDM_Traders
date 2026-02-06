"use client";

// React Imports
import { useState, useEffect, useRef } from "react";

// Next Imports
import { axiosPost, axiosGet } from "../../../lib/api";
import Link from "next/link";
// MUI Imports
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";

// Component Imports
import Logo from "../shared/Logo";
import CustomTextField from "../../../@core/components/mui/TextField";

import ContactPopper from "../contact/index";

// Util Imports

import Cookies from "js-cookie";

import { useRouter } from "next/navigation";
// Styled Component Imports
import AuthIllustrationWrapper from "./AuthIllustrationWrapper";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material";
import { useSettings } from "../../../@core/hooks/useSettings";

const Login = () => {
  const router = useRouter();

  const [username, setUserName] = useState("");
  const [password, setpassword] = useState("");
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (storedEmail && storedPassword) {
      setUserName(storedEmail);
      setpassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const token = Cookies.get("token");

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingPage, setisLoadingPage] = useState(true);

  useEffect(() => {
    axiosGet
      .get(`valid_token?user_token=${token}`)
      .then((response) => {
        if (response.data.action == "success") {
          Cookies.set("token", response.data.access_token, {
            expires: 7, // Set the cookie expiration (7 days in this example)
          });
          // Cookies.set("user_id", response.data.user_id, {
          //   expires: 7, // Set the cookie expiration (7 days in this example)user_login
          // });
          router.push("/sales/create");
        } else {
          setisLoadingPage(false);
          router.push("/login");
        }
      })
      .catch((error) => {
        setisLoadingPage(false);
        console.error("Error:", error);
      });
  }, []);

  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };
  const theme = useTheme();

  const themeSetter = theme?.palette?.mode || "light";

  const { updateSettings } = useSettings();

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const jsonStructure = {
      show_password: password,
      user_name: username,
    };

    try {
      axiosPost
        .post("user_login", jsonStructure)
        .then((response) => {
          if (response.data.action === "success") {
            updateSettings({ mode: themeSetter });
            Cookies.set("token", response.data.access_token, {
              expires: 7,
            });
            
            Cookies.set("user_id", response.data.user_id, {
              expires: 7,
            });


            Cookies.set(
              "user_data",
              JSON.stringify(response.data.user_data[0]),
              { expires: 7 }
            );
            if (rememberMe) {
              localStorage.setItem("email", username);
              localStorage.setItem("password", password);
            } else {
              localStorage.removeItem("email");
              localStorage.removeItem("password");
            }
            setIsLoading(false);
            router.push("/sales/create");
            setError({ status: "success", message: response.data.message });
          } else {
            setIsLoading(false);
            setError({ status: "error", message: response.data.message });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("POST Error:", error);
        });
    } catch (error) {
      setIsLoading(false);
      console.error("An error occurred:", error);
    }
  };

  const [openContact, setOpenContact] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpenContact((prev) => !prev);
  };

  // Hooks

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);

  const [serverUp, setServerUp] = useState(true);

  useEffect(() => {
    if (token) {
      const checkServer = async () => {
        try {
          axiosGet
            .get(`report/offline/check`)
            .then((response) => {
              setServerUp(true);
            })
            .catch((error) => {
              setServerUp(false);
            });
        } catch (error) {
          setServerUp(false);
        }
      };
      checkServer();
      const interval = setInterval(checkServer, 60000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);
    handleOnlineStatus();
    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  if (isOnline === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
        <h1 className="text-3xl font-bold">You Are Offline</h1>
        <p className="text-gray-600">
          Check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (serverUp === false && isOnline === true) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
        <div style={{ padding: "50px" }}>
          <h1 style={{ textAlign: "center", color: "red" }}>🚨 Server Down</h1>
          <p className="text-gray-600">Please contact the Market Office.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoadingPage ? (
        <Box sx={{ backgroundColor: "white" }}></Box>
      ) : (
        <AuthIllustrationWrapper>
          <Card className="flex flex-col items-center sm:is-[450px]">
            <CardContent className="sm:!p-12" sx={{ width: "100%" }}>
              {/* <Link href={"/"} className="flex justify-center mb-6"> */}
                <Logo />
              {/* </Link> */}
              <div className="flex flex-col gap-1 mb-6">
                <Typography variant="h4">{`Welcome to SDM !`}</Typography>
                <Typography>Please sign-in to your account </Typography>
              </div>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSignIn}
                className="flex flex-col gap-6"
              >
                <CustomTextField
                  autoFocus
                  fullWidth
                  label="User Name"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <CustomTextField
                  fullWidth
                  label="Password"
                  placeholder="············"
                  id="outlined-adornment-password"
                  type={isPasswordShown ? "text" : "password"}
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={handleClickShowPassword}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <i
                              className={
                                isPasswordShown
                                  ? "tabler-eye-off"
                                  : "tabler-eye"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <div className="flex justify-between items-center gap-x-3 gap-y-1 flex-wrap">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    }
                    label="Remember me"
                  />
                  <Typography
                    className="text-end"
                    color="primary.main"
                    component={Link}
                    href={"forgot_password"}
                  >
                    Forgot password?
                  </Typography>
                </div>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  onSubmit={handleSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <i className="tabler-loader-2 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
                {/* <div className="flex justify-center items-center flex-wrap gap-2">
                  <Typography>Contact Market Office ?</Typography>
                  <Typography
                    ref={anchorRef}
                    // component={Button}
                    onClick={handleToggle}
                    color="primary.main"
                    sx={{ py: 1, cursor: "pointer" }}
                  >
                    Click here
                  </Typography>
                </div> */}
              </form>
            </CardContent>
          </Card>

          <ContactPopper
            open={openContact}
            setOpen={setOpenContact}
            anchorRef={anchorRef}
          />

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
            <Alert onClose={handleClose} severity={error.status}>
              {error.message}
            </Alert>
          </Snackbar>
        </AuthIllustrationWrapper>
      )}
    </>
  );
};

export default Login;
