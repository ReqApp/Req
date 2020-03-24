// React
import React, { Component } from 'react';
// Rechart
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
  } from 'recharts';
// Bootstrap
import {Container, Row, Col} from 'react-bootstrap';
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
import Divider from '@material-ui/core/Divider';
import PeopleIcon from '@material-ui/icons/People';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PersonIcon from '@material-ui/icons/Person';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';


export default class currentBetInfo extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }

    displayBet = (bet) => {
        if(!isNaN(bet.betValue)){
            let data = [
                { name : 'For', For : bet.forBetTotal},
                { name : 'Against', Against : bet.againstBetTotal}
            ];
            return(
                <div>
                    <BarChart
                        width={300}
                        height={250}
                        data={data}
                        margin={{
                        top: 20, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="For" stackId="a" fill="#8884d8" />
                        <Bar dataKey="Against" stackId="a" fill="#8884d8" />
                    </BarChart>
                </div>
            )
        }else{
            let data = [
                { place : 'First', Cut : bet.betsTotal * bet.firstPlaceCut},
                { place : 'Second', Cut : bet.betsTotal * bet.secondPlaceCut},
                { place : 'Third', Cut : bet.betsTotal * bet.thirdPlaceCut}
            ];
            return(
                <div>
                    <RadarChart outerRadius={80} height={200} width={300} data={data}>
                        <PolarGrid gridType='circle'/>
                        <PolarAngleAxis dataKey="place" />
                        <PolarRadiusAxis angle={30}/>
                        <Radar name="Cuts" dataKey="Cut" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
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
            <ExpansionPanelDetails>
            <div>
                <Row>
                    <Col>
                        <List component="nav">
                            <ListItem>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Participants: " + data.numberOfBettors}/>
                            </ListItem>
                            <ListItem>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Your Bet: " + data.userAmount}/>
                            </ListItem>
                            <ListItem>
                            <ListItemIcon>
                                <MonetizationOnIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Total Sum: "  + data.betsTotal} />
                            </ListItem>
                        </List>
                </Col>
                <Col>
                    {this.displayBet(data)}
                </Col>
            </Row>
            </div>
        </ExpansionPanelDetails>
        </ExpansionPanel>
        )
    }
}

const styles = {
    deadline: {
        marginTop: '5px'
    }
}