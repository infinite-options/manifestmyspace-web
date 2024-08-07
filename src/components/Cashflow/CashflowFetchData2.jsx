import React, { Component, useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";

// I want to create several functions that compute the cashflow
// data for the owner.
// I want one function to get all the data from the database
// I want other functions to compute the data for the selected month and year for each filter type.

async function fetchCashflow2(userProfileId, month, year) {
  try {
    // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
    // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/${userProfileId}/TTM`);
    // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/${userProfileId}/TTM`);
    // const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflow/110-000003/TTM`);
    const cashflow = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowRevised/${userProfileId}`);
    // console.log("Endpoint returns: ", cashflow.data);
    return cashflow.data;
  } catch (error) {
    console.error("Error fetching cashflow data:", error);
  }
}

function getRevenueList(data) {
  // return data.response_revenue.result;
  // console.log("getRevenueList - data - ", data);
  // console.log("revenueList - ",data?.result?.filter(item => item.pur_cf_type === "revenue"));
  return data?.result?.filter((item) => item.pur_cf_type === "revenue");
}

function getExpenseList(data) {
  // return data.response_expense.result;
  // console.log("getExpenseList - data - ", data);
  // console.log("expenseList - ",data?.result?.filter(item => item.pur_cf_type === "expense"));
  return data?.result?.filter((item) => item.pur_cf_type === "expense");
}

function getPast12MonthsCashflow(data, month, year) {
  var pastTwelveMonths = [];
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var currentMonth = month;
  var currentYear = year;

  // create a loop that goes back 12 months
  for (var i = 0; i < 12; i++) {
    // console.log(currentMonth, currentYear)

    // let expectedMonthRevenue = getTotalExpectedRevenueByMonthYear(data, currentMonth, currentYear)
    // let expectedMonthExpense = getTotalExpectedExpenseByMonthYear(data, currentMonth, currentYear)
    let currentMonthRevenue = getTotalRevenueByMonthYear(data, currentMonth, currentYear);
    let currentMonthExpense = getTotalExpenseByMonthYear(data, currentMonth, currentYear);

    // console.log("currentMonthRevenue", currentMonthRevenue)
    // console.log("currentMonthExpense", currentMonthExpense)
    // console.log("expectedMonthRevenue", expectedMonthRevenue)
    // console.log("expectedMonthExpense", expectedMonthExpense)

    pastTwelveMonths.push({
      month: currentMonth,
      year: currentYear,
      revenue: currentMonthRevenue,
      cashflow: currentMonthRevenue - currentMonthExpense,
      monthYear: currentMonth.slice(0, 3) + " " + currentYear.slice(2, 4),
      // "expected_revenue": expectedMonthRevenue,
      // "expected_cashflow": expectedMonthRevenue - expectedMonthExpense,
    });
    if (currentMonth === "January") {
      currentMonth = "December";
      currentYear = (parseInt(currentYear) - 1).toString();
      // console.log(currentYear)
    } else {
      currentMonth = months[months.indexOf(currentMonth) - 1];
    }
  }
  // console.log("Past 12 months: ", pastTwelveMonths);

  pastTwelveMonths.reverse();

  return pastTwelveMonths;
}

function getNext12MonthsCashflow(data, month, year) {
  var nextTwelveMonths = [];
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var currentMonth = month;
  var currentYear = year;

  // create a loop that goes forward 12 months and if

  for (var i = 0; i < 12; i++) {
    let expectedMonthRevenue = getTotalExpectedRevenueByMonthYear(data, currentMonth, currentYear);
    let expectedMonthExpense = getTotalExpectedExpenseByMonthYear(data, currentMonth, currentYear);

    // console.log("expectedMonthRevenue", expectedMonthRevenue)
    // console.log("expectedMonthExpense", expectedMonthExpense)

    nextTwelveMonths.push({
      month: currentMonth,
      year: currentYear,
      revenue: expectedMonthRevenue,
      cashflow: expectedMonthRevenue - expectedMonthExpense,
      monthYear: currentMonth.slice(0, 3) + " " + currentYear.slice(2, 4),
      // "expected_revenue": expectedMonthRevenue,
      // "expected_cashflow": expectedMonthRevenue - expectedMonthExpense,
    });

    if (currentMonth === "December") {
      currentMonth = "January";
      currentYear = (parseInt(currentYear) + 1).toString();
    } else {
      currentMonth = months[months.indexOf(currentMonth) + 1];
    }
  }
  // console.log(nextTwelveMonths)
  return nextTwelveMonths;
}

function getPast12MonthsExpectedCashflow(data, month, year) {
  // console.log("In getPast12MonthsExpectedCashflow: ", data, month, year);
  var pastTwelveMonths = [];
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var currentMonth = month;
  var currentYear = year;

  // create a loop that goes back 12 months
  for (var i = 0; i < 12; i++) {
    // console.log(currentMonth, currentYear)

    let expectedMonthRevenue = getTotalExpectedRevenueByMonthYear(data, currentMonth, currentYear);
    let expectedMonthExpense = getTotalExpectedExpenseByMonthYear(data, currentMonth, currentYear);
    let currentMonthRevenue = getTotalRevenueByMonthYear(data, currentMonth, currentYear);
    let currentMonthExpense = getTotalExpenseByMonthYear(data, currentMonth, currentYear);

    // console.log("expectedMonthRevenue", expectedMonthRevenue);
    // console.log("expectedMonthExpense", expectedMonthExpense);
    // console.log("currentMonthRevenue", currentMonthRevenue);
    // console.log("currentMonthExpense", currentMonthExpense);

    pastTwelveMonths.push({
      month: currentMonth,
      year: currentYear,
      expected_cashflow: expectedMonthRevenue - expectedMonthExpense,
      cashflow: currentMonthRevenue - currentMonthExpense,

      expected_revenue: expectedMonthRevenue,
      revenue: currentMonthRevenue,
      expected_expense: expectedMonthExpense,
      expense: currentMonthExpense,

      monthYear: currentMonth.slice(0, 3) + " " + currentYear.slice(2, 4),
      // "expected_revenue": expectedMonthRevenue,
      // "expected_cashflow": expectedMonthRevenue - expectedMonthExpense,
    });
    if (currentMonth === "January") {
      currentMonth = "December";
      currentYear = (parseInt(currentYear) - 1).toString();
      // console.log(currentYear)
    } else {
      currentMonth = months[months.indexOf(currentMonth) - 1];
    }
  }
  // console.log("Past 12 months: ", pastTwelveMonths);

  pastTwelveMonths.reverse();

  return pastTwelveMonths;
}

function getRevenueByMonth(data) {
  // console.log("revenue by month", data);
}

function getExpenseByMonth(data) {
  // console.log("expense by month", data);
}

function revenueCashflowByMonth(data) {
  // console.log("revenueCashflowByMonth", data);
}

function getExpectedRevenueByType(data, month, year) {
  let revenueItems = data.response_revenue_by_month.result.filter((item) => item.cf_month === month && item.cf_year === year);
  return revenueItems;
}

function getTotalRevenueByType(data, month, year, expected) {
  // console.log(data, month, year)

  var key = "total_paid";

  if (expected === true) {
    key = "pur_amount_due";
  } else {
    key = "total_paid";
  }

  let revenueItems = data?.result?.filter((item) => item.cf_month === month && item.cf_year === year);
  let totalRent = revenueItems?.reduce((acc, revenue) => {
    if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "RENT") {
      // console.log("revenue", revenue[key])
      // console.log("acc", acc)
      return acc + parseFloat(revenue[key]);
    }
    return acc;
  }, 0.0);
  let totalDeposits = revenueItems?.reduce((acc, revenue) => {
    if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "DEPOSITS") {
      return acc + parseFloat(revenue[key]);
    }
    return acc;
  }, 0.0);
  let totalExtraCharges = revenueItems?.reduce((acc, revenue) => {
    if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "EXTRA CHARGES") {
      return acc + parseFloat(revenue[key]);
    }
    return acc;
  }, 0.0);
  let totalUtilities = revenueItems?.reduce((acc, revenue) => {
    if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "UTILITIES") {
      return acc + parseFloat(revenue[key]);
    }
    return acc;
  }, 0.0);
  let totalLateFee = revenueItems?.reduce((acc, revenue) => {
    if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "LATE FEE") {
      return acc + parseFloat(revenue[key]);
    }
    return acc;
  }, 0.0);
  let totalMaintenance = revenueItems?.reduce((acc, revenue) => {
    if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "MAINTENANCE") {
      return acc + parseFloat(revenue[key]);
    }
    return acc;
  }, 0.0);
  let totalRepairs = revenueItems?.reduce((acc, revenue) => {
    if (revenue[key] !== null && revenue.purchase_type.toUpperCase() === "REPAIRS") {
      return acc + parseFloat(revenue[key]);
    }
    return acc;
  }, 0.0);

  return {
    RENT: totalRent,
    DEPOSITS: totalDeposits,
    "EXTRA CHARGES": totalExtraCharges,
    UTILITY: totalUtilities,
    "LATE FEE": totalLateFee,
    MAINTENANCE: totalMaintenance,
    REPAIRS: totalRepairs,
  };
}

function getTotalExpenseByType(data, month, year, expected) {
  // console.log(data, month, year)

  var key = "total_paid";

  if (expected === true) {
    key = "pur_amount_due";
  } else {
    key = "total_paid";
  }

  let expenseItems = data?.result?.filter((item) => item.cf_month === month && item.cf_year === year);

  let totalMaintenance = expenseItems?.reduce((acc, expense) => {
    if (expense[key] !== null && expense.purchase_type.toUpperCase() === "MAINTENANCE") {
      return acc + parseFloat(expense[key]);
    }
    return acc;
  }, 0.0);

  let totalRepairs = expenseItems?.reduce((acc, expense) => {
    if (expense[key] !== null && expense.purchase_type.toUpperCase() === "REPAIRS") {
      return acc + parseFloat(expense[key]);
    }
    return acc;
  }, 0.0);

  let totalMortgage = expenseItems?.reduce((acc, expense) => {
    if (expense[key] !== null && expense.purchase_type.toUpperCase() === "MORTGAGE") {
      return acc + parseFloat(expense[key]);
    }
    return acc;
  }, 0.0);

  let totalTaxes = expenseItems?.reduce((acc, expense) => {
    if (expense[key] !== null && expense.purchase_type.toUpperCase() === "TAXES") {
      return acc + parseFloat(expense[key]);
    }
    return acc;
  }, 0.0);

  let totalInsurance = expenseItems?.reduce((acc, expense) => {
    if (expense[key] !== null && expense.purchase_type.toUpperCase() === "INSURANCE") {
      return acc + parseFloat(expense[key]);
    }
    return acc;
  }, 0.0);

  let totalUtilities = expenseItems?.reduce((acc, expense) => {
    if (expense[key] !== null && expense.purchase_type.toUpperCase() === "UTILITIES") {
      return acc + parseFloat(expense[key]);
    }
    return acc;
  }, 0.0);

  let totalManagement = expenseItems?.reduce((acc, expense) => {
    if (expense[key] !== null && expense.purchase_type.toUpperCase() === "MANAGEMENT") {
      return acc + parseFloat(expense[key]);
    }
    return acc;
  }, 0.0);

  let totalBillPosting = expenseItems?.reduce((acc, expense) => {
    if (expense[key] !== null && expense.purchase_type.toUpperCase() === "BILL POSTING") {
      return acc + parseFloat(expense[key]);
    }
    return acc;
  }, 0.0);

  return {
    MAINTENANCE: totalMaintenance,
    REPAIRS: totalRepairs,
    MORTGAGE: totalMortgage,
    TAXES: totalTaxes,
    INSURANCE: totalInsurance,
    UTILITIES: totalUtilities,
    MANAGEMENT: totalManagement,
    "BILL POSTING": totalBillPosting,
  };
}

function getTotalRevenueByMonthYear(data, month, year) {
  // console.log("In getTotalRevenueByMonthYear: ", data, month, year);
  let revenueItems = data?.result?.filter((item) => item.cf_month === month && item.cf_year === year && item.pur_cf_type === "revenue");
  // console.log("After filter revenueItems: ", revenueItems);
  let totalRevenue = revenueItems?.reduce((acc, item) => {
    return acc + parseFloat(item["total_paid"] ? item["total_paid"] : 0.0);
  }, 0.0);
  // console.log("Cashflow Fetch Data total Revenue: ", totalRevenue);
  return totalRevenue;
}

function getTotalExpenseByMonthYear(data, month, year) {
  let expenseItems = data?.result?.filter((item) => item.cf_month === month && item.cf_year === year && item.pur_cf_type === "expense");
  let totalExpense = expenseItems?.reduce((acc, item) => {
    return acc + parseFloat(item["total_paid"] ? item["total_paid"] : 0.0);
  }, 0.0);
  return totalExpense;
}

function getTotalExpectedRevenueByMonthYear(data, month, year) {
  // console.log("In getTotalExpectedRevenueByMonthYear: ", data, month, year);
  let revenueItems = data?.result?.filter((item) => item.cf_month === month && item.cf_year === year && item.pur_cf_type === "revenue");
  let totalRevenue = revenueItems?.reduce((acc, item) => {
    return acc + parseFloat(item["pur_amount_due"] ? item["pur_amount_due"] : 0.0);
  }, 0.0);
  return totalRevenue;
}

function getTotalExpectedExpenseByMonthYear(data, month, year) {
  // console.log(data)
  let expenseItems = data?.result?.filter((item) => item.cf_month === month && item.cf_year === year && item.pur_cf_type === "expense");
  let totalExpense = expenseItems?.reduce((acc, item) => {
    return acc + parseFloat(item["pur_amount_due"] ? item["pur_amount_due"] : 0.0);
  }, 0.0);
  return totalExpense;
}

export {
  getTotalRevenueByType,
  getTotalExpenseByType,
  getPast12MonthsCashflow,
  getPast12MonthsExpectedCashflow,
  revenueCashflowByMonth,
  getRevenueList,
  getExpenseList,
  fetchCashflow2,
  getTotalRevenueByMonthYear,
  getTotalExpenseByMonthYear,
  getRevenueByMonth,
  getExpenseByMonth,
  getTotalExpectedRevenueByMonthYear,
  getTotalExpectedExpenseByMonthYear,
  getNext12MonthsCashflow,
};
