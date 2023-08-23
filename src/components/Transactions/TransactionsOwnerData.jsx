import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import * as ReactBootStrap from "react-bootstrap";
import { get } from "../utils/api";
import TransactionHistory from "./TransactionHistory";

export default function TransactionsOwnerData(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [propertyData, setPropertyData] = useState([]);
  const fetchOwnerPayments = async () => {
    // if (access_token === null) {
    //   navigate("/");
    //   return;
    // }
    // const res = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/transactionsByOwnerByProperty/110-000003/200-000029`);
    const res = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/allTransactions`);
    console.log("payments", res);
    props.setTransactionList(res.data.Transactions.result);
    setIsLoading(false);
  };
  useEffect(() => {
    // console.log("in use effect");
    fetchOwnerPayments();
  }, []);

  return (
    <>
    </>
  );
}
