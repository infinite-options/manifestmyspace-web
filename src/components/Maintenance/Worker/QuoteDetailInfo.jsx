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
    Checkbox,
    responsiveFontSizes,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import { useEffect, useState } from "react";
import theme from '../../../theme/theme';
import documentIcon from "./../Business/documentIcon.png"
import { useUser } from "../../../contexts/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function LaborTableReadOnly({labor, setLabor}){

    const calculateTotal = (hours, cost) => {
        return parseInt(hours) * parseInt(cost)
    }

    return (
        <>
        <Grid container sx={{paddingTop: "10px"}}>
            <Grid item xs={3}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    Title
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                    # of Hours
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                    Charge / Hour
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                    Total
                </Typography>
            </Grid>
            {labor && labor.map((laborItem, index) => (
                <Grid container key={index}>
                    <Grid item xs={3}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            {laborItem.description ? laborItem.description : "Labor"}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            {laborItem.hours}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            ${laborItem.charge || laborItem.rate}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            ${calculateTotal(laborItem.hours, laborItem.charge || laborItem.rate)}
                        </Typography>
                    </Grid>
                </Grid>
                )
            )}
        </Grid>
        </>
    )
}

function PartsTableReadOnly({parts, setParts}){

    const calculateTotal = (qty, cost) => {
        return parseInt(qty) * parseInt(cost)
    }
    return (
        <>
        <Grid container sx={{paddingTop: "10px"}}>
            <Grid item xs={3}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                    Parts
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                    Qty
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                    Cost
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                    Total
                </Typography>
            </Grid>
            {parts && parts.map((part, index) => (
                <Grid container key={index}>
                    <Grid item xs={3}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            {part.part}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            {part.quantity}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            ${part.cost}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            ${calculateTotal(part.quantity, part.cost)}
                        </Typography>
                    </Grid>
                </Grid>
                )
            )}
        </Grid>
        </>
    )
}

export default function QuoteDetailInfo({maintenanceItem}){
    const { roleName } = useUser();

    const location = useLocation();
    const navigate = useNavigate();

    let costData;
    console.log(maintenanceItem)
    try {
        if (maintenanceItem?.quote_services_expenses) {
            costData = JSON.parse(maintenanceItem?.quote_services_expenses);
        } else {
            // throw new Error('quote_services_expenses is undefined');
            costData = {}; // Set a default value if needed
        }
    } catch (error) {
        console.error('Error parsing quote_services_expenses:', error);
        // Handle the error or set a default value for costData
        costData = {}; // Set a default value if needed
    } //failing here in some cases

    const [parts, setParts] = useState([]);
    const [labor, setLabor] = useState([]);

    const [estimatedCost, setEstimatedCost] = useState(0);
    const [estimatedLaborCost, setEstimatedLaborCost] = useState(0);
    const [estimatedPartsCost, setEstimatedPartsCost] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState("");
    const [earliestAvailability, setEarliestAvailability] = useState("");
    const [quoteImages, setQuoteImages] = useState([])

    useEffect(() => {
        const parseServicesExpenses = (expenses) => {
            let servicesObject = JSON.parse(expenses)
            // console.log("servicesObject", servicesObject)
            var partsCost = 0
            var laborCost = 0
            for (const item in servicesObject?.parts){
                partsCost += parseInt(servicesObject.parts[item].cost) * parseInt(servicesObject.parts[item].quantity)
            }

            for (const item in servicesObject?.labor){
                laborCost += parseInt(servicesObject.labor[item].hours) * parseInt(servicesObject.labor[item].charge || servicesObject.labor[item].rate)
            }


            setEstimatedLaborCost(laborCost)
            setEstimatedPartsCost(partsCost)

            setEstimatedCost(laborCost + partsCost)
        }
        setParts(costData?.parts || [{hours: 0, rate: 0, description: ""}])
        setLabor(costData?.labor || [{part: "", cost: 0, quantity: ""}])
        try{
            parseServicesExpenses(maintenanceItem?.quote_services_expenses)
            let quoteImageArray = JSON.parse(maintenanceItem?.quote_maintenance_images || '[]');
            setQuoteImages(quoteImageArray);
            setEstimatedTime(maintenanceItem?.quote_event_type)
            setEarliestAvailability(maintenanceItem?.quote_earliest_availability)
        } catch (error){
            console.log("error", error)
            setQuoteImages([]);
        }

    }, [maintenanceItem])

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
                paddingBottom: "5px",
            }}
        >   
        <Grid container direction="column" rowSpacing={2}>
            <Grid container direction="row">
                <Grid item xs={11}>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "18px"}}>
                        Maintenance Quote Details
                    </Typography>
                </Grid>
                <Grid item xs={1} sx={{alignItems: "right", justifyContent: "right"}}>
                    {roleName() == "Manager" ? null : <EditIcon onClick={() => navigate("/businessEditQuoteForm", {state: {maintenanceItem: maintenanceItem}})}/>}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                        {maintenanceItem?.maintenance_quote_uid}
                    </Typography>
                </Grid>
            <Grid item xs={12}>
                {quoteImages.length > 0  ? (
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "18px"}}>
                    Maintenance Quote Images
                </Typography>
                ) : null}
            </Grid>
            <Grid item xs={12}>
                {quoteImages.length > 0 ? 
                    (
                        Array.isArray(quoteImages) && quoteImages.length > 0 ? 
                        quoteImages.map((image, index) => (
                            <Grid item key={index}>
                                <img 
                                    src={image} 
                                    alt={`Image ${index}`} 
                                    style={{ width: '125px', height: '125px' }} 
                                />
                            </Grid>
                        ))
                        : 
                        null
                    )
                : "No Images" }
            </Grid>
        </Grid>
        <Grid container direction="column" rowSpacing={2}>
            <Grid item xs={12}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "18px"}}>
                    Estimate
                </Typography>
            </Grid>
        </Grid>
            
        {labor.length > 0 ? <LaborTableReadOnly labor={labor} setLabor={setLabor}/> : (
            <Grid container sx={{paddingTop: "10px"}}>
                <Grid item xs={12}>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                        No Labor
                    </Typography>
                </Grid>
            </Grid>
        )}

        {parts.length > 0 ? <PartsTableReadOnly parts={parts} setParts={setParts}/> : (
            <Grid container sx={{paddingTop: "10px"}}>
                <Grid item xs={12}>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                        No Parts
                    </Typography>
                </Grid>
            </Grid>
        )}

        <Grid container direction="column" rowSpacing={2} paddingTop={"20px"}>
            <Grid item xs={12}>
                <Typography sx={{color: "#000000", fontWeight: theme.typography.medium.fontWeight, fontSize: "18px"}}>
                    Quote Total: ${estimatedCost}
                </Typography>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.medium.fontWeight, fontSize: "16px"}}>
                    Your Estimated Time: {maintenanceItem?.quote_event_type}
                </Typography>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.medium.fontWeight, fontSize: "16px"}}>
                    Your Earliest Availability: {maintenanceItem.quote_earliest_availability}
                </Typography>
            </Grid>
            {maintenanceItem?.maintenance_request_status == "SCHEDULED" ? (
                <Grid item xs={12}>
                  <Box sx={{paddingTop: "15px", paddingBottom: "15px"}}>
                      <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "18px"}}>
                          Scheduled Date: {maintenanceItem?.maintenance_scheduled_date}
                      </Typography>
                      <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.primary.fontWeight, fontSize: "18px"}}>
                          Scheduled Time: {dayjs(maintenanceItem?.maintenance_scheduled_time, "HH:mm").format("h:mm A")} 
                      </Typography>
                  </Box>
              </Grid>
            ) : null}
            <Grid item xs={12} sx={{paddingLeft: "0px"}}>
                <Box 
                    display="flex" 
                    flexDirection="row" 
                    alignItems="center" 
                    justifyContent="left"
                >
                    <Checkbox
                        checked={true}
                        sx={{paddingLeft: "0px"}}
                    />
                    <Typography
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: theme.typography.medium.fontWeight,
                            fontSize: "18px",  // Example size, adjust as needed
                            fontFamily: 'Source Sans Pro',
                            // marginLeft: 2,  // Optionally add some spacing between the checkbox and the text
                        }}
                    >
                        Diagnostic fees included or extra
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sx={{paddingLeft: "0px"}}>
                <Button sx={{
                    color: "#3D5CAC",
                    textTransform: "none",
                    margin: "1px",
                }}>
                    <img src={documentIcon} style={{width: '20px', height: '25px', margin:'0px', paddingLeft: "0px", paddingRight: "15px"}}/>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                        View Document
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    </Stack>
    )


}