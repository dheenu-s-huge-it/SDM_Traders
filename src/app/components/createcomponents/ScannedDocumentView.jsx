import React from "react";
import { Box, Grid, Typography, Link } from "@mui/material";
import { API_ENDPOINT } from "../../../lib/config";

const fileTypeToIcon = {
  pdf: "/images/backgrounds/pdf.png",
  xlsx: "/images/backgrounds/xls.png",
  xls: "/images/backgrounds/xls.png",
  csv: "/images/backgrounds/csv.png",
  jpg: "/images/backgrounds/jpg-file.png",
  jpeg: "/images/backgrounds/jpeg.png",
  png: "/images/backgrounds/png.png",
};

const FileDisplay = ({ image }) => {
  const fileExtension = image?.split(".").pop();
  const fileExtensionUpdate = image?.split(".").pop();
  const icon =
    fileTypeToIcon[fileExtension] || fileTypeToIcon[fileExtensionUpdate];
  const imageName = image?.split("scanning_image/").pop() || image;

  return (
    <Grid item xs={12} md={6}>
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
        {icon && (
          <Link href={API_ENDPOINT + image} target="_blank">
            <img
              src={icon}
              alt="file-icon"
              style={{ width: "30px", height: "30px", objectFit: "contain" }}
            />
          </Link>
        )}

        <Link
          href={API_ENDPOINT + image}
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
      </Box>
    </Grid>
  );
};

const FileDisplayEMPTY = () => {
  return (
    <Grid item xs={12} md={6}>
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
        <Link target="_blank">
          <img
            src="/images/no_image.png"
            alt="file-icon"
            style={{ width: "30px", height: "30px", objectFit: "contain" }}
          />
        </Link>

        <Link
          target="_blank"
          style={{
            flexGrow: 1,
            textDecoration: "none",
            color: "black",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            paddingLeft:'10px'
          }}
        >
          <Typography fontSize={14} fontWeight={500}>
            The image could not be found.
          </Typography>
        </Link>
      </Box>
    </Grid>
  );
};

const FileUploadAndDisplay = ({
  imagesOne,
  imagesTwo,
}) => {
  return (
    <Grid container spacing={2} style={{ marginTop: "15px" }}>
      <Grid container spacing={1} marginLeft={2}>
        {imagesOne === "" || imagesOne === NaN || imagesOne === undefined ? (
          <FileDisplayEMPTY />
        ) : (
          <FileDisplay
            image={imagesOne}
          />
        )}

        {imagesTwo === "" || imagesTwo === NaN || imagesTwo === undefined ? (
          <FileDisplayEMPTY />
        ) : (
          <FileDisplay
            image={imagesTwo}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default FileUploadAndDisplay;
