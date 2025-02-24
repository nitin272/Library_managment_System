import React from 'react';
import { Typography, Paper, Grid } from '@mui/material';

const DashboardOverview = () => {
  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-6">
        Welcome to Library Management System
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-2">
              Quick Actions
            </Typography>
            <Typography variant="body1">
              Use the sidebar menu to navigate through different sections of the admin dashboard.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardOverview; 