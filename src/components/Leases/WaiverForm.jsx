import React, { useState } from 'react';
import { TextField, Typography, Button, Checkbox, FormControlLabel, Container, Grid, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TenantDashboard from '../TenantDashboard/TenantDashboard';

const WaiverForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        consent: false,
        initialsProperty: '',
        initialsLeaseTerms: '',
        initialsRentPayment: '',
        initialsSecurityDeposit: '',
        initialsMaintenance: '',
      });
    
      const [formErrors, setFormErrors] = useState({});
      const navigate = useNavigate();
    
      const handleInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
          ...formData,
          [name]: type === 'checkbox' ? checked : value
        });
      };
    
      const validateForm = () => {
        let errors = {};
        if (!formData.firstName) {
          errors.firstName = 'First name is required';
        }
        if (!formData.lastName) {
          errors.lastName = 'Last name is required';
        }
        if (!formData.email) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = 'Email is invalid';
        }
        if (!formData.initialsProperty || !formData.initialsLeaseTerms || !formData.initialsRentPayment ||
            !formData.initialsSecurityDeposit || !formData.initialsMaintenance) {
          errors.initials = 'Please initial all sections';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
          // Process form submission (send data to backend)
          console.log('Form submitted', formData);
          navigate('/confirmation');
        }
      };
    
      return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              Lease Agreement Form
            </Typography>
    
            <Typography variant="body1" gutterBottom>
              Please carefully read and initial each section of the lease agreement below.
            </Typography>
    
            <form onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    fullWidth
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                  />
                </Grid>
    
                {/* Property Section */}
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    I acknowledge that I have inspected the property and agree to its condition.
                  </Typography>
                  <TextField
                    name="initialsProperty"
                    label="Initials"
                    fullWidth
                    value={formData.initialsProperty}
                    onChange={handleInputChange}
                    error={!!formErrors.initialsProperty}
                    helperText={formErrors.initialsProperty}
                  />
                </Grid>
    
                {/* Lease Terms Section */}
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    I agree to the terms of the lease as outlined in the lease document.
                  </Typography>
                  <TextField
                    name="initialsLeaseTerms"
                    label="Initials"
                    fullWidth
                    value={formData.initialsLeaseTerms}
                    onChange={handleInputChange}
                    error={!!formErrors.initialsLeaseTerms}
                    helperText={formErrors.initialsLeaseTerms}
                  />
                </Grid>
    
                {/* Rent Payment Section */}
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    I agree to the rent payment terms and understand the due dates.
                  </Typography>
                  <TextField
                    name="initialsRentPayment"
                    label="Initials"
                    fullWidth
                    value={formData.initialsRentPayment}
                    onChange={handleInputChange}
                    error={!!formErrors.initialsRentPayment}
                    helperText={formErrors.initialsRentPayment}
                  />
                </Grid>
    
                {/* Security Deposit Section */}
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    I agree to the terms related to the security deposit.
                  </Typography>
                  <TextField
                    name="initialsSecurityDeposit"
                    label="Initials"
                    fullWidth
                    value={formData.initialsSecurityDeposit}
                    onChange={handleInputChange}
                    error={!!formErrors.initialsSecurityDeposit}
                    helperText={formErrors.initialsSecurityDeposit}
                  />
                </Grid>
    
                {/* Maintenance and Repairs Section */}
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    I understand the policies related to maintenance and repairs.
                  </Typography>
                  <TextField
                    name="initialsMaintenance"
                    label="Initials"
                    fullWidth
                    value={formData.initialsMaintenance}
                    onChange={handleInputChange}
                    error={!!formErrors.initialsMaintenance}
                    helperText={formErrors.initialsMaintenance}
                  />
                </Grid>
    
                {/* Consent Section */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                      />
                    }
                    label="I agree to the terms of the lease agreement"
                  />
                  {formErrors.consent && (
                    <Typography color="error" variant="body2">
                      {formErrors.consent}
                    </Typography>
                  )}
                </Grid>
    
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="center" spacing={2}>
                    <Button variant="contained" color="primary" type="submit">
                      Submit
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/tenantDashboard')}>
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      );
    };

export default WaiverForm;
