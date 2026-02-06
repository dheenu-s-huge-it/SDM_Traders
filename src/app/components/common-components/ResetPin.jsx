"use client";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import CustomTextField from "../../../@core/components/mui/TextField";

const ReusableModal = ({
  open,
  onClose,
  newPassword,
  setnewPassword,
  confirmPassword,
  setconfirmPassword,
  handleResetPin,
}) => {
  const theme = useTheme();
  const handlePasswordChange = (event) => {
    const input = event.target.value;
    if (/^\d{0,4}$/.test(input)) {
      setnewPassword(input);
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const input = event.target.value;
    if (/^\d{0,4}$/.test(input)) {
      setconfirmPassword(input);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const [showConPassword, setShowConPassword] = useState(false);
  const toggleConPasswordVisibility = () => {
    setShowConPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleSubmit = () => {
    if (
      newPassword !== confirmPassword &&
      [newPassword].lengh > 4 &&
      [confirmPassword].lengh > 4
    ) {
      alert("Passwords do not match!");
      return;
    }
    handleResetPin(); // Proceed if passwords match
  };
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      maxWidth="sm"
      scroll="body"
      closeAfterTransition={false}
      sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}
    >
      <DialogTitle
        variant="h5"
        className="flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-10 sm:pli-16"
      >
        Reset Pin
      </DialogTitle>
      <DialogContent
        className="pbs-0 sm:pli-16 sm:pbe-20"
        sx={{ color: "#2F2B3DB2" }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <CustomTextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={newPassword}
            onChange={handlePasswordChange}
            margin="normal"
            placeholder="Enter new password"
            error={newPassword !== confirmPassword && confirmPassword !== ""}
            helperText={
              newPassword !== confirmPassword && confirmPassword !== ""
                ? "Passwords do not match"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <CustomTextField
            label="Confirm Password"
            type={showConPassword ? "text" : "password"}
            variant="outlined"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            margin="normal"
            placeholder="Re-enter new password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConPasswordVisibility} edge="end">
                    {showConPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2,p:2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Dialog>
  );
};

export default ReusableModal;
