import * as React from "react";
import Button from "@mui/material/Button";
import DatePickerPage from "../buttons/DateRange";
import { Menu, IconButton, Tooltip } from "@mui/material";
import DateRangeIcon from '@mui/icons-material/DateRange';

export default function DateFilter({ title, onDateRangeChange }) {
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
  return (
    <>
      <Tooltip title={title} arrow>
        <IconButton
          onClick={handleClick}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            padding: "6px",
          }}
        >
          <DateRangeIcon
            sx={{ fontSize: "24px" }}
          />
        </IconButton>
      </Tooltip>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
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
