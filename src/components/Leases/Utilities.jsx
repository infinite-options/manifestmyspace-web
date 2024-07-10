import React, { useEffect, useState } from 'react';
import {
    Grid, Typography, Button, Modal, RadioGroup, FormControlLabel, Radio, Box,  Accordion, AccordionSummary, AccordionDetails,  
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import theme from "../../theme/theme";

const formatUtilityName = (name) => name || '';

const UtilityComponent = ({ newUtilities, utilities, utilitiesMap, handleNewUtilityChange }) => {
    console.log('utilcomp', newUtilities);
    return (
        <Grid container sx={{ marginBottom: "5px" }}>
             <Grid item xs={1} />
            <Grid item xs={4} >
             <Typography sx={{ fontSize: "14px", fontWeight: "bold", color:"#3D5CAC" }}>Utilities Responsibility</Typography>
            </Grid>
            <Grid item xs={3}>
                <Grid container>
                    <Grid item xs={4} md={4}>
                        <Typography sx={{ fontSize: "14px", color:"#3D5CAC" }}>Owner</Typography>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <Typography sx={{ fontSize: "14px", color:"#3D5CAC" }}>Tenant</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3}>
                <Grid container sx={{ marginBottom: "5px" }}>
                    <Grid item xs={4} md={4}>
                        <Typography sx={{ fontSize: "14px", color:"#3D5CAC" }}>Owner</Typography>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <Typography sx={{ fontSize: "14px", color:"#3D5CAC" }}>Tenant</Typography>
                    </Grid>
                </Grid>
            </Grid>

            {/* utilities map */}
            {newUtilities && newUtilities.map((newUtility, index) => {
                const utilityIndex = utilities.findIndex(u => u.utility_type_id === newUtility.utility_type_id);
                const utility = utilityIndex !== -1 ? utilities[utilityIndex] : null;
                return (
                    <React.Fragment key={newUtility.utility_type_id}>
                        <Grid item xs={2} />
                        <Grid item xs={3} container alignItems="center">
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color:"#3D5CAC" }}>{formatUtilityName(utilitiesMap.get(newUtility.utility_type_id))}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            {utility !== null && (
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={utility.utility_payer_id === "050-000041" ? "owner" : "tenant"}
                                >
                                    <FormControlLabel sx={{ marginLeft: "0px" }} value="owner" control={<Radio size="small" 
                                    sx={{ '&.Mui-checked': { color: "#3D5CAC" } }} />} />
                                    <FormControlLabel sx={{ marginLeft: "0px" }} value="tenant" control={<Radio size="small" 
                                    sx={{ '&.Mui-checked': { color: "#3D5CAC" } }} />} />
                                </RadioGroup>)
                            }
                        </Grid>
                        <Grid item xs={3}>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={newUtility.utility_payer_id === "050-000041" ? "owner" : "tenant"}
                                onChange={(e) => handleNewUtilityChange(e, newUtility, index)}
                            >
                                <FormControlLabel sx={{ marginLeft: "0px" }} value="owner" control={<Radio size="small"  
                                sx={{ '&.Mui-checked': { color: "#3D5CAC" } }} />} />
                                <FormControlLabel sx={{ marginLeft: "0px" }} value="tenant" control={<Radio size="small" 
                                sx={{ '&.Mui-checked': { color: "#3D5CAC" } }} />} />
                            </RadioGroup>
                        </Grid>
                    </React.Fragment>
                )
            })}

            {/* Utilities map end */}
        </Grid>
    );
};

const UtilitiesManager = ({ newUtils, utils, utilitiesMap, handleNewUtilityChange }) => {
    const color = theme.palette.form.main;
    const [open, setOpen] = useState(false);
    const [newUtilities, setNewUtilities] = useState([]);
    const [utilities, setUtilities] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    console.log('Inside Utilities', newUtils);

    useEffect(()=>{
        setUtilities(utils);
        setNewUtilities(newUtils);
    }, [newUtils, utils])

    return (
        <div>
             <Accordion sx={{ backgroundColor: color }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="documents-content"
                    id="documents-header"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography
                            sx={{
                                color: "#160449",
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.small,
                                textAlign: 'center',
                                paddingBottom: "10px",
                                paddingTop: "5px",
                                flexGrow: 1,
                                paddingLeft:"50px"
                            }}
                        >
                            Utilities
                        </Typography>
                        <Button
                            sx={{
                                "&:hover, &:focus, &:active": { background: theme.palette.primary.main },
                                cursor: "pointer",
                                textTransform: "none",
                                minWidth: "40px",
                                minHeight: "40px",
                                width: "40px",
                                fontWeight: theme.typography.secondary.fontWeight,
                                fontSize: theme.typography.smallFont,
                            }}
                            size="small"
                            onClick={handleOpen}
                        >
                            <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "18px" }} />
                        </Button>
                    </Box>
                    </AccordionSummary>
                    <AccordionDetails>
            <UtilityComponent
                newUtilities={newUtilities}
                utilities={utilities}
                utilitiesMap={utilitiesMap}
                handleNewUtilityChange={handleNewUtilityChange}
            />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-utilities-modal"
                aria-describedby="add-utilities-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="add-utilities-modal" variant="h6" component="h2" sx={{ color: theme.typography.primary.black,
                                fontWeight: theme.typography.primary.fontWeight,
                                fontSize: theme.typography.small,
                                textAlign: 'center', marginBottom:"15px"}}>
                        Utilities
                    </Typography>
                    <UtilityComponent
                        newUtilities={newUtilities}
                        utilities={utilities}
                        utilitiesMap={utilitiesMap}
                        handleNewUtilityChange={handleNewUtilityChange}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <Button onClick={handleClose} sx={{ marginRight: '5px', background: "#3D5CAC", color: 'white' }}>Close</Button>
                    </Box>
                </Box>
            </Modal>
            </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default UtilitiesManager;
