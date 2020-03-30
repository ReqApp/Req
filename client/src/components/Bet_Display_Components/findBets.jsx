// React
import React from 'react';
// Material
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Button} from '@material-ui/core';
// Bootstrap
import {Row, Col} from 'react-bootstrap';
// Components
import BetCard from './betCard';

export default class FindBets extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props);
        this.state = {
          loadingBets : true,
          bets: [],
          errorMsg: 'Loading Bets'
        }
    }
    componentDidMount() {
        fetch('http://localhost:9000/findNewBets', {
            method: 'POST',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          })
          .then((res) => res.json())
          .then((res) => {
            if(res.status === "success"){
                console.log(res);
                this.setState({loadingBets : false, bets : res.body});
            }
            else if(res.status === 'error' && res.body === 'User not signed in'){
              console.log(res.body);
              this.setState({errorMsg : 'User not signed in'});
            }
            else{
                console.log(res.body);
                this.setState({errorMsg : 'Could not retrieve bets and error occured'});
            }
          })
          .catch(err => {
            console.log(err);
            this.setState({errorMsg : 'Could not retrieve bets and error occured'});
          });
    }

    closeDialog = () => {
      this.props.closeDialog();
    }

    render(){
      const {loadingBets, bets} = this.state;
      const {openPane} = this.props;

      if(!loadingBets){
        return (
          <Dialog open={openPane} onClose={this.closeDialog}>
            <DialogTitle>Find Bets</DialogTitle>
            <DialogContent>
              {bets.map((bet, index) => <Row key={index}><Col><BetCard data={bet} /></Col></Row>)}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog> 
        )
      }
      return null;
    }
}