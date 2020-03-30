import React, { Component } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

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
        const COLORS = ['#e0240b', '#0cb009'];
        if(retrievedData){
            return (
                <div style={{margin:'10px', padding:'10px', backgroundColor:'#c5c9c9', borderRadius:'8px', textAlign:'center'}}>
                    <h4>Bet breakdown</h4>
                    <RadarChart cx={180} cy={160} outerRadius={120} width={360} height={255} data={graphData}>
                    <PolarGrid stroke="#525354"/>
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis/>
                    <Tooltip />
                    <Radar name={this.props.user} dataKey="val" stroke="#8884d8" fill="#6790db" fillOpacity={0.6}/>
                    </RadarChart>
                </div>
            )
        };
        return null;
    }
}