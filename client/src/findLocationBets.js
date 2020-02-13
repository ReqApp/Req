import React, {createRef, Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import DisplayMap from'./maps.js';
import { Paper } from '@material-ui/core';

class FindBetPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            useStyles : makeStyles(theme => ({
                root: {
                flexGrow: 1,
                },
                paper: {
                padding: theme.spacing(2),
                textAlign: 'center',
                color: theme.palette.text.secondary,
                },
            }))
        }
    }   
    render(){
        return(
            // Create grid for parts
            <div className={this.state.useStyles.root}>
                <Grid container spacing = {3}>
                    <Grid item xs={12}>
                        <Paper className={this.state.useStyles.paper}>Find Bets Near You</Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={this.state.useStyles.paper}><DisplayMap /></Paper>
                        { /* Get betting map */ }

                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={this.state.useStyles.paper}><BetRegionCards /></Paper>
                        {/* Generate betting cards */ }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

class BetRegionCards extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            useStyles : makeStyles({
                root: {
                  minWidth: 275,
                },
                bullet: {
                  display: 'inline-block',
                  margin: '0 2px',
                  transform: 'scale(0.8)',
                },
                title: {
                  fontSize: 14,
                },
                pos: {
                  marginBottom: 12,
                },
            }),
            loadingRegions : true,
            betRegions: null
        }
    }

    componentDidMount(){
        fetch("http://localhost:9000/getBettingRegions?lat=53.28211&lng=-9.062186").then(regions => regions.json()).then(regions => this.setState({loadingRegions : false, betRegions : regions})).catch(err => err);
    }

    render(){
        const {loadingRegions, betRegions} = this.state;
        if(!loadingRegions){
            var regionCards = [];
            if(Array.isArray(betRegions) && betRegions.length){
                for(var i = 0; i < betRegions.length; i++){
                    regionCards.push(betRegionCard(betRegions[i]));
                }
                return (
                    <div>{regionCards}</div>
                )
            }else{
                return (
                    <Card><CardContent>There are no bet regions in your area</CardContent></Card>
                )
            }
        }else{
            return(
                <Card className={this.state.useStyles.root}>
                    <CardContent>
                        Loading Regions
                </CardContent>
                </Card>
            )
        }
    }
}

function betRegionCard(region){
    return(
        <Card key={region._id}>
            <CardContent>{region.region_name}</CardContent>
            <Button>Select</Button>
        </Card>
    )
}

export default FindBetPage;