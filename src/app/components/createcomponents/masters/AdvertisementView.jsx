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
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import CustomTextField from "../../../../@core/components/mui/TextField";
import { useForm, Controller } from "react-hook-form";
import { axiosPost, axiosGet } from "../../../../lib/api";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { fetchDateSingle } from "../../../../lib/getAPI/apiFetch";
import moment from "moment";
import AlertDialog from "../../container/AlertDialog";
import CustomAutoComplete from "../CustomAutoComplete";
import FileDisplay from "./UploadAdView";
import { API_ENDPOINT } from "../../../../lib/config";

function AdvertisementView({ Header, route_back }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorsMessage, seterrorsMessage] = useState([]);

  const router = useRouter();

  const USER_ID = Cookies.get("data_uniq_id");

  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const token = Cookies.get("token");

  const [DocumentDate, setDocumentDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [DocumentTypeID, setDocumentTypeID] = useState("");
  const [DocumentType, setDocumentType] = useState("");
  const [remarks, setremarks] = useState("");

  const HandleChangeRemarks = (event) => {
    let value = event.target.value;
    setremarks(value);
  };

  const handleChangeDocumentDate = (event) => {
    const formattedDate = moment(event.target.value).format("YYYY-MM-DD");
    setDocumentDate(formattedDate);
  };
 const fileInputRef = useRef(null);
 
 const [base64Image, setBase64Image] = useState(null);
 const [deleteImages, setDeleteImages] = useState([]);
 const [errorImg, setErrorImg] = useState({ status: "", message: "" });
 
 const allowedFormats = ["jpeg", "jpg", "png"];
 
 const handleFileChange = (event) => {
   setErrorImg({ status: "", message: "" }); // Reset error before checking
 
   const file = event.target.files[0]; // Get only one file
   const maxSize = 5 * 1024 * 1024; // 5MB
 
   if (!file) return;
 
   const fileExtension = file.name.split(".").pop().toLowerCase(); // Extract file extension
 
   if (!allowedFormats.includes(fileExtension)) {
     setErrorImg({ status: "error", message: "Invalid file format" });
     event.target.value = "";
     return;
   }
 
   if (file.size > maxSize) {
     setErrorImg({ status: "error", message: "Maximum File Size is 5MB." });
     event.target.value = "";
     return;
   }
 
   const reader = new FileReader();
 
   reader.onload = (e) => {
     const base64String = e.target.result.split(",")[1];
     setBase64Image({
       image_name: file.name,
       document_doc: base64String,
       existing_image_path: "",
     });
   };
 
   reader.readAsDataURL(file);
 };
 const handleRemoveImage = () => {
  if (base64Image?.data_uniq_id) {
    setDeleteImages([...deleteImages, base64Image]);
  }
  setBase64Image(null);
};


const HandleEditGET = (value) => {
  if (value !== undefined && value !== null) {
      try {
          axiosGet
              .get(`master/advertisement/get?access_token=${token}&data_uniq_id=${value}`)
              .then(async (response) => {
                  const data = response.data.data;

                  if (data.length !== 0) {
                      setremarks(data[0]?.remarks);

                      if (data[0]?.advertisement_master_doc) {
                          setBase64Image({
                              image_name:  data[0]?.advertisement_master_doc.split("/").pop(), // Extract filename
                              image_url: API_ENDPOINT +  data[0]?.advertisement_master_doc, // Full path to file
                              existing_image_path: data[0]?.advertisement_master_doc, 
                          });
                      }
                  }
              });
      } catch (error) {
          console.error("Error fetching advertisement data:", error);
      }
  }
};

  const [DocumentTypeMaster, setDocumentTypeMaster] = useState([]);

  const HandleDocumentTypeMaster = () => {
    fetchDateSingle("master/document/get", setDocumentTypeMaster, {
      access_token: token,
      search_input: "",
      from_date: "",
      to_date: "",
      active_status: 1,
      items_per_page: 10000,
    });
  };

  const ChangeDocumentTypeMaster = (event, value) => {
    if (value != null) {
      setDocumentTypeID(value.data_uniq_id);
      setDocumentType(value.document_type);
    } else {
      setDocumentTypeID("");
      setDocumentTypeID("");
    }
  };

  useEffect(() => {
    HandleDocumentTypeMaster();
    HandleEditGET(USER_ID);
  }, [USER_ID]);

  const [isLoading, setIsLoading] = useState(false);

  const [closeState, setcloseState] = useState(false);

  const onCancel = () => {
    setcloseState(true);
  };

  const onCancelClose = () => {
    setcloseState(false);
  };

  const onClickCancel = () => {
    router.push(route_back);
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
        View {Header}
      </Typography>
      <Typography
          sx={{
            fontWeight: 650,
            fontSize: "20px",
            textAlign: "left",
            color: "black",
            marginBottom: "20px",
          }}
          pt={2}
        >
          Upload File
        </Typography>
        <FileDisplay
          // files={files}
          base64Image={base64Image}
          handleRemoveImage={handleRemoveImage}
          // handleFileDrop={handleFileDrop}
          handleFileChange={handleFileChange}
          fileInputRef={fileInputRef}
          errorsMessage={errorsMessage}
        />

      <Grid container spacing={6}>
        <Grid item xs={12} sm={12} mt={4}>
          <Controller
            name="remarks"
            control={control}
            render={({ field }) => (
              <>
                {renderLabel("Remarks", false)}
                <CustomTextField
                  {...field}
                  fullWidth
                  disabled
                  variant="outlined"
                  value={remarks}
                    error={!!errorsMessage.remarks}
                    helperText={
                      errorsMessage.remarks ? errorsMessage.remarks : ""
                    }
                    onChange={(e) => {
                      HandleChangeRemarks(e);
                      if (errorsMessage.remarks) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          remarks: "",
                        }));
                      }
                    }}
                  placeholder="Remarks"
                  sx={{ mb: 5 }}
                  multiline // Enables multi-line input
                  rows={3} // Number of visible rows
                />
              </>
            )}
          />
        </Grid>
      </Grid>

      
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onCancel} variant="outlined" sx={{ mr: 2 }}>
          Cancel
        </Button>
      </Box>
      <AlertDialog
        onsubmit={onClickCancel}
        open={closeState}
        handleClose={onCancelClose}
        text={"Are you sure want to cancel view?"}
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

export default AdvertisementView;
