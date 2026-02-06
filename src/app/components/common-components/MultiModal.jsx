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
import { Button } from "@mui/material";

const MultiModal = ({
  open,
  onClose,
  activeStatus,
  setactiveStatus,
  singleProduct,
  setSingleProduct,
  text,
  onsubmit,
}) => {
  const handleCloseBut = () => {
    onsubmit();
    onClose();
  };

  const handleStatus = () => {
    if (singleProduct) {
      // Update activeStatus only if singleProduct.id is not 1
      const updatedStatus = singleProduct.activeStatus === 1 ? 2 : 1;
      setactiveStatus(updatedStatus);
    } else {
      console.log("Status change not allowed for this product");
    }
    onClose();
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
      <DialogTitle
        variant="h6"
        style={{fontWeight:600}}
        className="flex gap-2 flex-col text-start sm:pbs-16 sm:pbe-10 sm:pli-16"
      >
        Change Status
      </DialogTitle>
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
          sx={{
            backgroundColor: "#EE4B4B",
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

export default MultiModal;
