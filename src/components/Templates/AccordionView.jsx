import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
    AccordionSummary,
    AppBar,
    Divider,
    TableRow,
    Table,
    TableBody,
    AccordionDetails,
    IconButton,
    Toolbar,
    Accordion,
    Avatar,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function AccordionView({colorStatusType, data, ItemComponent}){
    AccordionView.defaultProps = {
        colorStatusType: {},
        data: [],
        ItemComponent: () => <div>Default Component</div>
    };
    const [formattedData, setFormattedData] = useState({})

    const colorStatusTenantMap = {
        'NEW': 'New Requests',
        'PROCESSING': 'Reviewed Requests',
        'INFO': 'Reviewed Requests',
        'SCHEDULE': 'Scheduled',
        'COMPLETED': 'Completed',
    };
    
    const formattedColorOrder = [
        {'status': 'NEW REQUEST', 'color': '#B62C2A'},
        {'status': 'INFO REQUESTED', 'color': '#D4736D'},
        {'status': 'PROCESSING', 'color': '#DEA19C'},
        // {'status': 'Reviewed Requests', 'color': '#D29595'},
        {'status': 'SCHEDULED', 'color': '#92A9CB'},
        {'status': 'COMPLETED', 'color': '#6788B3'},
        {'status': 'CANCELLED', 'color': '#173C8D'},

    ]


    useEffect(() => {
        const parseData = () => {
            let dataObject = data;
            // data.forEach((item) => { 
            //     const itemStatus = item.maintenance_request_status
            //     if (colorStatusTenantMap[itemStatus]){
            //         const colorStatusMap = colorStatusTenantMap[itemStatus]
            //         if (!dataObject[colorStatusMap]) {
            //             dataObject[colorStatusMap] = [];
            //         }
            //         dataObject[colorStatusMap].push(item);
            //     }
            // });
            console.log(dataObject)
            setFormattedData(prevData => ({...prevData, ...dataObject}));
        }
        parseData(); // This created keys for each status type and pushed the data into the array
    }, [data]);


    return (
        <div>
            {formattedColorOrder.map((item, index) => 
                <Accordion
                    sx={{
                        backgroundColor: item.color,
                        boxShadow: 'none',
                    }}
                    key={index}
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
                        {/* Here is where we will access the colorStatusItem will go */}
                        {/* <p>{getColor(key)}</p> */}
                        <div style={{ 
                            backgroundColor: item.color, 
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
                        }}>
                            <p>{item.status}</p>
                            <span style={{fontSize: "18px", fontWeight: "400"}}>{formattedData[item.status] ? formattedData[item.status].length : 0}</span>
                        </div>
                    </AccordionSummary>        
                    {formattedData[item.status] && formattedData[item.status].map((request, index) => {
                        return (
                            <div key={index}>
                                <AccordionDetails> 
                                    <ItemComponent color={item.color} request={request}/>
                                </AccordionDetails>
                            </div>
                        )
                    })}
                </Accordion>
            )}
        </div>
    )
}
