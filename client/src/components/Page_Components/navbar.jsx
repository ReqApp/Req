import React from 'react';
import {Button, Navbar as BootNav, Nav, NavDropdown, Form} from 'react-bootstrap/';
import reqLogo from '../../images/reqLogo.png';

import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import MapIcon from '@material-ui/icons/Map';

export default class Navbar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            profilePicture: '',
            requestDone: false,
            signedIn: false
        }
    }

    getProfileInfo = () => {
        fetch('http://localhost:9000/users/isSignedIn', {
            method: 'POST',
            crossDomain: true,
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        }).then((res) => res.json())
        .then((res) => {
            this.setState({username:res.body});
            fetch('http://localhost:9000/users/getProfilePicture', {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username":res.body
            })
            }).then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    this.setState({profilePicture:res.body, requestDone: true, signedIn: true});
                } else if (res.body === "No profile picture") {
                    this.setState({profilePicture:"https://i.imgur.com/RCzcFP0.png",  requestDone: true, signedIn: true});
                } else if (res.body === "error") {
                    console.log("failed to get profile picture");
                }
                this.setState({requestDone: true});
            }, (err) => {
                console.log(`err getting profile pic : ${err}`);
            })
            }, (err) => {
                console.log(err);
                console.log("not signedIn")
            })
    }

    componentDidMount() {
        this.getProfileInfo();
        this.setState({requestDone: true})
    }
    render(){
        const {requestDone, profilePicture, username, signedIn } = this.state;
        let profileLink = `/users/profile?${username}`;

        if (requestDone) {
            if (signedIn) {
                return(
                    <BootNav bg='light'expand="lg" sticky="top">    
                        <a href="/"><img src={reqLogo} style={{width:'65px'}} alt='Req Logo'/></a>
                        <BootNav.Toggle aria-controls="basic-BootNav-nav" />
                        <BootNav.Collapse id="basic-BootNav-nav">
                            <Nav className="mr-auto">
                            <Nav.Link href="/users/dashboard">Dashboard</Nav.Link>
                            <NavDropdown title="Betting" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1"><MapIcon /> Find bets near you</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Worldwide bets</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Article bets</NavDropdown.Item>
                            </NavDropdown>
                            </Nav>
                            <Form inline>
                            <img src={profilePicture} 
                            style={styles.profilePic}
                            alt="hello world">
                            </img>
                            <a href={profileLink} style={{color:'black'}}>  <p style={styles.username}> {username} </p></a>
                            </Form>
                        </BootNav.Collapse>
                    </BootNav>
                )
            } else {
                return(
                    <BootNav bg='light'expand="lg" sticky="top">    
                        <a href="/">
                            <img src={reqLogo} 
                            style={{width:'65px'}} 
                            alt='Req Logo'/>
                        </a>
                        <BootNav.Toggle aria-controls="basic-BootNav-nav" />
                        <BootNav.Collapse id="basic-BootNav-nav">
                            <Nav className="mr-auto">
                            <Nav.Link href="/users/dashboard">Dashboard</Nav.Link>
                            <NavDropdown title="Betting" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1"><MapIcon /> Find bets near you</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Worldwide bets</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Article bets</NavDropdown.Item>
                            </NavDropdown>
                            </Nav>
                            <Form inline>
                            <Button href="/users/login" variant="outline-primary"> Sign in  <PersonAddRoundedIcon /></Button>
                            </Form>
                        </BootNav.Collapse>
                    </BootNav>
                )
            }
        } 
        return null;
       
    }
}

const styles = {
    profilePic: {
        height:'32px', 
        width:'32px',
        borderRadius: '20px'
    },
    username: {
        fontWeight:'bold', 
        fontSize:'2vh',
        paddingTop:'2vh', 
        paddingLeft:'1vh', 
        paddingRight:'3vh'
    }
}