import React from 'react';
// Material
import {Paper} from '@material-ui/core';
// Bootstrap
import {Row, Col} from 'react-bootstrap';
// Components
import LocationBetCardInfo from './locationBetCardInfo';

// Render card for each bet in region
export default class LocationBetCards extends React.Component{
    render(){
        let {bets} = this.props;

        if(Array.isArray(bets) && bets.length){
            return (
                <div style={styles.cardArea}>
                    {bets.map((bet, index) => <Row key={index}><Col><LocationBetCardInfo data={bet} index={index} /></Col></Row>)}
                </div>
            )
        }else{
            return(
                <Paper style={{...styles.regionCards, ...styles.info}} elevation={3}>
                    <h3>Region does not contain any bets</h3>
                </Paper>
            )
        }
    }
}

const styles = {
    cardArea: {
        marginTop: '20px',
    },
    regionCards: {
        padding: '20px',
        marginTop: '20px'
        /*background: #FBF9F9 !important;*/
    }, 
    info: {
        textAlign: 'center'
    },
}