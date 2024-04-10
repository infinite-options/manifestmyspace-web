import React, { Component, useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import APIConfig from "../../utils/APIConfig";

const CashflowData = (props) => {
// console.log("props", props);
const role = props.role;
const userID = props.userID;
const year = props.year;
const month = props.month;
const selectedProperty = props.selectedProperty;
const setShowSpinner = props.setShowSpinner;
const { getProfileId } = useUser();

const fetchCashflow = async () => {
    setShowSpinner(true);
    const cashflow = await axios.get(`${APIConfig.baseURL.dev}/cashflow/${getProfileId()}/TTM`);
    console.log("cashflowByOwner api response data", cashflow.data);
    if (props.setTotalRevenueByMonth) { 
    props.setTotalRevenueByMonth(0); 
    getRevenueByMonth(cashflow.data.response_revenue_by_month.result); 
    }
    if (props.setTotalExpenseByMonth) { 
    props.setTotalExpenseByMonth(0); 
    getExpenseByMonth(cashflow.data.response_expense_by_month.result); 
    }
    props.setTotalRevenueByType && getRevenueByType(cashflow.data.response_revenue_by_month_by_type.result);
    props.setTotalExpenseByType && getExpenseByType(cashflow.data.response_expense_by_month_by_type.result);
    props.setRevenueList && getRevenueList(cashflow.data.response_revenue.result);
    props.setExpenseList && getExpenseList(cashflow.data.response_expense.result);
    props.setRevenueCashflowByMonth && getPast12MonthsCashflow(cashflow.data.response_revenue_by_month.result, cashflow.data.response_expense_by_month.result);
    setShowSpinner(false);
};

const getRevenueList = (revenue) => {
    const revenueList = revenue.filter((rev) => {
    if (selectedProperty && selectedProperty.property_address && selectedProperty.property_unit) {
        return (
            rev.cf_month === props.month &&
            rev.cf_year === props.year &&
            rev.property_address === selectedProperty.property_address &&
            rev.property_unit === selectedProperty.property_unit
        );
    } else {
        return rev.cf_month === props.month && rev.cf_year === props.year;
    }
    });
    props.setRevenueList(revenueList);
};

const getExpenseList = (expense) => { 
    const expenseList = expense.filter((exp) => {
    if (selectedProperty && selectedProperty.property_address && selectedProperty.property_unit) {
        return (
            exp.cf_month === props.month &&
            exp.cf_year === props.year &&
            exp.property_address === selectedProperty.property_address &&
            exp.property_unit === selectedProperty.property_unit
        );
    } else {
        return exp.cf_month === props.month && exp.cf_year === props.year;
    }
    });
    props.setExpenseList(expenseList);
};
const getPast12MonthsCashflow = (revenueByMonth, expenseByMonth) => {
    let revenueCashflowByMonth = [];

    let date = new Date();

    for (let i = 0; i < 12; i++) {
    let currentMonth = date.toLocaleString("default", { month: "long" });
    let currentYear = date.getFullYear().toString();
    let paidRevenueByMonth = 0;
    let expectedRevenueByMonth = 0;
    revenueByMonth.forEach((revenue) => {
        if (revenue.cf_month === currentMonth && revenue.cf_year === currentYear) {
        if (
            !selectedProperty ||
            (!selectedProperty.property_address || !selectedProperty.property_unit) ||
            (revenue.property_address === selectedProperty.property_address &&
                revenue.property_unit === selectedProperty.property_unit)
        ){
        if (revenue["sum(total_paid)"] !== null) {
            paidRevenueByMonth = paidRevenueByMonth + Number(revenue["sum(total_paid)"]);
        }
        if (revenue["sum(pur_amount_due)"] !== null) {
            expectedRevenueByMonth = expectedRevenueByMonth + Number(revenue["sum(pur_amount_due)"]);
        }
        }
        }
    });

    // expense for past 12 months
    let paidExpenseByMonth = 0;
    let expectedExpenseByMonth = 0;
    expenseByMonth.forEach((expense) => {
        if (expense.cf_month === currentMonth && expense.cf_year === currentYear) {
        if (
            !selectedProperty ||
            (!selectedProperty.property_address || !selectedProperty.property_unit) ||
            (expense.property_address === selectedProperty.property_address &&
                expense.property_unit === selectedProperty.property_unit)
        ){
        if (expense["sum(total_paid)"] !== null) {
            // console.log("paidExpenseByMonth ", expense);
            paidExpenseByMonth = paidExpenseByMonth + Number(expense["sum(total_paid)"]);
        }
        if (expense["sum(pur_amount_due)"] !== null) {
            // console.log("expectedExpenseByMonth ", expense);
            expectedExpenseByMonth = expectedExpenseByMonth + Number(expense["sum(pur_amount_due)"]);
        }
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

    const paidRevenueByMonth = revenueByMonth.reduce((total, revenue) => {
        if (revenue.cf_month === props.month && revenue.cf_year === props.year) {
            if (
                !selectedProperty ||
                (!selectedProperty.property_address || !selectedProperty.property_unit) ||
                (revenue.property_address === selectedProperty.property_address &&
                    revenue.property_unit === selectedProperty.property_unit)
            ) {
                if (revenue["sum(total_paid)"] !== null) {
                    return total + Number(revenue["sum(total_paid)"]);
                }
            }
        }
        return total;
    }, 0);

    const expectedRevenueByMonth = revenueByMonth.reduce((total, revenue) => {
        if (revenue.cf_month === props.month && revenue.cf_year === props.year) {
            if (
                !selectedProperty ||
                (!selectedProperty.property_address || !selectedProperty.property_unit) ||
                (revenue.property_address === selectedProperty.property_address &&
                    revenue.property_unit === selectedProperty.property_unit)
            ) {
                if (revenue["sum(pur_amount_due)"] !== null) {
                    return total + Number(revenue["sum(pur_amount_due)"]);
                }
            }
        }
        return total;
    }, 0);
    props.setTotalRevenueByMonth && paidRevenueByMonth && props.setTotalRevenueByMonth(paidRevenueByMonth);
    props.setExpectedRevenueByMonth && expectedRevenueByMonth && props.setExpectedRevenueByMonth(expectedRevenueByMonth);
};

const getExpenseByMonth = (expenseByMonth) => {
    const paidExpenseByMonth = expenseByMonth.reduce((total, expense) => {
        if (expense.cf_month === props.month && expense.cf_year === props.year) {
            if (
                !selectedProperty ||
                (!selectedProperty.property_address || !selectedProperty.property_unit) ||
                (expense.property_address === selectedProperty.property_address &&
                    expense.property_unit === selectedProperty.property_unit)
            ) {
                if (expense["sum(total_paid)"] !== null) {
                    return total + Number(expense["sum(total_paid)"]);
                }
            }
        }
        return total;
    }, 0);

    const expectedExpenseByMonth = expenseByMonth.reduce((total, expense) => {
        if (expense.cf_month === props.month && expense.cf_year === props.year) {
            if (
                !selectedProperty ||
                (!selectedProperty.property_address || !selectedProperty.property_unit) ||
                (expense.property_address === selectedProperty.property_address &&
                    expense.property_unit === selectedProperty.property_unit)
            ) {
                if (expense["sum(pur_amount_due)"] !== null) {
                    return total + Number(expense["sum(pur_amount_due)"]);
                }
            }
        }
        return total;
    }, 0);

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
        if (
            !selectedProperty ||
            (!selectedProperty.property_address || !selectedProperty.property_unit) ||
            (revenue.property_address === selectedProperty.property_address &&
                revenue.property_unit === selectedProperty.property_unit)
        ) {
        if (revenue["sum(total_paid)"] !== null) {
            if (revenue.purchase_type.toUpperCase() === "RENT") {
            totalRent = totalRent + Number(revenue["sum(total_paid)"]);
            } else if (revenue.purchase_type.toUpperCase() === "EXTRA CHARGES") {
            totalExtraCharges = totalExtraCharges + Number(revenue["sum(total_paid)"]);
            } else if (revenue.purchase_type.toUpperCase() === "UTILITY") {
            totalUtilities = totalUtilities + Number(revenue["sum(total_paid)"]);
            } else if (revenue.purchase_type.toUpperCase() === "LATE FEE") {
            totalLateFee = totalLateFee + Number(revenue["sum(total_paid)"]);
            } else if (revenue.purchase_type.toUpperCase() === "MAINTENANCE") {
            totalMaintenance = totalMaintenance + Number(revenue["sum(total_paid)"]);
            } else if (revenue.purchase_type.toUpperCase() === "REPAIRS") {
            totalRepairs = totalRepairs + Number(revenue["sum(total_paid)"]);
            }
        }
        if (revenue["sum(pur_amount_due)"] !== null) {
            if (revenue.purchase_type.toUpperCase() === "RENT") {
            expectedRent = expectedRent + Number(revenue["sum(pur_amount_due)"]);
            } else if (revenue.purchase_type.toUpperCase() === "EXTRA CHARGES") {
            expectedExtraCharges = expectedExtraCharges + Number(revenue["sum(pur_amount_due)"]);
            } else if (revenue.purchase_type.toUpperCase() === "UTILITY") {
            expectedUtilities = expectedUtilities + Number(revenue["sum(pur_amount_due)"]);
            } else if (revenue.purchase_type.toUpperCase() === "LATE FEE") {
            expectedLateFee = expectedLateFee + Number(revenue["sum(pur_amount_due)"]);
            } else if (revenue.purchase_type.toUpperCase() === "MAINTENANCE") {
            expectedMaintenance = expectedMaintenance + Number(revenue["sum(pur_amount_due)"]);
            } else if (revenue.purchase_type.toUpperCase() === "REPAIRS") {
            expectedRepairs = expectedRepairs + Number(revenue["sum(pur_amount_due)"]);
            }
        }
    }
    }
    });
    paidRevenueByType = {
        "RENT": totalRent,
        "DEPOSITS": totalDeposits,
        "EXTRA CHARGES": totalExtraCharges,
        "UTILITY": totalUtilities,
        "LATE FEE": totalLateFee,
        "MAINTENANCE": totalMaintenance,
        "REPAIRS": totalRepairs,
    };

    expectedRevenueByType = {
        "RENT": expectedRent,
        "DEPOSITS": expectedDeposits,
        "EXTRA CHARGES": expectedExtraCharges,
        "UTILITY": expectedUtilities,
        "LATE FEE": expectedLateFee,
        "MAINTENANCE": expectedMaintenance,
        "REPAIRS": expectedRepairs,
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
    let totalBillPosting = 0;
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
    let expectedBillPosting = 0;
    let expectedManagementRent = 0;
    let expectedManagementExtraCharges = 0;
    let expectedManagementLateFee = 0;
    // console.log("expense from Cashflow Data", expenseByType)
    expenseByType.forEach((expense) => {
    if (expense.cf_month === props.month && expense.cf_year === props.year) {
        if (
            !selectedProperty ||
            (!selectedProperty.property_address || !selectedProperty.property_unit) ||
            (expense.property_address === selectedProperty.property_address &&
                expense.property_unit === selectedProperty.property_unit)
        ) {
        if (expense["sum(total_paid)"] !== null) {
            if (expense.purchase_type.toUpperCase() === "MAINTENANCE") {
            totalMaintenance = totalMaintenance + Number(expense["sum(total_paid)"]);
            } else if (expense.purchase_type.toUpperCase() === "REPAIRS") {
            totalRepairs = totalRepairs + Number(expense["sum(total_paid)"]);
            } else if (expense.purchase_type.toUpperCase() === "MORTGAGE") {
            totalMortgage = totalMortgage + Number(expense["sum(total_paid)"]);
            } else if (expense.purchase_type.toUpperCase() === "TAXES") {
            totalTaxes = totalTaxes + Number(expense["sum(total_paid)"]);
            } else if (expense.purchase_type.toUpperCase() === "INSURANCE") {
            totalInsurance = totalInsurance + Number(expense["sum(total_paid)"]);
            } else if (expense.purchase_type.toUpperCase() === "UTILITY") {
            totalUtilities = totalUtilities + Number(expense["sum(total_paid)"]);
            } else if (expense.purchase_type.includes("OWNER PAYMENT")) {
            totalManagement = totalManagement + Number(expense["sum(total_paid)"]);
            } else if (expense.purchase_type.includes("BILL POSTING")) {
            totalBillPosting = totalBillPosting + Number(expense["sum(total_paid)"]);
            }
        }
        if (expense["sum(pur_amount_due)"] !== null) {
            if (expense.purchase_type.toUpperCase() === "MAINTENANCE") {
            expectedMaintenance = expectedMaintenance + Number(expense["sum(pur_amount_due)"]);
            } else if (expense.purchase_type.toUpperCase() === "REPAIRS") {
            expectedRepairs = expectedRepairs + Number(expense["sum(pur_amount_due)"]);
            } else if (expense.purchase_type.toUpperCase() === "MORTGAGE") {
            expectedMortgage = expectedMortgage + Number(expense["sum(pur_amount_due)"]);
            } else if (expense.purchase_type.toUpperCase() === "TAXES") {
            expectedTaxes = expectedTaxes + Number(expense["sum(pur_amount_due)"]);
            } else if (expense.purchase_type.toUpperCase() === "INSURANCE") {
            expectedInsurance = expectedInsurance + Number(expense["sum(pur_amount_due)"]);
            } else if (expense.purchase_type.toUpperCase() === "UTILITY") {
            expectedUtilities = expectedUtilities + Number(expense["sum(pur_amount_due)"]);
            } else if (expense.purchase_type.includes("OWNER PAYMENT")) {
            expectedManagement = expectedManagement + Number(expense["sum(pur_amount_due)"]);
            } else if (expense.purchase_type.includes("BILL POSTING")) {
            expectedBillPosting = expectedBillPosting + Number(expense["sum(pur_amount_due)"]);
            }
        }
    }
    }
    });
    paidExpenseByType = {
    'MAINTENANCE': totalMaintenance,
    'REPAIRS': totalRepairs,
    'MORTGAGE': totalMortgage,
    'TAXES': totalTaxes,
    'INSURANCE': totalInsurance,
    'UTILITIES': totalUtilities,
    'MANAGEMENT': totalManagement,
    'BILL POSTING': totalBillPosting,
    };

    expectedExpenseByType = {
    'MAINTENANCE': expectedMaintenance,
    'REPAIRS': expectedRepairs,
    'MORTGAGE': expectedMortgage,
    'TAXES': expectedTaxes,
    'INSURANCE': expectedInsurance,
    'UTILITIES': expectedUtilities,
    'MANAGEMENT': expectedManagement,
    'BILL POSTING': expectedBillPosting,
    };
    paidExpenseByType && props.setTotalExpenseByType(paidExpenseByType);
    expectedExpenseByType && props.setExpectedExpenseByType(expectedExpenseByType);
};

useEffect(() => {
    // console.log("props useEffect", role);
    if (role === "Owner") {
        fetchCashflow();
    } else if (role === "Property Manager") {
        console.log("[LOG] Not accessible as property manager role.")
    }
}, [year, month, role, selectedProperty]);
return <></>;
};
export default CashflowData;
