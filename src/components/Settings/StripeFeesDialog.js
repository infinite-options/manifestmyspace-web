import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Fade } from "@mui/material";
import { DialogActions } from "@material-ui/core";
import { Button } from "react-bootstrap";

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
      <DialogTitle id="alert-dialog-title"></DialogTitle>
      <DialogContent>
        <div className="d-flex justify-content-center align-items-center m-5">
          <h5>An additional 3% will be charged as credit card fees</h5>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setStripeDialogShow(false)}>Cancel</Button>
        <Button
          onClick={() => {
            toggleKeys();
            setStripePayment(true);
            setStripeDialogShow(false);
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
