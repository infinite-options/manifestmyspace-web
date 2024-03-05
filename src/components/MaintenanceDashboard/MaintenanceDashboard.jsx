import { Chart } from "react-google-charts";
import { 
    Button, 
    Box, 
    ThemeProvider, 
    Grid,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { RadialBarChart, RadialBar, Legend, LabelList } from 'recharts';
import MaintenanceWidget from "../Dashboard-Components/Maintenance/MaintenanceWidget";
import "../../css/maintenance.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import theme from "../../theme/theme";
import { useUser } from "../../contexts/UserContext";

import phone from './phone.png'
import document from './document.png'
import card from './card.png'
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import MaintenanceWorker from "../Maintenance/Worker/MaintenanceWorker";
import MaintenanceWorkerDashboardWidget from "../Maintenance/Worker/MaintenanceWorkerDashboardWidget";


export default function MaintenanceDashboard(){
    const navigate = useNavigate();
    const { user, getProfileId } = useUser(); 
    const [loading, setLoading] = useState(true);
    const [quoteRequestedCount, setQuoteRequestedCount] = useState(0);
    const [submittedCount, setSubmittedCount] = useState(0);
    const [quoteAcceptedCount, setQuoteAcceptedCount] = useState(0);
    const [scheduledCount, setScheduledCount] = useState(0);
    const [finishedCount, setFinishedCount] = useState(0);
    const [paidCount, setPaidCount] = useState(0);
    const [showSpinner, setShowSpinner] = useState(false);
    const [quotesAcceptedCashflow, setQuotesAcceptedCashflow] = useState(0);
    const [quotesScheduledCashflow, setQuotesScheduledCashflow] = useState(0);
    const [quotesSubmittedCashflow, setQuotesSubmittedCashflow] = useState(0);
    const [quotesFinishedCashflow, setQuotesFinishedCashflow] = useState(0);
    const [api_data, set_api_data]= useState({});

    const data = [
        {
            "name": "Quotes Requested" + '(' + quoteRequestedCount+')',
            "count": quoteRequestedCount,
            "fill": "#DB9687"
        },
        {
            "name": "Quotes Submitted" + '(' + submittedCount+')',
            "count": submittedCount,
            "fill": "#CEA892"
        },
        {
            "name": "Quotes Accepted" + '(' + quoteAcceptedCount+')',
            "count": quoteAcceptedCount,
            "fill": "#BAAC7A"
        },
        {
            "name": "Scheduled" + '(' + scheduledCount+')',
            "count": scheduledCount,
            "fill": "#959A76"
        },
        {
            "name": "Finished" + '(' + finishedCount+')',
            "count": finishedCount,
            "fill": "#598A96"
        },
        {
            "name": "Paid" + '(' + paidCount+')',
            "count": paidCount,
            "fill": "#6588AC"
        },
      ]


    useEffect(() => {
        if (!getProfileId())
            navigate('/PrivateprofileName')

        const getMaintenanceWorkerDashboardData = async () => {
            setShowSpinner(true);
            try {
                const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/dashboard/${getProfileId()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',                    
                    }
                });
                
                const data = await response.json();
                set_api_data(data);

                
                for (const item of data.CurrentActivities.result) {
                    switch(item.maintenance_status) {
                        case "REQUESTED":
                            setQuoteRequestedCount(item.num) 
                            break;

                        case "SUBMITTED": 
                            setSubmittedCount(item.num);
                            setQuotesSubmittedCashflow(parseInt(item.total_estimate));
                            break;

                        case "ACCEPTED": 
                            setQuoteAcceptedCount(item.num)
                            setQuotesAcceptedCashflow(parseInt(item.total_estimate))
                            break;

                        case "SCHEDULED" : 
                            setScheduledCount(item.num)
                            setQuotesScheduledCashflow(parseInt(item.total_estimate))
                            break;

                        case "FINISHED":
                            setFinishedCount(item.num)
                            setQuotesFinishedCashflow(parseInt(item.total_estimate))
                            break;

                        case "PAID":
                            setPaidCount(item.num)
                            break;

                        default: 
                            // Handle unexpected status or do nothing
                            break;
                    }
                }

                setLoading(false);
            } catch(error) {
                console.log("Error getting maintenance worker dashboard data: ", error)
            }
            setShowSpinner(false);
        }
        getMaintenanceWorkerDashboardData()
    }, [])
      

    return (
        <ThemeProvider theme={theme}>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Stack
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    paddingBottom: "500px"
                }}
            >
                {loading ? (
                    <Grid container>
                        <CircularProgress color="inherit" />
                    </Grid>
                )  : (
                <>
                    <Grid container direction="row" rowGap={5}>
                        <Grid item xs={12}>
                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%', // Take up full screen width
                                    paddingTop: "25px",
                                    paddingBottom: "25px",
                                    marginTop: theme.spacing(2), // Set the margin to 20px
                                }}
                            >
                            <Typography sx={{color: "#000000", fontWeight: theme.typography.common.fontWeight, fontSize: "26px"}}>
                                Hello {user.first_name}!
                            </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%', // Take up full screen width
                                    minHeight: '300px', // Set the Box height to full height
                                    marginTop: theme.spacing(2), // Set the margin to 20px
                                }}
                            >
                                <Paper
                                    style={{
                                        padding: theme.spacing(2),
                                        backgroundColor: theme.palette.primary.main,
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
                                    <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:"22px"}}>
                                        Current Activity
                                    </Typography>                                    
                                    <Box
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginTop: theme.spacing(2), // Set the margin to 20px
                                        }}
                                    >
                                        <RadialBarChart 
                                            width={500} 
                                            height={500} 
                                            // cx='50%'
                                            // cy='50%'
                                            innerRadius="10%" 
                                            outerRadius="80%" 
                                            data={data.reverse()} 
                                            startAngle={90} 
                                            endAngle={-180}  
                                        >
                                            <RadialBar minAngle={15} background clockWise={true} dataKey='count'>
                                                <LabelList dataKey="name" position="outsideStart" fill="#000"/>
                                            </RadialBar>
                                        </RadialBarChart>
                                    </Box>
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Grid container direction="column" columnGap={5} rowGap={5}>
                                <Grid item xs={12}>
                                    <Box
                                        variant="contained"
                                        sx={{
                                            flexDirection: "column",
                                            backgroundColor: "#CEA892",
                                            textTransform: "none",
                                            paddingRight: "10px",
                                            paddingTop: "10px",
                                            paddingBottom: "10px",
                                            borderRadius: "10px",
                                            paddingLeft: "10px",
                                            display: 'flex',
                                            width: "80%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px"}}>
                                            Quotes Submitted Cashflow
                                        </Typography>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px"}}>
                                            ${quotesSubmittedCashflow}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box
                                        variant="contained"
                                        sx={{
                                            flexDirection: "column",
                                            backgroundColor: "#BAAC7A",
                                            textTransform: "none",
                                            paddingRight: "10px",
                                            paddingTop: "10px",
                                            paddingBottom: "10px",
                                            borderRadius: "10px",
                                            paddingLeft: "10px",
                                            display: 'flex',
                                            width: "80%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px"}}>
                                            Quotes Accepted Cashflow
                                        </Typography>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px"}}>
                                            ${quotesAcceptedCashflow}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box
                                        variant="contained"
                                        sx={{
                                            flexDirection: "column",
                                            backgroundColor: "#959A76",
                                            textTransform: "none",
                                            paddingRight: "10px",
                                            paddingTop: "10px",
                                            paddingBottom: "10px",
                                            borderRadius: "10px",
                                            paddingLeft: "10px",
                                            display: 'flex',
                                            width: "80%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px"}}>
                                            Scheduled Cashflow
                                        </Typography>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px"}}>
                                            ${quotesScheduledCashflow}
                                        </Typography>
                                    </Box>
                                </Grid>


                                <Grid item xs={12}>
                                    <Box
                                        variant="contained"
                                        disableElevation
                                        sx={{
                                            flexDirection: "column",
                                            backgroundColor: "#598A96",
                                            textTransform: "none",
                                            paddingRight: "10px",
                                            paddingTop: "10px",
                                            paddingBottom: "10px",
                                            borderRadius: "10px",
                                            paddingLeft: "10px",
                                            display: 'flex',
                                            width: "80%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px"}}>
                                            Finished Cashflow
                                        </Typography>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px"}}>
                                            ${quotesFinishedCashflow}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="center" sx={{paddingTop: "25px"}}>
                        <Grid item xs={12}>
                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%', // Take up full screen width
                                    minHeight: '300px', // Set the Box height to full height
                                    marginTop: theme.spacing(2), // Set the margin to 20px
                                }}
                            >
                                <Paper
                                style={{
                                    padding: theme.spacing(2),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: theme.palette.primary.main,
                                    width: '90%', // Occupy full width with 25px margins on each side
                                    [theme.breakpoints.down('sm')]: {
                                        width: '80%',
                                    },
                                    [theme.breakpoints.up('sm')]: {
                                        width: '50%',
                                    },
                                    paddingTop: '10px',
                                }}>
                                    <MaintenanceWorkerDashboardWidget dashboard_data={api_data}/>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="center" sx={{paddingTop: "30px"}}>
                        <Grid item xs={4}  sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center' 
                        }}
                        >
                            <Button
                                variant="contained"
                                disableElevation                            
                                sx={{
                                    backgroundColor: "#DEDFE3",
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': {
                                        backgroundColor: "#C4C5C9", // Slightly darker
                                    },
                                    '&:active': {
                                        backgroundColor: "#B1B3B6", // Even darker
                                    },
                                    '&:focus': {
                                        backgroundColor: "#C4C5C9", // Slightly darker
                                        // You might also want to adjust the outline on focus
                                        outline: 'none',
                                        boxShadow: '0 0 0 3px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                            <Box 
                                component="img"
                                src={document} 
                                alt="Contacts" 
                                sx={{
                                    width: "20px",
                                    height: "20px",
                                    pr: "15px", // Using padding-right
                                }}
                            />
                                <Typography
                                    sx={{
                                        color: "#160449",
                                        fontWeight: theme.typography.common.fontWeight,
                                        fontSize: theme.typography.smallFont,
                                    }}
                                >
                                    Documents
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={4}  sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center' 
                        }}>
                        <Button
                                variant="contained"                            
                                sx={{
                                    backgroundColor: "#DEDFE3",
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': {
                                        backgroundColor: "#C4C5C9", // Slightly darker
                                    },
                                    '&:active': {
                                        backgroundColor: "#B1B3B6", // Even darker
                                    },
                                    '&:focus': {
                                        backgroundColor: "#C4C5C9", // Slightly darker
                                        // You might also want to adjust the outline on focus
                                        outline: 'none',
                                        boxShadow: '0 0 0 3px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                                <Box 
                                    component="img"
                                    src={card} 
                                    alt="Contacts" 
                                    sx={{
                                        width: "28px",
                                        height: "28px",
                                        pr: "15px", // Using padding-right
                                    }}
                                />
                                <Typography
                                    sx={{
                                        color: "#160449",
                                        fontWeight: theme.typography.common.fontWeight,
                                        fontSize: theme.typography.smallFont,
                                    }}
                                >
                                    Payments
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={4}  sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center' 
                        }}>
                            <Button
                                variant="contained"                            
                                sx={{
                                    backgroundColor: "#DEDFE3",
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': {
                                        backgroundColor: "#C4C5C9", // Slightly darker
                                    },
                                    '&:active': {
                                        backgroundColor: "#B1B3B6", // Even darker
                                    },
                                    '&:focus': {
                                        backgroundColor: "#C4C5C9", // Slightly darker
                                        // You might also want to adjust the outline on focus
                                        outline: 'none',
                                        boxShadow: '0 0 0 3px rgba(0,0,0,0.1)',
                                    },
                                }}
                                onClick={() => navigate('/maintenanceContacts')}
                            >
                                <Box 
                                    component="img"
                                    src={phone} 
                                    alt="Contacts" 
                                    sx={{
                                        width: "13px",
                                        height: "17px",
                                        pr: "15px", // Using padding-right
                                    }}
                                />
                                <Typography
                                    sx={{
                                        color: "#160449",
                                        fontWeight: theme.typography.common.fontWeight,
                                        fontSize: theme.typography.smallFont,
                                    }}
                                >
                                    Contacts
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </>
                )}
            </Stack>
        </ThemeProvider> 
    )
}