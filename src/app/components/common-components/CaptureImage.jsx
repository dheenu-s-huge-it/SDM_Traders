// // ImageDialog.js
// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
//   Box,
//   IconButton,
// } from "@mui/material";
// import Webcam from "react-webcam";
// const CaptureImage = ({
//   open,
//   onClose,
//   capturedImage,
//   setCapturedImage,
//   handleConfirmPhoto,
//   webcamRef,
//   captureImage,
//   handleConfirmPhotoPrint,
// }) => {
//   const [devices, setDevices] = useState([]);
//   const [currentDeviceId, setCurrentDeviceId] = useState(null);

//   useEffect(() => {
//     const getCameras = async () => {
//       const deviceList = await navigator.mediaDevices.enumerateDevices();
//       const videoDevices = deviceList.filter(
//         (device) => device.kind === "videoinput"
//       );
//       setDevices(videoDevices);
//       if (videoDevices.length > 0) {
//         setCurrentDeviceId(videoDevices[0].deviceId); // Default to the first camera
//       }
//     };
//     getCameras();
//   }, []);

//   const switchCamera = () => {
//     if (devices.length > 1) {
//       const currentIndex = devices.findIndex(
//         (device) => device.deviceId === currentDeviceId
//       );
//       const nextIndex = (currentIndex + 1) % devices.length;
//       setCurrentDeviceId(devices[nextIndex].deviceId);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//         <DialogTitle>Capture Image</DialogTitle>
//         <IconButton
//           edge="start"
//           color="inherit"
//           aria-label="close"
//           onClick={onClose}
//           sx={{
//             color: "primary.main",

//             width: 40,
//             height: 40,
//             marginTop: 2,
//             marginRight: 2,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "end",
//             cursor: "pointer",
//           }}
//         >
//           <i className="tabler-x" />
//         </IconButton>
//       </Box>
//       <DialogContent>
//         {!capturedImage ? (
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             width="100%"
//           />
//         ) : (
//           <img src={capturedImage} alt="Captured" style={{ width: "100%" }} />
//         )}
//       </DialogContent>
//       <DialogActions>
//         {!capturedImage ? (
//           <>
//             <Button onClick={captureImage} color="primary" variant="contained">
//               Capture
//             </Button>
//             {devices.length > 1 && (
//               <Button
//                 onClick={switchCamera}
//                 color="secondary"
//                 variant="outlined"
//               >
//                 Switch Camera
//               </Button>
//             )}
//           </>
//         ) : (
//           <>
//             <Button onClick={() => setCapturedImage(null)} color="secondary">
//               Retake
//             </Button>
//             <Button
//               onClick={handleConfirmPhoto}
//               color="primary"
//               variant="contained"
//             >
//               Confirm & Upload
//             </Button>
//             <Button
//               onClick={handleConfirmPhotoPrint}
//               color="primary"
//               variant="contained"
//             >
//               Confirm Print & Upload
//             </Button>
//           </>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CaptureImage;

// ImageDialog.js
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import Webcam from "react-webcam";
const CaptureImage = ({
  open,
  onClose,
  capturedImage,
  setCapturedImage,
  handleConfirmPhoto,
  webcamRef,
  captureImage,
  handleConfirmPhotoPrint,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <DialogTitle>Capture Image</DialogTitle>
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
            cursor: "pointer",
          }}
        >
          <i className="tabler-x" />
        </IconButton>
      </Box>
      <DialogContent>
        {!capturedImage ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
          />
        ) : (
          <img src={capturedImage} alt="Captured" style={{ width: "100%" }} />
        )}
      </DialogContent>
      <DialogActions>
        {!capturedImage ? (
          <Button onClick={captureImage} color="primary" variant="contained">
            Capture
          </Button>
        ) : (
          <>
            <Button onClick={() => setCapturedImage(null)} color="secondary">
              Retake
            </Button>
            <Button
              onClick={handleConfirmPhoto}
              color="primary"
              variant="contained"
            >
              Confirm & Upload
            </Button>
            <Button
              onClick={handleConfirmPhotoPrint}
              color="primary"
              variant="contained"
            >
              Confirm Print & Upload
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CaptureImage;
