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


import { useEffect, useState } from "react";
import theme from '../../../theme/theme';
import documentIcon from "./../Business/Subtract.png"

function LaborTableReadOnly({labor, setLabor}){


    console.log("labor in LaborTable", labor)
    const calculateTotal = (hours, cost) => {
        console.log("calculateTotal", hours, cost)
        return parseInt(hours) * parseInt(cost)
    }

    return (
        <>
        <Grid container sx={{paddingTop: "10px"}}>
            {/* <Grid item xs={3}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    Title
                </Typography>
            </Grid> */}
            <Grid item xs={4}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    # of Hours
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    Charge / Hour
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    Total
                </Typography>
            </Grid>
            {labor && labor.map((laborItem, index) => (
                <Grid container key={index}>
                    {/* <Grid item xs={3}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            {laborItem.description}
                        </Typography>
                    </Grid> */}
                    <Grid item xs={4}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            {laborItem.hours}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            ${laborItem.rate}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            ${calculateTotal(laborItem.hours, laborItem.rate)}
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


    console.log("labor in LaborTable", parts)

    const calculateTotal = (qty, cost) => {
        return parseInt(qty) * parseInt(cost)
    }
    return (
        <>
        <Grid container sx={{paddingTop: "10px"}}>
            <Grid item xs={4}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    Parts
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    Cost
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    Qty
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    Total
                </Typography>
            </Grid>
            {parts && parts.map((part, index) => (
                <Grid container key={index}>
                    {/* <Grid item xs={3}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            {laborItem.description}
                        </Typography>
                    </Grid> */}
                    <Grid item xs={4}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            {part.part}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            ${part.cost}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                            {part.quantity}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
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

    const costData = JSON.parse(maintenanceItem?.quote_services_expenses);

    console.log(costData)
    console.log(costData.parts)
    console.log(costData.labor)

    const [parts, setParts] = useState(costData.parts);
    const [labor, setLabor] = useState(costData.labor);

    const [estimatedCost, setEstimatedCost] = useState(0);
    const [estimatedLaborCost, setEstimatedLaborCost] = useState(0);
    const [estimatedPartsCost, setEstimatedPartsCost] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState("");
    const [earliestAvailability, setEarliestAvailability] = useState("");

    useEffect(() => {
        console.log("QuotesSubmittedAction01", maintenanceItem)

        // console.log("expenses", maintenanceItem.quote_services_expenses)
        //console.log("quote_event_type", maintenanceItem.quote_event_type)

        const parseServicesExpenses = (expenses) => {
            let servicesObject = JSON.parse(expenses)
            console.log(servicesObject)
            var partsCost = 0
            for (const item in servicesObject?.parts){
                partsCost += parseInt(servicesObject.parts[item].cost)
            }

            setEstimatedLaborCost(servicesObject?.total_estimate)
            setEstimatedPartsCost(partsCost)

            setEstimatedCost(servicesObject?.total_estimate + partsCost)
        }
        try{
            parseServicesExpenses(maintenanceItem?.quote_services_expenses)
            setEstimatedTime(maintenanceItem.quote_event_type)
            setEarliestAvailability(maintenanceItem.quote_earliest_availability)
        } catch (error){
            console.log("error", error)
        }

    }, [maintenanceItem])

    return (
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

        <Grid container direction="column" rowSpacing={2}>
            <Grid item xs={12}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                    Estimate
                </Typography>
            </Grid>
        </Grid>
            
        <LaborTableReadOnly labor={labor} setLabor={setLabor}/>

        <PartsTableReadOnly parts={parts} setParts={setParts}/>

        <Grid container direction="column" rowSpacing={2} paddingTop={"20px"}>
            <Grid item xs={12}>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.medium.fontWeight, fontSize: "14px"}}>
                    Estimated Time: {maintenanceItem.quote_event_type}
                </Typography>
                <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.medium.fontWeight, fontSize: "14px"}}>
                    Earliest Availability: {maintenanceItem.quote_earliest_availability}
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
                        checked={true}
                        paddingLeft="0px"
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
                    <img src={documentIcon} style={{width: '20px', height: '25px', margin:'0px', paddingRight: "15px"}}/>
                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                        View Document
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    </Stack>
    )


}