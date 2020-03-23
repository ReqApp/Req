// React
import React from 'react';
// Material
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
//import Container from '@material-ui/core/Container';
// Bootstrap
import {Container, Row, Col} from 'react-bootstrap';
// Components
import UserWinLoss from './userWinLoss';
import PeopleReached from './peopleReached';
import PlacedBetData from './placedBetData';
import CreatedBetData from './createdBetData';

// Graph to show total number of wins and total number of losses
// Graph to show people reached and number of bets made
// Graph to show gains/losses over time for other bets
// Graph to show gains/losses over time for their own bets

export default class Graphs extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <Container>
        <Row>
          <Col>
            <PlacedBetData />
          </Col>
          <Col>
            <CreatedBetData />
          </Col>
        </Row>
        <Row>
          <Col>
            <UserWinLoss />
          </Col>
          <Col>
            <PeopleReached />
          </Col>
        </Row>
      </Container>
    )
  }
}