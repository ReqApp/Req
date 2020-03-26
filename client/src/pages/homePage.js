import React, { Component } from 'react'
import Navbar from '../components/navbar';
import {Container, Row, Col} from 'react-bootstrap';
import Typography from "@material-ui/core/Typography";
import {Paper} from '@material-ui/core';
import EuroIcon from '@material-ui/icons/Euro';
import ExploreIcon from '@material-ui/icons/Explore';
import PeopleIcon from '@material-ui/icons/People';
import ReqAnimation from '../components/reqAnimation';
import Copyright from '../components/copyRight'
import Avatar from '@material-ui/core/Avatar';

import Cathal from '../images/cathalAvatar.png';
import Karl from '../images/Karl.jpeg';
import Rory from '../images/Rory.jpeg';
import Eoin from '../images/eoin.jpg';
import ReqBackground from '../images/reqBackground4.jpg'
import GitHubIcon from '../images/githubIcon.svg';


export class Home extends Component {
    render() {
        return (
            <div style={styles.backing}>
                <Navbar />
                <Container style={styles.con}>
                    <Row>
                        <Col>
                            {/* <img src={logo} style={styles.logo}/> */}
                            <ReqAnimation />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Paper elevation={3} style={styles.card}>
                                <h4>Win Big</h4>
                                <EuroIcon fontSize="large" style={styles.icon}/>
                                <Typography>
                                    With Req the sky is really the limit in terms of what you can bet on
                                    <br />
                                    <br />
                                    <a href=""> Create your first bet </a>
                                </Typography>
                            </Paper>
                        </Col>
                        <Col>
                            <Paper elevation={3} style={styles.card}>
                                <h4>Explore</h4>
                                <ExploreIcon fontSize="large" style={styles.icon}/>
                                <Typography>
                                    Simply sitting at home using Req won't give you the full experience. Go outside and explore on your search for the next jackpot.
                                    <br />
                                    < br />
                                    <a href=""> Search for bets in your area </a>
                                </Typography>
                            </Paper>
                        </Col>
                        <Col>
                            <Paper elevation={3} style={styles.card}>
                                <h4>Create</h4>
                                <PeopleIcon fontSize="large" style={styles.icon}/>
                                <Typography>
                                    All creators are credited 10% of all coins which incentivizes new and creative bets.
                                    <br />
                                    <br />
                                    <a href=""> Learn about how our betting system works </a>
                                </Typography>
                            </Paper>
                        </Col>
                        
                    </Row>
                </Container>

                <Container>
                <h1 style={{textAlign:'center'}} className={styles.theTeam}> The Team</h1>

                    <Row style={{textAlign:'center'}}>
                        <Col>
                        <Avatar alt="Cathal O'Callaghan - Back-end Infrastructure" src={Cathal} style={{width:'120px', height:'120px', margin:'12px auto 12px auto'}}></Avatar>
                        <h4 style={{fontWeight:'bold'}}>Cathal O'Callaghan <a href="https://iamcathal.github.io"><img src={GitHubIcon} style={{height:'26px', width:'26px'}}></img></a></h4> 
                        <h6> Back-end Infrastructure </h6>
                        
                        </Col>
                        <Col>
                        <Avatar alt="Karl Gordon - Front-end UI/UX" src={Karl} style={{width:'120px', height:'120px', margin:'12px auto 12px auto'}}></Avatar>
                        <h4 style={{fontWeight:'bold'}}>Karl Gordon <a href="https://github.com/FilthyHound"><img src={GitHubIcon} style={{height:'26px', width:'26px'}}></img></a></h4>
                        <h6> Front-end UI/UX </h6>

                        </Col>
                        <Col>
                        <Avatar alt="Rory Sweeney -  - Front-end UI/UX" src={Rory} style={{width:'120px', height:'120px', margin:'12px auto 12px auto'}}></Avatar>
                        <h4 style={{fontWeight:'bold'}}>Rory Sweeney <a href="https://github.com/RorySweeney99"><img src={GitHubIcon} style={{height:'26px', width:'26px'}}></img></a></h4>
                        <h6> Front-end UI/UX </h6>

                        </Col>
                        <Col>
                        <Avatar alt="Eoin Mc Ardle - Back-end Infrastructure/Front-end UI/UX" src={Eoin} style={{width:'120px', height:'120px', margin:'12px auto 12px auto'}}></Avatar>
                        <h4 style={{fontWeight:'bold'}}>Eoin Mc Ardle <a href="https://github.com/EoinMcArdle99"><img src={GitHubIcon} style={{height:'26px', width:'26px'}}></img></a></h4>
                        <h6> Back-end Infrastructure / Front-end UI </h6>

                        </Col>
                    </Row>
                </Container>
                <br />
                <br />
                <br />
                {/* please forgive me for this */}
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />

            </div>
        )
    }
}

const styles = {
    con: {
        height: '100vh'
    },
    theTeam: {
        padding: '0px 0px 50px 0px'
    },
    logo: {
        marginTop: 100,
        marginBottom: 100,
        display: 'block',
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    card: {
        textAlign: 'center',
        padding: '25px',
        marginBottom: '60px'
    },
    backing: {
        backgroundImage:`url(${ReqBackground})`,
        backgroundPosition: 'center',
        height:'100%'
    },
    icon: {
        margin: 15,
        color: '#a681a6'
    },
    copy: {
        marginTop: 20
    }
}