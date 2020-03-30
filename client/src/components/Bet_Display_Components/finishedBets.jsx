import React, { Component } from 'react'
// Components
import FinishedBetCard from './finishedBetCard';

export default class FinishedBets extends Component {

    constructor(props){
        super(props);
        this.state = {
            loadingBets : true,
            bets : []
        }
    }

    componentDidMount() {
        fetch('http://localhost:9000/getFinishedBets', {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(res => {
            if(res.status === 'success'){
                this.setState({loadingBets : false, bets : res.body});
            }
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

