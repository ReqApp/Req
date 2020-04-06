// React
import React, { Component } from 'react'
import {Redirect} from 'react-router-dom';
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
import Link from '@material-ui/core/Link';
// Bootstrap
import {Row, Col} from 'react-bootstrap';
import BetTypeSelection from '../Bet_Creation_Components/betTypeSelection';

export default class FinishedBetCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            navigateToProfile: false
        }
    }

    generateDeadline(date){
        let betDate = new Date(date * 1000);
        let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}/${betDate.getFullYear()}`;
        let timeString = `${betDate.getHours()}:${betDate.getMinutes()}`;
        return `${dateString} @ ${timeString}`;
    }

    handleGoToProfile = () => {
        this.setState({navigateToProfile : true});
    }

    render() {
        const {navigateToProfile} = this.state;
        const {bet, user} = this.props;
        let details = bet.details;
        let result = details.result;
        let payoutColour = 'black';
        if(details.type === 'binary'){
            if(details.result === 'no'){
                result = 'No';
            }else{
                result = 'Yes';
            }
        }
        if(parseInt(bet.profitOrLoss) < 0){
            payoutColour = '#F44434';
        }
        else if(parseInt(bet.profitOrLoss) > 0){
            payoutColour = '#4CAC54';
        }

        if(navigateToProfile){
            return(
                <Redirect to={`/users/profile?${bet.details.user_name}`} push/>
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
                                <Typography>Created by: <Link component="button" onClick={this.handleGoToProfile}>{user === details.user_name ? "You" : details.user_name}</Link></Typography>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Typography style={{marginTop: '5px'}}>Result: {result}</Typography>
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
                                            Your Payout: <span style={{color : payoutColour, fontWeight: 'bold'}}>{bet.profitOrLoss} coins</span>
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
        color: '#292b2c'
    }

}


