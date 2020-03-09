import React, {Component} from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import {Spacing} from '../spacing';
import Typography from "@material-ui/core/Typography";
import { Container } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import {Button} from '@material-ui/core';
//import pic1 from '../images/profile-pic-1.png';
import pic from '../images/profile-pic-2.png';
import Flexbox from 'flexbox-react';
import openSocket from 'socket.io-client';


export class Profile extends React.Component{    
    constructor(props){
        super(props);
        this.state = {
            userName: "DEFAULT USER",
            click: false,
            imgSrc: null
        }
        this.handleClick = this.handleClick.bind(this);
        this.getLink = this.getLink.bind(this);
        this.socket = openSocket('http://localhost:9000');
    }
    
    handleClick(){
        const holder = this.state.click == false ? true : false;
        let src = 'https://api.qrserver.com/v1/create-qr-code/?size=265x265&qzone=0&margin=0&data=' + window.location.href;
        this.setState({click: holder, imgSrc: src});
        this.getLink();
    }

    getLink(){
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
        const {imgSrc, click} = this.state;
        return(            
        <div>
            <Header/>
            <Spacing/>
            <Container maxWidth = 'md'>
            <Typography component="div" style={{ backgroundColor: "#28AE60", height: "100vh" }}>
                <Flexbox flexDirection="column" minHeight="100vh">
                    <Flexbox  height="60px" justifyContent = 'center'>
                        <Avatar alt="Remy Sharp" variant="square" src={pic}/>
                    </Flexbox>
                    <Flexbox flexGrow={1} justifyContent = 'center'>
                        <Typography variant="h3">
                            {this.state.userName}
                        </Typography>                        
                    </Flexbox>
                    <Flexbox justifyContent = 'center' alignItems = 'baseline'>
                        <Button onClick = {this.handleClick}>Share User</Button>                                               
                    </Flexbox>
                    <Flexbox justifyContent = 'center' alignItems = 'baseline'>
                        <div>
                            { this.state.click == false ? <br/> : 
                                <div>
                                    <img src={imgSrc}></img><br />
                                     <a href="https://goolnk.com/BZY3XX">https://goolnk.com/BZY3XX</a>
                                 </div>
                            }
                        </div>
                    </Flexbox>
                    <Flexbox flexGrow={2} justifyContent="center">
                        <Flexbox flexGrow={3}>number of created bets</Flexbox>
                        <Flexbox flexGrow={3}>user reach</Flexbox>
                        <Flexbox flexGrow={4}>graph</Flexbox>
                        <Flexbox flexGrow={4}>rating???</Flexbox>
                    </Flexbox>
                    <Flexbox flexGrow={3} justifyContent="center">
                        <Flexbox flexGrow={3}>win v loss</Flexbox>
                        <Flexbox flexGrow={3}>best win(price)</Flexbox>
                        <Flexbox flexGrow={4}>List of bet titles</Flexbox>
                        <Flexbox flexGrow={4}>graph user activity</Flexbox>
                    </Flexbox>
                 </Flexbox>
                </Typography>
            </Container>
            <Footer/>
        </div>
        );
    }
}