// React
import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
// Material
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '../components/Miscellaneous/alertSnack';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
// Components
import Copyright from '../components/Page_Components/copyRight';
import Navbar from '../components/Page_Components/navbar';


class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resetCode: '',
      newPassword: '',
      requestMade: false,
      passChanged: true,
      // Used for error and success snacks(toasts)
      msg : '',
      msgType : '',
      snackOpen : false
    }
  }

  submitForm = () => {
    const {resetCode, newPassword, requestMade} = this.state;


    if (newPassword === '') {
      this.setState({msg : 'Please enter your new password', msgType : 'warning', snackOpen : true});
    } else {

      console.log(window.location.href);
      console.log(window.location.href.split("="))
    const resetCodeString = window.location.href.split("=")[1];
    if (resetCodeString == undefined) {
      console.log("undefined split")
    }
    console.log(resetCodeString)

      const fromUrl = `http://localhost:9000/users/forgotPassword?from=${resetCodeString}`
      fetch('http://localhost:9000/users/resetPassword', {
        method: 'POST',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          "newPassword": newPassword,
          "fromUrl": fromUrl
        })
      }).then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          this.setState({passChanged: true})
        } else{
          this.setState({msg : res.body, msgType : 'error', snackOpen : true});
        }
      }, (err) => {
        console.log(err);
        this.setState({msg : 'Could not reset password', msgType : 'error', snackOpen : true});

      })
    }
  }

  handlePasswordChange = (evt) => {
    this.setState({newPassword:evt.target.value});
  }

  handleSnackClose = (event, reason) => {
    if(reason === 'clickaway'){
        return;
    }
    this.setState({snackOpen : false});
}

  componentDidMount() {
    const resetCodeString = '';
    try {
      resetCodeString = window.location.href.split("=")[1];
      this.setState({resetCode:resetCodeString})
    } catch(err) {
      this.setState({resetCode:''});
    }
  }

  render(){
    const {classes, passChanged, msg, msgType, snackOpen} = this.props;
    if (passChanged) {
      return(
        <Redirect to='/' />
      )
    }
    return (
      <div>
      <Navbar />
        <Snackbar open={snackOpen} autoHideDuration={6000} onClose={this.handleSnackClose}>
            <Alert onClose={this.handleSnackClose} severity={msgType}>{msg}</Alert>
        </Snackbar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Enter your new password
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="newPassword"
              label="Password"
              name="newPassword"
              autoComplete="New Password"
              onChange={this.handlePasswordChange}
              autoFocus
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.submitForm}
            >
              Submit
            </Button>
          
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
ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(classes)(ResetPassword);
