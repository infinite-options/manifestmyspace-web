import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&.Mui-expanded': {
            margin: 0, // Set your desired margin here to override the default margin
          },
          position: 'inherit'
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          margin: '0', // Set your desired margin here to override the default margin
          '&.Mui-expanded': {
            margin: 0, // Set your desired margin here to override the default margin
          },
        },
        root: {
          minHeight: '0',
        }
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          padding: '5px 16px',  
        },
      },
    },
  },
  palette: {
    background: {
      default: '#FFFFFF', // White background outside the paper
    },
    primary: {
      main: '#F2F2F2', // Paper background color
    },
    custom: {
      blue: '#3D5CAC80', 
      grey: '#22222240',
      yellow: alpha('#FFE3AD', 0.5),
      pink: alpha('#F87C7A', 0.5)
    },
  },
  typography: {
      common: {
        fontWeight: 700, // Custom font weight
        blue: '#3D5CAC', // Custom font color (e.g., red)
      },
      primary: {
        fontWeight: 600, // Custom font weight
        black: '#000000', // Custom font color (e.g., red)
      },
      secondary: {
        fontWeight: 700, // Custom font weight
        white: '#FFFFFF', // Custom font color (e.g., red)
      },
      largeFont: {
          fontSize: '20px'
      },
      smallFont: {
          fontSize: '14px'
      }
    },

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
