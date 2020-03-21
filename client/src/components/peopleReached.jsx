
// React
import React, { Component } from 'react'

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
        let targetUser = window.location.href.split("?")[1];
        fetch("http://localhost:9000/analytics/getPeopleReached", {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username" : targetUser
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
                <div>
                    <h6>Bet's made: {betsMade}</h6>
                    <br />
                    <h6>People reached: {peopleReached}</h6>
                </div>
            )
        }
        return null;
    }
}