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

    // Binary-bets
    handleSideSelection = (evt) => {
        let side = evt.target.value;
        this.setState({side : side});
        this.props.sideChange(side);
    }

    // Multi-bets
    sliderOneChange = (evt, newValue) => {
        this.calculateSliderVals(newValue, 'first');
    }
    sliderTwoChange = (evt, newValue) => {   
        this.calculateSliderVals(newValue, 'second');
    }
    sliderThreeChange = (evt, newValue) => {
        this.calculateSliderVals(newValue, 'third');
    }
    // Adjust other sliders when one is adjusted to maintain 100%
    calculateSliderVals = (newValue, slider) => {
        let {sliderOne, sliderTwo, sliderThree} = this.state;
        if(slider === 'first'){
            let newVals = this.calcVals((newValue - sliderOne), sliderTwo, sliderThree);
            let obj = {sliderOne : newValue, sliderTwo : newVals.priorityOneSlider, sliderThree : newVals.priorityTwoSlider};
            this.setState(obj);
            this.props.sliderChange(obj);
        }
        if(slider === 'second'){
            let newVals = this.calcVals((newValue - sliderTwo), sliderOne, sliderThree);
            let obj = {sliderOne : newVals.priorityOneSlider, sliderTwo : newValue, sliderThree : newVals.priorityTwoSlider};
            this.setState(obj);
            this.props.sliderChange(obj);
        }
        if(slider === 'third'){
            let newVals = this.calcVals((newValue - sliderThree), sliderOne, sliderTwo);
            let obj = {sliderOne : newVals.priorityOneSlider, sliderTwo : newVals.priorityTwoSlider, sliderThree : newValue};
            this.setState(obj);
            this.props.sliderChange(obj);
        }
    }
    // Algorithm for calculating values
    calcVals(diff, priorityOneSlider, priorityTwoSlider){
        if(diff > 0){
            if(priorityTwoSlider >= diff){
                priorityTwoSlider -= diff;
            }else{
                let num = diff - priorityTwoSlider;
                priorityTwoSlider = 0;
                priorityOneSlider -= num;
            }
        }else{
            priorityOneSlider += Math.abs(diff);
        }
        return {priorityOneSlider : priorityOneSlider, priorityTwoSlider : priorityTwoSlider};
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