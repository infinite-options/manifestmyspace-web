import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Fade } from "@mui/material";
import { DialogActions } from "@mui/material";
import { Button } from "react-bootstrap";
import theme from "../../theme/theme";


export default function CopyDialog(props) {
  const {
    stripeDialogShow,
    setStripeDialogShow,
    toggleKeys,
    setStripePayment,
  } = props;

  return (
    <Dialog
      open={stripeDialogShow}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Payment Processing Fees
      </DialogTitle>
      <DialogContent>
        <h5>An additional 3% will be charged as credit card fees</h5>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setStripeDialogShow(false)}
          sx={{
              backgroundColor: "#3D5CAC",
              color: theme.palette.background.default,
              width: '100%', // Center the button horizontally
              borderRadius: "10px", // Rounded corners
              marginTop: '20px', // Add some spacing to the top
          }}  
        >
          Cancel
        </Button>
        <Button
            onClick={() => {
              toggleKeys();
              setStripePayment(true);
              setStripeDialogShow(false);
            }}
            sx={{
              backgroundColor: "#3D5CAC",
              color: theme.palette.background.default,
              width: '100%', // Center the button horizontally
              borderRadius: "10px", // Rounded corners
              marginTop: '20px', // Add some spacing to the top
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
