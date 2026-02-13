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
import Cookies from "js-cookie";
import Grid from "@mui/material/Grid2";
import { axiosGet, axiosPost } from "../../../../lib/api";
import { useRouter } from "next/navigation";
import { formattedDate } from "../../../../utils/utils";
import DeleteSalesDialog from "../../../components/common-components/DeleteSalesDialog";
import PDFGenerateLandscape from "../../../components/common-components/PDFGenerateLandscape";
import { useForm, Controller } from "react-hook-form";
import CustomAutoCompleteFilters from "../../../components/createcomponents/CustomAutoCompleteFilters";
import { fetchDateSingle } from "../../../../lib/getAPI/apiFetch";
import SalesPrint from "../../../components/common-components/SalesPrint";
import { useReactToPrint } from "react-to-print";
import ReusableModal from "../../../components/common-components/Modal";
import PaidStatusModal from "../../../components/common-components/PaidStatusModal";
import SalesTable from "../../../components/tables/SalesTable";
import Logo from "../../../../@core/svg/Logo";

const AllSales = () => {
  useEffect(() => {
    document.title = "SDM SALE";
  }, []);

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
  const [activeStatus, setactiveStatus] = useState(1);
  const [paidStatus, setpaidStatus] = useState(0);
  const [singleProduct, setSingleProduct] = useState();
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [dataCount, setdataCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [orderField, setOrderField] = useState("created_date");
  const [orderType, setOrderType] = useState("desc");
  const [createdStartDate, setCreatedStartDate] = useState("");
  const [createdEndDate, setCreatedEndDate] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState(3);
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [effectToggle, setEffectToggle] = useState(false);
  const [singleData, setSingleData] = useState([]);
  const [resetDialogopen, setResetDialogOpen] = useState(false);
  const [singleDataJson, setSingleDataJson] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openPrint, setOpenPrint] = useState(false);
  const [open, setOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const [dateTitle, setDateTitle] = useState("Choose Date Of Selling");
  const [isDateSelected, setIsDateSelected] = useState(false);

  const theme = useTheme();

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const onCreatedDateChange = (data) => {
    const formattedStartDate = formatDate(data[0].startDate);
    const formattedEndDate = formatDate(data[0].endDate);
    setCreatedStartDate(formattedStartDate);
    setCreatedEndDate(formattedEndDate);
    setDateTitle(`${formattedStartDate} - ${formattedEndDate}`);
    setPageNumber(1);
    setIsDateSelected(true);
  };

  const handleStatusChange = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      // data_ids: [singleDataJson?.data_uniq_id],
      data_uniq_id: singleDataJson?.data_uniq_id,
      paid_status: singleDataJson?.paid_status === 1 ? 0 : 1,
    };
    axiosPost
      .post(`sales/payment/update`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        setAlertMessage("Updated successfully.");
        setAlertVisible(true);
        setAlertSeverity("success");
        fetchData();
        handleClose();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handlePaidStatusChange = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      // data_ids: [singleDataJson?.data_uniq_id],
      data_uniq_id: [singleDataJson?.data_uniq_id],
      balance_amount: 0,
    };
    axiosPost
      .post(`sales/balanceamt/update`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        setAlertMessage("Updated successfully.");
        setAlertVisible(true);
        setAlertSeverity("success");
        fetchData();
        handleStatusClose();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Function to close the modal
  const handleClose = () => setOpen(false);
  const handleStatusClose = () => setStatusOpen(false);

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

  const [flowerTypeMaster, setflowerTypeMaster] = useState([]);

  const HandleFlowerTypeMaster = () => {
    fetchDateSingle("master/flower_type/get", setflowerTypeMaster, {
      access_token: ACCESS_TOKEN,
      search_input: "",
      from_date: "",
      to_date: "",
      active_status: 1,
      items_per_page: 10000,
    });
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
    HandleFlowerTypeMaster();
    HandleGroupMaster();
  }, []);

  const [flowerTypeID, setflowerTypeID] = useState("");
  const [flowerType, setflowerType] = useState("");
  const [cashTypeID, setcashTypeID] = useState("");
  const [cashTypeName, setcashTypeName] = useState("");

  const ChangeFlowerTypeMaster = (event, value) => {
    if (value != null) {
      setflowerTypeID(value.data_uniq_id);
      setflowerType(value.flower_type);
    } else {
      setflowerTypeID("");
      setflowerType("");
    }
    setPageNumber(1);
  };

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
      if (selectedItems.includes("Trader"))
        formattedData["Trader Name"] =
          String(item.trader_user_id + "-" + item.trader_name) || "---";
      if (selectedItems.includes("Date")) {
        const date = item.date_wise_selling
          ? new Date(item.date_wise_selling)
          : null;
        const formattedDate = date
          ? `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear()).slice(-2)}`
          : "---";
        formattedData["Date"] = formattedDate;
      }
      if (selectedItems.includes("Time"))
        formattedData["Time"] =
          (String(item.time_wise_selling) || "---") + "   " + " " + "  "; // Adding spaces
      if (selectedItems.includes("Flower Type"))
        formattedData["Flower Type"] = String(item.flower_type_name) || "---";
      if (selectedItems.includes("Cash Type"))
        formattedData["C.Type"] = String(item.payment_type) || "---";
      if (selectedItems.includes("Trader"))
        formattedData["T.Name"] = String(item.trader_name) || "---";

      if (selectedItems.includes("Quantity"))
        formattedData["Quantity"] = String(
          Number(item.quantity || 0).toFixed(2),
        );
      if (selectedItems.includes("Price Per Quantity"))
        formattedData["Price"] = String(
          Number(item.per_quantity || 0).toFixed(2),
        );
      if (selectedItems.includes("Discount"))
        formattedData["Disc."] = String(
          (
            ((item?.quantity * item?.per_quantity) / 100) * item?.discount || 0
          ).toFixed(2),
        );
      if (selectedItems.includes("Premium"))
        formattedData["Premium"] = String(
          Number(item.premium_amount * item.quantity || 0).toFixed(2),
        );
      if (selectedItems.includes("Sum Amount"))
        formattedData["S.Amt"] = String(
          Number(item.sub_amount || 0).toFixed(2),
        );

      if (selectedItems.includes("Total Amount"))
        formattedData["Total Amount"] = String(
          Number(item.total_amount || 0).toFixed(2),
        );

      return formattedData;
    });
  };

  const fetchExportManualData = (type, data) => {
    const selectedLabels = selectedOptions.map((item) => item.label);
    const exportData = filterDataSelectedData(data, selectedLabels);
    const summaryFields = [
      "Quantity",
      "S.Amt",
      "Toll",
      "Total Amount",
      "Price",
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
        title: "Sale-Details",
        name: "Sale",
        summaryFields,
      });
      setIsPdfLoading(false);
    }
  };

  const fetchExportData = async (type) => {
    axiosGet
      .get(
        `sales/sales_order/get?access_token=${ACCESS_TOKEN}&items_per_page=10000&search_input=${searchValue}&date_wise_selling=${createdStartDate}&to_date_wise_selling=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&flower_type_id=${flowerTypeID}&payment_type=${cashTypeName}`,
      )
      .then((response) => {
        let data = response?.data?.data;
        const selectedLabels = selectedOptions.map((item) => item.label);
        const exportData = filterDataSelectedData(data, selectedLabels);
        const summaryFields = [
          "Quantity",
          "S.Amt",
          "Toll",
          "Total Amount",
          "Price",
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
            title: "Sale-Details",
            name: "Sale",
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

  const fetchExcelData = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User");

    XLSX.writeFile(workbook, `Sale-Details-${formattedDate}.xlsx`);
  };

  const HandleEditFormer = () => {
    Cookies.set("data_uniq_id", singleDataJson?.data_uniq_id);
    router.push("/sales/edit");
  };

  const HandleViewFormer = () => {
    Cookies.set("data_uniq_id", singleDataJson?.data_uniq_id);
    router.push("/sales/view");
  };

  const HandleRouteCreate = () => {
    router.push("/sales/create");
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true), setAnchorEl2(null);
  };

  const handleDeleteDialogClose = () => setDeleteDialogOpen(false);

  const handlePrintDialogCloseSuccess = () => setOpenPrint(false);

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const [searchInput, setsearchInput] = useState("");

  const handleSearchInputChange = (input) => {
    setSearchValue(input);
    setPageNumber(1);
  };

  const handleSearchFinal = (e) => {
    e.preventDefault();
    setSearchValue(searchInput);
    setPageNumber(1);
  };

  // Function to open the modal
  const handleOpen = () => {
    setOpen(true), setAnchorEl2(null);
  };
  const handleStatusOpen = () => {
    setStatusOpen(true), setAnchorEl2(null);
  };

  const fetchData = async (field = orderField, type = orderType) => {
    let searchFinal = "";
    if (searchValue === undefined) {
      searchFinal = searchInput;
    } else {
      searchFinal = searchValue;
    }

    axiosGet
      .get(
        `sales/sales_order/get?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=${searchFinal}&date_wise_selling=${createdStartDate}&to_date_wise_selling=${createdEndDate}&order_type=${type}&order_field=${field}&flower_type_id=${flowerTypeID}&payment_type=${cashTypeName}&group_id=${groupID}`,
      )
      .then((response) => {
        setData(response.data.data);
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
        `employee_get?access_token=${ACCESS_TOKEN}&items_per_page=10000&user_type_not=4&order_type=ASC&order_field=user_type`,
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
        `sales/sales_order/filter/get?access_token=${ACCESS_TOKEN}&items_per_page=10000`,
      )
      .then((response) => {
        setFilterData(response.data.data);
        const FilteredData = items?.filter((res) =>
          response.data.data.some((item) => item.label === res.label),
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

  const handleRefresh = () => {
    setflowerTypeID("");
    setflowerType("");
    setcashTypeID("");
    setcashTypeName("");
    setSelectedDate("");
    setPageNumber(1);
    setSearchValue("");
    setsearchInput("");
    setDateTitle("Choose Date Of Selling");
    setCreatedStartDate("");
    setCreatedEndDate("");
  };

  useEffect(() => {
    fetchFilterData();
  }, []);

  useEffect(() => {
    fetchData();
    fetchDataFilter();
  }, [
    ACCESS_TOKEN,
    pageNumber,
    limitEnd,
    searchValue,
    createdStartDate,
    createdEndDate,
    activeStatusFilter,
    flowerTypeID,
    cashTypeName,
    groupID,
  ]);

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
      label: "Trader",
      value: "trader_name",
      fieldName: "trader_name",
    },
    // {
    //   id: 3,
    //   label: "Group Type",
    //   value: "group_type",
    //   fieldName: "group_type",
    // },
    {
      id: 2,
      label: `Date`,
      value: "date_wise_selling",
      fieldName: "date_wise_selling",
    },
    {
      id: 3,
      label: `Time`,
      value: "time_wise_selling",
      fieldName: "time_wise_selling",
    },
    {
      id: 4,
      label: `Flower Type`,
      value: "flower_type_name",
      fieldName: "flower_type_name",
    },
    {
      id: 9,
      label: "Quantity",
      value: "quantity",
      fieldName: "quantity",
    },
    {
      id: 10,
      label: "Price Per Quantity",
      value: "per_quantity",
      fieldName: "per_quantity",
    },
    {
      id: 11,
      label: "Total Amount",
      value: "sub_amount",
      fieldName: "sub_amount",
    },
    {
      id: 12,
      label: "Discount",
      value: "discount",
      fieldName: "discount",
    },
    {
      id: 13,
      label: "Premium",
      value: "premium_amount",
      fieldName: "premium_amount",
    },
    {
      id: 14,
      label: "Luggage Amount",
      value: "luggage",
      fieldName: "luggage_amount",
    },
    {
      id: 15,
      label: "Net Amount",
      value: "total_amount",
      fieldName: "total_amount",
    },
    {
      id: 16,
      label: "Status",
      value: "status",
      fieldName: "status",
    },
  ];

  const td_data_set = [];

  data?.map((item, index) => {
    const array_data = {
      id: item.data_uniq_id,
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
              <Typography fontSize="14px">
                {item.trader_user_id}-{item.trader_nick_name || " "}
              </Typography>
            </Box>
          ),
          label: "Trader",
          id: 2,
        },
        // {
        //   td: (
        //     <Box>
        //       <Typography fontSize="14px">
        //         {item.trader_user_id}-{item.trader_nick_name || " "}
        //       </Typography>
        //     </Box>
        //   ),
        //   label: "Trader",
        //   id: 2,
        // },
        // {
        //   td: (
        //     <Box>
        //       <Typography fontSize="14px">
        //         {item.group_type || "---"}
        //       </Typography>
        //     </Box>
        //   ),
        //   label: "Group Type",
        //   id: 2,
        // },
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
          id: 3,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px" textTransform="capitalize">
                {item.time_wise_selling || "---"}
              </Typography>
            </Box>
          ),
          label: "Time",
          id: 4,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px" textTransform="capitalize">
                {item.flower_type_name || "---"}
              </Typography>
            </Box>
          ),
          label: "Flower Type",
          id: 5,
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
          id: 6,
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
          id: 7,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {(item?.quantity * item?.per_quantity).toFixed(2)}
              </Typography>
            </Box>
          ),
          label: "Total Amount",
          id: 8,
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
          id: 9,
        },
        // {
        //   td: (
        //     <Box>
        //       <Typography fontSize="14px">
        //         {Number(item.toll_amount || 0).toFixed(2)}
        //       </Typography>
        //     </Box>
        //   ),
        //   label: "Toll",
        //   id: 14,
        // },
        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {Number(item.total_amount || 0).toFixed(2)}
              </Typography>
            </Box>
          ),
          label: "Net Amount",
          id: 10,
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
    { value: 2, label: "Time" },
    { value: 3, label: "Flower Type" },
    // { value: 4, label: "Group Type" },
    { value: 5, label: "Trader" },
    // { value: 7, label: "Employee" },
    { value: 8, label: "Quantity" },
    { value: 9, label: "Price Per Quantity" },
    { value: 10, label: "Total Amount" },
    // { value: 11, label: "Premium" },
    { value: 12, label: "Luggage Amount" },
    // { value: 13, label: "Toll" },
    { value: 14, label: "Net Amount" },
    { value: 15, label: "Status" },
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
        .post("sales/sales_order/filter", jsonData)
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
          .post("sales/sales_order/filter", uncheckData)
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

  const handleDialog = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      data_ids: [singleDataJson?.data_uniq_id],
    };
    axiosPost
      .post(`sales/sales_order/delete`, jsonData)
      .then((response) => {
        if (response.data.action === "success") {
          setError({ status: "success", message: response.data.message });
          setEffectToggle(!effectToggle);
          handleDeleteDialogClose();
          fetchData();
          setSelectedItems([]);
          setActionData("");
          r;

          setIsLoading(false);

          setAlertMessage("Deleted successfully.");
          setAlertVisible(true);
          setAlertSeverity("success");
          handleClose2();
          setSelectAll(false);
        } else if (response.data.action === "error_group") {
          setIsLoading(false);

          seterrorsMessage(response.data.message);
        } else {
          setIsLoading(false);

          setError({ status: "error", message: response.data.message });
        }
      })
      .catch((error) => {
        // Handle errors here

        setIsLoading(false);

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

  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [selectedDataIds, setSelectedDataIds] = useState([]);

  const handleBulkStatusOpen = () => {
    // Get selected data IDs
    const selectedIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id],
    );
    setSelectedDataIds(selectedIds);
    setBulkStatusOpen(true);
  };

  const handleBulkStatusClose = () => {
    setBulkStatusOpen(false);
    setSelectedDataIds([]);
  };

  // Add this function to handle bulk payment status change
  const handleBulkPaidStatusChange = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      data_uniq_id: selectedDataIds,
      balance_amount: 0,
    };
    axiosPost
      .post(`sales/balanceamt/update`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        setAlertMessage(
          "Payment status updated successfully for selected items.",
        );
        setAlertVisible(true);
        setAlertSeverity("success");
        fetchData();
        handleBulkStatusClose();
        // Clear selections after successful update
        setSelectedItems({});
        setSelectAll(false);
        setSelectedDataIds([]);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
        setAlertMessage("Error updating payment status.");
        setAlertVisible(true);
        setAlertSeverity("error");
      });
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
        <Grid item xs={12} sm={4}>
          <Controller
            name="flower type"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <>
                {renderLabel("Flower Type", false)}
                <CustomAutoCompleteFilters
                  id="select-status"
                  sx={{ width: "300px" }}
                  label="Flower Type"
                  value={
                    flowerTypeMaster?.find(
                      (year) => year.flower_type === flowerType,
                    ) || null
                  }
                  onChange={(e, value) =>
                    ChangeFlowerTypeMaster(e.target.value, value)
                  }
                  options={flowerTypeMaster}
                  option_label={(option) =>
                    typeof option === "string"
                      ? option
                      : option.flower_type || ""
                  }
                />
              </>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="Group"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <>
                {renderLabel("Group", false)}
                <CustomAutoCompleteFilters
                  id="select-status"
                  sx={{ width: "300px" }}
                  label="Group"
                  value={
                    groupMaster?.find(
                      (year) => year.group_type === groupName,
                    ) || null
                  }
                  onChange={(e, value) =>
                    ChangeGroupMaster(e.target.value, value)
                  }
                  options={groupMaster}
                  option_label={(option) =>
                    typeof option === "string"
                      ? option
                      : option.group_type || ""
                  }
                />
              </>
            )}
          />
        </Grid>

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
                      (item) => item.label === option.label,
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
        <Grid item xs={12} sm={4} sx={{ mt: 5 }}>
          <Box>
            <Button
              variant="contained"
              color="primary"
              disabled={Object.keys(selectedItems).length === 0}
              onClick={handleBulkStatusOpen}
              sx={{
                opacity: Object.keys(selectedItems).length === 0 ? 0.5 : 1,
                pointerEvents:
                  Object.keys(selectedItems).length === 0 ? "none" : "auto",
              }}
            >
              Change Payment Status
            </Button>
          </Box>
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

  function isBeforeThan48Hours(createdDate) {
    const createdTime = new Date(createdDate);
    const now = new Date();
    const diffHours = (now - createdTime) / (1000 * 60 * 60);
    return diffHours <= 96;
  }

  const isCreditConditionMet =
    singleDataJson?.payment_type === "Credit"
      ? Number(singleDataJson?.balance_amount) +
          Number(singleDataJson?.payment_advance_amount) ===
          singleDataJson?.sub_amount &&
        isBeforeThan48Hours(singleDataJson?.created_date)
      : isBeforeThan48Hours(singleDataJson?.created_date);

  const isActionAllowed = isCreditConditionMet;

  const MenuComponent = (rowId) => {
    return (
      <List sx={{ p: 0, fontSize: "12px" }}>
        <MenuItem onClick={HandleViewFormer}>View</MenuItem>
        <MenuItem onClick={handlePrint}>Print</MenuItem>
        {/* <MenuItem onClick={handleOpen}>Change Status</MenuItem> */}
        <MenuItem onClick={handleStatusOpen}>Payment Status</MenuItem>

        <MenuItem
          onClick={HandleEditFormer}
          // disabled={!isActionAllowed}
          sx={{
            opacity: 1,
            pointerEvents: "auto",
          }}
        >
          Edit
        </MenuItem>

        <MenuItem
          onClick={isActionAllowed ? handleDeleteDialogOpen : undefined}
          disabled={!isActionAllowed}
          sx={{
            opacity: 1,
            pointerEvents: "auto",
          }}
        >
          Delete
        </MenuItem>
      </List>
    );
  };

  useEffect(() => {
    const newSuggestions = searchFilterData?.map((row) => {
      return `${row.user_id}--${row.first_name}`;
    });
    setSuggestions(newSuggestions);
  }, [searchFilterData]);

  const componentRef = useRef();

  const handlePrint = () => {
    handleClose2();
    const printContent = componentRef.current.innerHTML;
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
      }, 250);
    };
  };

  const numberToWords = (num) => {
    const words = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const scales = ["", "Thousand", "Lakh", "Crore"];

    if (num === 0) return "Zero";

    const convertBelowThousand = (n) => {
      if (n === 0) return "";
      if (n < 20) return words[n];
      if (n < 100)
        return tens[Math.floor(n / 10)] + (n % 10 ? " " + words[n % 10] : "");
      return (
        words[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + convertBelowThousand(n % 100) : "")
      );
    };

    let result = "";
    let scaleIndex = 0;

    while (num > 0) {
      let part = num % (scaleIndex === 1 || scaleIndex === 2 ? 100 : 1000);
      if (part > 0) {
        let chunk =
          convertBelowThousand(part) +
          (scales[scaleIndex] ? " " + scales[scaleIndex] : "");
        result = chunk + (result ? " " + result : "");
      }
      num = Math.floor(
        num / (scaleIndex === 1 || scaleIndex === 2 ? 100 : 1000),
      );
      scaleIndex++;
    }

    return result.trim();
  };

  const grantTotalAmount = singleDataJson.luggage + singleDataJson.total_amount;

  // const totalSum = rows.reduce((sum, row) => sum + row.total, 0);
  const grantTotalInWords = numberToWords(grantTotalAmount);

  return (
    <>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid item={12} sx={{ width: "100%" }}>
          <SalesTable
            pageNumber={pageNumber}
            pageCount={pageCount}
            tableHead={tableHead}
            tableRow={td_data_set}
            actionPrivilege={true}
            searchInput={searchInput}
            setSearchValue={setsearchInput}
            onSearchButtonClick={handleSearchInputChange}
            heading={"Sales"}
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
            createHeading={"Sales"}
            dateTitle={dateTitle}
            onCreatedDateChange={onCreatedDateChange}
            setPageNumber={setPageNumber}
          />
        </Grid>
      </Grid>

      <ReusableModal
        open={open}
        onsubmit={handleStatusChange}
        onClose={handleClose}
        activeStatus={activeStatus}
        setactiveStatus={setactiveStatus}
        singleProduct={singleProduct}
        setSingleProduct={setSingleProduct}
        actionData={singleDataJson?.active_status}
        type="Trader"
        text={`Are you sure want you to ${
          singleDataJson?.active_status !== 0 ? "disable" : "enable"
        } trader?`}
      />
      <PaidStatusModal
        open={statusOpen}
        onsubmit={handlePaidStatusChange}
        onClose={handleStatusClose}
        activeStatus={paidStatus}
        setactiveStatus={setpaidStatus}
        singleProduct={singleProduct}
        setSingleProduct={setSingleProduct}
        actionData={singleDataJson?.active_status}
        type="Trader"
        text={`Are you sure want to change payment status ?`}
      />

      <PaidStatusModal
        open={bulkStatusOpen}
        onsubmit={handleBulkPaidStatusChange}
        onClose={handleBulkStatusClose}
        activeStatus={paidStatus}
        setactiveStatus={setpaidStatus}
        singleProduct={null} // Not needed for bulk operation
        setSingleProduct={setSingleProduct}
        actionData={null} // Not needed for bulk operation
        type="Bulk Payment"
        text={`Are you sure  want to change payment status for ${selectedDataIds.length} selected items?`}
      />

      <div style={{ display: "none" }}>
        <div
          ref={componentRef}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Header Section */}
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
                marginLeft: "0px",
                height: "100px",
                weight: "100px",
              }}
            >
              <Logo />
            </div>

            {/* Middle Section: Company Information */}
            <div style={{ textAlign: "left", marginLeft: "40px" }}>
              <h1
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "28px",
                  fontWeight: "",
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
                <p style={{ margin: "0", paddingLeft: "42px" }}>80728 87930</p>
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
                  fontSize: "13px",
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
                  TRADER BILL
                </td>

                <td
                  style={{
                    fontWeight: "normal",
                    textAlign: "right",
                  }}
                >
                  BILL DATE : 10-02-2026
                </td>
              </tr>

              <tr>
                <td colSpan={3} style={{ padding: "4px 6px" }}>
                  {/* First Line */}
                  <div>
                    <strong>To:</strong>{" "}
                    <span style={{ fontWeight: 600 }}>
                      {" "}
                      {singleDataJson?.trader_name || "Saiii Tharaaa"}
                    </span>
                  </div>

                  {/* Second Line - Right aligned */}
                  <div style={{ textAlign: "right" }}>
                    PH No : {singleDataJson?.phone || "9865044455"}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Items Table */}
          <div className="items-wrapper" style={{ borderTop: "none" }}>
            <table className="items-table" style={{ borderTop: "none" }}>
              <thead>
                <tr>
                  <th style={{ width: "16%" }}>DATE</th>
                  <th style={{ width: "27%" }}>PARTICULARS</th>
                  <th style={{ width: "10%" }}>QTY</th>
                  <th style={{ width: "12%" }}>RATE</th>
                  <th style={{ width: "15%" }}>AMOUNT</th>
                  <th style={{ width: "15%" }}>LUGGAGE</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ fontSize: "12px", textAlign: "center" }}>
                  <td>{singleDataJson.date_wise_selling}</td>
                  <td style={{ textAlign: "left", fontWeight: "normal" }}>
                    {singleDataJson?.flower_type_name || "Not found"}
                  </td>
                  <td>{singleDataJson.quantity}</td>
                  <td>{singleDataJson.per_quantity}</td>
                  <td>{singleDataJson.total_amount}</td>
                  <td>{singleDataJson.luggage}</td>
                </tr>

                {/* IMPORTANT: The Spacer Row */}
                {/* Add this row after your map() or data row. It pushes the footer down. */}
                <tr className="spacer-row">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Section - This will now stay at the bottom */}
          {/* GRAND TOTAL + TERMS SECTION */}
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
              <col style={{ width: "13%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "5%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <tr style={{ borderBottom: "1px solid #000" }}>
              <td></td>
              <td style={{ padding: "5px" }}>Total Qty</td>
              <td style={{ padding: "5px", textAlign: "center" }}>
                {singleDataJson.quantity}
              </td>
              <td></td>
              <td style={{ padding: "5px", textAlign: "center" }}>
                {singleDataJson.total_amount}
              </td>
              <td style={{ padding: "5px", textAlign: "center" }}>
                {singleDataJson.luggage}
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
                    fontWeight: "bolder",
                    borderBottom: "1px solid #000",
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    fontSize: "18px",
                  }}
                >
                  GRANT TOTAL: {grantTotalAmount}
                </td>
              </tr>

              {/* AMOUNT IN WORDS */}
              <tr>
                <td
                  colSpan={4}
                  style={{ padding: "6px", borderBottom: "1px solid #000" }}
                >
                  <strong>
                    Amount in Words : Rs: {grantTotalInWords} Only.
                  </strong>
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
        title={"Delete Sale"}
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

export default AllSales;
