// React
import React, { Component } from 'react';
// Material
import {Paper, Typography} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
// Bootstrap
import {Row, Col} from 'react-bootstrap';
// Components
import FinishedBetCard from './finishedBetCard';

export default class FinishedBets extends Component {

    constructor(props){
        super(props);
        this.state = {
            loadingBets : true,
            placedBets : [],
            createdBets : []
        }
    }

    componentDidMount() {
        const {username} = this.props;
        // Retrieve bets that user has bet on previously
        fetch('http://localhost:9000/analytics/getBettingHistory', {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({
            "username" : username
          })
        })
        .then(res => res.json())
        .then(res => {
            if(res.status === 'success'){
                if(res.body !== 'No bets found'){
                    this.setState({loadingBets : false, placedBets : res.body});
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
        // Retrieve finished bets that user has created
        fetch('http://localhost:9000/analytics/getCreatedBettingHistory', {
            method: 'POST',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body : JSON.stringify({
              "username" : username
            })
          })
          .then(res => res.json())
          .then(res => {
            if(res.status === 'success'){
                if(res.body !== 'No bets found'){
                    this.setState({loadingBets : false, createdBets : res.body});
                }
            }
          })
          .catch(err => {
              console.log(err);
          });
    }
    
    render() {
        const {placedBets, createdBets, loadingBets} = this.state;
        const {username} = this.props;
        let bets = placedBets.concat(createdBets);

        if(!loadingBets){
            if(bets.length){
                return(
                    <Paper style={styles.paper}>
                        <h2>Finished Bets:</h2>
                        {bets.map((bet, index) => <Row key={index}><Col><FinishedBetCard bet={bet} user={username}/></Col></Row>)}
                    </Paper>
                )

            }else{
                return(
                    <Paper style={styles.paper}>
                        <h2>Finished Bets:</h2>
                        <div style={{textAlign: 'center'}}>
                            <h6 style={styles.text}>No Recently Finished Bets To Show</h6>
                        </div>
                    </Paper>
                )
            }
            
        }
        return(
            <Paper style={styles.paper}>
                <h2>Finished Bets:</h2>
                <div style={{textAlign: 'center'}}>
                    <CircularProgress style={styles.progress}/>
                    <Typography style={styles.text}>Loading Bets...</Typography>
                </div>
            </Paper>
        )
    }
}

const styles = {
    paper: {
        padding: '15px',
        marginTop: '15px'
    },
    progress: {
        marginTop: '30px',
        display: 'block',
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    text: {
        marginTop: '20px',
        marginBottom: '40px'
    }
}

