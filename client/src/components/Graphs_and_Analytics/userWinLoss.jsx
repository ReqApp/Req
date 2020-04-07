import React, { Component } from 'react'
import { PieChart, Pie , Cell } from 'recharts';
// Bootstrap
import {Row, Col} from 'react-bootstrap';
import {Paper} from '@material-ui/core';


export default class UserWinLoss extends Component {
    constructor(props) {
        super(props)
        this.state = {
            retrievedData: false,
            graphData: [],
            errorMsg: 'Fetching Data',
            losses: 0,
            wins: 0
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
                //tempData.push({name : 'Losses', value: 1});
                tempData.push({name : 'Losses', value: res.body.losses});
                tempData.push({name : 'Wins', value : res.body.wins});
                this.setState({graphData : tempData, retrievedData : true, losses : res.body.losses, wins : res.body.wins});
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
        const {graphData, retrievedData, losses, wins} = this.state;
        const COLORS = ['#F44434', '#4CAC54'];
        if(retrievedData){
            return (
                <div>
                <Paper elevation={3} style={styles.card}>
                    <div>
                        <Row>
                            <Col>
                                <h3>Win vs Loss:</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <PieChart width={210} height={225} onMouseEnter={this.onPieEnter}>
                                <Pie
                                data={graphData} 
                                cx={110} 
                                cy={110} 
                                innerRadius={40}
                                outerRadius={70} 
                                fill="#e0240b"
                                paddingAngle={0}
                                dataKey="value"
                                >
                                {
                                    graphData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                                }
                                </Pie>
                            </PieChart>
                            </Col>
                            <Col>
                                <Row>
                                    <Col style={{paddingTop : '60px'}}>
                                        <h4 style={{color : '#4CAC54'}}>Wins: {wins}</h4>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{paddingTop : '30px'}}>
                                        <h4 style={{color : '#F44434'}}>Losses: {losses}</h4>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        </div>
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