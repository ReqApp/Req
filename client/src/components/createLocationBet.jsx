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
import {Paper} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import DateFnsUtils from '@date-io/date-fns';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
// Components
import Navbar from './navbar';
import DisplayMap from './maps';
import BetTypeSelection from './betTypeSelection';
import Alert from './alertSnack';


export default class CreateLocationBet extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            betType: 'none',
            side: '',
            sliderOne: 60,
            sliderTwo: 30,
            sliderThree: 10,
            value: 50,
            betRad: 100,
            location_name: '',
            title: '',
            date: new Date(),
            time: '',
            snackOpen: false,
        }
    }

    submitForm = () => {
        const {betType, side, sliderOne, sliderTwo, sliderThree, betRad, location_name, title, date, time} = this.state;
        const {regionData, userLocation}  = this.props;

        if((sliderOne + sliderTwo + sliderThree) != 100){
            // Handle slider error
        }
        
        // if(betType === 'binary'){
        //     fetch('http://localhost:9000/makeBet', {
        //         method : 'POST',
        //         headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'application/json',
        //           },
        //           body: JSON.stringify({
        //             user_name : user_name,
        //             password : password
        //           })
        //     })
        //     .then(res => res.json)


        // }

    }

    handleDateChange = (newDate) => {
        let epochTime = newDate.getTime()/1000.0;
        if(Date.now() > epochTime){
            // Handle error
            this.setState({snackOpen : true});
        }else{
            this.setState({date : newDate});
        } 
    }

    handleSliderChange = (vals) => {
        this.setState(vals);
    }

    handleRadChange = (evt, newValue) => {
        this.setState({ betRad: newValue });
    }

    handleBetTypeSelection = (evt) => {
        this.setState({betType : evt.target.value});
    }

    handleSideSelection = (evt) => {
        this.setState({side : evt.target.value});
    }

    handleSnackClose = (event, reason) => {
        if(reason === 'clickaway'){
            return;
        }
        this.setState({snackOpen : false});
    }

    render(){
        const {betType, side, sliderOne, sliderTwo, sliderThree, betRad, date, snackOpen} = this.state;
        const {regionData, userLocation} = this.props;

        const radiusMarks = [
            {
                value: 100,
                label: '100m'
            },
            {
                value: 600,
                label: '600m'
            }
        ];

        return(
            <div>
                <Navbar />
                <Snackbar open={snackOpen} autoHideDuration={6000} onClose={this.handleSnackClose}>
                    <Alert onClose={this.handleSnackClose} severity="error">
                        Please Select a Future Date
                    </Alert>
                </Snackbar>
                <Container style={styles.mainContent}>
                    <Row>
                        <Col xs={12} md={6}>
                        <Paper elevation={3} style={styles.formContainer}>
                            <Container>
                                <Row>
                                    <Col>
                                        <h2>New Location Bet In:</h2><br/>
                                        <h1>{regionData.region_name}</h1>
                                    </Col>
                                </Row>
                            <Row>
                                    <Col>
                                        <TextField id="standard-basic" label="Bet Title" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextField id="standard-basic" label="Location Name" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <Typography id="discrete-slider" gutterBottom style={styles.radiusTitle}>Bet Radius</Typography>
                                        <Slider
                                            defaultValue={100}
                                            style={styles.radSlider}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="auto"
                                            step={50}
                                            marks={radiusMarks}
                                            valueLabelDisplay="on"
                                            min={100}
                                            max={600}
                                            onChange={this.handleRadChange}
                                        />
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
                                        <BetTypeSelection 
                                            betType={betType} 
                                            sliderChange={this.handleSliderChange} 
                                            handleSideSelection={this.handleSideSelection}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="dd/MM/yyyy"
                                            margin="normal"
                                            id="date-picker-inline"
                                            label="Date"
                                            value={date}
                                            onChange={this.handleDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                        <KeyboardTimePicker
                                            margin="normal"
                                            id="time-picker"
                                            label="Time"
                                            value={date}
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
                                        <Button variant="contained" onClick={this.submitForm}>Create New Bet</Button>
                                    </Col>
                                </Row>
                            </Container>
                            </Paper>
                        </Col>
                        <Col xs={12} md={6}>
                            <Paper elevation={3} style={styles.paperHeight}>
                                <div style={styles.mapContainer}>
                                    <DisplayMap miniMap={true} userLocation={userLocation} radius={betRad} height={'100%'}/>
                                </div>
                            </Paper>
                        </Col>  
                    </Row>
                </Container>
            </div>
        )
        
    }
}


const styles = {
    typeSelection: {
        marginTop: '20px',
    },
    radSlider: {
        //width: '30%'
        marginTop: '30px',
    },
    radiusTitle: {
        marginTop: '50px',
    },
    titleSection: {
        textAlign: 'center',
    },
    paperHeight: {
        height: '100%',
    },
    mapContainer: {
        height: '100%',
    },
    mainContent: {
        marginTop: '20px',
        height: '100%',
    },
    paperContent: {
        padding: '20px'
    },
    formContainer: {
        padding: '20px',
    }
}