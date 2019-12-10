
import React from "react"
import Toolbar from "@material-ui/core/toolbar"
import AppBar from "@material-ui/core/appbar"
import Button from "@material-ui/core/button"
import Grid from "@material-ui/core/grid"

export default () => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Button>Call</Button>
                    <Button>SMS</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}