import React, { Component } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer} from 'recharts';

import {Paper} from '@material-ui/core';


export default class betBreakdown extends Component {
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
        fetch("http://localhost:9000/analytics/getBreakdownOfBetTypes", {
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
                let resArr = [];
                let tempData = {}
                tempData["multi"] = res.body.multi;

                tempData["binary"] = res.body.binary;
                tempData["location"] = res.body.location;

                resArr.push({"category":"Mutli", "val": tempData["multi"]});
                resArr.push({"category":"Binary", "val": tempData["binary"]});
                resArr.push({"category":"Location", "val": tempData["location"]});
                this.setState({graphData : resArr, retrievedData : true});
            } else {
                console.log("not success");
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        const {graphData, retrievedData} = this.state;
        if(retrievedData){
            return (
                <div>
                <Paper elevation={3} style={styles.card}>
                    <h3>Bet Breakdown:</h3>
                    <ResponsiveContainer width='100%' height={225}>
                        <RadarChart data={graphData} style={{marginRight : 'auto', marginLeft : 'auto', display : 'block'}}>
                        <PolarGrid stroke="#525354"/>
                        <PolarAngleAxis dataKey="category" />
                        <Radar name={this.props.user} dataKey="val" stroke="#8884d8" fill="#6790db" fillOpacity={0.6}/>
                        </RadarChart>
                    </ResponsiveContainer>
                    </Paper>
                </div>
            )
        };
        return null;
    }
}

const styles = {
    card: {
        padding: '15px',
        borderRadius: '6px',
        marginBottom: '20px'
    }
}