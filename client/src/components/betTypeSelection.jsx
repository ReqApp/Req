// React
import React from 'react';
// Material
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from '@material-ui/core/Slider';

export default class BetTypeSelection extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            sliderOne: 70,
            sliderTwo: 20,
            sliderThree: 10,
            side: '',
        }
    }

    sliderOneChange = (evt, newValue) => {
        this.calculateSliderVals(newValue, 'first');
    }

    sliderTwoChange = (evt, newValue) => {   
        this.calculateSliderVals(newValue, 'second');
    }

    sliderThreeChange = (evt, newValue) => {
        this.calculateSliderVals(newValue, 'third');
    }

    handleSideSelection = (evt) => {
        let side = evt.target.value;
        this.setState({side : side});
        this.props.sliderChange(side);
    }

    calculateSliderVals = (newValue, slider) => {
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
            let vals = {sliderOne : newValue, sliderTwo : sliderTwo, sliderThree : sliderThree};
            this.setState({sliderOne : newValue, sliderTwo : sliderTwo, sliderThree : sliderThree});
            this.props.sliderChange(vals);
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
            let vals = {sliderOne : sliderOne, sliderTwo : newValue, sliderThree : sliderThree};
            this.setState({sliderOne : sliderOne, sliderTwo : newValue, sliderThree : sliderThree});
            this.props.sliderChange(vals);
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
            let vals = {sliderOne : sliderOne, sliderTwo : sliderTwo, sliderThree : newValue};
            this.setState({sliderOne : sliderOne, sliderTwo : sliderTwo, sliderThree : newValue});
            this.props.sliderChange(vals);
        }
    }

    render(){
        const {sliderOne, sliderTwo, sliderThree, side} = this.state;
        const {betType} = this.props;

        if(betType === 'binary'){
            return (
                <FormControl style={styles.dropDown}>
                    <InputLabel id="demo-simple-select-label">Side</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={side}
                        onChange={this.handleSideSelection}
                        >
                        <MenuItem value={'yes'}>Yes</MenuItem>
                        <MenuItem value={'no'}>No</MenuItem>
                    </Select>
                </FormControl>
            )
        }else if(betType === 'multi'){
            return(
            <div>
                <Typography id="discrete-slider" gutterBottom >First-Place Cut</Typography>
                <Slider
                    style={styles.cutSlider}
                    value={sliderOne}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={5}
                    onChange={this.sliderOneChange}
                    marks
                    min={0}
                    max={100}
                    />
                <Typography id="discrete-slider" gutterBottom >Second-Place Cut</Typography>
                <Slider
                    style={styles.cutSlider}
                    value={sliderTwo}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={5}
                    onChange={this.sliderTwoChange}
                    marks
                    min={0}
                    max={100}
                />
                <Typography id="discrete-slider" gutterBottom >Third-Place Cut</Typography>
                <Slider
                    style={styles.cutSlider}
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
        }else{
            return null;
        }
    }
}

const styles = {
    dropDown: {
        width: '200px'
    },
    cutSlider: {
        marginTop: '20px',
    }
}