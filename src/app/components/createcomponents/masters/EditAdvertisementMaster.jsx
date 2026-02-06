"use client";
import {
    Box,
    Grid,
    Typography,
    Card,
    Button,
    Modal,
    CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CustomTextField from "../../../../@core/components/mui/TextField";
import { useForm, Controller } from "react-hook-form";
import { axiosPost, axiosGet } from "../../../../lib/api";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import AlertDialog from "../../container/AlertDialog";
import FileDisplay from "./UploadAd";
function EditAdvertisementMaster({ Header, route_back }) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [errorsMessage, seterrorsMessage] = useState([]);
    const USER_ID = Cookies.get("data_uniq_id");
    const router = useRouter();

    const [error, setError] = useState({ status: "", message: "" });
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
    };
    const fileInputRef = useRef(null);

    const [base64Image, setBase64Image] = useState(null);
    const [deleteImages, setDeleteImages] = useState([]);
    const [errorImg, setErrorImg] = useState({ status: "", message: "" });

    const allowedFormats = ["jpeg", "jpg", "png"];

    const handleFileChange = (event) => {
        setErrorImg({ status: "", message: "" }); // Reset error before checking

        const file = event.target.files[0]; // Get only one file
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!file) return;

        const fileExtension = file.name.split(".").pop().toLowerCase(); // Extract file extension

        if (!allowedFormats.includes(fileExtension)) {
            setErrorImg({ status: "error", message: "Invalid file format" });
            event.target.value = "";
            return;
        }

        if (file.size > maxSize) {
            setErrorImg({ status: "error", message: "Maximum File Size is 5MB." });
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const base64String = e.target.result.split(",")[1];
            setBase64Image({
                image_name: file.name,
                document_doc: base64String,
                existing_image_path: "",
            });
        };

        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        if (base64Image?.data_uniq_id) {
            setDeleteImages([...deleteImages, base64Image]);
        }
        setBase64Image(null);
    };

    const token = Cookies.get("token");



    const HandleEditGET = (value) => {
        if (value !== undefined && value !== null) {
            try {
                axiosGet
                    .get(`master/advertisement/get?access_token=${token}&data_uniq_id=${value}`)
                    .then((response) => {
                        const data = response.data.data;
                        if (data.length !== 0) {
                            setremarks(data[0]?.remarks);


                            setBase64Image(data[0]?.advertisement_master_doc);
                        }
                    });
            } catch (error) {
                throw error;
            }
        }
    };

    useEffect(() => {
        HandleEditGET(USER_ID);
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const jsonStructure = {
            access_token: token,
            area_name: areaName,
            data_uniq_id: USER_ID,
        };
        try {
            axiosPost.put("master/advertisement/create", jsonStructure)
                .then((response) => {
                    if (response.data.action === "success") {
                        onClickCancel();
                        setError({ status: "success", message: response.data.message });
                        setIsLoading(false);
                    } else if (response.data.action === "error_group") {
                        seterrorsMessage(response.data.message);
                        setIsLoading(false);
                    } else {
                        setError({ status: "error", message: response.data.message });
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.error("POST Error:", error);
                });
        } catch (error) {
            setIsLoading(false);
            console.error("An error occurred:", error);
        }
    };

    const [closeState, setcloseState] = useState(false);

    const onCancel = () => {
        setcloseState(true);
    };

    const onCancelClose = () => {
        setcloseState(false);
    };

    const onClickCancel = () => {
        Cookies.remove("data_uniq_id");
        router.push(route_back);
    };

    const renderLabel = (label, isRequired) => {
        return (
            <Typography variant="body1">
                {label} {isRequired && <span style={{ color: "#D32F2F" }}>*</span>}
            </Typography>
        );
    };

    return (
        <Card sx={{ padding: 10 }}>
            <Typography variant="h5" fontWeight={600} my={0.5} sx={{ mb: 5 }}>
                Update {Header}
            </Typography>
            <form onSubmit={handleSignIn}>




                <Typography
                    sx={{
                        fontWeight: 650,
                        fontSize: "20px",
                        textAlign: "left",
                        color: "black",
                        marginBottom: "20px",
                    }}
                    pt={2}
                >
                    Upload File
                </Typography>
                <FileDisplay
                    // files={files}
                    base64Image={base64Image}
                    handleRemoveImage={handleRemoveImage}
                    // handleFileDrop={handleFileDrop}
                    handleFileChange={handleFileChange}
                    fileInputRef={fileInputRef}
                />
                <Grid container spacing={6}>
                    <Grid item xs={12} sm={12}>
                        <Controller
                            name="remarks"
                            control={control}
                            render={({ field }) => (
                                <>
                                    {renderLabel("Remarks", false)}
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        variant="outlined"
                                        value={remarks}
                                        error={!!errorsMessage.remarks}
                                        helperText={
                                            errorsMessage.per_amount ? errorsMessage.per_amount : ""
                                        }
                                        onChange={(e) => {
                                            HandleChangeRemarks(e);
                                            if (errorsMessage.per_amount) {
                                                seterrorsMessage((prev) => ({
                                                    ...prev,
                                                    per_amount: "",
                                                }));
                                            }
                                        }}
                                        placeholder="Remarks"
                                        sx={{ mb: 5 }}
                                        multiline // Enables multi-line input
                                        rows={3} // Number of visible rows
                                    />
                                </>
                            )}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button onClick={onCancel} variant="outlined" sx={{ mr: 2 }}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </form>
            <AlertDialog
                onsubmit={onClickCancel}
                open={closeState}
                handleClose={onCancelClose}
                text={"Are you sure want to cancel update?"}
            ></AlertDialog>
            <Modal open={isLoading}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100vh",
                    }}
                >
                    <CircularProgress />
                </Box>
            </Modal>
            <Snackbar
                open={error.message !== ""}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                message={error.message}
                onClose={() => setError({ status: "", message: "" })}
                autoHideDuration={2500}
            >
                <Alert onClose={handleClose} severity={error.status}>
                    {error.message}
                </Alert>
            </Snackbar>
        </Card>
    );
}

export default EditAdvertisementMaster;
