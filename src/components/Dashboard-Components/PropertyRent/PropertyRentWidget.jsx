import React, { useState, useEffect } from "react";
import { PieChart, Pie, Legend, Cell } from "recharts";
import { Chart } from "react-google-charts";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, List, ListItem, Typography, Button, Grid, Menu, MenuItem } from "@mui/material";
import { useUser } from "../../../contexts/UserContext.jsx";
import { makeStyles } from "@material-ui/core";
// import home_icon from "../../../images/home_icon.svg";
import { ReactComponent as HomeIcon } from "../../../images/home_icon.svg";
import { ReactComponent as CalendarIcon } from "../../../images/calendar_icon.svg";
import APIConfig from "../../../utils/APIConfig.jsx";
import useMediaQuery from "@mui/material/useMediaQuery";
import theme from "../../../theme/theme.js";

const useStyles = makeStyles({
  button: {
    width: "100%",
    fontSize: "13px",
    marginBottom: "10px", // Adjust the spacing between buttons as needed
  },
  container: {
    width: "90%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    marginBottom: "20px", // Adjust the spacing between rows
  },
});

export default function PropertyRentWidget(props) {
  console.log("In Property Rent Widget ");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getProfileId } = useUser();
  const classes = useStyles();
  const navigate = useNavigate();
  const { propertyRoutingBasedOnSelectedRole, user, selectedRole } = useUser();
  const [propertyList, setPropertyList] = useState([]);
  const [rawPropertyData, setRawPropertyData] = useState([]);
  const [allRentStatus, setAllRentStatus] = useState([]);

  useEffect(() => {
    const propertyRentDetails = async () => {
      try {
        const response = await fetch(`${APIConfig.baseURL.dev}/rentDetails/${getProfileId()}`);
        // const response = await fetch(`${APIConfig.baseURL.dev}/rentDetails/600-000003`);
        const rentResponse = await response.json();
        setAllRentStatus(rentResponse.RentStatus.result);
      } catch (error) {
        console.error("Failed to fetch rent details:", error);
      }
    };
    propertyRentDetails();
  }, []);

  useEffect(() => {
    console.log("PropertyRentWidget - propertyList - ", propertyList);
  }, [propertyList]);

  console.log("Is it in mobile", isMobile);
  // console.log(selectedRole);
  console.log("props for rentData", props.rentData);
  // console.log("Role: ", user);
  // console.log("Selected Role: ", selectedRole);
  console.log("PropertyRentWidget - props - ", props);

  let rentStatusData = props.rentData;
  const property_endpoint_resp = props.propertyEndpointResp;
  // console.log("PropertyRentWidget - property_endpoint_resp - ", property_endpoint_resp);
  const contractRequests = props?.contractRequests;
  console.log("PropertyRentWidget - contractRequests - ", contractRequests);

  let unpaidCount = rentStatusData ? rentStatusData.find((rs) => rs.rent_status === "UNPAID") : 0;
  // console.log(unpaidCount);
  unpaidCount = unpaidCount ? unpaidCount.num : 0;

  let partialPaidCount = rentStatusData ? rentStatusData.find((rs) => rs.rent_status === "PAID PARTIALLY") : 0;
  partialPaidCount = partialPaidCount ? partialPaidCount.num : 0;

  let paidLateCount = rentStatusData ? rentStatusData.find((rs) => rs.rent_status === "PAID LATE") : 0;
  paidLateCount = paidLateCount ? paidLateCount.num : 0;

  let paidCount = rentStatusData ? rentStatusData.find((rs) => rs.rent_status === "PAID") : 0;
  paidCount = paidCount ? paidCount.num : 0;

  let vacantCount = rentStatusData ? rentStatusData.find((rs) => rs.rent_status === "VACANT") : 0;
  vacantCount = vacantCount ? vacantCount.num : 0;

  let noManagerCount = rentStatusData ? rentStatusData.find((rs) => rs.rent_status === "NO MANAGER") : 0;
  // console.log(noManagerCount);
  noManagerCount = noManagerCount ? noManagerCount.num : 0;

  // no check if rentSatus does not exist so this could result in a failure
  let totalPropertiesCount = unpaidCount + partialPaidCount + paidLateCount + vacantCount + paidCount + noManagerCount;

  let data = [
    { rent_status: "not paid", number: unpaidCount, fill: "#A52A2A" },
    { rent_status: "paid partially", number: partialPaidCount, fill: "#FF8A00" },
    { rent_status: "paid late", number: paidLateCount, fill: "#FFC85C" },
    { rent_status: "paid on time", number: paidCount, fill: "#3D5CAC" },
    { rent_status: "vacant", number: vacantCount, fill: "#160449" },
  ];

  // Add object conditionally only if selectedRole is "OWNER"
  if (selectedRole === "OWNER") {
    data.push({ rent_status: "no manager", number: noManagerCount, fill: "#111111" });
  }

  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;
    const status = data.find((item) => item.fill === color)?.rent_status;
    const num = data.find((item) => item.fill === color)?.number;
    return (
      <span style={{ color: "#160449", fontFamily: "Source Sans Pro", fontSize: "18px" }}>
        {num} {status}
      </span>
    );
  };

  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    // console.log("PropertyRentWidget - anchorEl - ", anchorEl);
  }, [anchorEl]);

  const handleSelectPropertyClick = async (event) => {
    setAnchorEl(event.currentTarget);
    if (propertyList?.length > 0) {
      return;
    }
    // const propertiesResponse = await fetch(`${APIConfig.baseURL.dev}/properties/600-000003`);
    const propertiesResponse = await fetch(`${APIConfig.baseURL.dev}/properties/${getProfileId()}`);
    try {
      const propertyData = await propertiesResponse.json();
      // console.log("PropertyRentWidget - propertyData - ", propertyData);
      // setPropertiesList(propertiesResponseJSON.Property.result);

      const propertyList = getPropertyList(propertyData);
      setRawPropertyData(propertyData);
      // console.log("In Property List >> Property List: ", propertyList);
      // console.log("Testing Property Data", propertyData.Property.result);

      setPropertyList([...propertyList]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function getPropertyList(data) {
    const propertyList = data["Property"].result;
    const applications = data["Applications"].result;
    const maintenance = data["MaintenanceRequests"].result;
    //   const newContracts = data["NewPMRequests"].result;
    //   console.log(maintenance);

    const appsMap = new Map();
    applications.forEach((a) => {
      const appsByProperty = appsMap.get(a.property_uid) || [];
      appsByProperty.push(a);
      appsMap.set(a.property_uid, appsByProperty);
    });

    const maintMap = new Map();
    maintenance.forEach((m) => {
      // console.log("before", m);
      const maintByProperty = maintMap.get(m.maintenance_property_id) || [];
      maintByProperty.push(m);
      // console.log("after", maintByProperty);
      maintMap.set(m.maintenance_property_id, maintByProperty);
    });

    //   const contractsMap = new Map();
    //   newContracts.forEach((c) => {
    //     // console.log("before", m);
    //     const contractsByProperty = maintMap.get(c.property_id) || [];
    //     contractsByProperty.push(c);
    //     // console.log("after", maintByProperty);
    //     contractsMap.set(c.property_id, contractsByProperty);
    //   });

    //   console.log(maintMap);
    return propertyList.map((p) => {
      p.applications = appsMap.get(p.property_uid) || [];
      p.applicationsCount = [...p.applications].filter((a) => ["NEW", "PROCESSING"].includes(a.lease_status)).length;
      p.maintenance = maintMap.get(p.property_uid) || [];
      p.maintenanceCount = [...p.maintenance].filter((m) => m.maintenance_request_status === "NEW" || m.maintenance_request_status === "PROCESSING").length;
      // p.newContracts = contractsMap.get(p.property_uid) || [];
      // p.newContractsCount = [...p.newContracts].filter((m) => m.contract_status === "NEW").length;
      // console.log("P:", p);
      // console.log("P:", p.applications);
      // console.log("P:", p.applicationsCount);
      return p;
    });
  }

  return (
    <Box
      style={{
        backgroundColor: "#F5F5F5",
        // marginTop: "30px",
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <Typography className="mt-widget-title" sx={{ fontSize: "25px", fontWeight: 600, paddingTop: "15px" }}>
        {" "}
        Property Rent
      </Typography>
      <Grid container>
        {/* <Grid item xs={2} sm={0}></Grid> */}
        <Grid item xs={6}>
          <Button
            variant="outlined"
            id="revenue"
            className={classes.button}
            style={{
              // height: "100%",
              // width: '80%',
              // backgroundColor: '#160449',
              color: "#3D5CAC",
              fontSize: "13px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
            onClick={() => {
              navigate(propertyRoutingBasedOnSelectedRole());
            }}
          >
            <CalendarIcon stroke="#3D5CAC" width="20" height="20" style={{ marginRight: "4px" }} />
            {!isMobile && "Last 30 days"}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            id="revenue"
            className={classes.button}
            style={{
              // height: "100%",
              // width: '80%',
              // backgroundColor: '#160449',
              color: "#3D5CAC",
              fontSize: "13px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
            onClick={handleSelectPropertyClick}
          >
            <HomeIcon fill="#3D5CAC" width="15" height="15" style={{ marginRight: "4px" }} />
            {!isMobile && "Select Property"}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            // anchorOrigin={{
            //     vertical: 'bottom',
            //     horizontal: 'left',
            // }}
            // transformOrigin={{
            //     vertical: 'top',
            //     horizontal: 'left',
            // }}
            // sx={{
            //     '& .MuiPaper-root': {
            //       width: anchorEl ? anchorEl.clientWidth : null,
            //     },
            // }}
          >
            {propertyList.map((property, index) => {
              return (
                <MenuItem
                  key={property.property_uid}
                  onClick={() => {
                    console.log("navigating to propertyDetail - i, propertiesList - ", index, propertyList);
                    navigate(`/propertyDetail`, { state: { index, propertyList, allRentStatus, rawPropertyData } });
                  }}
                >
                  {property.property_address}
                </MenuItem>
              );
            })}

            {/* <MenuItem onClick={() => handlePropertyClick('Property 1')}>Property 1</MenuItem>
                <MenuItem onClick={() => handlePropertyClick('Property 2')}>Property 2</MenuItem> */}
            {/* Add more MenuItems for each property */}
          </Menu>
        </Grid>
        {/* <Grid item xs={2} sm={0}></Grid> */}
      </Grid>

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <PieChart width={250} height={250}>
          {/* <Legend
            height={36}
            iconType="circle"
            layout="vertical"
            verticalAlign="bottom"
            iconSize={15}
            padding={5}
            formatter={renderColorfulLegendText}
            onClick={() => navigate("/pmRent")}
          /> */}
          <Pie
            data={data}
            cx={125}
            cy={125}
            innerRadius={60}
            outerRadius={90}
            paddingAngle={0}
            dataKey="number"
            filter="url(#shadow)"
            onClick={() => navigate(propertyRoutingBasedOnSelectedRole())}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={3} />
            ))}
          </Pie>
          <text
            x={130}
            y={125}
            textAnchor="middle"
            dominantBaseline="middle"
            cursor="pointer"
            style={{
              fontFamily: "Source Sans Pro",
              fontSize: "20px",
              fill: "#160449",
              fontWeight: "bold",
            }}
            onClick={() => navigate(propertyRoutingBasedOnSelectedRole())}
          >
            View all {totalPropertiesCount}
            <tspan x={130} y={145}>
              Properties
            </tspan>
          </text>
        </PieChart>
        <CustomLegend navigate={navigate} data={data} />
        <Button
          variant="outlined"
          id="revenue"
          className={classes.button}
          style={{
            height: "100%",
            width: "80%",
            backgroundColor: "#160449",
            color: "#FFFFFF",
            fontSize: "15px",
            marginBottom: "10px",
            marginTop: "25px",
            borderRadius: "5px",
          }}
          onClick={() => {
            navigate(propertyRoutingBasedOnSelectedRole());
          }}
        >
          {/* <Box
                sx={{
                    width: 7,
                    height: 7,
                    backgroundColor: '#160449',
                    borderRadius: "50%",
                    display: "flex",
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontSize: "20px",
                    paddingRight: "20px",
                }}
            >            
                View {contractRequests?.length}
            </Box>
                Property Listings */}
          View {vacantCount} Property Listings
        </Button>
        <Button
          variant="outlined"
          id="revenue"
          className={classes.button}
          style={{
            height: "100%",
            width: "80%",
            backgroundColor: "#160449",
            color: "#FFFFFF",
            fontSize: "15px",
            borderRadius: "5px",
          }}
          onClick={() => {
            console.log("New Request Clicked");
            navigate("/pmQuotesList", { state: { property_endpoint_resp } });
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              backgroundColor: "#160449",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: "15px",
              paddingRight: "20px",
            }}
          >
            {contractRequests?.length}
          </Box>
          New Requests
        </Button>
      </Box>
    </Box>
  );
}

const CustomLegend = ({ data, navigate }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const capitalize = (rentStatus) => {
    return rentStatus
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F2F2F2",
        display: "block",
        width: "80%",
        height: "80%",
        borderRadius: "10px",
        cursor: "pointer",
        position: "relative",
        paddingBottom: "10px",
      }}
      onClick={() => {
        if (isMobile) {
          navigate("/pmRent");
        } else {
          sessionStorage.setItem("isrent", "true");
          navigate("/properties");
        }
      }}
    >
      {/* <h2 className="mt-widget-title">Maintenance</h2> */}
      <Box
        sx={{
          display: "block",
          margin: "auto",
          // width: '90%',
          borderRadius: "10px",
        }}
      >
        <List
          sx={{
            padding: "0",
            borderRadius: "20px",
            margin: "0px",
          }}
        >
          {data.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                width: "100%",
                backgroundColor: item.fill,
                color: "#FFFFFF",
                fontFamily: "Source Sans Pro",
                fontSize: "13px",
                fontWeight: 600,
                padding: "17px 10px",
                borderTopLeftRadius: index === 0 ? "10px" : "0",
                borderTopRightRadius: index === 0 ? "10px" : "0",
                borderBottomLeftRadius: index === data.length - 1 ? "10px" : "0",
                borderBottomRightRadius: index === data.length - 1 ? "10px" : "0",
              }}
            >
              {capitalize(item.rent_status)}
              <Typography variant="body2" align="right" sx={{ marginLeft: "auto" }}>
                {item.number}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
