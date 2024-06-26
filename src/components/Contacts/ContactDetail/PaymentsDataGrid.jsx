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

const PaymentsDataGrid = ({ data }) => {
    console.log("ROHIT - PaymentsDataGrid - props.data -", data);
  
    // const payments = data; 
    // const payments = data.filter( property => property.payment_status == "PAID" || property.payment_status == "PAID LATE"  || property.payment_status == "UNPAID")
  
    // const paymentStatusColorMap = {
    //   "Paid On Time": theme.palette.priority.clear,
    //   "Partially Paid": theme.palette.priority.medium,
    //   "Paid Late": theme.palette.priority.low,
    //   "Not Paid": theme.palette.priority.high,
    //   "Vacant": "#160449",
    //   "No Manager": theme.palette.priority.low,
    // };
    
    // const paymentStatusMap = {
    //   UNPAID: "Not Paid",
    //   "PAID LATE": "Paid Late",
    //   PAID: "Paid On Time",
    //   Partial: "Partially Paid",
    //   VACANT: "Vacant",
    //   "NO MANAGER": "No Manager",
    // };
    
    // function getPaymentStatusColor(paymentStatus) {
    //   if (paymentStatus === null || paymentStatus === undefined) {
    //     return paymentStatusColorMap["Vacant"];
    //   } else {
    //     const status = paymentStatusMap[paymentStatus];
    //     return paymentStatusColorMap[status];
    //   }
    // }
    
  
    const columns = [
      { 
        field: 'cf_month',      
        headerName: 'Month',
        renderHeader: () => (
          <Typography sx={{ fontSize: '15px', color: "#160449", fontWeight: 'bold', }}>
            {'Month'}          
          </Typography>        
        ),
        // width: 200,
        flex: 0.5,
        renderCell: (params) => (
          <Typography sx={{ fontSize: '14px', color: '#160449', }}>
            {`${params.row.cf_month}`}
          </Typography>
        )
      },      
      { 
        field: 'cf_year',
        headerName: 'Year',
        renderHeader: () => (
          <Typography sx={{ fontSize: '15px', color: "#160449", fontWeight: 'bold', }}>
            {'Year'}          
          </Typography>        
        ),       
        // width: 200,
        flex: 0.5,
        renderCell: (params) => (
          <Typography sx={{ fontSize: '14px', color: '#160449', }}>
            {`${params.row.cf_year}`}
          </Typography>
        )
      },
      { 
        field: 'total_paid',      
        headerName: 'Amount', 
        renderHeader: () => (
          <Typography sx={{ fontSize: '15px', color: "#160449", fontWeight: 'bold', }}>
            {'Amount'}          
          </Typography>        
        ),
        // width: 200,
        flex: 0.5,
        renderCell: (params) => (
          <Typography sx={{ fontSize: '14px', color: '#160449', }}>
            {`${params.row.total_paid? params.row.total_paid : "-"}`}
          </Typography>
        )
      },
      { 
        field: 'total_amount_due',
        headerName: 'Expected',       
        renderHeader: () => (
          <Typography sx={{ fontSize: '15px', color: "#160449", fontWeight: 'bold', }}>
            {'Expected'}          
          </Typography>        
        ),
        // width: 200,
        flex: 0.5,
        renderCell: (params) => (
          <Typography sx={{ fontSize: '14px', color: '#160449', }}>
            {`${params.row.total_amount_due}`}
          </Typography>
        )
      },
                 
             
      
    ];
  
    if(!data){
      return <></>;
    }
    
    
    
    return (
      <>
        <DataGrid
          rows={data}
          columns={columns}
          getRowHeight={() => 'auto'}
          // slots={{
          //   columnHeaders: () => null,
          // }}      
          getRowId={ row => row.payment_id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 12,
              },
            },
          }}
          // pageSizeOptions={[5]}              
          sx={{          
            border: '0px',
          }}
          hideFooter={true}                
        />
      </>
    );
  }

  export default PaymentsDataGrid;