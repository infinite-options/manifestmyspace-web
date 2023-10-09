import { Chart } from "react-google-charts";
import { 
    Button, 
    Box, 
    ThemeProvider, 
    CircularProgress, 
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


import MaintenanceWorker from "../Maintenance/Worker/MaintenanceWorker";


export default function MaintenanceDashboard(){

    const navigate = useNavigate();
    const { user } = useUser();

    console.log("user object", user)

    const [loading, setLoading] = useState(true);




    useEffect(() => {
        console.log("Maintenance Worker Dashboard useEffect")
        console.log(user.businesses.MAINTENANCE.business_uid)

        const getMaintenanceWorkerDashboardData = async () => {
            try {
                const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceDashboard/${user.businesses.MAINTENANCE.business_uid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',                    
                    }
                });
                const data = await response.json();
                console.log(data);
                setLoading(false);
            } catch(error){
                console.log("Error getting maintenance worker dashboard data: ", error)
            }
        }
        getMaintenanceWorkerDashboardData()
    }, [])




    const data = [
        {
          "name": "Quotes Requested",
          "count": 25,
          "fill": "#DB9687"
        },
        {
          "name": "Submitted",
          "count": 5,
          "fill": "#CEA892"
        },
        {
          "name": "Quotes Accepted",
          "count": 15,
          "fill": "#BAAC7A"
        },
        {
          "name": "Scheduled",
          "count": 9,
          "fill": "#959A76"
        },
        {
            "name": "Finished",
            "count": 5,
            "fill": "#598A96"
        },
        {
          "name": "Paid",
          "count": 150,
          "fill": "#6588AC"
        },
      ]

    // const renderCustomizedLabel = (props) => {
    //         const {
    //         x, y, width, height, value,
    //         } = props;
    //     // console.log(x, y, width, height, value)
    //     // const fireOffset = value.toString().length < 5;
    //     // const offset = fireOffset ? -40 : 5;
    //         // return (
    //         //     <text x={x + width -offset} y={y + height - 5} fill={fireOffset ? "#285A64" :"#fff"} textAnchor="end">
    //         //     {value}
    //         //     </text>
    //         // );


    //         return (
    //             <text x={100+x} y={100} fill={"#000"} textAnchor="end">
    //                 {props.name}
    //                 {props.value}
    //             </text>
    //         )
    //   };
      
      

    return (
        <ThemeProvider theme={theme}>
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
                                            backgroundColor: "rgba(189, 169, 97, 0.7)",
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
                                            $500
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box
                                        variant="contained"
                                        sx={{
                                            flexDirection: "column",
                                            backgroundColor: "rgba(149, 154, 118, 0.7)",
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
                                            Quotes Scheduled Cashflow
                                        </Typography>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px"}}>
                                            $500
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box
                                        variant="contained"
                                        disableElevation
                                        sx={{
                                            flexDirection: "column",
                                            backgroundColor: "rgba(89, 138, 150, 0.7)",
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
                                            Quotes Finished Cashflow
                                        </Typography>
                                        <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px"}}>
                                            $500
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="center" sx={{paddingTop: "25px"}}>
                        <Grid item xs={12}>
                            <MaintenanceWorker/>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="center" sx={{paddingTop: "30px"}}>
                        <Grid item xs={4}  sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center' 
                        }}>
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