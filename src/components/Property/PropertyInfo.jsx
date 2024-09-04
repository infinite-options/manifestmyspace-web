import { useState, useEffect } from "react";
import theme from "../../theme/theme";
import { ThemeProvider, Box, Paper, Stack, Typography, Button, ButtonGroup, Rating, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { CheckCircle, ExpandMore, LocationOn, SettingsBackupRestore, TurnedInNot } from "@mui/icons-material";
import { DateCalendar, DigitalClock, LocalizationProvider } from "@mui/x-date-pickers";
import Scheduler from "../utils/Scheduler";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ReactImageGallery from "react-image-gallery";
import { useNavigate, useLocation } from "react-router-dom";
import backButton from "../Payments/backIcon.png";
import { set } from "date-fns";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { DataGrid } from '@mui/x-data-grid';

import PropertiesMap from "../Maps/PropertiesMap";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("America/Los_Angeles");

const PropertyInfo = (props) => {
  console.log("props in info", props);
  const location = useLocation();
  const navigate = useNavigate();
  const index = props.index;
  const property = props.data;
  console.log("ROHIT - PropertyInfo - property - ",property )
  const status = props.status;
  const lease = props.lease;
  // const ppt_images = property.property_images.split(",");
  const ppt_images = property.property_images? JSON.parse(property.property_images) : [];
  const [showScheduler, setShowScheduler] = useState(false);
  const [schedulerDate, setSchedulerDate] = useState();
  const [buttonColor, setButtonColor] = useState("#3D5CAC");
  console.log("Property: ", property);
  console.log("Status: ", status);

  const [showRejectApplicationDialog, setshowRejectApplicationDialog] = useState(false);

  const [ tab, setTab ] = useState("photos")

  useEffect(() => {
    window.scrollTo(0, 0);

    if (status === "") {
      setButtonColor("#3D5CAC");
    } else if (status === "NEW") {
      setButtonColor("#3D5CAC");
    } else if (status === "PROCESSING") {
      setButtonColor("#7AD15B");
    } else if (status === "TENANT APPROVED") {
      setButtonColor("#7AD15B");
    } /* else if (status === "REJECTED") {
      setButtonColor("#490404"); 
    } */ else if (status === "REFUSED") {
      // setButtonColor("#CB8E8E")
      setButtonColor("#3D5CAC");
    } else if (status === "ACTIVE") {
      setButtonColor("#412591");
    }
  }, []);

  const listed_rent = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(property.property_listed_rent);

  const deposit = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(property.property_deposit);

  const otherFees = property.contract_fees ? JSON.parse(property.contract_fees) : [];

  const utilities = property.property_utilities ? JSON.parse(property.property_utilities) : [];  

  console.log("ROHIT - utilities - ", utilities);

  function parseImageData(data) {
    if (data === undefined) {
      return;
    }
    const s = data.indexOf("http");
    const l = data.indexOf('"', s);
    const imageString = data.slice(s, l);
    return imageString;
  }

  // const images = ppt_images.map((data) => {
  //   try {
  //     const url = parseImageData(data);
  //     return { original: url };
  //   } catch (e) {
  //     console.error(e);
  //     return { original: "" };
  //   }
  // });

  const images = ppt_images;

  function displayListingDate(date) {
    if (date === null) {
      return "No Listing Date";
    } else {
      const d = dayjs(date);

      const daysAgo = dayjs().diff(d, "day");
      if (daysAgo === 0) {
        return "Listed today";
      } else if (daysAgo === 0) {
        return "Listed today";
      } else if (daysAgo === 1) {
        return "Listed yesterday";
      } else {
        return "Listed " + daysAgo + " days ago";
      }
    }
  }

  function renderCorrectButtonText() {
    if (status === "" || status === "WITHDRAWN" || status === "ENDED" || status === "REFUSED" || status === "RESCIND" || status === "REJECTED") {
      return "Apply Now";
    } else if (status === "NEW") {
      return "View Application";
    } else if (status === "PROCESSING") {
      return "Approved";
    } else if (status === "TENANT APPROVED") {
      return "Approved WFD";
    } /* else if (status === "REJECTED") {
      return "Not Approved";
    } */ else if (status === "ACTIVE") {
      return "Active";
    }
  }

  function navigateToCorrectPage() {
    if (status === "" || status === "NEW" || status === "WITHDRAWN" || status === "ENDED" || status === "REFUSED" || status === "RESCIND") {
      //navigate("/tenantApplication", { state: { property: property, status: status, lease: lease } });
      props.setRightPane({
        type: "tenantApplication",
        state: { data: property, status: status, lease: lease, from: 'PropertyInfo' },
      });
    } else if (status === "REJECTED") {
      setshowRejectApplicationDialog(true);
    } else if (status === "TENANT APPROVED" || status === "PROCESSING") {
      //navigate("/tenantLeases", { state: { property: property, status: status, lease: lease } });
      props.setRightPane({
        type: "tenantApplication",
        state: { data: property, status: status, lease: lease, from: 'PropertyInfo' },
      });
    } else {
      return null;
    }
  }

  function navigateToRejectPage() {
    //navigate("/tenantApplication", { state: { property: property, status: status, lease: lease } });
    props.setRightPane({
      type: "tenantApplication",
      state: { data: property, status: status, lease: lease, from: 'PropertyInfo' },
    });
  }

  function formatAddress() {
    if (property.property_unit !== "") {
      return property.property_address + " Unit " + property.property_unit;
    }
    return property.property_address;
  }

  const imageStyle = {
    height: '400px', // Set the desired height
    objectFit: 'cover', // Ensures the image covers the container without stretching
  };

  const getFormattedFeeFrequency = (frequency) => {
    // console.log("getFormattedFeeFrequency(), frequency", frequency);
    let freq = "";
    switch (frequency) {
      case "one_time":
        freq = "One Time";
        break;
      case "One Time":
        freq = "One Time";
        break;
      case "hourly":
        freq = "Hourly";
        break;
      case "daily":
        freq = "Daily";
        break;
      case "weekly":
        freq = "Weekly";
        break;
      case "bi-weekly":
        freq = "Bi-weekly";
        break;
      case "biweekly":
        freq = "Bi-weekly";
        break;
      case "monthly":
        freq = "Monthly";
        break;
      case "Monthly":
        freq = "Monthly";
        break;
      case "annually":
        freq = "Annual";
        break;
      case "Annually":
        freq = "Annual";
        break;
      default:
        freq = "<FREQUENCY>";
    }
    return freq;
  };

  return (
    <ThemeProvider theme={theme}>
      <Scheduler show={showScheduler} setShow={setShowScheduler} date={schedulerDate} setDate={setSchedulerDate} />      
        <Box component='span' display='flex' justifyContent='center' alignItems='center' position='relative'>
          <Button
            onClick={() => props.setRightPane({ type: "listings" })}
            sx={{
              textTransform: "none",
              padding: "10px 10px 0px 10px",
              textDecoration: "underline",
              position: "relative",
            }}
          >
            <img src={backButton} style={{ width: "20px", height: "20px", margin: "0 5px" }} />
            <Typography
              sx={{
                justifySelf: "center",
                color: theme.typography.primary.black,
                fontWeight: theme.typography.medium.fontWeight,
                fontSize: theme.typography.smallFont,
                textAlign: "center",
              }}
            >
              <u>Return to All Listings</u>
            </Typography>
          </Button>
        </Box>
        <Box
          style={{
            display: "flex",
            fontFamily: "Source Sans Pro",
            justifyContent: "center",
            width: "100%",
            minHeight: "90vh",
            marginTop: theme.spacing(2), // Set the margin to 20px
          }}
        >
          <Paper
            sx={{
              // margin: "15px 30px 30px",
              // padding: "15px",
              paddingTop: "0px",
              backgroundColor: theme.palette.primary.main,
              width: "100%", // Occupy full width with 25px margins on each side
              // [theme.breakpoints.down("sm")]: {
              //   width: "80%",
              // },
              // [theme.breakpoints.up("sm")]: {
              //   width: "50%",
              // },
            }}
          >
            <Stack sx={{padding: '5px', }}>
              <Stack
                direction='row'
                justifyContent={"space-between"}
                sx={{
                  color: theme.typography.common.blue,
                }}
              >
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                    fontWeight: theme.typography.primary.fontWeight,
                    fontSize: "25px",
                  }}
                >
                  {formatAddress()}
                </Typography>
                <Box>
                  <LocationOn /> <TurnedInNot />
                </Box>
              </Stack>
              <Typography
                sx={{
                  color: theme.typography.primary.black,
                  fontSize: "18px",
                }}
              >
                {property.property_city + ", " + property.property_state + " " + property.property_zip}
              </Typography>
              <Typography
                sx={{
                  color: theme.typography.primary.black,
                  fontSize: "18px",
                }}
              >
                {property.property_uid}
              </Typography>
            </Stack>
            <Stack alignItems='center' justifyContent='center' spacing={5} sx={{ padding: "20px" }}>
              <Box
                sx={{
                  background: "#9EAED666",
                  borderRadius: "10px",
                }}
              >
                <ButtonGroup variant='outlined'>
                  <Button
                    sx={{ 
                      color: tab === "photos" ? '#F2F2F2' : theme.typography.common.blue,
                      fontWeight: 'bold',
                      backgroundColor: tab === "photos" ? '#160449' : '#97A7CF'
                    }}
                    onClick={() => setTab("photos")}                  
                  >
                    Photos
                  </Button>
                  <Button
                    sx={{ 
                      color: theme.typography.common.blue,
                      fontWeight: 'bold',
                      backgroundColor: "#A9A9A9",
                      "&:hover": {
                        backgroundColor: "#A9A9A9",
                      }
                    }}
                    // onClick={() => setTab("video")}
                    disableRipple
                  >
                    Video
                  </Button>
                  <Button
                    sx={{ 
                      color: tab === "map" ? '#F2F2F2' : theme.typography.common.blue,
                      fontWeight: 'bold',
                      backgroundColor: tab === "map" ? '#160449' : '#97A7CF'
                    }}
                    onClick={() => setTab("map")}
                  >
                    Map
                  </Button>
                </ButtonGroup>
              </Box>
            </Stack>
            {
              tab === "photos" && (
                // <ReactImageGallery 
                //   items={images}
                //   showFullscreenButton={false}
                //   showPlayButton={false}
                //   showThumbnails={false} 
                //   renderItem={(item) => (
                //     <div style={{ height: '400px' }}>
                //       <img src={item.original} style={imageStyle} alt="" />
                //     </div>
                //   )}
                // />              
                images.length > 0 ? (
                  <ReactImageGallery 
                    items={images}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    showThumbnails={false} 
                    renderItem={(item) => (
                      <div style={{ height: '400px' }}>
                        <img src={item.original? item.original : item} style={imageStyle} alt="" />
                      </div>
                    )}
                  />
                ) : (
                  <div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p>No images available</p>
                  </div>
                )
              )
            }
            {
              tab === "video" && (
                <Box sx={{height: '400px', }}>

                </Box>
              )
            }                    
            {            
              tab === "map" && (              
                <Box sx={{height: '400px', }}>
                  <Stack sx={{ padding: 5 }}>
                    <PropertiesMap properties={[property]} mapCenter={{lat: parseFloat(property.property_latitude),lng: parseFloat(property.property_longitude),}} />
                  </Stack>
                </Box>
              )
            }                    
            <Stack
              direction='row'
              justifyContent='space-between'
              sx={{
                color: theme.typography.common.blue,
                marginTop: "10px",
                paddingRight: '5px',
              }}
            >
              <Box>
                <Stack
                  direction='row'
                  sx={{
                    color: theme.palette.primary.lightYellow,
                  }}
                >
                  <Rating name='read-only' precision={0.5} value={5} />
                  <Typography
                    sx={{
                      color: theme.typography.common.blue,
                    }}
                  >
                    (2)
                  </Typography>
                </Stack>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: theme.typography.common.blue,
                    fontsize: theme.typography.smallFont,
                  }}
                >
                  {displayListingDate(property.property_listed_date)}
                </Typography>
              </Box>
            </Stack>
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              sx={{
                color: theme.typography.common.blue,
                padding: "5px",
              }}
            >
              <Stack
                direction='column'
                // justifyContent='space-between'
                // alignItems='center'
                // sx={{
                //   color: theme.typography.common.blue,
                //   padding: "15px 0",
                // }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  <strong>Rent: {listed_rent}</strong> Per Month
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  <strong>Deposit: {deposit}</strong>
                </Typography>
                {/* <Typography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  <strong>Other Fees:</strong>
                </Typography>
                <Box                                
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '10px',
                  }}                    
                >   
                {
                  otherFees?.map((fee, index) => (
                    <Box
                      key={index}
                      // FeeIndex={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}                    
                    >                    
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box>
                          <strong>
                          {getFormattedFeeFrequency(fee.frequency)} {fee.fee_name}:{' '}
                          </strong>
                          {fee.fee_type === 'PERCENT' ? `${fee.charge}% of ${fee.of}` : ` $${fee.charge}`}
                          
                        </Box>                            
                      </Box>
                    </Box>
                  ))
                }   
                </Box> */}
              </Stack>         
              <Button
                variant='contained'
                sx={{
                  background: buttonColor,
                  color: theme.palette.background.default,
                  textTransform: "none",
                }}
                onClick={() => navigateToCorrectPage()}
              >
                {renderCorrectButtonText()}
              </Button>
            </Stack>
            <Stack justifyContent='space-between' alignItems='center' direction='row' sx={{ margin: "5px 10px" }}>
              {property.property_pets_allowed > 0 ? (
                <Stack justifyContent='center' alignItems='center' sx={{ margin: "5px" }}>
                  <Typography
                    sx={{
                      color: "#7AD15B",
                      fontWeight: theme.typography.primary.fontWeight,
                      fontSize: "16px",
                    }}
                  >
                    <CheckCircle />
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,

                      fontSize: "12px",
                    }}
                  >
                    Pet Friendly
                  </Typography>
                </Stack>
              ) : (
                <></>
              )}
              <Stack justifyContent='center' alignItems='center' sx={{ margin: "5px 10px" }}>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                    fontWeight: theme.typography.primary.fontWeight,
                    fontSize: "15px",
                  }}
                >
                  {property.property_type}
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,

                    fontSize: "12px",
                  }}
                >
                  Type
                </Typography>
              </Stack>
              <Stack justifyContent='center' alignItems='center' sx={{ margin: "5px 10px" }}>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                    fontWeight: theme.typography.primary.fontWeight,
                    fontSize: "15px",
                  }}
                >
                  {property.property_num_beds}
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,

                    fontSize: "12px",
                  }}
                >
                  Bed
                </Typography>
              </Stack>
              <Stack justifyContent='center' alignItems='center' sx={{ margin: "5px 10px" }}>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                    fontWeight: theme.typography.primary.fontWeight,
                    fontSize: "15px",
                  }}
                >
                  {property.property_num_baths}
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,

                    fontSize: "12px",
                  }}
                >
                  Bath
                </Typography>
              </Stack>
              <Stack justifyContent='center' alignItems='center' sx={{ margin: "5px 10px" }}>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                    fontWeight: theme.typography.primary.fontWeight,
                    fontSize: "15px",
                  }}
                >
                  {property.property_area}
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                    fontSize: "12px",
                  }}
                >
                  Sq Ft
                </Typography>
              </Stack>
            </Stack>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: "white" }} />}
                sx={{
                  backgroundColor: "#97A7CF",
                  boxShadow: "none",
                  color: "#FFF",
                  padding: "10px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  Schedule a Tour
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: "10px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack direction='row' justifyContent='space-between'>
                    <DateCalendar />
                    <DigitalClock timeStep={60} disablePast sx={{ width: "50%" }} />
                  </Stack>
                  <Box justifyContent='center' alignItems='center'>
                    <Button
                      variant='contained'
                      fullWidth
                      sx={{
                        backgroundColor: "#97A7CF",
                        color: theme.palette.background.default,
                      }}
                      onClick={() => setShowScheduler(true)}
                    >
                      Schedule
                    </Button>
                  </Box>
                </LocalizationProvider>
              </AccordionDetails>
            </Accordion>
            <Stack justifyContent='flex-start' spacing={2} sx={{ marginTop: "20px", marginLeft: '5px', }}>
              <Typography
                sx={{
                  fontWeight: theme.typography.primary.fontWeight,
                  color: theme.typography.primary.black,
                }}
              >
                Description
              </Typography>
              <Typography sx={{ textAlign: "justify" }}>{property.property_description}</Typography>                                    
            </Stack>
            <Stack>
              <Box sx={{ marginTop: "20px",  marginLeft: '5px',  }}>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  Apartment Amenities
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                  }}
                >
                  {property.property_amenities_unit}
                </Typography>
              </Box>
              <Box sx={{ marginTop: "20px",  marginLeft: '5px', }}>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  Community Amenities
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                  }}
                >
                  {property.property_amenities_community}
                </Typography>
              </Box>
              <Box sx={{ marginTop: "20px", marginLeft: '5px',  }}>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  Utilities
                </Typography>
                <UtilitiesDataGrid data={utilities}/>
              </Box>
              <Box sx={{ marginTop: "20px", marginLeft: '5px',  }}>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  Location
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                  }}
                >
                  {formatAddress() + ", " + property.property_city + ", " + property.property_state + " " + property.property_zip}
                </Typography>
              </Box>
              <Box sx={{ marginTop: "20px", marginLeft: '5px',  }}>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                    fontWeight: theme.typography.primary.fontWeight,
                  }}
                >
                  Places Nearby
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.primary.black,
                  }}
                >
                  {property.property_amenities_nearby}
                </Typography>
              </Box>
            </Stack>
            {showRejectApplicationDialog && (
              <Dialog
                open={showRejectApplicationDialog}
                onClose={() => setshowRejectApplicationDialog(false)}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
              >
                <DialogContent>
                  <DialogContentText
                    id='alert-dialog-description'
                    sx={{
                      fontWeight: theme.typography.common.fontWeight,
                      paddingTop: "10px",
                    }}
                  >
                    Have you contacted property manager of {property.property_address} {property.property_unit} regarding reason for initial rejection?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      onClick={() => navigateToRejectPage()}
                      sx={{
                        color: "white",
                        backgroundColor: "#3D5CAC80",
                        ":hover": {
                          backgroundColor: "#3D5CAC",
                        },
                        marginRight: "10px",
                      }}
                      autoFocus
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={() => setshowRejectApplicationDialog(false)}
                      sx={{
                        color: "white",
                        backgroundColor: "#3D5CAC80",
                        ":hover": {
                          backgroundColor: "#3D5CAC",
                        },
                        marginLeft: "10px",
                      }}
                    >
                      No
                    </Button>
                  </Box>
                </DialogActions>
              </Dialog>
            )}
          </Paper>
        </Box>      
    </ThemeProvider>
  );
};



const UtilitiesDataGrid = ({ data }) => {
  const utilityPayerMap = {
    "050-000041": "owner",
    "050-000042": "property manager",
    "050-000043": "tenant",
    "050-000049": "user",
  };

  const columns = [
    {
      field: 'utility_desc',
      headerName: 'Utility',
      flex: 1,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'utility_payer_id',
      headerName: 'Paid By',
      flex: 1,
      renderCell: (params) => utilityPayerMap[params.value] || '-',
    },    
  ];
  return (          
      <DataGrid
        rows={data}
        columns={columns}
        // pageSize={5}
        // rowsPerPageOptions={[5]}
        disableSelectionOnClick
        getRowId={(row) => row.utility_type_id}
        hideFooter={true}
      />    
  );
}

export default PropertyInfo;
