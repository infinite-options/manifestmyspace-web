import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Select, MenuItem, Typography, FormControlLabel, Checkbox, Card, CardContent, Container, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import MapIcon from '@mui/icons-material/Map';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AddressAutocompleteInput from "./AddressAutocompleteInput";
import theme from "../../theme/theme";
import { useUser } from "../../contexts/UserContext";

const useStyles = makeStyles({
  card: {
    marginBottom: '16px',
    backgroundColor: '#D6D5DA',
    padding: '16px',
  },
  cardContent: {
    padding: '16px',
    backgroundColor: '#D6D5DA',
  },
  button: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed #ccc',
    borderRadius: '8px',
    color: '#3f51b5',
    textTransform: 'none', // Ensure text is not transformed to uppercase
  },
  formControl: {
    minWidth: 120,
  },
  appliances: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  buttonPrimary: {
    backgroundColor: '#6a5acd',
    color: '#fff',
    textTransform: 'none', // Ensure text is not transformed to uppercase
    '&:hover': {
      backgroundColor: '#483d8b',
    },
  },
  buttonSecondary: {
    backgroundColor: '#bc8f8f',
    color: '#fff',
    textTransform: 'none', // Ensure text is not transformed to uppercase
    '&:hover': {
      backgroundColor: '#8b7b8b',
    },
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: theme.typography.primary.fontWeight,
    color: '#160449',
    fontSize: 16,
  },
  inputField: {
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: "3px",
    height: '40px', // Consistent height for all text fields
  },
  autocompleteInput: {
    width: '100%',
    height: '40px', // Consistent height for the autocomplete input
  }
});

const PropertyForm = () => {
  const classes = useStyles();
  const { user, selectedRole, selectRole, Name } = useUser();
  //const [readOnlyNotes, setReadOnlyNotes] = useState(selectedRole === "MANAGER" ? true : false);
  const [readOnlyNotes, setReadOnlyNotes] = useState(false);
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
              <Grid container spacing={1}>
                <Grid item xs={2}>
                  <Typography sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 16 }}>Address</Typography>
                </Grid>
                <Grid item xs={10}>
                  <AddressAutocompleteInput className={classes.autocompleteInput} />
                </Grid>
                <Grid item xs={2}>
                  <Typography sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 16 }}>Unit</Typography>
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    className={classes.inputField}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 16 }}>City</Typography>
                </Grid>
                <Grid item xs={10}>
                  <TextField size="small" fullWidth className={classes.inputField} placeholder="City" />
                </Grid>
                <Grid item xs={2}>
                  <Typography sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 16 }}>State</Typography>
                </Grid>
                <Grid item xs={10}>
                  <TextField size="small" fullWidth className={classes.inputField} placeholder="State" />
                </Grid>
                <Grid item xs={2}>
                  <Typography sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 16 }}>Zip Code</Typography>
                </Grid>
                <Grid item xs={10}>
                  <TextField size="small" fullWidth className={classes.inputField} placeholder="Zip Code" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button className={classes.button} fullWidth startIcon={<AddAPhotoIcon />}>
                Add Pictures
              </Button>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={1}>
                <Grid item xs={2}>
                  <Typography sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 16 }}>Type</Typography>
                </Grid>
                <Grid item xs={10}>
                <Select
                    sx={{
                      backgroundColor: "white",
                      borderColor: "black",
                      borderRadius: "7px",
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
                <Grid item xs={2}>
                  <Typography sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 16 }}>SqFt</Typography>
                </Grid>
                <Grid item xs={10}>
                  <TextField size="small" fullWidth className={classes.inputField} placeholder="Enter sqft" />
                </Grid>
                <Grid item xs={2}>
                  <Typography sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 16 }}>Bedrooms</Typography>
                </Grid>
                <Grid item xs={10}>
                  <TextField size="small" fullWidth className={classes.inputField} placeholder="# of bedrooms" />
                </Grid>
                <Grid item xs={2}>
                  <Typography size="small" sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 16 }}>Bathrooms</Typography>
                </Grid>
                <Grid item xs={10}>
                  <TextField size="small" fullWidth className={classes.inputField} placeholder="# of bathrooms" />
                </Grid>
                <Grid item xs={2}>
                  <Typography sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 16 }}>Property Value</Typography>
                </Grid>
                <Grid item xs={10}>
                  <TextField size="small" fullWidth className={classes.inputField} placeholder="$" />
                </Grid>
                <Grid item xs={2}>
                  <Typography sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 16 }}>$/SqFt</Typography>
                </Grid>
                <Grid item xs={10}>
                <Typography>0</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
            
        <Grid item xs={12}>
                  <Typography sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 16 }}>
                    Owner Notes
                  </Typography>
                  <TextField
                    fullWidth
                    sx={{
                      backgroundColor: readOnlyNotes ? theme.palette.form.main : "white",
                      borderColor: "black",
                      borderRadius: "7px",
                    }}
                    InputProps={{
                      readOnly: readOnlyNotes,
                    }}
                    size="small"
                    multiline={true}
                  />
                </Grid>
                <Grid item xs={12}>
                <Typography sx={{ color: '#160449', fontWeight: theme.typography.primary.fontWeight, fontSize: 14 }}>
                    Appliances Included
                  </Typography>
                <Grid container spacing={0}>
            {['Fridge', 'Oven/Range', 'Cooktop', 'Washer', 'Dryer', 'Air Conditioning', 'Central Heating', 'Dishwasher', 'Garbage Disposal', 'Microwave', 'Ceiling Fans', 'Window Coverings', 'Fireplace', 'Other'].map((appliance, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={appliance}
                />
              </Grid>
            ))}
          </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" fullWidth sx={{
                                backgroundColor: '#9EAED6',
                                '&:hover': {
                                    backgroundColor: '#9EAED6',
                                },
                                color: '#160449',
                                fontWeight: 'bold',
                                textTransform: 'none',
                            }}>Save Property</Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" fullWidth  sx={{
                                backgroundColor: '#D29494',
                                '&:hover': {
                                    backgroundColor: '#D29494',
                                },
                                color: '#160449',
                                fontWeight: 'bold',
                                textTransform: 'none',
                            }}>Save Property & Select Property Manager</Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PropertyForm;
