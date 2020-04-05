// React
import React from 'react';
// Material
import {Paper} from '@material-ui/core';
// Componentes
import BetCard from '../Bet_Display_Components/betCard';

export default class LocationBetCardInfo extends React.Component{
    render(){
        const {data, index} = this.props;
        return(
            <BetCard data={data} index={index} />
        )
    }
}