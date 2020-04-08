// React
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
// Rechart
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  } from 'recharts';
// Bootstrap
import {Row, Col} from 'react-bootstrap';
// Material
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PersonIcon from '@material-ui/icons/Person';
import { ListSubheader } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {Paper} from '@material-ui/core';
// Components
import DecideBetDialog from '../Bet_Creation_Components/decideBetDialog';
import DisplayMap from '../Location_Betting_Components/maps';


export default class CurrentBetInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            openDecideBetDialog: false,
            redirectToProfile : false,
            locationData: null,
            cutBreakdownChart: {
                height: 0,
                width: 0,
                radius: 0
            },
            sidesChart: {
                height: 0,
                width: 0,
                radius: 0
            }
        }
    }

    componentDidMount() {
        const {data} = this.props;
        if(data.locationID && data.locationID !== ''){
            fetch(`http://localhost:9000/getLocationBetById?id=${data.locationID}`, {
                method : 'GET',
                credentials : 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(res => {
                if(res.status === 'success'){
                    this.setState({locationData : res.body});
                }else{
                    console.log(res);
                }
            })
            .catch(err => {
                console.log(err)
            })
        }


        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        let cut = {
            height: 200,
            width: 300,
            radius: 80
        };
        let sides = {
            height: 200,
            width: 250,
        }
        if(window.innerWidth < 400){
            cut.height = 150;
            cut.width = 200;
            cut.radius = 50;

            sides.width = 200
        }
        this.setState({cutBreakdownChart : cut, sidesChart : sides});
    }

    displayBet = (bet) => {
        const {cutBreakdownChart, sidesChart} = this.state;
        // For Binary Bet
        if(bet.type === 'binary'){
            let data = [
                { name : 'For', For : bet.numberFor},
                { name : 'Against', Against : bet.numberAgainst}
            ];
            return(
                <div>
                    <BarChart
                        width={sidesChart.width}
                        height={sidesChart.height}
                        data={data}
                        maxBarSize={60}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="For" stackId="a" fill="#4CAC54" />
                        <Bar dataKey="Against" stackId="a" fill="#F44434" />
                    </BarChart>
                </div>
            )
        }
        // Multi Bet
        else{
            let data = [
                { place : 'First', Cut : bet.firstPlaceCut * 100},
                { place : 'Second', Cut :  bet.secondPlaceCut * 100},
                { place : 'Third', Cut : bet.thirdPlaceCut * 100}
            ];
            return(
                <div>
                    <RadarChart outerRadius={cutBreakdownChart.radius} height={cutBreakdownChart.height} width={cutBreakdownChart.width} data={data} style={styles.chart}>
                        <PolarGrid gridType={"polygon"} />
                        <PolarAngleAxis dataKey="place" />
                        <Radar name="Cuts" dataKey="Cut" stroke="#008E9B" fill="#008E9B" fillOpacity={0.6} />
                    </RadarChart>
                </div>
            )
        }
    }

    handleRedirectToProfile = () => {
        this.setState({redirectToProfile : true});
    }

    handleDecideBet = () => {
        this.setState({openDecideBetDialog : true});
    }
    
    handleCloseDecideBet = () => {
        this.setState({openDecideBetDialog : false});
    }

    render() {
        const {redirectToProfile, openDecideBetDialog, locationData} = this.state;
        const {data, userCreated} = this.props
        let betDate = new Date(data.deadline * 1000);
        let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}/${betDate.getFullYear()}`;
        let minutes = betDate.getMinutes().toString();
        if(minutes.length == 1){
            minutes = '0' + minutes;
        }
        let timeString = `${betDate.getHours()}:${minutes}`;
        let deadlineRepresentation = (
            <Typography style={{marginTop: '5px'}}>
                Deadline: {dateString} @ {timeString}
            </Typography>
        );
        
        if(redirectToProfile){
            return(
                <Redirect to={`/users/profile?${data.username}`} push />
            )
        }
        if(userCreated){
            if((Date.now()/ 1000) <= data.deadline){
                deadlineRepresentation = (
                    <Button startIcon={<HourglassEmptyIcon /> } onClick={this.handleDecideBet}>Decide Bet</Button>
                )
            }
        }
        return (
            <div>
            <DecideBetDialog open={openDecideBetDialog} data={data} close={this.handleCloseDecideBet} />
            <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={styles.summary}
            >
            <div>
                <Row>
                    <Col>
                        <h4>{data.title} {data.locationID !== '' ? <LocationOnIcon /> : null}</h4>
                    </Col>
                </Row>
                {userCreated ? null : 
                    <Row>
                        <Col>
                            <Typography>
                                Created By: <Link component='button' onClick={this.handleRedirectToProfile}>{data.username}</Link>
                            </Typography>
                        </Col>
                    </Row>
                }
                <Row>
                    <Col>
                        {deadlineRepresentation}
                    </Col>
                </Row>
            </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={styles.details}>
            <div>
                {locationData ? <Row><Col><Typography>Bet Location: {locationData.location_name}</Typography></Col></Row> : null}
                <Row>
                    <Col>
                        <List component="nav">
                            <ListSubheader>
                                Bet Stats:
                            </ListSubheader>
                            {userCreated ?  <div></div> : 
                                <ListItem>
                                <ListItemIcon>
                                    <PersonIcon style={styles.icon}/>
                                </ListItemIcon>
                                <ListItemText primary={"Your Bet: " + data.userAmount}/>
                                </ListItem>
                            }
                            <ListItem>
                            <ListItemIcon>
                                <PeopleIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Participants: " + data.numberOfBettors}/>
                            </ListItem>
                            <ListItem>
                            <ListItemIcon>
                                <MonetizationOnIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                Total Sum: {data.type === 'multi' ? data.betsTotal : data.forBetTotal + data.againstBetTotal}
                            </ListItemText>
                            </ListItem>
                        </List>
                </Col>
                <Col>
                    <Row>
                        <Col>
                            <List>
                                <ListSubheader style={styles.cutTitle}>
                                    {data.type === 'multi' ? "Cut Breakdown:" : "Sides:"}
                                </ListSubheader>
                            </List>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {this.displayBet(data)}
                        </Col>
                    </Row>   
                </Col>
            </Row>
            {locationData ? <Row><Col><Paper><DisplayMap miniMap={true} regionDetails={locationData} height='200px' /></Paper></Col></Row> : null}
            </div>
        </ExpansionPanelDetails>
        </ExpansionPanel>
        </div>
        )
    }
}
//
const styles = {
    chart: {
        display: 'block',
        marginRight : 'auto',
        marginLeft: 'auto',
        paddingTop: '0px',
    },
    details: {
        paddingTop: '0px'
    },
    summary: {
        paddingBottom: '0px'
    },
    cutTitle: {
        paddingLeft: '20px'
    }
}