import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import theme from "../../theme/theme";
import { ThemeProvider } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { ReactComponent as CalendarIcon } from "../../images/datetime.svg";

const calculateAge = (date) => {
  if (!date) return "N/A";
  const now = new Date();
  const timeDiff = now - new Date(date);
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  let durationString;
  if (days > 0) {
    durationString = `${days} days ago`;
  } else if (hours > 0) {
    durationString = `${hours} hours ago`;
  } else if (minutes > 0) {
    durationString = `${minutes} minutes ago`;
  } else {
    durationString = `${seconds} seconds ago`;
  }
  return durationString;
};

const TenantLease = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { application, property } = state;
  const [showSpinner, setShowSpinner] = useState(false);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [moveInDate, setMoveInDate] = useState(dayjs());
  const [noOfOccupants, setNoOfOccupants] = useState("");
  const [rent, setRent] = useState("");
  const [rentFrequency, setRentFrequency] = useState("");
  const [lateFeesAfter, setLateFeesAfter] = useState("");
  const [lateFeesPerDay, setLateFeesPerDay] = useState("");
  const [rentDueDate, setRentDueDate] = useState("");
  const [availableToPay, setAvailableToPay] = useState("");
  const handleStartDateChange = (v) => {
    setStartDate(v);
    if (endDate < v) setEndDate(v);
  };
  const handleEndDateChange = (v) => {
    setEndDate(v);
  };
  const handleMoveInDateChange = (v) => {
    setMoveInDate(v);
  };
  const handleNoOfOccupantsChange = (e) => {
    setNoOfOccupants(e.target.value);
  };
  const handleRentChange = (e) => {
    setRent(e.target.value);
  };
  const handleRentFrequencyChange = (e) => {
    setRentFrequency(e.target.value);
  };
  const handleLateFeesAfterChange = (e) => {
    setLateFeesAfter(e.target.value);
  };
  const handleLateFeesPerDayChange = (e) => {
    setLateFeesPerDay(e.target.value);
  };
  const handleRentDueDateChange = (e) => {
    setRentDueDate(e.target.value);
  };
  const handleAvailableToPayChange = (e) => {
    setAvailableToPay(e.target.value);
  };
  const handleCreateLease = async () => {
    setShowSpinner(true);
    await fetch(
      `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/leaseApplication`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lease_uid: application.lease_uid,
          lease_status: "PROCESSING",
          lease_start: new Date(startDate).toLocaleDateString(),
          lease_end: new Date(endDate).toLocaleDateString(),
          lease_rent_available_topay: availableToPay,
          lease_rent_due_by: rentDueDate,
          lease_rent_late_by: lateFeesAfter,
          lease_rent_perDay_late_fee: lateFeesPerDay,
          lease_actual_rent: rent,
        }),
      }
    );
    navigate("/managerDashboard");
    setShowSpinner(false);
  };
  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showSpinner}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          backgroundColor: "#F2F2F2",
          borderRadius: "10px",
          margin: "25px",
          padding: "15px",
          fontFamily: "Source Sans Pro",
        }}
      >
        <Grid container>
          <Grid item xs={1}>
            <Button onClick={() => navigate(-1)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8L2.58579 9.41421L1.17157 8L2.58579 6.58579L4 8ZM9 21C7.89543 21 7 20.1046 7 19C7 17.8954 7.89543 17 9 17L9 21ZM7.58579 14.4142L2.58579 9.41421L5.41421 6.58579L10.4142 11.5858L7.58579 14.4142ZM2.58579 6.58579L7.58579 1.58579L10.4142 4.41421L5.41421 9.41421L2.58579 6.58579ZM4 6L14.5 6L14.5 10L4 10L4 6ZM14.5 21L9 21L9 17L14.5 17L14.5 21ZM22 13.5C22 17.6421 18.6421 21 14.5 21L14.5 17C16.433 17 18 15.433 18 13.5L22 13.5ZM14.5 6C18.6421 6 22 9.35786 22 13.5L18 13.5C18 11.567 16.433 10 14.5 10L14.5 6Z"
                  fill="#3D5CAC"
                />
              </svg>
            </Button>
          </Grid>
          <Grid
            item
            xs={11}
            textAlign="center"
            sx={{ paddingTop: "5px", paddingRight: "30px" }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#160449",
              }}
            >
              {"New Tenant Lease"}
            </Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            padding: "5px",
            justifyContent: "space-evenly",
            alignItems: "center",
            fontSize: "20px",
            color: "#160449",
          }}
        >
          <Box
            sx={{
              minWidth: "130px",
              height: "130px",
              marginRight: "20px",
              backgroundColor: "grey",
            }}
          >
            <img
              src={JSON.parse(property.property_images)[0]}
              alt="Property Img"
              style={{
                width: "130px",
                height: "130px",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {property.property_address}
              {", "}
              {property.property_city}
              {", "}
              {property.property_state} {property.property_zip}
            </Box>
            <Box
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                paddingTop: "10px",
              }}
            >
              {"Owner:"}
            </Box>
            <Box
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {property.owner_first_name} {property.owner_last_name}
            </Box>
            <Box
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                paddingTop: "10px",
              }}
            >
              {"Tenant:"}
            </Box>
            <Box
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {application.tenant_first_name} {application.tenant_last_name}
            </Box>
            <Box
              sx={{
                fontSize: "12px",
                fontWeight: "bold",
                paddingTop: "5px",
              }}
            >
              {property.property_available_to_rent === 1
                ? "Not Rented"
                : "Rented"}
            </Box>
            <Box
              sx={{
                fontSize: "10px",
                paddingTop: "10px",
                color: "#3D5CAC",
              }}
            >
              {calculateAge(application.lease_application_date)}
            </Box>
          </Box>
        </Box>
        <Grid container spacing={10}>
          <Grid item xs={6} md={6}>
            <Stack>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"Start Date"}
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={startDate}
                  minDate={dayjs()}
                  onChange={handleStartDateChange}
                  slots={{
                    openPickerIcon: CalendarIcon,
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      style: {
                        width: "100%",
                        fontSize: 12,
                        backgroundColor: "#F2F2F2 !important",
                        borderRadius: "10px !important",
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
          <Grid item xs={6} md={6}>
            <Stack>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"End Date"}
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={endDate}
                  minDate={dayjs()}
                  onChange={handleEndDateChange}
                  slots={{
                    openPickerIcon: CalendarIcon,
                  }}
                  variant="desktop"
                  slotProps={{
                    textField: {
                      size: "small",
                      style: {
                        width: "100%",
                        fontSize: 12,
                        backgroundColor: "#F2F2F2 !important",
                        borderRadius: "10px !important",
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
          <Grid item xs={6} md={6}>
            <Stack>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"Move In Date"}
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={moveInDate}
                  minDate={dayjs()}
                  onChange={handleMoveInDateChange}
                  slots={{
                    openPickerIcon: CalendarIcon,
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      style: {
                        width: "100%",
                        fontSize: 12,
                        backgroundColor: "#F2F2F2 !important",
                        borderRadius: "10px !important",
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
          <Grid item xs={6} md={6}>
            <Stack>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"# of Occupants"}
              </Typography>
              <TextField
                name="noOfOccupants"
                value={noOfOccupants}
                onChange={handleNoOfOccupantsChange}
                variant="filled"
                fullWidth
                placeholder="Number"
                sx={{
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#D6D5DA",
                    borderRadius: 10,
                    height: 40,
                    paddingBottom: "15px",
                  },
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={6} md={6}>
            <Stack>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"Rent"}
              </Typography>
              <TextField
                name="rent"
                value={rent}
                onChange={handleRentChange}
                variant="filled"
                fullWidth
                placeholder="$"
                sx={{
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#D6D5DA",
                    borderRadius: 10,
                    height: 40,
                    paddingBottom: "15px",
                  },
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={6} md={6}>
            <Stack>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"Rent Frequency"}
              </Typography>
              <Select
                value={rentFrequency}
                onChange={handleRentFrequencyChange}
                sx={{
                  backgroundColor: "#D6D5DA",
                  borderRadius: 10,
                  height: 40,
                }}
              >
                <MenuItem value="Monthly">{"Monthly"}</MenuItem>
                <MenuItem value="Yearly">{"Yearly"}</MenuItem>
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={6} md={6}>
            <Stack>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"Late Fees After"}
              </Typography>
              <TextField
                name="lateFeesAfter"
                value={lateFeesAfter}
                onChange={handleLateFeesAfterChange}
                variant="filled"
                fullWidth
                placeholder="days"
                sx={{
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#D6D5DA",
                    borderRadius: 10,
                    height: 40,
                    paddingBottom: "15px",
                  },
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={6} md={6}>
            <Stack>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"Late Fees Per Day"}
              </Typography>
              <TextField
                name="lateFeesPerDay"
                value={lateFeesPerDay}
                onChange={handleLateFeesPerDayChange}
                variant="filled"
                fullWidth
                placeholder="$"
                sx={{
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#D6D5DA",
                    borderRadius: 10,
                    height: 40,
                    paddingBottom: "15px",
                  },
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={6} md={6}>
            <Stack>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"Rent Due Date"}
              </Typography>
              <TextField
                name="rentDueDate"
                value={rentDueDate}
                onChange={handleRentDueDateChange}
                variant="filled"
                fullWidth
                placeholder="of month"
                sx={{
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#D6D5DA",
                    borderRadius: 10,
                    height: 40,
                    paddingBottom: "15px",
                  },
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={6} md={6}>
            <Stack>
              <Typography
                sx={{
                  color: theme.typography.propertyPage.color,
                  fontFamily: "Source Sans Pro",
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: theme.typography.smallFont,
                }}
              >
                {"Available To Pay"}
              </Typography>
              <TextField
                name="availableToPay"
                value={availableToPay}
                onChange={handleAvailableToPayChange}
                variant="filled"
                fullWidth
                placeholder="days before"
                sx={{
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#D6D5DA",
                    borderRadius: 10,
                    height: 40,
                    paddingBottom: "15px",
                  },
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              onClick={handleCreateLease}
              sx={{
                backgroundColor: "#9EAED6",
                color: "#160449",
                textTransform: "none",
                width: "80%",
                "&:hover, &:focus, &:active": {
                  backgroundColor: "#9EAED6",
                },
              }}
            >
              {"Create Lease"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default TenantLease;
