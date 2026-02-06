// ImageDialog.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, IconButton } from "@mui/material";
import { IMG_ENDPOINT } from "../../../lib/config"
const ImageDialog = ({ open, onClose, imageUrl }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <DialogTitle>
          Image
        </DialogTitle>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "primary.main",

            width: 40,
            height: 40,
            marginTop: 2,
            marginRight: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            cursor: 'pointer'
          }}
        >
          <i className="tabler-x" />
        </IconButton>

      </Box>

      <DialogContent>
        {imageUrl ? (
          <img
            src={`${IMG_ENDPOINT}${imageUrl}`}
            alt="Image"
            style={{
              width: "auto",        // Allow width to be automatic
              maxWidth: "400px",    // Limit the width to 400px
              height: "auto",       // Maintain aspect ratio
              objectFit: "contain", // Ensure the image is contained within the boundaries
              // Center the image horizontally
              display: "block",     // Ensure the image is block-level for centering
            }}
          />
        ) : (
          <p>No image available</p>
        )}
      </DialogContent>

      {/* <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions> */}
    </Dialog>

  );
};

export default ImageDialog;
