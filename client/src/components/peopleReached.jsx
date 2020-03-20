import React, { Component } from 'react'


export default class PeopleReached extends Component {
    constructor(props) {
        super(props)
        this.state = {
            betsMade: 0,
            peopleReached: 0
        };
    }
    chartRef = React.createRef();

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let targetUser = window.location.href.split("?")[1]
        console.log(targetUser);
        fetch("http://localhost:9000/analytics/getPeopleReached", {
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
                this.setState({betsMade:res.body.betsMade, peopleReached:res.body.peopleReached});
                console.log(this.state.betsMade, this.state.peopleReached)
              
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
                Bet's made: { this.state.betsMade}<br />People reached: {this.state.peopleReached}
            </div>
        )
    }
}