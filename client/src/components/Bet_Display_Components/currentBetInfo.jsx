// React
import React, { Component } from 'react';
// Rechart
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
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
import Divider from '@material-ui/core/Divider';


export default class CurrentBetInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
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
            console.log(data);
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
    
    render() {
        const {data} = this.props
        let betDate = new Date(data.deadline * 1000);
        let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}/${betDate.getFullYear()}`;
        let timeString = `${betDate.getHours()}:${betDate.getMinutes()}`;
        return (
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
                        <h4>{data.title}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Typography>
                            Deadline: {dateString} @ {timeString}
                        </Typography>
                    </Col>
                </Row>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={styles.details}>
            <div>
                <Row>
                    <Col>
                        <List component="nav">
                            <ListSubheader>
                                Bet Stats:
                            </ListSubheader>
                            <ListItem>
                            <ListItemIcon>
                                <PersonIcon style={styles.icon}/>
                            </ListItemIcon>
                            <ListItemText primary={"Your Bet: " + data.userAmount}/>
                            </ListItem>
                            <ListItem>
                            <ListItemIcon>
                                <PeopleIcon style={styles.icon}/>
                            </ListItemIcon>
                            <ListItemText primary={"Participants: " + data.numberOfBettors}/>
                            </ListItem>
                            <ListItem>
                            <ListItemIcon>
                                <MonetizationOnIcon style={styles.icon}/>
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
            </div>
        </ExpansionPanelDetails>
        </ExpansionPanel>
        )
    }
}

const styles = {
    icon: {
        color: '#008E9B',
    },
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