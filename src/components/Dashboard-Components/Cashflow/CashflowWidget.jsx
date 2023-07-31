import React, { useState } from 'react';
import { Typography, Grid, Box, Stack, ThemeProvider } from "@mui/material";
import "../../../css/cashflow.css";
import CashflowData from '../../Cashflow/CashflowData';
import { useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';

function CashflowWidget() {
    const navigate = useNavigate();

    const [revenue, setRevenue] = useState(null);
    const [revenueSummary, setRevenueSummary] = useState(null);
    const [expense, setExpense] = useState(null);
    const [expenseSummary, setExpenseSummary] = useState(null);

    return (
        <ThemeProvider theme={theme}>
        <div className="cf-widget-main" onClick={() => navigate('/cashflowOwner')}>
            <CashflowData year={'2023'} month={'June'} filter={false} role={'Owner'} userID={'100-000003'} setRevenueSummary={setRevenueSummary} setExpenseSummary={setExpenseSummary} setExpense={setExpense} setRevenue={setRevenue}></CashflowData>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
            <Stack
            direction="row"
            justifyContent="center"
            >
                <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                June 2023
                </Typography>
            </Stack>
            <Box
                component="span"
                m={1}
                padding={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                style={{
                    backgroundColor: theme.palette.custom.blue,
                    borderRadius: '5px'
            }}
            >
                <Typography sx={{color: theme.typography.primary.black, fontWeight:theme.typography.primary.fontWeight}}>
                    Cashflow
                </Typography>
                <Typography sx={{color: theme.typography.primary.black, fontWeight:theme.typography.primary.fontWeight}}>
                    ${
                    revenueSummary && expenseSummary ?
                    ((revenueSummary.reduce(function (prev, current) {
                        return prev + +current.amount_paid;
                    }, 0) -
                    expenseSummary.reduce(function (prev, current) {
                        return prev + +current.amount_paid;
                    }, 0)
                    ).toFixed(2)) : '0.00'}
                </Typography>
            </Box>
            <Box
                component="span"
                m={1}
                padding={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography sx={{color: theme.typography.primary.black, fontWeight:theme.typography.primary.fontWeight}}>
                    Revenue
                </Typography>
                <Typography sx={{color: theme.typography.primary.black, fontWeight:theme.typography.primary.fontWeight}}>
                    ${revenueSummary ?
                    (revenueSummary
                    .reduce(function (prev, current) {
                        return prev + +current.amount_paid;
                    }, 0)
                    .toFixed(2)) : '0.00'}
                </Typography>
            </Box>
            <Box
                component="span"
                m={1}
                padding={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography sx={{color: theme.typography.primary.black, fontWeight:theme.typography.primary.fontWeight}}>
                    Expenses
                </Typography>
                <Typography sx={{color: theme.typography.primary.black, fontWeight:theme.typography.primary.fontWeight}}>
                    ${expenseSummary ?
                    (expenseSummary
                    .reduce(function (prev, current) {
                        return prev + +current.amount_paid;
                    }, 0)
                    .toFixed(2)) : '0.00'}
                </Typography>
            </Box>
            </Grid>
            <Grid item xs={6}>
            </Grid>
            </Grid>
            {/* <div className="cf-widget-main" onClick={() => navigate('/cashflowOwner')}>
            <div className="cf-widget-title-info-container">
                <div className="cf-widget-title-container">
                    <h2 className="cf-widget-title">March 2023</h2>
                </div>
                <div className="cf-widget-info-container">
                    <div className="cf-widget-info-cf">Cashflow
                        <span>
                        ${
                        revenueSummary && expenseSummary ?
                        ((revenueSummary.reduce(function (prev, current) {
                            return prev + +current.amount_paid;
                        }, 0) -
                        expenseSummary.reduce(function (prev, current) {
                            return prev + +current.amount_paid;
                        }, 0)
                        ).toFixed(2)) : '0.00'}
                        </span>
                    </div>
                    <div className="cf-widget-info-revenue">Revenue
                        <span>
                        ${revenueSummary ?
                        (revenueSummary
                        .reduce(function (prev, current) {
                            return prev + +current.amount_paid;
                        }, 0)
                        .toFixed(2)) : '0.00'}
                        </span>
                    </div>
                    <div className="cf-widget-info-expenses">Expenses 
                        <span>
                        ${expenseSummary ?
                        (expenseSummary
                        .reduce(function (prev, current) {
                            return prev + +current.amount_paid;
                        }, 0)
                        .toFixed(2)) : '0.00'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="cf-widget-graph-container">
                <p className="cf-widget-graph-title"></p>
                <img className="cf-widget-graph"></img>
            </div>  
        </div> */}
        </div>
        </ThemeProvider>
    )
}

export default CashflowWidget;