import React from "react";
import {
  Grid,
  IconButton,
  Popover,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import CustomTextField from "../../../@core/components/mui/TextField";

const QuantityFilter = ({
  minQuantity,
  maxQuantity,
  minPrice,
  maxPrice,
  setMaxQuantity,
  setMinQuantity,
  setMinPrice,
  setMaxPrice,
  handleSearch,
}) => {
  const { control, handleSubmit } = useForm();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const renderLabel = (label) => (
    <Typography variant="body1">{label}</Typography>
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchClick = () => {
    handleSearch();
    handleClose();
  };

  const HandleMinQuantity = (event) => {
    let value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (Number(value) >= 0) {
        setMinQuantity(event.target.value);
      }
    }
  };

  const HandleMaxQuantity = (event) => {
    let value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (Number(value) >= 0) {
        setMaxQuantity(event.target.value);
      }
    }
  };

  const HandleMinPrice = (event) => {
    let value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (Number(value) >= 0) {
        setMinPrice(event.target.value);
      }
    }
  };

  const HandleMaxPrice = (event) => {
    let value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (Number(value) >= 0) {
        setMaxPrice(event.target.value);
      }
    }
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="filter"
        onClick={handleClick}
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: "6px",
          padding: "6px",
          marginLeft: "1px",
        }}
      >
        <i className="tabler-filter-code" />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{ mt: 1.5 }}
      >
        <Box sx={{ padding: "10px" }}>
          {/* <Grid container spacing={2} sx={{ padding: "10px 5px" }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="MinQunatity"
                control={control}
                render={({ field }) => (
                  <>
                    {renderLabel("Min Quantity")}
                    <CustomTextField
                      {...field}
                      fullWidth
                      variant="outlined"
                      value={minQuantity} // Use value prop directly
                      onChange={(e) => {
                        HandleMinQuantity(e);
                      }}
                      placeholder="Min Quantity"
                    />
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="MaxQunatity"
                control={control}
                render={({ field }) => (
                  <>
                    {renderLabel("Max Quantity")}
                    <CustomTextField
                      {...field}
                      fullWidth
                      variant="outlined"
                      value={maxQuantity} // Use value prop directly
                      onChange={(e) => {
                        HandleMaxQuantity(e);
                      }}
                      placeholder="Max Quantity"
                    />
                  </>
                )}
              />
            </Grid>
          </Grid> */}

          <Grid container spacing={2} sx={{ padding: "10px 5px" }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="MinPrice"
                control={control}
                render={({ field }) => (
                  <>
                    {renderLabel("Min Price")}
                    <CustomTextField
                      {...field}
                      fullWidth
                      variant="outlined"
                      value={minPrice}
                      onChange={(e) => {
                        HandleMinPrice(e);
                      }}
                      placeholder="Min Price"
                    />
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="MaxPrice"
                control={control}
                render={({ field }) => (
                  <>
                    {renderLabel("Max Price")}
                    <CustomTextField
                      {...field}
                      fullWidth
                      variant="outlined"
                      value={maxPrice}
                      onChange={(e) => {
                        HandleMaxPrice(e);
                      }}
                      placeholder="Max Price"
                    />
                  </>
                )}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
            <Button variant="contained" fullWidth onClick={handleSearchClick}>
              Search
            </Button>
          </Grid>
        </Box>
      </Popover>
    </>
  );
};

export default QuantityFilter;
