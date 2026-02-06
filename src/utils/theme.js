import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#1ee56aff",
      light: "#e3f1fc",
      dark: "#1ee556ff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#21c1d6",
      light: "#e1f7f8",
      dark: "#21c1d6",
      contrastText: "#ffffff",
    },
    success: {
      main: "#13deb9",
      light: "#E6FFFA",
      dark: "#02b3a9",
      contrastText: "#ffffff",
    },
    info: {
      main: "#60ee65ff",
      light: "#dedaf9",
      dark: "#16d47bff",
      contrastText: "#ffffff",
    },
    error: {
      main: "#fa896b",
      light: "#FDEDE8",
      dark: "#f3704d",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ffb22b",  
      light: "#FEF5E5",
      dark: "#ae8e59",
      contrastText: "#ffffff",
    },
  },
});

export default theme;
