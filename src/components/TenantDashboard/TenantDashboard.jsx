import { 
  Box,
  Button,
  Typography,
} from "@mui/material";
import CardSlider from "./CardSlider";
import PlaceholderImage from "./PlaceholderImage.png";
import MaintenanceIcon from "./MaintenanceIcon.png";
import { NavigationType, useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import theme from '../../theme/theme';

function TenantDashboard(props) {
  const navigate = useNavigate();

  const [maintenanceRequestsData, setMaintenanceRequestsData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [announcementsData, setAnnouncementsData] = useState([]);

  const [paymentData, setPaymentData] = useState({
        currency: "usd",
        customer_uid: "100-000125",
        business_code: "IOTEST",
        item_uid: "320-000054",
        payment_summary: {
          total: "0.0"
        },
  })

  const [total, setTotal] = useState("1300.00");

  useEffect(() => {
    console.log("TenantDashboard useEffect")

    let paymentData = createPaymentdata(total)
    console.log(paymentData)
    setPaymentData(paymentData)

  }, [total])

  useEffect(() => {
       
    const getTenantData = async () => {
        const tenantRequests = await fetch('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/tenantDashboard/350-000040')
        const tenantRequestsData = await tenantRequests.json()        
        
        console.log("TD: "+JSON.stringify(tenantRequestsData))
        let propertyData = tenantRequestsData.property.result;
        let maintenanceRequestsData = tenantRequestsData.maintenanceRequests.result;
        let announcementsData = tenantRequestsData.announcements.result;

        setPropertyData(propertyData);
        setMaintenanceRequestsData(maintenanceRequestsData);
        setAnnouncementsData(announcementsData);
    }
    getTenantData();
}, [])

  function createPaymentdata(total){
    return {
        currency: "usd",
        customer_uid: "100-000125",
        business_code: "IOTEST",
        item_uid: "320-000054",
        payment_summary: {
          total: total
        },
    }
  }



  const thStyle = {
    color: "#160449",
    fontWeight: "600",
    fontSize: "10px",
  };

  const location = useLocation();

  function handleTenantMaintenanceNavigate(){
    console.log("Tenant Maintenance Navigate")
    navigate("/addTenantMaintenanceItem")
  }

  const API_CALL = "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createEasyACHPaymentIntent";

  const handleStripePayment = async (e) => {
    console.log("Stripe Payment")
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
  }

  return (
    <Box
      sx={{
        fontFamily: "Source Sans Pro",
        padding: "14px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        {/* <Box>
          <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.2963 0.75C8.2963 0.335786 8.63208 0 9.0463 0H18.213C18.6272 0 18.963 0.335786 18.963 0.75V1.02778C18.963 1.44199 18.6272 1.77778 18.213 1.77778H9.0463C8.63208 1.77778 8.2963 1.44199 8.2963 1.02778V0.75ZM0 7.86111C0 7.4469 0.335786 7.11111 0.75 7.11111H18.213C18.6272 7.11111 18.963 7.4469 18.963 7.86111V8.13889C18.963 8.5531 18.6272 8.88889 18.213 8.88889H0.75C0.335786 8.88889 0 8.5531 0 8.13889V7.86111ZM0.75 14.2222C0.335786 14.2222 0 14.558 0 14.9722V15.25C0 15.6642 0.335787 16 0.750001 16H9.91667C10.3309 16 10.6667 15.6642 10.6667 15.25V14.9722C10.6667 14.558 10.3309 14.2222 9.91667 14.2222H0.75Z"
              fill="#160449"
            />
          </svg>
        </Box> */}
        <Box
          sx={{
            fontSize: "22px",
            fontWeight: "600",
          }}
        >
          Hello Nina!
        </Box>
        <Box sx={{ width: "19", height: "16" }}></Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
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
            fontSize: "11px",
            fontWeight: "600",
          }}
          onClick={()=>{navigate('/myProperty')}}
        >
          {propertyData[0]!==undefined? propertyData[0].property_address:"No Data"}
        </Box>
      </Box>
      <DashboardTab>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <Box
            sx={{
              marginLeft: "5px",
            }}
          >
            <Box
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#160449",
              }}
            >
              Balance
            </Box>
            <Box
              sx={{
                fontSize: "26px",
                fontWeight: "bold",
                color: "#A52A2A",
                margin: "10px",
              }}
            >
          ${propertyData[0]!==undefined? propertyData[0].balance:"No Data"}
            </Box>
            <Box
              sx={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#3D5CAC",
              }}
            >
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
                navigate('/paymentsTenant')
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
              fontSize: "18px",
              fontWeight: "bold",
              marginLeft: "20px",
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
              height: "25px",
            }}
          >
            <Box
              sx={{
                marginRight: "5px",
              }}
            >
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                <path d="M5.14286 5.71429H0V4.28571H5.14286V0H6.85714V4.28571H12V5.71429H6.85714V10H5.14286V5.71429Z" fill="white" />
              </svg>
            </Box>
            <Button
              sx={{
                color: "#FFFFFF",
                fontSize: "12px",
              }}
              onClick={() => handleTenantMaintenanceNavigate()}
            >
              <Typography sx={{textTransform: 'none', color: "#FFFFFF", fontWeight: theme.typography.common.fontWeight, fontSize: '12px'}}>
                New Requests
              </Typography>
            </Button>
          </Box>
        </Box>
        <Box>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tr style={{ borderBottomStyle: "solid", borderWidth: "1px" }}>
              <th style={thStyle}>Images</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Priority</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Time</th>
            </tr>
            {
              
              maintenanceRequestsData.length>0 && maintenanceRequestsData.map((item, index) =>{
                let  array = [PlaceholderImage,
                  item.maintenance_title,
                  item.maintenance_request_status,
                  item.maintenance_priority,
                  item.maintenance_scheduled_date, 
                  item.maintenance_scheduled_time]
                  return ( <TableRow data={array} />)
              })
            } 

         </table>
        </Box>
      </DashboardTab>
      <DashboardTab>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "5px",
            marginLeft: "15px",
            marginRight: "15px",
          }}
        >
          <Box
            sx={{
              color: "#160449",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Announcement
          </Box>
          <Box
            sx={{
              color: "#007AFF",
              fontSize: "10px",
            }}
            onClick={()=>{navigate('/announcement')}}
          >
            View all ({announcementsData.length})
          </Box>
        </Box>
        <CardSlider />
      </DashboardTab>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100px",
            height: "35px",
            backgroundColor: "#3D5CAC",
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: "12px",
            boxShadow: "3px 2px 4px #00000019",
            borderRadius: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: "10px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.2157 13.9997C10.6057 13.9997 9.74881 13.7791 8.46568 13.0622C6.90537 12.1872 5.69849 11.3794 4.14662 9.83158C2.65037 8.33627 1.92224 7.36815 0.903181 5.51377C-0.248069 3.42002 -0.0518188 2.32252 0.167556 1.85346C0.428806 1.29283 0.814431 0.957523 1.31287 0.62471C1.59598 0.439221 1.89558 0.280216 2.20787 0.14971C2.23912 0.136273 2.26818 0.12346 2.29412 0.111898C2.44881 0.0422101 2.68318 -0.0631024 2.98006 0.0493976C3.17818 0.123773 3.35506 0.27596 3.63193 0.549398C4.19974 1.1094 4.97568 2.35659 5.26193 2.96908C5.45412 3.3819 5.58131 3.6544 5.58162 3.96002C5.58162 4.31783 5.40162 4.59377 5.18318 4.89158C5.14224 4.94752 5.10162 5.00096 5.06224 5.05283C4.82443 5.36533 4.77224 5.45565 4.80662 5.6169C4.87631 5.94096 5.39599 6.90565 6.25006 7.75784C7.10412 8.61002 8.04099 9.0969 8.36631 9.16627C8.53443 9.20221 8.62662 9.14783 8.94912 8.90158C8.99537 8.86627 9.04287 8.82971 9.09256 8.79315C9.42568 8.54534 9.68881 8.37002 10.0382 8.37002H10.0401C10.3441 8.37002 10.6044 8.5019 11.0357 8.7194C11.5982 9.00315 12.8829 9.76908 13.4463 10.3375C13.7204 10.6138 13.8732 10.79 13.9479 10.9878C14.0604 11.2856 13.9544 11.5191 13.8854 11.6753C13.8738 11.7013 13.861 11.7297 13.8476 11.7613C13.716 12.073 13.5561 12.372 13.3697 12.6544C13.0376 13.1513 12.701 13.536 12.1391 13.7975C11.8506 13.934 11.5348 14.0031 11.2157 13.9997Z"
                fill="#F2F2F2"
              />
            </svg>
          </Box>
          <Box
            sx={{
              paddingRight: "5px",
            }}
          >
            Call Manager
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100px",
            height: "35px",
            backgroundColor: "#DEDFE3",
            color: "#160449",
            fontWeight: "bold",
            fontSize: "12px",
            boxShadow: "3px 2px 4px #00000019",
            borderRadius: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: "5px",
            }}
          >
            <img src={MaintenanceIcon} alt="Maintenance Icon" style={{ width: "25px", height: "25px" }} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingRight: "5px",
            }}
          >
            <Box>Urgent</Box>
            <Box>Maintenance</Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100px",
            height: "35px",
            backgroundColor: "#DEDFE3",
            color: "#160449",
            fontWeight: "bold",
            fontSize: "12px",
            boxShadow: "3px 2px 4px #00000019",
            borderRadius: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: "10px",
            }}
          >
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.20833 1.08333C9.20833 1.02808 9.18638 0.97509 9.14731 0.936019C9.10824 0.896949 9.05525 0.875 9 0.875H3.16667C2.55888 0.875 1.97598 1.11644 1.54621 1.54621C1.11644 1.97598 0.875 2.55888 0.875 3.16667V14.8333C0.875 15.4411 1.11644 16.024 1.54621 16.4538C1.97598 16.8836 2.55888 17.125 3.16667 17.125H11.5C12.1078 17.125 12.6907 16.8836 13.1205 16.4538C13.5502 16.024 13.7917 15.4411 13.7917 14.8333V6.6225C13.7917 6.56725 13.7697 6.51426 13.7306 6.47519C13.6916 6.43612 13.6386 6.41417 13.5833 6.41417H9.83333C9.66757 6.41417 9.5086 6.34832 9.39139 6.23111C9.27418 6.1139 9.20833 5.95493 9.20833 5.78917V1.08333ZM9.83333 9.20833C9.99909 9.20833 10.1581 9.27418 10.2753 9.39139C10.3925 9.5086 10.4583 9.66757 10.4583 9.83333C10.4583 9.99909 10.3925 10.1581 10.2753 10.2753C10.1581 10.3925 9.99909 10.4583 9.83333 10.4583H4.83333C4.66757 10.4583 4.5086 10.3925 4.39139 10.2753C4.27418 10.1581 4.20833 9.99909 4.20833 9.83333C4.20833 9.66757 4.27418 9.5086 4.39139 9.39139C4.5086 9.27418 4.66757 9.20833 4.83333 9.20833H9.83333ZM9.83333 12.5417C9.99909 12.5417 10.1581 12.6075 10.2753 12.7247C10.3925 12.8419 10.4583 13.0009 10.4583 13.1667C10.4583 13.3324 10.3925 13.4914 10.2753 13.6086C10.1581 13.7258 9.99909 13.7917 9.83333 13.7917H4.83333C4.66757 13.7917 4.5086 13.7258 4.39139 13.6086C4.27418 13.4914 4.20833 13.3324 4.20833 13.1667C4.20833 13.0009 4.27418 12.8419 4.39139 12.7247C4.5086 12.6075 4.66757 12.5417 4.83333 12.5417H9.83333Z"
                fill="#160449"
              />
            </svg>
          </Box>
          <Box
            sx={{
              paddingRight: "10px",
            }}
            onClick={()=>navigate('/tenantLeases')}
          >
            View Lease
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100px",
            height: "35px",
            backgroundColor: "#DEDFE3",
            color: "#160449",
            fontWeight: "bold",
            fontSize: "12px",
            boxShadow: "3px 2px 4px #00000019",
            borderRadius: "10px",
          }}
          onClick={()=>navigate('/tenantDocuments')}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: "10px",
            }}
          >
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.20833 1.08333C9.20833 1.02808 9.18638 0.97509 9.14731 0.936019C9.10824 0.896949 9.05525 0.875 9 0.875H3.16667C2.55888 0.875 1.97598 1.11644 1.54621 1.54621C1.11644 1.97598 0.875 2.55888 0.875 3.16667V14.8333C0.875 15.4411 1.11644 16.024 1.54621 16.4538C1.97598 16.8836 2.55888 17.125 3.16667 17.125H11.5C12.1078 17.125 12.6907 16.8836 13.1205 16.4538C13.5502 16.024 13.7917 15.4411 13.7917 14.8333V6.6225C13.7917 6.56725 13.7697 6.51426 13.7306 6.47519C13.6916 6.43612 13.6386 6.41417 13.5833 6.41417H9.83333C9.66757 6.41417 9.5086 6.34832 9.39139 6.23111C9.27418 6.1139 9.20833 5.95493 9.20833 5.78917V1.08333ZM9.83333 9.20833C9.99909 9.20833 10.1581 9.27418 10.2753 9.39139C10.3925 9.5086 10.4583 9.66757 10.4583 9.83333C10.4583 9.99909 10.3925 10.1581 10.2753 10.2753C10.1581 10.3925 9.99909 10.4583 9.83333 10.4583H4.83333C4.66757 10.4583 4.5086 10.3925 4.39139 10.2753C4.27418 10.1581 4.20833 9.99909 4.20833 9.83333C4.20833 9.66757 4.27418 9.5086 4.39139 9.39139C4.5086 9.27418 4.66757 9.20833 4.83333 9.20833H9.83333ZM9.83333 12.5417C9.99909 12.5417 10.1581 12.6075 10.2753 12.7247C10.3925 12.8419 10.4583 13.0009 10.4583 13.1667C10.4583 13.3324 10.3925 13.4914 10.2753 13.6086C10.1581 13.7258 9.99909 13.7917 9.83333 13.7917H4.83333C4.66757 13.7917 4.5086 13.7258 4.39139 13.6086C4.27418 13.4914 4.20833 13.3324 4.20833 13.1667C4.20833 13.0009 4.27418 12.8419 4.39139 12.7247C4.5086 12.6075 4.66757 12.5417 4.83333 12.5417H9.83333Z"
                fill="#160449"
              />
            </svg>
          </Box>
          <Box
            sx={{
              paddingRight: "10px",
            }}
          >
            Documents
          </Box>
        </Box>
      </Box>
    </Box>
  );
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

function TableRow(props) {
  console.log("In table Row "+props.data)
  const [image, title, status, priority, date, time] = props.data;

  const tdStyle = {
    color: "#160449",
    fontSize: "12px",
    fontWeight: "600",
    textAlign: "center",
  };
  function getStatusColor(status) {
    switch (status) {
      case "Viewed":
        return "#A52A2A3C";
      case "Assigned":
        return "#A52A2A";
      case "Completed":
        return "#778DC5";
      case "Sent":
        return "#7E7B7B";
      default:
        return "#000000";
    }
  }
  const statusStyle = {
    color: getStatusColor(status),
    fontSize: "12px",
    fontWeight: "bold",
    textAlign: "center",
  };
  return (
    <tr>
      <td style={tdStyle}>
        <img src={image} alt="Maintenance" style={{ width: "45px", height: "35px" }} />
      </td>
      <td style={tdStyle}>{title}</td>
      <td style={statusStyle}>{status}</td>
      <td style={tdStyle}>{priority}</td>
      <td style={tdStyle}>{date}</td>
      <td style={tdStyle}>{time}</td>
    </tr>
  );
}
export default TenantDashboard;
