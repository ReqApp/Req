// React
import React, { Component } from 'react'
// Rechart
import { CartesianGrid, XAxis, YAxis, AreaChart, Area, Tooltip} from 'recharts';

export default class PlacedBetData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graphData: [],
            dataRetrieved: false,
            errorMsg: 'Fetching Data'
        };
    }

    componentDidMount() {
        let targetUser =  window.location.href.split("?")[1];
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
        })
        .then((res) => res.json())
        .then((res) => {
            if(res.status === 'success'){
                this.parseData(res.body);
            }else{
                console.log(res);
                if(res.body === 'No bets found'){
                    this.setState({errorMsg : 'Found no betting history'});
                }
                else if(res.body === 'Invalid username'){
                    this.setState({errorMsg : 'User not found'});
                }
                else{
                    this.setState({errorMsg : 'Could not retrieve data'});
                }
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({errorMsg : 'Could not retrieve data'});
        }); 
    }

    parseData = (data) => {
        data = data.sort((a, b) => (a.date > b.date) ? 1 : -1);
        let tempGraphData = [];
        data.forEach(bet => {
            let dataPoint = {};
            // Extract and format date information
            let betDate = new Date(bet.date * 1000);
            let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}`;
            dataPoint.date = dateString;
            // Extract and format win/loss data
            dataPoint.Profit = bet.profitOrLoss;
            tempGraphData.push(dataPoint);
        });
        // Sample data added
        tempGraphData.push({name : '18/3', Profit : 250});

        this.setState({graphData : tempGraphData, dataRetrieved : true});
    }

    render() {
        const {dataRetrieved, graphData} = this.state;
        if(dataRetrieved){
            return(
                <div>
                    <h6>Placed Bet Proft and Loss:</h6>
                    <AreaChart width={500} height={250} data={graphData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="Profit" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                </div>
            )
        }
        return null;
    }
}