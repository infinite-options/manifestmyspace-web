import React, { useState } from 'react';
import {
    Box,
    ThemeProvider,
    Paper,
    Button,
    Typography,
    Stack,
    Grid,
    TextField,
    IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import theme from "../../theme/theme";
import CashflowData from '../Cashflow/CashflowData';
import MixedChart from '../Graphs/OwnerCashflowGraph';
import HappinessMatrix from './HappinessMatrix';
import CommentIcon from '@mui/icons-material/Comment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

export default function ManagerDashboardHappinessMatrix(props) {
    const navigate = useNavigate();
    const { user } = useUser();
    const [revenueCashflowByMonth, setRevenueCashflowByMonth] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    let date = new Date();
    let month = date.toLocaleString('default', { month: 'long' });
    let year = date.getFullYear().toString()

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <CashflowData setShowSpinner={setShowSpinner} year={year} month={month} role={'Owner'} userID={user.user_uid} setRevenueCashflowByMonth={setRevenueCashflowByMonth}></CashflowData>
            <ThemeProvider theme={theme}>
            <Paper 
            component={Stack} 
            direction="column" 
            justifyContent="center"
            style={{
                justifyContent: 'center',
                width: '100%', // Take up full screen width
                marginTop: '60px', // Set the margin to 20px
            }}>
                <Box
                component="span"
                display= 'flex'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'>
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.primary.black, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    Happiness Matrix
                    </Typography>
                </Box>
                
                <Paper
                    style={{
                        margin: '1px',
                        padding: 0,
                        backgroundColor: theme.palette.primary.main,
                        height: 200,
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        [theme.breakpoints.up('sm')]: {
                            width: '50%',
                        },
                    }}
                    // square
                >
                    <HappinessMatrix></HappinessMatrix>
                </Paper>
                <Paper
                    style={{
                        margin: '2px 25px',
                        padding: 10,
                        backgroundColor: theme.palette.primary.main,
                        height: '25%',
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        [theme.breakpoints.up('sm')]: {
                            width: '50%',
                        },
                    }}
                    onClick={()=>navigate('/cashflow')}
                >
                    <Stack
                        direction="row"
                        justifyContent="left"
                        >
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={3}>
                    <AccountCircleIcon
                    sx={{
                        color: theme.typography.common.blue,
                        width: 70,
                        height:70,
                    }}
                    ></AccountCircleIcon>
                    </Grid>
                    <Grid item xs={8}>
                        <Stack
                        direction="row"
                        justifyContent="left"
                        >
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                            Steve Albini
                            </Typography>
                        </Stack>
                        <Stack
                        direction="row"
                        justifyContent="left"
                        >
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                            1 Property Vacant
                            </Typography>
                        </Stack>
                        <Stack
                        direction="row"
                        justifyContent="left"
                        >
                            <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                            -$350 (2.6%) Cashflow Delta
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={1}>
                        <Stack
                        direction="row"
                        justifyContent="right"
                        >
                            <CommentIcon
                                sx={{color: theme.typography.common.blue}}>
                            </CommentIcon>
                        </Stack>
                    </Grid>
                    </Grid>
                    </Stack>
                    
                    <Stack
                    direction="row"
                    justifyContent="left"
                    >
                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize:theme.typography.smallFont}}>
                    December 2023 Cashflow
                    </Typography>
                    </Stack>
                    
                    <Stack
                    direction="row"
                    justifyContent="left"
                    >
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Stack
                        direction="row"
                        justifyContent="left"
                        >
                            <Typography sx={{color: theme.typography.common.blue, fontSize:theme.typography.smallFont}}>
                            Expected Cashflow: $13,400
                            </Typography>
                        </Stack>
                        <Stack
                        direction="row"
                        justifyContent="left"
                        >
                            <Typography sx={{color: theme.typography.common.blue, fontSize:theme.typography.smallFont}}>
                            Actual Cashflow: $13,050
                            </Typography>
                            </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack
                        direction="row"
                        justifyContent="right"
                        height={150}
                        >
                            <MixedChart revenueCashflowByMonth={revenueCashflowByMonth}></MixedChart>
                        </Stack> 
                    </Grid>
                    </Grid>
                    </Stack>
                    </Paper>
                </Paper>
                </ThemeProvider>
        </>
    )
}