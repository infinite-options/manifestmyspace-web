import React, {useEffect, useState} from 'react';
import theme from '../../theme/theme';
import axios from "axios";
import {
    Paper,
    ThemeProvider,
    Box,
    Stack,
    Typography,
    Button,
    Table,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import { CalendarToday, Chat, Close, Description } from '@mui/icons-material';
import { useNavigate, useLocation} from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";

const EditLease = (props) => {
    const { user, getProfileId } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [contractFileTypes, setContractFileTypes] = useState([]);
    const leaseData = location.state.leaseData;
    const [contractFiles, setContractFiles] = useState([]);
    const [contractName, setContractName] = useState(leaseData.contract_name)
    const [startDate, setStartDate] = useState(leaseData.lease_start)
    const [endDate, setEndDate] = useState(leaseData.lease_end)
    const [moveIn, setMoveIn] = useState(leaseData.lease_move_in_date)
    const [noOfOcc, setNoOfOcc] = useState("")
    const [rent, setRent] = useState(leaseData.property_listed_rent)
    const [rentFreq, setRentFreq] = useState(leaseData.frequency)
    const [lateFeeAfter, setLateFeeAfter] = useState(leaseData.lease_rent_late_by)
    const [lateFeePerDay, setLateFeePerDay] = useState(leaseData.lease_rent_late_fee)
    const [rentDue, setRentDue] = useState(leaseData.lease_rent_due_by)
    const [availablePay, setAvailablePay] = useState(leaseData.lease_rent_available_topay)
    const [showMissingFileTypePrompt, setShowMissingFileTypePrompt] = useState(false);

    const checkFileTypeSelected = () => {
        for (let i = 0; i < contractFiles.length; i++) {
          if (i >= contractFileTypes.length) {
            return false; // Return false if the index is out of bounds
          }
          const fileType = contractFileTypes[i];
          console.log("FILE TYPE: ", fileType);
          if (!fileType || fileType.trim() === "") {
            return false;
          }
        }
        setShowMissingFileTypePrompt(false);
        return true;
    };

    const handleContractNameChange = (event) => {
        setContractName(event.target.value);
    }

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    }

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    }

    const handleMoveInChange = (event) => {
        setMoveIn(event.target.value);
    }

    const handleNoOfOccChange = (event) => {
        setNoOfOcc(event.target.value);
    }

    const handleRentChange = (event) => {
        setRent(event.target.value);
    }
    const handleRentFreqChange = (event) => {
        setRentFreq(event.target.value);
    }

    const handleLateFeeAfterChange = (event) => {
        setLateFeeAfter(event.target.value);
    }

    const handleLateFeePerDayChange = (event) => {
        setLateFeePerDay(event.target.value);
    }

    const handleRentDueChange = (event) => {
        setRentDue(event.target.value);
    }

    const handleAvailablePayChange = (event) => {
        setAvailablePay(event.target.value);
    }

    const handleCloseButton = () => {
        navigate('/viewLease',{
            state:{
                lease_id : leaseData.lease_uid
            } 
        });
    };

    const handleRemoveFile = (index) => {
        setContractFiles(prevFiles => {
            const filesArray = Array.from(prevFiles);
            filesArray.splice(index, 1);
            return filesArray;
        });
        setContractFileTypes(prevTypes => {
            const typesArray = [...prevTypes];
            typesArray.splice(index, 1);
            return typesArray;
        });
    };


    const handleNewLease = () => {

        const headers = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials":"*"
        };

        let date = new Date()

        const leaseApplicationFormData = new FormData();
      
        leaseApplicationFormData.append('lease_property_id', leaseData.property_uid)
        leaseApplicationFormData.append('lease_status', "NEW")
        leaseApplicationFormData.append('lease_assigned_contacts', leaseData.lease_assigned_contacts)
        leaseApplicationFormData.append('lease_documents', leaseData.lease_documents)
        leaseApplicationFormData.append('lease_adults', leaseData?.tenant_adult_occupants)
        leaseApplicationFormData.append('lease_children', leaseData?.tenant_children_occupants)
        leaseApplicationFormData.append('lease_pets', leaseData?.tenant_pet_occupants)
        leaseApplicationFormData.append('lease_vehicles', leaseData?.tenant_vehicle_info)
        leaseApplicationFormData.append('lease_application_date', date.toLocaleDateString())
        leaseApplicationFormData.append('tenant_uid', leaseData.tenant_uid)

        leaseApplicationFormData.append("contract_name",leaseData.contract_name)
        leaseApplicationFormData.append("lease_start",leaseData.lease_start)
        leaseApplicationFormData.append("lease_end",leaseData.lease_end)
        leaseApplicationFormData.append("lease_move_in_date",leaseData.lease_move_in_date)                                     
        leaseApplicationFormData.append("property_listed_rent",leaseData.property_listed_rent)
        leaseApplicationFormData.append("frequency",leaseData.frequency)
        leaseApplicationFormData.append("lease_rent_late_by",leaseData.lease_rent_late_by)
        leaseApplicationFormData.append("lease_rent_late_fee",leaseData.lease_rent_late_fee)
        leaseApplicationFormData.append("lease_rent_due_by",leaseData.lease_rent_due_by)
        leaseApplicationFormData.append("lease_rent_available_topay",leaseData.lease_rent_available_topay)

        if(contractFiles.length){
            const documentsDetails = [];
            [...contractFiles].forEach((file, i) => {
                leaseApplicationFormData.append(`file-${i}`, file, file.name);
                const fileType = contractFileTypes[i] || '';
                const documentObject = {
                    // file: file,
                    fileIndex: i, //may not need fileIndex - will files be appended in the same order?
                    fileName: file.name, //may not need filename
                    fileType: fileType,
                };
                documentsDetails.push(documentObject);
            });
            leaseApplicationFormData.append("lease_documents", JSON.stringify(documentsDetails));
        }

        axios.post('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication', leaseApplicationFormData, headers)
        .then((response) => {
            console.log('Data updated successfully');
        })
        .catch((error) => {
            if(error.response){
                console.log(error.response.data);
            }
        });

    }

    const handleRenewLease = () => {
        const headers = { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials":"*"
        };

        const leaseApplicationFormData = new FormData();
        leaseApplicationFormData.append("lease_uid", leaseData.lease_uid);
        leaseApplicationFormData.append("contract_name",leaseData.contract_name)
        leaseApplicationFormData.append("lease_start",leaseData.lease_start)
        leaseApplicationFormData.append("lease_end",leaseData.lease_end)
        leaseApplicationFormData.append("lease_move_in_date",leaseData.lease_move_in_date)                                     
        leaseApplicationFormData.append("property_listed_rent",leaseData.property_listed_rent)
        leaseApplicationFormData.append("frequency",leaseData.frequency)
        leaseApplicationFormData.append("lease_rent_late_by",leaseData.lease_rent_late_by)
        leaseApplicationFormData.append("lease_rent_late_fee",leaseData.lease_rent_late_fee)
        leaseApplicationFormData.append("lease_rent_due_by",leaseData.lease_rent_due_by)
        leaseApplicationFormData.append("lease_rent_available_topay",leaseData.lease_rent_available_topay)

        if(contractFiles.length){
            const documentsDetails = [];
            [...contractFiles].forEach((file, i) => {
                leaseApplicationFormData.append(`file-${i}`, file, file.name);
                const fileType = contractFileTypes[i] || '';
                const documentObject = {
                    // file: file,
                    fileIndex: i, //may not need fileIndex - will files be appended in the same order?
                    fileName: file.name, //may not need filename
                    fileType: fileType,
                };
                documentsDetails.push(documentObject);
            });
            leaseApplicationFormData.append("contract_documents_details", JSON.stringify(documentsDetails));
        }

        axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication', leaseApplicationFormData, headers)
        .then((response) => {
            console.log('Data updated successfully');
        })
        .catch((error) => {
            if(error.response){
                console.log(error.response.data);
            }
        });

        const sendAnnouncement = async () => {
            try {
              const receiverPropertyMapping = {
                [leaseData.business_uid]: [leaseData.lease_property_id],
              };
      
              await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/announcements/${getProfileId()}`, {
                // await fetch(`http://localhost:4000/announcements/${getProfileId()}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  announcement_title: "Lease Renewed by Tenant",
                  announcement_msg: `Lease for ${leaseData.property_address}, Unit -${leaseData.property_unit} has been renewed by the Tenant.`,
                  announcement_sender: getProfileId(),
                  announcement_date: new Date().toDateString(),
                  // announcement_properties: property.property_uid,
                  announcement_properties: JSON.stringify(receiverPropertyMapping),
                  announcement_mode: "LEASE",
                  announcement_receiver: [leaseData.business_uid],
                  announcement_type: ["Text", "Email"],
                }),
              });
            } catch (error) {
              console.log(error);
            }
          };
          sendAnnouncement();          
    }

    return (
        <ThemeProvider theme={theme}>
            <Box
                style={{
                    display: 'flex',
                    fontFamily: 'Source Sans Pro',
                    justifyContent: 'center',
                    width: '100%', // Take up full screen width
                    minHeight: '90vh', // Set the Box height to full height
                    marginTop: theme.spacing(2), // Set the margin to 20px
                }}
            >
                <Paper
                    style={{
                        margin: '30px',
                        padding: theme.spacing(2),
                        backgroundColor: theme.palette.primary.secondary,
                        width: '85%', // Occupy full width with 25px margins on each side
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        [theme.breakpoints.up('sm')]: {
                            width: '50%',
                        },
                        paddingTop: '10px',
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                        sx={{ paddingBottom: '25px', paddingTop: '15px' }}
                    >
                        <Box
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.primary.black,
                                    fontWeight:
                                        theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.largeFont,
                                }}
                            >
                                Edit/Renew Lease
                            </Typography>
                        </Box>
                        <Box position="absolute" right={0}>
                            <Button onClick={handleCloseButton}>
                                <Close
                                    sx={{
                                        color: theme.typography.primary.black,
                                        fontSize: '20px',
                                        margin: '5px',
                                    }}
                                />
                            </Button>
                        </Box>
                    </Stack>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography
                                        sx={{
                                            color: theme.typography.primary
                                                .black,
                                            fontWeight:
                                                theme.typography.primary
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {`${leaseData.property_address}, ${leaseData.property_city}, ${leaseData.property_state} ${leaseData.property_zip}`}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.primary
                                                .black,
                                            fontWeight:
                                                theme.typography.primary
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Owner: {`${leaseData.owner_first_name} ${leaseData.owner_last_name}`}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Button>
                                        <Chat
                                            sx={{
                                                color: theme.typography.common
                                                    .blue,
                                                fontSize: '16px',
                                                margin: '5px',
                                            }}
                                        />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.primary
                                                .black,
                                            fontWeight:
                                                theme.typography.primary
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Tenant:  {getTenantName(leaseData)}                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Button>
                                        <Chat
                                            sx={{
                                                color: theme.typography.common
                                                    .blue,
                                                fontSize: '16px',
                                                margin: '5px',
                                            }}
                                        />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Contract Name
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        type="text"
                                        label="Enter contract name"
                                        fullWidth
                                        value={contractName} onChange={handleContractNameChange}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1}>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Start Date
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        label="mm-dd-yyyy"
                                        value={startDate} onChange={handleStartDateChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize:
                                                            theme.typography
                                                                .smallFont,
                                                    }}
                                                >
                                                    <CalendarToday />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                                <TableCell colSpan={1}>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        End Date
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        label="mm-dd-yyyy"
                                        value={endDate} onChange={handleEndDateChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize:
                                                            theme.typography
                                                                .smallFont,
                                                    }}
                                                >
                                                    <CalendarToday />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Move In Date
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        label="mm-dd-yyyy"
                                        value={moveIn} onChange={handleMoveInChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize:
                                                            theme.typography
                                                                .smallFont,
                                                    }}
                                                >
                                                    <CalendarToday />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        # of Occupants
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        label="Number"
                                        type="number"
                                        value={noOfOcc} onChange={handleNoOfOccChange}

                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Rent
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        value={rent} onChange={handleRentChange}

                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize: '16px',
                                                        paddingRight: '5px',
                                                    }}
                                                >
                                                    &#36;
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Rent Frequency
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        label="Monthly"
                                        type="text"
                                        value={rentFreq} onChange={handleRentFreqChange}

                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Late Fee After
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        label="days"
                                        type="text"
                                        value={lateFeeAfter} onChange={handleLateFeeAfterChange}

                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Late Fee Per Day
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        value={lateFeePerDay} onChange={handleLateFeePerDayChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        color: theme.typography
                                                            .common.blue,
                                                        fontSize: '16px',
                                                        paddingRight: '5px',
                                                        margin: 0,
                                                    }}
                                                >
                                                    &#36;
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Rent Due Date
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        label="of month"
                                        type="text"
                                        value={rentDue} onChange={handleRentDueChange}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                            fontSize: '16px',
                                        }}
                                    >
                                        Available to Pay
                                    </Typography>
                                    <TextField
                                        variant="filled"
                                        label="days before"
                                        type="text"
                                        value={availablePay} onChange={handleAvailablePayChange}

                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        sx={{
                                            color: theme.typography.common.blue,
                                            fontWeight:
                                                theme.typography.common
                                                    .fontWeight,
                                        }}
                                    >
                        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                            <DescriptionIcon sx={{ fontSize: 19, color: '#3D5CAC'}} /> Add Document
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".doc,.docx,.txt,.pdf"
                            hidden
                            // onChange={(e) => setContractFiles(e.target.files)}
                            onChange={(e) => setContractFiles((prevFiles) => [...prevFiles, ...e.target.files])}
                            
                            multiple
                        />
                                    </Button>

                        
{
                contractFiles.length? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent:'space-between',
                        alignItems: 'center',
                        marginBottom: '7px',
                        width: '100%',
                    }}>
                        
                                   
                        <Box
                            sx={{
                                fontSize: '15px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                                width: '100%',
                            }}
                        >
                            Added Documents:
                            {[...contractFiles].map((f, i) => (
                                <Box
                                    key={i} 
                                    sx={{
                                        display:'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            
                                            // height: '16px',
                                            width: '50%', // Adjust the width as needed
                                            padding: '8px', // Adjust the padding as needed
                                        }}
                                    >
                                    {f.name}
                                    </Box>
                                    <Select
                                        value={contractFileTypes[i]}
                                        label="Document Type"
                                        onChange={(e) => {
                                                const updatedTypes = [...contractFileTypes];
                                                updatedTypes[i] = e.target.value;
                                                setContractFileTypes(updatedTypes);
                                            }
                                        }
                                        required
                                        sx={{
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                            width: '40%', // Adjust the width as needed
                                            padding: '8px', // Adjust the padding as needed
                                        }}
                                    >
                                        <MenuItem value={"contract"}>contract</MenuItem>
                                        <MenuItem value={"other"}>other</MenuItem>
                                    </Select>
                                    <Button 
                                        variant="text"
                                        onClick={() => {
                                            // setContractFiles(prevFiles => prevFiles.filter((file, index) => index !== i));
                                            handleRemoveFile(i)
                                        }}
                                        sx={{
                                            width: '10%', 
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold', 
                                            color: '#3D5CAC', 
                                        }}
                                        
                                    >
                                        <DeleteIcon  sx={{ fontSize: 19, color: '#3D5CAC'}} />
                                    </Button>
                                </Box>
        
                                
                            ))}
                            
                            {showMissingFileTypePrompt && (
                                <Box
                                    sx={{
                                        color: 'red',
                                        fontSize: '13px',
                                    }}
                                >
                                    Please select document types for all documents before proceeding.
                                </Box>
                            )}
                        </Box>  </Box>
                ) : (<></>)
            }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        position="relative"
                        sx={{ padding: '15px' }}
                    >
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.blue,
                                margin: '10px',
                            }}  onClick={handleRenewLease}
                        >
                            Renew Lease
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.common.fontWeight,
                                backgroundColor: theme.palette.custom.blue,
                                margin: '10px',
                            }} onClick={handleNewLease}
                        >
                            New Lease
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

function getTenantName(leaseData){

    let name = "";

    let tenants = leaseData.tenants ? JSON.parse(leaseData.tenants): [];

    console.log(tenants)
    name += tenants && tenants[0] ? tenants[0].tenant_first_name : "";
    if(name.length>0){
        name+=" "
    }
    name += tenants && tenants[0] ? tenants[0].tenant_last_name : "";
    
    return name;

}


export default EditLease;
