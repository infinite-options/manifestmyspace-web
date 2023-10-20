import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {CircularProgress } from "@mui/material";
// import * as ReactBootStrap from "react-bootstrap";
import { get } from "../utils/api";
import TransactionHistory from "./TransactionHistory";

export default function TransactionsOwnerData(props) {
  const selectedProperty = props.selectedProperty;
  const setShowSpinner = props.setShowSpinner;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [transactionsResult, setTransactionsResult] = useState([]);
  const fetchOwnerTransactions = async () => {
    setShowSpinner(true);
    // if (access_token === null) {
    //   navigate("/");
    //   return;
    // }
    const res = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/allTransactions`);
    console.log("payments", res);
    setTransactionsResult(res.data.Transactions.result);
    props.setTransactionList(res.data.Transactions.result);
    props.setLoading(false);
    setShowSpinner(false);
  };

  const filterOwnerTransactions = async () => {
    let tl = transactionsResult;
    const filteredTransactions = tl.filter(txn => txn.property_address===selectedProperty.property_address && txn.property_unit===selectedProperty.property_unit && txn.property_city===selectedProperty.property_city && txn.property_state===selectedProperty.property_state && txn.property_zip===selectedProperty.property_zip)
    props.setTransactionList(filteredTransactions);
  }
  useEffect(() => {
    // console.log("in use effect");
    if(transactionsResult.length===0)
      {
        fetchOwnerTransactions();
      }
    else{
        if(Object.keys(selectedProperty).length === 0){
          props.setTransactionList(transactionsResult);
        }
        else{
          filterOwnerTransactions();
        }
      }
  }, [selectedProperty]);
  return (
    <>
    </>
  );
}
