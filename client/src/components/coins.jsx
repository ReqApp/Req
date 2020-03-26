// React
import React from 'react';
// Material
import Typography from "@material-ui/core/Typography";
import { Avatar } from '@material-ui/core';
import {Button} from '@material-ui/core';
import {Paper} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Badge from '@material-ui/core/Badge';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
// Bootstrap
import {Container, Row, Col} from 'react-bootstrap';

export default class Coins extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            totalCoins: 0,
            loadingCoins: true,
            errorMsg: 'Fetching coins'
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
                "user_name" : user
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.status === "information") {
                console.log(res.body);
                this.setState({loadingCoins : false, totalCoins : res.body});
            }
            else{
                console.log(res);
                this.setState({errorMsg : 'Failed to load coins'})
            }
        })
        .catch((err) => {
            console.log(err);
            this.setState({errorMsg : 'Failed to load coins'});
        });
    }

    render(){
        const {loadingCoins, errorMsg, totalCoins} = this.state;
        if(!loadingCoins){
            return(
                <div>
                <h2 style={{margin:'0px', fontWeight:'bold'}}> {totalCoins } </h2>  <h5 style={{margin:'0px'}}> coins </h5>
                </div>
                
                // <Badge color="secondary" badgeContent={totalCoins} max={100} style={styles.coinIcon}>
                //     <MonetizationOnIcon />
                // </Badge>
            )
        }
        return null;
    }
}

const styles ={
    coinIcon: {
        height: 100,
        width: 100
    }
}