import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";

export default function UserDoesNotExistModal(props) {
  const { isOpen, onCancel, email } = props;
  const navigate = useNavigate();
  return (
    <div>
      <Dialog open={isOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">User Does Not Exists</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">The user {email} does not exist! Please Signup!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={onCancel}>
            Cancel
          </Button>

          <Button type="submit" onClick={() => navigate("/newUser")}>
            Signup
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
