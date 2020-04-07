
// React
import React, { Component } from 'react'

import Countup from 'react-countup';


export default class OverrallEarnings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            overrallEarningsVal: 0,
            dataRetrieved: false,
            errorMsg: 'Fetching data'
        };
    }

    componentDidMount() {
        const {user} = this.props;
        fetch("http://localhost:9000/analytics/getBettingHistory", {
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
                this.parseData(res.body);
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

    parseData = (data) => {
        let total = 0;

        if (!(data === 'No bets found')) {
            data.forEach(bet => {
                total += bet.profitOrLoss;
            });
            this.setState({overrallEarningsVal: total, dataRetrieved: true});
        } else {
            this.setState({overrallEarningsVal: 0, dataRetrieved: true});
        }
    }

    render() {
        const {overrallEarningsVal, dataRetrieved} = this.state;
        if(dataRetrieved){
            return (
                <div>
                        <h2>
                            <Countup end={overrallEarningsVal} 
                            style={{fontWeight:'bold', color: '#949494'}}
                            duration={3.6}
                            />
                        </h2>
                        <h6 style={{color: '#949494'}}> coins won</h6>
                </div>
                
            )
        }
        return null;
    }
}