import React from 'react';
// Material
import {Paper, Button} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col } from 'react-bootstrap/';
//Components
import DisplayMap from './maps';
// Other
import matchSorter from 'match-sorter';

// Renders card for each available region
export default class BetRegionCards extends React.Component{
    constructor(props){
        super(props);
        this.scrollRefs = [];
    }

    highlightBetRegion(id){
        this.props.onRegionHover(id);
    }

    handleClick(id){
        this.props.onSelection(id);
    }

    render(){
        let {loadingRegions, betRegions, sort, mode} = this.props;
        let searchFlag = false;
        // If regions are loaded display cards
        if(!loadingRegions){
            var regionCards = [];
            const display_num_regions = 20;
            if(sort === "popular"){
                betRegions.sort((a, b) => {return a.num_bets - b.num_bets});
                betRegions.reverse();
            }
            else if(sort ==='closest'){
                betRegions.sort((a, b) => {return a.distanceFromUser - b.distanceFromUser});
                // betRegions.forEach(element => {
                //     console.log(element.region_name);
                //     console.log(element.distanceFromUser);
                // });
            }
            else{
                betRegions = matchSorter(betRegions, sort, { keys: ['region_name']});
                searchFlag = true;
            }
            if(Array.isArray(betRegions) && betRegions.length){
                let buttonText = '';
                let description = '';
                if(mode === 'find'){
                    buttonText = 'See Bets in Region';
                }else{
                    buttonText = 'Select Region'
                }
                for(var i = 0; i < display_num_regions && i < betRegions.length; i++){
                    if(betRegions[i].description === '' || betRegions[i].description == null){
                        description = 'No description';
                    }
                    else{
                        description = betRegions[i].description;
                    }
                    var newCard = <Paper elevation={3} key={betRegions[i]._id} id={betRegions[i]._id} style={styles.regionCards}>
                        <Container>
                            <Row>
                            <Col xs={12} md={8}>
                            <Container>
                                <Row>
                                    <Col xs={12} md={4}>
                                        <h3>{betRegions[i].region_name}</h3>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={4}>
                                        <h6>Number of Bets: {betRegions[i].num_bets}</h6>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <h6>Description:</h6>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={4}>
                                        <h6>Distance: {betRegions[i].distanceFromUser}m</h6>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        {description}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={4}>
                                        <Button onClick={this.handleClick.bind(this, betRegions[i]._id)} variant='contained' style={{marginTop: '40px'}}>{buttonText}</Button>
                                    </Col>
                                </Row>
                            </Container>
                            </Col>
                            <Col>
                            <Paper>
                                <DisplayMap 
                                    miniMap={true} 
                                    regionDetails={betRegions[i]}
                                    height='200px'
                                />
                            </Paper>
                            </Col>
                            </Row>
                        </Container>
                    </Paper>
                    regionCards.push(newCard);
                }
                return (
                    <div>
                        {regionCards}
                    </div>
                )
            }else{
                if(searchFlag){
                    return(
                        <Paper style={styles.regionCards, styles.info}>
                            <h3>Could not find any matching bet regions</h3>
                        </Paper>
                    )
                }else{
                    return (
                        <Paper style={styles.regionCards, styles.info}>
                            <h3>Looks like you are not in any betting regions right now</h3>
                        </Paper>
                    )
                }
            }
        }else{
            return(
                <Paper style={styles.regionCards, styles.info}>
                    <h3>Loading Regions...</h3>
                    <CircularProgress />
                </Paper>
            )
        }
    }
}

const styles = {
    regionCards: {
        padding: '20px',
        marginTop: '20px'
        /*background: #FBF9F9 !important;*/
    }, 
    info: {
        textAlign: 'center',
        marginTop: '30px',
        height: '100px',
        paddingTop: '30px'
    },
}