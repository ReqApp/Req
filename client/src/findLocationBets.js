import React, {createRef, Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DisplayMap from'./maps.js';
import {Paper} from '@material-ui/core';
import { CardHeader } from '@material-ui/core';

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
            })),
            menuStyles : makeStyles(theme => ({
                root: {
                    flexGrow: 1,
                },
                menuButton: {
                    marginRight: theme.spacing(2),
                },
                title: {
                    flexGrow: 1,
                },
                })),
            betRegions : null,
            loadingRegions : true,
            shownRegion : null,
        }
        this.handleRegionHover = this.handleRegionHover.bind(this);
    }

    componentDidMount(){
        fetch("http://localhost:9000/getBettingRegions?lat=53.28211&lng=-9.062186").then(regions => regions.json()).then(regions => this.setState({loadingRegions : false, betRegions : regions})).catch(err => err);
    }

    handleRegionHover(id){
        this.setState({shownRegion : id});
        console.log(id);
    }

    render(){
        return(
            // Create grid for parts
            <div className={this.state.useStyles.root}>
                <Grid container spacing = {3}>
                    <Grid item xs={12}>
                        <AppBar position="static">
                            <Toolbar>
                                <IconButton edge="start" className={this.state.menuStyles.menuButton} color="inherit" aria-label="menu">
                                <MenuIcon />
                                </IconButton>
                                <Typography variant="h6" className={this.state.menuStyles.title}>
                                    Find Bets Near You
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={this.state.useStyles.paper}><DisplayMap shownRegion={this.state.shownRegion}/></Paper>
                        { /* Get betting map */ }

                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={this.state.useStyles.paper}><BetRegionCards onRegionHover={this.handleRegionHover} loadingRegions={this.state.loadingRegions} betRegions={this.state.betRegions}/></Paper>
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
        }
        //this.highlightBetRegion = this.highlightBetRegion.bind(this);
    }
    highlightBetRegion(id){
        this.props.onRegionHover(id);
    }

    render(){
        const {loadingRegions, betRegions} = this.props;

        if(!loadingRegions){
            var regionCards = [];
            if(Array.isArray(betRegions) && betRegions.length){
                for(var i = 0; i < betRegions.length; i++){
                    regionCards.push(<Card key={betRegions[i]._id} onMouseOver={this.highlightBetRegion.bind(this, betRegions[i]._id)}>
                        <CardHeader title={betRegions[i].region_name} subheader={"Number of Bets: " + betRegions[i].num_bets}/>
                        <CardContent>
                        </CardContent>
                        <Button>Select Region</Button>
                    </Card>);
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
/*
function betRegionCard(region){
    return(
        <Card key={region._id} onMouseOver={this.highlightBetRegion}>
            <CardHeader title={region.region_name} subheader={"Number of Bets: " + region.num_bets}/>
            <CardContent>
            </CardContent>
            <Button>Select Region</Button>
        </Card>
    )
}
*/

export default FindBetPage;