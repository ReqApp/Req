import 'date-fns';
import React from 'react';
// Bootstrap
import {Container, Row, Col } from 'react-bootstrap/';
// Material
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import DateFnsUtils from '@date-io/date-fns';
// Components
import Navbar from './navbar';
import DisplayMap from './maps';

export default class CreateLocationBet extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            betType: 'none',
            side: '',
            sliderOne: 60,
            sliderTwo: 30,
            sliderThree: 10,
            value: 50
        }
        this.date = null;
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleBetTypeSelection = this.handleBetTypeSelection.bind(this);
        this.handleSideSelection = this.handleSideSelection.bind(this);
        this.sliderOneChange = this.sliderOneChange.bind(this);
        this.sliderTwoChange = this.sliderTwoChange.bind(this);
        this.sliderThreeChange = this.sliderThreeChange.bind(this);
        this.calculateSliderVals = this.calculateSliderVals.bind(this);
        //this.handleSliderChange = this.handleSliderChange.bind(this);
        //this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleDateChange(newDate){
        this.date = newDate;
    }

    handleBetTypeSelection(evt){
        this.setState({betType : evt.target.value});
    }

    handleSideSelection(evt){
        this.setState({side : evt.target.value});
    }

    sliderOneChange(evt, newValue){
        this.calculateSliderVals(newValue, 'first');
    }

    sliderTwoChange(evt, newValue){   
        this.calculateSliderVals(newValue, 'second');
    }

    sliderThreeChange(evt, newValue){
        this.calculateSliderVals(newValue, 'third');
    }

    calculateSliderVals(newValue, slider){
        let {sliderOne, sliderTwo, sliderThree} = this.state;
        if(slider === 'first'){
            let diff = newValue - sliderOne;
            if(diff == 0){
                return;
            }else if(diff > 0){
                if(sliderTwo != 0){
                    sliderTwo -= 5;
                }else{
                    sliderThree -=5;
                }
            }else{
                sliderTwo += 5;
            }
            this.setState({sliderOne : newValue, sliderTwo : sliderTwo, sliderThree : sliderThree});
        }
        else if(slider === 'second'){
            let diff = newValue - sliderTwo;
            if(diff == 0){
                return;
            }else if(diff > 0){
                if(sliderThree > 0){
                    sliderThree -= 5;
                }else{
                    sliderOne -= 5;
                }
            }else{
                sliderOne += 5;
            }
            this.setState({sliderOne : sliderOne, sliderTwo : newValue, sliderThree : sliderThree});
        }else{
            let diff = newValue - sliderThree;
            if(diff == 0){
                return;
            }else if(diff > 0){
                if(sliderTwo > 0){
                    sliderTwo -= 5;
                }else{
                    sliderOne -= 5;
                }
            }else{
                sliderOne += 5;
            }
            this.setState({sliderOne : sliderOne, sliderTwo : sliderTwo, sliderThree : newValue});
        }
    }

    render(){
        const {regionData, userLocation} = this.props;
        const {betType, side, sliderOne, sliderTwo, sliderThree} = this.state;
        const defaultDate = new Date('2014-08-18T21:11:54');

        return(
            <div>
                <Navbar />
                <Slider
                    style={styles.slider}
                    value={sliderOne}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={5}
                    onChange={this.sliderOneChange}
                    marks
                    min={0}
                    max={100}
                />
                <Slider
                    style={styles.slider}
                    value={sliderTwo}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={5}
                    onChange={this.sliderTwoChange}
                    marks
                    min={0}
                    max={100}
                />
                <Slider
                    style={styles.slider}
                    value={sliderThree}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={5}
                    onChange={this.sliderThreeChange}
                    marks
                    min={0}
                    max={100}
                />
            </div>
        )

        /*
        let betTypeSelectors = null;
        if(betType === 'binary'){
            betTypeSelectors = (
                <FormControl style={styles.dropDown}>
                    <InputLabel id="demo-simple-select-label">Side</InputLabel>
                    <Select
                        style={StyleSheet.dropDown}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={side}
                        onChange={this.handleSideSelection}
                        >
                        <MenuItem value={'yes'}>Yes</MenuItem>
                        <MenuItem value={'no'}>No</MenuItem>
                    </Select>
                </FormControl>
            );
        }

        return(
            <div>
                <Navbar />
                <Container>
                    <Row>
                        <Col>
                            <h1>New Location Bet</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DisplayMap miniMap={true} regionDetails={regionData}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TextField id="standard-basic" label="Name" />
    
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormControl component="fieldset" style={styles.typeSelection}>
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
                            {betTypeSelectors}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Date picker inline"
                                value={defaultDate}
                                onChange={this.handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                label="Time picker"
                                value={defaultDate}
                                onChange={this.handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="contained">Create New Bet</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
        */
    }
}

/*      Material example         <Slider
                    value={typeof value === 'number' ? value : 0}
                    onChange={this.handleSliderChange}
                    aria-labelledby="input-slider"
                />
                <Input
                    value={value}
                    margin="dense"
                    onChange={this.handleInputChange}
                    inputProps={{
                    step: 10,
                    min: 0,
                    max: 100,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                    }}
                />*/

const materialStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
}));

const styles = {
    typeSelection: {
        marginTop: '20px',
    },
    dropDown: {
        width: '200px'
    },
    slider: {
        marginTop: '100px',
    }
}