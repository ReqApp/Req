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
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
// Components
import Copyright from '../components/Page_Components/copyRight';
import Navbar from '../components/Page_Components/navbar';


class VerifyAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      verificationCode: '',
      requestMade: false,
      success: false,
      // Used for error and success snacks(toasts)
      msg : '',
      msgType : '',
      snackOpen : false
    }
  }

  submitForm = () => {
    const {verificationCode} = this.state;
      fetch('http://localhost:9000/users/verifyAccount', {
        method: 'POST',
        crossDomain: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "activationCode": verificationCode
        })
      }).then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          this.setState({success:true});
        } else {
          this.setState({msg : 'Invalid verification code', msgType : 'error', snackOpen : true});
        }
      }, () => {
        this.setState({msg : 'Error validating code', msgType : 'error', snackOpen : true});
      });
  }

  handleVerificationChange = (evt) => {
    this.setState({verificationCode:evt.target.value});
    console.log(this.state.verificationCode);
  }

  handleSnackClose = (event, reason) => {
    if(reason === 'clickaway'){
        return;
    }
    this.setState({snackOpen : false});
}

  componentDidMount() {

  }

  render(){
    const {msg, msgType, snackOpen} = this.state;
    const {classes, success} = this.props;
    if (success) {
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
            Enter your verification code
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Verification Code"
              name="email"
              autoComplete="6 Digit Code"
              onChange={this.handleVerificationChange}
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
VerifyAccount.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(classes)(VerifyAccount);