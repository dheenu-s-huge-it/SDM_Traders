"use client";
import {
  Box,
  Grid,
  MenuItem,
  Typography,
  Card,
  Divider,
  Checkbox,
  FormControlLabel,
  Button,
  Modal,
  Autocomplete,
  CircularProgress,
  IconButton,
  Link,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import CustomTextField from "../../../@core/components/mui/TextField";
import { useForm, Controller } from "react-hook-form";
import { axiosPost, axiosGet } from "../../../lib/api";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { fetchDateSingle } from "../../../lib/getAPI/apiFetch";
import moment from "moment";
import AlertDialog from "../container/AlertDialog";
import CustomAutoComplete from "./CustomAutoComplete";

function UserCreate({ Header, route_back, userType, userNames }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorsMessage, seterrorsMessage] = useState([]);

  const router = useRouter();

  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const token = Cookies.get("token");

  const checkScanner = async () => {
    if ("usb" in navigator) {
      try {
        const devices = await navigator.usb.getDevices();
        const scanner = devices.some((device) => {
          return device.productName;
        });
        setIsScannerConnected(scanner);
      } catch (error) {
        setError({ status: "error", message: error.message });
      }
    } else {
      setError({
        status: "error",
        message: "WebUSB API is not supported in this browser.",
      });
    }
  };

  useEffect(() => {
    const handleConnect = () => checkScanner();
    const handleDisconnect = () => checkScanner();
    checkScanner();
    navigator.usb?.addEventListener("connect", handleConnect);
    navigator.usb?.addEventListener("disconnect", handleDisconnect);

    return () => {
      navigator.usb?.removeEventListener("connect", handleConnect);
      navigator.usb?.removeEventListener("disconnect", handleDisconnect);
    };
  }, []);

  const [stateMaster, setstateMaster] = useState([]);

  const [aadhaarNumber, setaadhaarNumber] = useState("");
  const [userTypeID, setuserTypeID] = useState(userType);
  const [userTypeName, setuserTypeName] = useState(userNames);
  const [groupName, setgroupName] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [emailID, setemailID] = useState("");
  const [mobileNumber, setmobileNumber] = useState("");
  const [dateOfJoinging, setdateOfJoinging] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );
  const [addressOne, setaddressOne] = useState("");
  const [addressTwo, setaddressTwo] = useState("");
  const [cityID, setcityID] = useState("MzcxNDczMzA5ODEzMDQyNDQ=");
  const [cityName, setcityName] = useState("Erode");
  const [stateID, setstateID] = useState("MzU5MzgwODkwMDY1MjI3NQ==");
  const [stateName, setstateName] = useState("Tamil Nadu");
  const [accountNumber, setaccountNumber] = useState("");
  const [ifscCode, setifscCode] = useState("");
  const [bankID, setbankID] = useState("");
  const [bankName, setbankName] = useState("");
  const [isScannerConnected, setIsScannerConnected] = useState(false);

  const [groupOptions, setGroupOptions] = useState([]);

  const [selectedGroupId, setSelectedGroupId] = useState("");

  const [selectedGroupName, setSelectedGroupName] = useState("");
  const handleGroupNameChange = (newValue) => {
    setselectedGroup(newValue.data_uniq_id);
    setselectedGroupName(newValue.group_type);
  };

  const HandleChangeAccountNumber = (event) => {
    const regex = /^\d{0,100}$/;
    if (regex.test(event.target.value)) {
      setaccountNumber(event.target.value);
    }
  };

  const HandleChangeADHAARNumber = (event) => {
    const regex = /^\d{0,12}$/;
    if (regex.test(event.target.value)) {
      setaadhaarNumber(event.target.value);
    }
  };

  const HandleChangeMobileNumber = (event) => {
    const regex = /^\d{0,10}$/;
    if (regex.test(event.target.value)) {
      setmobileNumber(event.target.value);
    }
  };

  const [groupMaster, setgroupMaster] = useState([]);

  const HandleGroupMaster = () => {
    fetchDateSingle("master/group/get", setgroupMaster, {
      access_token: token,
      search_input: "",
      from_date: "",
      to_date: "",
      active_status: 1,
      items_per_page: 1000,
    });
  };

  const ChangeGroupMaster = (event, value) => {
    if (value) {
      setSelectedGroupId(value.data_uniq_id);
      setSelectedGroupName(value.group_type);
    } else {
      setSelectedGroupId("");
      setSelectedGroupName("");
    }
  };

  const [cityMaster, setcityMaster] = useState([]);

  const HandleCityMaster = (value) => {
    fetchDateSingle("master/city/get", setcityMaster, {
      access_token: token,
      search_input: "",
      from_date: "",
      to_date: "",
      ref_state_id: value,
      active_status: 1,
      items_per_page: 1000,
    });
  };

  const ChangeCityMaster = (event, value) => {
    if (value != null) {
      setcityID(value.data_uniq_id);
      setcityName(value.label);
    } else {
      setcityID("MzcxNDczMzA5ODEzMDQyNDQ=");
      setcityName("Erode");
    }
  };

  const HandleStateMaster = () => {
    fetchDateSingle("master/state/get", setstateMaster, {
      access_token: token,
      search_input: "",
      from_date: "",
      to_date: "",
      active_status: 1,
      items_per_page: 1000,
    });
  };

  const ChangeStateMaster = (event, value) => {
    if (value != null) {
      setstateID(value.data_uniq_id);
      setstateName(value.label);
      HandleCityMaster(value.data_uniq_id);
    } else {
      setstateID("MzU5MzgwODkwMDY1MjI3NQ==");
      setstateName("Tamil Nadu");
      HandleCityMaster("MzU5MzgwODkwMDY1MjI3NQ==");
    }
  };

  const [bankMaster, setbankMaster] = useState([]);

  const HandleBankMaster = () => {
    fetchDateSingle("master/bankmaster/get", setbankMaster, {
      access_token: token,
      search_input: "",
      from_date: "",
      to_date: "",
      active_status: 1,
      items_per_page: 1000,
    });
  };

  const getGroupList = (value) => {
    axiosGet
      .get(
        `master/group/get?access_token=${token}&active_status=1&items_per_page=10000&ref_state_id=${value}`,
      )
      .then((response) => {
        setGroupOptions(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getGroupList();
  }, []);

  const [lastNumberData, setlastNumberData] = useState("");

  const HandleLastNumber = () => {
    try {
      axiosGet
        .get(`get_new_user_id?access_token=${token}&user_type=${userTypeID}`)
        .then((response) => {
          setlastNumberData(response.data.new_user_id);
        });
    } catch (error) {
      throw error;
    }
  };

  const ChangeBankMaster = (event, value) => {
    if (value != null) {
      setbankID(value.data_uniq_id);
      setbankName(value.bank_name);
    } else {
      setbankID("");
      setbankName("");
    }
  };

  useEffect(() => {
    HandleGroupMaster();
    HandleCityMaster("MzU5MzgwODkwMDY1MjI3NQ==");
    HandleBankMaster();
    HandleStateMaster();
    HandleLastNumber();
  }, [userTypeID]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const jsonStructure = {
      access_token: token,
      user_type: userTypeID,
      user_type_name: userTypeName,
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobileNumber,
      data_of_joining: dateOfJoinging,
      address_1: addressOne,
      address_2: addressTwo,
      district_id: cityID,
      district_name: cityName,
      state_id: stateID,
      state_name: stateName,
      aadhaar_number: aadhaarNumber,
      group_id: selectedGroupId,
      group_name: selectedGroupName,
      email_id: emailID,
      account_number: accountNumber,
      ifsc_code: ifscCode,
      bank_id: bankID,
      bank_name: bankName,
    };
    try {
      axiosPost
        .post("employee_create", jsonStructure)
        .then((response) => {
          if (response.data.action === "success") {
            onClickCancel();
            setError({ status: "success", message: response.data.message });
            setIsLoading(false);
          } else if (response.data.action === "error_group") {
            seterrorsMessage(response.data.message);
            setIsLoading(false);
          } else {
            setError({ status: "error", message: response.data.message });
            setIsLoading(false);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("POST Error:", error);
        });
    } catch (error) {
      setIsLoading(false);
      console.error("An error occurred:", error);
    }
  };

  const [closeState, setcloseState] = useState(false);

  const onCancel = () => {
    setcloseState(true);
  };

  const onCancelClose = () => {
    setcloseState(false);
  };

  const onClickCancel = () => {
    Cookies.remove("data_uniq_id");
    if (userTypeName === "Trader") {
      router.push(route_back);
    }
  };

  const renderLabel = (label, isRequired) => {
    return (
      <Typography variant="body1">
        {label} {isRequired && <span style={{ color: "#D32F2F" }}>*</span>}
      </Typography>
    );
  };

  return (
    <Card sx={{ padding: 10 }}>
      <Typography variant="h5" fontWeight={600} my={0.5} sx={{ mb: 5 }}>
        Add {userTypeName}
      </Typography>
      <Typography variant="h5" fontWeight={500} my={0.5} sx={{ mb: 5 }}>
        1. Account Details
      </Typography>

      <form onSubmit={handleSignIn}>
        {/* <Grid item xs={12} sm={4}>
            <Controller
              name="userType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  {renderLabel("User Type", true)}
                  <CustomTextField
                    id="userType"
                    createdisabled={true}
                    error={!!errorsMessage.user_type}
                    helperText={
                      errorsMessage.user_type ? errorsMessage.user_type : ""
                    }
                    value={userTypeName}
                  />
                </>
              )}
            />
          </Grid> */}

        {/* Row 1: Group | User ID */}
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="Group"
              control={control}
              rules={{ required: true }}
              render={() => (
                <>
                  {renderLabel("Group", false)}
                  <CustomAutoComplete
                    label="Group"
                    error={!!errorsMessage.group_id}
                  helperText={errorsMessage.group_id || ""}
                    value={
                      groupOptions.find(
                        (g) => g.data_uniq_id === selectedGroupId,
                      ) || null
                    }
                    onChange={ChangeGroupMaster}
                    options={groupOptions}
                    option_label={(option) => option.group_type || ""}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="userID"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  {renderLabel("User ID", true)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled
                    value={lastNumberData}
                    placeholder={lastNumberData}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>

        {/* Row 2: First Name | Last Name */}
        <Grid container spacing={6} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: true }}
              render={() => (
                <>
                  {renderLabel("First Name", true)}
                  <CustomTextField
                    fullWidth
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => {
                      setfirstName(e.target.value);
                      if (errorsMessage.first_name) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          first_name: "",
                        }));
                      }
                    }}
                    error={!!errorsMessage.first_name}
                    helperText={errorsMessage.first_name || ""}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              render={() => (
                <>
                  {renderLabel("Last Name", false)}
                  <CustomTextField
                    fullWidth
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setlastName(e.target.value)}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>

        {/* Row 3: Aadhaar | Email | Phone */}
        <Grid container spacing={6} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <Controller
              name="aadhaar_number"
              control={control}
              render={() => (
                <>
                  {renderLabel("Aadhaar Number", true)}
                  <CustomTextField
                    fullWidth
                    placeholder="Aadhaar Number"
                    value={aadhaarNumber}
                    onChange={(e) => {
                      HandleChangeADHAARNumber(e);
                      if (errorsMessage.aadhaar_number) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          aadhaar_number: "",
                        }));
                      }
                    }}
                    error={!!errorsMessage.aadhaar_number}
                    helperText={errorsMessage.aadhaar_number || ""}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="emailID"
              control={control}
              render={() => (
                <>
                  {renderLabel("Email ID", false)}
                  <CustomTextField
                    fullWidth
                    placeholder="Email ID"
                    value={emailID}
                    onChange={(e) => {
                      setemailID(e.target.value);
                      if (errorsMessage.email_id) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          email_id: "",
                        }));
                      }
                    }}
                    error={!!errorsMessage.email_id}
                    helperText={errorsMessage.email_id || ""}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{ required: true }}
              render={() => (
                <>
                  {renderLabel("Phone Number", true)}
                  <CustomTextField
                    fullWidth
                    placeholder="Phone Number"
                    value={mobileNumber}
                    onChange={(e) => {
                      HandleChangeMobileNumber(e);
                      if (errorsMessage.mobile_number) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          mobile_number: "",
                        }));
                      }
                    }}
                    error={!!errorsMessage.mobile_number}
                    helperText={errorsMessage.mobile_number || ""}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 2, mb: 5 }} />

        <Typography variant="h5" fontWeight={500} my={0.5} sx={{ mb: 5 }}>
          2. Address Details
        </Typography>

        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="address1"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  {renderLabel("Address-1", true)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    placeholder="Address-1"
                    value={addressOne}
                    onChange={(e) => {
                      setaddressOne(e.target.value);
                      if (errorsMessage.address_1) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          address_1: "",
                        }));
                      }
                    }}
                    error={!!errorsMessage.address_1}
                    helperText={
                      errorsMessage.address_1 ? errorsMessage.address_1 : ""
                    }
                    // sx={{ mb: 4 }}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="address2"
              control={control}
              render={({ field }) => (
                <>
                  {renderLabel("Address-2", false)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    value={addressTwo}
                    onChange={(event) => setaddressTwo(event.target.value)}
                    placeholder="Address-2"
                    // sx={{ mb: 4 }}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="state"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  {renderLabel("State", true)}
                  <CustomAutoComplete
                    id="select-status"
                    label="District"
                    error={!!errorsMessage.state_id}
                    helperText={
                      errorsMessage.state_id ? errorsMessage.state_id : ""
                    }
                    value={stateName}
                    onChange={(e, v) => {
                      ChangeStateMaster(e, v);
                      if (errorsMessage.state_id) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          state_id: "",
                        }));
                      }
                    }}
                    options={stateMaster}
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
              name="district"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  {renderLabel("District", true)}
                  <CustomAutoComplete
                    id="select-status"
                    label="District"
                    error={!!errorsMessage.district_id}
                    helperText={
                      errorsMessage.district_id ? errorsMessage.district_id : ""
                    }
                    value={cityName}
                    onChange={(e, v) => {
                      ChangeCityMaster(e, v);
                      if (errorsMessage.district_id) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          district_id: "",
                        }));
                      }
                    }}
                    options={cityMaster}
                    option_label={(option) =>
                      typeof option === "string" ? option : option.label || ""
                    }
                  />
                </>
              )}
            />
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 2, mb: 5 }} />

        <Typography variant="h5" fontWeight={500} my={0.5} sx={{ mb: 5 }}>
          3. Bank Details
        </Typography>

        <Grid container spacing={6}>
          <Grid item xs={12} sm={4}>
            <Controller
              name="accountNumber"
              control={control}
              render={({ field }) => (
                <>
                  {renderLabel("Account Number", false)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={HandleChangeAccountNumber}
                    // sx={{ mb: 5 }}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="ifsc"
              control={control}
              render={({ field }) => (
                <>
                  {renderLabel("IFSC", false)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    placeholder="IFSC"
                    value={ifscCode}
                    onChange={(event) => setifscCode(event.target.value)}
                    // sx={{ mb: 5 }}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="bankName"
              control={control}
              render={({ field }) => (
                <>
                  {renderLabel("Name of Bank", false)}
                  <CustomAutoComplete
                    id="select-status"
                    label="Name of Bank"
                    value={bankName}
                    onChange={ChangeBankMaster}
                    options={bankMaster}
                    option_label={(option) =>
                      typeof option === "string"
                        ? option
                        : option.bank_name || ""
                    }
                    // sx={{ mb: 5 }}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
          <Button onClick={onCancel} variant="outlined" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
      <AlertDialog
        onsubmit={onClickCancel}
        open={closeState}
        handleClose={onCancelClose}
        text={"Are you sure want to cancel create?"}
      ></AlertDialog>
      <Modal open={isLoading}>
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
      </Modal>
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
        <Alert onClose={handleClose} severity={error.status}>
          {error.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default UserCreate;
