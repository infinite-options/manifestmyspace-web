import React, { useEffect, useState } from "react";
import { Paper, Box, Stack, ThemeProvider, FormControl, Select, MenuItem, FormControlLabel, Typography, TextField, IconButton, Checkbox, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../theme/theme";
import File_dock_add from "../../images/File_dock_add.png";
import { useNavigate, useLocation } from "react-router-dom";
import { post, put } from "../utils/api";
import PropertyListData from "../Property/PropertyListData";
import { alpha, makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
// import PropertyData from "../Property/PropertyData";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

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

const AddExpense = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { getProfileId, selectedRole } = useUser();
  const [category, setCategory] = useState("Insurance");
  const [frequency, setFrequency] = useState("Monthly"); // TODO: Monthly and Yearly fees need to be added to the lease in lease_fees
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [propertyList, setPropertyList] = useState(props.propertyList);
  const [payable, setPayable] = useState("Property Manager");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [purPayerId, setPurPayerId] = useState(null); // this needs to be the tenant_id or the PM business_id
  const [isCheckedOne, setIsCheckedOne] = useState(false);
  const [isCheckedTwo, setIsCheckedTwo] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [partialAmount, setPartialAmount] = useState(null);
  const setCurrentWindow = props.setCurrentWindow;

  useEffect(() => {
    setPropertyList(props.propertyList);
  }, [props.propertyList]);

  const handleCheckboxChange = (option) => {
    console.log(option)
    if (option === "already_paid") {
      setIsCheckedOne(!isCheckedOne);
      setIsCheckedTwo(false);
      setSelectedOption("already_paid");
    } else if (option === "partially_paid") {
      setIsCheckedTwo(!isCheckedTwo);
      setIsCheckedOne(false);
      setSelectedOption("partially_paid");
    }
  };

  const [notes, setNotes] = useState("");

  const [edit, setEdit] = useState(location?.state?.edit || false);

  const [itemToEdit, setItemToEdit] = useState(location?.state?.itemToEdit || null);

  useEffect(() => {
    if (edit && itemToEdit){
      console.log("itemToEdit", itemToEdit)
      // setSelectedProperty(itemToEdit.property_uid)
      setCategory(itemToEdit.purchase_type)
      if(!itemToEdit.pur_frequency){
        setFrequency("One Time")
      } else{
        setFrequency(itemToEdit.pur_frequency)
      }
      setAmount(itemToEdit.pur_amount_due)
      setPayable(itemToEdit.pur_payer)
      // setDate(itemToEdit.purchase_date.replace("-", "/"))
      propertyList.find((property) => {
        console.log(property)
        if (property.property_address === itemToEdit.property_address && property.property_unit === itemToEdit.property_unit){
          setSelectedProperty(property)
        }
      })

    }
  }, [edit, itemToEdit]);

  useEffect(() => {
    console.log("this is changing the payer id")
    if (payable === "Property Manager") {
      console.log("Set purPayerId to", selectedProperty.business_uid)
      setPurPayerId(selectedProperty.business_uid)
    } else if (payable === "Tenant") {
      console.log("Set purPayerId to", selectedProperty.tenant_uid)
      setPurPayerId(selectedProperty.tenant_uid)
    } else if (payable === "Owner") {
      console.log("Set purPayerId to", selectedProperty.owner_uid)
      setPurPayerId(selectedProperty.owner_uid)
    }
  }, [payable, selectedProperty]);

  const handlePropertyChange = (event) => {
    setSelectedProperty(event.target.value);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value);
  };
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };
  const handlePartialAmountChange = (event) => {
    setPartialAmount(event.target.value);
  }
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };
  const handlePayableChange = (event) => {
    setPayable(event.target.name);
  };
  const determinePurchaseStatus = () => {
    if (selectedOption === "already_paid") {
      return "PAID";
    } else if (selectedOption === "partially_paid") {
      return "PARTIALLY PAID";
    } else {
      return "UNPAID";
    }
  }
  const handleExpenseChange = async () => {
    console.log("amount ", amount);
    if (edit && itemToEdit){
      console.log("itemToEdit", itemToEdit)
    }
    let data = {
      "pur_property_id": selectedProperty.property_uid,
      "purchase_type": category,
      "pur_cf_type": "expense",
      "purchase_date": date,
      "pur_due_date": date,
      "pur_amount_due": Number(amount),
      "purchase_status": determinePurchaseStatus(), // TODO: default to UNPAID, unless then already completed button is checked
      "pur_notes": notes,
      "pur_description": description,
      "pur_receiver": getProfileId(),
      "pur_initiator": getProfileId(),
      "pur_payer": purPayerId, // this needs to be the tenant_id or the PM business_id
      "pur_frequency": frequency
    };

    if (determinePurchaseStatus() === "PARTIALLY PAID"){
      data["partial_amount"] = Number(partialAmount)
    }
    
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/addExpense',
        headers: { 
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    };
    setShowSpinner(true);
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      setShowSpinner(false);
    })
    .catch((error) => {
      console.log(error);
      setShowSpinner(false);
    });

    let currentDate = new Date();
    let currentMonth = currentDate.toLocaleString("default", { month: "long" });
    let currentYear = currentDate.getFullYear().toString();
    
    if(selectedRole === "OWNER"){
      // navigate("/cashflow", {state: { month: currentMonth, year: currentYear }});
      setCurrentWindow("CASHFLOW_DETAILS");
    } else if (selectedRole === "MANAGER"){
      // navigate("/managerCashflow", {state: { currentWindow: "PROFITABILITY" }});
      setCurrentWindow("PROFITABILITY");
    }
  };
  return (
    
      <ThemeProvider theme={theme}>
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showSpinner}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        {/* <PropertyListData setShowSpinner={setShowSpinner} setPropertyList={setPropertyList}/> */}
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%", // Take up full screen width
            minHeight: "100vh", // Set the Box height to full height
            // marginTop: theme.spacing(2), // Set the margin to 20px
          }}
        >
          <Paper
            style={{
              // margin: "30px",
              padding: 20,
              // backgroundColor: theme.palette.primary.main,
              backgroundColor: theme.palette.primary.pink,
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
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>{edit ? "Edit" : "Add"} Expense</Typography>
            </Stack>
            {/* <form onSubmit={handleExpenseChange}> */}
            <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Property</Typography>
              <FormControl variant="filled" fullWidth className={classes.root}>
                <Select value={selectedProperty} onChange={handlePropertyChange} variant="filled" displayEmpty>
                  <MenuItem value="" disabled>
                    Select Property
                  </MenuItem>
                  {propertyList.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option.property_address}
                      {", "}
                      {option.property_unit}
                      {", "}
                      {option.property_city}, {option.property_state} {option.property_zip}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Category</Typography>
              <FormControl variant="filled" fullWidth className={classes.root}>
                <Select labelId="category-label" id="category" defaultValue="Insurance" value={category} onChange={handleCategoryChange}>
                  <MenuItem value="Insurance">Insurance</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Management">Management</MenuItem>
                  <MenuItem value="Mortgage">Mortgage</MenuItem>
                  <MenuItem value="Repairs">Repairs</MenuItem>
                  <MenuItem value="Taxes">Taxes</MenuItem>
                  <MenuItem value="Utility">Utilities</MenuItem>
                  <MenuItem value="BILL POSTING">BILL POSTING</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Amount</Typography>
              <TextField
                variant="filled"
                fullWidth
                inputProps={{ 
                  autoComplete: 'off'
                }}
                placeholder="$"
                type="number"
                value={amount}
                className={classes.root}
                onChange={handleAmountChange}>
              </TextField>
            </Stack>

            <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Payment Date</Typography>
              <TextField
                className={classes.root}
                type="date"
                variant="filled"
                fullWidth
                placeholder="mm/dd/yyyy"
                value={date}
                onChange={handleDateChange}>
              </TextField>
            </Stack>

            <Stack direction="row" spacing={-2}>
              <FormControlLabel control={<Checkbox checked={isCheckedOne} onChange={() => handleCheckboxChange("already_paid")} sx={{ color: theme.typography.common.blue }} />} label="Already Paid" sx={{ color: theme.typography.common.blue }} />
              <FormControlLabel control={<Checkbox checked={isCheckedTwo} onChange={() => handleCheckboxChange("partially_paid")} sx={{ color: theme.typography.common.blue }} />} label="Partially Paid" sx={{ color: theme.typography.common.blue }} />
            </Stack>

            {isCheckedTwo ? <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Partial Payment Amount</Typography>
              <TextField
                variant="filled"
                fullWidth
                inputProps={{ 
                  autoComplete: 'off'
                }}
                placeholder="$"
                type="number"
                value={partialAmount}
                className={classes.root}
                onChange={handlePartialAmountChange}>
              </TextField>
            </Stack> : null }

            <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Frequency</Typography>
              <FormControl variant="filled" fullWidth className={classes.root}>
                <Select defaultValue="One Time" value={frequency} onChange={handleFrequencyChange}>
                  <MenuItem value="One Time">One Time</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Description</Typography>
              <TextField
                className={classes.root}
                variant="filled"
                inputProps={{ 
                  autoComplete: 'off'
                }}
                fullWidth
                placeholder="Add Description"
                value={description}
                onChange={handleDescriptionChange}
                required
              >
              </TextField>
            </Stack>
            
            <Stack spacing={-2}>
              <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Notes</Typography>
              <TextField
                className={classes.root}
                variant="filled"
                inputProps={{ 
                  autoComplete: 'off'
                }}
                fullWidth
                placeholder="Add Notes"
                value={notes}
                onChange={handleNotesChange}>
              </TextField>
            </Stack>

            <Box
              component="span"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              // onClick={()=>{handleButtonClick('ExpectedCashflow')}}
            >
              <Stack>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Reimbursable?</Typography>
                <FormControlLabel
                  control={
                    <Checkbox sx={{ color: theme.typography.common.blue }} name="Property Manager" checked={payable === "Property Manager"} onChange={handlePayableChange} />
                  }
                  label="By Property Manager"
                  sx={{ color: theme.typography.common.blue }}
                />
                <FormControlLabel
                  control={<Checkbox sx={{ color: theme.typography.common.blue }} name="Tenant" checked={payable === "Tenant"} onChange={handlePayableChange} />}
                  label="By Tenant"
                  sx={{ color: theme.typography.common.blue }}
                />
                <FormControlLabel
                    control={<Checkbox sx={{ color: theme.typography.common.blue }} name="Owner" checked={payable === "Owner"} onChange={handlePayableChange} />}
                    label="Owner"
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
              onClick={handleExpenseChange}
            >
              {edit ? "Edit" : "+ Add"} Expense
            </Button>
            {/* </form> */}
          </Paper>
        </Box>
      </ThemeProvider>
  );
};
export default AddExpense;
