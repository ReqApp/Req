
// React
import React, { Component } from 'react'

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
        data.forEach(bet => {
            total += bet.profitOrLoss;
        });
        console.log(`Toal is ${total}`)
        this.setState({overrallEarningsVal: total, dataRetrieved: true});
    }

    render() {
        const {overrallEarningsVal, dataRetrieved} = this.state;
        if(dataRetrieved){
            return (
                <div style={{ margin: '20px', padding:'10px', borderRadius:'8px', backgroundColor:'#c5c9c9', textAlign:'center'}}>
                    <h3> Overall earnings: </h3>
                    <h1> {overrallEarningsVal}</h1>
                </div>
                
            )
        }
        return null;
    }
}