import React, { Component } from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';

const AddExpense = (props) => {
    return (
        <>
            <ThemeProvider theme={theme}>
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%', // Take up full screen width
                    minHeight: '100vh', // Set the Box height to full height
                    marginTop: theme.spacing(2), // Set the margin to 20px
                }}
            >
            <Paper
              style={{
                margin: '30px',
                padding: theme.spacing(2),
                // backgroundColor: theme.palette.primary.main,
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
                <Stack
                direction="row"
                justifyContent="center"
                >
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                    Add Expense
                    </Typography>
                </Stack>
            </Paper>
            </Box>
            </ThemeProvider>
        </>
    )
}
export default AddExpense;