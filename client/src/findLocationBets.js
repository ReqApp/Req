import React, {createRef, Component} from 'react';
import ReactDOM from 'react-dom'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
//import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DisplayMap from'./maps.js';
import {Paper} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { CardHeader } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import FloatingActionButton from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import {Button, Nav, Navbar, NavDropdown, Form, FormControl, Jumbotron, Container, Row, Col, Tabs, Tab, Dropdown, Modal} from 'react-bootstrap/';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './findLocationBets.css';
import matchSorter from 'match-sorter';

class FindBetPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            betRegions : null,
            loadingRegions : true,
            shownRegion : null,
            sortBy : "popular",
            showMap : false,
        }
        // Material Styles
        this.classes = makeStyles(theme => ({
            extendedIcon: {
              marginRight: theme.spacing(1),
            },
        }));
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount(){
        fetch("http://localhost:9000/getBettingRegions?lat=53.28211&lng=-9.062186").then(regions => regions.json()).then(regions => this.setState({loadingRegions : false, betRegions : regions})).catch(err => err);
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

    render(){
        var predictSearch = null;
        if(!this.state.loadingRegions){
            predictSearch = <div style={{ width: 300}}>
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
        return(     
            // Create grid for parts
            <div>
                <div className="floating-button">
                    <Fab variant="extended" onClick={() => this.setState({showMap : true})}>
                        <NavigationIcon className={this.classes.extendedIcon} />
                        Show Full Map
                    </Fab>
                </div>
                <Navbar bg="light" expand="lg" sticky="top">    
                <Navbar.Brand href="#home">Req</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">Profile</Nav.Link>
                    <NavDropdown title="Betting" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Find bet near you</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Worldwide bets</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Article bets</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                    <Form inline>
                    <Button variant="outline-primary">Logout</Button>
                    </Form>
                </Navbar.Collapse>
                </Navbar>
                <Container fluid className="main-content">
                    <Row>
                        <Col>
                            <DisplayMap miniMap={false} betRegions={this.state.betRegions} loadingRegions={this.state.loadingRegions} scrollToRegion={this.handleScrollToRegion}/>
                        </Col>
                    </Row>
                    <Container>
                    <Row>
                        <Col xs={8}>    
                            <h2>Popular Bets</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
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
                        <Col><BetRegionCards onRegionHover={this.handleRegionHover} loadingRegions={this.state.loadingRegions} betRegions={this.state.betRegions} sort={this.state.sortBy}/></Col>
                    </Row>
                    </Container>
                </Container>

            </div>
        );
    }
}

class BetRegionCards extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
        this.scrollRefs = [];
    }

    highlightBetRegion(id){
        this.props.onRegionHover(id);
    }

    render(){
        let {loadingRegions, betRegions, sort} = this.props;
        // If regions are loaded display cards
        if(!loadingRegions){
            var regionCards = [];
            const display_num_regions = 20;
            if(sort === "popular"){
                betRegions.sort((a, b) => {return a.num_bets - b.num_bets});
                betRegions.reverse();
            }else{
                betRegions = matchSorter(betRegions, sort, { keys: ['region_name']});
            }
            if(Array.isArray(betRegions) && betRegions.length){
                for(var i = 0; i < display_num_regions && i < betRegions.length; i++){
                    var newCard = <Jumbotron key={betRegions[i]._id} id={betRegions[i]._id}>
                        <Container>
                            <Row>
                            <Col xs={8}>
                            <Container>
                                <Row>
                                    <Col>
                                        <h3>{betRegions[i].region_name}</h3>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h6>Number of Bets: {betRegions[i].num_bets}</h6>
                                    </Col>
                                    <Col>
                                        <h6>Description:</h6>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button>See Bets in this Region</Button>
                                    </Col>
                                </Row>
                            </Container>
                            </Col>
                            <Col>
                                <DisplayMap miniMap={true} regionDetails={betRegions[i]}/>
                            </Col>
                            </Row>
                        </Container>
                    </Jumbotron>
                    regionCards.push(newCard);
                }
                return (
                    <div>{regionCards}</div>
                )
            }else{
                return (
                    <Card><CardContent>There are no bet regions in your area</CardContent></Card>
                )
            }
        }else{
            return(
                <Card>
                    <CardContent>
                        Loading Regions
                </CardContent>
                </Card>
            )
        }
    }
}

export default FindBetPage;