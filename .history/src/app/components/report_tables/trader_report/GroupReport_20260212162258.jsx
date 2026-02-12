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
} from "@mui/material";
import * as XLSX from "xlsx";
import React, { useState, useEffect, useRef } from "react";
import GroupReportTable from "../../tables/GroupReportTable";
import Cookies from "js-cookie";
import Grid from "@mui/material/Grid2";
import { axiosGet, axiosPost } from "../../../../lib/api";
import { useRouter } from "next/navigation";
import { formattedDate2 } from "../../../../utils/utils";
import PDFGenerate from "../../common-components/PDFGenerate";
import { useForm, Controller } from "react-hook-form";
import CustomAutoCompleteFilters from "../../createcomponents/CustomAutoCompleteFilters";
import { fetchDateSingle } from "../../../../lib/getAPI/apiFetch";
import moment from "moment";
import CustomTextField from "../../../../@core/components/mui/TextField";
import SalesPrint from "../../common-components/SalesPrint";
import Logo from "../../../../@core/svg/Logo";

const GroupReport = () => {
  const ACCESS_TOKEN = Cookies.get("token");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [searchValue, setSearchValue] = useState("");
  const [limitEnd, setLimitEnd] = useState(10);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [singleProduct, setSingleProduct] = useState();
  const [data, setData] = useState([]);
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
  const [singleDataJson, setSingleDataJson] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [openPrint, setOpenPrint] = useState(false);

  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");

  const [minPrice, setminPrice] = useState("");
  const [maxPrice, setmaxPrice] = useState("");

  const [dateTitle, setDateTitle] = useState("Choose Date Of Selling");

  const today = new Date();
  const eightDaysAgo = new Date();
  eightDaysAgo.setDate(today.getDate() - 7);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
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

  const filterDataSelectedData = (data, selectedItems) => {
    return data?.map((item, index) => {
      let formattedData = {};

      if (selectedItems.includes("S.No"))
        formattedData["S.No"] = String(index + 1) || "---";

      if (selectedItems.includes("Group Type"))
        formattedData["Group Type"] = String(item.group_type) || "---";

      if (selectedItems.includes("Quantity"))
        formattedData["Quantity"] = String(
          Number(item.quantity || 0).toFixed(2)
        );

      // if (selectedItems.includes("Price Per Quantity"))
      //   formattedData["Price Per Quantity"] = String(Number(item.per_quantity || 0).toFixed(2));

      if (selectedItems.includes("Net Total"))
        formattedData["Net Total"] = String(
          Number(item.sub_amount || 0).toFixed(2)
        );

      if (selectedItems.includes("Luggage Amount"))
        formattedData["Luggage Amount"] = String(
          Number(item.luggage || 0).toFixed(2)
        );

      if (selectedItems.includes("Total Amount"))
        formattedData["Total Amount"] = String(
          Number(item.total_amount || 0).toFixed(2)
        );

      return formattedData;
    });
  };

  const fetchExportManualData = (type, data) => {
    const selectedLabels = selectedOptions.map((item) => item.label);
    const exportData = filterDataSelectedData(data, selectedLabels);
    const summaryFields = [
      "Quantity",
      "Net Total",
      "Luggage Amount",
      "Total Amount",
    ];
    const PDFData = filterDataSelectedData(data, selectedLabels);
    const tableBody = PDFData.map((item) => Object.values(item));

    if (type === 1) {
      fetchExcelData(exportData);
      setIsExcelLoading(false);
    } else if (type === 2) {
      PDFGenerate({
        tableBody,
        PDFData,
        title: "Group-Report-Details",
        name: "Group Report",
        summaryFields,
      });
      setIsPdfLoading(false);
    }
  };
  const fetchExportData = async (type) => {
    axiosGet
      .get(
        `finance/groupstatement/get?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=${searchFinal}&date_wise_selling=${createdStartDate}&to_date_wise_selling=${createdEndDate}&order_type=${type}&order_field=${field}`
      )
      .then((response) => {
        let data = response?.data?.data;
        const selectedLabels = selectedOptions.map((item) => item.label);
        const exportData = filterDataSelectedData(data, selectedLabels);
        const summaryFields = [
          "Quantity",
          "Net Total",
          "Luggage Amount",
          "Total Amount",
        ];
        const PDFData = filterDataSelectedData(data, selectedLabels);

        const tableBody = PDFData.map((item) => Object.values(item));

        if (type === 1) {
          fetchExcelData(exportData);
          setIsExcelLoading(false);
        } else if (type === 2) {
          PDFGenerate({
            tableBody,
            PDFData,
            title: "Group-Report-Details",
            name: "Group Report",
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

  //   XLSX.writeFile(workbook, `Group-Report-Details-${formattedDate2}.xlsx`);
  // };

  const fetchExcelData = (data) => {
    if (!data || data.length === 0) return;
    const summaryFields = [
      "Quantity",
      "Net Total",
      "Luggage Amount",
      "Total Amount",
    ];
    // Calculate totals
    const totals = {};
    summaryFields.forEach((field) => {
      totals[field] = data
        .reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0)
        .toFixed(2);
    });

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

    const finalData = [...data, totalRow];

    const worksheet = XLSX.utils.json_to_sheet(finalData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User");

    // Write file
    XLSX.writeFile(
      workbook,
      `Group-Report-Details-${formattedDate(new Date())}.xlsx`
    );
  };

  const HandleViewFormer = () => {
    Cookies.set("data_uniq_id", singleDataJson?.data_uniq_id);
    router.push("/trader-statement/view");
  };

  const HandleRouteCreate = () => {
    router.push("/trader-payment/create");
  };

  const handlePrintDialogCloseSuccess = () => setOpenPrint(false);

  const [searchInput, setsearchInput] = useState("");

  const [selectedGroupId, setSelectedGroupId] = useState("");

  const handleSearchInputChange = (groupId, input) => {
    setSelectedGroupId(groupId || "");
    setSearchValue(input);
    setPageNumber(1);
  };
  // const handleSearchInputChange = (input) => {
  //   setSearchValue(input);
  //   setPageNumber(1);
  // };

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
        (emp) => emp.group_type === employeeId
      );

      if (selectedEmployee) {
        setSelectedGroupId(selectedEmployee.data_uniq_id);
      } else {
        setSelectedGroupId("");
      }
    } else {
      setSelectedGroupId("");
    }

    setSearchValue(searchInput);
    setPageNumber(1);
  };

  const renderLabel = (label, isRequired) => {
    return (
      <Typography variant="body1" sx={{ marginLeft: "5px" }}>
        {label} {isRequired && <span style={{ color: "#D32F2F" }}>*</span>}
      </Typography>
    );
  };

  const [groupMaster, setgroupMaster] = useState([]);

  const HandleGroupMaster = () => {
    fetchDateSingle("master/group/get", setgroupMaster, {
      access_token: ACCESS_TOKEN,
      search_input: "",
      from_date: "",
      to_date: "",
      active_status: 1,
      items_per_page: 10000,
    });
  };

  useEffect(() => {
    HandleGroupMaster();
  }, []);

  const [groupID, setGroupID] = useState("");
  const [groupName, setgroupName] = useState("");

  const ChangeGroupMaster = (event, value) => {
    if (value != null) {
      setGroupID(value.data_uniq_id);
      setgroupName(value.group_type);
    } else {
      setGroupID("");
      setgroupName("");
    }
    setPageNumber(1);
  };

  const [totalData, setTotalData] = useState([]);
  const fetchData = async (field = orderField, type = orderType) => {
    let searchFinal = "";
    if (searchValue === undefined) {
      searchFinal = searchInput;
    } else {
      searchFinal = searchValue;
    }

    axiosGet
      .get(
        `finance/groupstatement/get?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=&date_wise_selling=${createdStartDate}&to_date_wise_selling=${createdEndDate}&order_type=${type}&order_field=${field}&group_id=${selectedGroupId}`
      )
      .then((response) => {
        setData(response.data.data);
        setTotalData(response.data.totals);
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
    axiosGet
      .get(`master/group/get?access_token=${ACCESS_TOKEN}&items_per_page=10000`)
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
        `finance/grouptatementfilter/get?access_token=${ACCESS_TOKEN}&items_per_page=10000`
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
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
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
        `finance/groupstatement/get?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=10000&search_input=${searchFinal}&date_wise_selling=${createdStartDate}&to_date_wise_selling=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&group_id=${selectedGroupId}`
      )
      .then((response) => {
        setPrintData(response.data.data);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
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
    setPageNumber(1);
    setSearchValue("");
    setsearchInput("");
    setDateTitle("Choose Date Of Selling");
    setCreatedStartDate(formatDate(eightDaysAgo));
    setCreatedEndDate(formatDate(today));
    setSelectedGroupId("");
  };

  useEffect(() => {
    fetchData(orderField, orderType);
    fetchDataFilter();
    fetchPrintData();
  }, [
    ACCESS_TOKEN,
    pageNumber,
    limitEnd,
    searchValue,
    groupID,
    createdStartDate,
    createdEndDate,
    activeStatusFilter,
    minQuantity,
    maxQuantity,
    minPrice,
    maxPrice,
    fromDate,
    toDate,
    selectedGroupId,
  ]);

  useEffect(() => {
    fetchFilterData();
  }, []);

  const handlePrintDialog = () => {
    setOpenPrint(true);
  };

  const handlePrintDialogSuccess = () => {
    window.print();
  };

  const tableHead = [
    {
      id: 1,
      label: `S.No`,
      value: "data_uniq_id",
    },
    {
      id: 2,
      label: `Group Type`,
      value: "group_type",
      fieldName: "",
    },
    {
      id: 3,
      label: `Quantity`,
      value: "quantity",
      fieldName: "",
    },

    {
      id: 4,
      label: `Net Total`,
      value: "sub_amount",
    },
    {
      id: 5,
      label: `Luggage Amount`,
      value: "luggage",
    },
    {
      id: 6,
      label: `Total Amount`,
      value: "total_amount",
    },
  ];

  const td_data_set = [];

  data?.map((item, index) => {
    const array_data = {
      id: item.group_id,
      data: [
        {
          td: (
            <Box>
              <Typography fontSize="14px" textTransform="capitalize">
                {Number(index + 1) +
                  Number(limitEnd) * (Number(pageNumber) - 1)}
              </Typography>
            </Box>
          ),
          label: "S.No",
          id: 1,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">{item.group_type}</Typography>
            </Box>
          ),
          label: "Group Type",
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
          id: 3,
        },

        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {Number(item.sub_amount || 0).toFixed(2)}
              </Typography>
            </Box>
          ),
          label: "Net Total",
          id: 4,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {Number(item.luggage || 0).toFixed(2)}
              </Typography>
            </Box>
          ),
          label: "Luggage Amount",
          id: 5,
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
          id: 6,
        },
      ],
      json: [item],
      active: item.active_status,
      active_name: item.status,
    };

    td_data_set.push(array_data);
  });

  const items = [
    { value: 0, label: "S.No" },
    { value: 1, label: "Quantity" },
    { value: 2, label: "Total" },
    { value: 3, label: "Luggage Amount" },
    { value: 4, label: "Total Amount" },
    { value: 5, label: "Group Type" },
    // { value: 6, label: "Price Per Quantity" },
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
        .post("finance/grouptatementfilter/create", jsonData)
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
          .post("finance/grouptatementfilter/create", uncheckData)
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
    fetchData(field, type);
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const [openMulitiStatus, setOpenMultistatus] = useState(false);

  const [actionData, setActionData] = useState(2);
  const handleChange = (event) => {
    setActionData(event.target.value);
    setOpenMultistatus(true);
  };

  const [selectAll, setSelectAll] = useState(false);

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
            getOptionLabel={(option) => option.label}
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
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();

    doc.write(`
       <html>
         <head>
           <title>Invoice</title>
           <style>
             @font-face {
               font-family: "Nimbus Mono L Bold";
               src: url("/Nimbus Mono L Bold.ttf") format("truetype");
               font-weight: bold;
               font-style: normal;
             }
             
             @page {
               size: auto;
               margin: 0mm; 
             }
   
             html, body {
               margin: 0;
               padding: 0;
               height: 100%;
             }
   
             body {
               font-family: "Nimbus Mono L Bold", monospace !important;
               -webkit-print-color-adjust: exact;
             }
   
             .print-container {
               display: flex;
               flex-direction: column;
               min-height: 100vh;
               box-sizing: border-box;
               padding: 10mm;
             }
   
             /* The Wrapper fills the remaining space */
             .items-wrapper {
               flex: 1;
               display: flex;
               flex-direction: column;
             }
   
             .items-table {
               width: 100%;
               border-collapse: collapse;
               flex: 1; /* Forces table to grow to the bottom */
               table-layout: fixed; /* Ensures column widths are respected */
             }
   
             .items-table th, .items-table td {
               border: 1px solid #000;
               padding: 6px 4px;
               word-wrap: break-word; /* Prevents text overflow */
               overflow: hidden;
             }
   
             .items-table thead th {
               background-color: #f2f2f2 !important;
               font-size: 11px;
             }
   
             /* The magic row: it consumes all remaining vertical space */
             .spacer-row td {
               height: 100%;
               border-bottom: 1px solid #000;
             }
   
             /* Ensure table rows don't break awkwardly across pages */
             tr {
               page-break-inside: avoid;
             }
   
             .footer-section {
               page-break-inside: avoid;
             }
   
             table {
               width: 100%;
               border-collapse: collapse;
             }
           </style>
         </head>
         <body>
           <div class="print-container">
             ${printContent}
           </div>
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

  const groupByGroupTypeAndTraderWeek = (data) => {
    // Check if data exists and is an array
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    const groupedData = [];

    data.forEach((groupItem) => {
      // Check if trader_statement exists and is an array
      if (
        groupItem.trader_statement &&
        Array.isArray(groupItem.trader_statement)
      ) {
        groupItem.trader_statement.forEach((trader) => {
          // Check if trader_statement_data exists and is an array
          if (
            trader.trader_statement_data &&
            Array.isArray(trader.trader_statement_data)
          ) {
            trader.trader_statement_data.forEach((weekData) => {
              groupedData.push({
                group_type: groupItem.group_type,
                group_id: groupItem.group_id,
                trader_id: trader.trader_id,
                user_id: trader.user_id,
                mobile_number: trader.mobile_number,
                trader_name: trader.trader_name,
                week: weekData.week,
                trader_statement_data: weekData.records || [],
              });
            });
          }
        });
      }
    });

    return groupedData;
  };
  const groupedPrintData = groupByGroupTypeAndTraderWeek(printData || []);

  const sortedDates = printData
    .map((item) => item.date_wise_selling)
    .sort((a, b) => new Date(a) - new Date(b));
  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-");
  };

  const start_date = formattedDate(sortedDates[0]);
  const end_date = formattedDate(sortedDates[sortedDates.length - 1]);

  useEffect(() => {
    const newSuggestions = searchFilterData?.map((row) => {
      return `${row.group_type}`;
    });
    setSuggestions(newSuggestions);
  }, [searchFilterData]);

  return (
    <>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid item={12} sx={{ width: "100%" }}>
          <GroupReportTable
            pageNumber={pageNumber}
            pageCount={pageCount}
            tableHead={tableHead}
            tableRow={td_data_set}
            searchInput={searchInput}
            setSearchValue={setsearchInput}
            onSearchButtonClick={handleSearchInputChange}
            heading={"Group Wise Report"}
            limitEnd={limitEnd}
            setLimitEnd={setLimitEnd}
            setAnchorEl2={setAnchorEl2}
            singleProduct={singleProduct}
            setSingleProduct={setSingleProduct}
            onDelete={onDelete}
            FilterComponent={FilterComponent}
            HandleExportExcel={HandleExportExcel}
            HandleExportPdf={HandleExportPdf}
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
            createHeading={"Reports"}
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
            quantity_filter={false}
            total_status={false}
            showTotals={true}
            totalData={totalData}
          />
        </Grid>
      </Grid>

      <div style={{ display: "none" }}>
        <div
          ref={mulitpleRef}
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "18px",
            width: "4in",
          }}
        >
          {groupedPrintData && groupedPrintData.length > 0 ? (
            groupedPrintData.map((traderWeekData, index) => (
              <div key={index} style={{ pageBreakInside: "avoid" }}>
                {/* Header */}
                <section
                  style={{
                    border: "1px solid #000",
                    borderBottom: "none",
                    width: "100%",
                    margin: 0,
                    padding: "6px 0px",
                    boxSizing: "border-box", // Ensures padding doesn't push the border out
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    alignItems: "center",
                  }}
                >
                  {/* Left Section: Logo */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: "20px",
                      height: "100px",
                      weight: "100px",
                    }}
                  >
                    <Logo />
                  </div>

                  {/* Middle Section: Company Information */}
                  <div style={{ textAlign: "center" }}>
                    <h1
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "20px",
                        fontWeight: "700",
                        letterSpacing: "1px",
                      }}
                    >
                      S.D.M MAHENDRAN
                    </h1>

                    <p style={{ margin: "1px 0", fontSize: "13px" }}>
                      Karatoor Road, Sathyamangalam
                    </p>
                    <p style={{ margin: "1px 0", fontSize: "13px" }}>
                      Erode - 638401
                    </p>

                    <div style={{ marginTop: "2px", fontSize: "13px" }}>
                      <p style={{ margin: "0" }}>Ph.No: 94424 98222</p>
                      {/* Aligned below the first number as per sketch */}
                      <p style={{ margin: "0", paddingLeft: "42px" }}>
                        80728 87930
                      </p>
                    </div>

                    <p
                      style={{
                        marginTop: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      GST NO: 33BDXPC4945B1ZM
                    </p>
                  </div>
                </section>

                <table
                  style={{
                    border: "1px solid #000",
                    borderBottom: "none",
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <colgroup>
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "90%" }} />
                  </colgroup>
                  <tbody>
                    <tr
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <td
                        style={{
                          padding: "3px",
                          fontWeight: "normal",
                          textAlign: "left",
                        }}
                      >
                        No : 19065
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: "normal",
                        }}
                      >
                        GROUP REPORT
                      </td>

                      <td
                        style={{
                          fontWeight: "normal",
                          textAlign: "right",
                        }}
                      >
                        BILL DATE :{" "}
                        {new Date(
                          traderWeekData.date_wise_selling || new Date()
                        )
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={3} style={{ padding: "4px 6px" }}>
                        {/* First Line */}
                        <div>
                          <strong>To:</strong>{" "}
                          {traderWeekData.trader_name || "SDM"}
                        </div>

                        {/* Second Line - Right aligned */}
                        <div style={{ textAlign: "right" }}>
                          PH No : {traderWeekData.mobile_number || "மல்லி"}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="items-wrapper" style={{ borderTop: "none" }}>
                  <table className="items-table" style={{ borderTop: "none" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "18%" }}>DATE</th>
                        <th style={{ width: "27%" }}>PARTICULARS</th>
                        <th style={{ width: "10%" }}>QTY</th>
                        <th style={{ width: "12%" }}>RATE</th>
                        <th style={{ width: "15%" }}>AMT</th>
                        <th style={{ width: "15%" }}>LUGGAGE</th>
                      </tr>
                    </thead>

                    <tbody>
                      {traderWeekData.trader_statement_data?.map(
                        (item, idx) => (
                          <tr
                            key={`${traderWeekData.trader_id}-${item.date_wise_selling}-${idx}`}
                            style={{
                              fontSize: "12px",
                              textAlign: "center",
                            }}
                          >
                            <td>{item.date_wise_selling || ""}</td>
                            <td style={{ textAlign: "left" }}>
                              {item.flower_type || "மல்லி"}
                            </td>
                            <td>{item.quantity || ""}</td>
                            <td>{item.per_quantity || 0}</td>
                            <td>{item.total_amount || 0}</td>
                            <td>{item.luggage || 0}</td>
                          </tr>
                        )
                      ) || []}
                      <tr className="spacer-row">
                        <td colSpan="6"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <table
                  style={{
                    width: "100%",
                    border: "1px solid #000",
                    borderTop: "none",
                    borderCollapse: "collapse",
                    tableLayout: "fixed",
                    fontSize: "13px",
                  }}
                >
                  <colgroup>
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "15%" }} />
                  </colgroup>
                  <tr key={index}>
                    <td></td>
                    <td style={{ padding: "6px", fontWeight: "normal" }}>
                      TOTAL
                    </td>
                    <td
                      style={{
                        padding: "6px",
                        textAlign: "center",
                        fontWeight: "normal",
                      }}
                    >
                      {traderWeekData.trader_statement_data
                        ?.reduce((sum, item) => sum + (item.quantity || 0), 0)
                        .toFixed(2)}
                    </td>
                    <td></td>
                    <td
                      style={{
                        padding: "6px",
                        textAlign: "center",
                        fontWeight: "normal",
                      }}
                    >
                      {traderWeekData.trader_statement_data
                        ?.reduce(
                          (sum, item) => sum + (item.total_amount || 0),
                          0
                        )
                        .toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "6px",
                        textAlign: "center",
                        fontWeight: "normal",
                      }}
                    >
                      {traderWeekData.trader_statement_data
                        ?.reduce((sum, item) => sum + (item.luggage || 0), 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                </table>
                <table
                  style={{
                    width: "100%",
                    border: "1px solid #000",
                    borderTop: "none",
                    borderCollapse: "collapse",
                    tableLayout: "auto",
                    fontSize: "13px",
                  }}
                >
                  <tbody>
                    {/* TERMS + GRAND TOTAL */}
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          padding: "6px",
                          verticalAlign: "top",
                          borderRight: "1px solid #000",
                          borderBottom: "1px solid #000",
                        }}
                      >
                        1. GOOD ONCE SOLD CANNOT BE TAKEN BACK.
                        <br />
                        <span style={{ whiteSpace: "nowrap" }}>
                          2. SUBJECT TO MARKET RISK.
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "6px",
                          verticalAlign: "middle",
                          fontWeight: "bold",
                          borderBottom: "1px solid #000",
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        GRANT TOTAL:
                        {(() => {
                          const grandTotal =
                            traderWeekData.trader_statement_data?.reduce(
                              (sum, item) =>
                                sum +
                                ((item.total_amount || 0) +
                                  (item.luggage || 0)),
                              0
                            ) || 0;
                          return grandTotal.toFixed(2);
                        })()}
                      </td>
                    </tr>

                    {/* AMOUNT IN WORDS */}
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: "6px",
                          borderBottom: "1px solid #000",
                        }}
                      >
                        <strong>Amount in Words :</strong> Rs: Three Thousand
                        Four Hundred And Fifty Only.
                      </td>
                    </tr>

                    {/* SIGNATURE ROW */}
                    <tr>
                      <td
                        colSpan={2}
                        style={{
                          padding: "30px 6px 6px 6px",
                          verticalAlign: "bottom",
                        }}
                      >
                        Customer Signature
                      </td>

                      <td
                        colSpan={2}
                        style={{
                          padding: "30px 6px 6px 6px",
                          textAlign: "right",
                          verticalAlign: "bottom",
                        }}
                      >
                        Authorised Signatory
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* Tamil Note */}
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    marginTop: "5px",
                  }}
                >
                  ஒரு விவசாயியின் உழைப்பே ஆயிரம் மலர்களின் வாசனை.
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              No data available for printing
            </div>
          )}
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

export default GroupReport;
