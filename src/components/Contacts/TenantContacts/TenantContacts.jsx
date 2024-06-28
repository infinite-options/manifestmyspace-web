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
import ManagerContactDetail from "../ContactDetail/ManagerContactDetail";
import MaintenanceContactDetail from "../ContactDetail/MaintenanceContactDetail";



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
        const data = resp.data["owner_contacts"];
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

export default TenantContacts;
