import { 
    ThemeProvider, 
    Accordion, 
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import theme from '../../theme/theme';


export default function MaintenanceStatusTable({status, data, color}){
      
    return(
        <ThemeProvider theme={theme}>
            <Accordion
            sx={{
                backgroundColor: color,
                boxShadow: 'none',
            }}>
            <AccordionSummary sx={{flexDirection: 'row-reverse'}} expandIcon={<ExpandMoreIcon />} onClick={(e) => e.stopPropagation()}>
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
                }}>
                    <p>{status}</p>
                    <span style={{float: "right", alignContent: "center", alignItems: "center"}}>{data.length}</span>
                </div>  
            </AccordionSummary>
            {data.map((item, index) => 
                <AccordionDetails key={index}>
                    <p style={{ backgroundColor: color, color: '#FFFFFF', fontFamily: 'Source Sans Pro', fontSize: '15px', fontWeight:600}}>
                        {item.property_uid} {item.request_type} {item.priority}
                    </p>
                </AccordionDetails>
            )}
            </Accordion>
        </ThemeProvider>
    )
}