import React, { useState } from 'react';
import { Grid, Button, Modal, Box, TextField, Typography, FormControlLabel, Checkbox, InputAdornment } from '@mui/material';
import theme from '../theme/theme';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

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


export default function PaymentInfoModal(props) {
  const [isCheck, setIsCheck] = useState(false);
  const [checkNumber, setCheckNumber] = useState('');
  const [amount, setAmount] = useState(props.maintenanceItem.bill_amount || '');


  const handleAmountChange = (event) => {
    console.log(event.target.value);
    setAmount(event.target.value);
  }

  const handleCheckNumberChange = (event) => {
    console.log(event.target.value);
    setCheckNumber(event.target.value);
  }
  

  const handleClose = () => {
    setIsCheck(false);
    setCheckNumber('');
    setAmount('');
    props.setOpenModal(false);
  }

  const submit = (checkNumber, amount) => {
    console.log(checkNumber, amount);
    props.handleSubmit({
      checkNumber: checkNumber, 
      amount: amount, 
      id: props.maintenanceItem.maintenance_request_uid
    }).then(() => {
      handleClose()
    })
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
                Payment Information
            </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheck}
                onChange={(e) => setIsCheck(e.target.checked)}
              />
            }
            label="Received by Check"
          />

          {isCheck ? (
           <>
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  label="Check Number"
                  value={checkNumber}
                  onChange={handleCheckNumberChange}
                  margin="normal"
                  fullWidth
                  size='small'
                  InputLabelProps={{
                    sx: {
                      color: 'gray', // Default label color
                      '&.Mui-focused': {
                        color: 'black', // Label color when the TextField is focused
                      },
                    },
                  }}
                />
              </Grid>
            </Grid> 
         </>
          ) : null}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Amount Received in Cash"
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
          </Grid>
          <Grid container rowSpacing={6} padding={4}>
              <Grid item xs={6} sx={{ padding: "8px" }}>
                <Button variant="contained" sx={{ backgroundColor: "#FFFFFF", color: "#FFFFFF" }} onClick={() => handleClose()}>
                  <CloseIcon sx={{color: "#3D5CAC"}}/>
                  <Typography sx={{ color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    Cancel
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={6} sx={{ padding: "8px" }}>
                <Button variant="contained" color="primary" sx={{ backgroundColor: "#3D5CAC", color: "#000000" }} onClick={() => submit(checkNumber, amount)}>
                  <CheckIcon sx={{color: "#FFFFFF"}}/>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    Confirm
                  </Typography>
                </Button>
              </Grid>
            </Grid>
        </Box>
      </Modal>
    </div>
  );
}