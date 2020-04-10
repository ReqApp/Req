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
                                Req is a 2nd year software engineering group project made to be an app where anyone can bet on anything. Staying at home won't gain you the full experience offered by Req as many bets require you to physically be within a set radius of them in order to compete in them. All bet creators get 10% of the total amount of coins placed on their bets which incentives users to create the interesting and eye-catching bets to increase their wealth and (hopefully not) gamble it away.
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
                                <div style={{justifyContent:'center'}}>
                                    <a href="https://docs.google.com/document/d/1VSiNX-g0KNztlQGvLeRhXwnbwbDW9phK2VmmVpqMUvw/edit?usp=sharing">
                                    <img
                                        src="https://i.imgur.com/RgGdo2s.png"
                                        alt="Design docs"
                                        width="30%"
                                    />
                                    </a>

                                    <a href="http://ec2-107-23-251-248.compute-1.amazonaws.com:9000/docs">
                                    <img
                                        src="https://i.imgur.com/VRvwAHU.png"
                                        alt="API docs"
                                        width="30%"
                                    />
                                    </a>

                                </div>
                                <hr 
                                />

                                <h2 style={{fontWeight:'bold', paddingTop:'2vh'}}>What stack does Req use?</h2>
                                <img
                                    src="https://i.imgur.com/uJI4eHo.png"
                                    alt="Req Stack"
                                    width="50%"
                                />
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