"use client";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import DialogCloseButton from "./DialogCloseButton";
import { Button,useTheme } from "@mui/material";

const DeleteSalesDialog = ({
  open,
  onClose,
  activeStatus,
  setactiveStatus,
  singleProduct,
  setSingleProduct,
  text,
  onsubmit,title
}) => {
  const handleCloseBut = () => {
    onsubmit();
    onClose();
  };

  const theme = useTheme();

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
       {title || 'Default Title'}
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
          Cancel
        </Button>
        <Button
          style={{ background: theme.palette.error.main }}
          sx={{
            color: "#FFFFFF",
          }}
          onClick={handleCloseBut}
        >
          Delete
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeleteSalesDialog;
