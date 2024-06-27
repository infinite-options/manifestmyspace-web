import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
// import "./../../css/contacts.css";
import { ThemeProvider, Box, Paper, Stack, Typography, Button, InputAdornment, TextField, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Chip } from "@mui/material";
import { Message, Search } from "@mui/icons-material";
import { getStatusColor } from "./ContactsFunction";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
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
import defaultHouseImage from "../Property/defaultHouseImage.png";
import { DataGrid } from '@mui/x-data-grid';
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from "../Property/messageIconDark.png";
import PhoneIcon from "../Property/phoneIconDark.png";
import AddressIcon from "../Property/addressIconDark.png";
import maintenanceIcon from "../Property/maintenanceIcon.png";
import User_fill from "../../images/User_fill_dark.png";
import { maskSSN, maskEIN, formattedPhoneNumber } from "../utils/privacyMasking";



import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";

import AES from "crypto-js/aes";

import APIConfig from "../../utils/APIConfig";
import ContactDetails from "./ContactDetails";


const tabsManager = [
    {
      label: "Owners",
      value: "Owner"
    },
    {
      label: "Tenants",
      value: "Tenant"
    },
    {
      label: "Maintenance",
      value: "Maintenance"
    },
    {
      label: "Employees",
      value: "Employee"
    },
  ];
  
  const tabsOwner = [
    {
      label: "Managers",
      value: "Manager"
    },
    {
      label: "Tenants",
      value: "Tenant"
    }
  ];

  const tabsMaintenance = [
    {
      label: "Managers",
      value: "Manager"
    },
    {
      label: "Tenants",
      value: "Tenant"
    },
    {
      label: "Employees",
      value: "Employee"
    }
  ];

  const tabStyle = (role) => ({
    backgroundColor: getStatusColor(role),
    color: "#FFFFFF",
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'none',
    borderRadius: '10px 10px 0px 0px',
    '&.Mui-selected': {
      color: "#FFFFFF",
    },
  });


const ContactsList = ({ data, tab,  setTab, currentIndex, setCurrentIndex }) => {
    console.log("In ContactsList - data - ", data)
    const { getProfileId, selectedRole } = useUser();
    const [contactsTab, setContactsTab] = useState(tab);
    const [ownerData, setOwnerData] = useState([]);
    const [tenantData, setTenantData] = useState([]);
    // const [maintenanceData, setMaintenanceData] = useState([]);
    const [allOwnersData, setAllOwnersData] = useState(data?.owners);
    const [displayedOwnersData, setDisplayedOwnersData] = useState(data?.owners);
    const [allManagersData, setAllManagersData] = useState(data?.managers);
    const [displayedManagersData, setDisplayedManagersData] = useState(data?.managers);
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
      setAllManagersData(data?.managers)
      setDisplayedManagersData(data?.managers)
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
        case "Manager":
          setDisplayedManagersData(filterContacts(allManagersData));
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
        case "Employee":
          dataDetails = displayedManagersData;
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
                    {selectedRole === "MANAGER" && 
                        tabsManager.map(tab => (
                            <Tab 
                                key={tab.value}
                                label={tab.label}
                                value={tab.value}
                                sx={tabStyle(tab.value)}
                            />
                        ))
                    }
                    {selectedRole === "OWNER" && 
                        tabsOwner.map(tab => (
                            <Tab 
                                key={tab.value}
                                label={tab.label}
                                value={tab.value}
                                sx={tabStyle(tab.value)}
                            />
                        ))
                    }
                    {selectedRole === "MAINTENANCE" && 
                        tabsMaintenance.map(tab => (
                            <Tab 
                                key={tab.value}
                                label={tab.label}
                                value={tab.value}
                                sx={tabStyle(tab.value)}
                            />
                        ))
                    }
                </Tabs>
                <Box sx={{backgroundColor: getStatusColor(contactsTab), height: '25px', width: '100%',  }}></Box>              
              </Grid>   
              
              {/* height: '669px' */}
              <Grid container item xs={12} justifyContent="center" sx={{ height: '65dvh', overflowY: 'auto', paddingBottom: '10px', backgroundColor: '#FFFFFF',borderRadius: '0px 0px 10px 10px', }}>                                                  
                <Grid item xs={12}>
                  {contactsTab === "Owner" && displayedOwnersData?.map((owner, index) => (
                    <OwnerContactsCard data={owner} key={index} index={index} selected={handleSetSelectedCard} />
                  ))}
                  {contactsTab === "Manager" && displayedManagersData?.map((manager, index) => (
                    <ManagerContactsCard data={manager} key={index} index={index} selected={handleSetSelectedCard} />
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

  const ManagerContactsCard = (props) => {
    const manager = props.data;
    const handleSetSelectedCard = props.selected;
    const index = props.index;
    const managerProperties = manager?.properties?.length > 0? JSON.parse(manager?.properties).filter( property => property?.contract_status === "ACTIVE") : [];
    const activeProperties = managerProperties;
  
    const handleSelection = () => {
      handleSetSelectedCard(manager, index);
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
                {`${manager.business_name ? manager.business_name : "<BUSINESS_NAME>"}`}
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
              {manager.business_address ? manager.business_address : "<ADDRESS>"}
            </Typography>
            <Typography
              sx={{
                color: theme.typography.common.blue,
                fontSize: "14px",
              }}
            >
              {manager.business_email ? manager.business_email : "<EMAIL>"}
            </Typography>
            <Typography
              sx={{
                color: theme.typography.common.blue,
                fontSize: "14px",
              }}
            >
              {manager.business_phone_number
                ? manager.business_phone_number.indexOf("(") > -1
                  ? manager.business_phone_number
                  : formattedPhoneNumber(manager.business_phone_number)
                : "<PHONE_NUMBER>"}
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
    const tenantProperties = tenant?.properties?.length > 0? JSON.parse(tenant.properties).filter( property => property.lease_status === "ACTIVE") : [];
    const activeProperties = tenantProperties;
  
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
  
    const [ verified, setVerified ] = useState(employee?.employee_verification === "Y");
  
    const handleSelection = () => {
      handleSetSelectedCard(employee, index);
    };
  
    const updateVerification = ( value ) => {
      const url = 'https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/employeeVerification'; // Replace with your API endpoint
      const data = {
        employee_uid: employee?.employee_uid,
        employee_verification: value,
      };
  
      const options = {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify([data]), 
      };
  
      fetch(url, options)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json(); 
        })
        .then(data => {
          console.log('Success:', data); 
        })
        .catch(error => {
          console.error('Error:', error); 
        });
  
    }
  
    const handleVerificationChange = (e) => {
      if(e.target.checked){
        console.log("CHANGED TO VERIFIED");
        updateVerification("Y");
      } else{
        console.log("CHANGED TO UNVERIFIED");
        updateVerification("N");
      }
      setVerified(e.target.checked)
    }
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
              <Switch
                  checked={verified}
                  onChange={handleVerificationChange}
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
              />
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
  

  export default ContactsList;