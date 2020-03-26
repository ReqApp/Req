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
import CurrentBets from '../components/currentBets';
import FindBets from '../components/findBets';

export class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          loggedIn: false
        }
    }

    componentDidMount(){
        fetch('http://localhost:9000/users/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_name : process.env.REACT_APP_TEST_USER_NAME,
            password : process.env.REACT_APP_TEST_USER_PASS
          })
        })
        .then((res) => res.json())
        .then((res) => {
          if(res.status === "success"){
            console.log(res.body);
            this.setState({loggedIn : true});
          }
          else if(res.status === 'error' && res.body === 'Email or password invalid'){
            console.log(res.body);
            
          }
          else if(res.status === 'error' && res.body === 'Username not found'){
            console.log(res.body);
          }
          else{
            console.log(res.body);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

    render(){
      const { loggedIn } = this.state;
      if(loggedIn){
        return(
            <div>
                <Navbar />
                <Container style={styles.mainContainer}>
                    <Paper style={styles.title}>
                            <Row style={styles.row}>
                                <Col xs={12}>
                                <h1>Betting Dashboard</h1>
                                </Col>
                            </Row>
                            <Row style={styles.row}>
                                <Col xs={12} md={6} style={styles.col}>
                                    <h2>Your Current Bets:</h2>
                                    <CurrentBets />
                                </Col>
                                <Col xs={12} md={6}>
                                    <h2>New Bets:</h2>
                                    <FindBets />
                                </Col>
                            </Row>
                    </Paper>
                </Container>
            </div>
        )
      }else{
        return null;
      }
    } 
}

const styles = {
    title: {
        marginTop: '15px',
        padding: '15px'
    },
    mainContainer: {
      width: '90%',
      maxWidth: '90%',
    },
}