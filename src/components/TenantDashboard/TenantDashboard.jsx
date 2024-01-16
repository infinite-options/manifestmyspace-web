import { 
  Box,
  Button,
  Typography,
  Stack,
  Grid,
  MenuItem,
  Menu,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead,
  Paper,
  TableRow
} from "@mui/material";
import CardSlider from "./CardSlider";
import PlaceholderImage from "./PlaceholderImage.png";
import MaintenanceIcon from "./MaintenanceIcon.png";
import { NavigationType, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import theme from "../../theme/theme";
import { useUser } from "../../contexts/UserContext";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Dashboard } from "@mui/icons-material";
import ArticleIcon from '@mui/icons-material/Article'; // For "Document"
import PhoneIcon from '@mui/icons-material/Phone'; // For "Phone"
import BuildIcon from '@mui/icons-material/Build'; // For "Maintenance"
import AddIcon from '@mui/icons-material/Add'; // For "New Request"


function TenantDashboard(props) {
  
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);

  const [paymentData, setPaymentData] = useState({
    // currency: "usd",
    // customer_uid: "100-000125",
    // business_code: "IOTEST",
    // item_uid: "320-000054",
    // payment_summary: {
    //   total: "0.0",
    // },
  });

  const { getProfileId } = useUser();

  const [maintenanceRequestsData, setMaintenanceRequestsData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [propertyAddr, setPropertyAddr] = useState();
  const [tenantId, setTenantId] = useState(`${getProfileId()}`);
  // const [balance, setBalance] = useState("0.00");
  const [total, setTotal] = useState("0.00");

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { user } = useUser();
  console.log(`User ID: ${getProfileId()} ` + " " + { tenantId });

  let automatic_navigation_handler =(propertyData)=>{
    const allNonActiveLease = propertyData.every((item) => item.lease_status !== "ACTIVE"); // Checks if there is any active lease or not
      if (!propertyData || propertyData.length === 0 || allNonActiveLease) {
        console.log("!propertyData || propertyData.length === 0");
        navigate("/listings");
      }
  }

  useEffect(() => {
    const getTenantData = async () => {
        setShowSpinner(true);
        const tenantRequests = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/dashboard/${getProfileId()}`);
        // const tenantRequests = await fetch(`http://127.0.0.1:4000/dashboard/${getProfileId()}`);
        const tenantRequestsData = await tenantRequests.json()  
        
        console.log(tenantRequestsData)

        let propertyData = tenantRequestsData?.property?.result;
        let maintenanceRequestsData = tenantRequestsData?.maintenanceRequests?.result;
        let announcementsData = tenantRequestsData?.announcements?.result;
        console.log("PropertyData", propertyData)
        const allNonActiveLease = propertyData.every(item => item.lease_status !== "ACTIVE");

      // sort propertyData by lease_status so that active lease is first
        propertyData.sort((a, b) => {
            if (a.lease_status === "ACTIVE") {
                return -1;
            }
            if (b.lease_status === "ACTIVE") {
                return 1;
            }
            return 0;
        });

        console.log(allNonActiveLease)

        if(!propertyData || propertyData.length === 0){
            console.log("!propertyData || propertyData.length === 0")
            navigate("/listings")
        }
        if (allNonActiveLease) {
            navigate('/listings');
        }

        setPropertyData(propertyData || []);
        setMaintenanceRequestsData(maintenanceRequestsData || []);
        setAnnouncementsData(announcementsData || ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5']);

        let propertyAddress = propertyData[0]!==undefined ? propertyData[0].property_address + " " + propertyData[0].property_unit :"No Data"
        setPropertyAddr(propertyAddress);
        setFirstName(user.first_name)
        setShowSpinner(false);
        setTotal(propertyData[0]!==undefined ? propertyData[0].balance : "0.00")
        setSelectedProperty(propertyData[0]!==undefined ? propertyData[0] : null)
    }
    getTenantData();
  }, [])

  useEffect(() => {
    console.log("TenantDashboard useEffect")

    let paymentData = createPaymentdata(total)
    console.log(paymentData)
    setPaymentData(paymentData)

  }, [total])

  const thStyle = {
    color: "#160449",
    fontWeight: "600",
    fontSize: "10px",
  };

  const location = useLocation();

  function handleTenantMaintenanceNavigate() {
    console.log("Tenant Maintenance Navigate");
    navigate("/addTenantMaintenanceItem");
  }

  const API_CALL = "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createEasyACHPaymentIntent";

  const handleStripePayment = async (e) => {
    setShowSpinner(true);
    console.log("Stripe Payment");
    try {
      //const stripe = await stripePromise;
      const response = await fetch(API_CALL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
      const checkoutURL = await response.text();
      //console.log(response.text());
      window.location.href = checkoutURL;
    } catch (error) {
      console.log(error);
    }
    setShowSpinner(false);
  }

  return (
    <Box
      sx={{
        fontFamily: "Source Sans Pro",
        padding: "14px",
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showSpinner}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container sx={{
          paddingBottom: "10px",
          // paddingLeft: "20px",
          paddingRight: "20px",
        }}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            <Box
              sx={{
                fontSize: "22px",
                fontWeight: "600",
              }}
            >
              Hello {firstName}!
            </Box>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "left",
              alignItems: "center",
              color: "#160449",
            }}
          >
            <Box
              sx={{
                height: "30px",
                width: "30px",
                backgroundColor: "#bbb",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            ></Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "22px",
                fontWeight: "600",
                color: "#3D5CAC",
              }}
              onClick={() => {navigate("/myProperty", {state: { propertyData, propertyData }})}}
            >
                <Box
                    sx={{
                        height: "30px",
                        width: "30px",
                        backgroundColor: "#bbb",
                        borderRadius: "50%",
                        marginRight: "10px",
                    }}
                ></Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "22px",
                        fontWeight: "600",
                        color: "#3D5CAC",
                    }}
                >
                    <Typography
                      onClick={ () => {navigate('/myProperty', {
                          state: {propertyData, propertyData}
                        })}
                      }
                    >
                      {propertyAddr}
                    </Typography>

                    <KeyboardArrowDownIcon 
                      sx={{alignItem: "center"}}
                      onClick={(event) => handleOpen(event)}
                    />
                    <Menu
                      id="demo-customized-menu"
                      MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      {propertyData.map((item, index) => {
                        return (
                          <MenuItem 
                            key={index}
                            onClick={() => {
                              setPropertyAddr(item.property_address + " " + item.property_unit)
                              setTotal(item.balance)
                              setSelectedProperty(item)
                              handleClose()
                            }}
                            disableRipple
                          >
                            {item.property_address + " " + item.property_unit}
                          </MenuItem>
                        )
                      })}
                    </Menu>
                </Box>
                
            </Box>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#97A7CF",
              color: theme.typography.secondary.white,
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
            onClick={() => navigate("/listings")}
          >
            <SearchIcon />
            Search Property
          </Button>
        </Grid>
      </Grid>

      {selectedProperty?.lease_status === "ACTIVE" ? (
        <>
        <DashboardTab>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "10px",
                }}
                onClick={() => {navigate('/payments')}}
            >
                <Box
                    sx={{
                        marginLeft: "5px",
                    }}
                >
                    <Box sx={{fontSize: "20px", fontWeight: "bold", color: "#160449",}}>
                        Balance
                    </Box>
                    <Box sx={{fontSize: "26px", fontWeight: "bold", color: "#A52A2A", margin: "10px",}}>
                        ${total}
                    </Box>
                    <Box sx={{fontSize: "15px", fontWeight: "600",color: "#3D5CAC",}} onClick={()=>{navigate('/payments')}}>
                        View Details
                    </Box>
                </Box>
                <Box
                    sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItem: "center",
                    marginRight: "20px",
                    }}
                >
                    <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#00000080",
                        padding: "6px",
                    }}
                    >
                        Pay before {propertyData[0]!==undefined? propertyData[0].earliest_due_date:"No Data"}
                    </Box>
                    <Box
                    sx={{
                        backgroundColor: "#3D5CAC",
                        borderRadius: "10px",
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "22px",

                        padding: "10px",
                        paddingRight: "20px",
                        paddingLeft: "20px",
                    }}
                    onClick={() => {
                        // handleStripePayment()
                        navigate('/payments')
                    }}
                    >
                        Make a Payment
                    </Box>
                </Box>
            </Box>
        </DashboardTab>
        <DashboardTab>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: "10px",
                }}
            >
                <Box
                    sx={{
                        color: "#160449",
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginLeft: "5px",
                        marginTop: "10px",
                    }}
                    onClick={() => navigate("/tenantMaintenance")}
                >
                    Maintenance
                </Box>
                <Box
                    sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#3D5CAC",
                    borderRadius: "5px",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    marginTop: "10px",
                    marginRight: "10px",
                    height: "35px",
                    }}
                >
                    <Box
                        sx={{
                            marginTop: "5px",
                            color: "#FFFFFF",
                        }}
                    >
                        <AddIcon/>
                    </Box>
                    <Button
                        sx={{
                            color: "#FFFFFF",
                            fontSize: "16px",
                        }}
                        onClick={() => handleTenantMaintenanceNavigate()}
                    >
                        <Typography sx={{textTransform: 'none', color: "#FFFFFF", fontWeight: theme.typography.common.fontWeight, fontSize: '16px'}}>
                            New Request
                        </Typography>
                    </Button>
                </Box>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: 170, backgroundColor: "#F2F2F2" }}>
                <Table sx={{backgroundColor: "#F2F2F2"}}>
                    <TableHead sx={{backgroundColor: "#F2F2F2"}}>
                        <TableRow sx={{backgroundColor: "#F2F2F2"}}>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Images</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Priority</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {maintenanceRequestsData.length > 0 && maintenanceRequestsData.map((item, index) => {
                                let array = [PlaceholderImage,
                                item.maintenance_title,
                                item.maintenance_request_status,
                                item.maintenance_priority,
                                item.maintenance_scheduled_date, 
                                item.maintenance_scheduled_time,item]
                            return (<CustomTableRow key={index} data={array}/>)
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </DashboardTab>
        <DashboardTab>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: "10px",
                }}
            >
                <Box
                    sx={{
                        color: "#160449",
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginLeft: "5px",
                        marginTop: "10px",
                    }}
                >
                    Announcement
                </Box>
                <Box
                    sx={{
                        color: "#007AFF",
                        fontSize: "18px",
                        marginLeft: "20px",
                        marginTop: "10px",
                    }}
                    onClick={()=>{navigate('/announcement',
                        {state: 
                            {announcementsData, propertyAddr}
                        })
                    }}
                >
                    View all ({announcementsData.length})
                </Box>
            </Box>
            <CardSlider data={announcementsData} />
        </DashboardTab>
        <DashboardTab>
            <Box
                sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px"
                }}
            >
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <DashboardActionItem 
                            icon={<PhoneIcon/>}
                            text={"Call Manager"}
                            onClick={() => {console.log("Call Manager")}} 
                        />
                    </Grid>
                    <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <DashboardActionItem 
                            icon={<BuildIcon/>}
                            text={"Urgent Maintenance"}
                            onClick={() => {handleTenantMaintenanceNavigate()}} 
                        />
                    </Grid>
                    <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <DashboardActionItem 
                            icon={<ArticleIcon/>}
                            text={"View Lease"}
                            onClick={()=>{console.log("View lease")}} 
                        />
                    </Grid>
                    <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <DashboardActionItem 
                            icon={<ArticleIcon/>}
                            text={"Documents"}
                            onClick={()=>{navigate('/tenantDocuments',{
                                state: 
                                    {propertyAddr: propertyAddr}
                                }
                            )}} 
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* <Box
                sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px"
                }}
            >
                <DashboardActionItem 
                    icon={<PhoneIcon/>}
                    text={"Call Manager"}
                    onClick={() => {console.log("Call Manager")}} 
                />
                <DashboardActionItem 
                    icon={<BuildIcon/>}
                    text={"Urgent Maintenance"}
                    onClick={() => {handleTenantMaintenanceNavigate()}} 
                />
                <DashboardActionItem 
                    icon={<ArticleIcon/>}
                    text={"View Lease"}
                    onClick={()=>{console.log("View lease")}} 
                />
                <DashboardActionItem 
                    icon={<ArticleIcon/>}
                    text={"Documents"}
                    onClick={()=>{navigate('/tenantDocuments',{
                        state: 
                            {propertyAddr: propertyAddr}
                        }
                    )}} 
                />
            </Box> */}
        </DashboardTab>
        </>
        ) : (
            <DashboardTab>
                Lease Status = {selectedProperty?.lease_status}
            </DashboardTab>
        )}
        </Box>
  );
}

const boxStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "125px",
    height: "35px",
    backgroundColor: "#DEDFE3",
    color: "#160449",
    fontWeight: "bold",
    fontSize: "14px",
    boxShadow: "3px 2px 4px #00000019",
    borderRadius: "10px",
    cursor: "pointer",
};

const innerBoxStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingLeft: "5px",
};

const innerTextStyle = {
  paddingLeft: "5px", // Adjust as needed
  paddingRight: "5px", // Adjust as needed
};


function DashboardActionItem(props){

  return (
    <Box sx={boxStyle} onClick={props.onClick}>
      <Box sx={innerBoxStyle}>
          {props.icon}
      </Box>
      <Box sx={innerTextStyle}>
          {props.text}
      </Box>
  </Box>
  )

}

function DashboardTab(props) {
  return (
    <Box
      sx={{
        backgroundColor: "#F2F2F2",
        borderRadius: "10px",
        marginTop: "7px",
        marginBottom: "7px",
        boxShadow: "0px 2px 4px #00000040",
      }}
    >
      {props.children}
    </Box>
  );
}

function CustomTableRow(props) {
  const [image, title, status, priority, date, time, item] = props.data;

  const tdStyle = {
    color: "#160449",
    fontSize: "14px",
    fontWeight: "600",
    // textAlign: "center",
  };
  function getStatusColor(status) {
    switch (status) {
      case "NEW":
        return "#B62C2A";
      case "PROCESSING":
        return "#D4736D";
      case "INFO":
        return "#DEA19C";
      case "SCHEDULED":
        return "#92A9CB";
      case "COMPLETED":
        return "#6788B3";
      case "CANCELLED":
        return "#173C8D";
      default:
        return "#000000";
    }
  }
  const statusStyle = {
    color: getStatusColor(status),
    fontSize: "14px",
    fontWeight: "bold",
    // textAlign: "center",
  };
  const navigate = useNavigate();
  return (
    <TableRow onClick={()=>{navigate('/tenantMaintenanceItem',{
      state: 
        {color: getStatusColor(status),
          item:item}
      }
    )}}>
        <TableCell style={tdStyle}>
            <img src={image} alt="Maintenance" style={{ width: "60px", height: "55px" }} />
        </TableCell>
        <TableCell style={tdStyle}>{title}</TableCell>
        <TableCell style={statusStyle}>{status}</TableCell>
        <TableCell style={tdStyle}>{priority}</TableCell>
        <TableCell style={tdStyle}>{date}</TableCell>
        <TableCell style={tdStyle}>{time}</TableCell>
    </TableRow>
  );
}
export default TenantDashboard;
