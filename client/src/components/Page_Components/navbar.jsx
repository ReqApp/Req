import React from 'react';
import {Button, Navbar as BootNav, Nav, NavDropdown, Form} from 'react-bootstrap/';
import reqLogo from '../../images/reqLogo.png';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';

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
        fetch('http://ec2-107-23-251-248.compute-1.amazonaws.com:9000/users/isSignedIn', {
            method: 'POST',
            crossDomain: true,
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        }).then((res) => res.json())
        .then((res) => {    
            this.setState({username:res.body.user_name});
            fetch('http://ec2-107-23-251-248.compute-1.amazonaws.com:9000/users/getProfilePicture', {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username":res.body.user_name
            })
            }).then((res) => res.json())
            .then((res) => {
                console.log(res)
                if (res.status === "success") {
                    console.log(`success`)
                    this.setState({profilePicture:res.body, requestDone: true, signedIn: true});
                } else if (res.body === "No profile picture") {
                    console.log(`no profiler`)
                    this.setState({profilePicture:"https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",  requestDone: true, signedIn: true});
                } else if (res.status === "error") {
                    this.setState({profilePicture:"https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",  requestDone: true, signedIn: true});
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
        this.setState({requestDone: true});
    }

    handleNewBet = () => {
        this.props.action('new-bet');
    }

    handleFindBets = () => {
        this.props.action('find-bets');
    }

    handleFindLocationBets = () => {
        this.props.action('find-location-bets');
    }

    handleCreateLocationBet = () => {
        this.props.action('create-location-bet');
    }

    render(){
        const {requestDone, profilePicture, username, signedIn } = this.state;
        const {dashboard} = this.props;
        let profileLink = `/users/profile?${username}`;

        if (requestDone) {
            if (signedIn) {
                return(
                    <BootNav expand="lg" sticky="top" style={{backgroundColor: '#ffffff'}}>    
                        <a href="/"><img src={reqLogo} style={{width:'65px'}} alt='Req Logo'/></a>
                        <BootNav.Toggle aria-controls="basic-BootNav-nav" />
                        <BootNav.Collapse id="basic-BootNav-nav">
                            <Nav className="mr-auto">
                            <Nav.Link href={profileLink}>Profile</Nav.Link>
                            <Nav.Link href="/users/dashboard">Dashboard</Nav.Link>
                            {dashboard ? 
                                <NavDropdown title="Betting" id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={this.handleNewBet}>New Bet</NavDropdown.Item>
                                    <NavDropdown.Item onClick={this.handleFindBets}>Find bets</NavDropdown.Item>
                                </NavDropdown>
                            : 
                            <div></div>
                            }
                            {dashboard ?
                                <NavDropdown title="Location Betting" id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={this.handleFindLocationBets}>Find bets near you</NavDropdown.Item>
                                    <NavDropdown.Item onClick={this.handleCreateLocationBet}>Create Location Bet</NavDropdown.Item>
                                </NavDropdown>
                                :
                                <div></div>
                            }
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
