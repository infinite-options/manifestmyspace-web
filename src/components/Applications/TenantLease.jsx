import { useState, useEffect } from "react";
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
import { calculateAge } from "../utils/helper";
import { useUser } from "../../contexts/UserContext";
import { makeStyles } from "@material-ui/core/styles";
import AddFeeRowImg from "../../images/AddFeeRowImg.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import InputAdornment from "@mui/material/InputAdornment";
import defaultHouseImage from "../Property/defaultHouseImage.png";
import { isValidDate } from "../../utils/dates";

import APIConfig from "../../utils/APIConfig";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#D6D5DA",
      borderRadius: 10,
      height: 30,
      marginBlock: 10,
      paddingBottom: "15px",
    },
  },
  select: {
    backgroundColor: "#D6D5DA",
    height: 30,
    borderRadius: "10px !important",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#D6D5DA",
    },
  },
}));

const initialFees = (property, application) => {
  const fees = [];
  console.log("--debug-- property", property);
  console.log("--debug-- application", application);
  if (property.property_listed_rent) {
    fees.push({
      id: fees.length + 1,
      fee_name: "Rent",
      fee_type: "$",
      frequency: "Monthly",
      charge: property.property_listed_rent,
      due_by: application.lease_rent_due_by,
      late_by: application.lease_rent_late_by,
      late_fee: application.lease_rent_late_fee,
      perDay_late_fee: application.lease_rent_perDay_late_fee,
      available_topay: application.lease_rent_available_topay,
    });
  }
  if (property.property_deposit) {
    fees.push({
      id: fees.length + 1,
      fee_name: "Deposit",
      fee_type: "$",
      frequency: "One-time",
      charge: property.property_deposit,
      due_by: application.lease_rent_due_by,
      late_by: application.lease_rent_late_by,
      late_fee: application.lease_rent_late_fee,
      perDay_late_fee: application.lease_rent_perDay_late_fee,
      available_topay: application.lease_rent_available_topay,
    });
  }
  if (fees.length === 0) {
    fees.push({
      id: fees.length + 1,
      fee_name: "",
      fee_type: "$",
      frequency: "Monthly",
      charge: "",
      due_by: 1,
      due_by_date: "",
      late_by: 2,
      late_fee: "",
      perDay_late_fee: "",
      available_topay: 1,
    });
  }
  return fees;
};

const TenantLease = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { getProfileId } = useUser();
  const { state } = useLocation();
  const { application, property } = state;
  const [showSpinner, setShowSpinner] = useState(false);
  const [startDate, setStartDate] = useState(application.lease_start ? dayjs(application.lease_start) : dayjs());
  const [endDate, setEndDate] = useState(application.lease_end ? dayjs(application.lease_end) : dayjs().add(1, "year").subtract(1, "day"));
  const [moveInDate, setMoveInDate] = useState(dayjs()); // fix me

  const [noOfOccupants, setNoOfOccupants] = useState(JSON.parse(application.lease_adults).length + JSON.parse(application.lease_children).length);

  console.log("# of Occupants", noOfOccupants);

  const [fees, setFees] = useState([]);

  const [leaseFiles, setLeaseFiles] = useState([]);
  const [leaseFileTypes, setLeaseFileTypes] = useState([]);

  const [showMissingFileTypePrompt, setShowMissingFileTypePrompt] = useState(false);
  const [showMissingFieldsPrompt, setShowMissingFieldsPrompt] = useState(false);
  const [showInvalidDueDatePrompt, setShowInvalidDueDatePrompt] = useState(false);

  let propertyImage;
  if (property.property_favorite_image !== null) {
    propertyImage = property.property_favorite_image;
  } else if (property.property_images === null || property.property_images === "[]") {
    propertyImage = defaultHouseImage;
  } else {
    const images = JSON.parse(property.property_images);
    propertyImage = images.length > 0 ? images[0] : defaultHouseImage;
  }

  useEffect(() => {
    const getLeaseFees = () => {
      let feesList = [];
      if (application?.lease_status === "PROCESSING") {
        feesList = JSON.parse(application.lease_fees);
      } else if (application?.lease_status === "NEW") {
        feesList = initialFees(property, application);
      }

      let i = 0;
      feesList.forEach((fee) => {
        fee.id = i + 1;
        i += 1;
      });

      setFees(feesList);
    };

    getLeaseFees();
  }, []);

  const addFeeRow = () => {
    setFees((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        fee_name: "",
        fee_type: "$",
        frequency: "Monthly",
        charge: "",
        due_by: 1,
        late_by: 2,
        late_fee: "",
        perDay_late_fee: "",
        available_topay: 1,
      },
    ]);
  };

  const deleteFeeRow = (index) => {
    const list = [...fees];
    list.splice(index - 1, 1);
    setFees(list);
  };
  const handleFeeChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...fees];
    if (name === "due_by" || name === "late_by" || name === "available_topay") {
      if (typeof parseInt(value) === "number" && !isNaN(parseInt(value))) {
        list[index - 1][name] = parseInt(value);
      } else {
        list[index - 1][name] = null;
      }
    } else {
      list[index - 1][name] = value;
    }
    setFees(list);
  };
  const handleFrequencyChange = (e, index) => {
    const value = e.target.value;
    let list = [...fees];
    list[index - 1].frequency = value;
    list[index - 1].available_topay = 1;
    if (value === "One-time") {
      list[index - 1].due_by = null;
      list[index - 1].due_by_date = "";
    } else {
      list[index - 1].due_by = 1;
      list[index - 1].due_by_date = null;
    }
    list[index - 1].late_by = 2;
    setFees(list);
  };
  const handleDueByChange = (e, index) => {
    const value = e.target.value;
    let list = [...fees];
    list[index - 1].due_by = daytoValueMap.get(value);
    setFees(list);
  };

  const handleLateByChange = (e, index) => {
    const value = e.target.value;
    let list = [...fees];
    // list[index - 1].late_by = daytoValueMap.get(value);
    list[index - 1].late_by = value;
    setFees(list);
  };

  const handleAvailableToPayChange = (e, index) => {
    const value = e.target.value;
    let list = [...fees];
    // list[index - 1].available_topay = daytoValueMap.get(value);
    list[index - 1].available_topay = value;
    setFees(list);
  };
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
  // const handleRentChange = (e) => {
  //   setRent(e.target.value);
  // };
  // const handleRentFrequencyChange = (e) => {
  //   setRentFrequency(e.target.value);
  // };
  // const handleLateFeesAfterChange = (e) => {
  //   setLateFeesAfter(e.target.value);
  // };
  // const handleLateFeesPerDayChange = (e) => {
  //   setLateFeesPerDay(e.target.value);
  // };
  // const handleRentDueDateChange = (e) => {
  //   setRentDueDate(e.target.value);
  // };
  // const handleAvailableToPayChange = (e) => {
  //   setAvailableToPay(e.target.value);
  // };
  const handleDueByDateChange = (v, index) => {
    console.log("handleDueByDateChange - v, index - ", v.format("MM-DD-YYYY"), index);
    const list = [...fees];
    list[index - 1].due_by_date = v.format("MM-DD-YYYY");
    setFees(list);
  };

  const dayOptionsForWeekly = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const dayOptionsForBiWeekly = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
    { value: "monday-week-2", label: "Monday - week 2" },
    { value: "tuesday-week-2", label: "Tuesday - week 2" },
    { value: "wednesday-week-2", label: "Wednesday - week 2" },
    { value: "thursday-week-2", label: "Thursday - week 2" },
    { value: "friday-week-2", label: "Friday - week 2" },
    { value: "saturday-week-2", label: "Saturday - week 2" },
    { value: "sunday-week-2", label: "Sunday - week 2" },
  ];

  const lateByOptionsForWeekly = [
    { value: 1, label: "1st day after due date" },
    { value: 2, label: "2nd day after due date" },
    { value: 3, label: "3rd day after due date" },
    { value: 4, label: "4th day after due date" },
    { value: 5, label: "5th day after due date" },
    { value: 6, label: "6th day after due date" },
    { value: 7, label: "7th day after due date" },
  ];

  const lateByOptionsForBiWeekly = [
    { value: 1, label: "1st day after due date" },
    { value: 2, label: "2nd day after due date" },
    { value: 3, label: "3rd day after due date" },
    { value: 4, label: "4th day after due date" },
    { value: 5, label: "5th day after due date" },
    { value: 6, label: "6th day after due date" },
    { value: 7, label: "7th day after due date" },
    { value: 8, label: "8th day after due date" },
    { value: 9, label: "9th day after due date" },
    { value: 10, label: "10th day after due date" },
    { value: 11, label: "11th day after due date" },
    { value: 12, label: "12th day after due date" },
    { value: 13, label: "13th day after due date" },
    { value: 14, label: "14th day after due date" },
  ];

  const availableToPayOptionsForWeekly = [
    { value: 1, label: "1 day before due date" },
    { value: 2, label: "2 days before due date" },
    { value: 3, label: "3 days before due date" },
    { value: 4, label: "4 days before due date" },
    { value: 5, label: "5 days before due date" },
    { value: 6, label: "6 days before due date" },
    { value: 7, label: "7 days before due date" },
  ];

  const availableToPayOptionsForBiWeekly = [
    { value: 1, label: "1 day before due date" },
    { value: 2, label: "2 days before due date" },
    { value: 3, label: "3 days before due date" },
    { value: 4, label: "4 days before due date" },
    { value: 5, label: "5 days before due date" },
    { value: 6, label: "6 days before due date" },
    { value: 7, label: "7 days before due date" },
    { value: 8, label: "8 days before due date" },
    { value: 9, label: "9 days before due date" },
    { value: 10, label: "10 days before due date" },
    { value: 11, label: "11 days before due date" },
    { value: 12, label: "12 days before due date" },
    { value: 13, label: "13 days before due date" },
    { value: 14, label: "14 days before due date" },
  ];

  const daytoValueMap = new Map([
    ["monday", 0],
    ["tuesday", 1],
    ["wednesday", 2],
    ["thursday", 3],
    ["friday", 4],
    ["saturday", 5],
    ["sunday", 6],
    ["monday-week-2", 7],
    ["tuesday-week-2", 8],
    ["wednesday-week-2", 9],
    ["thursday-week-2", 10],
    ["friday-week-2", 11],
    ["saturday-week-2", 12],
    ["sunday-week-2", 13],
  ]);

  const valueToDayMap = new Map(Array.from(daytoValueMap, ([key, value]) => [value, key]));

  const checkRequiredFields = () => {
    let retVal = true;
    fees.map((fee) => {
      if (
        fee.fee_name === "" ||
        fee.charge === "" ||
        fee.frequency === "" ||
        (fee.due_by === null && (fee.due_by_date === null || !isValidDate(fee.due_by_date))) ||
        fee.late_by === null ||
        fee.late_fee === "" ||
        fee.available_topay === null ||
        fee.perDay_late_fee === ""
      ) {
        retVal = false;
      }
    });
    return retVal;
  };

  const getDateAdornmentString = (d) => {
    if (d === null || d === 0) return "";
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  useEffect(() => {
    let isValid = true;
    fees.forEach((fee) => {
      if (fee.frequency === "One-time" || fee.frequency === "Annually") {
        if (fee.due_by_date == null || fee.due_by_date === "" || !isValidDate(fee.due_by_date)) {
          isValid = false;
        }
      }
    });
    if (isValid) {
      setShowInvalidDueDatePrompt(false);
    } else {
      setShowInvalidDueDatePrompt(true);
    }
  }, [fees]);

  const handleRemoveFile = (index) => {
    setLeaseFiles((prevFiles) => {
      const filesArray = Array.from(prevFiles);
      filesArray.splice(index, 1);
      return filesArray;
    });
    setLeaseFileTypes((prevTypes) => {
      const typesArray = [...prevTypes];
      typesArray.splice(index, 1);
      return typesArray;
    });
  };

  const checkFileTypeSelected = () => {
    for (let i = 0; i < leaseFiles.length; i++) {
      if (i >= leaseFileTypes.length) {
        return false; // Return false if the index is out of bounds
      }
      const fileType = leaseFileTypes[i];
      console.log("FILE TYPE: ", fileType);
      if (!fileType || fileType.trim() === "") {
        return false;
      }
    }
    setShowMissingFileTypePrompt(false);
    return true;
  };

  const handleCreateLease = async () => {
    setShowMissingFieldsPrompt(false);
    if (!checkRequiredFields()) {
      setShowMissingFieldsPrompt(true);
      return;
    }
    setShowSpinner(true);

    const leaseApplicationFormData = new FormData();

    leaseApplicationFormData.append("lease_uid", application.lease_uid);
    leaseApplicationFormData.append("lease_status", "PROCESSING");
    leaseApplicationFormData.append("lease_start", startDate.format("MM-DD-YYYY"));
    leaseApplicationFormData.append("lease_end", endDate.format("MM-DD-YYYY"));
    leaseApplicationFormData.append("lease_fees", JSON.stringify(fees));
    leaseApplicationFormData.append("lease_move_in_date", moveInDate.format("MM-DD-YYYY"));
    // leaseApplicationFormData.append("documents", leaseFiles);

    const hasMissingType = !checkFileTypeSelected();
    console.log("HAS MISSING TYPE", hasMissingType);

    if (hasMissingType) {
      setShowMissingFileTypePrompt(true);
      setShowSpinner(false);
      return;
    }

    if (leaseFiles.length) {
      const documentsDetails = [];
      [...leaseFiles].forEach((file, i) => {
        leaseApplicationFormData.append(`file-${i}`, file, file.name);
        const fileType = leaseFileTypes[i] || "";
        const documentObject = {
          // file: file,
          fileIndex: i, //may not need fileIndex - will files be appended in the same order?
          fileName: file.name, //may not need filename
          fileType: fileType,
        };
        documentsDetails.push(documentObject);
      });
      leaseApplicationFormData.append("lease_documents_details", JSON.stringify(documentsDetails));
    }

    // for (let [key, value] of leaseApplicationFormData.entries()) {
    //   console.log(key, value);
    // }

    // await fetch(
    //   `http://localhost:4000/leaseApplication`,
    //   {
    //     method: "PUT",
    //     body: leaseApplicationFormData
    //   }
    // );
    await fetch(`${APIConfig.baseURL.dev}/leaseApplication`, {
      method: "PUT",
      body: leaseApplicationFormData,
    });

    const receiverPropertyMapping = {            
      [application.tenant_uid]: [property.property_uid],
    };

    await fetch(`${APIConfig.baseURL.dev}/announcements/${getProfileId()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        announcement_title: "New Lease created",
        announcement_msg: "You have a new lease to be approved for your property",
        announcement_sender: getProfileId(),
        announcement_date: new Date().toDateString(),
        // announcement_properties: property.property_uid,
        announcement_properties: JSON.stringify(receiverPropertyMapping),        
        announcement_mode: "LEASE",
        announcement_receiver: [application.tenant_uid],
        announcement_type: ["Text", "Email"],
      }),
    });
    navigate("/managerDashboard");
    setShowSpinner(false);
  };
  return (
    <ThemeProvider theme={theme}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          backgroundColor: "#F2F2F2",
          borderRadius: "10px",
          margin: "10px",
          padding: "15px",
          fontFamily: "Source Sans Pro",
        }}
      >
        <Grid container>
          <Grid item xs={1}>
            <Button
              sx={{
                "&:hover, &:focus, &:active": {
                  backgroundColor: "#F2F2F2",
                },
              }}
              onClick={() => navigate(-1)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 8L2.58579 9.41421L1.17157 8L2.58579 6.58579L4 8ZM9 21C7.89543 21 7 20.1046 7 19C7 17.8954 7.89543 17 9 17L9 21ZM7.58579 14.4142L2.58579 9.41421L5.41421 6.58579L10.4142 11.5858L7.58579 14.4142ZM2.58579 6.58579L7.58579 1.58579L10.4142 4.41421L5.41421 9.41421L2.58579 6.58579ZM4 6L14.5 6L14.5 10L4 10L4 6ZM14.5 21L9 21L9 17L14.5 17L14.5 21ZM22 13.5C22 17.6421 18.6421 21 14.5 21L14.5 17C16.433 17 18 15.433 18 13.5L22 13.5ZM14.5 6C18.6421 6 22 9.35786 22 13.5L18 13.5C18 11.567 16.433 10 14.5 10L14.5 6Z"
                  fill="#3D5CAC"
                />
              </svg>
            </Button>
          </Grid>
          <Grid item xs={11} textAlign="center" sx={{ paddingTop: "5px", paddingRight: "30px" }}>
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
              src={propertyImage}
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
              {property.property_available_to_rent === 1 ? "Not Rented" : "Rented"}
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
        <Grid container spacing={10} sx={{ paddingBottom: 5 }}>
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
            <Stack spacing={-2} m={2}>
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
                className={classes.root}

                // sx={{
                //   "& .MuiFormControl-root": {
                //     backgroundColor: "#D6D5DA",
                //     borderRadius: 10,
                //     height: 40,
                //     paddingBottom: "15px",
                //   },
                // }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <hr />
          </Grid>
          {console.log("Fees right before we loop through it", fees)}
          {fees.map((row) => (
            <Grid item xs={12} key={row.id}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <Stack spacing={-2} m={2}>
                    <Typography
                      sx={{
                        color: theme.typography.propertyPage.color,
                        fontFamily: "Source Sans Pro",
                        fontWeight: theme.typography.common.fontWeight,
                        fontSize: theme.typography.smallFont,
                      }}
                    >
                      {"Fee Name "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField name="fee_name" value={row.fee_name} variant="filled" fullWidth className={classes.root} onChange={(e) => handleFeeChange(e, row.id)} />
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={-2} m={2}>
                    <Typography
                      sx={{
                        color: theme.typography.propertyPage.color,
                        fontFamily: "Source Sans Pro",
                        fontWeight: theme.typography.common.fontWeight,
                        fontSize: theme.typography.smallFont,
                      }}
                    >
                      {"Charge "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField name="charge" value={row.charge} variant="filled" fullWidth className={classes.root} onChange={(e) => handleFeeChange(e, row.id)} />
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={-2} m={2}>
                    <Typography
                      sx={{
                        color: theme.typography.propertyPage.color,
                        fontFamily: "Source Sans Pro",
                        fontWeight: theme.typography.common.fontWeight,
                        fontSize: theme.typography.smallFont,
                        paddingBottom: 5,
                      }}
                    >
                      {"Frequency "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Select
                      value={row.frequency}
                      size="small"
                      fullWidth
                      onChange={(e) => handleFrequencyChange(e, row.id)}
                      placeholder="Select frequency"
                      className={classes.select}
                    >
                      <MenuItem value="One-time">One-time</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Bi-Weekly">Bi-Weekly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                      <MenuItem value="Annually">Annually</MenuItem>
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={-2} m={2}>
                    <Typography
                      sx={{
                        color: theme.typography.propertyPage.color,
                        fontFamily: "Source Sans Pro",
                        fontWeight: theme.typography.common.fontWeight,
                        fontSize: theme.typography.smallFont,
                      }}
                    >
                      {"Due By "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    {row.frequency === "Monthly" && (
                      <TextField
                        name="due_by"
                        value={row.due_by !== null && row.due_by !== "" ? row.due_by : ""}
                        variant="filled"
                        fullWidth
                        className={classes.root}
                        onChange={(e) => handleFeeChange(e, row.id)}
                        InputProps={{
                          endAdornment: <InputAdornment position="start">{getDateAdornmentString(row.due_by)}</InputAdornment>,
                        }}
                      />
                    )}
                    {(row.frequency === "One-time" || row.frequency === "Annually") && (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={row.due_by_date !== null && row.due_by_date !== "" ? dayjs(row.due_by_date) : dayjs()}
                          minDate={dayjs()}
                          onChange={(v) => handleDueByDateChange(v, row.id)}
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
                    )}
                    {(row.frequency === "Weekly" || row.frequency === "Bi-Weekly") && (
                      <Box
                        sx={{
                          paddingTop: "10px",
                        }}
                      >
                        <Select
                          name="due_by"
                          value={row.due_by !== null ? valueToDayMap.get(row.due_by) : ""}
                          size="small"
                          fullWidth
                          onChange={(e) => handleDueByChange(e, row.id, "weekly")}
                          placeholder="Select Due By Day"
                          className={classes.select}
                          sx={{
                            margin: "auto",
                          }}
                        >
                          {row.frequency &&
                            row.frequency === "Weekly" &&
                            dayOptionsForWeekly.map((day) => (
                              <MenuItem key={day.value} value={day.value}>
                                {day.label}
                              </MenuItem>
                            ))}
                          {row.frequency &&
                            row.frequency === "Bi-Weekly" &&
                            dayOptionsForBiWeekly.map((day) => (
                              <MenuItem key={day.value} value={day.value}>
                                {day.label}
                              </MenuItem>
                            ))}
                        </Select>
                      </Box>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={-2} m={2}>
                    <Typography
                      sx={{
                        color: theme.typography.propertyPage.color,
                        fontFamily: "Source Sans Pro",
                        fontWeight: theme.typography.common.fontWeight,
                        fontSize: theme.typography.smallFont,
                      }}
                    >
                      {"Available To Pay "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    {(row.frequency === "Monthly" || row.frequency === "One-time" || row.frequency === "Annually") && (
                      <TextField
                        name="available_topay"
                        value={row.available_topay}
                        variant="filled"
                        fullWidth
                        className={classes.root}
                        onChange={(e) => handleFeeChange(e, row.id)}
                        InputProps={{
                          endAdornment: <InputAdornment position="start">days before</InputAdornment>,
                        }}
                      />
                    )}
                    {(row.frequency === "Weekly" || row.frequency === "Bi-Weekly") && (
                      <Box
                        sx={{
                          paddingTop: "10px",
                        }}
                      >
                        <Select
                          name="available_topay"
                          value={row.available_topay !== null ? row.available_topay : ""}
                          size="small"
                          fullWidth
                          onChange={(e) => handleAvailableToPayChange(e, row.id, "weekly")}
                          placeholder="Select Available to Pay By Day"
                          className={classes.select}
                        >
                          {row.frequency &&
                            row.frequency === "Weekly" &&
                            availableToPayOptionsForWeekly.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          {row.frequency &&
                            row.frequency === "Bi-Weekly" &&
                            availableToPayOptionsForBiWeekly.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                        </Select>
                      </Box>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={-2} m={2}>
                    <Typography
                      sx={{
                        color: theme.typography.propertyPage.color,
                        fontFamily: "Source Sans Pro",
                        fontWeight: theme.typography.common.fontWeight,
                        fontSize: theme.typography.smallFont,
                      }}
                    >
                      {"Late By "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    {(row.frequency === "Monthly" || row.frequency === "One-time" || row.frequency === "Annually") && (
                      <TextField
                        name="late_by"
                        value={row.late_by}
                        variant="filled"
                        fullWidth
                        className={classes.root}
                        onChange={(e) => handleFeeChange(e, row.id)}
                        InputProps={{
                          endAdornment: <InputAdornment position="start">days after</InputAdornment>,
                        }}
                      />
                    )}
                    {(row.frequency === "Weekly" || row.frequency === "Bi-Weekly") && (
                      <Box
                        sx={{
                          paddingTop: "10px",
                        }}
                      >
                        <Select
                          name="late_by"
                          value={row.late_by !== null ? row.late_by : ""}
                          size="small"
                          fullWidth
                          onChange={(e) => handleLateByChange(e, row.id, "weekly")}
                          placeholder="Select Late By Day"
                          className={classes.select}
                        >
                          {row.frequency &&
                            row.frequency === "Weekly" &&
                            lateByOptionsForWeekly.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          {row.frequency &&
                            row.frequency === "Bi-Weekly" &&
                            lateByOptionsForBiWeekly.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                        </Select>
                      </Box>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={-2} m={2}>
                    <Typography
                      sx={{
                        color: theme.typography.propertyPage.color,
                        fontFamily: "Source Sans Pro",
                        fontWeight: theme.typography.common.fontWeight,
                        fontSize: theme.typography.smallFont,
                      }}
                    >
                      {"Late Fee "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField name="late_fee" value={row.late_fee} variant="filled" fullWidth className={classes.root} onChange={(e) => handleFeeChange(e, row.id)} />
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={-2} m={2}>
                    <Typography
                      sx={{
                        color: theme.typography.propertyPage.color,
                        fontFamily: "Source Sans Pro",
                        fontWeight: theme.typography.common.fontWeight,
                        fontSize: theme.typography.smallFont,
                      }}
                    >
                      {"Late Fee Per Day "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                      name="perDay_late_fee"
                      value={row.perDay_late_fee}
                      variant="filled"
                      fullWidth
                      className={classes.root}
                      onChange={(e) => handleFeeChange(e, row.id)}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Button
                      onClick={() => deleteFeeRow(row.id)}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#CB8E8E",
                        color: "#160449",
                      }}
                    >
                      Delete Fee
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              {/* {row.id === fees.length ? (
                <Stack
                  direction="row"
                  sx={{
                    display: "flex",
                  }}
                >
                <Box
                    sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    }}
                >
                    <Button onClick={deleteFeeRow(row.id)}
                        sx={{
                            textTransform: "none",
                            backgroundColor: "#9EAED6",
                            color: "#160449"
                        }}>
                        Delete Fee
                    </Button>
                </Box>
                </Stack>
              ) : (
                <hr />
              )} */}
            </Grid>
          ))}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={addFeeRow}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#9EAED6",
                  color: "#160449",
                }}
              >
                Add Fee
              </Button>
            </Box>
          </Grid>
          {leaseFiles.length ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "7px",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    padding: "5px",
                    color: "#3D5CAC",
                    width: "100%",
                  }}
                >
                  Added Documents:
                  {[...leaseFiles].map((f, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          // height: '16px',
                          width: "50%", // Adjust the width as needed
                          padding: "8px", // Adjust the padding as needed
                        }}
                      >
                        {f.name}
                      </Box>
                      <Select
                        value={leaseFileTypes[i]}
                        label="Document Type"
                        onChange={(e) => {
                          const updatedTypes = [...leaseFileTypes];
                          updatedTypes[i] = e.target.value;
                          setLeaseFileTypes(updatedTypes);
                        }}
                        required
                        sx={{
                          backgroundColor: "#D6D5DA",
                          height: "16px",
                          width: "40%", // Adjust the width as needed
                          padding: "8px", // Adjust the padding as needed
                        }}
                      >
                        <MenuItem value={"contract"}>Lease Agreement</MenuItem>
                        <MenuItem value={"other"}>Other</MenuItem>
                      </Select>
                      <Button
                        variant="text"
                        onClick={() => {
                          // setContractFiles(prevFiles => prevFiles.filter((file, index) => index !== i));
                          handleRemoveFile(i);
                        }}
                        sx={{
                          width: "10%",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#3D5CAC",
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 19, color: "#3D5CAC" }} />
                      </Button>
                    </Box>
                  ))}
                  {showMissingFileTypePrompt && (
                    <Box
                      sx={{
                        color: "red",
                        fontSize: "13px",
                      }}
                    >
                      Please select document types for all documents before proceeding.
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          ) : (
            <></>
          )}
          <Grid item xs={12}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "5px",
                  color: "#3D5CAC",
                }}
              >
                <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                  <DescriptionIcon sx={{ fontSize: 19, color: "#3D5CAC" }} /> Add Document
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".doc,.docx,.txt,.pdf"
                  hidden
                  onChange={(e) => setLeaseFiles((prevFiles) => [...prevFiles, ...e.target.files])}
                  multiple
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            {showMissingFieldsPrompt && (
              <Box
                sx={{
                  color: "red",
                  fontSize: "13px",
                }}
              >
                Please fill out all required fields.
              </Box>
            )}
            {showInvalidDueDatePrompt && (
              <Box
                sx={{
                  color: "red",
                  fontSize: "13px",
                }}
              >
                Please enter valid due dates in "MM-DD-YYYY" format for all fees.
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", paddingBottom: 5 }}>
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
              {application?.lease_status === "NEW" ? "Create Lease" : "Update Lease"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default TenantLease;
