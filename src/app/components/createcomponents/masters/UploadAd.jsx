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

    const FileDisplay = ({ handleRemoveImage, image, index,errorsMessage  }) => {
    const fileExtension = image.image_url?.split(".").pop();
    const fileExtensionUpdate = image.image_name?.split(".").pop();
    const icon =
        fileTypeToIcon[fileExtension] || fileTypeToIcon[fileExtensionUpdate];
    const imageName =
        image.image_url?.split("customer_file/").pop() || image.image_name;

    return (
        <Grid item xs={12} md={4} key={index}>
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
        base64Image,
    handleFileChange,
    handleRemoveImage,errorsMessage
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
            // onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            sx={{
                border: `2px dashed ${errorsMessage.advertisement_master_doc ? "#ff4c51" : "#cacaca"}`,
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
                (JPEG, JPG, and PNG formats only) Dimension 3.69:1, up to 5 MB.
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
            {errorsMessage?.advertisement_master_doc && (
          <Typography sx={{ fontSize: "14px", color: "#FF4C51", mt: 0.5 }}>
            {errorsMessage.advertisement_master_doc}
          </Typography>
        )}
        </Grid>

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
