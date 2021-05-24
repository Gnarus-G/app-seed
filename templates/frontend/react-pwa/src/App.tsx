import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";

export default function App() {
    console.log();

    return (
        <Box p={3} bgcolor="background.default" height="100vh">
            <Grid container spacing={3}>
                <Grid item lg={3}>
                    <Typography>Love</Typography>
                </Grid>
            </Grid>
        </Box>
    );
}