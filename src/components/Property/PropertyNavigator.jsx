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

import { maintenanceDataCollectAndProcess } from '../Maintenance/MaintenanceOwner.jsx';

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

export default function PropertyNavigator({currentIndex, setCurrentIndex, propertyData, contracts, props}){
    const navigate = useNavigate();
    const { getProfileId, isManager, roleName } = useUser();
    // console.log(currentIndex)
    const item = propertyData[currentIndex];
    const [currentId, setCurrentId] = useState(item.property_uid);
    const [maintenanceData, setMaintenanceData] = useState([{}]);
    const [images, setImages] = useState(JSON.parse(propertyData[currentIndex].property_images).length > 0 ? JSON.parse(propertyData[currentIndex].property_images) : [propertyImage]);
    // const [activeStep, setActiveStep] = useState(images.findIndex(image => image === propertyData[currentIndex].property_favorite_image));
    const [activeStep, setActiveStep] = useState(() => {
        const index = images.findIndex(image => image === propertyData[currentIndex].property_favorite_image);
        
        return index !== -1 ? index : 0;
    });
    const [property, setProperty] = useState(propertyData[currentIndex]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [contractsData, setContractsData] = useState(contracts)
    const [contractsNewSent, setContractsNewSent] = useState(0)
    const [maintenanceReqData, setMaintenanceReqData] = useState([{}])
    const color = theme.palette.form.main
    const maxSteps = images.length;
    const [propertyId, setPropertyId] = useState(propertyData[currentIndex].property_uid)
    // console.log(propertyId)

    useEffect(() => {
        // console.log("--debug NEW propertyId--", propertyData[currentIndex].property_uid)
        setPropertyId(propertyData[currentIndex].property_uid)

        const refreshPropertyData = async () => {
            try {
                const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/${getProfileId()}`);
                if(!response.ok){
                    console.log("Error fetching property data")
                }
                const propertyResponse = await response.json();
                // console.log("propertyResponse", propertyResponse.result)
                const property = propertyResponse.result
                // console.log(property)
                setProperty(propertyData[currentIndex])
            } catch (error){
                console.log(error);
            }
        }

        const getContractsForOwner = async () => {
            try {
                const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts/${getProfileId()}`);
                if(!response.ok){
                    console.log("Error fetching contracts data")
                }
                const contractsResponse = await response.json();
                var count = 0;
                const contracts = contractsResponse.result.filter(contract => contract.property_id === propertyId)
                // console.log("--debug Contracts for owner--", contracts)
                contracts.forEach(contract => {
                    if(contract.contract_status === "SENT" || contract.contract_status === "NEW"){
                        count++;
                    }
                })
                setContractsNewSent(count)
                setContractsData(contracts)
            }
            catch (error){
                console.log(error);
            }
        }
        getContractsForOwner();
        refreshPropertyData();
    }, [currentIndex, propertyId])

    //const [propertyId, setPropertyId] = useState('200-000028')
    const tenant_detail= (item.lease_start && item.tenant_uid)?  `${item.lease_start}: ${item.tenant_first_name} ${item.tenant_last_name}`:
    "No Tenant";
    const [showIconButton, setShowIconButton]= useState(false);
    const manager_detail= (item.business_uid)?  `${item.business_name}`:     "No Manager"
    const [arrowButton1_color, set_arrow1_color]=useState(tenant_detail=== "No Tenant" && manager_detail==="No Manager"? theme.typography.common.gray : theme.typography.common.blue)
    
    useEffect(() => {
        const getMaintenanceForProperty = async () => {
            setShowSpinner(true);
            try {
                const responseProperty = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceByProperty/${item.property_uid}`);  
                const propertyMaintenanceData = await responseProperty.json();
                let propMaintList = propertyMaintenanceData.MaintenanceProjects?.result || []
                propMaintList = propMaintList.filter(m => m.maintenance_request_status !== "COMPLETED" && m.maintenance_request_status !== "CANCELLED")
                setMaintenanceData(propMaintList);

            } catch (error) {
                console.log(error);
            }
            setShowSpinner(false);
        }
        getMaintenanceForProperty();
    }, [currentIndex, propertyId]);

    useEffect(() => {
        // const getMaintenanceReqForProperty = async () => {
        //     try{
        //         const maintenanceReqForProperty = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/maintenanceReq/${propertyId}`)
        //         const maintenanceReqForPropertyData = await maintenanceReqForProperty.json();
        //         const data = maintenanceReqForPropertyData.result
        //         setMaintenanceReqData(data);
        //         // console.log("--debug-- maintenanceReqForPropertyData", data)
        //     } catch (error){
        //         console.log(error);
        //     }
        // }
        // getMaintenanceReqForProperty();
        maintenanceDataCollectAndProcess(setMaintenanceReqData, setShowSpinner, propertyId)
    }, [currentIndex, propertyId])

    function getColorStatusBasedOnSelectedRole(){
        const role = roleName()
        // console.log("role", role)   
 
        if (role === "Property Manager"){
            return theme.colorStatusPMO
          } else if (role === "Property Owner"){
            return theme.colorStatusO
         } else if (role === "Maintenance"){
             return theme.colorStatusMM
         } else if (role === "PM Employee"){
            return theme.colorStatusPMO
         } else if (role === "Maintenance Employee"){
             return theme.colorStatusMM
         } else if (role === "Tenant"){
             return theme.colorStatusTenant
         }     
     }

     function handleOnClickNavigateToMaintenance(row){
        console.log("row", row)
        console.log("maintenanceReqData", maintenanceReqData)
        let status = row.row.maintenance_request_status
        if (row.row.maintenance_request_status === "PAID"){
            status = "COMPLETED"
        } else if (row.row.maintenance_request_status === "NEW"){
            status = "NEW REQUEST"
        }
        console.log("status", status)
        console.log("maintenanceReqData[status]", maintenanceReqData[status])
        console.log("maintenanceReqData[status].maintenance_items", maintenanceReqData[status].maintenance_items)
        //let maintenanceIndex = maintenanceReqData[status].maintenance_items.findIndex(item => item.maintenance_request_uid === row.id)
        try {
            navigate('/maintenance/detail', {state: { 
                maintenance_request_index: maintenanceReqData[status].findIndex(item => item.maintenance_request_uid === row.id),
                status: status,
                maintenanceItemsForStatus: maintenanceReqData[status], 
                allMaintenanceData: maintenanceReqData,
                fromProperty: true,
            }})
        } catch(error) {
            console.log(error)
            alert("Error navigating to maintenance detail", error)
        }
     }

    function displayTopMaintenanceItem(){
        const colorStatus = getColorStatusBasedOnSelectedRole()
        // console.log(`maintenanceReqData in displayTopMaintenanceItem for ${propertyId}`, maintenanceReqData)
        // console.log(`maintenanceData before maintenance table ${JSON.stringify(maintenanceData)}`)
        // console.log(`colorStatus mapping ${JSON.stringify(colorStatus)}`)
        // console.log(maintenanceData)
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
                    onRowClick={(row) => handleOnClickNavigateToMaintenance(row)}
                />
            )
        } else {
            return "No Open Maintenance Tickets"
        }
    }

    function numberOfMaintenanceItems(maintenanceItems){
        if(maintenanceItems && maintenanceItems.length > 0){
            return maintenanceItems.filter(mi => !!mi.maintenance_request_uid).length
        } else {
            return 0
        }
    }

    function navigateToMaintenanceAccordion(){
        // console.log("click to maintenance accordion for property")
        navigate("/maintenance")

        // TODO: Need to send props to /maintenance to navigate to correct tab and item
    }

    
    const handleNextCard = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % propertyData.length);
      const nextId = propertyData[currentIndex+1].property_uid
      setCurrentId(nextId);
      setImages(JSON.parse(propertyData[currentIndex+1].property_images))
    //   setActiveStep(0);
      setActiveStep((JSON.parse(propertyData[currentIndex+1].property_images)).findIndex(url => url === propertyData[currentIndex+1].property_favorite_image));
    };
  
    const handlePreviousCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + propertyData.length) % propertyData.length);
        const previousId = propertyData[currentIndex-1].property_uid
        setCurrentId(previousId);
        setImages(JSON.parse(propertyData[currentIndex-1].property_images))
        // setActiveStep(0);
        setActiveStep((JSON.parse(propertyData[currentIndex-1].property_images)).findIndex(url => url === propertyData[currentIndex-1].property_favorite_image));
    };
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleManagerChange = (index) => {
        if(item.business_uid) {
            navigate("/managerDetails", { 
                state: { 
                    ownerId: item.owner_uid, 
                    managerBusinessId: item.business_uid,
                    managerData: item,
                    propertyData: propertyData,
                    index: currentIndex,
                } 
            });
        }   
        else {
            // console.log("--debug--", index, propertyData)
            navigate("/searchManager", { state: { index: index, propertyData } });
        }
    };

    const handleAppClick = (index) => {
        navigate("/tenantApplicationNav", { state:{ index: index, property: item } });
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
                            <Typography sx={{color: theme.typography.propertyPage.color, fontWeight: theme.typography.propertyPage.fontWeight, fontSize: theme.typography.propertyPage.fontSize}} paddingBottom="20px">
                                {item.property_uid}
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
                                            Rent: {item.property_listed_rent ? ("$"+item.property_listed_rent) : "No Rent Listed"}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: theme.typography.primary.black,
                                                fontWeight: theme.typography.light.fontWeight,
                                                fontSize:theme.typography.smallFont,
                                                paddingBottom: "10px"
                                            }}
                                        >
                                            Due: {item.lease_rent_due_by ? (item.lease_rent_due_by) : "No Due Date Listed"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {showIconButton && <Button
                                            sx={{
                                                padding: "0px"
                                            }}
                                            onClick={() => navigate('/viewLease',
                                            {
                                                state:{
                                                    lease_id : item.lease_uid
                                                } 
                                            })}
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
                                                Lease Expiring : {item.lease_end ? item.lease_end : "No Lease"}
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
                                                ${(item.property_value/item.property_area).toFixed(2)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button
                                            variant="outlined" 
                                            sx={{
                                                background: '#3D5CAC',
                                                color: theme.palette.background.default,
                                                cursor: "pointer",
                                                textTransform: "none",
                                            }}
                                            size="small"
                                            onClick={() => {navigate('/editProperty', 
                                                { state: {
                                                    index: currentIndex,
                                                    propertyList: propertyData 
                                                }}
                                            )}}
                                        >
                                            <CreateIcon sx={{
                                                color: "#FFFFFF",
                                                margin:"5px",
                                                fontSize: "18px"
                                            }}/>
                                            <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    color: "#FFFFFF",
                                                    fontWeight: theme.typography.secondary.fontWeight,
                                                    fontSize:theme.typography.smallFont,
                                                }}
                                            >
                                                Edit Property
                                            </Typography>
                                        </Button>
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
                                    {/* {isManager() && item.applications.length > 0 && */}
                                    {item.applications.length > 0 &&
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
                                        </>
                                    }
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
                                            <Box onClick={()=>(navigate('/ownerMaintenance', {state: {propertyId: propertyId,}}))}>
                                                <Badge 
                                                    badgeContent={numberOfMaintenanceItems(maintenanceData)} 
                                                    color="error"
                                                    sx={{
                                                        paddingRight:"10px"
                                                    }}
                                                />
                                            </Box>
                                        </div>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Box onClick={()=>(navigate('/ownerMaintenance', {state: {propertyId: propertyId,}}))}>
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
                                    {/* {console.log("--debug-- this is contractsData", contractsData)}
                                    {console.log("--debug-- contractsNewSent", contractsNewSent)} */}
                                    {contractsData && contractsData.length > 0 ? (
                                        <>
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
                                                    PM Quotes Requested
                                                </Typography>
                                                <Grid container>
                                                    <Typography
                                                            sx={{
                                                                textTransform: 'none',
                                                                color: theme.typography.primary.black,
                                                                fontWeight: theme.typography.light.fontWeight,
                                                                fontSize:theme.typography.smallFont,
                                                            }}
                                                        >
                                                            {contractsData.length > 0 ? contractsData.map((index, contract) => {
                                                                if(contract.contract_status === "NEW" || contract.contract_status === "SENT"){
                                                                    return(
                                                                        <Contract contract={contract} key={index}/>   
                                                                    )
                                                                }
                                                            }) : "No PM Quotes"}
                                                    </Typography>
                                                    <Badge
                                                        overlap="circular"
                                                        color="success"
                                                        badgeContent={contractsNewSent}
                                                        // invisible={!contractsNewSent}
                                                        anchorOrigin={{
                                                            vertical: "top",
                                                            horizontal: "right",
                                                        }}
                                                        style={{
                                                            color: "#000000",
                                                            width: "100%",
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <KeyboardArrowRightIcon sx={{ color: arrowButton1_color, cursor: "pointer" }} onClick={
                                                    () => {navigate("/pmQuotesRequested",
                                                    {
                                                        state :{
                                                            index: currentIndex,
                                                            propertyData: propertyData,
                                                            contracts: contractsData,
                                                        }
                                                    })}
                                                } />
                                            </Grid>
                                        </>
                                        ) : (
                                            null
                                        )
                                    }
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
                                            {item.business_uid ? "Property Manager" : "Find A Property Manager"}
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
                                            "No Manager Selected"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1} sx={{ display: "flex", flexWrap: "wrap", alignContent: "end" }}>
                                        <KeyboardArrowRightIcon sx={{ color: theme.typography.common.blue, cursor: "pointer" }} onClick={() => handleManagerChange(currentIndex)}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            variant="outlined" 
                                            sx={{
                                                background: '#3D5CAC',
                                                color: theme.palette.background.default,
                                                cursor: "pointer",
                                                textTransform: "none",
                                            }}
                                            size="small"
                                            onClick={() => {navigate('/addListing', {state:{ currentId, item, index: currentIndex, propertyList: propertyData}})}}
                                        >
                                            <PostAddIcon sx={{color: "#FFFFFF", fontSize: "18px", margin:'5px'}}/>
                                            <Typography  sx={{textTransform: 'none', color: "#FFFFFF", fontWeight: theme.typography.secondary.fontWeight, fontSize:theme.typography.smallFont}}>
                                                {item.property_available_to_rent !== 1 ? "Create Listing" : "Edit Listing"}
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

function Contract(props) {

    const textStyle = {
        textTransform: 'none',
        color: theme.typography.propertyPage.color,
        fontWeight: theme.typography.light.fontWeight,
        fontSize:theme.typography.smallFont,
    };

    let contract = props.contract;

   return(<Typography sx={textStyle}>{contract.contract_business_id} {contract.business_name} {contract.contract_uid} </Typography>)
  }
  

