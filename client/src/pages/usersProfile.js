import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import GitHubIcon from '@material-ui/icons/GitHub';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Chart from 'chart.js'

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://github.com/ReqApp">
          Req
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.text.primary,
    alignItems: 'center'
  },
}));

export default function UsersProfile() {
  const classes = useStyles();

  // chartReference = React.createRef();

  return (
    <Container component="main" style={{border:"1px solid purple", backgroundColor:"grey"}}>
      <CssBaseline />
      <div className={classes.paper}>
          <img src="https://avatars0.githubusercontent.com/u/6561327?s=460&u=3746478b26e66ebe22eba9ba20097b477c455cc3&v=4" 
          style={{ height: "25vh", margin: "2vh 2vh" }}
          />
          <Typography component="h1" variant="h5">
            IamCathal
        </Typography>

          <Grid container style={{justifyContent:"center"}}>
            <Grid item>
            <img src="https://imgur.com/pTioTv4.png"
              style={{height: "26vh",  margin: "1vh 1vh" }}/>
            </Grid>
            <Grid item>
            <img src="https://imgur.com/nVTZmsM.png"
              style={{height: "26vh",  margin: "1vh 1vh" }}/>
            </Grid>
          </Grid>

          <Grid container style={{justifyContent:"center"}}>
              <Grid item>
                  <img src="https://imgur.com/viu6QBF.png"
                  style={{height: "26vh",  margin: "1vh 1vh" }}/>
              </Grid>
              <Grid item>
              <Grid item>
                  <img src="https://imgur.com/yg03lkG.png"
                  style={{height: "26vh",  margin: "1vh 1vh" }}/>
              </Grid>
              </Grid>
          </Grid>

          <Grid container style={{justifyContent:"center"}}>
              <Grid item >
                  <img src="https://imgur.com/iVuLvni.png"
                  style={{margin: "1vh 1vh"}}/>
              </Grid>
              <Grid item>
              <Grid item>
                  <img src="https://imgur.com/xGMPWYz.png"
                  style={{margin: "1vh 1vh"}}/>
              </Grid>
              </Grid>
          </Grid>

      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}