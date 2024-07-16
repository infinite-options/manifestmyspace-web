import React, { useEffect, useState } from 'react';
import {
    Grid, Typography, Button, Modal, RadioGroup, FormControlLabel, Radio, Box, Accordion, AccordionSummary, AccordionDetails,
    TextField, MenuItem
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import theme from "../../theme/theme";
import { Close } from '@mui/icons-material';

const formatUtilityName = (name) => name || '';

const UtilityComponent = ({ newUtilities, utilities, utilitiesMap, handleNewUtilityChange }) => {
    console.log('utilcomp', newUtilities);
    return (
        <Grid container sx={{ marginBottom: "5px" , marginTop:'5px'}} spacing={4}>
            <Grid item xs={5} />
            <Grid item xs={7}>
                <Grid container sx={{alignItems:'center', justifyContent:'center'}}>
                    <Grid item xs={6} md={5}>
                        <Typography sx={{ fontSize: "14px", color: "#3D5CAC" , fontWeight:'bold'}}>Current</Typography>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography sx={{ fontSize: "14px", color: "#3D5CAC", fontWeight:'bold' }}>Proposed</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={4} >
                <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC" }}>Utilities Responsibility</Typography>
            </Grid>
            <Grid item xs={3}>
                <Grid container>
                    <Grid item xs={4} md={4}>
                        <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Owner</Typography>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Tenant</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3}>
                <Grid container sx={{ marginBottom: "5px" }}>
                    <Grid item xs={4} md={4}>
                        <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Owner</Typography>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <Typography sx={{ fontSize: "14px", color: "#3D5CAC" }}>Tenant</Typography>
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
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#3D5CAC" }}>{formatUtilityName(utilitiesMap.get(newUtility.utility_type_id))}</Typography>
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

const UtilitiesManager = ({ newUtilities, setNewUtilities, utils, utilitiesMap, remainingUtils, setRemainingUtils }) => {
    const color = theme.palette.form.main;
    const [open, setOpen] = useState(false);
    const [newUtilList, setNewUtilList] = useState([]);
    const [utilities, setUtilities] = useState([]);
    const [selectedAddUtil, setSelectedAddUtil] = useState(null);
    const [newlyAddedUtils, setNewlyAddedUtils] = useState(null);
    const [currentRemainingUtils, setCurrentRemainingUtils] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        console.log("newlyAddedUtils", newlyAddedUtils, newUtilList);
        if (newlyAddedUtils !== null) {
            setNewUtilList((prev) => prev.slice(0, -(newlyAddedUtils.length)));
            setCurrentRemainingUtils(remainingUtils);
            setNewlyAddedUtils(null);
        }
        setOpen(false);
    };

    console.log('Inside Utilities', newUtilities);

    useEffect(() => {
        setNewUtilList(newUtilities);
        setUtilities(utils);
        setCurrentRemainingUtils(remainingUtils);
    }, [newUtilities, utils])

    const onAddUtilTextChange = (e) => {
        setSelectedAddUtil(e.target.value);
    }


    const handleNewUtilityChange = (e, newUtility, utilityIndex) => {
        console.log('change', utilityIndex, newUtility);
        const { value } = e.target;
        setNewUtilList((prevUtilities) => {
            const updatedUtilities = [...prevUtilities];
            const toChange = { ...updatedUtilities[utilityIndex], utility_payer_id: value === 'owner' ? '050-000041' : '050-000043' };
            updatedUtilities[utilityIndex] = toChange;
            console.log('updated util', updatedUtilities);
            return updatedUtilities;
        });
    };


    const onAddUtilitiesClick = () => {
        const utilityTypeId = selectedAddUtil;
        console.log('utilityTypeId', utilityTypeId);
        if (utilityTypeId !== null) {
            const name = utilitiesMap.get(utilityTypeId);

            // Check if the utility already exists in the newUtilities array
            const exists = newUtilList.some(util => util.utility_type_id === utilityTypeId);

            if (!exists) {
                const newUtil = {
                    utility_desc: name,
                    utility_payer: "owner",
                    utility_payer_id: "050-000041",
                    utility_type_id: utilityTypeId
                };
                console.log('Adding new util', newUtil);
                setNewUtilList(prevUtilities => [...prevUtilities, newUtil]);
                setNewlyAddedUtils((prevUtilities) => prevUtilities ? [...prevUtilities, newUtil] : [newUtil]);
                setCurrentRemainingUtils(prevUtils => {
                    const newUtils = new Map(prevUtils);
                    newUtils.delete(utilityTypeId);
                    return newUtils;
                });
            }
        }
    }

    const handleSave = () => {
        console.log('newly added', newlyAddedUtils, newUtilities);

        setNewUtilities(newUtilList);
        setRemainingUtils(currentRemainingUtils);
        handleClose();
    }

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
                                paddingLeft: "50px"
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
                            width: 841,
                            minHeight: 500,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Typography id="add-document-modal" variant="h6" component="h2" textAlign='center' sx={{
                                    color: "#160449",
                                    fontWeight: theme.typography.primary.fontWeight,
                                    fontSize: theme.typography.small,
                                    flexGrow: 1,
                                    textAlign: 'center',
                                }}>
                                    Utilities
                                </Typography>
                                <Button onClick={handleClose} sx={{ ml: 'auto' }}>
                                    <Close sx={{
                                        color: theme.typography.primary.black,
                                        fontSize: '20px',
                                    }} />
                                </Button>
                            </Box>
                            <UtilityComponent
                                newUtilities={newUtilList}
                                utilities={utilities}
                                utilitiesMap={utilitiesMap}
                                handleNewUtilityChange={handleNewUtilityChange}
                                onAddUtilTextChange={onAddUtilTextChange}
                                onAddUtilitiesClick={onAddUtilitiesClick}
                                remainingUtils={currentRemainingUtils}
                            />
                            {/* <Grid item xs={12}> */}
                            <Grid container sx={{ marginBottom: "5px", alignItems: "center" }}>
                                <Grid item xs={1} md={2} />
                                <Grid item sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Box sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <TextField
                                            id="addUtilityText"
                                            select
                                            label="Add Utility"
                                            textAlign="top"
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'visible',
                                                textOverflow: 'clip',
                                                width: "150px",
                                                '& .MuiOutlinedInput-root': {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    '& fieldset': {
                                                        borderColor: '#6e6e6e',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#6e6e6e',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#6e6e6e',
                                                    },
                                                },
                                            }}
                                            onChange={(e) => {
                                                onAddUtilTextChange(e)
                                            }}
                                        >
                                            {currentRemainingUtils && Array.from(currentRemainingUtils.entries()).map(([key, value]) => (
                                                <MenuItem key={key} value={key}>
                                                    {value}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <Button
                                            sx={{
                                                minWidth: "50px",
                                                minHeight: "55px",
                                                marginLeft: "5px",
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                "&:hover, &:focus, &:active": { background: theme.palette.primary.main }
                                            }}
                                            onClick={onAddUtilitiesClick}
                                        >
                                            <AddIcon sx={{ color: theme.typography.primary.black, fontSize: "18px" }} />
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            {/* </Grid> */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: "20px" }}>
                                <Button onClick={handleSave} sx={{
                                    marginRight: '5px', background: "#FFC614",
                                    color: "#160449",
                                    cursor: "pointer",
                                    width: "100px",
                                    height: "31px",
                                    fontWeight: theme.typography.secondary.fontWeight,
                                    fontSize: theme.typography.smallFont,
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#fabd00',
                                    },
                                }}>Save</Button>
                            </Box>
                        </Box>
                    </Modal>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default UtilitiesManager;
