import React from 'react';
import MenuItem from '@mui/material/MenuItem';

const stateAbbreviations = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

function StateMenuItems() {
  return (
    <>
      {stateAbbreviations.map((state) => (
        <MenuItem key={state} value={state}>{state}</MenuItem>
      ))}
    </>
  );
}

export default StateMenuItems;
