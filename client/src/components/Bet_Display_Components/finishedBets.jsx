// React
import React, { Component } from 'react';
// Material
import {Paper} from '@material-ui/core';
// Bootstrap
import {Row, Col} from 'react-bootstrap';
// Components
import FinishedBetCard from './finishedBetCard';

export default class FinishedBets extends Component {

    constructor(props){
        super(props);
        this.state = {
            loadingBets : true,
            bets : []
        }
    }

    componentDidMount() {
        fetch('http://localhost:9000/getFinishedBets', {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(res => {
            if(res.status === 'success'){
                this.setState({loadingBets : false, bets : res.body});
            }
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    render() {
        const {bets, loadingBets} = this.state;

        return (
            <div>
                <Paper style={styles.paper}>
                    <div>
                        <h2>Finished Bets:</h2>
                        {bets.map((bet, index) => <Row key={index}><Col><FinishedBetCard bet={bet} /></Col></Row>)}
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
    }
}

