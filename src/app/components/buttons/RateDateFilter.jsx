import * as React from "react";
import Button from "@mui/material/Button";
import DatePickerPage from "../buttons/DateRange";
import { Menu, IconButton, Tooltip, TextField, InputAdornment, Box } from "@mui/material";
import DateRangeIcon from '@mui/icons-material/DateRange';
import { format } from 'date-fns';

export default function RateDateFilter({ title, onDateRangeChange }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dateRange, setdateRange] = React.useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleDone = () => {
    handleClose();
    onDateRangeChange(dateRange);
  };

  const onDateChange = (data) => {
    setdateRange(data);
  };

  // Format the date range for display
  const getDateRangeDisplay = () => {
    if (dateRange.length > 0 && dateRange[0].startDate && dateRange[0].endDate) {
      const startDate = format(dateRange[0].startDate, 'dd-MM-yyyy');
      const endDate = format(dateRange[0].endDate, 'dd-MM-yyyy');
      return `${startDate} - ${endDate}`;
    }
    return "Select range";
  };

  return (
    <>
      <Tooltip title={title} arrow>
        <TextField
          value={getDateRangeDisplay()}
          onClick={handleClick}
          size="small"
          variant="outlined"
          placeholder="Select range"
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <DateRangeIcon sx={{ fontSize: "20px", color: "#666" }} />
              </InputAdornment>
            ),
            style: {
              cursor: "pointer",
              minWidth: "200px"
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              cursor: "pointer",
              height: "36px",
              "& fieldset": {
                borderColor: "#e0e0e0",
              },
              "&:hover fieldset": {
                borderColor: "#039D55",
              },
            },
            "& .MuiInputBase-input": {
              cursor: "pointer",
              fontSize: "14px"
            }
          }}
        />
      </Tooltip>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 'none',
          },
        }}
      >
        <DatePickerPage onDateChange={onDateChange} />
        <Button
          variant="contained"
          onClick={handleDone}
          color={"primary"}
          sx={{ margin: "15px", float: "right" }}
          disabled={dateRange.length === 0}
        >
          Done
        </Button>
      </Menu>
    </>
  );
}