import axios from "axios";
import { API_ENDPOINT, API_TOKEN } from "./config";

export const axiosGet = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    Authorization: `${API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// Axios instance for POST requests
export const axiosPost = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    Authorization: `${API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const axiosPostForm = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    Authorization: `${API_TOKEN}`,
    "Content-Type": "multipart/form-data",
  },
});

// components/PdfDownloadButton.js

const handleDownload = async (apiUrl, fileName) => {
  try {
    // Fetch file content from the API using Axios
    const response = await axios.get(apiUrl, { responseType: "blob" });
    const fileBlob = new Blob([response.data]);

    // Create a Blob URL for the file
    const fileUrl = URL.createObjectURL(fileBlob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = fileUrl;

    // Determine file extension
    const fileExtension = apiUrl.split(".").pop();
    const downloadFileName = fileName || `your_file.${fileExtension}`;

    link.setAttribute("download", downloadFileName);

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file", error);
  }
};

export const download = (apiUrl, fileName) => {
  handleDownload(apiUrl, fileName);
};
