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
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
// Components
import Copyright from '../components/copyRight';

class SignIn extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const {classes} = this.props;
    return (
      <Container component="main" maxWidth="xs">
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
              Sign In
            </Button>

            Sign in through a 3rd party application

            <Grid container>
              <Grid item lg>
                <Link href="#" variant="body2">
                <Avatar className={classes.avatar}>
                  <GitHubIcon />
                </Avatar>
                </Link>
              </Grid>
              <Grid item lg>
                <Link href="#" variant="body2">
                <Avatar className={classes.avatar}>
                  <GTranslateIcon />
                </Avatar>
                </Link>
              </Grid>
              <Grid item lg>
                <Link href="#" variant="body2">
                <Avatar className={classes.avatar}>
                  <GroupWorkIcon />
                </Avatar>
                </Link>
              </Grid>
            </Grid>
            
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
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
    );
  }
}

const useStyles = theme => ({
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
SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(useStyles)(SignIn);