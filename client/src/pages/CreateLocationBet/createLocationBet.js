import React from 'react';
import Navbar from '../../components/navbar';
import DisplayMap from'../../components/maps';
import {Button, NavDropdown, Form, FormControl, Jumbotron, Container, Row, Col, Tabs, Tab, Dropdown, Modal} from 'react-bootstrap/';

class CreateLocationBet extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadingRegions: true,
            betRegions: null,
            location: {
                lat: 0,
                lng: 0
            },
            locationRetrieved: false
        }
        this.handleLocationRetrieved = this.handleLocationRetrieved.bind(this);
    }

    handleLocationRetrieved(location){
        //this.setState({location : location, locationRetrieved : true});
        fetch("http://localhost:9000/getBettingRegions?lat=53.28211&lng=-9.062186").then(regions => {
            regions.json();
        }).then(regions => 
            {this.setState({loadingRegions : false, betRegions : regions});
        }).catch(err => {
            console.log(err);
        });
    }

    handleLocationError(err){
        console.log(err);
    }

    render(){
        return (
            <div>
                <Navbar />
                <Container>
                    <Row>
                        <Col>
                            <DisplayMap
                                locationRetrieved={this.handleLocationRetrieved}
                                scrollToRegion={this.handleScrollToRegion} 
                                error={this.handleLocationError}
                            />
                        </Col>
                        <Col>
                            
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

const styles = {
    main: {
        width: '100%',
        margin: '0px',
        padding: '0px',
    }
}

export default CreateLocationBet;