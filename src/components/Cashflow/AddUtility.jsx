import React, { useState } from "react";
import {
  Paper,
  Box,
  Stack,
  ThemeProvider,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Checkbox,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropertyListData from "../Property/PropertyListData";
// import PropertyData from "../Property/PropertyData";
import AddIcon from "@mui/icons-material/Add";
import theme from "../../theme/theme";
import File_dock_add from "../../images/File_dock_add.png";
import { useNavigate } from "react-router-dom";
import { post, put } from "../utils/api";
import { alpha, makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#F2F2F2", // Update the background color here
      borderRadius: 10,
      height: 30,
      marginBlock: 10,
      paddingBottom: '15px', // Add this line for vertically center alignment
      "&:hover, &:focus, &:active": {
        backgroundColor: "#F2F2F2", // Change background color on hover, focus and active states
      },
    },
  },
}));

const AddUtility = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { getProfileId } = useUser();
  const [type, setType] = useState("Electricty");
  const [provider, setProvider] = useState("");
  const [notes, setNotes] = useState("");
  const [splitMethod, setSplitMethod] = useState("Uniformly");
  const [amount, setAmount] = useState("");
  const [propertyList, setPropertyList] = useState([]);
  const [payable, setPayable] = useState("Owner");

  const [dropdowns, setDropdowns] = useState([{}]);

  const handlePropertyChange = (event, index) => {
    const selectedOption = event.target.value;
    const selectedProperty = `${selectedOption.address}, ${selectedOption.unit}`;

    // Update the selectedOption for the specific index
    const updatedDropdowns = dropdowns.map((dropdown, i) => (i === index ? { ...dropdown, selectedOption } : dropdown));

    setDropdowns(updatedDropdowns);
    console.log("amount updatedDropdowns", updatedDropdowns)
  };

  const handleAddDropdown = () => {
    setDropdowns([...dropdowns, { selectedOption: "" }]); // Initialize new dropdown with an empty selected option
  };


  const handleRemoveDropdown = (index) => {
    setDropdowns((prevDropdowns) => prevDropdowns.filter((_, i) => i !== index));
  };

  const getAvailableOptions = (index) => {
    // Get the selected options from all previous dropdowns
    const selectedOptions = dropdowns.slice(0, index).map((dropdown) => dropdown.selectedOption);

    // Filter out the selected options from propertyList
    return propertyList.filter((option) => !selectedOptions.find((selected) => selected === option));
  };

  const handlePayableChange = (event) => {
    setPayable(event.target.name);
  };
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const handleSplitMethodChange = (event) => {
    setSplitMethod(event.target.value);
  };
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };
  const handleProviderChange = (event) => {
    setProvider(event.target.value);
  };
  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };
  const handleAddUtility = async () => {
    console.log("amount amount");
    console.log("amount ", amount);

    const propertyUidArray = dropdowns.map((dropdown) => ({
      property_uid: dropdown.selectedOption.property_uid
    }));

    let data = JSON.stringify({
      "bill_description": notes,
      "bill_created_by": getProfileId(),
      "bill_utility_type": "maintenance",
      "bill_amount": Number(amount),
      "bill_split": splitMethod,
      "bill_property_id": propertyUidArray,
      "bill_docs": [],
      "bill_notes": notes,
      "bill_maintenance_quote_id": ""
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/bills',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
    navigate(-1);
  };

  // const shouldDisplaySplitMethod = dropdowns.length > 1;
  const shouldDisplaySplitMethod = dropdowns && dropdowns.some((dropdown, index) => index > 0 && !!dropdown.selectedOption);

  return (
    <>
      <ThemeProvider theme={theme}>
        <PropertyListData setPropertyList={setPropertyList}></PropertyListData>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%", // Take up full screen width
            minHeight: "100vh", // Set the Box height to full height
            marginTop: theme.spacing(2), // Set the margin to 20px
          }}
        >
          <Paper
            style={{
              margin: "30px",
              padding: 20,
              // backgroundColor: theme.palette.primary.main,
              backgroundColor: theme.palette.primary.mustardYellow,
              width: "85%", // Occupy full width with 25px margins on each side
              [theme.breakpoints.down("sm")]: {
                width: "80%",
              },
              [theme.breakpoints.up("sm")]: {
                width: "50%",
              },
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => navigate(-1)}
              sx={{
                position: "sticky",
                left: "90vw",
                top: 1,
                color: theme.typography.common.blue,
                fontWeight: theme.typography.common.fontWeight,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Stack direction="row" justifyContent="center">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>Add Utility</Typography>
            </Stack>

            <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Property</Typography>
              <>               
                <Stack spacing={2}>
                  {dropdowns.map((dropdown, index) => (
                    <FormControl variant="filled" fullWidth className={classes.root}>
                      <Select
                        key={index}
                        value={dropdown.selectedOption || ""}
                        onChange={(event) => handlePropertyChange(event, index)}
                        variant="filled"
                        displayEmpty
                        fullWidth
                        startAdornment={
                          dropdown.selectedOption && index > 0 ? (
                            <InputAdornment position="start">
                              <IconButton aria-label="close" onClick={() => handleRemoveDropdown(index)} sx={{ color: theme.typography.common.blue, padding: 0 }}>
                                <CloseIcon />
                              </IconButton>
                            </InputAdornment>
                          ) : null
                        }
                      >
                        <MenuItem value="" disabled>
                          Select an option
                        </MenuItem>
                        {getAvailableOptions(index).map((option) => (
                          <MenuItem key={option.id} value={option}>
                            {option.property_address}
                            {", "}
                            {option.property_unit}
                            {", "}
                            {option.property_city}, {option.property_state} {option.property_zip}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ))}
                  <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                    <Typography sx={{ color: theme.typography.common.blue }}>Add Additional Property</Typography>
                    <IconButton aria-label="close" onClick={handleAddDropdown} sx={{ color: theme.typography.common.blue, padding: 0 }}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Stack>
              </>
            </Stack>

            <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Type</Typography>
              <FormControl variant="filled" fullWidth className={classes.root}>
                <Select labelId="category-label" id="category" defaultValue="Electricty" value={type} onChange={handleTypeChange}>
                  <MenuItem value="Electricty">Electricty</MenuItem>
                  <MenuItem value="Trash">Trash</MenuItem>
                  <MenuItem value="Water">Water</MenuItem>
                  <MenuItem value="Wifi">Wifi</MenuItem>
                  <MenuItem value="Gas">Gas</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Box component="span" display="flex" justifyContent="space-between" alignItems="center">
              <FormControl>
                <Stack spacing={-2}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Amount</Typography>
                  <Box width={"98%"}>
                    <TextField
                      className={classes.root}
                      variant="filled"
                      placeholder="$"
                      inputProps={{
                        autoComplete: 'off'
                      }}
                      type="number"
                      value={amount}
                      onChange={handleAmountChange}>
                    </TextField>
                  </Box>
                </Stack>
              </FormControl>
              <FormControl>
                <Stack spacing={-2}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Provider</Typography>
                  <Box width={"98%"}>
                    <TextField
                      className={classes.root}
                      variant="filled"
                      inputProps={{
                        autoComplete: 'off'
                      }}
                      placeholder="Add Provider"
                      value={provider}
                      onChange={handleProviderChange}>
                    </TextField>
                  </Box>
                </Stack>
              </FormControl>
            </Box>

            <Stack spacing={-2}>
              <FormControl>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Due By Date</Typography>
                <TextField className={classes.root} type="date" variant="filled" fullWidth placeholder="mm/dd/yyyy"></TextField>
                <FormControlLabel control={<Checkbox sx={{ color: theme.typography.common.blue }} />} label="Pay with rent" sx={{ color: theme.typography.common.blue }} />
              </FormControl>
            </Stack>

            <Stack spacing={-2}>
              <FormControl>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Notes</Typography>
                <TextField
                  className={classes.root}
                  variant="filled"
                  fullWidth
                  placeholder="Monthly"
                  inputProps={{
                    autoComplete: 'off'
                  }}
                  value={notes}
                  onChange={handleNotesChange}>
                </TextField>
              </FormControl>
            </Stack>

            <Stack spacing={-2}>
              {shouldDisplaySplitMethod && (
                <FormControl>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>
                    Split Method
                  </Typography>
                  <FormControl variant="filled" fullWidth className={classes.root}>
                    <Select defaultValue="Uniformly" value={splitMethod} onChange={handleSplitMethodChange}>
                      <MenuItem value="Uniformly">Uniformly</MenuItem>
                      <MenuItem value="By Number of Tenants">By Number of Tenants</MenuItem>
                      <MenuItem value="By Square Footage">By Square Footage</MenuItem>
                    </Select>
                  </FormControl>
                </FormControl>
              )}
            </Stack>

            <Box
              component="span"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            // onClick={()=>{handleButtonClick('ExpectedCashflow')}}
            >
              <FormControl>
                <Stack>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Payable By?</Typography>
                  <FormControlLabel
                    control={<Checkbox sx={{ color: theme.typography.common.blue }} name="Owner" checked={payable === "Owner"} onChange={handlePayableChange} />}
                    label="Owner"
                    sx={{ color: theme.typography.common.blue }}
                  />
                  <FormControlLabel
                    control={<Checkbox sx={{ color: theme.typography.common.blue }} name="Tenant" checked={payable === "Tenant"} onChange={handlePayableChange} />}
                    label="Tenant"
                    sx={{ color: theme.typography.common.blue }}
                  />
                </Stack>
              </FormControl>
              <FormControl>
                <Stack>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Add Receipt</Typography>
                  <IconButton sx={{ backgroundColor: "white", width: 70, height: 70, borderRadius: 0, margin: 5 }}>
                    <img src={File_dock_add}></img>
                  </IconButton>
                </Stack>
              </FormControl>
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: theme.palette.custom.blue,
                color: theme.typography.secondary.white,
                fontWeight: theme.typography.primary.fontWeight,
              }}
              onClick={() => { console.log("clicked "); handleAddUtility() }}
            >
              + Add Utility
            </Button>
          </Paper>
        </Box>
      </ThemeProvider>
    </>
  );
};
export default AddUtility;
