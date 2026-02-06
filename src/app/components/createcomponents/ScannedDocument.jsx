import React, { useCallback, useRef, useState } from "react";
import { Box, Button, Grid, IconButton, Typography, Link } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

const fileTypeToIcon = {
  pdf: "/images/backgrounds/pdf.png",
  xlsx: "/images/backgrounds/xls.png",
  xls: "/images/backgrounds/xls.png",
  csv: "/images/backgrounds/csv.png",
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

        <IconButton
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
        </IconButton>
      </Box>
    </Grid>
  );
};

const FileUploadAndDisplay = ({
  base64Images,
  handleFileChange,
  handleRemoveImage,
}) => {
  const fileInputRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
          sx={{
            border: "2px dashed #cacaca",
            borderRadius: "12px",
            padding: "30px",
            backgroundColor: "#f9f9f9",
            textAlign: "center",
            marginBottom: 2,
            cursor: "pointer",
            width: "100%",
            height: "180px",
          }}
        >
          <IconButton>
            <CloudUploadIcon sx={{ color: "#bdb8b8", fontSize: "3rem" }} />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ textAlign: "center", fontSize: "18px", color: "black" }}
              fontWeight="bold"
            >
              Choose a File (or) Drag and drop it here
            </Typography>
            <Typography sx={{ my: 1, fontSize: "16px", color: "#bdb8b8" }}>
              (PDF, JPEG and JPG Formats Only) Up to 5MB
            </Typography>
          </Box>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
        </Box>
      </Grid>

      <Grid container spacing={1} marginLeft={2}>
        {base64Images?.map((image, index) => (
          <FileDisplay
            key={index}
            image={image}
            index={index}
            handleRemoveImage={handleRemoveImage}
          />
        ))}
      </Grid>
    </Grid>
  );
};

export default FileUploadAndDisplay;
