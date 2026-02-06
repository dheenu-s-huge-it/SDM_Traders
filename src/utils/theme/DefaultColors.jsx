import { createTheme } from "@mui/material/styles";
import { Nunito } from "next/font/google";
import theme from "../theme";


export const nunito = Nunito({
  weight: ["300", "400", "500", "600", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const baselightTheme = createTheme({
  direction: "ltr",
  palette: {
    // mode : "dark",
    primary: {
      main: "#18a656ff",
      light: "#dfc4cd",
      dark: "#2ba618ff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2f583eff",
      light: "#315b41ff",
      dark: "#21d660ff",
      contrastText: "#ffffff",
    },
    success: {
      main: "#0b8c50",
      light: "#E6FFFA",
      dark: "#02b3a9",
      contrastText: "#ffffff",
    },
    info: {
      main: "#60ee92ff",
      light: "#dedaf9",
      dark: "#16d420ff",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f54254",
      light: "#FDEDE8",
      dark: "#f3704d",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#8c95a3",
      light: "#FEF5E5",
      dark: "#ae8e59",
      contrastText: "#ffffff",
    },
    cancel: {
      main: "#f6f6f6",
      light: "#d3d0d0",
      dark: "#d3d0d0",
      contrastText: "#000",
    },
    
    grey: {
      100: "#F2F6FA",
      200: "#EAEFF4",
      300: "#DFE5EF",
      400: "#7C8FAC",
      500: "#5A6A85",
      600: "#2a3547",
    },
    text: {
      primary: "#000",
      secondary: "#000",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#f6f9fc",
    },
    divider: "#e5eaef",
    background: {
      default: "#eef5f9",
      paper: "#ffffff",
    },
  },

  typography: {
    fontFamily: nunito.style.fontFamily,
    h1: {
      lineHeight: '2.75rem',
    },
    h2: {
      lineHeight: '2.25rem',
    },
    h3: {
      lineHeight: '1.75rem',
    },
    h4: {
      lineHeight: '1.6rem',
    },
    h5: {
      lineHeight: '1.6rem',
    },
    h6: {
      lineHeight: '1.2rem',
    },
    button: {
      textTransform: 'capitalize',
      fontWeight: 400,
    },
    body1: {
      fontWeight: 600,
      lineHeight: '1.334rem',
    },
    body2: {
      letterSpacing: '0rem',
      fontWeight: 400,
      lineHeight: '1rem',
    },
    subtitle1: {
      fontWeight: 400,
    },
    subtitle2: {
      fontWeight: 400,
    },
  },
  components: {

  
    MuiCssBaseline: {
      styleOverrides: {
        ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
          boxShadow:
            "0px 0px 3px 0px #edf4f8",
        },
        a: {
          textDecoration: "none",
        },
        ".MuiTimelineConnector-root": {
          width: "1px !important",
          backgroundColor: "rgba(0, 0, 0, 0.12) !important"
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius:'7px'
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
        title: {
          fontSize: "1.125rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "7px",
          padding: "0",
          boxShadow: "0px 7px 30px 0px rgba(90, 114, 123, 0.11)",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "30px",
        },
      },
    },  
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid #e5eaef`,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            borderBottom: 0,
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[200],
          borderRadius: "6px",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.divider,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[200]
                : theme.palette.grey[300],
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.grey[300],
          },
        },
        input: {
          padding: "12px 14px",
        },
        inputSizeSmall: {
          padding: "8px 14px",
        },
      },
    },
  
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          color: "white",
        },
        filledInfo: {
          color: "white",
        },
        filledError: {
          color: "white",
        },
        filledWarning: {
          color: "white",
        },
        standardSuccess: {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.main,
        },
        standardError: {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.main,
        },
        standardWarning: {
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.main,
        },
        standardInfo: {
          backgroundColor: theme.palette.info.light,
          color: theme.palette.info.main,
        },
        outlinedSuccess: {
          borderColor: theme.palette.success.main,
          color: theme.palette.success.main,
        },
        outlinedWarning: {
          borderColor: theme.palette.warning.main,
          color: theme.palette.warning.main,
        },
        outlinedError: {
          borderColor: theme.palette.error.main,
          color: theme.palette.error.main,
        },
        outlinedInfo: {
          borderColor: theme.palette.info.main,
          color: theme.palette.info.main,
        }
      },
    },

  },
  
});

export { baselightTheme };
