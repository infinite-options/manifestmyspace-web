import { useEffect, useState } from "react";
import "../../css/announcement.css"
import AnnouncementCard from "./AnnouncementCard";

import axios from "axios";
import SearchFilter from "./SearchFilter";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import { 
    Grid,
    Box, 
    ThemeProvider,
    Radio, 
    RadioGroup, 
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,   
 } from '@mui/material';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import AnnouncementPopUp from "./AnnouncementPopUp";
import theme from "../../theme/theme";
import TenantDoucments from "../Documents/TenantDocuments/TenantDocuments";

export default function ManagerCreateAnnouncement() {
    const { getProfileId } = useUser();
    const [applicantsData, setApplicantsData] = useState([]);
    const [ownersData, setOwnersData] = useState([]);
    const [tenantsData, setTenantsData] = useState([]);
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementMessage, setAnnouncementMessage] = useState('');

    const [selectedOption, setSelectedOption] = useState("tenants_by_name");

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [propertyAddressesMap, setPropertyAddressesMap] = useState({});

    const promises = []
    const promises_added = [] // debug

    const [showInvalidAnnouncementPrompt, setShowInvalidAnnouncementPrompt] = useState(false);


    useEffect(() => {
        console.log("ROHIT - applicantsData - ", applicantsData);
    }, [applicantsData]);

    useEffect(() => {
        console.log("ROHIT - ownersData - ", ownersData);
    }, [ownersData]);

    useEffect(() => {
        console.log("ROHIT - tenantsData - ", tenantsData);
    }, [tenantsData]);

    useEffect(() => {
        console.log("ROHIT - selectedOption - ", selectedOption);
    }, [selectedOption]);

    useEffect(() => {
        console.log("ROHIT - selectedUsers - ", selectedUsers);
    }, [selectedUsers]);

    useEffect(() => {
        console.log("ROHIT - propertyAddressesMap - ", propertyAddressesMap);
    }, [propertyAddressesMap]);

    
    
    const [showSpinner, setShowSpinner] = useState(false);
    const navigate = useNavigate();

    
    useEffect(() => {
        setShowSpinner(true);
        


        axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${getProfileId()}`)
            .then((res) => {
                const applications = res.data.Applications.result;
                const applicants = applications
                    .filter(application => application.lease_status === "NEW" || application.lease_status === "PROCESSING")
                    .filter(application => application.tenant_first_name !== null && application.tenant_last_name !== null)
                    .filter((application, index, self) => 
                        index === self.findIndex(a => 
                            a.tenant_first_name === application.tenant_first_name && 
                            a.tenant_last_name === application.tenant_last_name
                        )
                    );
                setApplicantsData(applicants);

                const properties = res.data.Property.result;
                const owners = properties
                .filter((property, index, self) => 
                    index === self.findIndex(a => 
                        a.owner_first_name === property.owner_first_name && 
                        a.owner_last_name === property.owner_last_name
                    )
                );

                const ownersWithProperties = owners.map(owner => {
                    const ownerProperties = properties.filter(property =>
                      property.owner_first_name === owner.owner_first_name &&
                      property.owner_last_name === owner.owner_last_name
                    );
                    return { ...owner, properties_list: ownerProperties };
                  });
                setOwnersData(ownersWithProperties)

                const propertyAddresses = {}
                properties.forEach((property) => {
                    propertyAddresses[property.property_uid] =  {
                                                                    "property_address": property.property_address,
                                                                    "property_unit": property.property_unit,
                                                                    "property_city": property.property_city,
                                                                    "property_state": property.property_state,                                                                
                                                                }
                });
                setPropertyAddressesMap(propertyAddresses);


                const tenants = properties
                .filter(property => property.tenant_first_name !== null && property.tenant_last_name !== null)
                .filter((property, index, self) => 
                    index === self.findIndex(a => 
                        a.tenant_first_name === property.tenant_first_name && 
                        a.tenant_last_name === property.tenant_last_name
                    )
                );
                const tenantsWithProperties = tenants.map(tenant => {
                    const tenantProperties = properties.filter(property =>
                        property.tenant_first_name === tenant.tenant_first_name &&
                        property.tenant_last_name === tenant.tenant_last_name
                    );
                    return { ...tenant, properties_list: tenantProperties };
                });
                
                // setTenantsData(tenants)
                setTenantsData(tenantsWithProperties);
            
            setShowSpinner(false);
        });
    }, []);


    const { user, selectedRole, selectRole, Name } = useUser();
    

    const handleSendAnnouncement = async (e) => {
        e.preventDefault();
        setShowInvalidAnnouncementPrompt(false);

        if(announcementTitle === "" || announcementMessage === "" || selectedUsers.length === 0){
            setShowInvalidAnnouncementPrompt(true);
            return;
        }
        setShowSpinner(true);

        const sendAnnouncement = async (properties_list, profile_uid) => {
            console.log("ROHIT - properties_list", properties_list);
            const property_uids = []

            properties_list.forEach((property) => {
                property_uids.push(property.property_uid)
            });
            console.log("ROHIT - property_uids", property_uids);
            
            // promises.push(fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/${getProfileId()}`, //rohit
            promises.push(fetch(`http://localhost:4000/announcements/${getProfileId()}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    announcement_title: announcementTitle,
                    announcement_msg: announcementMessage,
                    announcement_sender: getProfileId(),
                    announcement_date: new Date().toDateString(),
                    announcement_properties: property_uids, 
                    announcement_mode: "LEASE",
                    announcement_receiver: profile_uid,
                    announcement_type: ["Text", "Email"],
                }),
            }));

            promises_added.push(profile_uid);
        }
        
        if(selectedOption === "tenants_by_name"){
            selectedUsers.forEach((tenant) => {
                sendAnnouncement(tenant.properties_list ,tenant.tenant_uid)
            });
        } else if(selectedOption === "owners_by_name"){
            selectedUsers.forEach((owner) => {
                sendAnnouncement(owner.properties_list ,owner.owner_uid)
            });
        } else if(selectedOption === "applicants_by_name"){
            
            selectedUsers.forEach((applicant) => {
                let properties_list = []                
                properties_list.push(applicant.property_uid)
                console.log(properties_list);
                sendAnnouncement(properties_list ,applicant.tenant_uid)
            });
        }

        try {
            console.log("promises added - ", promises_added);
            await Promise.all(promises)
            console.log("All Announcements Sent", promises)                        
            
        } catch (error) {
            console.error("Error:", error);
        }

        setShowSpinner(false);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setSelectedUsers([]);
    };

    const handleCheckboxChange = (user, isChecked) => {
        if (isChecked) {
          setSelectedUsers([...selectedUsers, user]);
        } else {
          setSelectedUsers(selectedUsers.filter((item) => item !== user));
        }
    };

    return (
        <Box 
            className="announcement-container"
            sx={{
                display: "flex",
                flexDirection: "column",                
                marginBottom: "50px",
            }}    
        >
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box className="announcement-title">
                <Box className="announcement-title-icon">
                    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.2963 0.75C8.2963 0.335786 8.63208 0 9.0463 0H18.213C18.6272 0 18.963 0.335786 18.963 0.75V1.02778C18.963 1.44199 18.6272 1.77778 18.213 1.77778H9.0463C8.63208 1.77778 8.2963 1.44199 8.2963 1.02778V0.75ZM0 7.86111C0 7.4469 0.335786 7.11111 0.75 7.11111H18.213C18.6272 7.11111 18.963 7.4469 18.963 7.86111V8.13889C18.963 8.5531 18.6272 8.88889 18.213 8.88889H0.75C0.335786 8.88889 0 8.5531 0 8.13889V7.86111ZM0.75 14.2222C0.335786 14.2222 0 14.558 0 14.9722V15.25C0 15.6642 0.335787 16 0.750001 16H9.91667C10.3309 16 10.6667 15.6642 10.6667 15.25V14.9722C10.6667 14.558 10.3309 14.2222 9.91667 14.2222H0.75Z" fill="#160449" />
                    </svg>
                </Box>
                <div className="announcement-title-text">
                    {"New Announcement"}
                </div>
                <div className="announcement-title-emptybox" />
            </Box>
            <hr />            
            {/* <div className="announcement-menu-container">
                
                <div className="announcement-menu-bar">
                    <div className="announcement-view">
                        <div className="announcement-view-icon">
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2.375" y="4.75" width="14.25" height="11.875" rx="2" stroke="#3D5CAC" strokeWidth="2" />
                                <path d="M2.375 7.91667C2.375 6.828 2.375 6.28367 2.58125 5.86542C2.77598 5.47056 3.09556 5.15098 3.49042 4.95625C3.90867 4.75 4.453 4.75 5.54167 4.75H13.4583C14.547 4.75 15.0913 4.75 15.5096 4.95625C15.9044 5.15098 16.224 5.47056 16.4187 5.86542C16.625 6.28367 16.625 6.828 16.625 7.91667V7.91667H2.375V7.91667Z" fill="#3D5CAC" />
                                <path d="M5.54169 2.375L5.54169 4.75" stroke="#3D5CAC" strokeWidth="2" stroke-linecap="round" />
                                <path d="M13.4583 2.375L13.4583 4.75" stroke="#3D5CAC" strokeWidth="2" stroke-linecap="round" />
                            </svg>
                        </div>
                        <div className="announcement-view-text">
                            View Last 30 Days
                        </div>
                    </div>
                    <div className="announcement-readall">
                        <div className="announcement-readall-text">
                            Read All
                        </div>
                        <div className="announcement-readall-checkbox">
                            <input type="checkbox" />
                        </div>
                    </div>
                </div>
                <div className="announcement-view-text">
                           Sent
                </div>
                <div style={{width:"100%", height: "150px", overflow: "auto"}}>
                 <div className="announcement-list-container">
                    {sentData.length > 0 ? (
                        sentData.map((announcement, i) =>
                            <div key={i}>
                                <Box onClick={()=>{handleAnnouncements(announcement)}}>
                                    <AnnouncementCard data={announcement} role={getProfileId}/>
                                </Box>
                            </div>
                        )) : "No announcements"}
                </div>
                </div>

                <div className="announcement-view-text">
                           Received
                </div>
                <div style={{width:"100%", height: "150px", overflow: "auto"}}>
                 <div className="announcement-list-container">
                    {receivedData.length > 0 ? (
                        receivedData.map((announcement, i) =>
                            <div key={i}>
                                <Box onClick={()=>{handleAnnouncements(announcement)}}>
                                    <AnnouncementCard data={announcement} role={getProfileId}/>
                                </Box>
                            </div>
                        )) : "No announcements"}
                </div>
                </div>
            </div> */}
            <Box className="announcement-menu-container">
                <form onSubmit={handleSendAnnouncement}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                color: "#000000",
                                fontWeight: theme.typography.primary.fontWeight,
                                }}
                            >
                            Announcement Title
                            </Typography>
                            <TextField
                                fullWidth
                                label=""
                                value={announcementTitle}
                                onChange={(e) => setAnnouncementTitle(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                color: "#000000",
                                fontWeight: theme.typography.primary.fontWeight,
                                }}
                            >
                                Announcement Message
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label=""
                                value={announcementMessage}
                                onChange={(e) => setAnnouncementMessage(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <RadioGroup
                                aria-label="announcementType"
                                name="announcementType"
                                value={selectedOption}
                                onChange={handleOptionChange}
                                row
                            >
                                <FormControlLabel
                                    value="tenants_by_name"
                                    control={<Radio />}
                                    label="Tenants By Name"
                                />
                                <FormControlLabel
                                    value="owners_by_name"
                                    control={<Radio />}
                                    label="Owners By Name"
                                />
                                <FormControlLabel
                                    value="applicants_by_name"
                                    control={<Radio />}
                                    label="Applicants By Name"
                                />
                            </RadioGroup>
                        </Grid>                        
                        <Grid item xs={12}>
                            {
                                selectedOption === "tenants_by_name" && (
                                    <>
                                        {/* <Box className="announcement-menu-container">
                                            <Typography
                                                sx={{
                                                color: "#000000",
                                                fontWeight: theme.typography.primary.fontWeight,
                                                }}
                                            >
                                                Tenants
                                            </Typography>
                                            <div className="announcement-list-container">
                                                    {tenantsData.length > 0 ? (
                                                        tenantsData.map((tenant, index) =>
                                                            <Box key={index}>
                                                                <Box>
                                                                    {tenant.tenant_first_name + " " + tenant.tenant_last_name}
                                                                </Box>
                                                            </Box>
                                                    )) : <></>}
                                                </div>
                                        </Box> */}
                                        <Box>
                                            <TableContainer>
                                                <Table>
                                                <TableHead>
                                                    <TableRow>
                                                    <TableCell>{""}</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Properties</TableCell>                                                    
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {tenantsData.map((tenant, index) => (
                                                        <TenantRow
                                                            key={index}
                                                            tenant={tenant}
                                                            isSelected={selectedUsers.includes(tenant)}
                                                            handleCheckboxChange={handleCheckboxChange}
                                                        />
                                                    ))}
                                                </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </>
                                )
                            }
                            {
                                selectedOption === "owners_by_name" && (
                                    <>
                                        {/* <Box className="announcement-menu-container">
                                            <Typography
                                                sx={{
                                                color: "#000000",
                                                fontWeight: theme.typography.primary.fontWeight,
                                                }}
                                            >
                                                Owners
                                            </Typography>
                                            <div className="announcement-list-container">
                                                    {ownersData.length > 0 ? (
                                                        ownersData.map((owner, index) =>
                                                            <Box key={index}>
                                                                <Box>
                                                                    {owner.owner_first_name + " " + owner.owner_last_name}
                                                                </Box>
                                                            </Box>
                                                    )) : <></>}
                                                </div>
                                        </Box> */}
                                        <Box>
                                            <TableContainer>
                                                <Table>
                                                <TableHead>
                                                    <TableRow>
                                                    <TableCell>{""}</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Properties</TableCell>                                                    
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {ownersData.map((owner, index) => (
                                                        <OwnerRow
                                                            key={index}
                                                            owner={owner}
                                                            isSelected={selectedUsers.includes(owner)}
                                                            handleCheckboxChange={handleCheckboxChange}
                                                        />
                                                    ))}
                                                </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </>
                                )
                            }
                            {
                                selectedOption === "applicants_by_name" && (
                                    <>
                                        {/* <Box className="announcement-menu-container">
                                            <Typography
                                                sx={{
                                                color: "#000000",
                                                fontWeight: theme.typography.primary.fontWeight,
                                                }}
                                            >
                                                Applicants
                                            </Typography>
                                            <div className="announcement-list-container">
                                                    {applicantsData.length > 0 ? (
                                                        applicantsData.map((application, index) =>
                                                            <Box key={index}>
                                                                <Box>
                                                                    {application.tenant_first_name + " " + application.tenant_last_name}
                                                                </Box>
                                                            </Box>
                                                    )) : <></>}
                                                </div>
                                        </Box> */}
                                        <Box>
                                            <TableContainer>
                                                <Table>
                                                <TableHead>
                                                    <TableRow>
                                                    <TableCell>{""}</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Property</TableCell>                                                    
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {applicantsData.map((applicant, index) => (
                                                        <ApplicantRow
                                                            key={index}
                                                            applicant={applicant}
                                                            propertyAddressesMap={propertyAddressesMap}
                                                            isSelected={selectedUsers.includes(applicant)}
                                                            handleCheckboxChange={handleCheckboxChange}
                                                        />
                                                    ))}
                                                </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </>
                                )
                            }

                        </Grid>
                        <Grid item xs={12}>
                            {showInvalidAnnouncementPrompt && (
                                    <Box
                                        sx={{
                                            color: 'red',
                                            fontSize: '13px',
                                        }}
                                    >
                                        Please enter all required fields.
                                    </Box>
                            )}
                        </Grid>
                        
                        <Grid item xs={12} 
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                padding: '10px',
                            }}
                        >
                            <Button type="submit" variant="contained" color="primary">
                                Send
                            </Button>
                        </Grid>
                        
                    </Grid>
                </form>
            </Box>            
                        
        </Box>
    );
}


function TenantRow({ tenant, isSelected, handleCheckboxChange }) {
    const handleChange = (event) => {
      handleCheckboxChange(tenant, event.target.checked);
    };
  
    return (
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={handleChange}
            color="primary"
            inputProps={{ "aria-label": "select user" }}
          />
        </TableCell>
        <TableCell>{`${tenant.tenant_first_name} ${tenant.tenant_last_name}`}</TableCell>
        {/* <TableCell>{`${tenant.property_address}, Unit - ${tenant.property_unit}, ${tenant.property_city}, ${tenant.property_state}`}</TableCell>         */}
        <TableCell>
            {tenant.properties_list.map((property, index) => (
                <Box key={index}>
                {`${property.property_address}, Unit - ${property.property_unit}, ${property.property_city}, ${property.property_state}`}
                </Box>
            ))}
        </TableCell> 
      </TableRow>
    );
}

function OwnerRow({ owner, isSelected, handleCheckboxChange }) {
    const handleChange = (event) => {
      handleCheckboxChange(owner, event.target.checked);
    };
  
    return (
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={handleChange}
            color="primary"
            inputProps={{ "aria-label": "select user" }}
          />
        </TableCell>
        <TableCell>{`${owner.owner_first_name} ${owner.owner_last_name}`}</TableCell>
        {/* <TableCell>{`${owner.property_address}, Unit - ${owner.property_unit}, ${owner.property_city}, ${owner.property_state}`}</TableCell> */}
        <TableCell>
            {owner.properties_list.map((property, index) => (
                <Box key={index}>
                {`${property.property_address}, Unit - ${property.property_unit}, ${property.property_city}, ${property.property_state}`}
                </Box>
            ))}
        </TableCell>        
      </TableRow>
    );
}

function ApplicantRow({ applicant, propertyAddressesMap, isSelected, handleCheckboxChange }) {
    const handleChange = (event) => {
      handleCheckboxChange(applicant, event.target.checked);
    };
  
    return (
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={handleChange}
            color="primary"
            inputProps={{ "aria-label": "select user" }}
          />
        </TableCell>
        <TableCell>{`${applicant.tenant_first_name} ${applicant.tenant_last_name}`}</TableCell>

        {/* <TableCell>{`${propertyAddressesMap[applicant.property_uid].property_address}, Unit - ${applicant.property_unit}, ${applicant.property_city}, ${applicant.property_state}`}</TableCell> */}
        <TableCell>{`${applicant.property_uid}`}</TableCell>
        <TableCell>
            {propertyAddressesMap[applicant.property_uid] ? (
                `${propertyAddressesMap[applicant.property_uid].property_address}, Unit - ${applicant.property_unit}, ${applicant.property_city}, ${applicant.property_state}`
            ) : (
                "Address Not Available"
            )}
        </TableCell>
        {/* Add more table cells for additional user data */}
      </TableRow>
    );
}