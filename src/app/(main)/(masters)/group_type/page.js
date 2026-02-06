"use client";
import {
  Box,
  MenuItem,
  Typography,
  List,
  Select,
  FormControl,
  useTheme,
  Modal,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import MasterTable from "../../../components/tables/MasterTable";
import ReusableModal from "../../../components/common-components/Modal";
import Cookies from "js-cookie";
import Grid from "@mui/material/Grid2";
import { axiosGet, axiosPost } from "../../../../lib/api";
import { useRouter } from "next/navigation";
import MultiModal from "../../../components/common-components/MultiModal";

const AllTraders = () => {
  useEffect(() => {
    document.title = "SDM Group TYPE";
  }, []);
  const ACCESS_TOKEN = Cookies.get("token");
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
  const [singleDataJson, setSingleDataJson] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  const router = useRouter();

  // Function to open the modal
  const handleOpen = () => {
    setOpen(true), setAnchorEl2(null);
  };

  const HandleEditTrader = () => {
    Cookies.set("data_uniq_id", singleDataJson?.data_uniq_id);
    router.push("/group_type/edit");
  };

  const theme = useTheme();

  // Function to close the modal
  const handleClose = () => setOpen(false);

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
  const HandleRouteCreate = () => {
    router.push("/group_type/create");
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
        `master/group/get?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=${searchFinal}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${type}&order_field=${field}`
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
        `master/group/get?access_token=${ACCESS_TOKEN}&items_per_page=10000`
      )
      .then((response) => {
        setsearchFilterData(response.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleRefresh = () => {
    setPageNumber(1);
    setSearchValue("");
    setsearchInput("");
  };

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
  ]);

  const tableHead = [
    {
      id: 1,
      label: "Group Type",
      value: "group_type",
      fieldName: "group_type",
    },
    {
      id: 2,
      label: "Status",
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
                {item.group_type || "---"}
              </Typography>
            </Box>
          ),
          label: "User ID",
          id: 1,
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
          id: 2,
        },
      ],
      json: [item],
      active: item.active_status,
      active_name: item.status,
    };

    td_data_set.push(array_data);
  });

  const handleFieldChange = (field, type) => {
    setOrderField(field);
    setOrderType(type);
    fetchData(field, type);
  };

  const handleOnActionClick = (e, data) => {
    setSingleData(data);
    setSingleDataJson(data?.json[0]);
    setAnchorEl2(e.currentTarget);
  };

  const handleStatusChange = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      data_ids: [singleDataJson?.data_uniq_id],
      active_status: singleDataJson?.active_status === 1 ? 0 : 1,
    };
    axiosPost
      .post(`master/group/status`, jsonData)
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
      .post(`master/group/status`, jsonData)
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
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        console.error("Error:", error);
      });
  };

  const MenuComponent = (rowId) => {
    return (
      <List sx={{ p: 0, fontSize: "12px" }}>
        {singleDataJson?.main_status == 1 ? (
          <MenuItem sx={{ opacity: 0.5 }}>Change Status</MenuItem>
        ) : (
          <MenuItem onClick={handleOpen}>Change Status</MenuItem>
        )}

        {singleDataJson?.main_status == 1 ? (
          <MenuItem sx={{ opacity: 0.5 }}>Edit</MenuItem>
        ) : (
          <MenuItem onClick={HandleEditTrader}>Edit</MenuItem>
        )}
      </List>
    );
  };

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
          <MasterTable
            pageNumber={pageNumber}
            pageCount={pageCount}
            tableHead={tableHead}
            tableRow={td_data_set}
            actionPrivilege={true}
            searchInput={searchInput}
            setSearchValue={setsearchInput}
            onSearchButtonClick={handleSearchInputChange}
            heading={"Group Type"}
            limitEnd={limitEnd}
            setLimitEnd={setLimitEnd}
            anchorEl2={anchorEl2}
            setAnchorEl2={setAnchorEl2}
            handleClose2={handleClose2}
            MenuComponent={MenuComponent}
            singleProduct={singleProduct}
            setSingleProduct={setSingleProduct}
            handleOnActionClick={handleOnActionClick}
            onRefresh={handleRefresh}
            handleSearchFinal={handleSearchFinal}
            onAddClick={HandleRouteCreate}
            isLoading={isLoading}
            fieldChange={handleFieldChange}
            searchFilterData={searchFilterData}
            suggestions={suggestions}
            dataCount={dataCount}
            onPageChange={handlePageChange}
            orderType={orderType}
          />
        </Grid>
      </Grid>

      <MultiModal
        open={openMulitiStatus}
        onsubmit={handleMulitiStatusChange}
        onClose={handleCloseMultiStatus}
        activeStatus={activeStatus}
        setactiveStatus={setactiveStatus}
        singleProduct={singleProduct}
        setSingleProduct={setSingleProduct}
        text={`Are you sure want to ${
          actionData == 0 ? "Disable" : "Enable"
        } users?`}
      />

      <ReusableModal
        open={open}
        onsubmit={handleStatusChange}
        onClose={handleClose}
        activeStatus={activeStatus}
        setactiveStatus={setactiveStatus}
        singleProduct={singleProduct}
        setSingleProduct={setSingleProduct}
        actionData={singleDataJson?.active_status}
        type="Group Type"
        text={`Are you sure want to ${
          singleDataJson?.active_status != 0 ? "disable" : "enable"
        } group type?`}
      />

      {/* <Modal open={isLoading}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Modal> */}
    </>
  );
};

export default AllTraders;
