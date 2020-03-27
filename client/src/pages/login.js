// React
import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
// Material
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Navbar from '../components/Page_Components/navbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
// Components
import Copyright from '../components/Page_Components/copyRight';
import Alert from '../components/Miscellaneous/alertSnack';
import SteamLogo from '../images/steamLogo.webp';
import GitHubLogo from '../images/githubIcon.svg';
import GoogleLogo from '../images/googleLogo.webp';



// Main component class
class SignIn extends React.Component{
  // Constructor which takes in props
  constructor(props){
    // Remember to pass props to parent class
    super(props);
    // When a variable updated in the state object, the page get re-rendered
    this.state = {
      // Keep track of user inputs
      user_name : '',
      password : '',
      loggedIn : false,
      // Used for error and success snacks(toasts)
      msg : '',
      msgType : '',
      snackOpen : false
    }
  }

  submitForm = () => {
    // Easier than writing this.state.emailAddress all the time
    const {user_name, password} = this.state;

    let formValid = true;
    if(user_name === ''){
      formValid = false;
      this.setState({msg : 'Please enter your email address', msgType : 'warning', snackOpen : true});
    }
    if(password === ''){
      formValid = false;
      this.setState({msg : 'Please enter your password', msgType : 'warning', snackOpen : true});
    }
    if(formValid){
      fetch('http://localhost:9000/users/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_name : user_name,
          password : password
        })
      })
      .then((res) => res.json())
      .then((res) => {
        if(res.status === "success"){
          this.setState({msg : 'Logged In!', msgType : 'success', snackOpen : true, loggedIn : true});
        }
        else if(res.status === 'error' && res.body === 'Email or password invalid'){
          this.setState({msg : 'Incorrect username or password', msgType : 'error', snackOpen : true});
        }
        else if(res.status === 'error' && res.body === 'Username not found'){
          this.setState({msg : 'User could not be found', msgType : 'error', snackOpen : true});
        }
        else{
          console.log(res.body);
          this.setState({msg : 'Could not login', msgType : 'error', snackOpen : true});
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({msg : 'Could not login', msgType : 'error', snackOpen : true});
      });
    }
  }

  handleUserNameChange = (evt) => {
    // Only use this.setState method to update fields in state. Never like this.state.msg = 'sasdjfasdf'
    // evt.target.value is new value in text field
    this.setState({user_name : evt.target.value});
  }

  handlePasswordChange = (evt) => {
    this.setState({password : evt.target.value});
  }

  handleSnackClose = (event, reason) => {
    if(reason === 'clickaway'){
        return;
    }
    this.setState({snackOpen : false});
}

  render(){
    const {msg, msgType, snackOpen, loggedIn} = this.state;
    const {classes} = this.props;

    if(loggedIn){
      return(
        <Redirect to='/profile' />
      )
    }
    return (
      <div>
        <Navbar />
        <Snackbar open={snackOpen} autoHideDuration={6000} onClose={this.handleSnackClose}>
            <Alert onClose={this.handleSnackClose} severity={msgType}>{msg}</Alert>
        </Snackbar>
      <Container component="main" maxWidth="xs" style={{textAlign:'center'}}>
        <CssBaseline />

        
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              autoFocus
              onChange={this.handleUserNameChange}
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
              onChange={this.handlePasswordChange}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.submitForm}
            >
              Sign In
            </Button>

            Sign in through a 3rd party application

            <Grid container> 
              <Grid item lg>
                <Link href="http://localhost:9000/users/auth/github" variant="body2">
                <img src={GitHubLogo} className={classes.OAuthApp} alt='Github Logo'></img>
                </Link>
              </Grid>
              <Grid item lg>
                <Link href="http://localhost:9000/users/auth/google" variant="body2">
                <img src={GoogleLogo} className={classes.OAuthApp} alt='Google Logo'></img>
                </Link>
              </Grid>
              <Grid item lg>
                <Link href="http://localhost:9000/users/auth/steam" variant="body2">
                <img src={SteamLogo} className={classes.OAuthApp} alt='Steame Logo'></img>
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
                <Link href="/users/register" variant="body2">
                  {"Don't have an account? Sign Up"}
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

// Export class with material styles
SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(classes)(SignIn);