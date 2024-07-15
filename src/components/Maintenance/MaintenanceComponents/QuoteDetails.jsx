import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, Description as DescriptionIcon } from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';

const QuoteDetails = ({ maintenanceItem, navigateParams, maintenanceQuotesForItem }) => {
  console.log('----QuoteDetails maintenanceQuotesForItem----', maintenanceQuotesForItem);
  const items = [
    {
      id: "600-000012",
      title: "PM Maintenance",
      quoteSubmitted: "06-12-2024 12:45pm",
      earliestAvailability: "06-14-2024 02:30pm",
      diagnosticFeesIncluded: "Yes",
      fixedBid: "$2400.00",
      quoteTotal: "$2400.00"
    },
    {
      id: "600-000011",
      title: "Lasya",
      quoteSubmitted: "06-12-2024 12:45pm",
      earliestAvailability: "06-14-2024 02:30pm",
      diagnosticFeesIncluded: "Yes",
      fixedBid: "$7400.00",
      quoteTotal: "$8400.00"
    },
    // Add more items as needed
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
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
              {items.map((item, index) => (
                <Box key={index} sx={{ padding: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ color: '#2c2a75', fontWeight: 'bold' }}>
                        {item.title} ({item.id})
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                        Quote Submitted:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                        {item.quoteSubmitted}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                        Earliest Availability
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                        {item.earliestAvailability}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                        Diagnostic Fees Included:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#2c2a75' }}>
                        {item.diagnosticFeesIncluded}
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
                        {item.fixedBid}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" gutterBottom sx={{ color: '#2c2a75' }}>
                        Quote Total:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" gutterBottom sx={{ color: '#2c2a75' }}>
                        <strong>{item.quoteTotal}</strong>
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
      <Box display="flex" justifyContent="space-between" p={2}>
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
          Accepted
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
          Not Accepted
        </Button>
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
          Rejected
        </Button>
      </Box>
    </Card>
  );
};

export default QuoteDetails;
