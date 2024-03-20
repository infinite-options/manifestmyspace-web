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
import FormGroup from '@mui/material/FormGroup';

export default function ManagerCreateAnnouncement() {
    const { getProfileId } = useUser();
    const [applicantsData, setApplicantsData] = useState([]);
    const [ownersData, setOwnersData] = useState([]);
    const [tenantsData, setTenantsData] = useState([]);
    const [tenantsByPropertyData, setTenantsByPropertyData] = useState([]);
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementMessage, setAnnouncementMessage] = useState('');
    const [announcementTypes, setAnnouncementTypes] = useState({text: false, email: false});

    const [selectedOption, setSelectedOption] = useState("tenants_by_name");

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [propertyAddressesMap, setPropertyAddressesMap] = useState({});

    const promises = []
    const promises_added = [] // debug

    const [showInvalidAnnouncementPrompt, setShowInvalidAnnouncementPrompt] = useState(false);


    // useEffect(() => {
    //     console.log("applicantsData - ", applicantsData);
    // }, [applicantsData]);

    // useEffect(() => {
    //     console.log("ownersData - ", ownersData);
    // }, [ownersData]);

    // useEffect(() => {
    //     console.log("tenantsData - ", tenantsData);
    // }, [tenantsData]);

    // useEffect(() => {
    //     console.log("tenantsByPropertyData - ", tenantsByPropertyData);
    // }, [tenantsByPropertyData]);

    // useEffect(() => {
    //     console.log("selectedOption - ", selectedOption);
    // }, [selectedOption]);

    // useEffect(() => {
    //     console.log("selectedUsers - ", selectedUsers);
    // }, [selectedUsers]);

    // useEffect(() => {
    //     console.log("propertyAddressesMap - ", propertyAddressesMap);
    // }, [propertyAddressesMap]);

    // useEffect(() => {
    //     console.log("announcementTypes - ", announcementTypes);
    // }, [announcementTypes]);
    
    
    const [showSpinner, setShowSpinner] = useState(false);
    const navigate = useNavigate();

    const sortPropertiesList = (users) => {
        const usersWithSortedProperties = users.map(user => {
            user.properties_list.sort((a, b) => {                
                const extractNumeric = str => {
                    const match = str.match(/\d+/);
                    return match ? parseInt(match[0]) : Infinity;
                };
                        
                const numericA = extractNumeric(a.property_address);
                const numericB = extractNumeric(b.property_address);
                
                if (numericA < numericB) return -1;
                if (numericA > numericB) return 1;
                        
                return a.property_address.localeCompare(b.property_address);
            });
            return user;
        });

        return usersWithSortedProperties;

    }

    
    useEffect(() => {
        setShowSpinner(true);        

        axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${getProfileId()}`)
            .then((res) => {
                const applications = res.data.Applications.result;
                const properties = res.data.Property.result;                

                const groupedApplicants = applications.reduce((grouped, applicant) => {
                    const { tenant_uid } = applicant;
                    if (!grouped[tenant_uid]) {
                        grouped[tenant_uid] = [];
                    }
                    grouped[tenant_uid].push(applicant);
                    return grouped;
                }, {});
                
                const applicantsWithProperties = Object.values(groupedApplicants).map(applicantsGroup => {
                    const tenant_uid = applicantsGroup[0].tenant_uid; 
                    const tenant_first_name = applicantsGroup[0].tenant_first_name;
                    const tenant_last_name = applicantsGroup[0].tenant_last_name; 
                    const applicantProperties = applicantsGroup.flatMap(applicant => {
                        const applicantProperty = properties.find(property => property.property_uid === applicant.property_uid);
                        return applicantProperty ? [applicantProperty] : [];
                    });
                    const properties_list = applicantProperties.map(property => {
                        return {
                            property_uid: property.property_uid,
                            property_address: property.property_address,
                            property_unit: property.property_unit,
                            property_city: property.property_city,
                            property_state: property.property_state,                            
                        };
                    });
                    
                    return { tenant_uid, tenant_first_name, tenant_last_name, properties_list };
                });
                
                const filteredApplicants = applicantsWithProperties
                                                            .filter(applicant => applicant.properties_list.length > 0);
            
                const applicantsWithSortedProperties = sortPropertiesList(filteredApplicants)                
                setApplicantsData(applicantsWithSortedProperties);
                
                
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
                const ownersWithSortedProperties = sortPropertiesList(ownersWithProperties)                
                setOwnersData(ownersWithSortedProperties)
                

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
                const tenantsWithSortedProperties = sortPropertiesList(tenantsWithProperties)
                                
                setTenantsData(tenantsWithSortedProperties);

                const tenantsByProperties = properties
                    .filter(property => property.tenant_first_name !== null && property.tenant_last_name !== null)
                    .sort((a, b) => {
                        const getNumericPart = str => {
                            const matchA = str.match(/\d+/);
                            return matchA ? parseInt(matchA[0]) : null;
                        };
                        
                        const numericA = getNumericPart(a.property_address);
                        const numericB = getNumericPart(b.property_address);
                                        
                        if (numericA === null && numericB === null) {                            
                            return a.property_address.localeCompare(b.property_address);
                        }
                                                
                        if (numericA === null) return -1;
                        if (numericB === null) return 1;
                                                
                        return numericA - numericB;
                    });

                setTenantsByPropertyData(tenantsByProperties);                            
                setShowSpinner(false);
        });
    }, []);

    const { user, selectedRole, selectRole, Name } = useUser();
    
    const handleSendAnnouncement = async (e) => {
        e.preventDefault();
        setShowInvalidAnnouncementPrompt(false);

        if(announcementTitle === "" || announcementMessage === "" || selectedUsers.length === 0 || (announcementTypes.text === false && announcementTypes.email === false)){
            setShowInvalidAnnouncementPrompt(true);
            return;
        }
        setShowSpinner(true);

        const sendAnnouncement = async (receiverPropertyMapping) => {
            const announcement_receivers = []
            const announcement_properties = receiverPropertyMapping;
            
            Object.keys(receiverPropertyMapping).forEach((receiver) => {
                announcement_receivers.push(receiver);
            });

            // console.log("sendAnnouncement - announcement_receivers - ", announcement_receivers)
            // console.log("sendAnnouncement - announcement_properties - ", announcement_properties)
            // console.log("sendAnnouncement - announcement_properties - string - ", JSON.stringify(announcement_properties))

            const announcement_types_list = []
            if(announcementTypes.text){
                announcement_types_list.push("Text")
            }
            if(announcementTypes.email){
                announcement_types_list.push("Email")
            }
            
            promises.push(fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/${getProfileId()}`,
            // promises.push(fetch(`http://localhost:4000/announcements/${getProfileId()}`,
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
                    announcement_properties: JSON.stringify(announcement_properties), 
                    announcement_mode: "LEASE",
                    announcement_receiver: announcement_receivers,
                    // announcement_type: ["Text", "Email"],
                    announcement_type: announcement_types_list,
                }),
            }));            
        }
        
        if(selectedOption === "tenants_by_name"){                       
            let receiverPropertyMapping = selectedUsers.reduce((acc, obj) => {
                const tenantUid = obj.tenant_uid;
                const tenantProperties = obj.properties_list.map((property => property.property_uid))
                if (!acc[tenantUid]) {
                    acc[tenantUid] = [];
                }                
                acc[tenantUid] = tenantProperties;
                return acc;
            }, {});     

            // console.log("tenants_by_name - receiverPropertyMapping - ", receiverPropertyMapping);
            sendAnnouncement(receiverPropertyMapping);
            
        } else if(selectedOption === "owners_by_name"){            
            let receiverPropertyMapping = selectedUsers.reduce((acc, obj) => {
                const ownerUid = obj.owner_uid;
                const ownerProperties = obj.properties_list.map((property => property.property_uid))
                if (!acc[ownerUid]) {
                    acc[ownerUid] = [];
                }                
                acc[ownerUid] = ownerProperties;
                return acc;
            }, {});     

            // console.log("owners_by_name - receiverPropertyMapping - ", receiverPropertyMapping);
            sendAnnouncement(receiverPropertyMapping);

        } else if(selectedOption === "applicants_by_name"){                                      
            let groupedData = selectedUsers.reduce((acc, obj) => {
                const tenantUid = obj.tenant_uid;
                if (!acc[tenantUid]) {
                    acc[tenantUid] = [];
                }
                acc[tenantUid].push(obj);
                return acc;
            }, {});            

            const receiverPropertyMapping = {};
            Object.keys(groupedData).forEach((receiver) => {                
                const properties = groupedData[receiver][0].properties_list.map(property => property.property_uid);                
                receiverPropertyMapping[receiver] = properties;
            });                        
            console.log("applicants_by_name - receiverPropertyMapping - ", receiverPropertyMapping);
            sendAnnouncement(receiverPropertyMapping);

        } else if(selectedOption === "tenants_by_property") {            
            let groupedData = selectedUsers.reduce((acc, obj) => {
                const tenantUid = obj.tenant_uid;
                if (!acc[tenantUid]) {
                    acc[tenantUid] = [];
                }
                acc[tenantUid].push(obj);
                return acc;
            }, {});            
            
            const receiverPropertyMapping = {};
            Object.keys(groupedData).forEach((receiver) => {                
                const properties = groupedData[receiver].map(property => property.property_uid);                
                receiverPropertyMapping[receiver] = properties;
            });
                        
            console.log("tenants_by_property - receiverPropertyMapping - ", receiverPropertyMapping);
            sendAnnouncement(receiverPropertyMapping); 
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

    const handleAnnouncementTypeChange = (event) => {        
        if(event.target.getAttribute('name') === "text"){            
            setAnnouncementTypes((prevState) => {
                return {
                    ...prevState,                    
                    text: !prevState.text                    
                }                
            })
        } else if(event.target.getAttribute('name') === "email"){            
            setAnnouncementTypes((prevState) => {
                return {
                    ...prevState,                    
                    email: !prevState.email
                }                
            })
        }
    }

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
            <Box 
                className="announcement-title"
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                }}
            >                                
                <div className="announcement-title-text">
                    {"New Announcement"}
                </div>                
            </Box>
            <hr />                        
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
                                Announcement Type
                            </Typography>
                            <FormGroup>
                                
                                <FormControlLabel name="text" control={<Checkbox />} checked={announcementTypes.text} onChange={(e)=> handleAnnouncementTypeChange(e)} label="Text" />
                                <FormControlLabel name="email" control={<Checkbox />} checked={announcementTypes.email} onChange={(e)=> handleAnnouncementTypeChange(e)} label="Email" />
                                
                            </FormGroup>
                        </Grid>
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
                                <FormControlLabel
                                    value="tenants_by_property"
                                    control={<Radio />}
                                    label="Tenants By Property"
                                />
                            </RadioGroup>
                        </Grid>                        
                        <Grid item xs={12}>
                            {
                                selectedOption === "tenants_by_name" && (
                                    <>                                        
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
                                                    {applicantsData.map((applicant, index) => (
                                                        <ApplicantRow
                                                            key={index}
                                                            applicant={applicant}
                                                            // propertyAddressesMap={propertyAddressesMap}
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
                            {
                                selectedOption === "tenants_by_property" && (
                                    <>                                        
                                        <Box>
                                            <TableContainer>
                                                <Table>
                                                <TableHead>
                                                    <TableRow>
                                                    <TableCell>{""}</TableCell>
                                                    <TableCell>Property</TableCell>
                                                    <TableCell>Tenant</TableCell>                                                    
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {tenantsByPropertyData.map((property, index) => (
                                                        <TenantByPropertyRow
                                                            key={index}
                                                            property={property}
                                                            isSelected={selectedUsers.includes(property)}
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

function TenantByPropertyRow({ property, isSelected, handleCheckboxChange }) {
    const handleChange = (event) => {
      handleCheckboxChange(property, event.target.checked);
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
        <TableCell>{`${property.property_address}, ${property.property_city}, ${property.property_state}`}</TableCell>        
        <TableCell>{`${property.tenant_first_name} ${property.tenant_last_name}`}</TableCell>        
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
        <TableCell>
            {applicant.properties_list.map((property, index) => (
                <Box key={index}>
                {`${property.property_address}, Unit - ${property.property_unit}, ${property.property_city}, ${property.property_state}`}
                </Box>
            ))}
        </TableCell>        
      </TableRow>
    );
}