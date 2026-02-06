"use client";

// React Imports
import { useState, useEffect } from "react";

// Next Imports
import Link from "next/link";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

// Component Imports
import Logo from "../shared/Logo";
import CustomTextField from "../../../@core/components/mui/TextField";

// Util Imports
import { getLocalizedUrl } from "../../../utils/i18n";

// Styled Component Imports
import AuthIllustrationWrapper from "./AuthIllustrationWrapper";

import { useRouter, useSearchParams } from "next/navigation";
import { axiosPost, axiosGet } from "../../../lib/api";

import Cookies from "js-cookie";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ResetPassword = () => {

  const token = Cookies.get("token");

  const router = useRouter();
  const searchParams = useSearchParams();

  const user_id = searchParams.get("user_id");
  const unique_id = searchParams.get("unique_id");

  const handleCheck = () => {
    const jsonStructure = {
      user_id: user_id,
      generated_id: unique_id,
    };
    try {
      axiosPost
        .post("verify_generate_id", jsonStructure)
        .then((response) => {
          if (response.data.action === "error") {
            setError({ status: "error", message: "Your token has expired." });
            router.push("/forgot_password");
          }
        })
        .catch((error) => {
          console.error("POST Error:", error);
        });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    handleCheck();
  }, []);
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);

  const [showPassword, setshowPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Hooks
  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setIsConfirmPasswordShown((show) => !show);

  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const jsonStructure = {
      new_password: showPassword,
      confirm_password: confirmPassword,
      user_id: user_id,
    };
    try {
      axiosPost
        .post("web_update_password", jsonStructure)
        .then((response) => {
          if (response.data.action === "success") {
            router.push("/");
            setIsLoading(false);
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

  if (serverUp === false && isOnline === true ) {
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
    <AuthIllustrationWrapper>
      <Card className="flex flex-col sm:is-[450px]">
        <CardContent className="sm:!p-12">
          <Link
            href={getLocalizedUrl("/", "en")}
            className="flex justify-center mb-6"
          >
            <Logo />
          </Link>
          <div className="flex flex-col gap-1 mb-6">
            <Typography variant="h4">Reset Password</Typography>
            <Typography>
              Your new password must be different from previously used passwords
            </Typography>
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
              label="New Password"
              placeholder="············"
              type={isPasswordShown ? "text" : "password"}
              value={showPassword}
              onChange={(event) => setshowPassword(event.target.value)}
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
                            isPasswordShown ? "tabler-eye-off" : "tabler-eye"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <CustomTextField
              fullWidth
              label="Confirm Password"
              placeholder="············"
              type={isConfirmPasswordShown ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setconfirmPassword(event.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <i
                          className={
                            isConfirmPasswordShown
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
            <Button
              fullWidth
              variant="contained"
              type="submit"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <i className="tabler-loader-2 animate-spin" />
              ) : (
                "Set New Password"
              )}
            </Button>
            <Typography
              className="flex justify-center items-center"
              color="primary.main"
            >
              <Link
                href={getLocalizedUrl("/", "en")}
                className="flex items-center gap-1.5"
              >
                <i className="text-xl tabler-chevron-left" />
                <span>Back to login</span>
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
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
  );
};

export default ResetPassword;
