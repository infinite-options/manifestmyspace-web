import { Chart } from "react-google-charts";
import { 
    Button, 
    Box, 
    ThemeProvider, 
    Grid,
    Paper,
    Stack,
    Typography,
    Container
} from '@mui/material';
import { RadialBarChart, RadialBar, Legend, LabelList } from 'recharts';
import MaintenanceWidget from "../Dashboard-Components/Maintenance/MaintenanceWidget";
import "../../css/maintenance.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import theme from "../../theme/theme";
import { useUser } from "../../contexts/UserContext";
import { DataGrid } from "@mui/x-data-grid";
import phone from './phone.png'
import document from './document.png'
import card from './card.png'
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import MaintenanceWorker from "../Maintenance/Worker/MaintenanceWorker";
import MaintenanceWorkerDashboardWidget from "../Maintenance/Worker/MaintenanceWorkerDashboardWidget";
import useMediaQuery from "@mui/material/useMediaQuery";
import APIConfig from "../../utils/APIConfig";


export default function MaintenanceDashboard(){
    const navigate = useNavigate();
    const location = useLocation();
    const { user, getProfileId, selectedRole } = useUser(); 
    let dashboard_id=getProfileId()
    if (selectedRole==='MAINT_EMPLOYEE')
        dashboard_id= user.businesses?.MAINTENANCE?.business_uid || user?.maint_supervisor;

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
    const [refresh, setRefresh] = useState(false || location.state?.refresh);
    const [chartSize, setChartSize] = useState(200);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isMedium = useMediaQuery(theme.breakpoints.down("md"));

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

      const [payment_data, set_payment_data]=useState({})

      const columnsListDesktop = [
        {
          field: "purchase_uid",
          headerName: "ID",
          flex: 0.5,
          renderCell: (params) => (
            <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value}</Box>
          ),
          headerAlign: "center",
        },
        
        {
          field: "receiver_user_name",
          headerName: "To",
          flex: 1,
          renderCell: (params) => (
            <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value}</Box>
          ),
          headerAlign: "center",
        },
        {
          field: "pur_description",
          headerName: "Description",
          flex: 1,
          headerStyle: {
            fontWeight: "bold",
          },
          renderCell: (params) => <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value ? params.value : "-"}</Box>,
          headerAlign: "center",
        },
    
        {
          field: "property_address",
          headerName: "Property address",
          flex: 1,
          headerStyle: {
            width: "100%",
            fontWeight: "bold",
          },
          renderCell: (params) => <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value ? params.value : "-"}</Box>,
          headerAlign: "center",
        },
        {
            field: "pur_due_date",
            headerName: "Due Date",
            flex: 1,
            headerStyle: {
              width: "100%",
              fontWeight: "bold",
            },
            renderCell: (params) => <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value ? params.value : "-"}</Box>,
            headerAlign: "center",
          },
          {
            field: "pur_amount_due",
            headerName: "Amount",
            flex: 1,
            headerStyle: {
              width: "100%",
              fontWeight: "bold",
            },
            renderCell: (params) => <Box sx={{ width: "100%", fontWeight: "bold", textAlign: "center" }}>{params.value ? params.value : "-"}</Box>,
            headerAlign: "center",
          },
          
      ]



      function Chart() {
        return (
            <Paper
            style={{
                padding: theme.spacing(2),
                backgroundColor: theme.palette.primary.main,
                width: '100%', // Ensure it occupies the full width of the parent div
                paddingTop: '2%',
                paddingBottom: '2%',
                paddingRight: '2%',
                paddingLeft: '3%',
                overflow: 'hidden',
            }}
        >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8}>
                    <Typography sx={{ 
                            color: '#160449', 
                            fontWeight: 'bold', 
                            fontSize: "35px", 
                            textAlign: 'center',
                            fontFamily: 'Inter, sans-serif', // Add the Inter font family
                            marginBottom:'1%',
                        }}>
                            Current Activity
                        </Typography>
                        <Box
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: theme.spacing(2),
                                position: 'relative',
                            }}
                        >
                            <RadialBarChart
                                width={chartSize / 4}
                                height={chartSize / 4}
                                innerRadius="10%"
                                outerRadius="90%"
                                data={data.reverse()}
                                startAngle={90}
                                endAngle={-180}
                            >
                                <RadialBar minAngle={15} background clockWise={true} dataKey='count' />
                            </RadialBarChart>
                            <Legend
                                iconSize={20}
                                layout="vertical"
                                verticalAlign="top"
                                align="left"
                                alignItems="left"
                                justifyContent="flex-start"
                                wrapperStyle={{
                                    position: 'absolute',
                                    left: '5%',
                                    top: '5%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                }}
                                margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
                                payload={
                                    data.map(item => ({
                                        value: item.name,
                                        type: 'square',
                                        id: item.name,
                                        color: item.fill,
                                    })).reverse()
                                }
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={4} container direction="column" alignItems="center" justifyContent="center">
                        <Grid container direction="column" spacing={5} alignItems="center">
                            <Grid item xs={12}>
                                <Box
                                    variant="contained"
                                    sx={{
                                        flexDirection: "column",
                                        backgroundColor: "#CEA892",
                                        textTransform: "none",
                                        padding: "10px",
                                        borderRadius: "10px",
                                        display: 'flex',
                                        width: "300px", // Double the width
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px" }}>
                                        Quotes Submitted Cashflow
                                    </Typography>
                                    <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px" }}>
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
                                        padding: "10px",
                                        borderRadius: "10px",
                                        display: 'flex',
                                        width: "300px", // Double the width
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px" }}>
                                        Quotes Accepted Cashflow
                                    </Typography>
                                    <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px" }}>
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
                                        padding: "10px",
                                        borderRadius: "10px",
                                        display: 'flex',
                                        width: "300px", // Double the width
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px" }}>
                                        Scheduled Cashflow
                                    </Typography>
                                    <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px" }}>
                                        ${quotesScheduledCashflow}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    variant="contained"
                                    sx={{
                                        flexDirection: "column",
                                        backgroundColor: "#598A96",
                                        textTransform: "none",
                                        padding: "10px",
                                        borderRadius: "10px",
                                        display: 'flex',
                                        width: "300px", // Double the width
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "16px" }}>
                                        Finished Cashflow
                                    </Typography>
                                    <Typography sx={{ color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize: "26px" }}>
                                        ${quotesFinishedCashflow}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
        
    


    function WorkOrder() {
        return (
            <Paper
                style={{
                    padding: theme.spacing(2),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.palette.primary.main,
                    width: '100%', // Ensure it occupies the full width of the parent div
                    paddingTop: '10px',
                    boxSizing: 'border-box' // Include padding in the element's total width and height
                }}>
                <MaintenanceWorkerDashboardWidget/>
            </Paper>
        )
    }
    
    
    const containerStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 5fr ', // Add the third column with 2fr width
    };

    const columnStyle = {
        backgroundColor: 'white',
        // border: '1px solid black',
        boxSizing: 'border-box' // Include padding and border in the element's total width and height
    };    


    function PaymentTable() {
        return (
            <Paper
            style={{
                padding: theme.spacing(2),
                backgroundColor: theme.palette.primary.main,
                width: '100%', // Ensure it occupies the full width of the parent div
                paddingTop: '2%',
                paddingBottom: '2%',
                paddingRight: '2%',
                paddingLeft: '3%',
                overflow: 'hidden',
            }}
            >
                
                        <Typography sx={{ 
                            color: '#160449', 
                            fontWeight: 'bold', 
                            fontSize: "35px", 
                            textAlign: 'center',
                            fontFamily: 'Inter, sans-serif', // Add the Inter font family
                            marginBottom:'1%',
                        }}>
                            Payments
                        </Typography>
                        

                    
                        {(payment_data?.MoneyToBeReceived?.result && payment_data?.MoneyToBeReceived?.result?.length) ?   
                        (   
                            <Box sx={{ marginTop: '100px' }}>
                                <Typography sx={{ 
                                    color: '#3D5CAC', 
                                    fontWeight: 'bold', 
                                    fontSize: "22px", 
                                    textAlign: 'left', // Align text to the left
                                    fontFamily: 'Source Sans Pro, sans-serif', // Use Source Sans Pro font family
                                    marginBottom: '1%',
                                }}>
                                    Outgoing
                                </Typography>
                                <DataGrid
                                    rows={payment_data['MoneyToBeReceived']?.result}
                                    columns={columnsListDesktop}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 5,
                                            },
                                        },
                                    }}
                                    getRowId={(row) => row?.purchase_uid}
                                    pageSizeOptions={[5, 10, 25, 100]}
                                    onRowClick={(row) => {
                                        console.log("Row =", row);
                                    }}
                                />
                            </Box>
                        ) : null 
                    }

                    {(payment_data?.MoneyReceived?.result && payment_data?.MoneyReceived?.result?.length) ?   
                    (   
                        <Box sx={{ marginTop: '100px' }}>
                            <Typography sx={{ 
                                color: '#3D5CAC', 
                                fontWeight: 'bold', 
                                fontSize: "22px", 
                                textAlign: 'left', // Align text to the left
                                fontFamily: 'Source Sans Pro, sans-serif', // Use Source Sans Pro font family
                                marginBottom: '1%',
                            }}>
                                Incoming
                            </Typography>
                            <DataGrid
                                rows={payment_data['MoneyReceived']?.result}
                                columns={columnsListDesktop}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 5,
                                        },
                                    },
                                }}
                                getRowId={(row) => row?.purchase_uid}
                                pageSizeOptions={[5, 10, 25, 100]}
                                onRowClick={(row) => {
                                    console.log("Row =", row);
                                }}
                            />
                        </Box>
                    ) : null 
                }

                    
                   

                
            </Paper>
        );
    }

      useEffect(() => {
        const handleResize = () => {
            // Calculate the minimum dimension of the screen
            const minDimension = Math.min(window.innerWidth, window.innerHeight);
            // Update the chart size based on the minimum dimension
            setChartSize(minDimension * 0.8); // Adjust the factor (0.8) as needed
        };

        // Add event listener for window resize
        window.addEventListener("resize", handleResize);

        // Call handleResize initially to set the initial chart size
        handleResize();

        // Cleanup function to remove event listener
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Checking if the supervisor has verified the employee
    useEffect(() => {
        if (selectedRole === 'MAINT_EMPLOYEE'){
        const emp_verification = async () => {
          try {
            const response = await fetch(`${APIConfig.baseURL.dev}/profile/${getProfileId()}`);
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            const employee = data.result[0]; // Assuming there's only one employee
            if (!employee?.employee_verification) {
              navigate('/emp_waiting')
            }
          } catch (error) {
            console.error(error);
          }
        };
    
        emp_verification();}
      }, []);



    useEffect(() => {
        
        const fetch_payment = async () => {
          try {
            // const response = await fetch(`${APIConfig.baseURL.dev}/paymentStatus/600-00003}`);
            const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentStatus/${getProfileId()}`);
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            set_payment_data(data)
            console.log('Ramin')
            console.log(data.MoneyReceived.result)
            console.log('Ramin')
          } catch (error) {
            console.error(error);
          }
        };
    
        fetch_payment();
      }, []);




    useEffect(() => {
        if (!getProfileId())
            navigate('/PrivateprofileName')

        const getMaintenanceWorkerDashboardData = async () => {
            setShowSpinner(true);
            try {
                const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/${dashboard_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',                    
                    }
                });
                
                const data = await response.json();
                set_api_data(data);

                var rejected_count = 0

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
            } catch(error) {
                console.log("Error getting maintenance worker dashboard data: ", error)
            }
            setShowSpinner(false);
        }
        getMaintenanceWorkerDashboardData()
        setRefresh(false);
    }, [])
      

    return (
        <ThemeProvider theme={theme}>
          <Container maxWidth="lg" sx={{ paddingTop: '10px', paddingBottom: '50px' }}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: isMobile ? "center" : "left",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    alignText: "center",
                    alignContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "22px", sm: "28px", md: "32px" },
                      fontWeight: "600",
                    }}
                  >
                    Welcome, {user.first_name}.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                {WorkOrder()}
              </Grid>
              <Grid item xs={12} md={9}>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    {Chart()}
                  </Grid>
                  <Grid item xs={12}>
                    {PaymentTable()}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </ThemeProvider>
      );
      
           
}