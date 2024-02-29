import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Button, Box, Stack } from "@mui/material";
import theme from "../../../theme/theme";
import maintenanceRequestImage from "../maintenanceRequest.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";


async function getInitialImages(requestData, currentIndex) {
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

export default function WorkerMaintenanceRequestNavigator({ requestIndex, backward_active_status, forward_active_status, updateRequestIndex, requestData, color, item, allData, currentTabValue, status, tabs }) {
  const [currentIndex, setCurrentIndex] = useState(requestIndex);
  const [activeStep, setActiveStep] = useState(0);
  const [formattedDate, setFormattedDate] = useState("");
  const [numOpenRequestDays, setNumOpenRequestDays] = useState("");
  const [images, setImages] = useState([maintenanceRequestImage]);
  let [currentTab, setCurrentTab]=useState(currentTabValue);
  // const [maxSteps, setMaxSteps] = useState(images.length);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
        const initialImages = await getInitialImages(requestData, currentIndex);
        setImages(initialImages);
        setActiveStep(0);
    };
    
    fetchImages();
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
      else{
        if (newIndex === -1){
          newIndex = 0
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

  
  // console.log("requestData", requestData)
  // console.log("data", data)

   useEffect(() => {
    if(data){
      formatDate(data.maintenance_request_created_date);
    }
  }, [data]);

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
          direction="row"
          justifyContent="center"
          alignItems="center"
          // width= "100%" // Take up full screen width
          spacing={2}
        >
          <Button onClick={handlePreviousCard} disabled={backward_active_status}>
            <ArrowBackIcon />
          </Button>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            // width= "100%" // Take up full screen width
            spacing={1}
          >
            <Typography sx={{ color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize: theme.typography.largeFont }}>
              {item.status}
            </Typography>
            <Typography sx={{ color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize: theme.typography.largeFont }}>
              {currentIndex + 1} of {requestData.length}
            </Typography>
          </Stack>
          <Button onClick={handleNextCard} disabled={forward_active_status}>
            <ArrowForwardIcon />
          </Button>
        </Stack>
        <Stack
         justifyContent="center"
         alignItems="center">
        <Typography sx={{ color: theme.typography.secondary.white, fontWeight: theme.typography.secondary.fontWeight, fontSize: theme.typography.largeFont }}>
              { data!== undefined ? (data.maintenance_title!==undefined ? data.maintenance_title :"No Data") : "No data"}
        </Typography>
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
                    maxWidth: "500px",
                    minWidth: "300px",
                    maxHeight: "500px",
                    minHeight: "100px",
                    height: "300px",
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
              <div
                style={{
                  // paddingLeft: "10px",
                  alignContent: "left",
                  justifyContent: "left",
                  alignItems: "left",
                }}
              >
                <Typography
                    sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.mediumFont,
                    paddingBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    }}
                >
                    <b>{data?.maintenance_priority.toUpperCase()[0] + data?.maintenance_priority.slice(1)} Priority</b>
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.primary.fontWeight,
                    fontSize: theme.typography.mediumFont,
                    paddingBottom: "10px",
                  }}
                >
                  { data !== undefined ? (data.maintenance_title!==undefined ? "Title: " + data.maintenance_title :"No Data") : "No data"} - {data?.maintenance_request_uid}
            
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.primary.fontWeight,
                    fontSize: theme.typography.mediumFont,
                    paddingBottom: "10px",
                  }} 
                  underline="always"
                >
                  <u>{data?.property_address}, {data?.property_city} {data?.property_state} {data?.property_zip}</u>
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
                  {/* Reported: {data?.maintenance_request_created_date} | Open : Days */}
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.light.fontWeight,
                    fontSize: theme.typography.mediumFont,
                    paddingBottom: "10px",
                  }}
                >
                  Issue Notes: {data!==undefined ? (data.maintenance_desc===null ? "None" : data.maintenance_desc) : ""}
                  {/* Estimated Cost: */}
                   {/* {data.maintenance_estimated_cost ? "$" + data.maintenance_estimated_cost : "Not reported"} */}
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.light.fontWeight,
                    fontSize: theme.typography.mediumFont,
                    paddingBottom: "10px",
                  }}
                >
                Manager Notes:  {data!==undefined ? (data.quote_pm_notes===null ? "None" : data.quote_pm_notes) : "None"}
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
                  {/* {requestData[currentIndex].maintenance_request_status === "SCHEDULED" ? "Scheduled for " + requestData[currentIndex].maintenance_scheduled_date + " at " + requestData[currentIndex].maintenance_scheduled_time: null} */}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </div>
  );
}
