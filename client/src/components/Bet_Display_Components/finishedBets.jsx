// React
import React, { Component } from 'react';
// Material
import {Paper} from '@material-ui/core';
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
                this.setState({loadingBets : false, placedBets : res.body});
            }
            console.log(res);
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
                  this.setState({loadingBets : false, createdBets : res.body});
              }
              console.log(res);
          })
          .catch(err => {
              console.log(err);
          });
    }
    
    render() {
        const {placedBets, createdBets, loadingBets} = this.state;

        return (
            <div>
                <Paper style={styles.paper}>
                    <div>
                        <h2>Finished Bets:</h2>
                        {!loadingBets ? placedBets.map((bet, index) => <Row key={index}><Col><FinishedBetCard bet={bet} /></Col></Row>) : <div><CircularProgress style={styles.progess}/></div>}     
                    </div>
                </Paper>

            </div>
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
        marginRight: 'auto',
        marginLeft: 'auto',
        display: 'block',
    }
}

