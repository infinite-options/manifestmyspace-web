import React, { Component, useEffect, useState } from "react";
import axios from "axios";
const CashflowData = (props) => {
  // console.log("props", props);
  const role = props.role;
  const userID = props.userID;
  const year = props.year;
  const month = props.month;

  const fetchCashflow = async () => {
    // console.log("props fetchCashflow", props);
    // if (access_token === null || user.role.indexOf("OWNER") === -1) {
    //   navigate("/");
    //   return;
    // }
    const cashflow = await axios.get("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/cashflowByOwner/110-000003/TTM");
    console.log("props cashflowResponse", cashflow);
    props.setTotalRevenueByMonth && getRevenueByMonth(cashflow.data.response_revenue_by_month.result);
    props.setTotalExpenseByMonth && getExpenseByMonth(cashflow.data.response_expense_by_month.result);
    props.setTotalRevenueByType && getRevenueByType(cashflow.data.response_revenue_by_month_by_type.result);
    props.setTotalExpenseByType && getExpenseByType(cashflow.data.response_expense_by_month_by_type.result);
    props.setRevenueList && getRevenueList(cashflow.data.response_revenue.result);
    props.setExpenseList && getExpenseList(cashflow.data.response_expense.result);
    props.setRevenueCashflowByMonth && getPast12MonthsCashflow(cashflow.data.response_revenue_by_month.result, cashflow.data.response_expense_by_month.result);
  };

  const getRevenueList = (revenue) => {
    const revenueList = revenue.filter((rev) => rev.cf_month === props.month && rev.cf_year === props.year);
    props.setRevenueList(revenueList);
  };

  const getExpenseList = (expense) => {
    const expenseList = expense.filter((exp) => exp.cf_month === props.month && exp.cf_year === props.year);
    props.setExpenseList(expenseList);
  };
  const getPast12MonthsCashflow = (revenueByMonth, expenseByMonth) => {
    let revenueCashflowByMonth = [];

    let date = new Date();

    for (let i = 0; i < 12; i++) {
      let currentMonth = date.toLocaleString("default", { month: "long" });
      let currentYear = date.getFullYear().toString();
      // console.log("month", currentMonth, currentYear);

      // revenue for past 12 months
      let paidRevenueByMonth = 0;
      let expectedRevenueByMonth = 0;
      revenueByMonth.forEach((revenue) => {
        if (revenue.cf_month === currentMonth && revenue.cf_year === currentYear) {
          if (revenue["sum(total_paid)"] !== null) {
            // console.log("paidRevenueByMonth ", revenue);
            paidRevenueByMonth = paidRevenueByMonth + Number(revenue["sum(total_paid)"]);
          }
          if (revenue["sum(pur_amount_due)"] !== null) {
            // console.log("expectedRevenueByMonth ", revenue);
            expectedRevenueByMonth = expectedRevenueByMonth + Number(revenue["sum(pur_amount_due)"]);
          }
        }
        // console.log("revenueCashflowByMonth ",currentMonth,paidRevenueByMonth)
      });

      // expense for past 12 months
      let paidExpenseByMonth = 0;
      let expectedExpenseByMonth = 0;
      expenseByMonth.forEach((expense) => {
        if (expense.cf_month === currentMonth && expense.cf_year === currentYear) {
          if (expense["sum(total_paid)"] !== null) {
            // console.log("paidExpenseByMonth ", expense);
            paidExpenseByMonth = paidExpenseByMonth + Number(expense["sum(total_paid)"]);
          }
          if (expense["sum(pur_amount_due)"] !== null) {
            // console.log("expectedExpenseByMonth ", expense);
            expectedExpenseByMonth = expectedExpenseByMonth + Number(expense["sum(pur_amount_due)"]);
          }
        }
      });
      revenueCashflowByMonth.unshift({
        monthYear: currentMonth.substring(0, 3) + currentYear,
        revenue: paidRevenueByMonth.toFixed(2),
        expectedRevenue: expectedRevenueByMonth.toFixed(2),
        expense: paidExpenseByMonth.toFixed(2),
        expectedExpense: expectedExpenseByMonth.toFixed(2),
        cashflow: (paidRevenueByMonth - paidExpenseByMonth).toFixed(2),
        expectedCashflow: (expectedRevenueByMonth - expectedExpenseByMonth).toFixed(2),
      });
      date = new Date(date.setMonth(date.getMonth() - 1));
    }
    // console.log("monthly revenue ", revenueCashflowByMonth);
    revenueCashflowByMonth && props.setRevenueCashflowByMonth(revenueCashflowByMonth);
  };
  const getRevenueByMonth = (revenueByMonth) => {
    let paidRevenueByMonth = 0;
    let expectedRevenueByMonth = 0;
    revenueByMonth.forEach((revenue) => {
      if (revenue.cf_month === props.month && revenue.cf_year === props.year) {
        if (revenue["sum(total_paid)"] !== null) {
          // console.log("paidRevenueByMonth ", revenue);
          paidRevenueByMonth = paidRevenueByMonth + Number(revenue["sum(total_paid)"]);
        }
        if (revenue["sum(pur_amount_due)"] !== null) {
          // console.log("expectedRevenueByMonth ", revenue);
          expectedRevenueByMonth = expectedRevenueByMonth + Number(revenue["sum(pur_amount_due)"]);
        }
      }
    });
    props.setTotalRevenueByMonth && paidRevenueByMonth && props.setTotalRevenueByMonth(paidRevenueByMonth);
    props.setExpectedRevenueByMonth && expectedRevenueByMonth && props.setExpectedRevenueByMonth(expectedRevenueByMonth);
  };

  const getExpenseByMonth = (expenseByMonth) => {
    let paidExpenseByMonth = 0;
    let expectedExpenseByMonth = 0;
    expenseByMonth.forEach((expense) => {
      if (expense.cf_month === props.month && expense.cf_year === props.year) {
        if (expense["sum(total_paid)"] !== null) {
          // console.log("paidExpenseByMonth ", expense);
          paidExpenseByMonth = paidExpenseByMonth + Number(expense["sum(total_paid)"]);
        }
        if (expense["sum(pur_amount_due)"] !== null) {
          // console.log("expectedExpenseByMonth ", expense);
          expectedExpenseByMonth = expectedExpenseByMonth + Number(expense["sum(pur_amount_due)"]);
        }
      }
    });

    props.setTotalExpenseByMonth && paidExpenseByMonth && props.setTotalExpenseByMonth(paidExpenseByMonth);
    props.setExpectedExpenseByMonth && expectedExpenseByMonth && props.setExpectedExpenseByMonth(expectedExpenseByMonth);
  };

  const getRevenueByType = (revenueByType) => {
    let paidRevenueByType = {};
    let expectedRevenueByType = {};

    let totalRent = 0;
    let totalDeposits = 0;
    let totalExtraCharges = 0;
    let totalUtilities = 0;
    let totalLateFee = 0;
    let totalMaintenance = 0;
    let totalRepairs = 0;

    let expectedRent = 0;
    let expectedDeposits = 0;
    let expectedExtraCharges = 0;
    let expectedUtilities = 0;
    let expectedLateFee = 0;
    let expectedMaintenance = 0;
    let expectedRepairs = 0;
    revenueByType.forEach((revenue) => {
      if (revenue.cf_month === props.month && revenue.cf_year === props.year) {
        if (revenue["sum(total_paid)"] !== null) {
          if (revenue.purchase_type === "RENT") {
            totalRent = totalRent + Number(revenue["sum(total_paid)"]);
          } else if (revenue.purchase_type === "EXTRA CHARGES") {
            totalExtraCharges = totalExtraCharges + Number(revenue["sum(total_paid)"]);
          } else if (revenue.purchase_type === "UTILITY") {
            totalUtilities = totalUtilities + Number(revenue["sum(total_paid)"]);
          } else if (revenue.purchase_type === "LATE FEE") {
            totalLateFee = totalLateFee + Number(revenue["sum(total_paid)"]);
          } else if (revenue.purchase_type === "MAINTENANCE") {
            totalMaintenance = totalMaintenance + Number(revenue["sum(total_paid)"]);
          } else if (revenue.purchase_type === "REPAIRS") {
            totalRepairs = totalRepairs + Number(revenue["sum(total_paid)"]);
          }
        }
        if (revenue["sum(pur_amount_due)"] !== null) {
          if (revenue.purchase_type === "RENT") {
            expectedRent = expectedRent + Number(revenue["sum(pur_amount_due)"]);
          } else if (revenue.purchase_type === "EXTRA CHARGES") {
            expectedExtraCharges = expectedExtraCharges + Number(revenue["sum(pur_amount_due)"]);
          } else if (revenue.purchase_type === "UTILITY") {
            expectedUtilities = expectedUtilities + Number(revenue["sum(pur_amount_due)"]);
          } else if (revenue.purchase_type === "LATE FEE") {
            expectedLateFee = expectedLateFee + Number(revenue["sum(pur_amount_due)"]);
          } else if (revenue.purchase_type === "MAINTENANCE") {
            expectedMaintenance = expectedMaintenance + Number(revenue["sum(pur_amount_due)"]);
          } else if (revenue.purchase_type === "REPAIRS") {
            expectedRepairs = expectedRepairs + Number(revenue["sum(pur_amount_due)"]);
          }
        }
      }
    });
    paidRevenueByType = {
      totalRent: totalRent,
      totalDeposits: totalDeposits,
      totalExtraCharges: totalExtraCharges,
      totalUtilities: totalUtilities,
      totalLateFee: totalLateFee,
      totalMaintenance: totalMaintenance,
      totalRepairs: totalRepairs,
    };

    expectedRevenueByType = {
      expectedRent: expectedRent,
      expectedDeposits: expectedDeposits,
      expectedExtraCharges: expectedExtraCharges,
      expectedUtilities: expectedUtilities,
      expectedLateFee: expectedLateFee,
      expectedMaintenance: expectedMaintenance,
      expectedRepairs: expectedRepairs,
    };
    paidRevenueByType && props.setTotalRevenueByType(paidRevenueByType);
    expectedRevenueByType && props.setExpectedRevenueByType(expectedRevenueByType);
  };

  const getExpenseByType = (expenseByType) => {
    let paidExpenseByType = {};
    let expectedExpenseByType = {};

    let totalMaintenance = 0;
    let totalRepairs = 0;
    let totalMortgage = 0;
    let totalTaxes = 0;
    let totalInsurance = 0;
    let totalUtilities = 0;
    let totalManagement = 0;
    let totalManagementRent = 0;
    let totalManagementExtraCharges = 0;
    let totalManagementLateFee = 0;

    let expectedMaintenance = 0;
    let expectedRepairs = 0;
    let expectedMortgage = 0;
    let expectedTaxes = 0;
    let expectedInsurance = 0;
    let expectedUtilities = 0;
    let expectedManagement = 0;
    let expectedManagementRent = 0;
    let expectedManagementExtraCharges = 0;
    let expectedManagementLateFee = 0;
    expenseByType.forEach((expense) => {
      if (expense.cf_month === props.month && expense.cf_year === props.year) {
        if (expense["sum(total_paid)"] !== null) {
          if (expense.purchase_type === "MAINTENANCE") {
            totalMaintenance = totalMaintenance + Number(expense["sum(total_paid)"]);
          } else if (expense.purchase_type === "REPAIRS") {
            totalRepairs = totalRepairs + Number(expense["sum(total_paid)"]);
          } else if (expense.purchase_type === "MORTGAGE") {
            totalMortgage = totalMortgage + Number(expense["sum(total_paid)"]);
          } else if (expense.purchase_type === "TAXES") {
            totalTaxes = totalTaxes + Number(expense["sum(total_paid)"]);
          } else if (expense.purchase_type === "INSURANCE") {
            totalInsurance = totalInsurance + Number(expense["sum(total_paid)"]);
          } else if (expense.purchase_type === "UTILITY") {
            totalUtilities = totalUtilities + Number(expense["sum(total_paid)"]);
          }
          // else if (expense.purchase_type === 'OWNER PAYMENT RENT' || expense.purchase_type === 'OWNER PAYMENT LATE FEE' || expense.purchase_type === 'OWNER PAYMENT EXTRA CHARGES') {
          //     totalManagement = totalManagement + expense['sum(total_paid)'];
          // }
          else if (expense.purchase_type.includes("OWNER PAYMENT")) {
            totalManagement = totalManagement + Number(expense["sum(total_paid)"]);
          }
          // else if (expense.purchase_type === 'OWNER PAYMENT MANAGEMENT RENT') {
          //     totalManagementRent = totalManagementRent + expense['sum(total_paid)'];
          // }
          // else if (expense.purchase_type === 'OWNER PAYMENT MANAGEMENT EXTRA CHARGES') {
          //     totalManagementExtraCharges = totalManagementExtraCharges + expense['sum(total_paid)'];
          // }
          // else if (expense.purchase_type === 'OWNER PAYMENT MANAGEMENT LATE FEE') {
          //     totalManagementLateFee = totalManagementLateFee + expense['sum(total_paid)'];
          // }
        }
        if (expense["sum(pur_amount_due)"] !== null) {
          if (expense.purchase_type === "MAINTENANCE") {
            expectedMaintenance = expectedMaintenance + Number(expense["sum(pur_amount_due)"]);
          } else if (expense.purchase_type === "REPAIRS") {
            expectedRepairs = expectedRepairs + Number(expense["sum(pur_amount_due)"]);
          } else if (expense.purchase_type === "MORTGAGE") {
            expectedMortgage = expectedMortgage + Number(expense["sum(pur_amount_due)"]);
          } else if (expense.purchase_type === "TAXES") {
            expectedTaxes = expectedTaxes + Number(expense["sum(pur_amount_due)"]);
          } else if (expense.purchase_type === "INSURANCE") {
            expectedInsurance = expectedInsurance + Number(expense["sum(pur_amount_due)"]);
          } else if (expense.purchase_type === "UTILITY") {
            expectedUtilities = expectedUtilities + Number(expense["sum(pur_amount_due)"]);
          } else if (expense.purchase_type.includes("OWNER PAYMENT")) {
            expectedManagement = expectedManagement + Number(expense["sum(pur_amount_due)"]);
          }
          // else if (expense.purchase_type === 'MANAGEMENT') {
          //     expectedManagement = expectedManagement + expense['sum(pur_amount_due)'];
          // }
          // else if (expense.purchase_type === 'MANAGEMENT RENT') {
          //     expectedManagementRent = expectedManagementRent + expense['sum(pur_amount_due)'];
          // }
          // else if (expense.purchase_type === 'MANAGEMENT EXTRA CHARGES') {
          //     expectedManagementExtraCharges = expectedManagementExtraCharges + expense['sum(pur_amount_due)'];
          // }
          // else if (expense.purchase_type === 'MANAGEMENT LATE FEE') {
          //     expectedManagementLateFee = expectedManagementLateFee + expense['sum(pur_amount_due)'];
          // }
        }
      }
    });
    paidExpenseByType = {
      totalMaintenance: totalMaintenance,
      totalRepairs: totalRepairs,
      totalMortgage: totalMortgage,
      totalTaxes: totalTaxes,
      totalInsurance: totalInsurance,
      totalUtilities: totalUtilities,
      totalManagement: totalManagement,
      // "totalManagementRent" : totalManagementRent,
      // "totalManagementExtraCharges" : totalManagementExtraCharges,
      // "totalManagementLateFee" : totalManagementLateFee
    };

    expectedExpenseByType = {
      expectedMaintenance: expectedMaintenance,
      expectedRepairs: expectedRepairs,
      expectedMortgage: expectedMortgage,
      expectedTaxes: expectedTaxes,
      expectedInsurance: expectedInsurance,
      expectedUtilities: expectedUtilities,
      expectedManagement: expectedManagement,
      // "expectedManagementRent" : expectedManagementRent,
      // "expectedManagementExtraCharges" : expectedManagementExtraCharges,
      // "expectedManagementLateFee" : expectedManagementLateFee
    };
    paidExpenseByType && props.setTotalExpenseByType(paidExpenseByType);
    expectedExpenseByType && props.setExpectedExpenseByType(expectedExpenseByType);
  };

  useEffect(() => {
    console.log("props useEffect", role);
    if (role === "Owner") {
      fetchCashflow();
    } else if (role === "Property Manager") {
    }
  }, [year, month, role]);
  return <></>;
};
export default CashflowData;
