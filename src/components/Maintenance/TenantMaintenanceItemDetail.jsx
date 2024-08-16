import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Stack,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  CardMedia,
  Input,
  Container,
  Radio,
  FormLabel,
  TableCell,
  TableRow,
  TableBody,
  Table,
  Divider,
} from "@mui/material";
import theme from "../../theme/theme";
import ReturnButtonIcon from "../Property/refundIcon.png";
import maintenanceRequestImage from "./maintenanceRequest.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import defaultMaintenanceImage from "../Property/maintenanceIcon.png";
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function TenantMaintenanceItemDetail({tenantMaintenanceItemDetailState, setRightPane}) {
  console.log("In Tenant Maintenance Item Detail");
  // const [currentIndex, setCurrentIndex] = useState(requestIndex);
  const [activeStep, setActiveStep] = useState(0);

  const location = useLocation();
  let navigate = useNavigate();
  console.log("location.state---", location.state);
  console.log("location.state---", tenantMaintenanceItemDetailState);

  const color = "#FFFFF";
  const item = location.state?.item || tenantMaintenanceItemDetailState?.item;

  function openDays(openday) {
    // Convert maintenance_request_created_date to a Date object
    const createdDate = new Date(openday);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in milliseconds between the current date and the created date
    const timeDifferenceMs = currentDate.getTime() - createdDate.getTime();

    // Calculate the difference in days
    const daysDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));

    console.log(`The item was created ${daysDifference} days ago.`);

    return daysDifference;
  }
  // const handleNextCard = () => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % requestData.length);
  //   };

  //   const handlePreviousCard = () => {
  //     setCurrentIndex((prevIndex) => (prevIndex - 1 + requestData.length) % requestData.length);
  //   };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function closeAddTenantMaintenanceItem() {
    // navigate("/tenantDashboard");
    //navigate("/tenantDashboard", { state: { propertyId: item.property_uid } });
    setRightPane("");
  }

  // const images = [
  //   {
  //     label: "maintenanceRequest",
  //     imgPath: maintenanceRequestImage,
  //   },
  //   {
  //     label: "maintenanceRequest",
  //     imgPath: maintenanceRequestImage,
  //   },
  //   {
  //     label: "maintenanceRequest",
  //     imgPath: maintenanceRequestImage,
  //   },
  //   {
  //     label: "maintenanceRequest",
  //     imgPath: maintenanceRequestImage,
  //   },
  // ];
  let images = [];
  if (item && item.maintenance_images) {
    try {
      images = JSON.parse(item.maintenance_images);
    } catch (error) {
      console.error("Failed to parse maintenance_images:", error);
      images = [defaultMaintenanceImage];
    }
  }

  const statusTimeline = [
    {
      message: "Scheduled for [date] [time]",
      date: "10/10/2021",
      time: "10:00 AM",
    },
    {
      message: "Assigned to Technician",
      date: "10/10/2021",
      time: "10:00 AM",
    },
    {
      message: "Complaint Received",
      date: "10/10/2021",
      time: "10:00 AM",
    },
  ];
  // const maxSteps = images.length;
  const maxSteps = images.length === 0 ? 1 : images.length;

  // console.log(item);
  // console.log(color);

  const [scrollPosition, setScrollPosition] = useState(0);
	const scrollRef = useRef(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollLeft = scrollPosition;
		}
	}, [scrollPosition]);

	const handleScroll = (direction) => {
		if (scrollRef.current) {
			const scrollAmount = 200;
			setScrollPosition((prevScrollPosition) => {
				const currentScrollPosition = scrollRef.current.scrollLeft;
				let newScrollPosition;
	
				if (direction === 'left') {
					newScrollPosition = Math.max(currentScrollPosition - scrollAmount, 0);
				} else {
					newScrollPosition = currentScrollPosition + scrollAmount;
				}
	
				return newScrollPosition;
			});
		}
	};

  return (
    <Paper
      style={{
        margin: "5px",
        padding: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        paddingTop: "5px",
      }}
    >
      <Stack direction="column" justifyContent="center" alignItems="center" position="relative">
        <Box left={0} direction="column" alignItems="center">
          <Button onClick={() => closeAddTenantMaintenanceItem()}>
            {/* <ArrowBackIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px'}}/> */}
            <img src={ReturnButtonIcon} alt="Return Button Icon" style={{ width: "25px", height: "25px", marginRight: "10px" }} />
            <Typography sx={{ textTransform: "none", color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: "16px" }}>
              Return to Dashboard
            </Typography>
          </Button>
        </Box>
      </Stack>
      <Stack direction="column" justifyContent="center" alignItems="center" padding="10px" position="relative">
        
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography sx={{ color: theme.typography.secondary.black, fontWeight: theme.typography.common.fontWeight, fontSize: "22px" }}>
                  Maintenance Request {item?.maintenance_request_uid}
                </Typography>
              </Grid>

              <Grid item xs={7}>
                <Typography sx={{ color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "18px" }}>{item?.maintenance_title}</Typography>
              </Grid>

              <Grid item xs={5}>
                <Typography sx={{ color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "14px" }}>Status: {item?.maintenance_request_status}</Typography>
              </Grid>

              <Grid item xs={7}>
                <Typography sx={{ color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "14px" }}>
                  Reported: {item?.maintenance_request_created_date}
                </Typography>
              </Grid>

              <Grid item xs={5}>
                <Typography sx={{ color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "14px" }}>
                  Open: {openDays(item?.maintenance_request_created_date)} Days
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Typography sx={{ color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "18px" }}>{item?.maintenance_priority} Priority</Typography>
              </Grid>
              <Grid item xs={12}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										padding: 2,
									}}
								>
									<IconButton
										onClick={() => handleScroll('left')}
										disabled={scrollPosition === 0}
									>
										<ArrowBackIosIcon />
									</IconButton>
									<Box
										sx={{
											display: 'flex',
											overflowX: 'auto',
											scrollbarWidth: 'none',
											msOverflowStyle: 'none',
											'&::-webkit-scrollbar': {
												display: 'none',
											},
										}}
									>
										<Box
											sx={{
												display: 'flex',
												overflowX: 'auto',
												scrollbarWidth: 'none',
												msOverflowStyle: 'none',
												'&::-webkit-scrollbar': {
													display: 'none',
												},
											}}
										>
											<ImageList 
											ref={scrollRef}
											sx={{ display: 'flex', flexWrap: 'nowrap' }} cols={5}>
												{images?.map((image, index) => (
													<ImageListItem
														key={index}
														sx={{
															width: 'auto',
															flex: '0 0 auto',
															border: '1px solid #ccc',
															margin: '0 2px',
															position: 'relative', // Added to position icons
														}}
													>
														<img
															src={image}
															alt={`maintenance-${index}`}
															style={{
																height: '150px',
																width: '150px',
																objectFit: 'cover',
															}}
														/></ImageListItem>
												))}
											</ImageList>
										</Box>
									</Box>
									<IconButton onClick={() => handleScroll('right')}>
										<ArrowForwardIosIcon />
									</IconButton>
								</Box>
							</Grid>
              <Grid item xs={12}>
                <Typography sx={{ color: "#160449", fontWeight: theme.typography.common.fontWeight, fontSize: "14px" }}>{item?.maintenance_desc}</Typography>
              </Grid>
            </Grid>
         
        
      </Stack>
    </Paper>
  );
}
