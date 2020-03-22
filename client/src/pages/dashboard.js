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

export class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {

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

    getData = () => {
        fetch('http://localhost:9000/getBetsForUser', {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then((res) => res.json())
        .then((res) => {
          if(res.status === "success"){
            console.log(res.body);
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
        return(
            <div>
                <Navbar />
                <Container>
                    <Paper style={styles.title}>
                        <Container>
                            <Row>
                                <Col>
                                <h1>Betting Dashboard</h1>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button onClick={this.getData}>Get Data test</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h2>Your Current Bets:</h2>
                                </Col>
                                <Col>
                                    <h2>New Bets:</h2>
                                </Col>
                            </Row>
                        </Container>
                    </Paper>
                </Container>
            </div>
        )
    }
}

const styles = {
    title: {
        marginTop: '15px',
        padding: '15px'
    }
}