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
import MarketReportTable from "../../../components/tables/MarketReportTable";
import Cookies from "js-cookie";
import Grid from "@mui/material/Grid2";
import { axiosGet, axiosPost } from "../../../../lib/api";
import { useRouter } from "next/navigation";
import { formattedDate } from "../../../../utils/utils";
import MarketPDFGenerate from "../../../components/common-components/MarketPDFGenerate";
import { useForm, Controller } from "react-hook-form";
import { fetchDateSingle } from "../../../../lib/getAPI/apiFetch";

const DetailedView = () => {
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

  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");

  const [dateTitle, setDateTitle] = useState("Choose Date Of Selling");
  const [isDateSelected, setIsDateSelected] = useState(false);
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

  const [minQuantityValue, setminQuantityValue] = useState("");
  const [maxQuantityValue, setmaxQuantityValue] = useState("");

  const handleSearch = () => {
    setPageNumber(1);
    setMinQuantity(minQuantityValue);
    setMaxQuantity(maxQuantityValue);
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

  useEffect(() => {
    HandleFlowerTypeMaster();
  }, []);

  const [flowerTypeID, setflowerTypeID] = useState("");
  const [flowerType, setflowerType] = useState("");
  const [cashTypeID, setcashTypeID] = useState("");
  const [cashTypeName, setcashTypeName] = useState("");
  const [modeTypeName, setmodeTypeName] = useState("");

  // const filterDataSelectedData = (data, selectedItems) => {
  //   return data?.map((item, index) => {
  //     let formattedData = {};
  //     if (selectedItems.includes("S.No"))
  //       formattedData["S.No"] = String(index + 1) || "---";
  //     if (selectedItems.includes("Date")) {
  //       const date = item.date_of_selling ? new Date(item.date_of_selling) : null;
  //       const formattedDate = date
  //           ? `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear()).slice(-2)}`
  //           : "---";
  //       formattedData["Date"] = formattedDate;
  //   }
  //     if (selectedItems.includes("Flower"))
  //       formattedData["F.Type"] =
  //         String((item.flower_type)) || "---";
  //     formattedData["Qty"] = String((item.farmer_payment).toFixed(2)) || "---";
  //     formattedData["Comm Amt"] = String((item.farmer_payment).toFixed(2)) || "---";
  //     formattedData["Total Amt"] = String((item.farmer_payment).toFixed(2)) || "---";

  //     if (selectedItems.includes("Total Qty"))
  //       formattedData["Total Qty"] = String((item.income).toFixed(2)) || "---";
  //     if (selectedItems.includes("Total T.Amt"))
  //       formattedData["Total T.Amt"] = String((item.expense).toFixed(2)) || "---";

  //     return formattedData;
  //   });
  // };


  const filterDataSelectedData = (data, selectedItems, isPDF = false) => {
    let formattedRows = [];

    data?.forEach((item, index) => {
      // if flower_report exists, loop through it, else just push one row
      if (Array.isArray(item.flower_report) && item.flower_report.length > 0) {
        item.flower_report.forEach((flower, fIndex) => {
          let formattedData = {};

          // For merging: only show date, total qty, and total t.amt for first flower of each item
          const shouldShowMergedFields = fIndex === 0;

          if (selectedItems.includes("S.No"))
            formattedData["S.No"] = shouldShowMergedFields ? String(index + 1) : "";

          if (selectedItems.includes("Date")) {
            if (shouldShowMergedFields) {
              const date = item.date_of_selling
                ? new Date(item.date_of_selling)
                : null;
              const formattedDate = date
                ? `${String(date.getDate()).padStart(2, "0")}-${String(
                  date.getMonth() + 1
                ).padStart(2, "0")}-${String(date.getFullYear()).slice(-2)}`
                : "---";
              formattedData["Date"] = formattedDate;
            } else {
              formattedData["Date"] = "";
            }
          }

          if (selectedItems.includes("Flower")) {
            formattedData["Flower Type"] = String(flower.flower_type) || "---";
            formattedData["Quantity"] =
              String(flower.total_quantity?.toFixed(2)) || "---";
            formattedData["Luggage Amount"] =
              String(flower.luggage?.toFixed(2)) || "---";
            formattedData["Total Amount"] =
              String(flower.total_amount?.toFixed(2)) || "---";
          }

          if (selectedItems.includes("Total Qty"))
            formattedData["Total Quantity"] = shouldShowMergedFields
              ? String(item.overall_totals?.total_quantity?.toFixed(2)) || "---"
              : "";

          if (selectedItems.includes("Total T.Amt"))
            formattedData["Total T.Amount"] = shouldShowMergedFields
              ? String(item.overall_totals?.total_amount?.toFixed(2)) || "---"
              : "";

          formattedRows.push(formattedData);
        });
      } else {
        // fallback if no flower_report
        let formattedData = {};
        if (selectedItems.includes("S.No"))
          formattedData["S.No"] = String(index + 1) || "---";
        if (selectedItems.includes("Date")) {
          const date = item.date_of_selling
            ? new Date(item.date_of_selling)
            : null;
          const formattedDate = date
            ? `${String(date.getDate()).padStart(2, "0")}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}-${String(date.getFullYear()).slice(-2)}`
            : "---";
          formattedData["Date"] = formattedDate;
        }

        if (selectedItems.includes("Flower")) {
          formattedData["Flower Type"] = "---";
          formattedData["Quantity"] = "---";
          formattedData["Luggage Amount"] = "---";
          formattedData["Total Amount"] = "---";
        }

        if (selectedItems.includes("Total Qty"))
          formattedData["Total Quantity"] =
            String(item.overall_totals?.total_quantity?.toFixed(2)) || "---";
        if (selectedItems.includes("Total T.Amt"))
          formattedData["Total T.Amount"] =
            String(item.overall_totals?.total_amount?.toFixed(2)) || "---";

        formattedRows.push(formattedData);
      }
    });

    return formattedRows;
  };

  const fetchExportManualData = (type, data) => {
    const selectedLabels = selectedOptions.map((item) => item.label);
    const exportData = filterDataSelectedData(data, selectedLabels);
    const summaryFields = [
      "Quantity",
      "Luggage Amount",
      "Total Amount",
      "Total Quantity",
      "Total T.Amount",
    ];
    const PDFData = filterDataSelectedData(data, selectedLabels, true);
    const tableBody = PDFData.map((item) => Object.values(item));

    if (type === 1) {
      fetchExcelData(exportData);
      setIsExcelLoading(false);
    } else if (type === 2) {
      MarketPDFGenerate({
        tableBody,
        PDFData,
        title: "Market-Report-Details",
        name: "Market Report",
        summaryFields,
      });
      setIsPdfLoading(false);
    }
  };

  const fetchExportData = async (type) => {
    axiosGet
      .get(
        `finance/marketreport/get?access_token=${ACCESS_TOKEN}&items_per_page=10000&search_input=${searchValue}&date_wise_selling=${createdStartDate}&to_date_wise_selling=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&flower_type_id=${flowerTypeID}&payment_type=${cashTypeName}`
      )
      .then((response) => {
        let data = response?.data?.data;
        const selectedLabels = selectedOptions.map((item) => item.label);
        const exportData = filterDataSelectedData(data, selectedLabels);
        const summaryFields = [
         "Quantity",
      "Luggage Amount",
      "Total Amount",
      "Total Quantity",
      "Total T.Amount",
        ];
        const PDFData = filterDataSelectedData(data, selectedLabels, true);

        const tableBody = PDFData.map((item) => Object.values(item));
        if (type === 1) {
          fetchExcelData(exportData);
          setIsExcelLoading(false);
        } else if (type === 2) {
          MarketPDFGenerate({
            tableBody,
            PDFData,
            title: "Market-Report-Details",
            name: "Market Report",
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

  //   XLSX.writeFile(workbook, `Market-Report-Details-${formattedDate}.xlsx`);
  // };


    const fetchExcelData = (data) => {
      if (!data || data.length === 0) return;
  const summaryFields = [
         "Quantity",
      "Luggage Amount",
      "Total Amount",
      "Total Quantity",
      "Total T.Amount",
        ];
      // Calculate totals
      const totals = {};
      summaryFields.forEach((field) => {
        totals[field] = data.reduce(
          (sum, row) => sum + (parseFloat(row[field]) || 0),
          0
        ).toFixed(2);
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
      XLSX.writeFile(workbook, `Market-Report-Details-${formattedDate}.xlsx`);
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

  const fetchData = async (min, max) => {
    let searchFinal = "";
    if (searchValue === undefined) {
      searchFinal = searchInput;
    } else {
      searchFinal = searchValue;
    }

    axiosGet
      .get(
        `finance/marketreport/get?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=${searchFinal}&date_wise_selling=${createdStartDate}&to_date_wise_selling=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&flower_type_id=${flowerTypeID}&payment_type=${cashTypeName}&min_quantity=${min}&max_quantity=${max}`
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
    axiosGet
      .get(
        `employee_get?access_token=${ACCESS_TOKEN}&items_per_page=10000&user_type=2&order_type=ASC&order_field=user_type`
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
        `finance/marketstatementfilter/get?access_token=${ACCESS_TOKEN}&items_per_page=10000`
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
        `report/market/detailed/get?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=10000&search_input=${searchFinal}&date_wise_selling=${createdStartDate}&to_date_wise_selling=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&flower_type_id=${flowerTypeID}&payment_type=${cashTypeName}`
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
    setminQuantityValue("");
    setmaxQuantityValue("");
    setflowerTypeID("");
    setflowerType("");
    setcashTypeID("");
    setcashTypeName("");
    setmodeTypeName("");
    setSelectedDate("");
    setPageNumber(1);
    setSearchValue("");
    setsearchInput("");
    setDateTitle("Choose Date Of Selling");
    setCreatedStartDate("");
    setCreatedEndDate("");
  };

  useEffect(() => {
    fetchData(minQuantity, maxQuantity);
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
    flowerTypeID,
    cashTypeName,
    modeTypeName,
    minQuantity,
    maxQuantity,
  ]);

  useEffect(() => {
    fetchFilterData();
  }, []);

  const tableHead = [
    {
      id: 1,
      label: `S.No`,
      value: "data_uniq_id",
      subColumns: [],
    },
    {
      id: 2,
      label: `Date`,
      value: "date_of_selling",
      subColumns: [],
    },
    {
      id: 3,
      label: `Flower`,
      value: "flower_type",
      subColumns: [],
    },
    {
      id: 4,
      label: `Quantity`,
      value: "total_quantity",
      subColumns: [],
    },
    {
      id: 5,
      label: `Luggage Amount`,
      value: "luggage",
      subColumns: [],
    },
    {
      id: 6,
      label: `Total Amount`,
      value: "total_amount",
      subColumns: [],
    },

    // {
    //   id: 6,
    //   label: "Flower",
    //   subColumns: [
    //     {
    //       label: "F.Type",
    //     },
    //     {
    //       label: "Qty",
    //     },
    //     {
    //       label: "C.Amt",
    //     },
    //     {
    //       label: "T.Amt",
    //     },
    //   ],
    // },

    {
      id: 8,
      label: "Total Qty",

      subColumns: [],
    },
   
    {
      id: 10,
      label: "Total T.Amt",

      subColumns: [],
    },


  ];

  const td_data_set = [];

  data?.map((item, index) => {
    const array_data = {
      id: index,
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
                {item.date_of_selling
                  ? new Date(item.date_of_selling)
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
               {item.flower_report?.map((flower, fIndex) => (
                <Box key={fIndex} sx={{display:"flex"}} >
              <Typography fontSize="14px">
              {flower.flower_type || "---"}
              </Typography>
              </Box>
            ))}
            </Box>
          ),
          label: "Flower",
          id: 3,
        },
        {
          td: (
            <Box>
               {item.flower_report?.map((flower, fIndex) => (
                <Box key={fIndex} sx={{display:"flex"}} >
              <Typography fontSize="14px">
              {flower.total_quantity || "---"}
              </Typography>
              </Box>
            ))}
            </Box>
          ),
          label: "Quantity",
          id: 4,
        },
        {
          td: (
            <Box>
               {item.flower_report?.map((flower, fIndex) => (
                <Box key={fIndex} sx={{display:"flex"}} >
              <Typography fontSize="14px">
              {flower.luggage || "---"}
              </Typography>
              </Box>
            ))}
            </Box>
          ),
          label: "Luggage Amount",
          id: 5,
        },
        {
          td: (
            <Box>
               {item.flower_report?.map((flower, fIndex) => (
                <Box key={fIndex} sx={{display:"flex"}} >
              <Typography fontSize="14px">
              {flower.total_amount || "---"}
              </Typography>
              </Box>
            ))}
            </Box>
          ),
          label: "Total Amount",
          id: 6,
        },

      
        // {
        //   td: (
        //     <Box
        //       sx={{
        //         display: "flex",
        //         flexDirection: "column",
        //         width: "100%",
        //       }}
        //     >
        //       {item.flower_report?.map((flower, fIndex) => (
        //         <Box
        //           key={fIndex}
        //           sx={{
        //             display: "flex",
        //             width: "100%",
        //             mb: fIndex < item.flower_report.length - 1 ? 1 : 0, // Only add margin bottom if not last item
        //           }}
        //         >
        //           <Box sx={{ flex: '1 1 25%', textAlign: 'center' }}>
        //             <Typography fontSize="14px"> {flower.flower_type || "---"}</Typography>
        //           </Box>
        //           <Box sx={{ flex: '1 1 25%', textAlign: 'center' }}>
        //             <Typography fontSize="14px"> {flower.total_quantity?.toFixed(2) || "---"}</Typography>
        //           </Box>
        //           <Box sx={{ flex: '1 1 25%', textAlign: 'center' }}>
        //             <Typography fontSize="14px"> {flower.luggage?.toFixed(2) || "---"}</Typography>
        //           </Box>
        //           <Box sx={{ flex: '1 1 25%', textAlign: 'center' }}>
        //             <Typography fontSize="14px"> {flower.total_amount?.toFixed(2) || "---"}</Typography>
        //           </Box>
        //         </Box>
        //       ))}
        //     </Box>
        //   ),
        //   label: "Flower",
        //   id: 6,
        // },

        {
          td: (
            <Box>
              <Typography fontSize="14px">{(item.overall_totals?.total_quantity).toFixed(2) || "---"}</Typography>
            </Box>
          ),
          label: "Total Qty",
          id: 8,
        },
        // {
        //   td: (
        //     <Box>
        //       {/* <Typography fontSize="14px">{(item.expense).toFixed(2) || "---"}</Typography> */}
        //     </Box>
        //   ),
        //   label: "Total Comm.Amt",
        //   id: 9,
        // },
        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {(item.overall_totals?.total_amount).toFixed(2)}
              </Typography>
            </Box>
          ),
          label: "Total T.Amt",
          id: 10,
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
    {
      value: 2,
      label: "Flower",
    },
    {
      value: 3,
      label: "Quantity",
    },
    {
      value: 4,
      label: "Total Amount",
    },
    {
      value: 5,
      label: "Luggage Amount",
    },
    { value: 6, label: "Total Qty" },
    { value: 7, label: "Total Comm.Amt" },
    { value: 8, label: "Total T.Amt" },

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
        .post("finance/marketstatementfilter/create", jsonData)
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
          .post("finance/marketstatementfilter/create", uncheckData)
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
    fetchData(minQuantity, maxQuantity);
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const [openMulitiStatus, setOpenMultistatus] = useState(false);

  const [actionData, setActionData] = useState(2);
  const handleChange = (event) => {
    setActionData(event.target.value);
    setOpenMultistatus(true);
  };

  const [selectAll, setSelectAll] = useState(false);

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


  useEffect(() => {
    const newSuggestions = searchFilterData?.map((row) => {
      return `${row.user_id}-${row.nick_name}`;
    });
    setSuggestions(newSuggestions);
  }, [searchFilterData]);

  return (
    <>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid item={12} sx={{ width: "100%" }}>
          <MarketReportTable
            pageNumber={pageNumber}
            pageCount={pageCount}
            tableHead={tableHead}
            tableRow={td_data_set}
            actionPrivilege={true}
            searchInput={searchInput}
            setSearchValue={setsearchInput}
            onSearchButtonClick={handleSearchInputChange}
            heading={"Market Report"}
            limitEnd={limitEnd}
            setLimitEnd={setLimitEnd}
            anchorEl2={anchorEl2}
            setAnchorEl2={setAnchorEl2}
            handleClose2={handleClose2}
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
            createHeading={"Market Report"}
            dateTitle={dateTitle}
            onCreatedDateChange={onCreatedDateChange}
            minQuantity={minQuantityValue}
            maxQuantity={maxQuantityValue}
            setMinQuantity={setminQuantityValue}
            setMaxQuantity={setmaxQuantityValue}
            handleSearch={handleSearch}
            setPageNumber={setPageNumber}
            global_print={false}
            quantity_filter={false}
            total_status={false}
            search_filter={false}
          />
        </Grid>
      </Grid>
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
    </>
  );
};

export default DetailedView;
