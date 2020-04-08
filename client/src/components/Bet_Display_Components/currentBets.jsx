// React
import React from 'react'
// Material
import {Paper, Typography} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
// Components
import CurrentBetInfo from './currentBetInfo';

export default class CurrentBets extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loadingBets: true,
            bets: [],
            errorMsg: 'Loading bets'
        }
    }

    componentDidMount() {
        fetch('http://localhost:9000/bets/getBetsForUser', {
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
              if(res.body !== 'No bets'){
                this.setState({loadingBets : false, bets : res.body});
              }else{
                this.setState({loadingBets : false, errorMsg : "No Current Bets To Show"});
              }
            }
            else if(res.status === 'error' && res.body === 'User not signed in'){
              console.log(res.body);
              this.setState({loadingBets : false, errorMsg : 'User not signed in'});
            }
            else{
                console.log(res.body);
                this.setState({loadingBets : false, errorMsg : 'Could not retrieve bets and error occured'});
            }
          })
          .catch(err => {
            console.log(err);
            this.setState({loadingBets : false, errorMsg : 'Could not retrieve bets and error occured'});
          });
    }
    
    render() {
        const {bets, loadingBets, errorMsg} = this.state;
        if(!loadingBets){
          if(bets.length){
            return (
                <div>
                    {bets.map((bet, index) => <CurrentBetInfo data={bet} key={index}/>)}
                </div>
            )
          }else{
            return(
              <Paper style={styles.paper}>
              <h2>Your Current Bets:</h2>
              <div style={{textAlign: 'center'}}>
                  <h6 style={styles.text}>{errorMsg}</h6>
              </div>
            </Paper>
            )
          }
        }else{
          return(
            <Paper style={styles.paper}>
                <h2>Your Current Bets:</h2>
                <div style={{textAlign: 'center'}}>
                    <CircularProgress style={styles.progress}/>
                    <Typography style={styles.text}>Loading Bets...</Typography>
                </div>
            </Paper>
        )
        }
    }
}

const styles = {
  paper: {
      marginTop: '15px',
      padding: '15px'
  },
  progress: {
    marginTop: '30px',
    display: 'block',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  text: {
    padding: '20px'
  }
}