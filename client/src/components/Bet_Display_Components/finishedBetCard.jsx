// React
import React, { Component } from 'react'
// Material
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import {Paper} from '@material-ui/core';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
// Bootstrap
import {Row, Col} from 'react-bootstrap';
import BetTypeSelection from '../Bet_Creation_Components/betTypeSelection';

export default class FinishedBetCard extends Component {
    constructor(props){
        super(props);
    }

    generateDeadline(date){
        let betDate = new Date(date * 1000);
        let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}/${betDate.getFullYear()}`;
        let timeString = `${betDate.getHours()}:${betDate.getMinutes()}`;
        return `${dateString} @ ${timeString}`;
    }

    calcPayout = (bet) => {
        // if(bet.type === 'multi'){
        //     let winner = false;
        //     bet.winners.forEach(winner => {
        //         if(winner.user_name === username){

        //         }
        //     })
        // }

        return '0';
    }

    render() {
        const {bet} = this.props;
        let details = bet.details;
        let payout = bet.profitOrLoss;
        let winners = null;

        console.log(bet);

        if(bet.type === 'multi'){
            winners = (
                <List>
                    <ListSubheader>Winners</ListSubheader>
                    <ListItem>
                        <ListItemText>
                            First Place: {bet.winners[0]}
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText>
                            Second Place: {bet.winners[1]}
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText>
                            Third Place: {bet.winners[2]}
                        </ListItemText>
                    </ListItem>
                </List>
            )
        }

        return (
            <div>
                <Paper style={styles.paper}>
                    <div>
                        <Row>
                            <Col>
                                <h3>{details.title}</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Typography>Result: {details.result}</Typography>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <List dense={false}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <HourglassEmptyIcon style={styles.icon}/>
                                        </ListItemIcon>
                                        <ListItemText>
                                            Finished: {this.generateDeadline(details.deadline)}
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <MonetizationOnIcon style={styles.icon}/>
                                        </ListItemIcon>
                                        <ListItemText>
                                            Your Payout: {bet.profitOrLoss}
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </Col>
                            <Col>
                            <Typography>
                                
                            </Typography>
                            </Col>

                        </Row>
                    </div>
                </Paper>
            </div>
        )
    }
}

const styles = {
    paper: {
        padding: '15px',
        marginTop: '15px'
    },
    icon: {
        color: '#008E9B'
    }
}


