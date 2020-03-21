// React
import React from 'react';
// Material
import Typography from "@material-ui/core/Typography";
import { Avatar } from '@material-ui/core';
import {Button} from '@material-ui/core';
// Bootstrap
import {Container, Row, Col} from 'react-bootstrap';
// Components
import Graphs from '../components/dataGraphs';
//Other
import openSocket from 'socket.io-client';


export class Profile extends React.Component{    
    constructor(props){
        super(props);
        this.state = {
            userName: "DEFAULT USER",
            click: false,
            imgSrc: null
        }
        this.socket = openSocket('http://localhost:9000');
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
        const {imgSrc, click} = this.state;
        return(            
            <Graphs />
        );
    }
}