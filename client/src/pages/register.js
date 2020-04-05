// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// Components
import Copyright from '../components/Page_Components/copyRight';
import Navbar from '../components/Page_Components/navbar';
import Alert from '../components/Miscellaneous/alertSnack';


import SteamLogo from '../images/steamLogo.webp';
import GitHubLogo from '../images/githubIcon.svg';
import GoogleLogo from '../images/googleLogo.webp';
import { Redirect } from 'react-router';

const axios = require('axios');


class Register extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      email: '',
      profilerChosen: false,
      profilerUploaded: false,
      profilerValid: false,
      profiler: '',

      success: false,

      requestMade: false,
      registered: false,
      // Used for error and success snacks(toasts)
      msg : '',
      msgType : '',
      snackOpen : false
    }
  }

  submitForm = () => {
    const {username, password, email, profiler, profilerValid, profilerUploaded, profilerChosen} = this.state;
    let formValid = true;

    if (username === '') {
      formValid = false;
      this.setState({msg : 'Please enter your email address', msgType : 'warning', snackOpen : true});
    }
    if (password === '') {
      formValid = false;
      this.setState({msg : 'Please enter your email address', msgType : 'warning', snackOpen : true});
    }

    console.log(profiler);

    // if they chose one and clicked submit but the image is not done upoading yet
    // this wont trigger if a valid profiler has been chosen
    if (profilerChosen && !profilerUploaded && !profilerValid) {
      this.setState({msg : 'Your profile picture has not uploaded yet.', msgType : 'warning', snackOpen : true});
    }

    if (formValid) {
      if (profilerValid) {
        fetch('http://localhost:9000/users/register', {
          method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "user_name" : username,
          "password" : password,
          "email": email,
          "profilePicture": profiler
        })
        }).then((res) => res.json())
        .then((res) => {
          if (res.status === 'success') {
            this.setState({success:true});
          }
          else {
            this.setState({msg : res.body, msgType : 'error', snackOpen : true});

          }
        }, (err) => {
          console.error(`ERR ${err}`)
        });
      } else {
        console.log("profiler was not valid")
        fetch('http://localhost:9000/users/register', {
        method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "user_name" : username,
        "password" : password,
        "email": email
      })
      }).then((res) => res.json())
      .then((res) => {
        if (res.status === 'success') {
          this.setState({success:true});
        }
        else {
          this.setState({msg : res.body, msgType : 'error', snackOpen : true});
        }
      }, (err) => {
        console.error(`ERR ${err}`)
      });
      }
    }
  }

  imageFormSubmit = (e) => {
    this.setState({profilerChosen: true});

    const formData = new FormData();
        formData.append('imageUpload',e.target.files[0]);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        fetch('http://localhost:9000/tasks/uploadImage', {
          method: 'POST',
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        axios.post('http://localhost:9000/tasks/uploadImage',formData,config)
            .then((response) => {
                if (response.data.status === 'success') {
                  console.log("success uploading")
                  this.setState({profilerValid: true, profiler: response.data.body, profilerUploaded: true});
                  this.setState({msg : 'Upload was successful', msgType : 'success', snackOpen : true});

                } else {
                  // error message profiler was invalid
                  console.log("not success when uploading");
                  console.log(response.data);
                  this.setState({msg : 'Image was innapropriate. Please choose another', msgType : 'warning', snackOpen : true});
                }
            }).catch((error) => {
              // error message profiler was onvalid
              console.log(error)
              console.log("eror when uploading")
        });
  }

  handleSnackClose = (event, reason) => {
    if(reason === 'clickaway'){
        return;
    }
    this.setState({snackOpen : false});
}

    handleUsernameChange = (evt) => {
      this.setState({username:evt.target.value});
    }

    handleEmailChange = (evt) => {
      this.setState({email:evt.target.value});
    }

    handlePasswordChange = (evt) => {
      this.setState({password:evt.target.value});
    }

  render(){
    const {classes} = this.props;
    const {msg, msgType, snackOpen, success} = this.state

    if (success) {
      return (
        <div>
          <Redirect to={'/users/verifyAccount'} />
        </div>
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
            Register
          </Typography>
          <form className={classes.form} noValidate>
          <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              name="email"
              onChange={this.handleUsernameChange}
              autoComplete="username"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onChange={this.handleEmailChange}
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
              onChange={this.handlePasswordChange}
              id="password"
              autoComplete="current-password"
            />

            <h5 styles={{marginTop:'4px'}}> Profile Picture </h5>
            <input 
            style={{marginTop:'0px'}}
            type="file"
            name="file"
            onChange={(e) => this.imageFormSubmit(e)}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.submitForm}
            >
              Register
            </Button>

            Register through a 3rd party application

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
                <img src={SteamLogo} className={classes.OAuthApp} alt='Steam Logo'></img>
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