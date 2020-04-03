// React
import React from 'react';
// Material
import {Paper} from '@material-ui/core';
// Bootstrap
import {Container, Row, Col} from 'react-bootstrap';
// Components
import Navbar from '../components/Page_Components/navbar';
import Graphs from '../components/Graphs_and_Analytics/dataGraphs';
import ProfilePicture from '../components/Page_Components/profilePicture';
import Coins from '../components/Graphs_and_Analytics/coins';
import OverrallEarnings from '../components/Graphs_and_Analytics/overrallEarnings';
//Other
import openSocket from 'socket.io-client';
import ReqBackground from '../images/reqBackground4.jpg'


import SimplePopover from '../components/Miscellaneous/QRPopover';

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
        this.setState({userName : unescape(targetUser), gettingUserName : false});
    }
    
    handleClick = () => {
        const holder = this.state.click === false ? true : false;
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
            <div style={styles.backing}>
                <Navbar />
                <Container>
                <div style={styles.container}>
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
                                            <Row>
                                                <Col xs="auto">
                                                <OverrallEarnings user={userName} />
                                                <SimplePopover/>
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
                </div>
                </Container>
            </div>   
        );
        }return null;
    }
}

const styles = {
    profile: {
        textAlign: 'center',
        padding: '25px',
        marginBottom: '20px'
    },
    backing: {
        backgroundImage:`url(${ReqBackground})`,
        backgroundPosition: 'center',
        height:'100%'
    },
    stats: {
        padding: '15px'
    },
    container: {
        width: '90%',
        marginLeft: '10px',
        marginRight: '10px',
        maxWidth: '100%'
    }
}