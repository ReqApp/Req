// React
import React, { Component } from 'react'

import {Paper} from '@material-ui/core';
// Rechart
import { BarChart, CartesianGrid, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer} from 'recharts';

export default class CreatedBetData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graphData: [],
            dataRetrieved: false,
            errorMsg: 'Fetching Data'
        };
    }

    componentDidMount() {
        const {user} = this.props;
        // Temp call just betting history as user has not created any bets yet
        fetch("http://localhost:9000/analytics/getBettingHistory", {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username": user
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
            dataPoint.date = dateString;
            // Extract and format win/loss data
            dataPoint.Profit = bet.profitOrLoss;
            tempGraphData.push(dataPoint);
        });
        this.setState({graphData : tempGraphData, dataRetrieved : true});
    }

    render() {
        const {dataRetrieved, graphData} = this.state;
        const COLORS = ['#e0240b', '#0cb009'];
        if(dataRetrieved){
            return(
                <div>
                     <Paper elevation={3} style={styles.card}>
                        <h3> Bet History:</h3>
                        <ResponsiveContainer width='100%' height={240}>
                        <BarChart data={graphData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Bar dataKey="Profit" fill="#19b2b5">
                            >
                            {
                                graphData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.Profit > 0 ? "#2ca02c":"#d62728"}/>
                                ))
                            }
                            </Bar>
                        </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </div>
            )
        }
        return null;
    }
}

const styles = {
    card: {
        padding: '15px',
        borderRadius: '6px',
        marginBottom: '15px'
    }
}