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


const PropertiesInformation = ({ owner }) => {  
  
  const { selectedRole, getProfileId } = useUser();  
  const activeProperties = owner?.properties != null ? JSON.parse(owner?.properties).filter( property => property.contract_status === "ACTIVE") : [];
  
  
  return (
    <Container disableGutters sx={{height: '100%', }}>
      <Grid container sx={{paddingLeft: '10px', }}>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: '#160449', marginTop: '10px', }}>
            {selectedRole === "MANAGER" && `YOU MANAGE ${activeProperties?.length} OF THEIR PROPERTIES`}
            {selectedRole === "OWNER" && `THEY MANAGE ${activeProperties?.length} OF YOUR PROPERTIES`}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
          <Typography sx={{ fontSize: '15px', fontWeight: 'bold', color: '#160449', marginTop: '10px', marginLeft: '20px', }}>
            Active {`(${activeProperties?.length})`}
          </Typography>
      </Grid>
      <Grid container sx={{padding: '10px', maxHeight: '250px', overflow: 'auto',}}>                
        <Grid item xs={12} sx={{height: '180px', minHeight: '200px'}}>        
          <PropertiesDataGrid data={activeProperties} />
        </Grid>        
      </Grid>
      <Grid container direction='row' sx={{padding: '10px', }}>
        <Grid container item xs={6}  justifyContent='center'>
          <Button 
            sx={{ 
              textTransform: 'none', 
              '&:hover': {
                backgroundColor: '#9EAED6',
              }             
            }}
          >
            <Typography sx={{ fontSize: '15px', fontWeight: 'bold', color: '#160449', }}>
              New  {`(${owner?.NEW_count})`}
            </Typography>
          </Button>
        </Grid>      
        <Grid container item xs={6}  justifyContent='center'>
          <Button 
            sx={{ 
              textTransform: 'none', 
              '&:hover': {
                backgroundColor: '#9EAED6',
              }, 
            }}
          >
            <Typography sx={{ fontSize: '15px', fontWeight: 'bold', color: '#160449', }}>
              Sent  {`(${owner?.SENT_count})`}
            </Typography>
          </Button>          
        </Grid>      
      </Grid>
    </Container>
  )
  
  }

  const PropertiesDataGrid = ({ data }) => {
    console.log("PropertiesDataGrid - props.data -", data);
    const paymentStatusColorMap = {
      "Paid On Time": theme.palette.priority.clear,
      "Partially Paid": theme.palette.priority.medium,
      "Paid Late": theme.palette.priority.low,
      "Not Paid": theme.palette.priority.high,
      "Vacant": "#160449",
      "No Manager": theme.palette.priority.low,
    };
    
    const paymentStatusMap = {
      UNPAID: "Not Paid",
      "PAID LATE": "Paid Late",
      PAID: "Paid On Time",
      Partial: "Partially Paid",
      VACANT: "Vacant",
      "NO MANAGER": "No Manager",
    };
    
    function getPaymentStatusColor(paymentStatus) {
      if (paymentStatus === null || paymentStatus === undefined) {
        return paymentStatusColorMap["Vacant"];
      } else {
        const status = paymentStatusMap[paymentStatus];
        return paymentStatusColorMap[status];
      }
    }
  
    const columns = [
      { 
        field: 'property_address',      
        // width: 200,
        flex: 0.6,
        renderCell: (params) => (
          <Typography sx={{ fontSize: '14px', color: '#160449', }}>
            {`${params.row.property_address}, Unit - ${params.row.property_unit}`}
          </Typography>
        )
      },    
      {
        field: "rent_status",
        // width: 100,
        flex: 0.5,
        renderCell: (params) => (
          <Box
            sx={{
              backgroundColor: getPaymentStatusColor(params.row.payment_status),
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px",
              border: "none",
              margin: "0px",
            }}
          >
            {/* <Badge
              overlap="circular"
              color="success"
              badgeContent={getNumOfApplications(params.row)}
              invisible={!getNumOfApplications(params.row)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              style={{
                color: "#000000",
                width: "100%",
              }}
            > */}
              <Typography
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: theme.typography.primary.fontWeight,
                  fontSize: "12px",
                  margin: "0px",
                  padding: "0px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {params.row.payment_status? params.row.payment_status : "VACANT"}
              </Typography>
            {/* </Badge> */}
          </Box>
        ),
      },
      {
        field: "maintenance",      
        // width: 100,
        flex: 0.3,
        renderCell: (params) => (
          <Box sx={{ margin: "0px" }}>
            <Badge
              overlap="circular"
              color="error"
              badgeContent={params?.row?.maintenance_count? params?.row?.maintenance_count : 0}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              style={{
                color: "#000000",
                width: "35px",
                height: "20px",
                fontSize: "2px", 
              }}
            >
              <Button
                // onClick={() => navigate("/maintenance")}
                sx={{ border: "none", "&:hover, &:focus, &:active": { backgroundColor: "#d6d5da" }, alignContent: "left", justifyContent: "left" }}
              >
                <img src={maintenanceIcon} alt="maintenance icon" style={{ width: "30px", height: "30px" }} />
              </Button>
            </Badge>
          </Box>
        ),
      },         
      
    ];
  
    if(!data){
      return <></>;
    }
    
    
    
    return (    
        <Grid
          container
          item
          xs={12}
          sx={{
            width: '100%', // Adjust based on your layout
            height: '100%', // Adjust based on your layout
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            getRowHeight={() => 'auto'}
            slots={{
              columnHeaders: () => null,
            }}      
            getRowId={ row => (row.property_uid || row.property_id)}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 15,
                },
              },
            }}
            // pageSizeOptions={[5]}              
            sx={{          
              border: '0px',            
            }}
            hideFooter={true}               
          />
        </Grid>    
    );
  }

export default PropertiesInformation;