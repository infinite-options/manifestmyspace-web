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
  if (requestData[currentIndex]?.maintenance_images != "[]") {
    // console.log(JSON.parse(requestData[currentIndex].maintenance_images))
    return JSON.parse(requestData[currentIndex]?.maintenance_images);
  }

  // call api to get images

  // var images = []

  // try {
  //   const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceRequests/${requestData[currentIndex].quote_maintenance_request_id}`);
  //   const jsonData = await response.json();
  //   console.log("jsonData", jsonData);
  //   if (jsonData.result[0].quote_images !== "[]") {
  //     return JSON.parse(jsonData.result[0].quote_images);
  //   }
  // } catch (error) {
  //   console.log("error", error);
  // }

  return [maintenanceRequestImage];
}

export default function MaintenanceRequestNavigator01({ requestIndex, updateRequestIndex, requestData, color, item, allData }) {
  const [currentIndex, setCurrentIndex] = useState(requestIndex);
  const [activeStep, setActiveStep] = useState(0);
  const [formattedDate, setFormattedDate] = useState("");
  const [numOpenRequestDays, setNumOpenRequestDays] = useState("");
  const [images, setImages] = useState([maintenanceRequestImage]);
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


  // console.log("RequestNavigator");
  // console.log("requestIndex", requestIndex);
  // console.log("requestData", requestData);
  // console.log("currentIndex", currentIndex);
  // console.log("color", color);
  // console.log("item", item);
  // console.log("allData", allData);

  const maxSteps = images.length;

  // console.log("maxSteps", maxSteps);

  const handleNextCard = () => {
      setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % requestData.length;
          let nextMaintenanceId = requestData[newIndex].maintenance_request_uid;
          
          // navigate(`/maintenance/${nextMaintenanceId}`, { 
          //     replace: true,   
          //     state: {
          //         requestIndex,
          //         status,
          //         maintenanceItemsForStatus,
          //         allData,
          //     }
          // });

          console.log("currentIndex", newIndex);
          console.log("allData", allData);
          console.log("requestData", requestData);
          console.log("requestData[newIndex]", requestData[newIndex]);
          updateRequestIndex(newIndex)
          return newIndex;
      });
  };

  const handlePreviousCard = () => {
      setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex - 1 + requestData.length) % requestData.length;
          let previousMaintenanceId = requestData[newIndex].maintenance_request_uid;

          // navigate(`/maintenance/${previousMaintenanceId}`, { replace: true });

          console.log("currentIndex", newIndex);
          console.log("allData", allData);
          console.log("requestData", requestData);
          console.log("requestData[newIndex]", requestData[newIndex]);
          updateRequestIndex(newIndex)
          return newIndex;
      });
  };


  // const handleNextCard = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex + 1) % requestData.length);
  //   let nextMaintenanceId = requestData[currentIndex].maintenance_request_uid;
  //   // navigate(`/maintenance/${nextMaintenanceId}`, { replace: true,   state: {
  //   //     requestIndex,
  //   //     status,
  //   //     maintenanceItemsForStatus,
  //   //     allData,
  //   // }});
  //   console.log("currentIndex", currentIndex)
  //   console.log("allData", allData)
  //   console.log("requestData", requestData)
  //   // console.log("item", allData[requestData.mapping][currentIndex])
  //   console.log("requestData[currentIndex]", requestData[currentIndex])
  // };

  // const handlePreviousCard = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex - 1 + requestData.length) % requestData.length);
  //   let previousMaintenanceId = requestData[currentIndex].maintenance_request_uid;
  //   // navigate(`/maintenance/${previousMaintenanceId}`, { replace: true });
  //   console.log("currentIndex", currentIndex)
  //   console.log("item", allData[requestData.mapping][currentIndex])
  // };

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
          <Button onClick={handlePreviousCard} disabled={requestData.length <= 1}>
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
          <Button onClick={handleNextCard} disabled={requestData.length <= 1}>
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
                    fontSize: theme.typography.smallFont,
                    paddingBottom: "10px",
                  }}
                >
                  {data?.maintenance_title} - {data?.maintenance_request_uid}
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.smallFont,
                    paddingBottom: "10px",
                  }}
                >
                  {data?.maintenance_priority} Priority
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.smallFont,
                    paddingBottom: "10px",
                  }}
                  underline="always"
                >
                {data?.property_address}, {data?.property_city} {data?.property_state} {data?.property_zip}
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.smallFont,
                    paddingBottom: "10px",
                  }}
                >
                  Reported: {formattedDate} | Open: {numOpenRequestDays} days
                  {/* Reported: {data?.maintenance_request_created_date} | Open : Days */}
                </Typography>
                <Typography
                  sx={{
                    color: theme.typography.secondary.white,
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.smallFont,
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
                    fontWeight: theme.typography.secondary.fontWeight,
                    fontSize: theme.typography.smallFont,
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
                    fontSize: theme.typography.smallFont,
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
