import React, { useState, useEffect } from 'react';
import {
    Box,
    ThemeProvider,
    Paper,
    Typography,
    Stack,
    Grid,
    CircularProgress,
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

export default function ManagerDashboardHappinessMatrix(props) {
    const navigate = useNavigate();
    const { user, getProfileId } = useUser();
    const [revenueCashflowByMonth, setRevenueCashflowByMonth] = useState([]);
    const [showSpinner, setShowSpinner] = useState([]);
    let [matrixData, setMatrixData] = useState({})
    let date = new Date();
    let month = date.toLocaleString('default', { month: 'long' });
    let year = date.getFullYear().toString()
    let [p_owner, p_owner_setter] = useState({ name: 'Steve Albin', vacant_count: 1 })
    let data = [
        { x: -100, y: -200, name: 'Roberto Baggio', photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCPRv_8LK6cRBMpksFuhzPuC1DSGlcPoUQdg&usqp=CAU',},
        { x: -100, y: 200, name: 'Roberto Carlos',  photo: 'https://e0.365dm.com/12/02/2048x1152/Roberto-Carlos-2_2714252.jpg?20120206163955',},
        { x: 120, y: 100, name: 'Gianluca Pagliuca', photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvUK7_R60mszrOUeShtB-qKEjseDuYMduo3g&usqp=CAU',},
        { x: 120, y: -100, name: 'Fabien Barthez', photo:'https://img.a.transfermarkt.technology/portrait/big/3289-1414053325.jpg?lm=1',},
        { x: 0, y: 0, name: 'Harry Maguire',},
    ];
    data=data.map((c,i) => {return {...c, index:i}})

    useEffect(() => {
        
        const fetchMatrixData = async () => {
            
            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/happinessMatrix/${getProfileId()}`)
            
            const jsonData = await response.json()

            console.log('Ramin')
            console.log(jsonData.vacancy.result)
            setMatrixData(jsonData.vacancy.result)
            console.log('Ramin')
            
        }
        fetchMatrixData();
    }, []);

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
                        marginTop: '60px', // Set the margin to 60px
                    }}
                >
                    <Box
                        component="span"
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        position='relative'>
                        <Typography
                            sx={{
                                justifySelf: 'center',
                                color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.largeFont
                            }}>
                            Happiness Matrix
                        </Typography>
                    </Box>

                    <Paper
                        style={{
                            margin: '50px', // Add margin here
                            padding: '40px',
                            backgroundColor: theme.palette.primary.main,
                            height: 200,
                            [theme.breakpoints.down('sm')]: {
                                width: '80%',
                            },
                            [theme.breakpoints.up('sm')]: {
                                width: '50%',
                            },
                        }}
                    >
                        <HappinessMatrix data={data} dataSetter={p_owner_setter}> </HappinessMatrix>
                    </Paper>
                    <Paper
                        style={{
                            margin: '50px', // Add margin here
                            marginTop: '20px',
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
                        onClick={() => navigate('/cashflow')}
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
                                            height: 70,
                                        }}
                                    ></AccountCircleIcon>
                                </Grid>
                                <Grid item xs={8}>
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                    >
                                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }}>
                                            {p_owner.name}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                    >
                                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }}>
                                            {p_owner.vacant_count} Property Vacant
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                    >
                                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }}>
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
                                            sx={{ color: theme.typography.common.blue }}>
                                        </CommentIcon>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>

                        <Stack
                            direction="row"
                            justifyContent="left"
                        >
                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: theme.typography.smallFont }}>
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
                                        <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.smallFont }}>
                                            Expected Cashflow: $13,400
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                    >
                                        <Typography sx={{ color: theme.typography.common.blue, fontSize: theme.typography.smallFont }}>
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
    );
}
