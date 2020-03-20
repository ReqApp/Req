import React, { Component } from 'react'
import Chart from "chart.js";

export default class WinLossOverall extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loadVals: true,
            wins: 12,
            losses: 4
        };
    }
    chartRef = React.createRef();

    loadData = () => {
        let targetUser =  window.location.href.split("?")[1]
       
        console.log("sending "+targetUser)
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
        }).then((res) => res.json())
        .then((res) => {
            if (res.status === "success") {
                res.body = res.body.sort((a, b) => (a.date > b.date) ? 1 : -1);
                let currentStatus = []
                let dates = []
                let i = 0;
                res.body.forEach(bet => {
                    if (currentStatus.length == 0) {
                        currentStatus[0] = bet.profitOrLoss
                        let betDate = new Date(bet.date * 1000);
                        let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}`;
                        dates[0] = dateString;
                        i++;
                    } else {
                        currentStatus[i] = currentStatus[i - 1] + bet.profitOrLoss;
                        // console.log(`${i} - status[${currentStatus[i]}] = ${currentStatus[i-1]} + ${bet.profitOrLoss}]`);
                        let betDate = new Date(bet.date * 1000);
                        let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}`;
                        dates[i] = dateString;
                        i++;
                    }
                });

                const myChartRef = this.chartRef.current.getContext("2d");
        
                new Chart(myChartRef, {
                    type: "bar",
                    data: {
                        //Bring in data
                        labels: dates,
                        datasets: [
                            {
                                label: "Wins vs Losses",
                                backgroundColor: ['rgb(81, 224, 49)', 'rgb(212, 53, 53)'],
                                data: currentStatus
                            }
                        ]
                    },
                    options: {
                        //Customize chart options
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

    componentDidMount() {
        this.loadData();
    }
    render() {
        return (
            <div onClick={this.loadData}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}