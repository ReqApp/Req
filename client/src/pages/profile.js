// React
import React from 'react';
// Material
import Typography from "@material-ui/core/Typography";
import { Avatar } from '@material-ui/core';
import {Button} from '@material-ui/core';
import {Paper} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
// Bootstrap
import {Container, Row, Col} from 'react-bootstrap';
// Components
import Navbar from '../components/navbar';
import Graphs from '../components/dataGraphs';
import ProfilePicture from '../components/profilePicture';
import Coins from '../components/coins';
//Other
import openSocket from 'socket.io-client';

export class Profile extends React.Component{    
    constructor(props){
        super(props);
        this.state = {
            gettingUserName: true,
            userName: '',
            click: false,
            imgSrc: null,
        }
        this.socket = openSocket('http://localhost:9000');
    }

    componentDidMount(){
        let targetUser =  window.location.href.split("?")[1];
        this.setState({userName : targetUser, gettingUserName : false});
    }
    
    handleClick = () => {
        const holder = this.state.click == false ? true : false;
        let src = 'https://api.qrserver.com/v1/create-qr-code/?size=265x265&qzone=0&margin=0&data=' + window.location.href;
        this.setState({click: holder, imgSrc: src});
        this.getLink();
    }

    getLink = () => {
        let url = window.location.href;
        if(url.includes('localhost')){
            this.socket.emit('servedQR', "https://goolnk.com/BZY3XX");
        }else{
            // TODO change before deploying to AWS
            fetch('http://localhost:9000/shortenLink', {
                method: 'POST',
                body: 'url=' + url
            }).then((res) => {
                console.log("Emit sent");
                this.socket.emit('servedQR', res.url);
            }, (err) => {
                console.log(err);
            });
        }
    }

    render(){
        const {userName, gettingUserName} = this.state;
        if(!gettingUserName){
        return(         
            <div>
                <Navbar />
                <Container>
                    <Row>
                        <Col>
                            <Paper elevation={3} style={styles.profile}>
                                <Container>
                                    <Row>
                                        <Col xs="auto">
                                            <ProfilePicture user={userName} />
                                        </Col>
                                        <Col>
                                        <Container>
                                            <Row>
                                                <Col xs="auto">
                                                    <h1> {userName} </h1>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="auto">
                                                    <Coins user={userName}/> 
                                                </Col>
                                            </Row>
                                        </Container>
                                        </Col>
                                    </Row>
                                </Container>
                            </Paper>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <Paper elevation={3} style={styles.stats}>
                            <Graphs user={userName} />
                        </Paper>
                        </Col>
                    </Row>
                </Container>
                
                
            </div>   
        );
        }return null;
    }
}

const styles = {
    profile: {
        padding: '15px',
        marginTop: '15px',
        marginBottom: '15px'
    },
    stats: {
        padding: '15px'
    }
}