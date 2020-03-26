// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
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
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// Components
import Copyright from '../components/copyRight';
import Navbar from '../components/navbar';


import SteamLogo from '../images/steamLogo.webp';
import GitHubLogo from '../images/githubIcon.svg';
import GoogleLogo from '../images/googleLogo.webp';



class Register extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    const {classes} = this.props;
    return (
      <div>
          <Navbar />
          <Container component="main" maxWidth="xs" style={{textAlign:'center'}}>
          <CssBaseline />

          <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Register
            </Button>

            Register through a 3rd party application

            <Grid container> 
              <Grid item lg>
                <Link href="http://localhost:9000/users/auth/github" variant="body2">
                <img src={GitHubLogo} className={classes.OAuthApp}></img>
                </Link>
              </Grid>
              <Grid item lg>
                <Link href="http://localhost:9000/users/auth/google" variant="body2">
                <img src={GoogleLogo} className={classes.OAuthApp}></img>
                </Link>
              </Grid>
              <Grid item lg>
                <Link href="http://localhost:9000/users/auth/steam" variant="body2">
                <img src={SteamLogo} className={classes.OAuthApp}></img>
                </Link>
              </Grid>
            </Grid>
            
            <Grid container>
              <Grid item xs>
                <Link href="/users/forgotPassword" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Already a member? Sign in"}
                </Link>
              </Grid>
            </Grid>
          </form>
          </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
      </div>
    );
  }
}

const classes = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  OAuthApp: {
    margin: '16px 0px 16px 0px',
    width: '40px',
    height: '40px'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.text.primary,
    alignItems: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: '30px'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

// Export class with material styles
Register.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(classes)(Register);