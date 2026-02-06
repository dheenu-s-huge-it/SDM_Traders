"use client";
import {
  Box,
  Grid,
  Typography,
  Card,
  Button,
  Modal,
  CircularProgress,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,IconButton
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
import CustomAutoComplete from "../CustomAutoComplete";
import { fetchDateSingle } from "../../../../lib/getAPI/apiFetch";

function ViewTollMaster({ Header, route_back }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorsMessage, seterrorsMessage] = useState([]);
  const USER_ID = Cookies.get("data_uniq_id");
  const router = useRouter();

  const [orderMaterial, setorderMaterial] = useState([
    {
      from_amount: "",
      to_amount: "",
      price: "",
    },
  ]);

  const handleAddProductDetails = () => {
    setorderMaterial([
      ...orderMaterial,
      {
        from_amount: "",
        to_amount: "",
        price: "",
      },
    ]);
  };

  const handleRemoveProductDetails = (index) => {
    if (orderMaterial.length > 1) {
      const newErningDetails = [...orderMaterial];
      newErningDetails.splice(index, 1);
      setorderMaterial(newErningDetails);
    }
  };

  const [flowerTypeMaster, setflowerTypeMaster] = useState([]);

  const HandleFlowerTypeMaster = () => {
    fetchDateSingle("master/flower_type/get", setflowerTypeMaster, {
      access_token: token,
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

  const [errorsList, seterrorsList] = useState([]);

  const HandleChangeMaterial = (event, index, ref) => {
    const newFields = [...orderMaterial];
    const value = Number(event.target.value);
    let isValid = true;
    let newErrors = [...errorsList];

    if (ref === "from_amount") {
      for (let i = 0; i < index; i++) {
        const prevFrom = Number(orderMaterial[i].from_amount);
        const prevTo = Number(orderMaterial[i].to_amount);
        if (value >= prevFrom && value <= prevTo) {
          isValid = false;
          break;
        }
      }
      newFields[index].from_amount = value;
      if (isValid) {
        newErrors[index] = { ...newErrors[index], from_amount: "" };
      } else {
        newErrors[index] = {
          ...newErrors[index],
          from_amount: `Value must be greater than ${orderMaterial[index - 1]?.to_amount}`,
        };
      }
    } else if (ref === "to_amount") {
      const currentFromAmount = Number(newFields[index].from_amount);
      for (let i = 0; i < index; i++) {
        const prevFrom = Number(orderMaterial[i].from_amount);
        const prevTo = Number(orderMaterial[i].to_amount);
        if (value >= prevFrom && value <= prevTo) {
          isValid = false;
          break;
        }
      }
      newFields[index].to_amount = value;
      if (isValid && value > currentFromAmount) {
        newErrors[index] = { ...newErrors[index], to_amount: "" };
      } else {
        newErrors[index] = {
          ...newErrors[index],
          to_amount: `Value must be greater than ${orderMaterial[index - 1]?.to_amount}`,
        };
      }
    } else if (ref === "price") {
      if (value >= 0) {
        newFields[index].price = value;
      }
    } else {
      newFields[index] = { from_amount: "", to_amount: "", price: "" };
    }
    setorderMaterial(newFields); // Ensure state is always updated
    seterrorsList(newErrors); // Update errors separately
  };

  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const token = Cookies.get("token");

  const [flowerType, setflowerType] = useState("");
  const [flowerTypeID, setflowerTypeID] = useState("");
  const [dataUniqID, setDataUniqID] = useState("");

  const HandleEditGET = (value) => {
    if (value !== undefined && value !== null) {
      try {
        axiosGet
          .get(
            `master/toll_master/get?access_token=${token}&data_uniq_id=${value}`
          )
          .then((response) => {
            const data = response.data.data;
            if (data.length !== 0) {
              setflowerType(data[0]?.flower_type_name);
              setflowerTypeID(data[0]?.flower_type_id);
              setorderMaterial(data[0]?.toll_price_data)
              setDataUniqID(data[0].data_uniq_id)
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
        View {Header}
      </Typography>
      <Typography variant="h5" fontWeight={500} my={0.5} sx={{ mb: 5 }}>
        1. {Header} Details
      </Typography>

      <Box>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="flower_type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  {renderLabel("Flower Type", true)}
                  <CustomAutoComplete
                    id="select-status"
                    label="Flower Type"
                    error={!!errorsMessage.flower_type}
                    helperText={
                      errorsMessage.flower_type ? errorsMessage.flower_type : ""
                    }
                    value={flowerType}
                    createdisabled={true}
                    onChange={(e, v) => {
                      ChangeFlowerTypeMaster(e, v);
                      if (errorsMessage.flower_type) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          flower_type: "",
                        }));
                      }
                    }}
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
        </Grid>

        <Stack sx={{ height: "50vh", marginTop: "10px" }}>
          <TableContainer
            sx={{
              mt: 2,
              overflowX: "auto",
              overflowY: "auto",
              "&::-webkit-scrollbar:horizontal": {
                display: "block",
              },
              "&::-webkit-scrollbar:vertical": {
                display: "none",
              },
            }}
            size="small"
          >
            <Table
              size="small"
              stickyHeader
              aria-label="simple table"
              className="custom_scroll"
              sx={{
                whiteSpace: "nowrap",
                height: "100%",
              }}
            >
              <TableHead size="small">
                <TableRow size="small">
                  <TableCell align="left">
                    <Typography
                      color="textSecondary"
                      fontWeight="semibold"
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        padding: "6px 0px",
                      }}
                    >
                      From Amount ( ₹ )
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      color="textSecondary"
                      fontWeight="semibold"
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        padding: "6px 0px",
                      }}
                    >
                      To Amount ( ₹ )
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      color="textSecondary"
                      fontWeight="semibold"
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        padding: "6px 0px",
                      }}
                    >
                      Price ( ₹ )
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orderMaterial.map((res, index) => (
                  <TableRow hover key={index}>
                    <TableCell sx={{ p: 2, px: 4 }}>
                      <Controller
                        name="From Amount"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <>
                            {renderLabel("From Amount", true)}
                            <CustomTextField
                              {...field}
                              fullWidth
                              disabled
                              variant="outlined"
                              placeholder="From Amount"
                              value={res.from_amount}
                              onChange={(e) =>
                                HandleChangeMaterial(e, index, "from_amount")
                              }
                              error={!!errorsList[index]?.from_amount}
                              helperText={errorsList[index]?.from_amount || ""}
                              sx={{ mb: 5 }}
                            />
                          </>
                        )}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 2, px: 4 }}>
                      <Controller
                        name="To Amount"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <>
                            {renderLabel("To Amount", true)}
                            <CustomTextField
                              {...field}
                              fullWidth
                              disabled
                              variant="outlined"
                              placeholder="To Amount"
                              value={res.to_amount}
                              onChange={(e) =>
                                HandleChangeMaterial(e, index, "to_amount")
                              }
                              error={!!errorsList[index]?.to_amount}
                              helperText={errorsList[index]?.to_amount || ""}
                              sx={{ mb: 5 }}
                            />
                          </>
                        )}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 2, px: 4 }}>
                      <Controller
                        name="Price"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <>
                            {renderLabel("Price", true)}
                            <CustomTextField
                              {...field}
                              fullWidth
                              disabled
                              variant="outlined"
                              placeholder="Price"
                              value={res.price}
                              onChange={(e) =>
                                HandleChangeMaterial(e, index, "price")
                              }
                              error={!!errorsList[index]?.price}
                              helperText={errorsList[index]?.price || ""}
                              sx={{ mb: 5 }}
                            />
                          </>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={onCancel} variant="outlined" sx={{ mr: 2 }}>
            Cancel
          </Button>
        </Box>
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

export default ViewTollMaster;
