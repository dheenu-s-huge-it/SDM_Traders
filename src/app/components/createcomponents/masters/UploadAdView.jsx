import React, { useCallback, useRef, useState } from "react";
import { Box, Button, Grid, IconButton, Typography, Link } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
// import { API_ENDPOINT, IMG_ENDPOINT } from "@/lib/config";

const fileTypeToIcon = {
  jpg: "/images/backgrounds/jpg-file.png",
  jpeg: "/images/backgrounds/jpeg.png",
  png: "/images/backgrounds/png.png", 
};

const FileDisplay = ({ handleRemoveImage, image, index }) => {
  const fileExtension = image.image_url?.split(".").pop();
  const fileExtensionUpdate = image.image_name?.split(".").pop();
  const icon =
    fileTypeToIcon[fileExtension] || fileTypeToIcon[fileExtensionUpdate];
  const imageName =
    image.image_name?.split("customer_file/").pop() || image.image_name;

  return (
    <Grid item xs={12} md={6} key={index}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: "8px 12px",
          border: "1px solid #cacaca",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
          position: "relative",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* File Icon */}
        {icon && (
          <Link href={image.image_url} target="_blank">
            <img
              src={icon}
              alt="file-icon"
              style={{ width: "30px", height: "30px", objectFit: "contain" }}
            />
          </Link>
        )}

        {/* File Name */}
        <Link
          href={image.image_url}
          target="_blank"
          style={{
            flexGrow: 1,
            textDecoration: "none",
            color: "black",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <Typography fontSize={14} fontWeight={500}>
            {imageName}
          </Typography>
        </Link>

        {/* Remove Button */}
        {/* <IconButton
          onClick={() => handleRemoveImage(index)}
          sx={{
            color: "black",
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton> */}
      </Box>
    </Grid>
  );
};

const FileUploadAndDisplay = ({
    base64Image,
  handleFileChange,
  handleRemoveImage,
}) => {
  const fileInputRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <Grid container spacing={2}>
      {/* Display Uploaded Files */}
        {base64Image && (
              <Grid container spacing={1} marginLeft={2}>
                <FileDisplay image={base64Image} handleRemoveImage={handleRemoveImage} />
              </Grid>
            )}
    </Grid>
  );
};

export default FileUploadAndDisplay;
