import React, { Component } from 'react'
import Chart from "chart.js";

export default class WinLossBars extends Component {
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

            let winLosses = [];
            let colorArr = [];
            let dates = [];
            let i = 0;

            res.body.forEach(bet => {
                if (i == 0) {
                    let betDate = new Date(bet.date * 1000);
                    let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}`;
                    dates[0] = dateString;
                    i++;
                } else {
                    let betDate = new Date(bet.date * 1000);
                    let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}`;
                    dates[i] = dateString;
                    i++;
                }
            });

            res.body.forEach(bet => {
                if (winLosses.length == 0) {
                    winLosses[0] = bet.profitOrLoss
                    if (bet.profitOrLoss > 0) {
                        console.log(`green`);
                        colorArr[0] = 'rgb(81, 224, 49)';
                    } else {
                        console.log(`red`);
                        colorArr[0] = 'rgb(219, 46, 46)';
                    }
                } else {
                    winLosses.push(bet.profitOrLoss)
                    if (bet.profitOrLoss > 0) {
                        console.log(`green`);
                        colorArr.push('rgb(81, 224, 49)');
                    } else {
                        console.log(`red`);
                        colorArr.push('rgb(219, 46, 46)');
                    }
                }
            });
            console.log(colorArr);
            console.log(winLosses);
            const myChartRef = this.chartRef.current.getContext("2d");
        
                new Chart(myChartRef, {
                    type: "line",
                    data: {
                        //Bring in data
                        labels: dates,
                        datasets: [
                            {
                                label: "Wins vs Losses",
                                fill: 'origin',
                                backgroundColor: colorArr,
                                data: winLosses
                            }
                        ]
                    },
                    options: {
                        plugins: {
                            filler: {
                                propagate: true
                            }
                        }
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