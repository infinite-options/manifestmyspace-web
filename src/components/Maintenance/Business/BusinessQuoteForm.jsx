import { 
    ThemeProvider, 
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    Card,
    CardHeader,
    Slider,
    Stack,
    Button,
    Grid,
    Container,
    TextField,
    Checkbox,
    FormControlLabel,
    MenuItem,
    InputAdornment
} from "@mui/material";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from '../../../theme/theme';
import ImageUploader from "../../ImageUploader";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import refundIcon from './../../Property/refundIcon.png';
import documentIcon from './documentIcon.png'
import maintenanceRequestImage from "./../maintenanceRequest.png";
import xIcon from './Close_round.png'
import { Select } from "@material-ui/core";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import ImageCarousel from "../../ImageCarousel";
import dataURItoBlob from '../../utils/dataURItoBlob';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { ReactComponent as CalendarIcon } from "../../../images/datetime.svg"
import dayjs from "dayjs";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import DocumentUploader from "../../DocumentUploader";

import APIConfig from "../../../utils/APIConfig";

function CostPartsTable({parts, setParts}){

    function addRow(){
        let newPart = {
            part: "",
            quantity: "",
            cost: ""
        }
        setParts(prevParts => [...prevParts, newPart]);
    }

    function handlePartChange(event, index){
        let newParts = [...parts]
        newParts[index].part = event.target.value
        setParts(newParts)
    }

    function handleQuantityChange(event, index){
        let newParts = [...parts]
        newParts[index].quantity = event.target.value
        setParts(newParts)
    }

    function handleCostChange(event, index){
        let newParts = [...parts]
        newParts[index].cost = event.target.value
        setParts(newParts)
    }

    function deleteRow(index){
        let newParts = [...parts]
        newParts.splice(index, 1)
        setParts(newParts)
    }
    

    return (
        <>
            <Grid item xs={12} sx={{paddingTop: "10px"}}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                    Cost of Parts
                </Typography>
            </Grid>
            {parts.map((part, index) => (
                <Grid container key={index} rowSpacing={1} sx={{paddingTop: "10px"}}>
                    <Grid item xs={4} sx={{paddingTop: "10px"}}>
                        <TextField
                            label="Part"
                            size="small"
                            value={part.part}
                            onChange={(e) => handlePartChange(e, index)}
                        />
                    </Grid>
                    <Grid item xs={3} sx={{paddingTop: "10px"}}>
                        <TextField
                            label="Quantity"
                            size="small"
                            value={part.quantity}
                            onChange={(e) => handleQuantityChange(e, index)}
                        />
                    </Grid>
                    <Grid item xs={4} sx={{paddingTop: "10px"}}>
                        <TextField
                            label="Part Cost"
                            size="small"
                            value={part.cost}
                            onChange={(e) => handleCostChange(e, index)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">$</InputAdornment>
                                ),
                                // This will remove the underline styling
                                disableUnderline: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={1} sx={{paddingTop: "10px", paddingLeft: "0px"}} alignContent="center" alignItems="center">
                        <Button
                            onClick={() => deleteRow(index)}
                            sx={{padding: "0px", margin: "0px"}}
                        >
                            <img src={xIcon} style={{width: '25px', height: '25px', padding:"0px"}}/>
                        </Button>
                    </Grid>
                </Grid>
            ))}
            
            <Grid item xs={12}>
                <Button 
                    sx={{
                        color: "#3D5CAC",
                        textTransform: "none",
                    }}
                    onClick={() => addRow()}
                >
                    <AddIcon/> 
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                        Add Row
                    </Typography>
                </Button>
            </Grid>
        </>
    )
}

// /businessDeclineQuoteForm
// /businessAcceptQuoteForm
export default function BusinessQuoteForm({acceptBool, editBool}){

    const navigate = useNavigate();
    const location = useLocation();
    const { getProfileId } = useUser();
    const maintenanceItem = location.state.maintenanceItem;

    //console.log("navigationParams", navigationParams)
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [displayImages, setDisplayImages] = useState([])
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [checked, setChecked] = useState(true);
    const [showSpinner, setShowSpinner] = useState(false);
    const [availabilityDate, setAvailabilityDate] = useState(maintenanceItem?.quote_earliest_availability ? maintenanceItem?.quote_earliest_availability.split(" ")[0] : '');
    const [availabilityTime, setAvailabilityTime] = useState(maintenanceItem?.quote_earliest_availability ? dayjs(maintenanceItem?.quote_earliest_availability.split(" ")[1], "HH:mm").format("h:mm A") : '');
    const [rate, setRate] = useState(0);
    const [notes, setNotes] = useState(editBool ? maintenanceItem.quote_notes : "");
    const [jobType, setJobType] = useState("Fixed Bid");
    const [selectedImageList, setSelectedImageList] = useState([])
    const [selectedDocumentList, setSelectedDocumentList] = useState([])
    const [hours, setHours] = useState(0)
    const [total, setTotal] = useState(0)
    const [grandTotal, setGrandTotal] = useState(0)

    // useEffect(() => {
    //     console.log("availabilityTime - ", availabilityTime);
    // }, [availabilityTime]);

    const [partsObject, setPartsObject] = useState([{
        part: "",
        quantity: "",
        cost: "",
    }]);
    
    const [labor, setLabor] = useState([{
        description: "",
        hours: "",
        rate: "",
    }]);

    useEffect(() => {
        console.log("maintenanceItem", maintenanceItem)
        console.log("editBool", editBool)
        const quoteServicesExpenses = JSON.parse(maintenanceItem?.quote_services_expenses)
        if (editBool && quoteServicesExpenses){
            console.log("quoteServicesExpenses", quoteServicesExpenses)
            console.log("quote_earliest_available_date", availabilityDate)
            console.log("quote_earliest_available_time", availabilityTime)
            console.log("quote_notes", maintenanceItem?.quote_notes)
            console.log("quoteServicesExpenses.labor.rate", quoteServicesExpenses.labor[0].rate)
            console.log("quoteServicesExpenses.labor.hours", quoteServicesExpenses.labor[0].hours)
            console.log("maintenanceItem.event_type", maintenanceItem.event_type)
            setRate(parseInt(quoteServicesExpenses.labor[0].rate))
            setJobType(quoteServicesExpenses.labor[0].hours ? quoteServicesExpenses.labor[0].hours : maintenanceItem.event_type)
            setPartsObject(quoteServicesExpenses.parts)
            setLabor(quoteServicesExpenses.labor)
        }

    }, [])


    useEffect(() => {
        console.log("hours, rate, jobType", hours, rate, jobType)
        setTotal(computeTotalCost({hours: hours, rate: rate}))
        const totalEstimate = computeTotalEstimate()
        console.log("grand total", totalEstimate)
        setGrandTotal(totalEstimate)
    }, [rate, hours, partsObject, jobType])

    function computeTotalCost({hours, rate}){
        return hours * rate
    }

    function compileExpenseObject(){
        let expenseObject = {
            "per Hour Charge": rate,
            "event_type": jobType,
            "service_name": "Labor",
            "parts": partsObject,
            "labor": [{
                "description": "",
                "hours": hours,
                "rate": rate,
            }],
            // "labor": labor,
            "total_estimate": computeTotalCost({hours: hours, rate: rate})

        }
        return JSON.stringify(expenseObject)
    }


    function formatDateToCustomString() {
        const date = new Date(); // Get the current date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${month}-${day}-${year}`;
    }

    const handleCheckChange = (event) => {
        // console.log("handleCheckChange", event.target.checked)
        setChecked(event.target.checked);
    };

    const handleNotesChange = (event) => {
        // console.log("handleNotesChange", event.target.value)
        setNotes(event.target.value);
    }

    const handleTimeChange = (event) => {
        console.log("handleTimeChange", event.target.value)
        setAvailabilityTime(event.target.value);
    }

    const handleDateChange = (event) => {
        // console.log("handleDateChange", event.target.value)
        setAvailabilityDate(event.target.value);
    }

    const handleRateChange = (event) => {
        // console.log("handleRateChange", event.target.value)
        if (jobType === "Fixed Bid"){
            setHours(1)
        }
        setRate(event.target.value);
    }

    const handleHourChange = (event) => {
        setHours(event.target.value)
    }

    function navigateToAddMaintenanceItem(){
        console.log("navigateToAddMaintenanceItem")
        navigate('/addMaintenanceItem', {state: {month, year}})
    }

    function computeTotalEstimate(){
        var total = 0
        total += computeTotalCost({hours: hours, rate: rate})
        partsObject.forEach(part => {
            if(part.cost !== ""){
                total += parseInt(part.cost) * parseInt(part.quantity)
            }
        })    
        return total        
    }

    function calculateDaysOpen(){
        const maintenanceRequestCreatedDate = new Date(maintenanceItem.maintenance_request_created_date);
        const currentDate = new Date();

        // Calculate the difference in milliseconds
        const differenceInMilliseconds = currentDate - maintenanceRequestCreatedDate;

        // Convert milliseconds to days (1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
        const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
        return differenceInDays;
    }

    function handleBackButton(){
        navigate("/maintenanceDashboard", {
            state: {
                refresh: true
            }
        })
    }


    const handleSubmit = (status) => {
        console.log("handleSubmit")

        const changeQuoteStatus = async (status) => {
            setShowSpinner(true);
            var formData = new FormData();

            if (status === "SENT"){
                formData.append("maintenance_quote_uid", maintenanceItem?.maintenance_quote_uid); // 900-xxx
                formData.append("quote_maintenance_request_id", maintenanceItem?.quote_maintenance_request_id); // 800-xxx
                formData.append("quote_business_id", getProfileId())
                formData.append("quote_services_expenses", compileExpenseObject())
                formData.append("quote_notes", notes);
                formData.append("quote_status", status);
                // formData.append("quote_event_type", createEventType())
                formData.append("quote_total_estimate", String(computeTotalEstimate()));
                formData.append("quote_created_date", formatDateToCustomString())
                // formData.append("quote_earliest_availability", convertToDateTime(availabilityDate, availabilityTime))
                formData.append("quote_earliest_available_date", availabilityDate)
                formData.append("quote_earliest_available_time", availabilityTime)

                for (let i = 0; i < selectedImageList.length; i++) {
                    try {
                        let key = i === 0 ? "img_cover" : `img_${i-1}`;
        
                        if(selectedImageList[i]?.image?.startsWith("data:image")){
                            const imageBlob = dataURItoBlob(selectedImageList[i].image);
                            formData.append(key, imageBlob)
                        } else {
                            formData.append(key, selectedImageList[i])
                        }
                    } catch (error) {
                        console.log("Error creating image binary", error)
                    }
                }

                var documentBinary = []
                if (selectedDocumentList.length > 0){
                    
                    for (let i = 0; i < selectedDocumentList.length; i++){
                        try {
                            const documentBlob = dataURItoBlob(selectedDocumentList[i]);
                            documentBinary.push(documentBlob)
                        } catch (error){
                            console.log("Error creating document binary", error)
                        }
                    }

                    formData.append("qd_files", documentBinary);
                }
        
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);    
                }

            } else if (status === "REFUSED"){
                formData.append("maintenance_quote_uid", maintenanceItem?.maintenance_quote_uid); // 900-xxx
                formData.append("quote_maintenance_request_id", maintenanceItem?.quote_maintenance_request_id); // 800-xxx
                formData.append("quote_notes", notes);
                formData.append("quote_status", status);
            }
            
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ' => ' + pair[1]); 
            }

            try {
                const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceQuotes`, {
                    method: 'PUT',
                    body: formData
                });
                const responseData = await response.json();
                console.log(responseData);
                if (response.status === 200) {
                    console.log("success - changeQuoteStatus")
                } else{
                    console.log("error setting status")
                }
            } catch (error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }


        // changeMaintenanceRequestStatus(status)
        changeQuoteStatus(status)
        // uploadQuoteDocuments()
        navigate("/workerMaintenance", {state: {refresh: true}})
    }

    function numImages(){
        if (displayImages == null){ return 0 }
        else if (displayImages.length == 0){ return 0} 
        else { return displayImages.length }
    }

    useEffect(() => {
        let imageArray = JSON.parse(maintenanceItem?.maintenance_images) // quote_maintenance_images not returning anything
        setDisplayImages(imageArray)
    }, [])

    return (
        <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                // alignItems: 'center',
                width: '100%', // Take up full screen width
                minHeight: '100vh', // Set the Box height to full height
                marginTop: theme.spacing(2), // Set the margin to 20px
            }}
        >
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Paper
                style={{
                    margin: '10px',
                    backgroundColor: theme.palette.primary.main,
                    width: '100%', // Occupy full width with 25px margins on each side
                    paddingTop: '10px',
                    paddingBottom: '30px',
                }}
            >
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        paddingBottom: "20px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            paddingTop: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                        }}
                    >
                        <Box position="absolute" left={10}>
                            <Button onClick={() => handleBackButton()}>
                                <img src={refundIcon} style={{width: '25px', height: '25px', margin:'5px'}}/>
                                <Typography sx={{textTransform: 'none', color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: '14px'}}>
                                    Return to Viewing All Maintenance Requests
                                </Typography>
                            </Button>
                        </Box>
                    </Stack>
                    <Card
                        sx={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "10px",
                            width: "90%",
                            height: "100%",
                            padding: "10px",
                            margin: "10px",
                            paddingTop: "25px",
                            minWidth: "300px"
                        }}>
                        <Grid container
                            direction="column"
                        >
                                <Grid item xs={12}>
                                    <Grid container spacing={2} justifyContent="center">
                                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "20px"}}>
                                            {maintenanceItem.maintenance_title}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <ImageCarousel images={displayImages}/>
                                <Grid item xs={12}>
                                    <Grid container spacing={2} justifyContent="center" sx={{paddingTop: "20px"}}>
                                        <Typography sx={{color: "#000000", fontWeight: "10px", fontSize: "14px"}}>
                                            { numImages() > 0 ? numImages() + " Images" : "No Images" }
                                        </Typography>
                                    </Grid>

                                    <Grid container spacing={2} justifyContent="center" sx={{paddingTop: "20px"}}>
                                            <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                                <b>{maintenanceItem?.maintenance_priority} Priority</b>
                                            </Typography>
                                    </Grid>
                                </Grid>
                            <Grid container direction="row">
                                <Grid item xs={12}>
                                    <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                        <b>Property Address</b>
                                    </Typography>
                                    <div style={{paddingLeft: "10px"}}>
                                        <Typography sx={{color: "#000000", fontWeight: "10px", fontSize: "14px"}}>
                                            {maintenanceItem.property_address} {maintenanceItem.property_unit} {maintenanceItem.property_city} {maintenanceItem.property_state} {maintenanceItem.property_zip}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                        <b>Reported</b>
                                    </Typography>
                                    <div style={{paddingLeft: "10px"}}>
                                        <Typography sx={{color: "#000000", fontWeight: "10px", fontSize: "14px"}}>
                                            {maintenanceItem.maintenance_request_created_date}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                        <b>Days Open</b>
                                    </Typography>
                                    <div style={{paddingLeft: "10px"}}>
                                        <Typography sx={{color: "#000000", fontWeight: "10px", fontSize: "14px"}}>
                                            {calculateDaysOpen()}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6} sx={{paddingBottom: "20px"}}>
                                    <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                        <b>Description</b>
                                    </Typography>
                                    <div style={{paddingLeft: "10px"}}>
                                        <Typography sx={{color: "#000000", fontWeight: "10px", fontSize: "14px"}}>
                                            {maintenanceItem.maintenance_desc}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={6} sx={{paddingBottom: "20px"}}>
                                    <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                        <b>Grand Total: </b>
                                    </Typography>
                                    <div style={{paddingLeft: "10px"}}>
                                        <Typography sx={{color: "#000000", fontWeight: "10px", fontSize: "14px"}}>
                                            $ {grandTotal}
                                        </Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" spacing={1}>
                            {acceptBool ? (
                                <>
                                <Grid item xs={12} sx={{paddingTop: "10px"}}>
                                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                        Labor Details
                                    </Typography>
                                </Grid>
                                    <Grid item xs={12} sx={{paddingTop: "10px"}}>
                                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "12px"}}>
                                            Job Type
                                        </Typography>
                                        <Select sx={{backgroundColor: 'white', borderColor: 'black', borderRadius: '7px'}} size="small" fullWidth onChange={(e) => setJobType(e.target.value)} value={jobType} placeholder="Job Type">
                                            <MenuItem value={"Fixed Bid"}>Fixed Bid</MenuItem>
                                            <MenuItem value={"Hourly"}>Hourly</MenuItem>
                                        </Select>
                                    </Grid>
                                    {jobType === "Hourly" ? (
                                        <>
                                            <Grid item xs={4} sx={{paddingTop: "10px"}}>
                                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "12px"}}>
                                                    # of hours
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'black',
                                                        borderRadius: '7px',
                                                    }}
                                                    fullWidth
                                                    value={hours}
                                                    onChange={handleHourChange}
                                                />
                                            </Grid>
                                            <Grid item xs={4} sx={{paddingTop: "10px"}}>
                                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "12px"}}>
                                                    Charge/Hour
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={rate}
                                                    onChange={handleRateChange}
                                                />
                                            </Grid>
                                            <Grid item xs={4} sx={{paddingTop: "10px"}}>
                                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "12px"}}>
                                                    Total Cost
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    readOnly
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">$</InputAdornment>
                                                        ),
                                                        disableUnderline: true
                                                    }}
                                                    value={computeTotalCost({hours: hours, rate: rate})}
                                                />
                                            </Grid>
                                        </>  
                                    ) : (
                                        <Grid item xs={4} sx={{paddingTop: "10px"}}>
                                            <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "12px"}}>
                                                Charge
                                            </Typography>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={rate}
                                                onChange={handleRateChange}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">$</InputAdornment>
                                                    ),
                                                    // This will remove the underline styling
                                                    disableUnderline: true
                                                }}
                                            />
                                        </Grid>
                                    )}
                                    <CostPartsTable parts={partsObject} setParts={setPartsObject}/>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                            Earliest Availability
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} md={6} sx={{paddingTop: "10px"}}>
                                        
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                value={dayjs(availabilityDate)}
                                                minDate={dayjs()}
                                                onChange={(v) => setAvailabilityDate(v.format("MM-DD-YYYY"))}
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
                                                        label: "Date"
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={6} md={6} sx={{paddingTop: "10px"}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker                                                        
                                                slotProps={{ 
                                                    textField: { 
                                                        size: 'small',
                                                        style: {
                                                            width: "100%",
                                                            fontSize: 12,
                                                            backgroundColor: "#F2F2F2 !important",
                                                            borderRadius: "10px !important",
                                                        },
                                                        label: 'Time (select AM or PM)'                                                                
                                                    } 
                                                }}                                                        
                                                views={['hours', 'minutes']}
                                                
                                                value={dayjs(availabilityTime)}
                                                onChange={(newValue) => setAvailabilityTime(newValue.format("HH:mm"))}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} sx={{paddingTop: "10px"}}>
                                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                            Notes
                                        </Typography>
                                        <TextField
                                            multiline
                                            required
                                            rows={2}
                                            borderRadius="10px"
                                            variant="outlined"
                                            fullWidth 
                                            InputProps={{
                                                readOnly: false,
                                                style: { 
                                                    backgroundColor: 'white',
                                                    borderColor: '#000000'
                                                }
                                            }}
                                            value={notes}
                                            onChange={handleNotesChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{paddingTop: "25px"}}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={checked}
                                                    onChange={handleCheckChange}
                                                    color="primary"
                                                    sx={{
                                                        color: "#3D5CAC"
                                                    }}
                                                />
                                            }
                                            sx={{
                                                color: "#3D5CAC"
                                            }}
                                            label="Diagnostic fees included"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{paddingTop: "25px"}}>
                                    <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                            Add Documents
                                        </Typography>
                                        <DocumentUploader selectedDocumentList={selectedDocumentList} setSelectedDocumentList={setSelectedDocumentList}/>
                                    </Grid>
                                    <Grid item xs={12} sx={{paddingTop: "25px"}}>
                                        <ImageUploader selectedImageList={selectedImageList} setSelectedImageList={setSelectedImageList}/>
                                    </Grid>
                                    <Grid item xs={12} sx={{paddingTop: "25px"}}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#668AAE",
                                                textTransform: "none",
                                                borderRadius: "10px",
                                                display: 'flex',
                                                width: "100%",
                                            }}
                                            onClick={() => handleSubmit("SENT")}
                                            >
                                            <Typography sx={{
                                                fontWeight: theme.typography.primary.fontWeight, 
                                                fontSize: "14px",
                                                color: "#FFFFFF",
                                                textTransform: "none",
                                            }}>
                                                Send Quote
                                            </Typography>
                                        </Button>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item xs={12} sx={{paddingTop: "10px"}}>
                                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                            Notes
                                        </Typography>
                                        <TextField
                                            multiline
                                            required
                                            rows={5}
                                            borderRadius="10px"
                                            variant="outlined"
                                            fullWidth 
                                            InputProps={{
                                                readOnly: false,
                                                style: { 
                                                    backgroundColor: 'white',
                                                    borderColor: '#000000'
                                                }
                                            }}
                                            onChange={handleNotesChange}
                                            value={notes}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{paddingTop: "25px"}}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#668AAE",
                                                textTransform: "none",
                                                borderRadius: "10px",
                                                display: 'flex',
                                                width: "100%",
                                            }}
                                            onClick={() => handleSubmit("REFUSED")}
                                            >
                                            <Typography sx={{
                                                fontWeight: theme.typography.primary.fontWeight, 
                                                fontSize: "14px",
                                                color: "#FFFFFF",
                                                textTransform: "none",
                                            }}>
                                                Decline Quote
                                            </Typography>
                                        </Button>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Card>
                </Stack> 
            </Paper>
        </Box>
    )
}