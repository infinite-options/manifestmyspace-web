import React, { useState } from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import theme from '../../theme/theme';

const CashflowOwner = () => {
    const [revenueDropdown, setRevenueDropdown] = useState(false);
    const [expenseDropdown, setExpenseDropdown] = useState(false);

    const handleRevenueDropdown = () => {
        setRevenueDropdown(!revenueDropdown);
    }
    const handleExpenseDropdown = () => {
        setExpenseDropdown(!expenseDropdown);
    }
    
    return (
        <ThemeProvider theme={theme}>
          <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                // alignItems: 'center',
                width: '100%', // Take up full screen width
                minHeight: '100vh', // Set the Box height to full height
                marginTop: theme.spacing(2), // Set the margin to 20px
            }}
          >
            <Paper
              style={{
                margin: '30px',
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
                <Stack
                direction="row"
                justifyContent="center"
                >
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                    March 2023 Cashflow
                    </Typography>
                </Stack>
                <Box
                    component="span"
                    m={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Button sx={{ textTransform: 'capitalize' }}>
                        <CalendarTodayIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}/>
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                        Select Month / Year
                        </Typography>
                    </Button>
                    <Button sx={{ textTransform: 'capitalize' }}>
                        <HomeWorkIcon sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont, margin:'5px'}}/>
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                        Select Property
                        </Typography>
                    </Button>
                </Box>
               <Box
                    component="span"
                    m={3}
                    padding={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{
                        backgroundColor: theme.palette.custom.blue,
                        borderRadius: '5px'
                }}
                >
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        Cashflow
                    </Typography>
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        $6850
                    </Typography>
                </Box>
                <Box
                    component="span"
                    m={3}
                    padding={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{
                        backgroundColor: theme.palette.custom.grey,
                        borderRadius: '5px',
                }}
                >
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        Expected Cashflow
                    </Typography>
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                        $6850
                    </Typography>
                </Box>
                <Accordion sx={{backgroundColor: theme.palette.primary.main, boxShadow: 'none'}}>
                <Box
                    component="span"
                    m={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                       March Revenue
                    </Typography>
                </AccordionSummary>
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                        $13800
                    </Typography>
                </Box>
                <AccordionDetails>
                    <Typography>
                    This is the content of the Accordion. You can put any additional text or components here.
                    </Typography>
                </AccordionDetails>
                </Accordion>
                <Accordion sx={{backgroundColor: theme.palette.primary.main, boxShadow: 'none'}}>
                <Box
                    component="span"
                    m={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                       March Expense
                    </Typography>
                </AccordionSummary>
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                        $1150
                    </Typography>
                </Box>
                <AccordionDetails>
                    <Typography>
                    This is the content of the Accordion. You can put any additional text or components here.
                    </Typography>
                </AccordionDetails>
                </Accordion>
                {/* <Box
                    component="span"
                    m={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                            Expense
                        </Typography>
                        <ExpandMoreIcon 
                            sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}
                            onClick={()=>{handleExpenseDropdown()}}
                            />
                    </Stack>
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight}}>
                        $1150
                    </Typography>
                </Box> */}
                <Stack
                direction="row"
                justifyContent="center"
                // sx={{ mt :2}}
                >
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.largeFont}}>
                    Cashflow and Revenue by Month
                    </Typography>
                </Stack>
                <Box
                    component="span"
                    m={3}
                    padding={3}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                //     style={{
                //         backgroundColor: theme.palette.custom.grey,
                //         borderRadius: '5px',
                // }}
                >
                    <Button sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>Add Revenue</Button>
                    <Button sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>Add Expense</Button>
                </Box>
            </Paper>
          </Box>
        </ThemeProvider>
      );
    };
    

export default CashflowOwner;
