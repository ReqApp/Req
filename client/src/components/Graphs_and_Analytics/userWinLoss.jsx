import React, { Component } from 'react'
import { PieChart, Pie , Cell } from 'recharts';

import {Paper} from '@material-ui/core';


export default class UserWinLoss extends Component {
    constructor(props) {
        super(props)
        this.state = {
            retrievedData: false,
            graphData: [],
            errorMsg: 'Fetching Data'
        };
    }

    componentDidMount() {
        const {user} = this.props;
        fetch("http://localhost:9000/analytics/getWinLoss", {
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
                let tempData = [];
                // Temp data set    
                tempData.push({name : 'Losses', value: 1});
                //tempData.push({name : 'Losses', value: res.body.losses});
                tempData.push({name : 'Wins', value : res.body.wins});
                this.setState({graphData : tempData, retrievedData : true});
            } else {
                this.setState({retrievedData: true})
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        const {graphData, retrievedData} = this.state;
        const COLORS = ['#e0240b', '#0cb009'];
        if(retrievedData){
            return (
                <div>
                <Paper elevation={3} style={styles.card}>

                    <h4>Win vs Loss</h4>
                    <PieChart width={210} height={255} onMouseEnter={this.onPieEnter}>
                        <Pie
                        data={graphData} 
                        cx={110} 
                        cy={110} 
                        innerRadius={40}
                        outerRadius={70} 
                        fill="#e0240b"
                        paddingAngle={0}
                        dataKey="value"
                        label
                        >
                        {
                            graphData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                        }
                        </Pie>
                    </PieChart>
                    </Paper>
                </div>
            )
        };
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