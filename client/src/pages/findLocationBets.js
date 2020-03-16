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
//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Container, Row, Col, Dropdown} from 'react-bootstrap/';
// Components
import DisplayMap from'../components/maps';
import Navbar from '../components/navbar';
import BetRegionCards from '../components/betRegionCards';
import LocationBetCards from '../components/locationBetCards';
// Other
import './reset.css';

// Main page for location betting
export default class FindBetPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            betRegions : null,
            bets: null,
            view: "regions",
            loadingRegions : true,
            sortBy : "popular",
            showMap : false,
            locationError : null,
            openError : false
        }
        this.handleLocationUpdate = this.handleLocationUpdate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleErrorClose = this.handleErrorClose.bind(this);
        this.handleLocationError = this.handleLocationError.bind(this);
    }

    // Load regions on first mout
    componentDidMount(){
        // TODO localhost
        //fetch("http://localhost:9000/getBettingRegions?lat=53.28211&lng=-9.062186").then(regions => regions.json()).then(regions => this.setState({loadingRegions : false, betRegions : regions})).catch(err => err);
    }

    // Retrieve regions when location found by map component
    handleLocationUpdate(location){
        //fetch("http://localhost:9000/getBettingRegions?lat=" + location.lat.toString() + " &lng=" + location.lng.toString())
        console.log(location);
        var url = new URL("http://localhost:9000/getBettingRegions"),
        params = location
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url).then(regions => {
            console.log(regions);
            regions.json();
        }).then(regions => {
            console.log(regions);
            this.setState({loadingRegions : false, betRegions : regions});
        }).catch(err => {
            console.log(err);
        });
    }

    handleSortBySelect = (evt) => {
        this.setState({sortBy : evt});
    }

    handleScrollToRegion = (id) => {
        const elem = document.getElementById(id);
        if(typeof elem !== 'undefined'){
            elem.scrollIntoView();
        }
        console.log("Could not find bet card")
    }

    handleSearch(event){
        this.setState({sortBy : event.target.value});
    }

    handleGetBets = (id) => {
        console.log("Retreive bets for region: " + id);
        // Get bets in region and add to state
        // TODO localhost
        fetch("http://localhost:9000/getBetsInRegion?id=" + id).then(bets => bets.json()).then(bets => this.setState({bets : bets, view : "bets"})).catch(err => err);
    }

    handleLocationError = (err) => {
        console.log(err);
        this.setState({locationError : err, openError : true});
    }
    
    handleErrorClose(){
        this.setState({openError : false});
    }

    render(){
        console.log(this.state.betRegions);
        let predictSearch = null;
        if(!this.state.loadingRegions && this.state.betRegions != null){
            predictSearch = <div style={styles.floatContainer} style={{ width: 300}} >
                <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    options={this.state.betRegions.map(region => region.region_name)}
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
        /*
        if(this.state.view == "bets"){
            cards = <LocationBetCards bets={this.state.bets} />
        }
        else{
            cards = <BetRegionCards onRegionHover={this.handleRegionHover} loadingRegions={this.state.loadingRegions} betRegions={this.state.betRegions} sort={this.state.sortBy} onGetBets={this.handleGetBets}/>
        }*/

        return(     
            // Create grid for parts
            <div>
                <Dialog
                  open={this.state.openError}
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
                <div style={styles.floatingButton}>
                    <Fab variant="extended" onClick={() => this.setState({showMap : true})}>
                        <NavigationIcon className={classes.extendedIcon} />
                        Show Full Map
                    </Fab>
                </div>
                <Navbar />
                <Container fluid style={styles.mainContent}>
                    <Row>
                        <Col style={styles.fullMapContainer}>
                            <DisplayMap 
                                view={this.state.view} 
                                data={this.state.betRegions} 
                                loading={this.state.loadingRegions} 
                                scrollToRegion={this.handleScrollToRegion} 
                                error={this.handleLocationError}
                                locationUpdate={this.handleLocationUpdate}
                            />
                        </Col>
                    </Row>
                    <Container>
                    <Row>
                        <Col>    
                            <h2 style={styles.sortByTitle}>Available Regions</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic" style={styles.sortByDropdown}>
                                    Sort By
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="popular">Popularity</Dropdown.Item>
                                    <Dropdown.Item eventKey="closest">Closest</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col>
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
        position: 'relative',
        float: 'right'
    },
    sortByDropdown: {
        marginTop: '15px'
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
    }
} 