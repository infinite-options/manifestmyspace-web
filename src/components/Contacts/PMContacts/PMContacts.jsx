import React, { useEffect, useState } from "react";
import theme from "../../../theme/theme";
// import "./../../css/contacts.css";
import { ThemeProvider, Box, Paper, Stack, Typography, Button, InputAdornment, TextField, Card, CardContent } from "@mui/material";
import { Message, Search } from "@mui/icons-material";
import { getStatusColor } from "../ContactsFunction";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import { DataGrid } from '@mui/x-data-grid';
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from "../../Property/messageIconDark.png";
import PhoneIcon from "../../Property/phoneIconDark.png";
import AddressIcon from "../../Property/addressIconDark.png";
import maintenanceIcon from "../../Property/maintenanceIcon.png";
import User_fill from "../../../images/User_fill_dark.png";
import { maskSSN, maskEIN, formattedPhoneNumber } from "../../utils/privacyMasking";

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
            <Grid item xs={12} sx={{padding: '5px', height: '100%', backgroundColor: 'red', }}>            
                {/* <PMContactsList />             */}
                {/* <PMContactsList2 /> */}
                <PMContactsList3 data={contactsData} setTab={setContactsTab} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
            </Grid>
          </Grid>
          <Grid container item xs={12} md={8} >
            <Grid item xs={12} sx={{padding: '5px', backgroundColor: 'grey'}}>
              {
                contactsTab === "Owner" && <OwnerContactDetail data={contactsData?.owners} contacsTab={contactsTab} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
              }
              {
                contactsTab === "Tenant" && <TenantContactDetail data={contactsData?.tenants} contacsTab={contactsTab} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
              }
              {
                contactsTab === "Maintenance" && <MaintenanceContactDetail data={contactsData?.maintenance} contacsTab={contactsTab} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
              }
            </Grid>                  
          </Grid>
        </Grid>
      </Container>    
  );
}

const PMContactsList3 = ({ data, setTab, currentIndex, setCurrentIndex }) => {
  console.log("In PMContactsList3 - data - ", data)
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
      default:
        break;
    }
  }, [searchTerm, contactsTab, allOwnersData, allTenantsData, allMaintenanceData]);

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
                    fontSize: '15px',
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
                    fontSize: '15px',
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
                    fontSize: '15px',
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
            
            <Grid container item xs={12} justifyContent="center" sx={{ height: '669px', overflow: 'auto', paddingBottom: '10px', backgroundColor: '#FFFFFF',borderRadius: '0px 0px 10px 10px', }}>                                                  
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
                        <OwnerInformation contactDetails={contactDetails[currentIndex]} />
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
                          propertiesData={propertiesData} 
                          contractsData={contractsData}
                          ownerUID={contactDetails[currentIndex]?.contact_uid}                       
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

const PropertiesInformation = ({ propertiesData, contractsData, ownerUID }) => {  
  // console.log("PropertiesInformation - propertiesData - ", propertiesData);    

  const activeProperties = propertiesData?.Property?.result
                            .filter( property => property.owner_uid === ownerUID);    
  const activePropertyUIDs = activeProperties?.map( property => property.property_uid);
  // console.log("PropertiesInformation - activeProperties - ", activeProperties);

  const maintenanceRequests = propertiesData?.MaintenanceRequests?.result.filter( request => activePropertyUIDs.includes(request.maintenance_property_id))
  // console.log("PropertiesInformation - maintenanceRequests - ", maintenanceRequests);

  const mapPropertiesToMaintenanceRequests = (maintenanceRequests)  => {
    const propertyToRequests = {};

    maintenanceRequests?.forEach(request => {
        const propertyId = request.maintenance_property_id;
        if (!propertyToRequests[propertyId]) {
            propertyToRequests[propertyId] = [];
        }
        propertyToRequests[propertyId].push(request);
    });

    return propertyToRequests;
  }

  const maintenanceReqsByProperty = mapPropertiesToMaintenanceRequests(maintenanceRequests);
  // console.log("maintenanceReqsByProperty - ", maintenanceReqsByProperty);

  
  const sentContracts = contractsData?.filter( contract => contract.property_owner_id === ownerUID && contract.contract_status === "SENT");    

  const newContracts = contractsData?.filter( contract => contract.property_owner_id === ownerUID && contract.contract_status === "NEW");    


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
      
      {/* <Grid container item xs={12} sx={{ maxHeight: '60px', overflow: 'auto', }}>
        {
          activeProperties?.map( (property) => {
            return (
              <Grid item xs={12} sx={{ fontSize: '15px', color: '#160449'}}>
                {property.property_address}
              </Grid>
            )
          })
        }            
      </Grid> */}
      <Grid item xs={12} sx={{height: '180px', minHeight: '200px'}}>
        <PropertiesDataGrid data={activeProperties} maintenanceRequests={maintenanceReqsByProperty}/>
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
            New  {`(${newContracts?.length})`}
          </Typography>
        </Button>
      </Grid>
      {/* <Grid container item xs={12} sx={{ maxHeight: '60px', overflow: 'auto', }}>
        {
          newContracts?.map( (contract) => {
            return (
              <Grid item xs={12} sx={{ fontSize: '15px', color: '#160449'}}>
                {contract.property_address}
              </Grid>
            )
          })
        }  
      </Grid> */}
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
            Sent  {`(${sentContracts?.length})`}
          </Typography>
        </Button>          
      </Grid>      
    </Grid>
  </Container>
)

}

const PropertiesDataGrid = ({ data, maintenanceRequests}) => {
  const paymentStatusColorMap = {
    "Paid On Time": theme.palette.priority.clear,
    "Partially Paid": theme.palette.priority.medium,
    "Paid Late": theme.palette.priority.low,
    "Not Paid": theme.palette.priority.high,
    Vacant: "#160449",
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

  const getNumOfMaintenanceReqs = (property_uid) => {
    const count = maintenanceRequests[property_uid]?.length
    if (count == null){
      return 0;
    }
    return count;
  }

  const columns = [
    { 
      field: 'property_address',      
      // width: 200,
      flex: 1,
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
            backgroundColor: getPaymentStatusColor(params.row.rent_status),
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
              {params.row.rent_status}
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
            badgeContent={getNumOfMaintenanceReqs(params.row.property_uid)}
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
    <>
      <DataGrid
        rows={data}
        columns={columns}
        getRowHeight={() => 'auto'}
        slots={{
          columnHeaders: () => null,
        }}      
        getRowId={ row => row.property_uid}
        // initialState={{
        //   pagination: {
        //     paginationModel: {
        //       pageSize: 5,
        //     },
        //   },
        // }}
        // pageSizeOptions={[5]}              
        sx={{          
          border: '0px',
        }}
        hideFooter={true}                
      />
    </>
  );
}

const OwnerInformation = ({ contactDetails }) => {
  const [ paymentMethods, setPaymentMethods ] = useState([]);  

  useEffect( () => {
    console.log("ROHIT - OwnerInformation - contactDetails - ", contactDetails);                        
    setPaymentMethods( JSON.parse(contactDetails?.payment_method || '[]') );    
  }, [contactDetails]);

  useEffect( () => {        
    console.log("ROHIT - OwnerInformation - paymentMethods - ", paymentMethods);        
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
    <Grid container columnSpacing={5}>
      <Grid container item xs={12} md={6}>      
        <Grid item xs={12}>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#160449', }}>
            CONTACT INFORMATION
          </Typography>
        </Grid>
        <Grid container direction='row' item xs={12} alignContent='center' >
          <img src={EmailIcon} alt="email" />        
          <Typography sx={{color: '#160449', }}>
            { contactDetails?.contact_email}
          </Typography>
        </Grid>
        <Grid container direction='row' item xs={12} alignContent='center' >
          <img src={PhoneIcon} alt="phone" />        
          <Typography sx={{color: '#160449', }}>
            { contactDetails?.contact_phone_number}
          </Typography>
        </Grid>
        <Grid container direction='row' item xs={12} alignItems='center' >
          <img src={AddressIcon} alt="address" />
            
          <Typography sx={{color: '#160449', }}>          
            { contactDetails?.contact_address + ', ' + contactDetails?.contact_city + ', ' + contactDetails?.contact_state + ', ' + contactDetails?.contact_zip }
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
          
            <Grid item xs={6} md={8} sx={{padding: '0px',}}>
              <Typography sx={{fontSize: '15px', fontWeight: '600', color: '#160449', }}>
                SSN
              </Typography>
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography sx={{ fontSize: '15px', color: '#160449' }}>
                {contactDetails?.contact_ssn
                  ? (getDecryptedSSN(contactDetails?.contact_ssn))
                  : "No SSN provided"}
              </Typography>
            </Grid>            
            
          

          <Grid container item xs={12}>
            <Grid item xs={6} md={8}>
              <Typography sx={{color: '#160449', fontWeight: '600', }}>
                EIN
              </Typography>                            
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography sx={{ fontSize: '15px', color: '#160449',}}>
                {contactDetails?.contact_ein_number? maskEIN(contactDetails?.contact_ein_number) : "No EIN provided"}
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
    <Grid container sx={{backgroundColor: theme.palette.primary.main,  borderRadius: '10px', padding: '10px', }}>                
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
                        <OwnerInformation contactDetails={contactDetails[currentIndex]} />
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
                        <OwnerInformation contactDetails={contactDetails[currentIndex]} />
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
            <Grid item xs={12} md={6}>
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


const OwnerContactsCard = (props) => {
  const owner = props.data;
  const handleSetSelectedCard = props.selected;
  const ownerDataDetailsLength = props.dataDetails;
  const index = props.index;

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
                                ${owner.contact_first_name ? owner.contact_first_name : "<FIRST_NAME>"}
                                ${owner.contact_last_name ? owner.contact_last_name : "<LAST_NAME>"}
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
            {owner.property_count ? owner.property_count : "<PROPERTY_COUNT>"} Properties
          </Typography>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {owner.contact_email ? owner.contact_email : "<EMAIL>"}
          </Typography>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {owner.contact_phone_number ? formattedPhoneNumber(owner.contact_phone_number) : "<PHONE_NUMBER>"}
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
                                ${tenant.contact_first_name ? tenant.contact_first_name : "<FIRST_NAME>"}
                                ${tenant.contact_last_name ? tenant.contact_last_name : "<LAST_NAME>"}
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
            {tenant.contact_address ? tenant.contact_address : "<ADDRESS>"}
          </Typography>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {tenant.contact_email ? tenant.contact_email : "<EMAIL>"}
          </Typography>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {tenant.contact_phone_number
              ? tenant.contact_phone_number.indexOf("(") > -1
                ? tenant.contact_phone_number
                : formattedPhoneNumber(tenant.contact_phone_number)
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
                                ${business.contact_first_name ? business.contact_first_name : "<FIRST_NAME>"}
                                ${business.contact_last_name ? business.contact_last_name : "<LAST_NAME>"}
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
            {business.contact_email ? business.contact_email : "<EMAIL>"}
          </Typography>
          <Typography
            sx={{
              color: theme.typography.common.blue,
              fontSize: "14px",
            }}
          >
            {business.contact_phone_number
              ? business.contact_phone_number.indexOf("(") > -1
                ? business.contact_phone_number
                : formattedPhoneNumber(business.contact_phone_number)
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
