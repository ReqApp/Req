import React, { Component } from 'react'
import Navbar from '../components/Page_Components/navbar';
import {Container, Row, Col} from 'react-bootstrap';
import {Paper} from '@material-ui/core';
import Alert from '../components/Miscellaneous/alertSnack';
import Snackbar from '@material-ui/core/Snackbar';



import ReqBackground from '../images/reqBackground4.jpg'



export class BigRedButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timePressed: 1,
             // Used for error and success snacks(toasts)
            msg : '',
            msgType : '',
            snackOpen : false
        }
    }

    pressRedButton = () => {
        const {timesPressed, msg, msgType, snackOpen} = this.state;
        let timesPressedLocal = 0;
        
        if (timesPressed > 0) {
            timesPressedLocal = timesPressed;
        }
        fetch('http://ec2-107-23-251-248.compute-1.amazonaws.com:9000/bets/pressBigButton', {
            method:'POST',
            crossDomain: true,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
        }).then((res) => res.json())
        .then((res) => {
            if (res.status === "success") {
                timesPressedLocal++;
                this.setState(
                    {
                        timesPressed: timesPressedLocal,
                        msg: `Pressed ${timesPressedLocal} times`,
                        msgType: 'success',
                        snackOpen: true 
                    });
            } else {
                this.setState(
                    {
                        msg: `Failed to press big red button`,
                        msgType: 'error',
                        snackOpen: true 
                    });
            }
        }, (err) => {
            console.warn(err);
        })
    }


  handleSnackClose = (event, reason) => {
    if(reason === 'clickaway'){
        return;
    }
    this.setState({snackOpen : false});
}
    render() {
        const {msg, msgType, snackOpen} = this.state;

        return (
            <div style={styles.backing}>
                <Navbar />
                <Snackbar open={snackOpen} autoHideDuration={6000} onClose={this.handleSnackClose}>
                    <Alert onClose={this.handleSnackClose} severity={msgType}>{msg}</Alert>
                </Snackbar>
                <Container style={styles.con}>
                    <Row style={styles.cards}>
                        <Col style={styles.cards}>
                        <Paper elevation={3} style={styles.card}>
                                <img 
                                    src="https://media-exp1.licdn.com/dms/image/C560BAQHWXKz8rFb9FQ/company-logo_200_200/0?e=2159024400&v=beta&t=0LvbdnPyKQ7KjSGF-ZYBlY-nCkcN8DEgUBYm84r4xB4"
                                    alt="big red button"
                                    width="350vh"
                                    onClick={this.pressRedButton}
                                />

                                <hr 
                                />

                                <h2 style={{fontWeight:'bold', paddingTop:'2vh'}}>What is this?</h2>
                                <p>
                                    Something something filler text about this. It starts every dat at 6pm and you bet
                                </p>

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