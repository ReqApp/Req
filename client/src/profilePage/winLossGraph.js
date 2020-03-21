import React, {Component} from 'react';
import Chart from "chart.js";

export class WinLossGraph extends Component{
    chartRef = React.createRef();     
    
    componentDidMount(){
        const myChartRef = this.chartRef.current.getContext("2d"); 

        fetch("http://localhost:9000/analytics/getWinLoss", {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username": "IamCathal"
            })
        }).then(response => response.json()).then((response) => {
            if (response) {
                let wins = response.body.wins;
                let losses = response.body.losses;

                if (response.body.wins == 0 && response.body.losses == 0) {
                    // draw empty chart
                    new Chart(myChartRef, {
                        type: 'pie',
                        data: {
                        labels: ["No bets yet"],
                        datasets: [{
                            label: 'Wins vs Losses',
                            backgroundColor: 'rgb(110, 109, 109)',
                            data: [1]
                        }]
                    },

                    // Configuration options go here
                    options: {
                        cutoutPercentage: 50
                    }
                });
            } else {
                // we got data, draw a proper graph
                new Chart(myChartRef, {
                    type: 'pie',
                    data: {
                        labels: ['Win', 'Loss'],
                        datasets: [{
                            label: 'Wins vs Losses',
                            backgroundColor: ['rgb(0, 0, 255)', 'rgb(212, 53, 53)'],
                            data: [wins, losses]
                        }]
                    },
                    options: {
                        cutoutPercentage: 50
                    }
                });
            }
        }
    })}

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