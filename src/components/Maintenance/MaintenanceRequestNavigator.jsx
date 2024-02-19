import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Button, Box, Stack, Paper, Grid } from "@mui/material";
import theme from "../../theme/theme";
import maintenanceRequestImage from "./maintenanceRequest.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import CreateIcon from '@mui/icons-material/Create';

import QuotesTable from "./MaintenanceComponents/QuotesTable";


function getInitialImages(requestData, currentIndex) {
  try {
    if (requestData[currentIndex] && requestData[currentIndex].maintenance_images && requestData[currentIndex].maintenance_images !== "[]") {
      const parsedData = JSON.parse(requestData[currentIndex].maintenance_images);
      return parsedData;
    }
  } catch (error) {
    console.error("Error parsing maintenance_images:", error);
  }
  return [maintenanceRequestImage];
}

export default function MaintenanceRequestNavigator({ requestIndex, backward_active_status, forward_active_status, updateRequestIndex, requestData, color, item, allData, maintenanceQuotes, currentTabValue, status, tabs  }) {
  const [currentIndex, setCurrentIndex] = useState(requestIndex);
  
  const [activeStep, setActiveStep] = useState(0);
  const [formattedDate, setFormattedDate] = useState("");
  const [numOpenRequestDays, setNumOpenRequestDays] = useState("");
  const [images, setImages] = useState([maintenanceRequestImage]);
  let [currentTab, setCurrentTab]=useState(currentTabValue);
  
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  // const [propertyId, setPropertyId] = useState("200-000029")
  
  // const [maxSteps, setMaxSteps] = useState(images.length);
  const navigate = useNavigate();

  function navigateToEditMaintenanceItem(testIssue, testProperty, testIssueItem, testCost, testTitle, testPriority, completionStatus, requestUid, propID){
    // console.log("navigateToAddMaintenanceItem")
    console.log("testTitle>>",(testTitle))
    console.log("testCost>>",(testCost))
    navigate('/editMaintenanceItem', {state: {testIssue, testProperty, testIssueItem, testCost, testTitle, testPriority, completionStatus, requestUid, propID, month, year}})
  }


//   console.log("--debug-- In MaintenanceRequestNavigator now")
  useEffect(() => {
    const initialImages = getInitialImages(requestData, currentIndex);
    setImages(initialImages);
    setActiveStep(0);

  }, [currentIndex]);

  const maxSteps = images.length;


  const handleNextCard = () => {
      
      setCurrentIndex((prevIndex) => {
          let newIndex = (prevIndex + 1);
          if(prevIndex < requestData.length-1){
            
            let nextMaintenanceId = requestData[newIndex].maintenance_request_uid;

            updateRequestIndex(newIndex, {changeTab:'noChange'})
            return newIndex;
          }
          else{
            updateRequestIndex(newIndex, {changeTab:'forward'});
            return newIndex;
          }
      });
  };

  const handlePreviousCard = () => {
    setCurrentIndex((prevIndex) => {
      let newIndex = (prevIndex - 1);
      if(prevIndex > 0){
        let nextMaintenanceId = requestData[newIndex].maintenance_request_uid;
        updateRequestIndex(newIndex, {changeTab:'noChange'})
        return newIndex;
      }
      else {
        if (newIndex === -1){
          newIndex = 1
        }
        updateRequestIndex(newIndex, {changeTab:'backward'});
        return newIndex;
      }
  });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  function formatDate(date) {
    let formattedDate = "";
    let openTime = "";
    if (date) {
      const postDate = new Date(date);
      let currentDate = new Date();
      formattedDate = postDate.toLocaleDateString();
      const diffInMilliseconds = currentDate.getTime() - postDate.getTime();
      openTime = Math.floor(diffInMilliseconds / (1000 * 3600 * 24));
    }
    // console.log("formattedDate", formattedDate, "openTime", openTime);
    setNumOpenRequestDays(openTime);
    setFormattedDate(formattedDate);
  }

  const data = requestData[currentIndex];


  let propertyAddress = " "
  propertyAddress = propertyAddress.concat(" ", (data?.property_address), " ",  (data?.property_city)," ", (data?.property_state), " ", (data?.property_zip))
  // console.log("propertyAddress",typeof(propertyAddress))

  let estimatedCost = " "
  estimatedCost = estimatedCost.concat(" ", (data?.maintenance_estimated_cost ? data?.maintenance_estimated_cost : "Not reported"))
  // console.log("estimatedCost>>",typeof(estimatedCost))

  let completionStatus = "no"
  if (data?.maintenance_request_status == "Completed" || data?.maintenance_request_status == "Closed") {
    // console.log("inside ifffff", data?.maintenance_request_status)
    completionStatus = "yes"
  }
  else {
    // console.log(data?.maintenance_request_status)
    completionStatus = "no"
    // console.log(completionStatus)
  }
  

  useEffect(() => {
    formatDate(data.maintenance_request_created_date);
  }, [data]);
  //automatic refresh problem - the data is not displaying after save update 

  return (
    <div style={{ paddingBottom: "10px" }}>
      <Box
        sx={{
          flexDirection: "column", // Added this to stack children vertically
          justifyContent: "center",
          width: "100%", // Take up full screen width
          marginTop: theme.spacing(2), // Set the margin to 20px
          // backgroundColor: '#3D5CAC80',
          backgroundColor: color,
        }}
      >
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            // width= "100%" // Take up full screen width
            spacing={2}
        >
            <Typography sx={{ color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize: theme.typography.largeFont }}>
              {item.status}
            </Typography>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
            <Button onClick={handlePreviousCard} disabled={backward_active_status}>
                <ArrowBackIcon />
            </Button>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                width="100px"
            >
                <Typography sx={{ color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize: theme.typography.largeFont }}>
                {currentIndex + 1} of {requestData.length}
                </Typography>
            </Stack>
            <Button onClick={handleNextCard} disabled={forward_active_status}>
                <ArrowForwardIcon />
            </Button>
            </Stack>
        </Stack>
        <Stack alignItems="center" justifyContent="center" sx={{paddingBottom: "0px"}}>
          <Card
            sx={{
              backgroundColor: color,
              boxShadow: "none",
              elevation: "0",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0px"
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                paddingBottom: "0px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  image={images[activeStep]}
                  sx={{
                    elevation: "0",
                    boxShadow: "none",
                    maxWidth: "800px",
                    minWidth: "300px",
                    maxHeight: "800px",
                    minHeight: "100px",
                    height: "500px",
                    objectFit: "cover",
                    center: "true",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                />
              </div>
              <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                variant="text"
                sx={{
                  color: "white",
                  backgroundColor: color,
                  width: "100%",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  elevation: "0",
                  boxShadow: "none",
                }}
                nextButton={
                  <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1} 
                    sx={{color: "white"}}
                  > 
                    <KeyboardArrowRight sx={{color: "white"}} />
                  </Button>
                }
                backButton={
                  <Button size="small" onClick={handleBack} disabled={activeStep === 0} 
                    sx={{color: "white"}}
                  >
                  <KeyboardArrowLeft sx={{color: "white"}} />
                </Button>
                }
              />
            </CardContent>
            <CardContent
              sx={{
                flexDirection: "column",
                alignItems: "left",
                justifyContent: "left",
                width: "100%",
                padding: "0px"
              }}
            >
              <Box
                style={{
                  // paddingLeft: "10px",
                  alignContent: "left",
                  justifyContent: "left",
                  alignItems: "left",
                }}
              >

              <Stack alignItems="center" justifyContent="center" sx={{ paddingBottom: "0px" }}>
                <Card
                  sx={{
                    backgroundColor: color,
                    // backgroundColor: "blue",
                    boxShadow: "none",
                    elevation: "0",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0px"
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      paddingBottom: "0px",
                    }}
                  >
                    {/* Priority Typography with Button */}
                    <Typography
                      sx={{
                        color: theme.typography.secondary.white,
                        fontWeight: theme.typography.secondary.fontWeight,
                        fontSize: theme.typography.mediumFont,
                        paddingBottom: "0px",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {data?.maintenance_priority.toUpperCase()[0] + data?.maintenance_priority.slice(1)} Priority
                      
                        <CreateIcon sx={{
                            color: "#FFFFFF",
                            marginLeft: "auto",
                            fontSize: "18px"
                        }} 
                         
                        onClick={() => navigateToEditMaintenanceItem(data?.maintenance_desc, data?.property_address, data?.maintenance_request_type, estimatedCost, data.maintenance_title, data.maintenance_priority, completionStatus, data.maintenance_request_uid, data.maintenance_property_id )}/>  
                      
                    </Typography>

                  </CardContent>
                </Card>
              </Stack>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.mediumFont,
                    paddingBottom: "10px",
                  }} underline="always"
                >
                    {data?.property_address}, {data?.property_city} {data?.property_state} {data?.property_zip}
            </Typography>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.mediumFont,
                    paddingBottom: "10px",
                  }}
                >
                  { data !== undefined ? (data.maintenance_title!==undefined ? data.maintenance_title :"No Data") : "No data"} - {data?.maintenance_request_uid}
            
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.mediumFont,
                    paddingBottom: "10px",
                  }}
                >
                  Estimated Cost: {data?.maintenance_estimated_cost ? "$" + data?.maintenance_estimated_cost : "Not reported"}
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.mediumFont,
                    paddingBottom: "10px",
                  }}
                >
                  Reported: {formattedDate} | Open: {numOpenRequestDays} days
                </Typography>
                  {/* {data.maintenance} */}
                <Typography
                  sx={{
                    overflowWrap: "break-word",
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.mediumFont,
                  }}
                >
                  {data.maintenance_request_status === "SCHEDULED" ? "Scheduled for " + data.maintenance_scheduled_date + " at " + data.maintenance_scheduled_time: null}
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.mediumFont,
                    paddingBottom: "10px",
                  }}
                >
                  Issue Description: {data?.maintenance_desc}
                </Typography>
                <Grid container>
                    <QuotesTable maintenanceItem={data} maintenanceQuotes={maintenanceQuotes}/>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </div>
  );
}
