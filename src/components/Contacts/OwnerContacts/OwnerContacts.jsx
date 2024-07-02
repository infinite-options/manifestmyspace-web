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
import TenantContactDetail from "../ContactDetail/TenantContactDetail";
import ManagerContactDetail from "../ContactDetail/ManagerContactDetail";


const OwnerContacts = () => {
  const { getProfileId, selectedRole } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);
  const [contactsTab, setContactsTab] = useState("Manager");
  const [ contactsData, setContactsData ] = useState([]);

  const [ currentIndex, setCurrentIndex ] = useState(0);

  // useEffect(() => {
  //   console.log("contactsData - ", contactsData);
  // }, [contactsData]);

  // useEffect(() => {
  //   console.log("currentIndex", currentIndex)
  // }, [currentIndex]);
  // useEffect(() => {
  //   console.log("contactsTab", contactsTab)
  //   setCurrentIndex(0); 
  // }, [contactsTab]);
  

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
                contactsTab === "Tenant" && <TenantContactDetail data={contactsData?.tenants} contacsTab={contactsTab} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
              }
               
            </Grid>                  
          </Grid>
        </Grid>
      </Container>    
  );
}
// const ContactCard = (props) => {
//   const contact = props.data;
//   const handleSetSelectedCard = props.selected;
//   const dataDetails = props.dataDetails;
//   const index = props.index;

//   const handleSelection = () => {
//     console.log("In handleSelection: ", contact, index);
//     handleSetSelectedCard(contact, index);
//   };

//   return (
//     <Stack>
//       <Card
//         sx={{
//           backgroundColor: "#D6D5DA",
//           borderRadius: "10px",
//           margin: "10px",
//           color: "#160449",
//         }}
//         onClick={handleSelection}
//       >
//         <CardContent>
//           <Stack flexDirection="row" justifyContent="space-between">
//             <Typography
//               sx={{
//                 fontSize: "16px",
//                 fontWeight: theme.typography.common.fontWeight,
//               }}
//             >
//               {`
//                                 ${contact.contact_first_name ? contact.contact_first_name : "<FIRST_NAME>"}
//                                 ${contact.contact_last_name ? contact.contact_last_name : "<LAST_NAME>"}
//                             `}
//             </Typography>
//             <Button>
//               <Message
//                 sx={{
//                   color: theme.typography.common.blue,
//                   fontSize: "15px",
//                 }}
//               />
//             </Button>
//           </Stack>
//           <Typography
//             sx={{
//               color: theme.typography.common.blue,
//               fontSize: "14px",
//               fontWeight: theme.typography.primary.fontWeight,
//             }}
//           >
//             {`${contact.property_count ? contact.property_count : "<PROPERTY_COUNT>"} Properties`}
//           </Typography>
//           <Typography
//             sx={{
//               color: theme.typography.common.blue,
//               fontSize: "14px",
//             }}
//           >
//             {contact.contact_email ? contact.contact_email : "<EMAIL>"}
//           </Typography>
//           <Typography
//             sx={{
//               color: theme.typography.common.blue,
//               fontSize: "14px",
//             }}
//           >
//             {contact.contact_phone_number ? formattedPhoneNumber(contact.contact_phone_number) : "<PHONE_NUMBER>"}
//           </Typography>
//         </CardContent>
//       </Card>
//     </Stack>
//   );
// };

export default OwnerContacts;
