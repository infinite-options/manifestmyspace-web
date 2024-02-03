import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import {
    ThemeProvider,
    Box,
    Paper,
    Stack,
    Typography,
    Button,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Select,
    MenuItem,
    Grid,
} from '@mui/material';
import theme from '../../../theme/theme';
import CircularProgress from "@mui/material/CircularProgress";



import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';

import ImageCarousel from "../../ImageCarousel";
import defaultHouseImage from "../../Property/defaultHouseImage.png"

function isValidDate(dateString){
    const dateParts = dateString.split("-");
    const month = parseInt(dateParts[0]);
    const day = parseInt(dateParts[1]);
    const year = parseInt(dateParts[2]);

    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && dateParts[0].length === 2 && dateParts[1].length === 2 && dateParts[2].length === 4;

}


function PMContractDetailsList(props) {
    const { getProfileId } = useUser();
    const navigate = useNavigate();

    const {state} = useLocation();
    const { contract_uid, contract_business_id, contract_property_id } = state;
    
    const [contractUID, setContractUID] = useState(null);
    const [contractBusinessID, setContractBusinessID] = useState(null);
    useEffect(() => {
        console.log('CONTRACT BUSINESS ID: ', contractBusinessID);
    }, [contractBusinessID]);
    // let contractBusinessID = "";

    const [contractPropertyID, setContractPropertyID] = useState(null);
    useEffect(() => {
        console.log('CONTRACT PROPERTY ID: ', contractPropertyID);
    }, [contractPropertyID]);
    // let contractPropertyID = "";

    const [showSpinner, setShowSpinner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [propertiesData, setPropertiesData] = useState([]);
    const [filteredPropertiesData, setFilteredPropertiesData] = useState([]); // filter out the properties that aren't included in announcement_properties
    
    // useEffect(() => {
    //     // setContractPropertyID(filteredPropertiesData["property_uid"]);
    // }, [filteredPropertiesData]);
    
    
    const [index, setIndex] = useState(0);
    const [timeDiff, setTimeDiff] = useState(null);

    useEffect(() => {
        console.log("Management Contract Details UseEffect");
        
        const fetchData = async () => {
            setShowSpinner(true);

            

            // console.log("ANNOUNCEMENT DATA", announcementData);

            // setContractBusinessID(announcementData["announcement_receiver"]);
            setContractBusinessID(contract_business_id);
            setContractUID(contract_uid)

            

            // const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/110-000096`)

            // const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${property_owner_id}`) 
            

            // const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${property_owner_id}`)
            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${getProfileId()}`)
            
            const responseData = await response.json();

            
            // setPropertiesData(responseData["Property"]["result"]? responseData["Property"]["result"] : []);
            // const properties = responseData["Property"]["result"]? responseData["Property"]["result"] : [];
            const properties = responseData["NewPMRequests"]["result"]? responseData["NewPMRequests"]["result"] : [];
            console.log("PROPERTIES", properties);
            setPropertiesData(properties);

            // setFilteredPropertiesData(propertiesData.filter(property => announcementData.announcement_properties.includes(property.property_uid)));

            

            
            // // const announcementPropertiesArray = announcementData.announcement_properties.split(','); //If "announcement_properties" is a string
            // const announcementPropertiesArray = [contract_property_id];
            // const filteredProperties = properties.filter(property => announcementPropertiesArray.includes(property.property_uid));
            // // const filteredProperties = properties.filter(property => announcementData.announcement_properties.includes(property.property_uid)); // if "announcement_properties" is an array
            const filteredProperties = properties.filter(property => property.property_uid === contract_property_id);
            console.log("FILTERED PROPERTIES", filteredProperties);
            setFilteredPropertiesData(filteredProperties)

            // console.log("FILTERED PROPERTIES DATA", filteredProperties);



            // setContractPropertyID(filteredProperties[0]["property_uid"]);
            setContractPropertyID(contract_property_id);
            
            
            


            setIsLoading(false);
            setShowSpinner(false);
        };
        const calculateTimeDiff = () => {
            // const announcement_date = new Date("announcementData["announcement_date"]");
            const announcement_date = new Date();
            // const announcement_date = new Date(Date.UTC(
            //     announcementData["announcement_date"].getFullYear(),
            //     announcementData["announcement_date"].getMonth(),
            //     announcementData["announcement_date"].getDate(),
            //     announcementData["announcement_date"].getHours(),
            //     announcementData["announcement_date"].getMinutes(),
            //     announcementData["announcement_date"].getSeconds()
            // ));
            if (announcement_date === null) {
                return "<TIME AGO>";
            }
            const now = new Date();
            const timeDiff = now - announcement_date;

            const seconds = Math.floor(timeDiff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            let durationString;
            if (days > 0) {
                durationString = `${days} days ago`;
            } else if (hours > 0) {
                durationString = `${hours} hours ago`;
            } else if (minutes > 0) {
                durationString = `${minutes} minutes ago`;
            } else {
                durationString = `${seconds} seconds ago`;
            }

            // console.log(now, announcement_date, announcementData["announcement_date"], durationString, seconds, minutes, hours, days);
            return durationString;
        };
        fetchData();
        setTimeDiff(calculateTimeDiff());
    }, []);

    const handleBackBtn = () => {
        navigate(-1);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <ThemeProvider theme={theme}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box sx={{
                backgroundColor: '#F2F2F2',
                borderRadius: '10px',
                margin: '25px',
                padding: '15px',
                fontFamily: 'Source Sans Pro',
            }}>
                <Stack 
                    flexDirection ="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        sx={{ padding: '0', minWidth: '150px' }}
                        onClick={handleBackBtn}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4 8L2.58579 9.41421L1.17157 8L2.58579 6.58579L4 8ZM9 21C7.89543 21 7 20.1046 7 19C7 17.8954 7.89543 17 9 17L9 21ZM7.58579 14.4142L2.58579 9.41421L5.41421 6.58579L10.4142 11.5858L7.58579 14.4142ZM2.58579 6.58579L7.58579 1.58579L10.4142 4.41421L5.41421 9.41421L2.58579 6.58579ZM4 6L14.5 6L14.5 10L4 10L4 6ZM14.5 21L9 21L9 17L14.5 17L14.5 21ZM22 13.5C22 17.6421 18.6421 21 14.5 21L14.5 17C16.433 17 18 15.433 18 13.5L22 13.5ZM14.5 6C18.6421 6 22 9.35786 22 13.5L18 13.5C18 11.567 16.433 10 14.5 10L14.5 6Z"
                                fill="#3D5CAC"
                            />
                        </svg>
                    </Button>
                    <Box sx={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'text.darkblue',
                            padding: '0',
                            minWidth: '300px',
                        }}
                    >
                        Management Contract
                    </Box>
                </Stack>
                <Box flexDirection ="row"
                    alignItems="center"
                    sx={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}
                >
                    <Box onClick={() => {
                            console.log("Previous button clicked. INDEX - ", index);
                            index > 0? setIndex(index-1) : setIndex(filteredPropertiesData.length - 1)
                        }}
                    >
                        <svg
                            width="33"
                            height="33"
                            viewBox="0 0 33 33"
                            fill="#160449"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z"
                            />
                        </svg>
                    </Box>
                    <Box
                        sx= {{
                            display: 'flex',
                            justifyContent:'center',
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight:
                                    theme.typography.primary
                                        .fontWeight,
                            }}
                        >
                            {index + 1} of {filteredPropertiesData.length} Properties 
                            {/* {contactsTab} */}
                        </Typography>
                    </Box>
                    <Box onClick={() => {
                        console.log("Next button clicked. INDEX - ", index);
                        (index < filteredPropertiesData.length - 1) ? setIndex(index+1) : setIndex(0)
                    }}
                    >
                        <svg
                            width="33"
                            height="33"
                            viewBox="0 0 33 33"
                            fill="#160449"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z"
                            />
                        </svg>
                    </Box>
                </Box>
                <PropertyCard data={filteredPropertiesData[index]? filteredPropertiesData[index]: []} timeDifference={timeDiff} contractUID={contractUID} contractBusinessID={contractBusinessID} contractPropertyID={contractPropertyID}/>
                
            </Box>
        </ThemeProvider>
    )

}

function PropertyCard(props) {
    const navigate = useNavigate();

    const propertyData = props.data;
    const timeDiff = props.timeDifference;
    const contractBusinessID = props.contractBusinessID;
    const contractPropertyID = props.contractPropertyID;

    const [showAddFeeDialog, setShowAddFeeDialog] = useState(false);
    const [showEditFeeDialog, setShowEditFeeDialog] = useState(false);
    const [showAddContactDialog, setShowAddContactDialog] = useState(false);
    const [showEditContactDialog, setShowEditContactDialog] = useState(false);    
    const [showMissingFileTypePrompt, setShowMissingFileTypePrompt] = useState(false);
    const [showInvalidEndDatePrompt, setShowInvalidEndDatePrompt] = useState(false);
    const [showInvalidStartDatePrompt, setShowInvalidStartDatePrompt] = useState(false);
    
    const [indexForEditFeeDialog, setIndexForEditFeeDialog] = useState(false);
    const [indexForEditContactDialog, setIndexForEditContactDialog] = useState(false);

    //Contract Details
    const [contractUID, setContractUID] = useState();
    const [contractName, setContractName] = useState("");
    const [contractStartDate, setContractStartDate] = useState("");
    const [contractEndDate, setContractEndDate] = useState("");
    const [contractStatus, setContractStatus] = useState("");
    const [contractFees, setContractFees] = useState([]);
    const [defaultContractFees, setDefaultContractFees] = useState([]);
    const [contractFiles, setContractFiles] = useState([]);
    const [previouslyUploadedDocs, setPreviouslyUploadedDocs] = useState([]);
    const [contractDocument, setContractDocument] = useState(null);
    const [contractFileTypes, setContractFileTypes] = useState([]);
    const [contractAssignedContacts, setContractAssignedContacts] = useState([]);
    const [propertyOwnerName, setPropertyOwnerName] = useState('');

    
    useEffect(() => {        
        if(isValidDate(contractStartDate)){
            setShowInvalidStartDatePrompt(false);
        }else{
            setShowInvalidStartDatePrompt(true);
        }
    }, [contractStartDate]);
    
    useEffect(() => {        
        if(isValidDate(contractEndDate)){
            setShowInvalidEndDatePrompt(false);
        }else{
            setShowInvalidEndDatePrompt(true);
        }
    }, [contractEndDate]);


    useEffect(()=> {
        console.log("CONTRACT ASSIGNED CONTACTS - ", contractAssignedContacts);
        // let JSONstring = JSON.stringify(defaultContractFees);
        // console.log("DEFAULT CONTRACT FEES JSON string- ", JSONstring);
        
    }, [contractAssignedContacts]);
    


    useEffect(()=> {
        console.log("DEFAULT CONTRACT FEES - ", defaultContractFees);
        // let JSONstring = JSON.stringify(defaultContractFees);
        // console.log("DEFAULT CONTRACT FEES JSON string- ", JSONstring);

        if (!contractFees.length){
            setContractFees([...defaultContractFees]);
        }
        
    }, [defaultContractFees]);
    

    useEffect(()=> {
        console.log("CONTRACT FEES - ", contractFees);

        // let JSONstring = JSON.stringify(contractFees);
        // console.log("CONTRACT FEES JSON string- ", JSONstring);
    }, [contractFees]);

    useEffect(()=> {
        console.log("CONTRACT FILE TYPES - ", contractFileTypes);

        // let JSONstring = JSON.stringify(contractFileTypes);
        // console.log("CONTRACT FILE TYPES JSON string- ", JSONstring);
    }, [contractFileTypes]);

    useEffect(()=> {
        console.log("PREVIOUSLY UPLOADED DOCS - ", previouslyUploadedDocs);

        // let JSONstring = JSON.stringify(previouslyUploadedDocs);
        // console.log("PREVIOUSLY UPLOADED DOCS JSON string- ", JSONstring);
    }, [previouslyUploadedDocs]);
    

    const handleAddFee = (newFee) => {
        // const newFee = {
        //     // Add properties for the new fee item here
        //     feeName: 'New Fee',
        //     feeAmount: 0,
        // };
        setContractFees((prevContractFees) => [...prevContractFees, newFee]);
    }

    const handleEditFee = (newFee, index) => {
        // const newFee = {
        //     // Add properties for the new fee item here
        //     feeName: 'New Fee',
        //     feeAmount: 0,
        // };
        // setContractFees((prevContractFees) => [...prevContractFees, newFee]); 
        console.log("IN handleEditFee of PropertyCard");
        console.log(newFee, index);
        setContractFees((prevContractFees) => {
            const updatedContractFees = prevContractFees.map((fee, i) => {
                if (i === index) {
                    return newFee;
                }
                return fee;
            });
            return updatedContractFees;
        });
    }

    const handleDeleteFee = (index, event) => {
        console.log("Contract Fees", contractFees);
        setContractFees(prevFees => {
            const feesArray = Array.from(prevFees);
            feesArray.splice(index, 1);
            return feesArray;
        });
        event.stopPropagation();
    }

    const handleOpenAddFee = () => {
        setShowAddFeeDialog(true);
    };

    const handleCloseAddFee = () => {
        setShowAddFeeDialog(false);
    };

    const handleOpenEditFee = (feeIndex) => {
        setShowEditFeeDialog(true);
        console.log("EDITING FEE, Index", feeIndex);
        setIndexForEditFeeDialog(feeIndex);
    };

    const handleCloseEditFee = () => {
        setShowEditFeeDialog(false);
    };

    const handleCloseAddContact = () => {
        setShowAddContactDialog(false);
    };

    const handleOpenEditContact = (contactIndex) => {
        setShowEditContactDialog(true);
        console.log("EDITING CONTACT, Index", contactIndex);
        setIndexForEditContactDialog(contactIndex);
    };

    const handleCloseEditContact = () => {
        setShowEditContactDialog(false);
    };

    const handleContractNameChange = (event) => {
        setContractName(event.target.value);
    }

    const handleStartDateChange = (event) => {
        setContractStartDate(event.target.value);
    }

    const handleEndDateChange = (event) => {
        setContractEndDate(event.target.value);
    }

    // const handleContractFeesChange = (feesList) => {
    //     console.log("In handleContractFeesChange()");
    //     //setContractFees() // map to the correct keys
    // }

    const handleAddContact = (newContact) => {
        setContractAssignedContacts((prevContractContacts) => [...prevContractContacts, newContact]);
    }

    const handleEditContact = (newContact, index) => {
        console.log("In handleEditContact of PropertyCard");
        console.log(newContact, index);
        setContractAssignedContacts((prevContacts) => {
            const updatedContacts = prevContacts.map((contact, i) => {
                if (i === index) {
                    return newContact;
                }
                return contact;
            });
            return updatedContacts;
        });
    }

    const handleDeleteContact = (index, event) => {
        console.log("Contract Assigned Contacts", contractAssignedContacts);
        setContractAssignedContacts(prevContacts => {
            const contactsArray = Array.from(prevContacts);
            contactsArray.splice(index, 1);
            return contactsArray;
        });
        event.stopPropagation();
    }

    const sendPutRequest = (data) => {
        const url = `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts`;
        // const url = `http://localhost:4000/contracts`; 
    
        fetch(url, {
            method: 'PUT',
            body: data,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else{
                console.log("Data updated successfully");
                navigate("/PMProperties");
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
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

    const handleDeletePrevUploadedFile = (index) => {
        setPreviouslyUploadedDocs(prevFiles => {
            const filesArray = Array.from(prevFiles);
            filesArray.splice(index, 1);
            return filesArray;
        });
    }

    const handleDeclineOfferClick = () => {
        console.log("Decline Offer Clicked");
        // let contractFeesJSONString = JSON.stringify(contractFees);
        // console.log("Decline Offer - contractFeesJSONString : ", contractFeesJSONString);
        // const data = {
        //     "contract_uid": contractUID,
        //     "contract_name": contractName,
        //     "contract_start_date": contractStartDate,
        //     "contract_end_date": contractEndDate,
        //     "contract_fees": contractFeesJSONString,
        //     "contract_status": "REFUSED"
        // };

        const formData = new FormData();
        formData.append("contract_uid", contractUID);
        formData.append("contract_status", "REFUSED");

        console.log("Declined offer. Data sent - ", formData);

        sendPutRequest(formData);
        
    };

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
    

    const handleSendQuoteClick = () => {
        console.log("Send Quote Clicked");
        const formData = new FormData();
        let contractFeesJSONString = JSON.stringify(contractFees);
        console.log("Send Quote - contractFeesJSONString : ", contractFeesJSONString);
        let contractContactsJSONString = JSON.stringify(contractAssignedContacts);
        console.log("Send Quote - contractContactsJSONString : ", contractContactsJSONString);
        // const data = {
        //     "contract_uid": contractUID,
        //     "contract_name": contractName,
        //     "contract_start_date": contractStartDate,
        //     "contract_end_date": contractEndDate,
        //     "contract_fees": contractFeesJSONString,
        //     "contract_status": "SENT"
        // };
        
        formData.append("contract_uid", contractUID);
        formData.append("contract_name", contractName);
        formData.append("contract_start_date", contractStartDate);
        formData.append("contract_end_date", contractEndDate);
        formData.append("contract_fees", contractFeesJSONString);
        formData.append("contract_status", "SENT");
        formData.append("contract_assigned_contacts", contractContactsJSONString);
        formData.append("contract_documents", JSON.stringify(previouslyUploadedDocs));

        const endDateIsValid = isValidDate(contractEndDate);
        if(!endDateIsValid){
            setShowInvalidEndDatePrompt(true);
            return;
        }

        const hasMissingType = !checkFileTypeSelected();
        console.log("HAS MISSING TYPE", hasMissingType);

        if (hasMissingType) {
            setShowMissingFileTypePrompt(true);
            return;
        }

        
        if(contractFiles.length){
            const documentsDetails = [];
            [...contractFiles].forEach((file, i) => {
                formData.append(`file-${i}`, file, file.name);
                const fileType = contractFileTypes[i] || '';
                const documentObject = {
                    // file: file,
                    fileIndex: i, //may not need fileIndex - will files be appended in the same order?
                    fileName: file.name, //may not need filename
                    fileType: fileType,
                };
                documentsDetails.push(documentObject);
            });
            formData.append("contract_documents_details", JSON.stringify(documentsDetails));
        }


        console.log("Quote sent. Data sent - ");
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
        }
  

        sendPutRequest(formData);
    }

    useEffect(() => {
        console.log("PROPERTY CARD USE EFFECT - BUSINESS - ", contractBusinessID);
        console.log("PROPERTY CARD USE EFFECT - PROPERTY - ", contractPropertyID);

        //get contracts
        const fetchData = async () => {
            const result = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts/${contractBusinessID}`);
            const data = await result.json();

            // const contractData = data["result"].find(contract => contract.contract_property_id === contractPropertyID && contract.contract_status === "NEW");
            // const contractData = data["result"].find(contract => contract.contract_property_id === contractPropertyID && contract.contract_status === ("NEW"||"SENT"));
            console.log("props.contractUID:", props.contractUID);
            setContractUID(props.contractUID); 
            const contractData = data["result"].find(contract => contract.contract_uid === props.contractUID);
            
            console.log("CONTRACT - ", contractData);
            // setContractUID(contractData["contract_uid"]? contractData["contract_uid"] : "");
            setContractName(contractData["contract_name"]? contractData["contract_name"] : "");
            setContractStartDate(contractData["contract_start_date"]? contractData["contract_start_date"] : "");
            setContractEndDate(contractData["contract_end_date"]? contractData["contract_end_date"] : "");
            setContractStatus(contractData["contract_status"]? contractData["contract_status"] : "");
            setContractAssignedContacts(contractData["contract_assigned_contacts"]? JSON.parse(contractData["contract_assigned_contacts"]) : []);
            setContractFees(contractData["contract_fees"]? JSON.parse(contractData["contract_fees"]) : []);
            const oldDocs = (contractData["contract_documents"]? JSON.parse(contractData["contract_documents"]): []);
            setPreviouslyUploadedDocs(oldDocs);
            const contractDoc = oldDocs?.find(doc => doc.type === "contract");
            if(contractDoc){
                setContractDocument(contractDoc);
            }
            setPropertyOwnerName(`${contractData["owner_first_name"]} ${contractData["owner_last_name"]}`);


            //get default contract fees for manager
            const businessProfileResult = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/businessProfile/${contractBusinessID}`);
            const data2 = await businessProfileResult.json();
            const businessProfileData = data2["result"][0];
            console.log("Business Services Fees", businessProfileData["business_services_fees"]);
            setDefaultContractFees(JSON.parse(businessProfileData["business_services_fees"]));
          };
      
          fetchData();
      

        
        
    }, []);

    const getFormattedFeeFrequency = (frequency) => {
        // console.log("getFormattedFeeFrequency(), frequency", frequency);
        let freq = ""
        switch(frequency){
            case "one_time":
                freq =  "One Time";
                break;
            case "hourly":
                freq =  "Hourly";
                break;
            case "daily":
                freq =  "Daily";
                break;
            case "weekly":
                freq =  "Weekly";
                break;
            case "bi_weekly":
                freq =  "Biweekly";
                break;
            case "monthly":
                freq =  "Monthly";
                break;
            case "annually":
                freq =  "Annual";
                break;
            default:
                freq =  "<FREQUENCY>";
        }
        return freq;       
    }

    return (
        <>
            {/* Property Image Carousel */}
            <Box sx={{
                display: 'flex',
                padding: '5px',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px',
                color: '#160449',
                // color: '#3D5CAC',
            }}>
                <ImageCarousel images={propertyData.property_images  && JSON.parse(propertyData.property_images).length > 0 ? JSON.parse(propertyData.property_images) : [defaultHouseImage]}/>
            </Box>
            {/* Time since Inquiry was created */}
            <Box sx={{
                display: 'flex',
                padding: '5px',
                justifyContent: 'flex-end',
                alignItems: 'center',
                fontSize: '20px',
                color: '#160449',
                // color: '#3D5CAC',
            }}>
                <Box sx={{
                        fontSize: '13px',
                    }}>
                        { timeDiff }
                    </Box>
            </Box>
            {/* Property Address */}
            <Box sx={{
                display: 'flex',
                padding: '5px',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                fontSize: '20px',
                color: '#160449',
                // color: '#3D5CAC',
            }}>
                <Box sx={{
                        fontSize: '16px',
                        fontWeight: '600',
                    }}>
                        {/* {getProperties(propertyStatus).length > 0 ? (`${getProperties(propertyStatus)[index].property_address}, ${(getProperties(propertyStatus)[index].property_unit !== null && getProperties(propertyStatus)[index].property_unit !== '' ? (getProperties(propertyStatus)[index].property_unit + ',') : (''))} ${getProperties(propertyStatus)[index].property_city} ${getProperties(propertyStatus)[index].property_state} ${getProperties(propertyStatus)[index].property_zip}`) : (<></>)} */}
                        {/* 789 Maple Lane, San Diego, CA 92101, USA */}
                        {propertyData.property_unit ? (
                            <span>{propertyData.property_address}{', '}{propertyData.property_unit}{', '}{propertyData.property_city}{', '}{propertyData.property_state}{' '}{propertyData.property_zip}</span>
                            ) : (
                            <span>{propertyData.property_address}{', '}{propertyData.property_city}{', '}{propertyData.property_state}{' '}{propertyData.property_zip}</span>
                            )
                        }
                    </Box>
            </Box>
            {/* Property Owner and Status */}
            <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}
            >
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {/* Owner: {propertyData.owner_first_name}{' '}{propertyData.owner_last_name} <ChatIcon sx={{ fontSize: 16, color: '#3D5CAC' }}  /> */}
                            Owner: {propertyOwnerName} <ChatIcon sx={{ fontSize: 16, color: '#3D5CAC' }}  />
                    </Box>
                </Box>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                        Property Management Contract Status: {contractStatus? contractStatus : '<CONTRACT_STATUS>'}
                    </Box>
                </Box>
            </Box>

            
            {/* Rent and Lease */}
            <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Rent: {'$'}{propertyData.property_listed_rent? propertyData.property_listed_rent : '<RENT>' }
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Due: {propertyData.lease_rent_due_by? propertyData.lease_rent_due_by : '<DUE>' } of every Month

                    </Box>
                </Box>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {contractDocument? (
                            
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    padding: '5px',
                                    paddingBottom: '0px',
                                    color: 'text.darkblue',
                                }}
                            >
                        
                                Contract:
                                <a href={contractDocument.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'text.darkblue', }}>
                                    <Box sx={{cursor:'pointer',}}>
                                        <DescriptionIcon sx={{ fontSize: 16, color: '#3D5CAC'}} />
                                    </Box>
                                </a>
                            </Box>
                            
                            ):(
                                <></>
                            )
                        }
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Expiring: {contractEndDate? contractEndDate : '' }
                    </Box>
                </Box>
            </Box>
            {/* Property Value*/}
            <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}
            >
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Property Value:
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {'$'}{propertyData.property_value? propertyData.property_value : '<$$$>' } {propertyData.property_value_year? `(${propertyData.property_value_year})` : '(<YEAR>)'}
                    </Box>
                </Box>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                            $ Per SqFt
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >


                        {'$'}{(propertyData.property_value && propertyData.property_area)? (propertyData.property_value / propertyData.property_area).toFixed(2) : '<$$$>' }
                    </Box>
                </Box>
            </Box>
            {/* Property Type */}
            <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Type
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {propertyData.property_type? propertyData.property_type :'<TYPE>' }
                    </Box>
                </Box>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            SqFt
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {propertyData.property_area? propertyData.property_area : '<SFT>' }
                    </Box>
                </Box>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Bed
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {propertyData.property_num_beds >= 0? Number(propertyData.property_num_beds) : '<BEDS>' }
                    </Box>
                </Box>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Bath
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {propertyData.property_num_baths >= 0? propertyData.property_num_baths : '<BATHS>' }
                    </Box>
                </Box>
            </Box>
            {/* <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Tenant:
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {propertyData.tenant_first_name? propertyData.tenant_first_name : '<TENANT_FIRST_NAME>' }{' '}
                            {propertyData.tenant_last_name? propertyData.tenant_last_name : '<TENANT_LAST_NAME>' }
                    </Box>
                </Box>

                
                
            </Box> */}
            {/* <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}>

                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Owner:
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                        {propertyData.owner_first_name? propertyData.owner_first_name : '<OWNER_FIRST_NAME>' }{' '}
                        {propertyData.owner_last_name? propertyData.owner_last_name : '<OWNER_LAST_NAME>' }
                    </Box>
                </Box>
                
            </Box> */}
            {/* <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent:'space-between',
                }}>

                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingBottom: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            Open Maintenance Tickets: {'<COUNT>'}
                    </Box>
                    <Box sx={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                paddingTop: '0px',
                                color: 'text.darkblue',
                        }}
                    >
                        
                            {'<TICKET>' }
                    </Box>
                </Box>
                
            </Box> */}


            {/* Contract Details */}
            {/* Contract Name */}
            <Box sx={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        padding: '5px',
                        color: '#3D5CAC',
                }}
            >
                
                    Management Agreement Name *
            </Box>
            <TextInputField name="management_agreement_name" placeholder="Enter contract name" value={contractName} onChange={handleContractNameChange} required>First Name</TextInputField>

            {/* Contract Start date and end date */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent:'space-between',
                alignItems: 'center',
                marginBottom: '7px',
                width: '100%',
            }}>
                <Box>
                    <Box sx={{
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                        }}
                    >
                    
                        Start Date *
                    </Box>
                    <TextInputField name="start_date" placeholder="mm-dd-yyyy" value={contractStartDate} onChange={handleStartDateChange}>Start Date</TextInputField>
                </Box>
                <Box>
                    <Box sx={{
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                        }}
                    >
                    
                        End Date *
                    </Box>
                    <TextInputField 
                        name="end_date"
                        placeholder="mm-dd-yyyy"
                        value={contractEndDate}
                        onChange={handleEndDateChange}
                        required
                    >
                        End Date
                    </TextInputField>                    
                </Box>

            </Box>
            {showInvalidStartDatePrompt && (
                        <Box
                            sx={{
                                color: 'red',
                                fontSize: '13px',
                            }}
                        >
                            Please enter a valid start date in "MM-DD-YYYY" format.
                        </Box>
            )}
            {showInvalidEndDatePrompt && (
                        <Box
                            sx={{
                                color: 'red',
                                fontSize: '13px',
                            }}
                        >
                            Please enter a valid end date in "MM-DD-YYYY" format.
                        </Box>
            )}
            <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        padding: '5px',
                        color: '#3D5CAC',
                }}
            >
                    <Box>
                        Management Fees *
                    </Box>
                    <Box
                        onClick={handleOpenAddFee}
                    >
                        <EditIcon  sx={{ fontSize: 16, color: '#3D5CAC'}} />
                    </Box>
                    
            </Box>
            <Box sx={{
                        background: "#FFFFFF",
                        fontSize: '13px',
                        padding: '5px',
                        color: '#3D5CAC',
                        borderRadius: '5px',

                }}
            >   
                {contractFees.length === 0 ? (
                    // <p>No fees to display</p>
                    <Box
                        sx={{
                            height: "13px",
                        }}
                    >
                    </Box>
                ) : (
                    contractFees.map((fee, index) => (
                        <Box 
                            key={index}
                            // FeeIndex={index}
                            sx = {{
                                display: 'flex',
                                flexDirection: 'column',
                                
                            }}
                            onClick={() => handleOpenEditFee(index)}
                        >
                            {/* <Box>{'Fee Name'}: {fee.feeName}</Box>
                            <Box>{'Fee Frequency'}: {fee.feeFrequency}</Box>
                            <Box>{'Fee Type'}: {fee.feeType}</Box>
                            <Box>{'Is percentage?'}: {fee.isPercentage? 'True' : 'False'}</Box>
                            <Box>{'percentage'}: {fee.isPercentage ? `Percentage: ${fee.feePercentage}, Applied To: ${fee.feeAppliedTo}` : 'False'}</Box>
                            <Box>{'Is flat-rate?'}: {fee.isFlatRate? 'True' : 'False'}</Box>
                            <Box>{'flat-rate'}: {fee.isFlatRate ? `Amount: ${fee.feeAmount}` : 'False'}</Box> */}
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            
                            >
                                <Box>{getFormattedFeeFrequency(fee.frequency)} {fee.fee_name}: {fee.fee_type === "PERCENT" ? `${fee.charge}% of ${fee.of}` : ` $${fee.charge}`}</Box>
                                
                                <Button 
                                    variant="text"
                                    onClick={(event) => {
                                        handleDeleteFee(index, event);
                                    }}
                                    sx={{
                                        width: '10%', 
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold', 
                                        color: '#3D5CAC',
                                        '&:hover': {
                                            backgroundColor: 'transparent', // Set to the same color as the default state
                                        },
                                    }}
                                    
                                >
                                    <DeleteIcon  sx={{ fontSize: 14, color: '#3D5CAC'}} />
                                </Button>
                            </Box>
                        </Box>
                        
                    ))
                )}
                
                {/* <Box>
                    Monthly service charge: {'15% of all rent'}
                </Box>
                <Box>
                    Tenant Setup Fee: $100
                </Box>
                <Box>
                    Annual Inspection Fee: $200
                </Box>
                <Box>
                    Re-Keying Charge: $200
                </Box>
                <Box>
                    Annual Postage and Communication Fee: $20
                </Box> */}
            </Box>
            {
                previouslyUploadedDocs.length? (
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
                                paddingTop: '10px',
                                paddingLeft: '5px',
                                color: '#3D5CAC',
                                width: '100%',
                            }}
                        >
                            Previously Uploaded Documents:
                            <Box
                                sx={{
                                    display:'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingTop: '5px',
                                    color: 'black',
                                }}
                            >
                                <Box>filename</Box>
                                <Box>type</Box>
                                <Box>{' '}</Box>
                            </Box>
                            {[...previouslyUploadedDocs].map((doc, i) => (
                                <>                                
                                    <Box
                                        key={i} 
                                        sx={{
                                            display:'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <a href={doc.link} target="_blank" rel="noopener noreferrer">
                                            <Box
                                                sx={{
                                                    // height: '16px',
                                                    width: '100%', 
                                                    
                                                    
                                                    cursor: 'pointer', // Change cursor to indicate clickability
                                                    color: '#3D5CAC',
                                                }}
                                            >
                                            {doc.filename}
                                            </Box>
                                        </a>
                                        {doc.type}
                                        <Button 
                                            variant="text"
                                            onClick={(event) => {
                                                handleDeletePrevUploadedFile(i);
                                            }}
                                            sx={{
                                                width: '10%', 
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: 'bold', 
                                                color: '#3D5CAC',
                                                '&:hover': {
                                                    backgroundColor: 'transparent', // Set to the same color as the default state
                                                },
                                            }}
                                            
                                        >
                                            <DeleteIcon  sx={{ fontSize: 19, color: '#3D5CAC'}} />
                                        </Button>
                                    </Box>
                                </>
        
                                
                            ))}
                        </Box>
        
                    </Box>
                ) : (<></>)
            }
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
                        </Box>
        
                    </Box>
                ) : (<></>)
            }
            {
                contractAssignedContacts.length? (
                    <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent:'space-between',
                            alignItems: 'center',
                            marginBottom: '7px',
                            width: '100%',
                        }}
                    >
                        
                        <Box
                            sx={{
                                fontSize: '15px',
                                fontWeight: 'bold',
                                paddingTop: '10px',
                                paddingLeft: '5px',
                                color: '#3D5CAC',
                                width: '100%',
                            }}
                        >
                            Contract Assigned Contacts:
                            <Box
                                sx={{
                                    display:'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    paddingTop: '5px',
                                    color: 'black',
                                }}
                            >
                                <Box sx={{width: '200px',}}>Name</Box>
                                <Box sx={{width: '200px',}}>Email</Box>
                                <Box sx={{width: '200px',}}>Phone Number</Box>
                            </Box>
                            {[...contractAssignedContacts].map((contact, i) => (                                
                                <Box
                                    key={i} 
                                    sx={{
                                        display:'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        paddingTop: '10px',
                                    }}
                                    onClick={() => handleOpenEditContact(i)}
                                >
                                    
                                    <Box
                                        sx={{
                                            // height: '16px',
                                            // width: '100%', 
                                            color: '#3D5CAC',
                                            width: '200px',
                                        }}
                                    >
                                    {contact.contact_first_name} {contact.contact_last_name}
                                    </Box>

                                    <Box sx={{width: '200px',}}>{contact.contact_email}</Box>
                                    <Box sx={{width: '80px',}}>{contact.contact_phone_number}</Box>
                                    <Button 
                                        variant="text"
                                        onClick={(event) => {
                                            handleDeleteContact(i, event);
                                        }}
                                        sx={{
                                            width: '10%', 
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold', 
                                            color: '#3D5CAC',
                                            '&:hover': {
                                                backgroundColor: 'transparent', // Set to the same color as the default state
                                            },
                                        }}
                                        
                                    >
                                        <DeleteIcon  sx={{ fontSize: 19, color: '#3D5CAC'}} />
                                    </Button>
                                </Box>
        
                                
                            ))}
                        </Box>
        
                    </Box>
                ) : (<></>)
            }
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent:'space-between',
                alignItems: 'center',
                paddingTop: '20px',
                marginBottom: '7px',
                width: '100%',
            }}>
                <Box
                    onClick={()=> {
                        setShowAddContactDialog(true);
                    }}
                >
                    <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                        }}
                    >
                    
                        <PersonIcon  sx={{ fontSize: 19, color: '#3D5CAC'}} />Add Contact
                    </Box>
                    
                </Box>
                <Box>
                    <Box sx={{
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                        }}
                    >
                    
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
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
                    </Box>  
                    
                </Box>

            </Box>
            
            
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent:'space-between',
                alignItems: 'center',
                paddingTop: '10px',
                marginBottom: '7px',
                width: '100%',
            }}>

            
                <Button
                    variant="contained"
                    disableElevation
                    sx={{
                        backgroundColor: "#CB8E8E",
                        textTransform: "none",
                        borderRadius: "5px",
                        display: 'flex',
                        width: "45%",
                        '&:hover': {
                            backgroundColor: "#CB8E8E",
                        },
                    }}
                    onClick={handleDeclineOfferClick}
                    >
                    <Typography sx={{
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize: "14px",
                        color: "#160449",
                        textTransform: "none",
                    }}>
                        {(contractStatus === "NEW")? "Decline Offer" : "Withdraw Offer"}
                    </Typography>
                </Button>
                <Button
                    variant="contained"
                    disableElevation
                    sx={{
                        backgroundColor: "#9EAED6",
                        textTransform: "none",
                        borderRadius: "5px",
                        display: 'flex',
                        width: "45%",
                        '&:hover': {
                            backgroundColor: "#9EAED6",
                        },
                    }}
                    onClick={handleSendQuoteClick}
                    disabled={!contractName || !contractStartDate || !contractEndDate  || !contractFees}
                    >
                    <Typography sx={{
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize: "14px",
                        color: "#160449",
                        textTransform: "none",
                    }}>
                        {(contractStatus === "NEW")? "Send Quote" : "Update Quote"}
                    </Typography>
                </Button>
            </Box>
            {showAddFeeDialog && (
                <Box>
                    <AddFeeDialog open={showAddFeeDialog} handleClose={handleCloseAddFee} onAddFee={handleAddFee} />
                </Box>
            )}
            {showEditFeeDialog && (
                <Box>
                    <EditFeeDialog open={showEditFeeDialog} handleClose={handleCloseEditFee} onEditFee={handleEditFee} feeIndex={indexForEditFeeDialog} fees={contractFees} />
                </Box>
            )}
            {showAddContactDialog && (
                <Box>
                    <AddContactDialog open={showAddContactDialog} handleClose={handleCloseAddContact} onAddContact={handleAddContact} />
                </Box>
            )}
            {showEditContactDialog && (
                <Box>
                    <EditContactDialog open={showEditContactDialog} handleClose={handleCloseEditContact} onEditContact={handleEditContact} contactIndex={indexForEditContactDialog} contacts={contractAssignedContacts} />
                </Box>
            )}
        </>

    );
}


function TextInputField(props) {
    const inputStyle = {
        border: 'none',        
        width: '100%',
        fontFamily: 'inherit',
        fontWeight: 'inherit',
        color: '#3D5CAC',
        opacity:'1',
        paddingLeft: '5px',
        borderRadius: '5px',
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '7px',
            width: '100%',
        }}>
            <input type='text' style={inputStyle} name={props.name} placeholder={props.placeholder} value={props.value} onChange={props.onChange}/>
        </Box>
    );
}

function AddFeeDialog({ open, handleClose, onAddFee }) {

    const [feeName, setFeeName] = useState('');
    useEffect(() => {
        console.log('FEE Name: ', feeName);
    }, [feeName]);
    
    const [feeType, setFeeType] = useState('PERCENT');
    useEffect(() => {
        console.log('FEE TYPE: ', feeType);
    }, [feeType]);

    const [isPercentage, setIsPercentage] = useState(true);
    useEffect(() => {
        console.log('IS PERCENTAGE?: ', isPercentage);
    }, [isPercentage]);

    const [percentage, setPercentage] = useState('0');
    useEffect(() => {
        console.log('PERCENTAGE: ', percentage);
    }, [percentage]);

    const [isFlatRate, setIsFlatRate] = useState(false);
    useEffect(() => {
        console.log('IS FLAT RATE?: ', isFlatRate);
    }, [isFlatRate]);

    const [feeAmount, setFlatRate] = useState('0');
    useEffect(() => {
        console.log('FEE TYPE: ', feeAmount);
    }, [feeAmount]);

    const [feeFrequency, setFeeFrequency] = useState("One Time");
    useEffect(() => {
        console.log('FEE FREQUENCY: ', feeFrequency);
    }, [feeFrequency]);

    const [feeAppliedTo, setFeeAppliedTo] = useState("Gross Rent");
    useEffect(() => {
        console.log('FEE APPLIED TO: ', feeAppliedTo);
    }, [feeAppliedTo]);

    const handleFeeTypeChange = (event) => {
        setFeeType(event.target.value);
        // console.log("FEE TYPE SELECTED", event.target.value);
        // console.log('FEE TYPE: ', selectedFeeType);

        // if(event.target.value === "PERCENT"){
        //     setIsPercentage(true)
        //     setIsFlatRate(false);
        // }else{
        //     setIsFlatRate(true);
        //     setIsPercentage(false)
        // } 
    };

    const handleFrequencyChange = (event) => {
        setFeeFrequency(event.target.value)
    }
    
    const handleAppliedToChange = (event) => {
        setFeeAppliedTo(event.target.value)
    }


    const handleAddFee = (event) => {
        event.preventDefault();
        
        console.log("FORM SUBMITTED ");
        console.log('feeName:', feeName);
        console.log('feeFrequency:', feeFrequency);
        console.log('feeType:', feeType);
        console.log('Is percentage?:', isPercentage);
        console.log('percentage:', percentage);
        console.log('Is feeAmount?:', isFlatRate);
        console.log('feeAmount:', feeAmount);
        console.log('feeAppliedTo:', feeAppliedTo);

        // const newFee = {
        //     fee_name: feeName,
        //     fee_type: feeType,
        //     frequency: feeFrequency,
        //     isPercentage: isPercentage,
        //     ...(isPercentage && { charge: percentage }),
        //     ...(isPercentage && { of: feeAppliedTo }),
        //     isFlatRate: isFlatRate,
        //     ...(isFlatRate && { charge: feeAmount }),
        // }

        const newFee = {
            fee_name: feeName,
            fee_type: feeType,
            frequency: feeFrequency,
            ...(feeType === "PERCENT" && { charge: percentage }),
            ...(feeType === "PERCENT" && { of: feeAppliedTo }),
            ...(feeType === "FLAT-RATE" && { charge: feeAmount }),
        }


        onAddFee(newFee);
        handleClose();
    }

    return (
        <form onSubmit={handleAddFee}>
            <Dialog 
                open={open}
                onClose={handleClose}
                // sx = {{
                //     width: '100%',
                //     maxWidth: 'none',
                // }}
                maxWidth="xl"
                sx={{
                    '& .MuiDialog-paper': {
                    width: '60%',
                    maxWidth: 'none',
                    },
                }}
            >
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >
                    
                        Management Fees
                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >
                    
                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>Fee Name</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="fee_name"
                                    placeholder=""
                                    value={feeName}
                                    onChange={(event) => {
                                        setFeeName(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Box>Frequency</Box>
                                {/* <TextInputField 
                                    name="fee_name"
                                    placeholder=""
                                    value={""} 
                                    onChange={console.log("input changed")}
                                    sx={{ backgroundColor: '#D6D5DA' }}
                                >
                                    Fee Name
                                </TextInputField> */}
                                {/* <TextField
                                    name="frequency"
                                    placeholder=""
                                    value={""}
                                    onChange={console.log("input changed")}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                /> */}
                                <Select
                                    value={feeFrequency}
                                    label="Frequency"
                                    onChange={handleFrequencyChange}
                                    sx={{
                                        backgroundColor: '#D6D5DA',
                                        height: '16px',
                                        width: '200px', // Adjust the width as needed
                                        padding: '8px', // Adjust the padding as needed
                                    }}
                                >
                                    <MenuItem value={"One Time"}>One Time</MenuItem>
                                    <MenuItem value={"hourly"}>hourly</MenuItem>
                                    <MenuItem value={"daily"}>daily</MenuItem>
                                    <MenuItem value={"weekly"}>weekly</MenuItem>
                                    <MenuItem value={"biweekly"}>biweekly</MenuItem>
                                    <MenuItem value={"monthly"}>monthly</MenuItem>
                                    <MenuItem value={"annually"}>annually</MenuItem>
                                </Select>
                            </Box>
                        </Box>

                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            padding: '15px',
                            color: '#3D5CAC',
                    }}
                >
                    <RadioGroup
                        row
                        aria-label="fee-type-group-label"
                        name="fee-type-radio-buttons-group"
                        value={feeType}
                        onChange={handleFeeTypeChange}
                    >
                        <Box sx = {{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >


                        
                            <FormControlLabel value="PERCENT" control={<Radio sx={{ '&.Mui-checked': { color: '#3D5CAC' } }} />} label="Percent" />
                            {/* <TextField value={percentage} label="" variant="outlined" onChange={(event) => {setPercentage(event.target.value)}}/> */}
                            {feeType === 'PERCENT' && (
                                <Box>
                                    <TextField
                                        value={percentage}
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setPercentage(event.target.value);
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>


                        <Box sx = {{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <FormControlLabel value="FLAT-RATE" control={<Radio sx={{ '&.Mui-checked': { color: '#3D5CAC' } }} />} label="Flat Rate" />
                            <Box sx={{width: '60px', height: '20px',}}>
                        </Box>
                            
                        </Box>
                        {feeType === 'FLAT-RATE' && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        paddingLeft: '20px',
                                    }}
                                >
                                    Amount
                                    <TextField
                                        name="flat-rate"
                                        value={feeAmount}
                                        placeholder=""
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}

                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setFlatRate(event.target.value);
                                        }}
                                    />
                                </Box>
                            )}
                            {feeType === 'PERCENT' && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        paddingLeft: '20px',
                                    }}
                                >
                                    Applied To
                                    {/* <TextField
                                        name="flat-rate"
                                        value={feeAmount}
                                        placeholder=""
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}

                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setFlatRate(event.target.value);
                                        }}
                                    /> */}
                                    <Select
                                        value={feeAppliedTo}
                                        label="Applied To"
                                        onChange={handleAppliedToChange}
                                        sx={{
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                            width: '200px', // Adjust the width as needed
                                            padding: '8px', // Adjust the padding as needed
                                        }}
                                    >
                                        <MenuItem value={"Gross Rent"}>Gross Rent</MenuItem>
                                        <MenuItem value={"Utility Bill"}>Utility Bill</MenuItem>
                                        <MenuItem value={"Maintenance Bill"}>Maintenance Bill</MenuItem>
                                    </Select>
                                </Box>
                            )}
                    </RadioGroup> 
                </Box>
                <DialogActions>
                    <Button 
                        onClick={handleClose}
                        sx={{
                            '&:hover': {
                                backgroundColor: "#fff",
                            },
                            color: '#160449',
                        }}
                    >
                        Close
                    </Button>
                    <Button 
                        type="submit"
                        onClick={handleAddFee}
                        sx={{
                            '&:hover': {
                                backgroundColor: "#fff",
                            },
                            color: '#160449',
                        }}
                    >
                        Add Fee
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );

}

function EditFeeDialog({ open, handleClose, onEditFee, feeIndex, fees }) {

    const [feeName, setFeeName] = useState(fees[feeIndex].fee_name);
    useEffect(() => {
        console.log('FEE Name: ', feeName);
    }, [feeName]);
    
    const [feeType, setFeeType] = useState(fees[feeIndex].fee_type);
    useEffect(() => {
        console.log('FEE TYPE: ', feeType);
    }, [feeType]);

    const [isPercentage, setIsPercentage] = useState(fees[feeIndex].isPercentage);
    useEffect(() => {
        console.log('IS PERCENTAGE?: ', isPercentage);
    }, [isPercentage]);

    const [percentage, setPercentage] = useState(fees[feeIndex].charge);
    useEffect(() => {
        console.log('PERCENTAGE: ', percentage);
    }, [percentage]);

    const [isFlatRate, setIsFlatRate] = useState(fees[feeIndex].isFlatRate);
    useEffect(() => {
        console.log('IS FLAT RATE?: ', isFlatRate);
    }, [isFlatRate]);

    const [feeAmount, setFlatRate] = useState(fees[feeIndex].charge);
    useEffect(() => {
        console.log('FEE TYPE: ', feeAmount);
    }, [feeAmount]);

    const [feeFrequency, setFeeFrequency] = useState(fees[feeIndex].frequency);
    useEffect(() => {
        console.log('FEE FREQUENCY: ', feeFrequency);
    }, [feeFrequency]);

    const [feeAppliedTo, setFeeAppliedTo] = useState(fees[feeIndex].of);
    useEffect(() => {
        console.log('FEE APPLIED TO: ', feeAppliedTo);
    }, [feeAppliedTo]);

    const handleFeeTypeChange = (event) => {
        setFeeType(event.target.value);
        // console.log('FEE TYPE: ', selectedFeeType);
        if(event.target.value === "PERCENT"){
            setIsPercentage(true)
            setIsFlatRate(false);
        }else{
            setIsFlatRate(true);
            setIsPercentage(false)
        } 
    };

    const handleFrequencyChange = (event) => {
        setFeeFrequency(event.target.value)
    }
    
    const handleAppliedToChange = (event) => {
        setFeeAppliedTo(event.target.value)
    }


    const handleEditFee = (event) => {
        event.preventDefault();
        
        console.log("FORM SUBMITTED ");
        console.log('feeName:', feeName);
        console.log('feeFrequency:', feeFrequency);
        console.log('feeType:', feeType);
        console.log('Is percentage?:', isPercentage);
        console.log('percentage:', percentage);
        console.log('Is feeAmount?:', isFlatRate);
        console.log('feeAmount:', feeAmount);
        console.log('feeAppliedTo:', feeAppliedTo);

        // const newFee = {
        //     fee_name: feeName,
        //     fee_type: feeType,
        //     frequency: feeFrequency,
        //     isPercentage: isPercentage,
        //     ...(isPercentage && { charge: percentage }),
        //     ...(isPercentage && { of: feeAppliedTo }),
        //     isFlatRate: isFlatRate,
        //     ...(isFlatRate && { charge: feeAmount }),
        // }
        const newFee = {
            fee_name: feeName,
            fee_type: feeType,
            frequency: feeFrequency,
            ...(feeType === "PERCENT" && { charge: percentage }),
            ...(feeType === "PERCENT" && { of: feeAppliedTo }),
            ...(feeType === "FLAT-RATE" && { charge: feeAmount }),
        }
        onEditFee(newFee, feeIndex); // pass index also
        handleClose();
    }

    return (
        <form onSubmit={handleEditFee}>
            <Dialog 
                open={open}
                onClose={handleClose}
                // sx = {{
                //     width: '100%',
                //     maxWidth: 'none',
                // }}
                maxWidth="xl"
                sx={{
                    '& .MuiDialog-paper': {
                    width: '60%',
                    maxWidth: 'none',
                    },
                }}
            >
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >
                    
                        Management Fees
                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            
                            fontSize: '15px',
                            fontWeight: 'bold',
                            padding: '5px',
                            color: '#3D5CAC',
                    }}
                >
                    
                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '5px',
                                color: '#3D5CAC',
                            }}
                        >
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: '50px',                                    
                                }}
                            >
                                <Box>Fee Name</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="fee_name"
                                    placeholder=""
                                    value={feeName}
                                    onChange={(event) => {
                                        setFeeName(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Box>Frequency</Box>
                                {/* <TextInputField 
                                    name="fee_name"
                                    placeholder=""
                                    value={""} 
                                    onChange={console.log("input changed")}
                                    sx={{ backgroundColor: '#D6D5DA' }}
                                >
                                    Fee Name
                                </TextInputField> */}
                                {/* <TextField
                                    name="frequency"
                                    placeholder=""
                                    value={""}
                                    onChange={console.log("input changed")}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                /> */}
                                <Select
                                    value={feeFrequency}
                                    label="Frequency"
                                    onChange={handleFrequencyChange}
                                    sx={{
                                        backgroundColor: '#D6D5DA',
                                        height: '16px',
                                        width: '200px', // Adjust the width as needed
                                        padding: '8px', // Adjust the padding as needed
                                    }}
                                >
                                    <MenuItem value={"one_time"}>One Time</MenuItem>
                                    <MenuItem value={"hourly"}>Hourly</MenuItem>
                                    <MenuItem value={"daily"}>Daily</MenuItem>
                                    <MenuItem value={"weekly"}>Weekly</MenuItem>
                                    <MenuItem value={"bi_weekly"}>Biweekly</MenuItem>
                                    <MenuItem value={"monthly"}>Monthly</MenuItem>
                                    <MenuItem value={"annually"}>Annually</MenuItem>
                                </Select>
                            </Box>
                        </Box>

                </Box>
                <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            padding: '15px',
                            color: '#3D5CAC',
                    }}
                >
                    <RadioGroup
                        row
                        aria-label="fee-type-group-label"
                        name="fee-type-radio-buttons-group"
                        value={feeType}
                        onChange={handleFeeTypeChange}
                    >
                        <Box sx = {{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >


                        
                            <FormControlLabel value="PERCENT" control={<Radio sx={{ '&.Mui-checked': { color: '#3D5CAC' } }} />} label="Percent" />
                            {/* <TextField value={percentage} label="" variant="outlined" onChange={(event) => {setPercentage(event.target.value)}}/> */}
                            {feeType === 'PERCENT' && (
                                <Box>
                                    <TextField
                                        value={percentage}
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setPercentage(event.target.value);
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>


                        <Box sx = {{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <FormControlLabel value="FLAT-RATE" control={<Radio sx={{ '&.Mui-checked': { color: '#3D5CAC' } }} />} label="Flat Rate" />
                            <Box sx={{width: '60px', height: '20px',}}>
                        </Box>
                            
                        </Box>
                        {feeType === 'FLAT-RATE' && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        paddingLeft: '20px',
                                    }}
                                >
                                    Amount
                                    <TextField
                                        name="flat-rate"
                                        value={feeAmount}
                                        placeholder=""
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}

                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setFlatRate(event.target.value);
                                        }}
                                    />
                                </Box>
                            )}
                            {feeType === 'PERCENT' && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        paddingLeft: '20px',
                                    }}
                                >
                                    Applied To
                                    {/* <TextField
                                        name="flat-rate"
                                        value={feeAmount}
                                        placeholder=""
                                        label=""
                                        variant="outlined"
                                        // sx={{
                                        //     width: '45px',
                                        //     height: '3px',
                                        // }}

                                        InputProps={{
                                            sx: {
                                                backgroundColor: '#D6D5DA',
                                                width: '60px',
                                                height: '20px',
                                            },
                                        }}

                                        onChange={(event) => {
                                            setFlatRate(event.target.value);
                                        }}
                                    /> */}
                                    <Select
                                        value={feeAppliedTo}
                                        label="Applied To"
                                        onChange={handleAppliedToChange}
                                        sx={{
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                            width: '200px', // Adjust the width as needed
                                            padding: '8px', // Adjust the padding as needed
                                        }}
                                    >
                                        <MenuItem value={"Gross Rent"}>Gross Rent</MenuItem>
                                        <MenuItem value={"Utility Bill"}>Utility Bill</MenuItem>
                                        <MenuItem value={"Maintenance Bill"}>Maintenance Bill</MenuItem>
                                    </Select>
                                </Box>
                            )}
                    </RadioGroup> 
                </Box>
                <DialogActions>
                    <Button sx={{
                            '&:hover': {
                                backgroundColor: "#3D5CAC",
                            },
                            backgroundColor:'#9EAED6',
                            color: '#160449',
                            textTransform: 'none',
                        }} onClick={handleClose}>Close</Button>
                    <Button sx={{
                            '&:hover': {
                                backgroundColor: "#3D5CAC",
                            },
                            backgroundColor:'#9EAED6',
                            color: '#160449',
                            textTransform: 'none',
                        }} type="submit" onClick={handleEditFee}>Save Fee</Button>
                </DialogActions>
            </Dialog>
        </form>
    );

}


function AddContactDialog({ open, handleClose, onAddContact }) {

    const [contactFirstName, setContactFirstName] = useState('');
    const [contactLastName, setContactLastName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    const handleSaveContact = (event) => {
        event.preventDefault();
        
        console.log("Adding Contact ");
        console.log('   firstName:', contactFirstName);
        console.log('   lastName:', contactLastName);
        console.log('   email:', contactEmail);
        console.log('   phone:', contactPhone);
        
        const newContact = {
            contact_first_name: contactFirstName,
            contact_last_name: contactLastName,
            contact_email: contactEmail,
            contact_phone_number: contactPhone,
        }
        onAddContact(newContact);
        handleClose();
    }

    return (
        <form onSubmit={handleSaveContact}>
            <Dialog 
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                sx={{
                    fontSize: '13px',
                    fontWeight: 'bold',
                    padding: '5px',
                    color: '#3D5CAC',
                }}
            >
                <DialogContent>
                    {/* Dialog Title */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box 
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    padding: '5px',
                                    color: '#3D5CAC',
                                }}
                            >
                                Add Contact
                            </Box>
                        </Grid>
                    </Grid>
                    {/* First name and last name */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{color: '#3D5CAC',}}>First Name</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="contact_first_name"
                                    placeholder=""
                                    value={contactFirstName}
                                    onChange={(event) => {
                                        setContactFirstName(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{color: '#3D5CAC',}}>Last Name</Box>
                                <TextField
                                    name="contact_last_name"
                                    placeholder=""
                                    value={contactLastName}
                                    onChange={(event) => {
                                        setContactLastName(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                        </Grid>
                    </Grid>
                    {/* Email and phone */}
                    <Grid container spacing={2} sx={{ paddingTop:'10px',}}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{color: '#3D5CAC',}}>Email</Box>
                                <TextField
                                    name="contact_email"
                                    placeholder=""
                                    value={contactEmail}
                                    onChange={(event) => {
                                        setContactEmail(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                        </Grid>
                        <Grid 
                            item
                            xs={12}
                            sm={6}
                        >
                            <Box sx={{color: '#3D5CAC',}}>Phone Number</Box>
                                <TextField
                                    name="contact_phone_number"
                                    placeholder=""
                                    value={contactPhone}
                                    onChange={(event) => {
                                        setContactPhone(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClose}
                        sx={{
                            '&:hover': {
                                backgroundColor: "#3D5CAC",
                            },
                            backgroundColor:'#9EAED6',
                            color: '#160449',
                            textTransform: 'none',
                        }}
                    >
                        Close
                    </Button>
                    <Button 
                        type="submit"
                        onClick={handleSaveContact}
                        sx={{
                            '&:hover': {
                                backgroundColor: "#3D5CAC",
                            },
                            backgroundColor:'#9EAED6',
                            color: '#160449',
                            textTransform: 'none',
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );

}

function EditContactDialog({ open, handleClose, onEditContact, contactIndex, contacts }) {

    const [contactFirstName, setContactFirstName] = useState(contacts[contactIndex].contact_first_name);
    const [contactLastName, setContactLastName] = useState(contacts[contactIndex].contact_last_name);
    const [contactEmail, setContactEmail] = useState(contacts[contactIndex].contact_email);
    const [contactPhone, setContactPhone] = useState(contacts[contactIndex].contact_phone_number);

    const handleSaveContact = (event) => {
        event.preventDefault();
        
        console.log("Editing Contact ");
        console.log('   firstName:', contactFirstName);
        console.log('   lastName:', contactLastName);
        console.log('   email:', contactEmail);
        console.log('   phone:', contactPhone);
        
        const newContact = {
            contact_first_name: contactFirstName,
            contact_last_name: contactLastName,
            contact_email: contactEmail,
            contact_phone_number: contactPhone,
        }
        onEditContact(newContact, contactIndex);
        handleClose();
    }

    return (
        <form onSubmit={handleSaveContact}>
            <Dialog 
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                sx={{
                    fontSize: '13px',
                    fontWeight: 'bold',
                    padding: '5px',
                    color: '#3D5CAC',
                }}
            >
                <DialogContent>
                    {/* Dialog Title */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box 
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    padding: '5px',
                                    color: '#3D5CAC',
                                }}
                            >
                                Edit Contact
                            </Box>
                        </Grid>
                    </Grid>
                    {/* First name and last name */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{color: '#3D5CAC',}}>First Name</Box>
                                {/* <TextInputField name="fee_name" placeholder="" value={""} onChange={console.log("input changed")}>Fee Name</TextInputField> */}
                                <TextField
                                    name="contact_first_name"
                                    placeholder=""
                                    value={contactFirstName}
                                    onChange={(event) => {
                                        setContactFirstName(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{color: '#3D5CAC',}}>Last Name</Box>
                                <TextField
                                    name="contact_last_name"
                                    placeholder=""
                                    value={contactLastName}
                                    onChange={(event) => {
                                        setContactLastName(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                        </Grid>
                    </Grid>
                    {/* Email and phone */}
                    <Grid container spacing={2} sx={{ paddingTop:'10px',}}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{color: '#3D5CAC',}}>Email</Box>
                                <TextField
                                    name="contact_email"
                                    placeholder=""
                                    value={contactEmail}
                                    onChange={(event) => {
                                        setContactEmail(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                        </Grid>
                        <Grid 
                            item
                            xs={12}
                            sm={6}
                        >
                            <Box sx={{color: '#3D5CAC',}}>Phone Number</Box>
                                <TextField
                                    name="contact_phone_number"
                                    placeholder=""
                                    value={contactPhone}
                                    onChange={(event) => {
                                        setContactPhone(event.target.value);
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#D6D5DA',
                                            height: '16px',
                                        },
                                    }}
                                />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClose}
                        sx={{
                            '&:hover': {
                                backgroundColor: "#3D5CAC",
                            },
                            backgroundColor:'#9EAED6',
                            color: '#160449',
                            textTransform: 'none',
                        }}
                    >
                        Close
                    </Button>
                    <Button 
                        type="submit"
                        onClick={handleSaveContact}
                        sx={{
                            '&:hover': {
                                backgroundColor: "#3D5CAC",
                            },
                            backgroundColor:'#9EAED6',
                            color: '#160449',
                            textTransform: 'none',
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );

}

export default PMContractDetailsList;