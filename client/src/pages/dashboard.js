// React
import React from 'react';
import {Redirect} from 'react-router-dom';
// Material
import {Paper} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ExploreIcon from '@material-ui/icons/Explore';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import Snackbar from '@material-ui/core/Snackbar';
import SearchIcon from '@material-ui/icons/Search';
// Bootstrap
import {Container, Row, Col} from 'react-bootstrap';
// Components
import Navbar from '../components/Page_Components/navbar';
import CurrentBets from '../components/Bet_Display_Components/currentBets';
import FindBets from '../components/Bet_Display_Components/findBets';
import CreateBetForm from '../components/Bet_Creation_Components/createBetForm';
import UserCreatedBets from '../components/Bet_Display_Components/userCreatedBets';
import FinishedBets from '../components/Bet_Display_Components/finishedBets';
import Alert from '../components/Miscellaneous/alertSnack';
import './reset.css';

class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          loggedIn: false,
          mobileOpen: false,
          locationNavOpen: false,
          renderFindLocationBets: false,
          createNewBetDialog: false,
          snackOpen: false,
          msg: '',
          msgType: '',
          openFindBetPane: false
        }
    }

    componentDidMount(){
        fetch('http://localhost:9000/users/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_name : process.env.REACT_APP_TEST_USER_NAME,
            password : process.env.REACT_APP_TEST_USER_PASS
          })
        })
        .then((res) => res.json())
        .then((res) => {
          if(res.status === "success"){
            console.log(res.body);
            this.setState({loggedIn : true});
          }
          else if(res.status === 'error' && res.body === 'Email or password invalid'){
            console.log(res.body);
            
          }
          else if(res.status === 'error' && res.body === 'Username not found'){
            console.log(res.body);
          }
          else{
            console.log(res.body);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

    handleLocationNavToggle = () => {
      this.setState({locationNavOpen : !this.state.locationNavOpen});
    };

    handleDrawerToggle = () => {
      this.setState({mobileOpen : !this.state.mobileOpen});
    };

    renderFindLocationBets = () => {
      this.setState({renderFindLocationBets : true});
    }

    renderCreateNewBetDialog = () => {
      this.setState({createNewBetDialog : true});
    }

    closeCreateNewBetDialog = () => {
      this.setState({createNewBetDialog : false});
    }

    handleError = (msg, type) => {
      this.setState({snackOpen : true, msg : msg, msgType : type});
    }

    
    handleSnackClose = (event, reason) => {
      if(reason === 'clickaway'){
          return;
      }
      this.setState({snackOpen : false});
    }

    handleOpenFindBetPane = () => {
      this.setState({openFindBetPane : true});
    }

    closeFindBetPane = () => {
      this.setState({openFindBetPane : false});
    }

    render(){
      const {loggedIn, mobileOpen, locationNavOpen, renderFindLocationBets, createNewBetDialog, snackOpen, msg, msgType, openFindBetPane} = this.state;
      const {classes} = this.props;
      const drawer = (
        <div>
              <List>
              <ListSubheader>You</ListSubheader>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary='Profile' />
              </ListItem>
              </List>
              <Divider />
              <List>
              <ListSubheader>Betting</ListSubheader>
              <ListItem button onClick={this.handleOpenFindBetPane}>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText>
                  Find Bets
                </ListItemText>
              </ListItem>
              <ListItem button onClick={this.renderCreateNewBetDialog}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary='New Bet' />
              </ListItem>
              <ListItem button onClick={this.handleLocationNavToggle}>
                <ListItemIcon>
                  <LocationOnIcon />
                </ListItemIcon>
                <ListItemText primary="Location Betting" />
                {locationNavOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={locationNavOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button className={classes.nested} onClick={this.renderFindLocationBets}>
                    <ListItemIcon>
                      <ExploreIcon />
                    </ListItemIcon>
                    <ListItemText primary="Find Bets" />
                  </ListItem>
                  <ListItem className={classes.nested}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary='Create New Bet' />
                  </ListItem>
                  <ListItem className={classes.nested}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary='Create New Region' />
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </div>
      );

      if(renderFindLocationBets){
        return(
          <Redirect to='/find-location-bets' />
        )
      }

      if(loggedIn){
        return(
          <div>
            <Snackbar open={snackOpen} autoHideDuration={6000} onClose={this.handleSnackClose}>
              <Alert onClose={this.handleSnackClose} severity={msgType}>{msg}</Alert>
            </Snackbar>
            <FindBets
                openPane={openFindBetPane}
                closeDialog={this.closeFindBetPane}
            />
            <Navbar className={classes.appBar}/>
            <div className={classes.root}>
                <CreateBetForm 
                  open={createNewBetDialog} 
                  closeDialog={this.closeCreateNewBetDialog}
                  error={this.handleError}
                />
                <CssBaseline />
                <nav className={classes.drawer} style={styles.menu} aria-label="mailbox folders">
                  {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                  <Hidden smUp implementation="css">
                    <Drawer
                      style={styles.menu}
                      variant="temporary"
                      anchor='left'
                      open={mobileOpen}
                      onClose={this.handleDrawerToggle}
                      classes={{
                        paper: classes.drawerPaper,
                      }}
                      ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                      }}
                    >
                      {drawer}
                    </Drawer>
                  </Hidden>
                  <Hidden xsDown implementation="css">
                    <Drawer
                    style={styles.menu}
                      classes={{
                        paper: classes.drawerPaper,
                      }}
                      variant="permanent"
                      open
                    >
                      {drawer}
                    </Drawer>
                  </Hidden>
                </nav>
                <Container style={styles.mainContainer}>
                  <Row style={styles.row}>
                      <Col xs={12}>
                        <h1>Betting Dashboard</h1>
                      </Col>
                  </Row>
                  <Row style={styles.row}>
                      <Col xs={12} md={6} style={styles.col}>
                        <Row>
                          <Col>
                          <Paper style={styles.paper}>
                            <h2>Your Current Bets:</h2>
                            <CurrentBets />
                          </Paper>
                          </Col>
                          </Row>
                          <Row>
                            <Col>
                              <UserCreatedBets />
                            </Col>
                          </Row>
                      </Col>
                      <Col xs={12} md={6}>
                        <Row>
                          <Col>
                            <h1>Recently Finised Bets:</h1>
                            <FinishedBets />
                          </Col>
                        </Row>
                        <Row>
                        <Col>
                        <Paper style={styles.paper}>
                          <h2>New Bets:</h2>
                          </Paper>
                          </Col>
                        </Row>
                      </Col>
                  </Row>
                </Container>
            </div>
            </div>
        )
      }else{
        return null;
      }
    } 
}

const drawerWidth = 240;

const classes = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
});

const styles = {
    paper: {
        marginTop: '15px',
        padding: '15px'
    },
    mainContainer: {
      width: '90%',
      maxWidth: '90%',
    },
    menu: {
      top: 'auto'
    }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(classes)(Dashboard);