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
import PeopleReached from '../components/Graphs_and_Analytics/peopleReached';
//Other
import openSocket from 'socket.io-client';

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
        this.socket = openSocket('http://ec2-107-23-251-248.compute-1.amazonaws.com:9000');
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
        if(url.includes('ec2-107-23-251-248.compute-1.amazonaws.com')){
            this.socket.emit('servedQR', "https://goolnk.com/BZY3XX");
        }else{
            // TODO change before deploying to AWS
            fetch('http://ec2-107-23-251-248.compute-1.amazonaws.com:9000/shortenLink', {
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
                        <Col md={9}>
                            <Paper elevation={3} style={styles.profile}>
                                    <Row>
                                        <Col xs="auto">
                                            <Paper>
                                                <ProfilePicture user={userName} />
                                            </Paper>
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
                                                <Col xs="auto">
                                                <OverrallEarnings user={userName} />
                                                <SimplePopover/>
                                                </Col>
                                            </Row>
                                        </Container>
                                        </Col>
                                    </Row>
                            </Paper>
                        </Col>
                        <Col md={3}>
                            <PeopleReached user={userName} />
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{padding: '0px'}}>
                            <Graphs user={userName} />
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
        borderRadius: '6px',
        textAlign: 'center',
        padding: '15px',
        marginBottom: '15px'
    },
    backing: {
        //backgroundImage:`url(${ReqBackground})`,
        //backgroundPosition: 'center',
        backgroundImage: 'linear-gradient(to top, #808387, #ffffff)',
        height:'100%'
    },
    stats: {
        marginTop: '15px',
        padding: '15px'
    },
    container: {
        marginTop: '20px',
        width: '90%',
        marginLeft: '10px',
        marginRight: '10px',
        maxWidth: '100%'
    }
}