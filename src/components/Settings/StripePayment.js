import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  useElements,
  useStripe,
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";
import * as ReactBootStrap from "react-bootstrap";

function StripePayment(props) {
  const { message, amount, paidBy } = props;
  const [showSpinner, setShowSpinner] = useState(false);
  const elements = useElements();
  const stripe = useStripe();

  const submitPayment = async () => {
    setShowSpinner(true);
    const paymentData = {
      customer_uid: paidBy,
      business_code: message === "PMTEST" ? message : "PM",
      payment_summary: {
        total: parseFloat(amount) + 0.03 * parseFloat(amount),
      },
    };
    const response = await fetch(
      "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createPaymentIntent",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(paymentData),
      }
    );
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
              variant="outline-primary"
              //onClick={submitForm}
              onClick={submitPayment}
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
