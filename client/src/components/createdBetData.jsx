// React
import React, { Component } from 'react'
// Rechart
import { CartesianGrid, XAxis, YAxis, AreaChart, Area, Tooltip} from 'recharts';

export default class CreatedBetData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graphData: [],
            dataRetrieved: false,
            errorMsg: 'Fetching Data'
        };
    }

    componentDidMount() {
        const {user} = this.props;
        // Temp call just betting history as user has not created any bets yet
        fetch("http://localhost:9000/analytics/getBettingHistory", {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username": user
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
        this.setState({graphData : tempGraphData, dataRetrieved : true});
    }

    render() {
        const {dataRetrieved, graphData} = this.state;
        if(dataRetrieved){
            return(
                <div style={{ padding:'10px', borderRadius:'8px', backgroundColor:'#ddb1fc'}}>
                    <h6>Created Bet Proft and Loss:</h6>
                    <AreaChart width={470} height={230} data={graphData}
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
{/* <svg viewBox="-225 -50 1800 775" style={{ fill: 'none'}}> */}

{/* <g>
<path class="anim1" d="M264.84,672.23v-533H463.28a395.84,395.84,0,0,1,81.59,8.2q38.94,8.21,68.06,27.88t46.33,52.89q17.22,33.21,17.22,83.23,0,57.41-23.37,95.12a164.81,164.81,0,0,1-62.73,59L706,672.23H548.56L456.72,493.47H405.88V672.23ZM405.88,382h47.56q85.27,0,85.28-70.52,0-34.44-21.73-47.56t-63.55-13.12H405.88Z" transform="translate(-264.84 -139.23)"/>
<path class="anim2" d="M979.87,682.07q-48.39,0-90.61-14.35t-73-41.82q-30.75-27.46-48.38-67.65t-17.63-91q0-50,18-90.2t48-67.65a211.81,211.81,0,0,1,68.88-42.23,223.8,223.8,0,0,1,80-14.76q48.37,0,84.87,15.58t61.09,42.64a178.17,178.17,0,0,1,36.9,63.14q12.3,36.09,12.3,77.08a286.12,286.12,0,0,1-2.05,35.26q-2.06,16.41-3.69,23.78H891.31q9,34.44,36.08,50t72.16,15.58a187.72,187.72,0,0,0,48-6.15,319.52,319.52,0,0,0,50.43-18.45l45.92,83.64a285,285,0,0,1-81.18,35.67Q1018.41,682.06,979.87,682.07ZM970,359q-60.69,0-77.9,59h143.5Q1026.6,359,970,359Z" transform="translate(-264.84 -139.23)"/>
<path class="anim3" d="M1499.74,816.55V703.39l6.56-62.32H1503A141,141,0,0,1,1458.33,671a131.18,131.18,0,0,1-52.07,11.07q-38.55,0-70.11-14.76a147.64,147.64,0,0,1-53.71-42.64Q1260.3,596.81,1248,557t-12.3-89.79q0-50,14.76-90.2T1289,309.38a166.45,166.45,0,0,1,54.94-42.23q31.15-14.76,63.14-14.76,33.61,0,59.45,11.89t49.61,39h3.28l11.48-41h109.88V816.55ZM1444,567.27q17.22,0,30.75-6.15t25-23.37V386.87q-12.3-11.47-25.83-15.58a97.16,97.16,0,0,0-28.29-4.1q-26.25,0-45.92,22.14T1380,465.59q0,55.77,16.81,78.72T1444,567.27Z" transform="translate(-264.84 -139.23)"/>
</g> */}