// React
import React, { Component } from 'react'
// Material
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
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
        return `Deadline: ${dateString} @ ${timeString}`;
    }

    render() {
        const {bet} = this.props;
        let winners = null;

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
                <Row>
                    <Col>
                        <h3>Title: {bet.title}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Typography>
                        Finished: {this.generateDeadline(bet.deadline)}
                    </Typography>
                    </Col>
                </Row>
            </div>
        )
    }
}


