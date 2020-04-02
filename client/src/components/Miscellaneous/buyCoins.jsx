// React
import React from 'react';
// Material
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Button} from '@material-ui/core';
// Stripe
import StripeCheckout from "react-stripe-checkout";

export default class BuyCoins extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            product: {
                name : "Tesla Roadster",
                price: 64998.67,
                description: "Cool car"
            },
            inTransaction: false
        }
    }

    handleCancel = () => {
        this.props.close();
    }

    handleBuy = (token) => {
        const {product} = this.state;
        fetch('http://localhost:9000/payments/checkout', {
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
                <div className="container">
                    <div className="product">
                        <h1>{product.name}</h1>
                        <h3>On Sale · ${product.price}</h3>
                    </div>

                    </div>
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