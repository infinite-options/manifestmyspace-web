import React, { useState } from 'react';
import { Button, Modal, Box, Typography, Grid } from '@mui/material';
// import theme from '../theme/theme';
import theme from '../../theme/theme'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: theme.spacing(2),
  // backgroundColor: theme.palette.form.main,
  backgroundColor: "#FFFFFF",
  width: {
    xs: '60%', // For extra-small screens
    sm: '20%', // For small screens and up
  },
  paddingTop: '25px',
  borderRadius: '15px',
  border: '2px solid #000',
  boxShadow: 24,
  padding: "25px"
};


export default function TenantMaintenanceModal(props) {


  const handleClose = () => {
    props.setOpenModal(false);
  }

  // const submit = () => {
  //   props.handleSubmit().then(
  //       handleClose()
  //   )
  // }

return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Grid container rowSpacing={2} padding={4}>
              <Grid item xs={12} sx={{ padding: "8px" }}>
                
                  <Typography sx={{ color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    No
                  </Typography>
                
              </Grid>
              <Grid item xs={12} sx={{ padding: "8px" }}>
                
                  <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.mediumFont }}>
                    Yes
                  </Typography>
              </Grid>
            </Grid>
        </Box>
      </Modal>
    </div>
  );
}