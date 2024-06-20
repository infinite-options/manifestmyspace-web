import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
    ThemeProvider, Box, Paper, Stack, Typography, Button, Avatar, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Radio, RadioGroup, FormControlLabel, Select, MenuItem, Grid, 
} from '@mui/material';
import { useUser } from "../../../contexts/UserContext";
import theme from '../../../theme/theme';

import ImageCarousel from "../../ImageCarousel";
import defaultHouseImage from "../../Property/defaultHouseImage.png"
import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import { isValidDate } from "../../../utils/dates"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { ReactComponent as CalendarIcon } from "../../../images/datetime.svg";
import dayjs from "dayjs";

import APIConfig from "../../../utils/APIConfig"


function TextInputField(props) {
    const inputStyle = {
        border: 'none',        
        width: '100%',
        height:'40px',
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
    const { getProfileId } = useUser();
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
                                            height: '40px',
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
                                            height: '40px',
                                        },
                                    }}
                                /> */}
                                <Select
                                    value={feeFrequency}
                                    label="Frequency"
                                    onChange={handleFrequencyChange}
                                    sx={{
                                        backgroundColor: '#D6D5DA',
                                        height: '40px',
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
                                                height: '40px',
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
                            <Box sx={{width: '60px', height: '40px',}}>
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
                                                width: '100px',
                                                height: '40px',
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
                                        height:'40px',
                                    }}
                                >
                                    Applied To

                                    <Select
                                        value={feeAppliedTo}
                                        label="Applied To"
                                        onChange={handleAppliedToChange}
                                        sx={{
                                            backgroundColor: '#D6D5DA',
                                            height: '40px',
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
                                            height: '40px',
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
                                            height: '40px',
                                        },
                                    }}
                                /> */}
                                <Select
                                    value={feeFrequency}
                                    label="Frequency"
                                    onChange={handleFrequencyChange}
                                    sx={{
                                        backgroundColor: '#D6D5DA',
                                        height: '40px',
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
                                                width: '100px',
                                                height: '40px',
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
                            <Box sx={{width: '60px', height: '40px',}}>
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
                                            height: '40px',
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


const PropertyCard = (props) => {
const navigate = useNavigate();

const propertyData = props.data;
const timeDiff = props.timeDifference;
const contractBusinessID = props.contractBusinessID;
const contractPropertyID = props.contractPropertyID;
const today = dayjs(new Date()); // Convert new Date() to Day.js object

console.log("--debug-- PropertyCard props", props)

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
const [contractStartDate, setContractStartDate] = useState(dayjs());
const [contractEndDate, setContractEndDate] = useState(dayjs());
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
    if(isValidDate(contractStartDate.format('MM-DD-YYYY'))){
        setShowInvalidStartDatePrompt(false);
    }else{
        setShowInvalidStartDatePrompt(true);
    }
}, [contractStartDate]);

useEffect(() => {        
    if(isValidDate(contractEndDate.format('MM-DD-YYYY'))){
        setShowInvalidEndDatePrompt(false);
    }else{
        setShowInvalidEndDatePrompt(true);
    }
}, [contractEndDate]);


useEffect(()=> {
    console.log("CONTRACT ASSIGNED CONTACTS - ", contractAssignedContacts);    
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

const handleStartDateChange = (v) => {
    setContractStartDate(v);
    if (contractEndDate < v) setContractEndDate(v)
}

const handleEndDateChange = (v) => {
    setContractEndDate(v);
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
    const url = `${APIConfig.baseURL.dev}/contracts`;
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
            navigate("/managerDashboard");
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
    formData.append("contract_start_date", contractStartDate.format('MM-DD-YYYY'));
    formData.append("contract_end_date", contractEndDate.format('MM-DD-YYYY'));
    formData.append("contract_fees", contractFeesJSONString);
    formData.append("contract_status", "SENT");
    formData.append("contract_assigned_contacts", contractContactsJSONString);
    formData.append("contract_documents", JSON.stringify(previouslyUploadedDocs));

    const endDateIsValid = isValidDate(contractEndDate.format('MM-DD-YYYY'));
    if(!isValidDate(contractEndDate.format('MM-DD-YYYY')) || !isValidDate(contractStartDate.format('MM-DD-YYYY'))){            
        return;
    }

    const hasMissingType = !checkFileTypeSelected();    

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
        const result = await fetch(`${APIConfig.baseURL.dev}/contracts/${contractBusinessID}`);
        const data = await result.json();
        console.log("--debug--", data)

        // const contractData = data["result"].find(contract => contract.contract_property_id === contractPropertyID && contract.contract_status === "NEW");
        // const contractData = data["result"].find(contract => contract.contract_property_id === contractPropertyID && contract.contract_status === ("NEW"||"SENT"));
        console.log("props.contractUID:", props.contractUID);
        setContractUID(props.contractUID);
        if (data !== "No records for this Uid") {
            const contractData = data["result"].find(contract => contract.contract_uid === props.contractUID);
            console.log("CONTRACT - ", contractData);
            // setContractUID(contractData["contract_uid"]? contractData["contract_uid"] : "");
            setContractName(contractData["contract_name"]? contractData["contract_name"] : "");
            setContractStartDate(contractData["contract_start_date"]? dayjs(contractData["contract_start_date"]) : dayjs());
            setContractEndDate(contractData["contract_end_date"]? dayjs(contractData["contract_end_date"]) : contractStartDate.add(1, "year").subtract(1, "day"));
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
        }

        // get default contract fees for manager
        const businessProfileResult = await fetch(`${APIConfig.baseURL.dev}/businessProfile/${contractBusinessID}`);
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
        case "bi-weekly":
            freq =  "Bi-weekly";
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
                    
                        Expiring: {contractEndDate? contractEndDate.format('MM-DD-YYYY') : dayjs().format('MM-DD-YYYY') }
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
                

            <Grid item xs={6} md={6}>
            <Stack>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"Start Date"}
              </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={contractStartDate}
                            minDate={dayjs()}
                            onChange={handleStartDateChange}
                            slots={{
                                openPickerIcon: CalendarIcon,
                            }}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    style: {
                                        width: "100%",
                                        fontSize: 12,
                                        backgroundColor: "#F2F2F2 !important",
                                        borderRadius: "10px !important",
                                    },
                                },
                            }}
                        />
                    </LocalizationProvider>
            </Stack>
          </Grid>

            </Box>
            
            <Grid item xs={6} md={6}>
            <Stack>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"End Date"}
              </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={contractEndDate}
                            minDate={dayjs()}
                            onChange={handleEndDateChange}
                            slots={{
                                openPickerIcon: CalendarIcon,
                            }}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    style: {
                                        width: "100%",
                                        fontSize: 12,
                                        backgroundColor: "#F2F2F2 !important",
                                        borderRadius: "10px !important",
                                    },
                                },
                            }}
                        />
                    </LocalizationProvider>
            </Stack>
          </Grid>

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
                    <EditIcon  sx={{ fontSize: 20, color: '#3D5CAC'}} />
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
                                <DeleteIcon  sx={{ fontSize: 20, color: '#3D5CAC', }} />
                            </Button>
                        </Box>
                    </Box>
                    
                ))
            )}
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
                                                 height: '40px',
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
                                        
                                        // height: '40px',
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
                                        height: '40px',
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
                                        // height: '40px',
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
                                        height: '40px',
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
                                        height: '40px',
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
                                        height: '40px',
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
                                        height: '40px',
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
                                        height: '40px',
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
                                        height: '40px',
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
                                        height: '40px',
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
                                        height: '40px',
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
);}




export default PropertyCard;


