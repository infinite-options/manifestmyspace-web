import React from 'react';
import { TextField, Button, Grid, Select, MenuItem, Typography, FormControl, InputLabel, Card, CardContent, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import MapIcon from '@mui/icons-material/Map';

const useStyles = makeStyles({
  card: {
    marginBottom: '16px',
    backgroundColor: '#D6D5DA',
  },
  cardContent: {
    padding: '16px',
  },
  button: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed #ccc',
    borderRadius: '8px',
    color: '#3f51b5',
    textTransform: 'none',
  },
  formControl: {
    minWidth: 120,
  },
  label: {
    display: 'flex',
    alignItems: 'center',
  },
  inputField: {
    backgroundColor: '#f7f8fc',
  }
});

const PropertyForm = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="md" style={{ backgroundColor: '#F2F2F2', padding: '16px' }}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button className={classes.button} fullWidth startIcon={<MapIcon />}>
                Show Google Map
              </Button>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.label}>
                      <Typography>Address</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth className={classes.formControl}>
                        <InputLabel>Select type</InputLabel>
                        <Select>
                          <MenuItem value={10}>Type 1</MenuItem>
                          <MenuItem value={20}>Type 2</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.label}>
                      <Typography>Unit</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth className={classes.inputField} placeholder="Unit number" />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.label}>
                      <Typography>City</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth className={classes.inputField} placeholder="City" autoComplete />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.label}>
                      <Typography>State</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth className={classes.inputField} placeholder="State" autoComplete />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.label}>
                      <Typography>Zip Code</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth className={classes.inputField} placeholder="Zip Code" autoComplete />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Other sections can be added similarly */}
    </Container>
  );
};

export default PropertyForm;
