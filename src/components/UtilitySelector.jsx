import React, { useState, useEffect, Fragment } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

import theme from '../theme/theme';

export default function UtilitySelection({existingSelection, onChangeUtilities}){
    const defaultUtilitySelection = {
        electricity: 'owner',
        trash: 'tenant',
        water: 'tenant',
        internet: 'tenant',
        gas: 'tenant',
    };
    
    const [utilitySelection, setUtilitySelection] = useState(
        existingSelection || defaultUtilitySelection
    );

    useEffect(()=>{
        onChangeUtilities(utilitySelection);
    }, [utilitySelection]);

    const handleUtilityChange = (utility, value) => {
        setUtilitySelection({
        ...utilitySelection,
        [utility]: value,
        });
    };

    const capitalizeFirstChar = (utility) => {
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
                        {capitalizeFirstChar(utility)}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                        value="owner"
                        control={
                            <Radio
                            checked={selectedValue === 'owner'}
                            onChange={() => handleUtilityChange(utility, 'owner')}
                            />
                        }
                        label="Owner"
                        />
                        <FormControlLabel
                        value="tenant"
                        control={
                            <Radio
                            checked={selectedValue === 'tenant'}
                            onChange={() => handleUtilityChange(utility, 'tenant')}
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

