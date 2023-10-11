import React, { Component } from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, TextField, AccordionSummary, AccordionDetails, Grid } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { alpha, makeStyles } from "@material-ui/core/styles";

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
export default function AddCard() {
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
                
                <Stack m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Enter Card Details</Typography>
                </Stack>
                <hr/>
                
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Full Name</Typography>
                <TextField variant="filled" fullWidth   className={classes.root}></TextField>
                </Stack>
                
                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Email</Typography>
                <TextField variant="filled" fullWidth   className={classes.root}></TextField>
                </Stack>

                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Bank Name</Typography>
                <TextField variant="filled" fullWidth  className={classes.root}></TextField>
                </Stack>

                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Routing Number</Typography>
                <TextField variant="filled" fullWidth  className={classes.root}></TextField>
                </Stack>

                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Account Number</Typography>
                <TextField variant="filled" fullWidth  className={classes.root}></TextField>
                </Stack>

                <Stack spacing={-2} m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Re-enter Number</Typography>
                <TextField variant="filled" fullWidth  className={classes.root}></TextField>
                </Stack>

                <hr/>
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
            {"Sign Up"}
          </Button>
            </Paper>
            </Box>
            </Box>
        </ThemeProvider>
    )
}