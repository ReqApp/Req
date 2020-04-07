// React
import React from 'react';
// Material
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Button} from '@material-ui/core';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
// Stripe
import StripeCheckout from "react-stripe-checkout";

export default class BuyCoins extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            product: {
                numCoins: 100
            },
            inTransaction: false
        }
    }

    handleCancel = () => {
        this.props.close();
    }

    handleBuy = (token) => {
        const {product} = this.state;
        fetch('http://ec2-107-23-251-248.compute-1.amazonaws.com:9000/payments/checkout', {
            method: 'POST',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                product
            })
          })
          .then(res => res.json())
          .then(res => {
              if(res.status === 'success'){
                  console.log("Payment success!")
              }
          })
          .catch(err => {
              console.log(err);
          })
    }

    handleInputChange = (evt) => {
        if(!isNaN(evt.target.value)){
            if(parseInt(evt.target.value) > 0){
                this.setState({product : { numCoins : evt.target.value}});
            }
        }
    }

    hideDialog = () => {
        this.setState({inTransaction : true});
    }

    showDialog = () => {
        this.setState({inTransaction : false});
    }

    render(){
        const {product, inTransaction} = this.state;
        const {open} = this.props;
        let display = null;
        if(inTransaction){
            display = hide;
        }else{
            display = show;
        }

        return(
            <Dialog open={open} style={display}>
                <DialogTitle>
                    Buy Coins
                </DialogTitle>
                <DialogContent>
                <InputLabel htmlFor="input-with-icon-adornment">Coin Amount</InputLabel>
                    <Input
                    id="input-with-icon-adornment"
                    onChange={this.handleInputChange}
                    value={product.numCoins}
                    startAdornment={
                        <InputAdornment position="start">
                            <MonetizationOnIcon />
                        </InputAdornment>
                    }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel}>Cancel</Button>
                    <StripeCheckout
                        stripeKey="pk_test_FZyWUFF7INMSs4Tq6QwUiL2f00Xz9GEdY4"
                        token={this.handleBuy}
                        amount={product.price * 100}
                        name="Tesla Roadster"
                        billingAddress
                        shippingAddress
                        opened={this.hideDialog}
                        closed={this.showDialog}
                    />
                </DialogActions>
            </Dialog>
        )
    }
}

const hide = {display : 'none'}

const show = {display : 'block'}