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
      .post(`purchaseorder/payment/update`, jsonData)
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
      .post(`purchaseorder/balanceamt/update`, jsonData)
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
      id: 5,
      label: `Cash Type`,
      value: "payment_type",
      fieldName: "payment_type",
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
      label: "Commission Amount",
      value: "commission_amount",
      fieldName: "commission_amount",
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
          id: 2,
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
          id: 3,
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
          id: 4,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {item.payment_type || "---"}
              </Typography>
            </Box>
          ),
          label: "Cash Type",
          id: 5,
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
          id: 6,
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
          id: 9,
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
          id: 10,
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
          id: 11,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {Number(item?.premium_amount * item?.quantity || 0).toFixed(2)}
              </Typography>
            </Box>
          ),
          label: "Premium",
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
          id: 15,
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
    { value: 12, label: "Commission Amount" },
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
      .post(`purchaseorder/balanceamt/update`, jsonData)
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

  const componentRef = useRef();

  // const handlePrint = () => {
  //   handleClose2();
  //   const printContent = componentRef.current.innerHTML;
  //   const iframe = document.createElement("iframe");

  //   document.body.appendChild(iframe);
  //   const doc = iframe.contentWindow.document;
  //   doc.open();
  //   doc.write("<html><head><title></title>");
  //   doc.write("</head><body>");
  //   doc.write(printContent);
  //   doc.write("</body></html>");
  //   doc.close();

  //   iframe.contentWindow.focus();
  //   iframe.contentWindow.print();
  //   document.body.removeChild(iframe);
  // };

  const handlePrint = () => {
    handleClose2();
    const printContent = componentRef.current.innerHTML;
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
          @page {
            size: auto;
            margin: 0;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);
    doc.close();

    // Wait until the iframe's content is rendered before printing
    iframe.onload = function () {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
      }, 250); // 250ms delay, adjust if needed
    };
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
      {/* <div style={{ display: "none" }}>
        <div
          ref={componentRef}
          style={{
            textAlign: "center",
            fontSize: "12px",
            width: "6in",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "24px",
            }}
          >
            S.D.M. Mahendran
          </div>
          <div
            style={{
              marginTop: "5px",
              fontWeight: "bold",
              textAlign: "center",
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
              fontWeight: "semibold",
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            Sales BILL RECEIPT
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
              marginTop: "5px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              Date:
              <span style={{ fontWeight: "bold" }}>
                {singleDataJson?.date_wise_selling
                  ? new Date(singleDataJson?.date_wise_selling)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")
                  : ""}
              </span>
            </div>
            <div>
              Time:{" "}
              <span style={{ fontWeight: "bold", paddingRight: "15px" }}>
                {singleDataJson?.time_wise_selling
                  ? new Date(
                      `1970-01-01T${singleDataJson.time_wise_selling}`,
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true, // ✅ 12-hour format
                    })
                  : ""}
              </span>
            </div>
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
              justifyContent: "space-between",
              marginTop: "5px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              Trader :{" "}
              <div
                style={{
                  fontWeight: "600",
                  paddingLeft: "10px",
                  paddingRight: "15px",
                }}
              >
                {singleDataJson.trader_name || ""}
              </div>
            </div>
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
                {singleDataJson?.flower_type_name || ""}
              </div>
            </div>
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
              display: "grid",
              gridTemplateColumns: "3fr 3fr 3fr 2fr ",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            <div>S.no</div>
            <div>Quantity</div>
            <div>Rate</div>

            <div>Total</div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 3fr 3fr 2fr ",
              marginTop: "5px",
              width: "100%",
            }}
          >
            <div>{singleDataJson?.s_no || 1}</div>
            <div>{Number(singleDataJson?.quantity || 0).toFixed(2)}</div>
            <div>{Number(singleDataJson?.per_quantity || 0).toFixed(2)}</div>
            <div>{Number(singleDataJson?.sub_amount || 0).toFixed(2)}</div>
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
              justifyContent: "space-between",
              gap: 4,
              alignItems: "flex-end",
              marginTop: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: "bold",
                width: "100%",
                maxWidth: "220px", // Adjust this width as needed
                whiteSpace: "nowrap",
              }}
            >
              <span>Total Amount:</span>
              <span style={{ fontWeight: "600" }}>
                ₹{Number(singleDataJson?.sub_amount || 0).toFixed(2)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: "bold",
                width: "100%",
                maxWidth: "220px", // Adjust this width as needed
                whiteSpace: "nowrap",
              }}
            >
              <span>Commission :</span>
              <span style={{ fontWeight: "600" }}>
                ₹{Number(singleDataJson?.commission_amount || 0).toFixed(2)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: "bold",
                width: "100%",
                maxWidth: "220px", // Adjust this width as needed
                whiteSpace: "nowrap",
              }}
            >
              <span>Net Total :</span>
              <span style={{ fontWeight: "600" }}>
                ₹
                {Math.round(
                  ((Number(singleDataJson?.sub_amount) || 0) -
                    (Number(singleDataJson?.commission_amount) || 0)) /
                    10,
                ) * 10}
              </span>
            </div>
          </div>
        </div>
      </div> */}
      {/* 
      <div style={{ display: "none" }}>
        <div
          ref={componentRef}
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "12mm",
            border: "2px solid #000",
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
            color: "#000",
            boxSizing: "border-box",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #000",
              paddingBottom: "8px",
            }}
          >
            <div
              style={{
                width: "60px",
                textAlign: "center",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              🌾
            </div>

            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                SRI SURABI AGRI CENTRE
              </div>
              <div>425, Mysore Drunk Road, Rangasamudram</div>
              <div>Sathyamangalam - 638402</div>
              <div>Ph: 04295-222446</div>
              <div style={{ fontSize: "10px", marginTop: "4px" }}>
                GSTIN : 33BDXPC4945B1ZM <br />
                F.No : ERDST/YR-14/2018-21
              </div>
            </div>
          </div>


          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
              fontWeight: "bold",
            }}
          >
            <div>No : 19065</div>
            <div>
              Date :{" "}
              {singleDataJson?.date_wise_selling
                ? new Date(singleDataJson.date_wise_selling)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")
                : ""}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "6px",
              fontWeight: "bold",
            }}
          >
            <div>To : {singleDataJson?.trader_name}</div>
            <div>Ph : {singleDataJson?.phone || ""}</div>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr>
                {["HSN", "Particulars", "Qty", "Rate", "Tax %", "Amount"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        border: "1px solid #000",
                        padding: "6px",
                        textAlign: "center",
                        fontWeight: "bold",
                        background: "#f5f5f5",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #000", padding: "6px" }}>
                  300390
                </td>
                <td style={{ border: "1px solid #000", padding: "6px" }}>
                  {singleDataJson?.flower_type_name}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "6px",
                    textAlign: "center",
                  }}
                >
                  {singleDataJson?.quantity}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "6px",
                    textAlign: "right",
                  }}
                >
                  {Number(singleDataJson?.per_quantity || 0).toFixed(2)}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "6px",
                    textAlign: "center",
                  }}
                >
                  18%
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "6px",
                    textAlign: "right",
                  }}
                >
                  {Number(singleDataJson?.sub_amount || 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style={{
              marginTop: "10px",
              width: "40%",
              marginLeft: "auto",
              fontWeight: "bold",
            }}
          >
            {[
              ["Total Before Tax", "2923.72"],
              ["CGST", "263.14"],
              ["SGST", "263.14"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 0",
                }}
              >
                <span>{label}</span>
                <span>₹{value}</span>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "6px",
                marginTop: "6px",
                borderTop: "2px solid #000",
                fontSize: "14px",
              }}
            >
              <span>Grand Total</span>
              <span>₹3450.00</span>
            </div>
          </div>

          <div style={{ marginTop: "20px", fontSize: "11px" }}>
            <div>
              <strong>Rupees :</strong> Three Thousand Four Hundred And Fifty
              Only
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "40px",
                fontWeight: "bold",
              }}
            >
              <div>Customer Signature</div>
              <div>Authorised Signatory</div>
            </div>
          </div>
        </div>
      </div>
*/}

      <div style={{ display: "none" }}>
        <div
          ref={componentRef}
          style={{
            width: "210mm",
            height: "297mm",
            padding: "5mm",
            border: "1px solid #000",
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontSize: "12px",
            color: "#000",
            backgroundColor: "#fff",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header Section */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    width: "25%",
                    textAlign: "center",
                    border: "1px solid #000",
                    padding: "5px",
                  }}
                >
                  <div
                    style={{
                      border: "2px solid #000",
                      borderRadius: "50%",
                      width: "45px",
                      height: "45px",
                      margin: "0 auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    சுரபி
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      marginTop: "4px",
                      background: "#333",
                      color: "#fff",
                      padding: "1px",
                      fontWeight: "bold",
                    }}
                  >
                    ஸ்ரீ சுரபி அக்ரி சென்டர்
                  </div>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign: "top",
                    padding: "0 5px",
                  }}
                >
                  <h2
                    style={{
                      margin: "0",
                      fontSize: "18px",
                      letterSpacing: "0.5px",
                      fontWeight: "800",
                    }}
                  >
                    SRI SURABI AGRI CENTRE
                  </h2>
                  <p
                    style={{
                      margin: "2px 0",
                      fontSize: "10px",
                      lineHeight: "1.1",
                    }}
                  >
                    425, Mysore Trunk Road, RangaSamuthiram,
                    Sathyamangalam-638402 Ph No : 04295222446
                  </p>
                  <p
                    style={{
                      margin: "2px 0",
                      fontSize: "9px",
                      fontWeight: "600",
                    }}
                  >
                    FL No: ERD/STY/R-142/2018-21, S.L.No:1728/EDE/2015,
                    P.L.No:STY41/2016-17
                  </p>
                  <strong style={{ fontSize: "11px" }}>
                    GSTIN : 33BDXPC4945B1ZM
                  </strong>
                </td>
                <td
                  style={{
                    width: "15%",
                    textAlign: "right",
                    verticalAlign: "top",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Cash
                </td>
              </tr>
            </tbody>
          </table>

          {/* Invoice Info Bar */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderLeft: "1px solid #000",
              borderRight: "1px solid #000",
            }}
          >
            <tbody>
              <tr>
                <td
                  colSpan={2}
                  style={{
                    padding: "4px",
                    borderTop: "1px solid #000",
                    borderBottom: "1px solid #000",
                    textAlign: "center",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    fontSize: "14px",
                  }}
                >
                  INVOICE
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    width: "60%",
                    borderRight: "1px solid #000",
                    padding: "3px",
                    fontWeight: "bold",
                    fontSize: "11px",
                  }}
                >
                  No : 19065
                </td>
                <td
                  style={{
                    padding: "3px",
                    fontWeight: "bold",
                    fontSize: "11px",
                  }}
                >
                  Date :{" "}
                  {singleDataJson?.date_wise_selling
                    ? new Date(singleDataJson.date_wise_selling)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")
                    : ""}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  style={{
                    borderTop: "1px solid #000",
                    borderBottom: "1px solid #000",
                    padding: "4px 6px",
                    position: "relative",
                    fontSize: "11px",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>To:</span> &nbsp;
                  <strong style={{ fontSize: "12px" }}>
                    {singleDataJson?.trader_name ||
                      "SHANMUGAM.ATHIYAPPA KAVUNDAN PUTHUR"}
                  </strong>
                  <div
                    style={{
                      position: "absolute",
                      right: "6px",
                      bottom: "4px",
                      fontWeight: "bold",
                      fontSize: "10px",
                    }}
                  >
                    PH No : {singleDataJson?.phone || "9865044455"}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Items Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderLeft: "1px solid #000",
              borderRight: "1px solid #000",
              borderBottom: "1px solid #000",
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "center",
                  fontSize: "11px",
                  borderBottom: "1px solid #000",
                }}
              >
                <th
                  style={{
                    borderRight: "1px solid #000",
                    width: "15%",
                    padding: "4px",
                  }}
                >
                  HSN
                </th>
                <th style={{ borderRight: "1px solid #000", width: "45%" }}>
                  Particulars
                </th>
                <th style={{ borderRight: "1px solid #000", width: "10%" }}>
                  Qty / Pcs
                </th>
                <th style={{ borderRight: "1px solid #000", width: "10%" }}>
                  Rate
                </th>
                <th style={{ borderRight: "1px solid #000", width: "8%" }}>
                  Tax%
                </th>
                <th style={{ width: "12%" }}>Taxable Amount</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "11px" }}>
              <tr style={{ verticalAlign: "top" }}>
                <td
                  style={{
                    borderRight: "1px solid #000",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {/* Example HSN */}
                  38089199
                </td>
                <td
                  style={{
                    borderRight: "1px solid #000",
                    padding: "6px",
                    fontWeight: "bold",
                  }}
                >
                  {singleDataJson?.flower_type_name || "KUNOICHI - 250 ML"}
                </td>
                <td
                  style={{
                    borderRight: "1px solid #000",
                    padding: "6px",
                    textAlign: "center",
                  }}
                >
                  {singleDataJson?.quantity || "1"}
                </td>
                <td
                  style={{
                    borderRight: "1px solid #000",
                    padding: "6px",
                    textAlign: "right",
                  }}
                >
                  {Number(singleDataJson?.per_quantity || 1822.03).toFixed(2)}
                </td>
                <td
                  style={{
                    borderRight: "1px solid #000",
                    padding: "6px",
                    textAlign: "center",
                  }}
                >
                  18.0
                </td>
                <td style={{ padding: "6px", textAlign: "right" }}>
                  {Number(singleDataJson?.sub_amount || 1822.03).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Calculations Section */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderLeft: "1px solid #000",
              borderRight: "1px solid #000",
              borderBottom: "1px solid #000",
            }}
          >
            <tbody>
              <tr
                style={{ borderBottom: "1px solid #000", fontWeight: "bold" }}
              >
                <td
                  style={{
                    width: "40%",
                    borderRight: "1px solid #000",
                    padding: "5px",
                  }}
                >
                  E&OE. &nbsp;&nbsp;&nbsp;&nbsp; Total Qty :
                </td>
                <td style={{ width: "60%", textAlign: "center" }}>
                  {singleDataJson?.quantity || "1"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    borderRight: "1px solid #000",
                    verticalAlign: "top",
                    padding: "0",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: "4px 8px" }}>Total Before Tax</td>
                        <td style={{ textAlign: "right", paddingRight: "8px" }}>
                          2923.72
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "4px 8px" }}>CGST</td>
                        <td style={{ textAlign: "right", paddingRight: "8px" }}>
                          263.14
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "4px 8px" }}>SGST</td>
                        <td style={{ textAlign: "right", paddingRight: "8px" }}>
                          263.14
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={2}
                          style={{
                            border: "1px solid #000",
                            padding: "10px",
                            margin: "5px",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "16px",
                          }}
                        >
                          ஞாயிறு விடுமுறை
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td
                  style={{
                    verticalAlign: "top",
                    textAlign: "right",
                    padding: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      marginBottom: "8px",
                      color: "#444",
                      lineHeight: "1.2",
                    }}
                  >
                    2923.72@GST 18% = 526.27 (CGST@9%=263.14, SGST@9%=263.14,
                    IGST@0%=0.0)
                  </div>
                  <div
                    style={{
                      borderBottom: "1px solid #000",
                      paddingBottom: "3px",
                      marginBottom: "3px",
                    }}
                  >
                    Rounded off <span style={{ marginLeft: "40px" }}>.01</span>
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                    Grand Total :{" "}
                    <span style={{ marginLeft: "10px" }}>₹ 3450.00</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Section */}
          <div
            style={{
              padding: "4px 6px",
              borderLeft: "1px solid #000",
              borderRight: "1px solid #000",
              fontWeight: "bold",
              fontSize: "11px",
            }}
          >
            Rs: Three Thousand Four Hundred And Fifty Only.
          </div>

          <table
            style={{
              width: "100%",
              border: "1px solid #000",
              fontSize: "10px",
              flex: 1,
              display: "table",
            }}
          >
            <tbody style={{ height: "100%" }}>
              <tr style={{ height: "100%" }}>
                <td
                  style={{
                    width: "55%",
                    borderRight: "1px solid #000",
                    padding: "4px 6px",
                    lineHeight: "1.3",
                    height: "100%",
                    verticalAlign: "bottom",
                  }}
                >
                  1. GOOD ONCE SOLD CANNOT BE TAKEN BACK OR EXCHANGED 2. SUBJECT
                  TO SATHYAMANGALAM JURISDICTION.
                  <span
                    style={{ fontWeight: "bold", textDecoration: "overline" }}
                  >
                    Customer Signature
                  </span>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "4px 6px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    For SRI SURABI AGRI CENTRE
                  </div>
                  <div style={{ fontWeight: "bold" }}>Authorised Signatory</div>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style={{ textAlign: "center", fontSize: "9px", marginTop: "2px" }}
          >
            Page No: 1
            <p
              style={{
                fontSize: "9px",
                margin: "1px 0",
                fontStyle: "italic",
                lineHeight: "1.2",
              }}
            >
              இந்த பில்லில் உள்ள பொருள் விஷம் என்பது தெரியும் இதனை பயிர்
              பாதுகாப்பிற்கு மட்டும் பயன்படுத்துவேன் என உறுதி கூறுகிறேன்.
            </p>
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
