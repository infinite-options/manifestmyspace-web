import React from 'react';
import { Paper, Box, Stack, ThemeProvider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import theme from '../../theme/theme';
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from '@mui/material';
import { Select} from "@mui/material";
import { Grid } from '@mui/material';
import { MenuItem} from "@mui/material";
import { useContext } from 'react';
import { useMyContext } from '../../contexts/SettingsACHContext';
import StatusBar from '../../images/status_bar_1.png'


function SelectRole() {

    const navigate = useNavigate();

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
            }}>

            <Box style={{paddingBottom: '10%'}}></Box>
            
            <Paper style={{
                paddingTop: '10%',
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
                position= 'relative'
                flexDirection="column">
                   
                    <>
                    <Stack spacing={-2} m={5} direction="row">
                        <Typography 
                        sx={{ 
                            color: theme.typography.propertyPage.color,
                            fontFamily: 'Source Sans Pro',
                            fontWeight: theme.typography.common.fontWeight, 
                            fontSize:theme.typography.largeFont}}>
                            Select your role(s).
                        </Typography>
                    </Stack>
                    </>
                </Box>
              
                <Stack spacing={-2} m={5}>
                <Button 
                            sx={{
                                paddingLeft:'2%',
                                paddingRight:'2%',
                                background: '#3D5CAC',
                                color: theme.palette.background.default,
                                width: `100%`,
                                height: `15%`,
                                borderRadius: '15px',
                                fontSize:theme.typography.smallFont,
                                fontWeight: theme.typography.primary.fontWeight,
                                textTransform: 'none' 
                            }} onClick={()=>{navigate('/pmProfileName')}} >Property Manager</Button> 
                    
                </Stack>  
                <Stack spacing={-2} m={5}>
                <Button 
                            sx={{
                                paddingLeft:'2%',
                                paddingRight:'2%',
                                background: '#3D5CAC',
                                color: theme.palette.background.default,
                                width: `100%`,
                                height: `15%`,
                                borderRadius: '15px',
                                fontSize:theme.typography.smallFont,
                                fontWeight: theme.typography.primary.fontWeight, 
                                textTransform: 'none'
                            }} onClick={()=>{navigate('/ownerDashboard')}} >Property Manager - Employee</Button> 
                    </Stack>
                    <Stack spacing={-2} m={5}>
                <Button 
                            sx={{
                                paddingLeft:'2%',
                                paddingRight:'2%',
                                background: '#3D5CAC',
                                color: theme.palette.background.default,
                                width: `100%`,
                                height: `15%`,
                                borderRadius: '15px',
                                fontSize:theme.typography.smallFont,
                                fontWeight: theme.typography.primary.fontWeight,
                                textTransform: 'none' 
                            }} onClick={()=>{navigate('/ownerDashboard')}} >Property Owner</Button> 
                    
                </Stack>  
                <Stack spacing={-2} m={5}>
                <Button 
                            sx={{
                                paddingLeft:'2%',
                                paddingRight:'2%',
                                background: '#3D5CAC',
                                color: theme.palette.background.default,
                                width: `100%`,
                                height: `15%`,
                                borderRadius: '15px',
                                fontSize:theme.typography.smallFont,
                                fontWeight: theme.typography.primary.fontWeight, 
                                textTransform: 'none'
                            }} onClick={()=>{navigate('/ownerDashboard')}} >Tenant</Button> 
                    </Stack>

                <Stack spacing={-2} m={5}>
                <Button 
                            sx={{
                                paddingLeft:'2%',
                                paddingRight:'2%',
                                background: '#3D5CAC',
                                color: theme.palette.background.default,
                                width: `100%`,
                                height: `15%`,
                                borderRadius: '15px',
                                fontSize:theme.typography.smallFont,
                                fontWeight: theme.typography.primary.fontWeight, 
                                textTransform: 'none'
                            }} onClick={()=>{navigate('/ownerDashboard')}} >Maintenance</Button> 
                    
                </Stack>  
                <Stack spacing={-2} m={5}>
                <Button 
                            sx={{
                                paddingLeft:'2%',
                                paddingRight:'2%',
                                background: '#3D5CAC',
                                color: theme.palette.background.default,
                                width: `100%`,
                                height: `20%`,
                                borderRadius: '15px',
                                fontSize:theme.typography.smallFont,
                                fontWeight: theme.typography.primary.fontWeight, 
                                textTransform: 'none'
                            }} onClick={()=>{navigate('/ownerDashboard')}} >Maintenance - Employee</Button> 
                    </Stack>
                    <Box style={{paddingBottom: '60%'}}></Box>

                <Button 
                variant="contained"
                sx={{
                    background: '#3D5CAC',
                    color: theme.palette.background.default,
                    width: `100%`,
                    height: `8%`,
                    borderRadius: '10px 10px 10px 10px'
                }} onClick={()=>{navigate('/pmProfileName')}}>Next Step</Button>
                <Stack spacing={-8} m={5}></Stack>
            </Paper>
            </Box>
        </ThemeProvider>
    )
}

export default SelectRole;