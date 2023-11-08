import { useEffect, useState } from "react";
import {
    Box,
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
        <>
            <Box
                sx={{
                    width: '10%',
                    height: '150px',
                    backgroundColor: '#F2F2F2',
                    backgroundImage: currentImageIndex > 0? `url(${images[currentImageIndex - 1]})` : ``,
                    backgroundSize: 'cover',
                    backgroundPosition: 'right',
                    backgroundRepeat: 'no-repeat',
                    opacity: '0.7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '@media screen and (max-width: 600px)': {
                        width: '20%',
                    },
                }}
                onClick={ ()=> {
                        setCurrentImageIndex(currentImageIndex > 0? currentImageIndex - 1 : 0)
                    }                    
                }
            >
                <ArrowBackIosIcon
                    sx={{
                        fontWeight: 'bold',
                    }}
                />

            </Box>
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
                    backgroundColor: '#F2F2F2',
                    backgroundImage: currentImageIndex < images.length - 1? `url(${images[currentImageIndex + 1]})` : ``,
                    backgroundSize: 'cover',
                    backgroundPosition: 'left',
                    backgroundRepeat: 'no-repeat',
                    opacity: '0.7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '@media screen and (max-width: 600px)': {
                        width: '20%',
                    },
                
                }}
                onClick={ ()=> {
                    setCurrentImageIndex(currentImageIndex < images.length - 1? currentImageIndex + 1 : images.length - 1);
                }                    
            }
            >
                <ArrowForwardIosIcon
                    sx={{
                        fontWeight: 'bold',
                    }}
                />

            </Box>
        </>
    );
}

export default ImageCarousel;