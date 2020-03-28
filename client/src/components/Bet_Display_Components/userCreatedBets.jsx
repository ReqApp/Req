// React
import React, { Component } from 'react';
// Material
import {Paper} from '@material-ui/core';
// Components
import CurrentBetInfo from './currentBetInfo';

export class UserCreatedBets extends Component {
    constructor(props){
        super(props);
        this.state = {
            loadingBets : true,
            bets : [],
            errorMsg : 'Loading bets'
        }
    }

    componentDidMount() {
        fetch('http://localhost:9000/getUserCreatedBets', {
            method : 'POST',
            credentials : 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.status === 'success'){
                if(res.body.length){
                    console.log(res);
                    this.setState({loadingBets : false, bets : res.body});
                }else{
                    this.setState({errorMsg : 'You have not created any bets yet'});
                }
            }
            else{
                console.log(res);
                this.setState({errorMsg : 'Could not get bets'});
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({errorMsg : 'Could not get bets'});
        })
    }
    

    render() {
        const {bets, loadingBets} = this.state;
        
        if(!loadingBets){
            return (
                <div>
                    <Paper style={styles.paper}>
                        <h3>Bets Created By You</h3>
                        {bets.map((bet, index) => <CurrentBetInfo data={bet} key={index}/>)}
                    </Paper>
                    
                </div>
            )
        }else{
            return null;
        }
    }
}

const styles = {
    paper: {
        marginTop: '15px',
        padding: '15px'
    }
}

export default UserCreatedBets
