import React, {createRef, Component} from 'react';
import ReactDOM from 'react-dom';
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './index.css';
import DisplayMap from'./maps.js';

class Bet extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: "Bet: " + this.props.num
    }
  }
  render(){
    return(
      <div>{this.state.name}</div>
    )
  }
}


const useStyles = makeStyles({
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
});

export default function SimpleCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Example Bet: 1  
        </Typography>
        <Typography variant="h5" component="h2">
          Location: NUIG
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Will it rain tomorrow?
        </Typography>
        <DisplayMap/>
      </CardContent>
      <CardActions>
        <Button size="small">Yes</Button>
        <Button size="small">No</Button>
      </CardActions>
    </Card>
  );
}


ReactDOM.render(
    <SimpleCard />,
    document.getElementById('root')
)
/*
import App from './App';
import * as serviceWorker from './serviceWorker';
*/

//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
