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
    IconButton,
    InputAdornment
} from "@mui/material";

import theme from '../theme/theme';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';



export default function ImageUploader({selectedImageList, setSelectedImageList}){
    // const [selectedImageList, setSelectedImageList] = useState([]);

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