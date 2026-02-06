"use client";
import React, { useState, useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import {
  FormControl,
  Menu,
  MenuItem,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  Pagination,
  Select,
  Collapse,
  Stack,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BaseCard from "../shared/DashboardCard";
import SearchFilter from "../buttons/SearchFilter";
import Search from "../layout/header/Search";
import Checkbox from "@mui/material/Checkbox";
import { Toolbar, Tooltip } from "@mui/material";
import SvgSorting from "../common-components/SvgSorting";
import { useMediaQuery } from "@mui/material";

const MasterTable = ({
  fieldChange,
  pageCount,
  pageNumber,
  limitEnd,
  setLimitEnd,
  onRefresh,
  onSearchButtonClick,
  onAddClick,
  tableHead,
  tableRow,
  onPageChange,
  handleClose2,
  anchorEl2,
  heading,
  setSearchValue,
  searchInput,
  searchBox,
  actionPrivilege,
  MenuComponent,
  handleOnActionClick,
  handleSearchFinal,
  ActionComponent,
  onDelete,
  isLoading,
  setSelectedItems,
  selectedItems,
  selectAll,
  setSelectAll,
  searchFilterData,
  setSuggestions,
  suggestions,
  dataCount,
  orderType,
}) => {
  // Handle "Select All" checkbox change
  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    // Update selectedItems state for all rows
    const updatedSelection = {};
    if (isChecked) {
      tableRow.forEach((row) => {
        updatedSelection[row.id] = true;
      });
    }
    setSelectedItems(updatedSelection);
  };

  const handleRowCheckboxChange = (event, rowId) => {
    const isChecked = event.target.checked;

    setSelectedItems((prevSelected) => {
      const updated = { ...prevSelected };
      if (isChecked) {
        updated[rowId] = true;
      } else {
        delete updated[rowId];
      }
      const allRowsSelected = Object.keys(updated).length === tableRow.length;
      setSelectAll(allRowsSelected);

      return updated;
    });
  };

  const onLimitChange = (event) => {
    setLimitEnd(event.target.value);
  };

  const handleSearchButtonClick = (input) => {
    onSearchButtonClick(input);
  };

  const [isFieldClicked, setIsFieldClicked] = useState(false);
  const [clickedField, setClickedField] = useState(null);

  const handleFiledChange = (field) => {

    if (field) {
      fieldChange(field, isFieldClicked ? "ASC" : "DESC");
    }
    setIsFieldClicked(!isFieldClicked);
    setClickedField(field);
  };

  const color1 = orderType === "DESC" ? "#5B5867" : "#CFCACA";
  const color2 = orderType === "ASC" ? "#5B5867" : "#CFCACA";

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const getMargin = () => {
    if (isSmallScreen) return "10px";
    if (isMediumScreen) return "8px";
    if (isLargeScreen) return "0px";
  };

  return (
    <BaseCard style={{ padding: "0px !important", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={700} my={0.5}>
          {heading} Master
        </Typography>
        <Box display={{ xs: "flex", md: "none" }}>
          <IconButton
            size="small"
            variant="contained"
            sx={{
              fontSize: "16px",
              fontWeight: "300",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              padding: "8px",
              bgcolor: "#058148",
              color: "#fafafa",
            }}
            aria-label="add"
            onClick={onAddClick}
            title={`Create New ${heading}`}
          >
            <i className="tabler-plus " />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <FormControl
          sx={{ m: 1 }}
          size="small"
        // className="font_sytles2_css_list"
        >
          <Select
            value={limitEnd}
            onChange={onLimitChange}
            sx={{ paddingRight: "9px", height: "35px", marginTop: "7px" }}
            size="small"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={250}>250</MenuItem>
            <MenuItem value={500}>500</MenuItem>
          </Select>
        </FormControl>
        <Box>
          <Box
            display={{ xs: "none", md: "flex" }}
            sx={{
              flexDirection: "row",

              alignItems: "center",
              gap: 1,
              ...(searchBox && {
                width: "100%",
              }),
              gap: 2,
            }}
          >
            <Box sx={{ transform: "translateY(-5px)" }}>
              <SearchFilter
                handleSearchButtonClick={handleSearchButtonClick}
                setSearchInput={setSearchValue}
                searchInput={searchInput}
                searchFilterData={searchFilterData}
                suggestions={suggestions}
                handleSearchFinal={handleSearchFinal}
              />
            </Box>

            <Box>
              {" "}
              <IconButton
                onClick={onRefresh}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px",
                }}
              >
                <RefreshIcon
                  titleAccess="Refresh All Filters"
                  sx={{ fontSize: "24px" }}
                />
              </IconButton>
            </Box>

            <Button
              size="small"
              variant="contained"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#039D55",
                color: "#fafafa",
              }}
              aria-label="add"
              onClick={onAddClick}
              title={`Create New ${heading}`}
            >
              <i className="tabler-plus text-base" />

              <Typography variant="button" color="#fafafa">
                {" "}
                Add New {heading}
              </Typography>
            </Button>
          </Box>

          <Box
            display={{ xs: "flex", md: "none" }}
            sx={{
              // display: ,
              alignItems: "center",
              ...(searchBox &&
              {
                // width: "100%",
              }),
            }}
          >
            <Box
              display={"flex"}
              sx={{ gap: 2, alignItems: "center", justifyContent: "center" }}
            >
              <IconButton
                onClick={onRefresh}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px",
                  marginTop: "8px",
                }}
              >
                <RefreshIcon
                  titleAccess="Refresh All Filters"
                // sx={{ fontSize: "24px" }}
                />
              </IconButton>
              <SearchFilter
                handleSearchButtonClick={handleSearchButtonClick}
                setSearchInput={setSearchValue}
                searchInput={searchInput}
                handleSearchFinal={handleSearchFinal}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Stack sx={{ height: "50vh" }}>
        <TableContainer
          sx={{
            mt: 2,
            width: "100%",

            maxHeight: 540,
          }}
        >
          <Table
            size="small"
            stickyHeader
            aria-label="simple table"
            className="custom_scroll"
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            <TableHead>
              <TableRow>
                {tableHead?.map((headCell, index) => (
                  <TableCell
                    align="left"
                    key={headCell.id}
                    onClick={() => handleFiledChange(headCell.value)}
                    sx={{ p: 2, px: 4 }}
                  >
                    <Typography
                      color="textSecondary"
                      fontWeight="semibold"
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {headCell.label}

                      {headCell.fieldName ? (
                        clickedField === headCell.fieldName ? (
                          <SvgSorting color1={color1} color2={color2} />
                        ) : (
                          <img
                            src="/images/icons/sort_greyyy.svg"
                            alt="images"
                            className="text-xs"
                          />
                        )
                      ) : null}
                    </Typography>
                  </TableCell>
                ))}

                {actionPrivilege && (
                  <TableCell align="center">
                    <Typography
                      color="textSecondary"
                      fontWeight={"semibold"}
                      variant="h6"
                    >
                      Action
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={tableHead.length + 1}
                    align="center"
                    sx={{ borderBottom: "none" }}
                  >
                    <Box display="flex" justifyContent="center" py={3}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : tableRow?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tableHead.length + 1} align="center">
                    <Typography
                      color="textSecondary"
                      fontWeight={"semibold"}
                      variant="h6"
                    >
                      No data Found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tableRow.slice(0, limitEnd)?.map((row, index) => (
                  <TableRow hover key={index}>
                    {row?.data?.map((cell, index) => (
                      <TableCell key={index} sx={{ p: 2, px: 4 }}>
                        <Box display="flex" alignItems="center">
                          {cell.td}
                        </Box>
                      </TableCell>
                    ))}
                    {actionPrivilege && (
                      <TableCell align="center" sx={{ p: 1 }}>
                        <IconButton
                          onClick={(event) => handleOnActionClick(event, row)}
                          title="Click to Action"
                        >
                          <MoreVertIcon></MoreVertIcon>
                        </IconButton>
                        <Menu
                          id="msgs-menu"
                          anchorEl={anchorEl2}
                          keepMounted
                          open={Boolean(anchorEl2)}
                          onClose={handleClose2}
                          anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                          }}
                          transformOrigin={{
                            horizontal: "right",
                            vertical: "top",
                          }}
                          sx={{
                            "& .MuiMenu-paper": {
                              minWidth: "100px",
                              boxShadow:
                                "rgba(145 158 171 / 30%) 0px 0px 2px 0px !important",
                            },
                          }}
                        >
                          {MenuComponent()}
                        </Menu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <Stack sx={{ display: "flex" }}>
        <Stack className="flex items-end md:items-start">
          <Typography
            sx={{ position: "absolute", transform: "translateY(11px)" }}
            className="text-xs md:text-base mt-[29px] md:mt-[0px]"
          >
            Showing {Number(limitEnd) * (Number(pageNumber) - 1) + 1} to{" "}
            {Number(limitEnd) * Number(pageNumber) > dataCount
              ? dataCount
              : Number(limitEnd) * Number(pageNumber)}{" "}
            out of {dataCount} entries
          </Typography>
        </Stack>
        <Stack sx={{ display: "flex" }} alignItems={"end"} mt={2}>
          <Pagination
            sx={{ justifyContent: "center" }}
            count={pageCount}
            onChange={onPageChange}
            variant="outlined"
            shape="rounded"
            page={pageNumber}
            color="primary"
            showFirstButton
            showLastButton
            size="small"
          />
        </Stack>
      </Stack>
    </BaseCard>
  );
};

export default MasterTable;
