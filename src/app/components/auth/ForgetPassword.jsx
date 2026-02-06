"use client";

// Next Imports
import Link from "next/link";
import { useParams } from "next/navigation";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// Component Imports
import DirectionalIcon from "../DirectionalIcon";
import Logo from "../shared/Logo";
import CustomTextField from "../../../@core/components/mui/TextField";

// Util Imports

// Styled Component Imports
import AuthIllustrationWrapper from "./AuthIllustrationWrapper";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// React Imports
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { axiosPost, axiosGet } from "../../../lib/api";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {

  const token = Cookies.get("token");

  const router = useRouter();
  const [email, setemail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      email: email,
      reset_link: "https://sdm.smsvts.in/",
      // reset_link: "http://localhost:3000/",
    };
    try {
      axiosPost
        .post("send_email", jsonStructure)
        .then((response) => {
          if (response.data.action === "success") {
            setIsLoading(false);
            setError({ status: "success", message: response.data.message });
            setTimeout(() => {
              router.push("/");
            }, 2000);
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
    <AuthIllustrationWrapper>
      <Card className="flex flex-col sm:is-[450px]">
        <CardContent className="sm:!p-12">
          <Link href={"/"} className="flex justify-center mb-6">
            <Logo />
          </Link>
          <div className="flex flex-col gap-1 mb-6">
            <Typography variant="h4">Forgot Password</Typography>
            <Typography>
              Enter your email and we&#39;ll send you instructions to reset your
              password
            </Typography>
          </div>
          <form noValidate autoComplete="off" className="flex flex-col gap-6">
            <CustomTextField
              autoFocus
              fullWidth
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setemail(event.target.value)}
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
                "Send Reset Link"
              )}
            </Button>
            <Typography
              className="flex justify-center items-center"
              color="primary.main"
            >
              <Link href={"/"} className="flex items-center gap-1.5">
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

export default ForgotPassword;
