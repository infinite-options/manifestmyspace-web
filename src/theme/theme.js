import { createTheme, alpha } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          "&.Mui-expanded": {
            margin: 0, // Set your desired margin here to override the default margin
          },
          position: "inherit",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          margin: "0", // Set your desired margin here to override the default margin
          "&.Mui-expanded": {
            margin: 0, // Set your desired margin here to override the default margin
          },
        },
        root: {
          minHeight: "0",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "Source Sans Pro",
          borderBottom: "none",
          padding: "5px 5px",
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          "&.MuiFilledInput-root:before, &.MuiFilledInput-root:hover:before, &.MuiFilledInput-root:after":
            {
              borderBottom: "none",
            },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#160449",
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          paddingLeft: "2%",
          paddingRight: "2%",
          width: "96%",
          borderRadius: "10px",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          marginBottom: 15,
          background: "#3D5CAC",
          color: "#FFFFFF",
          width: "100%",
          height: "37px",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: 600,
          textTransform: "none",
          "&.MuiToggleButtonGroup-grouped": {
            borderRadius: "10px !important",
          },
          "&.Mui-selected, &.Mui-selected:hover": {
            color: "#FFFFFF",
            borderRadius: "10px",
            backgroundColor: "#160449",
          },
          "&:hover": {
            backgroundColor: "#3D5CAC",
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#3D5CAC",
          "&.Mui-checked": {
            color: "#3D5CAC !important",
          },
        },
        "&.Mui-checked": {
          color: "#3D5CAC !important",
        },
      },
    },
  },
  palette: {
    background: {
      default: "#FFFFFF", // White background outside the paper
    },
    form: {
      main: "#D6D5DA", // Paper background color
    },
    primary: {
      main: "#F2F2F2", // Paper background color
      secondary: "#D6D5DA",
      pink: "#F5B7B6",
      mustardYellow: alpha("#FF8A00", 0.35),
      lightYellow: "#FFC319",
    },
    custom: {
      blue: "#3D5CAC80",
      bgBlue: "#3D5CAC",
      grey: "#22222240",
      yellowHighlight: "#FFE3AD",
      yellow: alpha("#FFE3AD", 0.5),
      pink: alpha("#F87C7A", 0.5),
      palePink: alpha("#FE8280", 0.4),
      pinkText: "#FE8280",
      red: "#A52A2A",
    },
    priority: {
      high: "#A52A2A",
      medium: "#FF8A00",
      low: "#FFC614",
      clear: "#3D5CAC",
    },
  },

  typography: {
    common: {
      fontWeight: 700, // Custom font weight
      blue: "#3D5CAC", // Custom font color (e.g., red)
    },
    primary: {
      fontWeight: 600, // Custom font weight
      black: "#000000", // Custom font color (e.g., red)
    },
    secondary: {
      fontWeight: 700, // Custom font weight
      white: "#FFFFFF", // Custom font color (e.g., red)
    },
    light: {
      fontWeight: 500, // Custom font weight
    },
    medium: {
      fontWeight: 600, // Custom font weight
    },
    largeFont: {
      fontSize: "20px",
    },
    secondaryFont: {
      fontSize: "18px",
    },
    mediumFont: {
      fontSize: "16px",
    },
    smallFont: {
      fontSize: "14px",
    },
    propertyPage: {
      color: "#160449",
      fontSize: "16px",
      fontWeight: 700,
    },
    formButton: {
      background: "#9EAED6",
      text: "#160449",
    },
  },
  colorStatusPMO_old: [
    { color: "#B62C2A", status: "New Requests", mapping: "NEW" },
    { color: "#D4736D", status: "Quotes Requested", mapping: "PROCESSING" },
    { color: "#DEA19C", status: "Quotes Accepted", mapping: "ACCEPTED" },
    { color: "#92A9CB", status: "Scheduled", mapping: "SCHEDULED" },
    { color: "#6788B3", status: "Completed", mapping: "COMPLETED" },
    { color: "#173C8D", status: "Paid", mapping: "INFO" },
  ],
  colorStatusPMO: [
    { color: "#B62C2A", status: "New Requests", mapping: "NEW REQUEST" },
    { color: "#D4736D", status: "Quotes Requested", mapping: "QUOTES REQUESTED" },
    { color: "#DEA19C", status: "Quotes Accepted", mapping: "QUOTES ACCEPTED" },
    { color: "#92A9CB", status: "Scheduled", mapping: "SCHEDULED" },
    { color: "#6788B3", status: "Completed", mapping: "COMPLETED" },
    { color: "#173C8D", status: "Paid", mapping: "PAID" },
  ],
  colorStatusO: [
    { color: "#B62C2A", status: "New Requests", mapping: "NEW REQUEST" },
    { color: "#D4736D", status: "Info Requested", mapping: "INFO REQUESTED" },
    { color: "#DEA19C", status: "Processing", mapping: "PROCESSING" },
    { color: "#92A9CB", status: "Scheduled", mapping: "SCHEDULED" },
    { color: "#6788B3", status: "Completed", mapping: "COMPLETED" },
    { color: "#173C8D", status: "Cancelled", mapping: "CANCELLED" },
  ],
  colorStatusTenant: [
    { color: "#B62C2A", status: "New Requests", mapping: "NEW" },
    { color: "#D4736D", status: "Reviewed Requests", mapping: "PROCESSING" },
    { color: "#DEA19C", status: "Reviewed Requests", mapping: "INFO" },
    { color: "#92A9CB", status: "Scheduled", mapping: "SCHEDULED" },
    { color: "#6788B3", status: "Completed", mapping: "COMPLETED" },
  ],
  colorStatusMM: [
    {'color': '#DB9687', 'status': 'Requested', 'mapping': 'REQUESTED'},
    {'color': '#CEA892', 'status': 'Submitted', 'mapping': 'SUBMITTED'},
    {'color': '#BAAC7A', 'status': 'Accepted', 'mapping': 'ACCEPTED'},
    {'color': '#959A76', 'status': 'Scheduled', 'mapping': 'SCHEDULED'},
    {'color': '#598A96', 'status': 'Finished', 'mapping': 'FINISHED'},
    {'color': '#6588AC', 'status': 'Paid', 'mapping': 'PAID'}, //COMPLETED
  ],
  spacing: 2, // Set the spacing unit to 2 to represent 8px (Material-UI's default spacing unit)
  breakpoints: {
    values: {
      xs: 0, // Extra small screens (phone, portrait)
      sm: 600, // Small screens (phone, landscape, tablet portrait)
      md: 960, // Medium screens (tablet landscape, small laptop)
      lg: 1280, // Large screens (laptop, desktop)
      xl: 1920, // Extra large screens (large desktop)
    },
  },
});

export default theme;
