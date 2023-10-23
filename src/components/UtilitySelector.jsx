import React, { useState, Fragment } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

import theme from '../theme/theme';

export default function UtilitySelection({existingSelection}){
    const defaultUtilitySelection = {
        electricity: 'Owner',
        trash: 'Tenant',
        water: 'Tenant',
        wifi: 'Tenant',
        gas: 'Tenant',
    };
    
    const [utilitySelection, setUtilitySelection] = useState(
        existingSelection || defaultUtilitySelection
    );

    const handleUtilityChange = (utility, value) => {
        setUtilitySelection({
        ...utilitySelection,
        [utility]: value,
        });
    };

    const capitalizeUtility = (utility) => {
        return utility.charAt(0).toUpperCase() + utility.slice(1);
    }

    return (
        <Grid container columnSpacing={2} rowSpacing={3}>
            <Grid item xs={12}>
                <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.largeFont}}>
                    Utilities Paid by
                </Typography>
            </Grid>
            {Object.entries(utilitySelection).map(([utility, selectedValue]) => (
                <Fragment key={utility}>
                    <Grid item xs={6}>
                        <Typography sx={{color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize:theme.typography.mediumFont}}>
                        {capitalizeUtility(utility)}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                        value="Owner"
                        control={
                            <Radio
                            checked={selectedValue === 'Owner'}
                            onChange={() => handleUtilityChange(utility, 'Owner')}
                            />
                        }
                        label="Owner"
                        />
                        <FormControlLabel
                        value="Tenant"
                        control={
                            <Radio
                            checked={selectedValue === 'Tenant'}
                            onChange={() => handleUtilityChange(utility, 'Tenant')}
                            />
                        }
                        label="Tenant"
                        />
                    </Grid>
                </Fragment>
            ))}
        </Grid>
    );
};

