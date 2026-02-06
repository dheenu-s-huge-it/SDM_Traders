"use client";
import {
  Box,
  Typography,
  Fade,
  Paper,
  Divider,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 2,
          height: "100%",
          textAlign: "center",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            m:4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "background.paper",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                color="primary"
              >
                Welcome Back!
              </Typography>
            </Paper>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
