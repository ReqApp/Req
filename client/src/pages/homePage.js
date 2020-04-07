import React, { Component } from 'react'
import {Redirect} from 'react-router-dom';

import Navbar from '../components/Page_Components/navbar';
import {Container, Row, Col} from 'react-bootstrap';
import Typography from "@material-ui/core/Typography";
import {Paper} from '@material-ui/core';
import EuroIcon from '@material-ui/icons/Euro';
import ExploreIcon from '@material-ui/icons/Explore';
import PeopleIcon from '@material-ui/icons/People';
import ReqAnimation from '../components/Miscellaneous/reqAnimation';
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Copyright from '../components/Page_Components/copyRight'

import Cathal from '../images/Team/cathalAvatar.png';
import Karl from '../images/Team/Karl.jpeg';
import Rory from '../images/Team/Rory.jpeg';
import Eoin from '../images/Team/eoin.jpg';
import ReqBackground from '../images/reqBackground4.jpg'
import GitHubIcon from '../images/githubIcon.svg';

export class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loadTutorial: false
        }
    }


    render() {
        const { loadTutorial} = this.state
        if (loadTutorial) {
            return(
                <Redirect to={'/tutorial'} />
            )
        }
        return (
            <div style={styles.backing}>
                <Navbar />
                <div>
                    <Row>
                        <Col>
                <Container>
                    <Row>
                        <Col xs={12}>
                            <ReqAnimation />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={4}>
                            <Paper elevation={3} style={styles.card}>
                                <h2 style={{fontWeight:'bold'}}>Win Big</h2>
                                <EuroIcon fontSize="large" style={styles.icon}/>
                                <Typography>
                                    The sky is really the limit in terms of what you can bet on.
                                    <br />
                                    <br />
                                    <a href="/users/dashboard" style={{fontWeight:'bold'}}> Create your first bet </a>
                                </Typography>
                            </Paper>
                        </Col>
                        <Col xs={12} md={4}>
                            <Paper elevation={3} style={styles.card}>
                                <h2 style={{fontWeight:'bold'}}>Explore</h2>
                                <ExploreIcon fontSize="large" style={styles.icon}/>
                                <Typography>
                                    Go outside and explore on your search for the next jackpot.
                                    <br />
                                    < br />
                                    <a href="/find-location-bets" style={{fontWeight:'bold'}}> Search for bets in your area </a>
                                </Typography>
                            </Paper>
                        </Col>
                        <Col xs={12} md={4}>
                            <Paper elevation={3} style={styles.card}>
                                <h2 style={{fontWeight:'bold'}}>Create</h2>
                                <PeopleIcon fontSize="large" style={styles.icon}/>
                                <Typography>
                                    Creators get 10% of coins placed on their bets
                                    <br />
                                    <br />
                                    <a href="/tutorial" style={{fontWeight:'bold'}}>  Take the getting started tour </a>
                                </Typography>
                            </Paper>
                        </Col>
                        
                    </Row>
                </Container>
                </Col>
                </Row>
                <Row>
                    <Col>
                <Container>
                    <Row>
                        <Col>
                            <h1 style={{textAlign:'center'}} className={styles.theTeam}> Made with <FavoriteIcon fontSize='large'/> by </h1>
                        </Col>
                    </Row>
                    <Row style={{textAlign:'center'}}>
                        <Col xs={12} md={6} lg={3}>
                        <Avatar alt="Cathal O'Callaghan - Back-end Infrastructure" src={Cathal} style={{width:'120px', height:'120px', margin:'12px auto 12px auto'}}></Avatar>
                        <h4 style={{fontWeight:'bold'}}>Cathal O'Callaghan <a href="https://iamcathal.github.io"><img src={GitHubIcon} style={{height:'26px', width:'26px'}} alt='Cathal'></img></a></h4> 
                        <h6>  Back-end Infrastructure / Front-end UI </h6>   
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                        <Avatar alt="Karl Gordon - Front-end UI/UX" src={Karl} style={{width:'120px', height:'120px', margin:'12px auto 12px auto'}}></Avatar>
                        <h4 style={{fontWeight:'bold'}}>Karl Gordon <a href="https://github.com/FilthyHound"><img src={GitHubIcon} style={{height:'26px', width:'26px'}} alt='Karl'></img></a></h4>
                        <h6> Front-end UI/UX </h6>

                        </Col>
                        <Col xs={12} md={6} lg={3}>
                        <Avatar alt="Rory Sweeney -  - Front-end UI/UX" src={Rory} style={{width:'120px', height:'120px', margin:'12px auto 12px auto'}}></Avatar>
                        <h4 style={{fontWeight:'bold'}}>Rory Sweeney <a href="https://github.com/RorySweeney99"><img src={GitHubIcon} style={{height:'26px', width:'26px'}} alt='Rory'></img></a></h4>
                        <h6> Front-end UI/UX </h6>

                        </Col>
                        <Col xs={12} md={6} lg={3}>
                        <Avatar alt="Eoin Mc Ardle - Back-end Infrastructure/Front-end UI/UX" src={Eoin} style={{width:'120px', height:'120px', margin:'12px auto 12px auto'}}></Avatar>
                        <h4 style={{fontWeight:'bold'}}>Eoin Mc Ardle <a href="https://github.com/EoinMcArdle99"><img src={GitHubIcon} style={{height:'26px', width:'26px'}} alt='Eoin'></img></a></h4>
                        <h6> Back-end Infrastructure / Front-end UI </h6>

                        </Col>
                    </Row>

                    <Row style={{marginTop:'5vh'}}>
                        <Col style={{textAlign:'center'}}>
                            <h3> Want to learn more? <br/>Read the <a href="/faq">FAQ</a></h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Copyright />
                        </Col>
                    </Row>
                </Container>
                </Col>
                </Row>
                </div>
                <br />
                <br />
            </div>
        )
    }
}

const styles = {
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
        margin: '10px',
        color: 'black'
    },
    copy: {
        marginTop: 20
    }
}