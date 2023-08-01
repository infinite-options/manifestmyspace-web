import { 
    ThemeProvider, 
    Accordion, 
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Divider from '@mui/material/Divider';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import theme from '../../theme/theme';



export default function MaintenanceStatusTable({status, data, color}){
    
    const tableTextStyle = {
        backgroundColor: color, 
        color: '#FFFFFF', 
        fontFamily: 'Source Sans Pro', 
        fontSize: '15px', 
        fontWeight:600,
    }
      
    return(
        <ThemeProvider theme={theme}>
            <Accordion
            sx={{
                backgroundColor: color,
                boxShadow: 'none',
            }}>
            <AccordionSummary 
                sx={{
                    flexDirection: 'row', // Changed this from 'row-reverse'
                    '& .MuiIconButton-edgeEnd': { // This targets the IconButton
                        marginLeft: 'auto', // This pushes the IconButton to the right
                    },
                }} 
                expandIcon={<ExpandMoreIcon />} 
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
                }}>
                    <p>{status}</p>
                    <span style={{float: "right", alignContent: "center", alignItems: "center"}}>{data.length}</span>
                </div>  
            </AccordionSummary>
            {data.map((item, index) => 
                <AccordionDetails key={index}>
                    <div
                        style={{
                            paddingLeft: "15px",
                            paddingRight: "15px",
                        }}
                    >
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="left">
                                        <p style={{...tableTextStyle}}>{item.property_uid}</p>
                                    </TableCell>
                                    <TableCell align="left"
                                        style={{
                                            verticalAlign: 'middle', // Vertically center the text
                                            ...tableTextStyle // Include your existing styles
                                        }}>
                                        {item.request_type}
                                    </TableCell>
                                    <TableCell align="right">
                                        <p style={{...tableTextStyle}}>{item.priority}</p>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Divider />
                    </div>
                </AccordionDetails>
            )}
            </Accordion>
        </ThemeProvider>
    )
}