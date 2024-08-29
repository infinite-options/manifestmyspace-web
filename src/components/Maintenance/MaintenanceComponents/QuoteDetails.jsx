import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, Description as DescriptionIcon } from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';
import dayjs from 'dayjs';
import APIConfig from "../../../utils/APIConfig";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import NoImageAvailable from '../../../images/NoImageAvailable.png';

const QuoteDetails = ({ maintenanceItem, initialIndex, maintenanceQuotesForItem, fetchAndUpdateQuotes}) => {
    //console.log('----QuoteDetails maintenanceQuotesForItem----', initialIndex);

    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    //console.log('currentIndex=----', currentIndex);
    const currentItem = maintenanceQuotesForItem && maintenanceQuotesForItem[initialIndex];
    //console.log('currentItem=----', currentItem);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
		setCurrentIndex(initialIndex);
	}, [initialIndex]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? maintenanceQuotesForItem.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === maintenanceQuotesForItem.length - 1 ? 0 : prevIndex + 1));
    };

    const renderParts = (item) => {
        try {
            const expenses = JSON.parse(item.quote_services_expenses);
            console.log('Expenses:', expenses);
            if (expenses.parts && expenses.parts.length > 0) {
                const partsTotal = expenses.parts.reduce((total, part) => {
                    const cost = parseFloat(part.cost);
                    const quantity = parseFloat(part.quantity);
                    return total + (cost * quantity);
                }, 0);
                return (
                    <Grid container sx={{ paddingTop: '10px' }}>
                        {expenses.parts.map((part, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={3}>
                                    <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                        Parts: {part.part}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                        Quantity: {part.quantity}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                        Cost: ${part.cost}
                                    </Typography>
                                </Grid>
                            </React.Fragment>
                        ))}
                        <Grid item xs={6}>
                            <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                Parts Total:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                ${partsTotal.toFixed(2)}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            } else {
                console.log('No parts found in expenses');
            }
        } catch (error) {
            console.error('Error parsing quote_services_expenses:', error);
        }
        return null;
    };

    const handleSubmit = (quoteStatusParam) => {
        console.log("handleSubmit", quoteStatusParam);
    
        const changeMaintenanceQuoteStatus = async (quoteStatusParam) => {
          setShowSpinner(true);
          var formData = new FormData();
    
          formData.append("maintenance_quote_uid", currentItem?.maintenance_quote_uid);
          formData.append("quote_status", quoteStatusParam);
    
          try {
            const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceQuotes`, {
              method: "PUT",
              body: formData,
            });
            let responseData = await response.json();
            console.log(responseData);
            if (response.status === 200) {
              console.log("success");
              assignMaintenanceRequest(currentItem?.quote_business_id, maintenanceItem.maintenance_request_uid);
            }
          } catch (error) {
            console.log("error", error);
          }
          setShowSpinner(false);
        };
    
        const assignMaintenanceRequest = async (assigned_business, request_uid) => {
          setShowSpinner(true);
          var formData = new FormData();
          formData.append("maintenance_assigned_business", assigned_business);
          formData.append("maintenance_request_uid", request_uid);
          formData.append("maintenance_request_status", "PROCESSING");
    
          try {
            console.log("trying to put maintenance assigned business", formData);
            const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceRequests`, {
              method: "PUT",
              body: formData,
            });
            let responseData = await response.json();
            console.log(responseData);
            if (response.status === 200) {
              console.log("success");
                //handleBackButton();
                fetchAndUpdateQuotes();
              
            } else {
              console.log("error changing maintenance assigned business");
            }
          } catch (error) {
            console.log("error", error);
          }
          setShowSpinner(false);
        };
    
        changeMaintenanceQuoteStatus(quoteStatusParam);
      };

      const [scrollPosition, setScrollPosition] = useState(0);
	const scrollRef = useRef(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollLeft = scrollPosition;
		}
	}, [scrollPosition]);

	const handleScroll = (direction) => {
		if (scrollRef.current) {
			const scrollAmount = 200;
			setScrollPosition((prevScrollPosition) => {
				const currentScrollPosition = scrollRef.current.scrollLeft;
				let newScrollPosition;
	
				if (direction === 'left') {
					newScrollPosition = Math.max(currentScrollPosition - scrollAmount, 0);
				} else {
					newScrollPosition = currentScrollPosition + scrollAmount;
				}
	
				return newScrollPosition;
			});
		}
	};

    const isAnyQuoteAccepted = maintenanceQuotesForItem.some(item => item.quote_status === 'ACCEPTED');


    return (
        <Card
            variant="outlined"
            sx={{
                width: 800, // Fixed width for the main card
                margin: 'auto',
                mt: 5,
                p: 3,
                backgroundColor: '#f2f1f9',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#2c2a75', fontWeight: 'bold' }}>
                    Quotes Details
                </Typography>

                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    
                    <Card
                        variant="outlined"
                        sx={{
                            width: 650, // Slightly smaller width for the inner card
                            margin: 'auto',
                            p: 3,
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Carousel
                            navButtonsAlwaysInvisible={true}
                            autoPlay={false}
                            index={currentIndex}
                            indicators={false}
                            onChange={(now, previous) => setCurrentIndex(now)}
                            sx={{ width: '100%', 
                            height: '400px',  // Set the desired fixed height here
                            overflow: 'hidden' // Ensure content doesn't overflow
                         }}
                        >
                            {maintenanceQuotesForItem.map((item, index) => (
                                <Box key={index} sx={{ padding: 2 }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" sx={{ color: '#2c2a75', fontWeight: 'bold' }}>
                                                {item.maint_business_name} ({item.quote_business_id})
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                                Quote Submitted:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                                {item.quote_created_date}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                                Earliest Availability
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                                {item.quote_earliest_available_date}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                                Diagnostic Fees Included:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                                Yes
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                                Written Quote:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <DescriptionIcon sx={{ color: '#2c2a75' }} />
                                        </Grid>
                                        {item?.quote_services_expenses &&
                                        JSON.parse(item?.quote_services_expenses)?.event_type === 'Fixed Bid' ? (
                                            <Grid container sx={{ paddingTop: '10px' }}>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                                        Fixed Bid
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                                                        $
                                                        {JSON.parse(item?.quote_services_expenses)?.labor[0]?.rate || 0}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        ) : null}
                                        {item?.quote_services_expenses ? renderParts(item) : null}
                                        <Grid item xs={6}>
                                            <Typography variant="body2" gutterBottom sx={{ color: '#2c2a75' }}>
                                                Quote Total:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" gutterBottom sx={{ color: '#2c2a75' }}>
                                                <strong>${item.quote_total_estimate}</strong>
                                            </Typography>
                                        </Grid>
                                        {maintenanceItem?.maintenance_request_status === 'SCHEDULED' ? (
                                            <>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#2c2a75' }}>
                                                        Scheduled Date: {maintenanceItem?.maintenance_scheduled_date}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#2c2a75' }}>
                                                        Scheduled Time:{' '}
                                                        {dayjs(
                                                            maintenanceItem?.maintenance_scheduled_time,
                                                            'HH:mm'
                                                        ).format('h:mm A')}
                                                    </Typography>
                                                </Grid>
                                            </>
                                        ) : null}
                                        <Grid item xs={12}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										padding: 2,
									}}
								>
									<IconButton
										onClick={() => handleScroll('left')}
										disabled={scrollPosition === 0}
									>
										<ArrowBackIosIcon />
									</IconButton>
									<Box
										sx={{
											display: 'flex',
											overflowX: 'auto',
											scrollbarWidth: 'none',
											msOverflowStyle: 'none',
											'&::-webkit-scrollbar': {
												display: 'none',
											},
										}}
									>
										<Box
											sx={{
												display: 'flex',
												overflowX: 'auto',
												scrollbarWidth: 'none',
												msOverflowStyle: 'none',
												'&::-webkit-scrollbar': {
													display: 'none',
												},
											}}
										>
										<ImageList 
    ref={scrollRef}
    sx={{ display: 'flex', flexWrap: 'nowrap' }} 
    cols={5}
>
    {JSON.parse(item.quote_maintenance_images)?.length > 0 ? (
        JSON.parse(item.quote_maintenance_images).map((image, index) => (
            <ImageListItem
                key={index}
                sx={{
                    width: 'auto',
                    flex: '0 0 auto',
                    border: '1px solid #ccc',
                    margin: '0 2px',
                    position: 'relative', // Added to position icons
                }}
            >
                <img
                    src={image}
                    alt={`maintenance-${index}`}
                    style={{
                        height: '150px',
                        width: '150px',
                        objectFit: 'cover',
                    }}
                />
            </ImageListItem>
        ))
    ) : (
        <ImageListItem
            sx={{
                width: 'auto',
                flex: '0 0 auto',
                border: '1px solid #ccc',
                margin: '0 2px',
                position: 'relative',
            }}
        >
            <img
                src={NoImageAvailable}
                alt="No images available"
                style={{
                    height: '150px',
                    width: '150px',
                    objectFit: 'cover',
                }}
            />
        </ImageListItem>
    )}
</ImageList>
										</Box>
									</Box>
									<IconButton onClick={() => handleScroll('right')}>
										<ArrowForwardIosIcon />
									</IconButton>
								</Box>
							
									

								</Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Carousel>
                    </Card>
                   
                </Box>
            </CardContent>
            {currentItem && (
                <Box display="flex" justifyContent="space-between" p={2}>
                    {currentItem.quote_status === 'REQUESTED' ? (
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#F87C7A',
                                '&:hover': {
                                    backgroundColor: '#F87C7A',
                                },
                                color: '#160449',
                                fontWeight: 'bold',
                                textTransform: 'none',
                            }}
                            onClick={() => handleSubmit("WITHDRAWN")}
                        >
                            Withdraw
                        </Button>
                    ) : currentItem.quote_status === 'SENT' ? (
                        <>
                           {!isAnyQuoteAccepted && (
            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#9EAED6',
                    '&:hover': {
                        backgroundColor: '#9EAED6',
                    },
                    color: '#160449',
                    fontWeight: 'bold',
                    textTransform: 'none',
                }}
                onClick={() => handleSubmit("ACCEPTED")}
            >
                Accept
            </Button>
        )}
        <Button
            variant="contained"
            sx={{
                backgroundColor: '#FFC614',
                '&:hover': {
                    backgroundColor: '#FFC614',
                },
                color: '#160449',
                fontWeight: 'bold',
                textTransform: 'none',
            }}
            onClick={() => handleSubmit("REJECTED")}
        >
            Decline
        </Button>
    </>
                    ) : currentItem.quote_status === 'ACCEPTED' ? (
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#F87C7A',
                                '&:hover': {
                                    backgroundColor: '#F87C7A',
                                },
                                color: '#160449',
                                fontWeight: 'bold',
                                textTransform: 'none',
                            }}
                            onClick={() => handleSubmit("REJECTED")}
                        >
                            Reject
                        </Button>
                    ) : null}
                </Box>
            )}
        </Card>
    );
};

export default QuoteDetails;
