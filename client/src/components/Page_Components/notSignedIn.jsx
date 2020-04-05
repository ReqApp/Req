import React, { Component } from 'react'
import Navbar from '../Page_Components/navbar';
import {Container, Row, Col} from 'react-bootstrap';
import {Paper} from '@material-ui/core';


// import ReqBackground from '../images/reqBackground4.jpg'
import ReqBackground from '../../images/reqBackground4.jpg';

export default class NotSignedIn extends Component {
    render() {

        return (
            <div style={styles.backing}>
                <Navbar />
                <Container style={styles.con}>
                    <Row style={styles.cards}>
                        <Col style={styles.cards}>
                                <h2 style={{fontWeight:'bold', paddingTop:'2vh'}}>You're not signed in</h2>
                                <p>
                                    You must <a href='/users/login'>sign in</a> to view this page
                                </p>

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
        fontSize: '110vh'
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