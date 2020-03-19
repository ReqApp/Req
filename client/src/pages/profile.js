import React, {Component} from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import {Spacing} from '../spacing';
import Typography from "@material-ui/core/Typography";
import { Container } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import {Button} from '@material-ui/core';
import pic from '../images/profile-pic-2.png';
import Flexbox from 'flexbox-react';
import openSocket from 'socket.io-client';
//import axios from 'axios';


export class Profile extends React.Component{ 
    //cookie content: Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJ0ZXN0VXNlciIsImlhdCI6MTU4NDQ1MDkxNiwiZXhwIjoxNTg0NzEwMTE2fQ.CzHuPeJ5KkeYD2Uf6xBiOmMa5hfLvZ723sHU6Aq6vbU
    constructor(props){
        super(props);
        const url = `http://localhost:9000`;
        this.state = {
            password: "gremlinsunderthebridge",
            user_name: "testUser",
            userName: "default user",
            click: false,
            imgSrc: null,
            loggingUser: true,
            gettingUser: true,
            serverURL: url,
            errors: {
                userNotRetrived: false,
                userNotLogedIn: true
            },
            profileData: {
                betWin: 23
            }
        }
        this.handleClick = this.handleClick.bind(this);
        this.login = this.login.bind(this);
        this.getUser = this.getUser.bind(this);
        this.getLink = this.getLink.bind(this);
        this.socket = openSocket(url);
    }   

    componentDidMount(){
        this.login();
    }

    handleClick(){
        const holder = this.state.click == false ? true : false;
        let src = 'https://api.qrserver.com/v1/create-qr-code/?size=265x265&qzone=0&margin=0&data=' + window.location.href;
        this.setState({click: holder, imgSrc: src});
        this.getLink();
    }

    login(){  
        //console.log("login called");         
        const {user_name, password} = this.state;
        fetch(this.state.serverURL + '/users/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_name : user_name,
            password : password
          })
        }).then((res) => res.json()).then((res) => {
          if(res.status === "success"){
            console.log(res.status);
            console.log(res.body)
            console.log()
            this.setState({/*user_name : "", password: "",*/ loggingUser: false ,errors: {userNotLogedIn: false}});
            //this.getUser();            
          }else{
            alert("Incorrect username or password");
          }
        }).catch(err => alert("Could not login"));
    }

    getUser(){
        console.log("getUser called");
        let {serverURL, errors } = this.state;
        this.setState({gettingUser : true});
        fetch(serverURL + '/users/profile', {
          method: 'GET',
          credentials : "same-origin"       
        }).then(res => res.text()).then(res => {
          errors.userNotRetrived = false;
          console.log(res);
          this.setState({userName : res, gettingUser: false, errors : errors});         
        }).catch(err => {
          errors.userNotRetrived = true;
          this.setState({errors : errors, gettingUser : false});    
        });
        
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
        if(this.state.errors.userNotRetrived == false && this.state.userName == "default user"){
            return<h1>Load Screen here</h1>;
        }else{
            console.log(this.state.user_name);
            console.log(this.state.password);
            return(            
             <div>
            <Header/>
            <Spacing/>
            <Container maxWidth = 'md'>
            <Typography component="div" style={{ backgroundColor: "#28AE60", height: "200vh" }}>
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
}