"use client";
import { Box, Grid, Typography, Card, Button } from "@mui/material";
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

function SalesView({ Header, route_back }) {
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

  const cashTypeMaster = [
    { id: 1, label: "Credit" },
    { id: 2, label: "Cash" },
  ];

  const [dateOfSelling, setdateOfSelling] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [timeOfSelling, settimeOfSelling] = useState("");
  const [flowerTypeID, setflowerTypeID] = useState("");
  const [flowerType, setflowerType] = useState("");
  const [cashTypeID, setcashTypeID] = useState(1);
  const [cashTypeName, setcashTypeName] = useState("Credit");
  const [traderID, settraderID] = useState("");
  const [traderName, settraderName] = useState("");
  const [quantityValue, setquantityValue] = useState("");
  const [pricePerQuantity, setpricePerQuantity] = useState("");
  const [discountValue, setdiscountValue] = useState("");
  const [sumAmount, setsumAmount] = useState("");
  const [totalAmount, settotalAmount] = useState("");
  const [tollAmount, settollAmount] = useState("");
  const [tollPriceData, settollPriceData] = useState([]);

  const [premiumAmount, setpremiumAmount] = useState("");
  const [premiumStatus, setpremiumStatus] = useState(0);


  const HandleChangeQuantity = (event) => {
    let value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (Number(value) >= 0) {
        setquantityValue(value);
        const amountValue = Number(value) * Number(pricePerQuantity);
        const discount = Number(sumAmount) * (Number(discountValue || 0) / 100);
        const sumamount = amountValue - discount;
        const matchingToll = tollPriceData?.find(
          (item) => sumamount >= item.from_amount && sumamount <= item.to_amount
        );
        const tollamount = matchingToll ? matchingToll.price : 0;
        settollAmount(tollamount);
        const totalamount = sumamount + Number(tollamount);
        setsumAmount(parseFloat(sumamount.toFixed(2)));
        settotalAmount(parseFloat(totalamount.toFixed(2)));
      }
    }
  };

  const HandleChangePricePerQuantity = (event) => {
    let value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (Number(value) >= 0) {
        setpricePerQuantity(event.target.value);
        const amountValue = Number(event.target.value) * Number(quantityValue);
        const discount = amountValue * (Number(discountValue || 0) / 100);
        const sumamount = amountValue - discount;
        const matchingToll = tollPriceData?.find(
          (item) => sumamount >= item.from_amount && sumamount <= item.to_amount
        );
        const tollamount = matchingToll ? matchingToll.price : 0;
        settollAmount(tollamount);
        const totalamount = sumamount + Number(tollamount);
        setsumAmount(parseFloat(sumamount.toFixed(2)));
        settotalAmount(parseFloat(totalamount.toFixed(2)));
      }
    }
  };

  const HandleChangeDiscount = (event) => {
    let value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (Number(value) >= 0) {
        setdiscountValue(event.target.value);
        const amountValue = Number(quantityValue) * Number(pricePerQuantity);
        const discount = amountValue * (Number(event.target.value || 0) / 100);
        const sumamount = amountValue - discount;
        const matchingToll = tollPriceData?.find(
          (item) => sumamount >= item.from_amount && sumamount <= item.to_amount
        );
        const tollamount = matchingToll ? matchingToll.price : 0;
        settollAmount(tollamount);
        const totalamount = sumamount + Number(tollamount);
        setsumAmount(parseFloat(sumamount.toFixed(2)));
        settotalAmount(parseFloat(totalamount.toFixed(2)));
      }
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

  const ChangeCashType = (event, value) => {
    if (value != null) {
      setcashTypeID(value.id);
      setcashTypeName(value.label);
      settraderID("");
      settraderName("");
    } else {
      setcashTypeID("");
      setcashTypeName("");
      settraderID("");
      settraderName("");
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

  const ChangeFlowerTypeMaster = (event, value) => {
    if (value != null) {
      setflowerTypeID(value.data_uniq_id);
      setflowerType(value.flower_type);
      settollPriceData(value?.toll_price_data);
    } else {
      setflowerTypeID("");
      setflowerTypeID("");
      settollPriceData([]);
    }
  };

  const [traderMaster, settraderMaster] = useState([]);

  const HandleTraderMaster = () => {
    fetchDateSingle("employee_get", settraderMaster, {
      access_token: token,
      search_input: "",
      from_date: "",
      to_date: "",
      user_type: 3,
      active_status: 1,
      items_per_page: 10000,
      order_type: "ASC",
      order_field: "user_type",
    });
  };

  const ChangeTraderMaster = (event, value) => {
    if (value != null) {
      settraderID(value.data_uniq_id);
      settraderName(value.nick_name);
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
            `sales/sales_order/get?access_token=${token}&data_uniq_id=${value}`
          )
          .then((response) => {
            const data = response.data.data;
            if (data.length !== 0) {
              setdateOfSelling(data[0]?.date_wise_selling);
              settimeOfSelling(data[0]?.time_wise_selling);
              setflowerTypeID(data[0]?.flower_type_id);
              setflowerType(data[0]?.flower_type_name);
              setcashTypeID(
                data[0]?.payment_type === "Credit" &&
                  data[0]?.payment_type === "credit"
                  ? 1
                  : 2
              );
              setcashTypeName(data[0]?.payment_type);
              settraderID(data[0]?.trader_id);
              settraderName(data[0]?.trader_name);
              setquantityValue(data[0]?.quantity);
              setpricePerQuantity(data[0]?.per_quantity);
              setdiscountValue(data[0]?.discount);
              setsumAmount(data[0]?.luggage);
              settotalAmount(data[0]?.total_amount);
              settollAmount(data[0]?.toll_amount);
              settollPriceData(data[0]?.toll_price_data);
              setpaidAmount(data[0]?.paid_amount);
              setbalanceAmount(data[0]?.balance_amount);
              setpremiumStatus(data[0]?.premium_trader);
              setpremiumAmount(data[0]?.premium_amount);
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
                  disabled
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
                  disabled
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
                  createdisabled={true}
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
                  createdisabled={true}
                  value={traderName}
                  options={traderMaster}
                  option_label={(option) =>
                    typeof option === "string"
                      ? option
                      : `${option.user_id}-${option.nick_name}` || ""
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
                  disabled
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
                {renderLabel("Price Per Qunatity", true)}
                <CustomTextField
                  {...field}
                  fullWidth
                  disabled
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
                  placeholder="Price Per Qunatity"
                  sx={{ mb: 5 }}
                />
              </>
            )}
          />
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        {/* <Grid item xs={12} sm={4}>
          <Controller
            name="discount"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <>
                {renderLabel("Discount %", false)}
                <CustomTextField
                  {...field}
                  fullWidth
                  disabled
                  variant="outlined"
                  value={discountValue}
                  onChange={(e) => {
                    HandleChangeDiscount(e);
                  }}
                  placeholder="Discount %"
                  sx={{ mb: 5 }}
                />
              </>
            )}
          />
        </Grid> */}
      </Grid>

      {/* {premiumStatus === 1 ? (
        <Grid container spacing={6}>
          <Grid item xs={12} sm={4}>
            <Controller
              name="premium"
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <>
                  {renderLabel("Premium", false)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    disabled
                    value={premiumAmount.toLocaleString("en-IN")}
                    placeholder="Premium"
                    sx={{ mb: 5 }}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="sum_amount"
              control={control}
              render={({ field }) => (
                <>
                  {renderLabel("Sum Amount", false)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled
                    variant="outlined"
                    value={sumAmount.toLocaleString("en-IN")}
                    placeholder="Sum Amount"
                    // sx={{ mb: 5 }}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="toll"
              control={control}
              render={({ field }) => (
                <>
                  {renderLabel("Toll", false)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled
                    variant="outlined"
                    value={tollAmount.toLocaleString("en-IN")}
                    placeholder="Toll"
                    // sx={{ mb: 5 }}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>
      ) : ( */}
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <Controller
            name="sum_amount"
            control={control}
            render={({ field }) => (
              <>
                {renderLabel("Luggage Amount", false)}
                <CustomTextField
                  {...field}
                  fullWidth
                  disabled
                  variant="outlined"
                  value={sumAmount.toLocaleString("en-IN")}
                  placeholder="Sum Amount"
                  // sx={{ mb: 5 }}
                />
              </>
            )}
          />
        </Grid>
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

        {/* <Grid item xs={12} sm={4}> */}
        {/* <Controller
              name="toll"
              control={control}
              render={({ field }) => (
                <>
                  {renderLabel("Toll", false)}
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled
                    variant="outlined"
                    value={tollAmount.toLocaleString("en-IN")}
                    placeholder="Toll"
                    // sx={{ mb: 5 }}
                  />
                </>
              )}
            /> */}
      </Grid>

      {/* </Grid> */}
      {/* )} */}

      {/* {premiumStatus === 1 && (
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
        </Grid>
      )} */}

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

export default SalesView;
