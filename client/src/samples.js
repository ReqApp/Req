import React, {createRef, Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DisplayMap from'./maps.js';
import {Paper, ThemeProvider} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { CardHeader, Link, Container, CssBaseline} from '@material-ui/core';


  function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary">
        {'Copyright © '}
        <Link color="inherit" href="https://localhost:9000">
          Req
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }


class HomePage extends React.Component{
    constructor(props){
        super(props);

    }

    render(){    
        return(
            <div className="background">
                <AppBar position="fixed" className="appBar" style={{ background: '#7e18b5', opacity: 0.5}}>
                <Toolbar>
                    <Grid container>
                        <Grid item sm={4} className="leftNavButton">
                            <Button color="inherit">Login</Button>
                        </Grid>
                        <Grid item sm={4} className="middleNavButton">
                            <Button color="inherit">Join</Button>
                        </Grid>
                        <Grid item sm={4} className="rightNavButton">
                            <Button color="inherit">About</Button>
                        </Grid>
                    </Grid>
                </Toolbar>
                </AppBar>
                
                <Grid container className="mainContainer">
                    <Grid item sm={12}>
                        <img src={require("./android-chrome-512x512.png")} className="main-logo"/>
                        <Copyright />
                    </Grid>

                </Grid>

            </div>
        )
    }
}

export default HomePage;