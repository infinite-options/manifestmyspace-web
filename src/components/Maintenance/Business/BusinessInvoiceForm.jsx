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
    TextField,
    MenuItem,
    Checkbox,
    Select,
    Radio,
    FormControlLabel,
    InputAdornment,
} from "@mui/material";

import { useEffect, useState } from "react";
import { Form, useLocation, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import theme from '../../../theme/theme';
import ImageUploader from "../../ImageUploader";
import documentIcon from "./documentIcon.png"
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { set } from "date-fns";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import { useUser } from "../../../contexts/UserContext";
import DocumentUploader from "../../DocumentUploader";
import dayjs from 'dayjs';

function LaborTable({labor, setLabor}){

    const [indexToggle, setIndexToggle] = useState(-1);
    const [editToggle, setEditToggle] = useState(false);

    const [laborDescription, setLaborDescription] = useState("");
    const [laborHours, setLaborHours] = useState("1");
    const [laborCharge, setLaborCharge] = useState("0");

    function addRow(){
        console.log("addRows")
        let newRow = {
                hours: "",
                cost: "",
                description: ""
            };
        setLabor(prevLabor => [...prevLabor, newRow]);
    }

    function deleteRow(index){
        console.log("deleteRow", index)
        let newLabor = [...labor]
        newLabor.splice(index, 1)
        setLabor(newLabor)
    }

    function editRow(index){
        console.log("editRow", index)

        setLaborDescription(labor[index].description)
        setLaborHours(labor[index].hours)
        setLaborCharge(labor[index].charge)

        setIndexToggle(index)
        setEditToggle(!editToggle)
    }

    function saveRow(index){
        console.log("saveRow", index)
        let updatedRow = {
            hours: laborHours,
            charge: laborCharge,
            description: laborDescription
        }
        let newLabor = [...labor]
        newLabor[index] = updatedRow
        setLabor(newLabor)
        setIndexToggle(-1)
        setEditToggle(!editToggle)
        setLaborDescription("")
        setLaborCharge("0")
        setLaborHours("1")
    }

    const calculateTotal = (hours, cost) => {
        console.log("calculateTotal", hours, cost)
        return parseInt(hours) * parseInt(cost)
    }

    const handleKeyDown = (event, index) => {
        if (event.key === 'Enter') {
            saveRow(index);
        }
    };

    return(
        <>
        <Grid container sx={{paddingTop: "10px"}}>
            <Grid item xs={1}>
            </Grid>
            <Grid item xs={3}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    Title
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    # of Hours
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    Charge / Hour
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    Total
                </Typography>
            </Grid>
            <Grid item xs={1}>
            </Grid>
            {labor.map((laborItem, index) => (
                <Grid container sx={{paddingTop: "10px"}}>
                    <Grid item xs={1}>
                        <Button sx={{
                            color: "#3D5CAC",
                            textTransform: "none",
                        }}
                            onClick={() => editRow(index, true)}
                        >
                            <EditIcon/>
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        {indexToggle === index && editToggle === true ? (
                        <TextField
                            size="small"
                            value={laborDescription}
                            defaultValue={laborItem.description}
                            onChange={(e) => setLaborDescription(e.target.value)}
                        />) : (
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            {laborItem.description === "" ? "Labor" : laborItem.description}
                        </Typography>
                        )}
                    </Grid>
                    <Grid item xs={2}>
                        {indexToggle === index && editToggle === true ? (
                        <TextField
                            size="small"
                            value={laborHours}
                            defaultValue={laborItem.hours}
                            onChange={(e) => setLaborHours(e.target.value)}
                        />
                        ) : (
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            {laborItem.hours}
                        </Typography>
                        )}
                    </Grid>
                    <Grid item xs={2}>
                        {indexToggle === index && editToggle === true ? (
                        <TextField
                            size="small"
                            value={laborCharge}
                            defaultValue={laborItem.charge}
                            onChange={(e) => setLaborCharge(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">$</InputAdornment>
                                ),
                                disableUnderline: true
                            }}
                        />) : (
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            ${laborItem.charge}
                        </Typography>
                        )}
                    </Grid>
                    <Grid item xs={3}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            ${calculateTotal(laborItem.hours, laborItem.charge)}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        {indexToggle === index && editToggle === true ? ( 
                            <Button sx={{
                                color: "#3D5CAC",
                                textTransform: "none",
                            }}
                                onClick={() => saveRow(indexToggle)}
                                onKeyDown={(event) => handleKeyDown(event, indexToggle)}
                            >
                                <SaveIcon/>
                            </Button>
                        ):(
                            <Button sx={{
                                color: "#3D5CAC",
                                textTransform: "none",
                            }}
                                onClick={() => deleteRow(index)}
                            >
                                <DeleteIcon fontSize="small"/>
                            </Button>
                        )}
                    </Grid>
                </Grid>
            )
            )}
        </Grid>
         <Grid container>
            <Grid item xs={12}>
                <Button sx={{
                    color: "#3D5CAC",
                    textTransform: "none",
                }}
                    onClick={() => addRow()}
                >
                    <AddIcon/> 
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "12px"}}>
                        Add Labor 
                    </Typography>
                </Button>
            </Grid>
        </Grid>
        </>
    )
}

function PartsTable({parts, setParts}){
 
    const [indexToggle, setIndexToggle] = useState(-1);
    const [editToggle, setEditToggle] = useState(false);

    const [partName, setPartName] = useState("");
    const [partCost, setPartCost] = useState("0");
    const [partQuantity, setPartQuantity] = useState("1");
    

    function addRow(){
        console.log("addRows")
        let newRow = {
                part: "",
                quantity: "",
                cost: ""
            };
        setParts(prevParts => [...prevParts, newRow]);
    }

    function deleteRow(index){
        console.log("deleteRow", index)
        let newParts = [...parts]
        newParts.splice(index, 1)
        setParts(newParts)
    }

    function editRow(index){
        console.log("editRow", index)

        setPartName(parts[index].part)
        setPartCost(parts[index].cost)
        setPartQuantity(parts[index].quantity)

        setIndexToggle(index)
        setEditToggle(!editToggle)
    }

    function saveRow(index){
        console.log("saveRow", index)
        let updatedRow = {
            part: partName,
            quantity: partQuantity,
            cost: partCost
        }
        let newParts = [...parts]
        newParts[index] = updatedRow
        setParts(newParts)
        setIndexToggle(-1)
        setEditToggle(!editToggle)
        setPartName("")
        setPartCost("0")
        setPartQuantity("1")
    }

    const calculateTotal = (qty, cost) => {
        return parseInt(qty) * parseInt(cost)
    }

    const handleKeyDown = (event, index) => {
        if (event.key === 'Enter') {
            saveRow(index);
        }
    };

    return (
        <> 
            <Grid container sx={{paddingTop: "10px"}}>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={3}>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                        Parts
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                        Cost
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                        Qty
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                        Total
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                </Grid>
                {parts.map((part, index) => (
                    <Grid container sx={{paddingTop: "10px"}}>
                        <Grid item xs={1}>
                            <Button sx={{
                                color: "#3D5CAC",
                                textTransform: "none",
                            }}
                                onClick={() => editRow(index, true)}
                            >
                                <EditIcon/>
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            {indexToggle === index && editToggle === true ? (
                            <TextField
                                size="small"
                                value={partName}
                                defaultValue={part.part}
                                onChange={(e) => setPartName(e.target.value)}
                            />) : (
                            <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                {part.part}
                            </Typography>
                            )}
                        </Grid>
                        <Grid item xs={2}>
                            {indexToggle === index && editToggle === true ? (
                            <TextField
                                size="small"
                                value={partCost}
                                defaultValue={part.cost}
                                onChange={(e) => setPartCost(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">$</InputAdornment>
                                    ),
                                    disableUnderline: true
                                }}
                            />) : (
                            <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                ${part.cost}
                            </Typography>
                            )}
                        </Grid>
                        <Grid item xs={2}>
                            {indexToggle === index && editToggle === true ? (
                            <TextField
                                size="small"
                                value={partQuantity}
                                defaultValue={part.quantity}
                                onChange={(e) => setPartQuantity(e.target.value)}
                            />
                            ) : (
                            <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                {part.quantity}
                            </Typography>
                            )}
                        </Grid>
                        <Grid item xs={3}>
                            <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                ${calculateTotal(part.quantity, part.cost)}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            {indexToggle === index && editToggle === true ? ( 
                                <Button sx={{
                                    color: "#3D5CAC",
                                    textTransform: "none",
                                }}
                                    onClick={() => saveRow(indexToggle)}
                                    onKeyDown={(event) => handleKeyDown(event, indexToggle)}
                                >
                                    <SaveIcon/>
                                </Button>
                            ):(
                                <Button sx={{
                                    color: "#3D5CAC",
                                    textTransform: "none",
                                }}
                                    onClick={() => deleteRow(index)}
                                >
                                    <DeleteIcon fontSize="small"/>
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    <Button sx={{
                        color: "#3D5CAC",
                        textTransform: "none",
                    }}
                        onClick={() => addRow()}
                    >
                        <AddIcon/> 
                        <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "12px"}}>
                            Add Additional Parts 
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}



export default function BusinessInvoiceForm(){

    const navigate = useNavigate();
    const location = useLocation();
    const { getProfileId } = useUser();
    const [showSpinner, setShowSpinner] = useState(false);
    const [editMode, setEditMode] = useState(location.state?.edit || false);
    const [profileInfo, setProfileInfo] = useState({});
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedDocumentList, setSelectedDocumentList] = useState([])

    const maintenanceItem = location.state.maintenanceItem;

    console.log("maintenanceItem", maintenanceItem)

    const costData = JSON.parse(maintenanceItem?.quote_services_expenses);

    console.log(costData)

    const [parts, setParts] = useState(costData.parts);
    const [labor, setLabor] = useState([{
        description: "",
        hours: costData.event_type,
        charge: costData["per Hour Charge"],
    }]);
    // const [numParts, setNumParts] = useState(costData.parts.length);
    const [selectedImageList, setSelectedImageList] = useState([]);
    // const [amountDue, setAmountDue] = useState(0);
    const [notes, setNotes] = useState("");
    const [total, setTotal] = useState(0);

    const [diagnosticToggle, setDiagnosticToggle] = useState(false);

    const handleNotesChange = (e) => {
        console.log("handleNotesChange", e.target.value)
        setNotes(e.target.value);
    }

    const handleDiagnosticToggle = () => {
        setDiagnosticToggle(!diagnosticToggle);
    }

    const createPaymentMethodList = (businessProfileObject) => {
        let paymentMethods = [];
        paymentMethods.push({
            method: "Venmo",
            account: businessProfileObject.venmo ? businessProfileObject.venmo : "Not Provided"
        })
        paymentMethods.push({
            method: "Cash App",
            account: businessProfileObject.cash_app ? businessProfileObject.cash_app : "Not Provided"
        })
        paymentMethods.push({
            method: "PayPal",
            account: businessProfileObject.paypal ? businessProfileObject.paypal : "Not Provided"
        })
        paymentMethods.push({
            method: "Zelle",
            account: businessProfileObject.business_zelle ? businessProfileObject.business_zelle : "Not Provided"
        })

        setPaymentMethods(paymentMethods)
    
    }

    useEffect(() => {
        const getMaintenanceProfileInfo = async () => {
            setShowSpinner(true);
            try {
                const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/businessProfile/${getProfileId()}`, {
                    method: 'GET',
                })
                const responseData = await response.json();
                // console.log("[DEBUG] Business Profile:", responseData.result[0]);
                createPaymentMethodList(responseData.result[0])
                setProfileInfo(responseData.result[0])
            } catch (error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }
        // console.log("running get maintenance profile info")
        getMaintenanceProfileInfo()
    }, [])

    useEffect(() => {
        let partsTotal = 0
        let laborTotal = 0

        for(let i = 0; i < parts.length; i++){
            partsTotal += parseInt(parts[i].cost) * parseInt(parts[i].quantity);
        }

        for (let i = 0; i < labor.length; i++){
            laborTotal += parseInt(labor[i].hours) * parseInt(labor[i].charge);
        }
        setTotal(partsTotal + laborTotal)
    }, [parts, labor])

    const handleSendInvoice = () => {
        console.log("handleSendInvoice")
        console.log("selectedImageList", selectedImageList)
        console.log("parts", parts)
        console.log("total", total)

        const updateMaintenanceQuote = async () => {
            var formData = new FormData();
            formData.append("maintenance_quote_uid", maintenanceItem.maintenance_quote_uid);
            formData.append("quote_services_expenses", JSON.stringify({
                "parts": parts,
                "labor": labor,
            }));

            setShowSpinner(true);
            try {
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceQuotes", {
                    method: 'PUT',
                    body: formData,
                })
            } catch (error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }
        const uploadBillDocuments = async () => {
            // Get the current date and time
            const currentDatetime = new Date();

            // Format the date and time
            const formattedDatetime = 
                (currentDatetime.getMonth() + 1).toString().padStart(2, '0') + '-' +
                currentDatetime.getDate().toString().padStart(2, '0') + '-' +
                currentDatetime.getFullYear() + ' ' +
                currentDatetime.getHours().toString().padStart(2, '0') + ':' +
                currentDatetime.getMinutes().toString().padStart(2, '0') + ':' +
                currentDatetime.getSeconds().toString().padStart(2, '0');
            try {
                var formData = new FormData();
                formData.append("document_type", "pdf");
                formData.append("document_date_created", formattedDatetime);
                formData.append("document_property", maintenanceItem.property_id);

                for (let i = 0; i < selectedDocumentList.length; i++){
                    formData.append("document_file", selectedDocumentList[i]);
                    formData.append("document_title", selectedDocumentList[i].name);
                }
                const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/documents/${getProfileId()}`, {
                    method: 'POST',
                    body: formData,
                })
                // const responseData = await response.json();
            } catch (error) {
                console.log("error", error)
            }

        }
        const createBill = async () => {
            setShowSpinner(true);
            try {
                var formData = new FormData();
                formData.append("bill_description", "Invoice from " + maintenanceItem.business_name + " for " + maintenanceItem.maintenance_title);
                formData.append("bill_created_by", maintenanceItem.quote_business_id);
                formData.append("bill_utility_type", "maintenance");
                formData.append("bill_amount", total);
                formData.append("bill_split", "Uniform");
                formData.append("bill_property_id", JSON.stringify([{
                    "property_uid": maintenanceItem.property_id,
                }]));
                formData.append("bill_docs", JSON.stringify(selectedImageList));
                formData.append("bill_notes", notes);
                formData.append("bill_maintenance_quote_id", maintenanceItem.maintenance_quote_uid);
                

                // TODO: Change this to form data
                const response = await fetch("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/bills", {
                    method: 'POST',
                    body: formData,
                });

                const responseData = await response.json();
                console.log(responseData);
                if (response.status === 200) {
                    console.log("success")
                    uploadBillDocuments()
                    navigate("/workerMaintenance")
                } else{
                    console.log("error setting status")
                }
            } catch (error){
                console.log("error", error)
            }
            setShowSpinner(false);
        }
        updateMaintenanceQuote()
        createBill()
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        }}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                width: '80%',
                minHeight: '100vh', // Set the Box height to full height
                marginTop: theme.spacing(2), // Set the margin to 20px
            }}
            >
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
                            paddingLeft: "10px",
                            paddingRight: "10px",
                        }}
                    >
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                            <Typography sx={{paddingBottom: "20px", color: "#000000", fontWeight: 800, fontSize: "36px"}}>
                                Invoice
                            </Typography>
                            <Box sx={{ position: 'absolute', right: 0 }}>
                                <Button sx={{
                                    color: "#3D5CAC",
                                    textTransform: "none",
                                }}
                                onClick={() => navigate(-1)}
                                >
                                    <CloseIcon/>
                                </Button>
                            </Box>   
                        </Box>

                        <Grid container direction="column" rowSpacing={2}>
                            <Grid item xs={12}>
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                    Estimate
                                </Typography>
                            </Grid>
                        </Grid>
                            
                        <LaborTable labor={labor} setLabor={setLabor}/>

                        <PartsTable parts={parts} setParts={setParts}/>

                        <Grid container direction="column" rowSpacing={2}>
                            <Grid item xs={12}>
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.medium.fontWeight, fontSize: "14px"}}>
                                    Estimated Time: {maintenanceItem.quote_event_type}
                                </Typography>
                                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.medium.fontWeight, fontSize: "14px"}}>
                                    Earliest Availability: {maintenanceItem.quote_earliest_available_date} {dayjs(maintenanceItem.quote_earliest_available_time, "HH:mm").format("hh:mm A")}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Box 
                                    display="flex" 
                                    flexDirection="row" 
                                    alignItems="center" 
                                    justifyContent="left"
                                >
                                    <Checkbox
                                        checked={diagnosticToggle}
                                        onChange={handleDiagnosticToggle}
                                    />
                                    <Typography
                                        sx={{
                                            color: theme.palette.text.primary,
                                            fontWeight: theme.typography.medium.fontWeight,
                                            fontSize: theme.typography.pxToRem(14),  // Example size, adjust as needed
                                            fontFamily: 'Source Sans Pro',
                                            marginLeft: 2,  // Optionally add some spacing between the checkbox and the text
                                        }}
                                    >
                                        Diagnostic fees included or extra
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Button sx={{
                                    color: "#3D5CAC",
                                    textTransform: "none",
                                    margin: "1px",
                                }}>
                                    <img src={documentIcon} style={{width: '20px', height: '25px', margin:'0px', paddingLeft: "0px", paddingRight: "15px"}}/>
                                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                        View Document
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{color: "#000000", fontWeight: theme.typography.medium.fontWeight, fontSize: "14px"}}>
                                    New Total
                                </Typography>
                                <TextField
                                    required
                                    rows={1}
                                    borderRadius="10px"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    readOnly
                                    InputProps={{
                                        readOnly: false,
                                        style: { 
                                            backgroundColor: 'white',
                                            borderColor: '#000000'
                                        },
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                    }}
                                    value={total}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                    Payment Methods
                                </Typography>
                                <Grid container direction="row" spacing={2} alignContent="center">
                                    {paymentMethods.map((method) => (
                                        <>
                                            <Grid item xs={4}>
                                                {method.method}
                                            </Grid>
                                            <Grid item xs={8}>
                                                {method.account}
                                            </Grid>
                                        </>                                    
                                    ))}
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                    Payment Notes
                                </Typography>
                                <TextField
                                    required
                                    rows={1}
                                    borderRadius="10px"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        readOnly: false,
                                        style: { 
                                            backgroundColor: 'white',
                                            borderColor: '#000000'
                                        }
                                    }}
                                    onChange={handleNotesChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                    Add Photos
                                </Typography>
                                <ImageUploader selectedImageList={selectedImageList} setSelectedImageList={setSelectedImageList} page={"QuoteRequestForm"}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                    Add Documents
                                </Typography>
                                <DocumentUploader selectedDocumentList={selectedDocumentList} setSelectedDocumentList={setSelectedDocumentList}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    
                                    sx={{
                                        backgroundColor: "#3D5CAC",
                                        textTransform: "none",
                                        borderRadius: "10px",
                                        display: 'flex',
                                        width: "100%",
                                    }}
                                    onClick={() => handleSendInvoice()}
                                >
                                    <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                        Send Invoice
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Stack>
                </Paper>
            </Box>
        </div>
    )
}