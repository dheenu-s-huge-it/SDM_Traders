import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({ open, handleClose, text,caption,onsubmit }) {
  //   const [open, setOpen] = React.useState(false);

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

    const handleCloseBut = () => {
      onsubmit();
      handleClose();
    };
  
  
  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{text}</DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">{caption}</DialogContentText>
        </DialogContent> */}
        <DialogActions sx={{display:"flex",justifyContent:"end"}}>
          <Button
            variant="contained"
            onClick={handleClose}
            color={"cancel"}
            sx={{ marginBottom: "5px" }}
          >
            No
          </Button>
          <Button
          type="submit"
            variant="contained"
            onClick={handleCloseBut}
            color={"primary"}
            sx={{ marginBottom: "5px" }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
