import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Stack,
  Paper,
  Button,
  IconButton,
  Grid,
  ImageList,
  ImageListItem,
} from "@mui/material";
import theme from "../../theme/theme";
import ReturnButtonIcon from "../Property/refundIcon.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";

export default function TenantMaintenanceItemDetail({ tenantMaintenanceItemDetailState, setRightPane }) {
  console.log("In Tenant Maintenance Item Detail");
  const [activeStep, setActiveStep] = useState(0);

  const location = useLocation();
  let navigate = useNavigate();
  console.log("location.state---", location.state);
  console.log("location.state---", tenantMaintenanceItemDetailState);

  const color = "#FFFFF";
  const item = location.state?.item || tenantMaintenanceItemDetailState?.item;

  function openDays(openday) {
    const createdDate = new Date(openday);
    const currentDate = new Date();
    const timeDifferenceMs = currentDate.getTime() - createdDate.getTime();
    const daysDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
    return daysDifference;
  }

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

        if (direction === "left") {
          newScrollPosition = Math.max(currentScrollPosition - scrollAmount, 0);
        } else {
          newScrollPosition = currentScrollPosition + scrollAmount;
        }

        return newScrollPosition;
      });
    }
  };

  function closeAddTenantMaintenanceItem() {
    setRightPane("");
  }

  let images = [];
  if (item && item.maintenance_images) {
    try {
      images = JSON.parse(item.maintenance_images);
    } catch (error) {
      console.error("Failed to parse maintenance_images:", error);
      images = [];
    }
  }

  function navigateToEditMaintenanceItem(
		testIssue,
		testProperty,
		testIssueItem,
		testCost,
		testTitle,
		testPriority,
		completionStatus,
		requestUid,
		propID,
		maintainanceImages,
		maintainanceFavImage,
	) {
    console.log("going to edit component");
			// Setting properties into sessionStorage
			sessionStorage.setItem('testIssue', testIssue);
			sessionStorage.setItem('testProperty', tenantMaintenanceItemDetailState.property);
			sessionStorage.setItem('testIssueItem', testIssueItem);
			sessionStorage.setItem('testCost', testCost);
			sessionStorage.setItem('testTitle', testTitle);
			sessionStorage.setItem('testPriority', testPriority);
			sessionStorage.setItem('completionStatus', completionStatus);
			sessionStorage.setItem('requestUid', requestUid);
			sessionStorage.setItem('propID', propID);
			sessionStorage.setItem('selectedRequestIndex', 0);
			sessionStorage.setItem('selectedStatus', "New Requests");
			sessionStorage.setItem('maintainanceImages', maintainanceImages);
			sessionStorage.setItem('maintainanceFavImage', maintainanceFavImage);
			window.dispatchEvent(new Event('storage'));
setRightPane({ type: "editmaintenance" });
			setTimeout(() => {
				window.dispatchEvent(new Event('maintenanceRequestSelected'));
			}, 0);
	}

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
            <img src={ReturnButtonIcon} alt="Return Button Icon" style={{ width: "25px", height: "25px", marginRight: "10px" }} />
            <Typography sx={{ textTransform: "none", color: theme.typography.common.blue, fontWeight: theme.typography.common.fontWeight, fontSize: "16px" }}>
              Return to Dashboard
            </Typography>
          </Button>
        </Box>
        {(item?.maintenance_request_status === "NEW" || item?.maintenance_request_status === "PROCESSING"|| item?.maintenance_request_status === "INFO") && (
          <IconButton
            aria-label="edit"
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: theme.typography.common.blue,
            }}
            onClick={() =>
              navigateToEditMaintenanceItem(
                item?.maintenance_desc,
                item?.property_address,
                item?.maintenance_request_type,
                "",
                item?.maintenance_title,
                item?.maintenance_priority, // Use local state here
                "",
                item?.maintenance_request_uid,
                item?.maintenance_property_id,
                item?.maintenance_images,
                item?.maintenance_favorite_image,

              )
            }
          >
            <EditIcon />
          </IconButton>
        )}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
              }}
            >
              <IconButton onClick={() => handleScroll("left")} disabled={scrollPosition === 0}>
                <ArrowBackIosIcon />
              </IconButton>
              <Box
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    overflowX: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  <ImageList ref={scrollRef} sx={{ display: "flex", flexWrap: "nowrap" }} cols={5}>
                    {images?.map((image, index) => (
                      <ImageListItem
                        key={index}
                        sx={{
                          width: "auto",
                          flex: "0 0 auto",
                          border: "1px solid #ccc",
                          margin: "0 2px",
                          position: "relative",
                        }}
                      >
                        <img
                          src={image}
                          alt={`maintenance-${index}`}
                          style={{
                            height: "150px",
                            width: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              </Box>
              <IconButton onClick={() => handleScroll("right")}>
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
