import { 
  Button, 
  Box, 
  ThemeProvider, 
  Grid,
  Paper,
  Stack,
  Typography,
  Container,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { ReactComponent as HomeIcon } from "../../images/home_icon.svg";
import { ReactComponent as CalendarIcon } from "../../images/calendar_icon.svg";
import { useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";
import theme from "../../theme/theme";
import { useUser } from "../../contexts/UserContext";
import APIConfig from "../../utils/APIConfig";
import Chart from 'react-apexcharts';
import WorkerMaintenanceStatusTable from "../Maintenance/Worker/WorkerMaintenanceStatusTable";

export default function MaintenanceDashboard2() {
  const { user } = useUser();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showSpinner, setShowSpinner] = useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState({});
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
      const getMaintenanceData = async () => {
          setShowSpinner(true);
          const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/600-000012`);
          const data = await response.json();

          const currentActivities = data.CurrentActivities?.result ?? [];
          const currentgraphData = [];
          currentActivities.map(item => {
              const statusMapping = theme.colorStatusMM.find(statusObj => statusObj.mapping === item.maintenance_status);
              if (statusMapping) {
                currentgraphData.push( {
                      value: item.num,
                      label: statusMapping.status,
                      color: statusMapping.color
                  });
              }
              return null;
          }).filter(item => item !== null);

          const maintainance_info = {
              REQUESTED: [],
              SUBMITTED: [],
              ACCEPTED: [],
              SCHEDULED: [],
              FINISHED: [],
              PAID: [],
          };

          currentActivities.forEach(item => {
              const status = item.maintenance_status;
              if (maintainance_info[status]) {
                  const maintenanceInfo = JSON.parse(item.maintenance_request_info);
                  const mergedItems = maintenanceInfo.map(info => ({
                      maintenance_status: status,
                      ...info
                  }));
                  maintainance_info[status].push(...mergedItems);
              }
          });

          await setMaintenanceRequests(maintainance_info);
          await setGraphData(currentgraphData);
          console.log('----graph data---', graphData);
          setShowSpinner(false);
      };

      getMaintenanceData();
  }, []);

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
                      <WorkOrdersWidget maintenanceRequests={maintenanceRequests}/>
                  </Grid>
                  <Grid container item xs={12} md={8} columnSpacing={6} rowGap={4}>
                      <Grid item xs={12} sx={{ backgroundColor: '#F2F2F2', borderRadius: '10px', }}>
                          Current Activity Graph
                          <RadialBarChart data={graphData}></RadialBarChart>
                          
                      </Grid>
                      <Grid item xs={12} sx={{ backgroundColor: '#F2F2F2', borderRadius: '10px', }}>
                          Revenue
                      </Grid>
                  </Grid>
              </Grid>
          </Container>
      </ThemeProvider>
  );
}


const WorkOrdersWidget = ({ maintenanceRequests }) => {
  const [showSpinner, setShowSpinner] = useState(false);

  return (
      <ThemeProvider theme={theme}>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
              <CircularProgress color="inherit" />
          </Backdrop>
          <Container sx={{ height: "100%", backgroundColor: "#F2F2F2", borderRadius: "10px", padding: '5px', }}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid container item xs={12} rowSpacing={0} sx={{ marginTop: "15px" }}>
                      <Stack direction="row" justifyContent="center" width="100%" sx={{ marginBottom: "0px" }}>
                          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#160449" }}>
                              Work Orders
                          </Typography>
                      </Stack>
                      <Grid item container xs={12}>
                          <Grid item xs={6} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
                              <Button
                                  variant="outlined"
                                  id="revenue"
                                  style={{
                                      color: "#3D5CAC",
                                      fontSize: "13px",
                                      marginBottom: "10px",
                                      borderRadius: "5px",
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
                                  style={{
                                      color: "#3D5CAC",
                                      fontSize: "13px",
                                      marginBottom: "10px",
                                      borderRadius: "5px",
                                  }}
                              >
                                  <HomeIcon fill="#3D5CAC" width="15" height="15" style={{ marginRight: "4px" }} />
                                  Select Property
                              </Button>
                          </Grid>
                      </Grid>
                      <Grid item xs={12}>
                          <WorkOrdersAccordion maintenanceRequests={maintenanceRequests} />
                      </Grid>
                      <Grid item xs={12} sx={{ padding: '20px 0px 20px 0px', }}>
                          <Paper
                              elevation={0}
                              style={{
                                  borderRadius: "5px",
                                  backgroundColor: "#FFFFFF",
                                  height: 240,
                                  width: '90%',
                                  margin: 'auto',
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
      </ThemeProvider>
  );
}

  
const WorkOrdersAccordion = ({ maintenanceRequests }) => {
  const colorStatus = theme.colorStatusMM;
  const [query, setQuery] = useState("");

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
          <Grid item xs={12} sx={{ width: '90%', margin: 'auto', }}>
              {colorStatus.map((item, index) => {
                  let mappingKey = item.mapping;
                  let maintenanceArray = maintenanceRequests[mappingKey] || [];
                  let filteredArray = handleFilter(query, maintenanceRequests[mappingKey]);

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
  );
}

const RadialBarChart = ({ data }) => {
  const originalValues = data.map(d => d.value);

  const maxSeriesValue = Math.max(...data.map(d => d.value));
  const series = data.map(d => (d.value / maxSeriesValue) * 100 );
  const labels = data.map(d => d.label);
  const colors = data.map(d => d.color);

  const options = {
    series: series,
    chart: {
      height: 390,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '30%',
          background: 'transparent',
          image: undefined,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
        barLabels: {
          enabled: true,
          useSeriesColors: true,
          margin: 8,
          fontSize: '10px',
          formatter: function(seriesName, opts) {
            return seriesName + ":  " + originalValues[opts.seriesIndex]
          },
        },
      },
    },
    colors: colors,
    labels: labels,
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          show: false,
        },
      },
    }],
  };

  return (
    <div id="chart" className="radial-bar-chart">
      <Chart options={options} series={series} type="radialBar" height={390} />
    </div>
  );
};