import React from 'react';
// Material
import {Paper} from '@material-ui/core';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Render card for each bet in region
export default class LocationBetCards extends React.Component{
    render(){
        let {bets} = this.props;
        let betCards = [];

        if(Array.isArray(bets) && bets.length){
            for(let i = 0; i < bets.length; i++){
                let newBetCard = <Paper key={bets[i]._id} elevation={3} style={styles.regionCards}>
                    <h3>{bets[i].title}</h3>
                </Paper>
                betCards.push(newBetCard);
            }
            return(
                <div>{betCards}</div>
            )
        }else{
            return(
                <Paper style={styles.regionCards, styles.info} elevation={3}>
                    <h3>Region does not contain any bets</h3>
                </Paper>
            )
        }
    }
}

const styles = {
    regionCards: {
        padding: '20px',
        marginTop: '20px'
        /*background: #FBF9F9 !important;*/
    }, 
    info: {
        textAlign: 'center'
    },
}