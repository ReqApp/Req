import React from 'react';
import Button from '@material-ui/core/Button';
import openSocket from 'socket.io-client';

class ExampleBet extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            hasQR : false,
            imgSrc : null
        }
        this.handleGetQR = this.handleGetQR.bind(this);
        this.getLink = this.getLink.bind(this);
        // TODO change hardcoded localhost
        this.socket = openSocket('http://localhost:9000');
    }

    handleGetQR(){
        let src = 'https://api.qrserver.com/v1/create-qr-code/?size=265x265&qzone=0&margin=0&data=' + window.location.href;
        this.setState({imgSrc : src, hasQR : true});
        this.getLink();
    }

    getLink(){
        let url = window.location.href;
        if(url.includes('localhost')){
            this.socket.emit('servedQR', "https://goolnk.com/BZY3XX");
        }else{
            fetch('https://goolnk.com/api/v1/shorten', {
                method: 'POST',
                body: 'url=' + url
            }).then((res) => {
                console.log("Emit sent");
                this.socket.emit('servedQR', res);
            }, (err) => {
                console.log(err);
            });
        }
    }

    render(){
        const {imgSrc, hasQR} = this.state
        if(!hasQR){
            return(
            <Button onClick={this.handleGetQR}>Get QR</Button>
            )
        }else{
            return(
                <div>
                    <img src={imgSrc}></img>
                    <br />
                    <a href="https://goolnk.com/BZY3XX">https://goolnk.com/BZY3XX</a>
                </div>
            )
        }
    }
}

export default ExampleBet;