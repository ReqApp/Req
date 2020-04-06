// React stuff
import React from 'react';
// Material
import { makeStyles } from '@material-ui/core/styles';
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
import {Container, Row, Col} from 'react-bootstrap/';
// Components
import DisplayMap from'../components/Location_Betting_Components/maps';
import Navbar from '../components/Page_Components/navbar';
import BetRegionCards from '../components/Location_Betting_Components/betRegionCards';
import LocationBetCards from '../components/Location_Betting_Components/locationBetCards';
import CreateLocationBet from '../components/Location_Betting_Components/createLocationBet';
// Other
import openSocket from 'socket.io-client';
import './reset.css';
import {Redirect} from 'react-router-dom';

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
            loadCreateBet: false,
            loadCreateRegion: false,
            selectedRegion: null,
            windowWidth: window.innerWidth,
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
        const {betRegions, latlng} = this.state;
        if(mode === 'find'){
            // Retrieve bets in selected region
            // Get bets in region and add to state
            fetch(`http://localhost:9000/getBetsInRegion?id=${id}&lat=${latlng.lat}&lng=${latlng.lng}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
            })
            .then(bets => bets.json())
            .then(res => {
                if(res.status === 'success'){
                    console.log(res);
                    this.setState({bets : res.body, view : "bets"});
                }
                else{
                    console.log(res);
                    this.setState({view : 'bets'});
                }
                
            })
            .catch(err => {
                console.log(err);
            });
        }else{
            // Load bet creation component
            let selectedRegion;
            for(let i = 0; i < betRegions.length; i++){
                if(betRegions[i]._id === id){
                    selectedRegion = betRegions[i];
                    break;
                }
            }
            this.setState({loadCreateBet : true, selectedRegion : selectedRegion});
        }
    }
    
    handleErrorClose = () => {
        this.setState({openError : false});
    }

    handleCreateNewRegion = () => {
        this.setState({loadCreateRegion : true});
    }

    render(){
        const {hasLocation, latlng, accurate, betRegions, bets, loadingRegions, sortBy, openError, view, loadCreateRegion, windowWidth, selectedRegion, loadCreateBet} = this.state;
        const {mode} = this.props;
        let useStyles = null;

        if(windowWidth < 700){
            useStyles = smallScreen;
        }
        else{
            useStyles = styles;
        }
        if(loadCreateBet){
            return(
                <CreateLocationBet userLocation={latlng} regionData={selectedRegion} />
            )
        }
        if(loadCreateRegion){
            return(
                <CreateLocationBet userLocation={latlng} createRegion/>
            )
        }
        else{
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
                        <Col xs={12} md={6} style={useStyles.columns}>    
                            <h2 style={useStyles.sortByTitle}>{view === 'regions' ? "Available Regions" : "Available Bets"}</h2>
                        </Col>
                        {view === 'regions' ?
                        <Col xs={12} md={6} style={useStyles.columns}>
                            <Button
                                onClick={this.handleCreateNewRegion}
                                style={useStyles.newRegionBtn}
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                endIcon={<Icon>addsharp</Icon>}>
                                Create New Region
                            </Button>
                        </Col> : null
                        }
                    </Row>
                    <Row>
                        <Col xs={12} md={6} style={useStyles.columns}>
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
                        <Col xs={12} md={6} style={useStyles.columns}>
                            {predictSearch}
                        </Col>
                        </Row>
                    <Row>
                        <Col style={useStyles.columns}>
                            {cards}
                        </Col>
                    </Row>
                    </Container>
                </Container>
                <br />
                <br />
                <br />
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
    newRegionBtn: {
        position: 'absolute',
        bottom: '0px',
        right: '0px'
    },
    columns: {
        padding: '0px'
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
    newRegionBtn: {
        bottom: '0px',
        right: '0px'
    }
}