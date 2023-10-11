import React, { useState } from "react";

import { Button, FormControl } from "@mui/material";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  useElements,
  useStripe,
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";
import theme from "../../theme/theme";
import * as ReactBootStrap from "react-bootstrap";


import Payment_Failure from "./Payment_Failure";

function StripePayment(props) {
  console.log("in stripepayment page");
  const { message, amount, paidBy } = props;
  console.log(paidBy);
  const [showSpinner, setShowSpinner] = useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const [showError, setShowError]= useState(false) // State to show payment failre
 
  
   const submitPayment = async () => {
    console.log("in submitpayment");
    setShowSpinner(true);
    const paymentData = {
      customer_uid: paidBy,
      business_code: message === "PMTEST" ? message : "PM",
      payment_summary: {
        total: parseFloat(amount),
      },
    };
    console.log(paymentData);
    const response = await fetch(
      "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createPaymentIntent",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(paymentData),
      }
    );
    console.log(response);
    const clientSecret = await response.json();
    // console.log(clientSecret);
    const cardElement = await elements.getElement(CardElement);
    const stripeResponse = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: "XYZ",
      },
    });
    // console.log(stripeResponse);
    const confirmedCardPayment = await stripe.confirmCardPayment(clientSecret, {
      payment_method: stripeResponse.paymentMethod.id,
      setup_future_usage: "off_session",
    });
    // console.log(confirmedCardPayment);
    const paymentIntentID = confirmedCardPayment.paymentIntent.id;
    // console.log(paymentIntentID);
    let newPayment = {};
    // if (purchases.length === 1) {
    //   // console.log(purchases[0]);
    //   newPayment = {
    //     pay_purchase_id: purchases[0].purchase_uid,
    //     //Need to make change here
    //     amount: parseFloat(amount) + 0.03 * parseFloat(amount),
    //     payment_notes: message,
    //     charge_id: paymentIntentID,
    //     payment_type: "STRIPE",
    //     paid_by: paidBy,
    //   };
    //   // await post("/payments", newPayment);
    //   // if (purchases[0].linked_bill_id !== null) {
    //   //   const body = {
    //   //     maintenance_request_uid: purchases[0].linked_bill_id,
    //   //     quote_status: "PAID",
    //   //   };
    //   //   // const response = await put("/QuotePaid", body);
    //   // }
    // } else {
    //   // for (let purchase of purchases) {
    //   //   // console.log(purchase);
    //   //   newPayment = {
    //   //     pay_purchase_id: purchase.purchase_uid,
    //   //     //Need to make change here
    //   //     amount:
    //   //       parseFloat(purchase.amount_due - purchase.amount_paid) +
    //   //       0.03 * parseFloat(purchase.amount_due - purchase.amount_paid),
    //   //     payment_notes: message,
    //   //     charge_id: paymentIntentID,
    //   //     payment_type: "STRIPE",
    //   //     paid_by: paidBy,
    //   //   };
    //   //   // await post("/payments", newPayment);
    //   //   if (purchase.linked_bill_id !== null) {
    //   //     const body = {
    //   //       maintenance_request_uid: purchase.linked_bill_id,
    //   //       quote_status: "PAID",
    //   //     };
    //   //     // const response = await put("/QuotePaid", body);
    //   //   }
    //   // }
    // }
    setShowSpinner(false);
    props.submit();
  };
  

  return (
    <div style={{ margin: "5rem" }}>
      <div
        style={{
          border: "1px solid black",
          borderRadius: "10px",
          padding: "10px",
          margin: "20px",
        }}
      >

<Payment_Failure showError={showError} setShowError={setShowError} />

        <CardElement elementRef={(c) => (this._element = c)} />
      </div>

      <div className="text-center mt-2">
        {showSpinner ? (
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <ReactBootStrap.Spinner animation="border" role="status" />
          </div>
        ) : (
          ""
        )}
        <Row
          style={{
            display: "text",
            flexDirection: "row",
            textAlign: "center",
          }}
        >
          <Col></Col>
          <Col>
            <Button
              variant="contained"
              onClick={async ()=>{
                 try{ await submitPayment()}
                catch(err){setShowError(true)}
              }}
              sx={{
                background: "#3D5CAC",
                color: theme.palette.background.default,
                width: `50%`,
                height: `20%`,
                left: `14px`,
                top: `4px`,
                borderRadius: "10px 10px 10px 10px",
                margin: "5% 50% 30% 5%",
              }}
            >
              Pay Now
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default StripePayment;
