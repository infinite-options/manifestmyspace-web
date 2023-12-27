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



export default function ImageUploader({selectedImageList, setSelectedImageList, page, imageState, setImageState}){

    useEffect(() =>{
        console.log("ROHIT - imageState - ", imageState);
    }, [imageState]);

    //rohit - delete
    // const handleImageSelect = (event) => {
    //     const files = Array.from(event.target.files);
    //     files.forEach((file) => {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             // file.data_url = reader.result;
    //             setSelectedImageList([...selectedImageList, reader.result]);
    //         };
    //         reader.onerror = (error) => {
    //             console.log('Error: ', error);
    //         };
    //         reader.readAsDataURL(file);
    //     });
    // };

    //rohit - delete
    // const handleImageSelect = (event) => {
    //     const files = Array.from(event.target.files);
    //     const newImageState = [...imageState];

    //      // files.forEach((file) => {
    //     //     const reader = new FileReader();
    //     //     reader.onloadend = () => {
    //     //         // file.data_url = reader.result;
    //     //         setSelectedImageList([...selectedImageList, reader.result]);
    //     //     };
    //     //     reader.onerror = (error) => {
    //     //         console.log('Error: ', error);
    //     //     };
    //     //     reader.readAsDataURL(file);
    //     // });
    //     const readFile = (file) => {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //           // file.data_url = reader.result;
    //           newImageState.push(reader.result);
        
    //           if (newImageState.length === files.length) {
    //             setImageState(newImageState);
    //           }
    //         };
    //         reader.onerror = (error) => {
    //           console.log('Error: ', error);
    //         };
    //         reader.readAsDataURL(file);
    //     };

    //     files.forEach((file) => {
    //         readFile(file);
    //     });
       
    // };

    const readImage = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            file.image = e.target.result;
        //   const newImageState = [...imageState];
        //   newImageState.push(file);
        //   setImageState(newImageState);
            setImageState((prevImageState) => [...prevImageState, file]);
        };
        reader.readAsDataURL(file.file);
    };
    
    const addFile = (event) => {
        const files = Array.from(event.target.files);
        let currentIndex = imageState.length;

        files.forEach((file, i) => {
            const fileObj = {
                index: currentIndex,
                file: file,
                image: null,
                coverPhoto: currentIndex + i === 0,
            };
            readImage(fileObj);
            currentIndex++;
        });
    };

    const deleteImage = (image) => {
        const newImageState = imageState.filter(
          (file) => file.index !== image.index
        );
        if (image.coverPhoto && newImageState.length > 0) {
          newImageState[0].coverPhoto = true;
        }
        setImageState(newImageState);
      };
    
    const favoriteImage = (favoriteFile) => {
        const newImageState = [...imageState];
        for (const file of newImageState) {
            file.coverPhoto = file.index === favoriteFile.index;
        }
        setImageState(newImageState);
    };


    //rohit - delete if other one works
    // const handleImageFavorite = (event) => {
    //     // console.log("handleImageFavorite event", event)
    //     // const index = event
    //     // const file = selectedImageList[index]
    //     // if (file.favorite === undefined) file.favorite = true
    //     // else (file.favorite = !file.favorite)
    //     // console.log(file.favorite)
    //     // setSelectedImageList([...selectedImageList]);

    //     const index = event;
    //     let file = selectedImageList[index];

    //     if (typeof file === 'string') {
            
    //         file = { url: file, favorite: true }; 

            
    //         setSelectedImageList([
    //             ...selectedImageList.slice(0, index), 
    //             file, 
    //             ...selectedImageList.slice(index + 1),
    //         ]);
    //     } else if (typeof file === 'object') {
    //         file.favorite = !file.favorite;
    //         setSelectedImageList([...selectedImageList]);
    //     } else {
            
    //         console.error("The selected item is neither a string nor an object.");
    //     }
    // };

    // const handleImageTrash = (event) => {
    //     console.log("handleImageTrash", event)
    //     const index = event
    //     selectedImageList.splice(index, 1);
    //     setSelectedImageList([...selectedImageList]);
    // }

    return (
        <Container fixed sx={{
            backgroundColor: 'white',
            borderColor: 'black',
            borderRadius: '7px',
            borderStyle: 'dashed',
            borderColor: theme.typography.common.blue,
        }}>
            
            {/* {selectedImageList.length === 0 && ( */}
            {imageState.length === 0 && (
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
                            // onChange={handleImageSelect}
                            onChange={addFile}
                        />
                        <AddPhotoAlternateIcon sx={{color: theme.typography.common.blue, fontSize: "30px", marginRight: "10px"}}/>
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                            Add Pictures
                        </Typography>
                        </Button>
                </Box>
            )} 
            {/* {selectedImageList.length > 0 && ( */}
            {imageState.length > 0 && (
                <Box
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
                    padding={10}
                >
                    <Grid container>
                        {/* {selectedImageList.map((image, index) => ( */}
                        {imageState.map((file, index) => (
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
                                    {/* <img
                                        src={page==="Edit" ?
                                         (image === undefined || image === null ? image : image) : image}
                                        alt="new"
                                        key={index}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            height: '100%',
                                            width: '100%',
                                            marginRight: '5px',
                                            marginBottom: '5px',
                                            borderRadius: '7px',
                                        }}
                                    /> */}
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
                                        // src={`${file.image}?${Date.now()}`}
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
                                            top: "-5px",
                                            left: "40px",
                                            zIndex: 1,
                                        }}
                                    >
                                        <IconButton 
                                            // onClick={() => handleImageTrash(index)}
                                            onClick={() => deleteImage(file)}
                                        >
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
                                        <IconButton onClick={() => favoriteImage(file)}>
                                            {imageState[index].coverPhoto === true ? (
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
                                    // onChange={handleImageSelect}
                                    onChange={addFile}
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