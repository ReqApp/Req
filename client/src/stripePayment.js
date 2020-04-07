import React from "react";
import StripeCheckout from "react-stripe-checkout";
import {Container, Row, Col} from 'react-bootstrap';

import axios from "axios";
import { toast } from "react-toastify";
import Navbar from './components/Page_Components/navbar';

import "react-toastify/dist/ReactToastify.css";

import ReqBackground from './images/reqBackground4.jpg'


toast.configure();

export default function App() {
  const [product] = React.useState({
    name: "Req coins",
    price: 0.50,
    description: "Cool car"
  });

  async function handleToken(token, addresses) {
    const response = await axios.post(
      "http://ec2-107-23-251-248.compute-1.amazonaws.com:9000/payments/checkout",
      { token, product }
    );
    const { status } = response.data;
    console.log("Response:", response.data);
    if (status === "success") {
      toast("Success! Check email for details", { type: "success" });
    } else {
      toast("Something went wrong", { type: "error" });
    }
  }

  return (
    <div style={styles.backing}>
      <Navbar />
      <Container style={styles.con}>
        <Row>
          <Col>
          <div className="product">
              <p style={styles.mainText}>Go big or go home </p>
            </div>
          </Col>
          </Row>
        <Row>
          <Col  style={{marginTop:'3vh'}}>
        <div className="product">
          <img src="https://i.imgur.com/wQOvBeH.png"
          alt="A coin"
          width="350vh"
          />
              <p style={styles.mainText}>1,000 coins</p>
              <p style={styles.infoText}>€{product.price}</p>
              <StripeCheckout
              stripeKey="pk_test_reKQ7QkpyIw6VDK6yrax2a8t00ppAH2ob9"
              token={handleToken}
              amount={product.price * 100}
              name="1,000 coins"
              billingAddress
              shippingAddress
            />
            </div>
          </Col>

          <Col style={{marginTop:'3vh'}}>

        <div className="product">
          <img src="https://i.imgur.com/6i2bmc0.png"
          alt="a stack of coins"
          width="350vh"
          />  
              <p style={styles.mainText}>10,000 coins</p>
              <p style={styles.infoText}>€1</p>
              <StripeCheckout
              stripeKey="pk_test_reKQ7QkpyIw6VDK6yrax2a8t00ppAH2ob9"
              token={handleToken}
              amount={product.price * 100}
              name="10,000 coins"
              billingAddress
              shippingAddress
            />
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <p style={styles.bottomText}> Powered by <a href="https://stripe.com/ie"> Stripe </a></p>
          </Col>
        </Row>

          </Container>
    </div>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);

const styles = {
      con: {
        height: '100vh',
        marginTop: '80px',
        justifyContent: 'center',
        textAlign: 'center'
    },
    backing: {
      backgroundImage:`url(${ReqBackground})`,
      backgroundPosition: 'center',
      height:'100%'
  },
  mainText: {
      fontWeight: 'bold',
      fontSize: '5vh'
  },
  infoText: {
      fontSize: '3vh'
  },
  bottomText: {
    fontize: '1vh',
    paddingTop: '4vh',
    color: '#828282'
  }
}
