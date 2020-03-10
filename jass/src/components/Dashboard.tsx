import React from 'react';
import Button from '@material-ui/core/Button';
import {Grid} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

function Dashboard() {

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Recent Activity</h2>

            <Grid container
                  spacing={10}
                  direction="row"
                  justify="center"
                  align-items="center">
                <Grid item xs={12} md={4} lg={2}>
                    <Paper>test</Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <Paper>test</Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <Paper>test</Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <Paper>test</Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <Paper>test</Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <Paper>test</Paper>
                </Grid>

            </Grid>

            <h2>Games</h2>

            <Grid container
                  spacing={10}
                  direction="row"
                  justify="center"
                  align-items="center">
                <Grid item xs={12} md={4} lg={2}>
                    <Paper>test</Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <Paper>test</Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <Paper>test</Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <Paper>test</Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <Paper>test</Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <Paper>test</Paper>
                </Grid>

            </Grid>


                {/*<Button variant="contained" color="primary">ASDF</Button>*/}
        </div>
);
}

export default Dashboard
