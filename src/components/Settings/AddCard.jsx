import React, { Component, useState, useEffect  } from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, TextField, AccordionSummary, AccordionDetails, Grid } from '@mui/material';
import theme from '../../theme/theme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { useNavigate, useLocation } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { alpha, makeStyles } from "@material-ui/core/styles";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiFilledInput-root": {
        backgroundColor: "#D6D5DA", // Update the background color here
        borderRadius: 10,
        height: 30,
        marginBlock: 10,
      },
    },
  }));
export default function AddCard() {
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    let   owner_data = location.state.owner_data;

    const [modifiedData, setModifiedData] = useState({ 'owner_uid': owner_data?.owner_uid, });
    const [isEdited,     setIsEdited]     = useState(false);

    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [cardHolderName,   setCardHolderName]   = useState('');
    const [expiryDate,       setExpiryDate]       = useState('');
    const [CVV,              setCVV]              = useState('');


    const handleInputChange = (event) => {
      console.log("Input changed")
      const { name, value } = event.target;
      // console.log(name)
      // console.log(value)

      if (name === 'credit_card_number') {
        setCreditCardNumber(value);
      } else if (name === 'card_holder_name') {
        setCardHolderName(value);
      } else if (name === 'expiry_date') {
        setExpiryDate(value);
      } else if (name === 'CVV') {
        setCVV(value);
      }
      setModifiedData((prevData) => ({
          ...prevData,
          [name]: value
      }));

      setIsEdited(true);
  }

  const handleSubmit = (event) => {
      event.preventDefault();
      console.log("FORM SUBMITTED");
      console.log(modifiedData);

      const headers = { 
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Credentials":"*"
      };

      // if(isEdited){
      //     console.log("EDITED")
      //     // axios.put('http://localhost:4000/ownerProfile', modifiedData, headers)
      //     axios.put('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile', modifiedData, headers)
      //     .then((response) => {
      //         console.log('Data updated successfully');
      //         setIsEdited(false); // Reset the edit status
      //         navigate(-1)
      //     })
      //     .catch((error) => {
      //         if(error.response){
      //             console.log(error.response.data);
      //         }
      //     });
      // }
  }




    return (
        <ThemeProvider theme={theme}>
          <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%', // Take up full screen width
                height: '100vh', // Set the Box height to full view height
                justifyContent: 'flex-start', // Align items at the top
            }}
          >
            <Box
            style={{
                width: '100%',
                backgroundColor: theme.palette.custom.bgBlue,
                height: '25%', // 25% of the container's height
            }}>
                <Box
                component="span"
                display= 'flex'
                margin='10px'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'>
                    <UTurnLeftIcon 
                    sx={{
                        transform: "rotate(90deg)", 
                        color: theme.typography.secondary.white, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont, 
                        padding: 5,
                        position: 'absolute',
                        left: 0
                            }}
                    onClick={()=>{navigate(-1)}}/>
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.secondary.white, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    Settings
                    </Typography>
                </Box>
            <Paper
              style={{
                margin: '30px', // Margin around the paper
                padding: theme.spacing(2),
                backgroundColor: theme.palette.primary.main,
                width: '85%', // Occupy full width with 25px margins on each side
                [theme.breakpoints.down('sm')]: {
                    width: '80%',
                },
                [theme.breakpoints.up('sm')]: {
                    width: '50%',
                },
              }}
            >
                <Box
                component="span"
                display= 'flex'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'
                flexDirection="column">
                    <AccountCircleIcon
                    sx={{
                        color: theme.typography.common.blue,
                        width: 45,
                        height:45,
                        position: 'absolute',
                        left: 0
                    }}
                    ></AccountCircleIcon>
                    <>
                    <Stack
                    direction="row"
                    justifyContent="center"
                    >
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.primary.black, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    {owner_data.owner_first_name? owner_data.owner_first_name : '<FIRST_NAME>'} {owner_data.owner_last_name? owner_data.owner_last_name : '<LAST_NAME>'}
                    </Typography>
                    </Stack>
                    <Stack
                    direction="row"
                    justifyContent="center"
                    >
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.common.blue, 
                        fontWeight: theme.typography.light.fontWeight, 
                        fontSize:theme.typography.primary.smallFont}}>
                    Owner Profile
                    </Typography>
                    </Stack>
                    </>
                </Box>
                <hr/>
                
                <Stack m={5}>
                <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Enter Card Details</Typography>
                </Stack>
                <hr/>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    autoComplete="off"
                    id="editProfileForm"
                >
                  <Stack spacing={-2} m={5}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Card Number</Typography>
                  <TextField name="credit_card_number" value={creditCardNumber} onChange={handleInputChange} variant="filled" fullWidth placeholder="0000 0000 0000 0000" type='password' className={classes.root}></TextField>
                  </Stack>
                  
                  <Stack spacing={-2} m={5}>
                  <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Card Holder Name</Typography>
                  <TextField name="card_holder_name" value={cardHolderName} onChange={handleInputChange} variant="filled" fullWidth placeholder="ex. Marie Schrader" className={classes.root}></TextField>
                  </Stack>
                  
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={4}>
                      <Stack spacing={-2} m={4}>
                      <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>Expiry Date</Typography>
                      <TextField name="expiry_date" value={expiryDate} onChange={handleInputChange} variant="filled" fullWidth placeholder="MM/YYYY" className={classes.root}></TextField>
                      </Stack>
                  </Grid>
                  <Grid item xs={4}>
                      <Stack spacing={-2} m={4}>
                      <Typography sx={{ color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight }}>CVV/CVC</Typography>
                      <TextField name="CVV" value={CVV} onChange={handleInputChange} variant="filled" fullWidth placeholder="3-4 digits" className={classes.root}></TextField>
                      </Stack>
                  </Grid>
                  <Grid item xs={4}>
                      
                  </Grid>
                  </Grid>
                
                  <hr/>
                
                  <Button
                    variant="contained"
                    type="submit"
                    form="editProfileForm" 
                    sx={{
                      paddingLeft: "2%",
                      paddingRight: "2%",
                      background: "#3D5CAC",
                      color: theme.palette.background.default,
                      width: `100%`,
                      height: `15%`,
                      borderRadius: "15px",
                      fontSize: theme.typography.smallFont,
                      fontWeight: theme.typography.primary.fontWeight,
                      textTransform: "none",
                    }}
                  >
                    {"Add Card"}
                  </Button>
                </Box>
            </Paper>
            </Box>
            </Box>
        </ThemeProvider>
    )
}