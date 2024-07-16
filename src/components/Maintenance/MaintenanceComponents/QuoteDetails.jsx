import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, Description as DescriptionIcon } from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';

const QuoteDetails = ({ maintenanceItem, navigateParams, maintenanceQuotesForItem }) => {
  console.log('----QuoteDetails maintenanceQuotesForItem----', maintenanceQuotesForItem);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = maintenanceQuotesForItem && maintenanceQuotesForItem[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? maintenanceQuotesForItem.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex === maintenanceQuotesForItem.length - 1 ? 0 : prevIndex + 1));
  };

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
          <IconButton
            sx={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)' }}
            onClick={handlePrev}
          >
            <ArrowBack sx={{ color: '#2c2a75' }} />
          </IconButton>
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
              animation="slide"
              indicators={false}
              onChange={(now, previous) => setCurrentIndex(now)}
              sx={{ width: '100%' }}
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
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                        Fixed Bid
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                        {item.quote_total_estimate}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" gutterBottom sx={{ color: '#2c2a75' }}>
                        Quote Total:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" gutterBottom sx={{ color: '#2c2a75' }}>
                        <strong>{item.quote_total_estimate}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Carousel>
          </Card>
          <IconButton
            sx={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)' }}
            onClick={handleNext}
          >
            <ArrowForward sx={{ color: '#2c2a75' }} />
          </IconButton>
        </Box>
      </CardContent>
      {currentItem && (
        <Box display="flex" justifyContent="space-between" p={2}>
          {currentItem.quote_status === 'REQUESTED' ? (
            <>
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
              >
                Accept
              </Button>
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
