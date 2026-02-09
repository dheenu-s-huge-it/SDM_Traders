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
import React, { useState, useEffect } from "react";
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
import CustomAutoCompleteSelect from "../CustomAutoCompleteSelect";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { parse } from "date-fns";
function SalesCreate({ Header, route_back }) {
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

  const cashTypeMaster = [
    { id: 1, label: "Credit" },
    { id: 2, label: "Cash" },
  ];

  const [dateOfSelling, setdateOfSelling] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [timeOfSelling, settimeOfSelling] = useState(moment().format("HH:mm"));
  const [flowerTypeID, setflowerTypeID] = useState("");
  const [flowerType, setflowerType] = useState("");
  const [traderID, settraderID] = useState("");
  const [traderName, settraderName] = useState("");

  const [quantityValue, setquantityValue] = useState("");
  const [pricePerQuantity, setpricePerQuantity] = useState("");
  const [luggageValue, setluggageValue] = useState("");
  const [netAmount, setnetAmount] = useState(0);
  const [totalAmount, settotalAmount] = useState(0);

  const calculateValues = (qty, price, luggage) => {
    const q = Number(qty) || 0;
    const p = Number(price) || 0;
    const l = Number(luggage) || 0;

    const net = q * p;
    const total = net + l;

    setnetAmount(parseFloat(net.toFixed(2)));
    settotalAmount(parseFloat(total.toFixed(2)));
  };

  const HandleChangeQuantity = (event) => {
    let value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setquantityValue(value);
      calculateValues(value, pricePerQuantity, luggageValue);
    }
  };
  const HandleChangePricePerQuantity = (event) => {
    let value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setpricePerQuantity(value);
      calculateValues(quantityValue, value, luggageValue);
    }
  };

  const HandleChangeLuggage = (event) => {
    let value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setluggageValue(value);
      calculateValues(quantityValue, pricePerQuantity, value);
    }
  };

  const handleChangeDateofSelling = (event) => {
    const formattedDate = moment(event.target.value).format("YYYY-MM-DD");
    setdateOfSelling(formattedDate);
  };

  const handleChangeTimeofSelling = (newValue) => {
    if (newValue) {
      const formattedTime = moment(newValue).format("HH:mm");
      settimeOfSelling(formattedTime);
    }
  };

  const [flowerTypeMaster, setflowerTypeMaster] = useState([]);
  console.log(flowerTypeMaster, "flowerTypeMaster");

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

  const ChangeFlowerTypeMaster = (event, value) => {
    if (value != null) {
      setflowerTypeID(value.data_uniq_id);
      setflowerType(value.flower_type);
    } else {
      setflowerTypeID("");
      setflowerTypeID("");
    }
  };

  const [traderMaster, settraderMaster] = useState([]);
    console.log(traderMaster, "TraderTypeMaster");

  const HandleTraderMaster = () => {
    fetchDateSingle("employee_get", settraderMaster, {
      access_token: token,
      search_input: "",
      from_date: "",
      to_date: "",
      user_type: 2,
      active_status: 1,
      items_per_page: 10000,
      order_type: "ASC",
      order_field: "user_type",
    });
  };

  const ChangeTraderMaster = (event, value) => {
    if (value != null) {
      settraderID(value.data_uniq_id);
      // settraderName(value.first_name);
      settraderName(
        value.last_name
          ? `${value.first_name} ${value.last_name}`
          : value.first_name,
      );
    } else {
      settraderID("");
      settraderName("");
    }
  };

  useEffect(() => {
    HandleFlowerTypeMaster();
    HandleTraderMaster();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e) => {
    if (Number(totalAmount) > 0) {
      setIsLoading(true);
      const jsonStructure = {
        access_token: token,
        date_wise_selling: dateOfSelling,
        time_wise_selling: timeOfSelling,
        trader_id: traderID,
        trader_name: traderName,
        flower_type_id: flowerTypeID,
        flower_type_name: flowerType,
        quantity: Number(quantityValue),
        per_quantity: Number(pricePerQuantity),
        group_id: traderID,
      };
      try {
        axiosPost
          .post("sales/sales_order/create", jsonStructure)
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
            console.error("POST Error:", error);

            setIsLoading(false);
          });
      } catch (error) {
        console.error("An error occurred:", error);

        setIsLoading(false);
      }
    } else {
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
        Add {Header}
      </Typography>

      <Grid container spacing={6} sx={{ marginBottom: "18px" }}>
        <Grid item xs={12} sm={4}>
          <Controller
            name="DateOfSelling"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <>
                {renderLabel("Date Of Selling", true)}
                <CustomTextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  type="date"
                  value={dateOfSelling}
                  onChange={(e) => {
                    handleChangeDateofSelling(e);
                    if (errorsMessage.date_wise_selling) {
                      seterrorsMessage((prev) => ({
                        ...prev,
                        date_wise_selling: "",
                      }));
                    }
                  }}
                  placeholder="DD-MM-YYYY"
                  error={!!errorsMessage.date_wise_selling}
                  helperText={
                    errorsMessage.date_wise_selling
                      ? errorsMessage.date_wise_selling
                      : ""
                  }
                  inputProps={{
                    max: moment().format("YYYY-MM-DD"),
                    onKeyDown: (e) => e.preventDefault(),
                  }}
                  onClick={(e) => {
                    if (e.target.showPicker) {
                      e.target.showPicker();
                    }
                  }}
                />
              </>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controller
            name="timeOfSelling"
            control={control}
            defaultValue={moment().toDate()}
            rules={{ required: true }}
            render={({ field }) => (
              <>
                {renderLabel("Time Of Selling", true)}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    {...field}
                    ampm // ✅ 12-hour format
                    open={timePickerOpen}
                    onOpen={() => setTimePickerOpen(true)}
                    onClose={() => setTimePickerOpen(false)}
                    value={
                      timeOfSelling
                        ? moment(timeOfSelling, "HH:mm").toDate()
                        : null
                    }
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      if (newValue) {
                        handleChangeTimeofSelling(newValue);
                        setTimePickerOpen(false); // ✅ close dropdown after selecting
                      }
                      if (errorsMessage.time_wise_selling) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          time_wise_selling: "",
                        }));
                      }
                    }}
                    slotProps={{
                      actionBar: { actions: [] }, // hides OK/Cancel
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errorsMessage.time_wise_selling,
                        helperText: errorsMessage.time_wise_selling || "",
                        inputProps: {
                          onKeyDown: (e) => e.preventDefault(), // prevent typing
                        },
                        onClick: () => setTimePickerOpen(true),
                      },
                    }}
                  />
                </LocalizationProvider>
              </>
            )}
          />
        </Grid>

        {/* <Grid item xs={12} sm={4}>
          <Controller
            name="timeOfSelling"
            control={control}
            defaultValue={moment().toDate()}
            rules={{ required: true }}
            render={({ field }) => (
              <>
                {renderLabel("Time Of Selling", true)}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    {...field}
                    ampm
                    open={timePickerOpen}
                    onOpen={() => setTimePickerOpen(true)}
                    onClose={() => setTimePickerOpen(false)}
                    // ✅ Convert HH:mm string back into Date for the picker
                    value={
                      timeOfSelling
                        ? moment(timeOfSelling, "HH:mm").toDate()
                        : null
                    }
                    onChange={(newValue) => {
                      field.onChange(newValue); // sync with react-hook-form
                      if (newValue) {
                        handleChangeTimeofSelling(newValue);
                      }
                      if (errorsMessage.time_wise_selling) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          time_wise_selling: "",
                        }));
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errorsMessage.time_wise_selling,
                        helperText: errorsMessage.time_wise_selling || "",
                        inputProps: {
                          onKeyDown: (e) => e.preventDefault(), // prevent typing
                        },
                        onClick: () => setTimePickerOpen(true),
                      },
                    }}
                  />
                </LocalizationProvider>
              </>
            )}
          />
        </Grid> */}

        <Grid item xs={12} sm={4}>
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
                  error={!!errorsMessage.flower_type_id}
                  helperText={
                    errorsMessage.flower_type_id
                      ? errorsMessage.flower_type_id
                      : ""
                  }
                  value={flowerType}
                  onChange={(e, v) => {
                    ChangeFlowerTypeMaster(e, v);
                    if (errorsMessage.flower_type_id) {
                      seterrorsMessage((prev) => ({
                        ...prev,
                        flower_type_id: "",
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

      <Grid container spacing={6} sx={{ marginBottom: "18px" }}>
        <Grid item xs={12} sm={4}>
          <Controller
            name="trader"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <>
                {renderLabel("Trader", true)}
                <CustomAutoComplete
                  id="select-status"
                  label="Trader"
                  error={!!errorsMessage.trader_id}
                  helperText={
                    errorsMessage.trader_id ? errorsMessage.trader_id : ""
                  }
                  value={traderName}
                  onChange={(e, v) => {
                    ChangeTraderMaster(e, v);
                    if (errorsMessage.trader_id) {
                      seterrorsMessage((prev) => ({
                        ...prev,
                        trader_id: "",
                      }));
                    }
                  }}
                  options={traderMaster}
                  option_label={
                    (option) =>
                      typeof option === "string"
                        ? option
                        : `${option.user_id}-${option.first_name}${option.last_name ? " " + option.last_name : ""}` ||
                          ""

                    // typeof option === "string"
                    //   ? option
                    //   : `${option.user_id}-${option.first_name}` || ""
                  }
                />
              </>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <>
                {renderLabel("Quantity", true)}
                <CustomTextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  value={quantityValue}
                  onChange={(e) => {
                    HandleChangeQuantity(e);
                    if (errorsMessage.quantity) {
                      seterrorsMessage((prev) => ({
                        ...prev,
                        quantity: "",
                      }));
                    }
                  }}
                  error={!!errorsMessage.quantity}
                  helperText={
                    errorsMessage.quantity ? errorsMessage.quantity : ""
                  }
                  placeholder="Quantity"
                  // sx={{ mb: 5 }}
                />
              </>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="PricePerQuantity"
            control={control}
            render={({ field }) => (
              <>
                {renderLabel("Price Per Quantity", true)}
                <CustomTextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  value={pricePerQuantity}
                  error={!!errorsMessage.per_quantity}
                  helperText={
                    errorsMessage.per_quantity ? errorsMessage.per_quantity : ""
                  }
                  onChange={(e) => {
                    HandleChangePricePerQuantity(e);
                    if (errorsMessage.per_quantity) {
                      seterrorsMessage((prev) => ({
                        ...prev,
                        per_quantity: "",
                      }));
                    }
                  }}
                  placeholder="Price Per Quantity"
                />
              </>
            )}
          />
        </Grid>
      </Grid>

      <Grid container spacing={6} sx={{ marginBottom: "18px" }}>
        <Grid item xs={12} sm={4}>
          <Controller
            name="total_amount"
            control={control}
            render={({ field }) => (
              <>
                {renderLabel("Total Amount", false)}
                <CustomTextField
                  {...field}
                  fullWidth
                  disabled
                  variant="outlined"
                  value={totalAmount.toLocaleString("en-IN")}
                  placeholder="Total Amount"
                  // sx={{ mb: 5 }}
                />
              </>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="luggage_amount"
            control={control}
            render={({ field }) => (
              <>
                {renderLabel("Luggage Amount", false)}
                <CustomTextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  value={luggageValue}
                  onChange={HandleChangeLuggage}
                  placeholder="Luggage Amount"
                  // sx={{ mb: 5 }}
                />
              </>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="net_amount"
            control={control}
            render={({ field }) => (
              <>
                {renderLabel("Net Amount", false)}
                <CustomTextField
                  {...field}
                  fullWidth
                  disabled
                  variant="outlined"
                  value={netAmount.toLocaleString("en-IN")}
                  placeholder="Net Amount"
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSignIn}
        >
          Submit
        </Button>
      </Box>

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
export default SalesCreate;
