// React
import React from 'react';
// Bootstrap
import {Container, Row, Col} from 'react-bootstrap';
// Components
import BetCard from '../components/betCard';


export default class FindBets extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          loadingBets : true,
          bets: [],
          errorMsg: 'Loading Bets'
        }
    }
    componentDidMount() {
        fetch('http://localhost:9000/getBets', {
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

    render(){
      const {loadingBets, bets} = this.state;
      if(!loadingBets){
        return(
          <div>
            {bets.map((bet, index) => <Row key={index}><Col><BetCard data={bet} /></Col></Row>)}
          </div>
        )
      }
      return null;
    }
    
}