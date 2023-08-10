import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Typography, 
    Box, 
    Stack,
    Paper,
    Button,
    ThemeProvider,
    Form,
    TextField,
    Badge,
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Grid,
    Input,
    Container,
    Radio,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    UploadFile,
    InputAdornment
} from "@mui/material";
import theme from '../../theme/theme';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import IconButton from '@mui/material/IconButton';


function ImageUploader(){
    const [selectedImageList, setSelectedImageList] = useState([]);

    const handleImageSelect = (event) => {
        console.log("handleImageSelect", event.target.value)
        const files = Array.from(event.target.files);
        setSelectedImageList([...selectedImageList, ...files]);
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            
            reader.onloadend = () => {
                selectedImageList.push({ data_url: reader.result });
                setSelectedImageList([...selectedImageList]);
            };

            reader.readAsDataURL(files[i]);
        }
    };

    const handleImageFavorite = (event) => {
        console.log("handleImageFavorite event", event)
        const index = event
        const file = selectedImageList[index]
        if (file.favorite === undefined) file.favorite = true
        else (file.favorite = !file.favorite)
        console.log(file.favorite)
        setSelectedImageList([...selectedImageList]);
    };

    const handleImageTrash = (event) => {
        console.log("handleImageTrash", event)
        const index = event
        selectedImageList.splice(index, 1);
        setSelectedImageList([...selectedImageList]);
    }

    return (
        <Container fixed sx={{
            backgroundColor: 'white',
            borderColor: 'black',
            borderRadius: '7px',
            borderStyle: 'dashed',
            borderColor: theme.typography.common.blue,
        }}>
            
            {selectedImageList.length === 0 && (
                <Box
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
                    padding={10}
                >

                    <Button
                        component="label"
                    >
                        <input
                            type="file" 
                            accept="image/*" 
                            multiple
                            hidden 
                            onChange={handleImageSelect}
                        />
                        <AddPhotoAlternateIcon sx={{color: theme.typography.common.blue, fontSize: "30px", marginRight: "10px"}}/>
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                            Add Pictures
                        </Typography>
                        </Button>
                </Box>
            )} 
            {selectedImageList.length > 0 && (
                <Box
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
                    padding={10}
                >
                    <Grid container>
                        {selectedImageList.map((image, index) => (
                            <Box
                                key={index}
                                sx={{
                                    position: 'relative',
                                    height: '75px',
                                    width: '75px',
                                    marginRight: '10px',
                                }}
                            >
                                <Grid item xs={2} key={index}>
                                    <img
                                        src={image.data_url}
                                        alt="new"
                                        key={index}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            height: '100%',
                                            width: '100%',
                                            marginRight: '10px',
                                            marginBottom: '10px',
                                            borderRadius: '7px',
                                        }}
                                    />
                                     <Box
                                        sx={{
                                            position: 'relative',
                                            top: "-5px",
                                            left: "40px",
                                            zIndex: 1,
                                        }}
                                    >
                                        <IconButton onClick={() => handleImageTrash(index)}>
                                            <CloseIcon color="error" />
                                        </IconButton>
                                    </Box>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            top: "0px",
                                            right: "7px",
                                            zIndex: 2,
                                        }}
                                    >
                                        <IconButton onClick={() => handleImageFavorite(index)}>
                                            {selectedImageList[index].favorite === true ? (
                                                <FavoriteIcon color="primary" sx={{
                                                    color: theme.typography.propertyPage.color,
                                                }}/>
                                            ) : (
                                                <FavoriteBorderIcon color="black"/>
                                            )}
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Box>
                        ))}
                        <Grid item xs={2}>
                            <Button
                                component="label"
                            >
                                <input
                                    type="file" 
                                    accept="image/*" 
                                    multiple
                                    hidden 
                                    onChange={handleImageSelect}
                                />
                                <AddPhotoAlternateIcon sx={{color: theme.typography.common.blue, fontSize: "75px", marginRight: "10px"}}/>
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Container>
    )

}


export default function AddProperty({}){
    const location = useLocation();
    let navigate = useNavigate();

    const [property, setProperty] = useState('');
    const [issue, setIssue] = useState('');
    const [toggleGroupValue, setToggleGroupValue] = useState('tenant');
    const [toggleAlignment, setToggleAlignment] = useState('left');
    const [cost, setCost] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState('');

    // const [selectedImageList, setSelectedImageList] = useState([]);

    // const handleImageSelect = (event) => {
    //     console.log("handleImageSelect", event.target.value)
    //     const files = Array.from(event.target.files);
    //     setSelectedImageList([...selectedImageList, ...files]);
    // };

    // const handleImageFavorite = (event) => {
    //     console.log("handleImageFavorite", event.target.value)
        
    //     const files = Array.from(event.target.files);
    //     // files[index].favorite = !files[index].favorite;
    //     // setSelectedImageList([...selectedImageList, ...files]);
    // };

    // const handleImageTrash = (event) => {
    //     console.log("handleImageTrash", event.target.value)
    //     const files = Array.from(event.target.files);
    //     // files.splice(index, 1);
    //     // setSelectedImageList([...files]);
    // }


    const handlePropertyChange = (event) => {
        console.log("handlePropertyChange", event.target.value)
        setProperty(event.target.value);
    };

    const handleUnitChange = (event) => {
        console.log("handleUnitChange", event.target.value)
        setIssue(event.target.value);
    };

    const handleCostChange = (event) => {
        console.log("handleCostChange", event.target.value)
        setCost(event.target.value);
    };  

    const handleTitleChange = (event) => {
        console.log("handleTitleChange", event.target.value)
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        console.log("handleDescriptionChange", event.target.value)
        setDescription(event.target.value);
    };

    const handlePriorityChange = (event, newToggleGroupValue) => {
        console.log("handleToggleGroupChange", newToggleGroupValue)
        setToggleGroupValue(newToggleGroupValue);
        setToggleAlignment(newToggleGroupValue);
    };

    const handleCompletedChange = (event, newToggleGroupValue) => {
        console.log("handleToggleGroupChange", newToggleGroupValue)
        setToggleGroupValue(newToggleGroupValue);
        setToggleAlignment(newToggleGroupValue);
    };
    
    const handleFileChange = (event) => {
        console.log("handleFileChange", event.target.value)
        setFile(event.target.value);
    };

    const handleBackButton = () => {
        console.log("handleBackButton")
        navigate(-1);
    }


    return (
        <ThemeProvider theme={theme}>
            <Stack
                style={{
                    display: 'flex',
                    // width: '100%', // Take up full screen width
                    minHeight: '100vh', // Set the Box height to full height
                    marginTop: theme.spacing(2), // Set the margin to 20px
                    justifyContent: 'center', // Center all children elements on the horizontal axis
                }}
                >
                    <Paper
                        style={{
                            margin: '30px',
                            padding: theme.spacing(2),
                            backgroundColor: theme.palette.form.main,
                            width: '85%', // Occupy full width with 25px margins on each side
                            [theme.breakpoints.down('sm')]: {
                                width: '80%',
                            },
                            [theme.breakpoints.up('sm')]: {
                                width: '50%',
                            },
                            paddingTop: '10px',
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            position="relative"
                        >
                            <Box
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Typography sx={{color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                    Add Property
                                </Typography>
                            </Box>
                            <Box position="absolute" right={0}>
                                <Button onClick={() => handleBackButton()}>
                                    <CloseIcon sx={{color: theme.typography.common.blue, fontSize: "30px", margin:'5px'}}/>
                                </Button>
                            </Box>
                        </Stack>

                        <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            padding="25px"
                        >
                            <Box
                                component="form"
                                sx={{
                                    // '& .MuiTextField-root': { m: 1, width: '25ch' },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <Grid container columnSpacing={12} rowSpacing={6}>
                                    {/* Select Field for Property */}

                                    {/* Text Field for Title */}
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Address
                                        </Typography>
                                        <TextField 
                                            onChange={handleTitleChange} 
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            fullWidth
                                        />
                                    </Grid>

                                    {/* Select Field for Issue and Cost Estimate */}
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Unit
                                        </Typography>
                                        <TextField 
                                            onChange={handleUnitChange} 
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            City
                                        </Typography>
                                        <TextField 
                                            onChange={handleUnitChange} 
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            State
                                        </Typography>

                                            <Select 
                                                sx={{
                                                    backgroundColor: 'white',
                                                    borderColor: 'black',
                                                    borderRadius: '7px',
                                                }}
                                                size="small"
                                                fullWidth
                                                // onChange={handleUnitChange} 
                                            >
                                                <MenuItem value={"CA"}>CA</MenuItem>
                                                <MenuItem value={"TX"}>TX</MenuItem>
                                                <MenuItem value={"FL"}>FL</MenuItem>
                                                <MenuItem value={"NY"}>NY</MenuItem>
                                                <MenuItem value={"IL"}>IL</MenuItem>
                                            </Select>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Zip Code
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            // onChange={handleCostChange}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Type
                                        </Typography>
                                        <Select 
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            fullWidth
                                            // onChange={handleUnitChange} 
                                        >
                                            <MenuItem value={"Single Family"}>Single Family</MenuItem>
                                            <MenuItem value={"Multi Family"}>Multi Family</MenuItem>
                                            <MenuItem value={"Condo"}>Condo</MenuItem>
                                            <MenuItem value={"Apartment"}>Apartment</MenuItem>
                                            <MenuItem value={"Tiny Home"}>Tiny Home</MenuItem>
                                        </Select>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Square Footage
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            // onChange={handleCostChange}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Bedrooms
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            // onChange={handleCostChange}
                                        />
                                    </Grid>
                                            
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Bathrooms
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            // onChange={handleCostChange}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Property Value
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">$</InputAdornment>
                                                ),
                                            }}
                                            // onChange={handleCostChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Owner Notes
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderRadius: '7px',
                                            }}
                                            size="small"
                                            multiline={true}
                                            // onChange={handleCostChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper
                         style={{
                            marginLeft: '30px',
                            // marginTop: '30px',
                            padding: theme.spacing(2),
                            backgroundColor: theme.palette.form.main,
                            width: '85%', // Occupy full width with 25px margins on each side
                            [theme.breakpoints.down('sm')]: {
                                width: '80%',
                            },
                            [theme.breakpoints.up('sm')]: {
                                width: '50%',
                            },
                        }}
                    >
                        <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            padding="25px"
                            sx={{
                                display: 'flex',
                            }}
                        >
                            <Box
                                component="form"
                                sx={{
                                    display: 'flex',
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <Grid container columnSpacing={12} rowSpacing={6}>

                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Active Date
                                        </Typography>
                                        <Typography
                                            sx={{color: theme.typography.common.blue, fontWeight: 500, fontSize:theme.typography.mediumFont}}
                                        >
                                            10/10/2021
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Deposit
                                        </Typography>
                                        <Typography
                                            sx={{color: theme.typography.common.blue, fontWeight: 500, fontSize:theme.typography.mediumFont}}
                                        >
                                            $2500
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Rent
                                        </Typography>
                                        <Typography
                                            sx={{color: theme.typography.common.blue, fontWeight: 500, fontSize:theme.typography.mediumFont}}
                                        >
                                            $2500
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                        Deposit can be used for last month’s rent
                                        </Typography>
                                        <Typography
                                            sx={{color: theme.typography.common.blue, fontWeight: 500, fontSize:theme.typography.mediumFont}}
                                        >
                                            No
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Pets Allowed
                                        </Typography>
                                        <Typography
                                            sx={{color: theme.typography.common.blue, fontWeight: 500, fontSize:theme.typography.mediumFont}}
                                        >
                                            Yes
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Stack>
                    </Paper>
                                    
                    <Paper
                        style={{
                            marginLeft: '30px',
                            marginTop: '30px',
                            padding: theme.spacing(2),
                            backgroundColor: theme.palette.form.main,
                            width: '85%', // Occupy full width with 25px margins on each side
                            [theme.breakpoints.down('sm')]: {
                                width: '80%',
                            },
                            [theme.breakpoints.up('sm')]: {
                                width: '50%',
                            },
                        }}
                    >
                        <Stack
                            direction="column"
                            justifyContent="left"
                            alignItems="left"
                            padding="25px"
                            sx={{
                                display: 'flex',
                            }}
                        >
                            <Box
                                component="form"
                                sx={{
                                    display: 'flex',
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <Grid container columnSpacing={12} rowSpacing={6}>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Utilities Paid by
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Electricity
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Owner
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Trash
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Tenant
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Water
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Tenant
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Wifi
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Tenant
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Gas
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Tenant
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper
                        style={{
                            marginLeft: '30px',
                            marginTop: '30px',
                            padding: theme.spacing(2),
                            backgroundColor: theme.palette.form.main,
                            width: '85%', // Occupy full width with 25px margins on each side
                            [theme.breakpoints.down('sm')]: {
                                width: '80%',
                            },
                            [theme.breakpoints.up('sm')]: {
                                width: '50%',
                            },
                        }}
                    >
                        <Stack
                            direction="column"
                            justifyContent="left"
                            alignItems="left"
                            padding="25px"
                            sx={{
                                display: 'flex',
                            }}
                        >
                            <Box
                                component="form"
                                sx={{
                                    display: 'flex',
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <Grid container columnSpacing={12} rowSpacing={6}>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                                            Property Description
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.light.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Sun-kissed, beige condo for a family.
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ImageUploader/>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Submit Button */}
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        // padding="25px"

                        // sx={{
                        //     marginLeft: '30px',
                        //     marginTop: '30px',
                        //     // display: 'flex',
                        //     // padding: '4px'
                        //     // width: '85%', // Occupy full width with 25px margins on each side
                        // }}
                    >
                        <Box
                            component="form"
                            sx={{
                                // marginLeft: '30px',
                                marginTop: '30px',
                                width: '100%',
                            }}
                            noValidate
                            autoComplete="off"
                        >
                        <Grid container>
                            <Grid item xs={12}>
                                <Button variant="contained" type="submit" sx={{ width: '100%', backgroundColor: theme.typography.formButton.background }}>
                                    <Typography sx={{color: "black", fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                                            Save Property
                                    </Typography>
                                    <input type="file" hidden/>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Stack>
            </Stack>
        </ThemeProvider>
    )
}