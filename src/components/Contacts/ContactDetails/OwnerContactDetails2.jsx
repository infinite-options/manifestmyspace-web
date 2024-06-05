import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import axios from "axios";
import APIConfig from "../../../utils/APIConfig";
import User_fill from "../../../images/User_fill_dark.png";
import {
    Typography,
    Box,
    Stack,
    Paper,
    Button,
    ThemeProvider,
    Form,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Grid,
    Input,
    Container,
    Radio,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    UploadFile,
    InputAdornment,
    InputBase,
    IconButton,
    CardMedia,
    CardContent,
    CardActions,
    ListItemText,
    ListItem,
    List,
    Avatar,
    Badge,
  } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import theme from '../../../theme/theme';
import SearchIcon from '@mui/icons-material/Search';
import HappinessMatrixWidget from '../../Dashboard-Components/HappinessMatrix/HappinessMatrixWidget';
import CommentIcon from "@mui/icons-material/Comment";
import EmailIcon from "../../Property/messageIconDark.png";
import PhoneIcon from "../../Property/phoneIconDark.png";
import AddressIcon from "../../Property/addressIconDark.png";

import { maskSSN, maskEIN, formattedPhoneNumber } from "../../utils/privacyMasking";
import CryptoJS from "crypto-js";
import AES from "crypto-js/aes";

const OwnerContactDetails2 = (props) => {

  // console.log("In Owner Contact Details", props);
  const { selectedRole, getProfileId } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const navigatingFrom = location.state.navigatingFrom;
  const happinessMatrixData = location.state.happinessMatrixData;
  console.log("ROHIT - location.state.happinessMatrixData - ", location.state.happinessMatrixData);
  // const contactDetails = location.state.dataDetails;
  const [contactDetails, setContactDetails] = useState(null);
  const [contactsTab, setContactsTab] = useState("");

  // const selectedData = location.state.selectedData;
  // const index = location.state.index;
  const [index, setIndex] = useState(location.state.index);
  // const passedData = location.state.viewData;
  const ownerUID = location.state.ownerUID;
  
  const cashflowData = location.state.cashflowData;
  const [ filteredCashflowData, setFilteredCashflowData ] = useState(cashflowData);
  const cashflowDetails = location.state.cashflowDetails;
  const [ filteredCashflowDetails, setFilteredCashflowDetails ] = useState(cashflowDetails);
  // .filter((item) => item.owner_uid === ownerUID)
  
  console.log("cashflowData - ", cashflowData);

  useEffect(() => {
    console.log("ROHIT - cashflowData - ", cashflowData);
  }, [cashflowData]);

  useEffect(() => {
    console.log("ROHIT - filteredCashflowData - ", filteredCashflowData);
  }, [filteredCashflowData]);

  useEffect(() => {
    console.log("ROHIT - filteredCashflowDetails - ", filteredCashflowDetails);
  }, [filteredCashflowDetails]);

  const getDataFromAPI = async () => {
    // const url = `${APIConfig.baseURL.dev}/contacts/${getProfileId()}`;    //rohit
    const url = `http://localhost:4000/contacts/${getProfileId()}`;    
    // setShowSpinner(true);

    await axios
      .get(url)
      .then((resp) => {
        const data = resp.data["management_contacts"];
        const ownerContacts = data["owners"];
        setContactDetails(ownerContacts);
        const index = ownerContacts.findIndex( (contact) => contact.contact_uid === ownerUID)
        setIndex(index);
        
        // setAllTenantsData(data["tenants"]);
        // setAllMaintenanceData(data["maintenance"]);

        // setShowSpinner(false);
      })
      .catch((e) => {
        console.error(e);
        // setShowSpinner(false);
      });
  };

  

  useEffect(() => {
    // console.log("navigatingFrom - ", navigatingFrom);

    if(navigatingFrom === "HappinessMatrixWidget"){
      getDataFromAPI();      
      setContactsTab("Owner");
    } else if(navigatingFrom === "PMContacts"){
      setContactDetails(location.state.dataDetails);      
      setContactsTab(location.state.tab);
      
    }

  }, []);

  useEffect(() => {
    console.log("INDEX UPDATED - ", index);
    // location.state.index = index;
    contactDetails && console.log("DATA DETAILS", contactDetails[index]);
    setFilteredCashflowDetails(contactDetails != null? cashflowDetails.filter((item) => item.owner_uid === contactDetails[index]?.contact_uid) : [])
    setFilteredCashflowData(contactDetails != null? cashflowData.filter((item) => item.owner_uid === contactDetails[index]?.contact_uid) : [])

  }, [index]);

  //   console.log("Data details passed 1: ", contactDetails);
  //   console.log("Data details passed 2: ", contactDetails[0]);
  //   console.log("Data details passed 3: ", contactDetails[0].entities);
  //   console.log("Data details passed 4: ", contactDetails[3].entities);

  // console.log(selectedData);
  console.log("INDEX", index);
  console.log("SELECTED ROLE - ", selectedRole);

  const handleBackBtn = () => {
    // navigate('/PMContacts');
    navigate(-1);
  };


  return (
    <>
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ paddingTop: '10px', paddingBottom: '50px', marginTop: '10px', backgroundColor: '#FFFFFF' }}>
                <Grid container columnSpacing={5} sx={{marginTop: '10px',}}>
                    <Grid container item xs={12} md={4}  sx={{ padding: '10px', backgroundColor: theme.palette.primary.main,  borderRadius: '10px',  }}>                        
                        <Grid item xs={12} sx={{marginBottom: '10px',}}>
                            <Paper
                                elevation={0}
                                style={{
                                    // margin: '50p', // Add margin here
                                    borderRadius: "10px",                                
                                    backgroundColor: '#D6D5DA',
                                    // height: "400px",
                                    // [theme.breakpoints.down("sm")]: {
                                    //     width: "80%",
                                    // },
                                    // [theme.breakpoints.up("sm")]: {
                                    //     width: "50%",
                                    // },
                                    width: "100%",
                                }}
                            >
                                <HappinessMatrixWidget page={"OwnerContactDetails"} data={happinessMatrixData} setIndex={setIndex} contactDetails={contactDetails}/>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper
                                elevation={0}
                                style={{
                                    // margin: '50p', // Add margin here
                                    borderRadius: "10px",
                                    backgroundColor: "#FFFFFF",
                                    // height: "500px",
                                    // [theme.breakpoints.down("sm")]: {
                                    //     width: "80%",
                                    // },
                                    // [theme.breakpoints.up("sm")]: {
                                    //     width: "50%",
                                    // },
                                    width: "100%",
                                }}
                            >
                                <AllContacts data={contactDetails} currentIndex={index} setIndex={setIndex}/>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid id="rohit" container item xs={12} md={8} >
                        <OwnerContactDetail contactDetails={contactDetails} index={index} setIndex={setIndex} filteredCashflowDetails={filteredCashflowDetails} />
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    </>
  );
}

const AllContacts = ({ data, currentIndex, setIndex }) => {
  console.log("ROHIT - AllContacts - data -", data);

  const [searchTerm, setSearchTerm] = useState("");
  const [contactsData, setContactsData] = useState([]);
  const [filteredContactsData, setFilteredContactsData] = useState([]);


  useEffect(() => {
    const processedData = data?.map((contact) => {
      return {
        ...contact,
        entities: contact.entities != null? JSON.parse(contact.entities) : [],
      }
    });
    console.log("ROHIT - AllContacts - processedData -", processedData);
    setContactsData(processedData);
    setFilteredContactsData(processedData);
  }, [data]);

  useEffect( () => {
    console.log("ROHIT - contactsData - ", contactsData);
  }, [contactsData]);
    
  useEffect( () => {
    const filteredValues = contactsData?.filter( (item) => {
      return item.contact_first_name.toLowerCase().includes(searchTerm.toLowerCase()) || item.contact_last_name.toLowerCase().includes(searchTerm.toLowerCase())
    });

    console.log("ROHIT - handleSearch - filteredValues - ", filteredValues);
    setFilteredContactsData(filteredValues);
  }, [searchTerm]);
  
  return (
    <> 
      <Container sx={{padding: '5px', }}>     
        <Grid container justifyContent='center' sx={{padding: '10px 10px'}}>
          <Typography sx={{ fontSize: '35px', color: '#160449', fontWeight: 'bold', }}>
            All Owner Contacts
          </Typography>
          <Grid container item xs={12} justifyContent='center'>
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
          <Grid container item xs={12} justifyContent="center" sx={{ height: '380px', overflow: 'auto' }}>                      
            {
              filteredContactsData?.map(( contact, index ) => {
                return (
                  <Grid item xs={12} sx={{ marginBottom : '5px', }} onClick={ () => setIndex(index)}>
                    <Paper
                      elevation={0}
                      style={{
                          // margin: '50p', // Add margin here
                          borderRadius: "10px",
                          backgroundColor: index === currentIndex? '#9EAED6' : '#D6D5DA',
                          // height: "100%",
                          // [theme.breakpoints.down("sm")]: {
                          //     width: "80%",
                          // },
                          // [theme.breakpoints.up("sm")]: {
                          //     width: "50%",
                          // },
                          width: "100%",
                      }}
                    >
                      <Grid container sx={{padding: '10px', }}>
                        <Grid item xs={11}>
                          <Typography 
                            sx={{
                              fontWeight: 'bold',
                              color: '#160449',
                              fontSize: '20px', 
                            }}
                          >
                            { contact?.contact_first_name + ' ' + contact.contact_last_name}
                          </Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <CommentIcon sx={{ color: '#3D5CAC' }}/>
                        </Grid>
                        <Grid item xs={12}>                        
                          <Typography sx={{fontWeight: '600', color: '#160449', fontSize: '15px',}}>
                            { `${contact?.property_count} properties` }
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>                        
                          <Typography sx={{color: '#160449', fontSize: '15px',}}>
                            { contact?.contact_email }
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>                        
                          <Typography sx={{color: '#160449', fontSize: '15px',}}>
                            { contact?.contact_phone_number }
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })
            }
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

const OwnerContactDetail = ({ contactDetails, index, setIndex, filteredCashflowDetails, }) => {

  const { selectedRole, getProfileId } = useUser();
  const [ propertiesData, setPropertiesData ] = useState([]);
  const [ contractsData, setContractsData ] = useState([]);


  const getPropertiesData = async () => {
    const url = `${APIConfig.baseURL.dev}/properties/${getProfileId()}`;    
    // setShowSpinner(true);

    await axios
      .get(url)
      .then((resp) => {
        const data = resp.data;
        console.log("properties endpoint - data - ", data);
        setPropertiesData(data);        
        // setShowSpinner(false);
      })
      .catch((e) => {
        console.error(e);
        // setShowSpinner(false);
      });

  }

  const getContractsData = async () => {
    // const url = `${APIConfig.baseURL.dev}/contracts/${getProfileId()}`;    
    const url = `http://localhost:4000/contracts/${getProfileId()}`;    //rohit
    // setShowSpinner(true);

    await axios
      .get(url)
      .then((resp) => {
        const data = resp.data?.result;
        console.log("properties endpoint - data - ", data);
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
              {index + 1} of {contactDetails?.length} Owners
            </Typography>                    
        </Grid>                
        <Grid container item xs={12} direction='row' alignContent='space-between' sx={{backgroundColor: '#3D5CAC', borderRadius: '10px', marginBottom: '10px', paddingTop: '5px', paddingBottom: '10px', }}>                            
            <Grid item xs={1}>
                <Box
                    onClick={() => {
                      console.log("Previous button clicked", index, contactDetails.length);
                      index > 0 ? setIndex(index - 1) : setIndex(contactDetails.length - 1);
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
                    ${(contactDetails && contactDetails[index]?.contact_first_name) ? contactDetails[index]?.contact_first_name : "<FIRST_NAME>"}
                    ${(contactDetails && contactDetails[index]?.contact_last_name) ? contactDetails[index]?.contact_last_name : "<LAST_NAME>"}
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
                    src={(contactDetails && contactDetails[index]?.contact_photo_url) ? contactDetails[index].contact_photo_url : User_fill}
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
                      index < contactDetails.length - 1 ? setIndex(index + 1) : setIndex(0);
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
        <Grid container item xs={12} columnSpacing={5} sx={{marginBottom: '10px', }}>
            <Grid item xs={12} md={6}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        height: 330,
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
                    <OwnerInformation contactDetails={contactDetails} index={index} />
                </Paper>
            </Grid>
            <Grid item  xs={12} md={6}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        height: 350,
                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        width: "100%",
                    }}
                >
                    <PropertiesInformation 
                      propertiesData={propertiesData} 
                      contractsData={contractsData}
                      ownerUID={contactDetails && index >= 0 && index < contactDetails.length ? contactDetails[index]?.contact_uid : null} 
                    />
                </Paper>
            </Grid>
        </Grid>         
        <Grid container item xs={12} columnSpacing={10}>
            <Grid item xs={12}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        height: 350,
                        // [theme.breakpoints.down("sm")]: {
                        //     width: "80%",
                        // },
                        // [theme.breakpoints.up("sm")]: {
                        //     width: "50%",
                        // },
                        width: "100%",
                    }}
                >                            
                    <CashflowDataGrid data={filteredCashflowDetails} />
                </Paper>
            </Grid>
        </Grid>       
    </Grid>    
  
  );
}

const OwnerInformation = ({ contactDetails, index }) => {
  const [ paymentMethods, setPaymentMethods ] = useState([]);

  useEffect( () => {
    
    if(contactDetails){
      console.log("ROHIT - contactDetails.payment_method - ", contactDetails[index]?.payment_method);
      setPaymentMethods(JSON.parse(contactDetails[index]?.payment_method))
    }
  }, [contactDetails]);

  useEffect( () => {        
    console.log("ROHIT - paymentMethods - ", paymentMethods);        
  }, [paymentMethods]);

  const formatPaymentMethodType = (type) => {
    return type
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getDecryptedSSN = async (data) => {
    if(data == null){
      return ""
    }
    console.log("ROHIT - getDecryptedSSN - data - ", data);
    console.log("ROHIT - getDecryptedSSN - ret val - ", await CryptoJS.AES.decrypt(data, process.env.REACT_APP_ENKEY).toString(CryptoJS.enc.Utf8));
    
    return CryptoJS.AES.decrypt(data, process.env.REACT_APP_ENKEY).toString(CryptoJS.enc.Utf8);
  }
  
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#160449', marginTop: '10px', }}>
          CONTACT INFORMATION
        </Typography>
      </Grid>
      <Grid container direction='row' item xs={12} alignContent='center' >
        <img src={EmailIcon} alt="email" />        
        <Typography sx={{color: '#160449', }}>
          { contactDetails && contactDetails[index]?.contact_email}
        </Typography>
      </Grid>
      <Grid container direction='row' item xs={12} alignContent='center' >
        <img src={PhoneIcon} alt="phone" />        
        <Typography sx={{color: '#160449', }}>
          { contactDetails && contactDetails[index]?.contact_phone_number}
        </Typography>
      </Grid>
      <Grid container direction='row' item xs={12} alignItems='center' >
        <img src={AddressIcon} alt="address" />
           
        <Typography sx={{color: '#160449', }}>          
          { contactDetails && contactDetails[index]?.contact_address + ', ' + contactDetails[index]?.contact_city + ', ' + contactDetails[index]?.contact_state + ', ' + contactDetails[index]?.contact_zip }
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: '15px', }}>
        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#160449', }}>
          CONFIDENTIAL INFORMATION
        </Typography>
      </Grid>
      <Grid container item xs={12}>
        <Grid item xs={6}>
          <Typography sx={{fontSize: '15px', fontWeight: '600', color: '#160449', }}>
            SSN
          </Typography>
          <Typography sx={{ fontSize: '15px', color: '#160449',}}>
            {/* {
              contactDetails && contactDetails[index]?.contact_ssn? maskSSN(getDecryptedSSN(contactDetails[index]?.contact_ssn)) : "No SSN provided"
              
            } */}
            {
              contactDetails && 
              ("***-**-" +
              AES.decrypt(
                contactDetails[index]?.contact_ssn,
                process.env.REACT_APP_ENKEY
              )
                .toString()
                .slice(-4))
            }
          </Typography>
          
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{color: '#160449', fontWeight: '600', }}>
            EIN
          </Typography>
          <Typography sx={{ fontSize: '15px', color: '#160449',}}>
            {contactDetails && contactDetails[index]?.contact_ein_number? maskEIN(contactDetails[index]?.contact_ein_number) : "No EIN provided"}
          </Typography>
          
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
            .map( method => {
              return (
                <Typography sx={{ fontSize: '15px', color: '#160449',}}>
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
            .map( method => {
              return (
                <Typography sx={{ fontSize: '15px', color: '#160449',}}>
                  {formatPaymentMethodType(method.paymentMethod_type)}
                </Typography>
              )
          })}
          
        </Grid>
      </Grid>

    </Grid>
  )

}

const PropertiesInformation = ({ propertiesData, contractsData, ownerUID }) => {    
    
    console.log("ROHIT - propertiesData - ", propertiesData);
    // setPaymentMethods(JSON.parse(contactDetails[index]?.payment_method))    

    const activeProperties = propertiesData?.Property?.result
                              .filter( property => property.owner_uid === ownerUID);    
    // const activePropertyUIDs = activeProperties?.map( property => property.property_uid);
    console.log("ROHIT - activeProperties - ", activeProperties);
    
    const sentContracts = contractsData?.filter( contract => contract.property_owner_id === ownerUID && contract.contract_status === "SENT");
    console.log("ROHIT - sentContracts - ", sentContracts);

    const newContracts = contractsData?.filter( contract => contract.property_owner_id === ownerUID && contract.contract_status === "NEW");
    console.log("ROHIT - newContracts - ", newContracts);


  return (
    <>
      <Grid container sx={{padding: '10px', }}>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: '#160449', marginTop: '10px', }}>
            YOU MANAGE {activeProperties?.length} OF THEIR PROPERTIES
          </Typography>
        </Grid>
      </Grid>
      <Grid container sx={{padding: '10px', maxHeight: '230px', overflow: 'auto',}}>        
        <Grid item xs={12}>
          <Typography sx={{ fontSize: '15px', fontWeight: 'bold', color: '#160449', marginTop: '10px', }}>
            Active {`(${activeProperties?.length})`}
          </Typography>
        </Grid>
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
        <Grid item xs={12}>
          <PropertiesDataGrid data={activeProperties} />
        </Grid>        
      </Grid>
      <Grid container direction='row' sx={{padding: '10px', }}>
        <Grid container item xs={6}  justifyContent='center'>
          <Typography sx={{ fontSize: '15px', fontWeight: 'bold', color: '#160449', marginTop: '10px', }}>
            New  {`(${newContracts?.length})`}
          </Typography>
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
          <Typography sx={{ fontSize: '15px', fontWeight: 'bold', color: '#160449', marginTop: '10px', }}>
            Sent  {`(${sentContracts?.length})`}
          </Typography>
        </Grid>
        {/* <Grid container item xs={12} sx={{ maxHeight: '60px', overflow: 'auto', }}>
          {
            sentContracts?.map( (contract) => {
              return (
                <Grid item xs={12} sx={{ fontSize: '15px', color: '#160449'}}>
                  {contract.property_address}
                </Grid>
              )
            })
          }  
        </Grid> */}
      </Grid>
    </>
  )

}


const PropertiesDataGrid = ( {data} ) => {
  const columns = [
    { 
      field: 'property_address',      
      width: 150 
    },
    { 
      field: 'rent_status',      
      width: 200 
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


const CashflowDataGrid = ( {data} ) => {
  const columns = [
    { 
      field: 'owner_uid',
      headerName: 'Owner UID - DEBUG',
      width: 100 
    },    
    {
      field: 'owner_name',
      headerName: 'Owner Name - DEBUG', 
      width: 150, 
      renderCell: (params) => (
        <span>{params.row.owner_first_name} {params.row.owner_last_name}</span>
      )
    },
    { 
      field: 'year_month',
      headerName: 'Month',
      width: 100,
      renderCell: (params) => (
        <span>{params.row.cf_month !== null ? params.row.cf_month : "-"}</span>
      ) 
    },
    { 
      field: 'year',
      headerName: 'Year',
      width: 100,
      renderCell: (params) => (
        <span>{params.row.cf_year !== null ? params.row.cf_year : "-"}</span>
      ) 
    },
    { 
      field: 'actual_cashflow',
      headerName: 'Actual Cashflow',
      width: 100 
    }, 
    { 
      field: 'expected_cashflow',
      headerName: 'Expected Cashflow',
      width: 100 
    }, 
    { 
      field: 'delta_cashflow',
      headerName: 'Delta Cashflow',
      width: 100,
      renderCell: (params) => (
        <span>{parseFloat(params.row.actual_cashflow) - parseFloat(params.row.expected_cashflow)}</span>
      ) 
    }, 
    { 
      field: 'percent_delta_cashflow',
      headerName: '% Delta Cashflow',
      width: 100 
    }, 
    
  ];
  
  
  const monthNumbers = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const processedData = data.map((row, index) => {
    const monthNumber = monthNumbers[row.cf_month] || 0;
    const yearMonth = `${row.cf_year}${String(monthNumber).padStart(2, '0')}`;

    return {
      ...row, 
      id: index + 1,
      // month_num: monthNumbers[row.cf_month] || 0,
      year_month: parseInt(yearMonth, 10),
      year: parseInt(row.cf_year, 10),
      actual_cashflow: parseFloat(row.actual_cashflow),
      expected_cashflow: parseFloat(row.expected_cashflow),
      delta_cashflow: parseFloat(row.delta_cashflow),
    }
  });

  
  

  console.log("ROHIT - processedData - ", processedData);
  
  

  const totalActualCashflow = processedData.reduce((sum, row) => sum + row.actual_cashflow, 0);
  const totalExpectedCashflow = processedData.reduce((sum, row) => sum + row.expected_cashflow, 0);
  const totalDeltaCashflow = processedData.reduce((total, row) => {
    return total + (parseFloat(row.actual_cashflow) - parseFloat(row.expected_cashflow));
  }, 0);

  const totalsRow = {
    id: processedData.length + 1,
    owner_uid: 'Totals',
    owner_name: '',
    year_month: '',
    year: '',
    actual_cashflow: totalActualCashflow,
    expected_cashflow: totalExpectedCashflow,
    delta_cashflow: totalDeltaCashflow,
    percent_delta_cashflow: '',
  };

  const rowsWithTotals = [...processedData, totalsRow];

  return (
    <>
      <DataGrid
        rows={rowsWithTotals}
        columns={columns}
        // initialState={{
        //   pagination: {
        //     paginationModel: {
        //       pageSize: 5,
        //     },
        //   },
        // }}
        // pageSizeOptions={[5]}
        
        getRowClassName={(params) => {
          if (params.id === totalsRow.id) {
            return 'totals-row'; // Assign a class name to the totals row
          }
          return '';
        }}
        sx={{
          '& .totals-row': {
            fontWeight: 'bold',
            // backgroundColor: '#f1f1f1',
          },
          border: '0px',
        }}        
      />
    </>
  );
}

export default OwnerContactDetails2