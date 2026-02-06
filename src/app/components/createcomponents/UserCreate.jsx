"use client";
import {
  Box,
  Grid,
  Typography,
  Card,
  Divider,
  Button,
  Modal,
  CircularProgress,
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
import AlertDialog from "../container/AlertDialog";
import CustomAutoComplete from "./CustomAutoComplete";

function UserCreate({ route_back, userType, userNames }) {
  const [isBoardMember, setIsBoardMember] = useState(false);
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
  const [stateMaster, setstateMaster] = useState([]);
  const [userTypeID, setuserTypeID] = useState(userType);
  const [userTypeName, setuserTypeName] = useState(userNames);
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [emailID, setemailID] = useState("");
  const [mobileNumber, setmobileNumber] = useState("");
  const [addressOne, setaddressOne] = useState("");
  const [addressTwo, setaddressTwo] = useState("");
  const [groupID, setgroupID] = useState("");
  const [groupName, setgroupName] = useState("");
  const [cityID, setcityID] = useState("MzcxNDczMzA5ODEzMDQyNDQ=");
  const [cityName, setcityName] = useState("Erode");
  const [stateID, setstateID] = useState("MzU5MzgwODkwMDY1MjI3NQ==");
  const [stateName, setstateName] = useState("Tamil Nadu");

  const HandleChangeMobileNumber = (event) => {
    const regex = /^\d{0,10}$/;
    if (regex.test(event.target.value)) {
      setmobileNumber(event.target.value);
    }
  };

  const [GroupMaster, setGroupMaster] = useState([]);

  const HandleGroupMaster = () => {
    fetchDateSingle("master/group/get", setGroupMaster, {
      access_token: token,
      search_input: "",
      from_date: "",
      to_date: "",
      active_status: 1,
      items_per_page: 1000,
    });
  };

  const ChangeGroupMaster = (event, value) => {
    if (value != null) {
      setgroupID(value.data_uniq_id);
      setgroupName(value.group_type);
    } else {
      setgroupID("");
      setgroupName("");
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



 const [lastNumberData, setlastNumberData] = useState("");

  const HandleLastNumber = () => {
    try {
      axiosGet
        .get(`get_new_user_id?access_token=${token}`)
        .then((response) => {
          setlastNumberData(response.data.new_user_id);
        });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    HandleGroupMaster();
    HandleCityMaster("MzU5MzgwODkwMDY1MjI3NQ==");
    HandleStateMaster();
    HandleLastNumber();
  }, [userTypeID]);

  const [imagesOne, setimagesOne] = useState("");
  const [imagesTwo, setimagesTwo] = useState("");

  const fileInputRef = useRef(null);

  const maxImages = 5;
  const [base64Images, setBase64Images] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);

  const allowedFormats = ["pdf", "jpeg", "jpg"];

  const handleFileChange = (event) => {
    setError({ status: "", message: "" });

    const files = Array.from(event.target.files);
    const maxSize = 5 * 1024 * 1024;
    const validFiles = [];

    for (const file of files) {
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!allowedFormats.includes(fileExtension)) {
        setError({ status: "error", message: "Invalid file format" });
        event.target.value = "";
        return;
      }

      if (file.size > maxSize) {
        setError({ status: "error", message: "Maximum File Size is 5MB." });
        event.target.value = "";
        return;
      }

      if (base64Images?.length >= 2) {
        setError({ status: "error", message: "Maximum of 2 files allowed." });
        event.target.value = "";
        return;
      }
      validFiles.push(file);
    }

    const images = [];
    const processFile = (index) => {
      if (index >= validFiles.length) {
        setBase64Images((prevBase64Images) =>
          [...prevBase64Images, ...images].slice(0, maxImages)
        );
        return;
      }

      const file = validFiles[index];
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        images.push({
          image_name: file.name,
          document_doc: base64String,
          existing_image_path: "",
        });
        processFile(index + 1);
      };

      reader.readAsDataURL(file);
    };

    processFile(0);
  };

  const handleRemoveImage = (index) => {
    setBase64Images((prevImages) => prevImages.filter((_, i) => i !== index));
    const imageId = base64Images[index];
    if (imageId.data_uniq_id) {
      setDeleteImages([...deleteImages, imageId]);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const scanDocument = async () => {
    setIsLoading(true);
    try {
      axiosGet
        .get("scan_document")
        .then((response) => {

          if (response.data.action === "success") {
            const data = response?.data?.data;
            if (
              imagesOne === "" ||
              imagesOne === NaN ||
              imagesOne === undefined
            ) {
              setimagesOne(data);
            } else {
              setimagesTwo(data);
            }
            setIsLoading(false);
          } else {
            setError({ status: "error", message: "Scanner Error" });
            setIsLoading(false);
          }
        })
        .catch((error) => {
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const jsonStructure = {
      access_token: token,
      first_name: firstName,
      last_name: lastName,
      email_id: emailID,
      mobile_number: mobileNumber,
      address_1: addressOne,
      address_2: addressTwo,
      group_id: groupID,
      group_name: groupName,
      district_id: cityID,
      district_name: cityName,
      state_id: stateID,
      state_name: stateName,
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
    if (userTypeName === "Trader" && isBoardMember === false) {
      router.push("/all-traders");
    } else {
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
        1. Personal Details
      </Typography>

      <form onSubmit={handleSignIn}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={4}>
            <Controller
              name="area"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  {renderLabel("Group", true)}
                  <CustomAutoComplete
                    id="select-status"
                    label="Group"
                    error={!!errorsMessage.group_id}
                    helperText={
                      errorsMessage.group_id ? errorsMessage.group_id : ""
                    }
                    value={groupName}
                    onChange={(e, v) => {
                      ChangeGroupMaster(e, v);
                      if (errorsMessage.group_id) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          group_id: "",
                        }));
                      }
                    }}
                    options={GroupMaster}
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
                    variant="outlined"
                    value={lastNumberData}
                    placeholder={lastNumberData}
                    // sx={{ mb: 5 }}
                  />
                </>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  {renderLabel("First Name", true)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    variant="outlined"
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
                    helperText={
                      errorsMessage.first_name ? errorsMessage.first_name : ""
                    }
                    // sx={{ mb: 5 }}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <>
                  {renderLabel("Last Name", false)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setlastName(e.target.value)}
                    placeholder="Last Name"
                  />
                </>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name="emailID"
              control={control}
              render={({ field }) => (
                <>
                  {renderLabel("Email ID", false)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    value={emailID}
                    error={!!errorsMessage.email_id}
                    helperText={
                      errorsMessage.email_id ? errorsMessage.email_id : ""
                    }
                    onChange={(e) => {
                      setemailID(e.target.value);
                      if (errorsMessage.email_id) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          email_id: "",
                        }));
                      }
                    }}
                    placeholder="Email ID"
                    sx={{ mb: 5 }}
                  />
                </>
              )}
            />
          </Grid>
            <Grid item xs={12} sm={4}>
            <Controller
              name="phoneNumber"
              control={control}
              // rules={{ required: false }}
              render={({ field }) => (
                <>
                  {renderLabel("Phone Number", true)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    variant="outlined"
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
                    placeholder="Phone Number"
                    error={!!errorsMessage.mobile_number}
                    helperText={
                      errorsMessage.mobile_number
                        ? errorsMessage.mobile_number
                        : ""
                    }
                    sx={{ mb:6  }}
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
          <Grid item xs={12} sm={4}>
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

          <Grid item xs={12} sm={4}>
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
