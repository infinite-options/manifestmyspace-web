import React, { useEffect, useState } from "react";
import theme from "../../../theme/theme";
import "../../../css/contacts.css";
import { ThemeProvider, Box, Paper, Stack, Typography, Button, InputAdornment, TextField, Card, CardContent, Container, Grid } from "@mui/material";
import { Message, Search } from "@mui/icons-material";
import { getStatusColor } from "../ContactsFunction";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formattedPhoneNumber } from "../../utils/privacyMasking";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import APIConfig from "../../../utils/APIConfig";
import ContactsList from "../ContactsList";
// import ManagerContactDetail from "../ContactDetail/ManagerContactDetail";
// import MaintenanceContactDetail from "../ContactDetail/MaintenanceContactDetail";
import User_fill from "../../../images/User_fill_dark.png";
import EmailIcon from "../../Property/messageIconDark.png";
import PhoneIcon from "../../Property/phoneIconDark.png";
import AddressIcon from "../../Property/addressIconDark.png";



const TenantContacts = () => {
  const { getProfileId, selectedRole } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);
  const [contactsTab, setContactsTab] = useState("Manager");
  const [ contactsData, setContactsData ] = useState([]);

  const [ currentIndex, setCurrentIndex ] = useState(0);

  useEffect(() => {
    console.log("ROHIT - contactsData - ", contactsData);
  }, [contactsData]);

  useEffect(() => {
    console.log("ROHIT - currentIndex", currentIndex)
  }, [currentIndex]);
  useEffect(() => {
    console.log("ROHIT  - contactsTab", contactsTab)
    setCurrentIndex(0); 
  }, [contactsTab]);
  

  const fetchData = async () => {
    // const url = `${APIConfig.baseURL.dev}/contacts/${getProfileId()}`;
    const url = `${APIConfig.baseURL.dev}/contacts/350-000002`;
    console.log("In PMContracts.jsx");
    setShowSpinner(true);

    await axios
      .get(url)
      .then((resp) => {
        const data = resp.data["tenant_contacts"];
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
                <ContactsList data={contactsData} tab={"Manager"} setTab={setContactsTab} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
            </Grid>
          </Grid>
          <Grid container item xs={12} md={8} >
            <Grid item xs={12} sx={{padding: '5px',}}>
              {
                contactsTab === "Manager" && <ManagerContactDetail data={contactsData?.managers} contacsTab={contactsTab} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
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

const ManagerContactDetail = ({ data, currentIndex, setCurrentIndex,  }) => {

  const { selectedRole, getProfileId } = useUser();  
  const [ contactDetails, setContactDetails ] = useState([]);

  useEffect(() => {
    setContactDetails(data)
  }, [data]);  

  return (
    <Grid container sx={{backgroundColor: theme.palette.primary.main,  borderRadius: '10px', padding: '10px', }}>                
        <Grid item xs={12} container justifyContent="center" sx={{ height: '50px',  }}>
            <Typography sx={{fontSize: '35px', fontWeight: 'bold', color: '#160449' }}>
                Manager Contact
            </Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="center" >
            <Typography sx={{fontSize: '20px', color: '#3D5CAC'}}>
              {currentIndex + 1} of {contactDetails?.length} Managers
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
                  {`${(contactDetails && contactDetails[currentIndex]?.business_name) ? contactDetails[currentIndex]?.business_name : ""}`}
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
                    src={(contactDetails && contactDetails[currentIndex]?.business_photo_url) ? contactDetails[currentIndex].business_photo_url : User_fill}
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
            <Grid item xs={6}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        height: 120,
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
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#160449', }}>
                        CONTACT INFORMATION
                      </Typography>
                    </Grid>
                    <Grid container direction='row' item xs={12} alignContent='center'  sx={{marginTop: '10px',}}>
                      <img src={EmailIcon} alt="email" />        
                      <Typography sx={{color: '#160449', marginLeft: '5px', }}>                                                
                        {(contactDetails && contactDetails[currentIndex]?.business_email) ? contactDetails[currentIndex]?.business_email : ""}                                                
                      </Typography>
                    </Grid>
                    <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>
                      <img src={PhoneIcon} alt="phone" />        
                      <Typography sx={{color: '#160449', marginLeft: '5px',  }}>                                                
                        {(contactDetails && contactDetails[currentIndex]?.business_phone_number) ? contactDetails[currentIndex]?.business_phone_number : ""}                                                
                      </Typography>
                    </Grid>
                    
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper
                    elevation={0}
                    style={{
                        // margin: '50p', // Add margin here
                        borderRadius: "10px",
                        backgroundColor: "#D6D5DA",
                        height: 120,
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
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#160449', }}>
                        AVAILABLE HOURS
                      </Typography>
                    </Grid>                                        
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
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#160449', textTransform: 'uppercase'  }}>
                        {/* {(contactDetails && contactDetails[currentIndex]?.business_name) ? contactDetails[currentIndex]?.business_name : ""} */}
                        {"PROPERTY NAME"}
                      </Typography>
                    </Grid>
                    <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>                      
                      <Typography sx={{color: '#160449', fontWeight: '600'  }}>                                                
                        Website:
                      </Typography>
                    </Grid>  
                    <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>                      
                      <Typography sx={{color: '#160449', fontWeight: '600'  }}>                                                
                        Email Address:
                      </Typography>
                    </Grid>  
                    <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>                      
                      <Typography sx={{color: '#160449', fontWeight: '600'  }}>                                                
                        Phone #:
                      </Typography>
                    </Grid>  
                    <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>                      
                      <Typography sx={{color: '#160449', fontWeight: '600'  }}>                                                
                        Address:
                      </Typography>
                    </Grid>  
                    <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>                      
                      <Typography sx={{color: '#160449', fontWeight: '600'  }}>                                                
                        Open Office Hours:
                      </Typography>
                    </Grid>  
                    <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>                      
                      <Typography sx={{color: '#160449', fontWeight: '600'  }}>                                                
                        Clsoed Office Hours:
                      </Typography>
                    </Grid>  
                    
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
                      // contactDetails && typeof currentIndex === 'number' && currentIndex >=0 ? (
                      //   <PropertiesInformation                           
                      //     ownerUID={contactDetails[currentIndex]?.contact_uid}                       

                      //     owner={contactDetails[currentIndex]}
                      //   />
                      // ) :
                      <></>
                    }
                    
                </Paper>
            </Grid>                     
        </Grid>                     
    </Grid>    
  
  );
}

const MaintenanceContactDetail = ({ data, currentIndex, setCurrentIndex,  }) => {

  // const { selectedRole, getProfileId } = useUser();  

  const [ contactDetails, setContactDetails ] = useState([]);

  useEffect(() => {
    setContactDetails(data)
  }, [data]);

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
            <Grid item xs={6}>
                  <Paper
                      elevation={0}
                      style={{
                          // margin: '50p', // Add margin here
                          borderRadius: "10px",
                          backgroundColor: "#D6D5DA",
                          height: 120,
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
                      <Grid item xs={12}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#160449', }}>
                          CONTACT INFORMATION
                        </Typography>
                      </Grid>
                      <Grid container direction='row' item xs={12} alignContent='center'  sx={{marginTop: '10px',}}>
                        <img src={EmailIcon} alt="email" />        
                        <Typography sx={{color: '#160449', marginLeft: '5px', }}>                                                
                          {(contactDetails && contactDetails[currentIndex]?.business_email) ? contactDetails[currentIndex]?.business_email : ""}                                                
                        </Typography>
                      </Grid>
                      <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>
                        <img src={PhoneIcon} alt="phone" />        
                        <Typography sx={{color: '#160449', marginLeft: '5px',  }}>                                                
                          {(contactDetails && contactDetails[currentIndex]?.business_phone_number) ? contactDetails[currentIndex]?.business_phone_number : ""}                                                
                        </Typography>
                      </Grid>
                      
                  </Paper>
            </Grid>
            <Grid item xs={6}>
                  <Paper
                      elevation={0}
                      style={{
                          // margin: '50p', // Add margin here
                          borderRadius: "10px",
                          backgroundColor: "#D6D5DA",
                          height: 120,
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
                      <Grid item xs={12}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#160449', }}>
                          AVAILABLE HOURS
                        </Typography>
                      </Grid>                                        
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
                          height: 370,
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
                      <Typography sx={{fontSize: '20px', color: '#160449', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {(contactDetails && contactDetails[currentIndex]?.business_name) ? contactDetails[currentIndex]?.business_name : ""}
                      </Typography>
                      <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>                      
                        <Typography sx={{color: '#160449', fontWeight: '600'  }}>                                                
                          Website:
                        </Typography>
                      </Grid>                        
                      <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>                      
                        <Typography sx={{color: '#160449', fontWeight: '600'  }}>                                                
                          Email Address:
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{color: '#160449', }}>
                          {(contactDetails && contactDetails[currentIndex]?.business_email) ? contactDetails[currentIndex]?.business_email : ""}
                        </Typography>
                      </Grid>  
                      <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>                      
                        <Typography sx={{color: '#160449', fontWeight: '600'  }}>                                                
                          Phone #:
                        </Typography>
                      </Grid>  
                      <Grid item xs={12}>
                        <Typography sx={{color: '#160449', }}>
                          {(contactDetails && contactDetails[currentIndex]?.business_phone_number) ? contactDetails[currentIndex]?.business_phone_number : ""}
                        </Typography>
                      </Grid>  
                      <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>                      
                        <Typography sx={{color: '#160449', fontWeight: '600'  }}>                                                
                          Address:
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{color: '#160449', }}>
                          {`${(contactDetails && contactDetails[currentIndex]?.business_address) ? contactDetails[currentIndex]?.business_address : ""}, ${(contactDetails && contactDetails[currentIndex]?.business_city) ? contactDetails[currentIndex]?.business_city : ""}`}
                        </Typography>
                      </Grid>  
                      <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>                      
                        <Typography sx={{color: '#160449', fontWeight: '600'  }}>                                                
                          Open Office Hours:
                        </Typography>
                      </Grid>  
                      <Grid container direction='row' item xs={12} alignContent='center' sx={{marginTop: '10px',}}>                      
                        <Typography sx={{color: '#160449', fontWeight: '600'  }}>                                                
                          Clsoed Office Hours:
                        </Typography>
                      </Grid>  
                      <Typography sx={{color: '#160449', fontWeight: 'bold', }}>
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

                      <Typography sx={{ color: '#160449', fontWeight: 'bold', }}>
                        {
                          contactDetails && contactDetails[currentIndex]?.business_locations ? (
                            <>
                              Service Locations: <Typography component="span" sx={{ color: '#160449', }}>{JSON.parse(contactDetails[currentIndex]?.business_locations).map(location => (`${location.location} (+-${location.distance} miles)` )).join(', ')}</Typography>
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
                    <Typography sx={{fontSize: '20px', color: '#160449', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Previous Jobs
                    </Typography>
                      
                      
                      
                  </Paper>
              </Grid>
            </Grid>                                              
        </Grid>                     
    </Grid>    
  
  );
}


export default TenantContacts;
