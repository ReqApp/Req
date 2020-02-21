import React, {createRef, Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DisplayMap from'./maps';

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

export default function Bets(){
    return(
        <div>
            <BettingCard name={"Example Bet One"}/>
            <BettingCard name={"Example Bet Two"}/>
            <BettingCard name={"Example Bet Three"}/>
        </div>
    )
}
  
function BettingCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
        <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
            {props.name}
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
