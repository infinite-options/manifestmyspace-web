import React, { Component } from 'react';
import { Paper, Box, Grid, Stack, ThemeProvider, TextField, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import PhotoIcon from '@mui/icons-material/Photo';
import { alpha, makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiFilledInput-root": {
        backgroundColor: "#D6D5DA", // Update the background color here
        borderRadius: 10,
        height: 30,
        marginBlock: 10,
      },
    },
  }));

export default function TenantProfileSettings() {
    const classes = useStyles();
    const navigate = useNavigate();
    const textStyle={color: theme.typography.common.blue, 
        fontWeight: theme.typography.light.fontWeight, 
        fontSize:theme.typography.primary.smallFont};

    

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
                        color: '#3D5CAC', 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    {'Abbey Road'}
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
                    Tenant Profile
                    </Typography>
                    </Stack>
                    </>
                </Box>
                <hr/>
                <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: '#3D5CAC', 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    Add Tenant Information
                    </Typography>
                
                <hr/>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={5}>
                    <Typography sx={textStyle}>{'First Name'}</Typography>
                    <Typography sx={{ ...textStyle, color:'black' }}>{'Abbey'}</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={5}>
                    <Typography sx={textStyle}>{'Last Name'}</Typography>
                    <Typography sx={{ ...textStyle, color:'black' }}>{'Road'}</Typography>
                    </Stack>
                </Grid>
                </Grid>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={5}>
                    <Typography sx={textStyle}>{'Email Address'}</Typography>
                    <Typography sx={{ ...textStyle, color:'black' }}>{'abbeyroad1969@gmail.com'}</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={5}>
                    <Typography sx={textStyle}>{'Phone'}</Typography>
                    <Typography sx={{ ...textStyle, color:'black' }}>{'5415678900'}</Typography>
                    </Stack>
                </Grid>
                </Grid>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={5}>
                    <Typography sx={textStyle}>{'Address'}</Typography>
                    <Typography sx={{ ...textStyle, color:'black' }}>{'1234 Abc.street'}</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={5}>
                    <Typography sx={textStyle}>{'Unit Number'}</Typography>
                    <Typography sx={{ ...textStyle, color:'black' }}>{'2'}</Typography>
                    </Stack>
                </Grid>
                </Grid>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={5}>
                    <Typography sx={textStyle}>{'City/ State'}</Typography>
                    <Typography sx={{ ...textStyle, color:'black' }}>{'San Jose/ CA'}</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={-2} m={5}>
                    <Typography sx={textStyle}>{'Zip Code'}</Typography>
                    <Typography sx={{ ...textStyle, color:'black' }}>{'123455'}</Typography>
                    </Stack>
                </Grid>
                </Grid>

                <Box
  component="span"
  m={2}
  p={2}
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  className={classes.typography}
  style={{
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Add shadow
  }}
>
  <Typography sx={textStyle}>Connect credit card</Typography>
  <ArrowForwardIosIcon
    sx={{ color: theme.typography.common.blue, fontSize: theme.typography.smallFont }}
    onClick={() => {
      navigate('/addCardSettings');
    }}
  />
</Box>
<Box
  component="span"
  m={2}
  p={2}
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  className={classes.typography}
  style={{
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Add shadow
  }}
>
  <Typography sx={textStyle}>Setup ACH Transfer</Typography>
  <ArrowForwardIosIcon
    sx={{ color: theme.typography.common.blue, fontSize: theme.typography.smallFont }}
    onClick={() => {
      navigate('/settingsManagerACH1');
    }}
  />
</Box>


            </Paper>
            </Box>
            </Box>
        </ThemeProvider>
    )
}