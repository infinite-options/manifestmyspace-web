import React from 'react';
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

import { useLocation, useNavigate } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import theme from '../../theme/theme';
import dayjs from 'dayjs';
import { lighten } from "@material-ui/core";

export default function MaintenanceStatusTable({ status, color, maintenanceItemsForStatus, allMaintenanceData, maintenanceRequestsCount, onRowClick }) {
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
            field: "property_address",
            renderCell: (params) => `${params.row.property_address}`,
            flex: 1,
            minWidth: 175,
        },
        {
            headerName: "Unit",
            field: "property_unit",
            renderCell: (params) => `${params.row.property_unit}`,
            flex: 1,
            minWidth: 50,
        },
        {
            headerName: "Priority",
            field: "maintenance_priority",
            flex: 0.5,
            minWidth: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    style={{ backgroundColor: getChipColor(params.value), color: 'white' }}
                />
            ),
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
            renderCell: (params) => `${params.row.maintenance_request_uid.substr(params.row.maintenance_request_uid.length - 3)}`,
        },
        {
            headerName: "Date Created",
            field: "maintenance_request_created_date",
            flex: 1,
            minWidth: 100,
        },
        {
            headerName: "Scheduled",
            field: "maintenance_scheduled_date",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                const scheduledDate = params.row.maintenance_scheduled_date;
                const scheduledTime = params.row.maintenance_scheduled_time;
                const status = params.row.maintenance_request_status;

                if (status === "CANCELLED") {
                    return "CANCELLED";
                } else {
                    const formattedDate = (scheduledDate && scheduledDate !== "null") ? dayjs(scheduledDate).format("MM-DD-YYYY") : "N/A";
                    const formattedTime = (scheduledTime && scheduledTime !== "null") ? dayjs(scheduledTime, "HH:mm").format("h:mm A") : "";
                    return `${formattedDate} ${formattedTime}`.trim();
                }
            }
        },
        {
            headerName: "Completed Data",
            field: "maintenance_request_closed_date",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                const completedDate = params.row.maintenance_request_closed_date;
                if (params.row.maintenance_request_status === "CANCELLED") {
                    return "CANCELLED";
                } else {
                    return (completedDate && completedDate !== "null") ? dayjs(params.row.maintenance_request_closed_date).format("MM-DD-YYYY") : "N/A";
                }
            }
        }
    ];

    return (
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
                        flexDirection: 'row',
                        '& .MuiIconButton-edgeEnd': {
                            marginLeft: 'auto',
                        },
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={{
                        backgroundColor: color,
                        color: '#FFFFFF',
                        fontFamily: 'Source Sans Pro',
                        fontSize: '18px',
                        fontWeight: 600,
                        display: "flex",
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
                        <span style={{ float: "right", alignContent: "center", alignItems: "center" }}>{maintenanceItemsForStatus ? maintenanceItemsForStatus.length : (maintenanceRequestsCount ? maintenanceRequestsCount : 0)}</span>
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
                                    fontSize: '14px',
                                    fontWeight: theme.typography.common.fontWeight,
                                    color: theme.typography.secondary.white,
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    fontSize: '16px',
                                    fontWeight: theme.typography.common.fontWeight,
                                    color: theme.typography.secondary.white,
                                },
                                border: 0,
                                '& .MuiDataGrid-main': {
                                    border: 0,
                                },
                                '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
                                    borderBottom: 'none',
                                },
                                '& .MuiDataGrid-columnSeparator': {
                                    display: 'none',
                                },
                                '& .highlighted-row': {
                                    backgroundColor: lighten(color, 0.4)
                                },
                            }}
                            disableExtendRowFullWidth={true}
                            getRowId={(row) => row.maintenance_request_uid}
                            pageSizeOptions={[5]}
                            onRowClick={(params) => {
                                const index = maintenanceItemsForStatus.findIndex(row => row.maintenance_request_uid === params.row.maintenance_request_uid);
                                onRowClick(index, params.row);
                            }}
                            getRowClassName={(params) => (
                                ['SCHEDULED', 'COMPLETED', 'PAID'].includes(params.row.maintenance_request_status) &&
                                    !['ACCEPTED', 'SCHEDULED', 'FINISHED'].includes(params.row.quote_status)
                                    ? 'highlighted-row'
                                    : ''
                            )}
                        />
                    </AccordionDetails>
                ) : null}
            </Accordion>
        </ThemeProvider>
    );
}
