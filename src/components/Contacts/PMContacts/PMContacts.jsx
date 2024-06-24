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

const PMContacts = () => {
  const { getProfileId, selectedRole } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);
  const [contactsTab, setContactsTab] = useState("Owner");
  const [ contactsData, setContactsData ] = useState([]);

  const [ currentIndex, setCurrentIndex ] = useState(0);

  useEffect(() => {
    console.log("ROHIT - contactsData - ", contactsData);
  }, [contactsData]);

  useEffect(() => {
    console.log("ROHIT - currentIndex", currentIndex)
  }, [currentIndex]);
  useEffect(() => {
    console.log("ROHIT - contactsTab", contactsTab)
    setCurrentIndex(0); 
  }, [contactsTab]);
  

  const fetchData = async () => {
    const url = `${APIConfig.baseURL.dev}/contacts/${getProfileId()}`;
    // const url = `${APIConfig.baseURL.dev}/contacts/600-000003`;
    console.log("In PMContracts.jsx");
    setShowSpinner(true);

    await axios
      .get(url)
      .then((resp) => {
        const data = resp.data["management_contacts"];
        setContactsData(data);
        setShowSpinner(false);
      })
      .catch((e) => {
        console.error(e);
        setShowSpinner(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (    
      <Container disableGutters maxWidth="lg">
        <Grid container>
          <Grid container item xs={12} md={4}>
            <Grid item xs={12} sx={{padding: '5px', height: '100%', }}>            
                {/* <PMContactsList />             */}
                {/* <PMContactsList2 /> */}
                <PMContactsList data={contactsData} setTab={setContactsTab} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
            </Grid>
          </Grid>
          <Grid container item xs={12} md={8} >
            <Grid item xs={12} sx={{padding: '5px',}}>
              {
                contactsTab === "Owner" && <OwnerContactDetail data={contactsData?.owners} contacsTab={contactsTab} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
              }
              {
                contactsTab === "Tenant" && <TenantContactDetail data={contactsData?.tenants} contacsTab={contactsTab} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
              }
              {
                contactsTab === "Maintenance" && <MaintenanceContactDetail data={contactsData?.maintenance} contacsTab={contactsTab} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
              }
              {
                contactsTab === "Employee" && <EmployeeContactDetail data={contactsData?.employees} contacsTab={contactsTab} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
              }
            </Grid>                  
          </Grid>
        </Grid>
      </Container>    
  );
}

const PMContactsList = ({ data, setTab, currentIndex, setCurrentIndex }) => {
  console.log("In PMContactsList - data - ", data)
  const { getProfileId, selectedRole } = useUser();
  const [contactsTab, setContactsTab] = useState("Owner");
  const [ownerData, setOwnerData] = useState([]);
  const [tenantData, setTenantData] = useState([]);
  // const [maintenanceData, setMaintenanceData] = useState([]);
  const [allOwnersData, setAllOwnersData] = useState(data?.owners);
  const [displayedOwnersData, setDisplayedOwnersData] = useState(data?.owners);
  const [allTenantsData, setAllTenantsData] = useState(data?.tenants);
  const [displayedTenantsData, setDisplayedTenantsData] = useState(data?.tenants);
  const [allMaintenanceData, setAllMaintenanceData] = useState(data?.maintenance);
  const [displayedMaintenanceData, setDisplayedMaintenanceData] = useState(data?.maintenance);
  const [allEmployeesData, setAllEmployeesData] = useState(data?.employees);
  const [displayedEmployeesData, setDisplayedEmployeesData] = useState(data?.employees);
  const [showSpinner, setShowSpinner] = useState(false);

  const [ownerDataDetails, setOwnerDataDetails] = useState([]);
  const [tenantDataDetails, setTenantDataDetails] = useState([]);
  const [maintenanceDataDetails, setMaintenanceDataDetails] = useState([]);
  const [managersDataDetails, setManagersDataDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setAllOwnersData(data?.owners);
    setDisplayedOwnersData(data?.owners);
    setAllTenantsData(data?.tenants);
    setDisplayedTenantsData(data?.tenants);
    setAllMaintenanceData(data?.maintenance);
    setDisplayedMaintenanceData(data?.maintenance);
    setAllEmployeesData(data?.employees);
    setDisplayedEmployeesData(data?.employees);
  }, [data]);

  const filterContacts = (data) => {
    if (searchTerm.trim() === "") return data;

    const terms = searchTerm.trim().toLowerCase().split(" "); // Split the search term into individual terms

    return data?.filter((contact) => {
      // Customize the filtering logic based on your requirements
      return terms.every((term) => {
        // Check if any part of the contact's name includes each term in the search query
        return contact.contact_first_name?.toLowerCase()?.includes(term) || contact.contact_last_name?.toLowerCase()?.includes(term);
      });
    });
  };

  useEffect(() => {
    console.log("ROHIT - contactsTab - ", contactsTab);
  }, [contactsTab]);

  useEffect(() => {
    setTab(contactsTab)
    switch (contactsTab) {      
      case "Owner":        
        setDisplayedOwnersData(filterContacts(allOwnersData));
        break;
      case "Tenant":
        setDisplayedTenantsData(filterContacts(allTenantsData));
        break;
      case "Maintenance":
        setDisplayedMaintenanceData(filterContacts(allMaintenanceData));
        break;
      case "Employee":
        setDisplayedEmployeesData(filterContacts(allEmployeesData));
        break;
      default:
        break;
    }
  }, [searchTerm, contactsTab, allOwnersData, allTenantsData, allMaintenanceData, allEmployeesData]);

  const handleAddContact = () => {
    navigate("/addContacts");
  };

  const handleSetSelectedCard = (selectedData, index) => {
    console.log("In handleSelectionCard: ", selectedData, index);
    setCurrentIndex(index);
    let dataDetails;
    switch (contactsTab) {
      case "Owner":
        console.log("In Owner: ", displayedOwnersData);
        dataDetails = displayedOwnersData;
        break;
      case "Tenant":
        dataDetails = displayedTenantsData;
        break;
      case "Maintenance":
        dataDetails = displayedMaintenanceData;
        break;
      case "Employee":
        dataDetails = displayedEmployeesData;
        break;
      default:
        break;
    }

    // Navigates to OwnerContactDetails.jsx, TenantContractDetails.jsx and MaitenanceContractDetails.jsx
    // navigate(`/${contactsTab.toLowerCase()}ContactDetails`, {
    //   state: {
    //     dataDetails,
    //     tab: contactsTab,
    //     selectedData,
    //     index,
    //     viewData: dataDetails,
    //     navigatingFrom: "PMContacts"
    //   },
    // });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setContactsTab(newValue)
  }
  
  return (
    <> 
      <Paper
        elevation={0}
        style={{
            // margin: '50p', // Add margin here
            borderRadius: "10px",
            backgroundColor: "#F2F2F2",
            // height: "500px",
            // [theme.breakpoints.down("sm")]: {
            //     width: "80%",
            // },
            // [theme.breakpoints.up("sm")]: {
            //     width: "50%",
            // },
            width: "100%",
            padding: '0px',
        }}
      >
        <Container disableGutters maxWidth="lg" sx={{height: "100%", width: '100%', }}>     
          <Grid container justifyContent='center' sx={{padding: '10px 10px', width: '100%'}}>
            <Typography sx={{ fontSize: '35px', color: '#160449', fontWeight: 'bold', marginBottom: '20px', }}>
              Contacts
            </Typography>
            <Grid container item xs={12} justifyContent='center' >
              <TextField 
                value={searchTerm}
                placeholder='Search Keyword'
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  width: '100%',       
                  marginBottom: '10px',      
                  '& input': {
                    height: '15px', 
                    padding: '10px 14px',
                    borderRadius: '15px',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#3D5CAC', fontSize: '1.5rem',  }}/>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid container justifyContent="center" sx={{width: '100%', }}>

              <Tabs
                value={contactsTab}
                onChange={handleTabChange}
                indicatorColor="grey"
                sx={{
                  justifyContent: "center",
                  width: '100%',
                  padding: '0px',
                }}
                // textColor="inherit"
                variant="fullWidth"
                
              >
                <Tab 
                  label="Owners"
                  value="Owner" 
                  sx={{
                    backgroundColor: getStatusColor("Owner"),
                    color:"#FFFFFF",
                    fontSize: '14px',
                    fontWeight: 'bold',
                    borderRadius: '10px 10px 0px 0px', 
                    textTransform: 'none',
                    '&.Mui-selected': {
                      color:"#FFFFFF",
                    },                    
                  }} 
                />
                <Tab 
                  label="Tenants"
                  value="Tenant"
                  sx={{
                    backgroundColor: getStatusColor("Tenant"),
                    color:"#FFFFFF",
                    fontSize: '14px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderRadius: '10px 10px 0px 0px',
                    '&.Mui-selected': {
                      color:"#FFFFFF",
                    },                    
                   }}
                />
                <Tab 
                  label="Maintenance"
                  value="Maintenance"
                  sx={{
                    backgroundColor: getStatusColor("Maintenance"),
                    color:"#FFFFFF",
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: '10px 10px 0px 0px', 
                    '&.Mui-selected': {
                      color:"#FFFFFF",
                    },                    
                  }}
                />
                 <Tab 
                  label="Employees"
                  value="Employee"
                  sx={{
                    backgroundColor: getStatusColor("Employee"),
                    color:"#FFFFFF",
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: '10px 10px 0px 0px', 
                    '&.Mui-selected': {
                      color:"#FFFFFF",
                    },                    
                  }}
                />
              </Tabs>
              <Box sx={{backgroundColor: getStatusColor(contactsTab), height: '25px', width: '100%',  }}></Box>              
            </Grid>   
            
            {/* height: '669px' */}
            <Grid container item xs={12} justifyContent="center" sx={{ height: '65dvh', overflowY: 'auto', paddingBottom: '10px', backgroundColor: '#FFFFFF',borderRadius: '0px 0px 10px 10px', }}>                                                  
              <Grid item xs={12}>
                {contactsTab === "Owner" && displayedOwnersData?.map((owner, index) => (
                  <OwnerContactsCard data={owner} key={index} index={index} selected={handleSetSelectedCard} />
                ))}
                {contactsTab === "Tenant" && displayedTenantsData?.map((tenant, index) => (
                  <TenantContactsCard data={tenant} key={index} index={index} selected={handleSetSelectedCard} />
                ))}
                {contactsTab === "Maintenance" && displayedMaintenanceData?.map((maint, index) => (
                  <MaintenanceContactsCard data={maint} key={index} index={index} selected={handleSetSelectedCard} />
                ))}
                {contactsTab === "Employee" && displayedEmployeesData?.map((emp, index) => (
                  <EmployeeContactsCard data={emp} key={index} index={index} selected={handleSetSelectedCard} />
                ))}
              </Grid>            
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </>
  )
}

const OwnerContactDetail = ({ data, currentIndex, setCurrentIndex,  }) => {

  const { selectedRole, getProfileId } = useUser();  
  const [ contactDetails, setContactDetails ] = useState([]);

  useEffect(() => {
    setContactDetails(data)
  }, [data]);

  return (
    <Grid container sx={{backgroundColor: theme.palette.primary.main,  borderRadius: '10px', padding: '10px', }}>                
        <Grid item xs={12} container justifyContent="center" sx={{ height: '50px',  }}>
            <Typography sx={{fontSize: '35px', fontWeight: 'bold', color: '#160449' }}>
                Owner Contact
            </Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="center" >
            <Typography sx={{fontSize: '20px', color: '#3D5CAC'}}>
              {currentIndex + 1} of {contactDetails?.length} Owners
            </Typography>                    
        </Grid>                
        <Grid container item xs={12} direction='row' alignContent='space-between' sx={{backgroundColor: '#3D5CAC', borderRadius: '10px', marginBottom: '10px', paddingTop: '5px', paddingBottom: '10px', minHeight: '120.5px', }}>                            
            <Grid item xs={1}>
                <Box
                    onClick={() => {
                      console.log("Previous button clicked", currentIndex, contactDetails.length);
                      currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : setCurrentIndex(contactDetails.length - 1);
                    }}
                    sx={{
                      paddingLeft: '10px',
                    }}
                >
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z"
                        fill={theme.typography.secondary.white}
                        />
                    </svg>
                </Box>
            </Grid>
            <Grid container direction='row' item xs={10} >
                <Grid item xs={12} container justifyContent="center">
                  <Typography sx={{fontSize: '25px', fontWeight: 'bold', color: '#F2F2F2' }}>
                  {`
                    ${(contactDetails && contactDetails[currentIndex]?.owner_first_name) ? contactDetails[currentIndex]?.owner_first_name : ""}
                    ${(contactDetails && contactDetails[currentIndex]?.owner_last_name) ? contactDetails[currentIndex]?.owner_last_name : ""}
                  `}
                  </Typography>
                </Grid>
                <Grid item xs={12} container justifyContent="center">
                  <Box
                    sx={{
                      backgroundColor: "#A9A9A9",
                      height: "68px",
                      width: "68px",
                      borderRadius: "68px",
                      // marginTop: "-34px",
                    }}
                  >
                  <img
                    src={(contactDetails && contactDetails[currentIndex]?.owner_photo_url) ? contactDetails[currentIndex].owner_photo_url : User_fill}
                    alt="profile placeholder"
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "68px",
                      margin: "4px",
                    }}
                  />
                  </Box>
                </Grid>
            </Grid>
            <Grid item xs={1}  container justifyContent='flex-end'>
                <Box
                    onClick={() => {
                      console.log("Next button clicked");
                      currentIndex < contactDetails.length - 1 ? setCurrentIndex(currentIndex + 1) : setCurrentIndex(0);
                    }}
                    sx={{
                      paddingRight: '10px',
                    }}
                >
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z"
                        fill={theme.typography.secondary.white}
                        />
                    </svg>
                </Box>
            </Grid>
        </Grid>
        <Grid container item xs={12} columnSpacing={1} rowSpacing={1} sx={{ }}>
            <Grid item xs={12}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        minHeight: 230,
                        // maxHeight: 230, 
                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        // width: "100%",
                        padding: '10px',
                    }}
                >
                    {
                      contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                        <ProfileInformation contactDetails={contactDetails[currentIndex]} type="owner"/>
                      ) :
                      <></>
                    }
                    
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        minHeight: 370,

                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        // width: "100%",
                        padding: '10px',
                    }}
                >
                    {
                      contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                        <PaymentsInformation                           
                          owner={contactDetails[currentIndex]}
                        />
                      ) :
                      <></>
                    }
                    
                </Paper>
            </Grid>   
            <Grid item xs={12} md={6}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        minHeight: 360,

                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        // width: "100%",
                        padding: '10px',
                    }}
                >
                    {
                      contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                        <PropertiesInformation                           
                          ownerUID={contactDetails[currentIndex]?.contact_uid}                       

                          owner={contactDetails[currentIndex]}
                        />
                      ) :
                      <></>
                    }
                    
                </Paper>
            </Grid>                     
        </Grid>                     
    </Grid>    
  
  );
}

const PaymentsInformation = ({ owner }) => {      

  console.log("PaymentsInformation - owner - ", owner);    
  const payments = owner?.total_paid != null ? JSON.parse(owner?.total_paid) : [];
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






const PropertiesInformation = ({ owner }) => {  
   
  const activeProperties = owner?.properties != null ? JSON.parse(owner?.properties).filter( property => property.contract_status === "ACTIVE") : [];


return (
  <Container disableGutters sx={{height: '100%', }}>
    <Grid container sx={{paddingLeft: '10px', }}>
      <Grid item xs={12}>
        <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: '#160449', marginTop: '10px', }}>
          YOU MANAGE {activeProperties?.length} OF THEIR PROPERTIES
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
  console.log("ROHIT - PropertiesDataGrid - props.data -", data);
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
          getRowId={ row => row.property_uid}
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
            {type == "maintenance" && contactDetails?.business_email}
            {type == "employee" && contactDetails?.employee_email}
          </Typography>
        </Grid>
        <Grid container direction='row' item xs={12} alignContent='center' >
          <img src={PhoneIcon} alt="phone" />        
          <Typography sx={{color: '#160449', }}>
            {/* { contactDetails?.owner_phone_number} */}
            {type == "owner" && contactDetails?.owner_phone_number}
            {type == "tenant" && contactDetails?.tenant_phone_number}
            {type == "maintenance" && contactDetails?.business_phone_number}
            {type == "employee" && contactDetails?.employee_phone_number}
            
          </Typography>
        </Grid>
        <Grid container direction='row' item xs={12} alignItems='center' >
          <img src={AddressIcon} alt="address" />
            
          <Typography sx={{color: '#160449', }}>          
            {/* { contactDetails?.owner_address + ', ' + contactDetails?.owner_city + ', ' + contactDetails?.owner_state + ', ' + contactDetails?.owner_zip } */}

            {type == "owner" && contactDetails?.owner_address + ', ' + contactDetails?.owner_city + ', ' + contactDetails?.owner_state + ', ' + contactDetails?.owner_zip }
            {type == "tenant" && contactDetails?.tenant_address + ', ' + contactDetails?.tenant_city + ', ' + contactDetails?.tenant_state + ', ' + contactDetails?.tenant_zip }
            {type == "maintenance" && contactDetails?.business_address + ', ' + contactDetails?.business_city + ', ' + contactDetails?.business_state + ', ' + contactDetails?.business_zip }
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
              type != "maintenance" && (
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

const TenantContactDetail = ({ data, currentIndex, setCurrentIndex,  }) => {

  const { selectedRole, getProfileId } = useUser();
  const [ propertiesData, setPropertiesData ] = useState([]);
  const [ contractsData, setContractsData ] = useState([]);
  const [ contactDetails, setContactDetails ] = useState([]);

  useEffect(() => {
    setContactDetails(data)
  }, [data]);


  const getPropertiesData = async () => {
    const url = `${APIConfig.baseURL.dev}/properties/${getProfileId()}`;    
    // setShowSpinner(true);

    await axios
      .get(url)
      .then((resp) => {
        const data = resp.data;
        // console.log("properties endpoint - data - ", data);
        setPropertiesData(data);        
        // setShowSpinner(false);
      })
      .catch((e) => {
        console.error(e);
        // setShowSpinner(false);
      });

  }

  const getContractsData = async () => {    
    // const url = `http://localhost:4000/contracts/${getProfileId()}`;
    const url = `${APIConfig.baseURL.dev}/contracts/${getProfileId()}`;    
    // setShowSpinner(true);

    await axios
      .get(url)
      .then((resp) => {
        const data = resp.data?.result;
        // console.log("properties endpoint - data - ", data);
        setContractsData(data);        
        // setShowSpinner(false);
      })
      .catch((e) => {
        console.error(e);
        // setShowSpinner(false);
      });

  }

  useEffect( () => {
    getPropertiesData();
    getContractsData();
  }, []);



  return (
    <Grid container sx={{backgroundColor: theme.palette.primary.main,  borderRadius: '10px', padding: '10px', height: '85dvh', overflow: 'auto',  }}>                
        <Grid item xs={12} container justifyContent="center" sx={{ height: '50px',  }}>
            <Typography sx={{fontSize: '35px', fontWeight: 'bold', color: '#160449' }}>
                Tenant Contact
            </Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="center" >
            <Typography sx={{fontSize: '20px', color: '#3D5CAC'}}>
              {currentIndex + 1} of {contactDetails?.length} Tenants
            </Typography>                    
        </Grid>                
        <Grid container item xs={12} direction='row' alignContent='space-between' sx={{backgroundColor: '#160449', borderRadius: '10px', marginBottom: '10px', paddingTop: '5px', paddingBottom: '10px', minHeight: '120.5px',  }}>                            
            <Grid item xs={1}>
                <Box
                    onClick={() => {
                      console.log("Previous button clicked", currentIndex, contactDetails.length);
                      currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : setCurrentIndex(contactDetails.length - 1);
                    }}
                    sx={{
                      paddingLeft: '10px',
                    }}
                >
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z"
                        fill={theme.typography.secondary.white}
                        />
                    </svg>
                </Box>
            </Grid>
            <Grid container direction='row' item xs={10} >
                <Grid item xs={12} container justifyContent="center">
                  <Typography sx={{fontSize: '25px', fontWeight: 'bold', color: '#F2F2F2' }}>
                  {`
                    ${(contactDetails && contactDetails[currentIndex]?.contact_first_name) ? contactDetails[currentIndex]?.contact_first_name : ""}
                    ${(contactDetails && contactDetails[currentIndex]?.contact_last_name) ? contactDetails[currentIndex]?.contact_last_name : ""}
                  `}
                  </Typography>
                </Grid>
                <Grid item xs={12} container justifyContent="center">
                  <Box
                    sx={{
                      backgroundColor: "#A9A9A9",
                      height: "68px",
                      width: "68px",
                      borderRadius: "68px",
                      // marginTop: "-34px",
                    }}
                  >
                  <img
                    src={(contactDetails && contactDetails[currentIndex]?.contact_photo_url) ? contactDetails[currentIndex].contact_photo_url : User_fill}
                    alt="profile placeholder"
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "68px",
                      margin: "4px",
                    }}
                  />
                  </Box>
                </Grid>
            </Grid>
            <Grid item xs={1}  container justifyContent='flex-end'>
                <Box
                    onClick={() => {
                      console.log("Next button clicked");
                      currentIndex < contactDetails.length - 1 ? setCurrentIndex(currentIndex + 1) : setCurrentIndex(0);
                    }}
                    sx={{
                      paddingRight: '10px',
                    }}
                >
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z"
                        fill={theme.typography.secondary.white}
                        />
                    </svg>
                </Box>
            </Grid>
        </Grid>
        <Grid container item xs={12} columnSpacing={5} rowSpacing={1} sx={{ }}>
            <Grid item xs={12}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        minHeight: 230,
                        // maxHeight: 230, 
                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        // width: "100%",
                        padding: '10px',
                    }}
                >
                    {
                      contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                        <ProfileInformation contactDetails={contactDetails[currentIndex]} type="tenant" />
                      ) :
                      <></>
                    }
                    
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        minHeight: 370,

                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        // width: "100%",
                        padding: '10px',
                    }}
                >
                    {
                      contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                        <TenantPropertyInformation 
                          propertyData={contactDetails[currentIndex]?.property}
                          index={0}
                        />
                      ) :
                      <></>
                    }
                    
                </Paper>
            </Grid>                     
        </Grid>                     
    </Grid>    
  
  );
}

const TenantPropertyInformation = ({ propertyData, index }) => {
  const properties = propertyData != null? JSON.parse(propertyData).filter(property => property.lease_status === "ACTIVE") : []
  const [ currentIndex, setCurrentIndex ] = useState(index);

  console.log("TenantPropertyInformation - properties - ", properties);


  return (
    <Grid container sx={{ borderRadius: '10px', padding: '0px', }}>                        
        <Grid item xs={12} container justifyContent="center" >
            <Typography sx={{fontSize: '15px', color: '#3D5CAC'}}>
              {properties?.length > 0 ? currentIndex + 1 : 0} of {properties?.length} Properties
            </Typography>                    
        </Grid>                
        <Grid container item xs={12} direction='row' alignContent='space-between' sx={{ borderRadius: '10px', marginBottom: '10px', paddingTop: '5px', paddingBottom: '10px', minHeight: '120.5px',  }}>                            
            <Grid item xs={1} justifyContent='flex-start' alignContent="center">
                <Box
                    onClick={() => {
                      console.log("Previous button clicked", currentIndex, properties.length);
                      currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : setCurrentIndex(properties.length - 1);
                    }}
                    sx={{
                      paddingLeft: '10px',
                    }}
                >                    
                    <KeyboardArrowLeft 
                      // fontSize="large" 
                      sx={{ color: '#3D5CAC',fontSize: '48px' }}
                    />
                </Box>
            </Grid>
            <Grid item xs={2}>
              <Box>
                <img src={(properties && properties[currentIndex]?.property_favorite_image) ? properties[currentIndex]?.property_favorite_image : defaultHouseImage} alt="Description" style={{ width: '100%', height: 'auto' }} />
              </Box>
            </Grid>

            <Grid container direction='row' item xs={7} alignContent="center">
                <Grid item xs={12} container justifyContent="center">
                  <Typography sx={{fontSize: '20px', fontWeight: 'bold', color: '#160449', margin: '20px', }}>
                  {`
                    ${(properties && properties[currentIndex]?.property_address) ? properties[currentIndex]?.property_address : ""}
                    # ${(properties && properties[currentIndex]?.property_unit) ? properties[currentIndex]?.property_unit : ""},
                    ${(properties && properties[currentIndex]?.property_city) ? properties[currentIndex]?.property_city : ""},
                    ${(properties && properties[currentIndex]?.property_state) ? properties[currentIndex]?.property_state : ""}
                    ${(properties && properties[currentIndex]?.property_zip) ? properties[currentIndex]?.property_zip : ""}
                  `}
                  </Typography>
                </Grid>
                {/* <Grid item xs={12} container justifyContent="center">
                  <Box
                    sx={{
                      backgroundColor: "#A9A9A9",
                      height: "68px",
                      width: "68px",
                      borderRadius: "68px",
                      // marginTop: "-34px",
                    }}
                  >
                  <img
                    src={(contactDetails && contactDetails[currentIndex]?.contact_photo_url) ? contactDetails[currentIndex].contact_photo_url : User_fill}
                    alt="profile placeholder"
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "68px",
                      margin: "4px",
                    }}
                  />
                  </Box>
                </Grid> */}
            </Grid>
            <Grid item xs={1} alignContent="center" >
              <Badge
                overlap="circular"
                color="error"
                badgeContent={ (properties && properties[currentIndex]?.maintenance_count) ? properties[currentIndex]?.maintenance_count : 0}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                style={{
                  color: "#000000",
                  width: "35px",
                  height: "20px",
                  fontSize: "5px", 
                }}
              >
                <Button
                  // onClick={() => navigate("/maintenance")}
                  sx={{ border: "none", "&:hover, &:focus, &:active": { backgroundColor: "#d6d5da" }, alignContent: "left", justifyContent: "left" }}
                >
                  <img src={maintenanceIcon} alt="maintenance icon" style={{ width: "45px", height: "45px" }} />
                </Button>
              </Badge>
            </Grid>
            <Grid item xs={1}  container justifyContent='flex-end'  alignContent="center">
                <Box
                    onClick={() => {
                      console.log("Next button clicked");
                      currentIndex < properties.length - 1 ? setCurrentIndex(currentIndex + 1) : setCurrentIndex(0);
                    }}
                    sx={{
                      paddingRight: '10px',
                    }}
                >                    
                    <KeyboardArrowRight                       
                      sx={{ color: '#3D5CAC',fontSize: '48px' }}
                    />
                </Box>
            </Grid>                        
        </Grid> 
        <Grid container direction='row' item xs={12}>
               
          <Grid container item xs={12} md={6} sx={{ paddingLeft: '10px',  }}>
            <Grid container item xs={12} justifyContent='center'>
              <Typography sx={{fontSize: '20px', color: '#160449', fontWeight: 'bold', }}>
                Occupants
              </Typography>
            </Grid>              
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '20px', color: '#3D5CAC'}}>
                {properties[currentIndex]?.lease_adults?.length} Adult(s)
              </Typography>
              {
                properties[currentIndex]?.lease_adults?.map( adult => (
                  <Typography sx={{ fontSize: '16px', color: '#3D5CAC'}}>
                    {`${adult?.name} ${adult?.last_name} | ${adult?.relationship} | DOB: `}
                  </Typography>
                ))
              }
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontSize: '20px', color: '#3D5CAC'}}>
                {properties[currentIndex]?.lease_children?.length} Children
              </Typography>
              {
                properties[currentIndex]?.lease_children?.map( child => (
                  <Typography sx={{ fontSize: '16px', color: '#3D5CAC'}}>
                    {`${child?.name} ${child?.last_name} | ${child?.relationship} | DOB: `}
                  </Typography>
                ))
              }
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontSize: '20px', color: '#3D5CAC'}}>
                {properties[currentIndex]?.lease_pets?.length} Pet(s)
              </Typography>
              {
                properties[currentIndex]?.lease_pets?.map( pet => (
                  <Typography sx={{ fontSize: '16px', color: '#3D5CAC'}}>
                    {`${pet?.name} | ${pet?.type} | ${pet?.weight} lbs`}
                  </Typography>
                ))
              }
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontSize: '20px', color: '#3D5CAC'}}>
                {properties[currentIndex]?.lease_vehicles?.length} Vehicle(s)
              </Typography>
              {
                properties[currentIndex]?.lease_vehicles?.map( vehicle => (
                  <Typography sx={{ fontSize: '16px', color: '#3D5CAC'}}>
                    {`${vehicle?.year} ${vehicle?.make} ${vehicle?.model} | ${vehicle?.license} | ${vehicle?.state}`}
                  </Typography>
                ))
              }
            </Grid>

            <Grid container item xs={12} justifyContent='center'>
              <Typography sx={{fontSize: '20px', color: '#160449', fontWeight: 'bold', }}>
                Lease Details
              </Typography>
            </Grid>              
          </Grid>
          <Grid container item xs={12} md={6} rowSpacing={0} columnGap={0} columnSpacing={0} rowGap={0}>
            <Grid container item xs={12} justifyContent='center' sx={{ height: '25px',}}>
              <Typography sx={{fontSize: '20px', color: '#160449', fontWeight: 'bold', margin: '0px',  }}>
                Rent History
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{padding: '0px',}}>
              <RentHistoryDataGrid data={properties[currentIndex]?.rent_payments}/>
            </Grid>              
          </Grid>
        </Grid>
        {/* <Grid container item xs={12} columnSpacing={5} rowSpacing={1} sx={{ }}>
            <Grid item xs={12}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        minHeight: 230,
                        // maxHeight: 230, 
                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        // width: "100%",
                        padding: '10px',
                    }}
                >
                    {
                      contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                        <ProfileInformation contactDetails={contactDetails[currentIndex]} type="tenant" />
                      ) :
                      <></>
                    }
                    
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        minHeight: 370,

                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        // width: "100%",
                        padding: '10px',
                    }}
                >
                    {
                      contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                        <TenantPropertyInformation 
                          propertyData={contactDetails[currentIndex]?.property}
                        />
                      ) :
                      <></>
                    }
                    
                </Paper>
            </Grid>                     
        </Grid>                      */}
    </Grid>    
  );
}

const RentHistoryDataGrid = ({ data }) => {
  console.log("ROHIT - RentHistoryDataGrid - props.data -", data);
  
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
      field: 'latest_date',
      headerName: 'Paid',
      renderHeader: () => (
        <Typography sx={{ fontSize: '15px', color: "#160449", fontWeight: 'bold', }}>
          {'Paid'}          
        </Typography>        
      ),       
      // width: 200,
      flex: 0.5,
      renderCell: (params) => (
        <Typography sx={{ fontSize: '14px', color: '#160449', }}>
          {`${params.row.latest_date}`}
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
      field: 'purchase_status',
      headerName: 'Rent Status',       
      renderHeader: () => (
        <Typography sx={{ fontSize: '15px', color: "#160449", fontWeight: 'bold', }}>
          {'Rent Status'}          
        </Typography>        
      ),
      // width: 200,
      flex: 0.5,
      renderCell: (params) => (
        <Typography sx={{ fontSize: '14px', color: '#160449', }}>
          {`${params.row.purchase_status}`}
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
        getRowId={ row => row.cf_month}
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

const MaintenanceContactDetail = ({ data, currentIndex, setCurrentIndex,  }) => {

  const { selectedRole, getProfileId } = useUser();
  const [ propertiesData, setPropertiesData ] = useState([]);
  const [ contractsData, setContractsData ] = useState([]);
  const [ contactDetails, setContactDetails ] = useState([]);

  useEffect(() => {
    setContactDetails(data)
  }, [data]);


  const getPropertiesData = async () => {
    const url = `${APIConfig.baseURL.dev}/properties/${getProfileId()}`;    
    // setShowSpinner(true);

    await axios
      .get(url)
      .then((resp) => {
        const data = resp.data;
        // console.log("properties endpoint - data - ", data);
        setPropertiesData(data);        
        // setShowSpinner(false);
      })
      .catch((e) => {
        console.error(e);
        // setShowSpinner(false);
      });

  }

  const getContractsData = async () => {    
    // const url = `http://localhost:4000/contracts/${getProfileId()}`;
    const url = `${APIConfig.baseURL.dev}/contracts/${getProfileId()}`;    
    // setShowSpinner(true);

    await axios
      .get(url)
      .then((resp) => {
        const data = resp.data?.result;
        // console.log("properties endpoint - data - ", data);
        setContractsData(data);        
        // setShowSpinner(false);
      })
      .catch((e) => {
        console.error(e);
        // setShowSpinner(false);
      });

  }

  useEffect( () => {
    getPropertiesData();
    getContractsData();
  }, []);



  return (
    <Grid container sx={{backgroundColor: theme.palette.primary.main,  borderRadius: '10px', padding: '10px', }}>                
        <Grid item xs={12} container justifyContent="center" sx={{ height: '50px',  }}>
            <Typography sx={{fontSize: '35px', fontWeight: 'bold', color: '#160449' }}>
                Maintenance Contact
            </Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="center" >
            <Typography sx={{fontSize: '20px', color: '#3D5CAC'}}>
              {currentIndex + 1} of {contactDetails?.length} Maintenance Contacts
            </Typography>                    
        </Grid>                
        <Grid container item xs={12} direction='row' alignContent='space-between' sx={{backgroundColor: '#A52A2A', borderRadius: '10px', marginBottom: '10px', paddingTop: '5px', paddingBottom: '10px', minHeight: '120.5px', }}>                            
            <Grid item xs={1}>
                <Box
                    onClick={() => {
                      console.log("Previous button clicked", currentIndex, contactDetails.length);
                      currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : setCurrentIndex(contactDetails.length - 1);
                    }}
                    sx={{
                      paddingLeft: '10px',
                    }}
                >
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z"
                        fill={theme.typography.secondary.white}
                        />
                    </svg>
                </Box>
            </Grid>
            <Grid container direction='row' item xs={10} >
                <Grid item xs={12} container justifyContent="center">
                  <Typography sx={{fontSize: '25px', fontWeight: 'bold', color: '#F2F2F2' }}>
                  {`
                    ${(contactDetails && contactDetails[currentIndex]?.business_name) ? contactDetails[currentIndex]?.business_name : ""}                    
                  `}
                  </Typography>
                </Grid>
                <Grid item xs={12} container justifyContent="center">
                  <Box
                    sx={{
                      backgroundColor: "#A9A9A9",
                      height: "68px",
                      width: "68px",
                      borderRadius: "68px",
                      // marginTop: "-34px",
                    }}
                  >
                  <img
                    src={(contactDetails && contactDetails[currentIndex]?.contact_photo_url) ? contactDetails[currentIndex].contact_photo_url : User_fill}
                    alt="profile placeholder"
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "68px",
                      margin: "4px",
                    }}
                  />
                  </Box>
                </Grid>
            </Grid>
            <Grid item xs={1}  container justifyContent='flex-end'>
                <Box
                    onClick={() => {
                      console.log("Next button clicked");
                      currentIndex < contactDetails.length - 1 ? setCurrentIndex(currentIndex + 1) : setCurrentIndex(0);
                    }}
                    sx={{
                      paddingRight: '10px',
                    }}
                >
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z"
                        fill={theme.typography.secondary.white}
                        />
                    </svg>
                </Box>
            </Grid>
        </Grid>
        <Grid container item xs={12} columnSpacing={1} rowSpacing={1}>
            <Grid item xs={12}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        minHeight: 230,
                        // maxHeight: 230, 
                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        // width: "100%",
                        padding: '10px',
                    }}
                >
                    {
                      contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                        <ProfileInformation contactDetails={contactDetails[currentIndex]} type="maintenance"/>
                      ) :
                      <></>
                    }
                    
                </Paper>
            </Grid>
            <Grid container item xs={12} columnSpacing={1}>
              <Grid item xs={12} md={6}>
                  <Paper
                      elevation={0}
                      style={{
                          // margin: '50p', // Add margin here
                          borderRadius: "10px",
                          backgroundColor: "#D6D5DA",
                          height: 100,
                          overflowY: 'auto',
                          scrollbarWidth: 'none',

                          // [theme.breakpoints.down("sm")]: {
                          //     width: "80%",
                          // },
                          // [theme.breakpoints.up("sm")]: {
                          //     width: "50%",
                          // },
                          // width: "100%",
                          padding: '10px',
                      }}
                  >
                      {/* {
                        contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                          <PropertiesInformation 
                            propertiesData={propertiesData} 
                            contractsData={contractsData}
                            ownerUID={contactDetails[currentIndex]?.contact_uid}                       
                          />
                        ) :
                        <></>
                      } */}
                      <Typography sx={{fontSize: '20px', color: '#160449', fontWeight: 'bold', }}>
                        {
                          contactDetails && contactDetails[currentIndex]?.business_services_fees ? (
                            <>
                              Category: <Typography component="span" sx={{fontSize: '20px', color: '#160449', }}>{JSON.parse(contactDetails[currentIndex]?.business_services_fees).map(fee => fee.service_name).join(', ')}</Typography>
                            </>
                          ) : (
                            <>Category: </>
                          )
                        }
                      </Typography>

                      <Typography sx={{fontSize: '20px', color: '#160449', fontWeight: 'bold', }}>
                        {
                          contactDetails && contactDetails[currentIndex]?.business_locations ? (
                            <>
                              Service Locations: <Typography component="span" sx={{fontSize: '20px', color: '#160449', }}>{JSON.parse(contactDetails[currentIndex]?.business_locations).map(location => (`${location.city}, ${location.state} (+-${location.miles} miles)` )).join(', ')}</Typography>
                            </>
                          ) : (
                            <>Service Locations: </>
                          )
                        }
                      </Typography>
                      
                  </Paper>
              </Grid>
            
            
              <Grid item xs={12} md={6} >
                  <Paper
                      elevation={0}
                      style={{
                          // margin: '50p', // Add margin here
                          borderRadius: "10px",
                          backgroundColor: "#D6D5DA",
                          minHeight: 100,                                                                                                        

                          // [theme.breakpoints.down("sm")]: {
                          //     width: "80%",
                          // },
                          // [theme.breakpoints.up("sm")]: {
                          //     width: "50%",
                          // },
                          // width: "100%",
                          padding: '10px',
                      }}
                  >
                      
                      
                      
                  </Paper>
              </Grid>
            </Grid>    
            <Grid item xs={12} md={6}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        minHeight: 260,

                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        // width: "100%",
                        padding: '10px',
                    }}
                >
                    {
                        contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                          // <PropertiesInformation 
                          //   propertiesData={propertiesData} 
                          //   contractsData={contractsData}
                          //   ownerUID={contactDetails[currentIndex]?.contact_uid}                       
                          // />
                          <WorkOrdersAccordion data={contactDetails}/>
                        ) :
                        <></>
                      }
                    
                </Paper>
            </Grid>  
                  
            <Grid item xs={12} md={6}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        minHeight: 260,

                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        // width: "100%",
                        padding: '10px',
                    }}
                >
                    {/* {
                      contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                        <PropertiesInformation 
                          propertiesData={propertiesData} 
                          contractsData={contractsData}
                          ownerUID={contactDetails[currentIndex]?.contact_uid}                       
                        />
                      ) :
                      <></>
                    } */}
                    
                </Paper>
            </Grid>             
        </Grid>                     
    </Grid>    
  
  );
}

const WorkOrdersAccordion = ({ data }) => {
  const colorStatus = theme.colorStatusMM;

  const maintenanceScheduled = data?.find( maintenance => maintenance.maintenance_status === "SCHEDULED")  
  const maintenanceRequested = data?.find( maintenance => maintenance.maintenance_status === "NEW")
  const maintenanceSubmitted = data?.find( maintenance => maintenance.maintenance_status === "SUBMITTED")
  const maintenanceAccepted = data?.find( maintenance => maintenance.maintenance_status === "ACCEPTED")
  const maintenanceFinished = data?.find( maintenance => maintenance.maintenance_status === "FINISHED")
  const maintenancePaid = data?.find( maintenance => maintenance.maintenance_status === "PAID")

  const maintenanceRequests = {
    'SCHEDULED': maintenanceScheduled,
    'REQUESTED': maintenanceRequested,
    'SUBMITTED': maintenanceSubmitted,
    'ACCEPTED': maintenanceAccepted,
    'FINISHED': maintenanceFinished,
    'PAID': maintenancePaid,
  }


  console.log("ROHIT - maintenanceRequests - ", maintenanceRequests);

  const [showSpinner, setShowSpinner] = useState(false);
  const { getProfileId } = useUser();
  // const [maintenanceRequests, setMaintenanceRequests] = useState({});
  const [query, setQuery] = useState("");

  // useEffect(() => {
  //     const dataObject = {};        
  
  //     const getMaintenanceData = async () => {
  //         setShowSpinner(true);
  //         const maintenanceRequests1 = await fetch(`${APIConfig.baseURL.dev}/maintenanceStatus/${getProfileId()}`);
  //         const maintenanceRequestsData1 = await maintenanceRequests1.json();
  
  //         let array1 = maintenanceRequestsData1.result?.REQUESTED?.maintenance_items ?? [];
  //         let array2 = maintenanceRequestsData1.result?.SUBMITTED?.maintenance_items ?? [];
          
  //         // This removes rejected quotes and adds it to another array.
  //         // let rejectedQuotes = [];
  //         // for (let i = 0; i < array2.length; i++) {
  //         //     let item = array2[i];
  //         //     if (item.quote_status === "REJECTED") {
  //         //         rejectedQuotes.push(item);
  //         //         array2.splice(i, 1);
  //         //         i--;
  //         //     }
  //         // }
  //         let array3 = maintenanceRequestsData1.result?.ACCEPTED?.maintenance_items ?? [];
  //         let array4 = maintenanceRequestsData1.result?.SCHEDULED?.maintenance_items ?? [];
  //         let array5 = maintenanceRequestsData1.result?.FINISHED?.maintenance_items ?? [];
  //         let array6 = maintenanceRequestsData1.result?.PAID?.maintenance_items ?? [];
  
  //         dataObject["REQUESTED"] = [...array1];
  //         dataObject["SUBMITTED"] = [...array2];
  //         dataObject["ACCEPTED"] = [...array3];
  //         dataObject["SCHEDULED"] = [...array4];
  //         dataObject["FINISHED"] = [...array5];
  //         dataObject["PAID"] = [...array6];
  
  //         // dataObject["REJECTED"] = [...rejectedQuotes];
  
  //         // console.log("dataObject from new api call", dataObject)
  //         setMaintenanceRequests((prevData) => ({
  //             ...prevData,
  //             ...dataObject,
  //         }));
  //         setShowSpinner(false);
  //     };
  //         getMaintenanceData();            
  //   }, []);

    function handleFilter(filterString, searchArray) {
      let filteredArray = [];
      if (filterString === "All" || filterString === "") {
        filteredArray = searchArray;
      } else {
        filteredArray = searchArray.filter((item) => item.maintenance_title === filterString);
      }
      return filteredArray;
    }

  return (
      <>
          <Grid item xs={12} sx={{width: '90%', margin: 'auto',}}>
              {colorStatus.map((item, index) => {
                  let mappingKey = item.mapping;

                  let maintenanceArray = maintenanceRequests[mappingKey] || [];

                  let filteredArray = handleFilter(query, maintenanceRequests[mappingKey]);
                  // console.log("[DEBUG] MaintenanceWorkerDashboardWidget.jsx before MaintenanceStatusTable01")

                  return (
                  <WorkerMaintenanceStatusTable
                      key={index}
                      status={item.status}
                      color={item.color}
                      maintenanceItemsForStatus={maintenanceArray}
                      allMaintenanceData={maintenanceRequests}
                      maintenanceRequestsCount={maintenanceArray}
                  />
                  );
              })}
          </Grid>
      </>
  )
}

const getChipColor = (priority) => {
  switch (priority) {
    case "High":
      return "#A52A2A";
    case "Medium":
      return "#FF8A00";
    case "Low":
      return "#FFC614";
    case "REJECTED":
      return "#A52A2A";
    case "WITHDRAWN":
      return "#FF8A00";
    case "SENT":
      return "#FFC614";
    case "ACCEPTED":
      return "#4CAF50";
    default:
      return "default";
  }
};

const WorkerMaintenanceStatusTable = ({ status, color, maintenanceItemsForStatus, allMaintenanceData, maintenanceRequestsCount }) => {
  const location = useLocation();
  let navigate = useNavigate();

  console.log("ROHIT - maintenanceItemsForStatus - ", maintenanceItemsForStatus);
  // console.log("MaintenanceStatusTable", status, color, maintenanceItemsForStatus)

  const tableTextStyle = {
    backgroundColor: color,
    color: "#FFFFFF",
    fontFamily: "Source Sans Pro",
    fontSize: "15px",
    fontWeight: 600,
  };

  const columns = [
    {
      headerName: "Property",
      field: "property_name",
      renderCell: (params) => {
        return `${params.row.property_address} ${params.row.property_unit}`;
      },
      flex: 1,
      minWidth: 175,
    },
    {
      headerName: "Type",
      field: "maintenance_request_type",
      flex: 1,
      hide: true,
      minWidth: 100,
    },
    {
      headerName: "Priority",
      field: "maintenance_priority",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        return <Chip label={params.value} size="small" style={{ backgroundColor: getChipColor(params.value), color: "white" }} />;
      },
    },
    {
      headerName: "Status",
      field: "quote_status",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        return <Chip label={params.value} size="small" style={{ backgroundColor: getChipColor(params.value), color: "white" }} />;
      },
    },
    {
      headerName: "Title",
      field: "maintenance_title",
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "ID",
      field: "maintenance_request_uid",
      flex: 0.5,
      minWidth: 75,
      renderCell: (params) => {
        return `${params.row.maintenance_request_uid.substr(params.row.maintenance_request_uid.length - 3)}`;
      },
    },
    {
      headerName: "Date Created",
      field: "maintenance_request_created_date",
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: "Scheduled Date",
      field: "maintenance_scheduled_date",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const scheduledDate = params.row.maintenance_scheduled_date;
        return scheduledDate && scheduledDate !== "null" ? dayjs(params.row.maintenance_scheduled_date).format("MM-DD-YYYY") : "N/A";
      },
    },
    {
      headerName: "Scheduled Time",
      field: "maintenance_scheduled_time",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const scheduledTime = params.row.maintenance_scheduled_date;
        return scheduledTime && scheduledTime !== "null" ? dayjs(params.row.maintenance_scheduled_time, "HH:mm").format("h:mm A") : "N/A";
      },
    },
  ];

  function handleRequestDetailPage(maintenance_request_index, property_uid, maintenance_request_uid) {
    // console.log("handleRequestDetailPage")
    // console.log("maintenance_request_index", maintenance_request_index)
    // console.log("status", status)
    // console.log("maintenanceItemsForStatus", maintenanceItemsForStatus)
    // console.log("allMaintenanceData", allMaintenanceData)

    navigate(`/workerMaintenance/detail`, {
      state: {
        maintenance_request_index,
        status,
        maintenanceItemsForStatus,
        allMaintenanceData,
      },
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Accordion
        sx={{
          backgroundColor: color,
          boxShadow: "none",
        }}
      >
        <AccordionSummary
          sx={{
            flexDirection: "row", // Changed this from 'row-reverse'
            "& .MuiIconButton-edgeEnd": {
              // This targets the IconButton
              marginLeft: "auto", // This pushes the IconButton to the right
            },
          }}
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              backgroundColor: color,
              color: "#FFFFFF",
              fontFamily: "Source Sans Pro",
              fontSize: "18px",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              paddingRight: "10px",
              alignItems: "center",
              position: "sticky",
              paddingTop: "5px",
              paddingLeft: "15px",
            }}
          >
            <p>{status}</p>
            <span style={{ float: "right", alignContent: "center", alignItems: "center" }}>
              {/* {maintenanceItemsForStatus ? maintenanceItemsForStatus.length : maintenanceRequestsCount ? maintenanceRequestsCount : 0} */}
              {maintenanceItemsForStatus && maintenanceItemsForStatus["COUNT(quote_status)"]? maintenanceItemsForStatus["COUNT(quote_status)"] :  0}
              {/* {2000} */}
            </span>
          </div>
        </AccordionSummary>
        {maintenanceItemsForStatus.length !== 0 ? (
          <AccordionDetails>
            <DataGrid
              rows={maintenanceItemsForStatus}
              columns={columns}
              rowHeight={50}
              hideFooter={true}
              sx={{
                "& .MuiDataGrid-cell": {
                  fontSize: "14px", // Change the font size
                  fontWeight: theme.typography.common.fontWeight, // Change the font weight
                  color: theme.typography.secondary.white,
                },
                "& .MuiDataGrid-columnHeaders": {
                  fontSize: "16px", // Change the font size
                  fontWeight: theme.typography.common.fontWeight, // Change the font weight
                  color: theme.typography.secondary.white, // Change the font color of the headers
                },
                border: 0,
                "& .MuiDataGrid-main": {
                  border: 0, // Removes the inner border
                },
                "& .MuiDataGrid-row:last-child .MuiDataGrid-cell": {
                  borderBottom: "none", // Removes the border of the last row
                },
                "& .MuiDataGrid-columnSeparator": {
                  display: "none", // Remove vertical borders in the header
                },
              }}
              disableExtendRowFullWidth={true}
              getRowId={(row) => row.maintenance_request_uid}
              pageSizeOptions={[5]}
              onRowClick={(params) => {
                const index = maintenanceItemsForStatus.findIndex((row) => row.maintenance_request_uid === params.row.maintenance_request_uid);
                handleRequestDetailPage(index, params.row.property_uid, params.row.maintenance_request_uid);
              }}
            />
          </AccordionDetails>
        ) : null}
      </Accordion>
    </ThemeProvider>
  );
}

const EmployeeContactDetail = ({ data, currentIndex, setCurrentIndex,  }) => {

  const { selectedRole, getProfileId } = useUser();
  const [ propertiesData, setPropertiesData ] = useState([]);
  const [ contractsData, setContractsData ] = useState([]);
  const [ contactDetails, setContactDetails ] = useState([]);

  useEffect(() => {
    setContactDetails(data)
  }, [data]);

  return (
    <Grid container sx={{backgroundColor: theme.palette.primary.main,  borderRadius: '10px', padding: '10px', }}>                
        <Grid item xs={12} container justifyContent="center" sx={{ height: '50px',  }}>
            <Typography sx={{fontSize: '35px', fontWeight: 'bold', color: '#160449' }}>
                Employee Contact
            </Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="center" >
            <Typography sx={{fontSize: '20px', color: '#FF8A00'}}>
              {currentIndex + 1} of {contactDetails?.length} Employee Contacts
            </Typography>                    
        </Grid>                
        <Grid container item xs={12} direction='row' alignContent='space-between' sx={{backgroundColor: '#FF8A00', borderRadius: '10px', marginBottom: '10px', paddingTop: '5px', paddingBottom: '10px', minHeight: '120.5px', }}>                            
            <Grid item xs={1}>
                <Box
                    onClick={() => {
                      console.log("Previous button clicked", currentIndex, contactDetails.length);
                      currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : setCurrentIndex(contactDetails.length - 1);
                    }}
                    sx={{
                      paddingLeft: '10px',
                    }}
                >
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z"
                        fill={theme.typography.secondary.white}
                        />
                    </svg>
                </Box>
            </Grid>
            <Grid container direction='row' item xs={10} >
                <Grid item xs={12} container justifyContent="center">
                  <Typography sx={{fontSize: '25px', fontWeight: 'bold', color: '#F2F2F2' }}>
                  {`
                    ${(contactDetails && contactDetails[currentIndex]?.employee_first_name) ? contactDetails[currentIndex]?.employee_first_name : ""}
                    ${(contactDetails && contactDetails[currentIndex]?.employee_last_name) ? contactDetails[currentIndex]?.employee_last_name : ""}
                  `}
                  </Typography>
                </Grid>
                <Grid item xs={12} container justifyContent="center">
                  <Box
                    sx={{
                      backgroundColor: "#A9A9A9",
                      height: "68px",
                      width: "68px",
                      borderRadius: "68px",
                      // marginTop: "-34px",
                    }}
                  >
                  <img
                    src={(contactDetails && contactDetails[currentIndex]?.employee_photo_url) ? contactDetails[currentIndex]?.employee_photo_url : User_fill}
                    alt="profile placeholder"
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "68px",
                      margin: "4px",
                    }}
                  />
                  </Box>
                </Grid>
            </Grid>
            <Grid item xs={1}  container justifyContent='flex-end'>
                <Box
                    onClick={() => {
                      console.log("Next button clicked");
                      currentIndex < contactDetails.length - 1 ? setCurrentIndex(currentIndex + 1) : setCurrentIndex(0);
                    }}
                    sx={{
                      paddingRight: '10px',
                    }}
                >
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z"
                        fill={theme.typography.secondary.white}
                        />
                    </svg>
                </Box>
            </Grid>
        </Grid>
        <Grid container item xs={12} columnSpacing={1} rowSpacing={1}>
            <Grid item xs={12}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        minHeight: 230,
                        // maxHeight: 230, 
                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        // width: "100%",
                        padding: '10px',
                    }}
                >
                    {
                      contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                        <ProfileInformation contactDetails={contactDetails[currentIndex]} type="employee"/>
                      ) :
                      <></>
                    }
                    
                </Paper>
            </Grid>                         
        </Grid>                     
    </Grid>    
  
  );
}


const OwnerContactsCard = (props) => {
  const owner = props.data;
  const handleSetSelectedCard = props.selected;
  const ownerDataDetailsLength = props.dataDetails;
  const index = props.index;
  const ownerProperties = owner.properties.length > 0? JSON.parse(owner.properties).filter( property => property.contract_status === "ACTIVE") : [];
  const activeProperties = ownerProperties;

  const handleSelection = () => {
    console.log("In handleSelection: ", owner, index);
    handleSetSelectedCard(owner, index);
  };

  return (
    <Stack>
      <Card
        sx={{
          backgroundColor: "#D6D5DA",
          borderRadius: "10px",
          margin: "10px",
          color: "#160449",
        }}
        onClick={handleSelection}
      >
        <CardContent>
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: theme.typography.common.fontWeight,
              }}
            >
              {`
                                ${owner.owner_first_name ? owner.owner_first_name : "<FIRST_NAME>"}
                                ${owner.owner_last_name ? owner.owner_last_name : "<LAST_NAME>"}
                            `}
            </Typography>
            <Button>
              <Message
                sx={{
                  color: theme.typography.common.blue,
                  fontSize: "15px",
                }}
              />
            </Button>
          </Stack>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: theme.typography.common.fontWeight,
            }}
          >
            {activeProperties != null ? activeProperties.length : "<PROPERTY_COUNT>"} Properties
          </Typography>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {owner.owner_email ? owner.owner_email : "<EMAIL>"}
          </Typography>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {owner.owner_phone_number ? formattedPhoneNumber(owner.owner_phone_number) : "<PHONE_NUMBER>"}
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
};

const TenantContactsCard = (props) => {
  const tenant = props.data;
  const handleSetSelectedCard = props.selected;
  const index = props.index;

  const handleSelection = () => {
    handleSetSelectedCard(tenant, index);
  };

  return (
    <Stack>
      <Card
        sx={{
          backgroundColor: "#D6D5DA",
          borderRadius: "10px",
          margin: "10px",
          color: "#160449",
        }}
        onClick={handleSelection}
      >
        <CardContent>
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: theme.typography.common.fontWeight,
              }}
            >
              {`
                                ${tenant.tenant_first_name ? tenant.tenant_first_name : "<FIRST_NAME>"}
                                ${tenant.tenant_last_name ? tenant.tenant_last_name : "<LAST_NAME>"}
                            `}
            </Typography>
            <Button>
              <Message
                sx={{
                  color: theme.typography.common.blue,
                  fontSize: "15px",
                }}
              />
            </Button>
          </Stack>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {tenant.tenant_address ? tenant.tenant_address : "<ADDRESS>"}
          </Typography>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {tenant.tenant_email ? tenant.tenant_email : "<EMAIL>"}
          </Typography>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {tenant.tenant_phone_number
              ? tenant.tenant_phone_number.indexOf("(") > -1
                ? tenant.tenant_phone_number
                : formattedPhoneNumber(tenant.tenant_phone_number)
              : "<PHONE_NUMBER>"}
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
};

const MaintenanceContactsCard = (props) => {
  const business = props.data;
  const handleSetSelectedCard = props.selected;
  const index = props.index;

  const handleSelection = () => {
    handleSetSelectedCard(business, index);
  };
  return (
    <Stack>
      <Card
        sx={{
          backgroundColor: "#D6D5DA",
          borderRadius: "10px",
          margin: "10px",
          color: "#160449",
        }}
        onClick={handleSelection}
      >
        <CardContent>
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: theme.typography.common.fontWeight,
              }}
            >
              {`
                                ${business.business_name ? business.business_name : "<BUSINESS_NAME>"}                                
                            `}
            </Typography>
            <Button>
              <Message
                sx={{
                  color: theme.typography.common.blue,
                  fontSize: "15px",
                }}
              />
            </Button>
          </Stack>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {business.business_email ? business.business_email : "<EMAIL>"}
          </Typography>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {business.business_phone_number
              ? business.business_phone_number.indexOf("(") > -1
                ? business.business_phone_number
                : formattedPhoneNumber(business.business_phone_number)
              : "<PHONE_NUMBER>"}
          </Typography>
          {/* <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
              right: "25px",
              position: "absolute",
            }}
          >
            {business.contact_description ? business.contact_description : "<Category-TBD>"}
          </Typography> */}
        </CardContent>
      </Card>
    </Stack>
  );
};

const EmployeeContactsCard = (props) => {
  const employee = props.data;
  const handleSetSelectedCard = props.selected;
  const index = props.index;

  const handleSelection = () => {
    handleSetSelectedCard(employee, index);
  };
  return (
    <Stack>
      <Card
        sx={{
          backgroundColor: "#D6D5DA",
          borderRadius: "10px",
          margin: "10px",
          color: "#160449",
        }}
        onClick={handleSelection}
      >
        <CardContent>
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: theme.typography.common.fontWeight,
              }}
            >
              {` ${employee.employee_first_name ? employee.employee_first_name : "<FIRST_NAME>"} ${employee.employee_last_name ? employee.employee_last_name : "<FIRST_NAME>"}`}
            </Typography>
            <Button>
              <Message
                sx={{
                  color: theme.typography.common.blue,
                  fontSize: "15px",
                }}
              />
            </Button>
          </Stack>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {employee.employee_email ? employee.employee_email : "<EMAIL>"}
          </Typography>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {employee.employee_phone_number
              ? employee.employee_phone_number.indexOf("(") > -1
                ? employee.employee_phone_number
                : formattedPhoneNumber(employee.employee_phone_number)
              : "<PHONE_NUMBER>"}
          </Typography>
          {/* <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
              right: "25px",
              position: "absolute",
            }}
          >
            {business.contact_description ? business.contact_description : "<Category-TBD>"}
          </Typography> */}
        </CardContent>
      </Card>
    </Stack>
  );
};

// export default PMContactsList;
export default PMContacts;
