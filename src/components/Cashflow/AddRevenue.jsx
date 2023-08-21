import React, { useState } from 'react';
import { Paper, Box, Stack, ThemeProvider, FormControl, Select, MenuItem, FormControlLabel, Typography, TextField, IconButton, DialogTitle, Checkbox, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropertyListData from '../Property/PropertyData';
import theme from '../../theme/theme';
import File_dock_add from '../../images/File_dock_add.png';
import { useNavigate } from "react-router-dom";
import { post, put } from "../utils/api";
import { alpha, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiFilledInput-root": {
            backgroundColor: '#F2F2F2', // Update the background color here
            borderRadius: 10,
            height: 30,
            marginBlock: 10,
        }
      }
}));

const AddRevenue = (props) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [category, setCategory] = useState('Deposits');
    const [frequency, setFrequency] = useState('Monthly');
    const [amount, setAmount] = useState('');
    const [propertyList, setPropertyList] = useState([]);
    const [payable, setPayable] = useState('Property Manager');    
    const [selectedProperty, setSelectedProperty] = useState('');

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
    }
    const handlePayableChange = (event) => {
        setPayable(event.target.name);
        };
    const handleAddRevenue = async () => {
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
    }
    return (
        <>
            <ThemeProvider theme={theme}>
            <PropertyListData setPropertyList={setPropertyList}></PropertyListData>
                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%', // Take up full screen width
                        minHeight: '100vh', // Set the Box height to full height
                        marginTop: theme.spacing(2), // Set the margin to 20px
                    }}
                >
                    <Paper
                        style={{
                            margin: '30px',
                            padding: 20,
                            // backgroundColor: theme.palette.primary.main,
                            backgroundColor: theme.palette.custom.yellow,
                            width: '85%', // Occupy full width with 25px margins on each side
                            [theme.breakpoints.down('sm')]: {
                                width: '80%',
                            },
                            [theme.breakpoints.up('sm')]: {
                                width: '50%',
                            },
                        }}
                    >
                        <IconButton
                            aria-label="close"
                            onClick={() => navigate(-1)}
                            sx={{
                                position: 'sticky',
                                left: '90vw',
                                top: 1,
                                color: theme.typography.common.blue,
                                fontWeight: theme.typography.common.fontWeight
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Stack
                            direction="row"
                            justifyContent="center"
                        >
                            <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight }}>
                                Add Revenue
                            </Typography>
                        </Stack>

                        <Stack
                            spacing={-2}
                        >
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>
                            Property
                        </Typography>
                        <FormControl variant="filled" fullWidth className={classes.root}>
                        <Select
                            value={selectedProperty}
                            onChange={handlePropertyChange}
                            variant="filled"
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                            Select Property
                            </MenuItem>
                            {propertyList.map((option, index) => (
                            <MenuItem key={index} value={option}>
                            {option.property_address}{", "}{option.property_unit}{", "}
                            {option.property_city}, {option.property_state}{" "}{option.property_zip}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        </Stack>
                        
                        <Stack
                            spacing={-2}
                        >
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>
                            Category
                        </Typography>
                        <FormControl variant="filled" fullWidth className={classes.root}>
                            <Select
                            labelId="category-label"
                            id="category"
                            defaultValue='Deposits'
                            value={category}
                            onChange={handleCategoryChange}
                            >
                            <MenuItem value="Deposits">Deposits</MenuItem>
                            <MenuItem value="Extra Charges">Extra Charges</MenuItem>
                            <MenuItem value="Late Fee">Late Fee</MenuItem>
                            <MenuItem value="Maintenance">Maintenance</MenuItem>
                            <MenuItem value="Rent">Rent</MenuItem>
                            <MenuItem value="Repairs">Repairs</MenuItem>
                            <MenuItem value="Utilities">Utilities</MenuItem>
                            </Select>
                        </FormControl>
                        </Stack>

                        <Stack
                            spacing={-2}
                        >
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>
                            Amount
                        </Typography>
                        <TextField 
                        variant='filled' 
                        className={classes.root}
                        fullWidth 
                        placeholder='$' 
                        type='number'
                        value= {amount}
                        onChange= {handleAmountChange}
                        ></TextField>
                        </Stack>

                        <Stack
                        spacing={-2}
                        >
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>
                            Payment Date
                        </Typography>
                        <TextField className={classes.root} type='date' variant='filled' fullWidth placeholder='mm/dd/yyyy'></TextField>
                        <FormControlLabel control={<Checkbox sx={{color: theme.typography.common.blue}}/>} label="Already Received" sx={{color: theme.typography.common.blue}}/>
                        </Stack>

                        <Stack
                            spacing={-2}
                        >
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>
                            Frequency
                        </Typography>
                        <FormControl variant="filled" fullWidth className={classes.root}>
                            <Select
                            defaultValue='Monthly'
                            value={frequency}
                            onChange={handleFrequencyChange}
                            >
                            <MenuItem value="Monthly">Monthly</MenuItem>
                            <MenuItem value="Yearly">Yearly</MenuItem>
                            </Select>
                        </FormControl>
                        </Stack>

                        <Stack
                            spacing={-2}
                        >
                        <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>
                            Description
                        </Typography>
                        <TextField className={classes.root} variant='filled' fullWidth placeholder='Add Description'></TextField>
                        </Stack>

                        <Box
                        component="span"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        // onClick={()=>{handleButtonClick('ExpectedCashflow')}}
                        >
                            <Stack>
                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>
                                Payable By?
                            </Typography>
                            <FormControlLabel 
                            control={
                                <Checkbox 
                                sx={{color: theme.typography.common.blue}}
                                name='Property Manager'
                                checked={payable==='Property Manager'}
                                onChange={handlePayableChange}/>} 
                            label="Property Manager" 
                            sx={{color: theme.typography.common.blue}}/>
                            <FormControlLabel 
                            control={
                                <Checkbox 
                                sx={{color: theme.typography.common.blue}}
                                name='Tenant'
                                checked={payable==='Tenant'}
                                onChange={handlePayableChange}/>} 
                            label="Tenant" 
                            sx={{color: theme.typography.common.blue}}/>
                            </Stack>
                            <Stack>
                            <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>
                                Add File
                            </Typography>
                            <IconButton sx={{backgroundColor: 'white', width: 70, height: 70, borderRadius: 0, margin: 5}}>
                                <img src={File_dock_add} ></img>
                            </IconButton>
                            </Stack>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: theme.palette.custom.blue,
                                color: theme.typography.secondary.white,
                                fontWeight: theme.typography.primary.fontWeight
                            }}
                            onClick={handleAddRevenue}
                        >
                            + Add Revenue
                        </Button>
                    </Paper>
                </Box>
            </ThemeProvider>
        </>
    )
}
export default AddRevenue;