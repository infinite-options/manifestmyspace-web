import React, { useState } from 'react';
import { Button, Modal, Box, Typography, Grid, TextField, InputAdornment } from '@mui/material';
import theme from '../theme/theme';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: theme.spacing(2),
  // backgroundColor: theme.palette.form.main,
  backgroundColor: "#FFFFFF",
  width: {
    xs: '80%', // For extra-small screens
    sm: '60%', // For small screens
    md: '40%', // For medium screens
    lg: '30%', // For large screens
    xl: '20%', // For extra-large screens
  },
  paddingTop: '25px',
  borderRadius: '15px',
  border: '2px solid #000',
  boxShadow: 24,
  padding: "25px"
};


export default function CreateChargeModal(props) {

  const [amount, setAmount] = useState(props.maintenanceItem.bill_amount || '');

  // console.log("props", props.maintenanceItem)

  const handleAmountChange = (event) => {
    console.log(event.target.value);
    setAmount(event.target.value);
  }

  const handleClose = () => {
    props.setOpenModal(false);
  }

  const submit = (amount) => {
    props.handleModalSubmit(amount).then(
        handleClose()
    )
  }

return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Create Charge for {props.maintenanceItem.maintenance_title}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Charging {props.maintenanceItem.owner_first_name} {props.maintenanceItem.owner_last_name}
            </Typography>
            <Grid container rowSpacing={6} padding={4}>
              <Grid item xs={12} sx={{ padding: "8px" }}>
                <TextField
                  label="Amount To Charge"
                  value={amount}
                  onChange={handleAmountChange}
                  margin="normal"
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    sx: {
                      color: 'gray', // Default label color
                      '&.Mui-focused': {
                        color: 'black', // Label color when the TextField is focused
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "8px" }}>
                <Button variant="contained" sx={{ backgroundColor: "#FFFFFF", color: "#FFFFFF" }} onClick={() => handleClose()}>
                  <Typography sx={{ color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    Cancel
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={6} sx={{ padding: "8px" }}>
                <Button variant="contained" color="primary" sx={{ backgroundColor: "#3D5CAC", color: "#000000" }} onClick={() => submit(amount)}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    Create
                  </Typography>
                </Button>
              </Grid>
            </Grid>
        </Box>
      </Modal>
    </div>
  );
}