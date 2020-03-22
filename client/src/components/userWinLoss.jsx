import React, { Component } from 'react'
import { PieChart, Pie , Cell } from 'recharts';

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
                console.log(res.body);
                let tempData = [];
                // Temp data set    
                tempData.push({name : 'Losses', value: 1});
                //tempData.push({name : 'Losses', value: res.body.losses});
                tempData.push({name : 'Wins', value : res.body.wins});
                this.setState({graphData : tempData, retrievedData : true});
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
        const COLORS = ['#0088FE', '#00C49F'];
        if(retrievedData){
            return (
                <div>
                    <h6>User Win/Loss:</h6>
                    <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                        <Pie
                        data={graphData} 
                        cx={120} 
                        cy={200} 
                        innerRadius={60}
                        outerRadius={80} 
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                        label
                        >
                        {
                            graphData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                        }
                        </Pie>
                    </PieChart>
                </div>
            )
        };
        return null;
    }
}