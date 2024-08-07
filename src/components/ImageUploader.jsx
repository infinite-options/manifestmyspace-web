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



export default function ImageUploader({updateFavoriteIcons, selectedImageList, setSelectedImageList, setDeletedImageList, page, setFavImage, favImage}) {

    const [imageOverLimit, setImageOverLimit] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        if(selectedImageList.length > 0){
            checkImageSizes(selectedImageList);
        }
    }, [selectedImageList]);

    function checkImageSizes(selectedImageList) {
        const MAX_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

        
        const sumImageSizes = selectedImageList.reduce((acc, image) => {
            return acc + (image.file?.size ?? 0);
        }, 0)

        if (sumImageSizes > MAX_SIZE) {
            setImageOverLimit(true)
            setShowErrorMessage(true);
        } else{
            setImageOverLimit(false)
            setShowErrorMessage(false);
        }
    }

    const readImage = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            file.image = e.target.result;
            setSelectedImageList((prevImageState) => [...prevImageState, file]);
        };
        reader.readAsDataURL(file.file);
    };
    
    const addFile = (event) => {
        const files = Array.from(event.target.files);
        let currentIndex = selectedImageList.length;
      
        files.forEach((file, i) => {
          const fileObj = {
            index: currentIndex,
            file: file,
            image: null,
            coverPhoto: currentIndex + i === 0 && !favImage, // Only set the first new image as cover if there's no favorite image
          };
          readImage(fileObj);
          currentIndex++;
        });
      };
      

    const deleteImage = (image) => {
        const newSelectedImageList = selectedImageList.filter(
          (file) => file.index !== image.index
        );
        if (image.coverPhoto && newSelectedImageList.length > 0) {
            newSelectedImageList[0].coverPhoto = true;
        }
        setSelectedImageList(newSelectedImageList);        

        if(image.file === null){
            setDeletedImageList((prevDeletedImages) => [...prevDeletedImages, image.image]);
        }
    };
    
    const favoriteImage = (favoriteFile) => {
        const newSelectedImageList = selectedImageList.map((file) => ({
          ...file,
          coverPhoto: file.index === favoriteFile.index
        }));
        setSelectedImageList(newSelectedImageList);
        setFavImage(favoriteFile.image);
        updateFavoriteIcons();
      };

    //   const favoriteImage = (favoriteFile) => {
    //     const newSelectedImageList = [...selectedImageList];
    //     for (const file of newSelectedImageList) {
    //         file.coverPhoto = file.index === favoriteFile.index;
    //     }
    //     setSelectedImageList(newSelectedImageList);
    // };
      
    return (
        <>
            {showErrorMessage ? (
                <Stack direction="row">
                    <Typography sx={{ color: 'red', fontSize: "16px" }}>
                        Total size of images must be less than 5MB. Please remove an image.
                    </Typography>
                </Stack>
            ): <Typography></Typography>}
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
                                onChange={addFile}
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
                            {selectedImageList.map((file, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: 'relative',
                                        height: '75px',
                                        width: '75px',
                                        marginRight: '10px',
                                        border: '20px solid #f0f0f0', // Adjust the color as needed
                                    }}
                                >
                                    <Grid item xs={2} key={index}>
                                        {file.file === null ? (
                                        <img
                                            key={Date.now()}
                                            // src={file.image}
                                            src={`${file.image}?${Date.now()}`}
                                            alt="property_image"
                                            style={{ 
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                height: '100%',
                                                width: '100%',
                                                marginRight: '5px',
                                                marginBottom: '5px',
                                                borderRadius: '7px',
                                                objectFit: "cover",
                                            }}
                                        />
                                        ) : (
                                        <img
                                            key={Date.now()}
                                            src={file.image}
                                            alt="property_image"
                                            style={{ 
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                height: '100%',
                                                width: '100%',
                                                marginRight: '5px',
                                                marginBottom: '5px',
                                                borderRadius: '7px',
                                                objectFit: "cover",
                                            }}
                                        />
                                        )}
                                        
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                // top: "-5px",
                                                top: "-25px", // Adjusted for the 25px border
                                                left: "62px",
                                                zIndex: 1,
                                            }}
                                        >
                                            <IconButton 
                                                onClick={() => deleteImage(file)}
                                            >
                                                <CloseIcon color="error" />
                                            </IconButton>
                                        </Box>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                // top: "0px",
                                                top: "26px", // Adjusted for the 25px border
                                                right: "28px",
                                                zIndex: 2,
                                            }}
                                        >
                                             <IconButton onClick={() => favoriteImage(file)}>
                      {file.image === favImage ? (
                        <FavoriteIcon color="primary" sx={{
                          color: "red",
                        }}/>
                      ) : (
                        <FavoriteBorderIcon color="black"/>
                      )}
                       {/* {selectedImageList[index].coverPhoto === true ? (
                                                    <FavoriteIcon color="primary" sx={{
                                                        color: theme.typography.propertyPage.color,
                                                    }}/>
                                                ) : (
                                                    <FavoriteBorderIcon color="black"/>
                                                )} */}
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
                                        onChange={addFile}
                                    />
                                    <AddPhotoAlternateIcon sx={{color: theme.typography.common.blue, fontSize: "75px", marginRight: "10px"}}/>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Container>
        </>
    )

}