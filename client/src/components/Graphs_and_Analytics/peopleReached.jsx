
// React
import React, { Component } from 'react'

import {Paper} from '@material-ui/core';


export default class PeopleReached extends Component {
    constructor(props) {
        super(props)
        this.state = {
            betsMade: 0,
            peopleReached: 0,
            dataRetrieved: false,
            errorMsg: 'Fetching data'
        };
    }

    componentDidMount() {
        const {user} = this.props;
        fetch("http://localhost:9000/analytics/getPeopleReached", {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username" : user
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.status === "success") {
                this.setState({betsMade : res.body.betsMade, peopleReached : res.body.peopleReached, dataRetrieved: true});
            }
            else if(res.body === 'Invalid username'){
                this.setState({errorMsg : 'User not found'});
            }
            else {
                console.log(res);
                this.setState({errorMsg : 'Could not retrieve data'});
            }
        })
        .catch((err) => {
            console.log(err);
            this.setState({errorMsg : 'Could not retrieve data'});
        });
    }

    render() {
        const {betsMade, peopleReached, dataRetrieved} = this.state;
        if(dataRetrieved){
            return (
                    <Paper elevation={3} style={styles.card}>

                    <h4 style={{padding:'2px 2px 0px 2px'}}>Bets made:</h4>
                    <h1 style={{padding:'0px',  fontWeight:'bold'}}>{betsMade}</h1>

                    <h4>People reached:</h4>
                    <h1  style={{padding:'0px', fontWeight:'bold'}}>{peopleReached}</h1>
                    </Paper>
                
            )
        }
        return null;
    }
}


const styles = {
    card: {
        textAlign: 'center',
        padding: '10px',
        borderRadius: '6px',
        height: '93%',
        marginBottom: '15px',
    }
}