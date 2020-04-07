import React, { Component } from 'react'
import Navbar from '../components/Page_Components/navbar';
import {Container, Row, Col} from 'react-bootstrap';
import {Paper} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

import Cathal from '../images/Team/cathalAvatar.png';
import Karl from '../images/Team/Karl.jpeg';
import Rory from '../images/Team/Rory.jpeg';
import Eoin from '../images/Team/eoin.jpg';
import ReqBackground from '../images/reqBackground4.jpg'
import GitHubIcon from '../images/githubIcon.svg';

export class FAQ extends Component {
    render() {
        return (
            <div style={styles.backing}>
                <Navbar />
                <Container style={styles.con}>
                    <Row style={styles.cards}>
                        <Col style={styles.cards}>
                        <Paper elevation={3} style={styles.card}>
                                <p style={styles.bigText}>FAQ</p>
                                <h2 style={{fontWeight:'bold', paddingTop:'2vh'}}>What is Req? </h2>
                                <p>
                                Req is a real life based betting app made to enable anyone to bet on anything. 
                                With geolocation being an integral part of the app bets can be locked to users 
                                within certain areas which incentivizes people to go out and get some fresh air.
                                </p>

                                <hr 
                                />

                                <h2 style={{fontWeight:'bold', paddingTop:'2vh'}}>Why was Req made?</h2>
                                <p>
                                Req is our group project for our CT216 Software Engineering module in 2nd year CS&IT NUIG.
                                </p>

                                <hr 
                                />

                                <h2 style={{fontWeight:'bold', paddingTop:'2vh'}}>Are there design docs?</h2>
                                <p>
                                Yes! The design docs can be viewed <a href="https://docs.google.com/document/d/1VSiNX-g0KNztlQGvLeRhXwnbwbDW9phK2VmmVpqMUvw/edit?usp=sharing">here</a>. 
                                We also have documentation for the backend APIs which can be viewed <a href="/404">here</a>
                                </p>

                                <hr 
                                />

                                <h2 style={{fontWeight:'bold', paddingTop:'2vh'}}>What stack does Req use?</h2>
                                <p>
                                For the most part Req uses a standard MERN stack, which is Mongo, Express, React and Node. Alongside this there are various scripts
                                for automated tasks that are written in Go
                                </p>
                                
                                <hr 
                                />

                                <h2 style={{fontWeight:'bold', paddingTop:'2vh'}}>How is Req hosted?</h2>
                                <p>
                                Req is currently hosted on AWS EC2 instance. Our mongo database however is hosted by the NUIG danu7 server.
                                </p>

                                <hr 
                                />

                                <h2 style={{fontWeight:'bold', paddingTop:'2vh'}}>Who made Req?</h2>
                               <Row>
                               <Col>
                        <Avatar alt="Cathal O'Callaghan - Back-end Infrastructure" src={Cathal} style={styles.icons}></Avatar>
                        <h4 style={{fontWeight:'bold'}}>Cathal O'Callaghan <a href="https://iamcathal.github.io"><img src={GitHubIcon} style={{height:'26px', width:'26px'}} alt='Cathal'></img></a></h4> 
                        <h6> Back-end Infrastructure / Front-end UI </h6>
                        
                        </Col>
                        <Col>
                        <Avatar alt="Karl Gordon - Front-end UI/UX" src={Karl} style={styles.icons}></Avatar>
                        <h4 style={{fontWeight:'bold'}}>Karl Gordon <a href="https://github.com/FilthyHound"><img src={GitHubIcon} style={{height:'23px', width:'23px'}} alt='Karl'></img></a></h4>
                        <h6> Front-end UI/UX </h6>

                        </Col>
                        <Col>
                        <Avatar alt="Rory Sweeney -  - Front-end UI/UX" src={Rory} style={styles.icons} ></Avatar>
                        <h4 style={{fontWeight:'bold'}}>Rory Sweeney <a href="https://github.com/RorySweeney99"><img src={GitHubIcon} style={{height:'23px', width:'23px'}} alt='Rory'></img></a></h4>
                        <h6> Front-end UI/UX </h6>

                        </Col>
                        <Col>
                        <Avatar alt="Eoin Mc Ardle - Back-end Infrastructure/Front-end UI/UX" src={Eoin} style={styles.icons}></Avatar>
                        <h4 style={{fontWeight:'bold'}}>Eoin Mc Ardle <a href="https://github.com/EoinMcArdle99"><img src={GitHubIcon} style={{height:'23px', width:'23px'}} alt='Eoin'></img></a></h4>
                        <h6> Back-end Infrastructure / Front-end UI </h6>

                        </Col>
                               </Row>
                            </Paper>
                        </Col>
                       
                    </Row>
                </Container>
                

            </div>
        )
    }
}

const styles = {
    con: {
        height: '100vh',
        marginTop: '80px',
        justifyContent: 'center',
        textAlign: 'center'
    },
    mainText: {
        fontWeight: 'bold',
        fontSize: '5vh'
    },
    cards: {
        margin: '2px'
    },
    infoText: {
        fontSize: '3vh'
    },
    icons: {
        width:'90px',
        height:'90px',
        margin:'12px auto 12px auto'
    },
    theTeam: {
        padding: '0px 0px 50px 0px'
    },
    bigText: {
        fontSize: '6vh',
        fontWeight: 'bold',
        marginBottom: '0px'
    },
    backing: {
        backgroundImage:`url(${ReqBackground})`,
        backgroundPosition: 'center',
        height:'100%'
    },
    logo: {
        marginTop: 100,
        marginBottom: 100,
        display: 'block',
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    phoneImage: {
        height: '50%'
    },
    card: {
        textAlign: 'center',
        marginBottom: '60px',
        padding: '2vh'
    },
    icon: {
        margin: 15,
        color: '#a681a6'
    },
    copy: {
        marginTop: 20
    }
}