import React, { Component, useEffect, useState } from 'react';
import { get } from '../utils/api'
const CashflowData = (props) => {
    console.log("props", props);
    const [role, setRole] = useState(props.role);
    const [userID, setUserID] = useState(props.userID);
    const [year, setYear] = useState(props.year);
    const [month, setMonth] = useState(props.month);
    const [filter, setFilter] = useState(props.filter); //boolean

    // const [revenue, setRevenue] = useState(null);
    // const [revenueSummary, setRevenueSummary] = useState(null);
    // const [expense, setExpense] = useState(null);
    // const [expenseSummary, setExpenseSummary] = useState(null);
    
    const propertyView = false;

    const fetchCashflow = async () => {
        console.log("props fetchCashflow", props);
        // if (access_token === null || user.role.indexOf("OWNER") === -1) {
        //   navigate("/");
        //   return;
        // }
    
        const cashflowResponse = await get(
          `/CashflowOwner?owner_id=${userID}&year=${year}`
        );
        console.log("props cashflowResponse", cashflowResponse);
        let currentRev = [];
        let currentRevSummary = [];
        let currentExp = [];
        let currentExpSummary = [];
        if (filter === false) {
          if (propertyView === false) {
            cashflowResponse.result.revenue.forEach((rev) => {
              if (rev.month === month) {
                currentRev.push(rev);
              }
            });
            cashflowResponse.result.revenue_summary.forEach((rev) => {
              if (rev.month === month) {
                currentRevSummary.push(rev);
              }
            });
            cashflowResponse.result.expense.forEach((rev) => {
              if (rev.month === month) {
                currentExp.push(rev);
              }
            });
            cashflowResponse.result.expense_summary.forEach((rev) => {
              if (rev.month === month) {
                currentExpSummary.push(rev);
              }
            });
          } else {
            // cashflowResponse.result.revenue.forEach((rev) => {
            //   if (
            //     rev.month === month &&
            //     // rev.property_uid === ownerData[0].property_uid
            //   ) {
            //     currentRev.push(rev);
            //   }
            // });
            // cashflowResponse.result.revenue_unit.forEach((rev) => {
            //   if (
            //     rev.month === month &&
            //     rev.property_uid === ownerData[0].property_uid
            //   ) {
            //     currentRevSummary.push(rev);
            //   }
            // });
            // cashflowResponse.result.expense.forEach((rev) => {
            //   if (
            //     rev.month === month &&
            //     rev.property_uid === ownerData[0].property_uid
            //   ) {
            //     currentExp.push(rev);
            //   }
            // });
            // cashflowResponse.result.expense_unit.forEach((rev) => {
            //   if (
            //     rev.month === month &&
            //     rev.property_uid === ownerData[0].property_uid
            //   ) {
            //     currentExpSummary.push(rev);
            //   }
            // });
          }
    
          const resArr = [];
          currentRev.forEach((item) => {
            currentRev.forEach((x) => {
              if (
                x.property_uid == item.property_uid &&
                x.description == item.description &&
                x.month == item.month &&
                x.year == item.year &&
                x.purchase_date == item.purchase_date &&
                x.purchase_type !== item.purchase_type &&
                item.amount_due > x.amount_due
              ) {
                resArr.push({
                  address: item.address,
                  amount_due: (
                    parseFloat(item.amount_due) - parseFloat(x.amount_due)
                  ).toFixed(2),
                  amount_paid:
                    x.purchase_status === "UNPAID"
                      ? 0
                      : (item.amount_paid - x.amount_paid).toFixed(2),
                  city: item.city,
                  description: item.description,
                  linked_bill_id: null,
                  month: item.month,
                  next_payment: item.next_payment,
                  owner_id: item.owner_id,
                  payer: "",
                  payment_frequency: null,
                  property_uid: item.property_uid,
                  pur_property_id: item.pur_property_id,
                  purchase_date: item.purchase_date,
                  purchase_frequency: item.purchase_frequency,
                  purchase_notes: item.purchase_notes,
                  purchase_status: item.purchase_status,
                  purchase_type: "MANAGEMENT " + item.purchase_type,
                  purchase_uid: "",
                  receiver: "",
                  state: item.state,
                  unit: item.unit,
                  year: item.year,
                  zip: item.zip,
                });
                console.log(resArr);
                currentExp.push({
                  address: item.address,
                  amount_due: (
                    parseFloat(item.amount_due) - parseFloat(x.amount_due)
                  ).toFixed(2),
                  amount_paid:
                    x.purchase_status === "UNPAID"
                      ? 0
                      : (item.amount_paid - x.amount_paid).toFixed(2),
                  city: item.city,
                  description: item.description,
                  linked_bill_id: null,
                  month: item.month,
                  next_payment: item.next_payment,
                  owner_id: item.owner_id,
                  payer: "",
                  payment_frequency: null,
                  property_uid: item.property_uid,
                  pur_property_id: item.pur_property_id,
                  purchase_date: item.purchase_date,
                  purchase_frequency: item.purchase_frequency,
                  purchase_notes: item.purchase_notes,
                  purchase_status: item.purchase_status,
                  purchase_type: "MANAGEMENT " + item.purchase_type,
                  purchase_uid: "",
                  receiver: "",
                  state: item.state,
                  unit: item.unit,
                  year: item.year,
                  zip: item.zip,
                });
              }
            });
          });
    
          if (resArr.length > 0) {
            for (let r = 0; r < resArr.length; r++) {
              if (
                currentExpSummary.some(
                  (ces) => ces.purchase_type === resArr[r].purchase_type
                )
              ) {
                let i = currentExpSummary.findIndex(
                  (ces) => ces.purchase_type === resArr[r].purchase_type
                );
    
                currentExpSummary[i].amount_due =
                  parseFloat(currentExpSummary[i].amount_due) +
                  parseFloat(resArr[r].amount_due);
                currentExpSummary[i].amount_paid =
                  parseFloat(currentExpSummary[i].amount_paid) +
                  parseFloat(resArr[r].amount_paid);
              } else {
                currentExpSummary.push({
                  owner_id: userID,
                  purchase_type: resArr[r].purchase_type,
                  month: month,
                  year: year,
                  amount_due: parseFloat(resArr[r].amount_due),
                  amount_paid: parseFloat(resArr[r].amount_paid),
                });
              }
            }
          }
          // console.log(currentRevSummary);
          const resArrRevSum = [];
          currentRevSummary.forEach((rev, i) => {
            // console.log(rev);
            if (!rev.purchase_type.includes("OWNER PAYMENT")) {
              resArrRevSum.push(rev);
            }
          });
          // console.log(resArrRevSum);
          props.setRevenue(currentRev);
          props.setExpense(currentExp);
          props.setRevenueSummary(resArrRevSum);
          props.setExpenseSummary(currentExpSummary);
        } else {
          if (propertyView === false) {
            cashflowResponse.result.revenue.forEach((rev) => {
              if (rev.month === month) {
                currentRev.push(rev);
              }
            });
            cashflowResponse.result.revenue_unit.forEach((rev) => {
              if (rev.month === month) {
                currentRevSummary.push(rev);
              }
            });
            cashflowResponse.result.expense.forEach((rev) => {
              if (rev.month === month) {
                currentExp.push(rev);
              }
            });
            cashflowResponse.result.expense_unit.forEach((rev) => {
              if (rev.month === month) {
                currentExpSummary.push(rev);
              }
            });
          } else {
            // cashflowResponse.result.revenue.forEach((rev) => {
            //   if (
            //     rev.month === month &&
            //     rev.property_uid === ownerData[0].property_uid
            //   ) {
            //     currentRev.push(rev);
            //   }
            // });
            // cashflowResponse.result.revenue_unit.forEach((rev) => {
            //   if (
            //     rev.month === month &&
            //     rev.property_uid === ownerData[0].property_uid
            //   ) {
            //     currentRevSummary.push(rev);
            //   }
            // });
            // cashflowResponse.result.expense.forEach((rev) => {
            //   if (
            //     rev.month === month &&
            //     rev.property_uid === ownerData[0].property_uid
            //   ) {
            //     currentExp.push(rev);
            //   }
            // });
            // cashflowResponse.result.expense_unit.forEach((rev) => {
            //   if (
            //     rev.month === month &&
            //     rev.property_uid === ownerData[0].property_uid
            //   ) {
            //     currentExpSummary.push(rev);
            //   }
            // });
          }
    
          const resArr = [];
          currentRev.forEach((item) => {
            currentRev.forEach((x) => {
              if (
                x.property_uid == item.property_uid &&
                x.description == item.description &&
                x.month == item.month &&
                x.year == item.year &&
                x.purchase_date == item.purchase_date &&
                x.purchase_type !== item.purchase_type &&
                item.amount_due > x.amount_due
              ) {
                resArr.push({
                  address: item.address,
                  amount_due: (item.amount_due - x.amount_due).toFixed(2),
                  amount_paid:
                    x.purchase_status === "UNPAID"
                      ? 0
                      : (item.amount_paid - x.amount_paid).toFixed(2),
                  city: item.city,
                  description: item.description,
                  linked_bill_id: null,
                  month: item.month,
                  next_payment: item.next_payment,
                  owner_id: item.owner_id,
                  payer: "",
                  payment_frequency: null,
                  property_uid: item.property_uid,
                  pur_property_id: item.pur_property_id,
                  purchase_date: item.purchase_date,
                  purchase_frequency: item.purchase_frequency,
                  purchase_notes: item.purchase_notes,
                  purchase_status: item.purchase_status,
                  purchase_type: "MANAGEMENT " + item.purchase_type,
                  purchase_uid: "",
                  receiver: "",
                  state: item.state,
                  unit: item.unit,
                  year: item.year,
                  zip: item.zip,
                });
                currentExp.push({
                  address: item.address,
                  amount_due: (item.amount_due - x.amount_due).toFixed(2),
                  amount_paid:
                    x.purchase_status === "UNPAID"
                      ? 0
                      : (item.amount_paid - x.amount_paid).toFixed(2),
                  city: item.city,
                  description: item.description,
                  linked_bill_id: null,
                  month: item.month,
                  next_payment: item.next_payment,
                  owner_id: item.owner_id,
                  payer: "",
                  payment_frequency: null,
                  property_uid: item.property_uid,
                  pur_property_id: item.pur_property_id,
                  purchase_date: item.purchase_date,
                  purchase_frequency: item.purchase_frequency,
                  purchase_notes: item.purchase_notes,
                  purchase_status: item.purchase_status,
                  purchase_type: "MANAGEMENT " + item.purchase_type,
                  purchase_uid: "",
                  receiver: "",
                  state: item.state,
                  unit: item.unit,
                  year: item.year,
                  zip: item.zip,
                });
              }
            });
          });
    
          if (resArr.length > 0) {
            for (let r = 0; r < resArr.length; r++) {
              if (
                currentExpSummary.some(
                  (ces) => ces.purchase_type === resArr[r].purchase_type
                )
              ) {
                let i = currentExpSummary.findIndex(
                  (ces) => ces.purchase_type === resArr[r].purchase_type
                );
    
                currentExpSummary[i].amount_due =
                  parseFloat(currentExpSummary[i].amount_due) +
                  parseFloat(resArr[r].amount_due);
                currentExpSummary[i].amount_paid =
                  parseFloat(currentExpSummary[i].amount_paid) +
                  parseFloat(resArr[r].amount_paid);
              } else {
                currentExpSummary.push({
                  owner_id: userID,
                  purchase_type: resArr[r].purchase_type,
                  property_uid: resArr[r].property_uid,
                  receiver: resArr[r].receiver,
                  month: month,
                  year: year,
                  amount_due: parseFloat(resArr[r].amount_due),
                  amount_paid: parseFloat(resArr[r].amount_paid),
                });
              }
            }
          }
          // console.log(currentRevSummary);
          const resArrRevSum = [];
          currentRevSummary.forEach((rev, i) => {
            // console.log(rev);
            if (!rev.purchase_type.includes("OWNER PAYMENT")) {
              resArrRevSum.push(rev);
            }
          });
          // console.log(currentRevSummary);
          props.setRevenue(currentRev);
          props.setExpense(currentExp);
          props.setRevenueSummary(resArrRevSum);
          props.setExpenseSummary(currentExpSummary);
        }
    
        // setIsLoading(false);
      };
    
      useEffect(() => {
        console.log("props useEffect", role)
        if (role === 'Owner') {
            fetchCashflow();
        }
        else if (role === 'Property Manager') {
        
        }
      }, [year, month, filter, role]);
    return (
        <>
        </>
    )
}
export default CashflowData;