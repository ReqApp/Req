import React, {Component} from 'react';
import Chart from 'chart.js';

export class BetReach extends Component{
    constructor(props){
        super(props);
        this.state = {
            betsMade: 0,
            peopleReached: 0,
            userName: "Req"
        }
    }
    
    componentDidMount(){
        let bM = 0;
        let pR = 0;
        
        fetch("http://localhost:9000/analytics/getpeopleReached", {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username": this.state.userName
            })
        }).then(response => response.json()).then((response) => {
            if (response) {
                bM = response.body.betsMade;
                pR = response.body.peopleReached;
                this.setState({betsMade: bM, peopleReached: pR});
            }
        })
    }

    render(){
        return(
            <div>
                <br/>
                <br/>
                <p>Bets made: {this.state.betsMade}
                    <br/>
                    <br/>
                    People Reached: {this.state.peopleReached}
                </p>
            </div>
        );
    }
}