// React
import React from 'react';
// Material
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Button} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import FormHelperText from '@material-ui/core/FormHelperText';
// Components
import Alert from '../Miscellaneous/alertSnack';

export default class DecideBetDialog extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            side: 'yes',
            value: 0,
            snackOpen: false,
            msg: '',
            msgType: ''
        }
    }

    handleSideChange = (evt) => {
        this.setState({side : evt.target.value});
    }

    handleValueChange = (evt) => {
        if(!isNaN(evt.target.value)){
            this.setState({value : evt.target.value});
        }
    }

    submit = () => {
        let {side, value} = this.state;
        let {data} = this.props;

        let isFormValid = true;
        let result = null;

        if(data.type === 'multi'){
            result = value;
            if(isNaN(value) || value === ''){
                isFormValid = false;
                this.setState({snackOpen : true, msg : 'Please enter a value', msgType : 'warning'});
            }
        }else{
            result = side;
        }

        if(isFormValid){
            let obj = {
                betID : data.betID,
                result : side
            }
            fetch('http://ec2-107-23-251-248.compute-1.amazonaws.com:9000/decideBet', {
                method : 'POST',
                credentials : 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            .then(res => res.json())
            .then(res => {
                if(res.status === 'success'){
                    this.setState({snackOpen : true, msg : "Finished Bet Successfully!", msgType : 'success'});
                    this.handleCancel();
                }
                else{
                    console.log(res);
                    this.setState({snackOpen : true, msg : 'Could not finish bet', msgType : 'error'});
                    this.handleCancel();
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({snackOpen : true, msg : 'Could not finish bet', msgType : 'error'});
                this.handleCancel();
            });
        }
    }

    handleCancel = () => {
        this.props.close();
    }

    handleSnackClose = (event, reason) => {
        if(reason === 'clickaway'){
            return;
        }
        this.setState({snackOpen : false});
    }

    render(){
        const {side, value, snackOpen, msg, msgType} = this.state;
        const {open, data} = this.props;
        return(
            <div>
                <Snackbar open={snackOpen} autoHideDuration={6000} onClose={this.handleSnackClose}>
                    <Alert onClose={this.handleSnackClose} severity={msgType}>{msg}</Alert>
                </Snackbar>
                <Dialog open={open}>
                    <DialogTitle>Decide Bet</DialogTitle>
                    <DialogContent>
                        {data.type === 'binary' ? 
                            <div>
                            <Select
                                value={side}
                                onChange={this.handleSideChange}
                                style={{width: '100px'}}
                            >
                                <MenuItem value='yes'>Yes</MenuItem>
                                <MenuItem value='no'>No</MenuItem>
                            </Select>
                            <FormHelperText>Correct Side</FormHelperText>
                            </div>
                            :
                            <div>
                            <TextField 
                                value={value}
                                onChange={this.handleValueChange}
                            />
                            <FormHelperText>Correct Value</FormHelperText>
                            </div>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button  onClick={this.handleCancel}>Cancel</Button>
                        <Button onClick={this.submit}>Decide Bet</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}