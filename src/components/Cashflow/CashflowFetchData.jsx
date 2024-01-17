import React, { Component, useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";


// I want to create several functions that compute the cashflow
// data for the owner. 
// I want one function to get all the data from the database
// I want other functions to compute the data for the selected month and year for each filter type.

async function fetchCashflow(userProfileId){
    try {
        // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
        const cashflow = await axios.get(`http://127.0.0.1:4000/cashflowByOwner/${userProfileId}/TTM`);
        // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/${userProfileId}/TTM`);
        return cashflow.data;
    } catch (error) {
        console.error("Error fetching cashflow data:", error)
    }
}

function getRevenueList(data){
    return data.response_revenue.result
}

function getExpenseList(data){
    return data.response_expense.result
}

function getPast12MonthsCashflow(){

}

function getRevenueByMonth(data){
    console.log("revenue by month", data)

}

function getExpenseByMonth(data){
    console.log("expense by month", data)
}

function getExpectedRevenueByType(data, month, year){ 
    let revenueItems = data.response_revenue_by_month.result.filter((item) => item.cf_month === month && item.cf_year === year)
    return revenueItems
}

function getTotalRevenueByType(data, month, year, expected){
    // console.log(data, month, year)

    var key = "sum(total_paid)";

    if (expected === true){
        key = "sum(pur_amount_due)"
    } else{
        key = "sum(total_paid)"
    }

    let revenueItems = data.response_revenue_by_month_by_type.result.filter((item) => item.cf_month === month && item.cf_year === year)
    let totalRent = revenueItems.reduce((acc, revenue) => {
        if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "RENT"){
            // console.log("revenue", revenue[key])
            // console.log("acc", acc)
            return acc + parseFloat(revenue[key])
        }
        return acc
    }, 0.0)
    let totalDeposits = revenueItems.reduce((acc, revenue) => {
        if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "DEPOSITS"){
            return acc + parseFloat(revenue[key])
        }
        return acc
    }, 0.0)
    let totalExtraCharges = revenueItems.reduce((acc, revenue) => {
        if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "EXTRA CHARGES"){
            return acc + parseFloat(revenue[key])
        }
        return acc
    }, 0.0)
    let totalUtilities = revenueItems.reduce((acc, revenue) => {
        if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "UTILITIES"){
            return acc + parseFloat(revenue[key])
        }
        return acc
    }, 0.0)
    let totalLateFee = revenueItems.reduce((acc, revenue) => {
        if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "LATE FEE"){
            return acc + parseFloat(revenue[key])
        }
        return acc
    }, 0.0)
    let totalMaintenance = revenueItems.reduce((acc, revenue) => {
        if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "MAINTENANCE"){
            return acc + parseFloat(revenue[key])
        }
        return acc
    }, 0.0)
    let totalRepairs = revenueItems.reduce((acc, revenue) => {
        if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "REPAIRS"){
            return acc + parseFloat(revenue[key])
        }
        return acc
    }, 0.0)

    return {
        "RENT": totalRent,
        "DEPOSITS": totalDeposits,
        "EXTRA CHARGES": totalExtraCharges,
        "UTILITY": totalUtilities,
        "LATE FEE": totalLateFee,
        "MAINTENANCE": totalMaintenance,
        "REPAIRS": totalRepairs,
    }
}


function getTotalExpenseByType(data, month, year, expected){
    // console.log(data, month, year)

    var key = "sum(total_paid)";

    if (expected === true){
        key = "sum(pur_amount_due)"
    } else{
        key = "sum(total_paid)"
    }

    let expenseItems = data.response_expense_by_month_by_type.result.filter((item) => item.cf_month === month && item.cf_year === year);
    
    let totalMaintenance = expenseItems.reduce((acc, expense) => {
        if (expense[key] !== null && expense.purchase_type.toUpperCase() === "MAINTENANCE"){
            return acc + parseFloat(expense[key]);
        }
        return acc;
    }, 0.0);

    let totalRepairs = expenseItems.reduce((acc, expense) => {
        if (expense[key] !== null && expense.purchase_type.toUpperCase() === "REPAIRS"){
            return acc + parseFloat(expense[key]);
        }
        return acc;
    }, 0.0);

    let totalMortgage = expenseItems.reduce((acc, expense) => {
        if (expense[key] !== null && expense.purchase_type.toUpperCase() === "MORTGAGE"){
            return acc + parseFloat(expense[key]);
        }
        return acc;
    }, 0.0);

    let totalTaxes = expenseItems.reduce((acc, expense) => {
        if (expense[key] !== null && expense.purchase_type.toUpperCase() === "TAXES"){
            return acc + parseFloat(expense[key]);
        }
        return acc;
    }, 0.0);

    let totalInsurance = expenseItems.reduce((acc, expense) => {
        if (expense[key] !== null && expense.purchase_type.toUpperCase() === "INSURANCE"){
            return acc + parseFloat(expense[key]);
        }
        return acc;
    }, 0.0);

    let totalUtilities = expenseItems.reduce((acc, expense) => {
        if (expense[key] !== null && expense.purchase_type.toUpperCase() === "UTILITIES"){
            return acc + parseFloat(expense[key]);
        }
        return acc;
    }, 0.0);

    let totalManagement = expenseItems.reduce((acc, expense) => {
        if (expense[key] !== null && expense.purchase_type.toUpperCase() === "MANAGEMENT"){
            return acc + parseFloat(expense[key]);
        }
        return acc;
    }, 0.0);

    let totalBillPosting = expenseItems.reduce((acc, expense) => {
        if (expense[key] !== null && expense.purchase_type.toUpperCase() === "BILL POSTING"){
            return acc + parseFloat(expense[key]);
        }
        return acc;
    }, 0.0);


    return {
        'MAINTENANCE': totalMaintenance,
        'REPAIRS': totalRepairs,
        'MORTGAGE': totalMortgage,
        'TAXES': totalTaxes,
        'INSURANCE': totalInsurance,
        'UTILITIES': totalUtilities,
        'MANAGEMENT': totalManagement,
        'BILL POSTING': totalBillPosting,
    }
}

function getTotalRevenueByMonthYear(data, month, year){
    let revenueItems = data.response_revenue_by_month.result.filter((item) => item.cf_month === month && item.cf_year === year)
    let totalRevenue = revenueItems.reduce((acc, item) => {
        return acc + parseFloat(item["sum(total_paid)"] ? item["sum(total_paid)"] : 0.0)
    }, 0.0)
    return totalRevenue
}

function getTotalExpenseByMonthYear(data, month, year){
    let expenseItems = data.response_expense_by_month.result.filter((item) => item.cf_month === month && item.cf_year === year)
    let totalExpense = expenseItems.reduce((acc, item) => {
        return acc + parseFloat(item["sum(total_paid)"] ? item["sum(total_paid)"] : 0.0)
    }, 0.0)
    return totalExpense
}

function getTotalExpectedRevenueByMonthYear(data, month, year){
    let revenueItems = data.response_revenue_by_month.result.filter((item) => item.cf_month === month && item.cf_year === year)
    let totalRevenue = revenueItems.reduce((acc, item) => {
        return acc + parseFloat(item["sum(pur_amount_due)"] ? item["sum(pur_amount_due)"] : 0.0)
    }, 0.0)
    return totalRevenue
}

function getTotalExpectedExpenseByMonthYear(data, month, year){
    // console.log(data)
    let expenseItems = data.response_expense_by_month.result.filter((item) => item.cf_month === month && item.cf_year === year)
    let totalExpense = expenseItems.reduce((acc, item) => {
        return acc + parseFloat(item["sum(pur_amount_due)"] ? item["sum(pur_amount_due)"] : 0.0)
    }, 0.0)
    return totalExpense
}



export { getTotalRevenueByType, getTotalExpenseByType, getRevenueList, getExpenseList, fetchCashflow, getTotalRevenueByMonthYear, getTotalExpenseByMonthYear, getRevenueByMonth, getExpenseByMonth, getTotalExpectedRevenueByMonthYear, getTotalExpectedExpenseByMonthYear }


