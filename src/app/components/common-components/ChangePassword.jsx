"use client";

// MUI Imports
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// Third-party Imports
import classnames from "classnames";
import React, { useState, useEffect } from "react";

// Component Imports
import DialogCloseButton from "./DialogCloseButton";
import {
  Button,
  TextField,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import CustomTextField from "../../../@core/components/mui/TextField";
import Link from "next/link";
import DirectionalIcon from "../DirectionalIcon";

const ChangePassword = ({
  open,
  onClose,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  currentPassword,
  setCurrentPassword,
  handleSignIn,
  seterrorsMessage,
  errorsMessage,
}) => {
  const theme = useTheme();

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);
  const handleClickShowCurrentPassword = () =>
    setIsCurrentPasswordShown((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setIsConfirmPasswordShown((show) => !show);

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    handleResetPin(); // Proceed if passwords match
  };

  const handleClose =()=>{
    onClose();
    setConfirmPassword("")
    setCurrentPassword("");
    setNewPassword("")
    seterrorsMessage([])
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="body"
      closeAfterTransition={false}
      sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}
    >
      <DialogCloseButton onClick={handleClose}>
        <CloseIcon />
      </DialogCloseButton>
      <DialogTitle
        variant="h4"
        className="flex gap-2 flex-col text-start sm:pbs-16 sm:pbe-10 sm:pli-16"
      >
        Reset Password
        <Typography>
          Your new password must be different from previously used passwords
        </Typography>
      </DialogTitle>

      <DialogContent
        className="pbs-0 sm:pli-16 sm:pbe-20"
        sx={{ color: "#2F2B3DB2" }}
      >
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSignIn}
          className="flex flex-col gap-6"
        >
          <CustomTextField
            autoFocus
            fullWidth
            label="Current Password"
            error={!!errorsMessage?.current_password}
            helperText={
              errorsMessage?.current_password
                ? errorsMessage?.current_password
                : ""
            }
            placeholder="············"
            type={isCurrentPasswordShown ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleClickShowCurrentPassword}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <i
                        className={
                          isCurrentPasswordShown
                            ? "tabler-eye-off"
                            : "tabler-eye"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <CustomTextField
            autoFocus
            fullWidth
            label="New Password"
            placeholder="············"
            type={isPasswordShown ? "text" : "password"}
            error={!!errorsMessage?.new_password}
            helperText={
              errorsMessage?.new_password ? errorsMessage?.new_password : ""
            }
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <i
                        className={
                          isPasswordShown ? "tabler-eye-off" : "tabler-eye"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <CustomTextField
            fullWidth
            label="Confirm Password"
            placeholder="············"
            type={isConfirmPasswordShown ? "text" : "password"}
            value={confirmPassword}
            error={!!errorsMessage?.confirm_password}
            helperText={
              errorsMessage?.confirm_password
                ? errorsMessage?.confirm_password
                : ""
            }
            onChange={(e) => setConfirmPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <i
                        className={
                          isConfirmPasswordShown
                            ? "tabler-eye-off"
                            : "tabler-eye"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            onClick={handleSignIn}
          >
            Set New Password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
