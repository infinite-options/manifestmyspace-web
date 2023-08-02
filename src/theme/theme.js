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
    MuiFilledInput: {
      styleOverrides: {
        root: {
          '&.MuiFilledInput-root': {
            backgroundColor: '#F2F2F2', // Update the background color here
            borderRadius: 10,
            height: 30,
            marginBlock: 10,
          },
          '&.MuiFilledInput-root:before, &.MuiFilledInput-root:hover:before, &.MuiFilledInput-root:after': {
            borderBottom: 'none',
          },
        },
        input: {
          // Center the text inside the TextField
          textAlign: 'left',
          paddingBlock: 2
        },
      },
    },
  },
  palette: {
    background: {
      default: '#FFFFFF', // White background outside the paper
    },
    form: {
      main: '#D6D5DA', // Paper background color
    },
    primary: {
      main: '#F2F2F2', // Paper background color
      secondary: '#D6D5DA',
      pink: '#F5B7B6',
      mustardYellow: alpha('#FF8A00', 0.35),
    },
    custom: {
      blue: '#3D5CAC80', 
      grey: '#22222240',
      yellowHighlight: '#FFE3AD',
      yellow: alpha('#FFE3AD', 0.5),
      pink: alpha('#F87C7A', 0.5)
    },
    priority: {
      high: '#A52A2A',
      medium: '#FF8A00',
      low: '#FFC614',
    }
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
