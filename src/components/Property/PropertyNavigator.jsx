import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Button, Box, Stack, Paper, Grid, Badge } from '@mui/material';
import theme from '../../theme/theme';
import propertyImage from './propertyImage.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ArrowLeft from './ArrowLeft.png';
import ArrowRight from './ArrowRight.png';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LeaseIcon from './leaseIcon.png';
import CreateIcon from '@mui/icons-material/Create';
import { getPaymentStatusColor, getPaymentStatus } from './PropertyList.jsx';
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import PostAddIcon from '@mui/icons-material/PostAdd';
import { DataGrid } from '@mui/x-data-grid';
import { useUser } from "../../contexts/UserContext";

const maintenanceColumns = [
    { 
      field: 'maintenance_request_uid', 
      headerName: 'UID', 
      flex: 1,
    },
    {
      field: 'maintenance_request_created_date',
      headerName: 'Created Date',
      flex: 1,
    },
    {
      field: 'maintenance_title',
      headerName: 'Title',
      flex: 1,
    },
    {
      field: 'maintenance_request_status',
      headerName: 'Status',
      flex: 1,
    },
];

const getAppColor = (app) => app.lease_status!=="REJECTED"?app.lease_status!=="REFUSED"?"#778DC5":"#874499":"#A52A2A";

export default function PropertyNavigator({index, propertyData}){
    const navigate = useNavigate();
    const { getProfileId, isManager } = useUser();
    const [currentIndex, setCurrentIndex] = useState(index);
    const item = propertyData[currentIndex];
    const [currentId, setCurrentId] = useState(item.property_uid);
    const [activeStep, setActiveStep] = useState(0);
    const [maintenanceData, setMaintenanceData] = useState([{}]);
    const [images, setImages] = useState(JSON.parse(propertyData[currentIndex].property_images));
    const [showSpinner, setShowSpinner] = useState(false);
    const color = theme.palette.form.main
    const maxSteps = images.length;
    const [propertyId, setPropertyId] = useState(propertyData[currentIndex].property_uid)

    //const [propertyId, setPropertyId] = useState('200-000028')
    const [contractsFeeData, setContractsFeeData] = useState([]) 
    const [activeContracts, setActiveContracts] = useState([]) 
    const tenant_detail= (item.lease_start && item.tenant_uid)?  `${item.lease_start}: ${item.tenant_first_name} ${item.tenant_last_name}`:
    "No Tenant";
    const [showIconButton, setShowIconButton]= useState(false);
    const manager_detail= (item.business_uid)?  `${item.business_name}`:     "No Manager"
    const [arrowButton1_color, set_arrow1_color]=useState(tenant_detail=== "No Tenant" && manager_detail==="No Manager"? theme.typography.common.gray : theme.typography.common.blue)
    let arrowButton1_onClick=()=>{
        if (tenant_detail=== "No Tenant" && manager_detail==="No Manager")
            return;
        else
        navigate("/searchManager");
    }
    

    useEffect(() => {
        const getMintenanceForProperty = async () => {
            setShowSpinner(true);
            try {
                console.log("Fetch maintenance data for "+item.property_uid)
                const responseProperty = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceByProperty/${item.property_uid}`);
                // const responseProperty = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceByProperty/200-000040`);
                const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts/${getProfileId()}`);
                if(!response.ok){
                    console.log("Error fetching maintenance data")
                }
                
                 
                const propertyMaintenanceData = await responseProperty.json();
                let propMaintList = propertyMaintenanceData.MaintenanceProjects?.result || []
                propMaintList = propMaintList.filter(m => m.maintenance_request_status !== "COMPLETED" && m.maintenance_request_status !== "CANCELLED")
                setMaintenanceData(propMaintList);
                const contractdata = await response.json();
                console.log("Contract Data", contractdata)

                const contracts = [];
        
                contractdata.result.forEach((contract) => {
                  
                    if (contract.contract_property_id==propertyId) {

                        let obj = {
                            contract_uid: contract.contract_uid,
                            fees: contract.contract_fees,
                            documents: contract.contract_documents,
                            contact: contract.contract_assigned_contacts,
                            contract_status : contract.contract_status,
                            contract_business_id: contract.contract_business_id,
                        }
                        //console.log("C fee "+JSON.stringify(contract.contract_fees))
                        //contracts.push(contract.contract_fees); 
                        contracts.push(obj);   
                        setShowIconButton(true);               
                    }
                });
                
                let activeContractsArray = [];
                let obj = {};
                const feeData = [];
                contracts.forEach((contractfee2) => {

                    if(contractfee2.contract_status=="SENT"){
                        var db = JSON.stringify(contractfee2.fees);
                        let contractArray = JSON.parse(db);
                       
                        obj.contract_uid = contractfee2.contract_uid
                        obj.contract_status = contractfee2.contract_status
                        let contractfee1 = JSON.parse(contractArray)
                        obj.fees = contractfee1;
                        obj.documents = contractfee2.documents;
                        let contactObj = JSON.parse(contractfee2.contact);
                        if (contactObj!==undefined && contactObj!==null){
                            obj.contact = contactObj[0]!==undefined ? contactObj[0].first_name:"";
                        }
                        obj.contact = "";
                        console.log(JSON.stringify(obj))
                        feeData.push(obj)        
                    }else if (contractfee2.contract_status=="ACTIVE"){
                        activeContractsArray.push(contractfee2.contract_business_id)
                    }
                 
                });

                setActiveContracts(activeContractsArray);
                setContractsFeeData(feeData);

            } catch (error) {
                console.log(error);
            }
            setShowSpinner(false);
        }
        getMintenanceForProperty();
    }, []);

    function displayTopMaintenanceItem(){
        if(maintenanceData && maintenanceData.length > 0 && maintenanceData[0].maintenance_request_uid){
            return (
                <DataGrid
                    rows={maintenanceData}
                    columns={maintenanceColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    getRowId={(row) => row.maintenance_request_uid}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                    onRowClick={()=>{}}
                />
            )
        } else {
            return "No Open Maintenance Tickets"
        }
    }

    function numberOfMaintenanceItems(maintenanceItems){
//        console.log("maintenanceItems "+JSON.stringify(maintenanceItems))
        if(maintenanceItems && maintenanceItems.length > 0){
            return maintenanceItems.filter(mi => !!mi.maintenance_request_uid).length
        } else {
            return 0
        }
    }

    function navigateToMaintenanceAccordion(){
        console.log("click to maintenance accordion for property")
        navigate("/maintenance")

        // TODO: Need to send props to /maintenance to navigate to correct tab and item
    }

    
    const handleNextCard = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % propertyData.length);
      const nextId = propertyData[currentIndex+1].property_uid
      setCurrentId(nextId);
      setImages(JSON.parse(propertyData[currentIndex+1].property_images))
      setActiveStep(0);
    };
  
    const handlePreviousCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + propertyData.length) % propertyData.length);
        const previousId = propertyData[currentIndex-1].property_uid
        setCurrentId(previousId);
        setImages(JSON.parse(propertyData[currentIndex-1].property_images))
        setActiveStep(0);
    };
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleManagerChange = () => {
        if(item.business_uid) navigate("/managerDetails", { state: { ownerId: item.owner_uid, managerBusinessId: item.business_uid } });
        else navigate("/searchManager");
    };

    const handleAppClick = (index) => {
        navigate("/tenantApplicationNav", { state:{ index, property: item } });
    };

    return(
        <Paper 
            sx={{
                backgroundColor: theme.palette.form.main,
            }}
            >
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box
                sx={{
                    flexDirection: 'column', // Added this to stack children vertically
                    justifyContent: 'center',
                    width: "100%", // Take up full screen width
                    marginTop: theme.spacing(2), // Set the margin to 20px
                    paddingTop: "20px"
                }}
            > 
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Button onClick={handlePreviousCard} disabled={currentIndex == 0}>
                        {currentIndex === 0 ? (
                            // <img src={ArrowLeft} style={{color: '#A0A0A0', width: '25px', height: '25px', margin:'0px'}}/>
                            <ArrowBackIcon sx={{color: '#A0A0A0', width: '25px', height: '25px', margin:'0px'}}/>
                        ) : (
                            // <img src={ArrowLeft} style={{width: '25px', height: '25px', margin:'0px'}}/>
                            <ArrowBackIcon sx={{color: "#000000", width: '25px', height: '25px', margin:'0px'}}/>
                        )}
                    </Button>
                    <Stack
                        direction="column"
                        margin='0px'
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Typography
                            sx={{color: theme.typography.propertyPage.color, fontWeight: theme.typography.propertyPage.fontWeight, fontSize: '16px'}}
                        >
                            {currentIndex + 1} of {propertyData.length} Properties
                        </Typography>
                    </Stack>
                    <Button onClick={handleNextCard} disabled={currentIndex == propertyData.length-1}>
                        {currentIndex == propertyData.length-1 ? (
                            // <img src={ArrowRight} style={{color: '#A0A0A0', width: '25px', height: '25px', margin:'0px'}}/>
                            <ArrowForwardIcon sx={{color: '#A0A0A0', width: '25px', height: '25px', margin:'0px'}}/>
                        ) : (
                            // <img src={ArrowRight} style={{width: '25px', height: '25px', margin:'0px'}}/>
                            <ArrowForwardIcon sx={{color: "#000000", width: '25px', height: '25px', margin:'0px'}}/>
                        )}
                    </Button>  
                </Stack>
                <Stack
                    alignItems="center"
                    justifyContent="center"
                >
                    <Card
                       sx={{
                        backgroundColor: color,
                        boxShadow: "none",
                        elevation: "0",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                        >
                        <CardContent 
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <Typography sx={{color: theme.typography.propertyPage.color, fontWeight: theme.typography.propertyPage.fontWeight, fontSize: theme.typography.propertyPage.fontSize}} paddingBottom="20px">
                                {item.property_address} {item.property_unit}, {item.property_city} {item.property_state} {item.property_zip}
                            </Typography>
                            <Box
                                sx={{
                                    // display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    // width: "50%",
                                }}
                            >

                                <CardMedia
                                    component="img"
                                    image={images[activeStep]}
                                    sx={{
                                        elevation: "0",
                                        boxShadow: "none",
                                        maxWidth: "500px",
                                        minWidth: "200px",
                                        maxHeight: "500px",
                                        minHeight: "100px",
                                        height: "300px",
                                        objectFit: "cover",
                                        center: "true",
                                        alignContent: "center",
                                        justifyContent: "center",
                                    }}
                                />
                            </Box>
                            <MobileStepper
                                steps={maxSteps}
                                position="static"
                                activeStep={activeStep}
                                variant='text'
                                sx={{
                                    backgroundColor: color,
                                    width: "100%",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    alignItems: "center",
                                    elevation: "0",
                                    boxShadow: "none",

                                }}
                                nextButton={
                                    <Button
                                        size="small"
                                        onClick={handleNext}
                                        disabled={activeStep === maxSteps - 1}
                                    >
                                        {theme.direction === 'rtl' ? (
                                        <KeyboardArrowLeft />
                                        ) : (
                                        <KeyboardArrowRight />
                                        )}
                                    </Button>
                                }
                                backButton={
                                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                        {theme.direction === 'rtl' ? (
                                        <KeyboardArrowRight />
                                        ) : (
                                        <KeyboardArrowLeft />
                                        )}
                                    </Button>
                                }
                            />
                        </CardContent>
                        <Grid container spacing={0}
                            alignContent="center"
                            justifyContent="center"
                            alignItems="center"
                            direction="column"
                            sx={{
                                backgroundColor: getPaymentStatusColor(item.rent_status),
                            }}
                        >   
                            <Grid item xs={12}>
                                <Box  sx={{color:theme.typography.common.blue}}>
                                <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                    <b>Rent Status:</b> {getPaymentStatus(item.rent_status)}
                                </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <CardContent
                            sx={{
                                flexDirection: "column",
                                alignItems: "left",
                                justifyContent: "left",
                                width: "90%",
                            }}
                        >
                            <div
                                style={{
                                    paddingTop: "10px",
                                    paddingLeft: "10px",
                                    alignContent: "left",
                                    justifyContent: "left",
                                    alignItems: "left",
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography
                                            sx={{
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                            }}
                                        >
                                            Rent: ${item.property_listed_rent}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingBottom: "10px"
                                            }}
                                        >
                                            Due: {item.lease_rent_due_by}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {showIconButton && <Button
                                            sx={{
                                                padding: "0px"
                                            }}
                                            onClick={() => navigate('/viewLease')}
                                        >
                                            <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                    paddingRight: "10px"
                                                }}
                                            >
                                                View Lease
                                            </Typography>
                                            <img src={LeaseIcon} style={{ margin:'0px'}}/>
                                        </Button>}
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                Lease Expiring : {item.lease_end}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            Property Value
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                ${item.property_value}

                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            $ Per Sqft
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                ${item.property_area.toFixed(2)}
                                                

                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            <Button
                                                sx={{
                                                    paddingLeft: "0px",
                                                    "&:hover, &:focus, &:active": {
                                                        backgroundColor: color,
                                                    },
                                                }}
                                                onClick={() => {navigate('/editProperty', 
                                                    { state: {
                                                        index, 
                                                        propertyList:propertyData 
                                                    }}
                                                )}}
                                            >
                                                <CreateIcon sx={{
                                                    color: theme.typography.common.blue,
                                                    paddingLeft: "0px"
                                                }}/>
                                            </Button>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            Type
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                {item.property_type}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            Sqft
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                            {item.property_area}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            Bed
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                {item.property_num_beds}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            Bath
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                {item.property_num_baths}
                                        </Typography>
                                    </Grid>
                                    {isManager() && item.applications.length>0 &&
                                    <>
                                        <Grid item xs={12}>
                                            <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                    paddingRight: "10px"
                                                }}
                                            >
                                                {"Applications"}
                                            </Typography>
                                        </Grid>
                                        {item.applications.map((app, index) => 
                                            <Grid item xs={6}>
                                                <Button onClick={()=>handleAppClick(index)} 
                                                    sx={{ backgroundColor: getAppColor(app), 
                                                        color: "#FFFFFF", 
                                                        textTransform: "none", 
                                                        width: "100%", 
                                                        "&:hover, &:focus, &:active": {
                                                            backgroundColor: getAppColor(app),
                                                        }}}>
                                                    <Stack>
                                                        <Typography>{app.tenant_first_name+" "+app.tenant_last_name}</Typography>
                                                        <Typography sx={{ fontWeight: "bold" }}>{app.lease_status}</Typography>
                                                    </Stack>
                                                </Button>
                                            </Grid>
                                        )}
                                    </>}
                                    <Grid item xs={11}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                    paddingRight: "10px"
                                                }}
                                            >
                                                Open Maintenance Tickets
                                            </Typography>
                                            <Box onClick={()=>(navigate('/ownerMaintenance'))}>
                                            <Badge 
                                                badgeContent={numberOfMaintenanceItems(maintenanceData)} 
                                                color="error"
                                                sx={{
                                                    paddingRight:"10px"
                                                }}
                                            /></Box>
                                            {/* <div style={{paddingLeft: "20px"}}>
                                                {maintenanceData && maintenanceData.length > 0 ? (
                                                    <Box display="flex" alignItems="right">
                                                        <KeyboardArrowRightIcon sx={{paddingRight: "10px"}} onClick={() => navigateToMaintenanceAccordion()}/>
                                                    </Box>
                                                ) : (null)}
                                            </div> */}
                                        </div>
                                    </Grid>
                                    <Grid item xs={1}>
                                    <Box onClick={()=>(navigate('/ownerMaintenance'))}>
                                        {maintenanceData && maintenanceData.length > 0 && maintenanceData[0].maintenance_request_uid &&
                                        <KeyboardArrowRightIcon sx={{ color: theme.typography.common.blue }}/>}
                                    </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                    <Box>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                            }}
                                        >
                                            {displayTopMaintenanceItem()}
                                        </Typography>
                                        </Box>
                                    </Grid>
                                    {/* <Grid item xs={2}>
                                        <Badge badgeContent={numberOfMaintenanceItems(maintenanceData)} color="error" width="20px" height="20px" 
                                            sx={{
                                                paddingRight:"10px"
                                            }}
                                        >
                                        </Badge>
                                    </Grid> */}
                                    {/* <Grid item xs={6}>
                                        {maintenanceData && maintenanceData.length > 0 ? (
                                            <Box display="flex" alignItems="right">
                                                <KeyboardArrowRightIcon sx={{paddingRight: "10px"}} onClick={() => navigateToMaintenanceAccordion()}/>
                                            </Box>
                                        ) : (null)}
                                    </Grid> */}
                                    <Grid item xs={11}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            Tenant
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                {tenant_detail}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <KeyboardArrowRightIcon sx={{ color: arrowButton1_color, cursor: "pointer" }} onClick={arrowButton1_onClick} 
                                        

                                        />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Box onClick={()=> {navigate("/pmQuotesRequested",
                                        {state :{
                                            index: index,
                                            propertyData: propertyData,
                                            contractsFeeData: contractsFeeData
                                        }})}}>
                                        <Typography
                                            sx={{
                                                textTransform: 'none',
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.secondary.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingRight: "10px"
                                            }}
                                        >
                                            PM Quotes Requested
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                               {activeContracts.length>0?
                                               activeContracts.map(contract => {
                                                return( <ActiveContract contract={contract}/>)
                                               })
                                               :"No PM Quotes"}
                                                
                                        </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Box>
                                            <KeyboardArrowRightIcon sx={{ color: theme.typography.common.blue, cursor: "pointer" }} 
                                            onClick={()=> {navigate("/pmQuotesRequested",{state :{
                                                index: index,
                                                propertyData: propertyData,
                                                contractsFeeData: contractsFeeData
                                            }})}}/>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Box onClick={handleManagerChange}>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                    paddingRight: "10px"
                                                }}
                                            >
                                            Property Manager
                                        </Typography>
                                        <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: theme.typography.primary.black,
                                                    fontWeight: theme.typography.light.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                            {(item.business_uid)?
                                            `${item.business_name}`:
                                            "No Manager"}
                                        </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={1} sx={{ display: "flex", flexWrap: "wrap", alignContent: "end" }}>
                                        <KeyboardArrowRightIcon sx={{ color: theme.typography.common.blue, cursor: "pointer" }} onClick={handleManagerChange}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            variant="outlined" 
                                            sx={{
                                                background: '#3D5CAC',
                                                color: theme.palette.background.default,
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {navigate('/addListing', {state:{ currentId, item }})}}
                                        >
                                            <PostAddIcon sx={{color: "#FFFFFF", fontSize: "18px", margin:'5px'}}/>
                                            <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                                {item.property_available_to_rent!==1 ? "Create Listing" : "Edit Listing"}
                                            </Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </CardContent>
                    </Card>
                </Stack>
            </Box>
        </Paper>
    )
}

function ActiveContract(props) {

    const textStyle = {
        textTransform: 'none',
        color: theme.typography.propertyPage.color,
        fontWeight: theme.typography.light.fontWeight,
        fontSize:theme.typography.smallFont,
    };

    let contract = props.contract;

   return(<Typography  sx={textStyle}>{contract}</Typography>)
  }
  

