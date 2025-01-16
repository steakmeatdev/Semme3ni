import React, { Component } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { Link } from "react-router-dom"; // Missing import added here

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>
                            Join a Room
                        </Button>
                        <Button color="secondary" to="/create" component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }
}
