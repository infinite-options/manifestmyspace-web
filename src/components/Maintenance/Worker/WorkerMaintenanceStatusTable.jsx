import { ThemeProvider, Accordion, AccordionSummary, AccordionDetails, Typography, Chip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import APIConfig from '../../../utils/APIConfig';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "../../../theme/theme";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useMediaQuery } from '@mui/material';

export const getChipColor = (priority) => {
  switch (priority) {
    case "High":
      return "#A52A2A";
    case "Medium":
      return "#FF8A00";
    case "Low":
      return "#FFC614";
    case "REJECTED":
      return "#A52A2A";
    case "WITHDRAWN":
      return "#FF8A00";
    case "SENT":
      return "#FFC614";
    case "ACCEPTED":
      return "#4CAF50";
    default:
      return "default";
  }
};

export default function WorkerMaintenanceStatusTable({ status, color, maintenanceItemsForStatus, allMaintenanceData, maintenanceRequestsCount }) {
  const location = useLocation();
  let navigate = useNavigate();
  const { user, getProfileId, } = useUser();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // console.log("MaintenanceStatusTable", maintenanceItemsForStatus);
	const [maintenanceRequests, setMaintenanceRequests] = useState({});
  // console.log("----MaintenanceStatusTable----", status, color, maintenanceItemsForStatus, allMaintenanceData, maintenanceRequestsCount);
const [data, setdata] = useState({});
  const tableTextStyle = {
    backgroundColor: color,
    color: "#FFFFFF",
    fontFamily: "Source Sans Pro",
    fontSize: "15px",
    fontWeight: 600,
  };

  const columns = [
    {
      headerName: "Property",
      field: "property_name",
      renderCell: (params) => {
        return `${params.row.property_address} ${params.row.property_unit}`;
      },
      flex: 1,
      minWidth: 175,
    },
    {
      headerName: "Type",
      field: "maintenance_request_type",
      flex: 1,
      hide: true,
      minWidth: 100,
    },
    {
      headerName: "Priority",
      field: "maintenance_priority",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        return <Chip label={params.value} size="small" style={{ backgroundColor: getChipColor(params.value), color: "white" }} />;
      },
    },
    {
      headerName: "Status",
      field: "maintenance_status",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        return <Chip label={params.value} size="small" style={{ backgroundColor: getChipColor(params.value), color: "white" }} />;
      },
    },
    {
      headerName: "Title",
      field: "maintenance_title",
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "ID",
      field: "maintenance_request_uid",
      flex: 0.5,
      minWidth: 75,
      renderCell: (params) => {
        return `${params.row.maintenance_request_uid.substr(params.row.maintenance_request_uid.length - 3)}`;
      },
    },
    {
      headerName: "Date Created",
      field: "maintenance_request_created_date",
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: "Scheduled Date",
      field: "maintenance_scheduled_date",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const scheduledDate = params.row.maintenance_scheduled_date;
        return scheduledDate && scheduledDate !== "null" ? dayjs(params.row.maintenance_scheduled_date).format("MM-DD-YYYY") : "N/A";
      },
    },
    {
      headerName: "Scheduled Time",
      field: "maintenance_scheduled_time",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const scheduledTime = params.row.maintenance_scheduled_date;
        return scheduledTime && scheduledTime !== "null" ? dayjs(params.row.maintenance_scheduled_time, "HH:mm").format("h:mm A") : "N/A";
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceStatus/${getProfileId()}`);
        const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceStatus/600-000012`);
        const data = await response.json();
        //console.log('-----data inside workerMaintenanceTable----', data);

        const statusMappings = [
          { status: 'Quotes Requested', mapping: 'REQUESTED' },
          { status: 'Quotes Submitted', mapping: 'SUBMITTED' },
          { status: 'Quotes Accepted', mapping: 'ACCEPTED' },
          { status: 'Scheduled', mapping: 'SCHEDULED' },
          { status: 'Finished', mapping: 'FINISHED' },
          { status: 'Paid', mapping: 'PAID' },
        ];

        const result = {};
        const tempdata = {};

        statusMappings.forEach((mapping) => {
          const key = mapping.mapping;
          if (data.result[key]) {
            result[mapping.status] = data.result[key].maintenance_items;
            tempdata[key] = data.result[key].maintenance_items;
          }
        });
        console.log('status table---', result);

        await setMaintenanceRequests(result);
        await setdata(tempdata);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once, similar to componentDidMount

  async function handleRequestDetailPage(maintenance_request_index, property_uid, maintenance_request_uid) {
    
    // console.log("handleRequestDetailPage")
    //console.log("maintenance_request_index", maintenance_request_index)
    //console.log("status", status);
    //console.log("maintenanceItemsForStatus", maintenanceItemsForStatus);
    //console.log("inside func allMaintenanceData", allMaintenanceData);
    if (isMobile) {

      navigate(`/workerMaintenance/detail`, {
        state: {
          maintenance_request_index,
          status,
          maintenanceItemsForStatus: maintenanceRequests[status],
          data,
          maintenance_request_uid,
        },
      });
    } else {
			// Save data to session storage

			sessionStorage.setItem('workerselectedRequestIndex', maintenance_request_index);
			sessionStorage.setItem('workerselectedStatus', status);
			sessionStorage.setItem(
				'workermaintenanceItemsForStatus',
				JSON.stringify(maintenanceRequests[status])
			);
			sessionStorage.setItem('workerallMaintenanceData', JSON.stringify(data));
      sessionStorage.setItem('workermaintenance_request_uid', maintenance_request_uid);
 
			sessionStorage.setItem('workerMaintenanceView', true);
      
			// Trigger the custom event
			window.dispatchEvent(new Event('workermaintenanceRequestSelected'));
		}
  }

  return (
    <ThemeProvider theme={theme}>
      <Accordion
        sx={{
          backgroundColor: color,
          boxShadow: "none",
        }}
      >
        <AccordionSummary
          sx={{
            flexDirection: "row", // Changed this from 'row-reverse'
            "& .MuiIconButton-edgeEnd": {
              // This targets the IconButton
              marginLeft: "auto", // This pushes the IconButton to the right
            },
          }}
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              backgroundColor: color,
              color: "#FFFFFF",
              fontFamily: "Source Sans Pro",
              fontSize: "18px",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              paddingRight: "10px",
              alignItems: "center",
              position: "sticky",
              paddingTop: "5px",
              paddingLeft: "15px",
            }}
          >
            <p>{status}</p>
            <span style={{ float: "right", alignContent: "center", alignItems: "center" }}>
              {maintenanceItemsForStatus ? maintenanceItemsForStatus.length : maintenanceRequestsCount ? maintenanceRequestsCount : 0}
            </span>
          </div>
        </AccordionSummary>
        {maintenanceItemsForStatus.length !== 0 ? (
          <AccordionDetails>
            <DataGrid
              rows={maintenanceItemsForStatus}
              columns={columns}
              rowHeight={50}
              hideFooter={true}
              sx={{
                "& .MuiDataGrid-cell": {
                  fontSize: "14px", // Change the font size
                  fontWeight: theme.typography.common.fontWeight, // Change the font weight
                  color: theme.typography.secondary.white,
                },
                "& .MuiDataGrid-columnHeaders": {
                  fontSize: "16px", // Change the font size
                  fontWeight: theme.typography.common.fontWeight, // Change the font weight
                  color: theme.typography.secondary.white, // Change the font color of the headers
                },
                border: 0,
                "& .MuiDataGrid-main": {
                  border: 0, // Removes the inner border
                },
                "& .MuiDataGrid-row:last-child .MuiDataGrid-cell": {
                  borderBottom: "none", // Removes the border of the last row
                },
                "& .MuiDataGrid-columnSeparator": {
                  display: "none", // Remove vertical borders in the header
                },
              }}
              disableExtendRowFullWidth={true}
              getRowId={(row) => row.maintenance_request_uid}
              pageSizeOptions={[5]}
              onRowClick={(params) => {
                const index = maintenanceItemsForStatus.findIndex((row) => row.maintenance_request_uid === params.row.maintenance_request_uid);
                handleRequestDetailPage(index, params.row.property_uid, params.row.maintenance_request_uid);
              }}
            />
          </AccordionDetails>
        ) : null}
      </Accordion>
    </ThemeProvider>
  );
}
