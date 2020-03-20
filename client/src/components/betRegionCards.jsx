import React from 'react';
// Material
import {Paper} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Container, Row, Col } from 'react-bootstrap/';
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
                if(mode === 'find'){
                    buttonText = 'See Bets in this Region';
                }else{
                    buttonText = 'Select Region'
                }
                for(var i = 0; i < display_num_regions && i < betRegions.length; i++){
                    var newCard = <Paper elevation={3} key={betRegions[i]._id} id={betRegions[i]._id} style={styles.regionCards}>
                        <Container>
                            <Row>
                            <Col xs={8}>
                            <Container>
                                <Row>
                                    <Col>
                                        <h3>{betRegions[i].region_name}</h3>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h6>Number of Bets: {betRegions[i].num_bets}</h6>
                                    </Col>
                                    <Col>
                                        <h6>Description:</h6>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button onClick={this.handleClick.bind(this, betRegions[i]._id)}>{buttonText}</Button>
                                    </Col>
                                </Row>
                            </Container>
                            </Col>
                            <Col>
                                <DisplayMap 
                                    miniMap={true} 
                                    regionDetails={betRegions[i]}
                                />
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
    },
}