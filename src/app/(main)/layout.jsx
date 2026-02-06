"use client";
import { styled, Container, Box, useTheme, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/page";
import { axiosPost, axiosGet } from "../../lib/api";

const MainWrapper = styled("div")((theme) => {
  return {
    minHeight: "100vh",
    backgroundColor: theme.theme?.palette?.customColors?.bodyBg,
    color: theme.theme?.palette?.text?.primary,
  };
});

const PageWrapper = styled("div")((theme) => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  zIndex: 1,
}));

export default function RootLayout({ children }) {
  const router = useRouter();
  const token = Cookies.get("token");
  const [isLoading, setIsLoading] = useState(true);

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

  console.log(serverUp, "serverUp");

  useEffect(() => {
    if (token) {
      axiosGet
        .get(`valid_token?user_token=${token}`)
        .then((response) => {
          if (response.data.action === "success") {
            setIsLoading(false);
            Cookies.set("token", response.data.access_token, { expires: 7 });
            Cookies.set("user_id", response.data.user_id, { expires: 7 });
          } else {
            setIsLoading(false);
            router.push("/login");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          router.push("/login");
        });
    } else {
      router.push("/login");
    }
  }, [token, router]);

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
          <h1 style={{ textAlign: "center", color: "red" }}>
            🚨 Server Down
          </h1>
          <p className="text-gray-600">Please contact the Market Office.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <Box sx={{ backgroundColor: "white" }}></Box>
      ) : (
        <MainWrapper className="mainwrapper">
          <Header userName={"userName"} />
          <PageWrapper className="page-wrapper">
            <Container
              sx={{
                paddingTop: "20px",
                maxWidth: "100% !important",
              }}
            >
              <Box sx={{ minHeight: "calc(97vh - 170px)" }}>{children}</Box>
              <Footer />
            </Container>
          </PageWrapper>
        </MainWrapper>
      )}
    </>
  );
}
