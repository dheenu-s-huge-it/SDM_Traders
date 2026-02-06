"use client";
import {
  Box,
  MenuItem,
  Typography,
  List,
  Select,
  FormControl,
  useTheme,
  Autocomplete,
  TextField,
  Checkbox,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import * as XLSX from "xlsx";
import React, { useState, useEffect } from "react";
import UserTable from "../../components/tables/UserTable";
import ReusableModal from "../../components/common-components/Modal";
import Cookies from "js-cookie";
import Grid from "@mui/material/Grid2";
import { axiosGet, axiosPost } from "../../../lib/api";
import { useAuthContext } from "../../DataProviders";
import ResetPin from "../../components/common-components/ResetPin";
import { useRouter } from "next/navigation";
import { formattedDate } from "../../../utils/utils";
import MultiModal from "../../components/common-components/MultiModal";
import ResetPinDialog from "../../components/common-components/ResetPinDialog";
import PDFGenerate from "../../components/common-components/PDFGenerate";
import { useForm, Controller } from "react-hook-form";
import CustomAutoCompleteFilters from "../../components/createcomponents/CustomAutoCompleteFilters";

const AllTraders = () => {
  useEffect(() => {
    document.title = "SDM TRADER";
  }, []);

  const ACCESS_TOKEN = Cookies.get("token");
  const {
    control,
    formState: { errors },
  } = useForm();

  const [searchValue, setSearchValue] = useState("");
  const [limitEnd, setLimitEnd] = useState(10);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeStatus, setactiveStatus] = useState(1);
  const [singleProduct, setSingleProduct] = useState();
  const [age, setAge] = useState(0);
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
  const [resetopen, setresetOpen] = useState(false);
  const [resetDialogopen, setResetDialogOpen] = useState(false); //shyam
  const [anchorEl22, setAnchorEl22] = useState(null);
  const [singleDataJson, setSingleDataJson] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const router = useRouter();

  const [GroupName, setGroupName] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(""); // chosen one
  const [selectedGroupName, setselectedGroupName] = useState("");
  const handleGroupNameChange = (newValue) => {
    setSelectedGroup(newValue.data_uniq_id);
    setselectedGroupName(newValue.group_type);
    setPageNumber(1);
  };

  const [stateName, setStateName] = useState({
    active_status: 1,
    created_date: "2020-03-05T14:32:46",
    created_f_date: "Mar 05, 2020 | 02:32 PM",
    data_uniq_id: "MzU5MzgwODkwMDY1MjI3NQ",
    formatted_created_date: "Mar 05, 2020 | 08:02 PM",
    id: 35,
    label: "Tamil Nadu",
    readable_created_date: "4 years ago",
    ref_country_id: "MTAxNzk3NTcxMDI0NjY4OTQ",
    s_no: 35,
  });

  const handleStateNameChange = (event, value) => {
    if (value != null) {
      setStateName(value);
      getCityList(value.data_uniq_id);
    } else {
      setStateName({
        active_status: 1,
        created_date: "2020-03-05T14:32:46",
        created_f_date: "Mar 05, 2020 | 02:32 PM",
        data_uniq_id: "MzU5MzgwODkwMDY1MjI3NQ",
        formatted_created_date: "Mar 05, 2020 | 08:02 PM",
        id: 35,
        label: "Tamil Nadu",
        readable_created_date: "4 years ago",
        ref_country_id: "MTAxNzk3NTcxMDI0NjY4OTQ",
        s_no: 35,
      });
      getCityList("MzU5MzgwODkwMDY1MjI3NQ==");
    }
    setPageNumber(1);
  };

  const [cityName, setCityName] = useState(null);
  const handleCityNameChange = (event, value) => {
    if (value != null) {
      setCityName(value);
    } else {
      setCityName("");
    }
    setPageNumber(1);
  };

  const handleResetpinOpen = (data) => {
    setAnchorEl2(null);
    setresetOpen(true);
    setAnchorEl22(null);
    setSingleDataJson(data?.json);
  };

  const handlePinClose = () => {
    setresetOpen(false);
    setAnchorEl22(null);
  };

  const [newPassword, setnewPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState({ status: "", message: "" });
  const handledClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  const handleResetPin = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      user_id: singleDataJson?.data_uniq_id,
      user_name: singleDataJson?.mobile_number,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    axiosPost
      .post(`update_password`, jsonData)
      .then((response) => {
        // Correct the response check logic
        if (response.data.action === "success") {
          setEffectToggle(!effectToggle);
          setconfirmPassword("");
          setnewPassword("");
          setAlertMessage("Updated successfully.");
          setAlertVisible(true);
          setAlertSeverity("success");
          handlePinClose();
          fetchData();
          setError({ status: "success", message: response.data.message });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlertMessage("Failed to update. Please try again.");
        setAlertVisible(true);
        setAlertSeverity("error");
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000); // Ensure loading state is updated
      });
  };
  const { GroupTypes, stateList, getStateList } = useAuthContext();
  const [cityList, setCityList] = useState([]);
  const getCityList = (value) => {
    axiosGet
      .get(
        `master/city/get?access_token=${ACCESS_TOKEN}&active_status=1&items_per_page=10000&ref_state_id=${value}`
      )
      .then((response) => {
        setCityList(response.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const getGroupList = (value) => {
    axiosGet
      .get(
        `master/group/get?access_token=${ACCESS_TOKEN}&active_status=1&items_per_page=10000&ref_state_id=${value}`
      )
      .then((response) => {
        setGroupName(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    getStateList(ACCESS_TOKEN);
    getGroupList(ACCESS_TOKEN);

    getCityList("MzU5MzgwODkwMDY1MjI3NQ==");
  }, [ACCESS_TOKEN]);

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

  const filterDataSelectedData = (data, selectedItems, isPDF = false) => {
    return data?.map((item) => {
      let formattedData = {};
      if (selectedItems.includes("User ID"))
        formattedData["UID"] = String(item.user_id) || "---";
      if (selectedItems.includes("Full Name"))
        formattedData["F.NAME"] =
          `${item.first_name} ${item.last_name}` || "---";
      if (selectedItems.includes("Nick Name"))
        formattedData["N.NAME"] = String(item.nick_name) || "---";
      if (selectedItems.includes("Phone Number"))
        formattedData["PHONE"] = String(item.mobile_number) || "---";
      if (selectedItems.includes("Email ID"))
        formattedData["EMAIL ID"] = String(item.email_id) || "---";
      if (selectedItems.includes("Group"))
        formattedData["Group"] = String(item.group_name) || "---";
      if (selectedItems.includes("Address-1"))
        formattedData["ADDRESS 1"] = String(item.address_1) || "---";
      if (selectedItems.includes("Address-2"))
        formattedData["ADDRESS 2"] = String(item.address_2) || "---";

      if (selectedItems.includes("District"))
        formattedData["DIST."] = String(item.district_name) || "---";
      if (selectedItems.includes("State"))
        formattedData["STATE"] = String(item.state_name) || "---";
      if (
        isPDF &&
        selectedItems.some((label) =>
          ["Address-1", "Address-2"].includes(label)
        )
      ) {
        formattedData["ADDRESS"] =
          `${item.address_1 || "---"}, ${item.address_2 || "---"}`;
        delete formattedData["ADDRESS 1"];
        delete formattedData["ADDRESS 2"];
      }
      return formattedData;
    });
  };

  const fetchExportManualData = (type, data) => {
    const selectedLabels = selectedOptions.map((item) => item.label);
    const exportData = filterDataSelectedData(data, selectedLabels);

    const PDFData = filterDataSelectedData(data, selectedLabels, true);

    const tableBody = PDFData.map((item) => Object.values(item));
    setIsExcelLoading(false);
    if (type === 1) {
      fetchExcelData(exportData);
      setIsExcelLoading(false);
    } else if (type === 2) {
      PDFGenerate({
        tableBody,
        PDFData,
        title: "Traders-Details",
        name: "All Traders",
      });
      setIsPdfLoading(false);
    }
  };

  const fetchExportData = async (type) => {
    axiosGet
      .get(
        `employee_get?access_token=${ACCESS_TOKEN}&items_per_page=10000&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&active_status=${activeStatusFilter === 3 ? "" : activeStatusFilter}&group_id=${selectedGroup}&state_id=${stateName?.data_uniq_id || ""}&district_id=${cityName?.data_uniq_id || ""}`
      )
      .then((response) => {
        let data = response?.data?.data;
        const selectedLabels = selectedOptions.map((item) => item.label);
        const exportData = filterDataSelectedData(data, selectedLabels);
        const PDFData = filterDataSelectedData(data, selectedLabels, true);
        const tableBody = PDFData.map((item) => Object.values(item));
        if (type === 1) {
          fetchExcelData(exportData);
          setIsExcelLoading(false);
        } else if (type === 2) {
          PDFGenerate({
            tableBody,
            PDFData,
            title: "Traders-Details",
            name: "All Traders",
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

    XLSX.writeFile(workbook, `Trader-Details-${formattedDate}.xlsx`);
  };

  const HandleEditFormer = () => {
    Cookies.set("data_uniq_id", singleDataJson?.data_uniq_id);
    router.push("/all-traders/edit");
  };

  const HandleViewFormer = () => {
    Cookies.set("data_uniq_id", singleDataJson?.data_uniq_id);
    router.push("/all-traders/view");
  };

  const HandleRouteCreate = () => {
    router.push("/all-traders/create");
  };

  // Function to open the modal
  const handleOpen = () => {
    setOpen(true), setAnchorEl2(null);
  };

  const theme = useTheme();

  // Function to close the modal
  const handleClose = () => setOpen(false);

  //Shyam
  const handleResetDialogClose = () => setResetDialogOpen(false);

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

  const fetchData = async (field = orderField, type = orderType) => {
    let searchFinal = "";
    if (searchValue === undefined) {
      searchFinal = searchInput;
    } else {
      searchFinal = searchValue;
    }
    axiosGet
      .get(
        `employee_get?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=${searchFinal}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${type}&order_field=${field}&active_status=${activeStatusFilter === 3 ? "" : activeStatusFilter}&group_id=${selectedGroup || ""}&state_id=${stateName?.data_uniq_id || ""}&district_id=${cityName?.data_uniq_id || ""}&user_type=2`
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
        `employee_get?access_token=${ACCESS_TOKEN}&items_per_page=10000&active_status=${activeStatusFilter === 3 ? "" : activeStatusFilter}&group_id=${selectedGroup || ""}&state_id=${stateName?.data_uniq_id || ""}&district_id=${cityName?.data_uniq_id || ""}&user_type=2`
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
        `employee_filter_get?access_token=${ACCESS_TOKEN}&items_per_page=10000&user_type=2`
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

  const handleRefresh = () => {
    setSelectedGroup("");
    setselectedGroupName("");
    setCityName(null);
    setStateName({
      active_status: 1,
      created_date: "2020-03-05T14:32:46",
      created_f_date: "Mar 05, 2020 | 02:32 PM",
      data_uniq_id: "MzU5MzgwODkwMDY1MjI3NQ",
      formatted_created_date: "Mar 05, 2020 | 08:02 PM",
      id: 35,
      label: "Tamil Nadu",
      readable_created_date: "4 years ago",
      ref_country_id: "MTAxNzk3NTcxMDI0NjY4OTQ",
      s_no: 35,
    });
    setPageNumber(1);
    setSearchValue("");
    setsearchInput("");
  };

  useEffect(() => {
    fetchFilterData();
    getGroupList();
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
    cityName,
    GroupName,
    selectedGroup,
    stateName,
  ]);

  //shyam

  const tableHead = [
    {
      id: 1,
      label: `User ID`,
      value: "user_id",
      fieldName: "user_id",
    },
    {
      id: 2,
      label: `Full Name`,
      value: "first_name",
      fieldName: "first_name",
    },

    {
      id: 3,
      label: `Phone Number`,
      value: "mobile_number",
      fieldName: "mobile_number",
    },

    {
      id: 4,
      label: `Email ID`,
      value: "email_id",
      fieldName: "email_id",
    },
    {
      id: 5,
      label: "Group",
      value: "group_name",
      fieldName: "group_name",
    },
    {
      id: 6,
      label: "State",
      value: "state_name",
      fieldName: "state_name",
    },
    {
      id: 7,
      label: "District",
      value: "district_name",
      fieldName: "district_name",
    },

    {
      id: 8,
      label: "Address-1",
      value: "address_1",
      fieldName: "address_1",
    },
    {
      id: 9,
      label: "Address-2",
      value: "address_2",
      fieldName: "address_2",
    },
    {
      id: 10,
      label: `Status`,
      value: "active_status",
      fieldName: "active_status",
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
                {item.user_id || "---"}
              </Typography>
            </Box>
          ),
          label: "User ID",
          id: 1,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px" textTransform="capitalize">
                {item.first_name || ""} {item.last_name || ""}
              </Typography>
            </Box>
          ),
          label: "Full Name",
          id: 2,
        },

        {
          td: (
            <Box>
              <Typography fontSize="14px" textTransform="capitalize">
                {item.mobile_number || "---"}
              </Typography>
            </Box>
          ),
          label: "Phone Number",
          id: 3,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">{item.email_id || "---"}</Typography>
            </Box>
          ),
          label: "Email ID",
          id: 4,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {item.group_name || "---"}
              </Typography>
            </Box>
          ),
          label: "Group",
          id: 5,
        },

        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {item.state_name || "---"}
              </Typography>
            </Box>
          ),
          label: "State",
          id: 6,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">
                {item.district_name || "---"}
              </Typography>
            </Box>
          ),
          label: "District",
          id: 7,
        },

        {
          td: (
            <Box>
              <Typography fontSize="14px">{item.address_1 || "---"}</Typography>
            </Box>
          ),
          label: "Address-1",
          id: 8,
        },
        {
          td: (
            <Box>
              <Typography fontSize="14px">{item.address_2 || "---"}</Typography>
            </Box>
          ),
          label: "Address-2",
          id: 9,
        },
        {
          td: (
            <Box
              style={{
                backgroundColor:
                  item.active_status == 1
                    ? theme?.palette?.success.lightOpacity
                    : theme?.palette?.error?.lightOpacity,
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <Typography
                fontSize={"14px"}
                sx={{
                  color:
                    item.active_status == 1
                      ? theme?.palette?.success.main
                      : theme?.palette?.error?.main,
                }}
              >
                {item.active_status == 1 ? "Enable" : "Disable"}
              </Typography>
            </Box>
          ),
          label: "Status",
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
    { value: 0, label: "User ID" },
    { value: 1, label: "Full Name" },
    { value: 2, label: "Phone Number" },
    { value: 3, label: "Email ID" },
    { value: 4, label: "Group" },
    { value: 5, label: "State" },
    { value: 6, label: "District" },
    { value: 7, label: "Address-1" },
    { value: 8, label: "Address-2" },
    { value: 9, label: "Status" },
  ];
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Handle checkbox selection

  const handleFilterChange = (event, newValue) => {
    newValue.forEach((item) => {
      const jsonData = {
        access_token: ACCESS_TOKEN,
        status: 1,
        label: item.label,
        user_type: 2,
      };
      axiosPost
        .post("employee_filter", jsonData)
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
          user_type: 2,
        };
        axiosPost
          .post("employee_filter", uncheckData)
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

  //shyam
  const handleFieldChange = (field, type) => {
    setOrderField(field);
    setOrderType(type);
    fetchData(field, type);
  };

  const handleStatusChange = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      data_ids: [singleDataJson?.data_uniq_id],
      active_status: singleDataJson?.active_status === 1 ? 0 : 1,
    };
    axiosPost
      .post(`employee_status_change`, jsonData)
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

  const [selectedItems, setSelectedItems] = useState([]);

  const [openMulitiStatus, setOpenMultistatus] = useState(false);

  const [actionData, setActionData] = useState(2);
  const handleChange = (event) => {
    setActionData(event.target.value);
    setOpenMultistatus(true);
  };

  const handleCloseMultiStatus = () => {
    setOpenMultistatus(false);
  };

  const [selectAll, setSelectAll] = useState(false);

  const handleMulitiStatusChange = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      data_ids: selectedItems,
      active_status: actionData,
    };
    axiosPost
      .post(`employee_status_change`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        handleCloseMultiStatus();
        fetchData();
        setSelectedItems([]);
        setActionData("");
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        setAlertMessage("Updated successfully.");
        setAlertVisible(true);
        setAlertSeverity("success");
        handleClose2();
        setSelectAll(false);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  //shyam
  const handleResetPinChange = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      user_id: singleDataJson?.data_uniq_id,
      user_name: singleDataJson?.mobile_number,
      user_type: singleDataJson?.user_type_name,
      email: singleDataJson?.email_id,
    };

    axiosPost
      .post(`reset_pin`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        handleCloseMultiStatus();
        fetchData();
        setSelectedItems([]);
        setActionData("");
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        setAlertMessage("Updated successfully.");
        setAlertVisible(true);
        setAlertSeverity("success");
        handleClose2();
        setSelectAll(false);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  const renderLabel = (label, isRequired) => {
    return (
      <Typography variant="body1" sx={{ marginLeft: "5px" }}>
        {label} {isRequired && <span style={{ color: "#D32F2F" }}>*</span>}
      </Typography>
    );
  };

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
                  value={selectedGroupName}
                  onChange={(event, newValue) =>
                    handleGroupNameChange(newValue)
                  }
                  options={GroupName || []}
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

        <Grid item xs={12} sm={4}>
          <Controller
            name="Group"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <>
                {renderLabel("State", false)}
                <CustomAutoCompleteFilters
                  id="select-status"
                  sx={{ width: "300px" }}
                  label="State"
                  value={
                    stateList?.find(
                      (year) => year.label === stateName?.label
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleStateNameChange(e.target.value, value)
                  }
                  options={stateList}
                  option_label={(option) =>
                    typeof option === "string" ? option : option.label || ""
                  }
                />
              </>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controller
            name="city"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <>
                {renderLabel("City", false)}
                <CustomAutoCompleteFilters
                  id="select-status"
                  sx={{ width: "300px" }}
                  label="City"
                  value={
                    cityList?.find((year) => year.label === cityName?.label) ||
                    null
                  }
                  onChange={(e, value) =>
                    handleCityNameChange(e.target.value, value)
                  }
                  options={cityList}
                  option_label={(option) =>
                    typeof option === "string" ? option : option.label || ""
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

  const MenuComponent = (rowId) => {
    return (
      <List sx={{ p: 0, fontSize: "12px" }}>
        <MenuItem onClick={HandleViewFormer}>View</MenuItem>
        <MenuItem onClick={handleOpen}>Change Status</MenuItem>
        <MenuItem onClick={HandleEditFormer}>Edit</MenuItem>
        {/* Shyam */}
      </List>
    );
  };

  useEffect(() => {
    const newSuggestions = searchFilterData?.map((row) => {
      return `${row.first_name}`;
    });
    setSuggestions(newSuggestions);
  }, [searchFilterData]);

  return (
    <>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid item={12} sx={{ width: "100%" }}>
          <UserTable
            pageNumber={pageNumber}
            pageCount={pageCount}
            tableHead={tableHead}
            tableRow={td_data_set}
            actionPrivilege={true}
            searchInput={searchInput}
            setSearchValue={setsearchInput}
            onSearchButtonClick={handleSearchInputChange}
            heading={"All Traders"}
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
            createHeading={"Traders"}
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
      <MultiModal
        open={openMulitiStatus}
        onsubmit={handleMulitiStatusChange}
        onClose={handleCloseMultiStatus}
        activeStatus={activeStatus}
        setactiveStatus={setactiveStatus}
        singleProduct={singleProduct}
        setSingleProduct={setSingleProduct}
        text={`Are you sure want you to ${
          actionData == 0 ? "disable" : "enable"
        } user?`}
      />
      <ResetPin
        open={resetopen}
        handleResetPin={handleResetPin}
        onClose={handlePinClose}
        newPassword={newPassword}
        setnewPassword={setnewPassword}
        confirmPassword={confirmPassword}
        setconfirmPassword={setconfirmPassword}
      />

      {/* Shyam */}
      <ResetPinDialog
        open={resetDialogopen}
        onsubmit={handleResetPinChange}
        onClose={handleResetDialogClose}
        singleProduct={singleProduct}
        setSingleProduct={setSingleProduct}
        text={"Are you sure you want to change your Pin?"}
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
    </>
  );
};

export default AllTraders;
