import { 
    ThemeProvider, 
    Accordion, 
    AccordionSummary,
    AccordionDetails,
    Typography,
    Paper,
    Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import theme from '../../theme/theme';
import dayjs from 'dayjs';



export default function MaintenanceStatusTable({status, color, maintenanceItemsForStatus, allMaintenanceData, maintenanceRequestsCount}){
    const location = useLocation();
    let navigate = useNavigate();

    const getChipColor = (priority) => {
        switch (priority) {
          case 'High':
            return '#A52A2A';
          case 'Medium':
            return '#FF8A00';
          case 'Low':
            return '#FFC614';
          default:
            return 'default';
        }
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
                return (
                    <Chip
                        label={params.value}
                        size="small"
                        style={{ backgroundColor: getChipColor(params.value), color: 'white' }}
                    />
                )
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
                return `${params.row.maintenance_request_uid.substr(params.row.maintenance_request_uid.length - 3)}`
            }
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
        },
        {
            headerName: "Scheduled Time",
            field: "maintenance_scheduled_time",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                return `${dayjs(params.row.maintenance_scheduled_time, "HH:mm").format("h:mm A")}`
            }
        },
    ];

    function handleRequestDetailPage(maintenance_request_index, property_uid, maintenance_request_uid){

        navigate(`/maintenance/detail`, {
            state: {
                maintenance_request_index,
                status,
                maintenanceItemsForStatus,
                allMaintenanceData,
            }
        })
    }
      
    return(
        <ThemeProvider theme={theme}>
            <Accordion
                sx={{
                    backgroundColor: color,
                    boxShadow: 'none',
                    '&:first-of-type .MuiAccordionSummary-root': {
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                    },
                    '&:last-of-type .MuiAccordionDetails-root': {
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px',
                    },
                }}
            >
            <AccordionSummary 
                sx={{
                    flexDirection: 'row', // Changed this from 'row-reverse'
                    '& .MuiIconButton-edgeEnd': { // This targets the IconButton
                        marginLeft: 'auto', // This pushes the IconButton to the right
                    },
                }} 
                expandIcon={<ExpandMoreIcon sx={{color: "white"}}/>} 
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ 
                    backgroundColor: color, 
                    color: '#FFFFFF', 
                    fontFamily: 'Source Sans Pro', 
                    fontSize: '18px', 
                    fontWeight:600, 
                    display:"flex",
                    justifyContent: "space-between",
                    width: "100%",
                    paddingRight: '10px',
                    alignItems: "center",
                    position: "sticky",
                    paddingTop: "5px",
                    paddingLeft: "15px",
                    borderRadius: "10px",
                }}>
                    <p>{status}</p>
                        <span style={{ float: "right", alignContent: "center", alignItems: "center" }}>{maintenanceItemsForStatus ? maintenanceItemsForStatus.length : ( maintenanceRequestsCount ? maintenanceRequestsCount : 0 )}</span>
                </div>
            </AccordionSummary>
            {maintenanceItemsForStatus.length !== 0 ? (
                <AccordionDetails>
                    <DataGrid
                        rows={maintenanceItemsForStatus}
                        columns={columns}
                        rowHeight={50}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: maintenanceItemsForStatus.length,
                                },
                            },
                        }}
                        hideFooter={true}
                        sx={{
                            '& .MuiDataGrid-cell': {
                                fontSize: '14px', // Change the font size
                                fontWeight: theme.typography.common.fontWeight, // Change the font weight
                                color: theme.typography.secondary.white,
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                fontSize: '16px', // Change the font size
                                fontWeight: theme.typography.common.fontWeight, // Change the font weight
                                color: theme.typography.secondary.white, // Change the font color of the headers
                            },
                            border: 0,
                            '& .MuiDataGrid-main': {
                                border: 0, // Removes the inner border
                            },
                            '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
                                borderBottom: 'none', // Removes the border of the last row
                            },
                            '& .MuiDataGrid-columnSeparator': {
                                display: 'none', // Remove vertical borders in the header
                            },
                        }}
                        disableExtendRowFullWidth={true}
                        getRowId={(row) => row.maintenance_request_uid}
                        pageSizeOptions={[5]}
                        onRowClick={(params) => {
                            const index = maintenanceItemsForStatus.findIndex(row => row.maintenance_request_uid === params.row.maintenance_request_uid);
                            handleRequestDetailPage(index, params.row.property_uid, params.row.maintenance_request_uid);
                        }}
                    />
                </AccordionDetails>
            ) : null}
            </Accordion>
        </ThemeProvider>
    )
}