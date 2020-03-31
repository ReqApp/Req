import React, { Component } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

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
                console.log(res.body);
                let resArr = [];
                let tempData = {}
                tempData["multi"] = res.body.multi;

                tempData["binary"] = res.body.binary;
                tempData["location"] = res.body.location;
                console.log(`tempData = ${JSON.stringify(tempData)}`)

                resArr.push({"category":"Mutli", "val": tempData["multi"]});
                resArr.push({"category":"Binary", "val": tempData["binary"]});
                resArr.push({"category":"Location", "val": tempData["location"]});
                console.log(resArr)
                this.setState({graphData : resArr, retrievedData : true});
            } else {
                console.log("not success");
                console.log(res)
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

                    <h4>Bet breakdown</h4>
                    <RadarChart cx={180} cy={160} outerRadius={120} width={360} height={255} data={graphData}>
                    <PolarGrid stroke="#525354"/>
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis/>
                    <Tooltip />
                    <Radar name={this.props.user} dataKey="val" stroke="#8884d8" fill="#6790db" fillOpacity={0.6}/>
                    </RadarChart>
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