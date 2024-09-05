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
import Documents from './Documents';

const EditLease = (props) => {
    const { user, getProfileId } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [contractFileTypes, setContractFileTypes] = useState([]);
    const leaseData = location.state.leaseData;
    // console.log("---dhyey--- leasedata Documents- ", JSON.parse(leaseData.lease_documents))
    const [leaseDocuments, setLeaseDocuments] = useState(JSON.parse(leaseData.lease_documents));
    const [contractFiles, setContractFiles] = useState([]);
    const [contractName, setContractName] = useState(leaseData.contract_name)
    const [startDate, setStartDate] = useState(leaseData.lease_start)
    const [endDate, setEndDate] = useState(leaseData.lease_end)
    const [moveIn, setMoveIn] = useState(leaseData.lease_move_in_date)
    const [noOfOcc, setNoOfOcc] = useState("")
    const [contentTypes, setContentTypes] = useState([]);

    const rentDataFromLease = JSON.parse(leaseData.lease_fees).filter((lease) => lease.fee_name === "Rent");

    const [rent, setRent] = useState(rentDataFromLease[0].charge? rentDataFromLease[0].charge : 0)
    const [rentFreq, setRentFreq] = useState(rentDataFromLease[0].frequency? rentDataFromLease[0].frequency : "Monthly")
    const [lateFeeAfter, setLateFeeAfter] = useState(rentDataFromLease[0].late_by? rentDataFromLease[0].late_by : 0)
    const [lateFeePerDay, setLateFeePerDay] = useState(rentDataFromLease[0].late_fee? rentDataFromLease[0].late_fee:0)
    const [rentDue, setRentDue] = useState(rentDataFromLease[0].due_by? rentDataFromLease[0].due_by : 0)
    const [availablePay, setAvailablePay] = useState(rentDataFromLease[0].available_topay? rentDataFromLease[0].available_topay:0)
    const [showMissingFileTypePrompt, setShowMissingFileTypePrompt] = useState(false);
    // console.log("---dhyey---- inside edit lease- leasedata, ", leaseData);

    // const checkFileTypeSelected = () => {
    //     for (let i = 0; i < contractFiles.length; i++) {
    //       if (i >= contractFileTypes.length) {
    //         return false; // Return false if the index is out of bounds
    //       }
    //       const fileType = contractFileTypes[i];
    //       console.log("FILE TYPE: ", fileType);
    //       if (!fileType || fileType.trim() === "") {
    //         return false;
    //       }
    //     }
    //     setShowMissingFileTypePrompt(false);
    //     return true;
    // };

    function formatDate(date) {
        var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();
      
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
      
        return [month, day, year].join("-");
    }

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
        navigate('/tenantDashboard',{
            state:{
                viewLeaseState : {
                    lease_id : leaseData.lease_uid,
                    property_uid: leaseData.property_uid,
                    isDesktop: true,
                }
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

    useEffect(() =>{
        fetchContentTypes();
    }, []);
    
    const fetchContentTypes = async()=>{
        try {
          const response = await axios.get('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/lists?list_category=content');
          // console.log(response.data.result)
          setContentTypes(response.data.result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

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
        leaseApplicationFormData.append('lease_adults', leaseData?.lease_adults)
        leaseApplicationFormData.append('lease_children', leaseData?.lease_children) 
        leaseApplicationFormData.append('lease_pets', leaseData?.lease_pets)    
        leaseApplicationFormData.append('lease_vehicles', leaseData?.lease_vehicles)  
        leaseApplicationFormData.append('lease_application_date', formatDate(date)) // change date format
        leaseApplicationFormData.append('tenant_uid', getTenantsUid(leaseData))

        // leaseApplicationFormData.append("contract_name",leaseData.contract_name)
        leaseApplicationFormData.append("lease_start",leaseData.lease_start)
        leaseApplicationFormData.append("lease_end",leaseData.lease_end)
        leaseApplicationFormData.append("lease_move_in_date",leaseData.lease_move_in_date)    
        
        const leaseFees = [{"charge": rent, "due_by": rentDue, "late_by": lateFeeAfter, "fee_name": "Rent", "fee_type": "$", "late_fee": lateFeePerDay, "frequency": rentFreq, "due_by_date": null, "available_topay": availablePay, "perDay_late_fee":rentDataFromLease[0].perDay_late_fee, "id": rentDataFromLease[0].id}];

        // leaseApplicationFormData.append("property_listed_rent",leaseData.property_listed_rent)
        // leaseApplicationFormData.append("frequency",leaseData.frequency)
        // leaseApplicationFormData.append("lease_rent_late_by",leaseData.lease_rent_late_by)
        // leaseApplicationFormData.append("lease_rent_late_fee",leaseData.lease_rent_late_fee)
        // leaseApplicationFormData.append("lease_rent_due_by",leaseData.lease_rent_due_by)
        // leaseApplicationFormData.append("lease_rent_available_topay",leaseData.lease_rent_available_topay)

        leaseApplicationFormData.append("lease_fees", JSON.stringify(leaseFees))

        if(contractFiles.length){
            const documentsDetails = [];
            [...contractFiles].forEach((file, i) => {
                leaseApplicationFormData.append(`file_${i}`, file, file.name);
                const fileType = contractFileTypes[i] || '';
                const documentObject = {
                    // file: file,
                    fileIndex: i, //may not need fileIndex - will files be appended in the same order?
                    fileName: file.name, //may not need filename
                    contentType: fileType,
                };
                documentsDetails.push(documentObject);
            });
            leaseApplicationFormData.append("lease_documents_details", JSON.stringify(documentsDetails));
        }

        axios.post('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication', leaseApplicationFormData, headers)
        .then((response) => {
            console.log('Data updated successfully');
            navigate('/tenantDashboard',{ 
            });
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
        // leaseApplicationFormData.append("contract_name",leaseData.contract_name)
        leaseApplicationFormData.append("lease_start",leaseData.lease_start)
        leaseApplicationFormData.append("lease_end",leaseData.lease_end)
        leaseApplicationFormData.append("lease_move_in_date",leaseData.lease_move_in_date) 
        
        const leaseFees = [{"charge": rent, "due_by": rentDue, "late_by": lateFeeAfter, "fee_name": "Rent", "fee_type": "$", "late_fee": lateFeePerDay, "frequency": rentFreq, "due_by_date": null, "leaseFees_uid": rentDataFromLease[0].leaseFees_uid, "available_topay": availablePay, "perDay_late_fee":rentDataFromLease[0].perDay_late_fee, "id": rentDataFromLease[0].id}];
        leaseApplicationFormData.append("lease_fees", JSON.stringify(leaseFees))

        // leaseApplicationFormData.append("property_listed_rent",leaseData.property_listed_rent)
        // leaseApplicationFormData.append("frequency",leaseData.frequency)
        // leaseApplicationFormData.append("lease_rent_late_by",leaseData.lease_rent_late_by)
        // leaseApplicationFormData.append("lease_rent_late_fee",leaseData.lease_rent_late_fee)
        // leaseApplicationFormData.append("lease_rent_due_by",leaseData.lease_rent_due_by)
        // leaseApplicationFormData.append("lease_rent_available_topay",leaseData.lease_rent_available_topay)

        if(contractFiles.length){
            const documentsDetails = [];
            [...contractFiles].forEach((file, i) => {
                leaseApplicationFormData.append(`file_${i}`, file, file.name);
                const fileType = contractFileTypes[i] || '';
                const documentObject = {
                    // file: file,
                    fileIndex: i, //may not need fileIndex - will files be appended in the same order?
                    fileName: file.name, //may not need filename
                    contentType: fileType,
                };
                documentsDetails.push(documentObject);
            });
            leaseApplicationFormData.append("lease_documents_details", JSON.stringify(documentsDetails));
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
                console.log("Error in sending announcements:", error);
                alert("We were unable to Text the Property Manager but we were able to send them a notification through the App");
            }
        };
        sendAnnouncement();
        handleCloseButton();          
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
                    sx={{
                        margin: '30px',
                        padding: theme.spacing(2),
                        backgroundColor: theme.palette.primary.secondary,
                        width: '85%', // Occupy full width with 25px margins on each side
                        // [theme.breakpoints.down('sm')]: {
                        //     width: '80%',
                        // },
                        // [theme.breakpoints.up('sm')]: {
                        //     width: '50%',
                        // },
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
                                <Documents isEditable={true} documents={leaseDocuments} isAccord={false} setDocuments={setLeaseDocuments} contractFileTypes={contractFileTypes} setContractFileTypes={setContractFileTypes} contractFiles={contractFiles} setContractFiles={setContractFiles}/>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Button
                                        width='100px'
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

function getTenantsUid(leaseData){
    let tenants = leaseData.tenants ? JSON.parse(leaseData.tenants): []

    let tenantsUid = "";


    tenants.map((t, i)=>{
        if(i == 0){
            tenantsUid += t.tenant_uid;
        }else{
            tenantsUid += "," + t.tenant_uid;
        }
    })

    return tenantsUid;
}

export default EditLease;
