// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Alert from '../components/Miscellaneous/alertSnack';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
// Components
import Copyright from '../components/Page_Components/copyRight';
import Navbar from '../components/Page_Components/navbar';

class ForgotPassword extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      requestMade: false,
      // Used for error and success snacks(toasts)
      msg : '',
      msgType : '',
      snackOpen : false
    }
  }

  submitForm = () => {
    const {username, requestMade} = this.state;

    if (username === '') {
      this.setState({msg : 'Please enter your username', msgType : 'warning', snackOpen : true});
    } else {
      fetch('http://localhost:9000/users/forgotpassword', {
        'method':'POST',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          "user_name":username
        })
      }).then((res) => res.json())
      .then((res) => {
        console.log(res)
        if(res.status === "success"){
          this.setState({msg : 'Check your email for password reset link', msgType : 'success', snackOpen : true});
        }
        else if(res.status === 'error'){
          this.setState({msg : res.body, msgType : 'error', snackOpen : true});
        }
      }, (err) => {
        console.log(`err forgot password: ${err}`);
      })
    }
  }

  handleUsernameChange = (evt) => {
    this.setState({username:evt.target.value});
  }

  handleSnackClose = (event, reason) => {
    if(reason === 'clickaway'){
        return;
    }
    this.setState({snackOpen : false});
}
  componentDidMount() {
    const {user} = this.props;
  }

  render(){
    const {classes, msg, msgType, snackOpen} = this.props;

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
            Enter your username
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="Username"
              autoComplete="Username"
              onChange={this.handleUsernameChange}
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
ForgotPassword.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(classes)(ForgotPassword);



