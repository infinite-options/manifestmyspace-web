import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Unsaved Changes</DialogTitle>
    <DialogContent>
      <DialogContentText>
        You have unsaved changes. Do you want to proceed without saving?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onConfirm} sx={{ color: 'blue' }}>Proceed</Button>
      <Button onClick={onClose} sx={{ color: 'red' }}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;
