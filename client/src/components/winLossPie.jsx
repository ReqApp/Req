import React, { Component } from 'react'
import Chart from "chart.js";

export default class WinLossPie extends Component {
    constructor(props) {
        super(props)
        this.state = {
            wins: 1,
            losses: 1
        };
    }
    chartRef = React.createRef();

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let targetUser = window.location.href.split("?")[1]
        console.log(targetUser);
        fetch("http://localhost:9000/analytics/getWinLoss", {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username":targetUser
            })
        }).then((res) => res.json())
        .then((res) => {
            if (res.status === "success") {
                if (res.body.wins == 0 && res.body.losses == 0) {
                    this.setState({wins:1, losses:1});
                } else {
                    this.setState({wins:res.body.wins, losses:res.body.losses});
                }
                
                console.log(this.state.wins, this.state.losses)
                const myChartRef = this.chartRef.current.getContext("2d");
        
        new Chart(myChartRef, {
            type: "pie",
            data: {
                //Bring in data
                labels: ["Wins","Losses"],
                datasets: [
                    {
                        label: "Wins vs Losses",
                        backgroundColor: ['rgb(81, 224, 49)', 'rgb(212, 53, 53)'],
                        data: [this.state.wins, this.state.losses],
                    }
                ]
            },
            options: {
                //Customize chart options
                cutoutPercentage: 50
            }
        });
            } else {
                console.log("not success");
                console.log(res)
            }
        }, (err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}