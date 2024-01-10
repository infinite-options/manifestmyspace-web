import React, { useState } from "react";
import { Paper, Box, Stack, ThemeProvider, FormControl, Select, MenuItem, FormControlLabel, Typography, TextField, IconButton, Checkbox, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../theme/theme";
import File_dock_add from "../../images/File_dock_add.png";
import { useNavigate } from "react-router-dom";
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
  const { getProfileId } = useUser();
  const [category, setCategory] = useState("Insurance");
  const [frequency, setFrequency] = useState("Monthly"); // TODO: Monthly and Yearly fees need to be added to the lease in lease_fees
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [propertyList, setPropertyList] = useState([]);
  const [payable, setPayable] = useState("Property Manager");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  const [edit, setEdit] = useState(props.edit || false);

  const [itemToEdit, setItemToEdit] = useState(props.itemToEdit || null);

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
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };
  const handlePayableChange = (event) => {
    setPayable(event.target.name);
  };
  const handleExpenseChange = async () => {
    console.log("amount ", amount);
    if (edit && itemToEdit){
      console.log("itemToEdit", itemToEdit)
    }
    let data = JSON.stringify({
      "pur_property_id": selectedProperty.property_uid,
      "purchase_type": category,
      "pur_cf_type": "expense",
      "purchase_date": date,
      "pur_due_date": date,
      "pur_amount_due": Number(amount),
      "purchase_status": "UNPAID", // TODO: default to UNPAID, unless then already completed button is checked
      "pur_notes": "This is just a note",
      "pur_description": description,
      "pur_receiver": getProfileId(),
      "pur_initiator": getProfileId(),
      "pur_payer": null,
      "pur_frequency": "One-Time"
    });
    
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/addExpense',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
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
    
    navigate(-1);
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showSpinner}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        <PropertyListData setShowSpinner={setShowSpinner} setPropertyList={setPropertyList}></PropertyListData>
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
                  <MenuItem value="Utilities">Utilities</MenuItem>
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
              <FormControlLabel control={<Checkbox sx={{ color: theme.typography.common.blue }} />} label="Already Paid" sx={{ color: theme.typography.common.blue }} />
            </Stack>

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
              >
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
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Reimbursible?</Typography>
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
          </Paper>
        </Box>
      </ThemeProvider>
    </>
  );
};
export default AddExpense;
