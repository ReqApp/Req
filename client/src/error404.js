import React, {Component} from 'react';
import {Typography} from '@material-ui/core';
import pic404 from './images/404.png';
import {Container, Row, Col} from 'react-bootstrap';
import Navbar from './components/Page_Components/navbar';


export class Error404 extends Component{

    constructor(props){
        super(props);
        this.state = {
            messages: [
                <div><i>
                    "Space: the final frontier. These are the voyages of the starship Enterprise. 
                    Its five-year mission: to explore strange new worlds. 
                    To seek out new life and new civilizations. 
                    To boldly go where no man has gone before!"
                </i><br/><br/><b>
                    Mabye I should've taken that advice a little less seriously...
                </b></div>,
                <div><i>
                    This is not the webpage you are looking for :3
                </i><br/><br/><b>
                    This is not the webpage I am looking for :0
                </b></div>,
                <div><i>
                    This page can't be found, it died from Covid-19 <b>F</b>
                </i><br/><br/><b>
                    (*Cough Cough) Oh, how terrible! (*Cough Cough) Sorry for your loss!
                </b></div>,
                <div><i>
                    Nah, I dont wanna render this page, WAY above my pay-grade. Also idk where it is! >:-[
                </i><br/><br/><b>
                    Bruh!
                </b></div>
            ],
            displays: null
        }
    }

    rand=() => {
        let random = Math.floor(Math.random()*100);
        let toSelect;
        if(random >= 0 && random <= 24){
            toSelect = 0;
        }else if(random >= 25 && random <= 49){
            toSelect = 1;
        }else if(random >= 50 && random <= 74){
            toSelect = 2;
        }else if(random >= 75 && random <= 100){
            toSelect = 3;
        }
        this.setState({displays: this.state.messages[toSelect]});
    }

    componentWillMount(){
        this.rand();
    }
    
    render(){
        return (
            <div>
                <Navbar />

                <Container style={{paddingTop:'10vh', textAlign:'center'}}>
                <Row>                 
                    <Col> 
                        <Typography style={{justifyContent:'center'}}> 
                            <img src = {pic404} 
                            style={{marginBottom:'4vh'}}
                            alt="404"
                            />
                        </Typography>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Typography component="div">    
                            {this.state.displays}
                        </Typography>
                    </Col>
                </Row>  
                </Container>               
            </div>
        );
    }
}