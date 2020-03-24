import React from 'react';
import {Button, Navbar as BootNav, Nav, NavDropdown, Form} from 'react-bootstrap/';

export default class Navbar extends React.Component{
    render(){
        return(
            <BootNav bg='light'expand="lg" sticky="top">    
                <BootNav.Brand href="#home">Req</BootNav.Brand>
                <BootNav.Toggle aria-controls="basic-BootNav-nav" />
                <BootNav.Collapse id="basic-BootNav-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="#home">Dashboard</Nav.Link>
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
                </BootNav.Collapse>
            </BootNav>
        )
    }
}

const styles = {
    colour: {
        backgroundColor: '#a681a6',
    }
}
