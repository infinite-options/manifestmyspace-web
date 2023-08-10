import React, { Component, useState } from 'react';
import { Typography, Box, FormControlLabel, TextField,Checkbox, Button, Dialog, DialogContent, DialogTitle, Grid, ThemeProvider } from '@mui/material';
import theme from "../../theme/theme";

export default function CardDetails() {
    const [show, setShow] = useState(true);
    const handleSubmit = () => {
        
    }
    const handleAmountChange = () => {
        
    }
    return (
        <>
        <ThemeProvider theme={theme}>
        <Dialog open={show} onClose={() => setShow(false)} maxWidth="lg">
        <DialogTitle>
        Enter Card Details
        </DialogTitle>
        <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                    Card Number
                </Typography>
                <TextField 
                variant='filled' 
                fullWidth 
                placeholder='0000 0000 0000 0000' 
                type='number'
                value= ''
                onChange= {handleAmountChange}
                ></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
              <Typography>
                    Card Holder Name
                </Typography>
                <TextField 
                variant='filled' 
                fullWidth 
                placeholder='ex. M.Paul' 
                value= ''
                onChange= {handleAmountChange}
                ></TextField>
              </Grid>
              <Grid item xs={12}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                    <Typography>
                        Expiry Date
                    </Typography>
                    <TextField 
                    variant='filled' 
                    fullWidth 
                    placeholder='MM/YYYY' 
                    type='date'
                    value= '12/2023'
                    onChange= {handleAmountChange}
                    ></TextField>
                    </Grid>
                    <Grid item xs={4}>
                    <Typography>
                        CVV/CVC
                    </Typography>
                    <TextField 
                    variant='filled' 
                    fullWidth 
                    placeholder='3-4 digits' 
                    type='number'
                    value= ''
                    onChange= {handleAmountChange}
                    ></TextField>
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                    </Grid>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="Save Card"
                />
              </Grid>
            </Grid>
            <Button
            type="submit"
            fullWidth
            //   variant="contained"
            //   sx={{ mt: 3, mb: 2 }}
            variant='filled' 
            style={{textTransform: 'none'}} 
            sx={{backgroundColor: theme.palette.custom.buttonBlue, color: theme.palette.background.default, fontSize:theme.typography.smallFont}}
            >
              Add Card
            </Button>
            </Box>
        </DialogContent>
        </Dialog>
        </ThemeProvider>
        </>
    )
}