// React
import React, { Component } from 'react'
// Rechart
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

export default class WinLossBars extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graphData: [],
            dataRetrieved: false,
            errorMsg: 'Fetching Data'
        };
    }

    componentDidMount() {
        let targetUser =  window.location.href.split("?")[1];
        fetch("http://localhost:9000/analytics/getBettingHistory", {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username": targetUser
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if(res.status === 'success'){
                this.parseData(res.body);
            }else{
                console.log(res);
                if(res.body === 'No bets found'){
                    this.setState({errorMsg : 'Found no betting history'});
                }
                else if(res.body === 'Invalid username'){
                    this.setState({errorMsg : 'User not found'});
                }
                else{
                    this.setState({errorMsg : 'Could not retrieve data'});
                }
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({errorMsg : 'Could not retrieve data'});
        }); 
    }

    parseData = (data) => {
        data = data.sort((a, b) => (a.date > b.date) ? 1 : -1);
        let tempGraphData = [];
        data.forEach(bet => {
            let dataPoint = {};
            // Extract and format date information
            let betDate = new Date(bet.date * 1000);
            let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}`;
            dataPoint.name = dateString;
            // Extract and format win/loss data
            dataPoint.uv = bet.profitOrLoss;
            tempGraphData.push(dataPoint);
        });
        this.setState({graphData : tempGraphData, dataRetrieved : true});
    }

    render() {
        const {dataRetrieved, graphData} = this.state;
        if(dataRetrieved){
            return(
                <LineChart width={600} height={300} data={graphData}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis />
            </LineChart>
            )
        }
        return null;
    }
}