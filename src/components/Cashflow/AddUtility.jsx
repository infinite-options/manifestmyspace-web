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

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#F2F2F2", // Update the background color here
      borderRadius: 10,
      height: 30,
      marginBlock: 10,
    },
  },
}));

const AddUtility = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [type, setType] = useState("Electricty");
  const [provider, setProvider] = useState("");
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
  };

  const handleAddDropdown = () => {
    setDropdowns([...dropdowns, {}]);
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
  const handleAddUtility = async () => {
    console.log("amount ", amount);
    // const expense = {
    //     pur_property_id: '200-000057',
    //     payer: 'TENANT',
    //     receiver: '200-000057',
    //     purchase_type: category,
    //     // title: title,
    //     description: 1,
    //     amount_due: amount,
    //     purchase_frequency: frequency,
    //     payment_frequency: 1,
    //     next_payment: '2023-12-08',

    //     pur_property_id: "200-000057",
    //     payer: "TENANT",
    //     payerID: "100-000082",
    //     ownerID: "100-000002",
    //     managerID: "600-000001",
    //     tenantID: '100-000007',
    //     splitPercentManager: "40",
    //     splitPercentOwner: "60",
    //     splitPercentTenant: "0",
    //     purchase_type: category,
    //     description: "Test 1",
    //     amount_due: amount,
    //     purchase_frequency: "One-time",
    //     payment_frequency: "One-time",
    //     next_payment: "2023-12-08",
    //     purchase_status: "UNPAID"
    //   };

    // console.log(newExpense);
    //   const response = await post("/createExpenses", expense);
    navigate(-1);
  };
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
                <FormControl variant="filled" fullWidth className={classes.root}>
                  {dropdowns.map((dropdown, index) => (
                    <div key={index}>
                      <Select
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
                    </div>
                  ))}
                  <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                    <Typography sx={{ color: theme.typography.common.blue }}>Add Addiional Property</Typography>
                    <IconButton aria-label="close" onClick={handleAddDropdown} sx={{ color: theme.typography.common.blue, padding: 0 }}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </FormControl>
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
              <Stack spacing={-2}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Amount</Typography>
                <Box width={"98%"}>
                  <TextField className={classes.root} variant="filled" placeholder="$" type="number" value={amount} onChange={handleAmountChange}></TextField>
                </Box>
              </Stack>
              <Stack spacing={-2}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Provider</Typography>
                <Box width={"98%"}>
                  <TextField className={classes.root} variant="filled" placeholder="Add Provider" value={provider} onChange={handleProviderChange}></TextField>
                </Box>
              </Stack>
            </Box>

            <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Due By Date</Typography>
              <TextField className={classes.root} type="date" variant="filled" fullWidth placeholder="mm/dd/yyyy"></TextField>
              <FormControlLabel control={<Checkbox sx={{ color: theme.typography.common.blue }} />} label="Pay with rent" sx={{ color: theme.typography.common.blue }} />
            </Stack>

            <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Notes</Typography>
              <TextField className={classes.root} variant="filled" fullWidth placeholder="Monthly"></TextField>
            </Stack>

            <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Split Method</Typography>
              <FormControl variant="filled" fullWidth className={classes.root}>
                <Select defaultValue="Uniformly" value={splitMethod} onChange={handleSplitMethodChange}>
                  <MenuItem value="Uniformly">Uniformly</MenuItem>
                  <MenuItem value="By Number of Tenants">By Number of Tenants</MenuItem>
                  <MenuItem value="By Square Footage">By Square Footage</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Box
              component="span"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              // onClick={()=>{handleButtonClick('ExpectedCashflow')}}
            >
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
              <Stack>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Add Receipt</Typography>
                <IconButton sx={{ backgroundColor: "white", width: 70, height: 70, borderRadius: 0, margin: 5 }}>
                  <img src={File_dock_add}></img>
                </IconButton>
              </Stack>
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: theme.palette.custom.blue,
                color: theme.typography.secondary.white,
                fontWeight: theme.typography.primary.fontWeight,
              }}
              onClick={handleAddUtility}
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
