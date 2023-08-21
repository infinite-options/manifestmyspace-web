import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import * as ReactBootStrap from "react-bootstrap";
import { get } from "../utils/api";
import TransactionHistory from "./TransactionHistory";

export default function TransactionsOwnerData(props) {
  const navigate = useNavigate();
  //   const { access_token, user } = userData;
  const [isLoading, setIsLoading] = useState(true);
  const [propertyData, setPropertyData] = useState([]);
  const fetchOwnerPayments = async () => {
    // if (access_token === null) {
    //   navigate("/");
    //   return;
    // }
    const response = await get(`/ownerPayments?owner_id=${"100-000003"}`);
    const res = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/transactionsByOwnerByProperty/110-000003/200-000029`);
    // const res = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/allTransactions`);
    console.log("payments", res.result);
    // setPropertyData(response.result)
    props.setTransactionList(res.result);
    // setUpcomingPaymentsData(response.result);
    setIsLoading(false);
  };
  useEffect(() => {
    // console.log("in use effect");
    fetchOwnerPayments();
  }, []);

  return (
    <>
      {/* {!isLoading ? (
      <>{propertyData.length !== 0 && (
        <TransactionHistory data={propertyData} />
      )}</>
  ) : (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center">
      loading
    </div>
  )} */}
    </>
  );
}
