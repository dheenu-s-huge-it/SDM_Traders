"use client";
import Dialog from "@mui/material/Dialog";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import DialogCloseButton from "./DialogCloseButton";
import { Button, useTheme } from "@mui/material";
import { useState } from "react";

const SalesPrint = ({
  open,
  onClose,
  singleDataJson, // Selected row data
  onsubmit,
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const theme = useTheme();

  const handlePrint = () => {
    setIsPrinting(true); // Hide buttons before printing
    setTimeout(() => {
      window.print();
      setIsPrinting(false); // Show buttons after printing
      onClose();
    }, 100);
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
      {!isPrinting && (
        <DialogCloseButton onClick={onClose} disableRipple>
          <CloseIcon />
        </DialogCloseButton>
      )}
      <div
        className="print-area"
        style={{
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          fontSize: "11px",
          width: "4in",
        }}
      >
        <div style={{ fontWeight: "bold", textAlign: "center" }}>
          S.D.M. Mahendran
        </div>
        <div
          style={{
            marginTop: "5px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Sathyamangalam Erode
        </div>
        <div
          style={{
            marginTop: "5px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          9442498222 -
        </div>
        <div
          style={{
            marginTop: "5px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>Date: {singleDataJson?.date_wise_selling || ""}</div>
          <div>Time: {singleDataJson?.time_wise_selling || ""}</div>
        </div>

        <hr style={{ borderTop: "1px dashed #000", margin: "10px 0" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "5px",
          }}
        >
          <div>Trader: {singleDataJson?.trader_name}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "5px",
          }}
        >
          <div>Flower: {singleDataJson?.flower_type_name || ""}</div>
          <div>Type: {singleDataJson?.payment_type || ""}</div>
        </div>

        <hr style={{ borderTop: "1px dashed #000", margin: "10px 0" }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            fontWeight: "bold",
          }}
        >
          <div>S.no</div>
          <div>Qty</div>
          <div>Rate</div>
          <div>Disc</div>
          <div>Amt</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            marginTop: "5px",
          }}
        >
          <div>{singleDataJson?.quantity || 0}</div>
          <div>{singleDataJson?.quantity || 0}</div>
          <div>{singleDataJson?.per_quantity || 0}</div>
          <div>{singleDataJson?.discount || 0}</div>
          <div>{singleDataJson?.total_amount || 0}</div>
        </div>

        <hr style={{ borderTop: "1px dashed #000", margin: "10px 0" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontWeight: "bold",
            marginTop: "5px",
          }}
        >
          <div>Toll: {singleDataJson?.toll_amount || 0}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontWeight: "bold",
            marginTop: "5px",
          }}
        >
          <div>Total: {singleDataJson?.total_amount || 0}</div>
        </div>

        <hr style={{ borderTop: "1px dashed #000", margin: "10px 0" }} />

        <div
          style={{
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Staff: {singleDataJson?.createdby_firstname || ""}{" "}
          {singleDataJson?.createdby_lastname || ""}
        </div>
        <div
          style={{
            marginTop: "5px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          உழவன் உழைத்தால் உலகம் வாழும் !!!
        </div>
      </div>
      {!isPrinting && (
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
            style={{ background: theme.palette.success.main }}
            sx={{
              color: "#FFFFFF",
            }}
            onClick={handlePrint}
          >
            Print
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default SalesPrint;
