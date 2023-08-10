import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    ThemeProvider,
    Paper,
    Button,
    Typography,
    Stack,
    Grid,
    TextField,
    IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import theme from "../../theme/theme";
import { alpha, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    input: {
      background: "#000000"
    }
}));
  
export default function PaymentsTenant(props) {
    const classes = useStyles();
    const navigate = useNavigate();
    
    return (
        <>
            <ThemeProvider theme={theme}>
            <Paper 
            component={Stack} 
            direction="column" 
            justifyContent="center"
            style={{
                justifyContent: 'center',
                width: '100%', // Take up full screen width
                marginTop: '60px', // Set the margin to 20px
            }}>
                <Box
                component="span"
                display= 'flex'
                justifyContent= 'center'
                alignItems= 'center'
                position= 'relative'>
                <IconButton
                    aria-label="close"
                    onClick={() => navigate(-1)}
                    sx={{
                        color: theme.typography.common.blue,
                        fontWeight: theme.typography.common.fontWeight,
                        position: 'absolute',
                        left: 0
                    }}
                >
                    <CloseIcon />
                    </IconButton>
                    <Typography 
                    sx={{
                        justifySelf: 'center',
                        color: theme.typography.primary.black, 
                        fontWeight: theme.typography.primary.fontWeight, 
                        fontSize:theme.typography.largeFont}}>
                    Payments
                    </Typography>
                </Box>
                
                <Paper
                    style={{
                        margin: '25px',
                        padding: 20,
                        backgroundColor: theme.palette.primary.main,
                        height: '25%',
                        [theme.breakpoints.down('sm')]: {
                            width: '80%',
                        },
                        [theme.breakpoints.up('sm')]: {
                            width: '50%',
                        },
                    }}
                >
                    {/* <IconButton
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
                    </IconButton> */}
                    
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Stack
                        direction="row"
                        justifyContent="left"
                        >
                            <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                            Balance
                            </Typography>
                        </Stack>
                        <Stack
                        direction="row"
                        justifyContent="center"
                        >
                            <Typography sx={{color: theme.palette.custom.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                            50$
                            </Typography>
                        </Stack>
                        <Stack
                        direction="row"
                        justifyContent="center"
                        >
                            <Typography sx={{color: theme.palette.custom.blue, fontSize:theme.typography.smallFont}}>
                            Due date: Aug 1st 2023
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack
                        direction="row"
                        justifyContent="center"
                        margin={2}
                        >
                            <Button variant='filled' style={{textTransform: 'none'}} sx={{backgroundColor: theme.palette.custom.buttonBlue, color: theme.palette.background.default, fontSize:theme.typography.smallFont}}>
                            Make Payment
                            </Button>
                        </Stack>
                        <Stack
                        direction="row"
                        justifyContent="center"
                        margin={4}
                        >
                            <Button variant='outlined' style={{textTransform: 'none'}} sx={{borderColor: theme.palette.custom.buttonBlue, color: theme.palette.custom.buttonBlue, fontSize:theme.typography.smallFont}}>
                            Set up Autopay
                            </Button>
                        </Stack>
                    </Grid>
                    </Grid>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        >
                            <TextField
                            variant="filled"
                            InputProps={{ className: classes.input }}
                            fullWidth={true}
                            multiline={true}
                            value={props.content}
                            onChange={(e) => {}}
                            label="Payment Notes"
                            />
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        >
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                            <Grid item xs={3}>
                                Apple
                            </Grid>
                            <Grid item xs={3}>
                                Visa
                            </Grid>
                            <Grid item xs={3}>
                                Paytm
                            </Grid>
                            <Grid item xs={3}>
                                MasterCard
                            </Grid>
                        </Grid>
                    </Stack>
                </Paper>
                
                <Paper
                    style={{
                        margin: '25px',
                        padding: 20,
                        backgroundColor: theme.palette.primary.main,
                        height: '25%',
                        // [theme.breakpoints.down('sm')]: {
                        //     width: '80%',
                        // },
                        // [theme.breakpoints.up('sm')]: {
                        //     width: '50%',
                        // },
                    }}
                >
                <Stack
                direction="row"
                justifyContent="left"
                >
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                    Balance Details
                    </Typography>
                </Stack>   
                </Paper>
                <Paper
                    style={{
                        margin: '25px',
                        padding: 20,
                        backgroundColor: theme.palette.primary.main,
                        height: '25%',
                        // [theme.breakpoints.down('sm')]: {
                        //     width: '80%',
                        // },
                        // [theme.breakpoints.up('sm')]: {
                        //     width: '50%',
                        // },
                    }}
                >
                <Stack
                direction="row"
                justifyContent="left"
                >
                    <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                    30 Day Payment History
                    </Typography>
                </Stack>   
                </Paper>
                </Paper>
        </ThemeProvider>
        </>
        )
    }