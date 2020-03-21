import React, {Component} from 'react';
import Chart from 'chart.js';

export class WinLossChart extends Component{
    chartRef = React.createRef();

    constructor(props){
        super(props);
        this.state = {
            username: "testUser",
        }
    }

    componentDidMount(){
        const myChartRef = this.chartRef.current.getContext("2d"); 

        fetch("http://localhost:9000/analytics/getBettingHistory", {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username": this.state.username
            })
        }).then(response => response.json()).then((response) => {
            if (response) {
                if (response.status === "success") {
                    // draw the win loss chart
                    let winLosses = [];
                    let colorArr = [];
                    let dates = []
                    for (var bet of response.body) {
                        if (winLosses.length == 0) {
                            winLosses[0] = bet.profitOrLoss
                            if (bet.profitOrLoss > 0) {
                                console.log(`blue`);
                                colorArr[0] = 'rgb(0, 0, 255)';
                            }else {
                                console.log(`red`);
                                colorArr[0] = 'rgb(219, 46, 46)';
                            }
                        }else {
                            winLosses.push(bet.profitOrLoss)
                            if (bet.profitOrLoss > 0) {
                                console.log(`blue`);
                                colorArr.push('rgb(0, 0, 255)');
                            } else {
                                console.log(`red`);
                                colorArr.push('rgb(219, 46, 46)');
                            }
                        }
                    }
                    console.log(colorArr);
                    console.log(winLosses);
                    // get history of bets            
                    new Chart(myChartRef, {
                        type: 'bar',
                        data: {
                            labels: dates,
                            datasets: [{
                                fill: 'origin',
                                label: ['Win and Losses'],
                                data: winLosses,
                                backgroundColor: colorArr
                            }, ]
                        },
                        options: {
                            plugins: {
                                filler: {
                                    propagate: true
                                }
                            }
                        }
                    });
                }else {
                    console.log("Error getting bet history")
                }
            }
        });
    }

    render(){
        return (
            <div>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        );
    }
}