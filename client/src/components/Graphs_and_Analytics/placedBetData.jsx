// React
import React, { Component } from 'react'

import {Paper} from '@material-ui/core';

// Rechart
import { CartesianGrid, XAxis, YAxis, AreaChart, Area, Tooltip} from 'recharts';

export default class PlacedBetData extends Component {
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
            this.parseData(res.body);
        })
        .catch(err => {
            console.log(err);
        }); 
    }

    parseData = (data) => {
        if (!(data === 'No bets found')) {
            data = data.sort((a, b) => (a.date > b.date) ? 1 : -1);
            let tempGraphData = [];
            let total = 0;
            data.forEach(bet => {
                let dataPoint = {};
                console.log(`overall bet ${JSON.stringify(bet)}`)
                // Extract and format date information
                let betDate = new Date(bet.date * 1000);
                let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}`;
                dataPoint.date = dateString;
                // Extract and format win/loss data
                total += bet.profitOrLoss;
                dataPoint.Profit = total;
                tempGraphData.push(dataPoint);
            });
    
            this.setState({graphData : tempGraphData, dataRetrieved : true});
        } else {
            this.setState({dataRetrieved : true});

        }
    }

    render() {
        const {dataRetrieved, graphData} = this.state;
        if(dataRetrieved){
            return(
                <div>
                    <Paper elevation={3} style={styles.card}>
                    <h6 style={{textAlign:'center'}}>Overall bet average</h6>
                    <AreaChart width={420} height={240} data={graphData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="Profit" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                    </Paper>
                </div>
            )
        }
        return null;
    }
}

const styles = {
    card: {
        textAlign: 'center',
        padding: '4px',
        marginBottom: '60px',
        borderRadius: '6px'
    }
}