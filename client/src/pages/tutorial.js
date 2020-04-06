import React, { Component } from 'react'
import Navbar from '../components/Page_Components/navbar';
import {Container, Row, Col} from 'react-bootstrap';

import ReqBackground from '../images/reqBackground4.jpg'

export class Tutorial extends Component {
    render() {
        return (
            <div style={styles.backing}>
                <Navbar />
                <Container style={styles.con}>
                    <Row style={{marginTop:'5vh'}}>
                        <Col>
                                <p style={styles.mainText}> What is Req? </p>

                                <p style={styles.infoText}> Req is a real life based web app designed to allow users to bet on
                                anything and everything
                                </p>
                        </Col>
                        <Col>
                            <img src={"https://i.imgur.com/OibYLmt.png"} 
                            style={styles.phoneImage}
                            alt="Why didn't this load">
                            </img>
                        </Col>
                    </Row>
                    <Row  style={{marginTop:'15vh'}}>
                        <Col>
                                <p style={styles.mainText}> Why should I create bets? </p>

                                <p style={styles.infoText}>  All creators earn 10% of the total coins placed on their bets which incentivizes you to create the most
                                    eye-catching and lucrative bets possible
                                </p>
                        </Col>
                        <Col>
                            <img src={"https://i.imgur.com/sjNwFXs.png"}
                             style={styles.phoneImage}
                             alt="Why didn't this load">
                             </img>
                        </Col>
                        
                    </Row>

                    <Row  style={{marginTop:'15vh'}}>
                        <Col>
                                <p style={styles.mainText}> What happens when a bet finishes? </p>

                                <p style={styles.infoText}>  Creators are given 24 hours after the deadline to decide the result of the bet. If they fail to set the result after this time 5% of their coins is taken away.
                                </p>
                        </Col>
                        <Col>
                            <img src={"https://i.imgur.com/2WhydEu.png"}
                             style={styles.phoneImage}
                             alt="Why didn't this load">
                             </img>
                        </Col>
                        
                    </Row>


                    <Row  style={{marginTop:'15vh'}}>
                        <Col>
                                <p style={styles.mainText}> What kinds of bets are there? </p>

                                <p style={styles.infoText}> <span style={{fontWeight:'bold'}}>Binary</span> - Yes/No<br />
                                <span style={{fontWeight:'bold'}}>Multi</span> - Any range of numbers for an answer <br />
                                <span style={{fontWeight:'bold'}}>Location</span> - Either binary or multi but with a geolocation
                                lock that defines where users can interact with it.
                                </p>
                        </Col>
                        <Col>
                            <img src={'https://i.imgur.com/aQwXsmH.png'}
                             style={styles.phoneImage}
                             alt="Why didn't this load">
                             </img>
                        </Col>
                        
                    </Row>

                    <Row  style={{marginTop:'15vh'}}>
                        <Col>
                                <p style={styles.mainText}> Great, let's get started </p>

                                <p style={styles.infoText}> <a href="/users/register"> Register an account </a> </p>
                                <h6> or </h6>
                                <p style={styles.infoText}> <a href="/users/dashboard"> Browse your dashboard </a> </p>
                        
                                <p style={styles.mainText}> Want more information? </p>

                                <p style={styles.infoText}> <a href="/faq"> Read the FAQ </a> </p>

                        </Col>
                        <Col>
                            <img src={"https://i.imgur.com/8njfHy5.png"}
                             style={styles.phoneImage}
                             alt="Why didn't this load">
                             </img>
                        </Col>
                        
                    </Row>

                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </Container>
                

            </div>
        )
    }
}

const styles = {
    con: {
        height: '100vh',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundImage:`url(${ReqBackground})`,
        backgroundPosition: 'center',
        height:'100%',
        backgroundAttachment: 'fixed'
    },
    mainText: {
        fontWeight: 'bold',
        fontSize: '5vh'
    },
    infoText: {
        fontSize: '3vh'
    },
    theTeam: {
        padding: '0px 0px 50px 0px'
    },
    backing: {
        backgroundImage:`url(${ReqBackground})`,
        backgroundPosition: 'center',
        height:'100%',
        backgroundAttachment: 'fixed'
    },
    logo: {
        marginTop: 100,
        marginBottom: 100,
        display: 'block',
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    phoneImage: {
        height: '50vh'
    },
    card: {
        textAlign: 'center',
        padding: '25px',
        marginBottom: '60px'
    },
    icon: {
        margin: 15,
        color: '#a681a6'
    },
    copy: {
        marginTop: 20
    }
}