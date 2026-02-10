"use client";
import React, { useState, useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
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
  Badge,
  Collapse,
  SwipeableDrawer,
  Stack,
  onDelete,
  CircularProgress,
  Grid,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BaseCard from "../shared/DashboardCard";
import SearchFilterReport from "../buttons/SearchFilterReport";
import FilterButton from "../buttons/FilterButton";
import Checkbox from "@mui/material/Checkbox";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Toolbar, Tooltip } from "@mui/material";
import SvgSorting from "../common-components/SvgSorting";
import DateFilter from "../buttons/DateFilter";
import QuantityFilter from "../buttons/QuantityFilter";
const ReportTable = ({
  FilterComponent,
  pageCount,
  pageNumber,
  limitEnd,
  setLimitEnd,
  filterProps,
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
  filterData,
  ActionComponent,
  handleOnActionClick,
  HandleExportExcel,
  HandleExportPdf,
  excelLoading,
  pdfLoading,
  isLoading,
  setSelectedItems,
  selectedItems,
  selectAll,
  setSelectAll,
  searchFilterData,
  setSuggestions,
  suggestions,
  handleSearchFinal,
  fieldChange,
  HandleExportExcelManual,
  HandleExportPdfManual,
  dataCount,
  orderType,
  createHeading,
  dateTitle,
  onCreatedDateChange,
  handlePrintMulitple,
  handlePrint,
  minQuantity,
  maxQuantity,
  minPrice,
  maxPrice,
  setMinQuantity,
  setMaxQuantity,
  setMinPrice,
  setMaxPrice,
  handleSearch,
  setPageNumber,
  global_print,
  quantity_filter,
  total_status,
  total_heading,
  total_amount,

  showTotals,
  totalData,
}) => {
  const [filtersList, setFiltersList] = useState(false);
  const [filteropen, setFilterOpen] = useState(false);
  const [exportList, setExportList] = useState(false);

  const theme_org = useTheme();

  const [excelData, setexcelData] = useState([]);
  // Handle "Select All" checkbox change
  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      const updatedSelection = {};
      const excelDATAJSON = [];
      tableRow.forEach((row) => {
        updatedSelection[row.id] = true;
        if (row.json && row.json.length > 0) {
          excelDATAJSON.push(row.json[0]);
        }
      });
      setSelectedItems(updatedSelection);
      setexcelData(excelDATAJSON);
    } else {
      setSelectedItems({});
      setexcelData([]);
    }
  };

  const handleRowCheckboxChange = (event, rowId, rowData) => {
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
    setexcelData((prevExcelData) => {
      if (isChecked) {
        return [...prevExcelData, rowData?.json[0]];
      } else {
        return prevExcelData.filter((data) => data.data_uniq_id !== rowId);
      }
    });
  };

  const onLimitChange = (event) => {
    setPageNumber(1);
    setLimitEnd(event.target.value);
  };

  const handleSearchButtonClick = (input) => {
    const nickName = input.split("-")[0];
    onSearchButtonClick(nickName);
  };

  const [isFieldClicked, setIsFieldClicked] = useState(false);
  const [clickedField, setClickedField] = useState(null);

  const handlefilterBadgeVisible = () => {
    if (filterProps) {
      return true;
    } else {
      return false;
    }
  };

  const HandleChangeFilter = () => {
    setFiltersList(!filtersList);
    setExportList(false);
  };

  const HandleClickExport = () => {
    setExportList(!exportList);
    setFiltersList(false);
  };

  const toggleFilterDrawer = (newOpen) => () => {
    setFilterOpen(newOpen);
  };

  const theme = createTheme({
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            padding: "unset",
          },
        },
      },
    },
  });

  const handleFiledChange = (field) => {
    if (field) {
      fieldChange(field, isFieldClicked ? "ASC" : "DESC");
    }
    setIsFieldClicked(!isFieldClicked);
    setClickedField(field);
  };

  const handleExport = () => {
    if (Object.keys(selectedItems).length > 0) {
      HandleExportExcelManual(excelData);
    } else {
      HandleExportExcel();
    }
  };

  const handlePdfExport = () => {
    if (Object.keys(selectedItems).length > 0) {
      HandleExportPdfManual(excelData);
    } else {
      HandleExportPdf();
    }
  };

  const handlePrintAll = () => {
    handlePrintMulitple();
  };

  const color1 = orderType === "DESC" ? "#5B5867" : "#CFCACA";
  const color2 = orderType === "ASC" ? "#5B5867" : "#CFCACA";
  const theme_t = useTheme();
  const isDarkMode = theme_t.palette.mode === "dark";



  return (
    <BaseCard sx={{ padding: "0px !important", minWidth: "100vw !important" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={700} my={0.5}>
          {heading}
        </Typography>
        <Box
          display={{ xs: "flex", md: "none" }}
          flexDirection={"row"}
          gap={2}
          mb={2}
        >
          <Box display={"flex"} gap={2}>
            <IconButton
              variant="contained"
              size="small"
              sx={{
                fontSize: "16px",
                fontWeight: "300",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                padding: "8px",
                bgcolor: "#80839029",
                color: exportList ? "#039D55" : "#808390",
              }}
              onClick={HandleClickExport}
              title={`Export ${heading}`}
            >
              <i className="tabler-upload " />
            </IconButton>
            <IconButton
              size="small"
              variant="contained"
              sx={{
                fontSize: "16px",
                fontWeight: "300",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                padding: "8px",
                bgcolor: "#039D55",
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
          sx={{ mr: 1 }}
          size="small"
          className="font_sytles2_css_list"
        >
          <Select
            value={limitEnd}
            onChange={onLimitChange}
            sx={{ paddingRight: "9px", height: "36px" }}
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
              <SearchFilterReport
                handleSearchButtonClick={handleSearchButtonClick}
                setSearchInput={setSearchValue}
                searchInput={searchInput}
                searchFilterData={searchFilterData}
                suggestions={suggestions}
                handleSearchFinal={handleSearchFinal}
              />
            </Box>
            <DateFilter
              title={dateTitle}
              onDateRangeChange={onCreatedDateChange}
            ></DateFilter>
            {/* {quantity_filter && (
              <QuantityFilter
                minQuantity={minQuantity}
                maxQuantity={maxQuantity}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMaxQuantity={setMaxQuantity}
                setMinQuantity={setMinQuantity}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                handleSearch={handleSearch}
              />
            )} */}

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
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Badge
                color="secondary"
                variant="dot"
                invisible={!handlefilterBadgeVisible()}
              >
                <FilterButton
                  HandleChangeFilter={HandleChangeFilter}
                  filtersList={filtersList}
                />
              </Badge>
            </Box>

            <Button
              variant="contained"
              size="small"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: isDarkMode ? "#8F85F328" : "#80839029", // Adjust background for dark mode
                color: exportList
                  ? isDarkMode
                    ? "#8F85F3"
                    : "#039D55"
                  : "#808390",
              }}
              onClick={HandleClickExport}
              title={`Export ${heading}`}
            >
              <i className="tabler-upload text-base" />
              <Typography
                variant="button"
                sx={{
                  color: exportList
                    ? isDarkMode
                      ? "#8F85F3"
                      : "#039D55"
                    : "#808390",
                  fontWeight: 700,
                }}
              >
                Export
              </Typography>
            </Button>
          </Box>

          <Box
            display={{ xs: "flex", md: "none" }}
            sx={{
              // display: ,
              gap: 2,
              flexDirection: "column",
              justifyContent: "center",
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
                }}
              >
                <RefreshIcon titleAccess="Refresh All Filters" />
              </IconButton>
              <Badge
                color="secondary"
                variant="dot"
                invisible={!handlefilterBadgeVisible()}
              >
                <FilterButton
                  HandleChangeFilter={HandleChangeFilter}
                  filtersList={filtersList}
                />
              </Badge>
              <Box sx={{ transform: "translateY(-5px)" }}>
                <SearchFilterReport
                  handleSearchButtonClick={onSearchButtonClick}
                  setSearchInput={setSearchValue}
                  searchInput={searchInput}
                  searchFilterData={searchFilterData}
                  suggestions={suggestions}
                  handleSearchFinal={handleSearchFinal}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Stack>
        <Collapse in={filtersList} sx={{ width: 1 }}>
          <Box>{FilterComponent()}</Box>
        </Collapse>

        <Collapse in={exportList} sx={{ width: 1 }}>
          <Grid
            container
            spacing={2}
            alignContent={"flex-end"}
            justifyContent={"end"}
            width={1}
          >
            <Grid item xs={6} sm={1}>
              <Button
                variant="contained"
                size="small"
                title={`Export PDF ${heading}`}
                onClick={handlePdfExport}
                sx={{ width: "100%" }}
              >
                <div className="flex gap-2 items-center">
                  <i className="tabler-file-type-pdf text-base" />
                  <Typography variant="button" color="#fafafa">
                    {" "}
                    PDF
                  </Typography>
                </div>
              </Button>
            </Grid>

            <Grid item xs={6} sm={1}>
              <Button
                variant="contained"
                size="small"
                title={`Export PDF ${heading}`}
                onClick={handleExport}
                sx={{ boxShadow: 3, width: "100%" }}
              >
                <div className="flex gap-2 items-center">
                  <i className="tabler-file-type-xls text-base" />

                  <Typography variant="button" color="#fafafa">
                    Excel
                  </Typography>
                </div>
              </Button>
            </Grid>
            {global_print && (
              <Grid item xs={6} sm={1}>
                <Button
                  variant="contained"
                  size="small"
                  title={`Print`}
                  onClick={handlePrintAll}
                  sx={{ boxShadow: 3, width: "100%" }}
                >
                  <div className="flex gap-2 items-center">
                    <i className="tabler-printer text-base" />

                    <Typography variant="button" color="#fafafa">
                      Print
                    </Typography>
                  </div>
                </Button>
              </Grid>
            )}
          </Grid>
        </Collapse>
      </Stack>

      <Stack sx={{ height: "46vh" }}>
        <TableContainer
          sx={{
            mt: 2,
            overflowX: "auto",
            overflowY: "auto",
            "&::-webkit-scrollbar:horizontal": {
              display: "block",
            },
            "&::-webkit-scrollbar:vertical": {
              display: "none",
            },
          }}
          size="small"
        >
          <Table
            size="small"
            stickyHeader
            aria-label="simple table"
            className="custom_scroll"
            sx={{
              whiteSpace: "nowrap",
              height: "100%",
            }}
          >
            <TableHead size="small">
              <TableRow size="small">
                <TableCell>
                  <Checkbox
                    checked={selectAll}
                    indeterminate={
                      Object.keys(selectedItems || {}).length > 0 && !selectAll
                    }
                    onChange={handleSelectAllChange}
                  />
                </TableCell>
                {tableHead?.map((headCell) => {
                  return (
                    filterData?.some((res) => res.label === headCell.label) && (
                      <TableCell
                        align="left"
                        key={headCell.id}
                        onClick={() => handleFiledChange(headCell.value)}
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
                    )
                  );
                })}
                <TableCell align="center">
                  <Typography
                    color="textSecondary"
                    fontWeight={"semibold"}
                    variant="h6"
                  ></Typography>
                </TableCell>
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
                    <TableCell>
                      <Checkbox
                        checked={!!selectedItems[row.id]}
                        onChange={(event) =>
                          handleRowCheckboxChange(event, row.id, row)
                        }
                      />
                    </TableCell>
                    {row?.data?.map((cell, index) => {
                      return (
                        filterData?.some((res) => res.label === cell.label) && (
                          <TableCell key={index} sx={{ p: 2, px: 4 }}>
                            <Box display="flex" alignItems="center">
                              {cell.td}
                            </Box>
                          </TableCell>
                        )
                      );
                    })}
                    <TableCell align="center">
                      <Typography
                        color="textSecondary"
                        fontWeight={"semibold"}
                        variant="h6"
                      ></Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {total_status && isLoading === false && (
          <Box
            variant="contained"
            size="small"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
              color:
                theme_org?.palette?.mode === "dark" ? "#4cca16" : "#058158",
              marginTop: "10px",
            }}
          >
            <Typography
              variant="button"
              sx={{
                color:
                  theme_org?.palette?.mode === "dark" ? "#cac8df" : "black",
                fontWeight: 700,
              }}
            >
              Total {total_heading} :
            </Typography>
            <Typography
              variant="button"
              sx={{
                color:
                  theme_org?.palette?.mode === "dark" ? "#4cca16" : "#058158",
                fontWeight: 700,
              }}
            >
              {total_amount.toFixed(2)}
            </Typography>
          </Box>
        )}



      </Stack>

      {showTotals && isLoading === false && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
            position: "sticky",
            bottom: 0,
            backgroundColor: theme_org?.palette?.mode === "dark" ? "#1e1e2d" : "#fff",
            zIndex: 2,
          }}
        >
          <Box
            colSpan={tableHead.length + 2}
            align="right"
            sx={{
              borderBottom: "none", // removes the line at the bottom
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "column",
                gap: 1,
                pr: 2,
              }}
            >
              <Typography variant="button" fontWeight={700}>
                Total :{" "}
                <span
                  style={{
                    color:
                      theme_org?.palette?.mode === "dark" ? "#4cca16" : "#058158",
                  }}
                >
                  ₹ {totalData?.total_amount?.toFixed(2) || "0.00"}
                </span>
              </Typography>

              <Typography variant="button" fontWeight={700}>
                Luggage Amt :{" "}
                <span
                  style={{
                    color:
                      theme_org?.palette?.mode === "dark" ? "#4cca16" : "#058158",
                  }}
                >
                  ₹  {totalData?.luggage?.toFixed(2) || "0.00"}
                </span>
              </Typography>

              <Typography variant="button" fontWeight={700}>
                Net Total :{" "}
                <span
                  style={{
                    color:
                      theme_org?.palette?.mode === "dark" ? "#4cca16" : "#058158",
                  }}
                >
                  ₹ {totalData?.net_amount?.toFixed(2) || "0.00"}
                </span>
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      <Stack className="flex">
        <Stack className="flex items-end md:items-start">
          <Typography
            sx={{ position: "absolute", transform: "translateY(20px)" }}
            className="text-xs md:text-base mt-[22px] md:mt-[0px]"
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

export default ReportTable;
