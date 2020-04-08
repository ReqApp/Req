// React
import React, { Component } from 'react'
// Bootstrap
import {Row, Col} from 'react-bootstrap';
// Material
import {Button} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import ListSubheader from '@material-ui/core/ListSubheader';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import Snackbar from '@material-ui/core/Snackbar';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Components
import Alert from '../Miscellaneous/alertSnack';
import DisplayMap from '../Location_Betting_Components/maps';

export default class betCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            userName: process.env.REACT_APP_TEST_USER_NAME,
            betAmount : 0,
            betValue : 0,
            side: '',
            snackOpen: false,
            msg: '',
            msgType: ''
        }
        
    }
    
    handleBetValue = (evt) => {
        let val = evt.target.value;
        if(!isNaN(val)){
            this.setState({betValue : val});
        }else{
            this.setState({snackOpen : true, msg : 'Please enter a number', msgType : 'warning'});
        }
    }

    handlePlaceBet = () => {
        const {betAmount, betValue, side, userName} = this.state;
        const {data} = this.props;

        let isFormValid = true;
        if(betAmount == 0){
            isFormValid = false;
            this.setState({snackOpen : true, msg : 'Please enter a Bet Amount', msgType : 'warning'});
        }
        if(betValue == 0 && data.type === 'multi'){
            isFormValid = false;
            this.setState({snackOpen : true, msg : 'Please enter a bet Value', msgType : 'warning'});
        }
        if(userName === ''){
            isFormValid = false;
            this.setState({snackOpen : true, msg : 'Username could not be retrieved', msgType : 'warning'});
        }
        if(side === '' && data.type === 'binary'){
            isFormValid = false;
            this.setState({snackOpen : true, msg : 'Please select a side', msgType : 'warning'});
        }

        if(isFormValid){
            let obj = {
                betID: data.betID,
                betAmount: betAmount,
                username : userName,
                type: data.type,
                side: side,
                bet : betValue
            }

            fetch('http://localhost:9000/bets/betOn', {
                method: 'POST',
                credentials: 'include',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            .then((res) => res.json())
            .then((res) => {
                if(res.status === "success"){
                    this.setState({snackOpen : true, msg : 'Bet Placed!', msgType : 'success'});
                }
                else if(res.body === 'You have already made a bet on this.'){
                    this.setState({snackOpen : true, msg : 'You have already bet on this', msgType : 'warning'});
                }
                else if(res.body === 'Insufficient funds'){
                    this.setState({snackOpen : true, msg : 'Insufficient funds', msgType : 'error'});
                }
                else{
                    console.log(res);
                    this.setState({snackOpen : true, msg : 'Bet could not be placed', msgType : 'error'});
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({snackOpen : true, msg : 'Bet could not be placed', msgType : 'error'});
            });
        }
    }

    handleSideSelection = (evt) => {
        let side = evt.target.value;
        this.setState({side : side});
    }

    handleBetAmount = (evt) => {
        let amount = evt.target.value;
        if(!isNaN(amount)){
            this.setState({betAmount : amount});
        }else{
            this.setState({snackOpen : true, msg: 'Please enter a number', msgType : 'warning'});
        }
    }

    handleSnackClose = (event, reason) => {
        if(reason === 'clickaway'){
            return;
        }
        this.setState({snackOpen : false});
    }

    generateDeadline(date){
        let betDate = new Date(date * 1000);
        let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}/${betDate.getFullYear()}`;
        let minutes = betDate.getMinutes().toString();
        if(minutes.length == 1){
            minutes = '0' + minutes;
        }
        let timeString = `${betDate.getHours()}:${minutes}`;
        return `Deadline: ${dateString} @ ${timeString}`;
    }

    renderMulti = () => {
        const {betAmount, betValue} = this.state;
        const {data, index} = this.props;

        let color = null;
        if(index % 2 == 0){
            color = {
                backgroundColor: '#DCDCDC',
            }
        }
        let md = 6;
        if(data.location_name){
            md = 4;
        }

        return (
            <ExpansionPanel style={color, styles.expansionPanel}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                <div>
                    <Row>
                        <Col>
                            <h4>{data.title}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Typography>Created By: {data.username}</Typography>
                        </Col>
                    </Row>
                </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                <div>
                <Row>
                    <Col xs={12} md={md}>
                    <List component="nav">
                    <ListSubheader component="div">
                        Details:
                    </ListSubheader>
                        <ListItem>
                            <ListItemIcon>
                                <HourglassEmptyIcon />
                            </ListItemIcon>
                            <ListItemText>
                                {this.generateDeadline(data.deadline)}
                            </ListItemText>
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
                            <ListItemText>Total Sum: {data.betsTotal}</ListItemText>
                        </ListItem>
                    </List>
                    </Col>
                    <Col xs={12} md={md}>
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
                    {data.location_name ? <Col xs={12} md={md}><DisplayMap miniMap={true} regionDetails={data} height='200px'/></Col> : <div></div>}
                </Row>
                <Row>
                    <Col xs={12} md={6}>
                        <List component="nav">
                            <ListSubheader component="div">
                                Your Bet:
                            </ListSubheader>
                            <ListItem>
                                <Input
                                    onChange={this.handleBetValue}
                                    value={betValue}
                                    label="With normal TextField"
                                    style={styles.input}
                                    id="standard-adornment-weight"
                                    endAdornment={<InputAdornment position="end">Bet</InputAdornment>}
                                    aria-describedby="standard-weight-helper-text"
                                />
                            </ListItem>
                            </List>
                        </Col>
                        <Col xs={12} md={6}>
                            <List>
                            <ListSubheader component="div">
                                Bet Value:
                            </ListSubheader>
                            <ListItem>
                                <Input
                                    onChange={this.handleBetAmount}
                                    value={betAmount}
                                    label="With normal TextField"
                                    style={styles.input}
                                    id="standard-adornment-weight"
                                    endAdornment={<InputAdornment position="end">Coins</InputAdornment>}
                                    aria-describedby="standard-weight-helper-text"
                                />
                            </ListItem>
                            </List>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="contained" onClick={this.handlePlaceBet}>Place Bet</Button>
                        </Col>
                    </Row>
                    </div>
                    </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }

    renderBinary = () => {
        const {side, betAmount} = this.state;
        const {data, index} = this.props;

        let color = null;
        if(index % 2 == 0){
            color = {
                backgroundColor: '#DCDCDC',
            }
        }

        return (
        <ExpansionPanel style={color, styles.expansionPanel}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
            >
            <div>
                <Row>
                    <Col>
                        <h4>{data.title}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Typography>Created By: {data.username}</Typography>
                    </Col>
                </Row>
            </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <div>
                <Row>
                    <Col xs={12} md={6}>
                        <List>
                            <ListSubheader>
                                Details:
                            </ListSubheader>
                            <ListItem>
                                <ListItemIcon>
                                    <HourglassEmptyIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    {this.generateDeadline(data.deadline)}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Participants: {data.numberOfBettors}
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Col>
                    <Col xs={12} md={6}>
                        <List>
                            <ListSubheader>
                                Breakdown:
                            </ListSubheader>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckIcon style={styles.tick}/>
                                </ListItemIcon>
                                <ListItemText>
                                    For Total: {data.forBetTotal}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <ClearIcon style={styles.cross}/>
                                </ListItemIcon>
                                <ListItemText>
                                    Against Total: {data.againstBetTotal}
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6}>
                        <List component="nav">
                            <ListSubheader component="div">
                                Side:
                            </ListSubheader>
                            <ListItem>
                            <Select
                                style={styles.side}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={side}
                                onChange={this.handleSideSelection}
                                >
                                <MenuItem value='yes'>For</MenuItem>
                                <MenuItem value='no'>Against</MenuItem>
                            </Select>
                            </ListItem>
                            </List>
                        </Col>
                        <Col xs={12} md={6}>
                            <List>
                            <ListSubheader component="div">
                                Bet Value:
                            </ListSubheader>
                            <ListItem>
                                <Input
                                    onChange={this.handleBetAmount}
                                    value={betAmount}
                                    label="With normal TextField"
                                    style={styles.input}
                                    id="standard-adornment-weight"
                                    endAdornment={<InputAdornment position="end">Coins</InputAdornment>}
                                    aria-describedby="standard-weight-helper-text"
                                />
                            </ListItem>
                            </List>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="contained" onClick={this.handlePlaceBet}>Place Bet</Button>
                        </Col>
                    </Row>
            </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
        )
    }

    render() {
        const {snackOpen, msg, msgType} = this.state;
        const {data} = this.props;

        let display = null;
        if(data.type === 'multi'){
            display = this.renderMulti();
        }else{
            display = this.renderBinary()
        }
        return (
            <div>
                <Snackbar open={snackOpen} autoHideDuration={6000} onClose={this.handleSnackClose}>
                    <Alert onClose={this.handleSnackClose} severity={msgType}>{msg}</Alert>
                </Snackbar>
                {display}
            </div>
        )
    }
}

const styles = {
    card: {
        padding: '15px',
        marginTop: '15px'
    },
    col: {
        borderLeft: 'solid'
    },
    btn: {
        display: 'block',
        marginLeft: '35px'
    },
    tick: {
        color: 'green'
    },
    cross: {
        color: 'red'
    },
    input: {
        maxWidth: '150px'
    },
    side: {
        minWidth: '100px'
    },
    expansionPanel: {
        marginTop : '5px'
    }
    
}
