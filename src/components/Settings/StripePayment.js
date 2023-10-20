import React, { useState } from "react";
import { 
    Button, 
    Modal, 
    Typography,
    IconButton,
    Box,
    CircularProgress
} from "@mui/material";
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

import CloseIcon from "@mui/icons-material/Close"; // Import the close icon


function StripePayment(props) {
    console.log("in stripepayment page");
    const { message, amount, paidBy, show, setShow, submit } = props;
    console.log(paidBy);
    const [showSpinner, setShowSpinner] = useState(false);
    const elements = useElements();
    const stripe = useStripe();
    const [showError, setShowError]= useState(false) // State to show payment failure 

    const handleClose = () => {
        setShow(false);
    }; 
  
    const submitPayment = async () => {
        // setShowSpinner(true);
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
        const cardElement = await elements.getElement(CardElement);
        const stripeResponse = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: {
                name: "XYZ",
            },
        });
        
        const paymentMethodID = stripeResponse.paymentMethod.id;
        
        const confirmedCardPayment = await stripe.confirmCardPayment(clientSecret, {
            payment_method: stripeResponse.paymentMethod.id,
            setup_future_usage: "off_session",
        });

        const paymentIntentID = confirmedCardPayment.paymentIntent.id;

        console.log("--DEBUG-- in StripePayment paymentMethodID", paymentMethodID);
        console.log("--DEBUG-- in StripePayment paymentIntentID", paymentIntentID);

        await submit({
            paymentIntent: paymentIntentID,
            paymentMethod: paymentMethodID
        });
        // setShowSpinner(false);
    };
  
  return (
    <Modal
        open={show}
        onClose={handleClose}
        aria-labelledby="payment-modal-title"
        aria-describedby="payment-modal-description"
    >
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                border: "1px solid black",
                borderRadius: "10px",
                padding: "20px", // Increase padding for a larger modal
                width: "500px", // Set a maximum width for the modal
            }}
        >
            <IconButton
                edge="end"
                color="inherit"
                onClick={handleClose}
                style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                }}
                aria-label="close"
            >
                <CloseIcon />
            </IconButton>
            <Payment_Failure showError={showError} setShowError={setShowError} />
            <Box sx={{paddingTop: "50px", paddingBottom: "50px"}}>
                <CardElement sx={{
                    width: "100px",
                    height: "20px",
                    backgroundColor: "red",
                }}/>
            </Box>
            <div className="text-center mt-2">
                {showSpinner ? (
                    <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                        <Typography variant="body2">Processing...</Typography>
                        <CircularProgress size={30}/>
                    </div>
                ) : null}
                <Button
                    variant="contained"
                    onClick={async () => {
                        try {
                            setShowSpinner(true);
                            await submitPayment();
                            setShowSpinner(false);
                        } catch (err) {
                            setShowSpinner(false);
                            setShowError(true);
                        }
                    }}
                    sx={{
                        background: "#3D5CAC",
                        color: "white",
                        width: "100%", // Make the button full width
                        borderRadius: "10px",
                        marginTop: "10px",
                    }}
                >
                    Pay Now
                </Button>
            </div>
        </div>
    </Modal>
    );
}

export default StripePayment;
