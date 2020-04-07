// React
import React from 'react';
// Material

import Countup from 'react-countup';

export default class Coins extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            totalCoins: 5,
            dataRetrieved: false,
        }
    }
    componentDidMount(){
        const {user} = this.props;
        fetch("http://localhost:9000/getCoins", {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username" : user
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.status === "success") {
                this.setState({dataRetrieved: true, totalCoins : res.body});
            }
            else{
                this.setState({dataRetrieved: true, totalCoins : 0})
            }
        })
        .catch((err) => {
            this.setState({dataRetrieved: true, totalCoins : 0});
        });
    }

    render(){
        const {dataRetrieved, totalCoins} = this.state;
        if(dataRetrieved){
            return(
                <div>
                <h2>
                <Countup end={totalCoins} 
                            style={{fontWeight:'bold', color: '#949494', textAlign:'center'}}
                            duration={3.6}
                            />
                </h2>
                <h6 style={{color: '#949494'}}> in the bank</h6>
                </div>

            )
        }
        return null;
    }
}