// React
import React, { Component } from 'react'
// Bootstrap
import {Container, Row, Col} from 'react-bootstrap';
// Material
import Typography from "@material-ui/core/Typography";
import { Avatar, StylesProvider } from '@material-ui/core';
import {Button} from '@material-ui/core';
import {Paper} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import PeopleIcon from '@material-ui/icons/People';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PersonIcon from '@material-ui/icons/Person';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import ListSubheader from '@material-ui/core/ListSubheader';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';

export default class betCard extends Component {
    constructor(props){
        super(props);
        
    }

    renderMulti = () => {
        const {data} = this.props;
        let betDate = new Date(data.deadline * 1000);
        let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}/${betDate.getFullYear()}`;
        let timeString = `${betDate.getHours()}:${betDate.getMinutes()}`;
        return (
                <Paper style={styles.card}>
                    <h3>{data.title}</h3>
                    <div>
                        <Row>
                            <Col>
                            <List component="nav">
                            <ListSubheader component="div">
                                Details:
                            </ListSubheader>
                                <ListItem>
                                    <ListItemIcon>
                                        <HourglassEmptyIcon />
                                    </ListItemIcon>
                                    <ListItemText>Deadline: {dateString} @ {timeString}</ListItemText>
                                </ListItem>
                                <ListItem>
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText>Participants: {data.numberOfBettors}</ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MonetizationOnIcon />
                                    </ListItemIcon>
                                    <Input
                                        label="With normal TextField"
                                        style={styles.input}
                                        id="standard-adornment-weight"
                                        endAdornment={<InputAdornment position="end">Coins</InputAdornment>}
                                        aria-describedby="standard-weight-helper-text"
                                    />
                                </ListItem>
                            </List>
                            </Col>
                            <Col>
                            <List component="nav">
                                <ListSubheader component="div">
                                    Winnings:
                                </ListSubheader>
                                <ListItem>
                                    <ListItemText>First Place Cut: {data.firstPlaceCut * 100}%</ListItemText>
                                </ListItem>
                                <ListItem>
                                <ListItemText>Second Place Cut: {data.secondPlaceCut * 100}%</ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>Third Place Cut: {data.thirdPlaceCut * 100}%</ListItemText>
                                </ListItem>
                            </List>

                            </Col>
                        </Row>
                    </div>
                </Paper>
        )
    }

    renderBinary = () => {

    }

    render() {
        const {data} = this.props;
        let display = null;
        if(data.type === 'multi'){
            display = this.renderMulti();
        }else{
            return <h1>test</h1>;
        }
        return display;
    }
}

const styles = {
    card: {
        padding: '15px'
    },
    col: {
        borderLeft: 'solid'
    },
    btn: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    input: {
        maxWidth: '150px'
    }
}
