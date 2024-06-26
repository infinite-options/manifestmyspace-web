import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../../theme/theme";
// import "./../../css/contacts.css";
import { ThemeProvider, Box, Paper, Stack, Typography, Button, InputAdornment, TextField, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Chip } from "@mui/material";
import { Message, Search } from "@mui/icons-material";
import { getStatusColor } from "../ContactsFunction";
import axios from "axios";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Container,
  Grid,
  Tabs,
  Tab,
  Badge,
  Switch,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import defaultHouseImage from "../../Property/defaultHouseImage.png";
import { DataGrid } from '@mui/x-data-grid';
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from "../../Property/messageIconDark.png";
import PhoneIcon from "../../Property/phoneIconDark.png";
import AddressIcon from "../../Property/addressIconDark.png";
import maintenanceIcon from "../../Property/maintenanceIcon.png";
import User_fill from "../../../images/User_fill_dark.png";
import { maskSSN, maskEIN, formattedPhoneNumber } from "../../utils/privacyMasking";



import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";

import AES from "crypto-js/aes";

import APIConfig from "../../../utils/APIConfig";

import PaymentsDataGrid from "./PaymentsDataGrid";


const PaymentsInformation = ({ data }) => {      
  
    console.log("PaymentsInformation - data - ", data);    
    // const payments = owner?.total_paid != null ? JSON.parse(owner?.total_paid) : [];
    const payments = (data!= null && data!= undefined) ? JSON.parse(data) : [];
    console.log("PaymentsInformation - payments - ", payments);
  
    const mappedPayments = payments.map((payment, index) => {
      return {
        payment_id: index,
        cf_month_year: (parseInt(payment.cf_year) * 100) + (parseInt(payment.cf_month_num)),
        ...payment,
      }
    });
    mappedPayments.sort((a, b) => b.cf_month_year - a.cf_month_year);
  
    console.log("PaymentsInformation - mappedPayments - ", mappedPayments);  
  
  return (
    <Container disableGutters sx={{height: '100%', }}>
      <Grid container sx={{paddingLeft: '10px', }}>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: '#160449', marginTop: '10px', }}>
            PAYMENTS
          </Typography>
        </Grid>
      </Grid>    
      <Grid container sx={{padding: '10px', maxHeight: '250px', overflow: 'auto',}}>                    
        <Grid item xs={12} sx={{height: '180px', minHeight: '200px'}}>
          <PaymentsDataGrid data={mappedPayments} />
        </Grid>        
      </Grid>    
    </Container>
  )
  
}

export default PaymentsInformation;