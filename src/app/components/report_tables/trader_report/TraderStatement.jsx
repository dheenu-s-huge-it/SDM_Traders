"use client";
import {
  Box,
  MenuItem,
  Typography,
  List,
  Button,
  InputLabel,
  Select,
  FormControl,
  FormHelperText,
  useTheme,
  Autocomplete,
  TextField,
  Checkbox,
  ListItemText,
  Snackbar,
  Alert,
  Modal,
  CircularProgress,
} from "@mui/material";
import * as XLSX from "xlsx";
import React, { useState, useEffect, useRef } from "react";
import ReportTableStatement from "../../tables/ReportTableStatement";
import Cookies from "js-cookie";
import Grid from "@mui/material/Grid2";
import { axiosGet, axiosPost } from "../../../../lib/api";
import { useRouter } from "next/navigation";
import { formattedDate } from "../../../../utils/utils";
import PDFGenerateLandscape from "../../common-components/PDFGenerateLandscape";
import { useForm, Controller } from "react-hook-form";
import CustomAutoCompleteFilters from "../../createcomponents/CustomAutoCompleteFilters";
import { fetchDateSingle } from "../../../../lib/getAPI/apiFetch";
import CustomTextField from "../../../../@core/components/mui/TextField";
import moment from "moment";
import SalesPrint from "../../common-components/SalesPrint";
import DeleteSalesDialog from "../../common-components/DeleteSalesDialog";

const TraderStatement = () => {
  const ACCESS_TOKEN = Cookies.get("token");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [searchValue, setSearchValue] = useState("");
  const [limitEnd, setLimitEnd] = useState(10);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [singleProduct, setSingleProduct] = useState();
  const [data, setData] = useState([]);
  const [statementData, setStatementData] = useState([]);
  const [pageCount, setPageCount] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [dataCount, setdataCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [orderField, setOrderField] = useState("created_date");
  const [orderType, setOrderType] = useState("desc");
  // const [createdStartDate, setCreatedStartDate] = useState("");
  // const [createdEndDate, setCreatedEndDate] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState(3);
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [effectToggle, setEffectToggle] = useState(false);
  const [singleData, setSingleData] = useState([]);
  const [singleDataJson, setSingleDataJson] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openPrint, setOpenPrint] = useState(false);

  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");

  const [minPrice, setminPrice] = useState("");
  const [maxPrice, setmaxPrice] = useState("");

  const [dateTitle, setDateTitle] = useState("Choose Date Of Selling");
  const [isDateSelected, setIsDateSelected] = useState(false);

  const today = new Date();
  const eightDaysAgo = new Date();
  eightDaysAgo.setDate(today.getDate() - 7);
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const [createdStartDate, setCreatedStartDate] = useState(
    formatDate(eightDaysAgo)
  );
  const [createdEndDate, setCreatedEndDate] = useState(formatDate(today));

  const onCreatedDateChange = (data) => {
    const formattedStartDate = formatDate(data[0].startDate);
    const formattedEndDate = formatDate(data[0].endDate);
    setCreatedStartDate(formattedStartDate);
    setCreatedEndDate(formattedEndDate);
    setDateTitle(`${formattedStartDate} - ${formattedEndDate}`);
    setPageNumber(1);
    setIsDateSelected(true);
  };

  const [minQuantityValue, setminQuantityValue] = useState("");
  const [maxQuantityValue, setmaxQuantityValue] = useState("");
  const [minPriceValue, setminPriceValue] = useState("");
  const [maxPriceValue, setmaxPriceValue] = useState("");

  const handleSearch = () => {
    setPageNumber(1);
    setMinQuantity(minQuantityValue);
    setMaxQuantity(maxQuantityValue);
    setminPrice(minPriceValue);
    setmaxPrice(maxPriceValue);
  };

  const router = useRouter();

  const [error, setError] = useState({ status: "", message: "" });
  const handledClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const HandleExportExcel = () => {
    fetchExportData(1);
    setIsExcelLoading(true);
  };
  const HandleExportPdf = () => {
    fetchExportData(2);
    setIsPdfLoading(true);
  };

  const HandleExportExcelManual = (data) => {
    fetchExportManualData(1, data);
    setIsExcelLoading(true);
  };

  const HandleExportPdfManual = (data) => {
    fetchExportManualData(2, data);
    setIsPdfLoading(true);
  };
  const cashTypeMaster = [
    { id: 1, label: "Credit" },
    { id: 2, label: "Cash" },
  ];

  const [customerNameMaster, setcustomerNameMaster] = useState([]);

  const HandleCustomerNameMaster = () => {
    fetchDateSingle("employee_get", setcustomerNameMaster, {
      access_token: ACCESS_TOKEN,
      search_input: "",
      from_date: "",
      to_date: "",
      active_status: 1,
      items_per_page: 10000,
    });
  };

  useEffect(() => {
    HandleCustomerNameMaster();
  }, []);

  const [customerNameID, setcustomerNameID] = useState("");
  const [customerName, setcustomerName] = useState("");
  const [cashTypeID, setcashTypeID] = useState("");
  const [modeTypeID, setmodeTypeID] = useState("");
  const [cashTypeName, setcashTypeName] = useState("");
  const [modeTypeName, setmodeTypeName] = useState("");

  const ChangeCustomerNameMaster = (event, value) => {
    if (value != null) {
      setcustomerNameID(value.data_uniq_id);
      setcustomerName(value.first_name);
    } else {
      setcustomerNameID("");
      setcustomerName("");
    }
    setPageNumber(1);
  };

  const ChangeCashType = (event, value) => {
    if (value != null) {
      setcashTypeID(value.id);
      setcashTypeName(value.label);
    } else {
      setcashTypeID("");
      setcashTypeName("");
    }
    setPageNumber(1);
  };

  const filterDataSelectedData = (data, selectedItems) => {
    return data?.map((item, index) => {
      let formattedData = {};
      if (selectedItems.includes("S.No"))
        formattedData["S.No"] = String(index + 1) || "---";
      if (selectedItems.includes("Date")) {
        const date = item.date_wise_selling
          ? new Date(item.date_wise_selling)
          : null;
        const formattedDate = date
          ? `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear()).slice(-2)}`
          : "---";
        formattedData["Date"] = formattedDate;
      }
      if (selectedItems.includes("Quantity"))
        formattedData["Quantity"] = String(
          Number(item.quantity || 0).toFixed(2)
        );
      if (selectedItems.includes("Price Per Quantity"))
        formattedData["Price Per Quantity"] = String(
          Number(item.per_quantity || 0).toFixed(2)
        );
      if (selectedItems.includes("Net Total"))
        formattedData["Net total"] = String(
          Number(item.net_amount || 0).toFixed(2)
        );
      if (selectedItems.includes("Commission Amount"))
        formattedData["Commission Amount"] = String(
          Number(item.commission_amount || 0).toFixed(2)
        );
      if (selectedItems.includes("Total Amount"))
        formattedData["Total Amount"] = String(
          Number(item.total_amount || 0).toFixed(2)
        );
      // if (selectedItems.includes("Balance Amount"))
      //   formattedData["B.Amt"] = String(
      //     Number(item.balance_amount || 0).toFixed(2)
      //   );

      return formattedData;
    });
  };
  const fetchExportManualData = (type, data) => {
    const selectedLabels = selectedOptions.map((item) => item.label);
    const exportData = filterDataSelectedData(data, selectedLabels);
    const summaryFields = [
      "Quantity",
      "Price Per Quantity",
      "Net total",
      "Commission Amount",
      "Total Amount",
    ];
    const PDFData = filterDataSelectedData(data, selectedLabels, true);
    const tableBody = PDFData.map((item) => Object.values(item));
    if (type === 1) {
      fetchExcelData(exportData);
      setIsExcelLoading(false);
    } else if (type === 2) {
      PDFGenerateLandscape({
        tableBody,
        PDFData,
        title: "TraderStatement-Details",
        name: "Trader Statements",
        summaryFields,
      });
      setIsPdfLoading(false);
    }
  };

  const fetchExportData = async (type) => {
    axiosGet
      .get(
        `finance/farmerstatement/get?access_token=${ACCESS_TOKEN}&items_per_page=10000&search_input=${searchValue}&date_wise_selling=${createdStartDate}&to_date_wise_selling=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&flower_type_id=${customerNameID}&payment_type=${cashTypeName}&min_quantity=${minQuantity}&max_quantity=${maxQuantity}&min_price=${minPrice}&max_price=${maxPrice}`
      )
      .then((response) => {
        let data = response.data.data[0]?.trader_statement || [];
        const selectedLabels = selectedOptions.map((item) => item.label);
        const exportData = filterDataSelectedData(data, selectedLabels);
        const summaryFields = [
          "Quantity",
          "Price Per Quantity",
          "Net total",
          "Commission Amount",
          "Total Amount",
        ];
        const PDFData = filterDataSelectedData(data, selectedLabels, true);

        const tableBody = PDFData.map((item) => Object.values(item));
        if (type === 1) {
          fetchExcelData(exportData);
          setIsExcelLoading(false);
        } else if (type === 2) {
          PDFGenerateLandscape({
            tableBody,
            PDFData,
            title: "TraderStatement-Details",
            name: "Trader Statements",
            summaryFields,
          });
          setIsPdfLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsExcelLoading(false);
      });
  };

  // const fetchExcelData = (data) => {
  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "User");

  //   XLSX.writeFile(workbook, `FarmerStatement-Details-${formattedDate}.xlsx`);
  // };

  const fetchExcelData = (data) => {
    if (!data || data.length === 0) return;

    // Define which fields you want to total
    const summaryFields = [
      "Quantity",
      "Price Per Quantity",
      "Net total",
      "Commission Amount",
      "Total Amount",
    ];

    // Calculate totals
    const totals = {};
    summaryFields.forEach((field) => {
      totals[field] = data
        .reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0)
        .toFixed(2);
    });

    // Create a "Total" row object with empty values for other fields
    const totalRow = {};
    Object.keys(data[0]).forEach((key) => {
      if (summaryFields.includes(key)) {
        totalRow[key] = totals[key];
      } else if (key === "S.No") {
        totalRow[key] = "Total";
      } else {
        totalRow[key] = "";
      }
    });

    // Append total row to data
    const finalData = [...data, totalRow];

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(finalData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User");

    // Write file
    XLSX.writeFile(workbook, `TraderStatement-Details-${formattedDate}.xlsx`);
  };

  const HandleEditFormer = () => {
    Cookies.set("data_uniq_id", singleDataJson?.data_uniq_id);
    router.push("/trader-payment/edit");
  };

  const HandleViewFormer = () => {
    Cookies.set("data_uniq_id", singleDataJson?.data_uniq_id);
    router.push("/trader-statement/view");
  };

  const HandleRouteCreate = () => {
    router.push("/trader-payment/create");
  };

  // Function to open the modal
  const handlePrintOpen = () => {
    setPrintOpen(true), setAnchorEl2(null);
  };

  //Shyam
  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true), setAnchorEl2(null);
  };

  const theme = useTheme();

  // Function to close the modal
  const handlePrintClose = () => setPrintOpen(false);

  //Shyam
  const handleDeleteDialogClose = () => setDeleteDialogOpen(false);

  //shyam
  const handlePrintOpenSuccess = () => {
    setOpenPrint(true), setAnchorEl2(null);
  };

  const handlePrintDialogCloseSuccess = () => setOpenPrint(false);

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const [fromDate, setFromDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(() => {
    // Calculate 7 days from today
    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);
    return moment(sevenDaysLater).format("YYYY-MM-DD");
  });

  const handleChangeFromDate = (event) => {
    const selectedFromDate = event.target.value;
    const formattedFromDate = moment(selectedFromDate).format("YYYY-MM-DD");
    setFromDate(formattedFromDate);

    // Auto-set toDate to 7 days after the selected fromDate
    const nextSevenDays = new Date(selectedFromDate);
    nextSevenDays.setDate(nextSevenDays.getDate() + 7);
    const formattedToDate = moment(nextSevenDays).format("YYYY-MM-DD");
    setToDate(formattedToDate);
  };

  const handleChangeToDate = (event) => {
    const formattedDate = moment(event.target.value).format("YYYY-MM-DD");
    setToDate(formattedDate);
  };

  const [searchInput, setsearchInput] = useState("");

  const [selectedTraderId, setSelectedTraderId] = useState("");

  const handleSearchInputChange = (traderId, input) => {
    setSelectedTraderId(traderId || "");
    setSearchValue(input);
    setPageNumber(1);
  };

  // const handleSearchFinal = (e) => {
  //   e.preventDefault();
  //   setSearchValue(searchInput);
  //   setPageNumber(1);
  // };

  const handleSearchFinal = (e) => {
    e.preventDefault();

    if (searchInput) {
      // Extract employee ID from the search input if it matches suggestion format
      const employeeId = searchInput.split("--")[0];
      const selectedEmployee = searchFilterData?.find(
        (emp) => emp.user_id === employeeId
      );

      if (selectedEmployee) {
        setSelectedTraderId(selectedEmployee.data_uniq_id);
      } else {
        setSelectedTraderId("");
      }
    } else {
      setSelectedTraderId("");
    }

    setSearchValue(searchInput);
    setPageNumber(1);
  };

  const fetchData = async (
    min,
    max,
    minprice,
    maxprice,
    field = orderField,
    type = orderType
  ) => {
    let searchFinal = "";
    if (searchValue === undefined) {
      searchFinal = searchInput;
    } else {
      searchFinal = searchValue;
    }

    axiosGet
      .get(
        `finance/farmerstatement/get?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=&date_wise_selling=${createdStartDate}&to_date_wise_selling=${createdEndDate}&order_type=${type}&order_field=${field}&trader_id=${selectedTraderId}&payment_type=${cashTypeName}&min_quantity=${min}&max_quantity=${max}&min_price=${minprice}&max_price=${maxprice}`
      )
      .then((response) => {
        setData(response.data.data);
        setStatementData(response.data.data[0]?.trader_statement || []);
        setdataCount(response.data.total_items);
        setPageCount(response.data.total_pages);
        setPageNumber(pageNumber === 0 ? 1 : pageNumber);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [searchFilterData, setsearchFilterData] = useState([]);

  const fetchDataFilter = async () => {
    setIsLoading(true);
    axiosGet
      .get(
        `employee_get?access_token=${ACCESS_TOKEN}&items_per_page=10000&user_type_not=4&order_type=ASC&order_field=user_type`
      )
      .then((response) => {
        setsearchFilterData(response.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [filterData, setFilterData] = useState([]);
  const fetchFilterData = async () => {
    setIsLoading(true);
    axiosGet
      .get(
        `finance/farmerstatementfilter/get?access_token=${ACCESS_TOKEN}&items_per_page=10000`
      )
      .then((response) => {
        setFilterData(response.data.data);
        const FilteredData = items?.filter((res) =>
          response.data.data.some((item) => item.label === res.label)
        );
        setSelectedOptions(FilteredData || []);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [printData, setPrintData] = useState([]);
  const fetchPrintData = async () => {
    setIsLoading(true);
    let searchFinal = "";
    if (searchValue === undefined) {
      searchFinal = searchInput;
    } else {
      searchFinal = searchValue;
    }
    axiosGet
      .get(
        `finance/farmerstatement/get?access_token=${ACCESS_TOKEN}&has_limit=0&page=${pageNumber}&items_per_page=10000&search_input=&date_wise_selling=${createdStartDate}&to_date_wise_selling=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&trader_id=${selectedTraderId}&payment_type=${cashTypeName}&min_quantity=${minQuantity}&max_quantity=${maxQuantity}&min_price=${minPrice}&max_price=${maxPrice}`
      )
      .then((response) => {
        setPrintData(response.data.data);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleRefresh = () => {
    setMinQuantity("");
    setMaxQuantity("");
    setminPrice("");
    setmaxPrice("");
    setminQuantityValue("");
    setmaxQuantityValue("");
    setminPriceValue("");
    setmaxPriceValue("");
    setcustomerNameID("");
    setcustomerName("");
    setcashTypeID("");
    setcashTypeName("");
    setmodeTypeName("");
    setSelectedDate("");
    setPageNumber(1);
    setSearchValue("");
    setsearchInput("");
    setFromDate("");
    setToDate("");
    setDateTitle("Choose Date Of Selling");
    setCreatedStartDate("");
    setCreatedEndDate("");
    setSelectedTraderId("");
  };

  useEffect(() => {
    fetchData(minQuantity, maxQuantity, minPrice, maxPrice);
    fetchDataFilter();
    fetchPrintData();
  }, [
    ACCESS_TOKEN,
    pageNumber,
    limitEnd,
    searchValue,
    createdStartDate,
    createdEndDate,
    activeStatusFilter,
    customerNameID,
    cashTypeName,
    modeTypeName,
    minQuantity,
    maxQuantity,
    minPrice,
    maxPrice,
    selectedTraderId,
  ]);

  useEffect(() => {
    fetchFilterData();
  }, []);

  //shyam
  const handlePrintDialog = () => {
    setOpenPrint(true);
  };

  const handlePrintDialogSuccess = () => {
    window.print();
  };

  //shyam

  const tableHead = [
    {
      id: 1,
      label: `S.No`,
      value: "data_uniq_id",
    },
    {
      id: 2,
      label: `Date`,
      value: "date_wise_selling",
      fieldName: "",
    },

    {
      id: 8,
      label: "Quantity",
      value: "quantity",
      fieldName: "quantity",
    },
    {
      id: 9,
      label: "Price Per Quantity",
      value: "per_quantity",
      fieldName: "per_quantity",
    },

    {
      id: 12,
      label: "Net Total",
      value: "net_amount",
      fieldName: "",
    },
    {
      id: 13,
      label: "Commission Amount",
      value: "commission_amount",
      fieldName: "",
    },
    {
      id: 14,
      label: "Total Amount",
      value: "total_amount",
      fieldName: "",
    },

    {
      id: 18,
      label: "Status",
      value: "status",
      fieldName: "",
    },
  ];

  const td_data_set = [];

  statementData?.map((item, index) => {
    const array_data = {
      id: item.trader_id,
      data: [
        {
          td: (
            <Box>
              <Typography fontSize="14px" textTransform="capitalize">
                {index + 1 || "---"}
              </Typography>
            </Box>
          ),
          label: "S.No",
          id: 1,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {item.date_wise_selling
                  ? new Date(item.date_wise_selling)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")
                  : ""}
              </Typography>
            </Box>
          ),
          label: "Date",
          id: 2,
        },

        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {Number(item.quantity || 0).toFixed(2)}
              </Typography>
            </Box>
          ),
          label: "Quantity",
          id: 8,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {Number(item.per_quantity || 0).toFixed(2)}
              </Typography>
            </Box>
          ),
          label: "Price Per Quantity",
          id: 9,
        },

        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {Number(item.net_amount || 0).toFixed(2)}
              </Typography>
            </Box>
          ),
          label: "Net Total",
          id: 12,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {Number(item.commission_amount || 0).toFixed(2)}
              </Typography>
            </Box>
          ),
          label: "Commission Amount",
          id: 13,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {Number(item.total_amount || 0).toFixed(2)}
              </Typography>
            </Box>
          ),
          label: "Total Amount",
          id: 14,
        },

        {
          td: (
            <Box
              style={{
                backgroundColor:
                  item.balance_amount === 0
                    ? theme?.palette?.success.lightOpacity // Paid
                    : item.balance_amount !== 0
                      ? theme?.palette?.error.lightOpacity // Unpaid
                      : theme?.palette?.warning.lightOpacity,
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <Typography
                fontSize={"14px"}
                sx={{
                  color:
                    item.balance_amount === 0
                      ? theme?.palette?.success.main // Paid
                      : item.balance_amount !== 0
                        ? theme?.palette?.error.main // Unpaid
                        : theme?.palette?.warning.main,
                }}
              >
                {item.balance_amount === 0
                  ? "Paid"
                  : item.balance_amount !== 0
                    ? "Unpaid"
                    : "Partially Paid"}
              </Typography>
            </Box>
          ),
          label: "Status",
          id: 16,
        },
      ],
      json: [item],
      active: item.active_status,
      active_name: item.status,
    };

    td_data_set.push(array_data);
  });

  const handleOnActionClick = (e, data) => {
    setSingleData(data);
    setSingleDataJson(data?.json[0]);
    setAnchorEl2(e.currentTarget);
  };

  const items = [
    { value: 0, label: "S.No" },
    { value: 1, label: "Date" },
    { value: 2, label: "Quantity" },
    { value: 3, label: "Price Per Quantity" },
    { value: 4, label: "Net Total" },
    { value: 5, label: "Commission Amount" },
    { value: 6, label: "Total Amount" },
    { value: 7, label: "Status" },
  ];
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleFilterChange = (event, newValue) => {
    newValue.forEach((item) => {
      const jsonData = {
        access_token: ACCESS_TOKEN,
        status: 1,
        label: item.label,
      };
      axiosPost
        .post("finance/farmerstatementfilter/create", jsonData)
        .then((response) => {
          setEffectToggle(!effectToggle);
          setAlertMessage("Updated successfully.");
          setAlertVisible(true);
          setAlertSeverity("success");
          fetchFilterData();
          setSelectedOptions(newValue);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

    selectedOptions.forEach((item) => {
      if (!newValue.some((option) => option.value === item.value)) {
        const uncheckData = {
          access_token: ACCESS_TOKEN,
          status: 2,
          label: item.label,
        };
        axiosPost
          .post("finance/farmerstatementfilter/create", uncheckData)
          .then((response) => {
            setEffectToggle(!effectToggle);
            setAlertMessage("Updated successfully.");
            setAlertVisible(true);
            setAlertSeverity("success");
            fetchFilterData();
            setSelectedOptions(newValue);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  };

  const handleFieldChange = (field, type) => {
    setOrderField(field);
    setOrderType(type);
    fetchData(minQuantity, maxQuantity, minPrice, maxPrice, field, type);
  };

  const handleDialog = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      data_ids: [singleDataJson?.data_uniq_id],
    };
    axiosPost
      .post(`purchaseorder/purchaseorder/delete`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        handleDeleteDialogClose();
        fetchData(minQuantity, maxQuantity, minPrice, maxPrice);
        setSelectedItems([]);
        setActionData("");
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        setAlertMessage("Deleted successfully.");
        setAlertVisible(true);
        setAlertSeverity("success");
        handleClose2();
        setSelectAll(false);
      })
      .catch((error) => {
        // Handle errors here
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        console.error("Error:", error);
      });
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const [openMulitiStatus, setOpenMultistatus] = useState(false);

  const [actionData, setActionData] = useState(2);
  const handleChange = (event) => {
    setActionData(event.target.value);
    setOpenMultistatus(true);
  };

  const [selectAll, setSelectAll] = useState(false);

  const renderLabel = (label, isRequired) => {
    return (
      <Typography variant="body1" sx={{ marginLeft: "5px" }}>
        {label} {isRequired && <span style={{ color: "#D32F2F" }}>*</span>}
      </Typography>
    );
  };

  const [selectedDate, setSelectedDate] = useState("");

  const FilterComponent = () => {
    return (
      <Grid
        container
        spacing={2}
        alignContent={"flex-end"}
        justifyContent={"end"}
      >
        <Grid
          size={{ xs: 12, sm: 4, md: 3, lg: 2 }}
          className=" mt-[10px] md:mt-[22px]"
        >
          <Autocomplete
            multiple
            size="small"
            id="select-all"
            options={items}
            value={selectedOptions}
            onChange={handleFilterChange}
            disableCloseOnSelect
            // getOptionLabel={(option) => option.label}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props; // Destructure the key
              return (
                <li key={key} {...otherProps}>
                  <Checkbox
                    checked={selectedOptions.some(
                      (item) => item.label === option.label
                    )}
                  />
                  <ListItemText primary={option.label} />
                </li>
              );
            }}
            renderTags={() => null}
            renderInput={(params) => (
              <TextField {...params} label="All" style={{ margin: "0px" }} />
            )}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
          />
        </Grid>
      </Grid>
    );
  };

  const ActionComponent = () => {
    return (
      <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={actionData}
          onChange={handleChange}
        >
          <MenuItem value={1}>Enable</MenuItem>
          <MenuItem value={0}>Disable</MenuItem>
        </Select>
      </FormControl>
    );
  };

  const onDelete = () => {
    console.log("delete button clicked");
  };

  const componentRef = useRef();

  const handlePrint = () => {
    const printContent = componentRef.current.innerHTML;
    const iframe = document.createElement("iframe");

    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write("<html><head><title></title>");
    doc.write("</head><body>");
    doc.write(printContent);
    doc.write("</body></html>");
    doc.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  const mulitpleRef = useRef();

  const handlePrintMulitple = () => {
    const printContent = mulitpleRef.current.innerHTML;
    const iframe = document.createElement("iframe");

    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();

    doc.write(`
    <html>
      <head>
        <title></title>
        <style>
          @font-face {
            font-family: "Nimbus Mono L Bold";
            src: url("/Nimbus Mono L Bold.ttf") format("truetype");
            font-weight: bold;
            font-style: normal;
          }
          body, * {
            font-family: "Nimbus Mono L Bold", monospace !important;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

    doc.close();

    iframe.onload = function () {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
      }, 250); // 250ms delay, adjust if needed
    };
  };

  const groupByTraderAndDate = (data) => {
    return [["All Data", data]];
  };

  const groupedPrintData = groupByTraderAndDate(printData);

  const MenuComponent = (rowId) => {
    return (
      <List sx={{ p: 0, fontSize: "12px" }}>
        <MenuItem onClick={HandleViewFormer}>View</MenuItem>
        <MenuItem onClick={handlePrint}>Print</MenuItem>
        {/* <MenuItem onClick={HandleEditFormer}>Edit</MenuItem> */}
        {/* <MenuItem onClick={handleDeleteDialogOpen}>Delete</MenuItem> */}
        {/* Shyam */}
      </List>
    );
  };

  useEffect(() => {
    const newSuggestions = searchFilterData?.map((row) => {
      return `${row.user_id}--${row.first_name}`;
      // return `${row.first_name}`;

      // return `${row.user_id}-${row.first_name}${row.last_name ? " " + row.last_name : ""}`;
    });
    setSuggestions(newSuggestions);
  }, [searchFilterData]);

  return (
    <>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid item={12} sx={{ width: "100%" }}>
          <ReportTableStatement
            pageNumber={pageNumber}
            pageCount={pageCount}
            tableHead={tableHead}
            tableRow={td_data_set}
            actionPrivilege={true}
            searchInput={searchInput}
            setSearchValue={setsearchInput}
            onSearchButtonClick={handleSearchInputChange}
            heading={"Trader Statements"}
            limitEnd={limitEnd}
            setLimitEnd={setLimitEnd}
            anchorEl2={anchorEl2}
            setAnchorEl2={setAnchorEl2}
            handleClose2={handleClose2}
            MenuComponent={MenuComponent}
            singleProduct={singleProduct}
            setSingleProduct={setSingleProduct}
            ActionComponent={ActionComponent}
            onDelete={onDelete}
            FilterComponent={FilterComponent}
            HandleExportExcel={HandleExportExcel}
            HandleExportPdf={HandleExportPdf}
            handleOnActionClick={handleOnActionClick}
            filterData={filterData}
            onAddClick={HandleRouteCreate}
            onRefresh={handleRefresh}
            excelLoading={isExcelLoading}
            pdfLoading={isPdfLoading}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            searchFilterData={searchFilterData}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            fieldChange={handleFieldChange}
            handleSearchFinal={handleSearchFinal}
            HandleExportExcelManual={HandleExportExcelManual}
            HandleExportPdfManual={HandleExportPdfManual}
            dataCount={dataCount}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            orderType={orderType}
            createHeading={"Statement"}
            dateTitle={dateTitle}
            onCreatedDateChange={onCreatedDateChange}
            handlePrintMulitple={handlePrintMulitple}
            handlePrint={handlePrint}
            minQuantity={minQuantityValue}
            maxQuantity={maxQuantityValue}
            minPrice={minPriceValue}
            maxPrice={maxPriceValue}
            setMinQuantity={setminQuantityValue}
            setMaxQuantity={setmaxQuantityValue}
            setMinPrice={setminPriceValue}
            setMaxPrice={setmaxPriceValue}
            handleSearch={handleSearch}
            setPageNumber={setPageNumber}
            global_print={true}
            quantity_filter={true}
            total_status={false}
            showTotals={true}
            totalData={data[0]}
          />
        </Grid>
      </Grid>

      <div style={{ display: "none" }}>
        <div
          ref={componentRef}
          style={{
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
            fontSize: "11px",
            width: "5in", // Consider adjusting this to fit the print layout better
          }}
        >
          <div style={{ fontWeight: "bold", textAlign: "center" }}>
            S.D.M. Mahendran
          </div>
          <div
            style={{
              marginTop: "5px",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            Sathyamangalam Erode
          </div>
          <div
            style={{
              marginTop: "5px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            9442498222 -
          </div>
          <div
            style={{
              fontWeight: "semibold",
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            TRADER BILL RECEIPT
          </div>
          <div
            style={{
              marginTop: "5px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              Date:
              <span style={{ fontWeight: "bold" }}>
                {singleDataJson.date_wise_selling
                  ? new Date(singleDataJson.date_wise_selling)
                      .toLocaleDateString("en-GB") // This formats it to dd/mm/yyyy
                      .replace(/\//g, "-") // Replace slashes with dashes to get dd-mm-yyyy
                  : ""}
              </span>
            </div>
            <div>
              Time:{" "}
              <span style={{ fontWeight: "bold" }}>
                {singleDataJson.time_wise_selling || ""}
              </span>
            </div>
          </div>

          <hr style={{ borderTop: "1px dashed #000", margin: "10px 0" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "5px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              Trader :{" "}
              <div style={{ fontWeight: "600", paddingLeft: "10px" }}>
                {singleDataJson.trader_user_id || ""} -{" "}
                {singleDataJson.trader_nick_name || ""}
              </div>
            </div>
            {singleDataJson.trader_nick_name && (
              <div style={{ display: "flex", alignItems: "center" }}>
                Trader :{" "}
                <div style={{ fontWeight: "600", paddingLeft: "10px" }}>
                  {singleDataJson.trader_nick_name || ""}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "5px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              Flower :{" "}
              <div style={{ fontWeight: "600", paddingLeft: "10px" }}>
                {singleDataJson.flower_type_name || ""}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              Type :{" "}
              <div style={{ fontWeight: "600", paddingLeft: "10px" }}>
                {singleDataJson.payment_type || ""}
              </div>
            </div>
          </div>

          <hr style={{ borderTop: "1px dashed #000", margin: "10px 0" }} />
          <div style={{ width: "100%", marginTop: "5px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 3fr 3fr 1fr ",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              <div> S.No</div>
              <div> Qty</div>
              <div>Rate</div>
              {/* <div>Disc</div> */}
              <div>Amount</div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 3fr 3fr 1fr ",
                marginTop: "5px",
                width: "100%",
              }}
            >
              <div>{singleDataJson.quantity || 0}</div>
              <div>{singleDataJson.quantity || 0}</div>
              <div>{singleDataJson.per_quantity || 0}</div>
              {/* <div>{singleDataJson.discount || 0}</div> */}
              <div>₹{singleDataJson.total_amount || 0}</div>
            </div>
          </div>
          <hr style={{ borderTop: "1px dashed #000", margin: "10px 0" }} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 4,
              alignItems: "flex-end",
              marginTop: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              Total :{" "}
              <div style={{ fontWeight: "600", paddingLeft: "10px" }}>
                ₹{Number(singleDataJson.total_amount || 0).toFixed(2)}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              Commsion :{" "}
              <div
                style={{
                  fontWeight: "600",
                  paddingLeft: "10px",
                  paddingRight: "15px",
                }}
              >
                ₹{Number(singleDataJson.commission_amount || 0).toFixed(2)}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                paddingBottom: "20px",
              }}
            >
              Net Total :{" "}
              <div
                style={{
                  fontWeight: "600",
                  paddingLeft: "10px",
                  paddingRight: "15px",
                }}
              >
                ₹
                {(
                  Math.round(Number(singleDataJson.net_amount || 0) / 10) * 10
                ).toFixed(2)}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            <div>Toll: ₹{singleDataJson.toll_amount || 0}</div>
            <div>Total: ₹{singleDataJson.total_amount || 0}</div>
          </div>
          <hr style={{ borderTop: "1px dashed #000", margin: "10px 0" }} />

          <div
            style={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Staff: {singleDataJson.createdby_firstname || ""}{" "}
            {singleDataJson.createdby_lastname || ""}
          </div>
          <div
            style={{
              marginTop: "5px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            உழவன் உழைத்தால் உலகம் வாழும் !!!
          </div>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <div
          ref={mulitpleRef}
          style={{
            // fontFamily: "Arial, sans-serif",
            fontSize: "18px",
            width: "5in",
          }}
        >
          {groupedPrintData.map(([key, group], index) => (
            <div key={index} style={{ pageBreakInside: "avoid" }}>
              {/* Trader and Date Header */}
              <div
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  // marginTop: "1px",
                  fontSize: "26px",
                }}
              >
                S.D.M. Mahendran
              </div>
              <div
                style={{
                  marginTop: "5px",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: "3px",
                }}
              >
                Karatoor Road, Sathyamangalam, Erode
              </div>

              <div
                style={{
                  marginTop: "5px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                9442498222
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: "5px",
                  fontSize: "18px",
                }}
              >
                TRADER STATEMENT RECEIPT
              </div>
              <div
                style={{
                  borderTop: "1px dashed #000",
                  margin: "6px 0",
                  height: "0",
                  width: "100%",
                  printColorAdjust: "exact",
                  WebkitPrintColorAdjust: "exact",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "2px",
                }}
              >
                <div>
                  Trader :{" "}
                  <span style={{ fontWeight: "600" }}>
                    <span style={{ fontWeight: "600" }}>
                      {(group[0]?.user_id || "").slice(-4)} -{" "}
                      {group[0]?.trader_name || ""}
                    </span>
                  </span>
                </div>
                <div style={{ paddingRight: "10px" }}>
                  Mobile:
                  <span style={{ fontWeight: "bold" }}>
                    {group[0]?.mobile_number || "--"}
                  </span>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px dashed #000",
                  margin: "6px 0",
                  height: "0",
                  width: "100%",
                  printColorAdjust: "exact",
                  WebkitPrintColorAdjust: "exact",
                }}
              />

              <div style={{ width: "100%", marginTop: "1px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr ",
                    width: "100%",
                  }}
                >
                  <div>S.No</div>
                  <div>Date</div>
                  <div>Qty</div>
                  <div>Rate</div>
                  <div>Total</div>
                </div>

                {/* Data Rows - Always display 7 rows */}

                 {group[0]?.trader_statement?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr",
                      marginTop: "1px",
                      width: "100%",
                      // minHeight: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    <div>{idx + 1}</div>
                    <div>
                      {item?.date_wise_selling
                        ? new Date(item.date_wise_selling)
                            .toLocaleDateString("en-GB") // dd/mm/yyyy
                            .replace(/\//g, "-") // dd-mm-yyyy
                        : ""}
                    </div>
                    <div>{Number(item?.quantity || 0).toFixed(2)}</div>

                    <div> {Number(item.per_quantity).toFixed(2)}</div>
                    <div>{Number(item?.sub_amount || 0).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  borderTop: "1px dashed #000",
                  margin: "10px 0",
                  height: "0",
                  width: "100%",
                  printColorAdjust: "exact",
                  WebkitPrintColorAdjust: "exact",
                }}
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "flex-end",
                  marginTop: "5px",
                }}
              >
                {[
                  { label: "Total Amount:", value: group[0]?.sub_amount },
                  { label: "Commission:", value: group[0]?.commission_amount },
                  {
                    label: "Net Total:",
                    value:
                      Math.round(
                        ((Number(group[0]?.sub_amount) || 0) -
                          (Number(group[0]?.commission_amount) || 0)) /
                          10
                      ) * 10,
                  },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: "bold",
                      width: "100%",
                      maxWidth: "230px", // ✅ consistent width for all rows
                    }}
                  >
                    <span style={{ whiteSpace: "nowrap" }}>{row.label}</span>
                    <span style={{ fontWeight: "600", whiteSpace: "nowrap" }}>
                      ₹{Number(row.value || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SalesPrint
        open={openPrint}
        onsubmit={handlePrintDialogSuccess}
        onClose={handlePrintDialogCloseSuccess}
        singleDataJson={singleDataJson}
        setSingleProduct={setSingleProduct}
        text={"Are you sure you want to Print the data?"}
      />

      <DeleteSalesDialog
        open={deleteDialogOpen}
        onsubmit={handleDialog}
        onClose={handleDeleteDialogClose}
        singleProduct={singleProduct}
        setSingleProduct={setSingleProduct}
        text={"Are you sure you want to delete?"}
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
        <Alert onClose={handledClose} severity={error.status}>
          {error.message}
        </Alert>
      </Snackbar>

      {openPrint && <SalesPrint rowId={singleDataJson?.data_uniq_id} />}
    </>
  );
};

export default TraderStatement;
