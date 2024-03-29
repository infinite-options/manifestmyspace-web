
import { 
    ThemeProvider, 
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    Card,
    CardHeader,
    Slider,
    Stack,
    Button,
    Grid,
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import theme from '../../../theme/theme';

import React, {useState} from "react";

import PaymentInfoModal from "../../PaymentInfoModal";
import { useUser } from '../../../contexts/UserContext';

export default function MarkPaidButton({maintenanceItem, disabled}){

    const [showModal, setShowModal] = useState(false);
    const { getProfileId } = useUser(); 

    function handleMarkPaid(){
        setShowModal(true);   
    }

    const handleSubmitMarkPaid = async ({ checkNumber, amount, id }) => {
        console.log("handleMarkPaid", checkNumber, amount, id, getProfileId());

        try {
            fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/makePayment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pay_purchase_id: maintenanceItem.purchase_uid,
                    pay_fee: 0,
                    pay_amount: amount,
                    pay_total: amount,
                    payment_type: checkNumber ? "check" : "cash",
                    payment_verify: "Unverified",
                    payment_notes: "manual payment",
                    paid_by: maintenanceItem.business_name,
                    payment_intent: "manual payment",
                    payment_method: "manual payment",

                }),
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Grid item xs={6} sx={{
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Button
                variant="contained"
                disabled={disabled}
                sx={{
                    backgroundColor: "#FFFFFF",
                    textTransform: "none",
                    borderRadius: "10px",
                    display: 'flex',
                    width: "100%",
                }}
                onClick={() => handleMarkPaid()}
            >   
                <CheckIcon sx={{color: "#3D5CAC"}}/>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.smallFont}}>
                   Mark Paid
                </Typography>
            </Button>
            <PaymentInfoModal open={showModal} setOpenModal={setShowModal} maintenanceItem={maintenanceItem} handleSubmit={handleSubmitMarkPaid}/>
        </Grid> 
    )
}