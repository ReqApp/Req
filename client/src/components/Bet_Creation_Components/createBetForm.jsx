// React
import React, { Component } from 'react';
import 'date-fns';
// Bootstrap
import { Row, Col } from 'react-bootstrap/';
// Material
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Button} from '@material-ui/core';
// Components
import BetTypeSelection from './betTypeSelection';
import DateAndTimePickers from './dateAndTimePickers';

export default class CreateBetForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: '',
            betType: '',
            sliderOne: 70,
            sliderTwo: 20,
            sliderThree: 10,
            date: new Date(),
            side: '',
        }
    }

    submitForm = () => {
        const {title, betType, sliderOne, sliderTwo, sliderThree, date, side} = this.state;
    
        let isFormValid = true;
        if(title === ''){
            isFormValid = false;
            this.props.error('Please enter a title', 'error');
        }
        if(betType === ''){
            isFormValid = false;
            this.props.error('Please select a bet type', 'error');
        }
        if((sliderOne + sliderTwo + sliderThree) != 100){
            isFormValid = false;
            this.props.error('Bet percetages do not sum to 100', 'error');
        }
        if(betType === 'binary' && side === ''){
            isFormValid = false;
            this.props.error('Please select a side', 'error');
        }

        if(isFormValid){
            let obj = {
                username : process.env.REACT_APP_TEST_USER_NAME,
                type : betType,
                side : side,
                title : title,
                firstPlaceCut : sliderOne / 100,
                secondPlaceCut : sliderTwo / 100,
                thirdPlaceCut : sliderThree / 100,
                deadline : (+date) / 1000
            }

            fetch('http://localhost:9000/makeBet', {
                method : 'POST',
                credentials : 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(obj)
            })
            .then(res => res.json())
            .then(res => {
                if(res.status === 'success'){
                    this.props.error('Bet Made!', 'success');
                }
                else{
                    console.log(res);
                    this.props.error('Bet could not be made', 'error');
                }
                this.closeDialog();
            })
            .catch(err => {
                this.closeDialog();
                console.log(err);
                this.props.error('Bet could not be made', 'error');
            })
        }
    }

    handleTitleChange = (evt) => {
        this.setState({title : evt.target.value});
    }

    handleDateChange = (newDate) => {
        let epochTime = +newDate;
        if(Date.now() > epochTime){
            // Handle error
            this.props.error('Deadline not valid', 'error');
            this.setState({date : new Date()});
        }else{
            this.setState({date : newDate});
        } 
    }

    handleBetTypeSelection = (evt) => {
        this.setState({betType : evt.target.value});
    }

    handleSideChange = (side) => {
        this.setState({side : side});
    }

    handleSliderChange = (obj) => {
        this.setState(obj);
    }

    closeDialog = () => {
        this.props.closeDialog();
    }

    render() {
        const {date, betType} = this.state;
        const {open} = this.props;
        return (
            <div>
            <Dialog open={open} onClose={this.closeDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create New Bet</DialogTitle>
                    <DialogContent>
                    <Row>
                            <Col>
                                <TextField id="standard-basic" label="Bet Title" onChange={this.handleTitleChange} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormControl component="fieldset" style={styles.betTypeSelection}>
                                    <FormLabel component="legend">Bet Type</FormLabel>
                                    <RadioGroup onChange={this.handleBetTypeSelection}>
                                    <FormControlLabel value="binary" control={<Radio />} label="Binary-Bet" />
                                    <FormControlLabel value="multi" control={<Radio />} label="Multi-Bet" />
                                    </RadioGroup>
                                </FormControl>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <BetTypeSelection 
                                    betType={betType} 
                                    sliderChange={this.handleSliderChange} 
                                    sideChange={this.handleSideChange}
                                />
                                <DateAndTimePickers dateChange={this.handleDateChange} date={date}/>
                            </Col>
                        </Row>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog} color="primary">
                        Cancel
                        </Button>
                        <Button onClick={this.submitForm} color="primary">
                        Create
                        </Button>
                    </DialogActions>
            </Dialog>
            </div>
        )
    }
}

const styles = {
    betTypeSelection: {
        marginTop: '10px'
    }
}
