import 'date-fns';
import React from 'react';
// Bootstrap
import {Button, Container, Row, Col } from 'react-bootstrap/';
// Material
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
  import DateFnsUtils from '@date-io/date-fns';
// Components
import Navbar from './navbar';
import DisplayMap from './maps';

export default class CreateLocationBet extends React.Component{
    constructor(props){
        super(props);
        this.date = null;
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    handleDateChange(newDate){
        this.date = newDate;
    }

    render(){
        const {regionData, userLocation} = this.props;
        const defaultDate = new Date('2014-08-18T21:11:54');
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
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Bet Type</FormLabel>
                                <RadioGroup aria-label="gender" name="gender1">
                                <FormControlLabel value="binary" control={<Radio />} label="Binary-Bet" />
                                <FormControlLabel value="multi" control={<Radio />} label="Multi-Bet" />
                                </RadioGroup>
                            </FormControl>
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
                </Container>
            </div>
        )
    }
}

const styles = {

}