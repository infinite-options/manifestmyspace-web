import React, { Component } from 'react';
import { Paper, Box, Stack, ThemeProvider, Checkbox, Typography, TextField, Button, FormControlLabel, AccordionDetails, Grid } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { alpha, makeStyles } from "@mui/styles";
import PayPal from '../../images/PayPal.png'
import Zelle from '../../images/Zelle.png'
import Venmo from '../../images/Venmo.png'
import Chase from '../../images/Chase.png'
import Stripe from '../../images/Stripe.png'
import ApplePay from '../../images/ApplePay.png'

const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiFilledInput-root": {
        backgroundColor: "#D6D5DA", // Update the background color here
        borderRadius: 10,
        height: 30,
        marginBlock: 10,
      },
    },
    typography: {
        backgroundColor: "#D6D5DA",
        borderRadius: 10,
        height: 30,
        marginBlock: 10,
        display: 'flex',
        alignItems: 'center',
    }
  }));
export default function CardDetailsSettings() {
    const classes = useStyles();
    const navigate = useNavigate();
    return (
        <ThemeProvider theme={theme}>
          <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%', // Take up full screen width
                height: '100vh', // Set the Box height to full view height
                justifyContent: 'flex-start', // Align items at the top
            }}
          >
            <Box
            style={{
                width: '100%',
                backgroundColor: theme.palette.custom.bgBlue,
                height: '25%', // 25% of the container's height
            }}>
                <Box
                component="span"
                display= 'flex'
                margin='10px'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'>
                    <UTurnLeftIcon 
                    sx={{
                        transform: "rotate(90deg)", 
                        color: theme.typography.secondary.white, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont, 
                        padding: 5,
                        position: 'absolute',
                        left: 0
                            }}
                    onClick={()=>{navigate(-1)}}/>
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.secondary.white, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    Settings
                    </Typography>
                </Box>
            <Paper
              style={{
                margin: '30px', // Margin around the paper
                padding: theme.spacing(2),
                backgroundColor: theme.palette.primary.main,
                width: '85%', // Occupy full width with 25px margins on each side
                [theme.breakpoints.down('sm')]: {
                    width: '80%',
                },
                [theme.breakpoints.up('sm')]: {
                    width: '50%',
                },
              }}
            >
                <Box
                component="span"
                display= 'flex'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'
                flexDirection="column">
                    <AccountCircleIcon
                    sx={{
                        color: theme.typography.common.blue,
                        width: 45,
                        height:45,
                        position: 'absolute',
                        left: 0
                    }}
                    ></AccountCircleIcon>
                    <>
                    <Stack
                    direction="row"
                    justifyContent="center"
                    >
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.primary.black, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    John Lennon
                    </Typography>
                    </Stack>
                    <Stack
                    direction="row"
                    justifyContent="center"
                    >
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.common.blue, 
                        fontWeight: theme.typography.light.fontWeight, 
                        fontSize:theme.typography.primary.smallFont}}>
                    Owner Profile
                    </Typography>
                    </Stack>
                    </>
                </Box>
                <hr/>
                
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    <Grid item xs={4}>
                        {/* <Checkbox sx={{ color: theme.typography.common.blue }} /> */}
                        <img src={PayPal}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography sx={{ color: theme.typography.common.blue }}>Paypal</Typography>
                    </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="filled" fullWidth placeholder="" className={classes.root} />
                </Grid>
                </Grid>
                
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    <Grid item xs={4}>
                        {/* <Checkbox sx={{ color: theme.typography.common.blue }} /> */}
                        <img src={ApplePay}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography sx={{ color: theme.typography.common.blue }}>Apple Pay</Typography>
                    </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="filled" fullWidth placeholder="" className={classes.root} />
                </Grid>
                </Grid>
                
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    <Grid item xs={4}>
                        {/* <Checkbox sx={{ color: theme.typography.common.blue }} /> */}
                        <img src={Stripe}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography sx={{ color: theme.typography.common.blue }}>Stripe</Typography>
                    </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="filled" fullWidth placeholder="" className={classes.root} />
                </Grid>
                </Grid>
                
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    <Grid item xs={4}>
                        {/* <Checkbox sx={{ color: theme.typography.common.blue }} /> */}
                        <img src={Zelle}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography sx={{ color: theme.typography.common.blue }}>Zelle</Typography>
                    </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="filled" fullWidth placeholder="" className={classes.root} />
                </Grid>
                </Grid>
                
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    <Grid item xs={4}>
                        {/* <Checkbox sx={{ color: theme.typography.common.blue }} /> */}
                        <img src={Venmo}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography sx={{ color: theme.typography.common.blue }}>Venmo</Typography>
                    </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="filled" fullWidth placeholder="" className={classes.root} />
                </Grid>
                </Grid>
                
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                        <Checkbox sx={{ color: theme.typography.common.blue }} />
                    </Grid>
                    <Grid item xs={4}>
                        {/* <Checkbox sx={{ color: theme.typography.common.blue }} /> */}
                        <img src={Chase}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography sx={{ color: theme.typography.common.blue }}>Chase</Typography>
                    </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="filled" fullWidth placeholder="" className={classes.root} />
                </Grid>
                </Grid>
                
                <Box
                    component="span"
                    m={2}
                    p={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    className={classes.typography}>
                        <Typography sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}>Connect credit card</Typography>
                        <ArrowForwardIosIcon 
                        sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}
                        onClick={()=>{navigate('/addCardSettings')}}/>
                </Box>
                <Box
                    component="span"
                    m={2}
                    p={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    className={classes.typography}>
                        <Typography sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}>Setup ACH Transfer</Typography>
                        <ArrowForwardIosIcon 
                        sx={{color: theme.typography.common.blue, fontSize: theme.typography.smallFont}}
                        onClick={()=>{navigate('/settingsManagerACH1')}}/>
                </Box>
                <Button
            sx={{
              paddingLeft: "2%",
              paddingRight: "2%",
              background: "#3D5CAC",
              color: theme.palette.background.default,
              width: `100%`,
              height: `15%`,
              borderRadius: "15px",
              fontSize: theme.typography.smallFont,
              fontWeight: theme.typography.primary.fontWeight,
              textTransform: "none",
            }}
          >
            {"Save and Submit"}
          </Button>
            </Paper>
            </Box>
            </Box>
        </ThemeProvider>
    )
}