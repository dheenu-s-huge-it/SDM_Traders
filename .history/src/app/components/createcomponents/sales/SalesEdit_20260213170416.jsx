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

function SalesEdit({ Header, route_back }) {
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

  const [luggageValue, setluggageValue] = useState(0);

  const [dateOfSelling, setdateOfSelling] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );
  const [timeOfSelling, settimeOfSelling] = useState("");
  const [flowerTypeID, setflowerTypeID] = useState("");
  const [flowerType, setflowerType] = useState("");
  const [traderID, settraderID] = useState("");
  const [traderName, settraderName] = useState("");
  const [quantityValue, setquantityValue] = useState("");
  const [pricePerQuantity, setpricePerQuantity] = useState("");
  const [netAmount, setNetAmount] = useState("");
  const [totalAmount, settotalAmount] = useState("");

  const [groupId, setGroupId] = useState("");

  const calculateValues = (qty, price, luggage) => {
    const q = Number(qty) || 0;
    const p = Number(price) || 0;
    const l = Number(luggage) || 0;

    const net = q * p;
    const total = net + l;

    settotalAmount(parseFloat(total.toFixed(2)));
    setNetAmount(parseFloat(net.toFixed(2)));
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

  const handleChangeTimeofSelling = (event) => {
    const formattedTime = moment(event.target.value, "HH:mm").format("HH:mm");
    settimeOfSelling(formattedTime);
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

  const ChangeFlowerTypeMaster = (event, value) => {
    if (value != null) {
      setflowerTypeID(value.data_uniq_id);
      setflowerType(value.flower_type);
    } else {
      setflowerTypeID("");
      setflowerType("");
    }
  };
  const [traderMaster, settraderMaster] = useState([]);

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
      settraderName(value.trader_name);
    } else {
      settraderID("");
      settraderName("");
    }
  };
  const HandleEditGET = (value) => {
    if (value !== undefined && value !== null) {
      try {
        axiosGet
          .get(
            `sales/sales_order/get?access_token=${token}&data_uniq_id=${value}`,
          )
          .then((response) => {
            const data = response.data.data;
            if (data.length !== 0) {
              setdateOfSelling(data[0]?.date_wise_selling);
              settimeOfSelling(data[0]?.time_wise_selling);
              setflowerTypeID(data[0]?.flower_type_id);
              setflowerType(data[0]?.flower_type_name);
              settraderID(data[0]?.trader_id);
              settraderName(data[0]?.trader_name);
              setquantityValue(data[0]?.quantity);
              setpricePerQuantity(data[0]?.per_quantity);
              setsumAmount(data[0]?.total_amount);
              setluggageValue(data[0]?.luggage);
              settotalAmount(data[0]?.net_amount);
              setGroupId(data[0]?.group_id);
            }
          });
      } catch (error) {
        throw error;
      }
    }
  };

  useEffect(() => {
    HandleFlowerTypeMaster();
    HandleTraderMaster();
    HandleEditGET(USER_ID);
  }, [USER_ID]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    if (Number(totalAmount) > 0) {
      setIsLoading(true);
      const jsonStructure = {
        access_token: token,
        data_uniq_id: USER_ID,
        date_wise_selling: dateOfSelling,
        time_wise_selling: timeOfSelling,
        trader_id: traderID,
        trader_name: traderName,
        flower_type_id: flowerTypeID,
        flower_type_name: flowerType,
        quantity: Number(quantityValue),
        per_quantity: Number(pricePerQuantity),
        luggage: Number(luggageValue),
        group_id: groupId,
      };
      try {
        axiosPost
          .post("sales/sales_order/edit", jsonStructure)
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
    } else {
      setError({
        status: "error",
        message: "Total Amount Negative Value Not Allowed!",
      });
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

      <form onSubmit={handleSignIn}>
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
                    onClick={(e) => e.target.showPicker()}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="TimeOfSelling"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  {renderLabel("Time Of Selling", true)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    type="time"
                    value={timeOfSelling}
                    onChange={(e) => {
                      handleChangeTimeofSelling(e);
                      if (errorsMessage.time_wise_selling) {
                        seterrorsMessage((prev) => ({
                          ...prev,
                          time_wise_selling: "",
                        }));
                      }
                    }}
                    placeholder="DD-MM-YYYY"
                    error={!!errorsMessage.time_wise_selling}
                    helperText={
                      errorsMessage.time_wise_selling
                        ? errorsMessage.time_wise_selling
                        : ""
                    }
                    inputProps={{
                      onKeyDown: (e) => e.preventDefault(),
                    }}
                    onClick={(e) => e.target.showPicker()}
                  />
                </>
              )}
            />
          </Grid>

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

        <Grid container spacing={6}>
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
                    value={
                      traderMaster.find(
                        (item) => item.data_uniq_id === traderID,
                      ) || null
                    }
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
                    option_label={(option) =>
                      typeof option === "string"
                        ? option
                        : `${option.user_id}-${option.first_name}${option.last_name ? " " + option.last_name : ""}` ||
                          ""
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
                    sx={{ mb: 5 }}
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
                      errorsMessage.per_quantity
                        ? errorsMessage.per_quantity
                        : ""
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

        <Grid container spacing={6}>
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
                    sx={{ mb: 5 }}
                  />
                </>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name="luggage"
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
        {/* )} */}

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

export default SalesEdit;
