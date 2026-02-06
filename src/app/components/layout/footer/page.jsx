'use client';
import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
const Footer = () => {
  return (
    <Box sx={{ pt: 2, textAlign: "start" }}>
      <Typography>
        © {new Date().getFullYear()} All rights reserved by{" "}
        <Link href="/">
        SDM Flower Market. Designed by Dhayanandh Ravichandran.
        </Link>{" "}
      </Typography>
    </Box>
  );
};

export default Footer;
    