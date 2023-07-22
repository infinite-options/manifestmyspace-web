import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      background: {
        default: '#FFFFFF', // White background outside the paper
      },
      primary: {
        main: '#F2F2F2', // Paper background color
      },
      custom: {
        blue: '#3D5CAC80', 
        grey: '#22222240'
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
