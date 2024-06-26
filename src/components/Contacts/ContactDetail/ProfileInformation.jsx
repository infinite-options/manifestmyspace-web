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

const ProfileInformation = ({ contactDetails, type }) => {
    // console.log("ROHTI - ProfileInformation - props.type - ", type)
    const [ paymentMethods, setPaymentMethods ] = useState([]);  
  
    useEffect( () => {
      console.log("ROHIT - ProfileInformation - contactDetails - ", contactDetails);                        
      setPaymentMethods( JSON.parse(contactDetails?.payment_method || '[]') );    
    }, [contactDetails]);
  
    useEffect( () => {        
      console.log("ROHIT - ProfileInformation - paymentMethods - ", paymentMethods);        
    }, [paymentMethods]);
  
    const formatPaymentMethodType = (type) => {
      return type
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };  
  
    const getDecryptedSSN = (encryptedSSN) => {
      try {
        const decrypted = AES.decrypt(encryptedSSN, process.env.REACT_APP_ENKEY).toString();
        return "***-**-" + decrypted.toString().slice(-4);
      } catch (error) {
        console.error('Error decrypting SSN:', error);
        return '';
      }
    };
    
    return (
      <Grid container>
        <Grid container item xs={12} md={6}>      
          <Grid item xs={12}>
            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#160449', }}>
              CONTACT INFORMATION
            </Typography>
          </Grid>
          <Grid container direction='row' item xs={12} alignContent='center' >
            <img src={EmailIcon} alt="email" />        
            <Typography sx={{color: '#160449', }}>
              {type == "owner" && contactDetails?.owner_email}
              {type == "tenant" && contactDetails?.tenant_email}
              {(type === "maintenance" || type === "manager") && contactDetails?.business_email}
              {type == "employee" && contactDetails?.employee_email}
            </Typography>
          </Grid>
          <Grid container direction='row' item xs={12} alignContent='center' >
            <img src={PhoneIcon} alt="phone" />        
            <Typography sx={{color: '#160449', }}>
              {/* { contactDetails?.owner_phone_number} */}
              {type == "owner" && contactDetails?.owner_phone_number}
              {type == "tenant" && contactDetails?.tenant_phone_number}
              {(type === "maintenance" || type === "manager") && contactDetails?.business_phone_number}
              {type == "employee" && contactDetails?.employee_phone_number}
              
            </Typography>
          </Grid>
          <Grid container direction='row' item xs={12} alignItems='center' >
            <img src={AddressIcon} alt="address" />
              
            <Typography sx={{color: '#160449', }}>          
              {/* { contactDetails?.owner_address + ', ' + contactDetails?.owner_city + ', ' + contactDetails?.owner_state + ', ' + contactDetails?.owner_zip } */}
  
              {type == "owner" && contactDetails?.owner_address + ', ' + contactDetails?.owner_city + ', ' + contactDetails?.owner_state + ', ' + contactDetails?.owner_zip }
              {type == "tenant" && contactDetails?.tenant_address + ', ' + contactDetails?.tenant_city + ', ' + contactDetails?.tenant_state + ', ' + contactDetails?.tenant_zip }
              {(type === "maintenance" || type === "manager") && contactDetails?.business_address + ', ' + contactDetails?.business_city + ', ' + contactDetails?.business_state + ', ' + contactDetails?.business_zip }
              {type == "employee" && contactDetails?.employee_address + ', ' + contactDetails?.employee_city + ', ' + contactDetails?.employee_state + ', ' + contactDetails?.employee_zip }
              
  
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} md={6}>      
          <Grid item xs={12}>
            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#160449', padding: '0px', }}>
              CONFIDENTIAL INFORMATION
            </Typography>
          </Grid>
          <Grid container item xs={12}>
            
              {
                (type != "maintenance" && type != "manager")  && (
                  <>
                    <Grid item xs={5} sx={{padding: '0px',}}>
                      <Typography sx={{fontSize: '15px', fontWeight: '600', color: '#160449', }}>
                        SSN
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Typography sx={{ fontSize: '15px', color: '#160449' }}>
                        {/* {contactDetails?.owner_ssn ? (getDecryptedSSN(contactDetails?.owner_ssn)) : "No SSN provided"} */}
  
                        {type == "owner" && (contactDetails?.owner_ssn ? (getDecryptedSSN(contactDetails?.owner_ssn)) : "No SSN provided")}
                        {type == "tenant" && (contactDetails?.tenant_ssn ? (getDecryptedSSN(contactDetails?.tenant_ssn)) : "No SSN provided")}                
                        {type == "employee" && (contactDetails?.employee_ssn ? (getDecryptedSSN(contactDetails?.employee_ssn)) : "No SSN provided")}                
                        
                      </Typography>
                    </Grid>            
                  </>
                )
              }                        
            
  
            <Grid container item xs={12}>
              <Grid item xs={5}>
                <Typography sx={{color: '#160449', fontWeight: '600', }}>
                  EIN
                </Typography>                            
              </Grid>
              <Grid item xs={5}>
                <Typography sx={{ fontSize: '15px', color: '#160449',}}>
                  {contactDetails?.owner_ein_number? maskEIN(contactDetails?.owner_ein_number) : "No EIN provided"}                
                </Typography>
              </Grid>
            </Grid>
  
            
          </Grid>
        </Grid>      
        <Grid item xs={12} sx={{ marginTop: '15px', }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#160449', }}>
            PAYMENT METHODS
          </Typography>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={6}>
            <Typography sx={{fontSize: '15px', fontWeight: '600', color: '#160449', }}>
              Active {`(${paymentMethods.filter( method => method.paymentMethod_status === "Active").length})`}
            </Typography>
            {paymentMethods
              .filter( method => method.paymentMethod_status === "Active")
              .map( (method, index) => {
                // console.log("payment method - ", method);
                return (
                  <Typography key={index} sx={{ fontSize: '15px', color: '#160449',}}>
                    {formatPaymentMethodType(method.paymentMethod_type)}
                  </Typography>
                )
            })}
            
            
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{fontSize: '15px', color: '#160449', fontWeight: '600', }}>
              Inactive {`(${paymentMethods.filter( method => method.paymentMethod_status === "Inactive").length})`}
            </Typography>
            {paymentMethods
              .filter( method => method.paymentMethod_status === "Inactive")
              .map( (method, index) => {
                return (
                  <Typography key={index} sx={{ fontSize: '15px', color: '#160449',}}>
                    {formatPaymentMethodType(method.paymentMethod_type)}
                  </Typography>
                )
            })}
            
          </Grid>
        
        </Grid>
  
      </Grid>
    )
  
  }

  export default ProfileInformation;