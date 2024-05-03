import { Box, Button, Typography, Stack, Grid, MenuItem, Menu, Table, TableBody, TableCell, TableContainer, TableHead, Paper, TableRow, ListItemAvatar } from "@mui/material";

import DashboardTab from './NewDashboardTab'
// import NewTenantDashboardBalance from './NewTenantDashboardBalance'

export default function NewTenantDashboard(){
  return (
    <Box sx={{padding: "25px"}}>
      <Box>
        Menu
      </Box>
      <Grid container>
        <Grid item xs={12}>
          <p> Welcome </p>
        </Grid>
        <Grid item xs={4}>
          <p>Account Balance</p>
          {/* <NewTenantDashboardBalance/> */}
        </Grid>
        <Grid item xs={8}>
          <Grid container>
            <Grid item xs={6}>
              <p>Payment History</p>
            </Grid>
            <Grid item xs={6}>
              <p>Maintenance</p>
            </Grid>
            <Grid item xs={12}>
              <p>Annoucements</p>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}