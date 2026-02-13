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
import { useTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format, parse } from "date-fns";
import TextField from "@mui/material/TextField";

const labels = [
  "trader",
  "Quantity",
  "Price Per Quantity",
  "Luggage Amount",
  "Total",
];
function SalesCreateMultiple({ Header, route_back }) {
  const token = Cookies.get("token");

  const theme = useTheme();

  const [time, setTime] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorsMessage, seterrorsMessage] = useState([]);
  const router = useRouter();
  const [error, setError] = useState({ status: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [closeState, setcloseState] = useState(false);

  // Top-level fields
  const [dateOfSelling, setdateOfSelling] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [timeOfSelling, settimeOfSelling] = useState(moment().format("HH:mm"));
  const [flowerTypeID, setflowerTypeID] = useState("");
  const [flowerType, setflowerType] = useState("");
  const [groupType, setGroupType] = useState("");
  const [pricePerQuantity, setPricePerQuantity] = useState("");
  const [luggageAmount, setLuggageAmount] = useState("");

  // Multiple trader entries: price per quantity for each trader
  const [traderRows, settraderRows] = useState([]);

  // Masters
  const [flowerTypeMaster, setflowerTypeMaster] = useState([]);
  const [groupTypeID, setGroupTypeID] = useState("");
  const [groupTypeMaster, setGroupTypeMaster] = useState([]);

  const [traderMaster, settraderMaster] = useState([]);

  const calculateAmounts = (quantity, price, luggage) => {
    const qty = Number(quantity) || 0;
    const rate = Number(price) || 0;
    const lug = Number(luggage) || 0;

    const netAmount = qty * rate;
    const totalAmount = netAmount + lug;

    return {
      netAmount: parseFloat(netAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    };
  };

  // Fetch masters
  useEffect(() => {
    fetchDateSingle(
      "master/group/get", // API endpoint for group type
      setGroupTypeMaster, // state to store fetched data
      {
        access_token: token,
        search_input: "",
        from_date: "",
        to_date: "",
        active_status: 1,
        items_per_page: 10000,
      },
    );
    fetchDateSingle("master/flower_type/get", setflowerTypeMaster, {
      access_token: token,
      search_input: "",
      from_date: "",
      to_date: "",
      active_status: 1,
      items_per_page: 10000,
    });

    const fetchtraders = async () => {
      try {
        const response = await axiosGet.get(
          `employee_get?access_token=${token}&user_type=2&active_status=1&items_per_page=10000&order_type=ASC&group_id=${groupTypeID}&order_field=user_id`,
        );
        const data = response.data.data;
        if (Array.isArray(data)) {
          settraderMaster(data);
          // Initialize traderRows with all traders and empty pricePerQuantity
          settraderRows(
            data.map((trader) => ({
              traderID: trader.data_uniq_id,
              // traderName: trader.first_name,
              traderName: trader.last_name
                ? `${trader.first_name} ${trader.last_name}`
                : trader.first_name,
              quantity: "",
              pricePerQuantity: "",
              luggage: "",
              userID: trader.user_id,
            })),
          );
        } else {
          settraderMaster([]);
          settraderRows([]);
        }
      } catch (error) {
        settraderMaster([]);
        settraderRows([]);
      }
    };

    fetchtraders();
  }, [groupTypeID]);

  useEffect(() => {
    if (pricePerQuantity !== "") {
      settraderRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          pricePerQuantity: pricePerQuantity,
        })),
      );
    }
  }, [pricePerQuantity]);
  // Handlers for top-level fields
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

  const handleChangeFlowerType = (event, value) => {
    if (value) {
      setflowerTypeID(value.data_uniq_id);
      setflowerType(value.flower_type);
    } else {
      setflowerTypeID("");
      setflowerType("");
    }
  };

  const handleChangeGroupType = (event, value) => {
    if (value) {
      setGroupTypeID(value.data_uniq_id);
      setGroupType(value.group_type);
    } else {
      setGroupTypeID("");
      setGroupType("");
    }
  };

  const handleChangePricePerQuantity = (event) => {
    let value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (Number(value) >= 0) {
        setPricePerQuantity(value);
      }
    }
  };

  const handleChangeLuggageAmount = (event) => {
    let value = event.target.value;

    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (Number(value) >= 0) {
        setLuggageAmount(value);
      }
    }
  };

  const handleTraderLuggageChange = (index, event) => {
    let value = event.target.value;

    if (/^\d*\.?\d{0,2}$/.test(value) && Number(value) >= 0) {
      settraderRows((prev) =>
        prev.map((row, i) => (i === index ? { ...row, luggage: value } : row)),
      );
    }
  };

  useEffect(() => {
    if (luggageAmount !== "") {
      settraderRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          luggage: luggageAmount,
        })),
      );
    }
  }, [luggageAmount]);

  const handletraderQuantityChange = (index, event) => {
    let value = event.target.value;

    // Allow decimal values with up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (Number(value) >= 0) {
        settraderRows((prevRows) => {
          return prevRows.map((row, i) =>
            i === index ? { ...row, quantity: value } : row,
          );
        });
      }
    } else {
      // Set error for this row (optional)
      console.log(
        "Invalid input: only numbers with up to 2 decimal places allowed",
      );
    }
  };

  const handletraderPriceChange = (index, event) => {
    let value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (Number(value) >= 0) {
        settraderRows((prevRows) => {
          return prevRows.map((row, i) =>
            i === index ? { ...row, pricePerQuantity: value } : row,
          );
        });
      }
    }
  };

  // Handlers for trader rows
  // No trader selection, only price input for each listed trader
  // Remove handlePriceChange
  // Remove add/remove trader row logic

  // Submit handler
  const handleSubmitMultiple = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Calculate sum_amount and total_amount
    const sum_amount = traderRows.reduce((acc, row) => {
      const qty = Number(row.quantity) || 0;
      // Use individual price if available, otherwise use global price
      const price =
        row.pricePerQuantity && row.pricePerQuantity !== ""
          ? Number(row.pricePerQuantity)
          : Number(pricePerQuantity);
      return acc + qty * price;
    }, 0);
    const total_amount = sum_amount;
    const payload = {
      access_token: token,
      date_wise_selling: dateOfSelling,
      time_wise_selling: timeOfSelling,
      flower_type_id: flowerTypeID,
      flower_type_name: flowerType,
      per_quantity: Number(pricePerQuantity),
      flowers_list: traderRows
        .filter((row) => Number(row.quantity) > 0)
        .map((row) => {
          const price =
            row.pricePerQuantity && row.pricePerQuantity !== ""
              ? Number(row.pricePerQuantity)
              : Number(pricePerQuantity);
          return {
            trader_id: row.traderID,
            trader_name: row.traderName,
            quantity: Number(row.quantity),
            per_quantity: price,
            luggage: Number(row.luggage) || 0,
          };
        }),
    };
    axiosPost
      .post("sales/create/multiple", payload)
      .then((response) => {
        if (response.data.action === "success") {
          setError({ status: "success", message: response.data.message });
          setIsLoading(false);
          router.push(route_back);
        } else {
          // If error message is an object, set field errors
          if (
            typeof response.data.message === "object" &&
            response.data.message !== null
          ) {
            seterrorsMessage(response.data.message);
            setError({ status: "error", message: "" }); // Don't show in Snackbar
          } else {
            setError({ status: "error", message: response.data.message });
          }
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setError({ status: "error", message: "Network error" });
        setIsLoading(false);
      });
  };

  // Cancel dialog
  const onCancel = () => setcloseState(true);
  const onCancelClose = () => setcloseState(false);
  const onClickCancel = () => router.push(route_back);

  // Render label
  const renderLabel = (label, isRequired) => (
    <Typography variant="body1">
      {label} {isRequired && <span style={{ color: "#D32F2F" }}>*</span>}
    </Typography>
  );

  const quantityRefs = useRef([]);
  const priceRefs = useRef([]);
  const handleKeyDown = (e, idx, type) => {
    // If Tab is pressed
    if (e.key === "Tab") {
      // Prevent default behavior (which is moving right)
      e.preventDefault();

      const nextIndex = idx + 1;
      // Check if a next row exists
      if (nextIndex < traderRows.length) {
        if (type === "quantity") {
          quantityRefs.current[nextIndex]?.focus();
        } else if (type === "price") {
          priceRefs.current[nextIndex]?.focus();
        }
      } else {
        // Optional: If on the last row, you might want to move to the Price column of the first row
        // or simply do nothing.
      }
    }
  };
  return (
    <Card sx={{ padding: 10 }}>
      <Typography variant="h5" fontWeight={600} my={0.5} sx={{ mb: 5 }}>
        Add {Header} (Multiple)
      </Typography>

      <Grid container spacing={6} sx={{ marginBottom: "18px" }}>
        <Grid item xs={12} sm={3}>
          <Controller
            name="dateOfSelling"
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
                    field.onChange(e);
                    if (errorsMessage.date_wise_selling) {
                      seterrorsMessage((prev) => ({
                        ...prev,
                        date_wise_selling: "",
                      }));
                    }
                  }}
                  error={!!errorsMessage.date_wise_selling}
                  helperText={errorsMessage.date_wise_selling || ""}
                  inputProps={{
                    max: moment().format("YYYY-MM-DD"),
                    onKeyDown: (e) => e.preventDefault(),
                  }}
                />
              </>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
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

        <Grid item xs={12} sm={3}>
          <Controller
            name="groupType"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <>
                {renderLabel("Group Type", true)}
                <CustomAutoComplete
                  {...field}
                  id="select-group-type"
                  label="Group Type"
                  error={!!errorsMessage.group_type_id}
                  helperText={errorsMessage.group_type_id || ""}
                  value={groupType}
                  onChange={(e, v) => {
                    handleChangeGroupType(e, v);
                    field.onChange(v);
                    if (errorsMessage.group_type_id) {
                      seterrorsMessage((prev) => ({
                        ...prev,
                        group_type_id: "",
                      }));
                    }
                  }}
                  options={groupTypeMaster}
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

        <Grid item xs={12} sm={3}>
          <Controller
            name="flowerType"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <>
                {renderLabel("Flower Type", true)}
                <CustomAutoComplete
                  {...field}
                  id="select-flower-type"
                  label="Flower Type"
                  error={!!errorsMessage.flower_type_id}
                  helperText={errorsMessage.flower_type_id || ""}
                  value={flowerType}
                  onChange={(e, v) => {
                    handleChangeFlowerType(e, v);
                    field.onChange(v);
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
        <Grid item xs={12} sm={3}>
          <Controller
            name="pricePerQuantity"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <>
                {renderLabel("Price Per Quantity", true)}
                <CustomTextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  value={pricePerQuantity}
                  onChange={(e) => {
                    handleChangePricePerQuantity(e);
                    field.onChange(e);
                    if (errorsMessage.per_quantity) {
                      seterrorsMessage((prev) => ({
                        ...prev,
                        per_quantity: "",
                      }));
                    }
                  }}
                  error={!!errorsMessage.per_quantity}
                  helperText={errorsMessage.per_quantity || ""}
                  placeholder="Price Per Quantity"
                />
              </>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2.4}>
          {renderLabel("Luggage Amount", false)}
          <CustomTextField
            fullWidth
            variant="outlined"
            value={luggageAmount}
            onChange={handleChangeLuggageAmount}
            placeholder="Luggage Amount"
          />
        </Grid>
      </Grid>

      <Box
        sx={(theme) => ({
          border: `1px solid ${
            theme.palette.mode === "dark" ? theme.palette.divider : "#eee"
          }`,
          borderRadius: 2,
          p: 2,
        })}
      >
        <Grid container sx={{ p: 2, mb: 2, borderRadius: 1 }}>
          {labels.map((label, index) => (
            <Grid
              key={index}
              item
              xs={index < 2 ? 2.4 : 2.4}
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              {label}
            </Grid>
          ))}
        </Grid>
        <Divider />
        {/* All traders */}

        <Box
          sx={{
            maxHeight: 550,
            overflowY: traderRows.length > 10 ? "auto" : "unset",
          }}
        >
          {traderRows.map((trader, idx) => (
            <Grid container spacing={2} key={idx} sx={{ mb: 1, mt: 2 }}>
              <Grid item xs={2.4}>
                <Typography>
                  {String(trader.userID) + "-" + String(trader.traderName)}
                </Typography>
              </Grid>
              {/* ... QUANTITY COLUMN ... */}
              <Grid item xs={2.4}>
                <Controller
                  name={`traderQuantity_${idx}`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      // 1. Assign Ref
                      inputRef={(el) => (quantityRefs.current[idx] = el)}
                      // 2. Handle Key Down
                      onKeyDown={(e) => handleKeyDown(e, idx, "quantity")}
                      fullWidth
                      variant="outlined"
                      value={trader.quantity || ""}
                      onChange={(e) => {
                        handletraderQuantityChange(idx, e);
                        field.onChange(e);
                        // ... existing error logic
                      }}
                      error={
                        !!errorsMessage[`traderQuantity_${idx}`] ||
                        !!errorsMessage[idx]
                      }
                      helperText={
                        errorsMessage[`traderQuantity_${idx}`] ||
                        errorsMessage[idx] ||
                        ""
                      }
                      placeholder="Quantity"
                    />
                  )}
                />
              </Grid>
              {/* ... PRICE COLUMN ... */}
              <Grid item xs={2.4}>
                <Controller
                  name={`traderPrice_${idx}`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      // 1. Assign Ref
                      inputRef={(el) => (priceRefs.current[idx] = el)}
                      // 2. Handle Key Down
                      onKeyDown={(e) => handleKeyDown(e, idx, "price")}
                      fullWidth
                      variant="outlined"
                      value={trader.pricePerQuantity || ""}
                      onChange={(e) => {
                        handletraderPriceChange(idx, e);
                        field.onChange(e);
                        // ... existing error logic
                      }}
                      error={!!errorsMessage[`traderPrice_${idx}`]}
                      helperText={errorsMessage[`traderPrice_${idx}`] || ""}
                      placeholder="Price Per Quantity"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={2.4}>
                  <CustomTextField
                    fullWidth
                    variant="outlined"
                    value={trader.luggage || ""}
                    onChange={(e) => \handleTraderLuggageChange(idx, e)}
                    placeholder="Luggage Amount"
                  />
              </Grid>
              <Grid item xs={2.4}>
                <CustomTextField
                  fullWidth
                  disabled
                  variant="outlined"
                  value={calculateAmounts(
                    trader.quantity,
                    trader.pricePerQuantity,
                    trader.luggage,
                  ).totalAmount.toLocaleString("en-IN")}
                  placeholder="Total Amount"
                />
              </Grid>
            </Grid>
          ))}

          {/* ✅ Summary Row */}
          {traderRows.length > 0 && (
            <Grid
              container
              spacing={2}
              sx={{ mt: 3, borderTop: "2px solid #ddd", pt: 2 }}
            >
              <Grid item xs={2.4}>
                <Typography fontWeight="bold" fontSize={16}>
                  Total Amount
                </Typography>
              </Grid>
              <Grid item xs={2.4}>
                <Typography fontWeight="bold" fontSize={16}>
                  {traderRows.reduce(
                    (acc, trader) => acc + (Number(trader.quantity) || 0),
                    0,
                  )}
                </Typography>
              </Grid>
              <Grid item xs={2.4}>
                <Typography fontWeight="bold" fontSize={16}>
                  {traderRows.reduce(
                    (acc, row) => acc + (Number(row.pricePerQuantity) || 0),
                    0,
                  )}
                </Typography>
              </Grid>
              <Grid item xs={2.4}>
                <Typography fontWeight="bold" fontSize={16}>
                  {traderRows.reduce(
                    (acc, row) => acc + (Number(row.luggage) || 0),
                    0,
                  )}
                </Typography>
              </Grid>
              {/* <Grid item xs={2.4}>
                <Typography fontWeight="bold">
                  {traderRows
                    .reduce(
                      (acc, trader) =>
                        acc +
                        calculateAmounts(
                          trader.quantity,
                          trader.pricePerQuantity,
                          pricePerQuantity,
                        ).totalAmount,
                      0,
                    )
                    .toLocaleString("en-IN")}
                </Typography>
              </Grid> */}
            </Grid>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onCancel} variant="outlined" sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmitMultiple}
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
        open={!!error.message && typeof error.message === "string"}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        message={typeof error.message === "string" ? error.message : ""}
        onClose={() => setError({ status: "", message: "" })}
        autoHideDuration={2500}
      >
        <Alert
          onClose={() => setError({ status: "", message: "" })}
          severity={error.status}
        >
          {typeof error.message === "string" ? error.message : ""}
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default SalesCreateMultiple;
