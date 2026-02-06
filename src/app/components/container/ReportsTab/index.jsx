import React, { useState } from "react";
import { Box, Paper, Typography, Button, useTheme } from "@mui/material";

const TabButton = ({ tab, tabValue, handleClick, isActive }) => {

  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark";
  const buttonStyle = {
    cursor: "pointer",
    backgroundColor: isActive
    ? "#039D55"
    : isDarkMode
    ? "#8F85F328"
    : "var(--mui-palette-primary-lightOpacity)",
    color: isActive
    ? "white"
    : isDarkMode
    ? "#E1DEF3E6"
    : "black",
    border: "none",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "14px",
    borderRadius: "10px 10px 0px 0px",
  };

  return (
    <Button
      style={buttonStyle}
      sx={{ px: 2 }}
      size="small"
      onClick={() => handleClick(tab.value)}
    >
      <Typography
        className="nunito_font_width"
        fontWeight={"bold"}
        fontSize={"14px"}
        sx={{ color: isActive ? "white" : isDarkMode ? "#E1DEF3E6" : "black",}}
        // style={
        //   isActive
        //     ? { color: "white", padding: "2px 20px" }
        //     : { color: "black", padding: "2px 20px" }
        // }
      >
        {" "}
        {tab?.name}
      </Typography>
    </Button>
  );
};

const TabContent = ({ tab }) => {
  return (
    <Paper sx={{ p: 2, border: "1px solid #039D55 " }}>
      <Box className="nunito_font_width" sx={{ fontSize: "12px" }}>
        {tab?.content}
      </Box>
    </Paper>
  );
};

const Tabs = ({ tabs, tabValue, setTabValue }) => {
  const handleClickTab = (value) => {
    setTabValue(value);
  };

  const currentTab = tabs.find((tab) => tab?.value === tabValue);

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", gap: "5px" }}>
        {tabs.map((tab) => (
          <TabButton
            key={tab?.value}
            tab={tab}
            tabValue={tabValue}
            handleClick={handleClickTab}
            isActive={tabValue === tab?.value}
          />
        ))}
      </Box>

      <TabContent tab={currentTab} />
    </Box>
  );
};

export default Tabs;
