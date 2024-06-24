import { Chart } from "react-google-charts";
import { 
    Button, 
    Box, 
    ThemeProvider, 
    Grid,
    Paper,
    Stack,
    Typography,
    Container,
} from '@mui/material';
import { RadialBarChart, RadialBar, Legend, LabelList } from 'recharts';
import MaintenanceWidget from "../Dashboard-Components/Maintenance/MaintenanceWidget";
import "../../css/maintenance.css";
import { useNavigate, useLocation } from "react-router-dom";
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
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactComponent as HomeIcon } from "../../images/home_icon.svg";
import { ReactComponent as CalendarIcon } from "../../images/calendar_icon.svg";
import WorkerMaintenanceStatusTable from "../Maintenance/Worker/WorkerMaintenanceStatusTable";

import APIConfig from "../../utils/APIConfig";


export default function MaintenanceDashboard2(){
    const { user, getProfileId, selectedRole } = useUser();     
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isMedium = useMediaQuery(theme.breakpoints.down("md"));

    const [showSpinner, setShowSpinner] = useState(false);


    return (
        <ThemeProvider theme={theme}>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
            <CircularProgress color="inherit" />
          </Backdrop>
    
          <Container maxWidth="lg" sx={{ paddingTop: "10px", paddingBottom: "50px" }}>
            <Grid container rowSpacing={2} columnSpacing={10}>
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
              <Grid item xs={12} md={4}>
                <WorkOrdersWidget />
              </Grid>
    
              <Grid container item xs={12} md={8} columnSpacing={6} rowGap={4}>
                <Grid item xs={12} sx={{ backgroundColor: '#F2F2F2', borderRadius: '10px', }}>
                  Current Activity Graph
                </Grid>                
                <Grid item xs={12} sx={{ backgroundColor: '#F2F2F2', borderRadius: '10px', }}>
                  Revenue
                </Grid>                
              </Grid>
            </Grid>
          </Container>                    
        </ThemeProvider>
    );
};

const WorkOrdersWidget = () => {
    // console.log("In WorkOrdersWidget");
    // const navigate = useNavigate();    
  
    // const { user, getProfileId } = useUser();
    const [showSpinner, setShowSpinner] = useState(false);
    
  
    return (
      <ThemeProvider theme={theme}>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
          <CircularProgress color="inherit" />
        </Backdrop>        
        <Container sx={{ height: "100%", backgroundColor: "#F2F2F2", borderRadius: "10px", padding: '5px', }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}            
          >
            <Grid container item xs={12} rowSpacing={0} sx={{ marginTop: "15px" }}>
              <Stack direction="row" justifyContent="center" width="100%" sx={{ marginBottom: "0px" }}>
                {/* <Typography sx={{ color: theme.typography.primary.black, fontWeight: "800", fontSize: "24px", }}> */}
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#160449" }}>
                  Work Orders
                </Typography>
              </Stack>
              <Grid item container xs={12}>
                <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
                  <Button
                    variant="outlined"
                    id="revenue"
                    // className={classes.button}
                    style={{
                      // height: "100%",
                      // width: '80%',
                      // backgroundColor: '#160449',
                      color: "#3D5CAC",
                      fontSize: "13px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                    }}
                    onClick={() => {
                      // navigate(propertyRoutingBasedOnSelectedRole());
                    }}
                  >
                    <CalendarIcon stroke="#3D5CAC" width="20" height="20" style={{ marginRight: "4px" }} />
                    Last 30 days
                  </Button>
                </Grid>
                <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-start" }}>
                  <Button
                    variant="outlined"
                    id="revenue"
                    // className={classes.button}
                    style={{
                      // height: "100%",
                      // width: '80%',
                      // backgroundColor: '#160449',
                      color: "#3D5CAC",
                      fontSize: "13px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                    }}
                    // onClick={handleSelectPropertyClick}
                  >
                    <HomeIcon fill="#3D5CAC" width="15" height="15" style={{ marginRight: "4px" }} />
                    Select Property
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <WorkOrdersAccordion />
              </Grid>
              <Grid item xs={12} sx={{padding: '20px 0px 20px 0px', }}>
                <Paper
                  elevation={0}
                  style={{
                    
                    borderRadius: "5px",
                    backgroundColor: "#FFFFFF",
                    height: 240,
                    // marginTop: '20px',
                    width: '90%',
                    margin: 'auto',
                    // margin: '20px 0px 0px 0px',

                    // [theme.breakpoints.down("sm")]: {
                    //   width: "80%",
                    // },
                    // [theme.breakpoints.up("sm")]: {
                    //   width: "50%",
                    // },
                  }}                  
                >
                  <Grid item xs={12}>                    
                    <Typography align="center" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#160449', }}>
                      Work Orders Today
                    </Typography>
                  </Grid>
                </Paper>
              </Grid>             
            </Grid>            
          </Grid>
        </Container>
        {/* </div> */}
      </ThemeProvider>
    );
  }
  
  const WorkOrdersAccordion = () => {
    const colorStatus = theme.colorStatusMM;

    const [showSpinner, setShowSpinner] = useState(false);
    const { getProfileId } = useUser();
    const [maintenanceRequests, setMaintenanceRequests] = useState({});
    const [query, setQuery] = useState("");

    useEffect(() => {
      const dataObject = {};
  
      const getMaintenanceData = async () => {
          setShowSpinner(true);
          const maintenanceRequests1 = await fetch(`${APIConfig.baseURL.dev}/dashboard/600-000012`);
          const maintenanceRequestsData1 = await maintenanceRequests1.json();
          console.log('---maintenanceRequestsData1--', maintenanceRequestsData1);
  
          // Assuming the new API structure
          let currentQuotes = maintenanceRequestsData1.CurrentQuotes?.result ?? [];
  
          console.log('---currentQuotes--', currentQuotes);


          const categorizeData = (data) => {
            console.log('----is it in categorize data----');
              const categorizedData = {
                  REQUESTED: [],
                  SUBMITTED: [],
                  ACCEPTED: [],
                  SCHEDULED: [],
                  FINISHED: [],
                  PAID: [],
              };
  
              data.forEach(item => {
                  const status = item.maintenance_status || item.quote_status || "REQUESTED"; // Default to "REQUESTED" if status not found
                  if (categorizedData[status]) {
                      categorizedData[status].push(item);
                  }
              });
  
              console.log('----return categorize data----', categorizedData);
              return categorizedData;
          };
  
          const categorizedCurrentQuotes = categorizeData(currentQuotes);
          console.log('---categorizedCurrentQuotes---', categorizedCurrentQuotes);
  
          dataObject["REQUESTED"] = categorizedCurrentQuotes.REQUESTED;
          dataObject["SUBMITTED"] = categorizedCurrentQuotes.SUBMITTED;
          dataObject["ACCEPTED"] = categorizedCurrentQuotes.ACCEPTED;
          dataObject["SCHEDULED"] = categorizedCurrentQuotes.SCHEDULED;
          dataObject["FINISHED"] = categorizedCurrentQuotes.FINISHED;
          dataObject["PAID"] = categorizedCurrentQuotes.PAID;
  
          setMaintenanceRequests((prevData) => ({
              ...prevData,
              ...dataObject,
          }));
          setShowSpinner(false);
      };
  
      getMaintenanceData();
  }, []);
  

      function handleFilter(filterString, searchArray) {
        let filteredArray = [];
        if (filterString === "All" || filterString === "") {
          filteredArray = searchArray;
        } else {
          filteredArray = searchArray.filter((item) => item.maintenance_title === filterString);
        }
        return filteredArray;
      }

    return (
        <>
            <Grid item xs={12} sx={{width: '90%', margin: 'auto',}}>
                {colorStatus.map((item, index) => {
                    let mappingKey = item.mapping;
                    console.log('---mappingKey----', mappingKey);
                    console.log('---maintenanceRequests----',maintenanceRequests);

                    let maintenanceArray = maintenanceRequests[mappingKey] || [];

                    console.log('---maintenanceArray----', maintenanceArray);

                    let filteredArray = handleFilter(query, maintenanceRequests[mappingKey]);
                    // console.log("[DEBUG] MaintenanceWorkerDashboardWidget.jsx before MaintenanceStatusTable01")

                    return (
                    <WorkerMaintenanceStatusTable
                        key={index}
                        status={item.status}
                        color={item.color}
                        maintenanceItemsForStatus={maintenanceArray}
                        allMaintenanceData={maintenanceRequests}
                        maintenanceRequestsCount={maintenanceArray}
                    />
                    );
                })}
            </Grid>
        </>
    )
  }