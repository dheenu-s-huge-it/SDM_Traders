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

// Third-party Imports
import classnames from "classnames";

// Component Imports
import DialogCloseButton from "./DialogCloseButton";
import { Button, useTheme } from "@mui/material";

const PaidStatusModal = ({
  open,
  onClose,
  activeStatus,
  setactiveStatus,
  singleProduct,
  setSingleProduct,
  text,
  onsubmit,
  actionData,type
}) => {
  const handleCloseBut = () => {
    onsubmit();
    onClose();
  };

  const theme = useTheme();
  const getModalTitle = () => {
    if (type) { // Check if type is provided
      return `${actionData !== 0 ? "Disabling the" : "Enabling the"} ${type}`;
    } else {
      return actionData !== 0 ? "Disabling" : "Enabling"; // Default if type is not provided
    }
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
      <DialogCloseButton onClick={onClose} disableRipple>
        <CloseIcon />
      </DialogCloseButton>
      {/* <DialogTitle
        variant="h6"
        style={{fontWeight:600}}
        className="flex gap-2 flex-col text-start sm:pbs-16 sm:pbe-10 sm:pli-16"
      >
       {getModalTitle()}
      </DialogTitle> */}
      <DialogContent className="pbs-0 sm:pli-16 sm:pbe-20">
        {text}
      </DialogContent>

      <Box
        sx={{
          padding: "8px",
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          sx={{
            backgroundColor: "#EAEBED",
            color: "#808390",
            marginRight: "8px",
          }}
          onClick={onClose}
        >
          No
        </Button>
        <Button
          style={
            
             
     { background: theme.palette.primary.main }
          }
          sx={{
            color: "#FFFFFF",
          }}
          onClick={handleCloseBut}
        >
          Yes
        </Button>
      </Box>
    </Dialog>
  );
};

export default PaidStatusModal;
