import React, { Component } from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
export default function Settings() {
    return (
        <ThemeProvider theme={theme}>
          <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%', // Take up full screen width
                height: '100vh', // Set the Box height to full height
                marginTop: theme.spacing(2), // Set the margin to 20px
                backgroundColor: theme.palette.custom.blue,
            }}
          >
            <Paper
              style={{
                margin: '30px',
                padding: theme.spacing(2),
                // backgroundColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.secondary,
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
                position= 'relative'>
                    <AccountCircleIcon
                    sx={{
                        color: theme.typography.common.blue,
                        // width: 70,
                        // height:70,
                        position: 'absolute',
                        left: 0
                    }}
                    ></AccountCircleIcon>
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.primary.black, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    John Lennon
                    </Typography>
                </Box>
                {/* <Box
                component="span"
                display= 'flex'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'>
                    <AccountCircleIcon
                    sx={{
                        color: theme.typography.common.blue,
                        // width: 70,
                        // height:70,
                        position: 'absolute',
                        left: 0
                    }}
                    ></AccountCircleIcon>
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.primary.black, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    Account Settings
                    </Typography>
                </Box>
                <Box
                component="span"
                display= 'flex'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'>
                    <AccountCircleIcon
                    sx={{
                        color: theme.typography.common.blue,
                        // width: 70,
                        // height:70,
                        position: 'absolute',
                        left: 0
                    }}
                    ></AccountCircleIcon>
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.primary.black, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    More
                    </Typography>
                </Box> */}
            </Paper>
            </Box>
        </ThemeProvider>
    )
}