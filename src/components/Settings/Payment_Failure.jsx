import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Fade } from "@mui/material";
import { DialogActions } from "@mui/material";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";


export default function Payment_Failure(props) {
  const navigate = useNavigate();
  const { paymentRoutingBasedOnSelectedRole } = useUser();
  const {
    showError,
    setShowError,
  } = props;

  return (
    <Dialog
      open={showError}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title"></DialogTitle>
      <DialogContent>
        <div className="d-flex justify-content-center align-items-center m-5">
          <h5>The payment was unsuccessful. Would you like to go to you dashboard? </h5>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowError(false)}>Cancel</Button>
        <Button
          onClick={() => {
            setShowError(false);
            navigate(paymentRoutingBasedOnSelectedRole())
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
