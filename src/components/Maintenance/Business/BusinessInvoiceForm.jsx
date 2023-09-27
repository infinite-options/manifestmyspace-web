import { 
    ThemeProvider, 
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    Card,
    CardHeader,
    Slider,
    Stack,
    Button,
    Grid,
    TextField,
    MenuItem,
    Select,
    Radio,
    FormControlLabel,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../../theme/theme';
import ImageUploader from "../../ImageUploader";
import documentIcon from "./Subtract.png"


function PartRow({partName, partCost}){
    const [selected, setSelected] = useState(false);

    const handleToggle = () => {
        setSelected(!selected);
    }

    return(
        <Grid container direction="row" spacing={2} alignContent="center">
            <Grid item xs={4}>
               
                <Radio
                    checked={selected}
                    onClick={handleToggle}
                    color="primary"
                />
               
               
            </Grid>
            <Grid item xs={4}>
                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    {partName}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                    {partCost}
                </Typography>
            </Grid>
        </Grid>
    )
}


export default function BusinessInvoiceForm({}){

    const [parts, setParts] = useState([
        {
            partName: "Part 1",
            partCost: "$100.00",
        },
        {
            partName: "Part 2",
            partCost: "$200.00",
        },
        {
            partName: "Part 3",
            partCost: "$300.00",
        },
        {
            partName: "Part 4",
            partCost: "$400.00",
        },
        {
            partName: "Part 5",
            partCost: "$500.00",
        },
    ]);
    const [numParts, setNumParts] = useState(parts.length);
    const [selectedImageList, setSelectedImageList] = useState([]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        }}>
            <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                width: '80%',
                minHeight: '100vh', // Set the Box height to full height
                marginTop: theme.spacing(2), // Set the margin to 20px
            }}
            >
                <Paper
                    style={{
                        margin: '10px',
                        backgroundColor: theme.palette.primary.main,
                        width: '100%', // Occupy full width with 25px margins on each side
                        paddingTop: '10px',
                        paddingBottom: '30px',
                    }}
                >
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            paddingBottom: "20px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                        }}
                    >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            paddingTop: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                        }}
                    >   
                        <Typography variant="h4" sx={{ paddingBottom: "20px" }}>
                            Invoice
                        </Typography>
                        <Box >
                            <Button sx={{
                                color: "#3D5CAC",
                                textTransform: "none",
                            }}>
                                <CloseIcon/>
                            </Button>
                        </Box>   
                    </Stack>

                        <Grid container direction="row" rowSpacing={2}>
                            <Grid item xs={12}>
                                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                    Amount Due:
                                </Typography>
                                <div style={{paddingLeft: "5px"}}>
                                    <TextField
                                        required
                                        rows={1}
                                        borderRadius="10px"
                                        variant="outlined"
                                        fullWidth 
                                        size="small"
                                        InputProps={{
                                            readOnly: false,
                                            style: { 
                                                backgroundColor: 'white',
                                                borderColor: '#000000'
                                            }
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} alignContent="center" sx={{paddingTop: "20px", paddingBottom: "20px"}}>
                                {parts.map((part, index) => (
                                    <PartRow key={index} partName={part.partName} partCost={part.partCost}/>
                                ))}
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                    Other Parts Used
                                </Typography>
                                <TextField
                                    required
                                    rows={1}
                                    borderRadius="10px"
                                    variant="outlined"
                                    fullWidth 
                                    size="small"
                                    InputProps={{
                                        readOnly: false,
                                        style: { 
                                            backgroundColor: 'white',
                                            borderColor: '#000000'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                    Cost
                                </Typography>
                                <TextField
                                    required
                                    rows={1}
                                    borderRadius="10px"
                                    variant="outlined"
                                    fullWidth 
                                    size="small"
                                    InputProps={{
                                        readOnly: false,
                                        style: { 
                                            backgroundColor: 'white',
                                            borderColor: '#000000'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button sx={{
                                    color: "#3D5CAC",
                                    textTransform: "none",
                                }}>
                                    <AddIcon/> 
                                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "12px"}}>
                                        Add Additional Parts
                                    </Typography>
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                    New Total
                                </Typography>
                                <TextField
                                    required
                                    rows={1}
                                    borderRadius="10px"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        readOnly: false,
                                        style: { 
                                            backgroundColor: 'white',
                                            borderColor: '#000000'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                    Payment Methods
                                </Typography>
                                <Grid container direction="row" spacing={2} alignContent="center">
                                    <Grid item xs={4}>
                                        Venmo
                                    </Grid>
                                    <Grid item xs={8}>
                                        @abbeyRoad1969
                                    </Grid>
                                    <Grid item xs={4}>
                                        Apple Pay
                                    </Grid>
                                    <Grid item xs={8}>
                                        abbeyroad1969@gmail.com
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                    Notes
                                </Typography>
                                <TextField
                                    required
                                    rows={1}
                                    borderRadius="10px"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        readOnly: false,
                                        style: { 
                                            backgroundColor: 'white',
                                            borderColor: '#000000'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{color: "#000000", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                    Add Photos
                                </Typography>
                                <ImageUploader selectedImageList={selectedImageList} setSelectedImageList={setSelectedImageList}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Button sx={{
                                    color: "#3D5CAC",
                                    textTransform: "none",
                                }}>
                                    <img src={documentIcon} style={{width: '20px', height: '25px', margin:'5px'}}/>
                                    <Typography sx={{color: "#3D5CAC", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "14px"}}>
                                        Attach Documents
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        backgroundColor: "#3D5CAC",
                                        textTransform: "none",
                                        borderRadius: "10px",
                                        display: 'flex',
                                        width: "100%",
                                    }}
                                >
                                    <Typography sx={{color: "#FFFFFF", fontWeight: theme.typography.propertyPage.fontWeight, fontSize: "16px"}}>
                                        Send Invoice
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Stack>
                </Paper>
            </Box>
        </div>
    )
}