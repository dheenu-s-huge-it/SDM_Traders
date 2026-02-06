"use client";
import {
  Box,
  Grid,
  Typography,
  Card,
  Button,
  Modal,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CustomTextField from "../../../../@core/components/mui/TextField";
import { useForm, Controller } from "react-hook-form";
import { axiosPost, axiosGet } from "../../../../lib/api";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import AlertDialog from "../../container/AlertDialog";

function EditGroupTypeMaster({ Header, route_back }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorsMessage, seterrorsMessage] = useState([]);
  const USER_ID = Cookies.get("data_uniq_id");
  const router = useRouter();

  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const token = Cookies.get("token");

  const [GroupType, setGroupType] = useState("");

  const HandleEditGET = (value) => {
    if (value !== undefined && value !== null) {
      try {
        axiosGet
          .get(`master/group/get?access_token=${token}&data_uniq_id=${value}`)
          .then((response) => {
            const data = response.data.data;
            if (data.length !== 0) {
                setGroupType(data[0]?.group_type);
            }
          });
      } catch (error) {
        throw error;
      }
    }
  };

  useEffect(() => {
    HandleEditGET(USER_ID);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const jsonStructure = {
      access_token: token,
      group_type: GroupType,
      data_uniq_id: USER_ID,
    };
    try {
      axiosPost.put("master/group/create", jsonStructure)
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
        Update {Header}
      </Typography>
      <Typography variant="h5" fontWeight={500} my={0.5} sx={{ mb: 5 }}>
        1. {Header} Details
      </Typography>

      <form onSubmit={handleSignIn}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={4}>
            <Controller
              name="Group Type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  {renderLabel("Group Type", true)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    placeholder="Group Type"
                    value={GroupType}
                    onChange={(e) => {
                      setGroupType(e.target.value);
                      if (errorsMessage.group_type) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          group_type: "",
                        }));
                      }
                    }}
                    error={!!errorsMessage.group_type}
                    helperText={
                      errorsMessage.group_type ? errorsMessage.group_type : ""
                    }
                    sx={{ mb: 5 }}
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
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
      <AlertDialog
        onsubmit={onClickCancel}
        open={closeState}
        handleClose={onCancelClose}
        text={"Are you sure want to cancel update?"}
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

export default EditGroupTypeMaster;
