import React, {createRef, Component} from 'react';
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
import {Button, Nav, Navbar, NavDropdown, Form, FormControl, Jumbotron, Container, Row, Col, Tabs, Tab, Dropdown} from 'react-bootstrap/';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './findLocationBets.css';


class FindBetPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            menuStyles : makeStyles(theme => ({
                root: {
                    flexGrow: 1,
                },
                menuButton: {
                    marginRight: theme.spacing(2),
                },
                title: {
                    flexGrow: 1,
                },
                })),
            betRegions : null,
            loadingRegions : true,
            shownRegion : null,
        }
        this.handleRegionHover = this.handleRegionHover.bind(this);
    }

    componentDidMount(){
        fetch("http://localhost:9000/getBettingRegions?lat=53.28211&lng=-9.062186").then(regions => regions.json()).then(regions => this.setState({loadingRegions : false, betRegions : regions})).catch(err => err);
    }

    handleRegionHover(id){
        this.setState({shownRegion : id});
        console.log(id);
    }



    render(){
        var predictSearch = null;
        if(!this.state.loadingRegions){
            predictSearch = <div style={{ width: 300 }}>
                <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    options={this.state.betRegions.map(region => region.region_name)}
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
                            <DisplayMap betRegions={this.state.betRegions} loadingRegions={this.state.loadingRegions} shownRegion={this.state.shownRegion}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
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
                                    <Dropdown.Item href="#/action-1">Popularity</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Closest</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col>
                            {predictSearch}
                        </Col>
                        </Row>
                    <Row>
                        <Col xs={10}><BetRegionCards onRegionHover={this.handleRegionHover} loadingRegions={this.state.loadingRegions} betRegions={this.state.betRegions} sort="popular"/></Col>
                        <Col>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

class BetRegionCards extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            useStyles : makeStyles({
                root: {
                  minWidth: 275,
                },
                bullet: {
                  display: 'inline-block',
                  margin: '0 2px',
                  transform: 'scale(0.8)',
                },
                title: {
                  fontSize: 14,
                },
                pos: {
                  marginBottom: 12,
                },
            }),
        }
    }
    highlightBetRegion(id){
        this.props.onRegionHover(id);
    }

    render(){
        const {loadingRegions, betRegions, sort} = this.props;

        // If regions are loaded display cards
        if(!loadingRegions){
            var regionCards = [];
            const display_num_regions = betRegions.length > 20 ? 20 : betRegions.length;
            if(sort === "popular"){
                betRegions.sort((a, b) => {return a.num_bets - b.num_bets});
            }
            betRegions.reverse();
            if(Array.isArray(betRegions) && betRegions.length){
                for(var i = 0; i < display_num_regions ; i++){
                { /*  onMouseOver={this.highlightBetRegion.bind(this, betRegions[i]._id) */}
                    regionCards.push(<Jumbotron bg="light" key={betRegions[i]._id}>
                        <h3>{betRegions[i].region_name}</h3>
                        <h6>Number of Bets: {betRegions[i].num_bets}</h6>
                        <Button>Select Region</Button><DisplayMap />
                    </Jumbotron>);
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
                <Card className={this.state.useStyles.root}>
                    <CardContent>
                        Loading Regions
                </CardContent>
                </Card>
            )
        }
    }
}

export default FindBetPage;