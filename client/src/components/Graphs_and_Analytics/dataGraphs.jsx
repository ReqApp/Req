// React
import React from 'react';
// Bootstrap
import {Container, Row, Col} from 'react-bootstrap';
// Components
import UserWinLoss from './userWinLoss';
import PlacedBetData from './placedBetData';
import CreatedBetData from './createdBetData';
import BetBreakdown from './polarArea';

// Graph to show total number of wins and total number of losses
// Graph to show people reached and number of bets made
// Graph to show gains/losses over time for other bets
// Graph to show gains/losses over time for their own bets

export default class Graphs extends React.Component{

  render(){
    const {user} = this.props;
    return(
      <Container style={styles.container}>
        <Row>
          <Col lg={6} md={12} xs={12}>
            <PlacedBetData user={user}/>
          </Col>
          <Col lg={6} md={12} xs={12}>
            <CreatedBetData user={user}/>
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={12} xs={12}>
            <UserWinLoss user={user}/>
          </Col>
          <Col lg={6} md={12} xs={12}>
            <BetBreakdown user={user}/>
          </Col>
        </Row>
      </Container>
    )
  }
}

const styles = {
  container: {
    marginTop: '20px'
  }
}