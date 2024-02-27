import { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Stack,
    Button
} from '@mui/material';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function ImageCarousel(props) {
    let images = props.images;
    const [ currentImageIndex, setCurrentImageIndex ] = useState(0);

    // useEffect(() => {
    //     console.log("IMAGE INDEX:", currentImageIndex);
    // }, [currentImageIndex]);

    // console.log("IMAGE LINK:", images[2]);

    return (
        <Grid container justifyContent="center">
            <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={2}>
                    <Button onClick={ ()=> setCurrentImageIndex(currentImageIndex > 0? currentImageIndex - 1 : 0)}>
                        <ArrowBackIosIcon
                            sx={{
                                fontWeight: 'bold',
                            }}                 
                        />
                    </Button>
                    <Box
                        sx={{
                            width: '10%',
                            height: '150px',
                            backgroundColor: '#FFFFFF',
                            backgroundImage: currentImageIndex > 0? `url(${images[currentImageIndex - 1]})` : ``,
                            backgroundSize: 'cover',
                            backgroundPosition: 'right',
                            backgroundRepeat: 'no-repeat',
                            opacity: '0.7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '@media screen and (maxWidth: 600px)': {
                                width: '20%',
                            },
                            marginRight: "10px"
                        }}
                    />
                    <Box
                        sx={{
                            height: '150px',
                            backgroundColor: 'black',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <img src={images[currentImageIndex]} alt="Property Img" style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                            }} />

                        </Box>
                        
                    </Box>
                    <Box
                        sx={{
                            width: '10%',
                            height: '150px',
                            backgroundColor: '#FFFFFF',
                            backgroundImage: currentImageIndex < images.length - 1? `url(${images[currentImageIndex + 1]})` : ``,
                            backgroundSize: 'cover',
                            backgroundPosition: 'left',
                            backgroundRepeat: 'no-repeat',
                            opacity: '0.7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '@media screen and (maxWidth: 600px)': {
                                width: '20%',
                            },
                            marginLeft: "10px"
                        }}
                    />
                    <Button onClick={ ()=> setCurrentImageIndex(currentImageIndex < images.length - 1? currentImageIndex + 1 : images.length - 1)}>
                        <ArrowForwardIosIcon sx={{fontWeight: 'bold'}}/>
                    </Button>
                </Stack>
            </Stack>
        </Grid>
    );
}

export default ImageCarousel;