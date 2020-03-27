// React
import React from 'react'
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
        fetch('http://localhost:9000/getBetsForUser', {
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
    
    render() {
        const {bets} = this.state;
        return (
            <div>
                {bets.map((bet, index) => <CurrentBetInfo data={bet} key={index}/>)}
            </div>
        )
    }
}