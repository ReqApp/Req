import 'date-fns';
import React from 'react';
// Bootstrap
import {Container, Row, Col } from 'react-bootstrap/';
// Material
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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


// TODO
    // Ask user if they want to create bet region or bet
    // If no regions available create new region is the default

export default class CreateLocationBet extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            betType: 'none',
            side: '',
            sliderOne: 70,
            sliderTwo: 20,
            sliderThree: 10,
            radius: 100,
            location_name: '',
            title: '',
            date: new Date(),
            snackOpen: false,
            msg: '',
            msgType: '',
            description: ''
        }
    }

    submitBetForm = () => {
        const {betType, side, sliderOne, sliderTwo, sliderThree, radius, location_name, title, date} = this.state;
        const {regionData, userLocation}  = this.props;
        
        let formValid = true;
        // Validate title
        if(title === ''){
            formValid = false;
            this.setState({msg : "Please enter a title", msgType: 'error', snackOpen : true});
        }
        // Validate location name
        if(location_name === ''){
            formValid = false;
            this.setState({msg : "Please enter a location name", msgType: 'error', snackOpen : true});
        }
        // Validate bet percentages
        if((sliderOne / 100 + sliderTwo / 100 + sliderThree / 100).toFixed(2) != 1){
            formValid = false;
            this.setState({msg : "Bet Percentages do no sum to 100%", msgType: 'error', snackOpen: true});
        }
        // Validate type
        if(betType === 'none'){
            formValid = false;
            this.setState({msg : "Please select a bet type", msgType : 'error', snackOpen : true});
        }
        // Validate side
        if(side === '' && betType === 'binary'){
            formValid = false;
            this.setState({msg : "Please select side", msgType : 'error', snackOpen : true});
        };
        // Allow three minute margin for deadline
        if(+date < (Date.now() + 180)){
            formValid = false;
            this.setState({msg : "Deadline not valid", msgType: 'error', snackOpen : true});
        }
        if(formValid){
            let data = {
                type: betType,
                title: title,
                deadline: +date,
                username: 'testUser',
            }
            if(betType === 'binary'){
                data.side = side;
            }else if(betType === 'multi'){
                data.firstPlaceCut = sliderOne / 100;
                data.secondPlaceCut = sliderTwo / 100;
                data.thirdPlaceCut = sliderThree / 100;
            }
            
            fetch('http://localhost:9000/makeBet', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => {
                if(res.status === 'success'){
                    let locationData = {
                        location_name : location_name,
                        latitude : userLocation.lat,
                        longitude : userLocation.lng,
                        radius : radius,
                        bet_region_id : regionData._id,
                        bet_id : res.body._id
                    }
                    fetch('http://localhost:9000/createLocationBet', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body : JSON.stringify(locationData)
                    })
                    .then(res => res.json())
                    .then(res => {
                        if(res.status === 'success'){
                            this.setState({msg : "Bet created!", msgType : 'success', snackOpen : true});
                        }else{
                            console.log(res);
                            this.setState({msg : "Location Bet could not be created", msgType : 'error', snackOpen : true});
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.setState({msg : "Location Bet could not be created", msgType : 'error', snackOpen : true});
                    });
                }else{
                    console.log(res);
                    this.setState({msg : "Bet could not be created", msgType : 'error', snackOpen : true});
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({msg : "Location Bet could not be created", msgType : 'error', snackOpen : true});
            });
        }
    }

    submitRegionForm = () => {
        const {title, location_name, radius, description} = this.state;
        const {userLocation} = this.props;

        let formValid = true;
        if(title === ''){
            formValid = false;
            this.setState({msg : 'Please enter a title', msgType : 'error', snackOpen : true});
        }
        if(location_name === ''){
            formValid = false;
            this.setState({msg : 'Please enter a location', msgType : 'error', snackOpen : true});
        }
        if(description === ''){
            formValid = false;
            this.setState({msg : 'Please enter a description', msgType : 'error', snackOpen : true});
        }
        if(description.length > 300){
            formValid = false;
            this.setState({msg : 'Description too long', msgType : 'error', snackOpen : true});
        }
        if(formValid){
            let data = {
                region_name : title,
                description : description,
                latitude : userLocation.lat,
                longitude : userLocation.lng,
                radius : radius
            }
            fetch('http://localhost:9000/addBetRegion', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(data) 
            })
            .then(res => res.json())
            .then(res => {
                if(res.status === 'success'){
                    console.log(res.body);
                    this.setState({msg : 'Bet region created!', msgType: 'success', snackOpen : true});
                }else{
                    console.log(res);
                    this.setState({msg : 'Bet region could not be created', msgType : 'error', snackOpen : true});
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({msg : 'Bet region could not be created', msgType : 'error', snackOpen : true});
            })
        }
    }

    handleDateChange = (newDate) => {
        let epochTime = +newDate;
        if(Date.now() > epochTime){
            // Handle error
            this.setState({msg : "Deadline not valid", snackOpen : true, date: new Date()});
        }else{
            this.setState({date : newDate});
        } 
    }

    handleSliderChange = (vals) => {
        this.setState(vals);
    }

    handleRadChange = (evt, newValue) => {
        this.setState({ radius : newValue });
    }

    handleBetTypeSelection = (evt) => {
        this.setState({betType : evt.target.value});
    }

    handleSideSelection = (side) => {
        this.setState({side : side});
    }

    handleSnackClose = (event, reason) => {
        if(reason === 'clickaway'){
            return;
        }
        this.setState({snackOpen : false});
    }

    handleTitleChange = (evt) => {
        this.setState({title : evt.target.value});
    }

    handleLocationNameChange = (evt) => {
        this.setState({location_name : evt.target.value});
    }

    handleDescriptionChange = (evt) => {
        this.setState({description : evt.target.value});
    }

    render(){
        const {betType, side, sliderOne, sliderTwo, sliderThree, radius, date, snackOpen, msg, msgType} = this.state;
        const {regionData, userLocation, createRegion} = this.props;

        if(createRegion){
            const radiusMarks = [
                {
                    value: 100,
                    label: '0.1km'
                },
                {
                    value: 1500,
                    label: '1.5km'
                }
            ];
            return(
                <div>
                <Navbar />
                <Snackbar open={snackOpen} autoHideDuration={6000} onClose={this.handleSnackClose}>
                        <Alert onClose={this.handleSnackClose} severity={msgType}>{msg}</Alert>
                    </Snackbar>
                    <Container style={styles.mainContent}>
                        <Row>
                            <Col xs={12} md={6}>
                            <Paper elevation={3} style={styles.formContainer}>
                                <Container>
                                    <Row>
                                        <Col>
                                            <h1>New Bet Region</h1>
                                        </Col>
                                    </Row>
                                <Row>
                                        <Col>
                                            <TextField id="standard-basic" label="Bet Title" onChange={this.handleTitleChange} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <TextField id="standard-basic" label="Location Name" onChange={this.handleLocationNameChange} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                        <TextField
                                            style={styles.description}
                                            id="outlined-multiline-static"
                                            label="Description"
                                            multiline
                                            rows="6"
                                            defaultValue="Description..."
                                            variant="outlined"
                                            onChange={this.handleDescriptionChange}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                        <Typography id="discrete-slider" gutterBottom style={styles.radiusTitle}>Region Radius</Typography>
                                            <Slider
                                                defaultValue={100}
                                                style={styles.radSlider}
                                                aria-labelledby="discrete-slider"
                                                valueLabelDisplay="auto"
                                                step={100}
                                                marks={radiusMarks}
                                                valueLabelDisplay="on"
                                                min={100}
                                                max={1500}
                                                onChange={this.handleRadChange}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button variant="contained" onClick={this.submitRegionForm}>Create New Bet</Button>
                                        </Col>
                                    </Row>
                                </Container>
                                </Paper>
                            </Col>
                            <Col xs={12} md={6}>
                                <Paper elevation={3} style={styles.paperHeight}>
                                    <div style={styles.mapContainer}>
                                        <DisplayMap miniMap={true} userLocation={userLocation} radius={radius} height={'100%'}/>
                                    </div>
                                </Paper>
                            </Col>  
                        </Row>
                    </Container>
                </div>
            )
        }else{
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
                        <Alert onClose={this.handleSnackClose} severity={msgType}>{msg}</Alert>
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
                                            <TextField id="standard-basic" label="Bet Title" onChange={this.handleTitleChange} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <TextField id="standard-basic" label="Location Name" onChange={this.handleLocationNameChange} />
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
                                                sideChange={this.handleSideSelection}
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
                                            <Button variant="contained" onClick={this.submitBetForm}>Create New Bet</Button>
                                        </Col>
                                    </Row>
                                </Container>
                                </Paper>
                            </Col>
                            <Col xs={12} md={6}>
                                <Paper elevation={3} style={styles.paperHeight}>
                                    <div style={styles.mapContainer}>
                                        <DisplayMap miniMap={true} userLocation={userLocation} radius={radius} height={'100%'}/>
                                    </div>
                                </Paper>
                            </Col>  
                        </Row>
                    </Container>
                </div>
            )
            
        }
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
    },
    description: {
        marginTop: '20px',
        width: '400px'
    }
}