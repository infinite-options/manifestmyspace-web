import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Fade } from "@mui/material";
import { DialogActions } from "@material-ui/core";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Payment_Failure(props) {
  const navigate = useNavigate();
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
            navigate("/tenantDashboard")
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
