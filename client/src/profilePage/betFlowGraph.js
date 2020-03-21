import React, {Component} from 'react';
import Chart from 'chart.js';

export class BetFlowGraph extends Component{
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
                    response.body = response.body.sort((a, b) => (a.date > b.date) ? 1 : -1);
                    let currentStatus = []
                    let dates = []
                    let i = 0;
                    console.log(response.body);
                    for (var bet of response.body) {
                        if (currentStatus.length == 0) {
                            currentStatus[0] = bet.profitOrLoss
                            let betDate = new Date(bet.date * 1000);
                            let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}`;
                            dates[0] = dateString;
                            i++;
                        }else{
                        currentStatus[i] = currentStatus[i - 1] + bet.profitOrLoss;
                        // console.log(`${i} - status[${currentStatus[i]}] = ${currentStatus[i-1]} + ${bet.profitOrLoss}]`);
                        let betDate = new Date(bet.date * 1000);
                        let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}`;
                        dates[i] = dateString;
                        i++;
                        }
                    }
                    // get history of bets
                    new Chart(myChartRef, {
                        type: 'line',
                        data: {
                            labels: dates,
                            datasets: [{
                                fill: 'origin',
                                label: ['Wins and Losses'],
                                data: currentStatus,
                                backgroundColor: 'rgb(0, 0, 255)'
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
                } else {
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
        )
    }
}