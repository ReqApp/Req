// React stuff
import React from 'react';
// Material
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Dropdown} from 'react-bootstrap/';
// Components
import DisplayMap from'../components/maps';
import Navbar from '../components/navbar';
import BetRegionCards from '../components/betRegionCards';
import LocationBetCards from '../components/locationBetCards';
import CreateLocationBet from '../components/createLocationBet';
// Other
import openSocket from 'socket.io-client';
import './reset.css';

// Main page for location betting
export default class FindBetPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            // Location properties
            latlng: {
                lat: 51.476852,
                lng: -0.000500
            },
            hasLocation: false,
            accurate: false,
            locationError : null,
            // Data properties
            betRegions: null,
            bets: null,
            view: "regions",
            loadingRegions : true,
            sortBy : "popular",
            showMap : false,
            openError : false,
            loadCreateForm: false,
            loadCreateRegion: false,
            selectedRegion: null,
            windowWidth: window.innerWidth
        }
        this.socket = openSocket("http://localhost:9000");
    }

    // Load regions on first mout
    componentDidMount(){
        // Get size of screen for styling
        this.setState({windowWidth : window.innerWidth});
        // Retrieve user's location
        this.getLocation();
        this.socket.on('accurateUserPos', (data) => {
            if(data.user_name === "testUser"){
                console.log(data);
                this.setState({hasLocation : true, latlng : data.location, accurate : true});
                this.props.locationUpdate(data.location);
                let response = {
                  user : "testUser"
                }
                this.socket.emit('locationResponse', response);
            }
        });
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({windowWidth : window.innerWidth});
    }

    handleCreateBetRegion = () => {
        this.setState({loadCreateRegion : true, loadCreateForm : true});
    }

    // Used to get user location
    getLocation = () => {
        // Check if geolocation is available
        if(navigator.geolocation){
            // Check for accuracy
            navigator.geolocation.getCurrentPosition((userPosition => {
            if(userPosition.coords.accuracy < 100){
                // Set user's location
                let location = {lat : 53.28211, lng : -9.062186 };
                this.setState({hasLocation : true, latlng : location, accurate : true});
                //this.setState({hasLocation : true, latlng : {lat : userPosition.coords.latitude, lng : userPosition.coords.longitude}, accurate : true});
                console.log("Getting regions");
                this.getRegions(location);
            }else{
                //Temp
                let location = {lat : 53.28211, lng : -9.062186 };
                this.setState({hasLocation : true, latlng : location, accurate : true});
                this.getRegions(location);

                //this.setState({hasLocation : true, latlng : {lat : userPosition.coords.latitude, lng : userPosition.coords.longitude}, accurate : false, locationError : "not-accurate", openError : true});
            }
            }));
        }
        // Handle geolocation not supported
        else{
            this.setState({hasLocation : true, latlng : {lat : 51.476852, lng : -0.000500}, accurate : false, locationError : "not-supported", openError : true});
        }
    }

    // Retrieve regions when location found by map component
    getRegions = (location) => {
        var url = new URL("http://localhost:9000/getBettingRegions"),
        params = location
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        fetch(url)
            .then(res => res.json())
            .then(regions => {
                console.log(regions);
                this.setState({loadingRegions : false, betRegions : regions});
            }).catch(err => {
                console.log(err);
            });
    }

    handleSortBySelect = (evt) => {
        this.setState({sortBy : evt.target.value});
    }

    handleScrollToRegion = (id) => {
        const elem = document.getElementById(id);
        if(typeof elem !== 'undefined'){
            elem.scrollIntoView();
        }
        console.log("Could not find bet card")
    }

    handleSearch = (event) => {
        this.setState({sortBy : event.target.value});
    }

    handleSelection = (id) => {
        const {mode} = this.props;
        const {betRegions} = this.state;
        if(mode === 'find'){
            // Retrieve bets in selected region
            console.log("Retreive bets for region: " + id);
            // Get bets in region and add to state
            // TODO localhost
            fetch("http://localhost:9000/getBetsInRegion?id=" + id).then(bets => bets.json()).then(bets => this.setState({bets : bets, view : "bets"})).catch(err => err);
        }else{
            // Load bet creation component
            let selectedRegion;
            for(let i = 0; i < betRegions.length; i++){
                if(betRegions[i]._id == id){
                    selectedRegion = betRegions[i];
                    break;
                }
            }
            this.setState({loadCreateForm : true, selectedRegion : selectedRegion});
        }
    }
    
    handleErrorClose = () => {
        this.setState({openError : false});
    }

    render(){
        const {hasLocation, latlng, accurate, betRegions, bets, loadingRegions, sortBy, openError, view, loadCreateForm, windowWidth} = this.state;
        const {mode} = this.props;
        let useStyles = null;

        if(windowWidth < 700){
            useStyles = smallScreen;
        }
        else{
            useStyles = styles;
        }
        
        if(loadCreateForm){
            const {selectedRegion, loadCreateRegion} = this.state;
            return(
                <CreateLocationBet userLocation={latlng} regionData={selectedRegion} createRegion={loadCreateRegion}/>
            )
        }else{
        let predictSearch = null;
        if(!loadingRegions){
            predictSearch = <div style={useStyles.floatContainer} >
                <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    options={betRegions.map(region => region.region_name)}
                    onInputChange={this.handleSearch}
                    renderInput={params => (
                    <TextField
                        {...params}
                        label="Search..."
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        InputProps={{ ...params.InputProps, type: 'search' }}
                    />
                    )}
                />
            </div>
        }

        let cards = null;
        if(view === "bets"){
            cards = <LocationBetCards bets={bets} />;
        }
        else{
            cards = <BetRegionCards 
                        onRegionHover={this.handleRegionHover} 
                        loadingRegions={loadingRegions} 
                        betRegions={betRegions} 
                        sort={sortBy} 
                        onSelection={this.handleSelection}
                        mode={mode}
                    />;
        }

        return(     
            // Create grid for parts
            <div>
                <Dialog
                  open={openError}
                  onClose={this.handleErrorClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Could not find your location"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Please use app instead
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleErrorClose} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
                <div style={useStyles.floatingButton}>
                    <Fab variant="extended" onClick={() => this.setState({showMap : true})}>
                        <NavigationIcon className={classes.extendedIcon} />
                        Show Full Map
                    </Fab>
                </div>
                <Navbar />
                <Container fluid style={useStyles.mainContent}>
                    <Row>
                        <Col style={useStyles.fullMapContainer}>
                            <DisplayMap
                                hasLocation={hasLocation}
                                data={betRegions}
                                userLocation={latlng}
                                accurate={accurate}
                                loadingData={loadingRegions} 
                                scrollToRegion={this.handleScrollToRegion} 
                            />
                        </Col>
                    </Row>
                    <Container>
                    <Row>
                        <Col xs={12} md={6}>    
                            <h2 style={useStyles.sortByTitle}>Available Regions</h2>
                        </Col>
                        <Col xs={12} md={6}>
                            <Button
                                onClick={this.handleCreateBetRegion}
                                style={useStyles.newRegionBtn}
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                endIcon={<Icon>addsharp</Icon>}>
                                Create New Region
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={6}>
                        <InputLabel id="demo-simple-select-filled-label">Sort By</InputLabel>
                            <Select
                            style={useStyles.sortBy}
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={sortBy}
                            onChange={this.handleSortBySelect}
                            >
                            <MenuItem value='popular'>Popularity</MenuItem>
                            <MenuItem value='closest'>Closest</MenuItem>
                        </Select>
                        </Col>
                        <Col xs={12} md={6}>
                            {predictSearch}
                        </Col>
                        </Row>
                    <Row>
                        <Col>
                            {cards}
                        </Col>
                    </Row>
                    </Container>
                </Container>

            </div>
        );
        }
    }
}

// Material Styles
const classes = makeStyles(theme => ({
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const styles = {
    mainContent: {
        width: '100%',
        marginTop: '0px'
    },
    fullMap: {
        width: '100%',
        height: '70vh',
        padding: '5px'
    },
    miniMap: {
        width: '100%',
        height: '250px'
    },
    sortByTitle: {
        paddingTop: '20px'
    },
    fullMapContainer: {
        padding: '0px'
    },   
    floatContainer: {
        width: '300px',
        position: 'absolute',
        right: '0px'
    },
    sortBy: {
        width: '200px'
    },
    floatingButton: {
        width: '200px',
        height: '40px',
        position: 'fixed',
        bottom: '20px',
        right: '5px',
        borderRadius: '5px',
        border: 'none',
        zIndex: '1000'
    },
    newRegionBtn: {
        position: 'absolute',
        bottom: '0px',
        right: '0px'
    }
}

const smallScreen = {
    mainContent: {
        width: '100%',
        marginTop: '0px'
    },
    fullMap: {
        width: '100%',
        height: '70vh',
        padding: '5px'
    },
    miniMap: {
        width: '100%',
        height: '250px'
    },
    sortByTitle: {
        paddingTop: '20px'
    },
    fullMapContainer: {
        padding: '0px'
    },   
    floatContainer: {
        width: '300px',
        right: '0px'
    },
    sortBy: {
        width: '200px'
    },
    floatingButton: {
        width: '200px',
        height: '40px',
        position: 'fixed',
        bottom: '20px',
        right: '5px',
        borderRadius: '5px',
        border: 'none',
        zIndex: '1000'
    },
    newRegionBtn: {
        bottom: '0px',
        right: '0px'
    }
}